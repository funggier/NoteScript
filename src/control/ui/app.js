import {
  bindingCandidatesFromEvent,
  bindingMatchesEvent,
  canonicalBindingFromEvent
} from "./keyboard.js";

const ui = {
  engineStatus: document.querySelector("#engineStatus"),
  dirtyState: document.querySelector("#dirtyState"),
  hudOctave: document.querySelector("#hudOctave"),
  hudVelocity: document.querySelector("#hudVelocity"),
  playSourceType: document.querySelector("#playSourceType"),
  pianoVoiceKind: document.querySelector("#pianoVoiceKind"),
  liveSourceControls: document.querySelector("#liveSourceControls"),
  pianoVoiceKindRow: document.querySelector("#pianoVoiceKindRow"),
  soundPackRow: document.querySelector("#soundPackRow"),
  soundPackLabel: document.querySelector("#soundPackLabel"),
  instrumentRow: document.querySelector("#instrumentRow"),
  liveStageHeader: document.querySelector("#liveStageHeader"),
  liveMonitor: document.querySelector("#liveMonitor"),
  beatLaneView: document.querySelector("#beatLaneView"),
  beatLaneControls: document.querySelector("#beatLaneControls"),
  beatLaneProject: document.querySelector("#beatLaneProject"),
  beatLaneDifficulty: document.querySelector("#beatLaneDifficulty"),
  beatLaneGuide: document.querySelector("#beatLaneGuide"),
  beatLaneStart: document.querySelector("#beatLaneStart"),
  beatLaneStop: document.querySelector("#beatLaneStop"),
  beatLaneStatus: document.querySelector("#beatLaneStatus"),
  beatLaneSongTitle: document.querySelector("#beatLaneSongTitle"),
  beatLaneHighway: document.querySelector("#beatLaneHighway"),
  beatLaneNotes: document.querySelector("#beatLaneNotes"),
  beatLaneCountdown: document.querySelector("#beatLaneCountdown"),
  beatLaneJudgement: document.querySelector("#beatLaneJudgement"),
  beatLaneScore: document.querySelector("#beatLaneScore"),
  beatLaneCombo: document.querySelector("#beatLaneCombo"),
  beatLaneMultiplier: document.querySelector("#beatLaneMultiplier"),
  beatLaneAccuracy: document.querySelector("#beatLaneAccuracy"),
  beatLaneLifeText: document.querySelector("#beatLaneLifeText"),
  beatLaneLifeBar: document.querySelector("#beatLaneLifeBar"),
  beatLaneResult: document.querySelector("#beatLaneResult"),
  beatLaneResultTitle: document.querySelector("#beatLaneResultTitle"),
  beatLaneResultSummary: document.querySelector("#beatLaneResultSummary"),
  beatLaneLanes: [...document.querySelectorAll(".beatlane-lane")],
  playWorkspace: document.querySelector(".play-workspace"),
  projectTransportControls: document.querySelector(".transport-sidebar > .panel.transport-panel:not(.beatlane-controls)"),
  projectSelect: document.querySelector("#projectSelect"),
  transportPlay: document.querySelector("#transportPlay"),
  transportPause: document.querySelector("#transportPause"),
  transportStop: document.querySelector("#transportStop"),
  transportSeek: document.querySelector("#transportSeek"),
  transportPosition: document.querySelector("#transportPosition"),
  transportDuration: document.querySelector("#transportDuration"),
  transportLoop: document.querySelector("#transportLoop"),
  transportVolume: document.querySelector("#transportVolume"),
  transportVolumeValue: document.querySelector("#transportVolumeValue"),
  transportPan: document.querySelector("#transportPan"),
  transportPanValue: document.querySelector("#transportPanValue"),
  outputDevice: document.querySelector("#outputDevice"),
  refreshOutputs: document.querySelector("#refreshOutputs"),
  transportStatus: document.querySelector("#transportStatus"),
  transportVoiceSelect: document.querySelector("#transportVoiceSelect"),
  soundSelect: document.querySelector("#soundSelect"),
  soundMeta: document.querySelector("#soundMeta"),
  instrumentSelect: document.querySelector("#instrumentSelect"),
  instrumentMeta: document.querySelector("#instrumentMeta"),
  velocity: document.querySelector("#velocity"),
  velocityValue: document.querySelector("#velocityValue"),
  octaveDown: document.querySelector("#octaveDown"),
  octaveUp: document.querySelector("#octaveUp"),
  octaveValue: document.querySelector("#octaveValue"),
  sustain: document.querySelector("#sustain"),
  panic: document.querySelector("#panic"),
  enableMidi: document.querySelector("#enableMidi"),
  midiStatus: document.querySelector("#midiStatus"),
  selectedName: document.querySelector("#selectedName"),
  mainTabs: [...document.querySelectorAll(".main-tab")],
  tabPages: [...document.querySelectorAll(".tab-page")],
  composeTabs: [...document.querySelectorAll(".sub-tab")],
  composeViews: [...document.querySelectorAll(".compose-view")],
  newProject: document.querySelector("#newProject"),
  openProject: document.querySelector("#openProject"),
  projectList: document.querySelector("#projectList"),
  projectNameInput: document.querySelector("#projectNameInput"),
  renameProject: document.querySelector("#renameProject"),
  deleteProject: document.querySelector("#deleteProject"),
  projectFileMeta: document.querySelector("#projectFileMeta"),
  markdownEditor: document.querySelector("#markdownEditor"),
  analyzeProject: document.querySelector("#analyzeProject"),
  saveProject: document.querySelector("#saveProject"),
  renderProject: document.querySelector("#renderProject"),
  renderOutputName: document.querySelector("#renderOutputName"),
  exportMidi: document.querySelector("#exportMidi"),
  composeTrackSelect: document.querySelector("#composeTrackSelect"),
  composeSourceType: document.querySelector("#composeSourceType"),
  composeVoiceSelect: document.querySelector("#composeVoiceSelect"),
  composeTrackVolume: document.querySelector("#composeTrackVolume"),
  composeTrackVolumeValue: document.querySelector("#composeTrackVolumeValue"),
  composeApplyVoice: document.querySelector("#composeApplyVoice"),
  diagnosticBadge: document.querySelector("#diagnosticBadge"),
  diagnostics: document.querySelector("#diagnostics"),
  formTitle: document.querySelector("#formTitle"),
  formTempo: document.querySelector("#formTempo"),
  formTime: document.querySelector("#formTime"),
  formKey: document.querySelector("#formKey"),
  formAddTrack: document.querySelector("#formAddTrack"),
  formTracks: document.querySelector("#formTracks"),
  nodeCanvas: document.querySelector("#nodeCanvas"),
  nodeInspectorKind: document.querySelector("#nodeInspectorKind"),
  nodeInspectorEmpty: document.querySelector("#nodeInspectorEmpty"),
  nodeInspectorEditor: document.querySelector("#nodeInspectorEditor"),
  nodeInspectorValue: document.querySelector("#nodeInspectorValue"),
  nodeInspectorApply: document.querySelector("#nodeInspectorApply"),
  nodeInspectorForm: document.querySelector("#nodeInspectorForm"),
  trackTimeline: document.querySelector("#trackTimeline"),
  tracksFileInput: document.querySelector("#tracksFileInput"),
  tracksAddTrack: document.querySelector("#tracksAddTrack"),
  tracksDownloadMd: document.querySelector("#tracksDownloadMd"),
  tracksDownloadSet: document.querySelector("#tracksDownloadSet"),
  tracksOutputName: document.querySelector("#tracksOutputName"),
  tracksDownloadMix: document.querySelector("#tracksDownloadMix"),
  advancedProjectLabel: document.querySelector("#advancedProjectLabel"),
  advancedPlay: document.querySelector("#advancedPlay"),
  advancedPause: document.querySelector("#advancedPause"),
  advancedStop: document.querySelector("#advancedStop"),
  advancedReload: document.querySelector("#advancedReload"),
  advancedSeek: document.querySelector("#advancedSeek"),
  advancedPosition: document.querySelector("#advancedPosition"),
  advancedDuration: document.querySelector("#advancedDuration"),
  advancedStatus: document.querySelector("#advancedStatus"),
  soundBrowser: document.querySelector("#soundBrowser"),
  instrumentBrowser: document.querySelector("#instrumentBrowser"),

  editorModeSetting: document.querySelector("#editorModeSetting"),
  hotkeyEditor: document.querySelector("#hotkeyEditor"),
  resetHotkeys: document.querySelector("#resetHotkeys"),
  saveSettings: document.querySelector("#saveSettings"),
  settingsStatus: document.querySelector("#settingsStatus"),
  hotkeyLegendNotes: document.querySelector("#hotkeyLegendNotes"),
  hotkeyLegendOctave: document.querySelector("#hotkeyLegendOctave"),
  hotkeyLegendSustain: document.querySelector("#hotkeyLegendSustain"),
  pianoDeckMode: document.querySelector("#pianoDeckMode"),
  pianoHotkeyEdit: document.querySelector("#pianoHotkeyEdit"),
  pianoHotkeyPanel: document.querySelector("#pianoHotkeyPanel"),
  pianoHotkeyStatus: document.querySelector("#pianoHotkeyStatus"),
  pianoHotkeySave: document.querySelector("#pianoHotkeySave"),
  pianoHotkeyCancel: document.querySelector("#pianoHotkeyCancel"),
  soundPadDeckMode: document.querySelector("#soundPadDeckMode"),
  soundPadHotkeyEdit: document.querySelector("#soundPadHotkeyEdit"),
  soundPadHotkeyPanel: document.querySelector("#soundPadHotkeyPanel"),
  soundPadHotkeyStatus: document.querySelector("#soundPadHotkeyStatus"),
  soundPadHotkeySave: document.querySelector("#soundPadHotkeySave"),
  soundPadHotkeyCancel: document.querySelector("#soundPadHotkeyCancel"),
  soundPadMixLock: document.querySelector("#soundPadMixLock"),
  soundPadResetMix: document.querySelector("#soundPadResetMix"),
  selectedDetails: document.querySelector("#selectedDetails"),
  voiceCount: document.querySelector("#voiceCount"),
  pianoView: document.querySelector("#pianoView"),
  soundPadView: document.querySelector("#soundPadView"),
  keyboard: document.querySelector("#keyboard"),
  soundPads: document.querySelector("#soundPads"),
  monitorText: document.querySelector("#monitorText")
};

const state = {
  audioContext: null,
  sounds: [],
  instruments: [],
  capabilities: null,
  selected: null,
  selectedInstrument: null,
  playMode: "live",
  sourceMode: "sound",
  instrumentPlaybackMode: "buffered",
  octaveShift: 0,
  velocity: 96,
  spaceSustain: false,
  midiSustain: false,
  voices: new Map(),
  sustained: new Set(),
  liveVoices: new Map(),
  liveMidiRefs: new Map(),
  liveQueue: Promise.resolve(),
  liveReady: false,
  buffers: new Map(),
  keyHeld: new Set(),
  midiAccess: null,
  beatLane6: {
    chart: null,
    project: null,
    difficulty: "normal",
    running: false,
    startedAt: 0,
    raf: 0,
    score: 0,
    combo: 0,
    maxCombo: 0,
    life: 100,
    judgements: { perfect: 0, great: 0, good: 0, miss: 0 },
    eventState: new Map(),
    activeHolds: new Map(),
    gameVoices: new Map(),
    guideSource: null,
    guideGain: null,
    guideBuffer: null,
    guideProject: null,
    laneHeld: new Set(),
    audio: new Map(),
    noteElements: new Map(),
    judgementTimer: 0
  },
  studio: {
    projects: [],
    currentProject: null,
    markdown: "",
    analysis: null,
    dirty: false,
    composeMode: "text",
    settings: null,
    pendingHotkeyAction: null,
    hotkeyEditMode: false,
    hotkeyEditTarget: null,
    hotkeyEditSnapshot: null,
    selectedNode: null
  },
  tracksWorkspace: {
    fileName: null,
    markdown: "",
    analysis: null,
    dirty: false
  },
  advancedTransport: {
    project: null,
    buffers: [],
    sources: [],
    gains: [],
    masterGain: null,
    playing: false,
    offset: 0,
    startedAt: 0,
    duration: 0,
    muted: new Set(),
    volumes: new Map(),
    raf: 0,
    loadToken: 0
  },
  transport: {
    project: null,
    buffer: null,
    source: null,
    gain: null,
    panner: null,
    playing: false,
    offset: 0,
    startedAt: 0,
    duration: 0,
    raf: 0,
    loadToken: 0
  }
};

const DEFAULT_HOTKEYS = {
  note0: "a",
  note1: "w",
  note2: "s",
  note3: "e",
  note4: "d",
  note5: "f",
  note6: "t",
  note7: "g",
  note8: "y",
  note9: "h",
  note10: "u",
  note11: "j",
  note12: "k",
  octaveDown: "z",
  octaveUp: "x",
  sustain: "Space",
  panic: "Escape",
  transportPlayPause: "Enter",
  transportStop: "Backspace"
};

const HOTKEY_LABELS = {
  note0: "Note C",
  note1: "Note C#",
  note2: "Note D",
  note3: "Note D#",
  note4: "Note E",
  note5: "Note F",
  note6: "Note F#",
  note7: "Note G",
  note8: "Note G#",
  note9: "Note A",
  note10: "Note A#",
  note11: "Note B",
  note12: "High C",
  octaveDown: "Octave Down",
  octaveUp: "Octave Up",
  sustain: "Sustain",
  panic: "Panic",
  transportPlayPause: "Play / Pause",
  transportStop: "Transport Stop"
};

const SOUNDPAD_DEFAULT_KEYS = [
  "1", "2", "3", "4", "5", "6", "7", "8",
  "9", "0", "-", "=", "[", "]", ";", "'"
];

function hotkeys() {
  return {
    ...DEFAULT_HOTKEYS,
    ...(state.studio.settings?.hotkeys || {})
  };
}

function soundPadHotkeys(pack = state.selected) {
  if (!pack || pack.type !== "soundpad") return {};
  const saved = state.studio.settings?.soundPadHotkeys?.[pack.id] || {};
  const result = {};
  pack.triggers.forEach((trigger, index) => {
    result[trigger] = saved[trigger] || SOUNDPAD_DEFAULT_KEYS[index] || "";
  });
  return result;
}

function clampSoundPadVolume(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return 1;
  return Math.max(0, Math.min(1, number));
}

function soundPadVolumes(pack = state.selected) {
  if (!pack || pack.type !== "soundpad") return {};
  const saved = state.studio.settings?.soundPadVolumes?.[pack.id] || {};
  const result = {};
  for (const trigger of pack.triggers) {
    result[trigger] = clampSoundPadVolume(
      Object.prototype.hasOwnProperty.call(saved, trigger) ? saved[trigger] : 1
    );
  }
  return result;
}

function soundPadVolume(trigger, pack = state.selected) {
  return soundPadVolumes(pack)[trigger] ?? 1;
}

function soundPadMixLocked(pack = state.selected) {
  if (!pack || pack.type !== "soundpad") return false;
  const locks = state.studio.settings?.soundPadMixLocks || {};
  return Object.prototype.hasOwnProperty.call(locks, pack.id)
    ? locks[pack.id] === true
    : true;
}

function setSoundPadMixLockLocal(pack, locked) {
  if (!pack || pack.type !== "soundpad") return false;
  const next = Boolean(locked);
  state.studio.settings = {
    ...(state.studio.settings || {}),
    soundPadMixLocks: {
      ...(state.studio.settings?.soundPadMixLocks || {}),
      [pack.id]: next
    }
  };
  return next;
}

async function persistSoundPadMixLock(pack = state.selected) {
  if (!pack || pack.type !== "soundpad") return;
  const settings = await post("/v1/studio/settings", {
    soundPadMixLocks: state.studio.settings?.soundPadMixLocks || {}
  });
  state.studio.settings = settings;
}

function updateSoundPadMixLockUi(pack = state.selected) {
  const available = Boolean(pack && pack.type === "soundpad");
  const locked = available ? soundPadMixLocked(pack) : false;

  ui.soundPadMixLock.disabled = !available;
  ui.soundPadMixLock.textContent = locked ? "UNLOCK MIX" : "LOCK MIX";
  ui.soundPadMixLock.classList.toggle("active", locked);
  ui.soundPadMixLock.setAttribute("aria-pressed", String(locked));
  ui.soundPadMixLock.title = locked
    ? "Unlock SoundPad volume controls"
    : "Lock SoundPad volume controls";

  ui.soundPadResetMix.disabled = !available || locked;
  ui.soundPads.classList.toggle("mix-locked", locked);
  ui.soundPads.querySelectorAll(".pad-volume").forEach((input) => {
    input.disabled = locked;
    input.setAttribute("aria-disabled", String(locked));
  });
}

async function toggleSoundPadMixLock() {
  const pack = state.selected;
  if (!pack || pack.type !== "soundpad") return;

  const previous = soundPadMixLocked(pack);
  const next = setSoundPadMixLockLocal(pack, !previous);
  updateSoundPadMixLockUi(pack);

  try {
    await persistSoundPadMixLock(pack);
    updateSoundPadMixLockUi(pack);
    setMonitor(next
      ? "SoundPad mix locked. Pads remain playable; volume controls are protected."
      : "SoundPad mix unlocked. Volume controls are editable.");
  } catch (error) {
    setSoundPadMixLockLocal(pack, previous);
    updateSoundPadMixLockUi(pack);
    setMonitor("SoundPad mix lock save failed: " + error.message);
  }
}

function setSoundPadVolumeLocal(pack, trigger, value) {
  if (!pack || pack.type !== "soundpad") return 1;
  if (soundPadMixLocked(pack)) return soundPadVolume(trigger, pack);
  const next = {
    ...soundPadVolumes(pack),
    [trigger]: clampSoundPadVolume(value)
  };
  state.studio.settings = {
    ...(state.studio.settings || {}),
    soundPadVolumes: {
      ...(state.studio.settings?.soundPadVolumes || {}),
      [pack.id]: next
    }
  };
  return next[trigger];
}

async function persistSoundPadMix(pack = state.selected) {
  if (!pack || pack.type !== "soundpad") return;
  const settings = await post("/v1/studio/settings", {
    soundPadVolumes: state.studio.settings?.soundPadVolumes || {}
  });
  state.studio.settings = settings;
}

function updateSoundPadVolumeUi(pack = state.selected) {
  if (!pack || pack.type !== "soundpad") return;
  const volumes = soundPadVolumes(pack);
  ui.soundPads.querySelectorAll(".pad[data-trigger]").forEach((card) => {
    const trigger = card.dataset.trigger;
    const volume = volumes[trigger] ?? 1;
    const input = card.querySelector(".pad-volume");
    const output = card.querySelector(".pad-volume-value");
    if (input) input.value = String(Math.round(volume * 100));
    if (output) output.textContent = Math.round(volume * 100) + "%";
  });
}

async function resetSoundPadMix() {
  const pack = state.selected;
  if (!pack || pack.type !== "soundpad") return;
  if (soundPadMixLocked(pack)) {
    setMonitor("SoundPad mix is locked. Unlock it before resetting volume.");
    return;
  }
  const reset = {};
  for (const trigger of pack.triggers) reset[trigger] = 1;
  state.studio.settings = {
    ...(state.studio.settings || {}),
    soundPadVolumes: {
      ...(state.studio.settings?.soundPadVolumes || {}),
      [pack.id]: reset
    }
  };
  updateSoundPadVolumeUi(pack);
  try {
    await persistSoundPadMix(pack);
    setMonitor("SoundPad mix reset to 100%.");
  } catch (error) {
    setMonitor("SoundPad mix save failed: " + error.message);
  }
}

function soundPadComputerKeyMap(pack = state.selected) {
  const map = new Map();
  const bindings = soundPadHotkeys(pack);
  for (const [trigger, binding] of Object.entries(bindings)) {
    const key = String(binding || "").toLowerCase();
    if (key) map.set(key, trigger);
  }
  return map;
}

function computerKeyMap() {
  const map = new Map();
  const current = hotkeys();
  for (let offset = 0; offset <= 12; offset += 1) {
    map.set(String(current["note" + offset] || "").toLowerCase(), offset);
  }
  return map;
}

function mappedKeyForEvent(map, event) {
  return bindingCandidatesFromEvent(event)
    .map((candidate) => String(candidate).toLowerCase())
    .find((candidate) => map.has(candidate)) || "";
}

const NON_TEXT_INPUT_TYPES = new Set([
  "button",
  "checkbox",
  "color",
  "file",
  "hidden",
  "image",
  "radio",
  "range",
  "reset",
  "submit"
]);

function isTextEntryTarget(target) {
  if (!(target instanceof Element)) return false;
  if (target.closest('[contenteditable="true"]')) return true;
  if (target instanceof HTMLTextAreaElement) return true;
  if (target instanceof HTMLInputElement) {
    const type = String(target.type || "text").toLowerCase();
    return !NON_TEXT_INPUT_TYPES.has(type);
  }
  return false;
}

function keyMatches(event, binding) {
  return bindingMatchesEvent(event, binding);
}

const WHITE_CLASSES = new Set([0, 2, 4, 5, 7, 9, 11]);
const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

function noteName(midi) {
  return NOTE_NAMES[midi % 12] + (Math.floor(midi / 12) - 1);
}

function currentSustain() {
  return ui.sustain.checked || state.spaceSustain || state.midiSustain;
}

function setMonitor(text) {
  ui.monitorText.textContent = text;
}

function setVoiceCount() {
  const count = state.instrumentPlaybackMode === "live"
    ? state.liveVoices.size
    : state.voices.size;
  ui.voiceCount.textContent = String(count);
}

async function requestJson(path, options = {}) {
  const response = await fetch(path, {
    cache: "no-store",
    ...options,
    headers: {
      "content-type": "application/json",
      ...(options.headers || {})
    }
  });

  if (!response.ok) {
    let message = response.statusText;
    try {
      const data = await response.json();
      message = data.message || data.error || message;
    } catch {}
    throw new Error(message);
  }

  return response.json();
}

function api(path) {
  return requestJson(path);
}

function post(path, payload = {}) {
  return requestJson(path, {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

function queueLive(path, payload = {}) {
  state.liveQueue = state.liveQueue
    .catch(() => {})
    .then(() => post(path, payload));
  return state.liveQueue;
}

function ensureAudio() {
  if (!state.audioContext) {
    state.audioContext = new AudioContext({ latencyHint: "interactive" });
  }
  if (state.audioContext.state === "suspended") state.audioContext.resume();
  return state.audioContext;
}



const BEATLANE6_INPUT_KEYS = ["a", "s", "d", "j", "k", "l"];

function beatLaneMultiplier(combo = state.beatLane6.combo) {
  if (combo >= 50) return 4;
  if (combo >= 25) return 3;
  if (combo >= 10) return 2;
  return 1;
}

function beatLaneAccuracy() {
  const counts = state.beatLane6.judgements;
  const total = counts.perfect + counts.great + counts.good + counts.miss;
  if (total === 0) return 100;
  const weighted =
    counts.perfect +
    counts.great * 0.85 +
    counts.good * 0.6;
  return (weighted / total) * 100;
}

function updateBeatLaneHud() {
  ui.beatLaneScore.textContent = Math.round(state.beatLane6.score).toLocaleString();
  ui.beatLaneCombo.textContent = String(state.beatLane6.combo);
  ui.beatLaneMultiplier.textContent = "x" + beatLaneMultiplier();
  ui.beatLaneAccuracy.textContent = beatLaneAccuracy().toFixed(1) + "%";
  ui.beatLaneLifeText.textContent = String(Math.max(0, Math.round(state.beatLane6.life)));
  ui.beatLaneLifeBar.style.width = Math.max(0, Math.min(100, state.beatLane6.life)) + "%";
}

function showBeatLaneJudgement(text, className = "") {
  clearTimeout(state.beatLane6.judgementTimer);
  ui.beatLaneJudgement.textContent = text;
  ui.beatLaneJudgement.className = "beatlane-judgement" + (className ? " " + className : "");
  state.beatLane6.judgementTimer = window.setTimeout(() => {
    ui.beatLaneJudgement.textContent = "";
    ui.beatLaneJudgement.className = "beatlane-judgement";
  }, 420);
}

function beatLanePosition() {
  if (!state.beatLane6.running || !state.audioContext) return 0;
  return state.audioContext.currentTime - state.beatLane6.startedAt;
}

function setBeatLaneLaneActive(lane, active) {
  const element = ui.beatLaneLanes.find((item) => Number(item.dataset.lane) === lane);
  if (element) element.classList.toggle("active", active);
}

function stopBeatLaneGuide() {
  try { state.beatLane6.guideSource?.stop(); } catch {}
  try { state.beatLane6.guideSource?.disconnect(); } catch {}
  try { state.beatLane6.guideGain?.disconnect(); } catch {}
  state.beatLane6.guideSource = null;
  state.beatLane6.guideGain = null;
}

function releaseBeatLaneVoice(eventId, fast = false) {
  const voice = state.beatLane6.gameVoices.get(eventId);
  if (!voice) return;
  state.beatLane6.gameVoices.delete(eventId);
  const now = voice.context.currentTime;
  const release = fast ? 0.02 : 0.07;
  try {
    voice.gain.gain.cancelScheduledValues(now);
    voice.gain.gain.setValueAtTime(Math.max(0.0001, voice.gain.gain.value), now);
    voice.gain.gain.exponentialRampToValueAtTime(0.0001, now + release);
    voice.source.stop(now + release + 0.01);
  } catch {}
}

function stopBeatLaneVoices(fast = true) {
  for (const eventId of [...state.beatLane6.gameVoices.keys()]) {
    releaseBeatLaneVoice(eventId, fast);
  }
}

function stopBeatLaneAnimation() {
  if (state.beatLane6.raf) cancelAnimationFrame(state.beatLane6.raf);
  state.beatLane6.raf = 0;
}

function resetBeatLaneRuntime() {
  stopBeatLaneAnimation();
  stopBeatLaneGuide();
  stopBeatLaneVoices(true);
  state.beatLane6.running = false;
  state.beatLane6.startedAt = 0;
  state.beatLane6.activeHolds.clear();
  state.beatLane6.laneHeld.clear();
  for (const lane of ui.beatLaneLanes) lane.classList.remove("active");
}

function stopBeatLaneGame(manual = true) {
  const wasRunning = state.beatLane6.running;
  resetBeatLaneRuntime();
  if (manual) {
    ui.beatLaneCountdown.textContent = "READY";
    ui.beatLaneJudgement.textContent = "";
    ui.beatLaneResult.classList.add("hidden");
    if (wasRunning || state.beatLane6.chart) {
      ui.beatLaneStatus.textContent = "Stopped. Press Start Game to play again.";
    }
  }
}

function soundPianoPacks() {
  return state.sounds.filter((item) => item.category === "soundpiano" || item.type === "pitched");
}

function soundPadPacks() {
  return state.sounds.filter((item) => item.category === "soundpad" || item.type === "soundpad");
}

function populatePlaySoundSelect(category) {
  const packs = category === "soundpad" ? soundPadPacks() : soundPianoPacks();
  const previous = ui.soundSelect.value;
  ui.soundSelect.innerHTML = "";

  for (const sound of packs) {
    const option = document.createElement("option");
    option.value = sound.id;
    option.textContent = sound.name;
    ui.soundSelect.appendChild(option);
  }

  ui.soundSelect.disabled = packs.length === 0;
  if (packs.length === 0) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = category === "soundpad"
      ? "No SoundPad sets installed"
      : "No SoundPiano packs installed";
    ui.soundSelect.appendChild(option);
    return null;
  }

  const next = packs.some((item) => item.id === previous) ? previous : packs[0].id;
  ui.soundSelect.value = next;
  return next;
}

function restoreLivePlayView() {
  ui.liveStageHeader.classList.remove("hidden");
  ui.liveMonitor.classList.remove("hidden");
  ui.beatLaneView.classList.add("hidden");
  ui.beatLaneControls.classList.add("hidden");
  ui.projectTransportControls?.classList.remove("hidden");
  ui.playWorkspace?.classList.remove("beatlane-mode");
  ui.liveSourceControls.classList.remove("hidden");

  const showSoundPad = state.sourceMode === "sound" && state.selected?.type === "soundpad";
  ui.pianoView.classList.toggle("hidden", showSoundPad);
  ui.soundPadView.classList.toggle("hidden", !showSoundPad);
}

function setPlayMode(mode) {
  const next = mode === "beatlane6" ? "beatlane6" : "live";
  if (state.playMode === "beatlane6" && next !== "beatlane6") {
    stopBeatLaneGame(true);
  }
  state.playMode = next;
  const game = next === "beatlane6";

  if (!game) {
    restoreLivePlayView();
    return;
  }

  stopTransport();
  stopAllVoices(true);
  ui.liveStageHeader.classList.add("hidden");
  ui.liveMonitor.classList.add("hidden");
  ui.pianoView.classList.add("hidden");
  ui.soundPadView.classList.add("hidden");
  ui.liveSourceControls.classList.add("hidden");
  ui.beatLaneView.classList.remove("hidden");
  ui.beatLaneControls.classList.remove("hidden");
  ui.projectTransportControls?.classList.add("hidden");
  ui.playWorkspace?.classList.add("beatlane-mode");
  ui.beatLaneStatus.textContent = state.beatLane6.chart
    ? "Ready. Press Start Game."
    : "Choose a song. Chart is generated from NoteScript Markdown.";
}

async function applyPlaySourceSelection() {
  const type = ui.playSourceType.value;

  if (type === "gamebeatlane6") {
    setPlayMode("beatlane6");
    try {
      if (ui.beatLaneProject.value) await loadBeatLaneChart(false);
    } catch (error) {
      ui.beatLaneStatus.textContent = "BeatLane6 chart error: " + error.message;
    }
    return;
  }

  setPlayMode("live");
  ui.pianoVoiceKindRow.classList.toggle("hidden", type !== "soundpiano");
  ui.soundPackRow.classList.toggle("hidden", type === "soundpiano" && ui.pianoVoiceKind.value === "instrument");
  ui.instrumentRow.classList.toggle("hidden", !(type === "soundpiano" && ui.pianoVoiceKind.value === "instrument"));

  if (type === "soundpad") {
    ui.soundPackLabel.textContent = "SoundPad set";
    const id = populatePlaySoundSelect("soundpad");
    if (id) await selectSound(id);
    return;
  }

  ui.soundPackLabel.textContent = "SoundPiano pack";
  if (ui.pianoVoiceKind.value === "instrument") {
    if (ui.instrumentSelect.value) await selectInstrument(ui.instrumentSelect.value);
    return;
  }

  const id = populatePlaySoundSelect("soundpiano");
  if (id) await selectSound(id);
}

function buildBeatLaneNoteElements(chart) {
  ui.beatLaneNotes.innerHTML = "";
  state.beatLane6.noteElements.clear();
  for (const event of chart.events) {
    const element = document.createElement("div");
    element.className = "beatlane-note " + event.type;
    element.dataset.eventId = event.id;
    element.dataset.lane = String(event.lane);
    element.style.left = (event.lane * (100 / 6)) + "%";
    element.style.opacity = "0";

    if (event.type === "hold") {
      const tail = document.createElement("span");
      tail.className = "beatlane-hold-tail";
      const holdHeight = Math.max(
        24,
        Math.min(250, (event.durationSeconds / chart.approachSeconds) * 350)
      );
      tail.style.setProperty("--hold-height", holdHeight + "px");
      element.appendChild(tail);
    }

    ui.beatLaneNotes.appendChild(element);
    state.beatLane6.noteElements.set(event.id, element);
  }
}

async function loadBeatLaneChart(force = false) {
  const project = String(ui.beatLaneProject.value || "").trim();
  const difficulty = String(ui.beatLaneDifficulty.value || "normal");
  if (!project) {
    ui.beatLaneStatus.textContent = "No NoteScript project selected.";
    return null;
  }

  if (
    !force &&
    state.beatLane6.chart &&
    state.beatLane6.project === project &&
    state.beatLane6.difficulty === difficulty
  ) {
    return state.beatLane6.chart;
  }

  ui.beatLaneStatus.textContent = "Generating " + difficulty + " chart...";
  const chart = await api(
    "/v1/game/beatlane6/chart?project=" + encodeURIComponent(project) +
    "&difficulty=" + encodeURIComponent(difficulty)
  );

  state.beatLane6.chart = chart;
  state.beatLane6.project = project;
  state.beatLane6.difficulty = difficulty;
  state.beatLane6.eventState = new Map(chart.events.map((event) => [event.id, "pending"]));
  state.beatLane6.audio.clear();
  buildBeatLaneNoteElements(chart);
  ui.beatLaneSongTitle.textContent =
    chart.title + " · " + difficulty.toUpperCase() +
    " · " + chart.stats.chartEvents + " notes";
  ui.beatLaneStatus.textContent =
    chart.stats.chartEvents + " chart events · " +
    chart.stats.tapCount + " tap · " +
    chart.stats.holdCount + " hold · pre-roll " +
    chart.approachSeconds.toFixed(1) + "s";
  return chart;
}

async function beatLaneAudioDescriptor(event) {
  if (event.kind === "trigger" && event.source.sound) {
    const buffer = await loadTriggerBuffer(event.source.sound, event.trigger);
    return { buffer, playbackRate: 1 };
  }

  if (event.kind !== "note") return null;

  if (event.source.instrument) {
    const item = state.instruments.find((instrument) => instrument.id === event.source.instrument);
    if (!item?.playable) return null;
    const buffer = await loadInstrumentBuffer(
      event.source.instrument,
      event.note,
      event.velocity || 96
    );
    return { buffer, playbackRate: 1 };
  }

  if (event.source.sound) {
    const pack = state.sounds.find((sound) => sound.id === event.source.sound);
    if (!pack || pack.type !== "pitched") return null;
    const root = nearestRoot(pack, event.note);
    if (!root) return null;
    const buffer = await loadRootBuffer(pack.id, root.midi);
    return {
      buffer,
      playbackRate: Math.pow(2, (event.note - root.midi) / 12)
    };
  }

  return null;
}

function beatLaneAudioKey(event) {
  if (event.kind === "trigger") {
    return "trigger:" + event.source.sound + ":" + event.trigger;
  }
  if (event.source.instrument) {
    return "instrument:" + event.source.instrument + ":" + event.note + ":" + (event.velocity || 96);
  }
  return "sound:" + event.source.sound + ":" + event.note;
}

async function prepareBeatLaneAudio(chart) {
  const descriptorByKey = new Map();
  const tasks = [];

  for (const event of chart.events) {
    const key = beatLaneAudioKey(event);
    if (!descriptorByKey.has(key)) {
      const promise = beatLaneAudioDescriptor(event).catch(() => null);
      descriptorByKey.set(key, promise);
      tasks.push(promise);
    }
  }

  await Promise.all(tasks);
  state.beatLane6.audio.clear();
  for (const event of chart.events) {
    const descriptor = await descriptorByKey.get(beatLaneAudioKey(event));
    state.beatLane6.audio.set(event.id, descriptor);
  }
}

async function loadBeatLaneGuide(project) {
  if (
    state.beatLane6.guideBuffer &&
    state.beatLane6.guideProject === project
  ) {
    return state.beatLane6.guideBuffer;
  }

  const response = await fetch(
    "/v1/transport/audio?project=" + encodeURIComponent(project),
    { cache: "no-store" }
  );
  if (!response.ok) throw new Error("Could not load BeatLane6 guide track.");
  const bytes = await response.arrayBuffer();
  const context = ensureAudio();
  const buffer = await context.decodeAudioData(bytes.slice(0));
  state.beatLane6.guideBuffer = buffer;
  state.beatLane6.guideProject = project;
  return buffer;
}

function startBeatLaneGuide(startAt) {
  if (!ui.beatLaneGuide.checked || !state.beatLane6.guideBuffer) return;
  const context = ensureAudio();
  const source = context.createBufferSource();
  const gain = context.createGain();
  source.buffer = state.beatLane6.guideBuffer;
  gain.gain.value = 0.30;
  source.connect(gain);
  gain.connect(context.destination);
  source.start(startAt);
  state.beatLane6.guideSource = source;
  state.beatLane6.guideGain = gain;
}

function playBeatLaneEventSound(event) {
  const descriptor = state.beatLane6.audio.get(event.id);
  if (!descriptor?.buffer) return;

  const context = ensureAudio();
  const source = context.createBufferSource();
  const gain = context.createGain();
  source.buffer = descriptor.buffer;
  source.playbackRate.value = descriptor.playbackRate || 1;

  const velocity = Math.max(1, Math.min(127, Number(event.velocity) || 96)) / 127;
  gain.gain.value = Math.max(0.0001, Math.pow(velocity, 1.25) * 0.82);
  source.connect(gain);
  gain.connect(context.destination);

  const voice = { source, gain, context };
  state.beatLane6.gameVoices.set(event.id, voice);
  source.onended = () => {
    if (state.beatLane6.gameVoices.get(event.id) === voice) {
      state.beatLane6.gameVoices.delete(event.id);
    }
  };
  source.start();

  if (event.type === "hold") {
    try {
      source.stop(context.currentTime + Math.max(0.12, event.durationSeconds + 0.08));
    } catch {}
  }
}

function beatLaneJudgementForDelta(delta, windows) {
  const distance = Math.abs(delta);
  if (distance <= windows.perfect) return "perfect";
  if (distance <= windows.great) return "great";
  if (distance <= windows.good) return "good";
  return null;
}

function registerBeatLaneHit(event, judgement) {
  const game = state.beatLane6;
  const base = game.chart.scoring[judgement] || 0;
  game.combo += 1;
  game.maxCombo = Math.max(game.maxCombo, game.combo);
  game.score += base * beatLaneMultiplier(game.combo);
  game.judgements[judgement] += 1;

  if (judgement === "perfect") {
    game.life = Math.min(100, game.life + game.chart.life.perfectRecovery);
  } else if (judgement === "great") {
    game.life = Math.min(100, game.life + game.chart.life.greatRecovery);
  }

  game.eventState.set(event.id, event.type === "hold" ? "holding" : "hit");
  const element = game.noteElements.get(event.id);
  if (element) {
    element.classList.add("hit");
    element.style.opacity = event.type === "hold" ? "1" : "0.12";
  }

  if (event.type === "hold") {
    game.activeHolds.set(event.lane, event.id);
  }

  playBeatLaneEventSound(event);
  showBeatLaneJudgement(judgement.toUpperCase(), judgement);
  updateBeatLaneHud();
}

function registerBeatLaneMiss(event, label = "MISS") {
  const game = state.beatLane6;
  if (game.eventState.get(event.id) !== "pending") return;

  game.eventState.set(event.id, "missed");
  game.combo = 0;
  game.judgements.miss += 1;
  game.life = Math.max(0, game.life - game.chart.life.missDamage);

  const element = game.noteElements.get(event.id);
  if (element) {
    element.classList.add("missed");
    element.style.opacity = "0.08";
  }
  showBeatLaneJudgement(label, "miss");
  updateBeatLaneHud();
}

function breakBeatLaneHold(event) {
  const game = state.beatLane6;
  game.eventState.set(event.id, "broken");
  game.activeHolds.delete(event.lane);
  game.combo = 0;
  game.life = Math.max(0, game.life - game.chart.life.earlyHoldReleaseDamage);
  releaseBeatLaneVoice(event.id, true);
  showBeatLaneJudgement("HOLD BREAK", "miss");
  updateBeatLaneHud();
}

function completeBeatLaneHold(event) {
  const game = state.beatLane6;
  if (game.eventState.get(event.id) !== "holding") return;
  game.eventState.set(event.id, "held");
  game.activeHolds.delete(event.lane);
  releaseBeatLaneVoice(event.id, false);
}

function beatLaneKeyDown(lane) {
  if (state.playMode !== "beatlane6") return false;
  setBeatLaneLaneActive(lane, true);
  if (!state.beatLane6.running || state.beatLane6.laneHeld.has(lane)) return true;
  state.beatLane6.laneHeld.add(lane);

  const songTime = beatLanePosition();
  const chart = state.beatLane6.chart;
  if (!chart || songTime < -chart.judgementWindows.good) return true;

  let best = null;
  let bestDistance = Infinity;
  for (const event of chart.events) {
    if (event.lane !== lane || state.beatLane6.eventState.get(event.id) !== "pending") continue;
    const distance = Math.abs(songTime - event.timeSeconds);
    if (distance <= chart.judgementWindows.good && distance < bestDistance) {
      best = event;
      bestDistance = distance;
    }
  }

  if (!best) return true;
  const judgement = beatLaneJudgementForDelta(
    songTime - best.timeSeconds,
    chart.judgementWindows
  );
  if (judgement) registerBeatLaneHit(best, judgement);
  return true;
}

function beatLaneKeyUp(lane) {
  if (state.playMode !== "beatlane6") return false;
  setBeatLaneLaneActive(lane, false);
  state.beatLane6.laneHeld.delete(lane);

  const eventId = state.beatLane6.activeHolds.get(lane);
  if (!eventId || !state.beatLane6.chart) return true;
  const event = state.beatLane6.chart.events.find((item) => item.id === eventId);
  if (!event) return true;

  const songTime = beatLanePosition();
  if (songTime + state.beatLane6.chart.judgementWindows.good < event.endSeconds) {
    breakBeatLaneHold(event);
  } else {
    completeBeatLaneHold(event);
  }
  return true;
}

function renderBeatLaneFrame(songTime) {
  const chart = state.beatLane6.chart;
  if (!chart) return;

  const height = ui.beatLaneHighway.clientHeight || 430;
  const spawnY = 18;
  const hitY = height - 59;
  const travel = hitY - spawnY;

  for (const event of chart.events) {
    const element = state.beatLane6.noteElements.get(event.id);
    if (!element) continue;
    const delta = event.timeSeconds - songTime;
    const stateValue = state.beatLane6.eventState.get(event.id);
    const visible =
      delta <= chart.approachSeconds + 0.20 &&
      (
        delta >= -0.45 ||
        stateValue === "holding"
      );

    if (!visible || ["hit", "held", "broken"].includes(stateValue) && songTime - event.timeSeconds > 0.30) {
      element.style.opacity = "0";
      continue;
    }

    const progress = 1 - delta / chart.approachSeconds;
    const y = spawnY + progress * travel;
    element.style.transform = "translateY(" + y.toFixed(2) + "px)";
    if (stateValue === "pending" || stateValue === "holding") {
      element.style.opacity = "1";
    }
  }
}

function updateBeatLaneCountdown(songTime) {
  if (songTime < -3) {
    ui.beatLaneCountdown.textContent = "READY";
  } else if (songTime < -0.05) {
    ui.beatLaneCountdown.textContent = String(Math.max(1, Math.ceil(-songTime)));
  } else if (songTime < 0.38) {
    ui.beatLaneCountdown.textContent = "GO";
  } else {
    ui.beatLaneCountdown.textContent = "";
  }
}

function finishBeatLaneGame(success) {
  const game = state.beatLane6;
  if (!game.chart) return;

  game.running = false;
  stopBeatLaneAnimation();
  stopBeatLaneGuide();
  stopBeatLaneVoices(false);
  game.activeHolds.clear();
  game.laneHeld.clear();
  for (const lane of ui.beatLaneLanes) lane.classList.remove("active");

  const counts = game.judgements;
  ui.beatLaneResultTitle.textContent = success ? "SUCCESS" : "FAILED";
  ui.beatLaneResultSummary.textContent =
    "Score " + Math.round(game.score).toLocaleString() +
    " · Accuracy " + beatLaneAccuracy().toFixed(1) + "%\n" +
    "Perfect " + counts.perfect +
    " · Great " + counts.great +
    " · Good " + counts.good +
    " · Miss " + counts.miss +
    "\nMax Combo " + game.maxCombo;
  ui.beatLaneResult.classList.remove("hidden");
  ui.beatLaneCountdown.textContent = "";
  ui.beatLaneStatus.textContent = success
    ? "Song complete. SUCCESS."
    : "Life reached zero. FAILED.";
}

function beatLaneAnimationTick() {
  const game = state.beatLane6;
  if (!game.running || !game.chart) return;

  const songTime = beatLanePosition();
  updateBeatLaneCountdown(songTime);
  renderBeatLaneFrame(songTime);

  for (const event of game.chart.events) {
    const eventStatus = game.eventState.get(event.id);
    if (
      eventStatus === "pending" &&
      songTime > event.timeSeconds + game.chart.judgementWindows.good
    ) {
      registerBeatLaneMiss(event);
      if (game.life <= 0) {
        finishBeatLaneGame(false);
        return;
      }
    } else if (
      eventStatus === "holding" &&
      songTime >= event.endSeconds
    ) {
      completeBeatLaneHold(event);
    }
  }

  if (game.life <= 0) {
    finishBeatLaneGame(false);
    return;
  }

  const terminal = [...game.eventState.values()].every((value) =>
    ["hit", "held", "broken", "missed"].includes(value)
  );
  if (
    songTime > game.chart.durationSeconds + game.chart.judgementWindows.good &&
    terminal
  ) {
    finishBeatLaneGame(true);
    return;
  }

  game.raf = requestAnimationFrame(beatLaneAnimationTick);
}

async function startBeatLaneGame() {
  setPlayMode("beatlane6");
  resetBeatLaneRuntime();
  ui.beatLaneResult.classList.add("hidden");
  ui.beatLaneJudgement.textContent = "";
  ui.beatLaneCountdown.textContent = "READY";
  ui.beatLaneStatus.textContent = "Preparing chart and sounds...";

  try {
    const chart = await loadBeatLaneChart(true);
    if (!chart || chart.events.length === 0) {
      ui.beatLaneStatus.textContent = "This song produced no playable BeatLane6 events.";
      return;
    }

    state.beatLane6.score = 0;
    state.beatLane6.combo = 0;
    state.beatLane6.maxCombo = 0;
    state.beatLane6.life = chart.life.start;
    state.beatLane6.judgements = { perfect: 0, great: 0, good: 0, miss: 0 };
    state.beatLane6.eventState = new Map(chart.events.map((event) => [event.id, "pending"]));
    updateBeatLaneHud();

    await prepareBeatLaneAudio(chart);
    if (ui.beatLaneGuide.checked) {
      ui.beatLaneStatus.textContent = "Preparing guide track...";
      await loadBeatLaneGuide(state.beatLane6.project);
    }

    const context = ensureAudio();
    if (context.state === "suspended") await context.resume();

    state.beatLane6.startedAt = context.currentTime + chart.approachSeconds;
    state.beatLane6.running = true;
    startBeatLaneGuide(state.beatLane6.startedAt);
    ui.beatLaneStatus.textContent =
      "Playing " + chart.title + " · " + chart.difficulty.toUpperCase() +
      " · A S D | J K L";
    renderBeatLaneFrame(-chart.approachSeconds);
    state.beatLane6.raf = requestAnimationFrame(beatLaneAnimationTick);
  } catch (error) {
    resetBeatLaneRuntime();
    ui.beatLaneStatus.textContent = "BeatLane6 error: " + error.message;
  }
}

function formatTime(seconds) {
  const value = Math.max(0, Number(seconds) || 0);
  const minutes = Math.floor(value / 60);
  const remaining = value - minutes * 60;
  return minutes + ":" + remaining.toFixed(1).padStart(4, "0");
}

function transportPosition() {
  const transport = state.transport;
  if (!transport.playing || !state.audioContext) return transport.offset;

  const elapsed = Math.max(0, state.audioContext.currentTime - transport.startedAt);
  let position = transport.offset + elapsed;

  if (ui.transportLoop.checked && transport.duration > 0) {
    position %= transport.duration;
  } else {
    position = Math.min(transport.duration, position);
  }

  return position;
}

function updateTransportDisplay(position = transportPosition()) {
  const transport = state.transport;
  const duration = Math.max(0, transport.duration);
  const safe = Math.max(0, Math.min(duration || 0, position || 0));
  ui.transportPosition.textContent = formatTime(safe);
  ui.transportDuration.textContent = formatTime(duration);
  ui.transportSeek.value = duration > 0 ? String(Math.round((safe / duration) * 1000)) : "0";
}

function stopTransportAnimation() {
  if (state.transport.raf) cancelAnimationFrame(state.transport.raf);
  state.transport.raf = 0;
}

function transportAnimationTick() {
  if (!state.transport.playing) {
    stopTransportAnimation();
    updateTransportDisplay();
    return;
  }
  updateTransportDisplay();
  state.transport.raf = requestAnimationFrame(transportAnimationTick);
}

function disconnectTransportNodes() {
  const transport = state.transport;
  try { transport.source?.disconnect(); } catch {}
  try { transport.gain?.disconnect(); } catch {}
  try { transport.panner?.disconnect(); } catch {}
  transport.source = null;
  transport.gain = null;
  transport.panner = null;
}

function stopTransportSource(manual = true) {
  const transport = state.transport;
  if (!transport.source) return;
  try {
    transport.source.__manualStop = manual;
    transport.source.stop();
  } catch {}
  disconnectTransportNodes();
}

function transportGainValue() {
  return Math.max(0, Math.min(1, Number(ui.transportVolume.value) / 100));
}

function transportPanValue() {
  return Math.max(-1, Math.min(1, Number(ui.transportPan.value) / 100));
}

function selectedTransportVoice() {
  return parseVoiceValue(ui.transportVoiceSelect.value);
}

function transportAudioUrl(project) {
  const voice = selectedTransportVoice();
  let url = "/v1/transport/audio?project=" + encodeURIComponent(project);
  if (voice) {
    url += "&sourceType=" + encodeURIComponent(voice.type) +
      "&sourceId=" + encodeURIComponent(voice.id);
  }
  return url;
}

function populateTransportVoiceSelect() {
  fillVoiceSelect(ui.transportVoiceSelect, null, {
    includeOriginal: true,
    selected: ui.transportVoiceSelect.value || "original"
  });
  if (!ui.transportVoiceSelect.value) ui.transportVoiceSelect.value = "original";
}

async function loadTransportProject(project = ui.projectSelect.value) {
  const name = String(project || "").trim();
  if (!name) {
    ui.transportStatus.textContent = "No project selected.";
    return false;
  }

  const token = ++state.transport.loadToken;
  stopTransport();
  ui.transportStatus.textContent = "Rendering preview...";
  ui.transportPlay.disabled = true;
  ui.transportPause.disabled = true;
  ui.transportStop.disabled = true;

  try {
    const response = await fetch(
      transportAudioUrl(name),
      { cache: "no-store" }
    );

    if (!response.ok) {
      let message = response.statusText;
      try {
        const data = await response.json();
        message = data.message || data.error || message;
      } catch {}
      throw new Error(message);
    }

    const bytes = await response.arrayBuffer();
    const context = ensureAudio();
    const buffer = await context.decodeAudioData(bytes.slice(0));

    if (token !== state.transport.loadToken) return false;

    state.transport.project = name;
    state.transport.buffer = buffer;
    state.transport.duration = buffer.duration;
    state.transport.offset = 0;
    ui.transportStatus.textContent =
      "Loaded " + name + " · " + formatTime(buffer.duration) + " · browser context " +
      Math.round(buffer.sampleRate / 100) / 10 + " kHz";
    updateTransportDisplay(0);
    return true;
  } catch (error) {
    if (token === state.transport.loadToken) {
      state.transport.buffer = null;
      state.transport.duration = 0;
      state.transport.offset = 0;
      ui.transportStatus.textContent = "Preview error: " + error.message;
      updateTransportDisplay(0);
    }
    return false;
  } finally {
    if (token === state.transport.loadToken) {
      const ready = Boolean(state.transport.buffer);
      ui.transportPlay.disabled = !ready;
      ui.transportPause.disabled = !ready;
      ui.transportStop.disabled = !ready;
    }
  }
}

function createTransportSource() {
  const context = ensureAudio();
  const transport = state.transport;
  const source = context.createBufferSource();
  const gain = context.createGain();

  source.buffer = transport.buffer;
  source.loop = ui.transportLoop.checked;
  if (source.loop && transport.duration > 0) {
    source.loopStart = 0;
    source.loopEnd = transport.duration;
  }

  gain.gain.value = transportGainValue();
  source.connect(gain);

  let panner = null;
  if (typeof context.createStereoPanner === "function") {
    panner = context.createStereoPanner();
    panner.pan.value = transportPanValue();
    gain.connect(panner);
    panner.connect(context.destination);
  } else {
    gain.connect(context.destination);
  }

  source.onended = () => {
    if (source.__manualStop) return;
    if (state.transport.source !== source) return;
    state.transport.playing = false;
    state.transport.offset = 0;
    disconnectTransportNodes();
    stopTransportAnimation();
    updateTransportDisplay(0);
    ui.transportStatus.textContent = "Preview ended.";
  };

  transport.source = source;
  transport.gain = gain;
  transport.panner = panner;
  return source;
}

async function playTransport() {
  if (!state.transport.buffer) {
    ui.transportStatus.textContent =
      "Preview is not ready yet. Choose a Project or Preview voice and wait for automatic loading.";
    return;
  }

  const context = ensureAudio();
  if (state.transport.playing) return;

  if (state.transport.offset >= state.transport.duration) {
    state.transport.offset = 0;
  }

  const source = createTransportSource();
  const offset = Math.max(0, Math.min(state.transport.duration, state.transport.offset));
  state.transport.startedAt = context.currentTime;
  state.transport.playing = true;

  source.start(0, offset);
  ui.transportStatus.textContent =
    "Playing " + (state.transport.project || "project") +
    (ui.transportLoop.checked ? " · loop" : "");
  stopTransportAnimation();
  state.transport.raf = requestAnimationFrame(transportAnimationTick);
}

function pauseTransport() {
  if (!state.transport.playing) return;

  const position = transportPosition();
  state.transport.playing = false;
  state.transport.offset = position;
  stopTransportSource(true);
  stopTransportAnimation();
  updateTransportDisplay(position);
  ui.transportStatus.textContent = "Paused at " + formatTime(position) + ".";
}

function stopTransport() {
  if (state.transport.playing) {
    state.transport.playing = false;
    stopTransportSource(true);
  } else {
    stopTransportSource(true);
  }

  stopTransportAnimation();
  state.transport.offset = 0;
  updateTransportDisplay(0);

  if (state.transport.buffer) {
    ui.transportStatus.textContent = "Stopped.";
  }
}

function seekTransport(positionSeconds) {
  const duration = state.transport.duration;
  if (!duration) return;

  const target = Math.max(0, Math.min(duration, positionSeconds));
  const wasPlaying = state.transport.playing;
  if (wasPlaying) pauseTransport();
  state.transport.offset = target;
  updateTransportDisplay(target);
  if (wasPlaying) playTransport();
}

function updateTransportGain() {
  const value = transportGainValue();
  ui.transportVolumeValue.textContent = Math.round(value * 100) + "%";
  if (state.transport.gain) state.transport.gain.gain.value = value;
}

function transportPanLabel(value) {
  const amount = Math.round(Math.abs(value) * 100);
  if (amount === 0) return "C";
  return (value < 0 ? "L " : "R ") + amount;
}

function transportPanAriaText(value) {
  const amount = Math.round(Math.abs(value) * 100);
  if (amount === 0) return "Center";
  return (value < 0 ? "Left " : "Right ") + amount + " percent";
}

function updateTransportPan() {
  const value = transportPanValue();
  ui.transportPanValue.textContent = transportPanLabel(value);
  ui.transportPan.setAttribute("aria-valuetext", transportPanAriaText(value));
  if (state.transport.panner) state.transport.panner.pan.value = value;
}

async function refreshOutputDevices() {
  ui.outputDevice.innerHTML = "";

  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Default browser output";
  ui.outputDevice.appendChild(defaultOption);

  const context = ensureAudio();
  if (
    !navigator.mediaDevices?.enumerateDevices ||
    typeof context.setSinkId !== "function"
  ) {
    ui.outputDevice.disabled = true;
    ui.refreshOutputs.disabled = true;
    ui.outputDevice.title = "Browser does not expose selectable Web Audio output devices.";
    return;
  }

  try {
    const devices = (await navigator.mediaDevices.enumerateDevices())
      .filter((device) => device.kind === "audiooutput");

    for (const [index, device] of devices.entries()) {
      const option = document.createElement("option");
      option.value = device.deviceId;
      option.textContent = device.label || ("Audio output " + (index + 1));
      ui.outputDevice.appendChild(option);
    }

    ui.outputDevice.disabled = false;
    ui.refreshOutputs.disabled = false;
  } catch (error) {
    ui.outputDevice.disabled = true;
    ui.transportStatus.textContent = "Output discovery unavailable: " + error.message;
  }
}

async function applyOutputDevice() {
  const context = ensureAudio();
  if (typeof context.setSinkId !== "function") return;

  try {
    await context.setSinkId(ui.outputDevice.value || "");
    ui.transportStatus.textContent =
      "Browser output changed to " +
      (ui.outputDevice.selectedOptions[0]?.textContent || "default") + ".";
  } catch (error) {
    ui.transportStatus.textContent = "Could not change browser output: " + error.message;
  }
}

function nearestRoot(pack, midi) {
  if (!pack || pack.type !== "pitched" || pack.samples.length === 0) return null;
  let best = pack.samples[0];
  let distance = Math.abs(best.midi - midi);
  for (const sample of pack.samples) {
    const next = Math.abs(sample.midi - midi);
    if (next < distance) {
      best = sample;
      distance = next;
    }
  }
  return best;
}

async function loadRootBuffer(packId, rootMidi) {
  const key = packId + ":" + rootMidi;
  if (state.buffers.has(key)) return state.buffers.get(key);

  const context = ensureAudio();
  const promise = fetch(
    "/v1/audition/audio?pack=" + encodeURIComponent(packId) + "&note=" + encodeURIComponent(rootMidi),
    { cache: "force-cache" }
  )
    .then((response) => {
      if (!response.ok) throw new Error("Could not load root sample " + rootMidi);
      return response.arrayBuffer();
    })
    .then((bytes) => context.decodeAudioData(bytes));

  state.buffers.set(key, promise);
  return promise;
}

async function loadInstrumentBuffer(instrumentId, midi, velocity) {
  const velocityBucket = Math.max(1, Math.min(127, Number(velocity)));
  const key = "instrument:" + instrumentId + ":" + midi + ":" + velocityBucket;
  if (state.buffers.has(key)) return state.buffers.get(key);

  const context = ensureAudio();
  const promise = fetch(
    "/v1/audition/instrument?instrument=" + encodeURIComponent(instrumentId) +
    "&note=" + encodeURIComponent(midi) +
    "&velocity=" + encodeURIComponent(velocityBucket),
    { cache: "force-cache" }
  )
    .then((response) => {
      if (!response.ok) throw new Error("Could not render instrument note " + midi);
      return response.arrayBuffer();
    })
    .then((bytes) => context.decodeAudioData(bytes));

  state.buffers.set(key, promise);
  return promise;
}

async function loadTriggerBuffer(packId, trigger) {
  const key = packId + ":trigger:" + trigger;
  if (state.buffers.has(key)) return state.buffers.get(key);

  const context = ensureAudio();
  const promise = fetch(
    "/v1/audition/audio?pack=" + encodeURIComponent(packId) + "&trigger=" + encodeURIComponent(trigger),
    { cache: "force-cache" }
  )
    .then((response) => {
      if (!response.ok) throw new Error("Could not load trigger " + trigger);
      return response.arrayBuffer();
    })
    .then((bytes) => context.decodeAudioData(bytes));

  state.buffers.set(key, promise);
  return promise;
}

function releaseVoice(voice, fast = false) {
  if (!voice || voice.releasing) return;
  voice.releasing = true;
  const now = voice.context.currentTime;
  const release = fast ? 0.025 : 0.09;
  try {
    voice.gain.gain.cancelScheduledValues(now);
    voice.gain.gain.setValueAtTime(Math.max(0.0001, voice.gain.gain.value), now);
    voice.gain.gain.exponentialRampToValueAtTime(0.0001, now + release);
    voice.source.stop(now + release + 0.02);
  } catch {}
}

function cleanupVoice(id, voice) {
  if (state.voices.get(id) === voice) state.voices.delete(id);
  state.sustained.delete(voice);
  setVoiceCount();
  if (!hasActiveMidi(voice.midi)) setKeyActive(voice.midi, false);
}

function setKeyActive(midi, active) {
  document.querySelectorAll('[data-midi="' + midi + '"]')
    .forEach((el) => el.classList.toggle("active", active));
}

function hasActiveMidi(midi) {
  if ([...state.voices.values()].some((voice) => voice.midi === midi && !voice.releasing)) return true;
  return (state.liveMidiRefs.get(midi) || 0) > 0;
}

function isLiveSoundFont() {
  return (
    state.sourceMode === "instrument" &&
    state.selectedInstrument &&
    ["SF2", "SF3"].includes(state.selectedInstrument.format) &&
    state.instrumentPlaybackMode === "live" &&
    state.liveReady
  );
}

function registerLiveVoice(id, midi) {
  state.liveVoices.set(id, midi);
  state.liveMidiRefs.set(midi, (state.liveMidiRefs.get(midi) || 0) + 1);
  setKeyActive(midi, true);
  setVoiceCount();
}

function unregisterLiveVoice(id) {
  const midi = state.liveVoices.get(id);
  if (midi === undefined) return null;

  state.liveVoices.delete(id);
  const next = Math.max(0, (state.liveMidiRefs.get(midi) || 1) - 1);
  if (next === 0) state.liveMidiRefs.delete(midi);
  else state.liveMidiRefs.set(midi, next);

  if (!hasActiveMidi(midi)) setKeyActive(midi, false);
  setVoiceCount();
  return { midi, remaining: next };
}

async function liveNoteOn(midi, id) {
  if (state.liveVoices.has(id)) return;

  const alreadyActive = (state.liveMidiRefs.get(midi) || 0) > 0;
  registerLiveVoice(id, midi);

  if (!alreadyActive) {
    try {
      await queueLive("/v1/live/note-on", { note: midi, velocity: state.velocity });
      setMonitor("Live " + noteName(midi) + " · " + state.selectedInstrument.name + ".");
    } catch (error) {
      unregisterLiveVoice(id);
      setMonitor("Live engine error: " + error.message);
    }
  }
}

function liveNoteOff(id) {
  const result = unregisterLiveVoice(id);
  if (!result || result.remaining > 0) return;

  queueLive("/v1/live/note-off", { note: result.midi })
    .catch((error) => setMonitor("Live engine error: " + error.message));
}

async function noteOn(midi, id) {
  if (isLiveSoundFont()) {
    return liveNoteOn(midi, id);
  }

  if (state.voices.has(id)) return;

  try {
    const context = ensureAudio();
    let buffer;
    let playbackRate = 1;
    let gainValue;
    let description;

    if (state.sourceMode === "instrument") {
      if (!state.selectedInstrument) return;
      if (!state.selectedInstrument.playable) {
        setMonitor(state.selectedInstrument.format + " playback adapter is not enabled yet.");
        return;
      }
      buffer = await loadInstrumentBuffer(state.selectedInstrument.id, midi, state.velocity);
      gainValue = 0.92;
      description = "Playing " + noteName(midi) + " with " + state.selectedInstrument.name + ".";
    } else {
      if (!state.selected || state.selected.type !== "pitched") return;
      const root = nearestRoot(state.selected, midi);
      if (!root) return;
      buffer = await loadRootBuffer(state.selected.id, root.midi);
      playbackRate = Math.pow(2, (midi - root.midi) / 12);
      const velocity = state.velocity / 127;
      gainValue = Math.max(0.0001, Math.pow(velocity, 1.35) * 0.9);
      description = "Playing " + noteName(midi) + " from root " + noteName(root.midi) + ".";
    }

    if (state.voices.has(id)) return;

    const source = context.createBufferSource();
    const gain = context.createGain();
    source.buffer = buffer;
    source.playbackRate.value = playbackRate;
    gain.gain.value = gainValue;

    source.connect(gain);
    gain.connect(context.destination);

    const voice = { id, midi, source, gain, context, releasing: false };
    state.voices.set(id, voice);
    source.onended = () => cleanupVoice(id, voice);
    source.start();

    setKeyActive(midi, true);
    setVoiceCount();
    setMonitor(description);
  } catch (error) {
    setMonitor("Audio error: " + error.message);
  }
}

function noteOff(id) {
  if (state.liveVoices.has(id)) {
    liveNoteOff(id);
    return;
  }

  const voice = state.voices.get(id);
  if (!voice) return;
  if (currentSustain()) {
    state.sustained.add(voice);
    return;
  }
  releaseVoice(voice);
}

function releaseSustained() {
  if (currentSustain()) return;
  for (const voice of [...state.sustained]) releaseVoice(voice);
  state.sustained.clear();
}

function syncSustain() {
  if (isLiveSoundFont()) {
    queueLive("/v1/live/sustain", { enabled: currentSustain() })
      .catch((error) => setMonitor("Live sustain error: " + error.message));
  } else {
    releaseSustained();
  }
}

async function panicAll() {
  state.keyHeld.clear();
  stopAllVoices(true);

  if (state.liveReady) {
    try {
      await queueLive("/v1/live/all-notes-off", {});
    } catch (error) {
      setMonitor("Panic warning: " + error.message);
    }
  }

  state.liveVoices.clear();
  state.liveMidiRefs.clear();
  document.querySelectorAll(".key.active, .pad.active")
    .forEach((el) => el.classList.remove("active"));
  setVoiceCount();
  setMonitor("All notes off.");
}

async function triggerPad(trigger, element) {
  if (!state.selected || state.selected.type !== "soundpad") return;
  try {
    const context = ensureAudio();
    const buffer = await loadTriggerBuffer(state.selected.id, trigger);
    const source = context.createBufferSource();
    const gain = context.createGain();
    source.buffer = buffer;
    const velocityGain = Math.max(0.0001, Math.pow(state.velocity / 127, 1.35));
    const padGain = soundPadVolume(trigger);
    gain.gain.value = velocityGain * padGain;
    source.connect(gain);
    gain.connect(context.destination);
    element.classList.add("active");
    source.onended = () => element.classList.remove("active");
    source.start();
    setMonitor(
      "SoundPad: " + trigger + " · volume " + Math.round(soundPadVolume(trigger) * 100) + "%"
    );
  } catch (error) {
    setMonitor("Audio error: " + error.message);
  }
}

function buildPiano() {
  ui.keyboard.innerHTML = "";
  const low = 48;
  const high = 84;
  const whiteMidis = [];
  for (let midi = low; midi <= high; midi += 1) {
    if (WHITE_CLASSES.has(midi % 12)) whiteMidis.push(midi);
  }
  const whiteWidth = 100 / whiteMidis.length;
  const blackWidth = whiteWidth * 0.64;

  for (const midi of whiteMidis) {
    const key = document.createElement("button");
    key.type = "button";
    key.className = "key white";
    key.dataset.midi = String(midi);
    key.innerHTML =
      '<span class="hotkey-cap"></span>' +
      '<span class="note-label">' + noteName(midi) + "</span>";
    attachPointerKey(key, midi);
    ui.keyboard.appendChild(key);
  }

  for (let midi = low; midi <= high; midi += 1) {
    if (WHITE_CLASSES.has(midi % 12)) continue;
    const whiteBefore = whiteMidis.filter((n) => n < midi).length;
    const key = document.createElement("button");
    key.type = "button";
    key.className = "key black";
    key.dataset.midi = String(midi);
    key.style.width = blackWidth + "%";
    key.style.left = (whiteBefore * whiteWidth - blackWidth / 2) + "%";
    key.innerHTML =
      '<span class="hotkey-cap"></span>' +
      '<span class="note-label">' + noteName(midi) + "</span>";
    attachPointerKey(key, midi);
    ui.keyboard.appendChild(key);
  }

  updatePianoHotkeyCaps();
}

function displayBinding(binding) {
  if (!binding) return "—";
  if (binding === "Space") return "SPACE";
  if (binding === "Escape") return "ESC";
  if (binding === "Backspace") return "BKSP";
  if (binding === "Enter") return "ENTER";
  return String(binding).toUpperCase();
}

function updatePianoHotkeyCaps() {
  const current = hotkeys();
  const base = baseComputerMidi();
  const byMidi = new Map();

  for (let offset = 0; offset <= 12; offset += 1) {
    byMidi.set(base + offset, displayBinding(current["note" + offset]));
  }

  document.querySelectorAll(".key[data-midi]").forEach((element) => {
    const midi = Number(element.dataset.midi);
    const cap = element.querySelector(".hotkey-cap");
    if (!cap) return;

    const offset = midi - base;
    const bindable = offset >= 0 && offset <= 12;
    const action = bindable ? "note" + offset : "";
    const label = byMidi.get(midi) || "";

    element.classList.toggle("hotkey-bindable", bindable);
    if (action) element.dataset.hotkeyAction = action;
    else delete element.dataset.hotkeyAction;

    cap.textContent = label;
    cap.style.display = label ? "" : "none";
  });

  if (ui.hotkeyLegendNotes) {
    ui.hotkeyLegendNotes.textContent = Array.from({ length: 13 }, (_, index) =>
      displayBinding(current["note" + index])
    ).join(" ");
  }
  if (ui.hotkeyLegendOctave) {
    ui.hotkeyLegendOctave.textContent =
      displayBinding(current.octaveDown) + " / " + displayBinding(current.octaveUp);
  }
  if (ui.hotkeyLegendSustain) {
    ui.hotkeyLegendSustain.textContent = displayBinding(current.sustain);
  }
}


function pianoHotkeyActionForMidi(midi) {
  const offset = Number(midi) - baseComputerMidi();
  if (!Number.isInteger(offset) || offset < 0 || offset > 12) return null;
  return "note" + offset;
}

function clearPianoHotkeySelection() {
  document.querySelectorAll(".key.hotkey-selected").forEach((element) => {
    element.classList.remove("hotkey-selected");
  });
}

function beginPianoHotkeyEdit() {
  if (state.studio.hotkeyEditMode) return;
  panicAll();

  state.studio.hotkeyEditMode = true;
  state.studio.hotkeyEditTarget = "piano";
  state.studio.hotkeyEditSnapshot = {
    hotkeys: { ...hotkeys() },
    soundPadHotkeys: JSON.parse(JSON.stringify(state.studio.settings?.soundPadHotkeys || {}))
  };
  state.studio.pendingHotkeyAction = null;

  ui.keyboard.classList.add("piano-hotkey-editing");
  ui.pianoHotkeyPanel.classList.remove("hidden");
  ui.pianoHotkeyEdit.classList.add("active");
  ui.pianoHotkeyEdit.disabled = true;
  ui.pianoDeckMode.textContent = "HOTKEY EDIT";
  ui.pianoHotkeyStatus.textContent =
    "Click one of the 13 mapped piano keys, then press the keyboard key you want.";
  clearPianoHotkeySelection();
  updatePianoHotkeyCaps();
}

function finishPianoHotkeyEdit(message) {
  state.studio.pendingHotkeyAction = null;
  state.studio.hotkeyEditMode = false;
  state.studio.hotkeyEditTarget = null;
  state.studio.hotkeyEditSnapshot = null;

  ui.keyboard.classList.remove("piano-hotkey-editing");
  ui.pianoHotkeyPanel.classList.add("hidden");
  ui.pianoHotkeyEdit.classList.remove("active");
  ui.pianoHotkeyEdit.disabled = false;
  ui.pianoDeckMode.textContent = "LIVE INPUT";
  clearPianoHotkeySelection();
  updatePianoHotkeyCaps();
  if (message) setMonitor(message);
}

function selectPianoHotkeyAction(midi, element) {
  if (!state.studio.hotkeyEditMode || state.studio.hotkeyEditTarget !== "piano") return false;

  const action = pianoHotkeyActionForMidi(midi);
  if (!action) {
    state.studio.pendingHotkeyAction = null;
    clearPianoHotkeySelection();
    ui.pianoHotkeyStatus.textContent =
      noteName(midi) + " is outside the current 13-key computer mapping. Use octave controls to move the mapped range.";
    return true;
  }

  state.studio.pendingHotkeyAction = action;
  clearPianoHotkeySelection();
  element.classList.add("hotkey-selected");

  const current = hotkeys();
  ui.pianoHotkeyStatus.textContent =
    noteName(midi) +
    " · current " +
    displayBinding(current[action]) +
    " · press a new keyboard key.";
  return true;
}

async function savePianoHotkeys() {
  try {
    await saveStudioSettings();
    finishPianoHotkeyEdit("Piano hotkeys saved.");
  } catch (error) {
    ui.pianoHotkeyStatus.textContent = "Save failed: " + error.message;
  }
}

function cancelPianoHotkeyEdit() {
  if (!state.studio.hotkeyEditMode) return;

  if (state.studio.hotkeyEditSnapshot) {
    state.studio.settings = {
      ...(state.studio.settings || {}),
      hotkeys: { ...state.studio.hotkeyEditSnapshot.hotkeys },
      soundPadHotkeys: JSON.parse(JSON.stringify(state.studio.hotkeyEditSnapshot.soundPadHotkeys || {}))
    };
  }

  renderHotkeyEditor();
  updateSoundPadHotkeyCaps();
  finishPianoHotkeyEdit("Piano hotkey changes cancelled.");
}

function clearSoundPadHotkeySelection() {
  ui.soundPads.querySelectorAll(".pad.hotkey-selected").forEach((element) => {
    element.classList.remove("hotkey-selected");
  });
}

function updateSoundPadHotkeyCaps(pack = state.selected) {
  if (!pack || pack.type !== "soundpad") return;
  const bindings = soundPadHotkeys(pack);
  ui.soundPads.querySelectorAll(".pad[data-trigger]").forEach((card) => {
    const trigger = card.dataset.trigger;
    const cap = card.querySelector(".pad-hotkey");
    const hit = card.querySelector(".pad-hit");
    if (!cap) return;
    const binding = bindings[trigger] || "";
    cap.textContent = displayBinding(binding);
    hit?.setAttribute(
      "aria-label",
      trigger + (binding ? " " + displayBinding(binding) : "")
    );
  });
}

function beginSoundPadHotkeyEdit() {
  if (state.studio.hotkeyEditMode || state.selected?.type !== "soundpad") return;
  panicAll();

  state.studio.hotkeyEditMode = true;
  state.studio.hotkeyEditTarget = "soundpad";
  state.studio.hotkeyEditSnapshot = {
    hotkeys: { ...hotkeys() },
    soundPadHotkeys: JSON.parse(JSON.stringify(state.studio.settings?.soundPadHotkeys || {}))
  };
  state.studio.pendingHotkeyAction = null;

  ui.soundPads.classList.add("soundpad-hotkey-editing");
  ui.soundPadHotkeyPanel.classList.remove("hidden");
  ui.soundPadHotkeyEdit.classList.add("active");
  ui.soundPadHotkeyEdit.disabled = true;
  ui.soundPadDeckMode.textContent = "SOUNDPAD HOTKEY EDIT";
  ui.soundPadHotkeyStatus.textContent =
    "Click a pad, then press the keyboard key you want.";
  clearSoundPadHotkeySelection();
  updateSoundPadHotkeyCaps();
}

function finishSoundPadHotkeyEdit(message) {
  state.studio.pendingHotkeyAction = null;
  state.studio.hotkeyEditMode = false;
  state.studio.hotkeyEditTarget = null;
  state.studio.hotkeyEditSnapshot = null;

  ui.soundPads.classList.remove("soundpad-hotkey-editing");
  ui.soundPadHotkeyPanel.classList.add("hidden");
  ui.soundPadHotkeyEdit.classList.remove("active");
  ui.soundPadHotkeyEdit.disabled = false;
  ui.soundPadDeckMode.textContent = "SOUNDPAD LIVE INPUT";
  clearSoundPadHotkeySelection();
  updateSoundPadHotkeyCaps();
  if (message) setMonitor(message);
}

function selectSoundPadHotkeyTrigger(trigger, element) {
  if (!state.studio.hotkeyEditMode || state.studio.hotkeyEditTarget !== "soundpad") {
    return false;
  }

  state.studio.pendingHotkeyAction = "soundpad:" + trigger;
  clearSoundPadHotkeySelection();
  element.classList.add("hotkey-selected");

  const current = soundPadHotkeys();
  ui.soundPadHotkeyStatus.textContent =
    trigger +
    " · current " +
    displayBinding(current[trigger]) +
    " · press a new keyboard key.";
  return true;
}

async function saveSoundPadHotkeys() {
  try {
    await saveStudioSettings();
    finishSoundPadHotkeyEdit("SoundPad hotkeys saved.");
  } catch (error) {
    ui.soundPadHotkeyStatus.textContent = "Save failed: " + error.message;
  }
}

function cancelSoundPadHotkeyEdit() {
  if (!state.studio.hotkeyEditMode || state.studio.hotkeyEditTarget !== "soundpad") return;

  if (state.studio.hotkeyEditSnapshot) {
    state.studio.settings = {
      ...(state.studio.settings || {}),
      hotkeys: { ...state.studio.hotkeyEditSnapshot.hotkeys },
      soundPadHotkeys: JSON.parse(JSON.stringify(state.studio.hotkeyEditSnapshot.soundPadHotkeys || {}))
    };
  }

  renderHotkeyEditor();
  updateSoundPadHotkeyCaps();
  finishSoundPadHotkeyEdit("SoundPad hotkey changes cancelled.");
}

function cancelActiveHotkeyEdit() {
  if (!state.studio.hotkeyEditMode) return;
  if (state.studio.hotkeyEditTarget === "soundpad") cancelSoundPadHotkeyEdit();
  else cancelPianoHotkeyEdit();
}

function attachPointerKey(element, midi) {
  let activePointerId = null;

  element.addEventListener("pointerdown", (event) => {
    event.preventDefault();

    if (selectPianoHotkeyAction(midi, element)) {
      activePointerId = null;
      return;
    }

    activePointerId = event.pointerId;
    element.setPointerCapture?.(event.pointerId);
    noteOn(midi, "pointer:" + event.pointerId + ":" + midi);
  });

  const release = (event) => {
    if (activePointerId === null) return;
    event.preventDefault();
    noteOff("pointer:" + activePointerId + ":" + midi);
    activePointerId = null;
  };

  element.addEventListener("pointerup", release);
  element.addEventListener("pointercancel", release);
  element.addEventListener("lostpointercapture", release);
}

function buildPads(pack) {
  ui.soundPads.innerHTML = "";
  const bindings = soundPadHotkeys(pack);
  const volumes = soundPadVolumes(pack);

  for (const trigger of pack.triggers) {
    const card = document.createElement("div");
    card.className = "pad";
    card.dataset.trigger = trigger;

    const hit = document.createElement("button");
    hit.type = "button";
    hit.className = "pad-hit";
    hit.innerHTML =
      '<span class="pad-name">' + escapeHtml(trigger) + '</span>' +
      '<span class="pad-hotkey">' + escapeHtml(displayBinding(bindings[trigger])) + '</span>';
    hit.setAttribute(
      "aria-label",
      trigger + (bindings[trigger] ? " " + displayBinding(bindings[trigger]) : "")
    );
    hit.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      if (selectSoundPadHotkeyTrigger(trigger, card)) return;
      triggerPad(trigger, card);
    });

    const mixer = document.createElement("div");
    mixer.className = "pad-mixer";

    const volumeLabel = document.createElement("span");
    volumeLabel.className = "pad-volume-label";
    volumeLabel.textContent = "VOL";

    const volume = document.createElement("input");
    volume.type = "range";
    volume.className = "pad-volume";
    volume.min = "0";
    volume.max = "100";
    volume.step = "1";
    volume.value = String(Math.round((volumes[trigger] ?? 1) * 100));
    volume.setAttribute("aria-label", trigger + " volume");

    const output = document.createElement("output");
    output.className = "pad-volume-value";
    output.textContent = volume.value + "%";

    volume.addEventListener("pointerdown", (event) => event.stopPropagation());
    volume.addEventListener("input", () => {
      const next = setSoundPadVolumeLocal(pack, trigger, Number(volume.value) / 100);
      output.textContent = Math.round(next * 100) + "%";
    });
    volume.addEventListener("change", async () => {
      try {
        await persistSoundPadMix(pack);
        setMonitor(
          "SoundPad mix: " + trigger + " = " +
          Math.round(soundPadVolume(trigger, pack) * 100) + "%"
        );
      } catch (error) {
        setMonitor("SoundPad mix save failed: " + error.message);
      }
    });

    mixer.append(volumeLabel, volume, output);
    card.append(hit, mixer);
    ui.soundPads.appendChild(card);
  }

  updateSoundPadHotkeyCaps(pack);
  updateSoundPadVolumeUi(pack);
  updateSoundPadMixLockUi(pack);
}

function describePack(pack) {
  const license = pack.license && pack.license !== "unspecified" ? pack.license : "license unspecified";
  const count = pack.type === "pitched"
    ? pack.samples.length + " root samples"
    : pack.triggers.length + " triggers";
  return count + " · " + license;
}

async function stopLiveEngine() {
  if (!state.liveReady && state.instrumentPlaybackMode !== "live") return;

  try {
    await queueLive("/v1/live/stop", {});
  } catch {}

  state.liveReady = false;
  state.liveVoices.clear();
  state.liveMidiRefs.clear();
  setVoiceCount();
}

async function selectSound(id) {
  if (state.studio.hotkeyEditMode) cancelActiveHotkeyEdit();
  stopAllVoices(true);
  await stopLiveEngine();

  state.sourceMode = "sound";
  state.instrumentPlaybackMode = "buffered";
  state.selectedInstrument = null;
  state.selected = state.sounds.find((item) => item.id === id) || null;
  state.buffers.clear();

  if (!state.selected) {
    ui.selectedName.textContent = "No sound selected";
    ui.selectedDetails.textContent = "Copy sound add-ons into the portable sounds folder.";
    ui.soundMeta.textContent = "";
    return;
  }

  const pack = state.selected;
  ui.selectedName.textContent = pack.name;
  ui.selectedDetails.textContent = describePack(pack);
  ui.soundMeta.textContent = [
    pack.author ? "Author: " + pack.author : null,
    pack.description || null
  ].filter(Boolean).join(" · ");

  if (pack.type === "pitched") {
    ui.pianoView.classList.remove("hidden");
    ui.soundPadView.classList.add("hidden");
    setMonitor("Ready. Play with mouse, computer keyboard, or MIDI.");
  } else {
    ui.pianoView.classList.add("hidden");
    ui.soundPadView.classList.remove("hidden");
    buildPads(pack);
    setMonitor("Ready. Click a pad or use its displayed hotkey.");
  }
}

function stopAllVoices(fast = false) {
  for (const voice of state.voices.values()) releaseVoice(voice, fast);
  state.sustained.clear();
}

function baseComputerMidi() {
  return 60 + state.octaveShift * 12;
}

function updateOctave() {
  state.octaveShift = Math.max(-2, Math.min(2, state.octaveShift));
  ui.octaveValue.value = state.octaveShift > 0 ? "+" + state.octaveShift : String(state.octaveShift);
  ui.octaveValue.textContent = ui.octaveValue.value;
  if (ui.hudOctave) ui.hudOctave.textContent = ui.octaveValue.value;
  updatePianoHotkeyCaps();
}

function populateInstruments() {
  ui.instrumentSelect.innerHTML = "";
  if (state.instruments.length === 0) {
    const option = document.createElement("option");
    option.textContent = "No instrument add-ons installed";
    option.value = "";
    ui.instrumentSelect.appendChild(option);
    ui.instrumentSelect.disabled = true;
    return;
  }

  ui.instrumentSelect.disabled = false;
  for (const instrument of state.instruments) {
    const option = document.createElement("option");
    option.value = instrument.id;
    option.textContent = instrument.id + (instrument.playable ? "" : " · adapter pending");
    ui.instrumentSelect.appendChild(option);
  }
  updateInstrumentMeta();
}

function livePlaybackAvailableFor(item) {
  if (!item || !["SF2", "SF3"].includes(item.format)) return false;
  return Boolean(state.capabilities?.livePlayback?.soundfont);
}

async function selectInstrument(id) {
  if (state.studio.hotkeyEditMode) cancelActiveHotkeyEdit();
  stopAllVoices(true);
  await stopLiveEngine();

  state.sourceMode = "instrument";
  state.selected = null;
  state.selectedInstrument = state.instruments.find((x) => x.id === id) || null;
  state.instrumentPlaybackMode = "buffered";
  state.buffers.clear();

  const item = state.selectedInstrument;
  if (!item) return;

  ui.pianoView.classList.remove("hidden");
  ui.soundPadView.classList.add("hidden");

  if (!item.playable) {
    updateInstrumentMeta();
    ui.selectedName.textContent = item.name;
    ui.selectedDetails.textContent = item.id + " · adapter pending";
    setMonitor(item.format + " is installed but its playback adapter is not enabled yet.");
    return;
  }

  if (livePlaybackAvailableFor(item)) {
    setMonitor("Starting persistent " + item.format + " live engine…");
    try {
      const live = await post("/v1/live/select", { instrument: item.id });
      state.liveReady = live.state === "ready";
      state.instrumentPlaybackMode = state.liveReady ? "live" : "buffered";
      if (state.liveReady) {
        setMonitor("Live engine ready · " + (live.session?.audioDriver || "audio") + ".");
        syncSustain();
      }
    } catch (error) {
      state.liveReady = false;
      state.instrumentPlaybackMode = "buffered";
      setMonitor("Live engine unavailable; using rendered audition fallback. " + error.message);
    }
  }

  updateInstrumentMeta();
  ui.selectedName.textContent = item.name;
  ui.selectedDetails.textContent =
    item.id + " · " +
    (state.instrumentPlaybackMode === "live"
      ? "persistent live"
      : "buffered audition");
}

function updateInstrumentMeta() {
  const item = state.instruments.find((x) => x.id === ui.instrumentSelect.value);
  if (!item) return;

  let playback = "Discovered; playback adapter not enabled yet";
  if (item.playable && state.selectedInstrument?.id === item.id && state.instrumentPlaybackMode === "live") {
    playback = "Persistent low-latency live backend";
  } else if (item.playable && ["SF2", "SF3"].includes(item.format) && livePlaybackAvailableFor(item)) {
    playback = "Persistent live backend available";
  } else if (item.playable) {
    playback = "Buffered audition adapter ready";
  }

  ui.instrumentMeta.textContent = [
    item.name,
    item.license && item.license !== "unspecified" ? item.license : null,
    playback
  ].filter(Boolean).join(" · ");
}

function midiInputLabel(input) {
  return input.name || input.manufacturer || input.id || "MIDI input";
}

function attachMidiInputs() {
  if (!state.midiAccess) return;
  const inputs = [...state.midiAccess.inputs.values()];

  for (const input of inputs) {
    input.onmidimessage = (event) => handleMidiMessage(input, event);
  }

  if (inputs.length === 0) {
    ui.midiStatus.textContent = "MIDI enabled; no input device detected.";
  } else {
    ui.midiStatus.textContent = inputs.length + " input" + (inputs.length === 1 ? "" : "s") +
      ": " + inputs.map(midiInputLabel).join(", ");
  }
}

function handleMidiMessage(input, event) {
  const [status, data1 = 0, data2 = 0] = event.data;
  const command = status & 0xf0;
  const channel = status & 0x0f;
  const id = "midi:" + input.id + ":" + channel + ":" + data1;

  if (command === 0x90 && data2 > 0) {
    noteOn(data1, id);
    return;
  }

  if (command === 0x80 || (command === 0x90 && data2 === 0)) {
    noteOff(id);
    return;
  }

  if (command === 0xb0 && data1 === 64) {
    state.midiSustain = data2 >= 64;
    syncSustain();
    return;
  }

  if (command === 0xb0 && (data1 === 120 || data1 === 123)) {
    panicAll();
  }
}

async function enableMidiInput() {
  if (!navigator.requestMIDIAccess) {
    ui.midiStatus.textContent = "Web MIDI is not supported by this browser.";
    ui.enableMidi.disabled = true;
    return;
  }

  try {
    ui.enableMidi.disabled = true;
    ui.midiStatus.textContent = "Requesting MIDI access…";
    state.midiAccess = await navigator.requestMIDIAccess({ sysex: false });
    state.midiAccess.onstatechange = attachMidiInputs;
    attachMidiInputs();
    ui.enableMidi.textContent = "MIDI Input Enabled";
  } catch (error) {
    ui.enableMidi.disabled = false;
    ui.midiStatus.textContent = "MIDI access failed: " + error.message;
  }
}


function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function setDirty(value) {
  state.studio.dirty = Boolean(value);
  if (!ui.dirtyState) return;
  ui.dirtyState.textContent = state.studio.dirty ? "Unsaved" : "Saved";
  ui.dirtyState.classList.toggle("warn", state.studio.dirty);
  ui.dirtyState.classList.toggle("ok", !state.studio.dirty);
}

function isPlayTabActive() {
  return Boolean(
    [...ui.mainTabs].find(
      (button) => button.classList.contains("active") && button.dataset.tab === "play"
    )
  );
}

function activateMainTab(name) {
  const leavingPlay = isPlayTabActive() && name !== "play";

  if (name !== "play" && state.studio.hotkeyEditMode) {
    cancelActiveHotkeyEdit();
  }

  if (leavingPlay) {
    state.spaceSustain = false;
    syncSustain();
    if (state.beatLane6.running) stopBeatLaneGame(true);
    panicAll();
  }

  ui.mainTabs.forEach((button) => {
    button.classList.toggle("active", button.dataset.tab === name);
  });
  ui.tabPages.forEach((page) => {
    page.classList.toggle("active", page.dataset.page === name);
  });

}

function activateComposeMode(mode) {
  state.studio.composeMode = mode;
  ui.composeTabs.forEach((button) => {
    button.classList.toggle("active", button.dataset.composeMode === mode);
  });
  ui.composeViews.forEach((view) => {
    view.classList.toggle("active", view.dataset.composeView === mode);
  });
  if (mode === "form") renderFormEditor();
  if (mode === "node") renderNodeCanvas();
}

function defaultProjectMarkdown(title = "Untitled") {
  const fence = String.fromCharCode(96).repeat(3);
  return [
    "# " + title,
    "",
    fence + "notescript",
    "tempo: 90",
    "time: 4/4",
    "key: C major",
    "",
    "track Piano",
    "sound: piano",
    "volume: 0.7",
    "pan: 0",
    "velocity: 96",
    "bar 1: C4 q | E4 q | G4 h",
    "bar 2: A3 q | C4 q | E4 h",
    fence,
    ""
  ].join("\n");
}

function renderProjectList() {
  ui.projectList.innerHTML = "";
  if (state.studio.projects.length === 0) {
    ui.projectList.innerHTML = '<div class="empty-state">No projects yet.</div>';
    return;
  }

  for (const project of state.studio.projects) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "project-card";
    if (project === state.studio.currentProject) button.classList.add("active");
    button.innerHTML =
      "<strong>" + escapeHtml(project) + "</strong>" +
      "<span>NoteScript Markdown project</span>";
    button.addEventListener("click", async () => {
      await openStudioProject(project);
    });
    ui.projectList.appendChild(button);
  }
}

function syncProjectSelects() {
  const selected = state.studio.currentProject || ui.projectSelect.value;
  const gameSelected = state.beatLane6.project || ui.beatLaneProject.value || selected;
  ui.projectSelect.innerHTML = "";
  ui.beatLaneProject.innerHTML = "";

  if (state.studio.projects.length === 0) {
    for (const select of [ui.projectSelect, ui.beatLaneProject]) {
      const option = document.createElement("option");
      option.value = "";
      option.textContent = "No projects found";
      select.appendChild(option);
      select.disabled = true;
    }
    ui.transportPlay.disabled = true;
    ui.transportPause.disabled = true;
    ui.transportStop.disabled = true;
    ui.beatLaneStart.disabled = true;
    return;
  }

  ui.projectSelect.disabled = false;
  ui.beatLaneProject.disabled = false;
  ui.transportPlay.disabled = false;
  ui.transportPause.disabled = false;
  ui.transportStop.disabled = false;
  ui.beatLaneStart.disabled = false;

  for (const project of state.studio.projects) {
    for (const select of [ui.projectSelect, ui.beatLaneProject]) {
      const option = document.createElement("option");
      option.value = project;
      option.textContent = project;
      select.appendChild(option);
    }
  }

  if (selected && state.studio.projects.includes(selected)) {
    ui.projectSelect.value = selected;
  }
  if (gameSelected && state.studio.projects.includes(gameSelected)) {
    ui.beatLaneProject.value = gameSelected;
  }
}

async function refreshProjects() {
  const data = await api("/v1/projects");
  state.studio.projects = data.projects || [];
  syncProjectSelects();
  renderProjectList();
}

function renderDiagnostics(analysis) {
  ui.diagnostics.innerHTML = "";

  if (!analysis) {
    ui.diagnosticBadge.textContent = "NOT ANALYZED";
    ui.diagnosticBadge.classList.add("muted");
    return;
  }

  if (analysis.valid) {
    ui.diagnosticBadge.textContent = "VALID";
    ui.diagnosticBadge.classList.remove("muted");
    const item = document.createElement("div");
    item.className = "diagnostic-item diagnostic-ok";
    const tracks = analysis.song?.tracks?.length || 0;
    item.textContent = "Valid NoteScript · " + tracks + " track" + (tracks === 1 ? "" : "s");
    ui.diagnostics.appendChild(item);
    return;
  }

  ui.diagnosticBadge.textContent = "ERROR";
  ui.diagnosticBadge.classList.remove("muted");

  for (const diagnostic of analysis.diagnostics || []) {
    const item = document.createElement("div");
    item.className = "diagnostic-item";
    item.textContent =
      (diagnostic.line ? "Line " + diagnostic.line + " · " : "") +
      diagnostic.message;
    ui.diagnostics.appendChild(item);
  }
}

async function analyzeCurrentMarkdown(updateDerivedViews = true) {
  const markdown = ui.markdownEditor.value;
  const analysis = await post("/v1/analyze", { markdown });
  state.studio.analysis = analysis;
  renderDiagnostics(analysis);

  if (analysis.valid) renderComposeSourceToolbar();
  if (updateDerivedViews && analysis.valid) {
    renderNodeCanvas();
    if (state.studio.composeMode === "form") renderFormEditor();
  }
  return analysis;
}

async function openStudioProject(name) {
  if (!name) return;
  if (state.studio.dirty && state.studio.currentProject && state.studio.currentProject !== name) {
    const proceed = window.confirm("Discard unsaved changes and open " + name + "?");
    if (!proceed) return;
  }

  const data = await api("/v1/project?project=" + encodeURIComponent(name));
  state.studio.currentProject = data.name;
  state.studio.markdown = data.markdown;
  state.studio.analysis = {
    valid: data.valid,
    diagnostics: data.diagnostics,
    song: data.song,
    timeline: data.timeline
  };

  ui.markdownEditor.value = data.markdown;
  ui.projectNameInput.value = data.name;
  ui.projectFileMeta.textContent =
    (data.valid ? "Valid" : "Needs attention") +
    " · " + (data.song?.tracks?.length || 0) + " track(s)";

  if (state.studio.projects.includes(data.name)) ui.projectSelect.value = data.name;

  setDirty(false);
  renderProjectList();
  renderDiagnostics(state.studio.analysis);
  renderFormEditor();
  renderNodeCanvas();
  renderComposeSourceToolbar();
  const defaultOutput = data.name.replace(/\.md$/i, "");
  ui.renderOutputName.value = defaultOutput;
  activateMainTab("compose");
}

function createNewProject() {
  const base = "Untitled";
  let suffix = 1;
  let filename = base + ".md";
  while (state.studio.projects.includes(filename)) {
    suffix += 1;
    filename = base + "-" + suffix + ".md";
  }

  state.studio.currentProject = filename;
  state.studio.markdown = defaultProjectMarkdown(filename.replace(/\.md$/i, ""));
  state.studio.analysis = null;
  ui.projectNameInput.value = filename;
  ui.markdownEditor.value = state.studio.markdown;
  ui.projectFileMeta.textContent = "New unsaved project.";
  setDirty(true);
  renderProjectList();
  renderDiagnostics(null);
  activateMainTab("compose");
  activateComposeMode("text");
}

async function saveCurrentProject() {
  const name = (ui.projectNameInput.value || state.studio.currentProject || "Untitled.md").trim();
  const markdown = ui.markdownEditor.value;
  const analysis = await analyzeCurrentMarkdown(false);
  if (!analysis.valid) {
    ui.projectFileMeta.textContent = "Cannot save until diagnostics are valid.";
    return false;
  }

  const saved = await post("/v1/projects", { name, markdown });
  state.studio.currentProject = saved.name;
  state.studio.markdown = markdown;
  ui.projectNameInput.value = saved.name;
  setDirty(false);
  await refreshProjects();
  ui.projectSelect.value = saved.name;
  ui.projectFileMeta.textContent =
    "Saved · " + saved.tracks + " track(s) · title " + saved.title;
  return true;
}

async function renameCurrentProject() {
  if (!state.studio.currentProject || !state.studio.projects.includes(state.studio.currentProject)) {
    return saveCurrentProject();
  }

  const next = ui.projectNameInput.value.trim();
  if (!next) return;

  const result = await post("/v1/projects/rename", {
    project: state.studio.currentProject,
    name: next
  });
  state.studio.currentProject = result.name;
  ui.projectNameInput.value = result.name;
  await refreshProjects();
  ui.projectFileMeta.textContent = "Renamed to " + result.name + ".";
}

async function deleteCurrentProject() {
  const project = state.studio.currentProject;
  if (!project || !state.studio.projects.includes(project)) return;
  if (!window.confirm("Delete " + project + "?")) return;

  await post("/v1/projects/delete", { project });
  state.studio.currentProject = null;
  state.studio.markdown = "";
  state.studio.analysis = null;
  ui.markdownEditor.value = "";
  ui.projectNameInput.value = "Untitled.md";
  renderDiagnostics(null);
  setDirty(false);
  await refreshProjects();

  if (state.studio.projects.length > 0) await openStudioProject(state.studio.projects[0]);
  else createNewProject();
}


function durationToken(value) {
  const known = new Map([
    [4, "w"],
    [3, "h."],
    [2, "h"],
    [1.5, "q."],
    [1, "q"],
    [0.75, "e."],
    [0.5, "e"],
    [0.375, "s."],
    [0.25, "s"]
  ]);
  for (const [duration, token] of known) {
    if (Math.abs(Number(value) - duration) < 1e-9) return token;
  }
  return "q";
}

function eventText(event) {
  const duration = durationToken(event.durationQuarterNotes);
  const velocity = event.velocity && event.velocity !== 96 ? " @" + event.velocity : "";
  if (event.kind === "rest") return "R " + duration + velocity;
  if (event.kind === "trigger") return "@" + event.trigger + " " + duration + velocity;
  if (event.kind === "chord") return "[" + event.noteNames.join(" ") + "] " + duration + velocity;
  return event.noteNames[0] + " " + duration + velocity;
}

function sourceLabel(track) {
  return track.sound ? "sound:" + track.sound : "instrument:" + track.instrument;
}

function trackUsesTriggers(track) {
  return Boolean(track?.bars?.some((bar) =>
    bar.events?.some((event) => event.kind === "trigger")
  ));
}

function sourceTypeForTrack(track) {
  if (trackUsesTriggers(track)) return "soundpad";
  if (track?.instrument) return "instrument";
  return "soundpiano";
}

function sourceTypesForTrack(track) {
  return trackUsesTriggers(track)
    ? [{ value: "soundpad", label: "SoundPad" }]
    : [
      { value: "soundpiano", label: "SoundPiano" },
      { value: "instrument", label: "Instrument" }
    ];
}

function fillTrackSourceTypeSelect(select, track, selected = null) {
  if (!select) return;
  const choices = sourceTypesForTrack(track);
  select.innerHTML = "";
  for (const choice of choices) {
    const option = document.createElement("option");
    option.value = choice.value;
    option.textContent = choice.label;
    select.appendChild(option);
  }
  const next = selected && choices.some((choice) => choice.value === selected)
    ? selected
    : sourceTypeForTrack(track);
  select.value = next;
}

function sourceItemsForType(type) {
  if (type === "soundpad") {
    return soundPadPacks().map((sound) => ({
      value: "sound:" + sound.id,
      label: sound.name,
      disabled: false
    }));
  }
  if (type === "instrument") {
    return state.instruments.map((instrument) => ({
      value: "instrument:" + instrument.id,
      label: instrument.name + (instrument.playable ? "" : " (adapter unavailable)"),
      disabled: !instrument.playable
    }));
  }
  return soundPianoPacks().map((sound) => ({
    value: "sound:" + sound.id,
    label: sound.name,
    disabled: false
  }));
}

function fillSourceItemSelect(select, type, selectedValue = "") {
  if (!select) return;
  const choices = sourceItemsForType(type);
  select.innerHTML = "";
  for (const choice of choices) {
    const option = document.createElement("option");
    option.value = choice.value;
    option.textContent = choice.label;
    option.disabled = Boolean(choice.disabled);
    select.appendChild(option);
  }
  if (selectedValue && choices.some((choice) => choice.value === selectedValue && !choice.disabled)) {
    select.value = selectedValue;
  } else {
    const firstPlayable = choices.find((choice) => !choice.disabled);
    if (firstPlayable) select.value = firstPlayable.value;
  }
}

function voiceChoicesForTrack(track, includeOriginal = false) {
  const choices = [];
  if (includeOriginal) {
    choices.push({ value: "original", label: "Original Project" });
  }

  if (trackUsesTriggers(track)) {
    for (const sound of soundPadPacks()) {
      choices.push({
        value: "sound:" + sound.id,
        label: "SoundPad · " + sound.name
      });
    }
    return choices;
  }

  for (const sound of soundPianoPacks()) {
    choices.push({
      value: "sound:" + sound.id,
      label: "SoundPiano · " + sound.name
    });
  }
  for (const instrument of state.instruments) {
    choices.push({
      value: "instrument:" + instrument.id,
      label: "Instrument · " + instrument.name + (instrument.playable ? "" : " (adapter unavailable)"),
      disabled: !instrument.playable
    });
  }
  return choices;
}

function voiceValueForTrack(track) {
  return track.sound
    ? "sound:" + track.sound
    : track.instrument
      ? "instrument:" + track.instrument
      : "";
}

function sourceTypeOptionsHtml(track, selectedType = null) {
  const choices = sourceTypesForTrack(track);
  const selected = selectedType || sourceTypeForTrack(track);
  return choices.map((choice) =>
    '<option value="' + escapeHtml(choice.value) + '"' +
    (choice.value === selected ? " selected" : "") +
    ">" + escapeHtml(choice.label) + "</option>"
  ).join("");
}

function sourceItemOptionsHtml(type, selectedValue = "") {
  const choices = sourceItemsForType(type);
  return choices.map((choice) =>
    '<option value="' + escapeHtml(choice.value) + '"' +
    (choice.value === selectedValue ? " selected" : "") +
    (choice.disabled ? " disabled" : "") +
    ">" + escapeHtml(choice.label) + "</option>"
  ).join("");
}

function voiceOptionsHtml(track, selectedValue) {
  const choices = voiceChoicesForTrack(track);
  if (
    selectedValue &&
    !choices.some((choice) => choice.value === selectedValue)
  ) {
    choices.unshift({ value: selectedValue, label: "Current · " + selectedValue });
  }
  return choices.map((choice) =>
    '<option value="' + escapeHtml(choice.value) + '"' +
    (choice.value === selectedValue ? " selected" : "") +
    (choice.disabled ? " disabled" : "") +
    ">" + escapeHtml(choice.label) + "</option>"
  ).join("");
}

function fillVoiceSelect(select, track = null, options = {}) {
  if (!select) return;
  const includeOriginal = options.includeOriginal === true;
  const selected = options.selected || "";
  const choices = track
    ? voiceChoicesForTrack(track, includeOriginal)
    : [
      ...(includeOriginal ? [{ value: "original", label: "Original Project" }] : []),
      ...soundPianoPacks().map((sound) => ({
        value: "sound:" + sound.id,
        label: "SoundPiano · " + sound.name
      })),
      ...state.instruments.map((instrument) => ({
        value: "instrument:" + instrument.id,
        label: "Instrument · " + instrument.name + (instrument.playable ? "" : " (adapter unavailable)"),
        disabled: !instrument.playable
      }))
    ];

  select.innerHTML = "";
  for (const choice of choices) {
    const option = document.createElement("option");
    option.value = choice.value;
    option.textContent = choice.label;
    option.disabled = Boolean(choice.disabled);
    select.appendChild(option);
  }
  if (selected && choices.some((choice) => choice.value === selected && !choice.disabled)) {
    select.value = selected;
  }
}

function parseVoiceValue(value) {
  const raw = String(value || "");
  if (!raw || raw === "original") return null;
  const separator = raw.indexOf(":");
  if (separator < 1) return null;
  return {
    type: raw.slice(0, separator),
    id: raw.slice(separator + 1)
  };
}

async function updateTrackSettingsInMarkdown(trackIndex, settings = {}) {
  const analysis = state.studio.analysis;
  const track = analysis?.song?.tracks?.[trackIndex];
  if (!track) return false;

  const voice = settings.voiceValue === undefined
    ? undefined
    : parseVoiceValue(settings.voiceValue);
  if (settings.voiceValue !== undefined && !voice) return false;

  const hasVolume = settings.volume !== undefined;
  const volume = hasVolume
    ? Math.max(0, Math.min(1, Number(settings.volume)))
    : null;
  if (hasVolume && !Number.isFinite(volume)) return false;

  const lines = ui.markdownEditor.value.split(/\r?\n/);
  const start = Number(track.line) - 1;
  const nextTrack = analysis.song.tracks[trackIndex + 1];
  const end = nextTrack ? Number(nextTrack.line) - 1 : lines.length;
  const block = lines.slice(start, end);

  if (voice) {
    const replacement = voice.type + ": " + voice.id;
    const sourceIndex = block.findIndex((line, index) =>
      index > 0 && /^\s*(sound|instrument)\s*:/i.test(line)
    );
    if (sourceIndex >= 0) block[sourceIndex] = replacement;
    else block.splice(1, 0, replacement);
  }

  if (hasVolume) {
    const value = Number(volume.toFixed(2));
    const replacement = "volume: " + value;
    const volumeIndex = block.findIndex((line, index) =>
      index > 0 && /^\s*volume\s*:/i.test(line)
    );
    if (volumeIndex >= 0) {
      block[volumeIndex] = replacement;
    } else {
      const sourceIndex = block.findIndex((line, index) =>
        index > 0 && /^\s*(sound|instrument)\s*:/i.test(line)
      );
      block.splice(sourceIndex >= 0 ? sourceIndex + 1 : 1, 0, replacement);
    }
  }

  lines.splice(start, end - start, ...block);
  ui.markdownEditor.value = lines.join("\n");
  state.studio.markdown = ui.markdownEditor.value;
  setDirty(true);

  const nextAnalysis = await analyzeCurrentMarkdown(true);
  if (nextAnalysis.valid) {
    renderComposeSourceToolbar();
    return true;
  }
  return false;
}

async function updateTrackSourceInMarkdown(trackIndex, voiceValue) {
  return updateTrackSettingsInMarkdown(trackIndex, { voiceValue });
}

async function updateTrackVolumeInMarkdown(trackIndex, volume) {
  return updateTrackSettingsInMarkdown(trackIndex, { volume });
}

function renderComposeSourceToolbar() {
  const song = state.studio.analysis?.song;
  if (!song?.tracks?.length) {
    ui.composeTrackSelect.innerHTML = '<option value="">No tracks</option>';
    ui.composeSourceType.innerHTML = '<option value="">No source</option>';
    ui.composeVoiceSelect.innerHTML = '<option value="">No instrument / sound</option>';
    ui.composeTrackVolume.value = "1";
    ui.composeTrackVolumeValue.textContent = "100%";
    ui.composeTrackVolume.disabled = true;
    ui.composeApplyVoice.disabled = true;
    return;
  }

  const previousTrack = Number(ui.composeTrackSelect.value || 0);
  ui.composeTrackSelect.innerHTML = "";
  song.tracks.forEach((track, index) => {
    const option = document.createElement("option");
    option.value = String(index);
    option.textContent = track.name;
    ui.composeTrackSelect.appendChild(option);
  });
  const trackIndex = Math.max(0, Math.min(song.tracks.length - 1, previousTrack));
  ui.composeTrackSelect.value = String(trackIndex);
  const track = song.tracks[trackIndex];
  fillTrackSourceTypeSelect(ui.composeSourceType, track);
  fillSourceItemSelect(
    ui.composeVoiceSelect,
    ui.composeSourceType.value,
    voiceValueForTrack(track)
  );
  ui.composeTrackVolume.value = String(track.volume);
  ui.composeTrackVolumeValue.textContent = Math.round(track.volume * 100) + "%";
  ui.composeTrackVolume.disabled = false;
  ui.composeApplyVoice.disabled = false;
}

function buildTrackForm(track, index) {
  const wrapper = document.createElement("div");
  wrapper.className = "track-form-row";
  wrapper.dataset.trackIndex = String(index);

  const sourceValue = voiceValueForTrack(track);
  const sourceType = sourceTypeForTrack(track);
  const barsText = track.bars.map((bar) =>
    "bar " + bar.number + ": " + bar.events.map(eventText).join(" | ")
  ).join("\n");

  wrapper.innerHTML =
    '<label>Name<input class="text-input form-track-name" type="text" value="' + escapeHtml(track.name) + '"></label>' +
    '<label>Source Type<select class="form-track-source-type">' +
    sourceTypeOptionsHtml(track, sourceType) +
    '</select></label>' +
    '<label>Instrument / Sound<select class="form-track-voice">' +
    sourceItemOptionsHtml(sourceType, sourceValue) +
    '</select></label>' +
    '<label>Volume<input class="text-input form-track-volume" type="number" min="0" max="1" step="0.05" value="' + track.volume + '"></label>' +
    '<label>Pan<input class="text-input form-track-pan" type="number" min="-1" max="1" step="0.1" value="' + track.pan + '"></label>' +
    '<label>Velocity<input class="text-input form-track-velocity" type="number" min="1" max="127" value="' + track.velocity + '"></label>' +
    '<button class="small-button form-remove-track" type="button">Remove</button>' +
    '<label class="track-bars-field">Bars<textarea class="markdown-editor form-track-bars" rows="4">' +
    escapeHtml(barsText) +
    '</textarea></label>';

  const sourceTypeSelect = wrapper.querySelector(".form-track-source-type");
  const voiceSelect = wrapper.querySelector(".form-track-voice");
  sourceTypeSelect.addEventListener("change", () => {
    fillSourceItemSelect(voiceSelect, sourceTypeSelect.value);
    applyFormToMarkdown();
  });

  wrapper.querySelectorAll("input, select, textarea").forEach((element) => {
    element.addEventListener("input", applyFormToMarkdown);
    if (element !== sourceTypeSelect) {
      element.addEventListener("change", applyFormToMarkdown);
    }
  });
  wrapper.querySelector(".form-remove-track").addEventListener("click", () => {
    wrapper.remove();
    applyFormToMarkdown();
  });
  return wrapper;
}

function renderFormEditor() {
  const analysis = state.studio.analysis;
  if (!analysis?.valid || !analysis.song) {
    ui.formTracks.innerHTML = '<div class="empty-state">Fix Text diagnostics before using Form mode.</div>';
    return;
  }

  const song = analysis.song;
  ui.formTitle.value = song.title;
  ui.formTempo.value = song.config.tempo;
  ui.formTime.value = song.config.timeNumerator + "/" + song.config.timeDenominator;
  ui.formKey.value = song.config.keyTonic + " " + song.config.keyMode;
  ui.formTracks.innerHTML = "";

  song.tracks.forEach((track, index) => {
    ui.formTracks.appendChild(buildTrackForm(track, index));
  });
}

function replaceSongCore(markdown, title, bodyLines) {
  const fence = String.fromCharCode(96).repeat(3);
  const lines = String(markdown || "").split(/\r?\n/);
  let titleDone = false;
  let start = -1;
  let end = -1;

  for (let i = 0; i < lines.length; i += 1) {
    if (!titleDone && /^#\s+/.test(lines[i])) {
      lines[i] = "# " + title;
      titleDone = true;
    }
    if (start < 0 && lines[i].trim().toLowerCase() === fence + "notescript") {
      start = i;
      continue;
    }
    if (start >= 0 && end < 0 && i > start && lines[i].trim() === fence) {
      end = i;
      break;
    }
  }

  if (!titleDone) lines.unshift("# " + title, "");
  if (start >= 0 && end > start) {
    lines.splice(start + 1, end - start - 1, ...bodyLines);
    return lines.join("\n");
  }

  return [
    "# " + title,
    "",
    fence + "notescript",
    ...bodyLines,
    fence,
    ""
  ].join("\n");
}

function formBodyLines() {
  const lines = [
    "tempo: " + (ui.formTempo.value || "90"),
    "time: " + (ui.formTime.value || "4/4"),
    "key: " + (ui.formKey.value || "C major"),
    ""
  ];

  const rows = [...ui.formTracks.querySelectorAll(".track-form-row")];
  for (const [index, row] of rows.entries()) {
    const name = row.querySelector(".form-track-name").value.trim() || ("Track " + (index + 1));
    const sourceType = row.querySelector(".form-track-source-type").value;
    const voice = parseVoiceValue(row.querySelector(".form-track-voice").value) ||
      (sourceType === "instrument"
        ? {
          type: "instrument",
          id: state.instruments.find((item) => item.playable)?.id || "SFZ/basic-sfz"
        }
        : {
          type: "sound",
          id: sourceType === "soundpad"
            ? (soundPadPacks()[0]?.id || "soundpad")
            : (soundPianoPacks()[0]?.id || "piano")
        });

    lines.push("track " + name);
    lines.push(voice.type + ": " + voice.id);
    lines.push("volume: " + (row.querySelector(".form-track-volume").value || "1"));
    lines.push("pan: " + (row.querySelector(".form-track-pan").value || "0"));
    lines.push("velocity: " + (row.querySelector(".form-track-velocity").value || "96"));

    const bars = row.querySelector(".form-track-bars").value
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
    if (bars.length === 0) lines.push("bar 1: R w");
    else lines.push(...bars);
    lines.push("");
  }

  return lines;
}

let formAnalyzeTimer = 0;
function applyFormToMarkdown() {
  const title = ui.formTitle.value.trim() || "Untitled";
  const next = replaceSongCore(ui.markdownEditor.value, title, formBodyLines());
  ui.markdownEditor.value = next;
  state.studio.markdown = next;
  setDirty(true);
  clearTimeout(formAnalyzeTimer);
  formAnalyzeTimer = setTimeout(() => analyzeCurrentMarkdown(false), 180);
}

function addFormTrack() {
  const fallback = {
    name: "Track " + (ui.formTracks.querySelectorAll(".track-form-row").length + 1),
    sound: soundPianoPacks()[0]?.id || "piano",
    instrument: null,
    volume: 0.8,
    pan: 0,
    velocity: 96,
    bars: [{
      number: 1,
      events: [{
        kind: "rest",
        durationQuarterNotes: 4,
        velocity: 96
      }]
    }]
  };
  ui.formTracks.appendChild(buildTrackForm(fallback, ui.formTracks.children.length));
  applyFormToMarkdown();
}


function clearNodeInspector() {
  state.studio.selectedNode = null;
  ui.nodeInspectorKind.textContent = "NONE";
  ui.nodeInspectorKind.classList.add("muted");
  ui.nodeInspectorEmpty.classList.remove("hidden");
  ui.nodeInspectorEditor.classList.add("hidden");
  ui.nodeInspectorValue.value = "";
  document.querySelectorAll(".node-card.selected").forEach((card) => {
    card.classList.remove("selected");
  });
}

function selectNodeForInspector(selection, card) {
  state.studio.selectedNode = selection;
  document.querySelectorAll(".node-card.selected").forEach((item) => {
    item.classList.remove("selected");
  });
  card?.classList.add("selected");

  ui.nodeInspectorKind.textContent = selection.kind.toUpperCase();
  ui.nodeInspectorKind.classList.remove("muted");
  ui.nodeInspectorEmpty.classList.add("hidden");
  ui.nodeInspectorEditor.classList.remove("hidden");
  ui.nodeInspectorValue.value = selection.value || "";
  ui.nodeInspectorValue.disabled = selection.kind === "track";
  ui.nodeInspectorApply.disabled = selection.kind === "track";
}

function selectedNodeBar() {
  const selection = state.studio.selectedNode;
  const song = state.studio.analysis?.song;
  if (!selection || !song) return null;
  const track = song.tracks?.[selection.trackIndex];
  const bar = track?.bars?.[selection.barIndex];
  return { selection, track, bar };
}

async function applyNodeInspector() {
  const resolved = selectedNodeBar();
  if (!resolved?.bar) return;

  const { selection, bar } = resolved;
  const lines = ui.markdownEditor.value.split(/\r?\n/);
  const lineIndex = Number(bar.line) - 1;
  if (lineIndex < 0 || lineIndex >= lines.length) return;

  let body;
  if (selection.kind === "bar") {
    body = ui.nodeInspectorValue.value.trim();
  } else if (selection.kind === "event") {
    const events = bar.events.map(eventText);
    events[selection.eventIndex] = ui.nodeInspectorValue.value.trim();
    body = events.join(" | ");
  } else {
    return;
  }

  lines[lineIndex] = "bar " + bar.number + ": " + body;
  ui.markdownEditor.value = lines.join("\n");
  state.studio.markdown = ui.markdownEditor.value;
  setDirty(true);

  const analysis = await analyzeCurrentMarkdown(true);
  if (analysis.valid) {
    ui.nodeInspectorEmpty.textContent = "Node updated in Markdown.";
    clearNodeInspector();
  }
}

function openSelectedNodeInForm() {
  const selection = state.studio.selectedNode;
  if (!selection) return;
  activateMainTab("compose");
  activateComposeMode("form");
  const target = ui.formTracks.querySelectorAll(".track-form-row")[selection.trackIndex];
  target?.scrollIntoView({ behavior: "smooth", block: "center" });
  target?.querySelector(".form-track-name")?.focus();
}

function renderNodeCanvas() {
  const analysis = state.studio.analysis;
  ui.nodeCanvas.innerHTML = "";
  clearNodeInspector();

  if (!analysis?.valid || !analysis.song) {
    ui.nodeCanvas.innerHTML = '<div class="empty-state">Fix Text diagnostics before using Node mode.</div>';
    return;
  }

  for (const [trackIndex, track] of analysis.song.tracks.entries()) {
    const group = document.createElement("div");
    group.className = "node-flow-track";

    const trackCard = document.createElement("button");
    trackCard.type = "button";
    trackCard.className = "node-card";
    trackCard.innerHTML =
      '<div class="node-card-header">TRACK · ' + escapeHtml(track.name) + '</div>' +
      '<div class="node-card-body">' +
      escapeHtml(sourceLabel(track)) +
      '<br>volume ' + track.volume +
      ' · pan ' + track.pan +
      ' · velocity ' + track.velocity +
      '</div>';
    trackCard.addEventListener("click", () => {
      selectNodeForInspector({
        kind: "track",
        trackIndex,
        value: sourceLabel(track)
      }, trackCard);
    });
    group.appendChild(trackCard);

    for (const [barIndex, bar] of track.bars.entries()) {
      const arrow = document.createElement("span");
      arrow.className = "node-flow-arrow";
      arrow.textContent = "→";
      group.appendChild(arrow);

      const barCard = document.createElement("button");
      barCard.type = "button";
      barCard.className = "node-card";
      barCard.innerHTML =
        '<div class="node-card-header">BAR ' + bar.number + '</div>' +
        '<div class="node-card-body">' +
        escapeHtml(bar.events.map(eventText).join(" | ") || "empty") +
        '</div>';
      barCard.addEventListener("click", () => {
        selectNodeForInspector({
          kind: "bar",
          trackIndex,
          barIndex,
          value: bar.events.map(eventText).join(" | ")
        }, barCard);
      });
      group.appendChild(barCard);

      for (const [eventIndex, event] of bar.events.entries()) {
        const eventArrow = document.createElement("span");
        eventArrow.className = "node-flow-arrow";
        eventArrow.textContent = "→";
        group.appendChild(eventArrow);

        const eventCard = document.createElement("button");
        eventCard.type = "button";
        eventCard.className = "node-card node-event-card";
        eventCard.innerHTML =
          '<div class="node-card-header">' + escapeHtml(event.kind.toUpperCase()) + '</div>' +
          '<div class="node-card-body">' + escapeHtml(eventText(event)) + '</div>';
        eventCard.addEventListener("click", () => {
          selectNodeForInspector({
            kind: "event",
            trackIndex,
            barIndex,
            eventIndex,
            value: eventText(event)
          }, eventCard);
        });
        group.appendChild(eventCard);
      }
    }

    ui.nodeCanvas.appendChild(group);
  }
}

function nextBarNumberForLastTrack() {
  const song = state.studio.analysis?.song;
  if (!song?.tracks?.length) return 1;
  const bars = song.tracks.at(-1).bars || [];
  return bars.length ? Math.max(...bars.map((bar) => bar.number)) + 1 : 1;
}

function appendToNoteScriptBody(linesToAdd) {
  const fence = String.fromCharCode(96).repeat(3);
  const lines = ui.markdownEditor.value.split(/\r?\n/);
  let end = -1;
  for (let i = lines.length - 1; i >= 0; i -= 1) {
    if (lines[i].trim() === fence) {
      end = i;
      break;
    }
  }
  if (end < 0) return;
  lines.splice(end, 0, ...linesToAdd);
  ui.markdownEditor.value = lines.join("\n");
  state.studio.markdown = ui.markdownEditor.value;
  setDirty(true);
  analyzeCurrentMarkdown(true);
}

function addNodeKind(kind) {
  const bar = nextBarNumberForLastTrack();

  if (kind === "track") {
    appendToNoteScriptBody([
      "",
      "track New Track",
      "sound: " + (state.sounds[0]?.id || "piano"),
      "volume: 0.8",
      "pan: 0",
      "velocity: 96",
      "bar 1: R w"
    ]);
    return;
  }

  if (!state.studio.analysis?.song?.tracks?.length) {
    addNodeKind("track");
    return;
  }

  const event = {
    bar: "bar " + bar + ": R w",
    note: "bar " + bar + ": C4 q",
    chord: "bar " + bar + ": [C4 E4 G4] h",
    rest: "bar " + bar + ": R w",
    trigger: "bar " + bar + ": @kick q"
  }[kind] || ("bar " + bar + ": R w");

  appendToNoteScriptBody([event]);
}


function advancedTransportPosition() {
  const transport = state.advancedTransport;
  if (!transport.playing) return transport.offset;
  const context = ensureAudio();
  return Math.max(
    0,
    Math.min(
      transport.duration,
      transport.offset + (context.currentTime - transport.startedAt)
    )
  );
}

function updateAdvancedTransportDisplay(position = advancedTransportPosition()) {
  const transport = state.advancedTransport;
  const duration = transport.duration || 0;
  const safe = Math.max(0, Math.min(duration || 0, Number(position) || 0));
  ui.advancedPosition.textContent = formatTime(safe);
  ui.advancedDuration.textContent = formatTime(duration);
  ui.advancedSeek.value = duration > 0
    ? String(Math.round((safe / duration) * 1000))
    : "0";
}

function stopAdvancedAnimation() {
  if (state.advancedTransport.raf) {
    cancelAnimationFrame(state.advancedTransport.raf);
  }
  state.advancedTransport.raf = 0;
}

function advancedAnimationTick() {
  if (!state.advancedTransport.playing) {
    stopAdvancedAnimation();
    updateAdvancedTransportDisplay();
    return;
  }
  updateAdvancedTransportDisplay();
  state.advancedTransport.raf = requestAnimationFrame(advancedAnimationTick);
}

function disconnectAdvancedNodes() {
  const transport = state.advancedTransport;
  for (const source of transport.sources) {
    try { source.disconnect(); } catch {}
  }
  for (const gain of transport.gains) {
    try { gain.disconnect(); } catch {}
  }
  try { transport.masterGain?.disconnect(); } catch {}
  transport.sources = [];
  transport.gains = [];
  transport.masterGain = null;
}

function stopAdvancedSources(manual = true) {
  const transport = state.advancedTransport;
  for (const source of transport.sources) {
    try {
      source.__manualStop = manual;
      source.stop();
    } catch {}
  }
  disconnectAdvancedNodes();
}

function invalidateAdvancedTransport(message = "Project changed. Reload stems before playback.") {
  const transport = state.advancedTransport;
  if (transport.playing) {
    transport.playing = false;
    stopAdvancedSources(true);
  } else {
    stopAdvancedSources(true);
  }
  stopAdvancedAnimation();
  transport.project = null;
  transport.buffers = [];
  transport.offset = 0;
  transport.duration = 0;
  updateAdvancedTransportDisplay(0);
  if (ui.advancedStatus) ui.advancedStatus.textContent = message;
}

async function analyzeTracksWorkspace(markdown, fileName = null) {
  const analysis = await post("/v1/analyze", { markdown });
  state.tracksWorkspace.markdown = String(markdown || "");
  state.tracksWorkspace.analysis = analysis;
  if (fileName) state.tracksWorkspace.fileName = fileName;

  invalidateAdvancedTransport(
    analysis.valid
      ? "Tracks workspace changed. Reload stems before playback."
      : "Loaded .md has errors. Fix the source file and load it again."
  );
  renderTrackTimeline();

  if (analysis.valid) {
    const count = analysis.song?.tracks?.length || 0;
    ui.advancedProjectLabel.textContent =
      (state.tracksWorkspace.fileName || "Tracks Workspace.md") +
      " · " + count + " track" + (count === 1 ? "" : "s");
    ui.advancedStatus.textContent =
      "Tracks ready. Choose each Instrument / Sound, then Play or Reload Stems.";
  } else {
    const first = analysis.diagnostics?.[0];
    ui.advancedProjectLabel.textContent =
      state.tracksWorkspace.fileName || "Invalid .md";
    ui.advancedStatus.textContent =
      "Track workspace error" +
      (first?.line ? " at line " + first.line : "") +
      ": " + (first?.message || "Invalid NoteScript Markdown.");
  }

  return analysis;
}

async function loadTracksWorkspaceFile(file) {
  if (!file) return false;
  const markdown = await file.text();
  state.tracksWorkspace.fileName = file.name || "Imported Tracks.md";
  state.tracksWorkspace.dirty = true;
  state.advancedTransport.muted.clear();
  state.advancedTransport.volumes.clear();
  ui.tracksOutputName.value = String(state.tracksWorkspace.fileName)
    .replace(/\.md$/i, "");
  await analyzeTracksWorkspace(markdown, state.tracksWorkspace.fileName);
  if (state.tracksWorkspace.analysis?.valid) {
    ui.advancedStatus.textContent =
      "Imported " + state.tracksWorkspace.fileName +
      " into the independent Tracks workspace.";
  }
  return Boolean(state.tracksWorkspace.analysis?.valid);
}

function addTrackBlockToMarkdown(markdown, trackName, voiceValue) {
  const voice = parseVoiceValue(voiceValue) ||
    { type: "sound", id: soundPianoPacks()[0]?.id || "piano" };
  const fence = String.fromCharCode(96).repeat(3);
  const lines = String(markdown || "").split(/\r?\n/);
  let start = -1;
  let end = -1;

  for (let index = 0; index < lines.length; index += 1) {
    if (start < 0 && lines[index].trim().toLowerCase() === fence + "notescript") {
      start = index;
      continue;
    }
    if (start >= 0 && index > start && lines[index].trim() === fence) {
      end = index;
      break;
    }
  }

  if (start < 0 || end < 0) {
    throw new Error("Tracks workspace requires a fenced notescript block.");
  }

  const block = [
    "",
    "track " + trackName,
    voice.type + ": " + voice.id,
    "volume: 0.80",
    "velocity: 96",
    "bar 1: R w"
  ];
  lines.splice(end, 0, ...block);
  return lines.join("\n");
}

async function addTrackToTracksWorkspace() {
  const workspace = state.tracksWorkspace;
  if (!workspace.analysis?.valid) {
    ui.advancedStatus.textContent = "Load a valid .md file before adding a track.";
    return;
  }

  const nextIndex = (workspace.analysis.song?.tracks?.length || 0) + 1;
  const firstVoice = soundPianoPacks()[0]
    ? "sound:" + soundPianoPacks()[0].id
    : state.instruments.find((item) => item.playable)
      ? "instrument:" + state.instruments.find((item) => item.playable).id
      : "";

  if (!firstVoice) {
    ui.advancedStatus.textContent = "No playable SoundPiano or Instrument is available.";
    return;
  }

  try {
    const next = addTrackBlockToMarkdown(
      workspace.markdown,
      "Track " + nextIndex,
      firstVoice
    );
    workspace.dirty = true;
    await analyzeTracksWorkspace(
      next,
      workspace.fileName || "Tracks Workspace.md"
    );
    ui.advancedStatus.textContent =
      "Added Track " + nextIndex + " to the Tracks workspace.";
  } catch (error) {
    ui.advancedStatus.textContent = "Add Track error: " + error.message;
  }
}

async function updateTracksWorkspaceSettings(trackIndex, settings = {}) {
  const workspace = state.tracksWorkspace;
  const analysis = workspace.analysis;
  const track = analysis?.song?.tracks?.[trackIndex];
  if (!analysis?.valid || !track) return false;

  const voice = settings.voiceValue === undefined
    ? undefined
    : parseVoiceValue(settings.voiceValue);
  if (settings.voiceValue !== undefined && !voice) return false;

  const hasVolume = settings.volume !== undefined;
  const volume = hasVolume
    ? Math.max(0, Math.min(1, Number(settings.volume)))
    : null;
  if (hasVolume && !Number.isFinite(volume)) return false;

  const lines = workspace.markdown.split(/\r?\n/);
  const start = Number(track.line) - 1;
  const nextTrack = analysis.song.tracks[trackIndex + 1];
  const end = nextTrack ? Number(nextTrack.line) - 1 : lines.length;
  const block = lines.slice(start, end);

  if (voice) {
    const replacement = voice.type + ": " + voice.id;
    const sourceIndex = block.findIndex((line, index) =>
      index > 0 && /^\s*(sound|instrument)\s*:/i.test(line)
    );
    if (sourceIndex >= 0) block[sourceIndex] = replacement;
    else block.splice(1, 0, replacement);
  }

  if (hasVolume) {
    const value = Number(volume.toFixed(2));
    const replacement = "volume: " + value;
    const volumeIndex = block.findIndex((line, index) =>
      index > 0 && /^\s*volume\s*:/i.test(line)
    );
    if (volumeIndex >= 0) {
      block[volumeIndex] = replacement;
    } else {
      const sourceIndex = block.findIndex((line, index) =>
        index > 0 && /^\s*(sound|instrument)\s*:/i.test(line)
      );
      block.splice(sourceIndex >= 0 ? sourceIndex + 1 : 1, 0, replacement);
    }
  }

  lines.splice(start, end - start, ...block);
  workspace.dirty = true;
  await analyzeTracksWorkspace(
    lines.join("\n"),
    workspace.fileName || "Tracks Workspace.md"
  );
  return Boolean(state.tracksWorkspace.analysis?.valid);
}

async function updateTracksWorkspaceSource(trackIndex, voiceValue) {
  return updateTracksWorkspaceSettings(trackIndex, { voiceValue });
}

async function updateTracksWorkspaceVolume(trackIndex, volume) {
  const changed = await updateTracksWorkspaceSettings(trackIndex, { volume });
  if (changed) state.advancedTransport.volumes.delete(Number(trackIndex));
  return changed;
}

async function fetchAdvancedStem(trackIndex) {
  const workspace = state.tracksWorkspace;
  const response = await fetch("/v1/tracks/track-audio", {
    method: "POST",
    cache: "no-store",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      markdown: workspace.markdown,
      fileName: workspace.fileName || "Tracks Workspace.md",
      track: trackIndex
    })
  });

  if (!response.ok) {
    let message = response.statusText;
    try {
      const data = await response.json();
      message = data.message || data.error || message;
    } catch {}
    throw new Error(message);
  }

  const bytes = await response.arrayBuffer();
  return ensureAudio().decodeAudioData(bytes.slice(0));
}

async function loadAdvancedTransport(force = false) {
  const workspace = state.tracksWorkspace;
  const analysis = workspace.analysis;
  if (!analysis?.valid || !analysis.song?.tracks?.length) {
    ui.advancedStatus.textContent =
      "Load a valid .md file in Tracks before mix playback.";
    return false;
  }

  const project = workspace.fileName || "Tracks Workspace.md";
  const trackCount = analysis.song.tracks.length;
  const transport = state.advancedTransport;

  if (
    !force &&
    transport.project === project &&
    transport.buffers.length === trackCount
  ) {
    return true;
  }

  const token = ++transport.loadToken;
  transport.playing = false;
  stopAdvancedSources(true);
  stopAdvancedAnimation();
  transport.offset = 0;
  ui.advancedStatus.textContent =
    "Rendering " + trackCount + " synchronized track stem(s)...";
  ui.advancedPlay.disabled = true;
  ui.advancedReload.disabled = true;

  try {
    const buffers = await Promise.all(
      Array.from({ length: trackCount }, (_, index) => fetchAdvancedStem(index))
    );

    if (token !== transport.loadToken) return false;

    transport.project = project;
    transport.buffers = buffers;
    transport.duration = buffers.reduce((max, buffer) => Math.max(max, buffer.duration), 0);
    transport.offset = 0;

    ui.advancedProjectLabel.textContent =
      project + " · " + trackCount + " track" + (trackCount === 1 ? "" : "s");
    ui.advancedStatus.textContent =
      "Stems ready. Mute/Unmute or change each Track Instrument / Sound independently.";
    updateAdvancedTransportDisplay(0);
    renderTrackMuteStates();
    return true;
  } catch (error) {
    transport.project = null;
    transport.buffers = [];
    transport.duration = 0;
    ui.advancedStatus.textContent = "Tracks playback error: " + error.message;
    updateAdvancedTransportDisplay(0);
    return false;
  } finally {
    ui.advancedPlay.disabled = false;
    ui.advancedReload.disabled = false;
  }
}
function createAdvancedSources() {
  const transport = state.advancedTransport;
  const context = ensureAudio();
  const masterGain = context.createGain();
  masterGain.gain.value = 0.85;
  masterGain.connect(context.destination);

  transport.sources = [];
  transport.gains = [];
  transport.masterGain = masterGain;

  for (const [index, buffer] of transport.buffers.entries()) {
    const source = context.createBufferSource();
    const gain = context.createGain();
    source.buffer = buffer;
    const trackVolume = transport.volumes.has(index)
      ? transport.volumes.get(index)
      : 1;
    gain.gain.value = transport.muted.has(index) ? 0 : trackVolume;
    source.connect(gain);
    gain.connect(masterGain);
    transport.sources.push(source);
    transport.gains.push(gain);
  }

  const leader = transport.sources[0];
  if (leader) {
    leader.onended = () => {
      if (leader.__manualStop) return;
      if (state.advancedTransport.sources[0] !== leader) return;
      state.advancedTransport.playing = false;
      state.advancedTransport.offset = 0;
      disconnectAdvancedNodes();
      stopAdvancedAnimation();
      updateAdvancedTransportDisplay(0);
      ui.advancedStatus.textContent = "Mix playback ended.";
    };
  }

  return transport.sources;
}

async function playAdvancedTransport() {
  if (!state.advancedTransport.buffers.length) {
    const loaded = await loadAdvancedTransport(false);
    if (!loaded) return;
  }

  const context = ensureAudio();
  if (context.state === "suspended") await context.resume();
  const transport = state.advancedTransport;
  if (transport.playing) return;

  if (transport.offset >= transport.duration) transport.offset = 0;
  const offset = Math.max(0, Math.min(transport.duration, transport.offset));
  const sources = createAdvancedSources();

  transport.startedAt = context.currentTime;
  transport.playing = true;
  for (const source of sources) source.start(0, offset);

  ui.advancedStatus.textContent =
    "Playing multi-track mix · " +
    transport.muted.size +
    " muted";
  stopAdvancedAnimation();
  transport.raf = requestAnimationFrame(advancedAnimationTick);
}

function pauseAdvancedTransport() {
  const transport = state.advancedTransport;
  if (!transport.playing) return;
  const position = advancedTransportPosition();
  transport.playing = false;
  transport.offset = position;
  stopAdvancedSources(true);
  stopAdvancedAnimation();
  updateAdvancedTransportDisplay(position);
  ui.advancedStatus.textContent = "Paused at " + formatTime(position) + ".";
}

function stopAdvancedTransport() {
  const transport = state.advancedTransport;
  transport.playing = false;
  stopAdvancedSources(true);
  stopAdvancedAnimation();
  transport.offset = 0;
  updateAdvancedTransportDisplay(0);
  if (transport.buffers.length) ui.advancedStatus.textContent = "Stopped.";
}

function seekAdvancedTransport(positionSeconds) {
  const transport = state.advancedTransport;
  if (!transport.duration) return;
  const target = Math.max(0, Math.min(transport.duration, positionSeconds));
  const wasPlaying = transport.playing;
  if (wasPlaying) pauseAdvancedTransport();
  transport.offset = target;
  updateAdvancedTransportDisplay(target);
  if (wasPlaying) playAdvancedTransport();
}

function setAdvancedTrackMuted(trackIndex, muted) {
  const index = Number(trackIndex);
  const transport = state.advancedTransport;
  if (muted) transport.muted.add(index);
  else transport.muted.delete(index);

  const gain = transport.gains[index];
  if (gain) {
    const context = ensureAudio();
    gain.gain.cancelScheduledValues(context.currentTime);
    const trackVolume = transport.volumes.has(index)
      ? transport.volumes.get(index)
      : 1;
    gain.gain.setValueAtTime(muted ? 0 : trackVolume, context.currentTime);
  }

  renderTrackMuteStates();
  const name = state.tracksWorkspace.analysis?.song?.tracks?.[index]?.name || ("Track " + (index + 1));
  ui.advancedStatus.textContent =
    (muted ? "Muted " : "Unmuted ") + name +
    (transport.playing ? " during playback." : ".");
}

function toggleAdvancedTrackMute(trackIndex) {
  const index = Number(trackIndex);
  setAdvancedTrackMuted(index, !state.advancedTransport.muted.has(index));
}

function setAdvancedTrackVolume(trackIndex, value) {
  const index = Number(trackIndex);
  const transport = state.advancedTransport;
  const targetVolume = Math.max(0, Math.min(1, Number(value) || 0));
  const sourceVolume =
    state.tracksWorkspace.analysis?.song?.tracks?.[index]?.volume ?? 1;
  const multiplier = sourceVolume > 0
    ? targetVolume / sourceVolume
    : targetVolume;
  transport.volumes.set(index, multiplier);

  const gain = transport.gains[index];
  if (gain && !transport.muted.has(index)) {
    const context = ensureAudio();
    gain.gain.cancelScheduledValues(context.currentTime);
    gain.gain.setValueAtTime(multiplier, context.currentTime);
  }

  const row = ui.trackTimeline.querySelector(
    '.timeline-track[data-track-index="' + index + '"]'
  );
  const label = row?.querySelector(".track-volume-value");
  if (label) label.textContent = Math.round(targetVolume * 100) + "%";

  const name =
    state.tracksWorkspace.analysis?.song?.tracks?.[index]?.name ||
    ("Track " + (index + 1));
  ui.advancedStatus.textContent =
    "Track volume preview · " + name + " · " + Math.round(targetVolume * 100) + "%";
}

function renderTrackMuteStates() {
  document.querySelectorAll(".timeline-track[data-track-index]").forEach((row) => {
    const index = Number(row.dataset.trackIndex);
    const muted = state.advancedTransport.muted.has(index);
    row.classList.toggle("muted", muted);
    const button = row.querySelector(".track-mute");
    if (button) {
      button.classList.toggle("active", muted);
      button.setAttribute("aria-pressed", muted ? "true" : "false");
      button.textContent = muted ? "UNMUTE" : "MUTE";
    }
  });
}

function qPerBar(song) {
  return song.config.timeNumerator * (4 / song.config.timeDenominator);
}

function renderTrackTimeline() {
  const analysis = state.tracksWorkspace.analysis;
  ui.trackTimeline.innerHTML = "";

  if (!analysis?.valid || !analysis.timeline) {
    ui.trackTimeline.innerHTML = '<div class="empty-state">Load a valid .md file to build the independent multi-track view.</div>';
    return;
  }

  const timeline = analysis.timeline;
  const perBar = qPerBar(analysis.song);
  const barWidth = 72;
  const maxBars = Math.max(1, Math.ceil(timeline.endQuarter / perBar));

  const ruler = document.createElement("div");
  ruler.className = "timeline-ruler";
  for (let bar = 1; bar <= maxBars; bar += 1) {
    const marker = document.createElement("span");
    marker.textContent = "Bar " + bar;
    ruler.appendChild(marker);
  }
  ui.trackTimeline.appendChild(ruler);

  for (const [trackIndex, track] of timeline.tracks.entries()) {
    const row = document.createElement("div");
    row.className = "timeline-track";
    row.dataset.trackIndex = String(trackIndex);

    const head = document.createElement("div");
    head.className = "timeline-track-head";

    const title = document.createElement("div");
    title.className = "timeline-track-title";
    title.innerHTML =
      "<strong>" + escapeHtml(track.name) + "</strong>" +
      "<span>" + escapeHtml(sourceLabel(track)) + "</span>" +
      "<span>source vol " + track.volume + " · pan " + track.pan + "</span>";

    const controls = document.createElement("div");
    controls.className = "timeline-track-controls";

    const songTrack = analysis.song.tracks[trackIndex];

    const sourceTypeWrap = document.createElement("label");
    sourceTypeWrap.className = "track-source-type-control";
    const sourceTypeLabel = document.createElement("span");
    sourceTypeLabel.textContent = "SOURCE TYPE";
    const sourceTypeSelect = document.createElement("select");
    sourceTypeSelect.className = "track-source-type-select";
    fillTrackSourceTypeSelect(sourceTypeSelect, songTrack);
    sourceTypeSelect.setAttribute("aria-label", "Source type for " + track.name);
    sourceTypeWrap.append(sourceTypeLabel, sourceTypeSelect);

    const voiceWrap = document.createElement("label");
    voiceWrap.className = "track-voice-control";
    const voiceLabel = document.createElement("span");
    voiceLabel.textContent = "INSTRUMENT / SOUND";
    const voice = document.createElement("select");
    voice.className = "track-voice-select";
    fillSourceItemSelect(
      voice,
      sourceTypeSelect.value,
      voiceValueForTrack(songTrack)
    );
    voice.setAttribute("aria-label", "Instrument or sound for " + track.name);

    sourceTypeSelect.addEventListener("change", async () => {
      fillSourceItemSelect(voice, sourceTypeSelect.value);
      if (voice.value) {
        const changed = await updateTracksWorkspaceSource(trackIndex, voice.value);
        if (changed) {
          ui.advancedStatus.textContent =
            "Source Type changed for " + track.name +
            " · " + sourceTypeSelect.options[sourceTypeSelect.selectedIndex]?.text +
            ". Track source saved in Markdown.";
        }
      }
    });
    voice.addEventListener("change", async () => {
      const changed = await updateTracksWorkspaceSource(trackIndex, voice.value);
      if (changed) {
        ui.advancedStatus.textContent =
          "Instrument / Sound changed for " + track.name + ". Press Reload Stems or Play.";
      }
    });
    voiceWrap.append(voiceLabel, voice);

    const volumeWrap = document.createElement("label");
    volumeWrap.className = "track-volume-control";
    const volumeLabel = document.createElement("span");
    volumeLabel.textContent = "VOL";
    const volume = document.createElement("input");
    volume.type = "range";
    volume.min = "0";
    volume.max = "100";
    volume.step = "1";
    const currentVolume = songTrack?.volume ?? 1;
    volume.value = String(Math.round(currentVolume * 100));
    volume.setAttribute("aria-label", "Track volume for " + track.name);
    const volumeValue = document.createElement("span");
    volumeValue.className = "track-volume-value";
    volumeValue.textContent = Math.round(currentVolume * 100) + "%";
    volume.addEventListener("input", () => {
      setAdvancedTrackVolume(trackIndex, Number(volume.value) / 100);
    });
    volume.addEventListener("change", async () => {
      const changed = await updateTracksWorkspaceVolume(
        trackIndex,
        Number(volume.value) / 100
      );
      if (changed) {
        ui.advancedStatus.textContent =
          "Track volume saved in Markdown for " + track.name +
          ". Press Reload Stems before final playback.";
      }
    });
    volumeWrap.append(volumeLabel, volume, volumeValue);

    const mute = document.createElement("button");
    mute.type = "button";
    mute.className = "track-mute";
    mute.dataset.trackIndex = String(trackIndex);
    mute.setAttribute("aria-pressed", "false");
    mute.textContent = "Mute";
    mute.addEventListener("click", () => toggleAdvancedTrackMute(trackIndex));

    const downloadStem = document.createElement("button");
    downloadStem.type = "button";
    downloadStem.className = "track-download";
    downloadStem.textContent = "Stem";
    downloadStem.setAttribute("aria-label", "Download stem WAV for " + track.name);
    downloadStem.addEventListener("click", () => downloadTracksStem(trackIndex));

    controls.append(sourceTypeWrap, voiceWrap, volumeWrap, mute, downloadStem);
    head.append(title, controls);

    const lane = document.createElement("div");
    lane.className = "timeline-lane";
    lane.style.minWidth = Math.max(720, maxBars * barWidth) + "px";
    lane.style.backgroundSize = barWidth + "px 100%";

    for (const event of track.events) {
      const block = document.createElement("div");
      block.className = "timeline-event";
      const start = (event.startQuarter / perBar) * barWidth;
      const width = Math.max(7, (event.durationQuarter / perBar) * barWidth);
      const top = event.kind === "note"
        ? Math.max(4, Math.min(48, 52 - ((event.note - 48) / 36) * 44))
        : 26;

      block.style.left = start + "px";
      block.style.width = width + "px";
      block.style.top = top + "px";
      block.textContent = event.kind === "note" ? event.noteName : "@" + event.trigger;
      lane.appendChild(block);
    }

    row.append(head, lane);
    ui.trackTimeline.appendChild(row);
  }

  ui.advancedProjectLabel.textContent =
    (state.tracksWorkspace.fileName || "Tracks Workspace.md") +
    " · " + timeline.tracks.length + " track" +
    (timeline.tracks.length === 1 ? "" : "s");
  renderTrackMuteStates();
}
function renderLibraries() {
  ui.soundBrowser.innerHTML = "";
  for (const sound of state.sounds) {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "library-card";
    card.innerHTML =
      "<strong>" + escapeHtml(sound.name) + "</strong>" +
      "<span>" + escapeHtml(sound.id + " · " + sound.type) + "</span>" +
      "<span>" + escapeHtml(sound.license || "license unspecified") + "</span>";
    card.addEventListener("click", async () => {
      activateMainTab("play");
      ui.playSourceType.value = sound.type === "soundpad" ? "soundpad" : "soundpiano";
      if (sound.type !== "soundpad") ui.pianoVoiceKind.value = "sound";
      await applyPlaySourceSelection();
      if ([...ui.soundSelect.options].some((option) => option.value === sound.id)) {
        ui.soundSelect.value = sound.id;
        await selectSound(sound.id);
      }
    });
    ui.soundBrowser.appendChild(card);
  }

  ui.instrumentBrowser.innerHTML = "";
  for (const instrument of state.instruments) {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "library-card";
    card.innerHTML =
      "<strong>" + escapeHtml(instrument.name) + "</strong>" +
      "<span>" + escapeHtml(instrument.id + " · " + instrument.format) + "</span>" +
      "<span>" + (instrument.playable ? "Playable" : "Adapter/backend required") + "</span>";
    card.addEventListener("click", async () => {
      activateMainTab("play");
      ui.playSourceType.value = "soundpiano";
      ui.pianoVoiceKind.value = "instrument";
      await applyPlaySourceSelection();
      ui.instrumentSelect.value = instrument.id;
      await selectInstrument(instrument.id);
    });
    ui.instrumentBrowser.appendChild(card);
  }
}


function renderHotkeyEditor() {
  ui.hotkeyEditor.innerHTML = "";
  const current = hotkeys();

  for (const [action, label] of Object.entries(HOTKEY_LABELS)) {
    const row = document.createElement("div");
    row.className = "hotkey-row";

    const title = document.createElement("span");
    title.textContent = label;

    const button = document.createElement("button");
    button.type = "button";
    button.className = "hotkey-bind";
    button.dataset.hotkeyAction = action;
    button.textContent = displayBinding(current[action]);
    button.addEventListener("click", () => {
      ui.hotkeyEditor.querySelectorAll(".hotkey-bind").forEach((item) => {
        item.classList.remove("capturing");
      });
      state.studio.pendingHotkeyAction = action;
      button.classList.add("capturing");
      button.textContent = "PRESS KEY";
      ui.settingsStatus.textContent = "Press a key for " + label + ".";
    });

    row.append(title, button);
    ui.hotkeyEditor.appendChild(row);
  }

  updatePianoHotkeyCaps();
}

function assignCapturedHotkey(binding) {
  const action = state.studio.pendingHotkeyAction;
  if (!action) return;

  if (action.startsWith("soundpad:")) {
    const trigger = action.slice(9);
    const pack = state.selected;
    if (!pack || pack.type !== "soundpad") return;

    const nextSoundPad = { ...soundPadHotkeys(pack) };
    for (const key of Object.keys(nextSoundPad)) {
      if (
        key !== trigger &&
        String(nextSoundPad[key]).toLowerCase() === String(binding).toLowerCase()
      ) {
        nextSoundPad[key] = "";
      }
    }
    nextSoundPad[trigger] = binding;

    state.studio.settings = {
      ...(state.studio.settings || {}),
      soundPadHotkeys: {
        ...(state.studio.settings?.soundPadHotkeys || {}),
        [pack.id]: nextSoundPad
      }
    };
    state.studio.pendingHotkeyAction = null;
    clearSoundPadHotkeySelection();
    updateSoundPadHotkeyCaps(pack);
    ui.soundPadHotkeyStatus.textContent =
      trigger +
      " -> " +
      displayBinding(binding) +
      ". Click another pad or Save.";
    return;
  }

  const pianoEditing =
    state.studio.hotkeyEditMode && state.studio.hotkeyEditTarget === "piano";
  const next = { ...hotkeys() };
  for (const key of Object.keys(next)) {
    if (
      key !== action &&
      String(next[key]).toLowerCase() === String(binding).toLowerCase()
    ) {
      next[key] = "";
    }
  }
  next[action] = binding;

  state.studio.settings = {
    ...(state.studio.settings || {}),
    hotkeys: next
  };
  state.studio.pendingHotkeyAction = null;
  renderHotkeyEditor();

  if (pianoEditing) {
    clearPianoHotkeySelection();
    const offset = Number.parseInt(action.replace("note", ""), 10);
    const midi = baseComputerMidi() + offset;
    ui.pianoHotkeyStatus.textContent =
      noteName(midi) +
      " -> " +
      displayBinding(binding) +
      ". Click another mapped key or Save.";
    return;
  }

  ui.settingsStatus.textContent = "Binding changed locally. Save Settings to keep it.";
}

async function saveStudioSettings() {
  const settings = await post("/v1/studio/settings", {
    editorMode: ui.editorModeSetting.value,
    hotkeys: hotkeys(),
    soundPadHotkeys: state.studio.settings?.soundPadHotkeys || {},
    soundPadVolumes: state.studio.settings?.soundPadVolumes || {},
    soundPadMixLocks: state.studio.settings?.soundPadMixLocks || {}
  });
  state.studio.settings = settings;
  renderHotkeyEditor();
  updatePianoHotkeyCaps();
  updateSoundPadHotkeyCaps();
  updateSoundPadMixLockUi();
  ui.settingsStatus.textContent = "Settings saved.";
}

function resetHotkeys() {
  state.studio.settings = {
    ...(state.studio.settings || {}),
    hotkeys: { ...DEFAULT_HOTKEYS }
  };
  renderHotkeyEditor();
  ui.settingsStatus.textContent = "Default bindings restored locally. Save Settings to keep them.";
}

function wireNodePalette() {
  document.querySelectorAll(".node-template").forEach((button) => {
    button.addEventListener("dragstart", (event) => {
      event.dataTransfer.setData("text/notescript-node", button.dataset.nodeKind);
      event.dataTransfer.effectAllowed = "copy";
    });
    button.addEventListener("dblclick", () => addNodeKind(button.dataset.nodeKind));
  });

  ui.nodeCanvas.addEventListener("dragover", (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
  });

  ui.nodeCanvas.addEventListener("drop", (event) => {
    event.preventDefault();
    const kind = event.dataTransfer.getData("text/notescript-node");
    if (kind) addNodeKind(kind);
  });
}

function normalizedDownloadName(value, fallback = "NoteScript") {
  const clean = String(value || "")
    .trim()
    .replace(/[\\/:*?"<>|]+/g, "-")
    .replace(/[. ]+$/g, "");
  const stem = clean || fallback;
  return stem.toLowerCase().endsWith(".wav") ? stem : stem + ".wav";
}

function normalizedFileName(value, fallback, extension) {
  const clean = String(value || "")
    .trim()
    .replace(/[\\/:*?"<>|]+/g, "-")
    .replace(/[. ]+$/g, "");
  const stem = clean || fallback;
  return stem.toLowerCase().endsWith(extension.toLowerCase())
    ? stem
    : stem + extension;
}

function triggerBlobDownload(blob, filename) {
  const href = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = href;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(href), 2000);
}

async function tracksAudioBlob(pathname, body) {
  const response = await fetch(pathname, {
    method: "POST",
    cache: "no-store",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  if (!response.ok) {
    let message = response.statusText;
    try {
      const data = await response.json();
      message = data.message || data.error || message;
    } catch {}
    throw new Error(message);
  }
  return response.blob();
}

function tracksBaseName() {
  return String(state.tracksWorkspace.fileName || "Tracks Workspace")
    .replace(/\.md$/i, "")
    .trim() || "Tracks Workspace";
}

function tracksExportBaseName() {
  return String(ui.tracksOutputName.value || "")
    .trim()
    .replace(/\.(wav|zip)$/i, "")
    .trim() || tracksBaseName();
}

function downloadTracksMarkdown() {
  const workspace = state.tracksWorkspace;
  if (!workspace.analysis?.valid || !workspace.markdown) {
    ui.advancedStatus.textContent = "Load a valid .md file before downloading.";
    return;
  }
  const filename = normalizedFileName(
    workspace.fileName,
    "Tracks Workspace",
    ".md"
  );
  triggerBlobDownload(
    new Blob([workspace.markdown], { type: "text/markdown;charset=utf-8" }),
    filename
  );
  ui.advancedStatus.textContent = "Downloaded Tracks Markdown: " + filename;
}

async function downloadTracksStem(trackIndex) {
  const workspace = state.tracksWorkspace;
  const track = workspace.analysis?.song?.tracks?.[trackIndex];
  if (!workspace.analysis?.valid || !track) {
    ui.advancedStatus.textContent = "Load a valid Tracks workspace before exporting a stem.";
    return;
  }

  const filename = normalizedDownloadName(
    tracksExportBaseName() + " - " + track.name,
    "Track " + (trackIndex + 1)
  );
  ui.advancedStatus.textContent = "Rendering stem: " + track.name + "...";

  try {
    const blob = await tracksAudioBlob("/v1/tracks/track-audio", {
      markdown: workspace.markdown,
      fileName: workspace.fileName || "Tracks Workspace.md",
      track: trackIndex
    });
    triggerBlobDownload(blob, filename);
    ui.advancedStatus.textContent = "Downloaded stem WAV: " + filename;
  } catch (error) {
    ui.advancedStatus.textContent = "Stem WAV error: " + error.message;
  }
}

async function downloadTracksMix() {
  const workspace = state.tracksWorkspace;
  if (!workspace.analysis?.valid || !workspace.markdown) {
    ui.advancedStatus.textContent = "Load a valid .md file before downloading the mix.";
    return;
  }

  const filename = normalizedDownloadName(
    tracksExportBaseName(),
    tracksBaseName()
  );
  ui.tracksDownloadMix.disabled = true;
  ui.advancedStatus.textContent = "Rendering Tracks mix...";

  try {
    const blob = await tracksAudioBlob("/v1/tracks/mix-audio", {
      markdown: workspace.markdown,
      fileName: workspace.fileName || "Tracks Mix.md",
      mutedTracks: [...state.advancedTransport.muted]
    });
    triggerBlobDownload(blob, filename);
    ui.tracksOutputName.value = filename.replace(/\.wav$/i, "");
    ui.advancedStatus.textContent =
      "Downloaded mix WAV: " + filename +
      (state.advancedTransport.muted.size
        ? " · muted tracks excluded"
        : "");
  } catch (error) {
    ui.advancedStatus.textContent = "Mix WAV error: " + error.message;
  } finally {
    ui.tracksDownloadMix.disabled = false;
  }
}

async function downloadTracksSet() {
  const workspace = state.tracksWorkspace;
  if (!workspace.analysis?.valid || !workspace.markdown) {
    ui.advancedStatus.textContent = "Load a valid .md file before downloading the Track Set.";
    return;
  }

  const base = tracksExportBaseName();
  const filename = normalizedFileName(
    base + " Track Set",
    tracksBaseName() + " Track Set",
    ".zip"
  );
  ui.tracksDownloadSet.disabled = true;
  ui.advancedStatus.textContent = "Rendering mix and all Track stems...";

  try {
    const blob = await tracksAudioBlob("/v1/tracks/set-zip", {
      markdown: workspace.markdown,
      fileName: normalizedFileName(base, tracksBaseName(), ".md"),
      mutedTracks: [...state.advancedTransport.muted]
    });
    triggerBlobDownload(blob, filename);
    ui.tracksOutputName.value = base;
    ui.advancedStatus.textContent =
      "Downloaded Track Set: " + filename +
      " · Markdown + mix + " +
      (workspace.analysis.song?.tracks?.length || 0) +
      " stem WAV(s).";
  } catch (error) {
    ui.advancedStatus.textContent = "Track Set error: " + error.message;
  } finally {
    ui.tracksDownloadSet.disabled = false;
  }
}

async function renderCurrentProjectToWav() {
  const analysis = await analyzeCurrentMarkdown(false);
  if (!analysis.valid) {
    ui.projectFileMeta.textContent = "Fix validation errors before downloading WAV.";
    return;
  }

  const filename = normalizedDownloadName(
    ui.renderOutputName.value,
    state.studio.currentProject?.replace(/\.md$/i, "") || analysis.song?.title || "NoteScript"
  );
  ui.renderProject.disabled = true;
  ui.projectFileMeta.textContent = "Rendering current Compose state for download...";

  try {
    const response = await fetch("/v1/render/audio", {
      method: "POST",
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        markdown: ui.markdownEditor.value,
        fileName: state.studio.currentProject || (analysis.song?.title || "Studio Render") + ".md"
      })
    });
    if (!response.ok) {
      let message = response.statusText;
      try {
        const data = await response.json();
        message = data.message || data.error || message;
      } catch {}
      throw new Error(message);
    }

    const blob = await response.blob();
    const href = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = href;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(href), 2000);
    ui.renderOutputName.value = filename.replace(/\.wav$/i, "");
    ui.projectFileMeta.textContent = "Downloaded WAV: " + filename;
  } catch (error) {
    ui.projectFileMeta.textContent = "WAV download error: " + error.message;
  } finally {
    ui.renderProject.disabled = false;
  }
}

async function applyComposeVoice() {
  const trackIndex = Number(ui.composeTrackSelect.value);
  if (!Number.isInteger(trackIndex)) return;
  const changed = await updateTrackSettingsInMarkdown(trackIndex, {
    voiceValue: ui.composeVoiceSelect.value,
    volume: ui.composeTrackVolume.value
  });
  if (changed) {
    const track = state.studio.analysis?.song?.tracks?.[trackIndex];
    ui.projectFileMeta.textContent =
      "Track updated: " + (track?.name || ("Track " + (trackIndex + 1))) +
      " · " + Math.round((track?.volume ?? 1) * 100) + "% volume. Save or Download WAV when ready.";
  }
}

async function exportCurrentProjectMidi() {
  const saved = await saveCurrentProject();
  if (!saved) return;
  const result = await post("/v1/midi", { project: state.studio.currentProject });
  ui.projectFileMeta.textContent = "MIDI exported: " + result.outputFile;
}

function wireStudioUi() {
  ui.mainTabs.forEach((button) => {
    button.addEventListener("click", () => activateMainTab(button.dataset.tab));
  });

  ui.composeTabs.forEach((button) => {
    button.addEventListener("click", () => activateComposeMode(button.dataset.composeMode));
  });

  ui.newProject.addEventListener("click", createNewProject);
  ui.openProject.addEventListener("click", () => {
    const target = state.studio.currentProject || state.studio.projects[0];
    if (target) openStudioProject(target);
  });
  ui.saveProject.addEventListener("click", saveCurrentProject);
  ui.renameProject.addEventListener("click", renameCurrentProject);
  ui.deleteProject.addEventListener("click", deleteCurrentProject);
  ui.analyzeProject.addEventListener("click", () => analyzeCurrentMarkdown(true));
  ui.renderProject.addEventListener("click", renderCurrentProjectToWav);
  ui.exportMidi.addEventListener("click", exportCurrentProjectMidi);
  ui.composeTrackSelect.addEventListener("change", () => {
    const track = state.studio.analysis?.song?.tracks?.[Number(ui.composeTrackSelect.value)];
    if (track) {
      fillTrackSourceTypeSelect(ui.composeSourceType, track);
      fillSourceItemSelect(
        ui.composeVoiceSelect,
        ui.composeSourceType.value,
        voiceValueForTrack(track)
      );
      ui.composeTrackVolume.value = String(track.volume);
      ui.composeTrackVolumeValue.textContent = Math.round(track.volume * 100) + "%";
    }
  });
  ui.composeSourceType.addEventListener("change", () => {
    fillSourceItemSelect(ui.composeVoiceSelect, ui.composeSourceType.value);
  });
  ui.composeTrackVolume.addEventListener("input", () => {
    ui.composeTrackVolumeValue.textContent =
      Math.round(Number(ui.composeTrackVolume.value) * 100) + "%";
  });
  ui.composeApplyVoice.addEventListener("click", applyComposeVoice);
  ui.formAddTrack.addEventListener("click", addFormTrack);
  ui.nodeInspectorApply.addEventListener("click", applyNodeInspector);
  ui.nodeInspectorForm.addEventListener("click", openSelectedNodeInForm);

  ui.markdownEditor.addEventListener("input", () => {
    state.studio.markdown = ui.markdownEditor.value;
    setDirty(true);
  });

  for (const element of [ui.formTitle, ui.formTempo, ui.formTime, ui.formKey]) {
    element.addEventListener("input", applyFormToMarkdown);
    element.addEventListener("change", applyFormToMarkdown);
  }

  ui.saveSettings.addEventListener("click", saveStudioSettings);
  ui.resetHotkeys.addEventListener("click", resetHotkeys);
  ui.pianoHotkeyEdit.addEventListener("click", beginPianoHotkeyEdit);
  ui.pianoHotkeySave.addEventListener("click", savePianoHotkeys);
  ui.pianoHotkeyCancel.addEventListener("click", cancelPianoHotkeyEdit);
  ui.soundPadHotkeyEdit.addEventListener("click", beginSoundPadHotkeyEdit);
  ui.soundPadHotkeySave.addEventListener("click", saveSoundPadHotkeys);
  ui.soundPadHotkeyCancel.addEventListener("click", cancelSoundPadHotkeyEdit);
  ui.soundPadMixLock.addEventListener("click", toggleSoundPadMixLock);
  ui.soundPadResetMix.addEventListener("click", resetSoundPadMix);

  ui.tracksFileInput.addEventListener("change", async () => {
    const file = ui.tracksFileInput.files?.[0] || null;
    if (!file) return;
    try {
      await loadTracksWorkspaceFile(file);
    } catch (error) {
      ui.advancedStatus.textContent = "Tracks load error: " + error.message;
    } finally {
      ui.tracksFileInput.value = "";
    }
  });
  ui.tracksAddTrack.addEventListener("click", addTrackToTracksWorkspace);
  ui.tracksDownloadMd.addEventListener("click", downloadTracksMarkdown);
  ui.tracksDownloadMix.addEventListener("click", downloadTracksMix);
  ui.tracksDownloadSet.addEventListener("click", downloadTracksSet);

  ui.playSourceType.addEventListener("change", applyPlaySourceSelection);
  ui.pianoVoiceKind.addEventListener("change", applyPlaySourceSelection);
  ui.beatLaneStart.addEventListener("click", startBeatLaneGame);
  ui.beatLaneStop.addEventListener("click", () => stopBeatLaneGame(true));
  ui.beatLaneProject.addEventListener("change", async () => {
    stopBeatLaneGame(false);
    state.beatLane6.chart = null;
    state.beatLane6.project = ui.beatLaneProject.value || null;
    try {
      if (ui.beatLaneProject.value) await loadBeatLaneChart(true);
    } catch (error) {
      ui.beatLaneStatus.textContent = "BeatLane6 chart error: " + error.message;
    }
  });
  ui.beatLaneDifficulty.addEventListener("change", async () => {
    stopBeatLaneGame(false);
    state.beatLane6.chart = null;
    try {
      if (ui.beatLaneProject.value) await loadBeatLaneChart(true);
    } catch (error) {
      ui.beatLaneStatus.textContent = "BeatLane6 chart error: " + error.message;
    }
  });

  for (const laneElement of ui.beatLaneLanes) {
    const lane = Number(laneElement.dataset.lane);
    laneElement.addEventListener("pointerdown", (event) => {
      if (state.playMode !== "beatlane6") return;
      event.preventDefault();
      laneElement.setPointerCapture?.(event.pointerId);
      beatLaneKeyDown(lane);
    });
    const releaseLane = (event) => {
      if (state.playMode !== "beatlane6") return;
      event.preventDefault();
      beatLaneKeyUp(lane);
    };
    laneElement.addEventListener("pointerup", releaseLane);
    laneElement.addEventListener("pointercancel", releaseLane);
    laneElement.addEventListener("lostpointercapture", releaseLane);
  }

  wireNodePalette();
}

async function initialize() {
  buildPiano();
  wireStudioUi();
  setDirty(false);

  ui.velocity.addEventListener("input", () => {
    state.velocity = Number.parseInt(ui.velocity.value, 10);
    ui.velocityValue.value = String(state.velocity);
    ui.velocityValue.textContent = String(state.velocity);
    if (ui.hudVelocity) ui.hudVelocity.textContent = String(state.velocity);
  });

  ui.octaveDown.addEventListener("click", () => {
    state.octaveShift -= 1;
    updateOctave();
  });
  ui.octaveUp.addEventListener("click", () => {
    state.octaveShift += 1;
    updateOctave();
  });

  ui.sustain.addEventListener("change", syncSustain);
  ui.panic?.addEventListener("click", panicAll);
  ui.enableMidi?.addEventListener("click", enableMidiInput);
  ui.soundSelect.addEventListener("change", () => {
    if (ui.soundSelect.value) selectSound(ui.soundSelect.value);
  });
  ui.instrumentSelect.addEventListener("change", () => {
    if (
      ui.playSourceType.value === "soundpiano" &&
      ui.pianoVoiceKind.value === "instrument" &&
      ui.instrumentSelect.value
    ) {
      selectInstrument(ui.instrumentSelect.value);
    }
  });

  ui.transportPlay.addEventListener("click", playTransport);
  ui.transportPause.addEventListener("click", pauseTransport);
  ui.transportStop.addEventListener("click", stopTransport);
  ui.transportSeek.addEventListener("change", () => {
    const ratio = Number(ui.transportSeek.value) / 1000;
    seekTransport(state.transport.duration * ratio);
  });
  ui.transportLoop.addEventListener("change", () => {
    if (state.transport.source) {
      state.transport.source.loop = ui.transportLoop.checked;
      if (ui.transportLoop.checked && state.transport.duration > 0) {
        state.transport.source.loopStart = 0;
        state.transport.source.loopEnd = state.transport.duration;
      }
    }
    if (state.transport.playing) {
      ui.transportStatus.textContent =
        "Playing " + (state.transport.project || "project") +
        (ui.transportLoop.checked ? " · loop" : "");
    }
  });
  ui.transportVolume.addEventListener("input", updateTransportGain);
  ui.transportPan.addEventListener("input", updateTransportPan);
  ui.refreshOutputs.addEventListener("click", refreshOutputDevices);
  ui.outputDevice.addEventListener("change", applyOutputDevice);

  ui.advancedPlay.addEventListener("click", playAdvancedTransport);
  ui.advancedPause.addEventListener("click", pauseAdvancedTransport);
  ui.advancedStop.addEventListener("click", stopAdvancedTransport);
  ui.advancedReload.addEventListener("click", () => loadAdvancedTransport(true));
  ui.advancedSeek.addEventListener("change", () => {
    const ratio = Number(ui.advancedSeek.value) / 1000;
    seekAdvancedTransport(state.advancedTransport.duration * ratio);
  });
  ui.transportVoiceSelect.addEventListener("change", async () => {
    await loadTransportProject(ui.projectSelect.value);
  });
  ui.projectSelect.addEventListener("change", async () => {
    await loadTransportProject(ui.projectSelect.value);
  });

  updateTransportGain();
  updateTransportPan();
  updateTransportDisplay(0);
  updateAdvancedTransportDisplay(0);
  updateBeatLaneHud();
  setPlayMode("live");
  ui.outputDevice.innerHTML = '<option value="">Default browser output</option>';

  try {
    const [health, capabilities, projectsData, soundsData, instrumentsData, studioSettings] = await Promise.all([
      api("/v1/health"),
      api("/v1/capabilities"),
      api("/v1/projects"),
      api("/v1/sounds?details=1"),
      api("/v1/instruments"),
      api("/v1/studio/settings")
    ]);

    state.capabilities = capabilities;
    state.sounds = soundsData.sounds || [];
    state.instruments = instrumentsData.instruments || [];
    state.studio.projects = projectsData.projects || [];
    state.studio.settings = studioSettings;

    syncProjectSelects();
    renderProjectList();

    if (state.studio.projects.length === 0) {
      ui.transportPlay.disabled = true;
      ui.transportPause.disabled = true;
      ui.transportStop.disabled = true;
      ui.transportStatus.textContent = "Create a NoteScript project from the Project tab.";
    } else {
      ui.transportStatus.textContent = "Loading preview...";
      ui.projectNameInput.value = state.studio.projects[0];
    }

    ui.editorModeSetting.value = studioSettings.editorMode || "text";
    activateComposeMode(studioSettings.editorMode || "text");
    renderHotkeyEditor();
    renderLibraries();
    updatePianoHotkeyCaps();
    activateMainTab("play");

    ui.engineStatus.textContent = health.coreVersion + " · ready";
    ui.engineStatus.classList.add("ok");

    const engineHints = [];
    if (capabilities.decoders.ffmpeg.available) {
      engineHints.push(capabilities.decoders.ffmpeg.version || "FFmpeg decoder available");
    }
    if (capabilities.livePlayback?.soundfont) {
      engineHints.push("Persistent SoundFont live engine available");
    }
    ui.engineStatus.title = engineHints.join("\n") || "Native WAV playback ready.";

    populateInstruments();
    populateTransportVoiceSelect();

    if (state.studio.projects.length > 0) {
      await loadTransportProject(ui.projectSelect.value);
    }

    if (state.sounds.length === 0) {
      ui.engineStatus.classList.add("warn");
    }

    ui.playSourceType.value = "soundpiano";
    ui.pianoVoiceKind.value = "sound";
    await applyPlaySourceSelection();
    renderLibraries();

    if (!navigator.requestMIDIAccess) {
      ui.enableMidi.disabled = true;
      ui.midiStatus.textContent = "Web MIDI is not supported by this browser.";
    }
  } catch (error) {
    ui.engineStatus.textContent = "Connection error";
    ui.engineStatus.classList.add("warn");
    setMonitor(error.message);
  }
}

window.addEventListener("keydown", (event) => {
  if (event.repeat) return;

  if (state.studio.pendingHotkeyAction) {
    event.preventDefault();
    event.stopPropagation();
    assignCapturedHotkey(canonicalBindingFromEvent(event));
    return;
  }

  if (state.studio.hotkeyEditMode) {
    event.preventDefault();
    event.stopPropagation();
    ui.pianoHotkeyStatus.textContent =
      "Click a mapped piano key first, then press the keyboard key you want.";
    return;
  }

  if (!isPlayTabActive()) return;
  if (isTextEntryTarget(event.target)) return;

  if (state.playMode === "beatlane6") {
    if (event.key === "Escape") {
      event.preventDefault();
      stopBeatLaneGame(true);
      return;
    }
    const lane = BEATLANE6_INPUT_KEYS.indexOf(canonicalBindingFromEvent(event));
    if (lane >= 0) {
      event.preventDefault();
      beatLaneKeyDown(lane);
    }
    return;
  }

  const current = hotkeys();

  if (keyMatches(event, current.panic)) {
    event.preventDefault();
    panicAll();
    return;
  }

  if (keyMatches(event, current.transportStop)) {
    event.preventDefault();
    stopTransport();
    return;
  }

  if (keyMatches(event, current.transportPlayPause)) {
    event.preventDefault();
    if (state.transport.playing) pauseTransport();
    else playTransport();
    return;
  }

  if (keyMatches(event, current.octaveDown)) {
    event.preventDefault();
    state.octaveShift -= 1;
    updateOctave();
    return;
  }

  if (keyMatches(event, current.octaveUp)) {
    event.preventDefault();
    state.octaveShift += 1;
    updateOctave();
    return;
  }

  if (keyMatches(event, current.sustain)) {
    event.preventDefault();
    state.spaceSustain = true;
    syncSustain();
    return;
  }

  if (state.sourceMode === "sound" && state.selected?.type === "soundpad") {
    const kitMap = soundPadComputerKeyMap();
    const key = mappedKeyForEvent(kitMap, event);
    if (!key) return;
    event.preventDefault();
    const trigger = kitMap.get(key);
    const pad = ui.soundPads.querySelector('[data-trigger="' + CSS.escape(trigger) + '"]');
    if (pad) triggerPad(trigger, pad);
    return;
  }

  const map = computerKeyMap();
  const key = mappedKeyForEvent(map, event);
  if (!key || state.keyHeld.has(key)) return;

  event.preventDefault();
  state.keyHeld.add(key);
  const midi = baseComputerMidi() + map.get(key);
  noteOn(midi, "keyboard:" + key);
});

window.addEventListener("keyup", (event) => {
  if (state.studio.hotkeyEditMode) {
    event.preventDefault();
    return;
  }

  if (!isPlayTabActive()) return;

  const physicalKey = canonicalBindingFromEvent(event);
  if (state.playMode === "beatlane6") {
    const lane = BEATLANE6_INPUT_KEYS.indexOf(physicalKey);
    if (lane >= 0) {
      event.preventDefault();
      beatLaneKeyUp(lane);
    }
    return;
  }

  const current = hotkeys();

  if (keyMatches(event, current.sustain)) {
    event.preventDefault();
    state.spaceSustain = false;
    syncSustain();
    return;
  }

  if (state.sourceMode === "sound" && state.selected?.type === "soundpad") return;

  const map = computerKeyMap();
  const key = mappedKeyForEvent(map, event);
  if (!key) return;
  event.preventDefault();
  state.keyHeld.delete(key);
  noteOff("keyboard:" + key);
});

window.addEventListener("blur", () => {
  state.keyHeld.clear();
  state.spaceSustain = false;
  if (state.beatLane6.running) stopBeatLaneGame(true);
  syncSustain();
  panicAll();
});

window.addEventListener("pagehide", () => {
  if (state.liveReady) {
    navigator.sendBeacon?.("/v1/live/all-notes-off", new Blob(["{}"], { type: "application/json" }));
  }
});

initialize();

