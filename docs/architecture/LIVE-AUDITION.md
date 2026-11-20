# Live Audition Architecture

## Goal

NoteScript should allow a user to select a sound source and immediately test or play it like a software piano/instrument.

The feature serves two purposes:

1. fast audition of sound/instrument add-ons;
2. a foundation for serious real-time playing and later MIDI-controller input.

## Current prototype

The Control API serves NoteScript Studio at the host/port defined by:

`config/network.json`

Portable users launch it through the single entry point:

`NoteScript.cmd`

Double-clicking it opens Studio. The same file also supports `start` and `stop` for the hidden Control API process.

### Native sound packs

For pitched `sounds/<Pack>/` add-ons:

- the browser chooses the nearest mapped root sample;
- Web Audio performs pitch shifting with playback rate;
- multiple BufferSource voices can play simultaneously;
- velocity controls per-note gain, including the exact velocity of each incoming Web MIDI Note On; keyboard/mouse notes continue to use the Studio velocity slider;
- sustain delays note release without locking the input key: each new strike creates its own voice, even when the previous strike is still ringing; only physical key-down auto-repeat is suppressed;
- pedal-up damps only voices whose keys have been released, with a short register-sensitive gain envelope. Web MIDI CC64 values below 64 produce an approximate partial-pedal release tail; above that threshold released notes sustain until the pedal lifts. Sound pack recordings still have a finite duration;
- optional **String resonance (sampled)** effect: a shared, pedal-gated, 61-mode narrow-band resonator bank spanning C2-C7, driven by the sample audio itself. Its output is quiet, gain-bounded and separately adjustable 0-100%. This models a small part of the harmonic energy from undamped neighboring strings, **not** true acoustic string coupling or a measured grand-piano soundboard. Disabled by default to preserve guitar and custom-pack timbres; applied to buffered pitched SoundPiano packs, not direct FluidSynth SF2/SF3 output. A Panic immediately mutes the resonator. Preferences are stored in `config/studio.json`;
- mouse and computer keyboard input share the same note-on/note-off path.

For SoundPad add-ons the UI displays named trigger pads. New manifests use `type: soundpad`; legacy `type: kit` remains accepted.

### Standard instrument formats

SFZ audition asks the local NoteScript engine to render a note to WAV, then caches that note in the browser.

SF2/SF3 use the same browser interface, with NoteScript delegating the note render to the optional FluidSynth backend. These request/response paths are correct enough for validation/audition but are not the final low-latency performance architecture.

## Input abstraction

The long-term playback engine should expose one interface:

```text
noteOn(note, velocity, source)
noteOff(note, source)
sustain(on/off)
allNotesOff()
```

Input providers can then include:

- on-screen piano;
- computer keyboard;
- MIDI controller;
- future external/plugin control.

## NTS-003 target

For serious live playing, move note generation into a persistent low-latency audio engine:

- preloaded sample regions;
- voice pool/polyphony;
- attack/release state per voice;
- sustain pedal state;
- low-latency output device selection;
- no HTTP render round-trip for each note;
- source switching without rebuilding the application;
- MIDI input mapped to the same note interface.

The Markdown project remains untouched during audition unless explicit performance recording is enabled later.
