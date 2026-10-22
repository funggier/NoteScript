# NoteScript Piano Multi-Key / Keyboard Rollover Fix

Date: 2026-10-22 (Asia/Bangkok)

Status: **IMPLEMENTED / LOCAL GREEN**

## User symptom

In Piano mode, pressing many computer-keyboard notes simultaneously could stop registering additional keys (for example around an eight-key chord).

## Diagnosis

- NoteScript has no explicit 7/8-voice software polyphony cap in the Piano Web Audio path.
- The default piano mapping exposes 13 semitone keys: A W S E D F T G Y H U J K.
- Windows reports a connected USB keyboard with hardware ID `VID_046D&PID_C31C`, corresponding to Logitech K120.
- Low-rollover / matrix ghosting keyboards can stop sending additional key-down events before they ever reach the browser.
- A separate NoteScript race was also found: a key could be released while its sample was still loading asynchronously, before its voice object existed.

## Changes

- Added Piano `CHORD HOLD` toggle.
  - Off by default.
  - Normal keyboard/MIDI behavior is unchanged when off.
  - When on, released notes remain sustained, allowing large chords to be accumulated one note at a time despite physical-keyboard rollover limits.
  - Turning Chord Hold off releases latched notes through the existing sustain path.
- Added pending-voice state so early key-up events are preserved while sample buffers load.
- Pending voice loads are cancelled when all voices are stopped/panicked.
- Added automated UI/static coverage for Chord Hold and pending-voice handling.
- Documented Chord Hold in README.

## Qualification

- `npm run check`: **PASS** — 28 JavaScript files.
- `npm test`: **PASS** — 25/25 tests.
- `npm run portable`: **PASS** after stopping the temporary portable Control API used for browser testing.
- `git diff --check`: **PASS**.
- Firefox live UI verification confirmed the new `CHORD HOLD` control toggles to `CHORD HOLD ON` and reports the rollover-workaround status.
- Desktop portable refresh copied only `app/src/control/ui/app.js`, `app/src/control/ui/index.html`, and `README.md`; hashes match the freshly built portable files.
- Desktop network configuration remained `127.0.0.1:19432` and the refreshed Control API reports **Health: OK**.
- Desktop `instruments/` was not modified. At refresh time its live state contained one `instrument.md` manifest / 212050 bytes; the previously observed large SSO/GM local library was no longer present at this path before the refresh.

## Scope note

Software cannot recover a physical key-down event that the keyboard hardware never reports. For true simultaneous 8+ physical-key chords, an NKRO/high-rollover keyboard or MIDI controller is still required. `CHORD HOLD` provides a built-in workaround for ordinary low-rollover keyboards.
