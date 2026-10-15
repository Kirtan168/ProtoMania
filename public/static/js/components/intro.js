/**
 * PROTOMANIA Cinematic Opening Experience
 * 1. Heavy Dumbbell drops into screen center with gravitational acceleration
 * 2. High-energy impact creates shockwave rings, subtle screen shake, and spark particles
 * 3. Hydraulic steel gym vault doors split open
 * 4. ProtoMania is revealed with hero cascade into the Budget Diet Planner
 * Includes full skip option [Esc / Click] and prefers-reduced-motion accessibility.
 */

export function initCinematicIntro(forceReplay = false) {
  // Check reduced-motion preference
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasSeen = sessionStorage.getItem('protomania_intro_played') === 'true';

  if ((hasSeen && !forceReplay) || prefersReduced) {
    // Skip animation and ensure hero is revealed immediately
    revealHeroDirectly();
    return;
  }

  // Remove any existing intro element
  const existing = document.getElementById('cinematic-intro');
  if (existing) existing.remove();

  const introEl = document.createElement('div');
  introEl.id = 'cinematic-intro';
  introEl.className = 'fixed inset-0 z-[9999] overflow-hidden flex items-center justify-center select-none bg-[#111410]';

  introEl.innerHTML = `
    <!-- LEFT GYM VAULT DOOR -->
    <div id="intro-door-left" class="intro-door absolute top-0 left-0 bottom-0 w-1/2 bg-[#141812] border-r-2 border-[#D8FF3E]/40 z-20 flex flex-col justify-between p-6 sm:p-12 overflow-hidden shadow-2xl">
      <!-- Metallic Hex Grid Background -->
      <div class="absolute inset-0 opacity-10 bg-[radial-gradient(#D8FF3E_1px,transparent_1px)] [background-size:24px_24px]"></div>
      <!-- Diagonal Caution Stripes -->
      <div class="absolute top-0 right-0 w-3 h-full bg-[repeating-linear-gradient(45deg,#D8FF3E,#D8FF3E_12px,#111410_12px,#111410_24px)] opacity-60"></div>
      
      <!-- Door Top Decal -->
      <div class="relative z-10 flex items-center space-x-2 text-[10px] font-mono text-[#858A80] tracking-widest uppercase">
        <span class="w-2 h-2 rounded-full bg-[#D8FF3E] animate-pulse"></span>
        <span>VAULT 01 • SECTOR L</span>
      </div>

      <!-- Left Big Watermark Brand Lettering -->
      <div class="relative z-10 my-auto text-right pr-6 sm:pr-12">
        <div class="text-4xl sm:text-7xl font-black font-heading text-[#242C20] tracking-tighter select-none">
          PROTO
        </div>
        <div class="text-[10px] font-mono text-[#858A80] tracking-widest mt-1">
          SYS.VER // 2.6.4
        </div>
      </div>

      <!-- Door Bottom Decal -->
      <div class="relative z-10 text-[9px] font-mono text-[#858A80]/60">
        AUTONOMOUS DIET PROTOCOL READY
      </div>
    </div>

    <!-- RIGHT GYM VAULT DOOR -->
    <div id="intro-door-right" class="intro-door absolute top-0 right-0 bottom-0 w-1/2 bg-[#141812] border-l-2 border-[#D8FF3E]/40 z-20 flex flex-col justify-between p-6 sm:p-12 overflow-hidden shadow-2xl">
      <!-- Metallic Hex Grid Background -->
      <div class="absolute inset-0 opacity-10 bg-[radial-gradient(#D8FF3E_1px,transparent_1px)] [background-size:24px_24px]"></div>
      <!-- Diagonal Caution Stripes -->
      <div class="absolute top-0 left-0 w-3 h-full bg-[repeating-linear-gradient(-45deg,#D8FF3E,#D8FF3E_12px,#111410_12px,#111410_24px)] opacity-60"></div>

      <!-- Door Top Decal -->
      <div class="relative z-10 flex items-center justify-end space-x-2 text-[10px] font-mono text-[#858A80] tracking-widest uppercase">
        <span>SECURITY LOCK • ENGAGED</span>
        <span class="w-2 h-2 rounded-full bg-[#9C8AFF] animate-ping"></span>
      </div>

      <!-- Right Big Watermark Brand Lettering -->
      <div class="relative z-10 my-auto pl-6 sm:pl-12">
        <div class="text-4xl sm:text-7xl font-black font-heading text-[#242C20] tracking-tighter select-none">
          MANIA
        </div>
        <div class="text-[10px] font-mono text-[#D8FF3E] tracking-widest mt-1">
          YOUR ERA STARTS NOW
        </div>
      </div>

      <!-- Door Bottom Decal -->
      <div class="relative z-10 text-right text-[9px] font-mono text-[#858A80]/60">
        BUDGET OPTIMIZATION ENGINE
      </div>
    </div>

    <!-- SKIP BUTTON -->
    <button id="intro-skip-btn" class="absolute top-6 right-6 z-40 bg-[#111410]/90 backdrop-blur-md border border-[#D8FF3E]/50 text-[#D8FF3E] text-xs font-mono font-bold px-4 py-2 rounded-full flex items-center space-x-2 hover:bg-[#D8FF3E] hover:text-[#111410] transition-all cursor-pointer shadow-[0_0_20px_rgba(216,255,62,0.25)]">
      <span>SKIP INTRO</span>
      <span class="text-[10px] opacity-75 hidden sm:inline">[Esc]</span>
      <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="19" y1="5" x2="19" y2="19"></line></svg>
    </button>

    <!-- IMPACT ARENA & STAGE -->
    <div id="intro-arena" class="relative z-30 flex flex-col items-center justify-center pointer-events-none">
      
      <!-- Central Shockwave Flash Overlay -->
      <div id="intro-flash" class="absolute inset-0 w-[500px] h-[500px] -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 rounded-full pointer-events-none opacity-0"></div>

      <!-- Concentric Shockwave Rings -->
      <div id="intro-wave-1" class="intro-shockwave absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 w-4 h-4 rounded-full border-2 border-[#D8FF3E] pointer-events-none opacity-0"></div>
      <div id="intro-wave-2" class="intro-shockwave absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 w-4 h-4 rounded-full border-2 border-[#9C8AFF] pointer-events-none opacity-0"></div>

      <!-- Particle Canvas -->
      <canvas id="intro-particles-canvas" class="absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 w-[700px] h-[700px] pointer-events-none"></canvas>

      <!-- FALLING 3D DUMBBELL (Scalable High-Detail Vector) -->
      <div id="intro-dumbbell-wrapper" class="relative z-30">
        <svg class="w-44 h-44 sm:w-56 sm:h-56 filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.9)]" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="dbPlateGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#34382F" />
              <stop offset="50%" stop-color="#1B1E19" />
              <stop offset="100%" stop-color="#0E110E" />
            </linearGradient>
            <linearGradient id="dbBarGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#858A80" />
              <stop offset="40%" stop-color="#F4F5EF" />
              <stop offset="70%" stop-color="#858A80" />
              <stop offset="100%" stop-color="#34382F" />
            </linearGradient>
            <linearGradient id="dbLimeAccent" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#D8FF3E" />
              <stop offset="100%" stop-color="#9C8AFF" />
            </linearGradient>
            <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          <!-- Shadow Base on floor -->
          <ellipse cx="100" cy="180" rx="45" ry="10" fill="#000000" opacity="0.6" />

          <!-- Left Hex Plates Cluster -->
          <!-- Outer Big Plate -->
          <polygon points="35,60 55,48 75,60 75,140 55,152 35,140" fill="url(#dbPlateGrad)" stroke="#34382F" stroke-width="2.5" />
          <polygon points="38,64 55,54 72,64 72,136 55,146 38,136" fill="#141713" stroke="#D8FF3E" stroke-width="1.5" stroke-dasharray="4 2" />
          <!-- Inner Weight Plate -->
          <polygon points="45,70 58,62 70,70 70,130 58,138 45,130" fill="url(#dbPlateGrad)" stroke="#858A80" stroke-width="1.5" />
          <!-- Weight Text Stamp -->
          <text x="56" y="105" font-family="'Space Grotesk', monospace" font-size="11" font-weight="bold" fill="#D8FF3E" text-anchor="middle">50KG</text>

          <!-- Steel Knurled Barbell Center Grip -->
          <rect x="75" y="93" width="50" height="14" rx="2" fill="url(#dbBarGrad)" stroke="#111410" stroke-width="1.5" />
          <!-- Knurling Texture Lines -->
          <line x1="85" y1="94" x2="85" y2="106" stroke="#111410" stroke-width="1.5" stroke-dasharray="1 1" />
          <line x1="92" y1="94" x2="92" y2="106" stroke="#111410" stroke-width="1.5" stroke-dasharray="1 1" />
          <line x1="100" y1="94" x2="100" y2="106" stroke="#111410" stroke-width="1.5" stroke-dasharray="1 1" />
          <line x1="108" y1="94" x2="108" y2="106" stroke="#111410" stroke-width="1.5" stroke-dasharray="1 1" />
          <line x1="115" y1="94" x2="115" y2="106" stroke="#111410" stroke-width="1.5" stroke-dasharray="1 1" />

          <!-- Center Lime Ring Collar Lock -->
          <circle cx="100" cy="100" r="4.5" fill="#D8FF3E" filter="url(#neonGlow)" />

          <!-- Right Hex Plates Cluster -->
          <!-- Inner Plate -->
          <polygon points="130,70 142,62 155,70 155,130 142,138 130,130" fill="url(#dbPlateGrad)" stroke="#858A80" stroke-width="1.5" />
          <!-- Outer Big Plate -->
          <polygon points="125,60 145,48 165,60 165,140 145,152 125,140" fill="url(#dbPlateGrad)" stroke="#34382F" stroke-width="2.5" />
          <polygon points="128,64 145,54 162,64 162,136 145,146 128,136" fill="#141713" stroke="#D8FF3E" stroke-width="1.5" stroke-dasharray="4 2" />
          <!-- Weight Text Stamp -->
          <text x="144" y="105" font-family="'Space Grotesk', monospace" font-size="11" font-weight="bold" fill="#D8FF3E" text-anchor="middle">50KG</text>
        </svg>
      </div>

      <!-- Proto Mark Brand Blast (Appears upon impact) -->
      <div id="intro-proto-burst" class="absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 opacity-0 scale-50 transition-all pointer-events-none z-40">
        <div class="relative w-28 h-28 flex items-center justify-center">
          <svg class="w-full h-full filter drop-shadow-[0_0_35px_#D8FF3E]" viewBox="0 0 100 100">
            <polygon points="50,5 90,26 90,74 50,95 10,74 10,26" fill="#111410" stroke="#D8FF3E" stroke-width="8"/>
            <polygon points="53,18 34,48 49,48 43,80 66,44 51,44" fill="#D8FF3E"/>
          </svg>
          <div class="absolute -bottom-6 whitespace-nowrap text-xs font-mono font-black text-[#D8FF3E] tracking-widest bg-[#111410]/90 px-3 py-1 rounded-full border border-[#D8FF3E]/40 shadow-lg">
            PROTOMANIA ENGAGED
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(introEl);

  // Setup particle canvas
  const canvas = document.getElementById('intro-particles-canvas');
  let ctx = null;
  let particles = [];
  if (canvas) {
    canvas.width = 700;
    canvas.height = 700;
    ctx = canvas.getContext('2d');
  }

  function spawnParticles() {
    if (!ctx) return;
    const colors = ['#D8FF3E', '#9C8AFF', '#F4F5EF', '#c4ec2a'];
    for (let i = 0; i < 70; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 9 + 4;
      particles.push({
        x: 350,
        y: 350,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - Math.random() * 2,
        size: Math.random() * 4 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        decay: Math.random() * 0.03 + 0.02
      });
    }
    renderParticles();
  }

  function renderParticles() {
    if (!ctx || particles.length === 0) return;
    ctx.clearRect(0, 0, 700, 700);
    particles.forEach((p, idx) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.94;
      p.vy *= 0.94;
      p.alpha -= p.decay;

      if (p.alpha > 0) {
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      } else {
        particles.splice(idx, 1);
      }
    });

    if (particles.length > 0) {
      requestAnimationFrame(renderParticles);
    }
  }

  let isCleanedUp = false;

  function finishIntro() {
    if (isCleanedUp) return;
    isCleanedUp = true;
    sessionStorage.setItem('protomania_intro_played', 'true');

    // Remove escape key listener
    window.removeEventListener('keydown', handleKeydown);

    // Split the doors open with animation
    const doorL = document.getElementById('intro-door-left');
    const doorR = document.getElementById('intro-door-right');
    const arena = document.getElementById('intro-arena');
    const skipBtn = document.getElementById('intro-skip-btn');

    if (skipBtn) skipBtn.style.opacity = '0';
    if (arena) arena.style.opacity = '0';

    if (doorL && doorR) {
      doorL.style.transition = 'transform 0.65s cubic-bezier(0.77, 0, 0.175, 1)';
      doorR.style.transition = 'transform 0.65s cubic-bezier(0.77, 0, 0.175, 1)';
      doorL.style.transform = 'translateX(-101%)';
      doorR.style.transform = 'translateX(101%)';
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

  function handleKeydown(e) {
    if (e.key === 'Escape') {
      finishIntro();
    }
  }

  window.addEventListener('keydown', handleKeydown);
  document.getElementById('intro-skip-btn')?.addEventListener('click', finishIntro);

  // TIMED ANIMATION CHOREOGRAPHY
  // 1. Initial State: Dumbbell above screen
  const db = document.getElementById('intro-dumbbell-wrapper');
  if (db) {
    db.style.transform = 'translateY(-120vh) rotate(-15deg)';
    db.style.transition = 'transform 0.55s cubic-bezier(0.55, 0.085, 0.68, 0.53)';
  }

  // 2. Drop dumbbell at t = 80ms
  setTimeout(() => {
    if (isCleanedUp) return;
    if (db) {
      db.style.transform = 'translateY(0) rotate(0deg)';
    }
  }, 80);

  // 3. Impact Slam at t = 640ms
  setTimeout(() => {
    if (isCleanedUp) return;

    // Slam container shake
    introEl.classList.add('intro-screen-shake');
    setTimeout(() => introEl.classList.remove('intro-screen-shake'), 450);

    // Spawn sparks
    spawnParticles();

    // Trigger expanding shockwave waves
    const w1 = document.getElementById('intro-wave-1');
    const w2 = document.getElementById('intro-wave-2');
    if (w1) w1.classList.add('intro-shockwave-active');
    if (w2) {
      setTimeout(() => w2.classList.add('intro-shockwave-active'), 90);
    }

    // Flash background
    const flash = document.getElementById('intro-flash');
    if (flash) {
      flash.style.background = 'radial-gradient(circle, rgba(216,255,62,0.4) 0%, rgba(156,138,255,0.2) 40%, transparent 70%)';
      flash.style.opacity = '1';
      flash.style.transition = 'opacity 0.4s ease';
      setTimeout(() => { if (flash) flash.style.opacity = '0'; }, 100);
    }
  }, 640);

  // 4. Logo Burst & Proto Mark at t = 950ms
  setTimeout(() => {
    if (isCleanedUp) return;
    const burst = document.getElementById('intro-proto-burst');
    if (burst) {
      burst.style.opacity = '1';
      burst.style.transform = 'translate(-50%, -50%) scale(1.15)';
    }
    if (db) {
      db.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
      db.style.opacity = '0.3';
      db.style.transform = 'scale(0.85)';
    }
  }, 950);

  // 5. Open Doors & Complete at t = 1500ms
  setTimeout(() => {
    if (!isCleanedUp) {
      finishIntro();
    }
  }, 1500);
}

function revealHeroDirectly() {
  const mainApp = document.getElementById('app');
  if (mainApp) {
    mainApp.classList.add('hero-revealed');
  }
}
