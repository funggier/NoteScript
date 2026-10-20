# NoteScript v0.3.0 - Release Qualification

Date: 2026-10-21 (Asia/Bangkok)

Status: **LOCAL GREEN / RELEASE COMMIT PENDING / PUBLISH PENDING**

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

- release commit: **PENDING**
- annotated tag: `v0.3.0` **PENDING**
- exact-commit GitHub Actions run: **PENDING**
- result: **PENDING**

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

Artifact size and checksum: **PENDING**

## Publish and post-publish verification

**PENDING**
