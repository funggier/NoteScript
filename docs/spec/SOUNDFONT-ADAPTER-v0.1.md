# SoundFont Adapter v0.1

Status: implemented through an optional FluidSynth backend.

## Formats

The same adapter handles:

- SF2
- SF3

NoteScript itself does not embed FluidSynth. SoundFont rendering is enabled only when a compatible FluidSynth executable is found.

## Backend discovery

Lookup order:

1. `NOTESCRIPT_FLUIDSYNTH`
2. `tools/fluidsynth/bin/fluidsynth.exe` in the portable root
3. `tools/fluidsynth/fluidsynth.exe`
4. `fluidsynth` on PATH

When the backend is absent, SF2/SF3 add-ons are still discovered and validated but are reported as non-playable.

## Instrument manifest

Example:

```notescript-instrument
name: My SoundFont
version: 1
author: Author
license: specify-license
source: specify-source
format: SF2
entry: instrument.sf2
bank: 0
preset: 0
```

SF3 uses the same manifest with `format: SF3`.

## Offline song rendering

For a SoundFont-backed NoteScript track, the engine:

1. compiles that track to an isolated format-0 MIDI stream;
2. writes bank select and program change from the manifest;
3. invokes FluidSynth fast rendering with reverb/chorus disabled for a stable baseline;
4. decodes the resulting WAV through NoteScript's shared decoder;
5. mixes the result into the NoteScript project renderer.

Example:

```text
track Bass
instrument: SF2/LatelyBass
volume: 0.65
velocity: 100
bar 1: C2 q | G2 q | C3 q | Eb3 q
```

## Audition

The same backend can render one note on demand for the Audition Keyboard:

`GET /v1/audition/instrument?instrument=SF2/LatelyBass&note=48&velocity=100`

The browser caches the rendered note by instrument/note/velocity.

This request/response design is suitable for audition and validation. Serious low-latency performance remains an NTS-003 goal, where a persistent synthesis engine should replace per-note process rendering.

## Qualification evidence

Local NTS-002 qualification used:

- official FluidSynth 2.6.1 Windows x64 cpp11 build;
- SHA-256 of the downloaded official ZIP:
  `fab7a2e4b85675b66970f97a39bbc239729c5e0f237198b5922a6a73cbc8677c`;
- FreePats Lately Bass SF2 (CC0 1.0) for SF2 render/audition;
- FluidSynth upstream VintageDreamsWaves-v2.sf3 test fixture for SF3 render/audition, used only for local qualification with its upstream copyright notice.

Third-party binaries and qualification SoundFonts are not committed into the NoteScript repository.

## Licensing boundary

NoteScript remains MIT.

FluidSynth is third-party LGPL software. A user/distributor who bundles FluidSynth with a NoteScript portable package must preserve the corresponding FluidSynth licensing materials and comply with its license.

SoundFont add-ons retain their own licenses independently.
