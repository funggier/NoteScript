# Evening Walk

A small deterministic background-music example. The prose is ordinary Markdown; only the NoteScript fenced block is executable music data.

```notescript
tempo: 82
time: 4/4
key: C major
ppq: 480

track Soft Keys
sound: demo-piano
volume: 0.50
velocity: 78
bar 1: [C4 E4 G4] h | E4 q | G4 q
bar 2: [A3 C4 E4] h | C4 q | E4 q
bar 3: [F3 A3 C4] h | A3 q | C4 q
bar 4: [G3 B3 D4] h | D4 q | G4 q
bar 5: C4 q | E4 q | G4 q | E4 q
bar 6: A3 q | C4 q | E4 q | C4 q
bar 7: F3 q | A3 q | C4 q | A3 q
bar 8: G3 q | D4 q | B3 q | G3 q

track Light Pulse
sound: demo-kit
volume: 0.18
velocity: 70
bar 1: @kick q | R q | @shaker q | R q
bar 2: @kick q | R q | @shaker q | R q
bar 3: @kick q | R q | @shaker q | R q
bar 4: @kick q | R q | @shaker q | R q
bar 5: @kick q | R q | @shaker q | R q
bar 6: @kick q | R q | @shaker q | R q
bar 7: @kick q | R q | @shaker q | R q
bar 8: @kick q | R q | @shaker q | R q
```
