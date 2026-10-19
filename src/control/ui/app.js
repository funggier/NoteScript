const ui = {
  engineStatus: document.querySelector("#engineStatus"),
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
  selectedDetails: document.querySelector("#selectedDetails"),
  voiceCount: document.querySelector("#voiceCount"),
  pianoView: document.querySelector("#pianoView"),
  kitView: document.querySelector("#kitView"),
  keyboard: document.querySelector("#keyboard"),
  pads: document.querySelector("#pads"),
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

const COMPUTER_KEYS = new Map([
  ["a", 0], ["w", 1], ["s", 2], ["e", 3], ["d", 4],
  ["f", 5], ["t", 6], ["g", 7], ["y", 8], ["h", 9],
  ["u", 10], ["j", 11], ["k", 12]
]);

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
  ui.voiceCount.textContent = count + (count === 1 ? " voice" : " voices");
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
  if (!state.selected || state.selected.type !== "kit") return;
  try {
    const context = ensureAudio();
    const buffer = await loadTriggerBuffer(state.selected.id, trigger);
    const source = context.createBufferSource();
    const gain = context.createGain();
    source.buffer = buffer;
    gain.gain.value = Math.max(0.0001, Math.pow(state.velocity / 127, 1.35));
    source.connect(gain);
    gain.connect(context.destination);
    element.classList.add("active");
    source.onended = () => element.classList.remove("active");
    source.start();
    setMonitor("Trigger: " + trigger);
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
    key.innerHTML = '<span class="note-label">' + noteName(midi) + "</span>";
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
    key.innerHTML = '<span class="note-label">' + noteName(midi) + "</span>";
    attachPointerKey(key, midi);
    ui.keyboard.appendChild(key);
  }
}

function attachPointerKey(element, midi) {
  let activePointerId = null;

  element.addEventListener("pointerdown", (event) => {
    event.preventDefault();
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
  ui.pads.innerHTML = "";
  for (const trigger of pack.triggers) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "pad";
    button.textContent = trigger;
    button.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      triggerPad(trigger, button);
    });
    ui.pads.appendChild(button);
  }
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
    ui.kitView.classList.add("hidden");
    setMonitor("Ready. Play with mouse, computer keyboard, or MIDI.");
  } else {
    ui.pianoView.classList.add("hidden");
    ui.kitView.classList.remove("hidden");
    buildPads(pack);
    setMonitor("Ready. Click a pad to audition a trigger.");
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
  ui.kitView.classList.add("hidden");

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

async function initialize() {
  buildPiano();

  ui.velocity.addEventListener("input", () => {
    state.velocity = Number.parseInt(ui.velocity.value, 10);
    ui.velocityValue.value = String(state.velocity);
    ui.velocityValue.textContent = String(state.velocity);
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
  ui.projectSelect.addEventListener("change", () => {
    if (state.transport.project !== ui.projectSelect.value) {
      ui.transportStatus.textContent = "Project changed. Load preview to refresh audio.";
    }
  });

  updateTransportGain();
  updateTransportPan();
  updateTransportDisplay(0);
  ui.outputDevice.innerHTML = '<option value="">Default browser output</option>';

  try {
    const [health, capabilities, projectsData, soundsData, instrumentsData] = await Promise.all([
      api("/v1/health"),
      api("/v1/capabilities"),
      api("/v1/projects"),
      api("/v1/sounds?details=1"),
      api("/v1/instruments")
    ]);

    state.capabilities = capabilities;
    state.sounds = soundsData.sounds || [];
    state.instruments = instrumentsData.instruments || [];

    const projects = projectsData.projects || [];
    ui.projectSelect.innerHTML = "";
    if (projects.length === 0) {
      const option = document.createElement("option");
      option.value = "";
      option.textContent = "No projects found";
      ui.projectSelect.appendChild(option);
      ui.projectSelect.disabled = true;
      ui.transportLoad.disabled = true;
      ui.transportPlay.disabled = true;
      ui.transportPause.disabled = true;
      ui.transportStop.disabled = true;
      ui.transportStatus.textContent = "Put NoteScript .md files in the projects folder.";
    } else {
      for (const project of projects) {
        const option = document.createElement("option");
        option.value = project;
        option.textContent = project;
        ui.projectSelect.appendChild(option);
      }
      ui.transportStatus.textContent = "Select a project and load its preview.";
    }

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
  if (
    event.target instanceof HTMLInputElement ||
    event.target instanceof HTMLSelectElement ||
    event.target instanceof HTMLButtonElement ||
    event.target instanceof HTMLTextAreaElement
  ) return;

  const key = event.key.toLowerCase();

  if (key === "z") {
    event.preventDefault();
    state.octaveShift -= 1;
    updateOctave();
    return;
  }
  if (key === "x") {
    event.preventDefault();
    state.octaveShift += 1;
    updateOctave();
    return;
  }
  if (event.code === "Space") {
    event.preventDefault();
    state.spaceSustain = true;
    syncSustain();
    return;
  }

  if (!COMPUTER_KEYS.has(key) || state.keyHeld.has(key)) return;
  event.preventDefault();
  state.keyHeld.add(key);
  const midi = baseComputerMidi() + COMPUTER_KEYS.get(key);
  noteOn(midi, "keyboard:" + key);
});

window.addEventListener("keyup", (event) => {
  const key = event.key.toLowerCase();

  if (event.code === "Space") {
    event.preventDefault();
    state.spaceSustain = false;
    syncSustain();
    return;
  }

  if (!COMPUTER_KEYS.has(key)) return;
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
