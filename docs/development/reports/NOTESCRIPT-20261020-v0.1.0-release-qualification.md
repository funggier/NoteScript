# NoteScript v0.1.0 — Release Qualification

Date: 2026-10-20 (Asia/Bangkok)

Status: **COMPLETE / PUBLISHED / POST-PUBLISH VERIFIED**

Repository: `funggier/NoteScript`

Release: `v0.1.0`

Release title: **NoteScript v0.1.0 — First Public Portable Release**

## Release commit and CI

- release commit: `38ac635f63e1e1da21c69c4331e0026ac4125b79`
- tag: `v0.1.0`
- tag resolves to the exact release commit above
- exact-commit GitHub Actions run: `39297369709`
- workflow: `CI`
- job: `test (24.x)`
- result: **SUCCESS**
- release is a normal published release, not draft and not prerelease

The release commit only adds the release-ready handoff/current-task documentation on top of the previously qualified product code; the exact commit itself passed the full CI workflow including portable build and smoke tests.

## Final local qualification before packaging

Commands:

```text
npm ci
npm run check
npm test
npm run portable
```

Results:

- npm audit: 0 vulnerabilities reported
- syntax check: **25 JavaScript files PASS**
- automated tests: **21/21 PASS**
- portable build: **PASS**

Portable smoke from `out\NoteScript-portable`:

- `Status.bat` -> STOPPED
- `Start.bat` -> server started
- `Status.bat` -> RUNNING + PID + Health OK
- `Evening Walk.md` validate -> PASS
- `Evening Walk.md` render -> valid RIFF/WAV
- `SFZ Basic.md` validate -> PASS
- `SFZ Basic.md` render -> valid RIFF/WAV
- production sound discovery -> `piano`, `soundpad`
- SoundPad canonical type -> `soundpad`
- `Stop.bat` -> STOPPED

## Release artifacts

Uploaded assets:

- `NoteScript-v0.1.0-portable.zip`
- `NoteScript-v0.1.0-portable.zip.sha256`

Portable ZIP size:

`35638926` bytes

SHA-256:

`19360903d4f8b1dc58a78fbda87f485e43e6cdd7ab3060274c6eb0647998e697`

ZIP inspection:

- one clean top-level `NoteScript-portable\` directory
- no `.git`
- no `node_modules`
- no qualification smoke outputs
- extracted pre-publish ZIP passed Status -> Start -> Health OK -> Stop

## GitHub publish evidence

Published GitHub release:

`https://github.com/funggier/NoteScript/releases/tag/v0.1.0`

GitHub reported the uploaded ZIP digest as:

`sha256:19360903d4f8b1dc58a78fbda87f485e43e6cdd7ab3060274c6eb0647998e697`

Both required assets were present after publish.

## Post-publish verification

The two assets were downloaded again from the published GitHub Release into a fresh local verification directory.

Results:

- downloaded ZIP size: `35638926` bytes
- downloaded ZIP SHA-256 matches the published `.sha256` file
- downloaded ZIP SHA-256 matches the pre-publish artifact hash
- downloaded release extracted successfully
- `Status.bat` -> STOPPED
- `Start.bat` -> RUNNING
- `Status.bat` -> PID + Health OK
- Control API health -> OK
- `Evening Walk.md` rendered from the downloaded release -> valid RIFF/WAV
- `Stop.bat` -> STOPPED
- source worktree remained clean after verification

## Scope control

NTS-005 was **not started** during the release session.

The v0.1.0 release freezes the completed NTS-001 through NTS-004 baseline. NTS-005 remains the next planned milestone and is not activated by this qualification report.

## Final disposition

`v0.1.0` is **COMPLETE / PUBLISHED / VERIFIED**.
