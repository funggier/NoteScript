import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { parseSong } from "../src/parser.js";
import { loadSoundPack } from "../src/sound/pack.js";
import { loadInstrumentAddon, listInstrumentAddons } from "../src/instrument/addon.js";
import { parseSfzFile, selectSfzRegions, sfzPitchRatio } from "../src/instrument/sfz.js";
import { renderToWav } from "../src/renderer.js";
import { buildSingleTrackMidiBuffer } from "../src/midi.js";
import { compileTimeline } from "../src/timeline.js";
import { getFluidSynthCapabilities } from "../src/instrument/fluidsynth.js";
import { buildFluidSynthLiveArgs, FluidSynthLiveSession } from "../src/playback/fluidsynth-live.js";
import { LivePlaybackManager } from "../src/playback/manager.js";
import { createControlService } from "../src/control/service.js";
import { decodeAudioFile, getDecoderCapabilities } from "../src/audio/decoder.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const songFile = path.join(root, "examples", "evening-walk.md");

test("parses the example song", () => {
  const song = parseSong(fs.readFileSync(songFile, "utf8"));
  assert.equal(song.title, "Evening Walk");
  assert.equal(song.config.tempo, 82);
  assert.equal(song.tracks.length, 2);
  assert.equal(song.tracks[0].sound, "demo-piano");
  assert.equal(song.tracks[0].bars.length, 8);
});

test("loads pitched and kit sound add-ons", () => {
  const piano = loadSoundPack(path.join(root, "examples", "sounds", "demo-piano"));
  const kit = loadSoundPack(path.join(root, "examples", "sounds", "demo-kit"));
  assert.equal(piano.type, "pitched");
  assert.equal(piano.samples.size, 5);
  assert.equal(kit.type, "kit");
  assert.equal(kit.triggers.size, 2);
});

test("validates format-grouped instrument add-ons", () => {
  const dir = path.join(root, "examples", "instruments", "SFZ", "demo-sfz");
  const addon = loadInstrumentAddon(dir);
  assert.equal(addon.id, "SFZ/demo-sfz");
  assert.equal(addon.format, "SFZ");

  const found = listInstrumentAddons([path.join(root, "examples", "instruments")]);
  assert.ok(found.some((item) => item.id === "SFZ/demo-sfz"));
});

test("parses and selects the first SFZ adapter regions", () => {
  const sfz = parseSfzFile(path.join(root, "examples", "instruments", "SFZ", "demo-sfz", "demo.sfz"));
  assert.equal(sfz.regionCount, 1);
  const regions = selectSfzRegions(sfz, 72, 96);
  assert.equal(regions.length, 1);
  assert.equal(regions[0].rootNote, 60);
  assert.ok(Math.abs(sfzPitchRatio(regions[0], 72) - 2) < 1e-9);
});

test("renders deterministic WAV output", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "notescript-"));
  const out = path.join(dir, "song.wav");
  const song = parseSong(fs.readFileSync(songFile, "utf8"));
  const report = renderToWav(song, songFile, out);
  assert.ok(fs.statSync(out).size > 44);
  assert.equal(report.sampleRate, 44100);
  assert.equal(fs.readFileSync(out).toString("ascii", 0, 4), "RIFF");
});

test("renders a NoteScript project through the SFZ instrument adapter", () => {
  const file = path.join(root, "examples", "sfz-demo.md");
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "notescript-sfz-render-"));
  const out = path.join(dir, "sfz.wav");
  const song = parseSong(fs.readFileSync(file, "utf8"));
  const report = renderToWav(song, file, out);
  assert.ok(fs.statSync(out).size > 44);
  assert.equal(report.sampleRate, 44100);
  assert.equal(fs.readFileSync(out).toString("ascii", 0, 4), "RIFF");
});

test("builds format-0 MIDI for isolated instrument rendering", () => {
  const file = path.join(root, "examples", "sfz-demo.md");
  const song = parseSong(fs.readFileSync(file, "utf8"));
  const timeline = compileTimeline(song);
  const midi = buildSingleTrackMidiBuffer(song.config, timeline.tracks[0], {
    bank: 0,
    preset: 0
  });

  assert.equal(midi.toString("ascii", 0, 4), "MThd");
  assert.equal(midi.readUInt16BE(8), 0);
  assert.equal(midi.readUInt16BE(10), 1);
  assert.equal(midi.readUInt16BE(12), song.config.ppq);
  assert.ok(midi.includes(Buffer.from("MTrk")));
});

test("SoundFont capability follows optional FluidSynth backend availability", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "notescript-soundfont-capability-"));
  const addonDir = path.join(dir, "instruments", "SF2", "FakeSoundFont");
  fs.mkdirSync(addonDir, { recursive: true });
  fs.writeFileSync(path.join(addonDir, "fake.sf2"), Buffer.from("not-a-real-soundfont"));
  const fence = String.fromCharCode(96).repeat(3);
  fs.writeFileSync(
    path.join(addonDir, "instrument.md"),
    [
      "# Fake SoundFont",
      "",
      fence + "notescript-instrument",
      "name: Fake SoundFont",
      "format: SF2",
      "entry: fake.sf2",
      fence
    ].join("\n"),
    "utf8"
  );

  const service = createControlService(dir);
  const backend = getFluidSynthCapabilities(dir);
  const item = service.listInstruments().find((entry) => entry.id === "SF2/FakeSoundFont");
  assert.ok(item);
  assert.equal(item.playable, backend.available);
  assert.equal(service.capabilities().instruments.SF2.render, backend.available);
  assert.equal(service.capabilities().livePlayback.soundfont, backend.available);
  assert.equal(service.capabilities().livePlayback.noteOnOff, backend.available);
});

test("builds persistent FluidSynth live arguments without fast-render output", () => {
  const addon = {
    id: "SF2/Test",
    format: "SF2",
    entryPath: path.join(root, "fake.sf2")
  };
  const args = buildFluidSynthLiveArgs(addon, {
    sampleRate: 48000,
    gain: 0.5,
    audioDriver: "wasapi"
  });

  assert.ok(args.includes("-n"));
  assert.ok(args.includes("-q"));
  assert.ok(args.includes("wasapi"));
  assert.ok(args.includes("48000"));
  assert.ok(args.includes("0.5"));
  assert.equal(args.includes("-F"), false);
  assert.equal(args.at(-1), addon.entryPath);
});

test("live playback session rejects note commands before startup", () => {
  const session = new FluidSynthLiveSession({
    id: "SF2/Test",
    name: "Test",
    format: "SF2",
    entryPath: path.join(root, "fake.sf2")
  });

  assert.throws(() => session.noteOn(60, 96), /not ready/);
  assert.throws(() => session.noteOff(60), /not ready/);
  assert.throws(() => session.sustain(true), /not ready/);
});

test("live playback manager stays idle and rejects unsupported persistent formats", async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "notescript-live-manager-"));
  const sfzDir = path.join(dir, "instruments", "SFZ", "Test");
  fs.mkdirSync(sfzDir, { recursive: true });
  fs.writeFileSync(path.join(sfzDir, "sample.wav"), fs.readFileSync(
    path.join(root, "examples", "sounds", "demo-piano", "C4.wav")
  ));
  fs.writeFileSync(path.join(sfzDir, "test.sfz"), "<region> sample=sample.wav key=60\n");
  const fence = String.fromCharCode(96).repeat(3);
  fs.writeFileSync(path.join(sfzDir, "instrument.md"), [
    "# Test",
    "",
    fence + "notescript-instrument",
    "name: Test",
    "format: SFZ",
    "entry: test.sfz",
    fence
  ].join("\n"));

  const manager = new LivePlaybackManager(dir);
  assert.equal(manager.status().state, "idle");
  await assert.rejects(
    manager.selectInstrument("SFZ/Test"),
    /currently targets SF2\/SF3/
  );
  assert.equal(manager.status().state, "idle");
});

test("decoder abstraction always exposes native PCM16 WAV", () => {
  const caps = getDecoderCapabilities();
  assert.equal(caps.native.wavPcm16, true);

  const decoded = decodeAudioFile(path.join(root, "examples", "sounds", "demo-piano", "C4.wav"));
  assert.equal(decoded.sampleRate, 44100);
  assert.ok(decoded.samples.length > 1000);
  assert.equal(decoded.decoder, "native-wav-pcm16");
});

test("FFmpeg adapter decodes FLAC when FFmpeg is available", (t) => {
  const caps = getDecoderCapabilities();
  if (!caps.ffmpeg.available) {
    t.skip("FFmpeg not available on this runner.");
    return;
  }

  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "notescript-flac-"));
  const source = path.join(root, "examples", "sounds", "demo-piano", "C4.wav");
  const flac = path.join(dir, "C4.flac");
  const encoded = spawnSync(caps.ffmpeg.command, ["-y", "-v", "error", "-i", source, flac], {
    windowsHide: true
  });
  assert.equal(encoded.status, 0);

  const decoded = decodeAudioFile(flac, { sampleRate: 44100 });
  assert.equal(decoded.decoder, "ffmpeg");
  assert.equal(decoded.sampleRate, 44100);
  assert.ok(decoded.samples.length > 1000);
});

test("control service saves and validates a project inside portable workspace", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "notescript-control-"));
  const service = createControlService(dir);
  const markdown = fs.readFileSync(songFile, "utf8");

  const saved = service.saveProject("Evening Test", markdown);
  assert.ok(saved.file.startsWith(path.join(dir, "projects")));
  assert.equal(saved.title, "Evening Walk");

  const validated = service.validateProject("Evening Test.md");
  assert.equal(validated.valid, true);
  assert.equal(validated.tracks, 2);
  assert.deepEqual(service.listProjects(), ["Evening Test.md"]);
});

test("control service exposes sound details and audition WAV", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "notescript-audition-"));
  fs.cpSync(path.join(root, "examples", "sounds"), path.join(dir, "sounds"), {
    recursive: true,
    force: true
  });
  fs.cpSync(path.join(root, "examples", "instruments"), path.join(dir, "instruments"), {
    recursive: true,
    force: true
  });

  const service = createControlService(dir);
  const sounds = service.listPortableSoundsDetailed();
  const piano = sounds.find((item) => item.id === "demo-piano");
  const kit = sounds.find((item) => item.id === "demo-kit");

  assert.ok(piano);
  assert.equal(piano.type, "pitched");
  assert.ok(piano.samples.some((sample) => sample.note === "C4"));

  assert.ok(kit);
  assert.ok(kit.triggers.includes("kick"));

  const audio = service.getAuditionAudio("demo-piano", { note: 60 });
  assert.equal(audio.buffer.toString("ascii", 0, 4), "RIFF");
  assert.ok(audio.buffer.length > 44);

  const instruments = service.listInstruments();
  const sfz = instruments.find((item) => item.id === "SFZ/demo-sfz");
  assert.ok(sfz);
  assert.equal(sfz.playable, true);

  const instrumentAudio = service.getInstrumentAuditionAudio("SFZ/demo-sfz", 64, 96);
  assert.equal(instrumentAudio.buffer.toString("ascii", 0, 4), "RIFF");
  assert.ok(instrumentAudio.buffer.length > 44);
});

test("audition UI assets expose live playback and Web MIDI controls", () => {
  for (const file of ["index.html", "style.css", "app.js"]) {
    const full = path.join(root, "src", "control", "ui", file);
    assert.equal(fs.existsSync(full), true, full + " should exist");
    assert.ok(fs.statSync(full).size > 100);
  }

  const html = fs.readFileSync(path.join(root, "src", "control", "ui", "index.html"), "utf8");
  const app = fs.readFileSync(path.join(root, "src", "control", "ui", "app.js"), "utf8");
  assert.match(html, /id="panic"/);
  assert.match(html, /id="enableMidi"/);
  assert.match(app, /\/v1\/live\/select/);
  assert.match(app, /\/v1\/live\/note-on/);
  assert.match(app, /\/v1\/live\/all-notes-off/);
  assert.match(app, /requestMIDIAccess/);
});

test("parser rejects a track with both sound and instrument sources", () => {
  const fence = String.fromCharCode(96).repeat(3);
  const markdown = [
    "# Invalid",
    "",
    fence + "notescript",
    "track Test",
    "sound: PackA",
    "instrument: SFZ/Piano",
    "bar 1: C4 q",
    fence
  ].join("\n");

  assert.throws(() => parseSong(markdown), /cannot declare both sound and instrument/);
});
