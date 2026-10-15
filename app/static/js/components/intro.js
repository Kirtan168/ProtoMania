/**
 * PROTOMANIA — CINEMATIC INTRO ANIMATION (UPGRADE)
 * 
 * 5-Scene Immersive Sequence:
 * Scene 1 (0.0s - 0.8s): Anticipation dark room, spotlight, floating dust particles,
 *                        film grain, subtle logo emergence, "PREPARING YOUR SESSION." text,
 *                        sub-bass drone & metallic tension ambience.
 * Scene 2 (0.8s - 1.6s): Realistic 3D dumbbell sudden gravitational drop, rotation,
 *                        motion blur, aerodynamic rising whoosh.
 * Scene 3 (1.6s - 1.9s): THE IMPACT — 4-layer physical slam, screen shake, dual neon shockwaves,
 *                        recoil bounce, explosive floor sparks & debris, Proto Mark burst.
 * Scene 4 (1.9s - 2.8s): Industrial steel gym vault doors split open with pneumatic hiss
 *                        and mechanical track rumble, revealing the live website.
 * Scene 5 (2.8s - 3.5s): Final reveal, warm sub accent & Solfeggio chime, hero headline cascade.
 * 
 * Includes:
 * - Full Web Audio API procedural sound engine with zero 404 risk
 * - Autoplay compliance with stylish "TAP FOR SOUND" prompt fallback
 * - Mute / Unmute toggle [🔊 SOUND ON / 🔇 MUTED] with localStorage memory
 * - Instant Skip [Esc / Click] with 40ms sound cutoff & immediate interactive site reveal
 * - prefers-reduced-motion accessibility support
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
    <!-- PROCEDURAL FILM GRAIN & AMBIENT DUST OVERLAY -->
    <div class="absolute inset-0 bg-film-grain pointer-events-none z-10 opacity-70"></div>

    <!-- CENTRAL PULSING SPOTLIGHT (SCENE 1) -->
    <div id="intro-spotlight" class="intro-spotlight absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] rounded-full pointer-events-none z-0 bg-[radial-gradient(circle,rgba(216,255,62,0.16)_0%,rgba(156,138,255,0.06)_40%,transparent_70%)]"></div>

    <!-- LEFT INDUSTRIAL GYM VAULT DOOR -->
    <div id="intro-door-left" class="intro-door absolute top-0 left-0 bottom-0 w-1/2 bg-[#121511] border-r border-[#34382F] z-20 flex flex-col justify-between p-6 sm:p-12 overflow-hidden shadow-[15px_0_40px_rgba(0,0,0,0.85)]">
      <!-- Metallic Grid Background Pattern -->
      <div class="absolute inset-0 opacity-15 bg-[radial-gradient(#D8FF3E_1px,transparent_1px)] [background-size:24px_24px]"></div>
      <!-- Tactical Hazard Striping along the seam -->
      <div class="absolute top-0 right-0 w-4 h-full bg-[repeating-linear-gradient(45deg,#D8FF3E,#D8FF3E_12px,#111410_12px,#111410_24px)] opacity-50"></div>
      <!-- Door Edge Inner Shadow for 3D Heavy Vault Depth -->
      <div class="absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-black/80 to-transparent pointer-events-none"></div>

      <!-- Left Door Top Telemetry -->
      <div class="relative z-10 flex items-center space-x-2 text-[10px] font-mono text-[#858A80] tracking-widest uppercase">
        <span class="w-2 h-2 rounded-full bg-[#D8FF3E] animate-ping"></span>
        <span class="text-[#D8FF3E] font-bold">HYDRAULIC SECTOR 01</span>
        <span class="text-[#858A80]/50">• PRESSURIZED</span>
      </div>

      <!-- Big Recessed Brand Watermark -->
      <div class="relative z-10 my-auto text-right pr-6 sm:pr-14">
        <div class="text-5xl sm:text-8xl font-black font-heading text-[#1c221a] tracking-tighter select-none scale-y-110">
          PROTO
        </div>
        <div class="text-[11px] font-mono text-[#D8FF3E]/70 tracking-widest mt-1">
          STUDENT FITNESS ARCHITECTURE
        </div>
      </div>

      <!-- Left Door Bottom Telemetry -->
      <div class="relative z-10 flex items-center justify-between text-[9px] font-mono text-[#858A80]">
        <span>SYS.LOCK // SECURE</span>
        <span class="text-[#D8FF3E]">50KG CALIBRATED</span>
      </div>
    </div>

    <!-- RIGHT INDUSTRIAL GYM VAULT DOOR -->
    <div id="intro-door-right" class="intro-door absolute top-0 right-0 bottom-0 w-1/2 bg-[#121511] border-l border-[#34382F] z-20 flex flex-col justify-between p-6 sm:p-12 overflow-hidden shadow-[-15px_0_40px_rgba(0,0,0,0.85)]">
      <!-- Metallic Grid Background Pattern -->
      <div class="absolute inset-0 opacity-15 bg-[radial-gradient(#D8FF3E_1px,transparent_1px)] [background-size:24px_24px]"></div>
      <!-- Tactical Hazard Striping along the seam -->
      <div class="absolute top-0 left-0 w-4 h-full bg-[repeating-linear-gradient(-45deg,#D8FF3E,#D8FF3E_12px,#111410_12px,#111410_24px)] opacity-50"></div>
      <!-- Door Edge Inner Shadow for 3D Heavy Vault Depth -->
      <div class="absolute top-0 left-0 w-24 h-full bg-gradient-to-r from-black/80 to-transparent pointer-events-none"></div>

      <!-- Right Door Top Telemetry -->
      <div class="relative z-10 flex items-center justify-end space-x-2 text-[10px] font-mono text-[#858A80] tracking-widest uppercase">
        <span class="text-[#9C8AFF] font-bold">BUDGET ENGINE 2.0</span>
        <span class="w-2 h-2 rounded-full bg-[#9C8AFF] animate-pulse"></span>
      </div>

      <!-- Big Recessed Brand Watermark -->
      <div class="relative z-10 my-auto pl-6 sm:pl-14">
        <div class="text-5xl sm:text-8xl font-black font-heading text-[#1c221a] tracking-tighter select-none scale-y-110">
          MANIA
        </div>
        <div class="text-[11px] font-mono text-[#9C8AFF]/70 tracking-widest mt-1">
          YOUR BODY • YOUR BUDGET • YOUR ERA
        </div>
      </div>

      <!-- Right Door Bottom Telemetry -->
      <div class="relative z-10 flex items-center justify-between text-[9px] font-mono text-[#858A80]">
        <span class="text-[#9C8AFF]">AUTONOMOUS OPTIMIZATION</span>
        <span>STATUS: READY</span>
      </div>
    </div>

    <!-- TOP CONTROLS (MUTE TOGGLE & SKIP BUTTON) -->
    <div class="absolute top-5 right-5 sm:top-7 sm:right-7 z-40 flex items-center space-x-3 pointer-events-auto">
      <!-- Sound Mute / Unmute Button -->
      <button id="intro-mute-btn" class="bg-[#141812]/90 backdrop-blur-md border border-[#34382F] hover:border-[#D8FF3E] text-[#F4F5EF] hover:text-[#D8FF3E] text-[11px] font-mono font-bold px-3 py-1.5 rounded-full flex items-center space-x-1.5 transition-all cursor-pointer shadow-lg">
        <span id="intro-mute-icon">${savedMute ? '🔇' : '🔊'}</span>
        <span id="intro-mute-text">${savedMute ? 'MUTED' : 'SOUND ON'}</span>
      </button>

      <!-- Skip Button -->
      <button id="intro-skip-btn" class="bg-[#111410]/90 backdrop-blur-md border border-[#D8FF3E]/60 text-[#D8FF3E] hover:bg-[#D8FF3E] hover:text-[#111410] text-[11px] font-mono font-bold px-4 py-1.5 rounded-full flex items-center space-x-1.5 transition-all cursor-pointer shadow-[0_0_20px_rgba(216,255,62,0.25)]">
        <span>SKIP INTRO</span>
        <span class="text-[10px] opacity-70 hidden sm:inline">[Esc]</span>
        <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="19" y1="5" x2="19" y2="19"></line></svg>
      </button>
    </div>

    <!-- SCENE 1: ANTICIPATION HUD TEXT BADGE -->
    <div id="intro-anticipation-badge" class="absolute z-35 top-1/2 -translate-y-24 flex flex-col items-center pointer-events-none transition-all duration-400">
      <div class="flex items-center space-x-2 bg-[#141812]/90 border border-[#D8FF3E]/40 px-4 py-1.5 rounded-full backdrop-blur-md shadow-[0_0_20px_rgba(216,255,62,0.2)]">
        <span class="w-2 h-2 rounded-full bg-[#D8FF3E] animate-ping"></span>
        <span class="text-[11px] font-mono font-bold text-[#D8FF3E] tracking-widest uppercase">PREPARING YOUR SESSION</span>
      </div>
      <span class="text-[10px] font-mono text-[#858A80] tracking-wider mt-2">CALIBRATING MAXIMUM PROTEIN PROTOCOLS...</span>
    </div>

    <!-- AUTOPLAY UNLOCK PROMPT (Visible only if browser blocked initial autoplay) -->
    <button id="intro-tap-prompt" class="hidden absolute bottom-10 left-1/2 -translate-x-1/2 z-40 bg-[#1B1E19]/95 border border-[#D8FF3E]/70 text-[#D8FF3E] px-5 py-2.5 rounded-full font-mono text-xs flex items-center space-x-2.5 shadow-[0_0_30px_rgba(216,255,62,0.4)] cursor-pointer hover:bg-[#D8FF3E] hover:text-[#111410] transition-all animate-bounce">
      <span>🔊</span>
      <span class="font-bold tracking-wider">TAP FOR IMMERSIVE SOUND</span>
    </button>

    <!-- IMPACT ARENA & 3D STAGE -->
    <div id="intro-arena" class="relative z-30 flex flex-col items-center justify-center pointer-events-none">
      
      <!-- Instant Impact White/Neon Flash Screen -->
      <div id="intro-flash" class="absolute w-[800px] h-[800px] -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 rounded-full pointer-events-none opacity-0"></div>

      <!-- Dual Concentric Shockwave Rings -->
      <div id="intro-wave-1" class="intro-shockwave absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 w-4 h-4 rounded-full border-[3px] border-[#D8FF3E] pointer-events-none opacity-0"></div>
      <div id="intro-wave-2" class="intro-shockwave absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 w-4 h-4 rounded-full border-[2.5px] border-[#9C8AFF] pointer-events-none opacity-0"></div>

      <!-- High-Performance Canvas for Ambient Dust & Impact Sparks -->
      <canvas id="intro-particles-canvas" class="absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 w-[800px] h-[800px] pointer-events-none"></canvas>

      <!-- FLOOR SHADOW BASE (Expands and tightens as dumbbell lands) -->
      <div id="intro-floor-shadow" class="absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-28 w-44 h-8 rounded-full bg-black/80 blur-md transition-all duration-700 scale-50 opacity-20"></div>

      <!-- MASSIVE REALISTIC 3D CAST-IRON DUMBBELL VECTOR -->
      <div id="intro-dumbbell-wrapper" class="relative z-30">
        <svg id="intro-dumbbell-svg" class="w-56 h-56 sm:w-72 sm:h-72 filter drop-shadow-[0_25px_35px_rgba(0,0,0,0.95)]" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <!-- Vertical Motion Blur for Falling Acceleration -->
            <filter id="motionBlurDrop" x="-20%" y="-50%" width="140%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="0 8" />
            </filter>

            <!-- Cast Iron Plate Texture & Multi-Tone Lighting -->
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

            <!-- Chrome Steel Knurled Barbell Grip -->
            <linearGradient id="dbChromeBar" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#4d554a" />
              <stop offset="25%" stop-color="#858a80" />
              <stop offset="50%" stop-color="#f4f5ef" />
              <stop offset="75%" stop-color="#858a80" />
              <stop offset="100%" stop-color="#2b3127" />
            </linearGradient>

            <!-- Acid Lime Collar Ring -->
            <linearGradient id="dbLimeAccent" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#d8ff3e" />
              <stop offset="100%" stop-color="#9cb822" />
            </linearGradient>

            <filter id="neonGlowLime" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          <!-- DUMBBELL GRAPHIC GROUP (Accepts Motion Blur filter during fall) -->
          <g id="intro-dumbbell-group">
            
            <!-- ================= LEFT HEX PLATES STACK ================= -->
            <!-- Outer Hex Plate 1 (Large 50KG Plate) -->
            <!-- Plate Bevel & Back Thickness -->
            <polygon points="32,60 58,45 84,60 84,180 58,195 32,180" fill="url(#dbPlateShadow)" stroke="#22281f" stroke-width="2" />
            <!-- Plate Front Face -->
            <polygon points="38,65 58,54 78,65 78,175 58,186 38,175" fill="url(#dbPlateFace)" stroke="#454e40" stroke-width="2" />
            <!-- Top Chamfer Highlight -->
            <polygon points="38,65 58,54 78,65 74,68 58,59 42,68" fill="url(#dbPlateBevelTop)" />
            
            <!-- Recessed Inner Ring & Weight Stamp -->
            <polygon points="44,76 58,68 72,76 72,164 58,172 44,164" fill="#121511" stroke="#D8FF3E" stroke-width="1.5" stroke-dasharray="6 3" />
            <text x="58" y="124" font-family="'Space Grotesk', 'Syne', monospace" font-size="12" font-weight="900" fill="#D8FF3E" text-anchor="middle" letter-spacing="1">50KG</text>

            <!-- Inner Hex Plate 2 (Smaller Secondary Plate for 3D realism) -->
            <polygon points="68,74 84,65 96,74 96,166 84,175 68,166" fill="url(#dbPlateFace)" stroke="#34382F" stroke-width="1.8" />
            <polygon points="72,80 84,73 92,80 92,160 84,167 72,160" fill="#161a15" stroke="#858a80" stroke-width="1" />

            <!-- Left Steel Shaft Collar Lock -->
            <rect x="96" y="106" width="10" height="28" rx="2" fill="url(#dbPlateShadow)" stroke="#34382F" stroke-width="1" />
            <circle cx="101" cy="120" r="3" fill="#D8FF3E" filter="url(#neonGlowLime)" />

            <!-- ================= STEEL KNURLED BARBELL SHAFT ================= -->
            <rect x="106" y="112" width="28" height="16" rx="2" fill="url(#dbChromeBar)" stroke="#111410" stroke-width="1.5" />
            <!-- Knurling Texture Diamond Crosshatch Lines -->
            <line x1="112" y1="112" x2="112" y2="128" stroke="#111410" stroke-width="1.2" stroke-dasharray="1 1" />
            <line x1="116" y1="112" x2="116" y2="128" stroke="#111410" stroke-width="1.2" stroke-dasharray="1 1" />
            <line x1="120" y1="112" x2="120" y2="128" stroke="#111410" stroke-width="1.2" stroke-dasharray="1 1" />
            <line x1="124" y1="112" x2="124" y2="128" stroke="#111410" stroke-width="1.2" stroke-dasharray="1 1" />
            <line x1="128" y1="112" x2="128" y2="128" stroke="#111410" stroke-width="1.2" stroke-dasharray="1 1" />

            <!-- Center Grip Tactical Ring -->
            <circle cx="120" cy="120" r="3.5" fill="#D8FF3E" filter="url(#neonGlowLime)" />

            <!-- Right Steel Shaft Collar Lock -->
            <rect x="134" y="106" width="10" height="28" rx="2" fill="url(#dbPlateShadow)" stroke="#34382F" stroke-width="1" />
            <circle cx="139" cy="120" r="3" fill="#D8FF3E" filter="url(#neonGlowLime)" />

            <!-- ================= RIGHT HEX PLATES STACK ================= -->
            <!-- Inner Hex Plate 2 -->
            <polygon points="144,74 156,65 172,74 172,166 156,175 144,166" fill="url(#dbPlateFace)" stroke="#34382F" stroke-width="1.8" />
            <polygon points="148,80 156,73 168,80 168,160 156,167 148,160" fill="#161a15" stroke="#858a80" stroke-width="1" />

            <!-- Outer Hex Plate 1 (Large 50KG Plate) -->
            <!-- Plate Bevel & Back Thickness -->
            <polygon points="156,60 182,45 208,60 208,180 182,195 156,180" fill="url(#dbPlateShadow)" stroke="#22281f" stroke-width="2" />
            <!-- Plate Front Face -->
            <polygon points="162,65 182,54 202,65 202,175 182,186 162,175" fill="url(#dbPlateFace)" stroke="#454e40" stroke-width="2" />
            <!-- Top Chamfer Highlight -->
            <polygon points="162,65 182,54 202,65 198,68 182,59 166,68" fill="url(#dbPlateBevelTop)" />

            <!-- Recessed Inner Ring & Weight Stamp -->
            <polygon points="168,76 182,68 196,76 196,164 182,172 168,164" fill="#121511" stroke="#D8FF3E" stroke-width="1.5" stroke-dasharray="6 3" />
            <text x="182" y="124" font-family="'Space Grotesk', 'Syne', monospace" font-size="12" font-weight="900" fill="#D8FF3E" text-anchor="middle" letter-spacing="1">50KG</text>
          </g>
        </svg>
      </div>

      <!-- PROTO MARK BRAND FLASH BURST (Stamps into view upon impact) -->
      <div id="intro-proto-burst" class="absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 opacity-0 scale-50 transition-all pointer-events-none z-40">
        <div class="relative w-32 h-32 flex flex-col items-center justify-center">
          <!-- Hexagonal Neon Lightning Bolt Symbol -->
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
  // PARTICLE SYSTEM: AMBIENT DUST & IMPACT SPARKS
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

  // Scene 1: Floating ambient chalk & gym dust motes
  function initAmbientDust() {
    particles = [];
    isExplosionPhase = false;
    for (let i = 0; i < 35; i++) {
      particles.push({
        x: Math.random() * 800,
        y: Math.random() * 800,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -Math.random() * 0.6 - 0.2,
        size: Math.random() * 2.2 + 1,
        color: Math.random() > 0.4 ? '#858A80' : '#D8FF3E',
        alpha: Math.random() * 0.35 + 0.1,
        decay: 0.001
      });
    }
    renderLoop();
  }

  // Scene 3: High-energy radial impact sparks & concrete debris
  function spawnImpactSparks() {
    isExplosionPhase = true;
    particles = [];
    const sparkColors = ['#D8FF3E', '#FFFFFF', '#9C8AFF', '#c4ec2a', '#F4F5EF', '#eab308'];
    for (let i = 0; i < 75; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 14 + 5;
      particles.push({
        x: 400,
        y: 400,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - Math.random() * 4,
        size: Math.random() * 4 + 1.5,
        color: sparkColors[Math.floor(Math.random() * sparkColors.length)],
        alpha: 1.0,
        decay: Math.random() * 0.035 + 0.018,
        isSpark: true
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
        p.vy = p.vy * 0.93 + 0.25; // gravity pull
        p.alpha -= p.decay;
      } else {
        // Wrap ambient dust smoothly
        if (p.y < 0) p.y = 800;
        if (p.x < 0) p.x = 800;
        if (p.x > 800) p.x = 0;
      }

      if (p.alpha > 0.01) {
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        if (p.isSpark) {
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 10;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
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
  // AUDIO & USER CONTROLS MANAGEMENT
  // ==========================================
  const muteBtn = document.getElementById('intro-mute-btn');
  const muteIcon = document.getElementById('intro-mute-icon');
  const muteText = document.getElementById('intro-mute-text');
  const tapPrompt = document.getElementById('intro-tap-prompt');
  const skipBtn = document.getElementById('intro-skip-btn');

  // Toggle Mute
  muteBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    const newMuted = !introAudio.isMuted;
    introAudio.setMuted(newMuted);
    localStorage.setItem('protomania_audio_muted', newMuted.toString());
    if (muteIcon) muteIcon.textContent = newMuted ? '🔇' : '🔊';
    if (muteText) muteText.textContent = newMuted ? 'MUTED' : 'SOUND ON';
  });

  // Autoplay fallback: if audio suspended, display interactive prompt
  if (introAudio.isAutoplayBlocked()) {
    tapPrompt?.classList.remove('hidden');
  }

  const unlockAudioGesture = async () => {
    await introAudio.resume();
    tapPrompt?.classList.add('hidden');
    window.removeEventListener('click', unlockAudioGesture);
    window.removeEventListener('touchstart', unlockAudioGesture);
  };
  window.addEventListener('click', unlockAudioGesture, { once: true });
  window.addEventListener('touchstart', unlockAudioGesture, { once: true });

  // FINISH INTRO (Seamless transition to main application)
  function finishIntro(wasSkipped = false) {
    if (isCleanedUp) return;
    isCleanedUp = true;
    sessionStorage.setItem('protomania_intro_played', 'true');

    // Cancel all pending timeouts & animation frames
    activeTimers.forEach(id => clearTimeout(id));
    if (animationFrameId) cancelAnimationFrame(animationFrameId);

    // Stop all audio synthesis instantly
    introAudio.stopAll();

    window.removeEventListener('keydown', handleKeydown);
    window.removeEventListener('click', unlockAudioGesture);
    window.removeEventListener('touchstart', unlockAudioGesture);

    const doorL = document.getElementById('intro-door-left');
    const doorR = document.getElementById('intro-door-right');
    const arena = document.getElementById('intro-arena');
    const badge = document.getElementById('intro-anticipation-badge');

    if (tapPrompt) tapPrompt.remove();
    if (badge) badge.style.opacity = '0';
    if (skipBtn) skipBtn.style.opacity = '0';
    if (muteBtn) muteBtn.style.opacity = '0';
    if (arena) arena.style.opacity = '0';

    if (wasSkipped) {
      // Fast fade out on manual user skip (120ms)
      introEl.style.transition = 'opacity 0.15s ease-out';
      introEl.style.opacity = '0';
      setTimeout(() => {
        introEl.remove();
        revealHeroDirectly();
      }, 150);
    } else {
      // Natural Cinematic Vault Doors Opening (Scene 4 & 5 completion)
      if (doorL && doorR) {
        doorL.style.transition = 'transform 0.85s cubic-bezier(0.76, 0, 0.24, 1)';
        doorR.style.transition = 'transform 0.85s cubic-bezier(0.76, 0, 0.24, 1)';
        doorL.style.transform = 'translateX(-105%)';
        doorR.style.transform = 'translateX(105%)';
      }

      setTimeout(() => {
        introEl.style.transition = 'opacity 0.3s ease';
        introEl.style.opacity = '0';
        setTimeout(() => {
          introEl.remove();
          revealHeroDirectly();
        }, 300);
      }, 550);
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
  // EXACT 5-SCENE CHOREOGRAPHY TIMELINE
  // ==========================================
  const dbWrapper = document.getElementById('intro-dumbbell-wrapper');
  const dbGroup = document.getElementById('intro-dumbbell-group');
  const floorShadow = document.getElementById('intro-floor-shadow');
  const badge = document.getElementById('intro-anticipation-badge');

  // Initial State: Dumbbell suspended high above viewport
  if (dbWrapper) {
    dbWrapper.style.transform = 'translateY(-135vh) rotate(-14deg)';
  }

  // ----------------------------------------------------
  // SCENE 1: Sound of Anticipation (0.0s - 0.8s)
  // ----------------------------------------------------
  introAudio.playAnticipation();

  // ----------------------------------------------------
  // SCENE 2: The Dumbbell Drop (0.8s - 1.6s)
  // ----------------------------------------------------
  activeTimers.push(setTimeout(() => {
    if (isCleanedUp) return;

    // Fade out anticipation HUD text
    if (badge) {
      badge.style.opacity = '0';
      badge.style.transform = 'translateY(-30px)';
    }

    // Play rising aerodynamic whoosh sound
    introAudio.playWhoosh();

    // Enable vertical motion blur filter on dumbbell
    if (dbGroup) {
      dbGroup.setAttribute('filter', 'url(#motionBlurDrop)');
    }

    // High gravitational drop acceleration
    if (dbWrapper) {
      dbWrapper.style.transition = 'transform 0.8s cubic-bezier(0.55, 0.05, 0.675, 0.19)';
      dbWrapper.style.transform = 'translateY(0) rotate(0deg)';
    }

    // Floor shadow expands and sharpens as weight approaches
    if (floorShadow) {
      floorShadow.style.transform = 'translateX(-50%) translateY(110px) scale(1.1)';
      floorShadow.style.opacity = '0.9';
    }
  }, 800));

  // ----------------------------------------------------
  // SCENE 3: THE IMPACT SLAM (1.6s - 1.9s)
  // ----------------------------------------------------
  activeTimers.push(setTimeout(() => {
    if (isCleanedUp) return;

    // 1. Remove motion blur instantly on contact
    if (dbGroup) {
      dbGroup.removeAttribute('filter');
    }

    // 2. Play 4-layer synchronized physical impact sound
    introAudio.playSlam();

    // 3. Trigger heavy camera screen shake
    introEl.classList.add('intro-screen-shake-heavy');
    setTimeout(() => introEl.classList.remove('intro-screen-shake-heavy'), 550);

    // 4. Dumbbell physical recoil bounce
    if (dbWrapper) {
      dbWrapper.classList.add('intro-dumbbell-recoil');
    }

    // 5. High-intensity neon impact flash
    const flash = document.getElementById('intro-flash');
    if (flash) {
      flash.style.background = 'radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(216,255,62,0.8) 30%, rgba(156,138,255,0.3) 60%, transparent 80%)';
      flash.style.opacity = '1';
      flash.style.transition = 'opacity 0.28s ease-out';
      setTimeout(() => { if (flash) flash.style.opacity = '0'; }, 100);
    }

    // 6. Dual concentric shockwave rings
    const w1 = document.getElementById('intro-wave-1');
    const w2 = document.getElementById('intro-wave-2');
    if (w1) w1.classList.add('intro-shockwave-active');
    setTimeout(() => {
      if (w2 && !isCleanedUp) w2.classList.add('intro-shockwave-secondary-active');
    }, 85);

    // 7. Explosive radial sparks and embers burst
    spawnImpactSparks();

    // 8. Proto Mark burst stamp
    const burst = document.getElementById('intro-proto-burst');
    if (burst) {
      burst.style.opacity = '1';
      burst.style.transform = 'translate(-50%, -50%) scale(1.18)';
    }
  }, 1600));

  // ----------------------------------------------------
  // SCENE 4: Heavy Gym Doors Open (1.9s - 2.8s)
  // ----------------------------------------------------
  activeTimers.push(setTimeout(() => {
    if (isCleanedUp) return;

    // Play hydraulic pressure hiss & heavy mechanical rolling door tracks
    introAudio.playDoorOpen();

    // Vault doors split open with industrial momentum
    const doorL = document.getElementById('intro-door-left');
    const doorR = document.getElementById('intro-door-right');
    if (doorL && doorR) {
      doorL.style.transition = 'transform 0.9s cubic-bezier(0.76, 0, 0.24, 1)';
      doorR.style.transition = 'transform 0.9s cubic-bezier(0.76, 0, 0.24, 1)';
      doorL.style.transform = 'translateX(-105%)';
      doorR.style.transform = 'translateX(105%)';
    }
  }, 1900));

  // ----------------------------------------------------
  // SCENE 5: Final Reveal & Handoff (2.8s - 3.4s)
  // ----------------------------------------------------
  activeTimers.push(setTimeout(() => {
    if (isCleanedUp) return;

    // Final warm sub accent & Solfeggio crystalline chime
    introAudio.playRevealAccent();

    // Fade out dumbbell, burst mark, and particles smoothly
    if (dbWrapper) {
      dbWrapper.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      dbWrapper.style.opacity = '0';
      dbWrapper.style.transform = 'scale(0.85)';
    }

    const burst = document.getElementById('intro-proto-burst');
    if (burst) {
      burst.style.transition = 'opacity 0.35s ease';
      burst.style.opacity = '0';
    }

    if (floorShadow) {
      floorShadow.style.transition = 'opacity 0.35s ease';
      floorShadow.style.opacity = '0';
    }
  }, 2800));

  // Final DOM Cleanup and Website Readiness at t = 3.35s
  activeTimers.push(setTimeout(() => {
    if (!isCleanedUp) {
      finishIntro(false);
    }
  }, 3350));
}

export function revealHeroDirectly() {
  const mainApp = document.getElementById('app');
  if (mainApp) {
    mainApp.classList.add('hero-revealed');
  }
}
