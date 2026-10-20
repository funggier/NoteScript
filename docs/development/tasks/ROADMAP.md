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

## Post-NTS-007 — Studio source taxonomy and render workflow — LOCAL GREEN

- [x] Categorize native sounds under `sounds/soundpiano/<pack>` and `sounds/soundpad/<set>`.
- [x] Preserve legacy flat sound-pack discovery for compatibility.
- [x] Replace separate Play Mode with one Play Source selector: SoundPiano / SoundPad / GameBeatLane6.
- [x] Let SoundPiano choose native packs or playable standard Instrument add-ons.
- [x] Add temporary Project Transport preview-voice override with automatic reload and no Markdown mutation.
- [x] Add installed-library Track + Source Type + Instrument / Sound + Volume controls to Compose Text/Form/Node.
- [x] Keep Project Transport preview-only with automatic preview rebuild for temporary SoundPiano/Instrument overrides.
- [x] Keep Tracks as an independent multi-track `.md` workspace.
- [x] Let Tracks import local Markdown into its own workspace and add tracks there.
- [x] Add per-track Source Type + Instrument / Sound selection, persistent Volume and live Mute.
- [x] Add edited `.md`, individual Stem WAV and Mix WAV downloads in Tracks.
- [x] Add Track Set ZIP export with current Markdown + mix + every stem + manifest.
- [x] Remove the legacy workspace-level selector and the Basic/Advanced product split; all Studio tabs are first-class.
- [x] Local tests, portable API and browser UI qualification GREEN.
- [ ] Exact-commit CI GREEN.

The NoteScript core remains AI-free.
