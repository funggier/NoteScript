# One-hour Kazu Guitar listening suites

Two original **60-minute** NoteScript projects are bundled with the portable edition. Both use the owner-authorized `kazu-guitar` sampled guitar source, varied note density, and harmonic turnarounds suitable for musical looping.

| Portable project | Score length | Tempo / key | Tracks | Structure |
| --- | ---: | --- | ---: | --- |
| `Peach Horizon - Kazu Guitar One Hour Journey.md` | 60:00 | 92 BPM / C major | 6 | 17 movements, quiet/active passages, G7-to-C return |
| `Golden Canopy - Kazu Guitar Canon Journey.md` | 60:00 | 96 BPM / D major | 7 | 18 movements, canon-inspired staggered lines, A7-to-D return |

The short project `Peach Horizon.md` remains a distinct existing example; the new 60-minute version is not a replacement.

## Listening and editing

1. Open `NoteScript.cmd` or `Studio.bat` in an extracted portable package.
2. Navigate to the **Project** view and select one of the two project names above. The songs are editable as ordinary Markdown in **Compose**.
3. The song score is 60:00 long. Full browser transport and Track Set/Stem WAV generation can be memory-intensive, so for hour-long background listening use the **CLI export** and an audio player with *Repeat One*.
4. Example from the portable folder:

   ```bat
   NoteScript.cmd validate "projects\Peach Horizon - Kazu Guitar One Hour Journey.md"
   NoteScript.cmd render "projects\Peach Horizon - Kazu Guitar One Hour Journey.md" -o "exports\Peach Horizon - Kazu Guitar One Hour Journey.wav"
   ```

   Substitute `Golden Canopy - Kazu Guitar Canon Journey.md` for the other song.

The normal CLI renderer adds approximately **0.5 seconds** of audio tail to exports. For an exact 3600-second WAV with no added tail (more suitable for repeating), run from the source directory:

```powershell
node --input-type=module -e "import fs from 'node:fs'; import {parseSong} from './src/parser.js'; import {renderToWav} from './src/renderer.js'; const input='examples/longform-songs/peach-horizon-kazu-one-hour.md'; const score=parseSong(fs.readFileSync(input,'utf8')); console.log(renderToWav(score,input,'out/peach-horizon-kazu-loop.wav',{portableRoot:process.cwd(),tailSeconds:0}));"
```

For the portable folder, use `./app/src/parser.js`, `./app/src/renderer.js`, `./runtime/node.exe`, and the appropriate path under `./projects/`, with `portableRoot: process.cwd()`.

**Loop qualification:** Matching musical harmony at the boundary is the aim; this is not a guarantee of a perceptually imperceptible loop in every player. Test playback across the boundary. NoteScript currently has no built-in crossfade render option, and the normal command-line WAV is **mono PCM16** at 44.1 kHz. A one-hour export is around **303 MiB** per song.

## Source files and recording rights

- `peach-horizon-kazu-one-hour.md`: new 6-track instrumental suite based on the atmosphere of the original short Peach Horizon example
- `golden-canopy-kazu-canon-one-hour.md`: new 7-track instrumental suite drawing on the harmonic sequence and contrapuntal character associated with Pachelbel's *Canon in D*; no third-party performance recording is bundled

The guitar recordings are distributed with permission from the recording owner; they are **not relicensed as MIT** with the application source. Refer to `docs/development/reports/KAZU-GUITAR-RECORDINGS.md`.

**Release policy:** Ship the editable `.md` scores inside the portable ZIP; do not add hundreds of megabytes of pre-rendered WAV to that ZIP. Users can render locally.
