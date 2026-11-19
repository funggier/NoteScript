# NoteScript v0.4.2 — Uki Guitar + Dynamic Sound Sources + High Quality Stereo Export

Date: 2026-11-19 (Asia/Bangkok).

Status: **Local qualified. Public CI / tagged release pending**.

## Delivered

- Uki Guitar from six owner-recorded WAV files; standard-tuned E2 A2 D3 G3 B3 E4, both `uki-guitar` SoundPiano and `SFZ/uki-guitar` instrument.
- Owner's six untouched 192 kHz / PCM32 / Stereo Uki files in `examples/sounds/soundpiano/uki-guitar/masters/`, exactly matching original SHA-256. Compact 48 kHz / PCM16 / Stereo samples remain at pack root for normal play.
- Dynamic user-provided `sounds/soundpiano/<folder>` pack discovery via **Sounds → Refresh Libraries**. Any valid discovered SoundPiano can be selected for any pitched Track in any song. Broken manifests do not suppress working packs.
- Two new 60-minute Kazu + Uki versions of Peach Horizon and Golden Canopy, leaving the original two Kazu-only scores unchanged.
- Independent streaming HQ WAV renderer: PCM24 Stereo at 48 or 96 kHz; preserves L/R channels and track pan, prioritizes master WAV where available, does windowed-sinc input rate conversion, cubic note resampling, two-pass peak normalization, and writes 2-second chunks without loading the entire song into memory.
- 48/96 kHz HQ export in Studio Compose, with asynchronous server process, job status/progress, and Cancel control. The WAV is saved to the local Portable `exports/` directory and omitted from the release ZIP.
- `NoteScript.cmd render-hq "projects\<song>.md" -o "exports\<song> HQ.wav" --rate 48000` (or `96000`), output is exact score duration with no default 0.5-second tail for loop-ready timing.
- Existing live Piano and quick 44.1 kHz PCM16 Mono export remain unchanged.

## Known boundaries

- HQ source inputs: WAV PCM16/24/32 or Float32, mono/stereo, maximum 35 seconds per source sample; supported voice types SoundPiano, SoundPad and SFZ. SF2/SF3 instruments and compressed sample sources remain on standard renderer, not HQ.
- HQ output is 24-bit (not unmodified 32-bit original samples); speed/pitch shifts and mixing still alter audio. The preservation claim covers original master files and source stereo channels before mixing.
- One-hour 48 kHz PCM24 stereo uses ~0.97 GiB; 96 kHz uses ~1.93 GiB. RIFF/WAV has a 4 GiB limit. For long scores HQ runs as a streamed offline process and can take significant time.
- The recording owner's supplied permissions authorize distribution with NoteScript, but do not put their original audio under the MIT code license.

## Verification completed locally

- `npm run check` PASS (31 JS files).
- `npm test` PASS **32/32 tests**, including HQ stereo 48/96 kHz, original master selection, byte-accurate PCM24 WAV headers, dynamic audio packs and all previous functionality.
- `npm run portable` PASS (27 bundled Markdown projects).
- `npm audit --audit-level=high` PASS (0 vulnerabilities).
- HQ command-line smoke test passed with a real SFZ Kazu guitar project.
- HQ background service integration verified: launch, poll, WAV output and cancellation with partial-file cleanup.
- HTTP Studio API: POST `/v1/render/hq`, GET `/v1/render/hq/status`, and front-end button were exercised on the extracted Portable. Resulting WAV verified with ffprobe as 48 kHz PCM24 Stereo.
- The original local Desktop Portable was not overwritten during release preparation.

## Release check to complete

- Commit changes to `main`, verify exact-commit GitHub Actions success, tag `v0.4.2`, build a new ZIP from the tag and include a SHA-256 sidecar, download GitHub assets back, verify byte-for-byte identities.
- Keep previous v0.4.1 release unchanged.
