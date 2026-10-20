# NoteScript Roadmap

## NTS-001 — Bootstrap core — COMPLETE

- Markdown language v0.1.
- Parser/validator.
- Timeline.
- Native `sounds/` add-ons.
- Offline WAV renderer.
- MIDI export.
- Portable build.
- MIT license.
- Tests and CI.
- Control API.
- Standard-format instrument add-on hierarchy and validation.

Exit: source tests GREEN, example WAV renders, portable build runs from its own runtime, repository pushed.

## NTS-002 — Audio source adapters — COMPLETE

- Decoder abstraction.
- FLAC/OGG/AIFF support.
- SFZ renderer adapter.
- SF2/SF3 SoundFont adapter.
- Preserve per-add-on licensing metadata.

## NTS-003 — Playback engine — COMPLETE

- Real-time transport.
- Play/pause/stop/seek/loop.
- Low-latency output device selection.
- Stereo pan and gain.
- Preview without launching an external player.
- Shared note-on/note-off audition engine for native sound packs and supported instruments.
- Polyphonic live playing, sustain, velocity and future MIDI-input support.

## NTS-004 — Desktop GUI portable — COMPLETE

- Markdown editor.
- Syntax diagnostics.
- Timeline / piano roll.
- Separate Sound Pack and Instrument Browser.
- Playable on-screen piano keyboard for audition and live performance.
- Mouse + computer-keyboard input; future MIDI controller input.
- Transport.
- Render/export.
- Project management.
- Game-style remappable piano hotkeys.
- SoundPad hotkeys, per-pad volume mixing and persistent mix lock.
- Explicit left-to-right project preview pan semantics.
- Tracks multi-track stem playback with per-track Instrument / Sound, persistent Volume and live Mute/Unmute.
- Single portable command entry point plus thin BAT shortcuts.
- Single-file network host/port configuration.

Exit: local UI qualification GREEN and exact-commit GitHub Actions run `39292575647` SUCCESS for commit `62503c4c8186078e83a8cb195d93867dc36f7bd4`.

## NTS-005 — Musical language expansion

- Named patterns.
- Tempo maps.
- Articulations.
- Automation.
- Velocity layers / round-robin.
- Buses/effects.
- Reusable sections/phrases.

## NTS-006 — External automation integrations

- MCP bridge.
- ChatGPT Plugin over Control API.
- Stable action schema for create/update/validate/render.
- Authentication guidance for non-loopback integrations.

## Post-v0.1.0 — Built-in sound library expansion — COMPLETE

- Eight deterministic MIT pitched packs: Piano, Electric Piano, Music Box, Organ, Synth Bass, Synth Lead, Warm Pad and Pluck.
- SoundPad expanded to 16 drum/percussion/effect triggers.
- Portable discovery updated to require all nine production sound packs.
- Generated-audio signal/hash qualification.
- Exact-commit CI GREEN: run `39311308623` for commit `aabed272df0f8b07174f4bc9fde63e7bcb83704b`.

Evidence:

`docs/development/reports/NOTESCRIPT-20261020-sound-library-expansion.md`

## NTS-007 — BeatLane6 rhythm game — COMPLETE / GREEN

- [x] Six lanes using `A S D | J K L`.
- [x] Generate playable chart data from the canonical timeline of a NoteScript Markdown project.
- [x] Pre-roll / approach highway.
- [x] Tap notes, simultaneous notes/chords and Hold notes.
- [x] Web Audio clock as the song/game timing authority.
- [x] Judgement windows: Perfect / Great / Good / Miss.
- [x] Combo, multiplier, score, accuracy and max combo.
- [x] Life/groove gauge, fail state and success result screen.
- [x] Real NoteScript source sound/instrument playback when notes are hit.
- [x] Easy / Normal / Hard chart reduction without changing the authoritative Markdown song.
- [x] Bundled six-lane Starter project.
- [x] Portable API/Studio integration and local/browser qualification.
- [x] Exact-commit CI GREEN: run `39314541435` for commit `3ba3138136fe7d08c7a016e8edcf1bfb80b45463`.

Evidence:

`docs/development/reports/NOTESCRIPT-20261020-nts007-beatlane6.md`

Deferred follow-up:

- input/audio offset calibration polish
- slide/drag notes
- manual chart overrides/editor
- persistent local high scores

## Post-NTS-007 — BeatLane6 long-form song pack — COMPLETE / GREEN

- [x] Add five original 36-bar BeatLane6 songs.
- [x] Target roughly 1:01–1:23 per song for longer play sessions.
- [x] Qualify Easy / Normal / Hard charts with all six lanes.
- [x] Require Tap + Hold events on Normal.
- [x] Render all songs through the deterministic offline renderer.
- [x] Bundle the song pack into portable `projects/`.
- [x] Add automated and portable CI gates.
- [x] Exact-commit CI GREEN: run `39417096402` for commit `dc63dd14902ac4f54d9bb5398e0d1c5d9a811b23`.

Evidence:

`docs/development/reports/NOTESCRIPT-20261020-beatlane6-long-form-song-pack.md`

## Post-NTS-007 — Studio source taxonomy and render workflow — COMPLETE / v0.2.0 PUBLISHED

- [x] Categorize native sounds under `sounds/soundpiano/<pack>` and `sounds/soundpad/<set>`.
- [x] Preserve legacy flat sound-pack discovery for compatibility.
- [x] Replace separate Play Mode with one Play Source selector: SoundPiano / SoundPad / GameBeatLane6.
- [x] Let SoundPiano choose native packs or playable standard Instrument add-ons.
- [x] Add temporary Project Transport preview-voice override with automatic reload and no Markdown mutation.
- [x] Add local `.md` import shared by Compose Text/Form/Node/Tracks.
- [x] Add Play/Pause/Stop preview from the current unsaved Compose editor state.
- [x] Keep Project Transport preview-only with automatic preview rebuild for temporary SoundPiano/Instrument overrides.
- [x] Merge Tracks into Compose as the fourth view and remove the separate Tracks main tab/import path.
- [x] Remove the redundant top-level Track selector/Apply Track toolbar.
- [x] Make each Track card self-contained: Name, Source Type, Instrument / Sound, Volume, Pan, Velocity, Bars / Notes, Mute, Stem and Delete.
- [x] Prevent deletion of the final remaining Track.
- [x] Add current `.md`, individual Stem WAV, Mix WAV and Track Set downloads from Compose → Tracks.
- [x] Add Track Set ZIP export with current Markdown + mix + every stem + manifest.
- [x] Remove the legacy workspace-level selector and the Basic/Advanced product split; all Studio tabs are first-class.
- [x] Local tests, portable API and browser UI qualification GREEN.
- [x] Exact-commit CI GREEN: run `39361275178` for release commit `143c239941db19a1abf39de045e3e83dea00f5d8`.
- [x] GitHub Release `v0.2.0` published and post-publish verified.

Evidence:

`docs/development/reports/NOTESCRIPT-20261020-v0.2.0-release-qualification.md`



## Post-v0.2.0 — Expanded instrument and drum library — COMPLETE / GREEN

- [x] Add Acoustic Guitar, Nylon Guitar, Clean Electric Guitar and Jazz Guitar.
- [x] Add Strings, Flute, Marimba, Vibraphone, Choir and Soft Brass.
- [x] Add Acoustic Drums, Brush Drums, Electronic Drums and Lo-Fi Drums.
- [x] Keep all five SoundPad sets on one interchangeable 16-trigger contract.
- [x] Keep all bundled audio deterministic and MIT redistributable.
- [x] Extend automated discovery/audition tests and portable CI expectations to all 23 production packs.
- [x] Local syntax, tests and portable qualification GREEN.
- [x] Exact-commit GitHub Actions GREEN: run `39440640809` for commit `ba23f6089b559de0a0cc28aaed75f6c3135b37a3`.

Evidence:

`docs/development/reports/NOTESCRIPT-20261020-expanded-instrument-drum-library.md`



## Post-v0.2.0 — Ten-song listening pack — COMPLETE / GREEN

- [x] Promote all ten original two-to-three-minute trial songs into the repository.
- [x] Bundle the pack into portable projects.
- [x] Qualify 48 bars per track and the selected lead voices.
- [x] Local tests and portable build GREEN.
- [x] Exact-commit GitHub Actions GREEN: run `39445880482` for commit `718328258ba0f98c3aeab78af84e5d2cc0cca5c0`.

Evidence:

`docs/development/reports/NOTESCRIPT-20261020-ten-song-listening-pack.md`



## Post-v0.2.0 — Nine-song listening expansion — COMPLETE / GREEN

- [x] Promote nine selected songs from the second local trial batch.
- [x] Expand the listening-song pack to 19 long-form songs.
- [x] Bundle and validate the nine additions in portable output.
- [x] Exact-commit GitHub Actions GREEN: run `39450835736` for commit `fccdc8634372c3e30615cdc779a9b261365f99f5`.

Evidence:

`docs/development/reports/NOTESCRIPT-20261020-nine-song-listening-expansion.md`



## v0.3.0 — Expanded Sound Library & Listening Pack — COMPLETE / PUBLISHED / VERIFIED

- [x] Promote the post-v0.2.0 expanded native sound library into the next release.
- [x] Promote the complete 19-song listening pack into the next release.
- [x] Align package / CLI / API version metadata to 0.3.0.
- [x] Keep third-party Desktop-only instrument libraries outside the repository and release.
- [x] Exact release commit qualified by GitHub Actions: run `39463899318`.
- [x] Publish and verify `v0.3.0`.

Evidence:

`docs/development/reports/NOTESCRIPT-20261021-v0.3.0-release-qualification.md`

The NoteScript core remains AI-free.
