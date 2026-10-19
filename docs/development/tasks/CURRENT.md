# Current Task

## NTS-004 — Desktop GUI portable

Status: COMPLETE / GREEN

Goal: provide a practical portable NoteScript Studio while keeping Markdown as the authoritative song representation.

## NTS-003 status

COMPLETE / GREEN

Persistent live checkpoint:

- commit: `a70e43bb791ed609f491a7257463a58e6d61c375`
- Actions run: `39262242295`
- result: SUCCESS

Transport checkpoint:

- commit: `8bda4a9a84cc9fea25d0cee80588ac4a41558c77`
- Actions run: `39265689109`
- result: SUCCESS

## NTS-004 acceptance

### Studio shell / Play

- [x] Studio launcher/name distinct from the old Audition-only prototype.
- [x] Tabbed Play / Project / Compose / Tracks / Sounds / Settings layout.
- [x] Play is the default first tab.
- [x] Game-style piano/performance HUD.
- [x] Existing playable on-screen piano/SoundPad controls retained.
- [x] Mouse/computer-keyboard/Web MIDI audition retained.
- [x] Remappable game-style hotkeys.
- [x] Piano keycaps reflect current hotkey bindings.
- [x] Direct piano hotkey edit mode: click note -> press key -> Save/Cancel.
- [x] Direct hotkey Cancel restores the pre-edit snapshot without persistence.
- [x] Direct hotkey Save persists through Studio settings.
- [x] White-key and black-key note/hotkey labels are centered to their actual key bounds.
- [x] SoundPad controls display trigger name + faint current hotkey.
- [x] SoundPad hotkeys trigger pads from the computer keyboard.
- [x] SoundPad direct edit mode: click pad -> press key -> Save/Cancel.
- [x] SoundPad hotkeys persist per sound-pack ID in Studio settings.
- [x] SoundPad supports per-pad volume mixing from 0–100%.
- [x] SoundPad volume persists per sound-pack ID / trigger.
- [x] RESET MIX restores all pads in the selected SoundPad to 100%.
- [x] SoundPad mixer is locked by default for new/unconfigured SoundPads.
- [x] Locked SoundPad disables per-pad volume sliders and RESET MIX while preserving pad/hotkey playback.
- [x] Locked mixer visuals are subdued without persistent glow.
- [x] Project preview pan moves left-to-right as left speaker -> center -> right speaker.
- [x] Production sound IDs/names use Piano, SoundPad and Basic SFZ throughout.
- [x] New SoundPad manifests use `type: soundpad`.
- [x] Legacy `type: kit` manifests remain accepted and canonicalize to SoundPad.
- [x] Existing Project Transport retained.

### Project / Compose

- [x] Markdown project editor.
- [x] Load existing project text.
- [x] Create/save project.
- [x] Rename/delete project safely inside portable `projects/`.
- [x] Dirty/saved state indication.
- [x] Live syntax/semantic diagnostics without saving first.
- [x] Compose Text mode.
- [x] Compose Form mode writes back to the same Markdown.
- [x] Compose Node mode.
- [x] Node palette for Track/Bar/Note/Chord/Rest/Trigger.
- [x] Node Inspector for Bar/Event editing back into Markdown.
- [x] WAV render button.
- [x] MIDI export button.

### Advanced mode

- [x] Timeline / piano-roll-style multi-track visualization from analyzed Markdown.
- [x] Advanced track -> Compose/Form linkage.
- [x] Per-track full-duration audio stems.
- [x] Advanced Play/Pause/Stop/Seek.
- [x] Reload Stems.
- [x] Per-track Mute/Unmute.
- [x] Mute works while playback is actively running without restarting other tracks.
- [x] Project changes invalidate stale Advanced stems.

### Libraries / portable / qualification

- [x] Separate Sound Pack browser.
- [x] Separate Instrument browser.
- [x] Portable build exposes one launcher/command entry point: `NoteScript.cmd`.
- [x] `NoteScript.cmd` handles Studio, hidden API start, status, API stop, and CLI forwarding.
- [x] `status` reports process state, PID, URL and health.
- [x] Thin `.bat` shortcuts exist for Studio/Start/Stop/Status/Validate/Render without duplicating runtime logic.
- [x] Legacy duplicate `.cmd` launchers are no longer generated.
- [x] Control API host/port are defined only in `config/network.json`.
- [x] The single entry point reads the same network config before opening the browser.
- [x] Custom-port qualification passed by changing only `config/network.json` from 19427 to 19428.
- [x] Local browser/UI qualification.
- [x] Automated tests GREEN: 21/21.
- [x] Source syntax check GREEN: 25 JavaScript files.
- [x] Portable qualification.
- [x] Temporary qualification project removed; portable examples restored to baseline.
- [x] Exact-commit GitHub CI GREEN.

Exact-commit qualification:

- commit: `62503c4c8186078e83a8cb195d93867dc36f7bd4`
- Actions run: `39292575647`
- job: `test (24.x)`
- result: SUCCESS
- all steps GREEN, including portable build, CLI smoke, Studio/API smoke and production SoundPad discovery.

Evidence:

- `docs/architecture/STUDIO.md`
- `docs/development/reports/NOTESCRIPT-20261019-nts004-studio-basic-advanced.md`

## Architectural rule

The GUI calls stable Control API/service operations instead of duplicating parser, renderer or playback rules in browser code.

Markdown remains the authoritative editable song representation.

NTS-004 is closed.

## v0.1.0 release

Status: **COMPLETE / PUBLISHED / POST-PUBLISH VERIFIED**

Release: `v0.1.0`

Release commit: `38ac635f63e1e1da21c69c4331e0026ac4125b79`

Exact-commit CI: run `39297369709` — SUCCESS.

Portable asset SHA-256:

`19360903d4f8b1dc58a78fbda87f485e43e6cdd7ab3060274c6eb0647998e697`

Evidence:

`docs/development/reports/NOTESCRIPT-20261020-v0.1.0-release-qualification.md`

NTS-005 was not started in the release session. It remains planned but is not ACTIVE.

## Post-v0.1.0 sound library expansion

Status: **COMPLETE / EXACT-COMMIT CI GREEN**

Commit:

`aabed272df0f8b07174f4bc9fde63e7bcb83704b`

Exact-commit CI:

- run `39311308623`
- result: **SUCCESS**

Production library now contains eight pitched packs plus a 16-trigger SoundPad.

Evidence:

`docs/development/reports/NOTESCRIPT-20261020-sound-library-expansion.md`

## Next requested work — NTS-007 BeatLane6

Status: **PLANNED / NOT YET ACTIVE**

BeatLane6 is the next user-prioritized feature. It must use NoteScript Markdown songs as level/chart sources and retain Markdown as the authoritative music representation.
