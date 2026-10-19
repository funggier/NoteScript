const ui = {
  engineStatus: document.querySelector("#engineStatus"),
  dirtyState: document.querySelector("#dirtyState"),
  hudOctave: document.querySelector("#hudOctave"),
  hudVelocity: document.querySelector("#hudVelocity"),
  projectSelect: document.querySelector("#projectSelect"),
  transportLoad: document.querySelector("#transportLoad"),
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
  exportMidi: document.querySelector("#exportMidi"),
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
  basicMode: document.querySelector("#basicMode"),
  advancedMode: document.querySelector("#advancedMode"),
  workspaceModeSetting: document.querySelector("#workspaceModeSetting"),
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

function setSoundPadVolumeLocal(pack, trigger, value) {
  if (!pack || pack.type !== "soundpad") return 1;
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

function keyMatches(event, binding) {
  if (!binding) return false;
  if (binding === "Space") return event.code === "Space";
  if (binding === "Escape") return event.key === "Escape";
  if (binding === "Enter") return event.key === "Enter";
  if (binding === "Backspace") return event.key === "Backspace";
  return event.key.toLowerCase() === String(binding).toLowerCase();
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

async function loadTransportProject(project = ui.projectSelect.value, force = false) {
  const name = String(project || "").trim();
  if (!name) {
    ui.transportStatus.textContent = "No project selected.";
    return false;
  }

  const token = ++state.transport.loadToken;
  stopTransport();
  ui.transportStatus.textContent = "Rendering preview…";
  ui.transportLoad.disabled = true;

  try {
    if (force) {
      await post("/v1/transport/cache/clear", { project: name });
    }

    const response = await fetch(
      "/v1/transport/audio?project=" + encodeURIComponent(name),
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
    if (token === state.transport.loadToken) ui.transportLoad.disabled = false;
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
    const loaded = await loadTransportProject();
    if (!loaded) return;
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

function updateTransportPan() {
  const value = transportPanValue();
  ui.transportPanValue.textContent = String(Math.round(value * 100));
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

function activateMainTab(name) {
  if (name !== "play" && state.studio.hotkeyEditMode) {
    cancelActiveHotkeyEdit();
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
  ui.projectSelect.innerHTML = "";

  if (state.studio.projects.length === 0) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "No projects found";
    ui.projectSelect.appendChild(option);
    ui.projectSelect.disabled = true;
    ui.transportLoad.disabled = true;
    ui.transportPlay.disabled = true;
    ui.transportPause.disabled = true;
    ui.transportStop.disabled = true;
    return;
  }

  ui.projectSelect.disabled = false;
  ui.transportLoad.disabled = false;
  ui.transportPlay.disabled = false;
  ui.transportPause.disabled = false;
  ui.transportStop.disabled = false;
  for (const project of state.studio.projects) {
    const option = document.createElement("option");
    option.value = project;
    option.textContent = project;
    ui.projectSelect.appendChild(option);
  }

  if (selected && state.studio.projects.includes(selected)) {
    ui.projectSelect.value = selected;
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

  if (updateDerivedViews && analysis.valid) {
    renderTrackTimeline();
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
  invalidateAdvancedTransport("Project opened. Advanced stems will load on Play.");
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
  renderTrackTimeline();
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

  invalidateAdvancedTransport("New project created. Save it before Advanced playback.");
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
  invalidateAdvancedTransport("Project saved. Advanced stems will refresh on Play.");
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
  invalidateAdvancedTransport("Project renamed. Advanced stems will reload on Play.");
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
  invalidateAdvancedTransport("Project deleted.");
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

function buildTrackForm(track, index) {
  const wrapper = document.createElement("div");
  wrapper.className = "track-form-row";
  wrapper.dataset.trackIndex = String(index);

  const sourceType = track.sound ? "sound" : "instrument";
  const sourceValue = track.sound || track.instrument || "";
  const barsText = track.bars.map((bar) =>
    "bar " + bar.number + ": " + bar.events.map(eventText).join(" | ")
  ).join("\n");

  wrapper.innerHTML =
    '<label>Name<input class="text-input form-track-name" type="text" value="' + escapeHtml(track.name) + '"></label>' +
    '<label>Source<div class="inline-source">' +
    '<select class="form-track-source-type">' +
    '<option value="sound"' + (sourceType === "sound" ? " selected" : "") + '>Sound</option>' +
    '<option value="instrument"' + (sourceType === "instrument" ? " selected" : "") + '>Instrument</option>' +
    '</select>' +
    '<input class="text-input form-track-source" type="text" value="' + escapeHtml(sourceValue) + '">' +
    '</div></label>' +
    '<label>Volume<input class="text-input form-track-volume" type="number" min="0" max="1" step="0.05" value="' + track.volume + '"></label>' +
    '<label>Pan<input class="text-input form-track-pan" type="number" min="-1" max="1" step="0.1" value="' + track.pan + '"></label>' +
    '<label>Velocity<input class="text-input form-track-velocity" type="number" min="1" max="127" value="' + track.velocity + '"></label>' +
    '<button class="small-button form-remove-track" type="button">Remove</button>' +
    '<label class="track-bars-field">Bars<textarea class="markdown-editor form-track-bars" rows="4">' +
    escapeHtml(barsText) +
    '</textarea></label>';

  wrapper.querySelectorAll("input, select, textarea").forEach((element) => {
    element.addEventListener("input", applyFormToMarkdown);
    element.addEventListener("change", applyFormToMarkdown);
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
    const source = row.querySelector(".form-track-source").value.trim() ||
      (sourceType === "sound" ? "piano" : "SFZ/basic-sfz");

    lines.push("track " + name);
    lines.push(sourceType + ": " + source);
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
  invalidateAdvancedTransport("Form changed the project. Advanced stems will rebuild on Play.");
  setDirty(true);
  clearTimeout(formAnalyzeTimer);
  formAnalyzeTimer = setTimeout(() => analyzeCurrentMarkdown(false), 180);
}

function addFormTrack() {
  const fallback = {
    name: "Track " + (ui.formTracks.querySelectorAll(".track-form-row").length + 1),
    sound: state.sounds[0]?.id || "piano",
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
  invalidateAdvancedTransport("Node Inspector changed the project. Advanced stems will rebuild on Play.");
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
  invalidateAdvancedTransport("Node edit changed the project. Advanced stems will rebuild on Play.");
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

async function fetchAdvancedStem(project, trackIndex) {
  const response = await fetch(
    "/v1/transport/track-audio?project=" +
      encodeURIComponent(project) +
      "&track=" +
      encodeURIComponent(String(trackIndex)),
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
  return ensureAudio().decodeAudioData(bytes.slice(0));
}

async function loadAdvancedTransport(force = false) {
  if (!state.studio.currentProject) {
    ui.advancedStatus.textContent = "Open or create a project first.";
    return false;
  }

  if (state.studio.dirty || !state.studio.projects.includes(state.studio.currentProject)) {
    ui.advancedStatus.textContent = "Saving current valid changes before mix playback.";
    const saved = await saveCurrentProject();
    if (!saved) return false;
  }

  let analysis = state.studio.analysis;
  if (!analysis?.valid) analysis = await analyzeCurrentMarkdown(true);
  if (!analysis?.valid || !analysis.song?.tracks?.length) {
    ui.advancedStatus.textContent = "A valid project with at least one track is required.";
    return false;
  }

  const project = state.studio.currentProject;
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
  ui.advancedStatus.textContent = "Rendering " + trackCount + " track stem(s)...";
  ui.advancedPlay.disabled = true;
  ui.advancedReload.disabled = true;

  try {
    if (force) {
      await post("/v1/transport/cache/clear", { project });
    }

    const buffers = await Promise.all(
      Array.from({ length: trackCount }, (_, index) => fetchAdvancedStem(project, index))
    );

    if (token !== transport.loadToken) return false;

    const previousProject = transport.project;
    transport.project = project;
    transport.buffers = buffers;
    transport.duration = buffers.reduce((max, buffer) => Math.max(max, buffer.duration), 0);
    transport.offset = 0;

    if (previousProject !== project) transport.muted.clear();

    ui.advancedProjectLabel.textContent =
      project + " · " + trackCount + " track" + (trackCount === 1 ? "" : "s");
    ui.advancedStatus.textContent =
      "Stems ready. Mute/Unmute any track while playback is running.";
    updateAdvancedTransportDisplay(0);
    renderTrackMuteStates();
    return true;
  } catch (error) {
    transport.project = null;
    transport.buffers = [];
    transport.duration = 0;
    ui.advancedStatus.textContent = "Advanced playback error: " + error.message;
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
    gain.gain.value = transport.muted.has(index) ? 0 : 1;
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
    gain.gain.setValueAtTime(muted ? 0 : 1, context.currentTime);
  }

  renderTrackMuteStates();
  const name = state.studio.analysis?.song?.tracks?.[index]?.name || ("Track " + (index + 1));
  ui.advancedStatus.textContent =
    (muted ? "Muted " : "Unmuted ") + name +
    (transport.playing ? " during playback." : ".");
}

function toggleAdvancedTrackMute(trackIndex) {
  const index = Number(trackIndex);
  setAdvancedTrackMuted(index, !state.advancedTransport.muted.has(index));
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
  const analysis = state.studio.analysis;
  ui.trackTimeline.innerHTML = "";

  if (!analysis?.valid || !analysis.timeline) {
    ui.trackTimeline.innerHTML = '<div class="empty-state">Open a valid project to build the multi-track timeline.</div>';
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

    const title = document.createElement("button");
    title.type = "button";
    title.className = "timeline-track-title";
    title.title = "Edit this track in Compose / Form";
    title.innerHTML =
      "<strong>" + escapeHtml(track.name) + "</strong>" +
      "<span>" + escapeHtml(sourceLabel(track)) + "</span>" +
      "<span>vol " + track.volume + " · pan " + track.pan + "</span>";
    title.addEventListener("click", () => {
      activateMainTab("compose");
      activateComposeMode("form");
      const target = ui.formTracks.querySelectorAll(".track-form-row")[trackIndex];
      target?.scrollIntoView({ behavior: "smooth", block: "center" });
      target?.querySelector(".form-track-name")?.focus();
    });

    const controls = document.createElement("div");
    controls.className = "timeline-track-controls";

    const mute = document.createElement("button");
    mute.type = "button";
    mute.className = "track-mute";
    mute.dataset.trackIndex = String(trackIndex);
    mute.setAttribute("aria-pressed", "false");
    mute.textContent = "MUTE";
    mute.addEventListener("click", () => toggleAdvancedTrackMute(trackIndex));

    const edit = document.createElement("button");
    edit.type = "button";
    edit.className = "track-edit";
    edit.textContent = "EDIT";
    edit.addEventListener("click", () => title.click());

    controls.append(mute, edit);
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
    (state.studio.currentProject || "Unsaved project") +
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
      ui.soundSelect.value = sound.id;
      await selectSound(sound.id);
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
      ui.instrumentSelect.value = instrument.id;
      await selectInstrument(instrument.id);
    });
    ui.instrumentBrowser.appendChild(card);
  }
}


function canonicalBindingFromEvent(event) {
  if (event.code === "Space") return "Space";
  if (event.key === "Escape") return "Escape";
  if (event.key === "Enter") return "Enter";
  if (event.key === "Backspace") return "Backspace";
  if (event.key.length === 1) return event.key.toLowerCase();
  return event.key;
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
    workspaceMode: ui.workspaceModeSetting.value,
    editorMode: ui.editorModeSetting.value,
    hotkeys: hotkeys(),
    soundPadHotkeys: state.studio.settings?.soundPadHotkeys || {},
    soundPadVolumes: state.studio.settings?.soundPadVolumes || {}
  });
  state.studio.settings = settings;
  renderHotkeyEditor();
  updatePianoHotkeyCaps();
  updateSoundPadHotkeyCaps();
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

async function renderCurrentProjectToWav() {
  const saved = await saveCurrentProject();
  if (!saved) return;
  const result = await post("/v1/render", { project: state.studio.currentProject });
  ui.projectFileMeta.textContent = "WAV rendered: " + result.outputFile;
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
  ui.formAddTrack.addEventListener("click", addFormTrack);
  ui.nodeInspectorApply.addEventListener("click", applyNodeInspector);
  ui.nodeInspectorForm.addEventListener("click", openSelectedNodeInForm);

  ui.markdownEditor.addEventListener("input", () => {
    state.studio.markdown = ui.markdownEditor.value;
    invalidateAdvancedTransport("Text changed. Advanced stems will rebuild on Play.");
    setDirty(true);
  });

  for (const element of [ui.formTitle, ui.formTempo, ui.formTime, ui.formKey]) {
    element.addEventListener("input", applyFormToMarkdown);
    element.addEventListener("change", applyFormToMarkdown);
  }

  ui.basicMode.addEventListener("click", () => {
    ui.workspaceModeSetting.value = "basic";
    activateMainTab("play");
  });

  ui.advancedMode.addEventListener("click", () => {
    ui.workspaceModeSetting.value = "advanced";
    activateMainTab("tracks");
  });

  ui.saveSettings.addEventListener("click", saveStudioSettings);
  ui.resetHotkeys.addEventListener("click", resetHotkeys);
  ui.pianoHotkeyEdit.addEventListener("click", beginPianoHotkeyEdit);
  ui.pianoHotkeySave.addEventListener("click", savePianoHotkeys);
  ui.pianoHotkeyCancel.addEventListener("click", cancelPianoHotkeyEdit);
  ui.soundPadHotkeyEdit.addEventListener("click", beginSoundPadHotkeyEdit);
  ui.soundPadHotkeySave.addEventListener("click", saveSoundPadHotkeys);
  ui.soundPadHotkeyCancel.addEventListener("click", cancelSoundPadHotkeyEdit);
  ui.soundPadResetMix.addEventListener("click", resetSoundPadMix);
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
  ui.instrumentSelect.addEventListener("change", () => selectInstrument(ui.instrumentSelect.value));

  ui.transportLoad.addEventListener("click", () => loadTransportProject(ui.projectSelect.value, true));
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
  ui.projectSelect.addEventListener("change", () => {
    if (state.transport.project !== ui.projectSelect.value) {
      ui.transportStatus.textContent = "Project changed. Load preview to refresh audio.";
    }
  });

  updateTransportGain();
  updateTransportPan();
  updateTransportDisplay(0);
  updateAdvancedTransportDisplay(0);
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
      ui.transportLoad.disabled = true;
      ui.transportPlay.disabled = true;
      ui.transportPause.disabled = true;
      ui.transportStop.disabled = true;
      ui.transportStatus.textContent = "Create a NoteScript project from the Project tab.";
    } else {
      ui.transportStatus.textContent = "Select a project and load its preview.";
      ui.projectNameInput.value = state.studio.projects[0];
    }

    ui.workspaceModeSetting.value = studioSettings.workspaceMode || "basic";
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

    ui.soundSelect.innerHTML = "";
    for (const sound of state.sounds) {
      const option = document.createElement("option");
      option.value = sound.id;
      option.textContent = sound.name + " [" + sound.type + "]";
      ui.soundSelect.appendChild(option);
    }

    if (state.sounds.length === 0) {
      const option = document.createElement("option");
      option.value = "";
      option.textContent = "No sound add-ons installed";
      ui.soundSelect.appendChild(option);
      ui.soundSelect.disabled = true;
      ui.engineStatus.classList.add("warn");
    } else {
      ui.soundSelect.addEventListener("change", () => selectSound(ui.soundSelect.value));
      await selectSound(state.sounds[0].id);
    }

    populateInstruments();
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

  if (
    event.target instanceof HTMLInputElement ||
    event.target instanceof HTMLSelectElement ||
    event.target instanceof HTMLButtonElement ||
    event.target instanceof HTMLTextAreaElement
  ) return;

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

  const key = event.key.toLowerCase();

  if (state.sourceMode === "sound" && state.selected?.type === "soundpad") {
    const kitMap = soundPadComputerKeyMap();
    if (!kitMap.has(key)) return;
    event.preventDefault();
    const trigger = kitMap.get(key);
    const pad = ui.soundPads.querySelector('[data-trigger="' + CSS.escape(trigger) + '"]');
    if (pad) triggerPad(trigger, pad);
    return;
  }

  const map = computerKeyMap();
  if (!map.has(key) || state.keyHeld.has(key)) return;

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

  const current = hotkeys();
  const key = event.key.toLowerCase();

  if (keyMatches(event, current.sustain)) {
    event.preventDefault();
    state.spaceSustain = false;
    syncSustain();
    return;
  }

  if (state.sourceMode === "sound" && state.selected?.type === "soundpad") return;

  const map = computerKeyMap();
  if (!map.has(key)) return;
  event.preventDefault();
  state.keyHeld.delete(key);
  noteOff("keyboard:" + key);
});

window.addEventListener("blur", () => {
  state.keyHeld.clear();
  state.spaceSustain = false;
  syncSustain();
  panicAll();
});

window.addEventListener("pagehide", () => {
  if (state.liveReady) {
    navigator.sendBeacon?.("/v1/live/all-notes-off", new Blob(["{}"], { type: "application/json" }));
  }
});

initialize();

