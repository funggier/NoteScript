import fs from "node:fs";
import path from "node:path";
import { noteToMidi } from "../music.js";
import { NoteScriptError } from "../error.js";

function stripComments(text) {
  return text
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .split(/\r?\n/)
    .map((line) => line.replace(/\/\/.*$/, ""))
    .join("\n");
}

function parseNoteOrNumber(value, label) {
  const raw = String(value).trim();
  if (/^-?\d+$/.test(raw)) {
    const number = Number.parseInt(raw, 10);
    if (number < 0 || number > 127) {
      throw new NoteScriptError(label + " must be within MIDI 0-127.");
    }
    return number;
  }
  return noteToMidi(raw);
}

function number(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function integer(value, fallback = 0) {
  const parsed = Number.parseInt(String(value), 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function normalizeSamplePath(value) {
  return String(value).trim().replaceAll("\\", path.sep).replaceAll("/", path.sep);
}

function tokenize(text) {
  const source = stripComments(text);
  const marker = /<([A-Za-z0-9_]+)>|([A-Za-z0-9_]+)=/g;
  const markers = [];
  let match;

  while ((match = marker.exec(source)) !== null) {
    markers.push({
      index: match.index,
      end: marker.lastIndex,
      header: match[1] || null,
      key: match[2] || null
    });
  }

  const tokens = [];
  for (let i = 0; i < markers.length; i += 1) {
    const item = markers[i];
    if (item.header) {
      tokens.push({ type: "header", value: item.header.toLowerCase() });
      continue;
    }
    const end = i + 1 < markers.length ? markers[i + 1].index : source.length;
    tokens.push({
      type: "opcode",
      key: item.key.toLowerCase(),
      value: source.slice(item.end, end).trim()
    });
  }
  return tokens;
}

function normalizedRegion(raw, sfzFile, control) {
  if (!raw.sample) throw new NoteScriptError("SFZ region is missing sample=.");

  let lokey = raw.lokey !== undefined ? parseNoteOrNumber(raw.lokey, "lokey") : 0;
  let hikey = raw.hikey !== undefined ? parseNoteOrNumber(raw.hikey, "hikey") : 127;
  let rootNote = raw.pitch_keycenter !== undefined
    ? parseNoteOrNumber(raw.pitch_keycenter, "pitch_keycenter")
    : 60;

  if (raw.key !== undefined) {
    const key = parseNoteOrNumber(raw.key, "key");
    lokey = key;
    hikey = key;
    if (raw.pitch_keycenter === undefined) rootNote = key;
  }

  const lovel = Math.max(0, Math.min(127, integer(raw.lovel, 0)));
  const hivel = Math.max(0, Math.min(127, integer(raw.hivel, 127)));
  const defaultPath = control.default_path ? normalizeSamplePath(control.default_path) : "";
  const sampleValue = normalizeSamplePath(raw.sample);
  const sampleFile = path.resolve(path.dirname(sfzFile), defaultPath, sampleValue);

  return {
    sampleFile,
    lokey,
    hikey,
    lovel,
    hivel,
    rootNote,
    tuneCents: number(raw.tune, 0),
    transpose: number(raw.transpose, 0),
    volumeDb: number(raw.volume, 0),
    pan: number(raw.pan, 0),
    offset: Math.max(0, integer(raw.offset, 0)),
    end: raw.end !== undefined ? Math.max(0, integer(raw.end, 0)) : null,
    loopMode: raw.loop_mode || "no_loop",
    attackSeconds: Math.max(0, number(raw.ampeg_attack, 0)),
    releaseSeconds: Math.max(0, number(raw.ampeg_release, 0.08)),
    raw: { ...raw }
  };
}

export function parseSfzFile(sfzFile) {
  const file = path.resolve(sfzFile);
  if (!fs.existsSync(file)) throw new NoteScriptError("SFZ file not found: " + file);

  const tokens = tokenize(fs.readFileSync(file, "utf8"));
  const control = {};
  let global = {};
  let group = {};
  let scope = null;
  let region = null;
  const regions = [];

  for (const token of tokens) {
    if (token.type === "header") {
      if (token.value === "control") {
        scope = control;
        region = null;
      } else if (token.value === "global") {
        global = {};
        scope = global;
        region = null;
      } else if (token.value === "group") {
        group = {};
        scope = group;
        region = null;
      } else if (token.value === "region") {
        region = { ...global, ...group };
        regions.push(region);
        scope = region;
      } else {
        scope = null;
        region = null;
      }
      continue;
    }

    if (scope) scope[token.key] = token.value;
  }

  if (regions.length === 0) throw new NoteScriptError("SFZ contains no <region> entries.");

  const normalized = regions.map((item) => normalizedRegion(item, file, control));
  for (const item of normalized) {
    if (!fs.existsSync(item.sampleFile)) {
      throw new NoteScriptError("SFZ sample file not found: " + item.sampleFile);
    }
  }

  return {
    file,
    control,
    regionCount: normalized.length,
    regions: normalized
  };
}

export function selectSfzRegions(sfz, midiNote, velocity = 96) {
  const note = Number(midiNote);
  const vel = Number(velocity);
  return sfz.regions.filter((region) =>
    note >= region.lokey &&
    note <= region.hikey &&
    vel >= region.lovel &&
    vel <= region.hivel
  );
}

export function sfzPitchRatio(region, midiNote) {
  const semitones =
    Number(midiNote) -
    region.rootNote +
    region.transpose +
    region.tuneCents / 100;
  return Math.pow(2, semitones / 12);
}

export function dbToGain(db) {
  return Math.pow(10, Number(db || 0) / 20);
}
