import fs from "node:fs";
import path from "node:path";
import { NoteScriptError } from "../error.js";
import { noteToMidi } from "../music.js";

function extractPackLines(markdown) {
  const lines = markdown.split(/\r?\n/);
  const out = [];
  let active = false;
  let found = false;
  const fence = String.fromCharCode(96).repeat(3);

  for (let i = 0; i < lines.length; i += 1) {
    const raw = lines[i];
    if (!active && raw.trim().toLowerCase() === (fence + "notescript-sound")) {
      active = true;
      found = true;
      continue;
    }
    if (active && raw.trim() === fence) {
      active = false;
      continue;
    }
    if (active) out.push({ text: raw.trim(), line: i + 1 });
  }

  if (!found) throw new NoteScriptError("pack.md has no notescript-sound block.");
  if (active) throw new NoteScriptError("Unclosed notescript-sound block.");
  return out;
}

export function loadSoundPack(packDir) {
  const manifest = path.join(packDir, "pack.md");
  if (!fs.existsSync(manifest)) throw new NoteScriptError("Sound pack not found: " + manifest);
  const text = fs.readFileSync(manifest, "utf8");
  const pack = {
    name: path.basename(packDir),
    type: "pitched",
    fallback: "nearest",
    version: "1",
    author: "",
    license: "unspecified",
    source: "",
    description: "",
    samples: new Map(),
    triggers: new Map(),
    directory: packDir
  };

  for (const source of extractPackLines(text)) {
    if (!source.text || source.text.startsWith("//")) continue;

    const property = /^([A-Za-z][A-Za-z0-9_-]*)\s*:\s*(.+)$/.exec(source.text);
    if (property) {
      const key = property[1].toLowerCase();
      const value = property[2].trim();
      if (key === "name") pack.name = value;
      else if (key === "version") pack.version = value;
      else if (key === "author") pack.author = value;
      else if (key === "license") pack.license = value;
      else if (key === "source") pack.source = value;
      else if (key === "description") pack.description = value;
      else if (key === "type") {
        if (!["pitched", "kit"].includes(value)) {
          throw new NoteScriptError("pack type must be pitched or kit.", source.line);
        }
        pack.type = value;
      } else if (key === "fallback") {
        if (!["nearest", "none"].includes(value)) {
          throw new NoteScriptError("fallback must be nearest or none.", source.line);
        }
        pack.fallback = value;
      } else {
        throw new NoteScriptError('Unknown pack property "' + key + '".', source.line);
      }
      continue;
    }

    const sample = /^sample\s+(\S+)\s*=\s*(.+)$/i.exec(source.text);
    if (sample) {
      pack.samples.set(noteToMidi(sample[1], source.line), path.resolve(packDir, sample[2].trim()));
      continue;
    }

    const trigger = /^trigger\s+([A-Za-z0-9_.-]+)\s*=\s*(.+)$/i.exec(source.text);
    if (trigger) {
      pack.triggers.set(trigger[1], path.resolve(packDir, trigger[2].trim()));
      continue;
    }

    throw new NoteScriptError('Unknown pack statement "' + source.text + '".', source.line);
  }

  if (pack.type === "pitched" && pack.samples.size === 0) {
    throw new NoteScriptError("Pitched pack has no sample mappings.");
  }
  if (pack.type === "kit" && pack.triggers.size === 0) {
    throw new NoteScriptError("Kit pack has no trigger mappings.");
  }

  for (const file of [...pack.samples.values(), ...pack.triggers.values()]) {
    if (!fs.existsSync(file)) throw new NoteScriptError("Mapped audio file does not exist: " + file);
  }
  return pack;
}

export function resolvePitchedSample(pack, midiNote) {
  if (pack.samples.has(midiNote)) return { file: pack.samples.get(midiNote), rootNote: midiNote };
  if (pack.fallback === "none") return null;

  let best = null;
  for (const [rootNote, file] of pack.samples.entries()) {
    const distance = Math.abs(rootNote - midiNote);
    if (!best || distance < best.distance) best = { file, rootNote, distance };
  }
  return best ? { file: best.file, rootNote: best.rootNote } : null;
}
