/**
 * PROTOMANIA Cinematic Audio Engine (v3.0 — Genuine Impact & Pneumatic Vault)
 * 
 * Replaces synthetic risers and motor sounds with:
 * - Genuine Gym Dumbbell Impact: Cast-iron plate crash + heavy solid metal smash + deep floor thud
 * - Natural Aerodynamic Air Whoosh: Clean air displacement, zero synthetic motor noise
 * - Pneumatic Vault Airlock: Pressurized seal release (hiss & smooth slide), zero mixer/blender motor
 * - Quiet Atmospheric Anticipation: Deep, subtle sub-bass tension pulse
 * - Sample-accurate onset detection with zero latency
 * - Instant cutoff (<20ms) on skip [Esc]
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

    // Clean, authentic studio assets (zero mixer/motor tones)
    this.audioUrls = {
      airWhoosh: '/static/audio/air_whoosh.mp3',
      gymPlate: '/static/audio/gym_plate.mp3',
      heavySmash: '/static/audio/heavy_smash.mp3',
      deepThud: '/static/audio/deep_thud.mp3',
      vaultAirlock: '/static/audio/vault_airlock.mp3',
      vaultSlide: '/static/audio/vault_slide.mp3'
    };

    this.preload();
  }

  ensureContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();

      // Master dynamics compressor to glue the physical impact layers
      this.compressor = this.ctx.createDynamicsCompressor();
      this.compressor.threshold.setValueAtTime(-12, this.ctx.currentTime);
      this.compressor.knee.setValueAtTime(6, this.ctx.currentTime);
      this.compressor.ratio.setValueAtTime(5, this.ctx.currentTime);
      this.compressor.attack.setValueAtTime(0.002, this.ctx.currentTime);
      this.compressor.release.setValueAtTime(0.2, this.ctx.currentTime);

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
        this.onsets[key] = this.calculateOnset(audioBuf, 0.02);
      } catch (err) {
        // Fallback gracefully
      }
    };

    const promises = Object.entries(this.audioUrls).map(([key, url]) => loadEntry(key, url));
    await Promise.allSettled(promises);
    this.isPreloaded = true;
  }

  calculateOnset(buffer, threshold = 0.02) {
    const data = buffer.getChannelData(0);
    const limit = Math.min(data.length, Math.floor(buffer.sampleRate * 0.4));
    for (let i = 0; i < limit; i++) {
      if (Math.abs(data[i]) >= threshold) {
        return Math.max(0, (i - 40) / buffer.sampleRate);
      }
    }
    return 0;
  }

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

    if (options.duration) {
      const stopTime = ctx.currentTime + options.duration;
      gainNode.gain.setValueAtTime(volume, stopTime - 0.15);
      gainNode.gain.linearRampToValueAtTime(0, stopTime);
    }

    source.connect(gainNode);
    gainNode.connect(this.compressor || this.masterGain);

    const onset = options.ignoreOnset ? 0 : (this.onsets[key] || 0);
    source.start(ctx.currentTime + (options.delay || 0), onset);

    if (options.duration) {
      source.stop(ctx.currentTime + (options.delay || 0) + options.duration);
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
  // Subtle deep atmospheric tension pulse (NO mixer/riser!)
  // ========================================================
  playAnticipation() {
    const ctx = this.ensureContext();
    if (!ctx || this.isMuted) return;
    const now = ctx.currentTime;

    // Soft low-frequency heartbeat pulse
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    subOsc.type = "sine";
    subOsc.frequency.setValueAtTime(36, now);
    subOsc.frequency.linearRampToValueAtTime(44, now + 0.8);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(80, now);

    subGain.gain.setValueAtTime(0.001, now);
    subGain.gain.linearRampToValueAtTime(0.35, now + 0.4);
    subGain.gain.linearRampToValueAtTime(0.2, now + 0.8);

    subOsc.connect(filter);
    filter.connect(subGain);
    subGain.connect(this.masterGain);

    subOsc.start(now);
    subOsc.stop(now + 0.85);
    this.activeSources.push(subOsc);
  }

  // ========================================================
  // SCENE 2: The Dumbbell Drop (0.8s - 1.6s)
  // Clean natural aerodynamic air whoosh (NO synth/motor)
  // ========================================================
  playWhoosh() {
    const ctx = this.ensureContext();
    if (!ctx || this.isMuted) return;

    if (this.buffers.airWhoosh) {
      this.playBuffer('airWhoosh', { volume: 0.85, duration: 0.8 });
      return;
    }

    // Procedural fallback
    const now = ctx.currentTime;
    const bufferSize = ctx.sampleRate * 0.8;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.Q.setValueAtTime(2.0, now);
    bp.frequency.setValueAtTime(160, now);
    bp.frequency.exponentialRampToValueAtTime(750, now + 0.75);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.exponentialRampToValueAtTime(0.5, now + 0.7);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.8);

    noise.connect(bp);
    bp.connect(gain);
    gain.connect(this.masterGain);

    noise.start(now);
    noise.stop(now + 0.82);
    this.activeSources.push(noise);
  }

  // ========================================================
  // SCENE 3: THE IMPACT SLAM (1.6s)
  // GENUINE DUMBBELL GYM IMPACT:
  // 1. Cast-iron weight plate clash & rattle (gym_plate.mp3)
  // 2. Heavy solid metal collision crunch (heavy_smash.mp3)
  // 3. Deep floor absorption thud (deep_thud.mp3)
  // All three fire simultaneously through the dynamics compressor!
  // ========================================================
  playSlam() {
    const ctx = this.ensureContext();
    if (!ctx || this.isMuted) return;

    let playedReal = false;

    // Layer 1: Real cast iron plate clang & vibration
    if (this.buffers.gymPlate) {
      this.playBuffer('gymPlate', { volume: 0.95 });
      playedReal = true;
    }

    // Layer 2: Heavy solid metal impact crunch
    if (this.buffers.heavySmash) {
      this.playBuffer('heavySmash', { volume: 0.9 });
      playedReal = true;
    }

    // Layer 3: Deep low-frequency floor thud
    if (this.buffers.deepThud) {
      this.playBuffer('deepThud', { volume: 1.0 });
      playedReal = true;
    }

    if (playedReal) return;

    // Procedural Fallback
    const now = ctx.currentTime;
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();
    subOsc.type = "sine";
    subOsc.frequency.setValueAtTime(100, now);
    subOsc.frequency.exponentialRampToValueAtTime(32, now + 0.35);

    subGain.gain.setValueAtTime(1.0, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

    subOsc.connect(subGain);
    subGain.connect(this.compressor || this.masterGain);
    subOsc.start(now);
    subOsc.stop(now + 0.75);
    this.activeSources.push(subOsc);
  }

  // ========================================================
  // SCENE 4: Heavy Gym Doors Open (1.9s - 2.8s)
  // Pneumatic Vault Airlock: Pressurized seal release + smooth heavy slide
  // (Completely eliminates the motorized mixer sound)
  // ========================================================
  playDoorOpen() {
    const ctx = this.ensureContext();
    if (!ctx || this.isMuted) return;

    // Layer 1: High-pressure pneumatic seal release (hiss & lock click)
    if (this.buffers.vaultAirlock) {
      this.playBuffer('vaultAirlock', { volume: 0.9, duration: 1.1 });
    }

    // Layer 2: Smooth heavy vault slide
    if (this.buffers.vaultSlide) {
      this.playBuffer('vaultSlide', { volume: 0.7, duration: 0.9 });
    }
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
    boom.frequency.setValueAtTime(58, now);
    boom.frequency.exponentialRampToValueAtTime(34, now + 0.6);

    boomGain.gain.setValueAtTime(0.45, now);
    boomGain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

    boom.connect(boomGain);
    boomGain.connect(this.masterGain);
    boom.start(now);
    boom.stop(now + 0.7);

    // High crystalline chime
    const chime = ctx.createOscillator();
    const chimeGain = ctx.createGain();
    chime.type = "sine";
    chime.frequency.setValueAtTime(528, now);

    chimeGain.gain.setValueAtTime(0.16, now);
    chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

    chime.connect(chimeGain);
    chimeGain.connect(this.masterGain);
    chime.start(now);
    chime.stop(now + 0.85);

    this.activeSources.push(boom, chime);
  }
}

export const introAudio = new CinematicAudioEngine();
