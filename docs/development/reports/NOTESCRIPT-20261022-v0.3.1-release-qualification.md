# NoteScript v0.3.1 - Release Qualification

Date: 2026-10-22 (Asia/Bangkok)

Status: **COMPLETE / PUBLISHED / POST-PUBLISH VERIFIED**

Repository: `funggier/NoteScript`

Release: `v0.3.1`

Release title: **NoteScript v0.3.1 - Piano Multi-Key Input Fix**

## Intended release scope

This patch release preserves the complete v0.3.0 feature set and publishes the post-v0.3.0 maintenance state currently on `main`.

Included changes:

- Piano `CHORD HOLD` mode for building large chords on low-rollover computer keyboards.
- Pending-voice handling so key-up events are preserved while audio samples load asynchronously.
- Pending voice cancellation on panic/source changes to reduce stuck-note edge cases.
- Existing normal simultaneous keyboard/MIDI polyphony remains unchanged when Chord Hold is off.
- Portable browser-access documentation added after v0.3.0.
- Version metadata aligned to 0.3.1 in package metadata, CLI help and Control API health metadata.

Explicitly unchanged / excluded:

- Historical tags/releases `v0.1.0`, `v0.2.0`, and `v0.3.0` remain immutable.
- Desktop-only third-party instrument/sample libraries are not part of the release.
- Desktop-local `config/network.json` is not part of release qualification state beyond the portable default generated from the repository.

## Release identity

- source branch: `main`
- intended annotated tag: `v0.3.1`
- release type: normal stable patch release
- expected assets:
  - `NoteScript-v0.3.1-portable.zip`
  - `NoteScript-v0.3.1-portable.zip.sha256`

## Prior implementation evidence

Piano multi-key implementation:

- commit: `278fcf5aa581c4b5844b450c4bcfd1b347fcb76f`
- exact-commit CI run: `39757804146`
- result: **SUCCESS**

Qualification documentation commit:

- commit: `b367676975c00c9d318bb3206fabd6b015733436`
- exact-commit CI run: `39758032403`
- result: **SUCCESS**

Detailed implementation evidence:

`docs/development/reports/NOTESCRIPT-20261022-piano-multikey-rollover-fix.md`

## Local release qualification

- `npm ci`: **PASS**
- `npm audit --audit-level=high`: **PASS**, 0 vulnerabilities
- `npm run check`: **PASS**, 28 JavaScript files
- `npm test`: **PASS**, 25/25 tests
- `npm run portable`: **PASS**
- `git diff --check`: **PASS**
- portable CLI reports `NoteScript v0.3.1`
- embedded portable package version: `0.3.1`
- portable Control API status: **Health: OK**
- portable Control API `coreVersion`: `0.3.1`
- portable bundled projects: `22`
- portable bundled instrument manifests: `1` (`basic-sfz`)
- third-party SSO/GM name matches in release output: `0`

Two pre-qualification hygiene issues were detected and corrected before this final GREEN run: a temporary UTF-8 BOM introduced ahead of the CLI shebang during version editing, and one trailing blank line in `CURRENT.md`. After those corrections, the entire release gate was rerun from the beginning and passed.

## Release commit and exact CI

- release commit: `05a418f487647dc695cf04df5d1bb186a51bf2c5`
- exact-commit GitHub Actions run: `39759210409`
- workflow: `CI`
- result: **SUCCESS**
- annotated tag: `v0.3.1`
- local and remote peeled tag target: `05a418f487647dc695cf04df5d1bb186a51bf2c5`

## Tag / assets / publication

Published GitHub Release:

`https://github.com/funggier/NoteScript/releases/tag/v0.3.1`

Release title: **NoteScript v0.3.1 - Piano Multi-Key Input Fix**

Release state:

- draft: `false`
- prerelease: `false`
- published at: `2026-10-22T09:58:51Z`

Published assets:

- `NoteScript-v0.3.1-portable.zip` — `59872122` bytes
- `NoteScript-v0.3.1-portable.zip.sha256` — `96` bytes

Portable ZIP SHA-256:

`32635ed7c334f03d7da086abd2f33e2252c48b1ee0745b665a5f32f71495d440`

GitHub asset digest:

`sha256:32635ed7c334f03d7da086abd2f33e2252c48b1ee0745b665a5f32f71495d440`

The portable asset was rebuilt from the tagged Git tree rather than from the working directory. The resulting ZIP contains `275` entries rooted at `NoteScript-portable/` and contains no `.git` or `node_modules` directories.

## Post-publish verification

Both published assets were downloaded from GitHub into a fresh verification directory.

Verified:

- downloaded ZIP SHA-256 matches the downloaded checksum file: **PASS**
- downloaded ZIP SHA-256 matches the pre-publish artifact hash: **PASS**
- downloaded ZIP size: `59872122` bytes
- ZIP entries: `275`
- embedded package version: `0.3.1`
- portable CLI reports `NoteScript v0.3.1`
- portable Control API status: **Health: OK**
- portable Control API `coreVersion`: `0.3.1`
- bundled projects: `22`
- bundled instrument manifests: `1`
- `.git` / `node_modules` inside portable: `0`

## Final disposition

`v0.3.1` is **COMPLETE / PUBLISHED / VERIFIED**.
