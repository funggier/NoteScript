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

## NTS-004 — Desktop GUI portable — ACTIVE

- Markdown editor.
- Syntax diagnostics.
- Timeline / piano roll.
- Separate Sound Pack and Instrument Browser.
- Playable on-screen piano keyboard for audition and live performance.
- Mouse + computer-keyboard input; future MIDI controller input.
- Transport.
- Render/export.
- Project management.

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

The NoteScript core remains AI-free.
