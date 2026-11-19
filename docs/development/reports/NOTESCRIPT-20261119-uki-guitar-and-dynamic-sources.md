# NoteScript — Uki Guitar and Dynamic User Sound Sources

Date: 2026-11-19 (Asia/Bangkok)

Status: **Locally implemented, tested, and installed on the Desktop Portable.** GitHub Release not requested; v0.4.2 is the next source version, not an already published release.

## Request

1. Make original user-recorded `C:\Users\CDQ-P\Desktop\uki-guitar` playable in NoteScript's Piano and song tracks.
2. Add Uki Guitar alongside Kazu Guitar in both one-hour compositions, without deleting earlier Kazu-only versions.
3. Allow all playable Piano sound packs, including folders added by the user in the future, to be selected for any compatible song track; no hardcoded installed-pack list or application restart.

## Source recordings and ownership

The recording owner explicitly confirmed personally recording all six Uki samples. The original source files are unmodified and are **not** MIT licensed. Distribution with NoteScript is owner-authorized; do not infer independent relicensing permission.

Source `UKI-01.wav`…`UKI-06.wav`: approximately 6.33 seconds each, 192 kHz / PCM32 / stereo. The supplied `pack.md` claimed E-flat tuning, but audio autocorrelation analysis identified standard-guitar roots approximately **E2 A2 D3 G3 B3 E4**. This mismatch was corrected in the new SoundPiano and SFZ manifests. Pitch shifting at import was deliberately avoided.

Processed samples: 48 kHz, PCM16, stereo, approximately 1,214,972 bytes each (six samples). Repeatable import script: `scripts/import-uki-guitar.js`. Each original file is retained separately and unmodified.

## New playable sources

- `examples/sounds/soundpiano/uki-guitar/pack.md` and six converted WAV samples.
- `examples/instruments/SFZ/uki-guitar/instrument.md` and `uki-guitar.sfz`; the SFZ reuses the SoundPiano WAVs instead of duplicating them.
- ID `uki-guitar` (SoundPiano), and `SFZ/uki-guitar` (Instrument).
- New mixed arrangements preserve their complete 60:00 score durations and all original bars:
  - `examples/longform-songs/peach-horizon-kazu-uki-one-hour.md`
  - `examples/longform-songs/golden-canopy-kazu-uki-canon-one-hour.md`
- Both existing Kazu-only compositions are preserved unmodified.

## Dynamic sound selection

- The underlying resolver already used filesystem scanning; the UI formerly loaded its sound list just once at startup.
- **Sounds → Refresh Libraries** now re-queries sound and instrument folders while Studio is running, refreshes Piano, Project Transport, and Compose track choices, and preserves the user's current selections whenever possible.
- Any correctly declared future `sounds/soundpiano/<folder>/pack.md` with available samples can be used in pitched-note tracks across all songs by selecting it in Compose → Form / Tracks; the chosen pack ID persists in the `.md`.
- Invalid custom pack folders are skipped and reported as issues rather than making all Studio sound listings unavailable.
- The installed package version is now read from `package.json` by both CLI help and the Control API Health endpoint.

## Validation

- `npm run check`: PASS, 30 JavaScript files.
- `npm test`: PASS, **30/30 tests**, including Uki SoundPiano + SFZ zone coverage, live custom-pack discovery after service initialization, resilience to invalid manifests, existing-song rendering with a custom pack, and health version reporting.
- `npm run portable`: PASS. The packaged project set is **27** Markdown files (25 prior packaged + 2 new mixed-guitar versions).
- `npm audit --audit-level=high`: PASS, zero vulnerabilities.
- Desktop Portable `C:\Users\CDQ-P\Desktop\NoteScript-portable` selectively upgraded to app version `0.4.2` without replacing user settings or previous song files. It retains **29** Markdown projects including two user-created previews.
- Desktop's existing raw Uki folder was backed up before installing the optimized, correctly keyed pack. Backups under `T:\Space\Projects\ProjectsProgram\NoteScript\out\desktop-uki-backup-20261119-162639`.
- `NoteScript.cmd validate` passed for both mixed songs; `validate-pack` passed for Uki SoundPiano; `validate-instrument` passed for Uki SFZ.
- Full Desktop WAV mixes were rendered for both mixed songs, each exactly **3600 seconds**, 44.1 kHz mono PCM16 with `tailSeconds: 0` for repeat use.
- Desktop Control API live check: version `0.4.2`, Uki SoundPiano appears with 6 correct root notes, SFZ instrument present, UI refresh button and implementation served. A temporary, valid SoundPiano folder was added after server startup and appeared immediately via the live API; it disappeared after deletion without server restart. The test folder was removed, and the initially stopped service was stopped again.

## User workflow

1. Add a folder with `pack.md` and sound files to `NoteScript-portable\sounds\soundpiano\<pack-id>\`.
2. In an already-open Studio window, choose **Sounds → Refresh Libraries**.
3. In Compose → Form or Tracks, change any pitched Track's source to the newly discovered SoundPiano ID. Save the project; every song can use any compatible pack.
4. Existing or new individual tracks can use different sounds simultaneously; sound packs are not required to be bundled in the Git repository.

No v0.4.2 GitHub Release was created as part of this request.
