# Current Task

## NTS-003 — Playback engine

Status: ACTIVE

Goal: turn the NTS-002 audition foundation into a persistent low-latency playback engine suitable for serious live playing.

NTS-002 status: COMPLETE / GREEN

- implementation commit: `78c9e6510c518b6e74110ab0ecbacf30392bc49a`
- GitHub Actions run: `39259150920`
- exact-commit CI: SUCCESS
- repository visibility: PUBLIC
- evidence: `docs/development/reports/NOTESCRIPT-20261019-nts002-audio-adapters-live-audition.md`

## NTS-003 current acceptance

- [ ] Persistent note-on/note-off engine for SoundFont instruments.
- [ ] Avoid per-note fast-render/WAV round trip during serious live playing.
- [ ] Select/change live instrument safely.
- [ ] Polyphonic note state.
- [ ] Sustain CC.
- [ ] All-notes-off/panic.
- [ ] Browser Audition Keyboard uses persistent live backend when available.
- [ ] Keep native sound-pack/SFZ audition paths functional.
- [ ] Optional MIDI-controller input should feed the same note interface.
- [ ] Live-engine status/capabilities exposed through Control API.
- [ ] Process cleanup on source switch/server shutdown.
- [ ] Local real-audio qualification on Windows.
- [ ] Automated tests.
- [ ] Portable qualification.
- [ ] Exact-commit GitHub CI GREEN.

Later NTS-003 work:

- song transport: play/pause/stop/seek/loop;
- low-latency output-device selection;
- persistent SFZ/native sample voice engine outside the browser where beneficial;
- recording/capture of live performance into NoteScript events as an explicit opt-in feature.
