import path from "node:path";
import { spawn } from "node:child_process";
import { getFluidSynthCapabilities } from "../instrument/fluidsynth.js";
import { NoteScriptError } from "../error.js";

function clampInteger(value, min, max, name) {
  const parsed = Number.parseInt(String(value), 10);
  if (!Number.isInteger(parsed) || parsed < min || parsed > max) {
    throw new NoteScriptError(name + " must be between " + min + " and " + max + ".");
  }
  return parsed;
}

function trimTail(text, max = 16000) {
  if (text.length <= max) return text;
  return text.slice(text.length - max);
}

export function buildFluidSynthLiveArgs(addon, options = {}) {
  const sampleRate = options.sampleRate || 44100;
  const gain = options.gain ?? 0.7;
  const audioDriver = options.audioDriver || (process.platform === "win32" ? "wasapi" : null);

  const args = [
    "-n",
    "-q",
    "-R", "0",
    "-C", "0",
    "-r", String(sampleRate),
    "-g", String(gain)
  ];

  if (audioDriver) args.push("-a", audioDriver);
  args.push(addon.entryPath);
  return args;
}

export class FluidSynthLiveSession {
  constructor(addon, options = {}) {
    this.addon = addon;
    this.portableRoot = options.portableRoot || process.cwd();
    this.sampleRate = options.sampleRate || 44100;
    this.gain = options.gain ?? 0.7;
    this.audioDriver = options.audioDriver || (process.platform === "win32" ? "wasapi" : null);
    this.startupTimeoutMs = options.startupTimeoutMs || 5000;

    this.process = null;
    this.ready = false;
    this.stopping = false;
    this.stdoutTail = "";
    this.stderrTail = "";
    this.activeNotes = new Set();
    this.sustainEnabled = false;
    this.backend = null;
    this.startedAt = null;
    this.lastError = null;
  }

  async start() {
    if (this.ready && this.process && !this.process.killed) return this.status();
    if (this.process) throw new NoteScriptError("FluidSynth live session is already starting.");

    const backend = getFluidSynthCapabilities(this.portableRoot);
    if (!backend.available) {
      throw new NoteScriptError(
        "FluidSynth is required for live SF2/SF3 playback. Put it in tools/fluidsynth, " +
        "set NOTESCRIPT_FLUIDSYNTH, or make fluidsynth available on PATH."
      );
    }

    this.backend = backend;
    const args = buildFluidSynthLiveArgs(this.addon, {
      sampleRate: this.sampleRate,
      gain: this.gain,
      audioDriver: this.audioDriver
    });

    const cwd = backend.command.includes(path.sep)
      ? path.dirname(backend.command)
      : path.dirname(this.addon.entryPath);

    const child = spawn(backend.command, args, {
      cwd,
      windowsHide: true,
      stdio: ["pipe", "pipe", "pipe"]
    });

    this.process = child;
    this.startedAt = Date.now();

    return new Promise((resolve, reject) => {
      let settled = false;
      const timeout = setTimeout(() => {
        if (settled) return;
        settled = true;
        this.lastError = "Timed out waiting for FluidSynth live shell.";
        try { child.kill(); } catch {}
        reject(new NoteScriptError(this.lastError));
      }, this.startupTimeoutMs);

      const fail = (message) => {
        if (settled) return;
        settled = true;
        clearTimeout(timeout);
        this.lastError = message;
        reject(new NoteScriptError(message));
      };

      const becomeReady = () => {
        if (settled || this.ready) return;
        settled = true;
        clearTimeout(timeout);
        this.ready = true;

        const bank = Number.isInteger(this.addon.bank) ? this.addon.bank : 0;
        const preset = Number.isInteger(this.addon.preset) ? this.addon.preset : 0;

        // A fresh FluidSynth process that receives one positional SoundFont loads it as sfid=1.
        this.send("select 0 1 " + bank + " " + preset);
        resolve(this.status());
      };

      child.stdout.on("data", (chunk) => {
        const text = chunk.toString("utf8");
        this.stdoutTail = trimTail(this.stdoutTail + text);
        if (text.includes("> ") || this.stdoutTail.includes("> ")) becomeReady();
      });

      child.stderr.on("data", (chunk) => {
        this.stderrTail = trimTail(this.stderrTail + chunk.toString("utf8"));
      });

      child.once("error", (error) => {
        fail("FluidSynth live process failed to start: " + error.message);
      });

      child.once("exit", (code, signal) => {
        const wasReady = this.ready;
        this.ready = false;
        this.process = null;
        this.activeNotes.clear();
        this.sustainEnabled = false;

        if (!this.stopping && !wasReady) {
          fail(
            "FluidSynth live process exited during startup" +
            (code !== null ? " with code " + code : "") +
            (signal ? " (" + signal + ")" : "") +
            (this.stderrTail ? ": " + this.stderrTail.trim() : ".")
          );
        }
      });
    });
  }

  send(command) {
    if (!this.process || !this.process.stdin || this.process.stdin.destroyed) {
      throw new NoteScriptError("FluidSynth live process is not available.");
    }
    this.process.stdin.write(command + "\n");
  }

  noteOn(note, velocity = 96) {
    this.assertReady();
    const midi = clampInteger(note, 0, 127, "note");
    const vel = clampInteger(velocity, 1, 127, "velocity");
    this.send("noteon 0 " + midi + " " + vel);
    this.activeNotes.add(midi);
    return this.status();
  }

  noteOff(note) {
    this.assertReady();
    const midi = clampInteger(note, 0, 127, "note");
    this.send("noteoff 0 " + midi);
    this.activeNotes.delete(midi);
    return this.status();
  }

  sustain(enabled) {
    this.assertReady();
    this.sustainEnabled = Boolean(enabled);
    this.send("cc 0 64 " + (this.sustainEnabled ? "127" : "0"));
    return this.status();
  }

  allNotesOff() {
    if (!this.ready) return this.status();
    this.send("cc 0 64 0");
    this.send("cc 0 123 0");
    this.sustainEnabled = false;
    this.activeNotes.clear();
    return this.status();
  }

  assertReady() {
    if (!this.ready || !this.process) {
      throw new NoteScriptError("Live SoundFont engine is not ready.");
    }
  }

  async stop() {
    if (!this.process) {
      this.ready = false;
      this.activeNotes.clear();
      this.sustainEnabled = false;
      return this.status();
    }

    this.stopping = true;
    const child = this.process;

    try {
      if (this.ready) {
        try { this.allNotesOff(); } catch {}
        try { this.send("quit"); } catch {}
      }
    } finally {
      await new Promise((resolve) => {
        let resolved = false;
        const done = () => {
          if (resolved) return;
          resolved = true;
          resolve();
        };

        child.once("exit", done);
        setTimeout(() => {
          if (child.exitCode === null && !child.killed) {
            try { child.kill(); } catch {}
          }
          done();
        }, 350);
      });

      this.process = null;
      this.ready = false;
      this.stopping = false;
      this.activeNotes.clear();
      this.sustainEnabled = false;
    }

    return this.status();
  }

  status() {
    return {
      backend: "fluidsynth",
      available: Boolean(this.backend?.available),
      ready: this.ready,
      pid: this.process?.pid ?? null,
      instrument: this.addon.id,
      instrumentName: this.addon.name,
      format: this.addon.format,
      audioDriver: this.audioDriver,
      sampleRate: this.sampleRate,
      activeNotes: [...this.activeNotes].sort((a, b) => a - b),
      activeNoteCount: this.activeNotes.size,
      sustain: this.sustainEnabled,
      startedAt: this.startedAt,
      backendVersion: this.backend?.version ?? null,
      lastError: this.lastError
    };
  }
}
