# NoteScript v0.4.0 — Kazu Guitar Release Qualification

Date: 2026-11-09 (Asia/Bangkok)

Status: **LOCAL GREEN / RELEASE COMMIT CI PENDING**

## Scope

Add original user-recorded guitar samples to NoteScript as two playable sources:

- SoundPiano pack: `sounds/soundpiano/kazu-guitar` / `sound: kazu-guitar`
- SFZ instrument: `instruments/SFZ/kazu-guitar` / `instrument: SFZ/kazu-guitar`

Both use the same six recorded samples to avoid audio duplication.
The SFZ sample paths are relative to the portable folder layout, so the two
folders are bundled together. `Kazu Guitar Demo.md` exercises both types.

The source files `GR-01.wav` … `GR-06.wav` were supplied by the
recording owner, who explicitly approved publication in the public repository
and GitHub releases. The owner's original files are unchanged.

The published playable copies are 48 kHz / stereo / PCM16 and use approximate
E-flat standard guitar root notes (D#2, G#2, C#3, F#3, A#3, D#4).
Pitch-correction offsets are documented in
`docs/development/reports/KAZU-GUITAR-RECORDINGS.md`.

The recording owner's permission covers inclusion in NoteScript, but does not
relicense the audio as MIT or authorize independent redistribution.
The 18 existing generated pitched sound packs and 5 SoundPad sets remain MIT.
Existing v0.1.0 through v0.3.1 tags and releases are unchanged.

## Release identity

- Version: `0.4.0`
- Tag: `v0.4.0` (annotated, at exact qualified commit)
- Title: `NoteScript v0.4.0 - Kazu Guitar Recorded Instruments`
- Intended release assets:
  - `NoteScript-v0.4.0-portable.zip`
  - `NoteScript-v0.4.0-portable.zip.sha256`

## Local verification

- `npm ci`: PASS
- `npm audit --audit-level=high`: PASS (0 vulnerabilities)
- `npm run check`: PASS (29 JavaScript files)
- `npm test`: PASS (26/26 tests)
- `npm run portable`: PASS
- `git diff --check`: PASS
- `Kazu Guitar Demo.md`: parses, validates and renders to WAV from portable
- Portable package version: `0.4.0`
- Source sample count: 6
- Included playback sample bytes: 7,065,772
- Portable SFZ instrument present
- Portable projects: 23
- Both sources share the same six sample WAV files.
- Corrected sample pitch measurements are near the intended equal-tempered root notes.

## Exact release commit / CI

PENDING.

## Tagged-tree build and checksums

PENDING.

## Published release and post-download validation

PENDING.
