# Instrument Add-on Specification v0.1

Standard instrument formats are intentionally separated from NoteScript-native `sounds/` packs.

## Required hierarchy

```text
instruments/
├─ SFZ/
│  └─ <Name>/
│     ├─ instrument.md
│     └─ ...
├─ SF2/
│  └─ <Name>/
│     ├─ instrument.md
│     └─ ...
└─ SF3/
   └─ <Name>/
      ├─ instrument.md
      └─ ...
```

The format folder is part of the instrument ID.

Example song reference:

```text
instrument: SFZ/SalamanderGrandPiano
```

## Manifest

```notescript-instrument
name: Salamander Grand Piano
version: 1
author: Original author
license: CC-BY-3.0
source: original-source
description: Wrapped SFZ library.
format: SFZ
entry: SalamanderGrandPianoV3.sfz
```

The `format:` value must match the parent folder.

For SF2/SF3, future manifests may also select `bank:` and `preset:`.

## v0.1 status

Discovery and validation are implemented for SFZ/SF2/SF3.

A first SFZ subset renderer/audition adapter is implemented. See `SFZ-ADAPTER-v0.1.md` for the supported boundary.

SF2/SF3 rendering and audition are implemented through the optional FluidSynth backend. If FluidSynth is absent, those add-ons remain discoverable/valid but non-playable. See `SOUNDFONT-ADAPTER-v0.1.md`.
