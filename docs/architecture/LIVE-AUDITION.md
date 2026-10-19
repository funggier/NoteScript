# Live Audition Architecture

## Goal

NoteScript should allow a user to select a sound source and immediately test or play it like a software piano/instrument.

The feature serves two purposes:

1. fast audition of sound/instrument add-ons;
2. a foundation for serious real-time playing and later MIDI-controller input.

## Current prototype

The Control API serves NoteScript Studio at the host/port defined by:

`config/network.json`

Portable users can launch it with:

`NoteScript-Studio.cmd`

The compatibility launcher `Audition-Keyboard.cmd` uses the same network configuration.

### Native sound packs

For pitched `sounds/<Pack>/` add-ons:

- the browser chooses the nearest mapped root sample;
- Web Audio performs pitch shifting with playback rate;
- multiple BufferSource voices can play simultaneously;
- velocity controls per-note gain;
- sustain delays note release;
- mouse and computer keyboard input share the same note-on/note-off path.

For kit add-ons the UI displays named trigger pads.

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
