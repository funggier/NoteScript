import test from "node:test";
import assert from "node:assert/strict";
import { PianoVoiceRegistry, pianoVelocity, pianoDamperReleaseSeconds } from "../src/control/ui/piano-voices.js";
import { FluidSynthLiveSession } from "../src/playback/fluidsynth-live.js";

test("per-note velocity is clamped and a soft MIDI strike stays softer than a hard strike", () => {
  assert.equal(pianoVelocity(20), 20);
  assert.equal(pianoVelocity(127), 127);
  assert.equal(pianoVelocity(255), 127);
  assert.equal(pianoVelocity(0), 96);
  assert.equal(pianoVelocity(Number.NaN), 96);
});

test("half pedal extends damper release without locking keys; lower notes ring longer", () => {
  const noPedalLow = pianoDamperReleaseSeconds(36, 0);
  const noPedalHigh = pianoDamperReleaseSeconds(96, 0);
  const halfLow = pianoDamperReleaseSeconds(36, 48);
  assert.ok(noPedalLow > noPedalHigh);
  assert.ok(halfLow > noPedalLow);
  assert.ok(halfLow < 1);
  assert.equal(pianoDamperReleaseSeconds(60, -100), pianoDamperReleaseSeconds(60, 0));
  assert.equal(pianoDamperReleaseSeconds(60, 64), pianoDamperReleaseSeconds(60, 63));
});

test("buffered notes can retrigger under sustain without cutting the earlier strike", () => {
  const voices = new PianoVoiceRegistry();
  const firstPress = voices.begin("keyboard:a");
  assert.ok(firstPress);
  const firstVoice = { id: "keyboard:a", midi: 60 };
  assert.equal(voices.start(firstPress, firstVoice), true);
  assert.equal(voices.begin("keyboard:a"), null, "a held key cannot auto-repeat");
  voices.noteOff("keyboard:a", true);
  assert.equal(voices.held.size, 0);
  assert.equal(voices.sounding.has(firstVoice), true);

  const secondPress = voices.begin("keyboard:a");
  assert.ok(secondPress, "re-press must not be blocked by the sustained voice");
  const secondVoice = { id: "keyboard:a", midi: 60 };
  assert.equal(voices.start(secondPress, secondVoice), true);
  assert.deepEqual([...voices.sounding], [firstVoice, secondVoice]);
  assert.equal(voices.held.get("keyboard:a"), secondVoice);

  // Pedal-up releases only already lifted notes, not a currently pressed key.
  assert.deepEqual(voices.releaseSustained(), [firstVoice]);
  assert.equal(voices.held.get("keyboard:a"), secondVoice);
  assert.equal(voices.noteOff("keyboard:a", false).voice, secondVoice);
  voices.cleanup(firstVoice);
  assert.equal(voices.sounding.has(secondVoice), true);
  voices.cleanup(secondVoice);
  assert.equal(voices.sounding.size, 0);
});

test("multiple sustain retriggers remain independently sounding until pedal-up", () => {
  const voices = new PianoVoiceRegistry();
  const sounding = [];
  for (let n = 0; n < 4; n++) {
    const pending = voices.begin("keyboard:a");
    assert.ok(pending);
    const voice = { id: "keyboard:a", midi: 60, n };
    assert.equal(voices.start(pending, voice), true);
    sounding.push(voice);
    voices.noteOff("keyboard:a", true);
  }
  assert.deepEqual([...voices.sounding], sounding);
  assert.deepEqual(voices.releaseSustained(), sounding);
  assert.equal(voices.sustained.size, 0);
  for (const voice of sounding) voices.cleanup(voice);
  assert.equal(voices.sounding.size, 0);
});

test("pending samples can retrigger before the first load finishes", () => {
  const voices = new PianoVoiceRegistry();
  const earlier = voices.begin("keyboard:a");
  voices.noteOff("keyboard:a", true);
  const later = voices.begin("keyboard:a");
  assert.notEqual(earlier, later);
  assert.equal(voices.begin("keyboard:a"), null, "the second key remains held");

  const laterVoice = { id: "keyboard:a", midi: 60, n: 2 };
  assert.equal(voices.start(later, laterVoice), true);
  const earlierVoice = { id: "keyboard:a", midi: 60, n: 1 };
  assert.equal(voices.start(earlier, earlierVoice), true);
  assert.equal(voices.held.get("keyboard:a"), laterVoice);
  assert.equal(voices.sustained.has(earlierVoice), true);
  assert.equal(voices.sounding.size, 2);
  voices.noteOff("keyboard:a", true);
  assert.equal(voices.sustained.size, 2);
});

test("lifting sustain before a sample loads cannot create a stuck sustained note", () => {
  const voices = new PianoVoiceRegistry();
  const first = voices.begin("keyboard:a");
  voices.noteOff("keyboard:a", true);
  assert.deepEqual(voices.releaseSustained(), []);
  const voice = { id: "keyboard:a", midi: 60 };
  assert.equal(voices.start(first, voice), true);
  assert.equal(first.released, true);
  assert.equal(first.sustain, false);
  assert.equal(voices.sustained.size, 0);
  assert.equal(voices.held.size, 0);
  assert.equal(voices.sounding.size, 1);
});

test("panic cancels late samples and detaches keys without leaking old voices", () => {
  const voices = new PianoVoiceRegistry();
  const existing = voices.begin("keyboard:a");
  const sound = { id: "keyboard:a", midi: 60 };
  voices.start(existing, sound);
  const waiting = voices.begin("keyboard:s");
  assert.deepEqual(voices.stop(), [sound]);
  assert.equal(waiting.cancelled, true);
  assert.equal(voices.start(waiting, { id: "keyboard:s", midi: 62 }), false);
  assert.ok(voices.begin("keyboard:a"));
  voices.cleanup(sound);
  assert.equal(voices.sounding.size, 0);
});

test("FluidSynth accepts analog pedal depth and preserves the boolean API", () => {
  const session = new FluidSynthLiveSession({ id: "SF2/Test", name: "Test", format: "SF2" });
  const commands = [];
  session.ready = true;
  session.process = { stdin: { destroyed: false, write(data) { commands.push(data.trim()); } } };
  session.sustain(42);
  assert.equal(session.status().sustain, false);
  assert.equal(session.status().sustainValue, 42);
  session.sustain(96);
  assert.equal(session.status().sustain, true);
  assert.equal(session.status().sustainValue, 96);
  session.sustain(true);
  session.sustain(false);
  assert.deepEqual(commands, [
    "cc 0 64 42", "cc 0 64 96", "cc 0 64 127", "cc 0 64 0"
  ]);
  assert.throws(() => session.sustain(128), /sustain value must be between 0 and 127/);
  assert.throws(() => session.sustain(-1), /sustain value must be between 0 and 127/);
});

test("FluidSynth issues a fresh note-on for repeated pitches with CC64 held", () => {
  const session = new FluidSynthLiveSession({ id: "SF2/Test", name: "Test", format: "SF2" });
  const commands = [];
  session.ready = true;
  session.process = { stdin: { destroyed: false, write(data) { commands.push(data.trim()); } } };
  session.sustain(true);
  session.noteOn(60, 96);
  session.noteOff(60);
  session.noteOn(60, 110);
  session.noteOff(60);
  session.sustain(false);
  assert.deepEqual(commands, [
    "cc 0 64 127",
    "noteon 0 60 96",
    "noteoff 0 60",
    "noteon 0 60 110",
    "noteoff 0 60",
    "cc 0 64 0"
  ]);
});
