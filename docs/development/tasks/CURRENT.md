# Current Task

## NTS-004 — Desktop GUI portable

Status: ACTIVE

Goal: turn the existing local Audition/Transport web UI into a practical portable NoteScript Studio without changing the Markdown-first source-of-truth architecture.

## NTS-003 status

COMPLETE / GREEN

Persistent live checkpoint:

- commit: `a70e43bb791ed609f491a7257463a58e6d61c375`
- Actions run: `39262242295`
- result: SUCCESS

Transport checkpoint:

- commit: `8bda4a9a84cc9fea25d0cee80588ac4a41558c77`
- Actions run: `39265689109`
- result: SUCCESS
- includes Portable Control API transport smoke test

Evidence:

- `docs/development/reports/NOTESCRIPT-20261019-nts003-persistent-live-playback.md`
- `docs/development/reports/NOTESCRIPT-20261019-nts003-transport-preview.md`

## NTS-004 acceptance

- [ ] Studio launcher/name distinct from the old Audition-only prototype.
- [ ] Markdown project editor.
- [ ] Load existing project text.
- [ ] Create/save project.
- [ ] Rename/delete project safely inside portable `projects/`.
- [ ] Live syntax/semantic diagnostics without saving first.
- [ ] Timeline / piano-roll visualization from analyzed Markdown.
- [ ] Separate Sound Pack browser.
- [ ] Separate Instrument browser.
- [ ] Existing playable on-screen piano retained.
- [ ] Mouse/computer-keyboard/Web MIDI audition retained.
- [ ] Existing Project Transport retained.
- [ ] WAV render button.
- [ ] MIDI export button.
- [ ] Project status / dirty-state indication.
- [ ] Portable build includes Studio launcher.
- [ ] Local browser/UI qualification.
- [ ] Automated tests.
- [ ] Portable qualification.
- [ ] Exact-commit GitHub CI GREEN.

## Architectural rule

The GUI must call stable Control API/service operations rather than duplicating parser, renderer or playback rules in browser code.

Markdown remains the authoritative editable song representation.
