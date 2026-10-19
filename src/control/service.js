import fs from "node:fs";
import path from "node:path";
import { parseSong } from "../parser.js";
import { renderInstrumentNoteToWavBuffer, renderToWav } from "../renderer.js";
import { exportMidi } from "../midi.js";
import { listSoundAddons } from "../sound/resolver.js";
import { loadSoundPack } from "../sound/pack.js";
import { listInstrumentAddons, loadInstrumentAddon } from "../instrument/addon.js";
import { getFluidSynthCapabilities } from "../instrument/fluidsynth.js";
import { decodeAudioFile, getDecoderCapabilities } from "../audio/decoder.js";
import { encodeMonoPcm16 } from "../sound/wav.js";
import { midiToNote } from "../music.js";
import { NoteScriptError } from "../error.js";

function safeName(name) {
  const value = String(name || "").trim();
  if (!value || value === "." || value === ".." || /[\\/:*?"<>|]/.test(value)) {
    throw new NoteScriptError("Invalid name.");
  }
  return value;
}

function assertInside(root, candidate) {
  const base = path.resolve(root);
  const target = path.resolve(candidate);
  const rel = path.relative(base, target);
  if (rel.startsWith("..") || path.isAbsolute(rel)) {
    throw new NoteScriptError("Path is outside the NoteScript portable workspace.");
  }
  return target;
}

function soundSummary(pack, id) {
  return {
    id,
    name: pack.name,
    type: pack.type,
    version: pack.version,
    author: pack.author,
    license: pack.license,
    source: pack.source,
    description: pack.description,
    fallback: pack.fallback,
    samples: [...pack.samples.keys()].sort((a, b) => a - b).map((midi) => ({
      midi,
      note: midiToNote(midi)
    })),
    triggers: [...pack.triggers.keys()].sort((a, b) => a.localeCompare(b))
  };
}

export function createControlService(programRoot) {
  const root = path.resolve(programRoot);
  const projectsRoot = path.join(root, "projects");
  const exportsRoot = path.join(root, "exports");
  const soundsRoot = path.join(root, "sounds");
  const instrumentsRoot = path.join(root, "instruments");

  for (const dir of [projectsRoot, exportsRoot, soundsRoot, instrumentsRoot]) {
    fs.mkdirSync(dir, { recursive: true });
  }

  function resolveProject(fileOrName) {
    if (!fileOrName) throw new NoteScriptError("Project file is required.");
    const raw = String(fileOrName);
    const candidate = path.isAbsolute(raw) ? raw : path.join(projectsRoot, raw);
    return assertInside(projectsRoot, candidate);
  }

  function loadProject(fileOrName) {
    const file = resolveProject(fileOrName);
    if (!fs.existsSync(file)) throw new NoteScriptError("Project does not exist: " + file);
    return { file, markdown: fs.readFileSync(file, "utf8") };
  }

  function resolvePortableSound(id) {
    const name = safeName(id);
    const directory = assertInside(soundsRoot, path.join(soundsRoot, name));
    if (!fs.existsSync(path.join(directory, "pack.md"))) {
      throw new NoteScriptError('Sound add-on "' + name + '" was not found.');
    }
    return { id: name, directory, pack: loadSoundPack(directory) };
  }

  return {
    root,

    health() {
      return {
        ok: true,
        service: "NoteScript Control API",
        apiVersion: "v1",
        coreVersion: "0.1.0",
        portableRoot: root
      };
    },

    capabilities() {
      const fluidSynth = getFluidSynthCapabilities(root);
      return {
        decoders: getDecoderCapabilities(),
        audition: {
          nativeSoundPacks: true,
          polyphony: true,
          computerKeyboard: true,
          mouseKeyboard: true,
          midiInput: false
        },
        backends: {
          fluidsynth: fluidSynth
        },
        instruments: {
          SFZ: { discover: true, render: true, audition: true },
          SF2: {
            discover: true,
            render: fluidSynth.available,
            audition: fluidSynth.available
          },
          SF3: {
            discover: true,
            render: fluidSynth.available,
            audition: fluidSynth.available
          }
        }
      };
    },

    listProjects() {
      return fs.readdirSync(projectsRoot, { withFileTypes: true })
        .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".md"))
        .map((entry) => entry.name)
        .sort((a, b) => a.localeCompare(b));
    },

    saveProject(name, markdown) {
      const base = safeName(name);
      const filename = base.toLowerCase().endsWith(".md") ? base : base + ".md";
      const file = assertInside(projectsRoot, path.join(projectsRoot, filename));
      const parsed = parseSong(String(markdown));
      fs.writeFileSync(file, String(markdown), "utf8");
      return { file, title: parsed.title, tracks: parsed.tracks.length };
    },

    validateProject(fileOrName) {
      const { file, markdown } = loadProject(fileOrName);
      const song = parseSong(markdown);
      return {
        valid: true,
        file,
        title: song.title,
        tempo: song.config.tempo,
        tracks: song.tracks.length
      };
    },

    listSounds(fileOrName = null) {
      const roots = [soundsRoot];
      if (fileOrName) {
        const file = resolveProject(fileOrName);
        roots.unshift(path.join(path.dirname(file), "sounds"));
      }
      return listSoundAddons(roots);
    },

    listPortableSoundsDetailed() {
      return listSoundAddons([soundsRoot]).map((entry) => {
        const pack = loadSoundPack(entry.directory);
        return soundSummary(pack, entry.name);
      });
    },

    getSoundDetails(id) {
      const resolved = resolvePortableSound(id);
      return soundSummary(resolved.pack, resolved.id);
    },

    getAuditionAudio(id, selector = {}) {
      const { pack } = resolvePortableSound(id);
      let file = null;

      if (selector.note !== undefined && selector.note !== null) {
        if (pack.type !== "pitched") {
          throw new NoteScriptError("Selected add-on is not a pitched sound pack.");
        }
        const midi = Number.parseInt(String(selector.note), 10);
        if (!Number.isInteger(midi) || !pack.samples.has(midi)) {
          throw new NoteScriptError("Audition note must be one of the pack root samples.");
        }
        file = pack.samples.get(midi);
      } else if (selector.trigger) {
        if (pack.type !== "kit") {
          throw new NoteScriptError("Selected add-on is not a named kit.");
        }
        const trigger = String(selector.trigger);
        if (!pack.triggers.has(trigger)) {
          throw new NoteScriptError('Unknown trigger "' + trigger + '".');
        }
        file = pack.triggers.get(trigger);
      } else {
        throw new NoteScriptError("Audition audio requires note or trigger.");
      }

      const decoded = decodeAudioFile(file, { sampleRate: 44100 });
      return {
        buffer: encodeMonoPcm16(decoded.samples, decoded.sampleRate),
        sampleRate: decoded.sampleRate,
        decoder: decoded.decoder
      };
    },

    listInstruments(fileOrName = null) {
      const fluidSynth = getFluidSynthCapabilities(root);
      const roots = [instrumentsRoot];
      if (fileOrName) {
        const file = resolveProject(fileOrName);
        roots.unshift(path.join(path.dirname(file), "instruments"));
      }
      return listInstrumentAddons(roots).map((entry) => {
        const addon = loadInstrumentAddon(entry.directory);
        return {
          id: addon.id,
          name: addon.name,
          format: addon.format,
          author: addon.author,
          license: addon.license,
          source: addon.source,
          description: addon.description,
          playable:
            addon.format === "SFZ" ||
            ((addon.format === "SF2" || addon.format === "SF3") && fluidSynth.available)
        };
      });
    },

    getInstrumentAuditionAudio(id, note, velocity = 96) {
      const midi = Number.parseInt(String(note), 10);
      const vel = Number.parseInt(String(velocity), 10);
      if (!Number.isInteger(midi) || midi < 0 || midi > 127) {
        throw new NoteScriptError("Instrument audition note must be MIDI 0-127.");
      }
      if (!Number.isInteger(vel) || vel < 1 || vel > 127) {
        throw new NoteScriptError("Instrument audition velocity must be 1-127.");
      }

      const buffer = renderInstrumentNoteToWavBuffer(id, midi, vel, {
        portableRoot: root,
        songFile: path.join(projectsRoot, "__audition__.md")
      });
      return { buffer };
    },

    renderProject(fileOrName, outputName = null) {
      const { file, markdown } = loadProject(fileOrName);
      const song = parseSong(markdown);
      const stem = outputName ? safeName(outputName) : path.basename(file, path.extname(file));
      const filename = stem.toLowerCase().endsWith(".wav") ? stem : stem + ".wav";
      const output = assertInside(exportsRoot, path.join(exportsRoot, filename));
      return renderToWav(song, file, output, { portableRoot: root });
    },

    exportMidi(fileOrName, outputName = null) {
      const { file, markdown } = loadProject(fileOrName);
      const song = parseSong(markdown);
      const stem = outputName ? safeName(outputName) : path.basename(file, path.extname(file));
      const filename = stem.toLowerCase().endsWith(".mid") ? stem : stem + ".mid";
      const output = assertInside(exportsRoot, path.join(exportsRoot, filename));
      return { outputFile: exportMidi(song, output) };
    }
  };
}
