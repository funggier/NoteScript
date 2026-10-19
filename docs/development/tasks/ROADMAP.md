# NoteScript Roadmap

## NTS-001 — Bootstrap core — ACTIVE

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

## NTS-002 — Audio source adapters

- Decoder abstraction.
- FLAC/OGG/AIFF support.
- SFZ renderer adapter.
- SF2/SF3 SoundFont adapter.
- Preserve per-add-on licensing metadata.

## NTS-003 — Playback engine

- Real-time transport.
- Play/pause/stop/seek/loop.
- Low-latency output device selection.
- Stereo pan and gain.
- Preview without launching an external player.

## NTS-004 — Desktop GUI portable

- Markdown editor.
- Syntax diagnostics.
- Timeline / piano roll.
- Sound and instrument browser.
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
