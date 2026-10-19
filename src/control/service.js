import fs from "node:fs";
import path from "node:path";
import { parseSong } from "../parser.js";
import { renderInstrumentNoteToWavBuffer, renderToWav, renderToWavBuffer } from "../renderer.js";
import { exportMidi } from "../midi.js";
import { listSoundAddons } from "../sound/resolver.js";
import { loadSoundPack } from "../sound/pack.js";
import { listInstrumentAddons, loadInstrumentAddon } from "../instrument/addon.js";
import { getFluidSynthCapabilities } from "../instrument/fluidsynth.js";
import { decodeAudioFile, getDecoderCapabilities } from "../audio/decoder.js";
import { encodeMonoPcm16 } from "../sound/wav.js";
import { midiToNote } from "../music.js";
import { NoteScriptError } from "../error.js";
import { LivePlaybackManager } from "../playback/manager.js";
import { compileTimeline } from "../timeline.js";

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
  const configRoot = path.join(root, "config");
  const studioSettingsFile = path.join(configRoot, "studio.json");
  const livePlayback = new LivePlaybackManager(root);
  const transportCache = new Map();
  const transportStemCache = new Map();

  for (const dir of [projectsRoot, exportsRoot, soundsRoot, instrumentsRoot, configRoot]) {
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

  function normalizeProjectName(name) {
    const base = safeName(name);
    return base.toLowerCase().endsWith(".md") ? base : base + ".md";
  }

  function normalizeSoundPadVolumes(value) {
    const result = {};
    if (!value || typeof value !== "object") return result;

    for (const [packId, triggers] of Object.entries(value)) {
      if (!triggers || typeof triggers !== "object") continue;
      const normalized = {};
      for (const [trigger, raw] of Object.entries(triggers)) {
        const number = Number(raw);
        if (!Number.isFinite(number)) continue;
        normalized[trigger] = Math.max(0, Math.min(1, number));
      }
      result[packId] = normalized;
    }
    return result;
  }

  function normalizeSoundPadMixLocks(value) {
    const result = {};
    if (!value || typeof value !== "object") return result;
    for (const [packId, locked] of Object.entries(value)) {
      result[packId] = locked === true;
    }
    return result;
  }

  function defaultStudioSettings() {
    return {
      version: 3,
      workspaceMode: "basic",
      editorMode: "text",
      soundPadHotkeys: {},
      soundPadVolumes: {},
      soundPadMixLocks: {},
      hotkeys: {
        note0: "a",
        note1: "w",
        note2: "s",
        note3: "e",
        note4: "d",
        note5: "f",
        note6: "t",
        note7: "g",
        note8: "y",
        note9: "h",
        note10: "u",
        note11: "j",
        note12: "k",
        octaveDown: "z",
        octaveUp: "x",
        sustain: "Space",
        panic: "Escape",
        transportPlayPause: "Enter",
        transportStop: "Backspace"
      }
    };
  }

  function readStudioSettings() {
    const defaults = defaultStudioSettings();
    if (!fs.existsSync(studioSettingsFile)) return defaults;
    let parsed;
    try {
      parsed = JSON.parse(fs.readFileSync(studioSettingsFile, "utf8"));
    } catch {
      return defaults;
    }
    const legacyKitHotkeys =
      parsed && typeof parsed.kitHotkeys === "object" ? parsed.kitHotkeys : {};
    const soundPadHotkeys =
      parsed && typeof parsed.soundPadHotkeys === "object"
        ? parsed.soundPadHotkeys
        : legacyKitHotkeys;
    const soundPadVolumes = normalizeSoundPadVolumes(
      parsed && typeof parsed.soundPadVolumes === "object"
        ? parsed.soundPadVolumes
        : {}
    );
    const soundPadMixLocks = normalizeSoundPadMixLocks(
      parsed && typeof parsed.soundPadMixLocks === "object"
        ? parsed.soundPadMixLocks
        : {}
    );

    const { kitHotkeys: _legacyKitHotkeys, ...rest } = parsed || {};
    return {
      ...defaults,
      ...rest,
      version: 3,
      hotkeys: {
        ...defaults.hotkeys,
        ...(parsed && typeof parsed.hotkeys === "object" ? parsed.hotkeys : {})
      },
      soundPadHotkeys,
      soundPadVolumes,
      soundPadMixLocks
    };
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
          webMidiInput: true
        },
        livePlayback: {
          soundfont: fluidSynth.available,
          formats: fluidSynth.available ? ["SF2", "SF3"] : [],
          noteOnOff: fluidSynth.available,
          sustain: fluidSynth.available,
          panic: fluidSynth.available,
          defaultAudioDriver: process.platform === "win32" ? "wasapi" : null
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

    getProject(fileOrName) {
      const { file, markdown } = loadProject(fileOrName);
      const analyzed = this.analyzeMarkdown(markdown);
      return {
        name: path.basename(file),
        file,
        markdown,
        ...analyzed
      };
    },

    analyzeMarkdown(markdown) {
      try {
        const song = parseSong(String(markdown));
        const timeline = compileTimeline(song);
        return {
          valid: true,
          diagnostics: [],
          song,
          timeline
        };
      } catch (error) {
        if (!(error instanceof NoteScriptError)) throw error;
        return {
          valid: false,
          diagnostics: [{
            severity: "error",
            line: error.line || null,
            message: error.message
          }],
          song: null,
          timeline: null
        };
      }
    },

    saveProject(name, markdown) {
      const filename = normalizeProjectName(name);
      const file = assertInside(projectsRoot, path.join(projectsRoot, filename));
      const parsed = parseSong(String(markdown));
      fs.writeFileSync(file, String(markdown), "utf8");
      transportCache.delete(file);
      for (const key of [...transportStemCache.keys()]) {
        if (key.startsWith(file + "::")) transportStemCache.delete(key);
      }
      return { file, name: filename, title: parsed.title, tracks: parsed.tracks.length };
    },

    renameProject(fileOrName, newName) {
      const source = resolveProject(fileOrName);
      if (!fs.existsSync(source)) throw new NoteScriptError("Project does not exist: " + source);
      const filename = normalizeProjectName(newName);
      const target = assertInside(projectsRoot, path.join(projectsRoot, filename));
      if (source === target) return { name: filename, file: target };
      if (fs.existsSync(target)) throw new NoteScriptError("A project with that name already exists.");
      fs.renameSync(source, target);
      transportCache.delete(source);
      transportCache.delete(target);
      for (const key of [...transportStemCache.keys()]) {
        if (key.startsWith(source + "::") || key.startsWith(target + "::")) {
          transportStemCache.delete(key);
        }
      }
      return { name: filename, file: target };
    },

    deleteProject(fileOrName) {
      const file = resolveProject(fileOrName);
      if (!fs.existsSync(file)) throw new NoteScriptError("Project does not exist: " + file);
      fs.unlinkSync(file);
      transportCache.delete(file);
      for (const key of [...transportStemCache.keys()]) {
        if (key.startsWith(file + "::")) transportStemCache.delete(key);
      }
      return { deleted: path.basename(file) };
    },

    getStudioSettings() {
      return readStudioSettings();
    },

    saveStudioSettings(input = {}) {
      const current = readStudioSettings();
      const next = {
        ...current,
        ...(input.workspaceMode ? { workspaceMode: String(input.workspaceMode) } : {}),
        ...(input.editorMode ? { editorMode: String(input.editorMode) } : {}),
        hotkeys: {
          ...current.hotkeys,
          ...(input.hotkeys && typeof input.hotkeys === "object" ? input.hotkeys : {})
        },
        soundPadHotkeys: {
          ...(current.soundPadHotkeys && typeof current.soundPadHotkeys === "object"
            ? current.soundPadHotkeys
            : {}),
          ...(input.soundPadHotkeys && typeof input.soundPadHotkeys === "object"
            ? input.soundPadHotkeys
            : {}),
          ...(input.kitHotkeys && typeof input.kitHotkeys === "object"
            ? input.kitHotkeys
            : {})
        },
        soundPadVolumes: normalizeSoundPadVolumes({
          ...(current.soundPadVolumes && typeof current.soundPadVolumes === "object"
            ? current.soundPadVolumes
            : {}),
          ...(input.soundPadVolumes && typeof input.soundPadVolumes === "object"
            ? input.soundPadVolumes
            : {})
        }),
        soundPadMixLocks: normalizeSoundPadMixLocks({
          ...(current.soundPadMixLocks && typeof current.soundPadMixLocks === "object"
            ? current.soundPadMixLocks
            : {}),
          ...(input.soundPadMixLocks && typeof input.soundPadMixLocks === "object"
            ? input.soundPadMixLocks
            : {})
        })
      };

      if (!["basic", "advanced"].includes(next.workspaceMode)) {
        throw new NoteScriptError("workspaceMode must be basic or advanced.");
      }
      if (!["text", "form", "node"].includes(next.editorMode)) {
        throw new NoteScriptError("editorMode must be text, form or node.");
      }

      fs.writeFileSync(studioSettingsFile, JSON.stringify(next, null, 2) + "\n", "utf8");
      return next;
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
        if (pack.type !== "soundpad") {
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

    getTransportPreview(fileOrName) {
      const { file, markdown } = loadProject(fileOrName);
      const stat = fs.statSync(file);
      const signature = stat.size + ":" + stat.mtimeMs;
      const cached = transportCache.get(file);

      if (cached && cached.signature === signature) {
        return cached.preview;
      }

      const song = parseSong(markdown);
      const rendered = renderToWavBuffer(song, file, { portableRoot: root });
      const preview = {
        buffer: rendered.buffer,
        project: path.basename(file),
        title: song.title,
        tempo: song.config.tempo,
        ...rendered.report
      };

      transportCache.set(file, { signature, preview });
      while (transportCache.size > 4) {
        const oldest = transportCache.keys().next().value;
        transportCache.delete(oldest);
      }

      return preview;
    },

    getTransportTrackPreview(fileOrName, trackIndex) {
      const { file, markdown } = loadProject(fileOrName);
      const song = parseSong(markdown);
      const index = Number.parseInt(String(trackIndex), 10);

      if (!Number.isInteger(index) || index < 0 || index >= song.tracks.length) {
        throw new NoteScriptError("Track index is outside the song.");
      }

      const stat = fs.statSync(file);
      const signature = stat.size + ":" + stat.mtimeMs;
      const cacheKey = file + "::" + index;
      const cached = transportStemCache.get(cacheKey);

      if (cached && cached.signature === signature) {
        return cached.preview;
      }

      const mix = this.getTransportPreview(fileOrName);
      const rendered = renderToWavBuffer(song, file, {
        portableRoot: root,
        trackIndex: index,
        normalizationPeak: mix.peakBeforeNormalization
      });

      const preview = {
        buffer: rendered.buffer,
        project: path.basename(file),
        trackIndex: index,
        trackName: song.tracks[index].name,
        durationSeconds: rendered.report.durationSeconds,
        sampleRate: rendered.report.sampleRate,
        peakBeforeNormalization: rendered.report.peakBeforeNormalization
      };

      transportStemCache.set(cacheKey, { signature, preview });
      while (transportStemCache.size > 32) {
        const oldest = transportStemCache.keys().next().value;
        transportStemCache.delete(oldest);
      }

      return preview;
    },

    clearTransportCache(fileOrName = null) {
      if (!fileOrName) {
        transportCache.clear();
        transportStemCache.clear();
        return { cleared: "all" };
      }
      const file = resolveProject(fileOrName);
      transportCache.delete(file);
      for (const key of [...transportStemCache.keys()]) {
        if (key.startsWith(file + "::")) transportStemCache.delete(key);
      }
      return { cleared: path.basename(file) };
    },

    liveStatus() {
      return livePlayback.status();
    },

    async liveSelectInstrument(id) {
      return livePlayback.selectInstrument(id);
    },

    liveNoteOn(note, velocity = 96) {
      return livePlayback.noteOn(note, velocity);
    },

    liveNoteOff(note) {
      return livePlayback.noteOff(note);
    },

    liveSustain(enabled) {
      return livePlayback.sustain(enabled);
    },

    liveAllNotesOff() {
      return livePlayback.allNotesOff();
    },

    async liveStop() {
      return livePlayback.stop();
    },

    async shutdown() {
      return livePlayback.shutdown();
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
