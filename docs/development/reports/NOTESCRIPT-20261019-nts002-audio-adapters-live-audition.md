# NoteScript NTS-002 Qualification — Audio Adapters + Live Audition Foundation

Date: 2026-10-19

## Scope

This qualification covers the first expanded audio-source layer after the NTS-001 bootstrap:

- decoder abstraction;
- optional FFmpeg formats;
- baseline SFZ renderer;
- optional FluidSynth SF2/SF3 renderer;
- portable backend discovery;
- browser-based Audition Keyboard foundation.

## Source qualification

Latest local checks before final clean portable rebuild:

- `npm run check`: PASS — 21 JavaScript files.
- `npm test`: PASS — 14 tests, 14 passed.
- native sound-pack render: PASS.
- SFZ parse/select/render: PASS.
- isolated format-0 MIDI generation: PASS.
- optional-backend capability behavior: PASS.
- FFmpeg FLAC decode: PASS on the local machine.
- Control service sound/SFZ audition paths: PASS.
- Audition UI assets/syntax: PASS.

## Decoder abstraction

Native dependency-free baseline:

- PCM16 WAV.

Optional FFmpeg adapter, when discovered:

- WAV fallback;
- FLAC;
- OGG;
- OPUS;
- AIFF;
- MP3;
- M4A.

Local detected decoder:

- FFmpeg 8.1.2 full build.

Portable lookup supports `tools/ffmpeg` without requiring system installation.

## SFZ adapter

Verified:

- `<control>`, `<global>`, `<group>`, `<region>`;
- sample paths;
- key ranges;
- velocity ranges;
- pitch key center;
- tune / transpose;
- volume;
- sample offset/end;
- simple attack/release;
- NoteScript song rendering through `instrument: SFZ/...`;
- audition-note rendering.

The adapter is explicitly a baseline subset, not a full SFZ compatibility claim.

## FluidSynth / SoundFont adapter

Official local qualification backend:

- FluidSynth 2.6.1 Windows x64 cpp11.
- official ZIP size: 2,727,529 bytes.
- verified official ZIP SHA-256:
  `fab7a2e4b85675b66970f97a39bbc239729c5e0f237198b5922a6a73cbc8677c`.
- runtime self-reported: `FluidSynth runtime version 2.6.1`.
- runtime self-reported license: LGPL.

The binary was used outside the Git repository for qualification. It is not committed to NoteScript.

### SF2 real-asset qualification

Asset:

- FreePats Lately Bass.
- author/source metadata preserved in the local add-on manifest.
- upstream README states CC0 1.0.

Results:

- NoteScript full-song render: PASS.
- output: 44.1 kHz mono WAV.
- duration reported: 10.50 s.
- file size: 926,144 bytes.
- peak sample: 6,555.
- non-zero samples observed: 447,165.
- SHA-256:
  `b51057a01e0fd8c000f598196408a3330940a21fa22a8f18bfa1e3b306e40677`.
- Control API audition note: PASS.
- audition WAV size: 211,724 bytes.

### SF3 real-asset qualification

Asset:

- FluidSynth upstream `VintageDreamsWaves-v2.sf3` test fixture.
- used only for local qualification together with its upstream `COPYRIGHT.txt`.
- the upstream notice records explicit permission from the original author for FluidSynth to make the SF3 conversion.

Results:

- NoteScript full-song render: PASS.
- output: 44.1 kHz mono WAV.
- duration reported: 5.30 s.
- file size: 467,504 bytes.
- peak sample: 6,650.
- non-zero samples observed: 232,897.
- SHA-256:
  `2d20297fb6de733156211735d5d8506242d7e11134a33f7e85e4c8e57cf841b9`.
- Control-service audition note: PASS.
- audition result begins with `RIFF`, size 211,724 bytes.

## Portable SoundFont qualification

A clean NoteScript portable build was temporarily populated for qualification with:

- official FluidSynth runtime under `tools/fluidsynth/bin/`;
- FreePats Lately Bass under `instruments/SF2/LatelyBass/`.

No `NOTESCRIPT_FLUIDSYNTH` environment override was used.

Verified:

- `NoteScript.cmd capabilities` discovered:
  `out/NoteScript-portable/tools/fluidsynth/bin/fluidsynth.exe`.
- full SF2 song render from the portable package: PASS.
- Control API portable root: correct.
- `SF2/LatelyBass`: `playable: true`.
- `SFZ/demo-sfz`: `playable: true`.
- SF2 audition endpoint: HTTP 200, `audio/wav`, 211,724 bytes.

Qualification-only third-party binaries/assets were removed again by a final clean portable rebuild and are not part of the normal NoteScript repository/package.

Final clean portable verification:

- `tools/fluidsynth/bin/`: absent as expected.
- qualification `SF2/LatelyBass`: absent as expected.
- `NoteScript.cmd capabilities`: PASS; FluidSynth unavailable in the clean package unless separately installed/copied.
- `Evening Walk.md`: validate + render PASS.
- `SFZ Demo.md`: validate + render PASS.
- clean portable Control API root: correct.
- Audition Keyboard HTTP page: served.
- clean portable `SFZ/demo-sfz`: `playable: true`.
- clean portable SFZ audition endpoint: HTTP 200, `audio/wav`, 211,724 bytes.

## Audition Keyboard

Current local UI is served by the Control API at:

`http://127.0.0.1:19427/`

Implemented foundation:

- Sound Pack selector.
- Instrument selector.
- on-screen piano.
- mouse input.
- computer keyboard input.
- polyphonic voices.
- velocity.
- octave shift.
- sustain.
- named kit trigger pads.
- native sound-pack real-time Web Audio pitch shifting.
- SFZ/SF2/SF3 instrument audition through the local engine when the relevant backend is available.

A full managed-browser DOM automation pass was not performed because no GeckoDriver/ChromeDriver is installed on the machine. This is not treated as functional evidence. HTTP serving, UI asset presence, JavaScript syntax checks, API responses and generated audition audio were verified instead.

## Performance boundary

The browser prototype is sufficient for audition and casual playing.

For serious low-latency performance, NTS-003 should move instrument synthesis to a persistent playback engine with:

- preloaded samples/regions;
- persistent SoundFont synth process or direct library binding;
- voice pool;
- note-on/note-off state;
- sustain state;
- low-latency audio output;
- MIDI controller input.

Per-note HTTP/fast-render should not be considered the final performance architecture.

## GitHub exact-commit evidence

- Repository: `funggier/NoteScript` (public).
- NTS-002 implementation commit: `78c9e6510c518b6e74110ab0ecbacf30392bc49a`.
- GitHub Actions run: `39259150920` (CI run #3).
- Result: `completed / success`.
- Successful steps included `npm ci`, `npm run check`, `npm test`, `npm run portable`, and expanded portable smoke tests including SFZ validation/render.

## Repository licensing boundary

- NoteScript source: MIT.
- external sound/instrument add-ons: retain their own licenses.
- FFmpeg: external optional tool, not part of NoteScript MIT source.
- FluidSynth: external optional LGPL tool, not part of NoteScript MIT source.
