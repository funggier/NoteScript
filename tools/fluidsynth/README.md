# Optional FluidSynth SoundFont Backend

NoteScript keeps SF2/SF3 support behind an optional backend.

Recommended portable layout on Windows:

```text
tools/
└─ fluidsynth/
   ├─ README.md
   ├─ LICENSE / COPYING files from the FluidSynth distribution
   └─ bin/
      ├─ fluidsynth.exe
      └─ required DLLs...
```

Lookup order:

1. `NOTESCRIPT_FLUIDSYNTH` environment variable.
2. Portable `tools/fluidsynth/bin/fluidsynth.exe`.
3. Portable `tools/fluidsynth/fluidsynth.exe`.
4. `fluidsynth` on PATH.

NoteScript uses FluidSynth as an external process for SoundFont fast rendering. The NoteScript source remains MIT licensed. FluidSynth is third-party software distributed under the LGPL; if you redistribute its binaries, include and comply with the corresponding FluidSynth license materials.

The backend is optional. Without FluidSynth:

- NoteScript-native `sounds/` still work.
- SFZ still works through NoteScript's own baseline adapter.
- SF2/SF3 remain discoverable but are marked non-playable.
