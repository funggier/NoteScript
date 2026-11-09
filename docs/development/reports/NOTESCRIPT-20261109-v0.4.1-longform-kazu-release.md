# NoteScript v0.4.1 — Two Kazu Guitar Hour-Long Songs

Date: 2026-11-09 (Asia/Bangkok)

Status: **LOCAL QUALIFIED; GitHub CI, release publication and tagged ZIP verification pending**.

## Scope and source

Release two original long-form editable Markdown music projects, transcribed from the user's real Desktop Portable into the tracked source repository without changing the compositions.

- `examples/longform-songs/peach-horizon-kazu-one-hour.md` (Peach Horizon - Kazu Guitar One Hour Journey): 92 BPM, C major, 4/4, 1,380 bars, 6 tracks; exactly 60:00. Desktop SHA-256 and copied source SHA-256: `18621E0BE0736BE8B8D0C0E6134E4D0310BF36298554102604F83E0002B0DD59`.
- `examples/longform-songs/golden-canopy-kazu-canon-one-hour.md` (Golden Canopy - Kazu Guitar Canon Journey): 96 BPM, D major, 4/4, 1,440 bars, 7 tracks; exactly 60:00. Desktop SHA-256 and copied source SHA-256: `3B3C5441FFD2FB845520357F405235F729F952B5817584FD9507B6457DBF375E`.

Both songs include slower, thinner passages and occasional faster note runs; both have harmonically prepared turnaround measures to support repeated playback. The second composition is an original song inspired by Pachelbel's *Canon in D*; no third-party recorded performance was imported.

## Build and documentation changes

- Bump package and lock metadata from `0.4.0` to `0.4.1`.
- Portable builder now installs both hour-long Markdown projects automatically in `projects/`; packaged project count increases from 23 to 25.
- Preserve all 19 existing shorter listening songs and the pre-existing Kazu Guitar demo.
- Add a full-hour regression test for exact score duration, all-bar completeness, track counts, Kazu Guitar sound mapping, and both half-note and sixteenth-note passages.
- Update GitHub Actions portable smoke tests to validate both packaged projects.
- Refresh README, listening-song guide, and `examples/longform-songs/README.md` with import/edit/export/loop instructions.
- No third-party samples or new license rights are introduced; existing Kazu Guitar sample attribution and permissions remain in force.
- **No pre-rendered 1-hour WAVs in the portable ZIP** (each ~303 MiB); scores render locally using bundled Kazu Guitar sound pack.

## Local verification completed

- Clean baseline on `main`: `579efdedd8426180111f3a9fb16a3558491af8be`; remote `origin/main` equal to baseline before edits.
- `npm run check`: PASS (29 JavaScript files).
- `npm test`: PASS (27/27, including newly added longform regression).
- `npm run portable`: PASS.
- `npm audit --audit-level=high`: PASS (0 vulnerabilities).
- `git diff --check`: PASS.
- Full-length portable CLI `validate`: PASS for both files.
- Source-versus-packaged Markdown SHA-256: PASS for both songs.
- Bundled Kazu Guitar sample verified in portable.
- Source and portable version both report `0.4.1`; packaged project count = 25.

## Release qualification / follow-up

- Intended release: `v0.4.1`.
- GitHub Actions must complete on the exact release commit before tagging/publishing.
- Build an untouched tagged-tree portable ZIP and matching SHA-256 asset, then verify published artifacts after upload.
- Keep the previous `v0.4.0` tag and release unchanged.
