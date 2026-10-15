/**
 * PROTOMANIA Cinematic Audio Engine
 * Hybrid Architecture: Real Studio-Recorded SFX + Web Audio API Dynamics Processor
 * 
 * Features:
 * - Real cast-iron metal impact strike + deep cinematic sub-bass thud (dual-layer physical slam)
 * - Real aerodynamic falling whoosh transition
 * - Real industrial pneumatic gym vault door slide
 * - Real cinematic tension anticipation drone
 * - Sample-accurate peak onset detection (zero leading silence, zero latency)
 * - Master Dynamics Compressor (glues metal crack + sub body into a punchy, bone-crushing hit)
 * - Instant cutoff (<20ms) on skip [Esc]
 * - Autoplay handling with graceful resume
 */

class CinematicAudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.compressor = null;
    this.isMuted = false;
    this.activeSources = [];
    this.buffers = {};
    this.onsets = {};
    this.isPreloaded = false;

    // Track loading promises
    this.audioUrls = {
      subImpact: '/static/audio/sub_impact.mp3',
      metalSlam: '/static/audio/metal_slam.mp3',
      whoosh: '/static/audio/whoosh.mp3',
      doorSlide: '/static/audio/door_slide.mp3',
      trailerRiser: '/static/audio/trailer_riser.mp3'
    };

    // Auto-init on first script load
    this.preload();
  }

  ensureContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();

      // Master dynamics compressor to glue transients and sub-bass into a massive hit
      this.compressor = this.ctx.createDynamicsCompressor();
      this.compressor.threshold.setValueAtTime(-14, this.ctx.currentTime);
      this.compressor.knee.setValueAtTime(8, this.ctx.currentTime);
      this.compressor.ratio.setValueAtTime(6, this.ctx.currentTime);
      this.compressor.attack.setValueAtTime(0.002, this.ctx.currentTime);
      this.compressor.release.setValueAtTime(0.25, this.ctx.currentTime);

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.95, this.ctx.currentTime);

      this.compressor.connect(this.masterGain);
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
      this.masterGain.gain.linearRampToValueAtTime(muted ? 0 : 0.95, now + 0.04);
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

  // Pre-load and decode all audio assets into raw memory buffers
  async preload() {
    if (this.isPreloaded) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const loadEntry = async (key, url) => {
      try {
        const resp = await fetch(url);
        if (!resp.ok) return;
        const arrayBuf = await resp.arrayBuffer();
        const audioBuf = await ctx.decodeAudioData(arrayBuf);
        this.buffers[key] = audioBuf;

        // Calculate leading silence offset for sample-accurate instant impact
        this.onsets[key] = this.calculateOnset(audioBuf, 0.02);
      } catch (err) {
        // Fallback gracefully to procedural sound if network fails
      }
    };

    const promises = Object.entries(this.audioUrls).map(([key, url]) => loadEntry(key, url));
    await Promise.allSettled(promises);
    this.isPreloaded = true;
  }

  calculateOnset(buffer, threshold = 0.02) {
    const data = buffer.getChannelData(0);
    const limit = Math.min(data.length, Math.floor(buffer.sampleRate * 0.4)); // check first 400ms
    for (let i = 0; i < limit; i++) {
      if (Math.abs(data[i]) >= threshold) {
        return Math.max(0, (i - 40) / buffer.sampleRate); // slight pre-roll for attack
      }
    }
    return 0;
  }

  // Helper to play a preloaded decoded buffer
  playBuffer(key, options = {}) {
    const ctx = this.ensureContext();
    if (!ctx || this.isMuted) return null;

    const buffer = this.buffers[key];
    if (!buffer) return null;

    const source = ctx.createBufferSource();
    source.buffer = buffer;

    const gainNode = ctx.createGain();
    const volume = options.volume !== undefined ? options.volume : 1.0;
    gainNode.gain.setValueAtTime(volume, ctx.currentTime);

    // Fade out if duration specified
    if (options.duration) {
      const stopTime = ctx.currentTime + options.duration;
      gainNode.gain.setValueAtTime(volume, stopTime - 0.15);
      gainNode.gain.linearRampToValueAtTime(0, stopTime);
    }

    source.connect(gainNode);
    gainNode.connect(this.compressor || this.masterGain);

    const onset = options.ignoreOnset ? 0 : (this.onsets[key] || 0);
    source.start(ctx.currentTime, onset);

    if (options.duration) {
      source.stop(ctx.currentTime + options.duration);
    }

    this.activeSources.push(source);
    source.onended = () => {
      const idx = this.activeSources.indexOf(source);
      if (idx !== -1) this.activeSources.splice(idx, 1);
    };

    return source;
  }

  // ========================================================
  // SCENE 1: Anticipation (0.0s - 0.8s)
  // Deep cinematic tension riser / low-frequency room drone
  // ========================================================
  playAnticipation() {
    const ctx = this.ensureContext();
    if (!ctx || this.isMuted) return;

    // Use preloaded trailer riser if available
    if (this.buffers.trailerRiser) {
      this.playBuffer('trailerRiser', { volume: 0.75, duration: 0.85 });
      return;
    }

    // Procedural Fallback: Low-frequency sub-bass drone
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = "sine";
    osc.frequency.setValueAtTime(38, now);
    osc.frequency.exponentialRampToValueAtTime(52, now + 0.8);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(100, now);

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.55, now + 0.5);
    gain.gain.linearRampToValueAtTime(0.7, now + 0.8);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.85);
    this.activeSources.push(osc);
  }

  // ========================================================
  // SCENE 2: The Dumbbell Drop (0.8s - 1.6s)
  // Aerodynamic rising whoosh transition
  // ========================================================
  playWhoosh() {
    const ctx = this.ensureContext();
    if (!ctx || this.isMuted) return;

    if (this.buffers.whoosh) {
      this.playBuffer('whoosh', { volume: 0.85, duration: 0.8 });
      return;
    }

    // Procedural Fallback: Bandpass noise swell
    const now = ctx.currentTime;
    const bufferSize = ctx.sampleRate * 0.85;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.Q.setValueAtTime(2.5, now);
    bp.frequency.setValueAtTime(150, now);
    bp.frequency.exponentialRampToValueAtTime(900, now + 0.75);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.exponentialRampToValueAtTime(0.65, now + 0.7);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.82);

    noise.connect(bp);
    bp.connect(gain);
    gain.connect(this.masterGain);

    noise.start(now);
    noise.stop(now + 0.85);
    this.activeSources.push(noise);
  }

  // ========================================================
  // SCENE 3: THE IMPACT SLAM (1.6s)
  // THE REAL DEAL: Dual-Layer Physical Metal Slam & Cinematic Sub-Punch
  // 1. Heavy Metal Hammer Strike (Cast-iron plate contact & clang)
  // 2. Big Cinematic Impact (Deep chest-thumping sub-bass thud)
  // Synchronized to the exact microsecond through the dynamics compressor!
  // ========================================================
  playSlam() {
    const ctx = this.ensureContext();
    if (!ctx || this.isMuted) return;

    let hasPlayedReal = false;

    // Layer 1: Real Heavy Metal Hammer/Plate Strike
    if (this.buffers.metalSlam) {
      this.playBuffer('metalSlam', { volume: 0.95 });
      hasPlayedReal = true;
    }

    // Layer 2: Real Deep Sub-Bass Cinematic Impact
    if (this.buffers.subImpact) {
      this.playBuffer('subImpact', { volume: 1.0 });
      hasPlayedReal = true;
    }

    if (hasPlayedReal) return;

    // High-Fidelity Procedural Physical Modeling Fallback
    const now = ctx.currentTime;

    // 1. Visceral Sub-bass thump (55Hz drop)
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();
    subOsc.type = "sine";
    subOsc.frequency.setValueAtTime(120, now);
    subOsc.frequency.exponentialRampToValueAtTime(32, now + 0.35);

    subGain.gain.setValueAtTime(1.0, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

    subOsc.connect(subGain);
    subGain.connect(this.compressor || this.masterGain);
    subOsc.start(now);
    subOsc.stop(now + 0.85);
    this.activeSources.push(subOsc);

    // 2. Heavy Cast-Iron Anvil Clang (Dual inharmonic partials)
    const clang1 = ctx.createOscillator();
    const clang2 = ctx.createOscillator();
    const clangGain = ctx.createGain();
    clang1.type = "triangle";
    clang2.type = "sine";
    clang1.frequency.setValueAtTime(380, now);
    clang2.frequency.setValueAtTime(690, now);

    clangGain.gain.setValueAtTime(0.8, now);
    clangGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    clang1.connect(clangGain);
    clang2.connect(clangGain);
    clangGain.connect(this.compressor || this.masterGain);

    clang1.start(now);
    clang2.start(now);
    clang1.stop(now + 0.45);
    clang2.stop(now + 0.45);
    this.activeSources.push(clang1, clang2);
  }

  // ========================================================
  // SCENE 4: Heavy Gym Doors Open (1.9s - 2.8s)
  // Real industrial sliding metal doors & pneumatic air release
  // ========================================================
  playDoorOpen() {
    const ctx = this.ensureContext();
    if (!ctx || this.isMuted) return;

    if (this.buffers.doorSlide) {
      this.playBuffer('doorSlide', { volume: 0.85, duration: 1.1 });
      return;
    }

    // Procedural Fallback: Pneumatic hiss + sliding rumble
    const now = ctx.currentTime;
    const bufferSize = ctx.sampleRate * 0.9;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.setValueAtTime(320, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.4, now + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

    noise.connect(lp);
    lp.connect(gain);
    gain.connect(this.masterGain);

    noise.start(now);
    noise.stop(now + 0.95);
    this.activeSources.push(noise);
  }

  // ========================================================
  // SCENE 5: Final Reveal Accent (2.8s - 3.4s)
  // Warm sub boom & crystalline 528Hz Solfeggio shimmer
  // ========================================================
  playRevealAccent() {
    const ctx = this.ensureContext();
    if (!ctx || this.isMuted) return;
    const now = ctx.currentTime;

    const boom = ctx.createOscillator();
    const boomGain = ctx.createGain();
    boom.type = "sine";
    boom.frequency.setValueAtTime(62, now);
    boom.frequency.exponentialRampToValueAtTime(36, now + 0.6);

    boomGain.gain.setValueAtTime(0.5, now);
    boomGain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

    boom.connect(boomGain);
    boomGain.connect(this.masterGain);
    boom.start(now);
    boom.stop(now + 0.7);

    // Shimmer chime
    const chime = ctx.createOscillator();
    const chimeGain = ctx.createGain();
    chime.type = "sine";
    chime.frequency.setValueAtTime(528, now);

    chimeGain.gain.setValueAtTime(0.18, now);
    chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);

    chime.connect(chimeGain);
    chimeGain.connect(this.masterGain);
    chime.start(now);
    chime.stop(now + 0.9);

    this.activeSources.push(boom, chime);
  }
}

export const introAudio = new CinematicAudioEngine();
