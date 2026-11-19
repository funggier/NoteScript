# Uki Guitar — Recording provenance, tuning and use

## Source and permission

The user confirms they personally recorded the six original guitar samples in `C:\Users\CDQ-P\Desktop\uki-guitar\UKI-01.wav` through `UKI-06.wav` and authorized their use in NoteScript.

Credit: **Uki — original guitar recordings**. Distribution with this NoteScript project is owner-authorized; the audio itself is **not licensed under the MIT software license**, nor is independent reuse automatically granted. Keep this notice in releases containing the recordings.

## Input vs. portable audio

- Original files: 192,000 Hz, stereo, signed 32-bit PCM, approximately 6.33 seconds each, ~9.7 MB per file.
- Playable copies: 48,000 Hz, stereo, signed 16-bit PCM, resampled with FFmpeg; original recordings are never modified.
- The supplied initial `pack.md` stated E-flat tuning, but pitch analysis showed the six files to be consistent with **standard guitar tuning**: approximately E2, A2, D3, G3, B3 and E4. The shipping roots are corrected accordingly. No intentional pitch shift is applied; minor tuning drift inherent in recordings remains.

| File | Assigned root | Equal-tempered frequency (Hz) |
| --- | --- | ---: |
| UKI-01.wav | E2 | 82.41 |
| UKI-02.wav | A2 | 110.00 |
| UKI-03.wav | D3 | 146.83 |
| UKI-04.wav | G3 | 196.00 |
| UKI-05.wav | B3 | 246.94 |
| UKI-06.wav | E4 | 329.63 |

These are the note targets, not laboratory measurements of each file; pitch was evaluated using periodicity over several windows.

## High-resolution masters for HQ Render (v0.4.2)

The six untouched original PCM32 / Stereo / 192 kHz WAV recordings are copied byte-for-byte into `examples/sounds/soundpiano/uki-guitar/masters/UKI-01.wav` through `UKI-06.wav`. The SoundPiano root-level samples remain compact PCM16 / Stereo / 48 kHz for live play. **HQ Export** automatically prefers the matching master; it creates 48 or 96 kHz / 24-bit Stereo WAV output without installing FFmpeg. The 192 kHz masters are not passed through directly: each note is resampled and mixed, and output is 24-bit. The original files remain independently owned and are not licensed as MIT.

## Use in any song

- SoundPiano track: `sound: uki-guitar`
- SFZ instrument track: `instrument: SFZ/uki-guitar`
- In Studio, play it in Piano or select it on any pitched-note Track in Compose (Form / Tracks).
- For existing songs, change an individual Track's source from any playable SoundPiano pack to `uki-guitar`; no change to note data required.
- A SoundPiano folder added in the future under `sounds/soundpiano/<folder>` becomes available after opening Studio or using **Sounds → Refresh Libraries**. The folder needs a valid `pack.md` and referenced sound files. Project folders are independent and portable; do not hardcode drive letters in manifests.

To convert the original Uki recordings again:

```powershell
node scripts/import-uki-guitar.js "C:\Users\CDQ-P\Desktop\uki-guitar"
```

The import script needs FFmpeg on PATH and writes only into the repository's `examples/sounds/soundpiano/uki-guitar` target. It does not modify source files.
