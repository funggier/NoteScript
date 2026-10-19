# Project Transport Architecture

Status: NTS-003 transport baseline implemented.

## Purpose

The project transport previews a complete NoteScript document without launching the operating-system default audio player.

It is separate from the persistent per-note live engine:

- live SF2/SF3 playing uses direct note-on/note-off commands to a persistent FluidSynth process;
- full project transport renders a deterministic project preview into memory, then the browser controls that preview with Web Audio.

This keeps mixed projects deterministic while still giving the user immediate play/pause/seek/loop controls.

## Backend preview

The renderer exposes:

`renderToWavBuffer(song, songFile, options)`

It returns a WAV buffer and render report without writing an export file.

The Control Service exposes a bounded preview cache:

- key: resolved project path;
- validation signature: file size + modification time;
- maximum cached projects: 4;
- save operations invalidate the affected project cache.

API:

- `GET /v1/transport/audio?project=<file.md>`
- `POST /v1/transport/cache/clear`

The audio endpoint returns `audio/wav`.

## Browser transport

The Audition Keyboard includes:

- project selector;
- Load Project Preview;
- Play;
- Pause;
- Stop;
- seek slider;
- project loop;
- preview volume;
- preview pan;
- browser audio-output selector when supported.

A project preview is decoded into a browser AudioBuffer. Playback uses a new AudioBufferSourceNode for every start/resume/seek because Web Audio source nodes are single-use.

## Playhead

State tracks:

- current offset;
- AudioContext start time;
- duration;
- playing state;
- current source;
- animation-frame handle.

While playing:

`position = offset + (audioContext.currentTime - startedAt)`

Looping wraps the position modulo duration.

Pause stores the current computed position before stopping the source.

Stop resets the offset to zero.

Seeking while playing performs pause -> update offset -> play.

## Gain and pan

Preview gain uses a Web Audio GainNode.

Pan uses StereoPannerNode when the browser provides it.

These controls are non-destructive: they affect preview playback only and do not rewrite the NoteScript document or rendered source data.

## Audio-output selection

Output selection is capability based.

If all are available:

- `navigator.mediaDevices.enumerateDevices()`
- `AudioContext.setSinkId()`

the UI lists browser audio outputs and lets the user switch sinks.

If the browser does not expose `setSinkId`, the selector remains on the default browser output and the refresh control is disabled.

Observed qualification:

- Firefox: no `AudioContext.setSinkId` in the tested build; clean fallback to default output.
- Chrome 155: `setSinkId` path available; an enumerated output was selected successfully and then restored to default.

## Sample-rate display

The renderer baseline currently creates 44.1 kHz WAV previews.

A browser may resample decoded audio to the active AudioContext/output sample rate. The UI therefore labels the displayed decoded rate as **browser context** rate rather than implying that it is the source render rate.

## Relationship to exports

Transport preview is not an export operation.

- Preview: in-memory/cached WAV -> Web Audio.
- Export: explicit output file under `exports/`.

The preview cache can be discarded at any time.

## Remaining future improvements

The baseline does not yet claim:

- streaming/chunked preview for extremely large projects;
- per-track mute/solo during transport;
- timeline waveform or piano-roll visualization;
- sample-accurate loop-region editing;
- direct live scheduling of the entire project without intermediate preview render.

These can extend the transport without changing the NoteScript source format.
