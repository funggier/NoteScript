# NoteScript Language v0.1

## Container

A song is Markdown. Executable statements live inside one `notescript` fenced block. The first H1 heading is the song title.

## Song properties

```text
tempo: 82
time: 4/4
key: C major
ppq: 480
```

## Track

A track must select exactly one source:

```text
track Soft Keys
sound: WarmPiano
volume: 0.5
velocity: 78
```

or, when a standard-format adapter is available:

```text
track Piano
instrument: SFZ/SalamanderGrandPiano
volume: 0.5
```

A track cannot declare both `sound:` and `instrument:`.

## Bars and events

```text
bar 1: C4 q | E4 q | G4 h
bar 2: [A3 C4 E4] h | R h
bar 3: @kick q | R q | @shaker q | R q
```

Event forms:

- note: `C4 q`
- chord: `[C4 E4 G4] h`
- rest: `R q`
- named trigger: `@kick q`
- velocity override: `C4 q @110`

Durations:

- `w` = whole
- `h` = half
- `q` = quarter
- `e` = eighth
- `s` = sixteenth
- append `.` for dotted duration

Bars may be shorter than their time-signature capacity but may not exceed it.

## Determinism

The offline renderer is intended to be deterministic for the same:

- song Markdown,
- NoteScript version,
- add-on bytes/manifests,
- render settings.

## Source of truth

The Markdown file is authoritative. GUI and automation integrations must edit or generate this file rather than creating an incompatible hidden project format.
