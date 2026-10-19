# NoteScript Bootstrap Qualification — 2026-10-19

## Scope

NTS-001 baseline bootstrap for `T:\Space\Projects\ProjectsProgram\NoteScript`.

## Verified local source

- `npm run check`: PASS — 17 JavaScript files syntax-checked.
- `npm test`: PASS — 6 tests, 6 passed, 0 failed.
- Parser: PASS.
- Native `sounds/` add-ons: PASS.
- SFZ/SF2/SF3 instrument hierarchy validation: PASS.
- WAV offline renderer: PASS.
- Control service workspace restriction/save/validate: PASS.

## Verified portable package

Built with `npm run portable`.

Portable root:

`out\NoteScript-portable`

Observed:

- portable `NoteScript.cmd validate`: PASS.
- portable sound discovery: PASS; found `piano` and `soundpad`.
- portable `Render-Song.cmd`: PASS.
- rendered file: `exports\Evening Walk.wav`.
- duration reported: 23.66 seconds.
- sample rate: 44100 Hz.
- size: 2,087,266 bytes.
- SHA-256: `f9fb9a5451946961048e0cbb272f5391b0ac8f3e786e8a991800627bf3819afc`.

## Verified Control API

Started from the portable package with `Start-Control-API.cmd`.

Endpoint:

`http://127.0.0.1:19427/v1/health`

Observed:

- `ok: true`
- `service: NoteScript Control API`
- `apiVersion: v1`
- `coreVersion: 0.1.0`
- portable root resolved to the packaged directory.

The qualification process was terminated after the health check.

## Capability boundary

Implemented now:

- native sample-pack render path;
- portable runtime;
- Control API;
- standard-format instrument add-on discovery/validation.

Not yet claimed:

- SFZ rendering;
- SF2/SF3 rendering;
- GUI;
- real-time low-latency playback;
- ChatGPT Plugin/MCP adapter itself.

The Control API is the intended stable boundary for those future integrations.

## GitHub exact-commit evidence

Repository: `funggier/NoteScript` (private).

Bootstrap code commit: `9104450bedd6834a1dcbad804a3c9b9ddd04014c`.

GitHub Actions run: `39251875169` (`CI`, run #1).

Result: `completed / success`.

Observed successful workflow steps included `npm ci`, `npm run check`, `npm test`, `npm run portable`, and the portable smoke test.
