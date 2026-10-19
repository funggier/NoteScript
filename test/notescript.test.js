import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseSong } from "../src/parser.js";
import { loadSoundPack } from "../src/sound/pack.js";
import { loadInstrumentAddon, listInstrumentAddons } from "../src/instrument/addon.js";
import { renderToWav } from "../src/renderer.js";
import { createControlService } from "../src/control/service.js";

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

test("renders deterministic WAV output", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "notescript-"));
  const out = path.join(dir, "song.wav");
  const song = parseSong(fs.readFileSync(songFile, "utf8"));
  const report = renderToWav(song, songFile, out);
  assert.ok(fs.statSync(out).size > 44);
  assert.equal(report.sampleRate, 44100);
  assert.equal(fs.readFileSync(out).toString("ascii", 0, 4), "RIFF");
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
