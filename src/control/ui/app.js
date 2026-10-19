const ui = {
  engineStatus: document.querySelector("#engineStatus"),
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
  midiAccess: null
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

  try {
    const [health, capabilities, soundsData, instrumentsData] = await Promise.all([
      api("/v1/health"),
      api("/v1/capabilities"),
      api("/v1/sounds?details=1"),
      api("/v1/instruments")
    ]);

    state.capabilities = capabilities;
    state.sounds = soundsData.sounds || [];
    state.instruments = instrumentsData.instruments || [];

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
  if (event.target instanceof HTMLInputElement || event.target instanceof HTMLSelectElement) return;

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
