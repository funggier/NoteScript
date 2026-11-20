// A physical key binding is a held-note identity, not a lifetime identifier for audio.
// Released notes can continue to ring (sustain or release tail) while the same key is struck again.
export class PianoVoiceRegistry {
  constructor() {
    this.held = new Map();
    this.pending = new Map();
    this.pendingAll = new Set();
    this.sounding = new Set();
    this.sustained = new Set();
  }

  begin(id) {
    if (this.held.has(id) || this.pending.has(id)) return null;
    const request = { id, released: false, sustain: false, cancelled: false };
    this.pending.set(id, request);
    this.pendingAll.add(request);
    return request;
  }

  start(request, voice) {
    if (request.cancelled || !this.pendingAll.has(request)) return false;
    this.finish(request);
    this.sounding.add(voice);
    if (!request.released) this.held.set(request.id, voice);
    else if (request.sustain) this.sustained.add(voice);
    return true;
  }

  finish(request) {
    this.pendingAll.delete(request);
    if (this.pending.get(request.id) === request) this.pending.delete(request.id);
  }

  noteOff(id, sustain) {
    const voice = this.held.get(id);
    if (voice) {
      this.held.delete(id);
      if (sustain) this.sustained.add(voice);
      return { voice, sustain };
    }

    const request = this.pending.get(id);
    if (!request) return null;
    this.pending.delete(id);
    request.released = true;
    request.sustain = Boolean(sustain);
    return { request, sustain };
  }

  releaseSustained() {
    // A delayed sample must not start sustained after the pedal has already lifted.
    for (const request of this.pendingAll) {
      if (request.released) request.sustain = false;
    }
    const voices = [...this.sustained];
    this.sustained.clear();
    return voices;
  }

  cleanup(voice) {
    if (this.held.get(voice.id) === voice) this.held.delete(voice.id);
    this.sustained.delete(voice);
    this.sounding.delete(voice);
  }

  stop() {
    for (const request of this.pendingAll) request.cancelled = true;
    this.pendingAll.clear();
    this.pending.clear();
    this.held.clear();
    this.sustained.clear();
    return [...this.sounding];
  }
}
