# NoteScript v0.4.0 — Kazu Guitar Release Qualification

Date: 2026-11-09 (Asia/Bangkok)

Status: **COMPLETE / PUBLISHED / POST-PUBLISH VERIFIED / DESKTOP LIVE**

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

- Release commit: `2d9b23437fba9b7fc48599c1954483e22358fd1c`
- Exact-commit CI: run `42631282093` — **SUCCESS**
- All CI steps passed, including npm ci, syntax, tests, portable build, portable CLI smoke and Studio / Control API smoke.
- Local and remote annotated `v0.4.0` tags both peel to the exact release commit.

## Tagged-tree build and checksums

- Created from `git archive v0.4.0`, not from the mutable working tree.
- ZIP: `NoteScript-v0.4.0-portable.zip` — **65,430,255 bytes** / **285 entries**.
- SHA-256: `a90248bf7314a1c2d787eca91c0f282d636ba219453962f5843d382180a9a52b`
- Checksum asset: `NoteScript-v0.4.0-portable.zip.sha256` — 96 bytes.
- Contains six and only six Kazu Guitar PCM16 WAV samples; SFZ references SoundPiano files without copying them.
- Contains 23 portable Markdown projects, including `Kazu Guitar Demo.md`.
- Portable package and CLI report 0.4.0, with no `.git` or `node_modules` entries.

## Published release and post-download validation

- Release URL: `https://github.com/funggier/NoteScript/releases/tag/v0.4.0`
- Published at: 2026-11-09T14:08:32Z; stable release, not draft or prerelease.
- Both published assets downloaded from GitHub into a fresh verification directory.
- Downloaded ZIP checksum matches downloaded `.sha256` and the original published GitHub digest: **PASS**.
- Downloaded ZIP extracts and reports version 0.4.0: **PASS**.
- Extracted portable Control API starts and reports Health OK / `coreVersion: 0.4.0`: **PASS**.
- Extracted portable includes 6 Kazu WAV, 1 Kazu SFZ and 23 projects: **PASS**.

## Desktop portable update

- Existing Desktop portable updated selectively; original 192 kHz recordings are untouched.
- `config/network.json` hash unchanged: `127.0.0.1:19432`.
- Existing WAV count 170 → 176 (exactly the six added samples).
- Existing instrument manifest count 1 → 2 (one added SFZ instrument).
- Six installed WAV SHA-256 values match the tagged release copies.
- Existing program files backed up outside the Desktop portable before being replaced.
- Desktop Control API `coreVersion: 0.4.0` / Health OK.
- Desktop Studio API lists `kazu-guitar` (6 samples) and `SFZ/kazu-guitar`.
- Desktop `Kazu Guitar Demo.md` validates and renders a WAV successfully.

## Final disposition

`v0.4.0` is **COMPLETE / PUBLISHED / VERIFIED**.
