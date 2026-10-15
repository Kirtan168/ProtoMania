/**
 * PROTOMANIA Dumbbell Impact Audio Engine (v4.0 — Pure Thud)
 * 
 * - Only the single, pure, heavy thud of the dumbbell impact
 * - Pre-trimmed: Starts directly on the heavy impact waveform (zero pre-pop, zero bounce)
 * - Completely silent door sliding
 * - Completely silent anticipation & reveal
 * - Instant cutoff (<20ms) on skip [Esc]
 */

class CinematicAudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.isMuted = false;
    this.activeSources = [];
    this.impactBuffer = null;
    this.isPreloaded = false;

    // Single dedicated sound: Pure heavy dumbbell thud (zero pre-pop, zero bounce)
    this.audioUrl = '/static/audio/dumbbell_impact.wav';

    this.preload();
  }

  ensureContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 1.0, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    return this.ctx;
  }

  isAutoplayBlocked() {
    if (!this.ctx) return true;
    return this.ctx.state === "suspended";
  }

  async resume() {
    this.ensureContext();
    if (this.ctx && this.ctx.state === "suspended") {
      try {
        await this.ctx.resume();
      } catch (e) {
        console.warn("Audio resume deferred:", e);
      }
    }
  }

  setMuted(muted) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
      this.masterGain.gain.linearRampToValueAtTime(muted ? 0 : 1.0, now + 0.04);
    }
  }

  stopAll() {
    if (this.ctx && this.masterGain) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.linearRampToValueAtTime(0, now + 0.02);
    }
    this.activeSources.forEach(s => {
      try {
        if (s.stop) s.stop();
        if (s.disconnect) s.disconnect();
      } catch (e) {}
    });
    this.activeSources = [];
  }

  async preload() {
    if (this.isPreloaded) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    try {
      const resp = await fetch(this.audioUrl);
      if (!resp.ok) return;
      const arrayBuf = await resp.arrayBuffer();
      this.impactBuffer = await ctx.decodeAudioData(arrayBuf);
      this.isPreloaded = true;
    } catch (err) {
      // Fallback to procedural thud if offline or blocked
    }
  }

  // Pure Dumbbell Impact Thud (starts instantly at contact, zero pre-pop, zero bounce)
  playSlam() {
    const ctx = this.ensureContext();
    if (!ctx || this.isMuted) return;

    if (this.impactBuffer) {
      const source = ctx.createBufferSource();
      source.buffer = this.impactBuffer;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(1.0, ctx.currentTime);

      source.connect(gain);
      gain.connect(this.masterGain);

      // Start cleanly at offset 0 (pre-trimmed pure thud)
      source.start(ctx.currentTime, 0);

      this.activeSources.push(source);
      source.onended = () => {
        const idx = this.activeSources.indexOf(source);
        if (idx !== -1) this.activeSources.splice(idx, 1);
      };
      return;
    }

    // Procedural Fallback if asset delayed
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(80, now);
    osc.frequency.exponentialRampToValueAtTime(28, now + 0.35);

    gain.gain.setValueAtTime(1.0, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.5);
    this.activeSources.push(osc);
  }

  // All other events are completely silent
  playAnticipation() {}
  playWhoosh() {}
  playDoorOpen() {}
  playRevealAccent() {}
}

export const introAudio = new CinematicAudioEngine();
