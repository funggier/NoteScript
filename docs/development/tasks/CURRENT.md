# Current Task

## NTS-002 — Audio source adapters

Status: QUALIFIED LOCALLY / GITHUB CI PENDING

Goal: expand NoteScript beyond the original PCM16 WAV-only baseline while keeping the core portable, modular and AI-free.

Acceptance:

- [x] Decoder abstraction.
- [x] Native dependency-free PCM16 WAV path retained.
- [x] Optional FFmpeg decode path for FLAC/OGG/OPUS/AIFF/MP3/M4A.
- [x] Portable `tools/ffmpeg/` discovery.
- [x] Baseline SFZ parser/renderer.
- [x] SFZ song rendering.
- [x] SFZ audition-note rendering.
- [x] Optional FluidSynth backend.
- [x] SF2 song rendering with real CC0 SoundFont evidence.
- [x] SF2 audition-note rendering.
- [x] SF3 song rendering with real upstream SF3 evidence.
- [x] SF3 audition-note rendering.
- [x] Portable `tools/fluidsynth/` discovery verified without environment override.
- [x] Sound/instrument metadata and license/source fields preserved.
- [x] Browser-based Audition Keyboard foundation.
- [x] Mouse + computer-keyboard note input.
- [x] Polyphony / velocity / octave shift / sustain.
- [x] Kit trigger pads.
- [x] Capability reporting for optional backends.
- [x] Source syntax check GREEN: 21 JavaScript files.
- [x] Local tests GREEN: 14/14.
- [x] Final clean portable rebuild after temporary third-party qualification assets.
- [ ] Exact-commit GitHub CI GREEN.

Evidence:

`docs/development/reports/NOTESCRIPT-20261019-nts002-audio-adapters-live-audition.md`

## Next after NTS-002

NTS-003 will turn the audition foundation into a persistent low-latency playback engine suitable for serious live playing and future MIDI-controller input.
