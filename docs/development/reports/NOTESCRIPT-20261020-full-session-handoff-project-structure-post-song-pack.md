# NoteScript — Full Project Structure Handoff — Post BeatLane6 Long-Form Song Pack

Date: 2026-10-20 (Asia/Bangkok)

Status at handoff: **MAIN CLEAN / HEAD CI GREEN / v0.2.0 RELEASED / SONG PACK ON MAIN AFTER v0.2.0**

Repository: `funggier/NoteScript`

Local workspace:

`T:\Space\Projects\ProjectsProgram\NoteScript`

Current branch:

`main`

Current HEAD:

`4b176f2c1d34a9d355eaceeeaad87542a8df437d`

Remote:

`origin/main = 4b176f2c1d34a9d355eaceeeaad87542a8df437d`

Worktree:

**CLEAN**

Latest closing CI:

- run: `39417372080`
- commit: `4b176f2c1d34a9d355eaceeeaad87542a8df437d`
- result: **SUCCESS**

Long-form song-pack implementation CI:

- implementation commit: `dc63dd14902ac4f54d9bb5398e0d1c5d9a811b23`
- run: `39417096402`
- result: **SUCCESS**

Latest published release:

- `v0.2.0`
- release commit: `143c239941db19a1abf39de045e3e83dea00f5d8`
- release CI: `39361275178` — SUCCESS
- status: **PUBLISHED / POST-PUBLISH VERIFIED**

Important release boundary:

> The five-song long-form BeatLane6 pack was added **after** the `v0.2.0` tag.
> It exists on current `main`, but it is **not part of the already-published v0.2.0 portable ZIP**.
> Do not move or rewrite `v0.2.0`.

---

# 1. Session-start prompt

Use this in a new session:

> ใช้ `pass-use-local-project` ทำ `funggier/NoteScript` ต่อจาก Full Handoff ล่าสุด โดยอ่าน
> `docs/development/reports/NOTESCRIPT-20261020-full-session-handoff-project-structure-post-song-pack.md`
> ก่อนเป็นอันดับแรก
>
> ให้ยึด **live runtime / live Git / live GitHub / current docs** ตามลำดับเป็น authoritative source
> หากเอกสารเก่าขัดกับสถานะสด ให้ตรวจและยึดสถานะสด
>
> Local workspace:
> `T:\Space\Projects\ProjectsProgram\NoteScript`
>
> ห้าม reset/clean worktree, ห้าม rebase, ห้าม force-push และห้ามย้าย/แก้ tag หรือ release เดิม
> โดยเฉพาะ `v0.1.0` และ `v0.2.0`
>
> ก่อนแก้ไฟล์ให้ตรวจ branch, HEAD, origin/main, worktree, CI และ runtime ที่เกี่ยวข้องก่อน
> รักษา Markdown เป็น authoritative music representation
> Core NoteScript ต้องยัง AI-free; integrations ภายนอกให้ผ่าน Control API
>
> Current clean baseline:
> `main = 4b176f2c1d34a9d355eaceeeaad87542a8df437d`
> closing CI `39417372080` = SUCCESS
>
> Song-pack implementation:
> `dc63dd14902ac4f54d9bb5398e0d1c5d9a811b23`
> CI `39417096402` = SUCCESS
>
> Latest published release:
> `v0.2.0` at `143c239941db19a1abf39de045e3e83dea00f5d8`
>
> Important:
> five long-form BeatLane6 songs are on current main **after v0.2.0** and are not in the old v0.2.0 ZIP.
>
> ทำงานแบบ evidence-driven:
> inspect -> design -> implement -> local test -> portable/runtime/browser smoke -> commit -> push -> exact-commit CI -> docs/evidence
> โดยไม่ต้องหยุดขออนุมัติใน workflow ปกติ

---

# 2. Project purpose

NoteScript is a deterministic, Markdown-first music composition and playback environment.

Primary product goal:

> A user can create, edit, play, arrange, render, export and game-ify a song from one human-readable Markdown document.

The project intentionally separates AI from the music engine:

- NoteScript core is AI-free.
- Markdown is authoritative.
- Parser / timeline / playback / renderer are deterministic.
- ChatGPT/MCP/Plugin integrations are future external clients over the Control API.
- No AI model/provider should become a required dependency of core composition/playback/rendering.

Canonical flow:

```text
NoteScript Markdown
      |
      v
Parser / Validator
      |
      v
Canonical Timeline
      |
      +--> Live Playback
      +--> Offline WAV Render
      +--> MIDI
      +--> Studio
      +--> BeatLane6 Chart Generator
```

---

# 3. Hard architectural rules

## 3.1 Markdown is authoritative

The authoritative song state is the `.md` document containing a fenced `notescript` block.

Do not introduce a hidden proprietary song database or a second canonical project representation.

All editor views must converge on the same Markdown:

```text
Compose
  |- Text
  |- Form
  |- Node
  `- Tracks
        |
        v
same Markdown
```

## 3.2 One project, many views

Text, Form, Node and Tracks are views/editors of the same in-memory Compose Markdown.

Tracks is **not** a separate top-level project workspace anymore.

Do not restore:

- a top-level Tracks tab;
- a second Tracks import flow;
- a separate Tracks Markdown state;
- top-level Track selector + Apply Track toolbar;
- manual Reload Stems button.

## 3.3 Core logic lives below the browser UI

The Studio UI should call Control API/service functionality rather than reimplementing music semantics in browser code.

Browser UI may handle interaction state, but parsing, validation, chart generation, rendering and project rules belong to shared core/service modules.

## 3.4 Portable-first

The Windows portable build is a product requirement, not an optional packaging experiment.

Portable operation should rely on:

- bundled Node runtime;
- relative folders;
- no installer for normal use;
- no AppData/registry dependency for core operation;
- one portable root containing projects/sounds/instruments/config/exports/tools/app/runtime.

## 3.5 One runtime command surface

`NoteScript.cmd` is the canonical portable entry point.

It owns:

- Studio startup;
- Control API start;
- status;
- stop;
- CLI forwarding.

Thin convenience wrappers may delegate to it:

- `Studio.bat`
- `Start.bat`
- `Stop.bat`
- `Status.bat`
- `Validate.bat`
- `Render.bat`

Do not duplicate server/network/process logic into the wrappers.

## 3.6 Network config has one source of truth

Authoritative file:

`config/network.json`

Default:

- host: `127.0.0.1`
- port: `19427`

Do not hardcode a second independent port source in launcher/UI/service code.

## 3.7 Preserve releases and worktree

Never use routine destructive Git cleanup.

Project constraints:

- no `git reset --hard`;
- no `git clean`;
- no rebase unless explicitly requested;
- no force-push;
- do not move/rewrite existing release tags;
- preserve unrelated WIP;
- inspect before mutating.

Existing release tags that must remain immutable:

- `v0.1.0`
- `v0.2.0`

---

# 4. Repository structure

Current important tree:

```text
NoteScript/
|- .github/
|  `- workflows/
|     `- ci.yml
|
|- config/
|  `- network.json
|
|- docs/
|  |- architecture/
|  |  |- ARCHITECTURE.md
|  |  |- BEATLANE6.md
|  |  |- CONTROL-API.md
|  |  |- LIVE-AUDITION.md
|  |  |- LIVE-PLAYBACK.md
|  |  |- STUDIO.md
|  |  `- TRANSPORT.md
|  |
|  |- development/
|  |  |- reports/
|  |  `- tasks/
|  |     |- CURRENT.md
|  |     `- ROADMAP.md
|  |
|  `- spec/
|     |- NOTESCRIPT-v0.1.md
|     |- SOUND-ADDON-v0.1.md
|     |- INSTRUMENT-ADDON-v0.1.md
|     |- SFZ-ADAPTER-v0.1.md
|     `- SOUNDFONT-ADAPTER-v0.1.md
|
|- examples/
|  |- beatlane6-starter.md
|  |- beatlane6-songs/
|  |  |- README.md
|  |  |- sunlit-detour.md
|  |  |- paper-satellites.md
|  |  |- lemon-sky-arcade.md
|  |  |- windowseat-polaroid.md
|  |  `- afterimage-parade.md
|  |- evening-walk.md
|  |- sfz-basic.md
|  |- sounds/
|  `- instruments/
|
|- exports/
|- instruments/
|- projects/
|- sounds/
|
|- scripts/
|  |- build-portable.js
|  |- check-syntax.js
|  `- generate-core-sounds.js
|
|- src/
|  |- archive/
|  |  `- zip.js
|  |- audio/
|  |  `- decoder.js
|  |- control/
|  |  |- ui/
|  |  |- network-cli.js
|  |  |- network-config.js
|  |  |- server.js
|  |  `- service.js
|  |- game/
|  |  `- beatlane6.js
|  |- instrument/
|  |  |- addon.js
|  |  |- fluidsynth.js
|  |  `- sfz.js
|  |- playback/
|  |  |- fluidsynth-live.js
|  |  `- manager.js
|  |- sound/
|  |  |- pack.js
|  |  |- resolver.js
|  |  `- wav.js
|  |- cli.js
|  |- error.js
|  |- midi.js
|  |- music.js
|  |- parser.js
|  |- renderer.js
|  `- timeline.js
|
|- templates/
|  |- instruments/
|  `- sounds/
|
|- test/
|  `- notescript.test.js
|
|- tools/
|  |- ffmpeg/
|  `- fluidsynth/
|
|- LICENSE
|- README.md
|- package.json
`- package-lock.json
```

---

# 5. Core module responsibilities

## `src/parser.js`

Parses NoteScript Markdown into song structure.

Responsibilities:

- metadata/config parsing;
- tracks;
- bars;
- notes/chords/rests/triggers;
- source declarations;
- semantic validation.

Do not let UI code duplicate parser rules.

## `src/timeline.js`

Compiles parsed song data into canonical time-positioned events.

This is the shared timing basis for:

- offline rendering;
- game chart generation;
- MIDI-related flows;
- transport-related operations.

## `src/renderer.js`

Deterministic offline audio renderer.

Supports native NoteScript sound packs and supported instrument adapters.

Important:

- sound/instrument resolution must respect portable root semantics;
- Compose render and Tracks stem/mix export should converge on shared renderer behavior.

## `src/midi.js`

MIDI generation.

Keep MIDI export derived from song/timeline state, not from browser-only state.

## `src/sound/*`

Native NoteScript sound-pack subsystem.

Current taxonomy:

```text
sounds/
|- soundpiano/
|  `- <pitched-pack>/
`- soundpad/
   `- <soundpad-set>/
```

Legacy flat layout remains readable for compatibility but should not be the preferred production layout.

## `src/instrument/*`

Standard instrument add-ons:

```text
instruments/
|- SFZ/
|- SF2/
`- SF3/
```

SFZ has a deterministic adapter.

SF2/SF3 rely on optional FluidSynth capability where available.

Do not overclaim optional backends if not detected/qualified.

## `src/playback/*`

Persistent/live playback abstraction.

Current architecture supports persistent FluidSynth live playback where available and keeps fallback/capability handling explicit.

## `src/control/service.js`

Primary application service layer.

This should remain the main shared surface for:

- projects;
- analysis;
- settings;
- transport;
- rendering;
- Track exports;
- sounds/instruments;
- BeatLane6 charts.

## `src/control/server.js`

HTTP Control API host used by Studio and future external integrations.

Security boundary:

- loopback default is intended;
- do not expose non-loopback control endpoints without explicit authentication/security design.

## `src/control/ui/*`

Browser Studio.

Current top-level tabs:

- Play
- Project
- Compose
- Sounds
- Settings

Compose sub-views:

- Text
- Form
- Node
- Tracks

## `src/game/beatlane6.js`

Deterministic BeatLane6 chart generator.

Input:

canonical timeline

Output:

six-lane playable chart

No gameplay markup is required in the source song Markdown for the baseline system.

---

# 6. NoteScript music model

Typical source:

```notescript
tempo: 126
time: 4/4
key: D major
ppq: 480

track Glassy Hook
sound: pluck
volume: 0.72
pan: 0.12
velocity: 98
bar 1: D4 e | F#4 e | A4 q | F#4 e | E4 e | D4 q
```

Important editable Track properties currently surfaced in Compose -> Tracks:

- Name
- Source Type
- Instrument / Sound
- Volume
- Pan
- Velocity
- Bars / Notes
- live Mute
- Stem WAV
- Delete

Delete is disabled when only one Track remains.

Track edits update current Compose Markdown directly.

---

# 7. Sound and instrument model

## SoundPiano

SoundPiano is the product-facing category for pitched native sound packs.

Built-in production pitched packs:

1. Piano
2. Electric Piano
3. Music Box
4. Organ
5. Synth Bass
6. Synth Lead
7. Warm Pad
8. Pluck

These are deterministic project-generated assets.

## SoundPad

SoundPad is the trigger-based native pack category.

Built-in 16-trigger SoundPad:

- kick
- snare
- clap
- closed-hat
- open-hat
- shaker
- tom-low
- tom-high
- rim
- cowbell
- crash
- ride
- chime
- click
- laser
- impact

New manifests use:

`type: soundpad`

Legacy:

`type: kit`

is still accepted and canonicalized.

## Standard Instruments

Separate from native sounds:

- SFZ
- SF2
- SF3

Do not collapse SoundPiano/SoundPad into standard-format instruments.

---

# 8. Studio UX baseline

## Play

Play Source is a single selector:

- SoundPiano
- SoundPad
- GameBeatLane6

There is no separate Play Mode control anymore.

### Performance hotkeys

Hotkeys:

- remain active after clicking normal buttons/selects/sliders while Play is active;
- are disabled when switching away from Play;
- text-entry fields suppress performance hotkeys while typing;
- use physical keyboard positions through `KeyboardEvent.code`.

This means Thai keyboard layout can keep the same physical A/S/D/J/K/L-style game controls without requiring OS language switching.

### Piano

Supports:

- mouse;
- keyboard;
- remappable hotkeys;
- velocity;
- octave;
- sustain;
- panic;
- optional Web MIDI;
- direct hotkey edit.

### SoundPad

Supports:

- direct triggering;
- hotkeys;
- direct hotkey edit;
- per-pad volume;
- reset mix;
- per-pack mix lock;
- mixer lock defaults enabled for unconfigured packs.

## Project Transport

Purpose:

preview only.

It can:

- select project;
- choose Original Project or temporary pitched voice override;
- Play/Pause/Stop/Seek;
- volume/pan;
- loop.

It should **not** own final save/export UX.

Changing project/voice automatically rebuilds preview as needed.

There is no manual Reload button.

## Compose

Authoritative editor workspace.

Global/song-level actions belong here:

- Import `.md`
- Analyze
- Save
- Play/Pause/Stop current unsaved editor state
- Download WAV with chosen filename
- MIDI export

Compose modes:

```text
Text | Form | Node | Tracks
```

## Compose -> Tracks

Each Track card is self-contained.

The Track-level control surface should stay local to each card.

Avoid reintroducing global Track-selection controls above the editor.

Exports:

- current Markdown
- individual stem WAV
- mix WAV
- Track Set ZIP

Track Set contains current Markdown, mix, all stems and manifest.

---

# 9. BeatLane6 baseline

Current game:

**BeatLane6**

Six lanes:

```text
A S D | J K L
```

Supported note types:

- Tap
- Hold
- simultaneous/chord events

Current gameplay:

- 2.5 s approach/pre-roll;
- Web Audio clock as timing authority;
- Perfect / Great / Good / Miss;
- combo;
- score;
- multiplier;
- weighted accuracy;
- max combo;
- life gauge;
- FAILED / SUCCESS;
- pointer input;
- simultaneous keyboard input;
- optional synchronized guide track;
- real NoteScript source sound on successful hit;
- game stops on browser blur.

Judgement windows:

- Perfect ±45 ms
- Great ±90 ms
- Good ±140 ms

Difficulty:

- Easy
- Normal
- Hard

Current deferred game features:

- slide/drag notes;
- manual chart overrides/editor;
- persistent local high scores;
- input/audio offset calibration polish;
- richer visual/game skins/effects.

---

# 10. Long-form BeatLane6 song pack

Current main contains five original game-ready songs.

Source folder:

`examples/beatlane6-songs/`

Songs:

| Song | Tempo | Duration | Normal events | Tap | Hold |
| --- | ---: | ---: | ---: | ---: | ---: |
| Sunlit Detour | 126 | 68.6 s | 556 | 428 | 128 |
| Paper Satellites | 116 | 74.5 s | 462 | 325 | 137 |
| Lemon Sky Arcade | 132 | 65.5 s | 577 | 461 | 116 |
| Windowseat Polaroid | 104 | 83.1 s | 402 | 251 | 151 |
| Afterimage Parade | 142 | 60.8 s | 588 | 469 | 119 |

Song-pack contract:

- 4 Tracks each;
- 36 bars per Track;
- bundled sounds only;
- valid NoteScript Markdown;
- deterministic Easy/Normal/Hard charts;
- all six lanes used at every difficulty;
- both Tap and Hold on Normal;
- at least 60 seconds;
- valid RIFF/WAV offline render;
- copied by portable builder into `projects/`.

Suggested play order:

1. Windowseat Polaroid
2. Paper Satellites
3. Sunlit Detour
4. Lemon Sky Arcade
5. Afterimage Parade

Evidence:

`docs/development/reports/NOTESCRIPT-20261020-beatlane6-long-form-song-pack.md`

Important:

These songs are current-main content and are **newer than v0.2.0**.

---

# 11. Current release state

## v0.1.0

Status:

**PUBLISHED / VERIFIED / IMMUTABLE**

Do not move or rewrite.

## v0.2.0

Title:

**NoteScript v0.2.0 — Unified Compose & BeatLane6**

Release commit:

`143c239941db19a1abf39de045e3e83dea00f5d8`

Exact release CI:

`39361275178` — SUCCESS

Portable asset:

`NoteScript-v0.2.0-portable.zip`

SHA-256:

`565ce79ef029b01cecc86dfe804c23266621347ce6120bf6e178670b48749f55`

Release status:

**PUBLISHED / POST-PUBLISH VERIFIED / IMMUTABLE**

Evidence:

`docs/development/reports/NOTESCRIPT-20261020-v0.2.0-release-qualification.md`

Again:

> Do not assume the published v0.2.0 ZIP contains the later five-song pack.

---

# 12. Current development state

Current clean baseline:

`4b176f2c1d34a9d355eaceeeaad87542a8df437d`

Current latest CI:

`39417372080` — SUCCESS

The song-pack implementation itself:

`dc63dd14902ac4f54d9bb5398e0d1c5d9a811b23`

Implementation CI:

`39417096402` — SUCCESS

Current automated test count:

**24/24 PASS**

Current syntax check:

**28 JavaScript files PASS**

Current package version:

`0.2.0`

No new release was made after the song pack.

No task is currently ACTIVE.

---

# 13. Roadmap

## NTS-001 — COMPLETE

Core bootstrap:

- language;
- parser;
- timeline;
- native sounds;
- WAV;
- MIDI;
- portable;
- Control API;
- tests/CI.

## NTS-002 — COMPLETE

Audio source adapters:

- decoder abstraction;
- FLAC/OGG/AIFF;
- SFZ;
- SF2/SF3 integration path.

## NTS-003 — COMPLETE

Playback engine:

- transport;
- seek;
- loop;
- preview;
- live audition;
- persistent playback support.

## NTS-004 — COMPLETE

Portable Studio.

## NTS-005 — PLANNED / NOT ACTIVE

Musical language expansion:

- named patterns;
- tempo maps;
- articulations;
- automation;
- velocity layers / round-robin;
- buses/effects;
- reusable sections/phrases.

## NTS-006 — PLANNED / NOT ACTIVE

External automation:

- MCP bridge;
- ChatGPT Plugin;
- stable create/update/validate/render schema;
- non-loopback security/auth guidance.

## NTS-007 — COMPLETE

BeatLane6 baseline.

## Post-NTS-007 — COMPLETE

- sound taxonomy;
- Studio/Compose/Tracks unification;
- long-form song pack.

---

# 14. Recommended next directions

These are options, not yet active tasks.

## Option A — BeatLane6 gameplay polish

Recommended if continuing the game first.

Potential task order:

1. input/audio offset calibration;
2. persistent local high scores;
3. slide/drag note representation;
4. manual chart overrides/editor;
5. richer visual effects / song-select presentation;
6. song metadata such as difficulty rating and recommended difficulty.

Keep chart overrides separate from authoritative music content where possible. Do not pollute basic music notation merely for gameplay presentation.

## Option B — NTS-005 musical language expansion

Recommended if returning to composition power.

Start with design/spec before parser mutation.

Likely sequence:

1. reusable named sections/patterns;
2. tempo map;
3. articulations;
4. automation;
5. buses/effects;
6. velocity layers/round-robin.

Preserve backward compatibility with v0.1 song syntax.

## Option C — NTS-006 MCP / ChatGPT integration

Recommended after Control API action surfaces are considered stable enough.

Core remains AI-free.

External integration should call stable Control API actions.

Do not let plugin/MCP code become a second music engine.

## Option D — next release

If the goal is to publish the current five-song pack, create a **new release** from a freshly qualified exact commit.

Do not amend/move v0.2.0.

Before choosing version:

- inspect live tags/releases;
- inspect all changes since `v0.2.0`;
- select semantic version based on the final scope;
- bump package/core version;
- run full local qualification;
- exact-commit CI;
- build portable ZIP;
- checksum;
- extract and smoke;
- tag exact GREEN commit;
- publish;
- download asset again;
- post-publish verify;
- document evidence;
- do not move the tag afterward.

---

# 15. Development workflow

For every substantial change:

## Step 1 — Inspect

Check:

```powershell
git status --short --branch
git rev-parse HEAD
git rev-parse origin/main
git remote -v
gh run list --repo funggier/NoteScript --branch main --limit 5
```

If runtime behavior matters, inspect live processes/runtime before editing.

## Step 2 — Read authoritative docs

Usually:

- `docs/development/tasks/CURRENT.md`
- `docs/development/tasks/ROADMAP.md`
- architecture doc for the affected subsystem;
- latest relevant qualification report;
- this handoff.

## Step 3 — Activate/define one coherent task

Document:

- goal;
- non-goals;
- invariants;
- acceptance checks;
- evidence required.

Do not mix unrelated product changes into one commit just because they are nearby.

## Step 4 — Implement smallest coherent change

Rules:

- preserve Markdown authority;
- preserve portability;
- avoid duplicated logic;
- keep service/API as shared behavior surface;
- keep UI state subordinate to song source;
- retain backward compatibility unless a deliberate migration is designed.

## Step 5 — Local gates

Typical minimum:

```powershell
git diff --check
npm run check
npm test
npm run portable
```

Current expected baseline before future test-count changes:

- syntax: 28 JS files
- tests: 24/24

Do not hardcode these counts forever; update evidence when legitimate tests/files are added.

## Step 6 — Real behavior qualification

Depending on feature:

- CLI validation;
- portable build;
- portable runtime Health;
- Control API endpoint;
- real WAV/MIDI/ZIP artifact;
- browser Studio smoke;
- BeatLane6 chart/game behavior;
- file-system output;
- process lifecycle.

Source-text presence is not enough for end-to-end claims.

## Step 7 — Commit/push

Only after local gates are GREEN.

Avoid unrelated changes in the commit.

## Step 8 — Exact-commit CI

The relevant commit SHA must have its own GREEN CI run.

Do not claim exact qualification from a different SHA.

## Step 9 — Evidence

Update:

- CURRENT;
- ROADMAP;
- qualification report.

For release work, separate release-code commit from post-release evidence commit where useful.

---

# 16. CI responsibilities

Workflow:

`.github/workflows/ci.yml`

Current CI covers:

- npm install;
- JS syntax check;
- automated tests;
- portable build;
- portable CLI smoke;
- Studio/Control API smoke;
- sound taxonomy;
- transport audio;
- Compose audio;
- Track stem/mix/set exports;
- BeatLane6 starter;
- five long-form BeatLane6 songs;
- chart duration/event/Tap/Hold/six-lane checks.

Do not weaken CI to hide regressions.

If CI fails while local is GREEN:

1. inspect the failed step/log;
2. distinguish product bug from stale CI assertion;
3. fix the real issue;
4. push a new commit;
5. require a new exact-commit GREEN run.

Do not rewrite the previous commit to fake evidence.

---

# 17. Release discipline

Release workflow:

```text
clean main
  ->
local full gates
  ->
release candidate commit
  ->
exact-commit CI GREEN
  ->
fresh portable build
  ->
ZIP
  ->
SHA-256
  ->
extract + smoke
  ->
annotated tag on exact GREEN commit
  ->
GitHub Release
  ->
download published assets again
  ->
checksum + extract + runtime/render smoke
  ->
qualification report
  ->
closing docs commit + CI
```

Existing tags/releases must remain stable.

Never publish a claim like "release contains feature X" unless the feature commit is actually an ancestor of the release tag.

---

# 18. Key evidence files

Start here when resuming:

- `docs/development/tasks/CURRENT.md`
- `docs/development/tasks/ROADMAP.md`
- `docs/architecture/ARCHITECTURE.md`
- `docs/architecture/STUDIO.md`
- `docs/architecture/BEATLANE6.md`
- `docs/architecture/CONTROL-API.md`

Release/evidence:

- `docs/development/reports/NOTESCRIPT-20261020-v0.2.0-release-qualification.md`
- `docs/development/reports/NOTESCRIPT-20261020-beatlane6-long-form-song-pack.md`
- `docs/development/reports/NOTESCRIPT-20261020-nts007-beatlane6.md`
- `docs/development/reports/NOTESCRIPT-20261020-sound-library-expansion.md`

This handoff supersedes the old v0.1.0-release-ready handoff for current project state.

---

# 19. Common mistakes to avoid

Do not:

- restore Basic/Advanced product modes;
- restore Tracks as a separate top-level workspace;
- add a global Track selector above Compose;
- require Save before Compose preview;
- require Reload after changing transport/Track source;
- let Play hotkeys remain active on non-Play tabs;
- bind game controls only to keyboard characters instead of physical positions;
- invert pan semantics;
- put SoundPad and SoundPiano in the same untyped flat production structure;
- silently treat SFZ/SF2/SF3 as native sound packs;
- add AI dependencies to core;
- expose Control API publicly without security design;
- claim optional FluidSynth/FFmpeg behavior without capability evidence;
- move old release tags;
- reset/clean the worktree to resolve ordinary development issues.

---

# 20. Current final checkpoint

At the moment this handoff was written:

```text
repo          funggier/NoteScript
workspace     T:\Space\Projects\ProjectsProgram\NoteScript
branch        main
HEAD          4b176f2c1d34a9d355eaceeeaad87542a8df437d
origin/main   4b176f2c1d34a9d355eaceeeaad87542a8df437d
worktree      clean

latest CI     39417372080
result        SUCCESS

song pack implementation
commit        dc63dd14902ac4f54d9bb5398e0d1c5d9a811b23
CI            39417096402
result        SUCCESS

package       0.2.0
latest release v0.2.0
release SHA   143c239941db19a1abf39de045e3e83dea00f5d8

v0.2.0 contains the unified Compose + BeatLane6 baseline
current main additionally contains the five-song long-form BeatLane6 pack
```

No task is ACTIVE.

The next session should choose one coherent direction, activate it in task docs, then continue through implementation and exact evidence qualification.
