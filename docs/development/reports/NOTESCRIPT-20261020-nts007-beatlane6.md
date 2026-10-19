# NoteScript — NTS-007 BeatLane6 Qualification

Date: 2026-10-20 (Asia/Bangkok)

Status: **COMPLETE / EXACT-COMMIT CI GREEN**

Repository: `funggier/NoteScript`

Qualified implementation commit:

`3ba3138136fe7d08c7a016e8edcf1bfb80b45463`

GitHub Actions:

- run: `39314541435`
- job: `test (24.x)`
- result: **SUCCESS**
- `npm ci`: PASS
- `npm run check`: PASS
- `npm test`: PASS
- `npm run portable`: PASS
- Portable smoke test: PASS
- Portable Studio and Control API smoke test: PASS

## Goal

Add the first real game to NoteScript Studio without changing the authoritative music format.

BeatLane6 treats existing NoteScript Markdown songs as level sources:

```text
Markdown song
    -> parser
    -> canonical timeline
    -> deterministic BeatLane6 chart
    -> six-lane rhythm gameplay
```

No gameplay-only syntax was added to the NoteScript song language.

## Controls and gameplay

Six lanes:

```text
Left hand       Right hand
A   S   D       J   K   L
```

Baseline gameplay includes:

- Tap notes
- Hold notes
- simultaneous/chord input
- 2.5-second pre-roll / approach highway
- Perfect / Great / Good / Miss judgement
- combo and multiplier
- score and weighted accuracy
- max combo
- life gauge
- FAILED when life reaches zero
- SUCCESS when the chart completes with life remaining
- optional synchronized guide track
- pointer-lane input
- simultaneous computer-keyboard input

## Timing model

The authoritative gameplay clock is the Web Audio clock:

`AudioContext.currentTime - gameStartedAt`

Visual note position is recalculated from that clock every animation frame. CSS animation and timer callbacks do not define judgement timing.

Judgement windows:

- Perfect: ±45 ms
- Great: ±90 ms
- Good: ±140 ms
- later: Miss

## Chart generation

The chart generator is:

`src/game/beatlane6.js`

Properties:

- deterministic for identical source song + difficulty
- maps melodic pitch direction across six lanes
- stable trigger mapping
- prevents simultaneous same-lane collisions
- Easy / Normal / Hard density policies
- Hold classification uses musical duration instead of BPM-dependent wall-clock duration

Current Evening Walk chart:

- Easy: 32 events / 24 Tap / 8 Hold
- Normal: 48 events / 36 Tap / 12 Hold
- Hard: 52 events / 40 Tap / 12 Hold

## Source audio on hit

A successful gameplay hit reuses the source track's NoteScript sound path.

Supported baseline paths:

- native pitched Sound Packs through nearest-root sample + pitch shift
- SoundPad named trigger samples
- playable standard instruments through the existing instrument audition backend

The game does not replace musical hits with a generic click sound.

## Starter level

Portable builds include:

`projects/BeatLane6 Starter.md`

The source file is:

`examples/beatlane6-starter.md`

Normal chart qualification:

- 32 events
- 26 Tap
- 6 Hold
- all six lanes used
- first six events map exactly to `A S D J K L`

The Starter intentionally teaches the six-key layout before denser project charts.

## Local qualification

Fresh local qualification before commit:

- syntax check: **26 JavaScript files PASS**
- tests: **22/22 PASS**
- portable build: **PASS**
- Starter project validation: PASS
- BeatLane6 capability endpoint: PASS
- chart API: PASS
- six-lane Starter invariant: PASS
- Control API lifecycle: STOPPED -> RUNNING + Health OK -> STOPPED

## Browser/UI qualification

Isolated managed browser qualification verified:

- Play -> BeatLane6 mode switching
- Starter project discovered as the first portable game level
- Normal chart displayed as 32 events / 26 Tap / 6 Hold
- Start Game enters Playing state
- passive misses reduce life and produce FAILED result
- failed run can be restarted
- Stop returns the game to ready/stopped state
- Live mode restores the original playable Piano view
- the game-mode CSS does not block the BeatLane6 control sidebar

Precise ±140 ms hit-window automation was not used as an acceptance gate because the external browser-tool call latency is much larger than the gameplay timing window. Hit/scoring logic is covered by implementation/static tests and uses the same Web Audio clock at runtime.

## Portable CI qualification

Exact-commit GitHub Actions run `39314541435` passed all workflow steps, including:

1. checkout
2. Node setup
3. npm ci
4. source syntax check
5. automated tests
6. portable build
7. portable CLI smoke
8. portable Studio and Control API smoke

CI specifically verifies:

- `BeatLane6 Starter.md` exists and validates in the portable build
- BeatLane6 Studio UI surface is present
- BeatLane6 chart API works
- game capability reports six lanes
- Starter chart uses all six lanes
- the expanded production sound library remains present

## Architecture evidence

- `docs/architecture/BEATLANE6.md`
- `docs/development/tasks/CURRENT.md`
- `docs/development/tasks/ROADMAP.md`

## Deferred follow-up

Not required for this completed baseline:

- slide / drag notes
- manual chart overrides/editor
- persistent high scores
- input/audio offset calibration polish
- richer game skins/effects

## Final disposition

NTS-007 BeatLane6 baseline is **COMPLETE / GREEN**.
