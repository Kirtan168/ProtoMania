/**
 * PROTOMANIA Dumbbell Impact Audio Engine (v7.2 — Pure Synchronous Web Audio API)
 * 
 * Guarantees:
 * 1. ZERO ghost sounds on replay: Never queues or schedules playback on a suspended context
 * 2. ZERO delayed sounds after intro: playSlam() is 100% synchronous and guarded by isIntroActive
 * 3. Instant cutoff (<15ms) on stopAll() or skip
 * 4. Single impact thud only, synchronized with physical visual contact
 */

class CinematicAudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.isMuted = false;
    this.impactBuffer = null;
    this.activeSource = null;
    this.audioUrl = '/static/audio/dumbbell_impact.wav';
    this.isPreloaded = false;
    this.isIntroActive = false;

    // Start background asset preloading
    this.preloadPromise = this.preload();

    // Auto-resume on user interactions anywhere across the window
    const unlockOnGesture = async () => {
      await this.resume();
      if (this.ctx && this.ctx.state === 'running') {
        ['pointerdown', 'mousedown', 'keydown', 'touchstart', 'click'].forEach(evt => {
          window.removeEventListener(evt, unlockOnGesture, { capture: true });
        });
      }
    };
    ['pointerdown', 'mousedown', 'keydown', 'touchstart', 'click'].forEach(evt => {
      window.addEventListener(evt, unlockOnGesture, { capture: true, passive: true });
    });
  }

  ensureContext() {
    if (!this.ctx || this.ctx.state === 'closed') {
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
      } catch (e) {}
    }
  }

  setMuted(muted) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      try {
        const now = this.ctx.currentTime;
        this.masterGain.gain.cancelScheduledValues(now);
        this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
        this.masterGain.gain.linearRampToValueAtTime(muted ? 0 : 1.0, now + 0.04);
      } catch (e) {}
    }
  }

  stopAll() {
    // 1. Immediately cut off any running Web Audio source
    if (this.activeSource) {
      try {
        this.activeSource.stop(0);
        this.activeSource.disconnect();
      } catch (e) {}
      this.activeSource = null;
    }

    // 2. Mute gain node immediately so no sound leaks
    if (this.ctx && this.masterGain) {
      try {
        const now = this.ctx.currentTime;
        this.masterGain.gain.cancelScheduledValues(now);
        this.masterGain.gain.setValueAtTime(0, now);
        if (!this.isMuted) {
          this.masterGain.gain.setValueAtTime(1.0, now + 0.05);
        }
      } catch (e) {}
    }
  }

  async preload() {
    if (this.isPreloaded) return;
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
      console.warn("Audio preload error:", err);
    }
  }

  // Pure Dumbbell Impact Thud (strictly synchronous, ZERO ghost queue, ZERO delayed playback)
  playSlam() {
    if (this.isMuted) return;
    if (!this.isIntroActive) {
      // Never play slam if intro has already ended!
      return;
    }

    // Clean up any previously active sound source
    this.stopAll();

    const ctx = this.ensureContext();
    if (!ctx) return;

    // CRITICAL: Strictly check state without awaiting!
    // Awaiting ctx.resume() here causes the browser to hold a pending async frame
    // that resolves minutes later on user scroll/click, playing sound after intro is over!
    if (ctx.state !== 'running') {
      console.warn("AudioContext suspended by browser autoplay policy. Skipping to prevent delayed ghost sounds.");
      return;
    }

    if (!this.impactBuffer) {
      console.warn("Impact audio buffer not decoded yet.");
      return;
    }

    try {
      const source = ctx.createBufferSource();
      source.buffer = this.impactBuffer;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(1.0, ctx.currentTime);

      source.connect(gain);
      gain.connect(this.masterGain);

      source.start(0);
      this.activeSource = source;
      source.onended = () => {
        if (this.activeSource === source) {
          try {
            source.disconnect();
          } catch (e) {}
          this.activeSource = null;
        }
      };
    } catch (err) {
      console.warn("WebAudio playback error:", err);
    }
  }

  playAnticipation() {}
  playWhoosh() {}
  playDoorOpen() {}
  playRevealAccent() {}
}

export const introAudio = new CinematicAudioEngine();
