# Kazu Guitar Demo

Original recorded guitar strings: first two bars use the SoundPiano source;
the final two bars use the SFZ instrument backed by the same six recordings.

```notescript
tempo: 92
time: 4/4
key: C major

track Kazu Guitar SoundPiano
sound: kazu-guitar
volume: 0.40
velocity: 84
bar 1: D#2 q | G#2 q | C#3 q | F#3 q
bar 2: [D#3 A#3 D#4] h | A#3 q | G#3 q
bar 3: R w
bar 4: R w

track Kazu Guitar SFZ
instrument: SFZ/kazu-guitar
volume: 0.40
velocity: 84
bar 1: R w
bar 2: R w
bar 3: [D#2 A#2 D#3] h | F#3 q | A#3 q
bar 4: D#4 q | C#4 q | A#3 q | D#3 q
```
