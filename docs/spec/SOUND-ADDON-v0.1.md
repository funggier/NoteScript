# Sound Add-on Specification v0.1

A NoteScript-native sound add-on lives under one of two behavior categories:

```text
sounds/
├─ soundpiano/<pack>/
└─ soundpad/<set>/
```

The pack/set folder name is the ID used by `sound:`. The legacy flat `sounds/<pack>/` layout remains readable for compatibility, but new add-ons should use the category layout.

The category folder is authoritative:

- `soundpiano/<pack>` is treated as `type: pitched`.
- `soundpad/<set>` is treated as `type: soundpad`.

This prevents a folder placed in the wrong behavioral category from silently acting as another type.

## Pitched SoundPiano pack

```text
sounds/soundpiano/WarmPiano/
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

Recommended folder:

```text
sounds/soundpad/ForestSoundPad/
├─ pack.md
├─ kick.wav
└─ rain.wav
```

Manifest:

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

The repository-generated native library currently includes eight SoundPiano pitched packs plus one SoundPad set:

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

Built-in paths are currently:

- `sounds/soundpiano/piano`
- `sounds/soundpiano/electric-piano`
- `sounds/soundpiano/music-box`
- `sounds/soundpiano/organ`
- `sounds/soundpiano/synth-bass`
- `sounds/soundpiano/synth-lead`
- `sounds/soundpiano/warm-pad`
- `sounds/soundpiano/pluck`
- `sounds/soundpad/soundpad`

## Current decoder

PCM16 WAV is decoded natively. When FFmpeg is available, NoteScript also decodes FLAC, OGG, OPUS, AIFF, MP3 and M4A through the decoder adapter.

## Licensing

The NoteScript repository is MIT. Add-on audio assets are separate works. Keep `author`, `license`, and `source` in the manifest when redistribution terms require them.
