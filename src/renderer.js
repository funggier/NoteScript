import fs from "node:fs";
import path from "node:path";
import { compileTimeline, quarterToSeconds } from "./timeline.js";
import { loadSoundPack, resolvePitchedSample } from "./sound/pack.js";
import { resolveSoundPackDirectory } from "./sound/resolver.js";
import { encodeMonoPcm16, readWav } from "./sound/wav.js";
import { NoteScriptError } from "./error.js";

function mixSample(buffer, index, value) {
  if (index >= 0 && index < buffer.length) buffer[index] += value;
}

function renderResampled(source, output, startFrame, durationFrames, pitchRatio, gain, outRate) {
  const sourceStep = (source.sampleRate / outRate) * pitchRatio;
  const availableFrames = Math.min(durationFrames, Math.floor(source.samples.length / sourceStep));
  const fadeFrames = Math.max(1, Math.min(Math.floor(outRate * 0.02), Math.floor(availableFrames / 4)));

  for (let i = 0; i < availableFrames; i += 1) {
    const srcPos = i * sourceStep;
    const a = Math.floor(srcPos);
    const b = Math.min(a + 1, source.samples.length - 1);
    const frac = srcPos - a;
    const sample = source.samples[a] * (1 - frac) + source.samples[b] * frac;
    let envelope = 1;
    if (i < fadeFrames) envelope *= i / fadeFrames;
    if (i >= availableFrames - fadeFrames) envelope *= (availableFrames - i - 1) / fadeFrames;
    mixSample(output, startFrame + i, sample * gain * Math.max(0, envelope));
  }
}

export function renderToWav(song, songFile, outputFile, options = {}) {
  const timeline = compileTimeline(song);
  const sampleRate = options.sampleRate || 44100;
  const tailSeconds = options.tailSeconds ?? 0.25;
  const endSeconds = quarterToSeconds(timeline.endQuarter, song.config.tempo) + tailSeconds;
  const output = new Float32Array(Math.max(1, Math.ceil(endSeconds * sampleRate)));
  const wavCache = new Map();
  const packCache = new Map();
  const portableRoot = options.portableRoot ? path.resolve(options.portableRoot) : null;

  function getWav(file) {
    if (!wavCache.has(file)) wavCache.set(file, readWav(file));
    return wavCache.get(file);
  }

  function getPack(soundRef) {
    const packDir = resolveSoundPackDirectory(soundRef, songFile, portableRoot);
    if (!packCache.has(packDir)) packCache.set(packDir, loadSoundPack(packDir));
    return packCache.get(packDir);
  }

  for (const track of timeline.tracks) {
    if (track.instrument) {
      throw new NoteScriptError(
        'Instrument add-on rendering for "' + track.instrument + '" is not enabled in the v0.1 audio backend yet. Use a sound add-on for rendering in this baseline.',
        track.line
      );
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
          throw new NoteScriptError('Track "' + track.name + '" uses note events with non-pitched pack "' + pack.name + '".', event.line);
        }
        const mapped = resolvePitchedSample(pack, event.note);
        if (!mapped) {
          throw new NoteScriptError("No sample mapping available for " + event.noteName + ".", event.line);
        }
        const source = getWav(mapped.file);
        const pitchRatio = Math.pow(2, (event.note - mapped.rootNote) / 12);
        renderResampled(source, output, startFrame, durationFrames, pitchRatio, gain, sampleRate);
      } else if (event.kind === "trigger") {
        if (pack.type !== "kit") {
          throw new NoteScriptError('Track "' + track.name + '" uses @trigger events with non-kit pack "' + pack.name + '".', event.line);
        }
        const file = pack.triggers.get(event.trigger);
        if (!file) throw new NoteScriptError('Unknown trigger "' + event.trigger + '" in pack "' + pack.name + '".', event.line);
        renderResampled(getWav(file), output, startFrame, durationFrames, 1, gain, sampleRate);
      }
    }
  }

  let peak = 0;
  for (const sample of output) peak = Math.max(peak, Math.abs(sample));
  if (peak > 0.98) {
    const scale = 0.98 / peak;
    for (let i = 0; i < output.length; i += 1) output[i] *= scale;
  }

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
