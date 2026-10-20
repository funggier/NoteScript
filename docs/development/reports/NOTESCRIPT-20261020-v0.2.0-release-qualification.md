# NoteScript v0.2.0 - Release Qualification

Date: 2026-10-20 (Asia/Bangkok)

Status: **COMPLETE / PUBLISHED / POST-PUBLISH VERIFIED**

Repository: `funggier/NoteScript`

Release: `v0.2.0`

Release title: **NoteScript v0.2.0 - Unified Compose & BeatLane6**

## Release commit and CI

- release commit: `143c239941db19a1abf39de045e3e83dea00f5d8`
- annotated tag: `v0.2.0`
- tag resolves to the exact release commit above
- exact-commit GitHub Actions run: `39361275178`
- workflow: `CI`
- result: **SUCCESS**
- normal published release; not draft and not prerelease

## Qualified feature scope

- BeatLane6 six-lane rhythm game with deterministic chart generation from NoteScript Markdown.
- Expanded built-in sound library: 8 pitched SoundPiano packs plus a 16-trigger SoundPad.
- Native sound taxonomy: `sounds/soundpiano/<pack>` and `sounds/soundpad/<set>`.
- Unified Compose editor with Text / Form / Node / Tracks views over the same Markdown.
- Compose local `.md` import and unsaved Play/Pause/Stop live preview.
- Self-contained Track cards with Name, Source Type, Instrument / Sound, Volume, Pan, Velocity, Bars / Notes, Mute, Stem WAV and Delete.
- Add/Delete Track writes directly to Compose Markdown; the final Track cannot be deleted.
- Mix WAV and Track Set ZIP export.
- Automatic Project Transport preview rebuild when Project/Preview voice changes.
- Performance hotkeys limited to Play and mapped by physical keyboard position for layout independence.

## Final local qualification

Commands:

```text
npm ci
npm run check
npm test
npm run portable
```

Results:

- npm audit: 0 vulnerabilities
- syntax check: **28 JavaScript files PASS**
- automated tests: **23/23 PASS**
- portable build: **PASS**
- portable runtime Health: **OK**
- portable core version: **0.2.0**
- Compose WAV render smoke: **PASS**
- Track Set ZIP smoke: **PASS**

## Release artifacts

Uploaded assets:

- `NoteScript-v0.2.0-portable.zip`
- `NoteScript-v0.2.0-portable.zip.sha256`

Portable ZIP size:

`43967582` bytes

SHA-256:

`565ce79ef029b01cecc86dfe804c23266621347ce6120bf6e178670b48749f55`

GitHub asset digest:

`sha256:565ce79ef029b01cecc86dfe804c23266621347ce6120bf6e178670b48749f55`

ZIP inspection:

- one clean top-level `NoteScript-portable\` directory
- 116 files
- no `.git`
- no `node_modules`
- embedded app version `0.2.0`

## GitHub publish evidence

Published release:

`https://github.com/funggier/NoteScript/releases/tag/v0.2.0`

Published at:

`2026-10-20T02:54:54Z`

Both required assets were present after publish.

## Post-publish verification

Assets were downloaded again from the published GitHub Release into a fresh verification directory.

Results:

- downloaded ZIP size: `43967582` bytes
- downloaded SHA-256 matches the published checksum file
- downloaded SHA-256 matches the pre-publish artifact hash
- extracted release reports app version `0.2.0`
- Control API Health: **OK**
- Control API core version: **0.2.0**
- `Evening Walk.md` Compose render produced valid RIFF/WAV
- source worktree remained clean before closing documentation

## Final disposition

`v0.2.0` is **COMPLETE / PUBLISHED / VERIFIED**.
