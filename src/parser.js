import { NoteScriptError } from "./error.js";
import { barQuarterLength, noteToMidi, parseDuration, parseInteger, parseNumber } from "./music.js";

function extractTitle(markdown) {
  for (const raw of markdown.split(/\r?\n/)) {
    const match = /^#\s+(.+?)\s*$/.exec(raw);
    if (match) return match[1].trim();
  }
  return "Untitled";
}

function extractFence(markdown, fenceName) {
  const lines = markdown.split(/\r?\n/);
  const result = [];
  let active = false;
  let found = false;
  const fence = String.fromCharCode(96).repeat(3);
  const start = new RegExp("^\\s*" + fence + fenceName + "\\s*$", "i");
  const end = new RegExp("^\\s*" + fence + "\\s*$");

  for (let i = 0; i < lines.length; i += 1) {
    const raw = lines[i];
    if (!active && start.test(raw)) {
      active = true;
      found = true;
      continue;
    }
    if (active && end.test(raw)) {
      active = false;
      continue;
    }
    if (active) result.push({ text: raw, line: i + 1 });
  }
  if (active) throw new NoteScriptError("Unclosed " + fenceName + " block.");
  if (!found) throw new NoteScriptError("No fenced " + fenceName + " block found.");
  return result;
}

function parseTime(value, line) {
  const match = /^(\d+)\s*\/\s*(\d+)$/.exec(value);
  if (!match) throw new NoteScriptError("time must look like 4/4 or 6/8.", line);
  const numerator = parseInteger(match[1], "time numerator", 1, 32, line);
  const denominator = parseInteger(match[2], "time denominator", 1, 32, line);
  if (![1, 2, 4, 8, 16, 32].includes(denominator)) {
    throw new NoteScriptError("time denominator must be 1, 2, 4, 8, 16 or 32.", line);
  }
  return [numerator, denominator];
}

function parseKey(value, line) {
  const match = /^([A-Ga-g](?:#|b|♯|♭)?)\s+(major|minor)$/i.exec(value.trim());
  if (!match) throw new NoteScriptError("key must look like C major, F# minor or Bb major.", line);
  return {
    tonic: match[1].replace("♯", "#").replace("♭", "b").replace(/^./, (c) => c.toUpperCase()),
    mode: match[2].toLowerCase()
  };
}

function splitVelocity(text, defaultVelocity, line) {
  const match = /^(.*?)(?:\s+@(\d{1,3}))?$/.exec(text.trim());
  const velocity = match[2]
    ? parseInteger(match[2], "velocity", 1, 127, line)
    : defaultVelocity;
  return { body: match[1].trim(), velocity };
}

function parseEvent(text, defaultVelocity, line) {
  const { body, velocity } = splitVelocity(text, defaultVelocity, line);

  const rest = /^R\s+(\S+)$/i.exec(body);
  if (rest) return { kind: "rest", durationQuarterNotes: parseDuration(rest[1], line), velocity, line };

  const chord = /^\[([^\]]+)\]\s+(\S+)$/.exec(body);
  if (chord) {
    const noteNames = chord[1].trim().split(/\s+/).filter(Boolean);
    if (noteNames.length < 2) throw new NoteScriptError("Chord requires at least two notes.", line);
    return {
      kind: "chord",
      noteNames,
      notes: noteNames.map((note) => noteToMidi(note, line)),
      durationQuarterNotes: parseDuration(chord[2], line),
      velocity,
      line
    };
  }

  const trigger = /^@([A-Za-z0-9_.-]+)\s+(\S+)$/.exec(body);
  if (trigger) return {
    kind: "trigger",
    trigger: trigger[1],
    durationQuarterNotes: parseDuration(trigger[2], line),
    velocity,
    line
  };

  const note = /^(\S+)\s+(\S+)$/.exec(body);
  if (!note) throw new NoteScriptError('Invalid event "' + text + '". Expected note, chord, @trigger or R.', line);
  return {
    kind: "note",
    noteNames: [note[1]],
    notes: [noteToMidi(note[1], line)],
    durationQuarterNotes: parseDuration(note[2], line),
    velocity,
    line
  };
}

export function parseSong(markdown) {
  const title = extractTitle(markdown);
  const lines = extractFence(markdown, "notescript");
  const config = {
    tempo: 120,
    timeNumerator: 4,
    timeDenominator: 4,
    keyTonic: "C",
    keyMode: "major",
    ppq: 480
  };

  const tracks = [];
  let currentTrack = null;
  let seenBars = new Set();

  for (const source of lines) {
    const text = source.text.trim();
    if (!text || text.startsWith("//")) continue;

    const trackMatch = /^track\s+(.+?)\s*$/i.exec(text);
    if (trackMatch) {
      currentTrack = {
        name: trackMatch[1].trim(),
        sound: null,
        instrument: null,
        volume: 1,
        pan: 0,
        velocity: 96,
        bars: [],
        line: source.line
      };
      tracks.push(currentTrack);
      seenBars = new Set();
      continue;
    }

    const barMatch = /^bar\s+(\d+)\s*:\s*(.*)$/i.exec(text);
    if (barMatch) {
      if (!currentTrack) throw new NoteScriptError("bar must appear inside a track.", source.line);
      const number = parseInteger(barMatch[1], "bar number", 1, 1000000, source.line);
      if (seenBars.has(number)) throw new NoteScriptError("Duplicate bar " + number + ' in track "' + currentTrack.name + '".', source.line);
      seenBars.add(number);
      const eventText = barMatch[2].trim();
      const events = eventText
        ? eventText.split("|").map((part) => parseEvent(part, currentTrack.velocity, source.line))
        : [];
      const total = events.reduce((sum, event) => sum + event.durationQuarterNotes, 0);
      const capacity = barQuarterLength(config.timeNumerator, config.timeDenominator);
      if (total > capacity + 1e-9) {
        throw new NoteScriptError("Bar " + number + " is too long: " + total + " quarter notes, capacity is " + capacity + ".", source.line);
      }
      currentTrack.bars.push({ number, events, line: source.line });
      continue;
    }

    const property = /^([A-Za-z][A-Za-z0-9_-]*)\s*:\s*(.+)$/.exec(text);
    if (!property) throw new NoteScriptError('Unknown statement "' + text + '".', source.line);
    const key = property[1].toLowerCase();
    const value = property[2].trim();

    if (!currentTrack) {
      if (key === "tempo") config.tempo = parseNumber(value, "tempo", 20, 400, source.line);
      else if (key === "time") [config.timeNumerator, config.timeDenominator] = parseTime(value, source.line);
      else if (key === "key") {
        const parsed = parseKey(value, source.line);
        config.keyTonic = parsed.tonic;
        config.keyMode = parsed.mode;
      } else if (key === "ppq") config.ppq = parseInteger(value, "ppq", 24, 9600, source.line);
      else throw new NoteScriptError('Unknown song property "' + key + '".', source.line);
      continue;
    }

    if (key === "sound") {
      if (currentTrack.instrument) throw new NoteScriptError("A track cannot declare both sound and instrument.", source.line);
      currentTrack.sound = value;
    } else if (key === "instrument") {
      if (currentTrack.sound) throw new NoteScriptError("A track cannot declare both sound and instrument.", source.line);
      currentTrack.instrument = value;
    } else if (key === "volume") currentTrack.volume = parseNumber(value, "volume", 0, 1, source.line);
    else if (key === "pan") currentTrack.pan = parseNumber(value, "pan", -1, 1, source.line);
    else if (key === "velocity") currentTrack.velocity = parseInteger(value, "velocity", 1, 127, source.line);
    else throw new NoteScriptError('Unknown track property "' + key + '".', source.line);
  }

  if (tracks.length === 0) throw new NoteScriptError("Song must contain at least one track.");
  for (const track of tracks) {
    if (!track.sound && !track.instrument) {
      throw new NoteScriptError('Track "' + track.name + '" must declare sound: or instrument:.', track.line);
    }
  }
  return { title, config, tracks };
}
