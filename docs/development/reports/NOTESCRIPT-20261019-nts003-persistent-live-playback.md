# NoteScript NTS-003 Qualification — Persistent Live Playback

Date: 2026-10-19

## Scope

This qualification covers the first persistent live playback engine for NoteScript:

- persistent SF2/SF3 synthesis through FluidSynth;
- note-on/note-off without per-note WAV rendering;
- polyphonic note state;
- sustain;
- panic/all-notes-off;
- safe instrument switching;
- process cleanup;
- Audition Keyboard routing;
- optional Web MIDI input;
- portable backend discovery and clean fallback.

## Source qualification

Latest local checks:

- `npm run check`: PASS — 23 JavaScript files.
- `npm test`: PASS — 17 tests, 17 passed.

Automated coverage includes:

- persistent FluidSynth argument construction;
- confirmation that live args do not request fast-render `-F` output;
- note/sustain rejection before a live session is ready;
- live manager rejection of unsupported persistent SFZ mode;
- capability gating when FluidSynth is missing;
- all previous NTS-002 parser/render/decoder/audition tests.

## Real Windows live-audio qualification

Backend:

- FluidSynth 2.6.1.
- Windows audio driver: `wasapi`.
- SoundFont: FreePats Lately Bass SF2.
- later switch target: FluidSynth upstream Vintage Dreams Waves SF3 fixture.

### SF2 startup and commands

Persistent select:

- instrument: `SF2/LatelyBass`
- state after selection: `ready`
- process PID: `15472`
- audio driver: `wasapi`
- sample rate: 44.1 kHz
- observed API selection time: about 118 ms.

After startup:

- first measured note-on request: about 10 ms;
- additional note-on requests observed around 2–16 ms;
- sustain request: about 1–2 ms;
- note-off request: about 12 ms;
- panic request: about 15 ms.

These are HTTP/control-path observations, not laboratory end-to-end audio latency measurements.

### Polyphony/state

Verified state progression on the same persistent PID:

- note 48 -> 1 active note;
- note 52 -> 2 active notes;
- note 55 -> 3 active notes;
- note-off 48 -> 2 active notes;
- panic -> 0 active notes.

Sustain state changed true/false without restarting the synth.

### Safe SF2 -> SF3 switch

Switching from SF2 Lately Bass to SF3 Vintage Dreams:

- old live PID: `15472`;
- new live PID: `21340`;
- only the new FluidSynth process remained after switching;
- SF3 note-on succeeded on the new process;
- explicit `live/stop` returned state `idle`;
- process inspection after stop found zero `fluidsynth.exe` processes.

This verifies stop-before-switch behavior.

## Service shutdown qualification

A direct service-level probe performed:

1. create the Control Service;
2. select `SF2/LatelyBass`;
3. live process started as PID `3404`;
4. send one note-on;
5. call `service.shutdown()`;
6. service returned `idle`;
7. process inspection found zero `fluidsynth.exe` processes.

This directly verifies the cleanup path called by server shutdown.

## Portable live qualification

A clean portable build was temporarily populated with:

- official FluidSynth runtime under `tools/fluidsynth/bin/`;
- `SF2/LatelyBass` under `instruments/SF2/LatelyBass/`.

No `NOTESCRIPT_FLUIDSYNTH` override was used.

Capability discovery found:

`out/NoteScript-portable/tools/fluidsynth/bin/fluidsynth.exe`

Portable capabilities reported:

- `livePlayback.soundfont: true`;
- formats: SF2, SF3;
- note-on/off: true;
- sustain: true;
- panic: true;
- default Windows audio driver: `wasapi`.

Portable live selection:

- state: ready;
- PID: `21476`;
- observed select request: about 109 ms;
- note-on after startup: about 2 ms.

The qualification-only backend and SoundFont were removed again with a clean portable rebuild.

## Clean portable fallback

Final clean portable package contains no qualification SoundFont or FluidSynth binary.

Verified:

- Control API portable root is correct.
- Audition Keyboard page is served.
- `livePlayback.soundfont: false` without FluidSynth.
- `live/status` returns idle.
- native sound packs and SFZ remain available from the NTS-002 paths.

This verifies that persistent playback remains optional and does not become a hard dependency.

## Audition Keyboard integration

Implemented browser routing:

- SF2/SF3 + live backend available -> persistent server-side live commands.
- SF2/SF3 live startup failure -> buffered rendered audition fallback.
- SFZ -> buffered instrument audition path.
- NoteScript native pitched sounds -> Web Audio.
- kits -> Web Audio trigger pads.

Controls:

- mouse piano;
- computer keyboard;
- velocity;
- octave shift;
- sustain;
- Panic / All Notes Off;
- Web MIDI enable button.

## Web MIDI

The browser input adapter implements:

- Note On;
- Note Off;
- velocity;
- sustain CC64;
- all-notes-off CC120/CC123.

Web MIDI feeds the same UI note interface as mouse and computer keyboard.

A physical MIDI controller was not connected for this qualification, so hardware-device behavior is implemented but not claimed as physical-device-qualified evidence.

## UI automation boundary

Managed browser DOM automation was not performed because the machine does not currently have GeckoDriver/ChromeDriver installed.

The following were verified instead:

- UI assets present;
- JavaScript syntax passes;
- Control API serves the UI;
- live API endpoints work against real audio backend;
- portable and source capability/status behavior is correct.

## GitHub exact-commit evidence

- repository: `funggier/NoteScript` (public)
- persistent-live checkpoint commit: `a70e43bb791ed609f491a7257463a58e6d61c375`
- GitHub Actions run: `39262242295` (CI run #5)
- result: `completed / success`
- successful steps: checkout, Node setup, `npm ci`, syntax check, automated tests, portable build, portable smoke test

## Conclusion

The NTS-003 persistent SoundFont playback baseline is locally GREEN.

The architecture now separates:

- input providers;
- persistent live SoundFont synthesis;
- buffered SFZ audition;
- browser-native sound-pack playback.

Future playback work can focus on transport, measured latency tuning, output-device selection and a persistent SFZ/sample engine rather than redesigning the note input contract.
