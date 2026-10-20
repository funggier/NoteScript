# NoteScript — Expanded Instrument and Drum Library Qualification

Date: 2026-10-20 (Asia/Bangkok)

Status: **COMPLETE / GREEN / EXACT-COMMIT CI GREEN**

## Goal

Expand the built-in deterministic MIT sound library so NoteScript can arrange songs with a broader palette without requiring third-party sample downloads.

The expansion keeps the existing native taxonomy:

- pitched voices under `sounds/soundpiano/<pack>/`
- trigger kits under `sounds/soundpad/<set>/`

No AI runtime dependency and no third-party sample library was added.

## New pitched voices

Four guitar voices:

- `acoustic-guitar`
- `nylon-guitar`
- `clean-electric-guitar`
- `jazz-guitar`

Additional instrumental colors:

- `strings`
- `flute`
- `marimba`
- `vibraphone`
- `choir`
- `soft-brass`

Together with the existing eight voices, the production SoundPiano library now contains **18 pitched packs**.

Each new pitched pack contains five deterministic PCM16 WAV root samples and uses `fallback: nearest`.

## New drum / SoundPad sets

Added:

- `acoustic-drums`
- `brush-drums`
- `electronic-drums`
- `lofi-drums`

Together with the original `soundpad`, NoteScript now ships **5 SoundPad sets**.

All five sets expose the same 16 trigger contract:

`kick`, `snare`, `clap`, `closed-hat`, `open-hat`, `shaker`,
`tom-low`, `tom-high`, `rim`, `cowbell`, `crash`, `ride`,
`chime`, `click`, `laser`, `impact`.

This allows a NoteScript drum track to switch kit by changing only `sound:` while preserving the trigger pattern.

## Generation

Authoritative generator:

`scripts/generate-core-sounds.js`

Current generation summary:

`18 pitched packs + 5 SoundPad sets x 16 triggers + SFZ baseline`

All built-in audio is generated locally by deterministic synthesis code and is distributed with NoteScript under the repository MIT license.

Total generated native sound bytes at qualification time:

**31,778,854 bytes**

## Representative uniqueness evidence

Representative SHA-256 hashes are distinct:

| Sample | SHA-256 |
| --- | --- |
| Acoustic Guitar C4 | `A7D99915601C4B6A57F08134A6D8B9E4FE3F1110642122EF4A2151E119E934E0` |
| Nylon Guitar C4 | `08463958846A4CD2E9290E9BF5A9FA8DBED52094B49D1B9820F5FAA604332356` |
| Clean Electric Guitar C4 | `728B98A2FD5E40745FF373DCBE73994B07CB09778CD494CAD2BD14A7FB8814F1` |
| Jazz Guitar C4 | `18AB88CF568C7B293FC51472896423564065B040F72CAFCA20FF06F43D39BD4C` |
| Acoustic Drums kick | `86B2407D2DF5FA159133ED3288A3413C22AD692DC928B3874EB2A79EBC75CA21` |
| Brush Drums kick | `9BB09EA37C8FAD326B49F6C3A353A1745185CD9711FBADE853862B90B6FBCC3E` |
| Electronic Drums kick | `E35178C539AB0147DE4372F86312821833183998987293E644B3F2A6E447706B` |
| Lo-Fi Drums kick | `D79E594FCA37B47E8CEB4701727353B1343FA412CDE1A943E3055962AC2D399B` |

## Automated qualification

Local gates:

- `npm run check` -> **PASS**, 28 JavaScript files
- `npm test` -> **PASS**, 24/24 tests
- expanded add-on loading -> **PASS**
- all 18 pitched pack manifests -> **PASS**
- all 5 SoundPad manifests -> **PASS**
- pitched audition WAV generation -> **PASS**
- representative trigger audition across all new drum kits -> **PASS**
- `npm run portable` -> **PASS**
- portable `soundpiano/` -> **18 packs**
- portable `soundpad/` -> **5 sets**
- portable Control API `/v1/sounds?details=1` -> **23 production packs**

CI was updated to require all 23 production native sound packs and to check representative guitar/drum category behavior.

## Compatibility

Preserved:

- Markdown remains authoritative.
- Existing `sound: piano`, `sound: soundpad`, etc. continue to work.
- Legacy flat sound-pack discovery remains readable.
- Core remains AI-free.
- Standard SFZ/SF2/SF3 instrument adapters remain separate from native SoundPiano/SoundPad packs.
- Existing release tags are untouched.

## GitHub exact-commit evidence

Implementation commit:

`40c897b1659f3c5af6f0e70d54fad61c02793cea`

The first implementation CI run `39440016684` completed with **FAILURE** after code checks, unit tests, portable build and portable CLI smoke had already passed. The failure was isolated to the Studio/API smoke setup: `Test Fixture.md` had not been copied into that step's portable `projects/` directory.

CI fixture fix commit:

`ba23f6089b559de0a0cc28aaed75f6c3135b37a3`

Exact-commit GitHub Actions run:

`39440640809`

Result: **SUCCESS**

All workflow stages passed, including syntax check, 24/24 tests, portable build, portable CLI smoke, and Portable Studio / Control API smoke with all 23 production native sound packs discoverable.
