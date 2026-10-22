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
- [x] Top-level Play / Project / Compose / Sounds / Settings layout, with Tracks merged into Compose as a fourth editor view.
- [x] Play is the default first tab.
- [x] Game-style piano/performance HUD.
- [x] Existing playable on-screen piano/SoundPad controls retained.
- [x] Mouse/computer-keyboard/Web MIDI audition retained.
- [x] Remappable game-style hotkeys.
- [x] Performance hotkeys remain active after clicking buttons/selects/sliders while Play is active; switching to any other Studio tab disables performance hotkeys and releases held notes/sustain.
- [x] Physical-key mapping uses `KeyboardEvent.code`, so Thai keyboard layout keeps A/S/D/J/K/L and piano/SoundPad positions without language switching.
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

### Compose Tracks view

- [x] Tracks is a Compose sub-view sharing the same authoritative Markdown as Text/Form/Node.
- [x] Add Track directly to current Compose Markdown.
- [x] Each Track card independently edits Name, Source Type, Instrument / Sound, Volume, Pan, Velocity and Bars / Notes.
- [x] Each Track card has live Mute, individual Stem WAV and Delete.
- [x] Delete Track is disabled when only one Track remains.
- [x] Per-track full-duration audio stems.
- [x] Tracks Play/Pause/Stop/Seek automatically rebuilds stale stems on Play.
- [x] Mute works while playback is actively running without restarting other tracks.
- [x] Download current Compose `.md`, individual Stem WAV, Mix WAV and Track Set ZIP.

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

## NTS-007 BeatLane6

Status: **COMPLETE / GREEN / EXACT-COMMIT CI GREEN**

BeatLane6 is the current user-prioritized feature. NoteScript Markdown remains the authoritative music representation; gameplay charts are derived deterministically from the canonical timeline.

Implemented baseline:

- [x] Six lanes: `A S D | J K L`.
- [x] Deterministic Easy / Normal / Hard chart generation from existing `.md` projects.
- [x] 2.5-second pre-roll / approach highway.
- [x] Tap, simultaneous/chord and Hold notes.
- [x] Web Audio `AudioContext.currentTime` as gameplay timing authority.
- [x] Perfect / Great / Good / Miss judgement windows.
- [x] Combo, multiplier, score, weighted accuracy and max combo.
- [x] Life gauge, FAILED state and SUCCESS result path.
- [x] Successful hits play the source track's real NoteScript sound/instrument.
- [x] Optional low-volume project guide track synchronized to the same audio clock.
- [x] Pointer lanes plus simultaneous computer-keyboard input.
- [x] Game stop on window blur to avoid passive misses while focus is lost.
- [x] Bundled `BeatLane6 Starter.md` teaching all six lanes.
- [x] Portable Control API capability/chart endpoints.
- [x] Architecture documentation.
- [x] Local syntax check: 26 JavaScript files PASS.
- [x] Automated tests: 22/22 PASS.
- [x] Portable build and runtime/API smoke PASS.
- [x] Isolated browser UI smoke: Game mode, Starter discovery, Start, Fail, Restart, Stop and return to Live mode PASS.

Evidence:

- `docs/architecture/BEATLANE6.md`

Exact-commit qualification:

- implementation commit: `3ba3138136fe7d08c7a016e8edcf1bfb80b45463`
- GitHub Actions run: `39314541435`
- job: `test (24.x)`
- result: **SUCCESS**
- all workflow steps GREEN, including portable build, portable CLI smoke and Studio/Control API smoke.

Qualification report:

`docs/development/reports/NOTESCRIPT-20261020-nts007-beatlane6.md`

Deferred extensions, not required for the completed baseline:

- slide/drag notes
- manual chart overrides/editor
- persistent high scores
- input/audio offset calibration polish

## Post-NTS-007 BeatLane6 long-form song pack

Status: **COMPLETE / GREEN / EXACT-COMMIT CI GREEN**

- [x] Add five original long-form BeatLane6 songs.
- [x] Extend every song to 36 bars per Track and at least 60 seconds.
- [x] Keep four independent Tracks per song using bundled SoundPiano/SoundPad sources.
- [x] Qualify Easy / Normal / Hard chart generation for all five songs.
- [x] Use all six lanes on every difficulty.
- [x] Keep both Tap and Hold events on Normal.
- [x] Render all five songs to valid RIFF/WAV.
- [x] Copy all five songs into portable `projects/` with human-readable names.
- [x] Add portable CI validation and BeatLane6 API chart checks.
- [x] Exact-commit CI GREEN: run `39417096402` for commit `dc63dd14902ac4f54d9bb5398e0d1c5d9a811b23`.

Evidence:

`docs/development/reports/NOTESCRIPT-20261020-beatlane6-long-form-song-pack.md`

## Post-NTS-007 Studio source/render workflow

Status: **COMPLETE / GREEN / v0.2.0 PUBLISHED + VERIFIED**

Implemented:

- [x] Sound library taxonomy is `sounds/soundpiano/<pack>` and `sounds/soundpad/<set>`.
- [x] Category folders enforce pitched SoundPiano vs SoundPad behavior.
- [x] Legacy flat `sounds/<pack>` remains readable for compatibility.
- [x] Play Source is a single selector: `SoundPiano`, `SoundPad`, `GameBeatLane6`; separate Play Mode UI removed.
- [x] SoundPiano can select a native pack or playable standard Instrument add-on.
- [x] Project Transport is preview-only with temporary `Original Project` / SoundPiano / Instrument override.
- [x] Project Transport automatically rebuilds preview audio when Project or Preview voice changes; no separate Reload action is required.
- [x] Project Transport override does not rewrite the `.md` project and has no WAV save/download control.
- [x] Removed the redundant top-level Compose Track selector/source/volume toolbar; per-Track controls live inside Compose → Tracks.
- [x] Form track source is an installed-library selector rather than free-text source input.
- [x] Compose can import a local `.md` as an unsaved in-memory document without overwriting a saved Project.
- [x] Compose Play/Pause/Stop previews the current unsaved editor state through `/v1/render/audio`; Save is not required before listening.
- [x] Compose has custom filename + direct browser `Download WAV` for the current Compose Markdown.
- [x] Tracks is merged into Compose as the fourth editor view beside Text/Form/Node.
- [x] Compose Import `.md` is the single import path shared by all four Compose views.
- [x] Each Track card independently edits Name, Source Type, Instrument / Sound, Volume, Pan, Velocity and Bars / Notes in current Compose Markdown.
- [x] Each Track card has temporary live Mute, Stem WAV and Delete; the final remaining Track cannot be deleted.
- [x] Track edits invalidate stale stems automatically; Mix Play rebuilds them without a Reload action.
- [x] Track stem audio is rendered directly from current Compose Markdown through `/v1/tracks/track-audio`.
- [x] Compose → Tracks can download current `.md`, each individual Stem WAV, and a Mix WAV through `/v1/tracks/mix-audio`.
- [x] Tracks Mix WAV excludes tracks currently muted in the mixer.
- [x] Tracks can download a Track Set ZIP containing Markdown + current mix + every stem WAV + manifest; all stems are included even when a track is muted in the mix.
- [x] Studio settings schema v4 removes the legacy workspace-level selector; old `workspaceMode` data is discarded on migration. There is no Basic/Advanced product mode.
- [x] Local syntax check: 28 JavaScript files PASS.
- [x] Automated tests: 23/23 PASS.
- [x] Portable build/API/browser UI smoke GREEN.
- [x] Exact-commit GitHub Actions GREEN: run `39361275178` for release commit `143c239941db19a1abf39de045e3e83dea00f5d8`.
- [x] GitHub Release `v0.2.0` published and post-publish verified.

Release evidence:

`docs/development/reports/NOTESCRIPT-20261020-v0.2.0-release-qualification.md`

## Post-v0.2.0 expanded instrument and drum library

Status: **COMPLETE / GREEN / EXACT-COMMIT CI GREEN**

Production native sound baseline:

- 18 pitched SoundPiano packs total.
- Four guitar voices: Acoustic Guitar, Nylon Guitar, Clean Electric Guitar and Jazz Guitar.
- Six additional orchestral/mallet/voice colors: Strings, Flute, Marimba, Vibraphone, Choir and Soft Brass.
- Five SoundPad sets total: core SoundPad plus Acoustic Drums, Brush Drums, Electronic Drums and Lo-Fi Drums.
- Every built-in SoundPad set exposes the same 16 trigger names for drop-in kit switching.
- All new audio is deterministically generated by `scripts/generate-core-sounds.js` and carries NoteScript project MIT metadata.
- Unit/service audition tests cover the expanded library.
- Portable build contains all 18 SoundPiano packs and all 5 SoundPad sets.

Local qualification:

- syntax check: **28 JavaScript files PASS**
- automated tests: **24/24 PASS**
- portable build: **PASS**
- representative guitar/drum SHA-256 values are distinct
- implementation commit: `40c897b1659f3c5af6f0e70d54fad61c02793cea`
- implementation CI run `39440016684`: **FAILURE** only because the Studio/API CI step did not create `Test Fixture.md`
- CI fixture fix commit: `ba23f6089b559de0a0cc28aaed75f6c3135b37a3`
- exact-commit GitHub CI run `39440640809`: **SUCCESS**

Evidence:

`docs/development/reports/NOTESCRIPT-20261020-expanded-instrument-drum-library.md`

## Post-v0.2.0 ten-song listening pack

Status: **COMPLETE / GREEN / EXACT-COMMIT CI GREEN**

- [x] Promote all ten local trial songs into `examples/listening-songs/`.
- [x] Use Synth Bass as the Quiet Neon lead.
- [x] Use Marimba as the Rain on the Balcony lead.
- [x] Use Vibraphone as the River Lanterns lead.
- [x] Keep all songs at four tracks and 48 bars per track.
- [x] Keep every song in the two-to-three-minute target window.
- [x] Bundle all ten songs into portable `projects/`.
- [x] Add automated structure/source checks and portable CI validation.
- [x] Local syntax/test/portable qualification GREEN.
- [x] Exact-commit GitHub Actions GREEN: run `39445880482` for commit `718328258ba0f98c3aeab78af84e5d2cc0cca5c0`.

Evidence:

`docs/development/reports/NOTESCRIPT-20261020-ten-song-listening-pack.md`

## Post-v0.2.0 nine-song listening expansion

Status: **COMPLETE / GREEN / EXACT-COMMIT CI GREEN**

- [x] Promote the nine selected second-batch trial songs into `examples/listening-songs/`.
- [x] Expand the production listening-song pack from 10 to 19 songs.
- [x] Bundle all nine new songs into portable `projects/`.
- [x] Extend automated structure/source checks and portable CI validation.
- [x] Exact-commit GitHub Actions GREEN: run `39450835736` for commit `fccdc8634372c3e30615cdc779a9b261365f99f5`.

Evidence:

`docs/development/reports/NOTESCRIPT-20261020-nine-song-listening-expansion.md`

## v0.3.0 release

Status: **COMPLETE / PUBLISHED / POST-PUBLISH VERIFIED**

- [x] Set package, CLI and Control API version metadata to 0.3.0.
- [x] Release scope includes the expanded native sound library and 19-song listening pack.
- [x] Exclude Desktop-only third-party SFZ testing libraries from release artifacts.
- [x] Local release qualification GREEN.
- [x] Exact release-commit GitHub Actions GREEN: run `39463899318` for commit `c57f27286459f8731cb5a8b5bf2e789bfe7e0d8c`.
- [x] Annotated `v0.3.0` tag created at exact release commit.
- [x] Portable ZIP + SHA-256 published.
- [x] Post-publish verification GREEN.

Evidence:

`docs/development/reports/NOTESCRIPT-20261021-v0.3.0-release-qualification.md`

## Post-v0.3.0 Piano multi-key / rollover fix

Status: **COMPLETE / GREEN / EXACT-COMMIT CI GREEN / DESKTOP LIVE**

- [x] Confirm Piano has no explicit 7/8-voice software polyphony cap.
- [x] Add `CHORD HOLD` workaround for low-rollover computer keyboards.
- [x] Keep normal simultaneous keyboard/MIDI behavior unchanged when Chord Hold is off.
- [x] Preserve key-up state while sample buffers load asynchronously.
- [x] Cancel unresolved pending voices on panic/source changes.
- [x] Syntax check GREEN: 28 JavaScript files.
- [x] Automated tests GREEN: 25/25.
- [x] Portable build GREEN.
- [x] Firefox live UI confirms `CHORD HOLD` toggles and Piano keys remain playable.
- [x] Exact-commit GitHub Actions GREEN: run `39757804146` for commit `278fcf5aa581c4b5844b450c4bcfd1b347fcb76f`.
- [x] Desktop portable refreshed by copying only UI/README files; existing `config/network.json` (`127.0.0.1:19432`) and current `instruments/` contents were left untouched.

Evidence:

`docs/development/reports/NOTESCRIPT-20261022-piano-multikey-rollover-fix.md`

## v0.3.1 release

Status: **ACTIVE / LOCAL GREEN / RELEASE-COMMIT CI PENDING**

- [x] Select patch version `v0.3.1`; no tag/release collision exists.
- [x] Align package, CLI and Control API version metadata to 0.3.1.
- [x] Define release scope as post-v0.3.0 Piano multi-key/rollover maintenance plus current main documentation state.
- [x] Preserve historical releases/tags unchanged.
- [x] Full local release qualification GREEN: audit 0 vulnerabilities, syntax 28 files, tests 25/25, portable/API/version smoke GREEN.
- [ ] Release commit pushed and exact-commit GitHub Actions GREEN.
- [ ] Annotated `v0.3.1` tag created/pushed at exact release commit.
- [ ] Portable ZIP + SHA-256 built from tagged source tree.
- [ ] GitHub Release published.
- [ ] Post-publish download/hash/version verification GREEN.

Evidence:

`docs/development/reports/NOTESCRIPT-20261022-v0.3.1-release-qualification.md`
