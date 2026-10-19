import { quarterToSeconds } from "../timeline.js";

export const BEATLANE6_KEYS = ["a", "s", "d", "j", "k", "l"];
export const BEATLANE6_LABELS = ["A", "S", "D", "J", "K", "L"];

export const BEATLANE6_JUDGEMENT_WINDOWS = Object.freeze({
  perfect: 0.045,
  great: 0.090,
  good: 0.140
});

const DIFFICULTIES = new Set(["easy", "normal", "hard"]);

function hashString(value) {
  let hash = 2166136261;
  for (const char of String(value)) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function nearestFreeLane(target, used) {
  if (!used.has(target)) return target;
  for (let distance = 1; distance < 6; distance += 1) {
    const left = target - distance;
    const right = target + distance;
    if (left >= 0 && !used.has(left)) return left;
    if (right < 6 && !used.has(right)) return right;
  }
  return null;
}

function eventSort(a, b) {
  const aPitch = a.kind === "note" ? a.note : Infinity;
  const bPitch = b.kind === "note" ? b.note : Infinity;
  return aPitch - bPitch || a.trackIndex - b.trackIndex || a.index - b.index;
}

function chooseGroupEvents(group, difficulty, previousEasyQuarter) {
  const notes = group.filter((item) => item.kind === "note").sort(eventSort);
  const triggers = group.filter((item) => item.kind === "trigger").sort(eventSort);

  if (difficulty === "hard") {
    return { events: [...notes, ...triggers].slice(0, 6), easyQuarter: previousEasyQuarter };
  }

  if (difficulty === "easy") {
    if (
      previousEasyQuarter !== null &&
      group[0].startQuarter - previousEasyQuarter < 0.5
    ) {
      return { events: [], easyQuarter: previousEasyQuarter };
    }

    const selected = [];
    if (notes.length > 0) {
      selected.push(notes[0]);
      if (notes.length > 1) selected.push(notes[notes.length - 1]);
    } else if (triggers.length > 0) {
      selected.push(triggers[0]);
    }

    return {
      events: selected.slice(0, 2),
      easyQuarter: selected.length > 0 ? group[0].startQuarter : previousEasyQuarter
    };
  }

  const selected = notes.length > 0
    ? notes.slice(0, 3)
    : triggers.slice(0, 2);

  if (notes.length > 0 && selected.length < 3 && triggers.length > 0) {
    selected.push(triggers[0]);
  }

  return { events: selected.slice(0, 3), easyQuarter: previousEasyQuarter };
}

function pitchTarget(note, minPitch, maxPitch) {
  if (!Number.isFinite(note)) return 2;
  if (maxPitch <= minPitch) return 2;
  const normalized = (note - minPitch) / (maxPitch - minPitch);
  return Math.max(0, Math.min(5, Math.round(normalized * 5)));
}

export function generateBeatLane6Chart(timeline, options = {}) {
  const difficulty = String(options.difficulty || "normal").toLowerCase();
  if (!DIFFICULTIES.has(difficulty)) {
    throw new Error("BeatLane6 difficulty must be easy, normal or hard.");
  }

  const approachSeconds = Number.isFinite(Number(options.approachSeconds))
    ? Math.max(1.5, Math.min(5, Number(options.approachSeconds)))
    : 2.5;

  const tempo = timeline.config.tempo;
  const candidates = [];
  const notePitches = [];

  timeline.tracks.forEach((track, trackIndex) => {
    track.events.forEach((event, index) => {
      if (event.kind !== "note" && event.kind !== "trigger") return;
      const item = {
        ...event,
        index,
        trackIndex,
        trackName: track.name,
        sound: track.sound || null,
        instrument: track.instrument || null
      };
      candidates.push(item);
      if (event.kind === "note") notePitches.push(event.note);
    });
  });

  const minPitch = notePitches.length > 0 ? Math.min(...notePitches) : 60;
  const maxPitch = notePitches.length > 0 ? Math.max(...notePitches) : 72;

  const grouped = new Map();
  for (const item of candidates) {
    const key = item.startQuarter.toFixed(6);
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key).push(item);
  }

  const groups = [...grouped.values()]
    .sort((a, b) => a[0].startQuarter - b[0].startQuarter);

  const events = [];
  let previousEasyQuarter = null;
  let sequence = 0;

  for (const group of groups) {
    const choice = chooseGroupEvents(group, difficulty, previousEasyQuarter);
    previousEasyQuarter = choice.easyQuarter;
    if (choice.events.length === 0) continue;

    const used = new Set();
    for (const item of choice.events.sort(eventSort)) {
      const target = item.kind === "note"
        ? pitchTarget(item.note, minPitch, maxPitch)
        : hashString(item.trigger + ":" + item.trackIndex + ":" + item.startQuarter) % 6;
      const lane = nearestFreeLane(target, used);
      if (lane === null) continue;
      used.add(lane);

      const timeSeconds = quarterToSeconds(item.startQuarter, tempo);
      const durationSeconds = quarterToSeconds(item.durationQuarter, tempo);
      const holdQuarterThreshold = difficulty === "easy" ? 2 : 1.5;
      const type =
        item.kind === "note" && item.durationQuarter >= holdQuarterThreshold
          ? "hold"
          : "tap";

      events.push({
        id: "bl6-" + sequence,
        sequence,
        lane,
        key: BEATLANE6_KEYS[lane],
        label: BEATLANE6_LABELS[lane],
        type,
        kind: item.kind,
        timeSeconds,
        durationSeconds,
        endSeconds: timeSeconds + durationSeconds,
        startQuarter: item.startQuarter,
        durationQuarter: item.durationQuarter,
        note: item.kind === "note" ? item.note : null,
        noteName: item.kind === "note" ? item.noteName : null,
        trigger: item.kind === "trigger" ? item.trigger : null,
        velocity: item.velocity,
        source: {
          trackIndex: item.trackIndex,
          trackName: item.trackName,
          sound: item.sound,
          instrument: item.instrument
        }
      });
      sequence += 1;
    }
  }

  const durationSeconds = quarterToSeconds(timeline.endQuarter, tempo);
  const holdCount = events.filter((event) => event.type === "hold").length;
  const tapCount = events.length - holdCount;

  return {
    game: "BeatLane6",
    version: 1,
    title: timeline.title,
    tempo,
    difficulty,
    laneCount: 6,
    lanes: BEATLANE6_KEYS.map((key, lane) => ({
      lane,
      key,
      label: BEATLANE6_LABELS[lane],
      hand: lane < 3 ? "left" : "right"
    })),
    approachSeconds,
    durationSeconds,
    judgementWindows: { ...BEATLANE6_JUDGEMENT_WINDOWS },
    scoring: {
      perfect: 1000,
      great: 700,
      good: 400,
      miss: 0,
      comboMultiplier: [
        { combo: 0, multiplier: 1 },
        { combo: 10, multiplier: 2 },
        { combo: 25, multiplier: 3 },
        { combo: 50, multiplier: 4 }
      ]
    },
    life: {
      start: 100,
      missDamage: 12,
      earlyHoldReleaseDamage: 8,
      perfectRecovery: 2,
      greatRecovery: 1
    },
    stats: {
      sourceEvents: candidates.length,
      chartEvents: events.length,
      tapCount,
      holdCount
    },
    events
  };
}
