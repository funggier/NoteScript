# Kazu Guitar — Recording provenance and usage

## Source and permission

The recording owner supplied six original guitar recordings, `GR-01.wav`
through `GR-06.wav`, from the owner's local recording folder and explicitly
authorized incorporating the recordings into both the public NoteScript repository
and future distributed NoteScript releases. Attribution: **Kazu**, original guitar recordings.

The recording owner's permission covers inclusion and redistribution as part of
NoteScript. **This permission does not establish that the recordings are MIT-licensed
or grant independent redistribution or relicensing outside NoteScript.** The
NoteScript source-code MIT license does not change the recording owner's rights.
Contact the recording owner for other uses.

## Playable format

Original WAV files: approximately 6.08–6.10 seconds each, 192 kHz, 32-bit PCM,
stereo. The source recordings remain unchanged at the provided location.

Packaged copies: 48 kHz, PCM16, stereo. Small pitch corrections of at most
38 cents were applied for instrument tuning. No synthetic oscillator is substituted.
The importer is `scripts/import-kazu-guitar.js` and requires FFmpeg.

| Original | Sample root | Observed approximate pitch | Correction |
| --- | --- | --- | --- |
| GR-01.wav | D#2 | 76.85 Hz | +21 cents |
| GR-02.wav | G#2 | 104.38 Hz | -9 cents |
| GR-03.wav | C#3 | 141.64 Hz | -38 cents |
| GR-04.wav | F#3 | 186.23 Hz | -12 cents |
| GR-05.wav | A#3 | 232.61 Hz | +3 cents |
| GR-06.wav | D#4 | 317.36 Hz | -34 cents |

Notes were estimated by periodicity analysis of multiple windows. They indicate
approximately E-flat standard guitar tuning. Measurement is approximate, not a
claim of professional calibration.

## Where to use it

- SoundPiano: `sound: kazu-guitar`, selected as **Kazu Guitar** in Studio.
- SFZ instrument: `instrument: SFZ/kazu-guitar`, selected as **Kazu Guitar (SFZ)**.
- SFZ intentionally references the same WAV files from the SoundPiano folder to
  avoid duplicate copyrighted audio in the source tree and portable release.
- Both formats use nearest-root transposition to cover other notes, with changes
  in timbre at extreme intervals. A full chromatic multisample set would require
  additional recordings.

To re-import from the source recordings:

```powershell
node scripts/import-kazu-guitar.js "<folder-containing-original-recordings>"
```
