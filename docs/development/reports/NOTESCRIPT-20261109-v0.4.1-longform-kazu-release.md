# NoteScript v0.4.1 — Two Kazu Guitar Hour-Long Songs

Date: 2026-11-09 (Asia/Bangkok)

Status: **COMPLETE / PUBLISHED / TAGGED-TREE VERIFIED / POST-DOWNLOAD VERIFIED**.

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

## Exact GitHub CI and release identity

- Release version: `0.4.1`, annotated tag: `v0.4.1`.
- Tagged source commit: `43c0a9d018c573b4ce85ea93cdd47e7f139a771a`.
- Exact-commit GitHub Actions: [run 42649647826](https://github.com/funggier/NoteScript/actions/runs/42649647826) — **SUCCESS**, including `npm ci`, syntax, unit tests, portable build, Portable CLI validation, Studio UI and Control API smoke tests on Windows.
- Tag `v0.4.1` points at the exact qualified commit; previously published `v0.4.0` tag/release were not modified.

## Tagged-tree packaging

- Created a disposable detached worktree checked out at `v0.4.1`; rebuilt the portable folder from that tag, not mutable `main`.
- Git-on-Windows checkout converted LF to CRLF in the song sources. The two packaged project files were reloaded as **raw Git-tag blobs** before compression, preserving byte-for-byte identity with the originally supplied compositions. SHA-256 matches the source values above.
- ZIP: `NoteScript-v0.4.1-portable.zip` — **65,531,883 bytes**, **287 entries**, **25 Markdown projects**.
- ZIP SHA-256: `7bb12066b162f0e64d2415923b038d89864388438753b70cafd652f528399fa7`.
- Sidecar: `NoteScript-v0.4.1-portable.zip.sha256` — 98 bytes; its content matches the ZIP SHA-256.
- Fresh unzip / portable `NoteScript.cmd validate` passed for both hour-long projects; resulting `.md` SHA-256 hashes match the owner's original Desktop source files.
- Extracted portable package reports version `0.4.1`, includes all 25 projects and six Kazu Guitar sample recordings.
- No full-hour WAVs shipped in the ZIP. Source/release documents explain how to render them separately and how to remove the default half-second WAV tail for loop playback.

## Published release and post-publish verification

- Public release: [NoteScript v0.4.1](https://github.com/funggier/NoteScript/releases/tag/v0.4.1), published 2026-11-09T16:03:50Z.
- Published ZIP: [NoteScript-v0.4.1-portable.zip](https://github.com/funggier/NoteScript/releases/download/v0.4.1/NoteScript-v0.4.1-portable.zip).
- Published SHA-256 sidecar: [NoteScript-v0.4.1-portable.zip.sha256](https://github.com/funggier/NoteScript/releases/download/v0.4.1/NoteScript-v0.4.1-portable.zip.sha256).
- Downloaded both GitHub Release assets back to the Windows workspace and compared against the original release build: **both asset SHA-256 hashes are identical**.
- GitHub's published ZIP digest and byte count match the local checked artifact. Sidecar hash: `d0016195506e02056b6d845dbd3637b3b6a77069c3ba8bfbf775c27a1ba39f1a`.
- Final disposition: **COMPLETE / PUBLISHED / VERIFIED**. Documentation-only follow-up on `main` does not move the `v0.4.1` tag.
