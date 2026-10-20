# NoteScript v0.3.0 - Release Qualification

Date: 2026-10-21 (Asia/Bangkok)

Status: **COMPLETE / PUBLISHED / POST-PUBLISH VERIFIED**

Repository: `funggier/NoteScript`

Release: `v0.3.0`

Release title: **NoteScript v0.3.0 - Expanded Sound Library & Listening Pack**

## Intended release scope

- 18 deterministic built-in SoundPiano packs.
- 5 deterministic built-in SoundPad sets with 16 shared trigger names each.
- Expanded guitar, strings, flute, mallet, choir and soft-brass voices.
- Acoustic, brush, electronic and lo-fi drum sets.
- 19 bundled long-form listening songs, all four-track / 48-bar projects.
- Existing BeatLane6, unified Compose Text/Form/Node/Tracks workflow, track stem/mix/ZIP export and portable Control API retained.
- Version metadata aligned to 0.3.0 in package metadata, CLI help and Control API health metadata.
- Third-party local testing libraries under Desktop portable instruments are explicitly excluded from this release.

## Release commit and CI

- release commit: `c57f27286459f8731cb5a8b5bf2e789bfe7e0d8c`
- annotated tag: `v0.3.0`
- tag resolves to the exact release commit above
- exact-commit GitHub Actions run: `39463899318`
- workflow: `CI`
- result: **SUCCESS**
- normal published release; not draft and not prerelease

## Local qualification

- `npm ci`: **PASS**
- `npm audit --audit-level=high`: **0 vulnerabilities**
- `npm run check`: **PASS**, 28 JavaScript files
- `npm test`: **PASS**, 25/25 tests
- `npm run portable`: **PASS**
- portable CLI reports `NoteScript v0.3.0`
- embedded portable package version: `0.3.0`
- portable Control API health: **OK**, `coreVersion=0.3.0`
- portable bundled projects: **22**
- portable bundled SFZ registrations: **1** (`basic-sfz`)
- Desktop-only SSO/GM third-party registrations in release output: **0**
- `git diff --check`: **PASS**

## Release artifacts

Planned assets:

- `NoteScript-v0.3.0-portable.zip`
- `NoteScript-v0.3.0-portable.zip.sha256`

Portable ZIP size: `59869697` bytes

ZIP entries: `275`

SHA-256:

`c820c7e66f435cc7897fdb1b1e68f31e084541959faa9d37e1bcef460df2d5ef`

GitHub asset digest:

`sha256:c820c7e66f435cc7897fdb1b1e68f31e084541959faa9d37e1bcef460df2d5ef`

ZIP inspection found no `.git` or `node_modules`, and embedded package version is `0.3.0`.

## Publish and post-publish verification

Published release:

`https://github.com/funggier/NoteScript/releases/tag/v0.3.0`

Published at:

`2026-10-20T17:13:45Z`

Post-publish verification downloaded both assets from GitHub into a fresh directory and confirmed:

- downloaded ZIP size: `59869697` bytes
- downloaded SHA-256 matches the published checksum file
- downloaded SHA-256 matches the pre-publish artifact hash
- embedded package version: `0.3.0`
- portable CLI reports `NoteScript v0.3.0`
- portable Control API health: **OK**
- portable Control API core version: `0.3.0`

## Final disposition

`v0.3.0` is **COMPLETE / PUBLISHED / VERIFIED**.
