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

## SoundPad

```notescript-sound
name: Forest SoundPad
version: 1
license: CC0-1.0
type: soundpad

trigger kick = kick.wav
trigger rain = rain.wav
```

SoundPad triggers can represent percussion, ambience, effects or arbitrary one-shots.

The built-in production SoundPad currently uses 16 deterministic triggers: `kick`, `snare`, `clap`, `closed-hat`, `open-hat`, `shaker`, `tom-low`, `tom-high`, `rim`, `cowbell`, `crash`, `ride`, `chime`, `click`, `laser`, and `impact`. The default Studio SoundPad hotkey table has 16 slots, so every built-in trigger receives a default binding while remaining fully remappable.

The preferred manifest token is `type: soundpad`. Legacy `type: kit` manifests remain accepted and are canonicalized to SoundPad.

## Built-in production packs

The repository-generated native library currently includes eight pitched packs plus one SoundPad pack:

- `piano`
- `electric-piano`
- `music-box`
- `organ`
- `synth-bass`
- `synth-lead`
- `warm-pad`
- `pluck`
- `soundpad`

All bundled WAV files are generated deterministically by `scripts/generate-core-sounds.js` and distributed under the NoteScript project MIT license. Third-party add-ons remain separate works and must preserve their own license/source metadata.

## Current decoder

v0.1 renders PCM16 WAV natively. Other audio formats are planned behind decoder adapters.

## Licensing

The NoteScript repository is MIT. Add-on audio assets are separate works. Keep `author`, `license`, and `source` in the manifest when redistribution terms require them.
