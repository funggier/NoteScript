import { NoteScriptError } from "./error.js";

const NATURAL = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
const DURATIONS = { w: 4, h: 2, q: 1, e: 0.5, s: 0.25 };

export function parseDuration(token, line) {
  const match = /^(w|h|q|e|s)(\.)?$/i.exec(token.trim());
  if (!match) {
    throw new NoteScriptError(
      `Invalid duration "${token}". Use w, h, q, e, s with optional dot.`,
      line
    );
  }
  const base = DURATIONS[match[1].toLowerCase()];
  return match[2] ? base * 1.5 : base;
}

export function noteToMidi(token, line) {
  const normalized = token.trim().replaceAll("♯", "#").replaceAll("♭", "b");
  const match = /^([A-Ga-g])([#b]?)(-?\d+)$/.exec(normalized);
  if (!match) {
    throw new NoteScriptError(
      `Invalid note "${token}". Expected C4, F#4, Bb3, etc.`,
      line
    );
  }

  let pitch = NATURAL[match[1].toUpperCase()];
  if (match[2] === "#") pitch += 1;
  if (match[2] === "b") pitch -= 1;
  const octave = Number.parseInt(match[3], 10);
  const midi = (octave + 1) * 12 + pitch;
  if (midi < 0 || midi > 127) {
    throw new NoteScriptError(`Note "${token}" is outside MIDI range 0-127.`, line);
  }
  return midi;
}

export function midiToNote(midi) {
  const names = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  const n = Math.max(0, Math.min(127, Math.round(midi)));
  return `${names[n % 12]}${Math.floor(n / 12) - 1}`;
}

export function barQuarterLength(numerator, denominator) {
  return numerator * (4 / denominator);
}

export function parseInteger(raw, name, min, max, line) {
  if (!/^-?\d+$/.test(raw.trim())) {
    throw new NoteScriptError(`${name} must be an integer.`, line);
  }
  const value = Number.parseInt(raw.trim(), 10);
  if (value < min || value > max) {
    throw new NoteScriptError(`${name} must be between ${min} and ${max}.`, line);
  }
  return value;
}

export function parseNumber(raw, name, min, max, line) {
  const value = Number(raw.trim());
  if (!Number.isFinite(value) || value < min || value > max) {
    throw new NoteScriptError(`${name} must be between ${min} and ${max}.`, line);
  }
  return value;
}
