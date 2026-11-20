import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import { PianoVoiceRegistry, pianoVelocity, pianoDamperReleaseSeconds } from "../src/control/ui/piano-voices.js";

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
  const allGains = [];
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
      const node = {
        gain: {
          value: 1,
          cancelScheduledValues() {},
          setValueAtTime(value) { this.value = value; },
          exponentialRampToValueAtTime(value) { this.value = value; }
        },
        connect() {},
        disconnect() {}
      };
      allGains.push(node);
      return node;
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
    sustainedPedal: true,
    pedalValue: 127
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
    currentSustain: () => state.sustainedPedal,
    currentPedalValue: () => state.pedalValue,
    pianoVelocity,
    pianoDamperReleaseSeconds
  };
  vm.createContext(sandbox);
  vm.runInContext(
    section("function pianoOutput(context) {", "const BEATLANE6_INPUT_KEYS") +
    section("function releaseVoice(voice, fast = false) {", "function isLiveSoundFont()") +
    section("async function noteOn(midi, id, velocity = state.velocity) {", "function syncSustain()") +
    "\nthis.playback = { noteOn, noteOff, releaseSustained };",
    sandbox
  );
  return { playback: sandbox.playback, state, started, stopped, allSources, allGains };
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
  state.pedalValue = 0;
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

test("Studio WebAudio preserves individual MIDI strike velocity", async () => {
  const { playback, allGains, started } = harness();
  await playback.noteOn(60, "midi:input:0:60", 20);
  await playback.noteOn(62, "midi:input:0:62", 120);
  assert.equal(started.length, 2);
  assert.ok(allGains[0].gain.value < allGains[1].gain.value);
  assert.ok(allGains[0].gain.value < 0.2);
  assert.ok(allGains[1].gain.value > 0.7);
});

test("Studio WebAudio damper release varies with pitch and half-pedal depth", async () => {
  const { playback, state, stopped } = harness();
  state.sustainedPedal = false;
  state.pedalValue = 0;
  await playback.noteOn(36, "keyboard:a");
  playback.noteOff("keyboard:a");
  await playback.noteOn(96, "keyboard:b");
  playback.noteOff("keyboard:b");
  assert.ok(stopped[0].time > stopped[1].time, "low register has a slightly longer damper release");

  state.pedalValue = 52; // partial pedal: below the fully-sustaining CC64 threshold
  await playback.noteOn(36, "keyboard:c");
  playback.noteOff("keyboard:c");
  assert.ok(stopped[2].time > stopped[0].time, "half pedal delays the damper");
});

test("Studio MIDI dispatch passes note velocity and continuous CC64 depth", () => {
  const noteEvents = [];
  const ccValues = [];
  const midiState = { midiSustainValue: 0, midiSustain: false };
  const sandbox = {
    state: midiState,
    noteOn: (note, id, velocity) => noteEvents.push({ note, id, velocity }),
    noteOff: (id) => noteEvents.push({ off: id }),
    syncSustain: () => ccValues.push(midiState.midiSustainValue),
    panicAll: () => {}
  };
  vm.createContext(sandbox);
  vm.runInContext(
    section("function handleMidiMessage(input, event) {", "async function enableMidiInput()") +
    "\nthis.dispatch = handleMidiMessage;",
    sandbox
  );
  const source = { id: "device1" };
  sandbox.dispatch(source, { data: [0x90, 60, 25] });
  sandbox.dispatch(source, { data: [0x80, 60, 0] });
  sandbox.dispatch(source, { data: [0xb0, 64, 49] });
  sandbox.dispatch(source, { data: [0xb0, 64, 108] });
  sandbox.dispatch(source, { data: [0xb0, 64, 0] });
  assert.equal(noteEvents[0].note, 60);
  assert.equal(noteEvents[0].velocity, 25);
  assert.match(noteEvents[0].id, /^midi:device1:0:60$/);
  assert.equal(noteEvents[1].off, noteEvents[0].id);
  assert.deepEqual(ccValues, [49, 108, 0]);
  assert.equal(midiState.midiSustain, false);
});

test("Studio WebAudio naturally tails off repeated key strikes without sustain", async () => {
  const { playback, state, started, stopped } = harness();
  state.sustainedPedal = false;
  state.pedalValue = 0;
  await playback.noteOn(60, "keyboard:a");
  playback.noteOff("keyboard:a");
  assert.equal(stopped.length, 1);
  await playback.noteOn(60, "keyboard:a");
  assert.equal(started.length, 2);
  assert.equal(stopped.length, 1, "the first release tail must not block the second note");
});
