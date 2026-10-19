# SFZ Adapter v0.1

Status: implemented baseline subset.

The first NoteScript standard-format instrument renderer targets SFZ because SFZ is text-based, sample-oriented and naturally fits the portable add-on model.

## Supported baseline concepts

The parser currently understands:

- `<control>`
- `<global>`
- `<group>`
- `<region>`
- `default_path`
- `sample`
- `key`
- `lokey` / `hikey`
- `lovel` / `hivel`
- `pitch_keycenter`
- `tune`
- `transpose`
- `volume`
- `pan` metadata
- `offset`
- `end`
- `loop_mode` metadata
- `ampeg_attack`
- `ampeg_release`

Note names such as `C4` and numeric MIDI keys are accepted for key-related opcodes.

## Rendering

A NoteScript track can use:

```text
track Piano
instrument: SFZ/MyPiano
volume: 0.6
bar 1: C4 q | E4 q | G4 h
```

For each note event the adapter:

1. selects regions matching key and velocity;
2. decodes each selected sample through the shared audio decoder layer;
3. calculates pitch from root key, transpose and tune;
4. applies region volume and a simple attack/release envelope;
5. mixes the result into the deterministic offline renderer.

## Audition

The Control API can render one SFZ note for the Audition Keyboard:

`GET /v1/audition/instrument?instrument=SFZ/MyPiano&note=60&velocity=96`

The browser caches rendered audition notes.

## Compatibility boundary

This is intentionally not described as full SFZ compatibility yet.

Still planned include:

- loop playback semantics;
- round-robin / sequence opcodes;
- random regions;
- key switches and controller conditions;
- sustain/pedal behaviors;
- crossfades;
- broader amplitude/filter/envelope opcodes;
- stereo/pan rendering;
- sample trigger/release semantics;
- performance tuning and preloading for large libraries.

The adapter should grow by evidence from real freely licensed SFZ libraries rather than by claiming unsupported opcodes.
