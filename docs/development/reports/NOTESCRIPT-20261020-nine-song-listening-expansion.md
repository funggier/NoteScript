# NoteScript — Nine-Song Listening Expansion Qualification

Date: 2026-10-20 (Asia/Bangkok)

Status: **COMPLETE / GREEN / EXACT-COMMIT CI GREEN**

## Scope

Promote nine selected songs from the second local trial batch into the authoritative NoteScript listening-song pack:

- Cassette Afterglow
- Mango Soda
- Moon Garden Radio
- Paper Boat Daydream
- Peach Horizon
- Starlight Thermos
- Tiny Parade
- Velvet Sidewalk
- Wildflower Postcard

The production listening-song pack therefore expands from 10 to 19 songs.

## Structure

Source directory:

`examples/listening-songs/`

All promoted songs:

- use four tracks;
- use 48 bars per track;
- use bundled NoteScript native sound sources only;
- run approximately two to three minutes;
- are copied into portable `projects/`;
- are validated by automated tests and CI.

## Local qualification

- `npm run check` -> **PASS**, 28 JavaScript files
- `npm test` -> **PASS**, 25/25 tests
- `npm run portable` -> **PASS**
- all nine promoted portable projects validate successfully
- `git diff --check` -> **PASS**

## GitHub exact-commit evidence

Implementation commit:

`fccdc8634372c3e30615cdc779a9b261365f99f5`

Exact-commit GitHub Actions run:

`39450835736`

Final result: **SUCCESS**

All workflow stages passed, including 25/25 tests, portable build, validation of the nine promoted projects, portable CLI smoke, and Studio / Control API smoke.
