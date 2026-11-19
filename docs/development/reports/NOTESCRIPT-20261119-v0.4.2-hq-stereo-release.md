# NoteScript v0.4.2 — Uki Guitar + Dynamic Sound Sources + High Quality Stereo Export

Date: 2026-11-19 (Asia/Bangkok).

Status: **PUBLISHED / TAGGED / CI QUALIFIED / POST-DOWNLOAD VERIFIED / DESKTOP UPDATED**.

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
- The existing Desktop Portable was backed up before the verified release code and original Uki masters were installed; its user settings and projects were preserved.

## Public release, tagged build and verification

- **Published:** [NoteScript v0.4.2](https://github.com/funggier/NoteScript/releases/tag/v0.4.2), 2026-11-19T11:03:55Z.
- **Tag source:** `v0.4.2` -> `72412fe79132cd067f8e7a2e92519b3749caebd1` (exact local and public GitHub Actions-qualified commit).
- **GitHub Actions:** [run 44510624595](https://github.com/funggier/NoteScript/actions/runs/44510624595) completed with **success**: syntax, 32 automated tests, Portable build, packaged CLI HQ test, Studio and Control API checks.
- Built from a clean detached Git worktree at the tag using `npm ci && npm run portable`. The four hour-long Markdown scores were restored as exact Git tag blobs before packaging to avoid Windows CRLF conversion changes.
- **Release ZIP:** `NoteScript-v0.4.2-portable.zip`, 110,816,733 bytes, 305 archive entries, 27 editable `.md` projects.
- **ZIP SHA-256:** `4ff625ae1176a0d942114baef18df6ef0feb9f6d3099627a7d2ae63e71827ea3`.
- **Checksum file:** `NoteScript-v0.4.2-portable.zip.sha256` (98 bytes), SHA-256: `bcc5de195475438fc05ac917bac7802502a086f6ece8a3ed3d7ee2c358fcb56f`.
- Fresh ZIP extraction verified app version `0.4.2`, 27 projects, all four long-form scores, original masters at `192000 Hz / PCM32`, and exact SHA-256 matches for all six original owner-recorded Uki WAVs.
- Packaged CLI smoke test successfully rendered Kazu Guitar Demo as 48 kHz / 24-bit PCM Stereo.
- Downloaded both published Release assets back from GitHub; ZIP and SHA-256 sidecar are **byte-for-byte identical** to the locally qualified artifacts and match GitHub's reported digest and size.
- Published ZIP contains the six untouched high-resolution Uki master recordings and compact live samples, not pre-rendered 1-hour HQ WAVs.

## Existing Desktop installation

- Updated `C:\Users\CDQ-P\Desktop\NoteScript-portable` from the verified released ZIP's code and masters, without changing user's `projects/`, `exports/`, or `config/network.json`.
- Preserved all 29 local Markdown projects (including user-added preview tracks) and configured Port `19432`.
- Backed up previous code and Uki pack manifest under `T:\Space\Projects\ProjectsProgram\NoteScript\out\desktop-v0.4.2-hq-backup-20261119-180554`.
- Verified Desktop HQ CLI output is PCM24 Stereo and each copied original master still matches the user's original recording SHA-256.
- Desktop service was idle, so it was safely restarted; `http://127.0.0.1:19432/` returned healthy version `0.4.2`, served the HQ Export UI and recognized the HQ job status API.

Final status: **PUBLISHED / DOWNLOAD VERIFIED / DESKTOP UPDATED / SERVICE HEALTHY**. This documentation follow-up is on `main`; it does not move or overwrite the `v0.4.2` tag or prior releases.
