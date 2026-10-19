# Current Task

## NTS-003 — Playback engine

Status: ACTIVE — TRANSPORT QUALIFIED LOCALLY / EXACT-COMMIT CI PENDING

Goal: provide a stable live-note and project-transport playback layer before the desktop GUI milestone.

## Completed NTS-003 checkpoint A — Persistent live playback

- [x] Persistent note-on/note-off engine for SF2/SF3.
- [x] No per-note fast-render/WAV round trip in live SoundFont mode.
- [x] Safe live instrument switch.
- [x] Polyphonic note state.
- [x] Sustain CC64.
- [x] Panic/all-notes-off.
- [x] Audition Keyboard routes SF2/SF3 to live backend when available.
- [x] Native sound/SFZ audition paths remain functional.
- [x] Optional Web MIDI feeds the shared note interface.
- [x] Live status/capabilities exposed through Control API.
- [x] Cleanup on source switch and service/server shutdown.
- [x] Windows WASAPI real-audio qualification.
- [x] Portable live-backend discovery and clean fallback qualification.
- [x] Automated tests.
- [x] Exact-commit GitHub CI GREEN:
  - commit: `a70e43bb791ed609f491a7257463a58e6d61c375`
  - run: `39262242295`

Evidence:

`docs/development/reports/NOTESCRIPT-20261019-nts003-persistent-live-playback.md`

## Completed NTS-003 checkpoint B — Project transport

- [x] In-memory full-project preview rendering.
- [x] Bounded project preview cache with invalidation.
- [x] Play.
- [x] Pause/resume.
- [x] Stop/reset.
- [x] Seek/playhead.
- [x] Full-project loop.
- [x] Preview volume.
- [x] Preview stereo pan through Web Audio.
- [x] Preview through NoteScript/browser playback rather than external player.
- [x] Browser output-device selector when Web Audio `setSinkId` is available.
- [x] Graceful default-output fallback when output selection is unsupported.
- [x] Firefox live UI qualification: Load/Play/Pause/Stop/Seek/Loop.
- [x] Chrome live UI qualification: output selection + restore default.
- [x] Portable preview API qualification.
- [x] Preview cache timing evidence: first render ~45 ms, cache hit ~2 ms for Evening Walk.
- [x] Source syntax check GREEN: 23 JavaScript files.
- [x] Automated tests GREEN: 19/19.
- [ ] Exact-commit GitHub CI GREEN for transport implementation.

Evidence:

`docs/development/reports/NOTESCRIPT-20261019-nts003-transport-preview.md`

## Qualification boundaries

- Physical MIDI controller input is implemented but was not hardware-qualified in this session.
- Live API timing observations are control-path timings, not laboratory end-to-end audio latency.
- Firefox tested here does not expose `AudioContext.setSinkId`; Chrome 155 does and switched output successfully.
- Per-track deterministic stereo/pan processing in the offline renderer remains a future enhancement; current pan is preview transport pan.
- Direct selectable audio devices for the persistent FluidSynth live backend remain a future latency/device-tuning enhancement.

## Gate

NTS-003 remains ACTIVE only until the transport implementation receives exact-commit GitHub CI GREEN.

After that gate, mark NTS-003 COMPLETE and activate NTS-004 — Desktop GUI.
