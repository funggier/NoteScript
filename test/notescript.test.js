import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { parseSong } from "../src/parser.js";
import { loadSoundPack } from "../src/sound/pack.js";
import { listSoundAddons } from "../src/sound/resolver.js";
import { loadInstrumentAddon, listInstrumentAddons } from "../src/instrument/addon.js";
import { parseSfzFile, selectSfzRegions, sfzPitchRatio } from "../src/instrument/sfz.js";
import { renderToWav, renderToWavBuffer } from "../src/renderer.js";
import { buildSingleTrackMidiBuffer } from "../src/midi.js";
import { compileTimeline } from "../src/timeline.js";
import { generateBeatLane6Chart, BEATLANE6_KEYS } from "../src/game/beatlane6.js";
import { getFluidSynthCapabilities } from "../src/instrument/fluidsynth.js";
import { buildFluidSynthLiveArgs, FluidSynthLiveSession } from "../src/playback/fluidsynth-live.js";
import { LivePlaybackManager } from "../src/playback/manager.js";
import { createControlService } from "../src/control/service.js";
import { loadNetworkConfig, resolveProgramRoot, studioUrl } from "../src/control/network-config.js";
import { decodeAudioFile, getDecoderCapabilities } from "../src/audio/decoder.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const songFile = path.join(root, "examples", "evening-walk.md");
const beatLaneStarterFile = path.join(root, "examples", "beatlane6-starter.md");

test("parses the example song", () => {
  const song = parseSong(fs.readFileSync(songFile, "utf8"));
  assert.equal(song.title, "Evening Walk");
  assert.equal(song.config.tempo, 82);
  assert.equal(song.tracks.length, 2);
  assert.equal(song.tracks[0].sound, "piano");
  assert.equal(song.tracks[0].bars.length, 8);
});

test("loads pitched and SoundPad sound add-ons", () => {
  const piano = loadSoundPack(path.join(root, "examples", "sounds", "soundpiano", "piano"));
  const soundPad = loadSoundPack(path.join(root, "examples", "sounds", "soundpad", "soundpad"));
  assert.equal(piano.type, "pitched");
  assert.equal(piano.samples.size, 5);
  assert.equal(soundPad.type, "soundpad");
  assert.equal(soundPad.triggers.size, 16);
  for (const trigger of [
    "kick", "snare", "clap", "closed-hat", "open-hat", "shaker",
    "tom-low", "tom-high", "rim", "cowbell", "crash", "ride",
    "chime", "click", "laser", "impact"
  ]) {
    assert.equal(soundPad.triggers.has(trigger), true, "missing SoundPad trigger: " + trigger);
  }

  for (const id of [
    "electric-piano", "music-box", "organ", "synth-bass",
    "synth-lead", "warm-pad", "pluck"
  ]) {
    const pack = loadSoundPack(path.join(root, "examples", "sounds", "soundpiano", id));
    assert.equal(pack.type, "pitched", id + " should be pitched");
    assert.equal(pack.samples.size, 5, id + " should expose five root samples");
    assert.equal(pack.license, "MIT");
  }

  const legacyDir = fs.mkdtempSync(path.join(os.tmpdir(), "notescript-legacy-soundpad-"));
  fs.copyFileSync(
    path.join(root, "examples", "sounds", "soundpad", "soundpad", "kick.wav"),
    path.join(legacyDir, "kick.wav")
  );
  fs.writeFileSync(
    path.join(legacyDir, "pack.md"),
    [
      "# Legacy SoundPad",
      "",
      "```notescript-sound",
      "name: Legacy SoundPad",
      "type: kit",
      "trigger kick = kick.wav",
      "```"
    ].join("\n")
  );
  assert.equal(loadSoundPack(legacyDir).type, "soundpad");

  const discovered = listSoundAddons([path.join(root, "examples", "sounds")]);
  assert.equal(discovered.length, 9);
  assert.equal(discovered.find((item) => item.name === "piano")?.category, "soundpiano");
  assert.equal(discovered.find((item) => item.name === "soundpad")?.category, "soundpad");

  const categoryRoot = fs.mkdtempSync(path.join(os.tmpdir(), "notescript-sound-categories-"));
  const forcedPad = path.join(categoryRoot, "soundpad", "forced-pad");
  const forcedPiano = path.join(categoryRoot, "soundpiano", "forced-piano");
  fs.mkdirSync(forcedPad, { recursive: true });
  fs.mkdirSync(forcedPiano, { recursive: true });
  fs.copyFileSync(
    path.join(root, "examples", "sounds", "soundpad", "soundpad", "kick.wav"),
    path.join(forcedPad, "kick.wav")
  );
  fs.copyFileSync(
    path.join(root, "examples", "sounds", "soundpiano", "piano", "C4.wav"),
    path.join(forcedPiano, "C4.wav")
  );
  fs.writeFileSync(
    path.join(forcedPad, "pack.md"),
    [
      "# Forced Pad",
      "",
      "```notescript-sound",
      "name: Forced Pad",
      "type: pitched",
      "trigger kick = kick.wav",
      "```"
    ].join("\n")
  );
  fs.writeFileSync(
    path.join(forcedPiano, "pack.md"),
    [
      "# Forced Piano",
      "",
      "```notescript-sound",
      "name: Forced Piano",
      "type: soundpad",
      "sample C4 = C4.wav",
      "```"
    ].join("\n")
  );
  assert.equal(loadSoundPack(forcedPad).type, "soundpad");
  assert.equal(loadSoundPack(forcedPiano).type, "pitched");
});

test("validates format-grouped instrument add-ons", () => {
  const dir = path.join(root, "examples", "instruments", "SFZ", "basic-sfz");
  const addon = loadInstrumentAddon(dir);
  assert.equal(addon.id, "SFZ/basic-sfz");
  assert.equal(addon.format, "SFZ");

  const found = listInstrumentAddons([path.join(root, "examples", "instruments")]);
  assert.ok(found.some((item) => item.id === "SFZ/basic-sfz"));
});

test("parses and selects the first SFZ adapter regions", () => {
  const sfz = parseSfzFile(path.join(root, "examples", "instruments", "SFZ", "basic-sfz", "basic.sfz"));
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

test("renders an in-memory WAV preview without writing a file", () => {
  const song = parseSong(fs.readFileSync(songFile, "utf8"));
  const rendered = renderToWavBuffer(song, songFile);
  assert.equal(rendered.buffer.toString("ascii", 0, 4), "RIFF");
  assert.ok(rendered.buffer.length > 44);
  assert.equal(rendered.report.sampleRate, 44100);
  assert.ok(rendered.report.durationSeconds > 1);
});

test("renders a NoteScript project through the SFZ instrument adapter", () => {
  const file = path.join(root, "examples", "sfz-basic.md");
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "notescript-sfz-render-"));
  const out = path.join(dir, "sfz.wav");
  const song = parseSong(fs.readFileSync(file, "utf8"));
  const report = renderToWav(song, file, out);
  assert.ok(fs.statSync(out).size > 44);
  assert.equal(report.sampleRate, 44100);
  assert.equal(fs.readFileSync(out).toString("ascii", 0, 4), "RIFF");
});

test("generates deterministic BeatLane6 charts from the canonical timeline", () => {
  const song = parseSong(fs.readFileSync(songFile, "utf8"));
  const timeline = compileTimeline(song);
  const normal = generateBeatLane6Chart(timeline, { difficulty: "normal" });
  const normalAgain = generateBeatLane6Chart(timeline, { difficulty: "normal" });
  const easy = generateBeatLane6Chart(timeline, { difficulty: "easy" });
  const hard = generateBeatLane6Chart(timeline, { difficulty: "hard" });

  assert.equal(normal.game, "BeatLane6");
  assert.equal(normal.laneCount, 6);
  assert.deepEqual(normal.lanes.map((lane) => lane.key), BEATLANE6_KEYS);
  assert.ok(normal.events.length > 0);
  assert.ok(normal.stats.holdCount > 0);
  assert.deepEqual(normal, normalAgain);
  assert.ok(easy.events.length <= normal.events.length);
  assert.ok(normal.events.length <= hard.events.length);

  for (const event of normal.events) {
    assert.ok(event.lane >= 0 && event.lane < 6);
    assert.equal(event.key, BEATLANE6_KEYS[event.lane]);
    assert.ok(event.timeSeconds >= 0);
    assert.ok(event.durationSeconds > 0);
  }

  const starterSong = parseSong(fs.readFileSync(beatLaneStarterFile, "utf8"));
  const starter = generateBeatLane6Chart(compileTimeline(starterSong), { difficulty: "normal" });
  assert.equal(starter.title, "BeatLane6 Starter");
  assert.deepEqual(
    [...new Set(starter.events.map((event) => event.lane))].sort((a, b) => a - b),
    [0, 1, 2, 3, 4, 5]
  );
  assert.deepEqual(
    starter.events.slice(0, 6).map((event) => event.label),
    ["A", "S", "D", "J", "K", "L"]
  );
  assert.ok(starter.stats.tapCount > starter.stats.holdCount);

  const laneAtTime = new Set();
  for (const event of normal.events) {
    const key = event.timeSeconds.toFixed(6) + ":" + event.lane;
    assert.equal(laneAtTime.has(key), false, "same lane should not receive simultaneous notes");
    laneAtTime.add(key);
  }
});

test("builds format-0 MIDI for isolated instrument rendering", () => {
  const file = path.join(root, "examples", "sfz-basic.md");
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
    path.join(root, "examples", "sounds", "soundpiano", "piano", "C4.wav")
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

  const decoded = decodeAudioFile(path.join(root, "examples", "sounds", "soundpiano", "piano", "C4.wav"));
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
  const source = path.join(root, "examples", "sounds", "soundpiano", "piano", "C4.wav");
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

test("network host and port come from one network.json file", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "notescript-network-"));
  fs.mkdirSync(path.join(dir, "config"), { recursive: true });
  fs.writeFileSync(
    path.join(dir, "config", "network.json"),
    JSON.stringify({ host: "0.0.0.0", port: 20555 }, null, 2)
  );

  const nested = path.join(dir, "app", "src", "control");
  fs.mkdirSync(nested, { recursive: true });
  assert.equal(resolveProgramRoot(nested), dir);

  const config = loadNetworkConfig(dir);
  assert.equal(config.host, "0.0.0.0");
  assert.equal(config.port, 20555);
  assert.equal(studioUrl(config), "http://127.0.0.1:20555/");

  fs.writeFileSync(
    path.join(dir, "config", "network.json"),
    JSON.stringify({ host: "192.168.1.25", port: 20556 }, null, 2)
  );
  const lan = loadNetworkConfig(dir);
  assert.equal(studioUrl(lan), "http://192.168.1.25:20556/");

  fs.writeFileSync(
    path.join(dir, "config", "network.json"),
    JSON.stringify({ host: "127.0.0.1", port: 70000 }, null, 2)
  );
  assert.throws(() => loadNetworkConfig(dir), /1 to 65535/);
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

test("control service supports Studio project CRUD, analysis and settings", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "notescript-studio-"));
  const service = createControlService(dir);
  const markdown = fs.readFileSync(songFile, "utf8");

  const analysis = service.analyzeMarkdown(markdown);
  assert.equal(analysis.valid, true);
  assert.equal(analysis.song.tracks.length, 2);
  assert.ok(analysis.timeline.endQuarter > 0);

  const invalid = service.analyzeMarkdown("# Broken");
  assert.equal(invalid.valid, false);
  assert.ok(invalid.diagnostics.length >= 1);

  const saved = service.saveProject("Studio Test", markdown);
  assert.equal(saved.name, "Studio Test.md");

  const project = service.getProject("Studio Test.md");
  assert.equal(project.name, "Studio Test.md");
  assert.equal(project.valid, true);
  assert.equal(project.markdown, markdown);

  const renamed = service.renameProject("Studio Test.md", "Studio Renamed");
  assert.equal(renamed.name, "Studio Renamed.md");
  assert.deepEqual(service.listProjects(), ["Studio Renamed.md"]);

  const defaults = service.getStudioSettings();
  assert.equal("workspaceMode" in defaults, false);
  assert.equal(defaults.version, 4);
  assert.equal(defaults.editorMode, "text");
  assert.equal(defaults.hotkeys.note0, "a");
  assert.deepEqual(defaults.soundPadMixLocks, {});

  const settings = service.saveStudioSettings({
    workspaceMode: "advanced",
    editorMode: "node",
    hotkeys: {
      note0: "q",
      panic: "Escape"
    }
  });
  assert.equal("workspaceMode" in settings, false);
  assert.equal(settings.version, 4);
  assert.equal(settings.editorMode, "node");
  assert.equal(settings.hotkeys.note0, "q");
  assert.equal(service.getStudioSettings().hotkeys.note0, "q");

  const soundPadSettings = service.saveStudioSettings({
    soundPadHotkeys: {
      soundpad: {
        kick: "1",
        shaker: "2"
      }
    },
    soundPadVolumes: {
      soundpad: {
        kick: 1,
        shaker: 0.45
      }
    },
    soundPadMixLocks: {
      soundpad: true
    }
  });
  assert.equal(soundPadSettings.soundPadHotkeys.soundpad.kick, "1");
  assert.equal(soundPadSettings.soundPadHotkeys.soundpad.shaker, "2");
  assert.equal(soundPadSettings.soundPadVolumes.soundpad.kick, 1);
  assert.equal(soundPadSettings.soundPadVolumes.soundpad.shaker, 0.45);
  assert.equal(soundPadSettings.soundPadMixLocks.soundpad, true);
  assert.equal(service.getStudioSettings().soundPadHotkeys.soundpad.kick, "1");
  assert.equal(service.getStudioSettings().soundPadVolumes.soundpad.shaker, 0.45);
  assert.equal(service.getStudioSettings().soundPadMixLocks.soundpad, true);

  const unlockedMix = service.saveStudioSettings({
    soundPadMixLocks: {
      soundpad: false
    }
  });
  assert.equal(unlockedMix.soundPadMixLocks.soundpad, false);
  assert.equal(service.getStudioSettings().soundPadMixLocks.soundpad, false);

  const clampedMix = service.saveStudioSettings({
    soundPadVolumes: {
      soundpad: {
        kick: 1.5,
        shaker: -0.2
      }
    }
  });
  assert.equal(clampedMix.soundPadVolumes.soundpad.kick, 1);
  assert.equal(clampedMix.soundPadVolumes.soundpad.shaker, 0);

  const deleted = service.deleteProject("Studio Renamed.md");
  assert.equal(deleted.deleted, "Studio Renamed.md");
  assert.deepEqual(service.listProjects(), []);
});

test("control service caches project transport preview audio", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "notescript-transport-"));
  fs.mkdirSync(path.join(dir, "projects"), { recursive: true });
  fs.cpSync(path.join(root, "examples", "sounds"), path.join(dir, "sounds"), {
    recursive: true,
    force: true
  });
  fs.cpSync(path.join(root, "examples", "instruments"), path.join(dir, "instruments"), {
    recursive: true,
    force: true
  });
  fs.copyFileSync(songFile, path.join(dir, "projects", "Evening Walk.md"));

  const projectFile = path.join(dir, "projects", "Evening Walk.md");
  const sourceBeforeOverride = fs.readFileSync(projectFile, "utf8");
  const service = createControlService(dir);
  const first = service.getTransportPreview("Evening Walk.md");
  const second = service.getTransportPreview("Evening Walk.md");
  const electric = service.getTransportPreview(
    "Evening Walk.md",
    { type: "sound", id: "electric-piano" }
  );
  const electricCached = service.getTransportPreview(
    "Evening Walk.md",
    { type: "sound", id: "electric-piano" }
  );
  const sfzOverride = service.getTransportPreview(
    "Evening Walk.md",
    { type: "instrument", id: "SFZ/basic-sfz" }
  );
  const stem0 = service.getTransportTrackPreview("Evening Walk.md", 0);
  const stem0Cached = service.getTransportTrackPreview("Evening Walk.md", 0);
  const stem1 = service.getTransportTrackPreview("Evening Walk.md", 1);
  const importedStem0 = service.getMarkdownTrackPreview(
    sourceBeforeOverride,
    0,
    "Imported Tracks.md"
  );
  const importedMix = service.getMarkdownMixAudio(
    sourceBeforeOverride,
    "Imported Tracks.md",
    []
  );
  const importedMixMuted = service.getMarkdownMixAudio(
    sourceBeforeOverride,
    "Imported Tracks.md",
    [0]
  );
  const importedTrackSet = service.getMarkdownTrackSetZip(
    sourceBeforeOverride,
    "Imported Tracks.md",
    [0]
  );

  assert.equal(first.buffer.toString("ascii", 0, 4), "RIFF");
  assert.strictEqual(first, second);
  assert.equal(first.project, "Evening Walk.md");
  assert.ok(first.durationSeconds > 1);
  assert.equal(electric.buffer.toString("ascii", 0, 4), "RIFF");
  assert.strictEqual(electric, electricCached);
  assert.notDeepEqual(electric.buffer, first.buffer);
  assert.equal(sfzOverride.buffer.toString("ascii", 0, 4), "RIFF");
  assert.notDeepEqual(sfzOverride.buffer, first.buffer);
  assert.equal(fs.readFileSync(projectFile, "utf8"), sourceBeforeOverride);
  const downloadAudio = service.getProjectRenderAudio("Evening Walk.md");
  assert.equal(downloadAudio.buffer.toString("ascii", 0, 4), "RIFF");
  assert.ok(downloadAudio.buffer.length > 44);
  assert.equal(fs.readFileSync(projectFile, "utf8"), sourceBeforeOverride);
  assert.equal(stem0.buffer.toString("ascii", 0, 4), "RIFF");
  assert.equal(stem1.buffer.toString("ascii", 0, 4), "RIFF");
  assert.equal(importedStem0.buffer.toString("ascii", 0, 4), "RIFF");
  assert.equal(importedStem0.project, "Imported Tracks.md");
  assert.equal(importedStem0.trackIndex, 0);
  assert.equal(importedMix.buffer.toString("ascii", 0, 4), "RIFF");
  assert.equal(importedMixMuted.buffer.toString("ascii", 0, 4), "RIFF");
  assert.notDeepEqual(importedMix.buffer, importedMixMuted.buffer);
  assert.deepEqual(importedMixMuted.mutedTracks, [0]);
  assert.equal(importedTrackSet.buffer.toString("ascii", 0, 2), "PK");
  assert.equal(importedTrackSet.tracks, 2);
  assert.deepEqual(importedTrackSet.mutedTracks, [0]);
  const zipText = importedTrackSet.buffer.toString("utf8");
  assert.match(zipText, /Imported Tracks\/Imported Tracks\.md/);
  assert.match(zipText, /Imported Tracks\/mix\/Imported Tracks Mix\.wav/);
  assert.match(zipText, /Imported Tracks\/tracks\/01 - /);
  assert.match(zipText, /Imported Tracks\/tracks\/02 - /);
  assert.match(zipText, /Imported Tracks\/track-set\.json/);
  assert.match(zipText, /"mutedInMix": true/);
  assert.strictEqual(stem0, stem0Cached);
  assert.equal(stem0.trackIndex, 0);
  assert.equal(stem1.trackIndex, 1);
  assert.equal(stem0.durationSeconds, first.durationSeconds);
  assert.equal(stem1.durationSeconds, first.durationSeconds);
  assert.notDeepEqual(stem0.buffer, stem1.buffer);
  assert.throws(
    () => service.getTransportTrackPreview("Evening Walk.md", 99),
    /Track index is outside/
  );

  service.clearTransportCache("Evening Walk.md");
  const third = service.getTransportPreview("Evening Walk.md");
  const stem0AfterClear = service.getTransportTrackPreview("Evening Walk.md", 0);
  assert.notStrictEqual(first, third);
  assert.notStrictEqual(stem0, stem0AfterClear);
  assert.equal(third.buffer.toString("ascii", 0, 4), "RIFF");
  assert.equal(stem0AfterClear.buffer.toString("ascii", 0, 4), "RIFF");
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
  fs.mkdirSync(path.join(dir, "projects"), { recursive: true });
  fs.copyFileSync(
    path.join(root, "examples", "evening-walk.md"),
    path.join(dir, "projects", "Evening Walk.md")
  );

  const service = createControlService(dir);
  const gameChart = service.getBeatLane6Chart("Evening Walk.md", "normal");
  assert.equal(gameChart.game, "BeatLane6");
  assert.equal(gameChart.laneCount, 6);
  assert.ok(gameChart.events.length > 0);

  const sounds = service.listPortableSoundsDetailed();
  const piano = sounds.find((item) => item.id === "piano");
  const soundPad = sounds.find((item) => item.id === "soundpad");

  assert.ok(piano);
  assert.equal(piano.type, "pitched");
  assert.ok(piano.samples.some((sample) => sample.note === "C4"));

  assert.ok(soundPad);
  assert.equal(soundPad.triggers.length, 16);
  assert.ok(soundPad.triggers.includes("kick"));
  assert.ok(soundPad.triggers.includes("impact"));

  for (const id of [
    "piano", "electric-piano", "music-box", "organ", "synth-bass",
    "synth-lead", "warm-pad", "pluck", "soundpad"
  ]) {
    assert.ok(sounds.some((item) => item.id === id), "missing production sound: " + id);
  }

  const audio = service.getAuditionAudio("piano", { note: 60 });
  assert.equal(audio.buffer.toString("ascii", 0, 4), "RIFF");
  assert.ok(audio.buffer.length > 44);

  for (const id of [
    "electric-piano", "music-box", "organ", "synth-bass",
    "synth-lead", "warm-pad", "pluck"
  ]) {
    const audition = service.getAuditionAudio(id, { note: 60 });
    assert.equal(audition.buffer.toString("ascii", 0, 4), "RIFF", id + " audition should be WAV");
    assert.ok(audition.buffer.length > 44);
  }

  for (const trigger of ["kick", "snare", "crash", "chime", "laser", "impact"]) {
    const audition = service.getAuditionAudio("soundpad", { trigger });
    assert.equal(audition.buffer.toString("ascii", 0, 4), "RIFF", trigger + " should be WAV");
    assert.ok(audition.buffer.length > 44);
  }

  const instruments = service.listInstruments();
  const sfz = instruments.find((item) => item.id === "SFZ/basic-sfz");
  assert.ok(sfz);
  assert.equal(sfz.playable, true);

  const instrumentAudio = service.getInstrumentAuditionAudio("SFZ/basic-sfz", 64, 96);
  assert.equal(instrumentAudio.buffer.toString("ascii", 0, 4), "RIFF");
  assert.ok(instrumentAudio.buffer.length > 44);
});

test("Studio UI exposes unified tabs, independent Tracks and remappable hotkeys", () => {
  for (const file of ["index.html", "style.css", "app.js"]) {
    const full = path.join(root, "src", "control", "ui", file);
    assert.equal(fs.existsSync(full), true, full + " should exist");
    assert.ok(fs.statSync(full).size > 100);
  }

  const html = fs.readFileSync(path.join(root, "src", "control", "ui", "index.html"), "utf8");
  const app = fs.readFileSync(path.join(root, "src", "control", "ui", "app.js"), "utf8");
  const css = fs.readFileSync(path.join(root, "src", "control", "ui", "style.css"), "utf8");
  assert.match(html, /data-tab="play"/);
  assert.match(html, /data-tab="project"/);
  assert.match(html, /data-tab="compose"/);
  assert.match(html, /data-tab="tracks"/);
  assert.match(html, /data-tab="sounds"/);
  assert.match(html, /data-tab="settings"/);
  assert.match(html, /data-compose-mode="text"/);
  assert.match(html, /data-compose-mode="form"/);
  assert.match(html, /data-compose-mode="node"/);
  assert.match(html, /id="markdownEditor"/);
  assert.match(html, /id="nodeCanvas"/);
  assert.match(html, /id="nodeInspectorApply"/);
  assert.match(html, /id="nodeInspectorValue"/);
  assert.match(html, /id="trackTimeline"/);
  assert.match(html, /id="tracksFileInput"/);
  assert.match(html, /id="tracksAddTrack"/);
  assert.doesNotMatch(html, /id="tracksSaveProject"/);
  assert.match(html, /id="tracksDownloadMd"/);
  assert.match(html, /id="tracksOutputName"/);
  assert.match(html, /id="tracksDownloadMix"/);
  assert.match(html, /id="tracksDownloadSet"/);
  assert.match(html, /id="tracksFileInput"/);
  assert.doesNotMatch(app, /syncTracksFromStudio/);
  assert.doesNotMatch(app, /syncStudioFromTracksWorkspace/);
  assert.doesNotMatch(app, /saveTracksProject/);
  assert.match(app, /downloadTracksStem/);
  assert.match(app, /downloadTracksMix/);
  assert.match(app, /downloadTracksSet/);
  assert.match(app, /\/v1\/tracks\/track-audio/);
  assert.match(app, /\/v1\/tracks\/mix-audio/);
  assert.match(app, /\/v1\/tracks\/set-zip/);
  assert.match(html, /id="advancedPlay"/);
  assert.match(html, /id="advancedPause"/);
  assert.match(html, /id="advancedStop"/);
  assert.match(app, /track-source-type-select/);
  assert.match(app, /track-voice-select/);
  assert.match(app, /track-volume-control/);
  assert.match(app, /setAdvancedTrackVolume/);
  assert.match(app, /track-mute/);
  assert.match(html, /id="hotkeyEditor"/);
  assert.match(html, /PERFORMANCE MODE/);
  assert.match(html, /id="pianoHotkeyEdit"/);
  assert.match(html, /id="pianoHotkeyPanel"/);
  assert.match(html, /id="pianoHotkeySave"/);
  assert.match(html, /id="pianoHotkeyCancel"/);
  assert.match(html, /id="soundPadHotkeyEdit"/);
  assert.match(html, /id="soundPadHotkeyPanel"/);
  assert.match(html, /id="soundPadHotkeySave"/);
  assert.match(html, /id="soundPadHotkeyCancel"/);
  assert.match(html, /id="soundPadMixLock"/);
  assert.match(html, /id="soundPadResetMix"/);
  assert.match(html, /id="playSourceType"/);
  assert.match(html, /value="soundpiano">SoundPiano/);
  assert.match(html, /value="soundpad">SoundPad/);
  assert.match(html, /value="gamebeatlane6">GameBeatLane6/);
  assert.doesNotMatch(html, /id="livePlayMode"/);
  assert.doesNotMatch(html, /id="beatLanePlayMode"/);
  assert.match(html, /id="beatLaneView"/);
  assert.match(html, /id="beatLaneHighway"/);
  assert.match(html, /id="beatLaneProject"/);
  assert.match(html, /id="beatLaneDifficulty"/);
  assert.match(html, /id="beatLaneStart"/);
  assert.match(html, /id="beatLaneResult"/);
  assert.match(html, /A S D/);
  assert.match(html, /J K L/);
  assert.match(html, /class="pan-scale"/);
  assert.match(html, /left speaker to right speaker/);
  assert.match(html, /id="soundPads"/);
  assert.match(html, /class="piano game-piano"/);
  assert.match(html, /id="panic"/);
  assert.match(html, /id="enableMidi"/);
  assert.match(html, /id="transportPlay"/);
  assert.match(html, /id="transportSeek"/);
  assert.match(html, /id="transportVoiceSelect"/);
  assert.match(html, /id="transportLoad"[^>]*>Reload</);
  assert.match(html, /id="outputDevice"/);
  assert.doesNotMatch(html, /id="transportSaveWav"/);
  assert.match(html, /id="composeTrackSelect"/);
  assert.match(html, /id="composeSourceType"/);
  assert.match(html, /id="composeVoiceSelect"/);
  assert.match(html, /id="composeTrackVolume"/);
  assert.match(html, /id="composeTrackVolumeValue"/);
  assert.match(html, /id="composeApplyVoice"[^>]*>Apply Track</);
  assert.match(html, /id="renderOutputName"/);
  assert.match(html, /id="renderProject"[^>]*>Download WAV</);
  assert.doesNotMatch(html, /id="advancedRender"/);
  assert.doesNotMatch(html, /id="workspaceModeSetting"/);
  assert.match(html, /All Studio tabs are available together as one complete workspace/);
  assert.match(app, /\/v1\/transport\/audio/);
  assert.match(app, /\/v1\/tracks\/track-audio/);
  assert.match(app, /\/v1\/tracks\/mix-audio/);
  assert.match(app, /downloadTracksStem/);
  assert.match(app, /downloadTracksMix/);
  assert.match(app, /downloadTracksMarkdown/);
  assert.match(app, /loadTracksWorkspaceFile/);
  assert.match(app, /addTrackToTracksWorkspace/);
  assert.match(app, /updateTracksWorkspaceSource/);
  assert.match(app, /updateTracksWorkspaceVolume/);
  assert.match(app, /INSTRUMENT \/ VOICE|INSTRUMENT \/ SOUND/);
  assert.match(app, /toggleAdvancedTrackMute/);
  assert.match(app, /gain\.gain\.setValueAtTime/);
  assert.match(app, /createStereoPanner/);
  assert.match(app, /setSinkId/);
  assert.match(app, /\/v1\/live\/select/);
  assert.match(app, /\/v1\/live\/note-on/);
  assert.match(app, /\/v1\/live\/all-notes-off/);
  assert.match(app, /requestMIDIAccess/);
  assert.match(app, /\/v1\/project\?project=/);
  assert.match(app, /\/v1\/analyze/);
  assert.match(app, /\/v1\/render\/audio/);
  assert.match(app, /applyComposeVoice/);
  assert.match(app, /sourceTypesForTrack/);
  assert.match(app, /fillTrackSourceTypeSelect/);
  assert.match(app, /fillSourceItemSelect/);
  assert.match(app, /updateTrackSettingsInMarkdown/);
  assert.match(app, /updateTrackVolumeInMarkdown/);
  assert.match(app, /updateTrackSourceInMarkdown/);
  assert.doesNotMatch(app, /Edit this track in Compose/);
  assert.match(app, /Preview voice changed\. Press Reload before Play/);
  assert.match(app, /\/v1\/game\/beatlane6\/chart/);
  assert.match(app, /BEATLANE6_INPUT_KEYS/);
  assert.match(app, /beatLaneAnimationTick/);
  assert.match(app, /beatLaneJudgementForDelta/);
  assert.match(app, /startBeatLaneGame/);
  assert.match(app, /state\.audioContext\.currentTime|context\.currentTime/);
  assert.match(app, /\/v1\/studio\/settings/);
  assert.match(app, /updatePianoHotkeyCaps/);
  assert.match(app, /beginPianoHotkeyEdit/);
  assert.match(app, /selectPianoHotkeyAction/);
  assert.match(app, /savePianoHotkeys/);
  assert.match(app, /cancelPianoHotkeyEdit/);
  assert.match(app, /beginSoundPadHotkeyEdit/);
  assert.match(app, /selectSoundPadHotkeyTrigger/);
  assert.match(app, /soundPadHotkeys/);
  assert.match(app, /soundPadVolumes/);
  assert.match(app, /soundPadVolume/);
  assert.match(app, /soundPadMixLocked/);
  assert.match(app, /hasOwnProperty\.call\(locks, pack\.id\)[\s\S]*?: true;/);
  assert.match(app, /toggleSoundPadMixLock/);
  assert.match(app, /resetSoundPadMix/);
  assert.match(app, /transportPanLabel/);
  assert.match(app, /Left .*Right|Left |Right /);
  assert.match(app, /soundpad-hotkey-editing/);
  assert.match(app, /hotkeyEditSnapshot/);
  assert.match(app, /piano-hotkey-editing/);
  assert.match(app, /renderTrackTimeline/);
  assert.match(app, /renderNodeCanvas/);
  assert.match(app, /applyNodeInspector/);
  assert.match(app, /Node updated in Markdown/);
  assert.match(css, /\.key \.note-label\s*\{[^}]*left:\s*0;[^}]*right:\s*0;/s);
  assert.match(css, /\.pad-hotkey/);
  assert.match(css, /\.pad-volume/);
  assert.match(css, /\.pad-mixer/);
  assert.match(css, /\.mix-locked/);
  assert.match(css, /#soundPadMixLock\.active[\s\S]*?box-shadow:\s*none;/);
  assert.match(css, /\.deck-button:disabled[\s\S]*?box-shadow:\s*none;/);
  assert.match(css, /#transportPan\s*\{[^}]*direction:\s*ltr;/s);
  assert.match(css, /\.beatlane-highway/);
  assert.match(css, /\.beatlane-note/);
  assert.match(css, /\.beatlane-hit-line/);
  assert.match(css, /\.beatlane-result/);
  assert.match(css, /\.compose-volume-control/);
  assert.match(css, /\.track-source-type-control/);
  assert.match(css, /\.track-volume-control/);
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
