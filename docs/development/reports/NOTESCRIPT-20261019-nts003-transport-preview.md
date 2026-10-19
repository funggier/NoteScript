# NoteScript NTS-003 Qualification — Project Transport

Date: 2026-10-19

## Scope

This qualification covers the transport part of NTS-003:

- in-memory project preview rendering;
- bounded preview cache;
- browser Play/Pause/Stop;
- seek;
- project loop;
- volume;
- pan;
- browser output-device selection where supported;
- preview without launching an external audio player.

Persistent live-note evidence remains in:

`docs/development/reports/NOTESCRIPT-20261019-nts003-persistent-live-playback.md`

## Automated qualification

After transport implementation:

- `npm run check`: PASS — 23 JavaScript files.
- `npm test`: PASS — 19 tests, 19 passed.

New coverage includes:

- in-memory WAV preview returns RIFF data without writing an output file;
- transport preview cache returns the same cached object for an unchanged project;
- explicit cache clear causes a new preview object;
- transport UI contract contains Play/Seek/output-device controls;
- UI code contains transport audio route, StereoPanner and setSinkId paths.

## Portable backend qualification

Portable Control API:

`T:\Space\Projects\ProjectsProgram\NoteScript\out\NoteScript-portable`

### Evening Walk

First request:

`GET /v1/transport/audio?project=Evening%20Walk.md`

Observed:

- HTTP 200
- content type: `audio/wav`
- content length: 2,109,316 bytes
- first request: about 45 ms
- returned header begins with RIFF/WAVE

Second unchanged request:

- HTTP 200
- same content length
- observed request: about 2 ms

The second result confirms the in-memory preview cache path.

### SFZ Basic

`GET /v1/transport/audio?project=SFZ%20Demo.md`

Observed:

- HTTP 200
- content type: `audio/wav`
- content length: 984,944 bytes
- observed request: about 24 ms
- RIFF/WAVE header confirmed

This verifies transport with the SFZ adapter as well as native NoteScript sound packs.

## Firefox live UI qualification

A fresh Firefox window was opened to the portable Control API and attached through Windows UI Automation without WebDriver/profile automation.

Accessibility snapshot confirmed visible controls:

- Project Transport
- Load Project Preview
- Play
- Pause
- Stop
- Project preview position slider
- Loop project
- Preview volume
- Preview pan
- Browser output

### Load

Clicking **Load Project Preview** produced:

`Loaded Evening Walk.md · 0:23.9 · browser context 192 kHz`

The browser context rate is intentionally labeled as browser context because Firefox resampled the 44.1 kHz preview into its active AudioContext.

### Play / Pause / Stop

Observed live state changes:

- `Playing Evening Walk.md`
- `Paused at ...`
- `Stopped.`

After Stop the displayed position returned to:

`0:00.0`

### Seek

The seek slider was clicked near its midpoint.

Displayed playhead changed to approximately:

`0:12.0`

for the 23.9-second project.

### Loop

Loop checkbox was enabled and playback started.

Observed status:

`Playing Evening Walk.md · loop`

### Firefox output capability fallback

Clicking Refresh Outputs caused the button to become disabled because the tested Firefox build does not expose `AudioContext.setSinkId`.

The selector stayed on default browser output as designed.

## Chrome live UI qualification

A fresh Chrome 155 window was opened against the same portable server.

Chrome exposed:

- enabled `Browser audio output` ComboBox;
- enabled Refresh Outputs;
- `AudioContext.setSinkId` route.

After Refresh Outputs, the browser exposed:

- Default browser output
- Audio output 1

Selecting the enumerated output produced:

`Browser output changed to Audio output 1.`

The test then restored:

`Browser output changed to Default browser output.`

No output-device choice is persisted by NoteScript.

## Gain and pan qualification

On the Chrome transport UI:

- preview volume was changed from 80% to 50%;
- preview pan was changed from 0 to approximately -53 using the range control.

Accessibility state reflected the new displayed values.

These are preview-only Web Audio controls.

## Browser automation boundary

BConnect's Windows UI Automation adapter could not invoke HTML CheckBox/ComboBox controls directly on this Windows runtime because its LegacyIAccessiblePattern type was unavailable.

This affected only the automation adapter, not the page.

For those controls, qualification used native mouse input guarded by the exact window HWND obtained from accessibility/window evidence.

Buttons and accessibility snapshots continued to work normally.

## External-player requirement

Transport uses:

- server-generated in-memory WAV preview;
- browser AudioBuffer;
- Web Audio transport nodes.

It does not invoke the system default media player for preview.

## GitHub exact-commit evidence

- repository: `funggier/NoteScript` (public)
- transport implementation commit: `8bda4a9a84cc9fea25d0cee80588ac4a41558c77`
- GitHub Actions run: `39265689109` (CI run #6)
- result: `completed / success`
- successful steps include the new **Portable Control API transport smoke test**, which launches the built portable server, verifies the Project Transport UI, downloads an `Evening Walk` preview, and validates its RIFF/WAV header.

## Conclusion

NTS-003 transport is GREEN locally and on exact-commit GitHub CI.

Together with the persistent-live checkpoint, NTS-003 now satisfies the playback-engine roadmap scope and is COMPLETE.

NTS-004 — Desktop GUI portable is the active milestone.
