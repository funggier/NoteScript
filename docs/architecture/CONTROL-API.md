# Control API and ChatGPT/MCP Integration

## Purpose

The Control API is the stable automation boundary for:

- future NoteScript GUI,
- ChatGPT Plugin,
- MCP server/bridge,
- scripts and external tooling.

It does not add AI to NoteScript.

## Local default

`127.0.0.1:19427`

The default should remain loopback-only.

A token can be enabled with `NOTESCRIPT_CONTROL_TOKEN`.

## Operations

Current v1 routes:

- health
- list projects
- list sounds
- list instruments
- save project
- validate project
- render WAV
- export MIDI

## Direct ChatGPT workflow

A future ChatGPT Plugin can expose actions such as:

- `create_song(name, markdown)`
- `list_sounds()`
- `list_instruments()`
- `validate_song(project)`
- `render_song(project, output)`

The Plugin/MCP layer should translate those actions to this API.

If remote connectivity is required, tunneling/authentication belongs to the integration layer, not to the NoteScript music engine.

## Security boundary

The Control service only writes generated projects to `projects/` and rendered files to `exports/` by default. Paths are checked against the portable workspace.

Do not expose an unauthenticated non-loopback Control API.
