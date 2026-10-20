# NoteScript — Ten-Song Listening Pack Qualification

Date: 2026-10-20 (Asia/Bangkok)

Status: **IMPLEMENTED / LOCAL GREEN / EXACT-COMMIT CI PENDING**

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

Implementation commit: **PENDING**

GitHub Actions run: **PENDING**

Final result: **PENDING**
