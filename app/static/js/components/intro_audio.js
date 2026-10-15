/**
 * PROTOMANIA Cinematic Audio Engine (Web Audio API)
 * High-fidelity procedural audio synthesis for the opening cinematic experience:
 * - Anticipation deep bass rumble & metallic tension
 * - Rising aerodynamic whoosh during dumbbell acceleration
 * - 4-layer physical impact: sub-bass drop, cast-iron metal slam, transient snap, ringing resonance
 * - Hydraulic hiss & heavy mechanical rolling door slide
 * - Warm cinematic final reveal accent
 * Zero external audio dependencies, zero 404 risk, instant zero-latency playback.
 */

class CinematicAudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.isMuted = false;
    this.activeNodes = [];
    this.initialized = false;
  }

  ensureContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.9, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
      this.initialized = true;
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
      this.masterGain.gain.linearRampToValueAtTime(muted ? 0 : 0.9, now + 0.05);
    }
  }

  stopAll() {
    if (this.ctx && this.masterGain) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.linearRampToValueAtTime(0, now + 0.04);
    }
    this.activeNodes.forEach(node => {
      try {
        if (node.stop) node.stop();
        if (node.disconnect) node.disconnect();
      } catch (e) {}
    });
    this.activeNodes = [];
  }

  // Helper: create white/pink noise buffer
  createNoiseBuffer(seconds = 2) {
    if (!this.ctx) return null;
    const bufferSize = this.ctx.sampleRate * seconds;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  // SCENE 1: Anticipation Bass Rumble & Tension Drone (0 - 0.8s)
  playAnticipation() {
    const ctx = this.ensureContext();
    if (!ctx || this.isMuted) return;
    const now = ctx.currentTime;

    // Sub-bass drone
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();
    const subFilter = ctx.createBiquadFilter();

    subOsc.type = "sine";
    subOsc.frequency.setValueAtTime(36, now);
    subOsc.frequency.exponentialRampToValueAtTime(48, now + 0.8);

    subFilter.type = "lowpass";
    subFilter.frequency.setValueAtTime(90, now);

    subGain.gain.setValueAtTime(0.001, now);
    subGain.gain.linearRampToValueAtTime(0.45, now + 0.4);
    subGain.gain.linearRampToValueAtTime(0.65, now + 0.8);

    subOsc.connect(subFilter);
    subFilter.connect(subGain);
    subGain.connect(this.masterGain);

    subOsc.start(now);
    subOsc.stop(now + 0.85);
    this.activeNodes.push(subOsc, subGain);

    // Subtle metallic gym room resonance
    const metalTension = ctx.createOscillator();
    const metalGain = ctx.createGain();
    metalTension.type = "triangle";
    metalTension.frequency.setValueAtTime(180, now);
    metalTension.frequency.linearRampToValueAtTime(240, now + 0.8);

    metalGain.gain.setValueAtTime(0.001, now);
    metalGain.gain.linearRampToValueAtTime(0.08, now + 0.5);
    metalGain.gain.linearRampToValueAtTime(0.14, now + 0.8);

    metalTension.connect(metalGain);
    metalGain.connect(this.masterGain);

    metalTension.start(now);
    metalTension.stop(now + 0.85);
    this.activeNodes.push(metalTension, metalGain);
  }

  // SCENE 2: Rising Aerodynamic Whoosh (0.8s - 1.6s)
  playWhoosh() {
    const ctx = this.ensureContext();
    if (!ctx || this.isMuted) return;
    const now = ctx.currentTime;

    const noiseBuffer = this.createNoiseBuffer(1.2);
    if (!noiseBuffer) return;

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;

    const bandpass = ctx.createBiquadFilter();
    bandpass.type = "bandpass";
    bandpass.Q.setValueAtTime(3.0, now);
    bandpass.frequency.setValueAtTime(140, now);
    bandpass.frequency.exponentialRampToValueAtTime(950, now + 0.78);

    const whooshGain = ctx.createGain();
    whooshGain.gain.setValueAtTime(0.01, now);
    whooshGain.gain.exponentialRampToValueAtTime(0.7, now + 0.75);
    whooshGain.gain.linearRampToValueAtTime(0.001, now + 0.82);

    noiseSource.connect(bandpass);
    bandpass.connect(whooshGain);
    whooshGain.connect(this.masterGain);

    noiseSource.start(now);
    noiseSource.stop(now + 0.85);
    this.activeNodes.push(noiseSource, whooshGain);
  }

  // SCENE 3: THE IMPACT SLAM (Exact synchronization at 1.6s)
  playSlam() {
    const ctx = this.ensureContext();
    if (!ctx || this.isMuted) return;
    const now = ctx.currentTime;

    // Layer 1: Massive Sub-Bass Drop (Chest Thump)
    const subDrop = ctx.createOscillator();
    const subGain = ctx.createGain();
    subDrop.type = "sine";
    subDrop.frequency.setValueAtTime(140, now);
    subDrop.frequency.exponentialRampToValueAtTime(28, now + 0.38);

    subGain.gain.setValueAtTime(1.0, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);

    subDrop.connect(subGain);
    subGain.connect(this.masterGain);
    subDrop.start(now);
    subDrop.stop(now + 0.9);
    this.activeNodes.push(subDrop, subGain);

    // Layer 2: Heavy Cast-Iron Metal Plate Strike
    const clang1 = ctx.createOscillator();
    const clang2 = ctx.createOscillator();
    const clangGain = ctx.createGain();

    clang1.type = "triangle";
    clang2.type = "sine";
    clang1.frequency.setValueAtTime(420, now);
    clang2.frequency.setValueAtTime(740, now);

    clangGain.gain.setValueAtTime(0.85, now);
    clangGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    clang1.connect(clangGain);
    clang2.connect(clangGain);
    clangGain.connect(this.masterGain);

    clang1.start(now);
    clang2.start(now);
    clang1.stop(now + 0.5);
    clang2.stop(now + 0.5);
    this.activeNodes.push(clang1, clang2, clangGain);

    // Layer 3: Acoustic Impact Slap / Concrete Transient Crack
    const slapBuffer = this.createNoiseBuffer(0.2);
    if (slapBuffer) {
      const slapSource = ctx.createBufferSource();
      slapSource.buffer = slapBuffer;

      const slapFilter = ctx.createBiquadFilter();
      slapFilter.type = "highpass";
      slapFilter.frequency.setValueAtTime(1200, now);

      const slapGain = ctx.createGain();
      slapGain.gain.setValueAtTime(0.9, now);
      slapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      slapSource.connect(slapFilter);
      slapFilter.connect(slapGain);
      slapGain.connect(this.masterGain);

      slapSource.start(now);
      slapSource.stop(now + 0.15);
      this.activeNodes.push(slapSource, slapGain);
    }

    // Layer 4: Metallic Ringing & Resonance (Iron bar vibration decay)
    const ringOsc = ctx.createOscillator();
    const ringGain = ctx.createGain();
    ringOsc.type = "sine";
    ringOsc.frequency.setValueAtTime(630, now);

    ringGain.gain.setValueAtTime(0.35, now);
    ringGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

    ringOsc.connect(ringGain);
    ringGain.connect(this.masterGain);
    ringOsc.start(now);
    ringOsc.stop(now + 1.25);
    this.activeNodes.push(ringOsc, ringGain);
  }

  // SCENE 4: Hydraulic Pneumatic Door Release & Mechanical Door Slide (1.9s - 2.8s)
  playDoorOpen() {
    const ctx = this.ensureContext();
    if (!ctx || this.isMuted) return;
    const now = ctx.currentTime;

    // Pneumatic Pressure Release (Air Hiss)
    const hissBuffer = this.createNoiseBuffer(0.6);
    if (hissBuffer) {
      const hissSource = ctx.createBufferSource();
      hissSource.buffer = hissBuffer;

      const hissFilter = ctx.createBiquadFilter();
      hissFilter.type = "bandpass";
      hissFilter.frequency.setValueAtTime(2200, now);
      hissFilter.Q.setValueAtTime(2.0, now);

      const hissGain = ctx.createGain();
      hissGain.gain.setValueAtTime(0.4, now);
      hissGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      hissSource.connect(hissFilter);
      hissFilter.connect(hissGain);
      hissGain.connect(this.masterGain);

      hissSource.start(now);
      hissSource.stop(now + 0.5);
      this.activeNodes.push(hissSource, hissGain);
    }

    // Heavy Industrial Door Rollers on Steel Tracks
    const slideNoise = this.createNoiseBuffer(1.1);
    if (slideNoise) {
      const slideSource = ctx.createBufferSource();
      slideSource.buffer = slideNoise;

      const slideFilter = ctx.createBiquadFilter();
      slideFilter.type = "lowpass";
      slideFilter.frequency.setValueAtTime(320, now);

      const slideGain = ctx.createGain();
      slideGain.gain.setValueAtTime(0.001, now);
      slideGain.gain.linearRampToValueAtTime(0.38, now + 0.25);
      slideGain.gain.linearRampToValueAtTime(0.32, now + 0.65);
      slideGain.gain.exponentialRampToValueAtTime(0.001, now + 0.95);

      slideSource.connect(slideFilter);
      slideFilter.connect(slideGain);
      slideGain.connect(this.masterGain);

      slideSource.start(now);
      slideSource.stop(now + 1.0);
      this.activeNodes.push(slideSource, slideGain);
    }

    // Mechanical Low Motor Rumble
    const motorOsc = ctx.createOscillator();
    const motorGain = ctx.createGain();
    motorOsc.type = "sawtooth";
    motorOsc.frequency.setValueAtTime(54, now);

    const motorFilter = ctx.createBiquadFilter();
    motorFilter.type = "lowpass";
    motorFilter.frequency.setValueAtTime(120, now);

    motorGain.gain.setValueAtTime(0.01, now);
    motorGain.gain.linearRampToValueAtTime(0.18, now + 0.3);
    motorGain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

    motorOsc.connect(motorFilter);
    motorFilter.connect(motorGain);
    motorGain.connect(this.masterGain);

    motorOsc.start(now);
    motorOsc.stop(now + 0.95);
    this.activeNodes.push(motorOsc, motorGain);
  }

  // SCENE 5: Final Reveal Cinematic Accent (2.8s - 3.5s)
  playRevealAccent() {
    const ctx = this.ensureContext();
    if (!ctx || this.isMuted) return;
    const now = ctx.currentTime;

    // Warm deep boom
    const boomOsc = ctx.createOscillator();
    const boomGain = ctx.createGain();
    boomOsc.type = "sine";
    boomOsc.frequency.setValueAtTime(65, now);
    boomOsc.frequency.exponentialRampToValueAtTime(38, now + 0.7);

    boomGain.gain.setValueAtTime(0.65, now);
    boomGain.gain.exponentialRampToValueAtTime(0.001, now + 0.75);

    boomOsc.connect(boomGain);
    boomGain.connect(this.masterGain);
    boomOsc.start(now);
    boomOsc.stop(now + 0.8);
    this.activeNodes.push(boomOsc, boomGain);

    // High crystalline harmonic chime (Proto mark shimmer)
    const chime1 = ctx.createOscillator();
    const chimeGain = ctx.createGain();
    chime1.type = "sine";
    chime1.frequency.setValueAtTime(528, now); // 528Hz Solfeggio clarity frequency

    chimeGain.gain.setValueAtTime(0.2, now);
    chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

    chime1.connect(chimeGain);
    chimeGain.connect(this.masterGain);
    chime1.start(now);
    chime1.stop(now + 0.95);
    this.activeNodes.push(chime1, chimeGain);
  }
}

export const introAudio = new CinematicAudioEngine();
