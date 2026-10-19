# Current Task

## NTS-003 — Playback engine

Status: ACTIVE — PERSISTENT LIVE BASELINE QUALIFIED LOCALLY / CI PENDING

Goal: turn the NTS-002 audition foundation into a persistent low-latency playback engine suitable for serious live playing.

NTS-002 status: COMPLETE / GREEN

- implementation commit: `78c9e6510c518b6e74110ab0ecbacf30392bc49a`
- GitHub Actions run: `39259150920`
- exact-commit CI: SUCCESS
- repository visibility: PUBLIC
- evidence: `docs/development/reports/NOTESCRIPT-20261019-nts002-audio-adapters-live-audition.md`

## NTS-003 acceptance

- [x] Persistent note-on/note-off engine for SoundFont instruments.
- [x] Avoid per-note fast-render/WAV round trip during serious live playing.
- [x] Select/change live instrument safely.
- [x] Polyphonic note state.
- [x] Sustain CC.
- [x] All-notes-off/panic.
- [x] Browser Audition Keyboard routes SF2/SF3 to the persistent live backend when available.
- [x] Native sound-pack/SFZ audition paths remain functional.
- [x] Optional Web MIDI input feeds the same note interface.
- [x] Live-engine status/capabilities exposed through Control API.
- [x] Process cleanup on source switch.
- [x] Process cleanup on service/server shutdown path.
- [x] Local real-audio qualification on Windows WASAPI.
- [x] Automated tests.
- [x] Portable qualification with backend under `tools/fluidsynth/`.
- [x] Clean portable fallback qualification without FluidSynth.
- [ ] Exact-commit GitHub CI GREEN.

Evidence:

`docs/development/reports/NOTESCRIPT-20261019-nts003-persistent-live-playback.md`

Qualification notes:

- Web MIDI integration is implemented and regression-tested structurally.
- A physical MIDI controller was not attached for this local qualification.
- Observed API/control-path timings are not laboratory end-to-end audio latency measurements.
- Managed DOM/browser automation remains unavailable because GeckoDriver/ChromeDriver is not installed.

## Remaining NTS-003 work after this checkpoint

The persistent live-note engine is the first NTS-003 checkpoint. NTS-003 remains ACTIVE until the playback/transport scope in the roadmap is addressed:

- song play / pause / stop;
- seek and loop;
- timeline/playhead state;
- output-device selection and latency tuning;
- stereo pan/gain path where applicable;
- preview through the playback engine rather than the external default player.

NTS-004 remains the desktop GUI milestone built on top of the completed NTS-003 playback layer.
