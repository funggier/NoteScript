# NoteScript NTS-004 Qualification — Studio Basic / Advanced

Date: 2026-10-19

## Scope

NTS-004 converts the Audition prototype into NoteScript Studio while preserving the Markdown-first, AI-free core.

Qualified areas:

- tabbed Studio shell;
- Play-first game-style piano;
- project management;
- Text/Form/Node editing of one Markdown source;
- diagnostics;
- Sound/Instrument browsers;
- remappable hotkeys;
- Advanced multi-track arrangement;
- Advanced per-track stem playback;
- Mute/Unmute during playback;
- portable Studio launcher.

## Source qualification

Latest local source checks:

- `npm run check`: PASS — 23 JavaScript files.
- `npm test`: PASS — 20 tests, 20 passed.
- replacement-character scan across source/test/scripts: clean.
- `npm run portable`: PASS.

Automated coverage now includes:

- Studio project CRUD;
- unsaved analyze API;
- Studio settings/hotkeys;
- in-memory project transport;
- per-track stem rendering;
- per-track stem cache reuse and invalidation;
- invalid track-index rejection;
- Studio tabs and Compose modes;
- Advanced transport/Mute contract;
- Node Inspector contract;
- existing parser/audio/playback regression coverage.

## Studio shell qualification

Portable UI title:

`NoteScript Studio`

Main tabs visible and functional:

- Play
- Project
- Compose
- Tracks
- Sounds
- Settings

Play is the default first tab.

### Play page

Qualified:

- performance HUD;
- game-style piano deck;
- velocity/octave/voice display;
- live sound/instrument selection;
- existing mouse/keyboard/Web MIDI paths;
- project preview transport.

The on-screen piano displays current computer-keyboard bindings as keycaps.

## Project / Compose qualification

### Project flow

Portable UI was used to:

1. create an unsaved project;
2. analyze it;
3. receive VALID diagnostics;
4. save it;
5. confirm Saved state;
6. later remove the temporary project.

### Text / Form shared source

An existing project was opened.

Form mode changed tempo from 90 to 100.

After Save, Control API readback showed both:

- Markdown line `tempo: 100`;
- parsed song tempo `100`.

This verifies Form -> Markdown -> parser round-trip.

### Advanced -> Form linkage

Clicking an Advanced track header opened Compose/Form and focused the corresponding track editor.

This verifies Advanced remains a view/controller over the same project rather than a detached editor.

## Node mode qualification

Latest portable artifact used a temporary copy of Evening Walk.

Node view displayed:

`Track -> Bar -> Event`

The first chord Event node was selected.

Node Inspector changed:

`[C4 E4 G4] h @78`

to:

`[D4 F4 A4] h @78`

After Apply:

- Node view immediately showed the new chord;
- bar node showed the updated event sequence;
- project state became unsaved.

After Save, direct disk inspection showed:

`bar 1: [D4 F4 A4] h @78 | E4 q @78 | G4 q @78`

The temporary project was deleted after qualification. Portable project list returned to:

- Evening Walk.md
- SFZ Basic.md

## Hotkey remapping qualification

Settings exposed a game-style binding editor.

Local qualification performed:

- select Note C binding;
- change `A -> Q`;
- UI reported the binding changed locally;
- Reset restored defaults;
- no settings save was performed during that temporary remap.

Bindings drive both keyboard input and piano keycap labels.

### Direct piano hotkey edit

A second workflow is now available directly on the Play piano.

Qualified sequence:

1. choose Piano;
2. click **EDIT HOTKEYS**;
3. click the mapped C4 piano key;
4. UI reports `C4 · current A · press a new keyboard key.`;
5. press virtual-key `Q`;
6. key accessibility label changes `A C4 -> Q C4`;
7. choose **CANCEL**;
8. key label returns to `A C4`;
9. `GET /v1/studio/settings` still reports `note0: "a"`.

Save path was qualified separately:

1. enter direct edit again;
2. select C4;
3. press virtual-key `Q`;
4. choose **SAVE**;
5. settings API reports `note0: "q"` while all unrelated defaults, including `note11: "j"`, remain intact.

Cleanup qualification then used the same direct UI flow to set C4 back to `A` and Save.

Final settings evidence:

- `note0: "a"`
- `note1..note12: w s e d f t g y h u j k`
- octave/sustain/panic/transport bindings at defaults.

During direct edit:

- piano clicks select keys instead of sounding notes;
- only the current 13-key computer mapping is emphasized as editable;
- other visible piano keys are subdued;
- current hotkeys remain visible as faint keycaps next to note names;
- normal musical keyboard input is suppressed until Save/Cancel.

### Piano label alignment fix

A UI defect was reproduced from the Play page where note labels could appear near a key boundary rather than centered inside the physical key shape.

Root cause:

- `.note-label` was absolutely positioned with `width: 100%` but without an explicit horizontal anchor;
- the browser could therefore retain the span's static-position offset.

Fix:

- note-label layer now uses `left: 0; right: 0; width: auto;`;
- the fix applies to both white and black keys;
- hotkey keycaps remain centered with `left: 50%` + `translateX(-50%)`.

### SoundPad hotkeys and per-pad mix

SoundPad controls use the same game-style binding workflow as the piano and add an independent volume mixer per trigger.

Portable qualification with the built-in SoundPad:

Initial pad labels:

- `kick 1`
- `shaker 2`

Each SoundPad control exposes a dedicated `VOL` slider and percentage.

Hotkey qualification retained the previous behavior:

1. click **EDIT HOTKEYS**;
2. select `kick 1`;
3. press virtual-key `Q`;
4. pad accessibility label changes to `kick Q`;
5. **CANCEL** restores the pre-edit mapping without persistence;
6. **SAVE** persists through `soundPadHotkeys`.

Per-pad mixer qualification:

1. selected SoundPad;
2. moved the `shaker volume` slider from 100% to 44%;
3. UI monitor reported `SoundPad mix: shaker = 44%`;
4. settings API persisted:
   - `soundPadVolumes.soundpad.kick: 1`
   - `soundPadVolumes.soundpad.shaker: 0.44`;
5. clicked `shaker 2`;
6. live monitor reported `SoundPad: shaker · volume 44%`, confirming the trigger path consumes the stored per-pad gain;
7. clicked **RESET MIX**;
8. UI showed both pad values at 100%;
9. settings API returned:
   - `soundPadVolumes.soundpad.kick: 1`
   - `soundPadVolumes.soundpad.shaker: 1`;
10. monitor reported `SoundPad mix reset to 100%.`.

Control-service tests additionally verify mixer input is clamped to 0–1.

SoundPad mappings and mix values are stored per sound-pack ID, so each installed SoundPad can maintain an independent layout and balance.

New manifests use `type: soundpad`; legacy `type: kit` remains accepted and canonicalizes to SoundPad.

One initial qualification attempt using synthesized text input produced an incorrect `J` event; repeating with an actual virtual-key `Q` produced the expected result. This was isolated to the Windows automation input method, not NoteScript's capture or persistence logic.

## Advanced multi-track playback

### Engine architecture

Each project track can be rendered as a separate full-duration stem:

`GET /v1/transport/track-audio?project=Evening%20Walk.md&track=N`

Portable qualification:

- track 0: HTTP 200, WAV/RIFF
- track 1: HTTP 200, WAV/RIFF
- both stems: 2,109,316 bytes
- audio bytes differ between tracks
- stem cache path exercised
- automated tests confirm cache invalidation

Stems use the complete-mix normalization scale so track balance is not independently normalized.

### Browser playback

Advanced mode loaded two tracks:

- Soft Keys
- Light Pulse

Controls visible:

- Play
- Pause
- Stop
- Seek
- Reload Stems
- per-track MUTE

Play started synchronized multi-track playback.

Observed status:

`Playing multi-track mix · 0 muted`

During active playback, Soft Keys Mute was toggled.

Observed status:

`Muted Soft Keys during playback.`

The track button changed:

`MUTE -> UNMUTE`

Mute is implemented by changing the existing per-track GainNode while sources keep running; it does not re-render or restart the project.

The test then returned the track to unmuted state and stopped playback.

## Output and browser qualification

Prior NTS-003 transport qualification remains valid:

- Firefox: Play/Pause/Stop/Seek/Loop;
- Chrome: selectable output through Web Audio setSinkId when available.

NTS-004 browser qualification used Windows UI Automation plus guarded native input for HTML controls that the local UIA runtime cannot invoke directly.

The UIA limitation is in the automation adapter's missing LegacyIAccessiblePattern support, not in the Studio page.

## Portable qualification

The earlier multi-launcher prototype was consolidated after qualification.

Current portable command surface:

- `NoteScript.cmd` — the only command file containing runtime logic;
- `Studio.bat` — thin wrapper for `NoteScript.cmd studio`;
- `Start.bat` — thin wrapper for `NoteScript.cmd start`;
- `Stop.bat` — thin wrapper for `NoteScript.cmd stop`;
- `Status.bat` — thin wrapper for `NoteScript.cmd status`;
- `Validate.bat` — thin wrapper for `NoteScript.cmd validate`;
- `Render.bat` — thin wrapper for `NoteScript.cmd render`;
- bundled Node runtime;
- Studio UI;
- projects;
- sounds;
- instruments;
- Control API.

Legacy duplicate `.cmd` launchers are no longer generated.

`NoteScript.cmd status` was qualified in both states:

Stopped:

```text
NoteScript Control API
State : STOPPED
URL   : http://127.0.0.1:19427/
Health: N/A
```

Running:

```text
NoteScript Control API
State : RUNNING
PID   : 26656
URL   : http://127.0.0.1:19427/
Health: OK
```

A second start reported the same PID and did not create a duplicate server.

Wrapper qualification:

- `Validate.bat` validated Evening Walk successfully;
- `Render.bat` produced a 2,109,316-byte RIFF/WAV and the temporary output was removed;
- `Stop.bat` stopped the server;
- `Status.bat` returned to STOPPED.

Qualification-only project/output data was removed after tests.

## Local CI-step rehearsal

The final portable Studio/API smoke step was rehearsed locally with the same PowerShell logic intended for GitHub Actions.

Result:

`PASS projectTracks=2 previewBytes=2109316 stem0=2109316 stem1=2109316`

Verified in one run:

- the portable single-entry command surface exists;
- Studio HTML contains Play/Tracks, Advanced transport and Node Inspector controls;
- project API returns a valid 2-track Evening Walk;
- default Studio settings are readable;
- full project preview is RIFF/WAV;
- track 0 stem is RIFF/WAV;
- track 1 stem is RIFF/WAV;
- track stem hashes differ.

## Production naming / SoundPad canonicalization

Production asset IDs and visible names are now:

- `piano` / **Piano**
- `soundpad` / **SoundPad**
- `SFZ/basic-sfz` / **Basic SFZ**
- portable project `SFZ Basic.md`

New SoundPad manifests use:

`type: soundpad`

The parser still accepts legacy `type: kit` and canonicalizes it to `soundpad`; automated tests cover that compatibility path.

A full source + portable scan reported:

- no obsolete prototype naming in file/folder names;
- no obsolete prototype naming in text assets;
- no mojibake/replacement characters.

Portable Control API discovery returned exactly the built-in production sound sources:

- `piano`, type `pitched`;
- `soundpad`, type `soundpad`.

## Exact-commit gate — GREEN

Qualified commit:

`62503c4c8186078e83a8cb195d93867dc36f7bd4`

GitHub Actions:

- run: `39292575647`
- job: `test (24.x)`
- conclusion: **SUCCESS**

All workflow steps passed:

- checkout/setup;
- `npm ci`;
- syntax check;
- automated tests;
- portable build;
- portable CLI smoke;
- portable Studio and Control API smoke;
- project/settings API smoke;
- production Piano/SoundPad discovery;
- full project preview WAV;
- per-track stem WAV;
- portable start/status/stop lifecycle.

NTS-004 is therefore COMPLETE / GREEN.
