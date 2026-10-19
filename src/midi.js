import fs from "node:fs";
import path from "node:path";
import { compileTimeline } from "./timeline.js";

function vlq(value) {
  let buffer = Math.max(0, Math.floor(value)) & 0x7f;
  const bytes = [];
  let working = Math.max(0, Math.floor(value));

  buffer = working & 0x7f;
  while ((working >>= 7)) {
    buffer <<= 8;
    buffer |= ((working & 0x7f) | 0x80);
  }

  while (true) {
    bytes.push(buffer & 0xff);
    if (buffer & 0x80) buffer >>= 8;
    else break;
  }
  return bytes;
}

function chunk(id, bytes) {
  const header = Buffer.alloc(8);
  header.write(id, 0);
  header.writeUInt32BE(bytes.length, 4);
  return Buffer.concat([header, Buffer.from(bytes)]);
}

function midiHeader(format, trackCount, ppq) {
  const header = Buffer.alloc(14);
  header.write("MThd", 0);
  header.writeUInt32BE(6, 4);
  header.writeUInt16BE(format, 8);
  header.writeUInt16BE(trackCount, 10);
  header.writeUInt16BE(ppq, 12);
  return header;
}

function tempoBytes(tempo) {
  const tempoUs = Math.round(60000000 / tempo);
  return [
    0x00, 0xff, 0x51, 0x03,
    (tempoUs >> 16) & 0xff,
    (tempoUs >> 8) & 0xff,
    tempoUs & 0xff
  ];
}

function buildNoteEvents(track, ppq, channel) {
  const events = [];
  for (const event of track.events) {
    if (event.kind !== "note") continue;
    const start = Math.round(event.startQuarter * ppq);
    const end = Math.round((event.startQuarter + event.durationQuarter) * ppq);
    events.push({
      tick: start,
      order: 1,
      bytes: [0x90 | (channel & 0x0f), event.note, event.velocity]
    });
    events.push({
      tick: end,
      order: 0,
      bytes: [0x80 | (channel & 0x0f), event.note, 0]
    });
  }
  events.sort((a, b) => a.tick - b.tick || a.order - b.order);
  return events;
}

function encodeAbsoluteEvents(events, startingTick = 0) {
  const bytes = [];
  let previous = startingTick;
  for (const event of events) {
    bytes.push(...vlq(event.tick - previous), ...event.bytes);
    previous = event.tick;
  }
  return { bytes, lastTick: previous };
}

export function buildSingleTrackMidiBuffer(config, track, options = {}) {
  const ppq = config.ppq || 480;
  const channel = Math.max(0, Math.min(15, options.channel ?? 0));
  const bank = Math.max(0, Math.min(16383, options.bank ?? 0));
  const preset = Math.max(0, Math.min(127, options.preset ?? 0));
  const bankMsb = (bank >> 7) & 0x7f;
  const bankLsb = bank & 0x7f;

  const bytes = [];
  bytes.push(...tempoBytes(config.tempo || 120));
  bytes.push(
    0x00, 0xb0 | channel, 0x00, bankMsb,
    0x00, 0xb0 | channel, 0x20, bankLsb,
    0x00, 0xc0 | channel, preset
  );

  const encoded = encodeAbsoluteEvents(buildNoteEvents(track, ppq, channel), 0);
  bytes.push(...encoded.bytes);
  bytes.push(0x00, 0xff, 0x2f, 0x00);

  return Buffer.concat([
    midiHeader(0, 1, ppq),
    chunk("MTrk", bytes)
  ]);
}

export function exportMidi(song, outputFile) {
  const timeline = compileTimeline(song);
  const ppq = song.config.ppq;
  const tempoTrack = [
    ...tempoBytes(song.config.tempo),
    0x00, 0xff, 0x2f, 0x00
  ];

  const tracks = [chunk("MTrk", tempoTrack)];
  let channel = 0;

  for (const track of timeline.tracks) {
    if (channel === 9) channel += 1;
    const encoded = encodeAbsoluteEvents(buildNoteEvents(track, ppq, channel), 0);
    const bytes = [...encoded.bytes, 0x00, 0xff, 0x2f, 0x00];
    tracks.push(chunk("MTrk", bytes));
    channel += 1;
  }

  const output = Buffer.concat([
    midiHeader(1, tracks.length, ppq),
    ...tracks
  ]);

  fs.mkdirSync(path.dirname(path.resolve(outputFile)), { recursive: true });
  fs.writeFileSync(outputFile, output);
  return path.resolve(outputFile);
}
