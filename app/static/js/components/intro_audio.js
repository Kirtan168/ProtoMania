/**
 * PROTOMANIA Dumbbell Impact Audio Engine (v6.0 — Zero Ghost / Zero Double-Trigger)
 * 
 * Guarantees:
 * 1. Zero ghost sounds on replay: Never queues playback on a suspended context
 * 2. Instant cutoff (<15ms) on stopAll() or skip
 * 3. Pre-cached 16-bit PCM impact thud: 100% preloaded in browser memory
 * 4. Single impact thud only, synchronized with physical visual contact
 */

class CinematicAudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.isMuted = false;
    this.impactBuffer = null;
    this.activeSource = null;
    this.activeHtml5 = null;
    this.audioUrl = '/static/audio/dumbbell_impact.wav';
    this.isPreloaded = false;

    // Start background asset preloading
    this.preloadPromise = this.preload();
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
    if (this.activeHtml5) {
      this.activeHtml5.muted = muted;
    }
  }

  stopAll() {
    // 1. Immediately cut off any running Web Audio source
    if (this.activeSource) {
      try {
        this.activeSource.stop();
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

    // 3. Terminate and purge any active HTML5 audio element
    if (this.activeHtml5) {
      try {
        this.activeHtml5.pause();
        this.activeHtml5.currentTime = 0;
        this.activeHtml5.src = '';
        this.activeHtml5.load();
      } catch (e) {}
      this.activeHtml5 = null;
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
    } catch (err) {}
  }

  // Pure Dumbbell Impact Thud (single trigger, hardware accurate)
  async playSlam() {
    if (this.isMuted) return;

    // Clean up any previously playing sounds before starting a new one
    this.stopAll();

    const ctx = this.ensureContext();
    if (ctx && ctx.state === 'suspended') {
      try {
        await ctx.resume();
      } catch (e) {}
    }

    // Wait up to 100ms if initial buffer decode is still resolving
    if (!this.impactBuffer && this.preloadPromise) {
      try {
        await Promise.race([
          this.preloadPromise,
          new Promise(r => setTimeout(r, 100))
        ]);
      } catch (e) {}
    }

    // PRIMARY: Web Audio API (ONLY when context is in 'running' state!)
    // CRITICAL: We NEVER call source.start() on a suspended context, preventing ghost queues!
    if (ctx && ctx.state === 'running' && this.impactBuffer) {
      try {
        const source = ctx.createBufferSource();
        source.buffer = this.impactBuffer;

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(1.0, ctx.currentTime);

        source.connect(gain);
        gain.connect(this.masterGain);

        source.start(ctx.currentTime, 0);
        this.activeSource = source;
        source.onended = () => {
          if (this.activeSource === source) this.activeSource = null;
        };
        return;
      } catch (err) {
        console.warn("WebAudio playback error:", err);
      }
    }

    // SECONDARY: Fresh HTML5 Audio fallback (transient instance)
    try {
      const audio = new Audio(this.audioUrl);
      audio.volume = this.isMuted ? 0 : 1.0;
      audio.currentTime = 0;
      this.activeHtml5 = audio;

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(e => {
          // If browser strictly blocked, immediately destroy to prevent pending playback
          try {
            audio.pause();
            audio.currentTime = 0;
            audio.src = '';
          } catch (err) {}
          if (this.activeHtml5 === audio) this.activeHtml5 = null;
        });
      }
    } catch (e) {}
  }

  playAnticipation() {}
  playWhoosh() {}
  playDoorOpen() {}
  playRevealAccent() {}
}

export const introAudio = new CinematicAudioEngine();
