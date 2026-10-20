# NoteScript Studio Architecture

Status: NTS-004 baseline implemented.

## Principle

NoteScript Studio is a portable visual/editor layer over the same Markdown-first NoteScript core.

Markdown remains the authoritative music representation everywhere.

Project and Compose operate on portable project files:

```text
projects/<name>.md
```

Tracks is an independent multi-track workspace. It loads or imports its own `.md` into memory for arrangement, stem playback and export without automatically mutating Project/Compose.

## Main tabs

### Play

The default first tab.

Purpose:

- game-like piano/instrument experience;
- immediate live audition;
- performance HUD;
- project preview transport.

Input sources:

- mouse/pointer;
- remappable computer keyboard;
- performance hotkeys stay active after non-text UI controls retain focus;
- physical-key matching uses `KeyboardEvent.code`, so Thai/other layouts preserve the same piano, SoundPad and BeatLane6 key positions;
- Web MIDI when the browser provides it.

The Play page has one top-level **Play Source** selector:

- `SoundPiano` — pitched native SoundPiano packs or playable Instrument add-ons;
- `SoundPad` — named-trigger SoundPad sets;
- `GameBeatLane6` — the BeatLane6 rhythm game.

There is no separate Play Mode switch. Future games can join the same Play Source selector.

The Project Transport on this page is preview-only. It can temporarily render `Original Project`, a SoundPiano pack, or a playable Instrument across pitched tracks. Project/voice changes require an explicit `Reload`; the override does not rewrite Markdown.

The Play page retains the NTS-003 live and buffered playback paths.

### Project

Project file management inside portable `projects/`:

- create;
- open;
- save;
- rename;
- delete.

All path validation remains in the Control Service.

### Compose

Three editing views share the same Markdown:

#### Text

Direct NoteScript Markdown editor plus diagnostics.

#### Form

Structured fields for:

- title;
- tempo;
- time signature;
- key;
- tracks;
- sound/instrument source;
- volume;
- pan;
- velocity;
- bar/event text.

Changing Form regenerates the NoteScript fenced body in the Text editor. Save still remains explicit.

A shared Compose source toolbar is visible across Text/Form/Node editing:

- choose a Track;
- choose Source Type (`SoundPiano`, `SoundPad` where valid, or `Instrument`);
- choose the installed Instrument / Sound for that track;
- set persistent per-track Volume;
- Apply Track to rewrite the track's `sound:` / `instrument:` and `volume:` fields in the authoritative Markdown.

Compose owns the simplest full-project WAV workflow. The user chooses an output filename and presses **Download WAV**. The browser sends the in-memory Markdown to `POST /v1/render/audio` and downloads the returned WAV directly. Project Transport remains preview-only. Tracks uses the same current Markdown for stem, mix and Track Set exports.

#### Node

A visual flow:

`Track -> Bar -> Event`

The palette can append Track/Bar/Note/Chord/Rest/Trigger structures.

Bar/Event nodes can be selected in Node Inspector. Applying the inspector rewrites the matching `bar N:` line in the same in-memory Markdown. Save persists the result.

### Tracks

Tracks is an independent multi-track editing/mixing workspace.

Tracks can:

- load a local `.md` directly into Tracks;
- keep that Tracks Markdown separate from Project/Compose state;
- add a new track to the Tracks Markdown;
- choose **Source Type** and **Instrument / Sound** per track;
- use SoundPiano or playable Instrument add-ons for pitched tracks;
- use SoundPad sets for trigger tracks;
- set persistent per-track Volume (0–100%);
- Mute/Unmute tracks during playback without rewriting the persistent volume;
- Play/Pause/Stop/Seek synchronized per-track stems;
- Reload Stems after source/volume edits;
- download the edited Tracks `.md`;
- download a WAV stem for any individual track;
- download a Mix WAV, excluding tracks currently muted in the Tracks mixer;
- download a Track Set ZIP containing Markdown, the current mix, every individual stem and `track-set.json` metadata.

Instrument/Sound/Volume/Add Track edits rewrite only the in-memory Tracks Markdown. Project/Compose remain unchanged unless the user explicitly uses the downloaded `.md` there later.

## Tracks multi-track playback and export

Tracks uses per-track stems because a premixed WAV cannot provide independent Mute or Volume control during playback.

Backend stem endpoint:

`POST /v1/tracks/track-audio`

Request payload contains:

- workspace Markdown;
- workspace filename;
- track index.

The service parses that Markdown and renders only the selected track to a full-duration PCM16 WAV. The browser decodes all stems into AudioBuffers, starts them at the same Web Audio clock time, and routes every track through a separate GainNode into one master gain.

Per-track live controls:

```text
Mute OFF + volume 75% -> gain = 0.75
Mute ON              -> gain = 0
```

Changing persistent Volume rewrites `volume:` in the Tracks Markdown. Changing Instrument / Sound rewrites the track's `sound:` or `instrument:` line. Both invalidate loaded stems so Reload/Play renders the updated arrangement.

Tracks audio export uses the current independent Tracks Markdown:

- `POST /v1/tracks/track-audio` -> one track stem WAV;
- `POST /v1/tracks/mix-audio` -> current mix WAV, with Mute selections optionally excluded;
- `POST /v1/tracks/set-zip` -> complete Track Set ZIP with Markdown + current mix + all stems + manifest.

The browser controls filenames for downloads. A stem filename is derived from workspace name + track name. Mix WAV and Track Set exports share a user-editable base name. Track Set always includes every stem even when a track is muted; the included mix and manifest record the current mute selection.
## Hotkey remapping

Studio settings are stored under:

`config/studio.json`

The Settings tab supports game-style key capture.

The Play piano also supports a faster direct workflow:

1. click **EDIT HOTKEYS**;
2. the 13 currently mapped chromatic piano keys become the editable range;
3. click the piano key whose binding should change;
4. press the new computer-keyboard key;
5. repeat for additional notes;
6. choose **SAVE** to persist through `POST /v1/studio/settings`, or **CANCEL** to restore the complete binding snapshot from before editing.

While direct edit mode is active, clicking a piano key selects it instead of sounding it. Normal musical keyboard input is suppressed until the mode is saved/cancelled. Leaving the Play tab cancels unsaved direct-hotkey edits.

Each mapped piano key keeps two visual labels:

- the musical note name;
- the current hotkey as a subdued keycap.

Both white and black piano labels are explicitly anchored to the key's own left/right bounds. This avoids browser static-position drift that previously made note labels appear near key boundaries.

SoundPad sound packs use the same interaction pattern. Studio derives a default trigger-key sequence (number row first), then overlays any saved per-pack mapping from:

`studio.json -> soundPadHotkeys -> <sound-pack-id> -> <trigger>`

A SoundPad control shows:

- trigger name;
- current hotkey as a subdued keycap;
- per-pad volume slider and percentage.

The volume setting is stored independently at:

`studio.json -> soundPadVolumes -> <sound-pack-id> -> <trigger>`

Volume range is 0–100%. The value multiplies the normal velocity-derived gain in the browser audio path, so a quieter shaker can be balanced against a stronger kick without changing the whole track. Slider input updates the active mix immediately for subsequent hits; releasing/changing the slider persists the mix. **RESET MIX** restores all triggers in the current SoundPad to 100%.

Each SoundPad also has a persistent **LOCK MIX** state stored at:

`studio.json -> soundPadMixLocks -> <sound-pack-id>`

The default is **locked**. If a SoundPad has no entry yet, Studio treats it as locked. An explicit `false` entry means unlocked.

When locked:

- every per-pad volume slider is disabled;
- **RESET MIX** is disabled;
- pad playback remains active;
- computer hotkeys remain active;
- **EDIT HOTKEYS** remains independent from the mixer lock;
- reloading/reopening Studio restores the locked state.

The lock button changes to **UNLOCK MIX** while active. Unlocking re-enables the mixer without changing saved pad volumes.

In SoundPad mode the displayed hotkeys trigger pads directly from the computer keyboard. **EDIT HOTKEYS** switches pad clicks from sound triggering to binding selection; Save persists the per-pack mapping, while Cancel restores the snapshot from before editing.

The preferred manifest token is `type: soundpad`. Legacy `type: kit` manifests remain accepted and canonicalize to SoundPad.

Duplicate bindings remain conflict-free: assigning a key already used by another action clears the old action before applying the new one.

Baseline actions include:

- 13 chromatic piano keys;
- octave down/up;
- sustain;
- panic;
- project preview play/pause;
- project preview stop.

The same bindings drive both keyboard behavior and the keycaps drawn on the game-style piano.

## Project preview pan semantics

Project Transport pan follows the standard Web Audio stereo convention:

- slider left: `-100` -> `StereoPannerNode.pan = -1` -> left speaker;
- center: `0` -> center;
- slider right: `+100` -> `StereoPannerNode.pan = +1` -> right speaker.

Studio forces the pan slider to left-to-right direction and displays `L n`, `C`, or `R n` instead of ambiguous signed numbers.

## Sound and Instrument tabs

Sound Packs and Instrument Add-ons remain separate systems.

The browser views only call Control API data and route selection back to Play.

## Diagnostics

Unsaved Markdown can be sent to:

`POST /v1/analyze`

The service returns:

- valid/invalid;
- diagnostics;
- parsed song;
- compiled timeline.

This allows Text/Form/Node/Tracks to share parser semantics without duplicating the language rules in the browser.

## Portable launcher

Portable build exposes one command entry point:

`NoteScript.cmd`

Behavior:

- no argument / `studio`: start the Control API hidden if needed, then open Studio;
- `start`: start the Control API hidden;
- `status`: report RUNNING/STOPPED, PID, configured URL and health;
- `stop`: stop the Control API for that portable folder;
- any other arguments: forward to the NoteScript CLI.

Optional `.bat` convenience wrappers (Studio/Start/Stop/Status/Validate/Render) contain no runtime logic; they only call `NoteScript.cmd` with a fixed prefix command. No duplicate `.cmd` launchers are generated.

## Control API surface used by Studio

Current Studio workflows include:

- `GET /v1/project`
- `GET /v1/studio/settings`
- `GET /v1/transport/audio`
- `POST /v1/projects/rename`
- `POST /v1/projects/delete`
- `POST /v1/analyze`
- `POST /v1/studio/settings`
- `POST /v1/render/audio` for current Compose Markdown
- `POST /v1/tracks/track-audio` for a current-project Track stem
- `POST /v1/tracks/mix-audio` for a current-project Tracks mix
- `POST /v1/tracks/set-zip` for a Track Set ZIP built from the current independent Tracks Markdown

Legacy project-based transport/stem routes remain available for compatibility.

## Boundaries

The NTS-004 baseline is intentionally not a full conventional DAW.

Future work can add:

- draggable/resizable regions;
- richer piano-roll editing;
- per-track mixer faders;
- solo;
- buses/effects;
- automation lanes;
- waveform views;
- persistent native real-time scheduling of complete projects.

Those features should extend the same Markdown/control architecture rather than create a parallel project format.
