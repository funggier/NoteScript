# Optional FFmpeg Tool Adapter

NoteScript does not require FFmpeg for native PCM16 WAV sound packs.

To make additional audio formats portable without installing FFmpeg system-wide, place a compatible FFmpeg executable here:

```text
tools/
└─ ffmpeg/
   ├─ ffmpeg.exe
   └─ README / license files supplied with that FFmpeg build
```

The decoder lookup order is:

1. `NOTESCRIPT_FFMPEG` environment variable.
2. Portable `tools/ffmpeg/ffmpeg.exe`.
3. `ffmpeg` available on the operating-system PATH.

When FFmpeg is available, NoteScript can decode WAV, FLAC, OGG, OPUS, AIFF, MP3 and M4A through the decoder adapter.

FFmpeg is third-party software and retains its own license. NoteScript itself remains MIT licensed. Do not redistribute an FFmpeg build without also complying with that build's license requirements.
