# BeatLane6 Long-Form Song Pack Qualification

Date: 2026-10-20 (Asia/Bangkok)

Status: **COMPLETE / GREEN / EXACT-COMMIT CI GREEN**

## Scope

Five original long-form NoteScript songs were added specifically for BeatLane6:

| Song | Tempo | Duration | Normal events | Tap | Hold |
| --- | ---: | ---: | ---: | ---: | ---: |
| Sunlit Detour | 126 BPM | 68.6 s | 556 | 428 | 128 |
| Paper Satellites | 116 BPM | 74.5 s | 462 | 325 | 137 |
| Lemon Sky Arcade | 132 BPM | 65.5 s | 577 | 461 | 116 |
| Windowseat Polaroid | 104 BPM | 83.1 s | 402 | 251 | 151 |
| Afterimage Parade | 142 BPM | 60.8 s | 588 | 469 | 119 |

All compositions are original. They use broad warm / jangly / dreamy / playful indie-pop characteristics without copying an existing song's melody, lyrics or arrangement.

## Composition contract

Each song:

- has 4 independent NoteScript tracks;
- has 36 bars per track;
- uses bundled SoundPiano/SoundPad sources only;
- renders through the deterministic NoteScript renderer;
- generates deterministic Easy / Normal / Hard BeatLane6 charts;
- uses all six lanes on every difficulty;
- has both Tap and Hold events on Normal;
- lasts at least 60 seconds;
- is copied into the portable `projects/` directory with a human-readable filename.

## Local qualification

- syntax check: 28 JavaScript files PASS
- automated tests: 24/24 PASS
- all five source Markdown files validate
- all five songs render to valid RIFF/WAV
- portable build PASS
- portable project discovery contains all five songs
- portable BeatLane6 Normal chart API passes duration/event/Tap/Hold/six-lane checks for all five songs

Rendered WAV smoke:

- Afterimage Parade: 5,410,680 bytes / 61.3 s
- Lemon Sky Arcade: 5,817,236 bytes / 66.0 s
- Paper Satellites: 6,613,524 bytes / 75.0 s
- Sunlit Detour: 6,092,144 bytes / 69.1 s
- Windowseat Polaroid: 7,371,530 bytes / 83.6 s

## Portable project names

- `Afterimage Parade.md`
- `Lemon Sky Arcade.md`
- `Paper Satellites.md`
- `Sunlit Detour.md`
- `Windowseat Polaroid.md`

## Source location

`examples/beatlane6-songs/`

## Exact-commit qualification

- implementation commit: `dc63dd14902ac4f54d9bb5398e0d1c5d9a811b23`
- GitHub Actions run: `39417096402`
- workflow: `CI`
- result: **SUCCESS**
- portable CLI validation: PASS for all five songs
- portable BeatLane6 chart API smoke: PASS for all five songs
