import path from "node:path";
import { loadInstrumentAddon, resolveInstrumentAddon } from "../instrument/addon.js";
import { FluidSynthLiveSession } from "./fluidsynth-live.js";
import { NoteScriptError } from "../error.js";

export class LivePlaybackManager {
  constructor(programRoot, options = {}) {
    this.root = path.resolve(programRoot);
    this.options = {
      sampleRate: options.sampleRate || 44100,
      gain: options.gain ?? 0.7,
      audioDriver: options.audioDriver || (process.platform === "win32" ? "wasapi" : null)
    };
    this.session = null;
    this.state = "idle";
    this.lastError = null;
    this.selectedInstrument = null;
  }

  async selectInstrument(instrumentId) {
    const id = String(instrumentId || "").trim();
    if (!id) throw new NoteScriptError("Live playback requires an instrument id.");

    if (
      this.session &&
      this.session.ready &&
      this.selectedInstrument === id
    ) {
      return this.status();
    }

    await this.stop();

    const songFile = path.join(this.root, "projects", "__live__.md");
    const directory = resolveInstrumentAddon(id, songFile, this.root);
    const addon = loadInstrumentAddon(directory);

    if (!["SF2", "SF3"].includes(addon.format)) {
      throw new NoteScriptError(
        "Persistent server-side live playback currently targets SF2/SF3. " +
        addon.format + " continues to use the browser audition path."
      );
    }

    this.state = "starting";
    this.lastError = null;
    this.selectedInstrument = id;

    const session = new FluidSynthLiveSession(addon, {
      portableRoot: this.root,
      sampleRate: this.options.sampleRate,
      gain: this.options.gain,
      audioDriver: this.options.audioDriver
    });

    this.session = session;

    try {
      await session.start();
      this.state = "ready";
      return this.status();
    } catch (error) {
      this.state = "error";
      this.lastError = error.message || String(error);
      this.session = null;
      throw error;
    }
  }

  noteOn(note, velocity = 96) {
    this.requireReady();
    this.session.noteOn(note, velocity);
    return this.status();
  }

  noteOff(note) {
    this.requireReady();
    this.session.noteOff(note);
    return this.status();
  }

  sustain(enabled) {
    this.requireReady();
    this.session.sustain(enabled);
    return this.status();
  }

  allNotesOff() {
    if (this.session?.ready) this.session.allNotesOff();
    return this.status();
  }

  requireReady() {
    if (!this.session || !this.session.ready || this.state !== "ready") {
      throw new NoteScriptError("Live playback engine is not ready.");
    }
  }

  async stop() {
    const previous = this.session;
    this.session = null;
    this.selectedInstrument = null;

    if (previous) {
      this.state = "stopping";
      try {
        await previous.stop();
      } finally {
        this.state = "idle";
      }
    } else {
      this.state = "idle";
    }

    return this.status();
  }

  async shutdown() {
    return this.stop();
  }

  status() {
    const session = this.session ? this.session.status() : null;
    let state = this.state;
    let lastError = this.lastError;

    if (state === "ready" && session && !session.ready) {
      state = "error";
      lastError = session.lastError || "Live playback process exited unexpectedly.";
    }

    return {
      state,
      selectedInstrument: this.selectedInstrument,
      lastError,
      session
    };
  }
}
