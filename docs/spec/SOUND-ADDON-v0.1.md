# Sound Add-on Specification v0.1

A NoteScript-native sound add-on is one folder under `sounds/`.

The folder name is the ID used by `sound:`.

## Pitched pack

```text
sounds/WarmPiano/
├─ pack.md
├─ C3.wav
├─ C4.wav
└─ G4.wav
```

Manifest:

```notescript-sound
name: Warm Piano
version: 1
author: Author
license: CC0-1.0
source: source-reference
description: Warm sampled piano.
type: pitched
fallback: nearest

sample C3 = C3.wav
sample C4 = C4.wav
sample G4 = G4.wav
```

`fallback: nearest` permits pitch shifting from the nearest mapped root sample.

## Named kit

```notescript-sound
name: Forest Kit
version: 1
license: CC0-1.0
type: kit

trigger kick = kick.wav
trigger rain = rain.wav
```

Named triggers can represent percussion, ambience, effects or arbitrary one-shots.

## Current decoder

v0.1 renders PCM16 WAV natively. Other audio formats are planned behind decoder adapters.

## Licensing

The NoteScript repository is MIT. Add-on audio assets are separate works. Keep `author`, `license`, and `source` in the manifest when redistribution terms require them.
