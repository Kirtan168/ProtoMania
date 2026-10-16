/**
 * PROTOMANIA — High-Performance Cinematic Opening Intro
 * 
 * Performance Optimizations:
 * - 100% GPU-accelerated translate3d transforms (locked 60/120fps)
 * - Removed CPU-bound SVG filters during active animation
 * - Ultra-fast canvas rendering without software shadowBlur
 * - Snappy gravitational descent curve with zero sluggish lag
 * - Pure, satisfying single dumbbell impact thud with silent door slide
 */

import { introAudio } from "./intro_audio.js";

export function initCinematicIntro(forceReplay = false) {
  // Check reduced-motion preference
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasSeen = sessionStorage.getItem('protomania_intro_played') === 'true';

  if ((hasSeen && !forceReplay) || prefersReduced) {
    revealHeroDirectly();
    return;
  }

  // Remove any prior active intro element
  const existing = document.getElementById('cinematic-intro');
  if (existing) existing.remove();

  // Purge any prior audio to guarantee zero ghost sounds
  introAudio.stopAll();

  // Load sound mute preference
  const savedMute = localStorage.getItem('protomania_audio_muted') === 'true';
  introAudio.setMuted(savedMute);

  // Active timers tracker for instant cancellation on skip
  const activeTimers = [];
  let animationFrameId = null;
  let isCleanedUp = false;

  const introEl = document.createElement('div');
  introEl.id = 'cinematic-intro';
  introEl.className = 'fixed inset-0 z-[9999] overflow-hidden flex items-center justify-center select-none bg-[#0e110e]';

  introEl.innerHTML = `
    <!-- PROCEDURAL FILM GRAIN OVERLAY -->
    <div class="absolute inset-0 bg-film-grain pointer-events-none z-10 opacity-60"></div>

    <!-- CENTRAL PULSING SPOTLIGHT -->
    <div id="intro-spotlight" class="intro-spotlight absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] rounded-full pointer-events-none z-0 bg-[radial-gradient(circle,rgba(216,255,62,0.14)_0%,rgba(156,138,255,0.05)_40%,transparent_70%)]"></div>

    <!-- LEFT INDUSTRIAL GYM VAULT DOOR -->
    <div id="intro-door-left" class="intro-door absolute top-0 left-0 bottom-0 w-1/2 bg-[#121511] border-r border-[#34382F] z-20 flex flex-col justify-between p-6 sm:p-12 overflow-hidden shadow-[15px_0_40px_rgba(0,0,0,0.85)]">
      <div class="absolute inset-0 opacity-15 bg-[radial-gradient(#D8FF3E_1px,transparent_1px)] [background-size:24px_24px]"></div>
      <div class="absolute top-0 right-0 w-4 h-full bg-[repeating-linear-gradient(45deg,#D8FF3E,#D8FF3E_12px,#111410_12px,#111410_24px)] opacity-50"></div>
      <div class="absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-black/80 to-transparent pointer-events-none"></div>

      <div class="relative z-10 flex items-center space-x-2 text-[10px] font-mono text-[#858A80] tracking-widest uppercase">
        <span class="w-2 h-2 rounded-full bg-[#D8FF3E] animate-ping"></span>
        <span class="text-[#D8FF3E] font-bold">HYDRAULIC SECTOR 01</span>
        <span class="text-[#858A80]/50">• PRESSURIZED</span>
      </div>

      <div class="relative z-10 my-auto text-right pr-6 sm:pr-14">
        <div class="text-5xl sm:text-8xl font-black font-heading text-[#1c221a] tracking-tighter select-none scale-y-110">
          PROTO
        </div>
        <div class="text-[11px] font-mono text-[#D8FF3E]/70 tracking-widest mt-1">
          STUDENT FITNESS ARCHITECTURE
        </div>
      </div>

      <div class="relative z-10 flex items-center justify-between text-[9px] font-mono text-[#858A80]">
        <span>SYS.LOCK // SECURE</span>
        <span class="text-[#D8FF3E]">50KG CALIBRATED</span>
      </div>
    </div>

    <!-- RIGHT INDUSTRIAL GYM VAULT DOOR -->
    <div id="intro-door-right" class="intro-door absolute top-0 right-0 bottom-0 w-1/2 bg-[#121511] border-l border-[#34382F] z-20 flex flex-col justify-between p-6 sm:p-12 overflow-hidden shadow-[-15px_0_40px_rgba(0,0,0,0.85)]">
      <div class="absolute inset-0 opacity-15 bg-[radial-gradient(#D8FF3E_1px,transparent_1px)] [background-size:24px_24px]"></div>
      <div class="absolute top-0 left-0 w-4 h-full bg-[repeating-linear-gradient(-45deg,#D8FF3E,#D8FF3E_12px,#111410_12px,#111410_24px)] opacity-50"></div>
      <div class="absolute top-0 left-0 w-24 h-full bg-gradient-to-r from-black/80 to-transparent pointer-events-none"></div>

      <div class="relative z-10 flex items-center justify-end space-x-2 text-[10px] font-mono text-[#858A80] tracking-widest uppercase">
        <span class="text-[#9C8AFF] font-bold">BUDGET ENGINE 2.0</span>
        <span class="w-2 h-2 rounded-full bg-[#9C8AFF] animate-pulse"></span>
      </div>

      <div class="relative z-10 my-auto pl-6 sm:pl-14">
        <div class="text-5xl sm:text-8xl font-black font-heading text-[#1c221a] tracking-tighter select-none scale-y-110">
          MANIA
        </div>
        <div class="text-[11px] font-mono text-[#9C8AFF]/70 tracking-widest mt-1">
          YOUR BODY • YOUR BUDGET • YOUR ERA
        </div>
      </div>

      <div class="relative z-10 flex items-center justify-between text-[9px] font-mono text-[#858A80]">
        <span class="text-[#9C8AFF]">AUTONOMOUS OPTIMIZATION</span>
        <span>STATUS: READY</span>
      </div>
    </div>

    <!-- TOP CONTROLS (MUTE TOGGLE & SKIP BUTTON) -->
    <div class="absolute top-5 right-5 sm:top-7 sm:right-7 z-40 flex items-center space-x-3 pointer-events-auto">
      <button id="intro-mute-btn" class="bg-[#141812]/90 backdrop-blur-md border border-[#34382F] hover:border-[#D8FF3E] text-[#F4F5EF] hover:text-[#D8FF3E] text-[11px] font-mono font-bold px-3 py-1.5 rounded-full flex items-center space-x-1.5 transition-all cursor-pointer shadow-lg">
        <span id="intro-mute-icon">${savedMute ? '🔇' : '🔊'}</span>
        <span id="intro-mute-text">${savedMute ? 'MUTED' : 'SOUND ON'}</span>
      </button>

      <button id="intro-skip-btn" class="bg-[#111410]/90 backdrop-blur-md border border-[#D8FF3E]/60 text-[#D8FF3E] hover:bg-[#D8FF3E] hover:text-[#111410] text-[11px] font-mono font-bold px-4 py-1.5 rounded-full flex items-center space-x-1.5 transition-all cursor-pointer shadow-[0_0_20px_rgba(216,255,62,0.25)]">
        <span>SKIP INTRO</span>
        <span class="text-[10px] opacity-70 hidden sm:inline">[Esc]</span>
        <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="19" y1="5" x2="19" y2="19"></line></svg>
      </button>
    </div>

    <!-- SCENE 1: ANTICIPATION HUD TEXT BADGE -->
    <div id="intro-anticipation-badge" class="absolute z-35 top-1/2 -translate-y-24 flex flex-col items-center cursor-pointer pointer-events-auto transition-all duration-300 group">
      <div class="flex items-center space-x-2.5 bg-[#141812]/95 border-2 border-[#D8FF3E] px-6 py-2.5 rounded-full backdrop-blur-md shadow-[0_0_30px_rgba(216,255,62,0.35)] group-hover:scale-105 group-hover:bg-[#D8FF3E] transition-all">
        <span class="w-2.5 h-2.5 rounded-full bg-[#D8FF3E] group-hover:bg-[#111410] animate-ping"></span>
        <span id="intro-badge-title" class="text-xs font-mono font-black text-[#D8FF3E] group-hover:text-[#111410] tracking-widest uppercase">
          ${forceReplay ? 'INITIALIZING PROTOCOL...' : 'CLICK / TAP TO ENTER'}
        </span>
        <span class="text-xs">⚡</span>
      </div>
      <span id="intro-badge-subtitle" class="text-[10px] font-mono text-[#858A80] tracking-wider mt-2.5 group-hover:text-[#F4F5EF] transition-colors">
        ${forceReplay ? '50KG DROP INCOMING...' : 'TAP ANYWHERE TO UNLEASH PROTOCOL [ 🔊 ]'}
      </span>
    </div>

    <!-- IMPACT ARENA & 3D STAGE -->
    <div id="intro-arena" class="relative z-30 flex flex-col items-center justify-center pointer-events-none">
      
      <!-- Instant Impact White/Neon Flash Screen -->
      <div id="intro-flash" class="absolute w-[800px] h-[800px] -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 rounded-full pointer-events-none opacity-0"></div>

      <!-- Dual Concentric Shockwave Rings -->
      <div id="intro-wave-1" class="intro-shockwave absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 w-4 h-4 rounded-full border-[3px] border-[#D8FF3E] pointer-events-none opacity-0"></div>
      <div id="intro-wave-2" class="intro-shockwave absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 w-4 h-4 rounded-full border-[2.5px] border-[#9C8AFF] pointer-events-none opacity-0"></div>

      <!-- High-Performance Canvas for Ambient Dust & Impact Sparks -->
      <canvas id="intro-particles-canvas" class="absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 w-[800px] h-[800px] pointer-events-none"></canvas>

      <!-- FLOOR SHADOW BASE -->
      <div id="intro-floor-shadow" class="absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-28 w-44 h-8 rounded-full bg-black/80 blur-md opacity-20"></div>

      <!-- MASSIVE 3D CAST-IRON DUMBBELL VECTOR (Hardware GPU-Accelerated) -->
      <div id="intro-dumbbell-wrapper" class="relative z-30" style="will-change: transform; transform: translate3d(0, -125vh, 0) rotate(-10deg); backface-visibility: hidden; -webkit-backface-visibility: hidden; transform-style: preserve-3d;">
        <svg id="intro-dumbbell-svg" class="w-56 h-56 sm:w-72 sm:h-72 filter drop-shadow-[0_25px_35px_rgba(0,0,0,0.95)]" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="dbPlateFace" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#3c4338" />
              <stop offset="35%" stop-color="#242a21" />
              <stop offset="70%" stop-color="#141812" />
              <stop offset="100%" stop-color="#0b0e0b" />
            </linearGradient>

            <linearGradient id="dbPlateBevelTop" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#555f4e" />
              <stop offset="50%" stop-color="#858a80" />
              <stop offset="100%" stop-color="#3c4338" />
            </linearGradient>

            <linearGradient id="dbPlateShadow" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#141812" />
              <stop offset="100%" stop-color="#050705" />
            </linearGradient>

            <linearGradient id="dbChromeBar" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#4d554a" />
              <stop offset="25%" stop-color="#858a80" />
              <stop offset="50%" stop-color="#f4f5ef" />
              <stop offset="75%" stop-color="#858a80" />
              <stop offset="100%" stop-color="#2b3127" />
            </linearGradient>
          </defs>

          <!-- DUMBBELL GRAPHIC GROUP -->
          <g id="intro-dumbbell-group">
            <!-- Left Hex Plates Stack -->
            <polygon points="32,60 58,45 84,60 84,180 58,195 32,180" fill="url(#dbPlateShadow)" stroke="#22281f" stroke-width="2" />
            <polygon points="38,65 58,54 78,65 78,175 58,186 38,175" fill="url(#dbPlateFace)" stroke="#454e40" stroke-width="2" />
            <polygon points="38,65 58,54 78,65 74,68 58,59 42,68" fill="url(#dbPlateBevelTop)" />
            <polygon points="44,76 58,68 72,76 72,164 58,172 44,164" fill="#121511" stroke="#D8FF3E" stroke-width="1.5" stroke-dasharray="6 3" />
            <text x="58" y="124" font-family="'Space Grotesk', 'Syne', monospace" font-size="12" font-weight="900" fill="#D8FF3E" text-anchor="middle" letter-spacing="1">50KG</text>

            <polygon points="68,74 84,65 96,74 96,166 84,175 68,166" fill="url(#dbPlateFace)" stroke="#34382F" stroke-width="1.8" />
            <polygon points="72,80 84,73 92,80 92,160 84,167 72,160" fill="#161a15" stroke="#858a80" stroke-width="1" />

            <!-- Left Collar Lock with Hardware Vector Glow -->
            <rect x="96" y="106" width="10" height="28" rx="2" fill="url(#dbPlateShadow)" stroke="#34382F" stroke-width="1" />
            <circle cx="101" cy="120" r="5" fill="#D8FF3E" opacity="0.3" />
            <circle cx="101" cy="120" r="2.5" fill="#D8FF3E" />

            <!-- Steel Knurled Barbell Shaft -->
            <rect x="106" y="112" width="28" height="16" rx="2" fill="url(#dbChromeBar)" stroke="#111410" stroke-width="1.5" />
            <line x1="112" y1="112" x2="112" y2="128" stroke="#111410" stroke-width="1.2" stroke-dasharray="1 1" />
            <line x1="116" y1="112" x2="116" y2="128" stroke="#111410" stroke-width="1.2" stroke-dasharray="1 1" />
            <line x1="120" y1="112" x2="120" y2="128" stroke="#111410" stroke-width="1.2" stroke-dasharray="1 1" />
            <line x1="124" y1="112" x2="124" y2="128" stroke="#111410" stroke-width="1.2" stroke-dasharray="1 1" />
            <line x1="128" y1="112" x2="128" y2="128" stroke="#111410" stroke-width="1.2" stroke-dasharray="1 1" />

            <!-- Center Grip Indicator with Hardware Vector Glow -->
            <circle cx="120" cy="120" r="6" fill="#D8FF3E" opacity="0.3" />
            <circle cx="120" cy="120" r="3" fill="#D8FF3E" />

            <!-- Right Collar Lock with Hardware Vector Glow -->
            <rect x="134" y="106" width="10" height="28" rx="2" fill="url(#dbPlateShadow)" stroke="#34382F" stroke-width="1" />
            <circle cx="139" cy="120" r="5" fill="#D8FF3E" opacity="0.3" />
            <circle cx="139" cy="120" r="2.5" fill="#D8FF3E" />

            <!-- Right Hex Plates Stack -->
            <polygon points="144,74 156,65 172,74 172,166 156,175 144,166" fill="url(#dbPlateFace)" stroke="#34382F" stroke-width="1.8" />
            <polygon points="148,80 156,73 168,80 168,160 156,167 148,160" fill="#161a15" stroke="#858a80" stroke-width="1" />

            <polygon points="156,60 182,45 208,60 208,180 182,195 156,180" fill="url(#dbPlateShadow)" stroke="#22281f" stroke-width="2" />
            <polygon points="162,65 182,54 202,65 202,175 182,186 162,175" fill="url(#dbPlateFace)" stroke="#454e40" stroke-width="2" />
            <polygon points="162,65 182,54 202,65 198,68 182,59 166,68" fill="url(#dbPlateBevelTop)" />
            <polygon points="168,76 182,68 196,76 196,164 182,172 168,164" fill="#121511" stroke="#D8FF3E" stroke-width="1.5" stroke-dasharray="6 3" />
            <text x="182" y="124" font-family="'Space Grotesk', 'Syne', monospace" font-size="12" font-weight="900" fill="#D8FF3E" text-anchor="middle" letter-spacing="1">50KG</text>
          </g>
        </svg>
      </div>

      <!-- PROTO MARK BRAND FLASH BURST -->
      <div id="intro-proto-burst" class="absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 opacity-0 scale-50 transition-all pointer-events-none z-40">
        <div class="relative w-32 h-32 flex flex-col items-center justify-center">
          <svg class="w-24 h-24 filter drop-shadow-[0_0_35px_#D8FF3E]" viewBox="0 0 100 100">
            <polygon points="50,5 90,26 90,74 50,95 10,74 10,26" fill="#111410" stroke="#D8FF3E" stroke-width="7"/>
            <polygon points="53,18 34,48 49,48 43,80 66,44 51,44" fill="#D8FF3E"/>
          </svg>
          <div class="mt-2 whitespace-nowrap text-[11px] font-mono font-black text-[#D8FF3E] tracking-widest bg-[#111410]/95 px-3 py-1 rounded-full border border-[#D8FF3E]/50 shadow-[0_0_20px_rgba(216,255,62,0.4)]">
            PROTOMANIA ENGAGED
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(introEl);

  // ==========================================
  // HIGH-PERFORMANCE PARTICLE SYSTEM (60 FPS LOCKED)
  // ==========================================
  const canvas = document.getElementById('intro-particles-canvas');
  let ctx = null;
  let particles = [];
  let isExplosionPhase = false;

  if (canvas) {
    canvas.width = 800;
    canvas.height = 800;
    ctx = canvas.getContext('2d');
  }

  function initAmbientDust() {
    particles = [];
    isExplosionPhase = false;
    for (let i = 0; i < 25; i++) {
      particles.push({
        x: Math.random() * 800,
        y: Math.random() * 800,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -Math.random() * 0.5 - 0.15,
        size: Math.random() * 2 + 1,
        color: Math.random() > 0.4 ? '#858A80' : '#D8FF3E',
        alpha: Math.random() * 0.3 + 0.1,
        decay: 0.001
      });
    }
    renderLoop();
  }

  function spawnImpactSparks() {
    isExplosionPhase = true;
    particles = [];
    const sparkColors = ['#D8FF3E', '#FFFFFF', '#9C8AFF', '#c4ec2a', '#F4F5EF'];
    for (let i = 0; i < 60; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 12 + 4;
      particles.push({
        x: 400,
        y: 400,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - Math.random() * 3,
        size: Math.random() * 3.5 + 1.2,
        color: sparkColors[Math.floor(Math.random() * sparkColors.length)],
        alpha: 1.0,
        decay: Math.random() * 0.038 + 0.02
      });
    }
  }

  function renderLoop() {
    if (!ctx || isCleanedUp) return;
    ctx.clearRect(0, 0, 800, 800);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (isExplosionPhase) {
        p.vx *= 0.93;
        p.vy = p.vy * 0.93 + 0.22;
        p.alpha -= p.decay;
      } else {
        if (p.y < 0) p.y = 800;
        if (p.x < 0) p.x = 800;
        if (p.x > 800) p.x = 0;
      }

      if (p.alpha > 0.02) {
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      } else if (isExplosionPhase) {
        particles.splice(i, 1);
      }
    }

    if (!isCleanedUp) {
      animationFrameId = requestAnimationFrame(renderLoop);
    }
  }

  initAmbientDust();

  // ==========================================
  // CONTROLS & SKIP
  // ==========================================
  const muteBtn = document.getElementById('intro-mute-btn');
  const muteIcon = document.getElementById('intro-mute-icon');
  const muteText = document.getElementById('intro-mute-text');
  const skipBtn = document.getElementById('intro-skip-btn');

  muteBtn?.addEventListener('click', async (e) => {
    e.stopPropagation();
    const newMuted = !introAudio.isMuted;
    introAudio.setMuted(newMuted);
    if (!newMuted) await introAudio.resume();
    localStorage.setItem('protomania_audio_muted', newMuted.toString());
    if (muteIcon) muteIcon.textContent = newMuted ? '🔇' : '🔊';
    if (muteText) muteText.textContent = newMuted ? 'MUTED' : 'SOUND ON';
  });

  const gestureEvents = ['pointerdown', 'mousedown', 'keydown', 'touchstart', 'click'];
  const unlockAudioGesture = async () => {
    await introAudio.resume();
    gestureEvents.forEach(evt => window.removeEventListener(evt, unlockAudioGesture));
  };
  gestureEvents.forEach(evt => window.addEventListener(evt, unlockAudioGesture, { once: true, passive: true }));
  introEl.addEventListener('pointerdown', unlockAudioGesture, { once: true, passive: true });

  function finishIntro(wasSkipped = false) {
    if (isCleanedUp) return;
    isCleanedUp = true;
    sessionStorage.setItem('protomania_intro_played', 'true');

    activeTimers.forEach(id => clearTimeout(id));
    if (animationFrameId) cancelAnimationFrame(animationFrameId);

    introAudio.stopAll();

    window.removeEventListener('keydown', handleKeydown);
    gestureEvents.forEach(evt => window.removeEventListener(evt, unlockAudioGesture));

    const doorL = document.getElementById('intro-door-left');
    const doorR = document.getElementById('intro-door-right');
    const arena = document.getElementById('intro-arena');
    const badge = document.getElementById('intro-anticipation-badge');

    if (badge) badge.style.opacity = '0';
    if (skipBtn) skipBtn.style.opacity = '0';
    if (muteBtn) muteBtn.style.opacity = '0';
    if (arena) arena.style.opacity = '0';

    if (wasSkipped) {
      introEl.style.transition = 'opacity 0.12s ease-out';
      introEl.style.opacity = '0';
      setTimeout(() => {
        introEl.remove();
        revealHeroDirectly();
      }, 120);
    } else {
      if (doorL && doorR) {
        doorL.style.transition = 'transform 1.9s cubic-bezier(0.4, 0, 0.2, 1)';
        doorR.style.transition = 'transform 1.9s cubic-bezier(0.4, 0, 0.2, 1)';
        doorL.style.transform = 'translate3d(-105%, 0, 0)';
        doorR.style.transform = 'translate3d(105%, 0, 0)';
      }

      setTimeout(() => {
        introEl.style.transition = 'opacity 0.3s ease';
        introEl.style.opacity = '0';
        setTimeout(() => {
          introEl.remove();
          revealHeroDirectly();
        }, 300);
      }, 100);
    }
  }

  function handleKeydown(e) {
    if (e.key === 'Escape') finishIntro(true);
  }
  window.addEventListener('keydown', handleKeydown);
  skipBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    finishIntro(true);
  });

  // ==========================================
  // RESPONSIVE, 60FPS CHOREOGRAPHY WITH INTERACTIVE TRIGGER
  // ==========================================
  const dbWrapper = document.getElementById('intro-dumbbell-wrapper');
  const floorShadow = document.getElementById('intro-floor-shadow');
  const badge = document.getElementById('intro-anticipation-badge');

  // Pre-warm GPU layer before the drop starts to eliminate drop lag
  requestAnimationFrame(() => {
    if (dbWrapper) {
      const _ = dbWrapper.offsetHeight;
    }
  });

  let dropStarted = false;
  function triggerDrop() {
    if (dropStarted || isCleanedUp) return;
    dropStarted = true;

    // Immediately resume audio context on this user gesture
    introAudio.resume();

    // Fade out anticipation badge
    if (badge) {
      badge.style.opacity = '0';
      badge.style.transform = 'translate3d(0, -25px, 0)';
      badge.style.pointerEvents = 'none';
    }

    // Drop dumbbell with gravitational acceleration (0.52s)
    if (dbWrapper) {
      dbWrapper.style.transition = 'transform 0.52s cubic-bezier(0.38, 0.05, 0.72, 0.15)';
      dbWrapper.style.transform = 'translate3d(0, 0, 0) rotate(0deg)';
    }

    if (floorShadow) {
      floorShadow.style.transition = 'transform 0.5s ease-out, opacity 0.5s ease-out';
      floorShadow.style.transform = 'translateX(-50%) translateY(110px) scale(1.1)';
      floorShadow.style.opacity = '0.9';
    }

    // Physical Impact Slam at 520ms
    activeTimers.push(setTimeout(() => {
      if (isCleanedUp) return;

      // Play pure, clean, single dumbbell impact thud
      introAudio.playSlam();

      // Heavy camera screen shake
      introEl.classList.add('intro-screen-shake-heavy');
      setTimeout(() => introEl.classList.remove('intro-screen-shake-heavy'), 500);

      // Dumbbell recoil bounce
      if (dbWrapper) {
        dbWrapper.classList.add('intro-dumbbell-recoil');
      }

      // Impact flash
      const flash = document.getElementById('intro-flash');
      if (flash) {
        flash.style.background = 'radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(216,255,62,0.8) 30%, rgba(156,138,255,0.3) 60%, transparent 80%)';
        flash.style.opacity = '1';
        flash.style.transition = 'opacity 0.25s ease-out';
        setTimeout(() => { if (flash) flash.style.opacity = '0'; }, 80);
      }

      // Dual shockwaves
      const w1 = document.getElementById('intro-wave-1');
      const w2 = document.getElementById('intro-wave-2');
      if (w1) w1.classList.add('intro-shockwave-active');
      setTimeout(() => {
        if (w2 && !isCleanedUp) w2.classList.add('intro-shockwave-secondary-active');
      }, 75);

      // Explosive radial sparks
      spawnImpactSparks();

      // Proto Mark burst stamp
      const burst = document.getElementById('intro-proto-burst');
      if (burst) {
        burst.style.opacity = '1';
        burst.style.transform = 'translate(-50%, -50%) scale(1.18)';
      }
    }, 520));

    // Heavy Gym Vault Doors Split Open (Silent & Majestic at 850ms)
    activeTimers.push(setTimeout(() => {
      if (isCleanedUp) return;

      const doorL = document.getElementById('intro-door-left');
      const doorR = document.getElementById('intro-door-right');
      if (doorL && doorR) {
        doorL.style.transition = 'transform 1.9s cubic-bezier(0.4, 0, 0.2, 1)';
        doorR.style.transition = 'transform 1.9s cubic-bezier(0.4, 0, 0.2, 1)';
        doorL.style.transform = 'translate3d(-105%, 0, 0)';
        doorR.style.transform = 'translate3d(105%, 0, 0)';
      }
    }, 850));

    // Dissolve Center Dumbbell & Impact Stamps as website emerges (at 1700ms)
    activeTimers.push(setTimeout(() => {
      if (isCleanedUp) return;

      if (dbWrapper) {
        dbWrapper.style.transition = 'opacity 0.65s ease, transform 0.65s ease';
        dbWrapper.style.opacity = '0';
        dbWrapper.style.transform = 'translate3d(0, 0, 0) scale(0.9)';
      }

      const burst = document.getElementById('intro-proto-burst');
      if (burst) {
        burst.style.transition = 'opacity 0.5s ease';
        burst.style.opacity = '0';
      }

      if (floorShadow) {
        floorShadow.style.transition = 'opacity 0.5s ease';
        floorShadow.style.opacity = '0';
      }
    }, 1700));

    // Complete & Interactive Website Handoff at 2800ms (Doors fully cleared)
    activeTimers.push(setTimeout(() => {
      if (!isCleanedUp) {
        finishIntro(false);
      }
    }, 2800));
  }

  // Triggering Choreography
  if (forceReplay) {
    // Replay mode: user already clicked the replay button, trigger drop after 150ms
    activeTimers.push(setTimeout(triggerDrop, 150));
  } else {
    // First visit mode: user taps anywhere on screen to enter with sound
    const gestureEvents = ['pointerdown', 'mousedown', 'keydown', 'touchstart', 'click'];
    const handleInitialGesture = (e) => {
      if (e.target && (e.target.closest('#intro-mute-btn') || e.target.closest('#intro-skip-btn'))) return;
      gestureEvents.forEach(evt => window.removeEventListener(evt, handleInitialGesture));
      triggerDrop();
    };
    gestureEvents.forEach(evt => window.addEventListener(evt, handleInitialGesture, { once: true, passive: true }));
    introEl.addEventListener('pointerdown', handleInitialGesture, { once: true, passive: true });

    // Auto-drop fallback in case user does not touch screen for 2.2s
    activeTimers.push(setTimeout(() => {
      if (!dropStarted) {
        triggerDrop();
      }
    }, 2200));
  }
}

export function revealHeroDirectly() {
  const mainApp = document.getElementById('app');
  if (mainApp) {
    mainApp.classList.add('hero-revealed');
  }
}
