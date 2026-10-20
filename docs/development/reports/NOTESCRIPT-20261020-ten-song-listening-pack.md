# NoteScript — Ten-Song Listening Pack Qualification

Date: 2026-10-20 (Asia/Bangkok)

Status: **COMPLETE / GREEN / EXACT-COMMIT CI GREEN**

## Scope

Promote the ten original long-form listening songs previously used as local portable trials into the authoritative NoteScript repository.

Songs:

- Morning Window
- Rain on the Balcony
- Slow Train Home
- Cafe After Rain
- Cloud Pillow
- River Lanterns
- Sunday Pages
- Quiet Neon
- Garden at Four
- Moonlit Tea

Selected lead-voice adjustments:

- Quiet Neon -> `synth-bass`
- Rain on the Balcony -> `marimba`
- River Lanterns -> `vibraphone`

## Structure

Source directory:

`examples/listening-songs/`

Every song has:

- four tracks;
- 48 bars per track;
- bundled native SoundPiano/SoundPad sources only;
- an estimated playback duration between 2:05 and 2:40.

The portable build copies all ten projects into `projects/` using their human-readable names.

## Local qualification

- `npm run check` -> **PASS**, 28 JavaScript files
- `npm test` -> **PASS**, 25/25 tests
- listening-song pack structure test -> **PASS**
- selected lead-source assertions -> **PASS**
- `npm run portable` -> **PASS**
- portable CI workflow validates all ten project files

## GitHub exact-commit evidence

Implementation commit:

`8e158ac955857ccd4e0a391745e94a6aecfd4282`

The first CI run `39445659005` failed only in the new listening-pack assertion because the Windows runner checked out CRLF line endings while the assertion searched for a literal LF separator.

Line-ending normalization fix commit:

`718328258ba0f98c3aeab78af84e5d2cc0cca5c0`

Exact-commit GitHub Actions run:

`39445880482`

Final result: **SUCCESS**

All workflow stages passed, including 25/25 tests, portable build, validation of all ten listening projects, portable CLI smoke, and Studio / Control API smoke.
