/**
 * PROTOMANIA Dumbbell Impact Audio Engine (v5.0 — Dual-Engine Instant Playback)
 * 
 * - Dual Engine: High-fidelity Web Audio API + Instant Native HTML5 Audio Fallback
 * - Pre-warmed & Preloaded on first page load (eliminates first-visit silence)
 * - Auto-resumes AudioContext on impact slam if suspended
 * - Single dedicated sound: Pure heavy dumbbell thud (zero pre-pop, zero bounce)
 * - Completely silent door sliding, anticipation, and reveal
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
    this.audioUrl = '/static/audio/dumbbell_impact.wav';
    this.html5Audio = null;

    // Start background asset preloading immediately
    this.preloadPromise = this.preload();
  }

  ensureContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return null;
      try {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 1.0, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      } catch (e) {
        console.warn("AudioContext init deferred:", e);
      }
    }
    return this.ctx;
  }

  isAutoplayBlocked() {
    if (!this.ctx) return true;
    return this.ctx.state === "suspended";
  }

  async resume() {
    const ctx = this.ensureContext();
    if (ctx && ctx.state === "suspended") {
      try {
        await ctx.resume();
      } catch (e) {
        // Handled silently
      }
    }
    // Also prime HTML5 Audio element
    const elem = document.getElementById('global-intro-slam-audio') || this.html5Audio;
    if (elem) {
      try {
        elem.load();
      } catch (e) {}
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
    const elem = document.getElementById('global-intro-slam-audio') || this.html5Audio;
    if (elem) {
      elem.muted = muted;
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

    const elem = document.getElementById('global-intro-slam-audio') || this.html5Audio;
    if (elem) {
      try {
        elem.pause();
        elem.currentTime = 0;
      } catch (e) {}
    }
  }

  async preload() {
    if (this.isPreloaded) return;

    // 1. Initialize HTML5 Audio instance for instant native decoding
    try {
      this.html5Audio = new Audio(this.audioUrl);
      this.html5Audio.preload = 'auto';
      this.html5Audio.volume = this.isMuted ? 0 : 1.0;
      this.html5Audio.load();
    } catch (e) {}

    // 2. Fetch and decode audio buffer for Web Audio API
    try {
      const resp = await fetch(this.audioUrl);
      if (!resp.ok) return;
      const arrayBuf = await resp.arrayBuffer();
      const ctx = this.ensureContext();
      if (ctx) {
        this.impactBuffer = await ctx.decodeAudioData(arrayBuf);
        this.isPreloaded = true;
      }
    } catch (err) {
      // Offline or deferred decode
    }
  }

  // Pure Dumbbell Impact Thud (starts instantly at contact, zero pre-pop, zero bounce)
  async playSlam() {
    if (this.isMuted) return;

    const ctx = this.ensureContext();
    if (ctx && ctx.state === 'suspended') {
      try {
        await ctx.resume();
      } catch (e) {}
    }

    // If buffer is still in-flight, give it a tiny 100ms window to complete
    if (!this.impactBuffer && this.preloadPromise) {
      try {
        await Promise.race([
          this.preloadPromise,
          new Promise(r => setTimeout(r, 100))
        ]);
      } catch (e) {}
    }

    let played = false;

    // Primary: Web Audio API (sample-accurate, hardware gain)
    if (ctx && ctx.state === 'running' && this.impactBuffer) {
      try {
        const source = ctx.createBufferSource();
        source.buffer = this.impactBuffer;

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(1.0, ctx.currentTime);

        source.connect(gain);
        gain.connect(this.masterGain);

        source.start(ctx.currentTime, 0);
        this.activeSources.push(source);
        source.onended = () => {
          const idx = this.activeSources.indexOf(source);
          if (idx !== -1) this.activeSources.splice(idx, 1);
        };
        played = true;
      } catch (err) {
        console.warn("WebAudio slam failed:", err);
      }
    }

    // Secondary / Fallback: Native HTML5 Audio
    if (!played) {
      const elem = document.getElementById('global-intro-slam-audio') || this.html5Audio;
      if (elem) {
        try {
          elem.currentTime = 0;
          elem.volume = this.isMuted ? 0 : 1.0;
          const playPromise = elem.play();
          if (playPromise !== undefined) {
            playPromise.then(() => {
              played = true;
            }).catch(e => {
              console.warn("HTML5 audio playback blocked by browser:", e);
            });
          }
        } catch (e) {}
      }
    }
  }

  // All other events are completely silent
  playAnticipation() {}
  playWhoosh() {}
  playDoorOpen() {}
  playRevealAccent() {}
}

export const introAudio = new CinematicAudioEngine();
