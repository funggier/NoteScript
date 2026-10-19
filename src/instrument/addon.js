import fs from "node:fs";
import path from "node:path";
import { NoteScriptError } from "../error.js";

export const SUPPORTED_INSTRUMENT_FORMATS = ["SFZ", "SF2", "SF3"];

function extractLines(markdown) {
  const lines = markdown.split(/\r?\n/);
  const fence = String.fromCharCode(96).repeat(3);
  const start = fence + "notescript-instrument";
  const out = [];
  let active = false;
  let found = false;

  for (let i = 0; i < lines.length; i += 1) {
    const raw = lines[i];
    if (!active && raw.trim().toLowerCase() === start) {
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

  if (!found) throw new NoteScriptError("instrument.md has no notescript-instrument block.");
  if (active) throw new NoteScriptError("Unclosed notescript-instrument block.");
  return out;
}

function inferFormatFromDirectory(directory) {
  const parent = path.basename(path.dirname(path.resolve(directory))).toUpperCase();
  return SUPPORTED_INSTRUMENT_FORMATS.includes(parent) ? parent : null;
}

export function loadInstrumentAddon(directory) {
  const manifest = path.join(directory, "instrument.md");
  if (!fs.existsSync(manifest)) {
    throw new NoteScriptError("Instrument add-on manifest not found: " + manifest);
  }

  const addon = {
    id: path.basename(directory),
    name: path.basename(directory),
    version: "1",
    author: "",
    license: "unspecified",
    source: "",
    description: "",
    format: "",
    entry: "",
    bank: null,
    preset: null,
    directory
  };

  const text = fs.readFileSync(manifest, "utf8");
  for (const source of extractLines(text)) {
    if (!source.text || source.text.startsWith("//")) continue;

    const property = /^([A-Za-z][A-Za-z0-9_-]*)\s*:\s*(.+)$/.exec(source.text);
    if (!property) {
      throw new NoteScriptError('Unknown instrument statement "' + source.text + '".', source.line);
    }

    const key = property[1].toLowerCase();
    const value = property[2].trim();

    if (key === "name") addon.name = value;
    else if (key === "version") addon.version = value;
    else if (key === "author") addon.author = value;
    else if (key === "license") addon.license = value;
    else if (key === "source") addon.source = value;
    else if (key === "description") addon.description = value;
    else if (key === "format") {
      const format = value.toUpperCase();
      if (!SUPPORTED_INSTRUMENT_FORMATS.includes(format)) {
        throw new NoteScriptError("Instrument format must be SFZ, SF2 or SF3.", source.line);
      }
      addon.format = format;
    } else if (key === "entry") addon.entry = value;
    else if (key === "bank") addon.bank = Number.parseInt(value, 10);
    else if (key === "preset") addon.preset = Number.parseInt(value, 10);
    else throw new NoteScriptError('Unknown instrument property "' + key + '".', source.line);
  }

  if (!addon.format) throw new NoteScriptError("Instrument add-on is missing format.");
  if (!addon.entry) throw new NoteScriptError("Instrument add-on is missing entry.");

  const folderFormat = inferFormatFromDirectory(directory);
  if (!folderFormat) {
    throw new NoteScriptError(
      "Instrument add-on must live below instruments/SFZ, instruments/SF2 or instruments/SF3."
    );
  }
  if (folderFormat !== addon.format) {
    throw new NoteScriptError(
      "Instrument manifest format " + addon.format + " does not match folder " + folderFormat + "."
    );
  }

  const entryPath = path.resolve(directory, addon.entry);
  if (!fs.existsSync(entryPath)) {
    throw new NoteScriptError("Instrument entry file does not exist: " + entryPath);
  }

  addon.entryPath = entryPath;
  addon.id = addon.format + "/" + path.basename(directory);
  return addon;
}

export function listInstrumentAddons(roots) {
  const out = [];
  const seen = new Set();

  for (const root of roots) {
    if (!root || !fs.existsSync(root)) continue;

    for (const format of SUPPORTED_INSTRUMENT_FORMATS) {
      const formatDir = path.join(root, format);
      if (!fs.existsSync(formatDir)) continue;

      for (const entry of fs.readdirSync(formatDir, { withFileTypes: true })) {
        if (!entry.isDirectory()) continue;
        const directory = path.join(formatDir, entry.name);
        if (!fs.existsSync(path.join(directory, "instrument.md"))) continue;
        const key = path.resolve(directory).toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);
        out.push({ id: format + "/" + entry.name, format, directory });
      }
    }
  }

  return out.sort((a, b) => a.id.localeCompare(b.id));
}

export function resolveInstrumentAddon(id, songFile, portableRoot = null) {
  const normalized = id.replaceAll("\\", "/");
  const parts = normalized.split("/").filter(Boolean);
  if (parts.length !== 2) {
    throw new NoteScriptError(
      'Instrument ID must include its format, for example "SFZ/SalamanderGrandPiano".'
    );
  }

  const format = parts[0].toUpperCase();
  const name = parts[1];
  if (!SUPPORTED_INSTRUMENT_FORMATS.includes(format)) {
    throw new NoteScriptError("Unsupported instrument format folder: " + parts[0]);
  }

  const songDir = path.dirname(path.resolve(songFile));
  const candidates = [
    path.join(songDir, "instruments", format, name),
    portableRoot ? path.join(portableRoot, "instruments", format, name) : null
  ].filter(Boolean);

  for (const directory of candidates) {
    if (fs.existsSync(path.join(directory, "instrument.md"))) return directory;
  }

  throw new NoteScriptError(
    'Instrument add-on "' + format + "/" + name + '" was not found.'
  );
}
