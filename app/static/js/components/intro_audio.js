/**
 * PROTOMANIA Dumbbell Impact Audio Engine
 * Pure, Focused Sound Design:
 * - Only the authentic, heavy physical impact sound of the dumbbell slamming down
 * - Completely silent door sliding (zero motorized or whooshing noise)
 * - Completely silent anticipation & reveal
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

    // Single dedicated goal: Genuine heavy dumbbell impact
    this.audioUrls = {
      dumbbellImpact: '/static/audio/dumbbell_impact.mp3',
      gymPlate: '/static/audio/gym_plate.mp3'
    };

    this.preload();
  }

  ensureContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();

      // Master punch compressor for the dumbbell slam
      this.compressor = this.ctx.createDynamicsCompressor();
      this.compressor.threshold.setValueAtTime(-10, this.ctx.currentTime);
      this.compressor.knee.setValueAtTime(4, this.ctx.currentTime);
      this.compressor.ratio.setValueAtTime(4, this.ctx.currentTime);
      this.compressor.attack.setValueAtTime(0.001, this.ctx.currentTime);
      this.compressor.release.setValueAtTime(0.2, this.ctx.currentTime);

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 1.0, this.ctx.currentTime);

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
    const limit = Math.min(data.length, Math.floor(buffer.sampleRate * 0.3));
    for (let i = 0; i < limit; i++) {
      if (Math.abs(data[i]) >= threshold) {
        return Math.max(0, (i - 20) / buffer.sampleRate);
      }
    }
    return 0;
  }

  playBuffer(key, volume = 1.0) {
    const ctx = this.ensureContext();
    if (!ctx || this.isMuted) return null;

    const buffer = this.buffers[key];
    if (!buffer) return null;

    const source = ctx.createBufferSource();
    source.buffer = buffer;

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(volume, ctx.currentTime);

    source.connect(gainNode);
    gainNode.connect(this.compressor || this.masterGain);

    const onset = this.onsets[key] || 0;
    source.start(ctx.currentTime, onset);

    this.activeSources.push(source);
    source.onended = () => {
      const idx = this.activeSources.indexOf(source);
      if (idx !== -1) this.activeSources.splice(idx, 1);
    };

    return source;
  }

  // Scene 1: Silent Anticipation (No mixer/riser)
  playAnticipation() {
    // Intentionally silent
  }

  // Scene 2: Silent Drop (No synthetic whoosh/motor)
  playWhoosh() {
    // Intentionally silent
  }

  // Scene 3: THE DUMBBELL IMPACT SLAM (1.6s)
  // Genuine, heavy, physical gym dumbbell hitting the floor
  playSlam() {
    const ctx = this.ensureContext();
    if (!ctx || this.isMuted) return;

    let played = false;

    // Layer 1: Solid heavy metal dumbbell impact
    if (this.buffers.dumbbellImpact) {
      this.playBuffer('dumbbellImpact', 1.0);
      played = true;
    }

    // Layer 2: Cast iron gym weight plate clash
    if (this.buffers.gymPlate) {
      this.playBuffer('gymPlate', 0.85);
      played = true;
    }

    if (played) return;

    // Procedural Fallback if assets delayed
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(90, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.3);

    gain.gain.setValueAtTime(1.0, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.55);
    this.activeSources.push(osc);
  }

  // Scene 4: Door Sliding is completely SILENT (No sound for the door sliding)
  playDoorOpen() {
    // Intentionally silent
  }

  // Scene 5: Silent Reveal
  playRevealAccent() {
    // Intentionally silent
  }
}

export const introAudio = new CinematicAudioEngine();
