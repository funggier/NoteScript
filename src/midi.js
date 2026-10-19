import fs from "node:fs";
import path from "node:path";
import { compileTimeline } from "./timeline.js";

function vlq(value) {
  let buffer = value & 0x7f;
  const bytes = [];
  while ((value >>= 7)) {
    buffer <<= 8;
    buffer |= ((value & 0x7f) | 0x80);
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

export function exportMidi(song, outputFile) {
  const timeline = compileTimeline(song);
  const ppq = song.config.ppq;
  const tempoUs = Math.round(60000000 / song.config.tempo);
  const tempoTrack = [
    0x00, 0xff, 0x51, 0x03,
    (tempoUs >> 16) & 0xff, (tempoUs >> 8) & 0xff, tempoUs & 0xff,
    0x00, 0xff, 0x2f, 0x00
  ];

  const tracks = [chunk("MTrk", tempoTrack)];
  let channel = 0;

  for (const track of timeline.tracks) {
    if (channel === 9) channel += 1;
    const events = [];
    for (const event of track.events) {
      if (event.kind !== "note") continue;
      const start = Math.round(event.startQuarter * ppq);
      const end = Math.round((event.startQuarter + event.durationQuarter) * ppq);
      events.push({ tick: start, order: 1, bytes: [0x90 | (channel & 0x0f), event.note, event.velocity] });
      events.push({ tick: end, order: 0, bytes: [0x80 | (channel & 0x0f), event.note, 0] });
    }
    events.sort((a, b) => a.tick - b.tick || a.order - b.order);
    const bytes = [];
    let previous = 0;
    for (const event of events) {
      bytes.push(...vlq(event.tick - previous), ...event.bytes);
      previous = event.tick;
    }
    bytes.push(0x00, 0xff, 0x2f, 0x00);
    tracks.push(chunk("MTrk", bytes));
    channel += 1;
  }

  const header = Buffer.alloc(14);
  header.write("MThd", 0);
  header.writeUInt32BE(6, 4);
  header.writeUInt16BE(1, 8);
  header.writeUInt16BE(tracks.length, 10);
  header.writeUInt16BE(ppq, 12);

  fs.mkdirSync(path.dirname(path.resolve(outputFile)), { recursive: true });
  fs.writeFileSync(outputFile, Buffer.concat([header, ...tracks]));
  return path.resolve(outputFile);
}
