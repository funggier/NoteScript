# NoteScript Architecture

## Principles

NoteScript separates musical meaning, audio sources, user interface, and external automation.

```text
.md Song
   |
   v
Parser / Validator
   |
   v
Canonical Timeline
   |
   +---------------------+
   |                     |
   v                     v
Audio Renderer       MIDI Export
   |
   v
Sound Source Adapters
   |
   +-- sounds/<Pack>              (native NoteScript sample packs)
   +-- instruments/SFZ/<Pack>     (adapter)
   +-- instruments/SF2/<Pack>     (adapter)
   +-- instruments/SF3/<Pack>     (adapter)

CLI / Future GUI / MCP / ChatGPT Plugin
                |
                v
          Control Service/API
                |
                v
          Core operations
```

## Boundary rules

1. The parser does not know how a sound source is rendered.
2. The timeline does not know whether a note came from WAV, SFZ or SoundFont.
3. Audio adapters do not own project files.
4. The GUI must not invent a private project format; Markdown remains authoritative.
5. ChatGPT/MCP/Plugin integrations use the Control layer, not internal renderer functions.
6. The Control API constrains writes to the portable project/export workspace by default.
7. Third-party asset licensing remains metadata on the add-on.

## Portable root

A portable root owns:

- `projects/`
- `exports/`
- `sounds/`
- `instruments/SFZ/`
- `instruments/SF2/`
- `instruments/SF3/`
- `config/`

The application should remain relocatable as one directory tree.

## ChatGPT integration direction

The NoteScript application itself remains deterministic and AI-free.

A ChatGPT Plugin or MCP adapter can:

1. inspect available sound/instrument add-ons;
2. save a generated NoteScript document into `projects/`;
3. validate it;
4. render it;
5. return export/diagnostic metadata;
6. request another revision by replacing the Markdown source.

This keeps generation separate from music execution.
