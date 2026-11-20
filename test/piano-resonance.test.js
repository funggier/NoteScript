import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  DEFAULT_PIANO_RESONANCE,
  normalizePianoResonance,
  pianoResonatorModes,
  PianoSympatheticResonance
} from "../src/control/ui/piano-resonance.js";
import { createControlService } from "../src/control/service.js";

function parameter(value = 0) {
  return {
    value,
    history: [],
    cancelScheduledValues(at) { this.history.push(["cancel", at]); },
    setTargetAtTime(value, at, seconds) {
      this.history.push(["target", value, at, seconds]);
      this.value = value;
    },
    setValueAtTime(value, at) {
      this.history.push(["set", value, at]);
      this.value = value;
    }
  };
}

function fakeAudioContext() {
  const nodes = [];
  const context = {
    currentTime: 3,
    createGain() {
      const node = {
        type: "gain", gain: parameter(1), outputs: [],
        connect(other) { this.outputs.push(other); },
        disconnect() { this.outputs = []; }
      };
      nodes.push(node);
      return node;
    },
    createBiquadFilter() {
      const node = {
        type: "bandpass", frequency: parameter(0), Q: parameter(0), outputs: [],
        connect(other) { this.outputs.push(other); },
        disconnect() { this.outputs = []; }
      };
      nodes.push(node);
      return node;
    }
  };
  return { context, nodes };
}

test("resonance preferences are safe, bounded and opt-in by default", () => {
  assert.deepEqual(DEFAULT_PIANO_RESONANCE, { enabled: false, level: 28 });
  assert.deepEqual(normalizePianoResonance(), { enabled: false, level: 28 });
  assert.deepEqual(normalizePianoResonance({ enabled: true, level: 201 }), { enabled: true, level: 100 });
  assert.deepEqual(normalizePianoResonance({ enabled: false, level: -5 }), { enabled: false, level: 0 });
  assert.deepEqual(normalizePianoResonance({ enabled: 1, level: "bad" }), { enabled: false, level: 28 });
});

test("piano sympathetic modes are finite, tuned and stable", () => {
  const modes = pianoResonatorModes();
  assert.equal(modes.length, 61);
  assert.equal(modes[0].midi, 36);
  assert.equal(modes.at(-1).midi, 96);
  for (let i = 0; i < modes.length; i++) {
    const mode = modes[i];
    assert.ok(Number.isFinite(mode.frequency));
    assert.ok(mode.frequency > 60 && mode.frequency < 3000);
    assert.ok(mode.q >= 160 && mode.q <= 900);
    if (i > 0) assert.ok(mode.frequency > modes[i - 1].frequency);
  }
  assert.ok(Math.abs(modes[33].frequency - 440) < 0.001);
});

test("resonance is pedal-gated, low-level, reused and can be muted immediately", () => {
  const { context, nodes } = fakeAudioContext();
  const output = { name: "master" };
  const resonance = new PianoSympatheticResonance(context, output);
  assert.equal(resonance.filters.length, 61);
  assert.equal(nodes.length, 63);
  assert.equal(resonance.wet.outputs[0], output);
  assert.equal(resonance.input.gain.value, 0);
  assert.equal(resonance.wet.gain.value, 0);

  resonance.update({ enabled: true, level: 28 }, 0);
  assert.equal(resonance.input.gain.value, 0);
  assert.equal(resonance.wet.gain.value, 0);

  resonance.update({ enabled: true, level: 28 }, 127);
  assert.equal(resonance.input.gain.value, 1);
  assert.ok(resonance.wet.gain.value > 0);
  assert.ok(resonance.wet.gain.value < 0.04);

  resonance.update({ enabled: true, level: 28 }, 40);
  assert.ok(resonance.wet.gain.value < 0.015);
  resonance.update({ enabled: true, level: 100 }, 127);
  assert.ok(resonance.wet.gain.value <= 0.11);
  assert.equal(nodes.length, 63, "pedal movements must not allocate more filters");

  resonance.update({ enabled: true, level: 100 }, 127, false);
  assert.equal(resonance.wet.gain.value, 0, "no resonance outside sampled sound piano");
  resonance.update({ enabled: true, level: 50 }, 127);
  resonance.mute();
  assert.equal(resonance.input.gain.value, 0);
  assert.equal(resonance.wet.gain.value, 0);
  resonance.disconnect();
  assert.equal(resonance.filters.length, 0);
  assert.equal(resonance.input.outputs.length, 0);
  assert.equal(resonance.wet.outputs.length, 0);
});

test("resonance preferences persist in the portable project's config/studio.json", (t) => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "notescript-resonance-settings-"));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const service = createControlService(dir);
  assert.deepEqual(service.getStudioSettings().pianoResonance, { enabled: false, level: 28 });
  service.saveStudioSettings({ pianoResonance: { enabled: true, level: 43 } });
  assert.deepEqual(service.getStudioSettings().pianoResonance, { enabled: true, level: 43 });
  const stored = JSON.parse(fs.readFileSync(path.join(dir, "config", "studio.json"), "utf8"));
  assert.deepEqual(stored.pianoResonance, { enabled: true, level: 43 });
  service.saveStudioSettings({ editorMode: "tracks" });
  assert.deepEqual(service.getStudioSettings().pianoResonance, { enabled: true, level: 43 });
  service.saveStudioSettings({ pianoResonance: { level: 400 } });
  assert.deepEqual(service.getStudioSettings().pianoResonance, { enabled: true, level: 100 });
});
