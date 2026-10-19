# BeatLane6 Architecture

Status: implementation baseline

BeatLane6 is NoteScript Studio's first rhythm game. It treats an existing NoteScript Markdown song as the authoritative music source and derives a deterministic six-lane gameplay chart from the canonical timeline.

## Design boundary

BeatLane6 does **not** add gameplay syntax to the NoteScript music language.

```text
NoteScript Markdown
    ↓
Parser
    ↓
Canonical Timeline
    ↓
BeatLane6 Chart Generator
    ↓
Studio Rhythm Game
```

The same `.md` remains playable, editable, renderable and exportable outside the game.

## Six-lane controls

```text
Left hand       Right hand
A   S   D       J   K   L
0   1   2       3   4   5
```

Keyboard keys may be pressed simultaneously. The lane UI also accepts pointer input.

## Chart API

`GET /v1/game/beatlane6/chart?project=<project>&difficulty=<easy|normal|hard>`

The service loads the project, parses it, compiles the canonical timeline and calls `generateBeatLane6Chart()`.

The chart is deterministic: identical song content and difficulty produce identical events.

## Lane assignment

Pitched note events are normalized across the song's pitch range and mapped left-to-right across six lanes. This preserves melodic direction without requiring the song to contain only six pitches.

Named trigger events are assigned through a stable hash and moved to the nearest unoccupied lane when simultaneous events would collide.

One lane can never contain two events at the same onset.

## Difficulty

- **Easy**: thins dense onset groups, caps simultaneous events at two and spaces very close onsets.
- **Normal**: keeps up to three simultaneous events.
- **Hard**: keeps up to six simultaneous events including denser percussion/chord combinations.

The music source is not modified.

## Note types

Current baseline:

- Tap
- Hold
- simultaneous notes/chords

Hold classification uses musical duration, not wall-clock duration. Notes of half-note length or longer become Hold notes. This prevents BPM from accidentally turning ordinary quarter notes into Holds.

Planned extension:

- Slide/drag
- editable/manual charts

## Timing authority

Gameplay does not use CSS animation or `setTimeout()` as the authoritative music clock.

The browser Web Audio clock is authoritative:

```text
songTime = AudioContext.currentTime - gameStartedAt
```

The first musical onset occurs only after the chart's pre-roll/approach time (2.5 seconds by default).

Visual note position is recalculated every animation frame from `songTime`. A slow rendering frame therefore affects visual smoothness but does not redefine judgement timing.

## Judgement windows

Baseline windows:

- Perfect: ±45 ms
- Great: ±90 ms
- Good: ±140 ms
- Miss: later than the Good window

These values live in chart metadata so future calibration/tuning does not require changing song files.

## Scoring

Base values:

- Perfect: 1000
- Great: 700
- Good: 400
- Miss: 0

Combo multiplier:

- x1: combo 0–9
- x2: combo 10–24
- x3: combo 25–49
- x4: combo 50+

The result view reports score, weighted accuracy, Perfect/Great/Good/Miss counts and max combo.

## Life / failure

- start: 100
- Miss: -12
- early Hold release: -8
- Perfect: +2 recovery
- Great: +1 recovery

Life reaching zero ends the run as **FAILED**.

Completing all chart events with life remaining ends the run as **SUCCESS**.

## Audio on hit

A successful hit uses the event's original track source.

For native pitched sound packs:

1. choose the nearest root sample using the existing NoteScript resolver;
2. reuse the Studio decoded-buffer cache;
3. pitch shift to the event MIDI note;
4. apply event velocity.

For SoundPad triggers:

- play the original named trigger sample.

For standard instruments:

- use the existing instrument audition path when the installed backend is playable.

This means game input plays the real NoteScript musical material rather than a generic judgement click.

## Optional guide track

The player can enable **Guide track**.

The game loads the existing project-transport WAV and schedules it against the same Web Audio start time at reduced gain. It is off by default so hit-triggered notes remain clear.

## Runtime state

Studio keeps BeatLane6 state separate from the normal live Piano/SoundPad state:

- chart/project/difficulty
- start clock
- event status
- active Holds
- score/combo/max combo
- judgement counts
- life
- preloaded event audio
- optional guide source

Switching back to Live mode stops BeatLane6 without affecting the Markdown project.

## Bundled starter level

Portable builds include:

`projects/BeatLane6 Starter.md`

It intentionally moves across pitches C4–A4 so generated lanes teach A/S/D/J/K/L in order and includes a small number of chord/Hold events.

## Future work

- slide/drag notes and pointer paths
- manual chart override/sidecar without polluting Markdown
- persistent local high scores
- input/audio offset calibration
- richer lane skins/effects
- per-difficulty authored chart overrides
