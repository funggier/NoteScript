#!/usr/bin/env node
// Import user-recorded Kazu Guitar strings without modifying the source files.
// Requires FFmpeg on PATH. Recorded pitches were measured before conversion.
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = path.resolve(process.argv[2] || "");
const output = path.join(root, "examples", "sounds", "soundpiano", "kazu-guitar");
const notes = [
  ["GR-01.wav", "D#2", 21],
  ["GR-02.wav", "G#2", -9],
  ["GR-03.wav", "C#3", -38],
  ["GR-04.wav", "F#3", -12],
  ["GR-05.wav", "A#3", 3],
  ["GR-06.wav", "D#4", -34]
];

if (!process.argv[2] || !fs.existsSync(source)) {
  console.error("Usage: node scripts/import-kazu-guitar.js <folder-containing-GR-01..GR-06.wav>");
  process.exit(2);
}
fs.mkdirSync(output, { recursive: true });
for (const [filename, pitch, cents] of notes) {
  const input = path.join(source, filename);
  if (!fs.existsSync(input)) throw new Error("Missing original recording: " + input);
  const target = path.join(output, filename);
  const sampleRate = Math.round(48000 * Math.pow(2, cents / 1200));
  const args = [
    "-hide_banner", "-loglevel", "error", "-nostdin", "-y", "-i", input,
    "-af", "aresample=48000,asetrate=" + sampleRate + ",aresample=48000",
    "-ar", "48000", "-ac", "2", "-c:a", "pcm_s16le", target
  ];
  const result = spawnSync("ffmpeg", args, { windowsHide: true, encoding: "utf8" });
  if (result.status !== 0) throw new Error("FFmpeg failed: " + filename + "\n" + result.stderr);
  const bytes = fs.statSync(target).size;
  console.log(filename + " => " + pitch + " (" + (cents > 0 ? "+" : "") + cents +
    " cents adjustment, 48kHz PCM16 stereo, " + bytes + " bytes)");
}
