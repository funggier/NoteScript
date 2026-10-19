import { barQuarterLength } from "./music.js";

export function compileTimeline(song) {
  const qPerBar = barQuarterLength(song.config.timeNumerator, song.config.timeDenominator);
  const tracks = [];
  let endQuarter = 0;

  for (const track of song.tracks) {
    const events = [];
    for (const bar of track.bars) {
      let cursor = (bar.number - 1) * qPerBar;
      for (const event of bar.events) {
        if (event.kind === "note" || event.kind === "chord") {
          for (let i = 0; i < event.notes.length; i += 1) {
            events.push({
              kind: "note",
              note: event.notes[i],
              noteName: event.noteNames[i],
              startQuarter: cursor,
              durationQuarter: event.durationQuarterNotes,
              velocity: event.velocity,
              line: event.line
            });
          }
        } else if (event.kind === "trigger") {
          events.push({
            kind: "trigger",
            trigger: event.trigger,
            startQuarter: cursor,
            durationQuarter: event.durationQuarterNotes,
            velocity: event.velocity,
            line: event.line
          });
        }
        cursor += event.durationQuarterNotes;
        endQuarter = Math.max(endQuarter, cursor);
      }
    }
    tracks.push({ ...track, events });
  }

  return { ...song, tracks, endQuarter };
}

export function quarterToSeconds(quarter, tempo) {
  return quarter * (60 / tempo);
}
