import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { readWav } from "../sound/wav.js";
import { NoteScriptError } from "../error.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const sourceRoot = path.resolve(here, "..", "..");
const portableRoot = process.env.NOTESCRIPT_ROOT ? path.resolve(process.env.NOTESCRIPT_ROOT) : sourceRoot;

const FFMPEG_EXTENSIONS = new Set([
  ".wav", ".flac", ".ogg", ".oga", ".opus", ".aif", ".aiff", ".mp3", ".m4a"
]);

function ffmpegCandidates() {
  const candidates = [];
  if (process.env.NOTESCRIPT_FFMPEG) candidates.push(process.env.NOTESCRIPT_FFMPEG);

  const portableExe = path.join(portableRoot, "tools", "ffmpeg", process.platform === "win32" ? "ffmpeg.exe" : "ffmpeg");
  if (fs.existsSync(portableExe)) candidates.push(portableExe);

  candidates.push("ffmpeg");
  return [...new Set(candidates)];
}

function probeFfmpeg() {
  for (const command of ffmpegCandidates()) {
    const probe = spawnSync(command, ["-version"], {
      windowsHide: true,
      encoding: "utf8",
      timeout: 4000
    });
    if (!probe.error && probe.status === 0) {
      return {
        available: true,
        command,
        version: String(probe.stdout || "").split(/\r?\n/)[0].trim()
      };
    }
  }
  return { available: false, command: null, version: null };
}

export function getDecoderCapabilities() {
  const ffmpeg = probeFfmpeg();
  return {
    native: {
      wavPcm16: true
    },
    ffmpeg: {
      ...ffmpeg,
      formats: ffmpeg.available
        ? ["WAV", "FLAC", "OGG", "OPUS", "AIFF", "MP3", "M4A"]
        : []
    }
  };
}

function decodeWithFfmpeg(file, sampleRate) {
  const ffmpeg = probeFfmpeg();
  if (!ffmpeg.available) {
    throw new NoteScriptError(
      "FFmpeg decoder is required for this audio file. Put ffmpeg in tools/ffmpeg, " +
      "set NOTESCRIPT_FFMPEG, or make ffmpeg available on PATH."
    );
  }

  const args = [
    "-v", "error",
    "-i", file,
    "-f", "f32le",
    "-ac", "1",
    "-ar", String(sampleRate),
    "pipe:1"
  ];

  const result = spawnSync(ffmpeg.command, args, {
    windowsHide: true,
    encoding: null,
    maxBuffer: 256 * 1024 * 1024,
    timeout: 60000
  });

  if (result.error) {
    throw new NoteScriptError("FFmpeg decoder could not be started: " + result.error.message);
  }
  if (result.status !== 0) {
    const stderr = Buffer.isBuffer(result.stderr)
      ? result.stderr.toString("utf8").trim()
      : String(result.stderr || "").trim();
    throw new NoteScriptError(
      "FFmpeg could not decode audio: " + path.basename(file) +
      (stderr ? " — " + stderr : "")
    );
  }

  const buffer = Buffer.from(result.stdout || []);
  const frames = Math.floor(buffer.length / 4);
  const samples = new Float32Array(frames);
  for (let i = 0; i < frames; i += 1) {
    samples[i] = buffer.readFloatLE(i * 4);
  }

  return {
    sampleRate,
    samples,
    decoder: "ffmpeg"
  };
}

export function decodeAudioFile(file, options = {}) {
  const ext = path.extname(file).toLowerCase();
  const targetSampleRate = options.sampleRate || 44100;

  if (ext === ".wav") {
    try {
      const native = readWav(file);
      return { ...native, decoder: "native-wav-pcm16" };
    } catch (error) {
      const caps = getDecoderCapabilities();
      if (!caps.ffmpeg.available) throw error;
      return decodeWithFfmpeg(file, targetSampleRate);
    }
  }

  if (!FFMPEG_EXTENSIONS.has(ext)) {
    throw new NoteScriptError(
      'Unsupported audio extension "' + ext + '". Supported through adapters: ' +
      [...FFMPEG_EXTENSIONS].sort().join(", ")
    );
  }

  return decodeWithFfmpeg(file, targetSampleRate);
}
