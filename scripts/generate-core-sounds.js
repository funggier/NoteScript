import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { encodeMonoPcm16 } from "../src/sound/wav.js";
import { noteToMidi } from "../src/music.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const rate = 44100;
const TAU = Math.PI * 2;

function write(file, samples) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, encodeMonoPcm16(samples, rate));
}

function frequencyFor(noteName) {
  const midi = noteToMidi(noteName);
  return 440 * Math.pow(2, (midi - 69) / 12);
}

function makeNoise(seed = 0x12345678) {
  let state = seed >>> 0;
  return () => {
    state = (1664525 * state + 1013904223) >>> 0;
    return (state / 0xffffffff) * 2 - 1;
  };
}

function makeBuffer(seconds) {
  return new Float32Array(Math.floor(rate * seconds));
}

function attackRelease(t, seconds, attack = 0.01, release = 0.12) {
  const a = attack <= 0 ? 1 : Math.min(1, t / attack);
  const left = seconds - t;
  const r = release <= 0 ? 1 : Math.min(1, Math.max(0, left) / release);
  return a * r;
}

function piano(noteName, seconds = 2.4) {
  const frequency = frequencyFor(noteName);
  const out = makeBuffer(seconds);
  for (let i = 0; i < out.length; i += 1) {
    const t = i / rate;
    const decay = Math.exp(-2.2 * t);
    out[i] = decay * (
      Math.sin(TAU * frequency * t) * 0.62 +
      Math.sin(TAU * frequency * 2 * t) * 0.22 +
      Math.sin(TAU * frequency * 3 * t) * 0.10
    );
  }
  return out;
}

function electricPiano(noteName, seconds = 3.0) {
  const frequency = frequencyFor(noteName);
  const out = makeBuffer(seconds);
  for (let i = 0; i < out.length; i += 1) {
    const t = i / rate;
    const envelope = (1 - Math.exp(-90 * t)) * Math.exp(-1.35 * t);
    const tremolo = 0.97 + Math.sin(TAU * 4.8 * t) * 0.03;
    const tine = Math.sin(TAU * frequency * 6.97 * t) * Math.exp(-5.2 * t) * 0.08;
    out[i] = tremolo * envelope * (
      Math.sin(TAU * frequency * t) * 0.58 +
      Math.sin(TAU * frequency * 2 * t) * 0.22 +
      Math.sin(TAU * frequency * 3.01 * t) * 0.08
    ) + tine;
  }
  return out;
}

function musicBox(noteName, seconds = 3.2) {
  const frequency = frequencyFor(noteName);
  const out = makeBuffer(seconds);
  for (let i = 0; i < out.length; i += 1) {
    const t = i / rate;
    const envelope = (1 - Math.exp(-160 * t)) * Math.exp(-2.15 * t);
    out[i] = envelope * (
      Math.sin(TAU * frequency * t) * 0.56 +
      Math.sin(TAU * frequency * 2.01 * t) * 0.20 +
      Math.sin(TAU * frequency * 3.99 * t) * 0.11 +
      Math.sin(TAU * frequency * 6.72 * t) * 0.07
    );
  }
  return out;
}

function organ(noteName, seconds = 3.4) {
  const frequency = frequencyFor(noteName);
  const out = makeBuffer(seconds);
  for (let i = 0; i < out.length; i += 1) {
    const t = i / rate;
    const envelope = attackRelease(t, seconds, 0.045, 0.32) * (0.98 - 0.05 * (t / seconds));
    out[i] = envelope * (
      Math.sin(TAU * frequency * t) * 0.47 +
      Math.sin(TAU * frequency * 2 * t) * 0.23 +
      Math.sin(TAU * frequency * 3 * t) * 0.12 +
      Math.sin(TAU * frequency * 4 * t) * 0.07 +
      Math.sin(TAU * frequency * 6 * t) * 0.04
    );
  }
  return out;
}

function synthBass(noteName, seconds = 2.2) {
  const frequency = frequencyFor(noteName);
  const out = makeBuffer(seconds);
  for (let i = 0; i < out.length; i += 1) {
    const t = i / rate;
    const envelope = (1 - Math.exp(-120 * t)) * Math.exp(-1.45 * t);
    let saw = 0;
    for (let harmonic = 1; harmonic <= 6; harmonic += 1) {
      saw += Math.sin(TAU * frequency * harmonic * t) / harmonic;
    }
    out[i] = envelope * (saw * 0.36 + Math.sin(TAU * frequency * 0.5 * t) * 0.20);
  }
  return out;
}

function synthLead(noteName, seconds = 2.6) {
  const frequency = frequencyFor(noteName);
  const out = makeBuffer(seconds);
  for (let i = 0; i < out.length; i += 1) {
    const t = i / rate;
    const envelope = attackRelease(t, seconds, 0.018, 0.28) * Math.exp(-0.18 * t);
    const vibrato = Math.pow(2, (Math.sin(TAU * 5.4 * t) * 0.12) / 12);
    let wave = 0;
    for (let harmonic = 1; harmonic <= 7; harmonic += 1) {
      wave += Math.sin(TAU * frequency * vibrato * harmonic * t) / harmonic;
    }
    out[i] = envelope * wave * 0.38;
  }
  return out;
}

function warmPad(noteName, seconds = 4.2) {
  const frequency = frequencyFor(noteName);
  const out = makeBuffer(seconds);
  for (let i = 0; i < out.length; i += 1) {
    const t = i / rate;
    const envelope = attackRelease(t, seconds, 0.38, 0.72) * 0.78;
    const slow = 0.94 + Math.sin(TAU * 0.22 * t) * 0.06;
    out[i] = envelope * slow * (
      Math.sin(TAU * frequency * 0.996 * t) * 0.26 +
      Math.sin(TAU * frequency * t) * 0.28 +
      Math.sin(TAU * frequency * 1.004 * t) * 0.26 +
      Math.sin(TAU * frequency * 2.001 * t) * 0.10
    );
  }
  return out;
}

function pluck(noteName, seconds = 2.5) {
  const frequency = frequencyFor(noteName);
  const out = makeBuffer(seconds);
  const period = Math.max(2, Math.round(rate / frequency));
  const delay = new Float32Array(period);
  const noise = makeNoise((noteToMidi(noteName) * 2654435761) >>> 0);
  for (let i = 0; i < delay.length; i += 1) delay[i] = noise() * 0.58;

  let index = 0;
  for (let i = 0; i < out.length; i += 1) {
    const current = delay[index];
    const nextIndex = (index + 1) % delay.length;
    const next = delay[nextIndex];
    const damping = 0.996 - Math.min(0.0035, frequency / 200000);
    delay[index] = (current + next) * 0.5 * damping;
    out[i] = current * attackRelease(i / rate, seconds, 0.002, 0.16);
    index = nextIndex;
  }
  return out;
}



function stringPluck(noteName, {
  seconds = 3.0,
  damping = 0.996,
  brightness = 0.7,
  sineMix = 0.12,
  bodyFrequency = 110,
  bodyMix = 0.04,
  seedSalt = 0
} = {}) {
  const frequency = frequencyFor(noteName);
  const out = makeBuffer(seconds);
  const period = Math.max(2, Math.round(rate / frequency));
  const delay = new Float32Array(period);
  const noise = makeNoise(((noteToMidi(noteName) * 2654435761) ^ seedSalt) >>> 0);
  let previous = 0;
  for (let i = 0; i < delay.length; i += 1) {
    const n = noise();
    delay[i] = (n * brightness + previous * (1 - brightness)) * 0.58;
    previous = n;
  }

  let index = 0;
  for (let i = 0; i < out.length; i += 1) {
    const t = i / rate;
    const current = delay[index];
    const nextIndex = (index + 1) % delay.length;
    const next = delay[nextIndex];
    delay[index] = (current + next) * 0.5 * damping;
    const fundamental = Math.sin(TAU * frequency * t) * Math.exp(-2.0 * t) * sineMix;
    const body = Math.sin(TAU * bodyFrequency * t) * Math.exp(-5.0 * t) * bodyMix;
    out[i] = (current * 0.82 + fundamental + body) * attackRelease(t, seconds, 0.002, 0.20);
    index = nextIndex;
  }
  return out;
}

function acousticGuitar(noteName) {
  return stringPluck(noteName, {
    seconds: 3.4,
    damping: 0.9968,
    brightness: 0.82,
    sineMix: 0.10,
    bodyFrequency: 103,
    bodyMix: 0.055,
    seedSalt: 0xa60157
  });
}

function nylonGuitar(noteName) {
  return stringPluck(noteName, {
    seconds: 3.6,
    damping: 0.9972,
    brightness: 0.46,
    sineMix: 0.20,
    bodyFrequency: 92,
    bodyMix: 0.07,
    seedSalt: 0x6e796c6f
  });
}

function cleanElectricGuitar(noteName, seconds = 3.8) {
  const frequency = frequencyFor(noteName);
  const plucked = stringPluck(noteName, {
    seconds,
    damping: 0.9975,
    brightness: 0.60,
    sineMix: 0.10,
    bodyFrequency: 126,
    bodyMix: 0.02,
    seedSalt: 0xe1ec7
  });
  for (let i = 0; i < plucked.length; i += 1) {
    const t = i / rate;
    const shimmer = (
      Math.sin(TAU * frequency * 2 * t) * 0.055 +
      Math.sin(TAU * frequency * 3 * t) * 0.025
    ) * Math.exp(-1.8 * t);
    plucked[i] = (plucked[i] * 0.88 + shimmer) * (0.96 + Math.sin(TAU * 2.8 * t) * 0.04);
  }
  return plucked;
}

function jazzGuitar(noteName, seconds = 3.6) {
  const frequency = frequencyFor(noteName);
  const out = makeBuffer(seconds);
  const plucked = stringPluck(noteName, {
    seconds,
    damping: 0.9960,
    brightness: 0.34,
    sineMix: 0.22,
    bodyFrequency: 118,
    bodyMix: 0.08,
    seedSalt: 0x4a415a5a
  });
  for (let i = 0; i < out.length; i += 1) {
    const t = i / rate;
    out[i] = plucked[i] * 0.82 +
      Math.sin(TAU * frequency * t) * Math.exp(-1.5 * t) * 0.10 +
      Math.sin(TAU * frequency * 2 * t) * Math.exp(-2.3 * t) * 0.035;
  }
  return out;
}

function strings(noteName, seconds = 4.6) {
  const frequency = frequencyFor(noteName);
  const out = makeBuffer(seconds);
  for (let i = 0; i < out.length; i += 1) {
    const t = i / rate;
    const env = attackRelease(t, seconds, 0.32, 0.65) * 0.70;
    let wave = 0;
    for (const detune of [0.994, 1, 1.006]) {
      for (let harmonic = 1; harmonic <= 5; harmonic += 1) {
        wave += Math.sin(TAU * frequency * detune * harmonic * t) / (harmonic * 4.6);
      }
    }
    out[i] = wave * env;
  }
  return out;
}

function flute(noteName, seconds = 3.8) {
  const frequency = frequencyFor(noteName);
  const out = makeBuffer(seconds);
  const noise = makeNoise((0xf17e0000 ^ noteToMidi(noteName)) >>> 0);
  for (let i = 0; i < out.length; i += 1) {
    const t = i / rate;
    const env = attackRelease(t, seconds, 0.075, 0.34) * 0.72;
    const vibrato = Math.pow(2, (Math.sin(TAU * 5.1 * t) * 0.08) / 12);
    const breath = noise() * 0.025 * (0.6 + 0.4 * Math.sin(TAU * 13 * t));
    out[i] = env * (
      Math.sin(TAU * frequency * vibrato * t) * 0.66 +
      Math.sin(TAU * frequency * vibrato * 2 * t) * 0.10 +
      Math.sin(TAU * frequency * vibrato * 3 * t) * 0.035 +
      breath
    );
  }
  return out;
}

function marimba(noteName, seconds = 2.8) {
  const frequency = frequencyFor(noteName);
  const out = makeBuffer(seconds);
  const partials = [
    [1, 0.58, 3.0],
    [3.98, 0.18, 5.3],
    [9.2, 0.10, 7.0],
    [14.4, 0.05, 9.0]
  ];
  for (let i = 0; i < out.length; i += 1) {
    const t = i / rate;
    let value = 0;
    for (const [ratio, amount, decay] of partials) {
      value += Math.sin(TAU * frequency * ratio * t) * amount * Math.exp(-decay * t);
    }
    out[i] = value * attackRelease(t, seconds, 0.002, 0.16);
  }
  return out;
}

function vibraphone(noteName, seconds = 4.0) {
  const frequency = frequencyFor(noteName);
  const out = makeBuffer(seconds);
  for (let i = 0; i < out.length; i += 1) {
    const t = i / rate;
    const tremolo = 0.78 + Math.sin(TAU * 5.6 * t) * 0.22;
    const env = Math.exp(-0.78 * t) * attackRelease(t, seconds, 0.003, 0.35);
    out[i] = tremolo * env * (
      Math.sin(TAU * frequency * t) * 0.47 +
      Math.sin(TAU * frequency * 4.01 * t) * 0.14 +
      Math.sin(TAU * frequency * 10.02 * t) * 0.06
    );
  }
  return out;
}

function choir(noteName, seconds = 4.8) {
  const frequency = frequencyFor(noteName);
  const out = makeBuffer(seconds);
  for (let i = 0; i < out.length; i += 1) {
    const t = i / rate;
    const env = attackRelease(t, seconds, 0.42, 0.82) * 0.63;
    const sway = 1 + Math.sin(TAU * 0.31 * t) * 0.025;
    out[i] = env * (
      Math.sin(TAU * frequency * 0.997 * t) * 0.20 +
      Math.sin(TAU * frequency * 1.003 * t) * 0.20 +
      Math.sin(TAU * frequency * 2 * t) * 0.12 * sway +
      Math.sin(TAU * frequency * 3 * t) * 0.07 +
      Math.sin(TAU * frequency * 4 * t) * 0.035
    );
  }
  return out;
}

function softBrass(noteName, seconds = 4.0) {
  const frequency = frequencyFor(noteName);
  const out = makeBuffer(seconds);
  for (let i = 0; i < out.length; i += 1) {
    const t = i / rate;
    const env = attackRelease(t, seconds, 0.11, 0.42) * (0.88 - 0.08 * (t / seconds));
    const vibrato = 1 + Math.sin(TAU * 4.7 * t) * 0.0022;
    out[i] = env * (
      Math.sin(TAU * frequency * vibrato * t) * 0.42 +
      Math.sin(TAU * frequency * vibrato * 2 * t) * 0.22 +
      Math.sin(TAU * frequency * vibrato * 3 * t) * 0.13 +
      Math.sin(TAU * frequency * vibrato * 4 * t) * 0.075 +
      Math.sin(TAU * frequency * vibrato * 5 * t) * 0.035
    );
  }
  return out;
}

function processBuffer(input, { gain = 1, lowpass = 1, drive = 0 } = {}) {
  const out = new Float32Array(input.length);
  let filtered = 0;
  for (let i = 0; i < input.length; i += 1) {
    filtered += Math.max(0.001, Math.min(1, lowpass)) * (input[i] - filtered);
    const driven = drive > 0 ? Math.tanh(filtered * (1 + drive * 4)) / Math.tanh(1 + drive * 4) : filtered;
    out[i] = driven * gain;
  }
  return out;
}

function electronicKick(seconds = 0.62) {
  const out = makeBuffer(seconds);
  let phase = 0;
  for (let i = 0; i < out.length; i += 1) {
    const t = i / rate;
    const frequency = 48 + 156 * Math.exp(-13 * t);
    phase += TAU * frequency / rate;
    const clickPart = Math.sin(TAU * 2300 * t) * Math.exp(-65 * t) * 0.11;
    out[i] = Math.sin(phase) * Math.exp(-6.4 * t) * 0.92 + clickPart;
  }
  return out;
}

function electronicSnare(seconds = 0.38) {
  const out = makeBuffer(seconds);
  const noise = makeNoise(0xe1ec7a11);
  for (let i = 0; i < out.length; i += 1) {
    const t = i / rate;
    const noisePart = noise() * Math.exp(-14 * t) * 0.38;
    const tone = (
      Math.sin(TAU * 185 * t) * 0.20 +
      Math.sin(TAU * 330 * t) * 0.12
    ) * Math.exp(-11 * t);
    out[i] = noisePart + tone;
  }
  return out;
}

function brushSnare(seconds = 0.62) {
  const out = makeBuffer(seconds);
  const noise = makeNoise(0xb2755a11);
  let previous = 0;
  for (let i = 0; i < out.length; i += 1) {
    const t = i / rate;
    const current = noise();
    const high = current - previous * 0.55;
    previous = current;
    const swell = Math.min(1, t / 0.035) * Math.exp(-5.2 * t);
    out[i] = high * swell * 0.22;
  }
  return out;
}

function kick(seconds = 0.48) {
  const out = makeBuffer(seconds);
  let phase = 0;
  for (let i = 0; i < out.length; i += 1) {
    const t = i / rate;
    const frequency = 42 + 118 * Math.exp(-8.5 * t);
    phase += TAU * frequency / rate;
    const transient = Math.exp(-55 * t) * (i % 2 === 0 ? 0.10 : -0.10);
    out[i] = Math.sin(phase) * Math.exp(-9.5 * t) * 0.88 + transient;
  }
  return out;
}

function snare(seconds = 0.34) {
  const out = makeBuffer(seconds);
  const noise = makeNoise(0x51a4e12d);
  let phase = 0;
  for (let i = 0; i < out.length; i += 1) {
    const t = i / rate;
    phase += TAU * 175 / rate;
    const body = Math.sin(phase) * Math.exp(-15 * t) * 0.25;
    const fizz = noise() * Math.exp(-12 * t) * 0.48;
    out[i] = body + fizz;
  }
  return out;
}

function clap(seconds = 0.30) {
  const out = makeBuffer(seconds);
  const noise = makeNoise(0xc1a90217);
  const bursts = [0, 0.026, 0.052, 0.083];
  for (let i = 0; i < out.length; i += 1) {
    const t = i / rate;
    let envelope = 0;
    for (const burst of bursts) {
      if (t >= burst) envelope += Math.exp(-55 * (t - burst));
    }
    out[i] = noise() * envelope * Math.exp(-3.8 * t) * 0.19;
  }
  return out;
}

function metallicNoise(seconds, seed, decay, amount = 0.32) {
  const out = makeBuffer(seconds);
  const noise = makeNoise(seed);
  let previous = 0;
  for (let i = 0; i < out.length; i += 1) {
    const t = i / rate;
    const current = noise();
    const high = current - previous * 0.84;
    previous = current;
    out[i] = high * Math.exp(-decay * t) * amount;
  }
  return out;
}

function shaker(seconds = 0.18) {
  const out = makeBuffer(seconds);
  const noise = makeNoise(0x12345678);
  let previous = 0;
  for (let i = 0; i < out.length; i += 1) {
    const t = i / rate;
    const current = noise();
    const high = current - previous * 0.72;
    previous = current;
    out[i] = high * Math.exp(-24 * t) * 0.22;
  }
  return out;
}

function tom(startFrequency, seconds = 0.46) {
  const out = makeBuffer(seconds);
  let phase = 0;
  for (let i = 0; i < out.length; i += 1) {
    const t = i / rate;
    const frequency = startFrequency * (0.72 + 0.28 * Math.exp(-8 * t));
    phase += TAU * frequency / rate;
    out[i] = Math.sin(phase) * Math.exp(-7.2 * t) * 0.68;
  }
  return out;
}

function rim(seconds = 0.14) {
  const out = makeBuffer(seconds);
  const noise = makeNoise(0x77221109);
  for (let i = 0; i < out.length; i += 1) {
    const t = i / rate;
    const env = Math.exp(-34 * t);
    out[i] = env * (
      Math.sin(TAU * 1850 * t) * 0.34 +
      Math.sin(TAU * 2470 * t) * 0.22 +
      noise() * 0.12
    );
  }
  return out;
}

function cowbell(seconds = 0.48) {
  const out = makeBuffer(seconds);
  for (let i = 0; i < out.length; i += 1) {
    const t = i / rate;
    const env = Math.exp(-6.5 * t);
    const a = Math.sign(Math.sin(TAU * 540 * t));
    const b = Math.sign(Math.sin(TAU * 800 * t));
    out[i] = (a * 0.24 + b * 0.20) * env;
  }
  return out;
}

function crash(seconds = 1.65) {
  const out = metallicNoise(seconds, 0xca551234, 2.2, 0.28);
  for (let i = 0; i < out.length; i += 1) {
    const t = i / rate;
    out[i] += (
      Math.sin(TAU * 563 * t) +
      Math.sin(TAU * 811 * t) * 0.7 +
      Math.sin(TAU * 1187 * t) * 0.45
    ) * Math.exp(-3.0 * t) * 0.08;
  }
  return out;
}

function ride(seconds = 1.10) {
  const out = metallicNoise(seconds, 0x71de7701, 3.6, 0.13);
  for (let i = 0; i < out.length; i += 1) {
    const t = i / rate;
    const env = Math.exp(-3.2 * t);
    out[i] += (
      Math.sin(TAU * 742 * t) * 0.22 +
      Math.sin(TAU * 1113 * t) * 0.14 +
      Math.sin(TAU * 1489 * t) * 0.09
    ) * env;
  }
  return out;
}

function chime(seconds = 1.50) {
  const out = makeBuffer(seconds);
  const base = 1046.5;
  for (let i = 0; i < out.length; i += 1) {
    const t = i / rate;
    const env = (1 - Math.exp(-150 * t)) * Math.exp(-2.8 * t);
    out[i] = env * (
      Math.sin(TAU * base * t) * 0.40 +
      Math.sin(TAU * base * 2.01 * t) * 0.20 +
      Math.sin(TAU * base * 3.94 * t) * 0.10
    );
  }
  return out;
}

function click(seconds = 0.075) {
  const out = makeBuffer(seconds);
  const noise = makeNoise(0xc11c7777);
  for (let i = 0; i < out.length; i += 1) {
    const t = i / rate;
    out[i] = (
      Math.sin(TAU * 2100 * t) * 0.36 +
      noise() * 0.16
    ) * Math.exp(-70 * t);
  }
  return out;
}

function laser(seconds = 0.62) {
  const out = makeBuffer(seconds);
  let phase = 0;
  for (let i = 0; i < out.length; i += 1) {
    const t = i / rate;
    const p = t / seconds;
    const frequency = 1400 * Math.pow(0.12, p) + 90;
    phase += TAU * frequency / rate;
    out[i] = Math.sin(phase) * Math.exp(-2.6 * t) * 0.46;
  }
  return out;
}

function impact(seconds = 1.15) {
  const out = makeBuffer(seconds);
  const noise = makeNoise(0x1a4ac777);
  let phase = 0;
  let previous = 0;
  for (let i = 0; i < out.length; i += 1) {
    const t = i / rate;
    const frequency = 58 + 36 * Math.exp(-7 * t);
    phase += TAU * frequency / rate;
    const n = noise();
    const lowNoise = previous * 0.94 + n * 0.06;
    previous = lowNoise;
    out[i] =
      Math.sin(phase) * Math.exp(-3.8 * t) * 0.58 +
      lowNoise * Math.exp(-2.8 * t) * 0.26;
  }
  return out;
}

const pitchedPacks = [
  { id: "piano", notes: ["C3", "C4", "E4", "G4", "C5"], synth: piano },
  { id: "electric-piano", notes: ["C3", "C4", "E4", "G4", "C5"], synth: electricPiano },
  { id: "music-box", notes: ["C3", "C4", "E4", "G4", "C5"], synth: musicBox },
  { id: "organ", notes: ["C3", "C4", "E4", "G4", "C5"], synth: organ },
  { id: "synth-bass", notes: ["C2", "C3", "C4", "E4", "G4"], synth: synthBass },
  { id: "synth-lead", notes: ["C3", "C4", "E4", "G4", "C5"], synth: synthLead },
  { id: "warm-pad", notes: ["C3", "C4", "E4", "G4", "C5"], synth: warmPad },
  { id: "pluck", notes: ["C3", "C4", "E4", "G4", "C5"], synth: pluck },
  { id: "acoustic-guitar", notes: ["C3", "C4", "E4", "G4", "C5"], synth: acousticGuitar },
  { id: "nylon-guitar", notes: ["C3", "C4", "E4", "G4", "C5"], synth: nylonGuitar },
  { id: "clean-electric-guitar", notes: ["C3", "C4", "E4", "G4", "C5"], synth: cleanElectricGuitar },
  { id: "jazz-guitar", notes: ["C3", "C4", "E4", "G4", "C5"], synth: jazzGuitar },
  { id: "strings", notes: ["C3", "C4", "E4", "G4", "C5"], synth: strings },
  { id: "flute", notes: ["C3", "C4", "E4", "G4", "C5"], synth: flute },
  { id: "marimba", notes: ["C3", "C4", "E4", "G4", "C5"], synth: marimba },
  { id: "vibraphone", notes: ["C3", "C4", "E4", "G4", "C5"], synth: vibraphone },
  { id: "choir", notes: ["C3", "C4", "E4", "G4", "C5"], synth: choir },
  { id: "soft-brass", notes: ["C3", "C4", "E4", "G4", "C5"], synth: softBrass }
];

for (const pack of pitchedPacks) {
  const dir = path.join(root, "examples", "sounds", "soundpiano", pack.id);
  for (const note of pack.notes) write(path.join(dir, note + ".wav"), pack.synth(note));
}

const coreSoundPad = {
  kick: kick(),
  snare: snare(),
  clap: clap(),
  "closed-hat": metallicNoise(0.11, 0xc105ed11, 32, 0.18),
  "open-hat": metallicNoise(0.55, 0x0a4e4a71, 7.5, 0.18),
  shaker: shaker(),
  "tom-low": tom(128),
  "tom-high": tom(205),
  rim: rim(),
  cowbell: cowbell(),
  crash: crash(),
  ride: ride(),
  chime: chime(),
  click: click(),
  laser: laser(),
  impact: impact()
};

const soundPadSets = {
  soundpad: coreSoundPad,
  "acoustic-drums": {
    kick: processBuffer(kick(0.58), { gain: 0.92, lowpass: 0.42 }),
    snare: processBuffer(snare(0.42), { gain: 0.90, lowpass: 0.72 }),
    clap: processBuffer(clap(0.34), { gain: 0.72, lowpass: 0.78 }),
    "closed-hat": processBuffer(metallicNoise(0.13, 0xac051111, 29, 0.17), { gain: 0.88, lowpass: 0.75 }),
    "open-hat": processBuffer(metallicNoise(0.68, 0xac052222, 6.4, 0.17), { gain: 0.88, lowpass: 0.78 }),
    shaker: processBuffer(shaker(0.22), { gain: 0.85, lowpass: 0.82 }),
    "tom-low": processBuffer(tom(112, 0.60), { gain: 0.92, lowpass: 0.55 }),
    "tom-high": processBuffer(tom(176, 0.52), { gain: 0.90, lowpass: 0.60 }),
    rim: processBuffer(rim(0.17), { gain: 0.82, lowpass: 0.82 }),
    cowbell: processBuffer(cowbell(0.54), { gain: 0.72, lowpass: 0.72 }),
    crash: processBuffer(crash(1.85), { gain: 0.82, lowpass: 0.82 }),
    ride: processBuffer(ride(1.35), { gain: 0.82, lowpass: 0.84 }),
    chime: processBuffer(chime(1.60), { gain: 0.72, lowpass: 0.85 }),
    click: processBuffer(click(0.09), { gain: 0.75, lowpass: 0.80 }),
    laser: processBuffer(laser(0.62), { gain: 0.42, lowpass: 0.36 }),
    impact: processBuffer(impact(1.25), { gain: 0.78, lowpass: 0.45 })
  },
  "brush-drums": {
    kick: processBuffer(kick(0.52), { gain: 0.52, lowpass: 0.30 }),
    snare: brushSnare(),
    clap: processBuffer(brushSnare(0.42), { gain: 0.62, lowpass: 0.90 }),
    "closed-hat": processBuffer(metallicNoise(0.16, 0xb2751111, 24, 0.11), { gain: 0.56, lowpass: 0.62 }),
    "open-hat": processBuffer(metallicNoise(0.72, 0xb2752222, 5.6, 0.10), { gain: 0.54, lowpass: 0.66 }),
    shaker: processBuffer(shaker(0.30), { gain: 0.58, lowpass: 0.74 }),
    "tom-low": processBuffer(tom(108, 0.58), { gain: 0.48, lowpass: 0.38 }),
    "tom-high": processBuffer(tom(168, 0.50), { gain: 0.46, lowpass: 0.42 }),
    rim: processBuffer(rim(0.19), { gain: 0.44, lowpass: 0.58 }),
    cowbell: processBuffer(cowbell(0.56), { gain: 0.38, lowpass: 0.50 }),
    crash: processBuffer(crash(1.80), { gain: 0.40, lowpass: 0.58 }),
    ride: processBuffer(ride(1.55), { gain: 0.50, lowpass: 0.62 }),
    chime: processBuffer(chime(1.70), { gain: 0.46, lowpass: 0.68 }),
    click: processBuffer(click(0.10), { gain: 0.38, lowpass: 0.55 }),
    laser: processBuffer(brushSnare(0.48), { gain: 0.30, lowpass: 0.48 }),
    impact: processBuffer(impact(1.10), { gain: 0.34, lowpass: 0.28 })
  },
  "electronic-drums": {
    kick: electronicKick(),
    snare: electronicSnare(),
    clap: processBuffer(clap(0.34), { gain: 0.96, lowpass: 0.94, drive: 0.18 }),
    "closed-hat": processBuffer(metallicNoise(0.09, 0xe1ec1111, 42, 0.22), { gain: 0.90, lowpass: 0.96, drive: 0.08 }),
    "open-hat": processBuffer(metallicNoise(0.46, 0xe1ec2222, 9.0, 0.21), { gain: 0.90, lowpass: 0.96, drive: 0.08 }),
    shaker: processBuffer(shaker(0.16), { gain: 0.82, lowpass: 0.94, drive: 0.05 }),
    "tom-low": processBuffer(tom(104, 0.62), { gain: 0.90, lowpass: 0.68, drive: 0.18 }),
    "tom-high": processBuffer(tom(224, 0.48), { gain: 0.88, lowpass: 0.72, drive: 0.15 }),
    rim: processBuffer(rim(0.12), { gain: 0.96, lowpass: 0.96, drive: 0.18 }),
    cowbell: processBuffer(cowbell(0.40), { gain: 0.86, lowpass: 0.92, drive: 0.14 }),
    crash: processBuffer(crash(1.25), { gain: 0.84, lowpass: 0.94, drive: 0.08 }),
    ride: processBuffer(ride(0.90), { gain: 0.82, lowpass: 0.96, drive: 0.08 }),
    chime: processBuffer(chime(1.20), { gain: 0.80, lowpass: 0.96, drive: 0.05 }),
    click: processBuffer(click(0.06), { gain: 0.96, lowpass: 1, drive: 0.22 }),
    laser: processBuffer(laser(0.76), { gain: 0.92, lowpass: 1, drive: 0.12 }),
    impact: processBuffer(impact(1.30), { gain: 0.92, lowpass: 0.78, drive: 0.22 })
  },
  "lofi-drums": Object.fromEntries(
    Object.entries(coreSoundPad).map(([name, samples]) => [
      name,
      processBuffer(samples, {
        gain: ["kick", "snare"].includes(name) ? 0.74 : 0.58,
        lowpass: ["kick", "tom-low", "tom-high", "impact"].includes(name) ? 0.18 : 0.24,
        drive: 0.08
      })
    ])
  )
};

for (const [setId, set] of Object.entries(soundPadSets)) {
  const dir = path.join(root, "examples", "sounds", "soundpad", setId);
  for (const [name, samples] of Object.entries(set)) {
    write(path.join(dir, name + ".wav"), samples);
  }
}

const sfzSample = path.join(root, "examples", "instruments", "SFZ", "basic-sfz", "placeholder.wav");
write(sfzSample, piano("C4"));

console.log(
  "Generated deterministic core sound library: " +
  pitchedPacks.length + " pitched packs + " +
  Object.keys(soundPadSets).length + " SoundPad sets x " +
  Object.keys(coreSoundPad).length + " triggers + SFZ baseline."
);
