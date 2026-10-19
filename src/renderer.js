import fs from "node:fs";
import path from "node:path";
import { compileTimeline, quarterToSeconds } from "./timeline.js";
import { loadSoundPack, resolvePitchedSample } from "./sound/pack.js";
import { resolveSoundPackDirectory } from "./sound/resolver.js";
import { encodeMonoPcm16 } from "./sound/wav.js";
import { decodeAudioFile } from "./audio/decoder.js";
import { loadInstrumentAddon, resolveInstrumentAddon } from "./instrument/addon.js";
import { dbToGain, parseSfzFile, selectSfzRegions, sfzPitchRatio } from "./instrument/sfz.js";
import { renderSoundFontNote, renderSoundFontTrack } from "./instrument/fluidsynth.js";
import { NoteScriptError } from "./error.js";

function mixSample(buffer, index, value) {
  if (index >= 0 && index < buffer.length) buffer[index] += value;
}

function renderResampled(
  source,
  output,
  startFrame,
  durationFrames,
  pitchRatio,
  gain,
  outRate,
  options = {}
) {
  const sourceStep = (source.sampleRate / outRate) * pitchRatio;
  const sourceOffset = Math.max(0, options.sourceOffsetFrames || 0);
  const sourceEnd = options.sourceEndFrame !== null && options.sourceEndFrame !== undefined
    ? Math.min(source.samples.length, Math.max(sourceOffset + 1, options.sourceEndFrame + 1))
    : source.samples.length;

  const attackFrames = Math.max(0, Math.round((options.attackSeconds || 0) * outRate));
  const releaseFrames = Math.max(0, Math.round((options.releaseSeconds || 0) * outRate));
  const targetFrames = durationFrames + releaseFrames;
  const sourceAvailable = Math.max(0, sourceEnd - sourceOffset);
  const availableFrames = Math.min(targetFrames, Math.floor(sourceAvailable / sourceStep));

  if (availableFrames <= 0) return;

  const defaultFade = Math.max(1, Math.min(Math.floor(outRate * 0.02), Math.floor(availableFrames / 4)));
  const effectiveAttack = attackFrames > 0 ? Math.min(attackFrames, availableFrames) : defaultFade;
  const effectiveRelease = releaseFrames > 0
    ? Math.min(releaseFrames, availableFrames)
    : defaultFade;

  for (let i = 0; i < availableFrames; i += 1) {
    const srcPos = sourceOffset + i * sourceStep;
    const a = Math.floor(srcPos);
    const b = Math.min(a + 1, sourceEnd - 1);
    const frac = srcPos - a;
    const sample = source.samples[a] * (1 - frac) + source.samples[b] * frac;
    let envelope = 1;

    if (effectiveAttack > 0 && i < effectiveAttack) {
      envelope *= i / effectiveAttack;
    }

    if (releaseFrames > 0) {
      if (i >= durationFrames) {
        const releasePosition = (i - durationFrames) / Math.max(1, effectiveRelease);
        envelope *= Math.max(0, 1 - releasePosition);
      }
    } else if (i >= availableFrames - effectiveRelease) {
      envelope *= Math.max(0, (availableFrames - i - 1) / effectiveRelease);
    }

    mixSample(output, startFrame + i, sample * gain * Math.max(0, envelope));
  }
}

function normalizeOutput(output) {
  let peak = 0;
  for (const sample of output) peak = Math.max(peak, Math.abs(sample));
  if (peak > 0.98) {
    const scale = 0.98 / peak;
    for (let i = 0; i < output.length; i += 1) output[i] *= scale;
  }
  return peak;
}

function createCaches(sampleRate, songFile, portableRoot) {
  const audioCache = new Map();
  const packCache = new Map();
  const instrumentCache = new Map();

  function getAudio(file) {
    if (!audioCache.has(file)) {
      audioCache.set(file, decodeAudioFile(file, { sampleRate }));
    }
    return audioCache.get(file);
  }

  function getPack(soundRef) {
    const packDir = resolveSoundPackDirectory(soundRef, songFile, portableRoot);
    if (!packCache.has(packDir)) packCache.set(packDir, loadSoundPack(packDir));
    return packCache.get(packDir);
  }

  function getInstrument(instrumentRef) {
    if (instrumentCache.has(instrumentRef)) return instrumentCache.get(instrumentRef);

    const directory = resolveInstrumentAddon(instrumentRef, songFile, portableRoot);
    const addon = loadInstrumentAddon(directory);
    let instrument;
    if (addon.format === "SFZ") {
      instrument = { addon, sfz: parseSfzFile(addon.entryPath) };
    } else if (addon.format === "SF2" || addon.format === "SF3") {
      instrument = { addon, sfz: null };
    } else {
      throw new NoteScriptError(
        "No rendering adapter is available for instrument format " + addon.format + "."
      );
    }
    instrumentCache.set(instrumentRef, instrument);
    return instrument;
  }

  return { getAudio, getPack, getInstrument };
}

function renderSfzEvent(event, track, instrument, output, startFrame, durationFrames, sampleRate, getAudio) {
  if (event.kind !== "note") {
    throw new NoteScriptError(
      'SFZ instrument track "' + track.name + '" currently accepts note/chord events, not named triggers.',
      event.line
    );
  }

  const regions = selectSfzRegions(instrument.sfz, event.note, event.velocity);
  if (regions.length === 0) {
    throw new NoteScriptError(
      'SFZ instrument "' + instrument.addon.name + '" has no region for ' +
      event.noteName + " at velocity " + event.velocity + ".",
      event.line
    );
  }

  for (const region of regions) {
    const source = getAudio(region.sampleFile);
    const gain = track.volume * (event.velocity / 127) * dbToGain(region.volumeDb);
    renderResampled(
      source,
      output,
      startFrame,
      durationFrames,
      sfzPitchRatio(region, event.note),
      gain,
      sampleRate,
      {
        sourceOffsetFrames: region.offset,
        sourceEndFrame: region.end,
        attackSeconds: region.attackSeconds,
        releaseSeconds: region.releaseSeconds
      }
    );
  }
}

export function renderToWav(song, songFile, outputFile, options = {}) {
  const timeline = compileTimeline(song);
  const sampleRate = options.sampleRate || 44100;
  const tailSeconds = options.tailSeconds ?? 0.5;
  const endSeconds = quarterToSeconds(timeline.endQuarter, song.config.tempo) + tailSeconds;
  const output = new Float32Array(Math.max(1, Math.ceil(endSeconds * sampleRate)));
  const portableRoot = options.portableRoot ? path.resolve(options.portableRoot) : null;
  const { getAudio, getPack, getInstrument } = createCaches(sampleRate, songFile, portableRoot);

  for (const track of timeline.tracks) {
    if (track.instrument) {
      const instrument = getInstrument(track.instrument);

      if (instrument.addon.format === "SFZ") {
        for (const event of track.events) {
          const startFrame = Math.round(quarterToSeconds(event.startQuarter, song.config.tempo) * sampleRate);
          const durationFrames = Math.max(
            1,
            Math.round(quarterToSeconds(event.durationQuarter, song.config.tempo) * sampleRate)
          );
          renderSfzEvent(
            event,
            track,
            instrument,
            output,
            startFrame,
            durationFrames,
            sampleRate,
            getAudio
          );
        }
      } else {
        const rendered = renderSoundFontTrack(
          instrument.addon,
          song.config,
          track,
          { sampleRate, portableRoot }
        );
        const frames = Math.min(output.length, rendered.samples.length);
        for (let i = 0; i < frames; i += 1) {
          output[i] += rendered.samples[i] * track.volume;
        }
      }
      continue;
    }

    const pack = getPack(track.sound);
    for (const event of track.events) {
      const startFrame = Math.round(quarterToSeconds(event.startQuarter, song.config.tempo) * sampleRate);
      const durationFrames = Math.max(
        1,
        Math.round(quarterToSeconds(event.durationQuarter, song.config.tempo) * sampleRate)
      );
      const gain = track.volume * (event.velocity / 127);

      if (event.kind === "note") {
        if (pack.type !== "pitched") {
          throw new NoteScriptError(
            'Track "' + track.name + '" uses note events with non-pitched pack "' + pack.name + '".',
            event.line
          );
        }
        const mapped = resolvePitchedSample(pack, event.note);
        if (!mapped) {
          throw new NoteScriptError("No sample mapping available for " + event.noteName + ".", event.line);
        }
        const source = getAudio(mapped.file);
        const pitchRatio = Math.pow(2, (event.note - mapped.rootNote) / 12);
        renderResampled(source, output, startFrame, durationFrames, pitchRatio, gain, sampleRate);
      } else if (event.kind === "trigger") {
        if (pack.type !== "kit") {
          throw new NoteScriptError(
            'Track "' + track.name + '" uses @trigger events with non-kit pack "' + pack.name + '".',
            event.line
          );
        }
        const file = pack.triggers.get(event.trigger);
        if (!file) {
          throw new NoteScriptError(
            'Unknown trigger "' + event.trigger + '" in pack "' + pack.name + '".',
            event.line
          );
        }
        renderResampled(getAudio(file), output, startFrame, durationFrames, 1, gain, sampleRate);
      }
    }
  }

  const peak = normalizeOutput(output);
  fs.mkdirSync(path.dirname(path.resolve(outputFile)), { recursive: true });
  fs.writeFileSync(outputFile, encodeMonoPcm16(output, sampleRate));

  return {
    outputFile: path.resolve(outputFile),
    sampleRate,
    durationSeconds: output.length / sampleRate,
    peakBeforeNormalization: peak,
    tracks: timeline.tracks.length
  };
}

export function renderInstrumentNoteToWavBuffer(
  instrumentRef,
  midiNote,
  velocity = 96,
  options = {}
) {
  const sampleRate = options.sampleRate || 44100;
  const holdSeconds = options.holdSeconds ?? 1.4;
  const tailSeconds = options.tailSeconds ?? 1.0;
  const portableRoot = options.portableRoot ? path.resolve(options.portableRoot) : null;
  const songFile = options.songFile || path.join(portableRoot || process.cwd(), "projects", "__audition__.md");

  const { getAudio, getInstrument } = createCaches(sampleRate, songFile, portableRoot);
  const instrument = getInstrument(instrumentRef);

  if (instrument.addon.format === "SF2" || instrument.addon.format === "SF3") {
    const rendered = renderSoundFontNote(
      instrument.addon,
      midiNote,
      velocity,
      { sampleRate, holdSeconds, tailSeconds, portableRoot }
    );
    const output = new Float32Array(rendered.samples.length);
    output.set(rendered.samples);
    normalizeOutput(output);
    return encodeMonoPcm16(output, rendered.sampleRate);
  }

  const regions = selectSfzRegions(instrument.sfz, midiNote, velocity);

  if (regions.length === 0) {
    throw new NoteScriptError(
      'SFZ instrument "' + instrument.addon.name + '" has no region for MIDI note ' +
      midiNote + " at velocity " + velocity + "."
    );
  }

  const output = new Float32Array(Math.ceil((holdSeconds + tailSeconds) * sampleRate));
  const durationFrames = Math.max(1, Math.round(holdSeconds * sampleRate));

  for (const region of regions) {
    const source = getAudio(region.sampleFile);
    renderResampled(
      source,
      output,
      0,
      durationFrames,
      sfzPitchRatio(region, midiNote),
      (velocity / 127) * dbToGain(region.volumeDb),
      sampleRate,
      {
        sourceOffsetFrames: region.offset,
        sourceEndFrame: region.end,
        attackSeconds: region.attackSeconds,
        releaseSeconds: Math.min(region.releaseSeconds, tailSeconds)
      }
    );
  }

  normalizeOutput(output);
  return encodeMonoPcm16(output, sampleRate);
}
