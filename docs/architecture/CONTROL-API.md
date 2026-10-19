# Control API and ChatGPT/MCP Integration

## Purpose

The Control API is the stable automation boundary for:

- future NoteScript GUI,
- ChatGPT Plugin,
- MCP server/bridge,
- scripts and external tooling.

It does not add AI to NoteScript.

## Network configuration

Host and port have one authoritative source:

`config/network.json`

Default:

```json
{
  "host": "127.0.0.1",
  "port": 19427
}
```

The Control API reads this file at startup. Portable `NoteScript.cmd` is the single entry point and reads the same file before opening Studio, so IP/port values and start/stop behavior are not duplicated across launchers.

The default should remain loopback-only. If a non-loopback host such as a LAN address or `0.0.0.0` is used, authentication/network exposure must be considered explicitly.

A token can be enabled with `NOTESCRIPT_CONTROL_TOKEN`.

## Operations

Current v1 routes:

- health and capability discovery
- list projects
- list/detail sounds
- list instruments
- native sound audition audio
- SFZ/SF2/SF3 instrument audition audio
- persistent SoundFont live status and commands
- in-memory/cached project transport preview audio
- transport preview cache invalidation
- save project
- validate project
- render WAV
- export MIDI
- serve the local Audition Keyboard UI

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
