# NoteScript — Full Session Handoff — v0.1.0 Release Ready

Date: 2026-10-20 (Asia/Bangkok)

Status at handoff: **RELEASE READY / MAIN CLEAN / HEAD CI GREEN**

Repository: `funggier/NoteScript`

Local workspace:

`T:\Space\Projects\ProjectsProgram\NoteScript`

## Session-start prompt

Use this in the next session:

> ทำ `funggier/NoteScript` ต่อจาก Full Handoff ล่าสุด โดยอ่าน
> `docs/development/reports/NOTESCRIPT-20261020-full-session-handoff-v0.1.0-release-ready.md`
> ก่อนเป็นอันดับแรก
>
> ให้ยึด Git / GitHub / runtime สดเป็น authoritative source ก่อนเอกสารเก่า
> ห้าม reset/clean worktree, ห้าม rebase/force-push และห้ามย้อนงานที่ qualification ผ่านแล้ว
>
> เป้าหมายของ session นี้คือ **ออก GitHub Release แรกของ NoteScript เป็น v0.1.0**
> โดยตรวจ main/CI/tag/release สดก่อน จากนั้นทำ final local qualification, build portable artifact,
> checksum, release notes, tag exact GREEN commit, publish GitHub Release และ verify artifact หลัง publish
> ให้ครบ
>
> **ห้ามเริ่ม NTS-005 ก่อน release v0.1.0 เสร็จและตรวจรับแล้ว**
>
> หาก package version ยังเป็น 0.1.0 และยังไม่มี tag/release ให้ใช้ `v0.1.0`
> เป็น first public release ตาม handoff นี้

---

# 1. Why NoteScript exists

NoteScript เริ่มจากความต้องการที่เรียบง่ายมาก:

ผู้ใช้ต้องการบอก ChatGPT ว่า

> “แต่งเพลงพื้นหลังเกมแบบฟังสบาย ๆ ให้หน่อยตามรูปแบบโปรแกรมนี้”

แล้ว ChatGPT สร้างไฟล์ข้อความเพลงขึ้นมา จากนั้นผู้ใช้เปิด NoteScript ฟัง แก้ไข
จนพอใจ แล้ว render เป็นไฟล์เสียงจริงได้

แนวคิดสำคัญตั้งแต่ต้นคือ **NoteScript ไม่ต้องมี AI อยู่ข้างในโปรแกรม**

AI/ChatGPT เป็นผู้ช่วยภายนอกที่สามารถเขียนหรือแก้ NoteScript Markdown ได้ แต่ตัวโปรแกรมเอง
เป็น deterministic parser / music engine / renderer / Studio

เหตุผลของการแยกนี้:

- เพลงต้อง reproducible และตรวจสอบได้
- project file ต้องอ่าน/แก้ด้วยคนได้
- ไม่ผูก core กับ model/provider ใด
- ChatGPT, MCP หรือ Plugin ในอนาคตใช้ Control API เดียวกัน
- ถ้าไม่มี AI โปรแกรมยังเล่น/แก้/render เพลงได้ครบ

แกนกลางจึงกลายเป็น:

```text
Markdown song
    ↓
Parser / Validator
    ↓
Canonical Timeline
    ↓
Playback / Render / MIDI / Studio
```

Markdown project คือ authoritative representation เสมอ

---

# 2. Product evolution and important decisions

## 2.1 Markdown-first instead of proprietary project files

ไฟล์เพลงเป็น `.md` ปกติ โดย executable music อยู่ใน fenced block:

```notescript
tempo: 82
time: 4/4
key: C major

track Soft Keys
sound: piano
volume: 0.50
velocity: 78
bar 1: [C4 E4 G4] h | E4 q | G4 q
```

สิ่งนี้ทำให้:

- คนอ่านได้
- Git diff ได้
- ChatGPT เขียนได้ง่าย
- Text/Form/Node/Advanced views สามารถอ้าง source เดียวกัน
- ไม่มี hidden project state ที่แยกออกจากไฟล์

## 2.2 Native sounds and standard instruments are separate systems

ผู้ใช้ต้องการระบบ add-on แบบ copy folder จึงแยกชัดเจนเป็น:

```text
sounds/
instruments/
  SFZ/
  SF2/
  SF3/
```

`sounds/` คือ native NoteScript packs

`instruments/` คือ standard instrument formats

เหตุผลที่ไม่รวมกัน:

- native sample mapping กับ standard format มี semantics ต่างกัน
- licensing/distribution ต่างกัน
- backend/decoder ต่างกัน
- ทำให้ add-on folder อ่านง่ายและ replaceable

## 2.3 Kit became SoundPad

ช่วงแรก named-trigger sound pack ใช้คำว่า “Kit” แต่ต่อมาพบว่ามันกว้างกว่า drum kit มาก
เพราะ trigger สามารถเป็น:

- kick
- shaker
- ambience
- rain
- effect
- arbitrary one-shot

จึงเปลี่ยน product terminology เป็น **SoundPad**

Production manifest ใหม่ใช้:

`type: soundpad`

เพื่อ compatibility parser ยังอ่าน legacy:

`type: kit`

แล้ว canonicalize เป็น `soundpad`

## 2.4 Prototype naming was removed

เมื่อโปรแกรมเริ่มเข้าสู่ production baseline ผู้ใช้ขอให้ลบคำว่า “Demo”

Production built-ins ปัจจุบันคือ:

- `piano` / **Piano**
- `soundpad` / **SoundPad**
- `SFZ/basic-sfz` / **Basic SFZ**
- project `SFZ Basic.md`

ไม่ควรนำ prototype naming กลับมาใน release

## 2.5 Studio evolved from audition page to a real application

ต้นแบบเริ่มจาก keyboard audition page แล้วขยายเป็น NoteScript Studio แบบ tabbed UI:

- Play
- Project
- Compose
- Tracks
- Sounds
- Settings

Play ถูกตั้งเป็นหน้าแรกเพราะผู้ใช้ต้องการอารมณ์ “โปรแกรมเปียโน/เกม”
ที่เปิดแล้วเล่นได้ทันที ไม่ใช่เปิดมาเจอ editor หนัก ๆ ก่อน

## 2.6 One project, many views

ผู้ใช้ต้องการทั้งการพิมพ์, form และ node editing

จึงออกแบบ Compose เป็น:

- Text
- Form
- Node

ทั้งหมดแก้ Markdown เดียวกัน

Advanced Tracks ก็ไม่ใช่ project format ใหม่ แต่เป็น multi-track view/controller ของ timeline เดียวกัน

## 2.7 Advanced mode became playable, not only visual

ผู้ใช้ต้องการรูปแบบคล้าย DAW/โปรแกรมตัดต่อเพลง และต้องฟังหลาย track ได้จริง

จึงเพิ่ม:

- per-track full-duration stems
- synchronized playback
- Play/Pause/Stop/Seek
- live Mute/Unmute ต่อ track

Mute ใช้ GainNode ต่อ stem ดังนั้น mute ระหว่าง playback ไม่ต้อง re-render หรือ restart เพลง

## 2.8 Direct hotkey editing follows game UX

ผู้ใช้ไม่ต้องการไป Settings ทุกครั้ง จึงทำ direct edit:

Piano:

`EDIT HOTKEYS → click piano key → press computer key → Save/Cancel`

SoundPad:

`EDIT HOTKEYS → click pad → press computer key → Save/Cancel`

binding ปัจจุบันแสดงเป็น keycap จาง ๆ บน key/pad

## 2.9 SoundPad gained per-pad mixing and lock

ผู้ใช้ต้องการลดเสียงบาง pad เช่น shaker ให้กลมกลืนกับ kick

จึงเพิ่ม per-pad volume 0–100%

ค่าถูก persist:

```text
studio.json
  soundPadVolumes
    <pack-id>
      <trigger>: 0.0 .. 1.0
```

ตัวอย่าง qualification:

- shaker ปรับเป็น 44%
- playback monitor ยืนยันว่าใช้ 44% จริง
- RESET MIX คืน 100%

จากนั้นผู้ใช้ขอ lock เพื่อป้องกันเผลอเลื่อน volume

HEAD ล่าสุดเพิ่ม:

- SoundPad mixer lock
- mixer locked by default สำหรับ new/unconfigured SoundPad
- lock แล้ว per-pad sliders + RESET MIX ใช้งานไม่ได้
- pad/hotkey playback ยังทำงาน
- locked visuals subdued และไม่ glow รบกวน

## 2.10 Pan semantics were made explicit

ผู้ใช้ต้องการให้ slider เป็นธรรมชาติเหมือนลำโพงจริง:

```text
LEFT SPEAKER  ←  CENTER  →  RIGHT SPEAKER
```

HEAD ล่าสุดแก้ project preview pan ให้:

- เลื่อนไปซ้าย = เสียงไปลำโพงซ้าย
- กลาง = center
- เลื่อนไปขวา = เสียงไปลำโพงขวา

อย่ากลับ semantics นี้

## 2.11 Portable-first became a hard product requirement

ผู้ใช้ต้องการโปรแกรมที่ copy folder ไปใช้ได้

จึงออกแบบให้:

- bundled Node runtime
- relative folders
- no installer required
- no AppData/registry requirement for core operation
- config/projects/exports/sounds/instruments อยู่ใน portable root

## 2.12 Command surface was consolidated

ช่วงหนึ่งมี launcher หลายตัวจนเริ่มซ้ำซ้อน

ผู้ใช้ขอให้ clean และ “รันจากที่เดียว”

ปัจจุบัน runtime logic อยู่ที่:

`NoteScript.cmd`

เพียงตัวเดียว

commands:

```text
NoteScript.cmd
NoteScript.cmd studio
NoteScript.cmd start
NoteScript.cmd status
NoteScript.cmd stop
NoteScript.cmd validate ...
NoteScript.cmd render ...
...other CLI commands
```

มี thin BAT shortcuts:

- `Studio.bat`
- `Start.bat`
- `Stop.bat`
- `Status.bat`
- `Validate.bat`
- `Render.bat`

BAT เหล่านี้ต้องเป็น wrapper เท่านั้น ห้าม duplicate server/network logic

## 2.13 Network settings have one source of truth

ผู้ใช้ไม่ต้องการ IP/port ซ้ำหลายไฟล์

authoritative network config:

`config/network.json`

default:

```json
{
  "host": "127.0.0.1",
  "port": 19427
}
```

Control API และ launcher อ่านไฟล์เดียวกัน

qualification เคยเปลี่ยน port 19427 → 19428 โดยแก้ไฟล์เดียว และ server ย้าย port จริง

`0.0.0.0` รองรับสำหรับ bind ทุก interface แต่ไม่ได้แปลว่า Public Internet จะเข้าได้เอง
Firewall/router/CGNAT ยังเป็นคนละเรื่อง

---

# 3. Authoritative live repository state at handoff

Checked immediately before writing this handoff.

Repository:

`https://github.com/funggier/NoteScript`

Visibility:

**PUBLIC**

License:

**MIT**

Default branch:

`main`

Local workspace:

`T:\Space\Projects\ProjectsProgram\NoteScript`

Live Git state:

- branch: `main`
- HEAD: `125b526583ad66cec9435aa98c5b59d4d09d300a`
- upstream: `origin/main`
- ahead: 0
- behind: 0
- worktree: **CLEAN**
- conflicts: 0

HEAD commit:

`125b526 Refine pan direction and lock SoundPad mix by default`

Do not reset/clean/rebase this worktree in the release session.

---

# 4. Version / tag / release state

`package.json`:

`version: 0.1.0`

At handoff:

- Git tags: **none**
- GitHub Releases: **none**
- repository is already public

Therefore the recommended first release is:

`v0.1.0`

Do not invent a higher version unless live state changes before the release session.

Release title recommendation:

**NoteScript v0.1.0 — First Public Portable Release**

---

# 5. Latest exact CI and local qualification

## 5.1 GitHub Actions — latest HEAD

HEAD:

`125b526583ad66cec9435aa98c5b59d4d09d300a`

Workflow run:

`39296144036`

Job:

`test (24.x)`

Result:

**SUCCESS**

Every recorded step GREEN:

1. Set up job
2. checkout
3. setup Node
4. npm ci
5. npm run check
6. npm test
7. npm run portable
8. Portable smoke test
9. Portable Studio and Control API smoke test
10. cleanup

This is the current release-candidate exact-commit gate.

## 5.2 Fresh local verification performed at handoff

`npm run check`

Result:

**PASS — 25 JavaScript files**

`npm test`

Result:

**PASS — 21/21 tests**

`npm run portable`

Result:

**PASS**

Output:

`T:\Space\Projects\ProjectsProgram\NoteScript\out\NoteScript-portable`

No claim of release should be made from old CI alone: session ใหม่ต้อง re-check live HEAD and CI first.

---

# 6. Current product capabilities

## Core

- Markdown language v0.1
- parser/validator
- canonical timeline
- deterministic offline WAV
- MIDI export
- Control API
- portable runtime
- MIT

## Audio source adapters

NTS-002 is COMPLETE.

Current architecture includes:

- native PCM16 WAV path
- decoder abstraction
- FFmpeg adapter for additional formats when available
- SFZ adapter
- SF2/SF3 SoundFont path
- persistent live SoundFont playback path
- add-on license metadata

Do not overclaim backend availability in release notes: describe capability architecture and tested support as represented by current README/capabilities.

## Playback

NTS-003 is COMPLETE.

Includes:

- play/pause/stop/seek/loop
- gain
- stereo pan
- output-device path where browser/backend permits
- live audition
- polyphony
- sustain
- velocity
- Web MIDI path
- project transport

## Studio

NTS-004 is COMPLETE / GREEN.

Tabs:

- Play
- Project
- Compose
- Tracks
- Sounds
- Settings

Compose:

- Text
- Form
- Node

Advanced:

- multi-track timeline
- per-track stems
- Play/Pause/Stop/Seek
- reload stems
- live Mute/Unmute
- link back to track Form

Play:

- game-style piano
- hotkey keycaps
- direct hotkey edit
- SoundPad
- SoundPad direct hotkey edit
- SoundPad per-pad volume
- SoundPad mixer lock
- project preview transport
- explicit left/center/right pan semantics

---

# 7. Sound system state

## Built-in production sound sources

`sounds/piano`

Display:

**Piano**

Type:

`pitched`

`sounds/soundpad`

Display:

**SoundPad**

Type:

`soundpad`

Triggers currently include:

- kick
- shaker

## SoundPad compatibility

Preferred new manifest:

`type: soundpad`

Legacy accepted:

`type: kit`

Legacy value is canonicalized to SoundPad internally.

Do not remove compatibility in the release session.

## Standard instruments

Hierarchy:

```text
instruments/
  SFZ/
  SF2/
  SF3/
```

Built-in baseline:

`SFZ/basic-sfz`

Display:

**Basic SFZ**

---

# 8. Portable layout and command contract

Build:

`npm run portable`

Output folder:

`out\NoteScript-portable`

The important portable contract:

```text
NoteScript-portable/
  NoteScript.cmd
  Studio.bat
  Start.bat
  Stop.bat
  Status.bat
  Validate.bat
  Render.bat

  runtime/
  app/
  config/
    network.json

  projects/
  exports/
  sounds/
  instruments/
    SFZ/
    SF2/
    SF3/

  templates/
  tools/
```

Rule:

`NoteScript.cmd` is the single logic entry point.

BAT files must remain thin wrappers.

Expected lifecycle examples:

```powershell
NoteScript.cmd status
NoteScript.cmd start
NoteScript.cmd status
NoteScript.cmd stop
```

RUNNING status reports:

- state
- PID
- configured URL
- Health: OK

STOPPED reports:

- state
- URL
- Health: N/A

Start is idempotent and should not create duplicate server processes.

Stop is idempotent.

---

# 9. Control API / future integration boundary

The core remains AI-free.

Future MCP / ChatGPT Plugin should call the stable local Control Service.

Default network location comes from:

`config/network.json`

Important existing routes include:

- `GET /`
- `GET /v1/health`
- `GET /v1/capabilities`
- `GET /v1/projects`
- `GET /v1/project`
- `GET /v1/sounds`
- `GET /v1/instruments`
- `GET /v1/studio/settings`
- `GET /v1/live/status`
- `GET /v1/transport/audio`
- `GET /v1/transport/track-audio`
- project CRUD/analyze/settings/render/MIDI/live/transport POST operations

NTS-006 will formalize MCP/Plugin integration later.

Do not start NTS-006 during the v0.1.0 release session.

---

# 10. Release target

Recommended release:

`v0.1.0`

Why:

- package version is already 0.1.0
- this is the first GitHub release
- no tags exist
- NTS-001 through NTS-004 are complete
- latest code HEAD is exact-CI GREEN
- repo is public
- portable product surface is coherent enough for a first public release

This release should freeze the current baseline before NTS-005 expands the music language.

---

# 11. Release artifacts

Required artifact:

`NoteScript-v0.1.0-portable.zip`

Recommended ZIP structure:

```text
NoteScript-portable/
  NoteScript.cmd
  Studio.bat
  Start.bat
  Stop.bat
  Status.bat
  Validate.bat
  Render.bat
  ...
```

Zip the portable folder itself so extraction produces one clean program directory.

Recommended checksum artifact:

`NoteScript-v0.1.0-portable.zip.sha256`

Contents should contain SHA-256 of the exact uploaded ZIP.

Do not package:

- `.git`
- developer worktree
- node_modules
- temporary qualification outputs
- test-only projects
- local unrelated files

GitHub automatically supplies source archives, so a separate source ZIP is not required unless the user explicitly asks later.

---

# 12. Release-session exact procedure

## Gate A — inspect live state first

Before modifying anything:

1. `git status`
2. verify `main`
3. verify upstream / ahead / behind
4. inspect current HEAD
5. inspect latest GitHub Actions run for exact HEAD
6. inspect package version
7. inspect existing tags
8. inspect existing GitHub Releases

If live state differs from this handoff, live state wins.

Do not reset/clean/rebase/force-push.

## Gate B — do not start feature work

The next planned milestone is NTS-005, but release session must **not** start it yet.

Do not add:

- patterns
- tempo maps
- articulations
- automation
- velocity layers
- buses/effects
- phrases

until v0.1.0 is published and verified.

## Gate C — final local qualification

Recommended:

```powershell
npm ci
npm run check
npm test
npm run portable
```

Expected baseline from handoff:

- syntax: 25 JS files
- tests: 21/21
- portable: success

If counts legitimately increase due release-only tests/docs, document why.

## Gate D — portable smoke

Use the portable artifact itself, not source Node.

At minimum:

1. `Status.bat` → STOPPED
2. `Start.bat`
3. `Status.bat` → RUNNING + PID + Health OK
4. validate `projects\Evening Walk.md`
5. render Evening Walk to exports
6. confirm RIFF/WAV
7. validate/render `SFZ Basic.md`
8. query production sound discovery
9. confirm `piano` and `soundpad`
10. confirm SoundPad type is `soundpad`
11. `Stop.bat`
12. `Status.bat` → STOPPED
13. ensure no NoteScript server process remains

If browser UI smoke is performed, verify:

- Play tab opens
- Piano visible
- SoundPad visible
- SoundPad mixer lock behavior
- pan labels/direction
- Advanced tracks
- Settings

## Gate E — release packaging

After all qualification:

1. remove/rebuild `out\NoteScript-portable` through official build only
2. do not manually patch files inside artifact after qualification
3. create `NoteScript-v0.1.0-portable.zip`
4. compute SHA-256
5. create `NoteScript-v0.1.0-portable.zip.sha256`
6. inspect ZIP entries
7. extract ZIP to a temporary folder
8. run at least status/start/health/stop from extracted copy

The extracted ZIP, not the pre-zip directory, is the release artifact that must pass final smoke.

## Gate F — release commit/tag discipline

If release preparation changes tracked files (release notes/version/docs):

1. commit normally
2. push main
3. wait for exact HEAD GitHub CI GREEN
4. tag the exact GREEN commit only

Recommended tag:

`v0.1.0`

Do not move/recreate the tag after publishing unless there is an exceptional documented reason.

## Gate G — GitHub Release

Create release from exact tag:

`v0.1.0`

Title:

**NoteScript v0.1.0 — First Public Portable Release**

Attach:

- `NoteScript-v0.1.0-portable.zip`
- `NoteScript-v0.1.0-portable.zip.sha256`

Publish as normal release, not draft/prerelease, unless live state reveals a blocker.

## Gate H — post-publish verification

After release exists:

1. query release/tag from GitHub
2. confirm tag points to expected exact commit
3. confirm both assets are attached
4. download release ZIP from GitHub to a temporary path
5. verify SHA-256 against checksum
6. extract downloaded ZIP
7. smoke `Status.bat → Start.bat → Status.bat → Stop.bat`
8. optionally render Evening Walk from downloaded release copy
9. confirm worktree remains clean
10. record evidence in a release qualification report

Only then mark release COMPLETE.

---

# 13. Draft v0.1.0 release notes

Suggested draft:

## NoteScript v0.1.0

First public portable release of NoteScript — a deterministic Markdown-first music composition environment.

### Highlights

- Human-readable `.md` song projects
- deterministic parser, validation and canonical timeline
- offline WAV rendering and MIDI export
- native Piano and SoundPad sources
- SFZ / SoundFont instrument architecture
- NoteScript Studio with Play, Project, Compose, Tracks, Sounds and Settings tabs
- Text / Form / Node editing over one authoritative Markdown project
- game-style playable piano with remappable hotkeys
- SoundPad hotkeys, per-pad volume mixer and lock
- Advanced multi-track stem playback with live Mute/Unmute
- project preview transport with explicit left/center/right pan
- portable single-folder distribution
- single `NoteScript.cmd` runtime entry point plus thin BAT shortcuts
- single-file IP/port configuration through `config/network.json`
- local Control API for future MCP / ChatGPT Plugin integrations

### Portable usage

Extract the ZIP and run:

`Studio.bat`

or:

`NoteScript.cmd`

Useful shortcuts:

- `Start.bat`
- `Stop.bat`
- `Status.bat`
- `Validate.bat`
- `Render.bat`

### Network configuration

Edit one file:

`config/network.json`

### SoundPad

New SoundPad manifests use:

`type: soundpad`

Legacy `type: kit` remains accepted for compatibility.

### Scope

v0.1.0 freezes the completed NTS-001 through NTS-004 baseline.

The next development milestone is NTS-005 — musical-language expansion.

---

# 14. Known product boundaries for release notes

Do not market v0.1.0 as a full commercial DAW.

It is already a usable composition/playback Studio, but future roadmap still includes richer language/DAW features.

NTS-005 planned:

- named patterns
- tempo maps
- articulations
- automation
- velocity layers / round-robin
- buses/effects
- reusable sections/phrases

NTS-006 planned:

- MCP bridge
- ChatGPT Plugin
- stable external action schema
- non-loopback auth guidance

The core remains AI-free.

---

# 15. Important files to read in the next session

Read these after this handoff:

1. `docs/development/tasks/CURRENT.md`
2. `docs/development/tasks/ROADMAP.md`
3. `docs/development/reports/NOTESCRIPT-20261019-nts004-studio-basic-advanced.md`
4. `docs/architecture/STUDIO.md`
5. `docs/architecture/CONTROL-API.md`
6. `docs/architecture/LIVE-AUDITION.md`
7. `docs/spec/NOTESCRIPT-v0.1.md`
8. `docs/spec/SOUND-ADDON-v0.1.md`
9. `docs/spec/INSTRUMENT-ADDON-v0.1.md`
10. `.github/workflows/ci.yml`
11. `scripts/build-portable.js`
12. `package.json`

---

# 16. Do-not-break rules

- Git/GitHub/runtime live state is authoritative.
- Do not reset or clean worktree.
- Do not rebase/force-push main.
- Do not rewrite qualified history.
- Do not start NTS-005 before release completion.
- Keep Markdown authoritative.
- Keep core AI-free.
- Keep `sounds/` and `instruments/` separate.
- Keep legacy `type: kit` read compatibility.
- Keep production terminology SoundPad.
- Do not reintroduce prototype naming.
- Keep per-pad SoundPad mixer lock behavior.
- Keep pan semantics: left slider = left speaker, right slider = right speaker.
- Keep `config/network.json` as single host/port source.
- Keep `NoteScript.cmd` as single runtime-logic entry point.
- BAT files remain thin wrappers.
- Do not expose non-loopback Control API without addressing authentication/security.
- Do not claim optional backend support beyond what current capabilities/tests confirm.

---

# 17. Current release-candidate summary

At the moment this handoff was created:

```text
Repo         funggier/NoteScript
Visibility   PUBLIC
Branch       main
HEAD         125b526583ad66cec9435aa98c5b59d4d09d300a
Upstream     origin/main
Ahead        0
Behind       0
Worktree     CLEAN
Version      0.1.0
Tags         none
Releases     none
License      MIT
CI Run       39296144036
CI Result    SUCCESS
Local Check  25 JS PASS
Local Tests  21/21 PASS
Portable     PASS
```

This is a release-ready baseline.

The next session should begin with live verification and then execute the v0.1.0 release workflow above.
