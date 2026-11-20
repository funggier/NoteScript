import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import { PianoVoiceRegistry } from "../src/control/ui/piano-voices.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const app = fs.readFileSync(path.join(here, "..", "src", "control", "ui", "app.js"), "utf8");

function section(startMarker, endMarker) {
  const start = app.indexOf(startMarker);
  const end = app.indexOf(endMarker, start);
  assert.ok(start >= 0 && end > start, "Could not locate Studio section: " + startMarker);
  return app.slice(start, end);
}

function harness() {
  const started = [];
  const stopped = [];
  const allSources = [];
  const context = {
    currentTime: 2,
    destination: { kind: "output" },
    createBufferSource() {
      const source = {
        buffer: null,
        playbackRate: { value: 1 },
        connect() {},
        disconnect() {},
        start() { started.push(this); },
        stop(time) { stopped.push({ source: this, time }); }
      };
      allSources.push(source);
      return source;
    },
    createGain() {
      return {
        gain: {
          value: 1,
          cancelScheduledValues() {},
          setValueAtTime(value) { this.value = value; },
          exponentialRampToValueAtTime(value) { this.value = value; }
        },
        connect() {},
        disconnect() {}
      };
    },
    createDynamicsCompressor() {
      return {
        threshold: { value: 0 },
        knee: { value: 0 },
        ratio: { value: 1 },
        attack: { value: 0 },
        release: { value: 0 },
        connect() {}
      };
    }
  };
  const state = {
    pianoVoices: new PianoVoiceRegistry(),
    pianoOutput: null,
    selected: { id: "sound/test", type: "pitched", samples: [{ midi: 60 }] },
    sourceMode: "sound",
    velocity: 96,
    liveVoices: new Map(),
    liveMidiRefs: new Map(),
    sustainedPedal: true
  };
  const sandbox = {
    state,
    document: { querySelectorAll: () => [] },
    isLiveSoundFont: () => false,
    nearestRoot: () => ({ midi: 60 }),
    ensureAudio: () => context,
    loadRootBuffer: async () => ({ duration: 3 }),
    noteName: (midi) => String(midi),
    setVoiceCount: () => {},
    setMonitor: () => {},
    currentSustain: () => state.sustainedPedal
  };
  vm.createContext(sandbox);
  vm.runInContext(
    section("function pianoOutput(context) {", "const BEATLANE6_INPUT_KEYS") +
    section("function releaseVoice(voice, fast = false) {", "function isLiveSoundFont()") +
    section("async function noteOn(midi, id) {", "function syncSustain()") +
    "\nthis.playback = { noteOn, noteOff, releaseSustained };",
    sandbox
  );
  return { playback: sandbox.playback, state, started, stopped, allSources };
}

test("Studio WebAudio retriggers an independent instance while sustain keeps the old one", async () => {
  const { playback, state, started, stopped, allSources } = harness();
  await playback.noteOn(60, "keyboard:a");
  assert.equal(started.length, 1);

  // OS repeat while still holding the physical key does not create new sound.
  await playback.noteOn(60, "keyboard:a");
  assert.equal(started.length, 1);

  playback.noteOff("keyboard:a");
  assert.equal(stopped.length, 0, "sustain keeps the first sample playing");
  await playback.noteOn(60, "keyboard:a");
  assert.equal(started.length, 2, "second strike must start a second buffer source");
  assert.notEqual(started[0], started[1]);
  assert.equal(state.pianoVoices.sounding.size, 2);

  // Releasing the pedal damps the earlier note, but not the currently held key.
  state.sustainedPedal = false;
  playback.releaseSustained();
  assert.equal(stopped.length, 1);
  assert.equal(stopped[0].source, allSources[0]);
  assert.equal(state.pianoVoices.held.get("keyboard:a").source, allSources[1]);
  playback.noteOff("keyboard:a");
  assert.equal(stopped.length, 2);
  assert.equal(stopped[1].source, allSources[1]);

  for (const source of allSources) source.onended();
  assert.equal(state.pianoVoices.sounding.size, 0);
});

test("Studio WebAudio naturally tails off repeated key strikes without sustain", async () => {
  const { playback, state, started, stopped } = harness();
  state.sustainedPedal = false;
  await playback.noteOn(60, "keyboard:a");
  playback.noteOff("keyboard:a");
  assert.equal(stopped.length, 1);
  await playback.noteOn(60, "keyboard:a");
  assert.equal(started.length, 2);
  assert.equal(stopped.length, 1, "the first release tail must not block the second note");
});
