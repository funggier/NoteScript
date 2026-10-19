import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { encodeMonoPcm16 } from "../src/sound/wav.js";
import { noteToMidi } from "../src/music.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const rate = 44100;

function write(file, samples) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, encodeMonoPcm16(samples, rate));
}

function pitched(noteName, seconds = 2.4) {
  const midi = noteToMidi(noteName);
  const frequency = 440 * Math.pow(2, (midi - 69) / 12);
  const length = Math.floor(rate * seconds);
  const out = new Float32Array(length);
  for (let i = 0; i < length; i += 1) {
    const t = i / rate;
    const decay = Math.exp(-2.2 * t);
    out[i] = decay * (
      Math.sin(2 * Math.PI * frequency * t) * 0.62 +
      Math.sin(2 * Math.PI * frequency * 2 * t) * 0.22 +
      Math.sin(2 * Math.PI * frequency * 3 * t) * 0.10
    );
  }
  return out;
}

function kick(seconds = 0.45) {
  const length = Math.floor(rate * seconds);
  const out = new Float32Array(length);
  for (let i = 0; i < length; i += 1) {
    const t = i / rate;
    const freq = 120 * Math.exp(-7 * t) + 42;
    out[i] = Math.sin(2 * Math.PI * freq * t) * Math.exp(-10 * t) * 0.9;
  }
  return out;
}

function shaker(seconds = 0.16) {
  let state = 0x12345678;
  const length = Math.floor(rate * seconds);
  const out = new Float32Array(length);
  for (let i = 0; i < length; i += 1) {
    state = (1664525 * state + 1013904223) >>> 0;
    const noise = (state / 0xffffffff) * 2 - 1;
    const t = i / rate;
    out[i] = noise * Math.exp(-24 * t) * 0.28;
  }
  return out;
}

const pianoDir = path.join(root, "examples", "sounds", "demo-piano");
for (const note of ["C3", "C4", "E4", "G4", "C5"]) {
  write(path.join(pianoDir, note + ".wav"), pitched(note));
}

const kitDir = path.join(root, "examples", "sounds", "demo-kit");
write(path.join(kitDir, "kick.wav"), kick());
write(path.join(kitDir, "shaker.wav"), shaker());

console.log("Generated deterministic demo sound packs.");
