// A restrained modal-filter approximation of sympathetic piano-string resonance.
// It responds to harmonic energy *already present* in each recorded note.
// Unlike a simple delay/reverb, its filters are tuned to the frequencies of
// undamped piano strings. It does not reproduce a measured acoustic soundboard.
export const DEFAULT_PIANO_RESONANCE = Object.freeze({
  enabled: false,
  level: 28
});

export function normalizePianoResonance(value) {
  const level = Number(value?.level);
  return {
    enabled: value?.enabled === true,
    level: Number.isFinite(level)
      ? Math.max(0, Math.min(100, Math.round(level)))
      : DEFAULT_PIANO_RESONANCE.level
  };
}

export function pianoResonatorModes() {
  // 61 notes, spanning a practical piano register (C2-C7).
  // The near-harmonic energy of struck notes excites overlapping modes.
  const modes = [];
  for (let midi = 36; midi <= 96; midi++) {
    const frequency = 440 * Math.pow(2, (midi - 69) / 12);
    // Keep the bandwidth narrow without sending the filter Q to extremes.
    // Higher frequencies need a higher Q for a similar audible decay.
    const q = Math.min(900, Math.max(160, frequency * 0.82));
    modes.push({ midi, frequency, q });
  }
  return modes;
}

function ramp(parameter, value, time, constant) {
  parameter.cancelScheduledValues(time);
  parameter.setTargetAtTime(value, time, constant);
}

export class PianoSympatheticResonance {
  constructor(context, destination) {
    this.context = context;
    this.input = context.createGain();
    this.input.gain.value = 0;
    this.wet = context.createGain();
    this.wet.gain.value = 0;
    this.wet.connect(destination);
    this.filters = [];
    for (const mode of pianoResonatorModes()) {
      const filter = context.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = mode.frequency;
      filter.Q.value = mode.q;
      this.input.connect(filter);
      filter.connect(this.wet);
      this.filters.push(filter);
    }
  }

  update(options, pedalValue, applicable = true) {
    const settings = normalizePianoResonance(options);
    const pedal = Math.max(0, Math.min(127, Number(pedalValue) || 0)) / 127;
    const active = applicable && settings.enabled && settings.level > 0 && pedal > 0;
    const now = this.context.currentTime;
    // Wet path is intentionally conservative to avoid resonant peaks and
    // preserve the attack/dynamics of the dry sample and the master compressor.
    ramp(this.input.gain, active ? 1 : 0, now, 0.012);
    ramp(this.wet.gain, active ? (settings.level / 100) * pedal * 0.11 : 0, now, active ? 0.045 : 0.11);
  }

  mute() {
    const now = this.context.currentTime;
    this.input.gain.cancelScheduledValues(now);
    this.wet.gain.cancelScheduledValues(now);
    this.input.gain.setValueAtTime(0, now);
    this.wet.gain.setValueAtTime(0, now);
  }

  disconnect() {
    this.mute();
    this.input.disconnect();
    for (const filter of this.filters) filter.disconnect();
    this.wet.disconnect();
    this.filters.length = 0;
  }
}
