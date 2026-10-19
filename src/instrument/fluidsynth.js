import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { buildSingleTrackMidiBuffer } from "../midi.js";
import { decodeAudioFile } from "../audio/decoder.js";
import { NoteScriptError } from "../error.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const sourceRoot = path.resolve(here, "..", "..");
const defaultPortableRoot = process.env.NOTESCRIPT_ROOT
  ? path.resolve(process.env.NOTESCRIPT_ROOT)
  : sourceRoot;

function candidates(portableRoot = defaultPortableRoot) {
  const list = [];
  if (process.env.NOTESCRIPT_FLUIDSYNTH) {
    list.push(process.env.NOTESCRIPT_FLUIDSYNTH);
  }

  const root = path.resolve(portableRoot || defaultPortableRoot);
  const exeName = process.platform === "win32" ? "fluidsynth.exe" : "fluidsynth";
  const portableCandidates = [
    path.join(root, "tools", "fluidsynth", "bin", exeName),
    path.join(root, "tools", "fluidsynth", exeName)
  ];
  for (const candidate of portableCandidates) {
    if (fs.existsSync(candidate)) list.push(candidate);
  }

  list.push("fluidsynth");
  return [...new Set(list)];
}

export function getFluidSynthCapabilities(portableRoot = defaultPortableRoot) {
  for (const command of candidates(portableRoot)) {
    const result = spawnSync(command, ["--version"], {
      windowsHide: true,
      encoding: "utf8",
      timeout: 5000
    });

    if (!result.error && result.status === 0) {
      const output = [result.stdout, result.stderr]
        .filter(Boolean)
        .join("\n")
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);

      return {
        available: true,
        command,
        version: output[0] || "FluidSynth"
      };
    }
  }

  return {
    available: false,
    command: null,
    version: null
  };
}

function invokeFluidSynth(soundfontFile, midiFile, outputFile, options = {}) {
  const portableRoot = options.portableRoot || defaultPortableRoot;
  const capability = getFluidSynthCapabilities(portableRoot);

  if (!capability.available) {
    throw new NoteScriptError(
      "FluidSynth is required for SF2/SF3 rendering. Put an official build under " +
      "tools/fluidsynth, set NOTESCRIPT_FLUIDSYNTH, or make fluidsynth available on PATH."
    );
  }

  const sampleRate = options.sampleRate || 44100;
  const gain = options.gain ?? 0.8;

  const args = [
    "-n",
    "-i",
    "-q",
    "-R", "0",
    "-C", "0",
    "-r", String(sampleRate),
    "-g", String(gain),
    "-T", "wav",
    "-F", outputFile,
    soundfontFile,
    midiFile
  ];

  const result = spawnSync(capability.command, args, {
    windowsHide: true,
    encoding: "utf8",
    timeout: options.timeoutMs || 60000,
    cwd: path.dirname(capability.command.includes(path.sep)
      ? capability.command
      : soundfontFile)
  });

  if (result.error) {
    throw new NoteScriptError("FluidSynth could not start: " + result.error.message);
  }

  if (result.status !== 0 || !fs.existsSync(outputFile)) {
    const diagnostic = [result.stderr, result.stdout]
      .filter(Boolean)
      .join("\n")
      .trim();
    throw new NoteScriptError(
      "FluidSynth render failed" + (diagnostic ? ": " + diagnostic : ".")
    );
  }

  return capability;
}

function withTempFiles(callback) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "notescript-fluidsynth-"));
  try {
    return callback(directory);
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
}

export function renderSoundFontTrack(addon, config, track, options = {}) {
  if (!["SF2", "SF3"].includes(addon.format)) {
    throw new NoteScriptError("SoundFont adapter accepts SF2 or SF3 instruments.");
  }

  return withTempFiles((directory) => {
    const midiFile = path.join(directory, "track.mid");
    const wavFile = path.join(directory, "track.wav");

    const midi = buildSingleTrackMidiBuffer(config, track, {
      bank: Number.isInteger(addon.bank) ? addon.bank : 0,
      preset: Number.isInteger(addon.preset) ? addon.preset : 0,
      channel: 0
    });
    fs.writeFileSync(midiFile, midi);

    const capability = invokeFluidSynth(addon.entryPath, midiFile, wavFile, options);
    const decoded = decodeAudioFile(wavFile, {
      sampleRate: options.sampleRate || 44100
    });

    return {
      ...decoded,
      backend: "fluidsynth",
      backendVersion: capability.version
    };
  });
}

export function renderSoundFontNote(addon, midiNote, velocity = 96, options = {}) {
  const holdSeconds = options.holdSeconds ?? 1.4;
  const tailSeconds = options.tailSeconds ?? 1.0;
  const tempo = 60;
  const durationQuarter = holdSeconds;

  const track = {
    events: [
      {
        kind: "note",
        note: midiNote,
        noteName: String(midiNote),
        startQuarter: 0,
        durationQuarter,
        velocity
      }
    ]
  };

  const config = {
    tempo,
    ppq: 480
  };

  const rendered = renderSoundFontTrack(addon, config, track, options);
  const sampleRate = rendered.sampleRate;
  const maxFrames = Math.min(
    rendered.samples.length,
    Math.ceil((holdSeconds + tailSeconds) * sampleRate)
  );

  return {
    sampleRate,
    samples: rendered.samples.subarray(0, maxFrames),
    backend: rendered.backend,
    backendVersion: rendered.backendVersion
  };
}
