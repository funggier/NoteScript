# Live Playback Architecture

Status: NTS-003 persistent SoundFont baseline implemented.

## Goal

Live playing must not render a temporary WAV or start a new synthesizer process for every key press.

The persistent playback layer exposes one logical interface:

```text
selectInstrument(instrument)
noteOn(note, velocity)
noteOff(note)
sustain(enabled)
allNotesOff()
stop()
status()
```

Input providers should call this interface rather than knowing how a particular sound format is synthesized.

## Current routing

### SF2 / SF3

When FluidSynth is available:

1. NoteScript starts one persistent FluidSynth process.
2. FluidSynth opens the audio device directly.
3. The selected SoundFont is loaded once.
4. NoteScript sends shell commands through stdin:
   - `noteon`
   - `noteoff`
   - sustain CC64
   - all-notes-off CC123
5. The process stays alive across notes and chords.
6. Switching SoundFont instruments stops the previous process before starting the next.
7. Stop/shutdown sends panic first and terminates the process cleanly.

Windows currently defaults to the FluidSynth `wasapi` driver.

This path does not use FluidSynth fast-render output and does not create a WAV for each note.

### SFZ

SFZ remains on the NTS-002 buffered audition path for now.

The browser asks the NoteScript engine to render/caches notes. Moving SFZ into a persistent native/sample voice engine is a later optimization and does not block the SoundFont live baseline.

### NoteScript `sounds/`

Pitched native sound packs stay in Web Audio:

- root samples are cached;
- browser playback-rate pitch shifting is used;
- multiple browser BufferSource voices provide polyphony.

Named kits remain trigger-pad based.

## Browser input providers

The Audition Keyboard currently provides:

- mouse/pointer piano;
- computer keyboard;
- Web MIDI input when the browser grants permission.

All three feed the same UI note-on/note-off functions.

Web MIDI mapping:

- Note On: MIDI 0x90 with velocity > 0;
- Note Off: MIDI 0x80 or Note On with velocity 0;
- Sustain: CC64;
- Panic / all notes off: CC120 or CC123.

The MIDI permission is requested only after the user presses **Enable MIDI Input**.

## Client-side duplicate-note protection

Multiple UI input sources can target the same MIDI note. The browser keeps a per-note reference count for the persistent server-side synth.

The first source pressing a pitch sends `note-on`. Additional sources on the same pitch increase the local reference count. `note-off` is sent only after the final source releases that pitch.

This avoids prematurely releasing a note if, for example, the computer keyboard and MIDI controller hold the same pitch at the same time.

## Control API

Read status:

`GET /v1/live/status`

Commands:

- `POST /v1/live/select`
- `POST /v1/live/note-on`
- `POST /v1/live/note-off`
- `POST /v1/live/sustain`
- `POST /v1/live/all-notes-off`
- `POST /v1/live/stop`

Example selection body:

```json
{ "instrument": "SF2/MyPiano" }
```

Example note body:

```json
{ "note": 60, "velocity": 96 }
```

## Failure and fallback behavior

The capability endpoint reports whether persistent SoundFont playback is available.

If FluidSynth is absent:

- NoteScript itself still runs;
- native sound packs still work;
- SFZ still works;
- SF2/SF3 remain discoverable but non-playable;
- the live manager remains idle.

The browser therefore does not assume that the external backend exists.

## Cleanup

The live manager owns at most one FluidSynth process.

Cleanup happens on:

- live instrument switch;
- explicit `/v1/live/stop`;
- service shutdown;
- server SIGINT/SIGTERM shutdown path.

The manager sends sustain-off + all-notes-off before quitting the synth.

## Remaining playback work

The following are not claimed by this baseline:

- measured end-to-end audio latency with dedicated audio instrumentation;
- selectable audio output device from the UI;
- ASIO backend integration;
- persistent server-side SFZ sample engine;
- song transport play/pause/seek/loop;
- recording a performance into NoteScript events;
- physical MIDI-controller qualification on this machine.

These can extend the same note interface without replacing the current architecture.
