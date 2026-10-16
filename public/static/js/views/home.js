/**
 * PROTOMANIA Homepage View
 * Bold, high-energy landing experience for college students and young adults in India.
 * Features the Live Interactive Budget-Based Diet Recommender as the STAR of the homepage.
 */

import { renderProtoMark } from "../components/logo.js";
import { api } from "../api.js";
import { animateValue } from "../utils.js";

export function renderHomeView(container) {
  let heroBudget = 80;
  let heroDiet = "vegetarian";
  let lastSolved = null;

  container.innerHTML = `
    <div class="space-y-24">
      <!-- HERO SECTION -->
      <section class="relative pt-4 pb-12 lg:pt-10 lg:pb-16 overflow-hidden">
        <!-- Background Ambient Glow -->
        <div class="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[380px] bg-[#D8FF3E]/12 blur-[140px] rounded-full pointer-events-none -z-10 animate-float-slow"></div>
        <div class="absolute top-40 right-10 w-[450px] h-[350px] bg-[#9C8AFF]/10 blur-[130px] rounded-full pointer-events-none -z-10"></div>
        
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            <!-- Hero Left Copy -->
            <div id="hero-main-title" class="lg:col-span-6 space-y-6">
              <!-- Top Tech Pills -->
              <div class="flex flex-wrap items-center gap-2">
                <div class="inline-flex items-center space-x-2 bg-[#1B1E19] border border-[#34382F] px-3 py-1.5 rounded-full text-xs font-mono">
                  <span class="w-2 h-2 rounded-full bg-[#D8FF3E] animate-pulse"></span>
                  <span class="text-[#D8FF3E] font-bold">BUDGET-FIRST FITNESS AI</span>
                  <span class="text-[#858A80]">| Gen Z Era</span>
                </div>

                <!-- Replay Cinematic Opening Animation Button -->
                <button id="hero-replay-intro-btn" class="badge-sticker cursor-pointer text-[10px] py-1 px-2.5 hover:scale-105 transition-transform" title="Replay Dumbbell Slam Intro">
                  <svg class="w-3 h-3 text-[#D8FF3E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 5v14M18 5v14M6 12h12"/></svg>
                  <span>REPLAY OPENING INTRO</span>
                </button>
              </div>

              <!-- Main Bold Editorial Headline -->
              <h1 class="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#F4F5EF] leading-[1.03]">
                YOUR BODY.<br/>
                <span class="text-[#D8FF3E] underline decoration-[#D8FF3E]/30 underline-offset-8">YOUR BUDGET.</span><br/>
                YOUR ERA.
              </h1>

              <p class="text-sm sm:text-base text-[#858A80] max-w-xl leading-relaxed">
                Your AI fitness companion for affordable protein, personalized workouts, and smarter progress. Built for your real living conditions and student pocket money.
              </p>

              <!-- Main CTAs -->
              <div class="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 pt-1">
                <a href="#/onboarding" class="btn-acid px-7 py-3.5 text-center text-xs sm:text-sm font-bold flex items-center justify-center space-x-2 shadow-lg">
                  <i data-lucide="zap" class="w-4 h-4 fill-current"></i>
                  <span>Build My Full 5-Step Plan</span>
                </a>
                <a href="#/optimizer" class="btn-ghost px-5 py-3.5 text-center text-xs sm:text-sm font-semibold flex items-center justify-center space-x-2">
                  <i data-lucide="calculator" class="w-4 h-4 text-[#D8FF3E]"></i>
                  <span>Full Protein Optimizer</span>
                </a>
              </div>

              <!-- Quick Value Stats Strip -->
              <div class="pt-3 grid grid-cols-3 gap-3 border-t border-[#34382F]/60 text-xs">
                <div>
                  <div class="font-mono font-bold text-base sm:text-lg text-[#F4F5EF]">₹12<span class="text-xs text-[#858A80]">/day</span></div>
                  <div class="text-[11px] text-[#858A80]">26g Protein (Soya)</div>
                </div>
                <div>
                  <div class="font-mono font-bold text-base sm:text-lg text-[#D8FF3E]">0 Scam Whey</div>
                  <div class="text-[11px] text-[#858A80]">Real Indian Staples</div>
                </div>
                <div>
                  <div class="font-mono font-bold text-base sm:text-lg text-[#9C8AFF]">Hostel Mode</div>
                  <div class="text-[11px] text-[#858A80]">Kettle & Mess Ready</div>
                </div>
              </div>

              <!-- Streetwear Floating Badges -->
              <div class="flex flex-wrap items-center gap-2 pt-1">
                <div class="badge-sticker">
                  <i data-lucide="flame" class="w-3 h-3 text-[#D8FF3E]"></i>
                  <span>100% DESI GAINS</span>
                </div>
                <div class="badge-sticker badge-sticker-violet">
                  <i data-lucide="zap" class="w-3 h-3 text-[#9C8AFF]"></i>
                  <span>ZERO BS PROTOCOL</span>
                </div>
                <div class="badge-sticker">
                  <i data-lucide="shield-check" class="w-3 h-3 text-[#D8FF3E]"></i>
                  <span>BUDGET INVIOLABLE</span>
                </div>
              </div>
            </div>

            <!-- Hero Right Column: LIVE INSTANT BUDGET DIET RECOMMENDER (STAR OF HOMEPAGE) -->
            <div id="hero-budget-planner" class="lg:col-span-6 relative">
              <div class="card-proto p-6 sm:p-7 border-[#D8FF3E]/60 bg-gradient-to-b from-[#1B1E19]/95 via-[#161A14]/95 to-[#111410]/95 backdrop-blur-xl shadow-2xl relative overflow-hidden border-glow-pulse">
                
                <!-- Panel Header -->
                <div class="flex items-center justify-between border-b border-[#34382F] pb-4">
                  <div class="space-y-0.5">
                    <div class="flex items-center space-x-2">
                      <span class="w-2 h-2 rounded-full bg-[#D8FF3E] animate-ping"></span>
                      <span class="text-[10px] font-mono uppercase tracking-widest text-[#D8FF3E] font-bold">ALGORITHMIC DIET ENGINE</span>
                    </div>
                    <h3 class="text-xl sm:text-2xl font-extrabold text-[#F4F5EF] font-heading">
                      Budget Diet Recommendation
                    </h3>
                  </div>
                  <span class="badge-sticker text-[10px] px-2.5 py-1">
                    ⚡ LIVE SOLVER
                  </span>
                </div>

                <!-- Interactive Budget Slider -->
                <div class="space-y-3 pt-4">
                  <div class="flex items-baseline justify-between">
                    <span class="text-xs font-mono uppercase text-[#858A80] font-bold">My Daily Food Budget:</span>
                    <span class="text-2xl sm:text-3xl font-mono font-black text-[#D8FF3E]">₹<span id="hero-budget-val">80</span> <span class="text-xs text-[#858A80]">/ day</span></span>
                  </div>

                  <!-- Glowing Cyber Slider -->
                  <input type="range" id="hero-budget-slider" min="30" max="200" step="5" value="80" class="slider-cyber w-full cursor-pointer" />

                  <!-- Quick preset chips -->
                  <div class="flex flex-wrap items-center justify-between gap-1.5 pt-1">
                    <button type="button" class="hero-budget-chip px-2.5 py-1 rounded-lg border border-[#34382F] bg-[#111410] text-[11px] font-mono text-[#858A80] hover:text-[#D8FF3E] hover:border-[#D8FF3E] transition-all cursor-pointer" data-val="50">
                      ₹50 (Hostel)
                    </button>
                    <button type="button" class="hero-budget-chip px-2.5 py-1 rounded-lg border border-[#D8FF3E] bg-[#D8FF3E]/10 text-[11px] font-mono font-bold text-[#D8FF3E] transition-all cursor-pointer" data-val="80">
                      ₹80 (Optimal)
                    </button>
                    <button type="button" class="hero-budget-chip px-2.5 py-1 rounded-lg border border-[#34382F] bg-[#111410] text-[11px] font-mono text-[#858A80] hover:text-[#D8FF3E] hover:border-[#D8FF3E] transition-all cursor-pointer" data-val="100">
                      ₹100 (Balanced)
                    </button>
                    <button type="button" class="hero-budget-chip px-2.5 py-1 rounded-lg border border-[#34382F] bg-[#111410] text-[11px] font-mono text-[#858A80] hover:text-[#D8FF3E] hover:border-[#D8FF3E] transition-all cursor-pointer" data-val="150">
                      ₹150 (Surplus)
                    </button>
                  </div>
                </div>

                <!-- Dietary Preference Filter -->
                <div class="space-y-1.5 pt-4">
                  <span class="text-[10px] font-mono uppercase text-[#858A80] font-bold block">Dietary Preference:</span>
                  <div class="grid grid-cols-4 gap-1.5 text-[11px] font-mono">
                    ${[
                      { id: 'all', label: 'ALL' },
                      { id: 'vegetarian', label: 'VEG' },
                      { id: 'eggetarian', label: 'EGG' },
                      { id: 'non_vegetarian', label: 'NON-VEG' }
                    ].map(d => `
                      <button type="button" class="hero-diet-chip py-1.5 rounded-lg border transition-all text-center cursor-pointer ${heroDiet === d.id ? 'border-[#D8FF3E] bg-[#D8FF3E]/10 text-[#D8FF3E] font-bold shadow-[0_0_12px_rgba(216,255,62,0.15)]' : 'border-[#34382F] bg-[#111410] text-[#858A80] hover:text-[#F4F5EF]'}" data-diet="${d.id}">
                        ${d.label}
                      </button>
                    `).join('')}
                  </div>
                </div>

                <!-- High-Energy Gaming Solve CTA Button -->
                <button id="hero-solve-btn" class="btn-acid-gaming w-full py-3 sm:py-3.5 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center space-x-2 mt-4 cursor-pointer">
                  <i data-lucide="zap" class="w-4 h-4 fill-current"></i>
                  <span id="hero-btn-label">GENERATE BUDGET DIET RECOMMENDATION</span>
                </button>

                <!-- Live Results Display Container -->
                <div id="hero-results-box" class="mt-4 pt-4 border-t border-[#34382F] space-y-3">
                  <!-- Loading placeholder / Initial trigger -->
                  <div id="hero-results-loading" class="hidden flex items-center justify-center py-8 text-[#858A80] space-x-2 font-mono text-xs">
                    <i data-lucide="loader" class="w-5 h-5 animate-spin text-[#D8FF3E]"></i>
                    <span class="text-[#D8FF3E]">SOLVING PROTEIN-PER-RUPEE KNAPSACK...</span>
                  </div>

                  <!-- Actual Returned Diet Combination -->
                  <div id="hero-results-content" class="space-y-3"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- INFINITE GEN Z NEON MARQUEE SLOGAN TICKER -->
      <section class="border-y border-[#34382F] bg-[#1B1E19]/90 py-3.5 relative overflow-hidden backdrop-blur-md">
        <div class="marquee-container">
          <div class="marquee-track flex items-center space-x-8 text-xs font-mono font-bold tracking-wider">
            <span class="flex items-center space-x-2 text-[#D8FF3E]">
              <i data-lucide="zap" class="w-4 h-4 fill-current"></i>
              <span>YOUR BODY. YOUR BUDGET. YOUR ERA.</span>
            </span>
            <span class="text-[#34382F]">✦</span>
            <span class="text-[#F4F5EF]">₹12 SOYA = 26G PURE PROTEIN</span>
            <span class="text-[#34382F]">✦</span>
            <span class="text-[#9C8AFF]">🔥 14-DAY HYPERTROPHY STREAK</span>
            <span class="text-[#34382F]">✦</span>
            <span class="text-[#D8FF3E]">0 OVERPRICED WHEY ISOLATE</span>
            <span class="text-[#34382F]">✦</span>
            <span class="text-[#F4F5EF]">HOSTEL MESS INFILTRATION PROTOCOL</span>
            <span class="text-[#34382F]">✦</span>
            <span class="text-[#9C8AFF]">⚡ DETERMINISTIC GREEDY SOLVER</span>
            <span class="text-[#34382F]">✦</span>
            <span class="text-[#D8FF3E]">NO SCAM SUPPLEMENTS • REAL INDIAN STAPLES</span>
            <span class="text-[#34382F]">✦</span>
            <!-- Duplicate for continuous infinite scroll -->
            <span class="flex items-center space-x-2 text-[#D8FF3E]">
              <i data-lucide="zap" class="w-4 h-4 fill-current"></i>
              <span>YOUR BODY. YOUR BUDGET. YOUR ERA.</span>
            </span>
            <span class="text-[#34382F]">✦</span>
            <span class="text-[#F4F5EF]">₹12 SOYA = 26G PURE PROTEIN</span>
            <span class="text-[#34382F]">✦</span>
            <span class="text-[#9C8AFF]">🔥 14-DAY HYPERTROPHY STREAK</span>
            <span class="text-[#34382F]">✦</span>
            <span class="text-[#D8FF3E]">0 OVERPRICED WHEY ISOLATE</span>
            <span class="text-[#34382F]">✦</span>
            <span class="text-[#F4F5EF]">HOSTEL MESS INFILTRATION PROTOCOL</span>
            <span class="text-[#34382F]">✦</span>
            <span class="text-[#9C8AFF]">⚡ DETERMINISTIC GREEDY SOLVER</span>
            <span class="text-[#34382F]">✦</span>
            <span class="text-[#D8FF3E]">NO SCAM SUPPLEMENTS • REAL INDIAN STAPLES</span>
            <span class="text-[#34382F]">✦</span>
          </div>
        </div>
      </section>

      <!-- SECTION 1: THE REAL PROBLEM -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <h2 class="text-xs uppercase font-mono tracking-widest text-[#D8FF3E] font-bold">The Indian Fitness Reality</h2>
          <h3 class="text-2xl sm:text-4xl font-extrabold text-[#F4F5EF]">Standard Fitness Advice Was Not Built for Students</h3>
          <p class="text-sm text-[#858A80]">
            Western fitness influencers tell you to eat salmon, drink ₹3,500 whey isolate, and meal prep in a luxury modular kitchen. Here is the student truth:
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="card-proto p-6 space-y-3">
            <div class="w-10 h-10 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center font-bold text-lg">₹</div>
            <h4 class="font-bold text-base text-[#F4F5EF]">The "Protein is Expensive" Myth</h4>
            <p class="text-xs text-[#858A80] leading-relaxed">
              Students believe they can't build muscle without expensive supplements. In reality, Indian staples like Soya Chunks give 26g of pure protein for ₹12 — 5x cheaper than whey isolate.
            </p>
          </div>

          <div class="card-proto p-6 space-y-3">
            <div class="w-10 h-10 rounded-lg bg-[#D8FF3E]/10 text-[#D8FF3E] flex items-center justify-center font-bold text-lg">
              <i data-lucide="building-2" class="w-5 h-5"></i>
            </div>
            <h4 class="font-bold text-base text-[#F4F5EF]">The Hostel Mess Constraint</h4>
            <p class="text-xs text-[#858A80] leading-relaxed">
              Mess food is 80% oily carbs and watery dal. PROTOMANIA teaches practical "infiltrations" — boiling kettle staples and tapri eggs that turn low-protein mess meals into anabolic fuel.
            </p>
          </div>

          <div class="card-proto p-6 space-y-3">
            <div class="w-10 h-10 rounded-lg bg-[#9C8AFF]/10 text-[#9C8AFF] flex items-center justify-center font-bold text-lg">
              <i data-lucide="hourglass" class="w-5 h-5"></i>
            </div>
            <h4 class="font-bold text-base text-[#F4F5EF]">Exam Week Time Crunch</h4>
            <p class="text-xs text-[#858A80] leading-relaxed">
              2-hour gym sessions fail during lab submissions and sem exams. Our dynamic Time Crunch engine converts heavy workouts into sharp 25-minute supersets that maintain muscle.
            </p>
          </div>
        </div>
      </section>

      <!-- SECTION 2: HOW PROTOMANIA WORKS -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="card-proto p-8 sm:p-12 border-[#D8FF3E]/30 bg-gradient-to-b from-[#1B1E19] to-[#111410]">
          <div class="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <h2 class="text-xs uppercase font-mono tracking-widest text-[#D8FF3E] font-bold">The 3-Step System</h2>
            <h3 class="text-2xl sm:text-3xl font-extrabold text-[#F4F5EF]">How PROTOMANIA Optimizes Your Physique</h3>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div class="space-y-3 text-center md:text-left">
              <div class="w-10 h-10 rounded-full bg-[#D8FF3E] text-[#111410] font-mono font-black flex items-center justify-center text-base mx-auto md:mx-0">
                1
              </div>
              <h4 class="font-bold text-lg text-[#F4F5EF]">Input Your Real Budget</h4>
              <p class="text-xs text-[#858A80] leading-relaxed">
                Whether you have ₹50, ₹80, or ₹150 per day, our deterministic engine treats your budget as an inviolable constraint. It never tells you to buy foods you can't afford.
              </p>
            </div>

            <div class="space-y-3 text-center md:text-left">
              <div class="w-10 h-10 rounded-full bg-[#D8FF3E] text-[#111410] font-mono font-black flex items-center justify-center text-base mx-auto md:mx-0">
                2
              </div>
              <h4 class="font-bold text-lg text-[#F4F5EF]">Algorithmic Knapsack Engine</h4>
              <p class="text-xs text-[#858A80] leading-relaxed">
                Our mathematical optimization solver evaluates complete amino acid profiles across 24+ Indian foods to assemble maximum protein combinations per rupee.
              </p>
            </div>

            <div class="space-y-3 text-center md:text-left">
              <div class="w-10 h-10 rounded-full bg-[#D8FF3E] text-[#111410] font-mono font-black flex items-center justify-center text-base mx-auto md:mx-0">
                3
              </div>
              <h4 class="font-bold text-lg text-[#F4F5EF]">Execute & Level Up</h4>
              <p class="text-xs text-[#858A80] leading-relaxed">
                Track progressive overload in the gym, log meals in 1-click, earn XP, maintain iron consistency streaks, and get Spotify-style monthly Fitness Wrapped recaps.
              </p>
            </div>
          </div>

          <div class="mt-12 text-center">
            <a href="#/onboarding" class="btn-acid inline-flex items-center space-x-2 px-8 py-3 text-sm font-bold">
              <span>Start My 5-Step Onboarding</span>
              <i data-lucide="arrow-right" class="w-4 h-4"></i>
            </a>
          </div>
        </div>
      </section>

      <!-- SECTION 3: SIGNATURE FEATURE SHOWCASE — BUDGET PROTEIN OPTIMIZER -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row md:items-end justify-between mb-8 space-y-4 md:space-y-0">
          <div>
            <span class="text-xs uppercase font-mono tracking-widest text-[#D8FF3E] font-bold">Signature Technology</span>
            <h3 class="text-2xl sm:text-3xl font-extrabold text-[#F4F5EF] mt-1">Budget Protein Optimizer</h3>
            <p class="text-xs text-[#858A80] mt-1">Real authentic Indian foods ranked by true Protein-Per-Rupee yield.</p>
          </div>
          <a href="#/optimizer" class="btn-ghost text-xs px-4 py-2 flex items-center space-x-1.5 self-start md:self-auto">
            <span>Open Interactive Solver</span>
            <i data-lucide="chevron-right" class="w-4 h-4"></i>
          </a>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <!-- Food 1: Soya Chunks -->
          <div class="card-proto overflow-hidden group">
            <div class="relative h-40">
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Textured_vegetable_protein.jpg" alt="Soya Chunks Nutrela" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <div class="img-badge px-2 py-0.5 rounded text-[10px] font-mono font-bold text-[#D8FF3E]">
                #1 PROTEIN / ₹
              </div>
            </div>
            <div class="p-4 space-y-3">
              <div>
                <h4 class="font-bold text-sm text-[#F4F5EF]">Soya Chunks (Nutrela)</h4>
                <span class="text-[11px] text-[#858A80]">50g dry serving • Vegan</span>
              </div>
              <div class="grid grid-cols-2 gap-2 text-xs bg-[#111410] p-2 rounded-lg border border-[#34382F]">
                <div>
                  <div class="text-[10px] text-[#858A80]">Protein</div>
                  <div class="font-mono font-bold text-[#D8FF3E]">26.0g</div>
                </div>
                <div>
                  <div class="text-[10px] text-[#858A80]">Cost</div>
                  <div class="font-mono font-bold text-[#F4F5EF]">₹12.0</div>
                </div>
              </div>
              <div class="text-[11px] text-[#858A80]">
                Cost per 10g Protein: <strong class="text-[#D8FF3E] font-mono">₹4.62</strong>
              </div>
            </div>
          </div>

          <!-- Food 2: Whole Eggs -->
          <div class="card-proto overflow-hidden group">
            <div class="relative h-40">
              <img src="https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=600&q=80" alt="Boiled Eggs" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <div class="img-badge px-2 py-0.5 rounded text-[10px] font-mono font-bold text-[#D8FF3E]">
                COMPLETE AMINOS
              </div>
            </div>
            <div class="p-4 space-y-3">
              <div>
                <h4 class="font-bold text-sm text-[#F4F5EF]">Boiled Whole Eggs</h4>
                <span class="text-[11px] text-[#858A80]">2 large eggs • Eggetarian</span>
              </div>
              <div class="grid grid-cols-2 gap-2 text-xs bg-[#111410] p-2 rounded-lg border border-[#34382F]">
                <div>
                  <div class="text-[10px] text-[#858A80]">Protein</div>
                  <div class="font-mono font-bold text-[#D8FF3E]">12.6g</div>
                </div>
                <div>
                  <div class="text-[10px] text-[#858A80]">Cost</div>
                  <div class="font-mono font-bold text-[#F4F5EF]">₹14.0</div>
                </div>
              </div>
              <div class="text-[11px] text-[#858A80]">
                Cost per 10g Protein: <strong class="text-[#D8FF3E] font-mono">₹11.11</strong>
              </div>
            </div>
          </div>

          <!-- Food 3: Roasted Chana -->
          <div class="card-proto overflow-hidden group">
            <div class="relative h-40">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Torraos-Las_Mayas-2011.JPG/960px-Torraos-Las_Mayas-2011.JPG" alt="Roasted Bhuna Chana" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <div class="img-badge px-2 py-0.5 rounded text-[10px] font-mono font-bold text-[#9C8AFF]">
                ZERO-COOK
              </div>
            </div>
            <div class="p-4 space-y-3">
              <div>
                <h4 class="font-bold text-sm text-[#F4F5EF]">Roasted Bhuna Chana</h4>
                <span class="text-[11px] text-[#858A80]">60g desk snack • Vegan</span>
              </div>
              <div class="grid grid-cols-2 gap-2 text-xs bg-[#111410] p-2 rounded-lg border border-[#34382F]">
                <div>
                  <div class="text-[10px] text-[#858A80]">Protein</div>
                  <div class="font-mono font-bold text-[#D8FF3E]">11.5g</div>
                </div>
                <div>
                  <div class="text-[10px] text-[#858A80]">Cost</div>
                  <div class="font-mono font-bold text-[#F4F5EF]">₹12.0</div>
                </div>
              </div>
              <div class="text-[11px] text-[#858A80]">
                Cost per 10g Protein: <strong class="text-[#D8FF3E] font-mono">₹10.43</strong>
              </div>
            </div>
          </div>

          <!-- Food 4: Chana Sattu -->
          <div class="card-proto overflow-hidden group">
            <div class="relative h-40">
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/54/Sattu_Ghol.jpg" alt="Chana Sattu Shake" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <div class="img-badge px-2 py-0.5 rounded text-[10px] font-mono font-bold text-[#D8FF3E]">
                DESI SHAKE
              </div>
            </div>
            <div class="p-4 space-y-3">
              <div>
                <h4 class="font-bold text-sm text-[#F4F5EF]">Chana Sattu Drink</h4>
                <span class="text-[11px] text-[#858A80]">50g powder in water • Vegan</span>
              </div>
              <div class="grid grid-cols-2 gap-2 text-xs bg-[#111410] p-2 rounded-lg border border-[#34382F]">
                <div>
                  <div class="text-[10px] text-[#858A80]">Protein</div>
                  <div class="font-mono font-bold text-[#D8FF3E]">11.0g</div>
                </div>
                <div>
                  <div class="text-[10px] text-[#858A80]">Cost</div>
                  <div class="font-mono font-bold text-[#F4F5EF]">₹11.0</div>
                </div>
              </div>
              <div class="text-[11px] text-[#858A80]">
                Cost per 10g Protein: <strong class="text-[#D8FF3E] font-mono">₹10.00</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- SECTION 4: STUDENT SPECIALIZED MODES -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <h2 class="text-xs uppercase font-mono tracking-widest text-[#D8FF3E] font-bold">Hostel Life Realities</h2>
          <h3 class="text-2xl sm:text-3xl font-extrabold text-[#F4F5EF]">Specialized Student Modes</h3>
          <p class="text-xs text-[#858A80]">Adapts directly to your living conditions without requiring a fancy kitchen.</p>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div class="card-proto p-4 text-center space-y-2">
            <div class="w-8 h-8 rounded-full bg-[#D8FF3E]/10 text-[#D8FF3E] flex items-center justify-center mx-auto">
              <i data-lucide="hotel" class="w-4 h-4"></i>
            </div>
            <h4 class="font-bold text-xs text-[#F4F5EF]">Hostel Mode</h4>
            <p class="text-[10px] text-[#858A80]">Kettle cooking, zero refrigeration staples, room-friendly shelf life.</p>
          </div>

          <div class="card-proto p-4 text-center space-y-2">
            <div class="w-8 h-8 rounded-full bg-[#D8FF3E]/10 text-[#D8FF3E] flex items-center justify-center mx-auto">
              <i data-lucide="utensils" class="w-4 h-4"></i>
            </div>
            <h4 class="font-bold text-xs text-[#F4F5EF]">Mess Mode</h4>
            <p class="text-[10px] text-[#858A80]">Infiltrate high-carb mess meals with strategic protein boosters.</p>
          </div>

          <div class="card-proto p-4 text-center space-y-2">
            <div class="w-8 h-8 rounded-full bg-[#9C8AFF]/10 text-[#9C8AFF] flex items-center justify-center mx-auto">
              <i data-lucide="zap-off" class="w-4 h-4"></i>
            </div>
            <h4 class="font-bold text-xs text-[#F4F5EF]">No-Cook Mode</h4>
            <p class="text-[10px] text-[#858A80]">Sattu shakes, roasted peanuts, curd bowls, and tapri eggs.</p>
          </div>

          <div class="card-proto p-4 text-center space-y-2">
            <div class="w-8 h-8 rounded-full bg-red-400/10 text-red-400 flex items-center justify-center mx-auto">
              <i data-lucide="book-open" class="w-4 h-4"></i>
            </div>
            <h4 class="font-bold text-xs text-[#F4F5EF]">Exam-Week Mode</h4>
            <p class="text-[10px] text-[#858A80]">Sub-3-minute prep, high satiety, zero food coma during revisions.</p>
          </div>

          <div class="card-proto p-4 text-center space-y-2">
            <div class="w-8 h-8 rounded-full bg-[#D8FF3E]/10 text-[#D8FF3E] flex items-center justify-center mx-auto">
              <i data-lucide="leaf" class="w-4 h-4"></i>
            </div>
            <h4 class="font-bold text-xs text-[#F4F5EF]">Pure Veg Mode</h4>
            <p class="text-[10px] text-[#858A80]">Paneer, soya, dal, and dairy combos with complete amino scores.</p>
          </div>
        </div>
      </section>

      <!-- SECTION 5: FINAL CTA -->
      <section class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div class="card-proto p-10 sm:p-14 bg-gradient-to-r from-[#1B1E19] via-[#242921] to-[#1B1E19] border-[#D8FF3E] space-y-6">
          <div class="w-12 h-12 mx-auto">
            ${renderProtoMark(48)}
          </div>
          <h2 class="text-3xl sm:text-5xl font-black text-[#F4F5EF] tracking-tight">
            YOUR FITNESS ERA STARTS NOW.
          </h2>
          <p class="text-sm sm:text-base text-[#858A80] max-w-lg mx-auto">
            No expensive gym subscriptions required. No imported whey. Just smart science, Indian staples, and your own dedication.
          </p>
          <div class="pt-2">
            <a href="#/onboarding" class="btn-acid inline-flex items-center space-x-2 px-8 py-3.5 text-sm font-bold shadow-xl">
              <i data-lucide="sparkles" class="w-4 h-4"></i>
              <span>Generate My Personalized Plan</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  `;

  // Attach Hero Replay Intro Listener
  document.getElementById("hero-replay-intro-btn")?.addEventListener("click", () => {
    if (window.replayIntro) window.replayIntro();
  });

  // Slider & Budget Display
  const slider = document.getElementById("hero-budget-slider");
  const budgetValDisplay = document.getElementById("hero-budget-val");
  const btnLabel = document.getElementById("hero-btn-label");
  let heroDebounceTimer = null;

  if (slider && budgetValDisplay) {
    slider.addEventListener("input", (e) => {
      heroBudget = parseFloat(e.target.value);
      budgetValDisplay.textContent = heroBudget;
      if (btnLabel) btnLabel.textContent = `GENERATE BUDGET DIET PLAN (₹${heroBudget}/DAY)`;

      // Real-time chip sync
      document.querySelectorAll(".hero-budget-chip").forEach(c => {
        const val = parseFloat(c.getAttribute("data-val"));
        if (val === heroBudget) {
          c.className = "hero-budget-chip px-2.5 py-1 rounded-lg border border-[#D8FF3E] bg-[#D8FF3E]/10 text-[11px] font-mono font-bold text-[#D8FF3E] transition-all cursor-pointer";
        } else {
          c.className = "hero-budget-chip px-2.5 py-1 rounded-lg border border-[#34382F] bg-[#111410] text-[11px] font-mono text-[#858A80] hover:text-[#D8FF3E] hover:border-[#D8FF3E] transition-all cursor-pointer";
        }
      });

      // Real-time debounced recalculation (80ms for instant feedback)
      clearTimeout(heroDebounceTimer);
      heroDebounceTimer = setTimeout(() => {
        computeHeroDiet();
      }, 80);
    });

    slider.addEventListener("change", () => {
      clearTimeout(heroDebounceTimer);
      computeHeroDiet();
    });
  }

  // Quick Preset Budget Chips
  document.querySelectorAll(".hero-budget-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      heroBudget = parseFloat(chip.getAttribute("data-val"));
      if (slider) slider.value = heroBudget;
      if (budgetValDisplay) budgetValDisplay.textContent = heroBudget;
      if (btnLabel) btnLabel.textContent = `GENERATE BUDGET DIET PLAN (₹${heroBudget}/DAY)`;

      document.querySelectorAll(".hero-budget-chip").forEach(c => {
        c.className = "hero-budget-chip px-2.5 py-1 rounded-lg border border-[#34382F] bg-[#111410] text-[11px] font-mono text-[#858A80] hover:text-[#D8FF3E] hover:border-[#D8FF3E] transition-all cursor-pointer";
      });
      chip.className = "hero-budget-chip px-2.5 py-1 rounded-lg border border-[#D8FF3E] bg-[#D8FF3E]/10 text-[11px] font-mono font-bold text-[#D8FF3E] transition-all cursor-pointer";

      clearTimeout(heroDebounceTimer);
      computeHeroDiet();
    });
  });

  // Dietary Preference Chips
  document.querySelectorAll(".hero-diet-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      heroDiet = chip.getAttribute("data-diet");
      document.querySelectorAll(".hero-diet-chip").forEach(c => {
        c.className = "hero-diet-chip py-1.5 rounded-lg border border-[#34382F] bg-[#111410] text-[#858A80] hover:text-[#F4F5EF] transition-all text-center cursor-pointer";
      });
      chip.className = "hero-diet-chip py-1.5 rounded-lg border border-[#D8FF3E] bg-[#D8FF3E]/10 text-[#D8FF3E] font-bold shadow-[0_0_12px_rgba(216,255,62,0.15)] transition-all text-center cursor-pointer";

      clearTimeout(heroDebounceTimer);
      computeHeroDiet();
    });
  });

  // Solve Button
  document.getElementById("hero-solve-btn")?.addEventListener("click", () => {
    clearTimeout(heroDebounceTimer);
    computeHeroDiet();
  });

  // Live Hero Diet Recommender Execution
  async function computeHeroDiet() {
    const loadingEl = document.getElementById("hero-results-loading");
    const contentEl = document.getElementById("hero-results-content");
    const btnLabelEl = document.getElementById("hero-btn-label");
    const solveBtnEl = document.getElementById("hero-solve-btn");

    if (!lastSolved && loadingEl) loadingEl.classList.remove("hidden");
    if (!lastSolved && contentEl) contentEl.innerHTML = "";
    if (btnLabelEl) btnLabelEl.textContent = `COMPUTING OPTIMAL DIET (₹${heroBudget})...`;

    try {
      const solved = await api.solveBudget({
        budget_inr: heroBudget,
        dietary_preference: heroDiet === "all" ? "vegetarian" : heroDiet,
        hostel_only: false,
        no_cook_only: false
      });
      const prevSolved = lastSolved;
      lastSolved = solved;
      renderHeroSolved(solved, prevSolved);
    } catch (err) {
      if (contentEl) {
        contentEl.innerHTML = `<div class="p-3 text-center text-xs text-red-400">Error computing diet: ${err.message}</div>`;
      }
    } finally {
      if (loadingEl) loadingEl.classList.add("hidden");
      if (btnLabelEl) btnLabelEl.textContent = `GENERATE BUDGET DIET PLAN (₹${heroBudget}/DAY)`;
      if (solveBtnEl) solveBtnEl.disabled = false;
      if (window.lucide) window.lucide.createIcons();
    }
  }

  function renderHeroSolved(solved, prevSolved = null) {
    const contentEl = document.getElementById("hero-results-content");
    if (!contentEl) return;

    contentEl.innerHTML = `
      <!-- Animated Macro & Cost Tally -->
      <div class="grid grid-cols-3 gap-2 bg-[#111410] p-2.5 rounded-xl border border-[#34382F] text-center font-mono">
        <div>
          <div class="text-[9px] uppercase text-[#858A80]">Total Protein</div>
          <div id="hero-stat-protein" class="text-sm sm:text-base font-extrabold text-[#D8FF3E]">+${solved.total_protein_g}g</div>
        </div>
        <div>
          <div class="text-[9px] uppercase text-[#858A80]">Total Cost</div>
          <div id="hero-stat-cost" class="text-sm sm:text-base font-extrabold text-[#F4F5EF]">₹${solved.total_cost_inr}</div>
        </div>
        <div>
          <div class="text-[9px] uppercase text-[#858A80]">Remaining</div>
          <div id="hero-stat-remaining" class="text-sm sm:text-base font-extrabold text-[#9C8AFF]">₹${solved.remaining_budget_inr}</div>
        </div>
      </div>

      <!-- Solved Food Items Cards (Staggered Reveal) -->
      <div class="space-y-2 pt-1 max-h-56 overflow-y-auto pr-1">
        ${solved.items.map((item, idx) => `
          <div class="stagger-${Math.min(idx + 1, 4)} flex items-center justify-between p-2 rounded-lg bg-[#111410] border border-[#34382F] hover:border-[#D8FF3E]/40 transition-colors">
            <div class="flex items-center space-x-2.5 min-w-0">
              <img src="${item.food.image_url}" alt="${item.food.name}" class="w-9 h-9 rounded-md object-cover border border-[#34382F] flex-shrink-0" />
              <div class="min-w-0">
                <h5 class="text-xs font-bold text-[#F4F5EF] truncate">${item.food.name}</h5>
                <span class="text-[10px] text-[#858A80] font-mono">${item.servings > 1 ? `${item.servings}x servings` : item.food.serving_size}</span>
              </div>
            </div>
            <div class="text-right flex-shrink-0 pl-2">
              <span class="text-xs font-mono font-bold text-[#D8FF3E] block">+${item.total_protein_g}g P</span>
              <span class="text-[10px] font-mono text-[#858A80]">₹${item.total_price_inr}</span>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Verdict Tag & Full Optimizer Link -->
      <div class="pt-2 flex items-center justify-between text-xs">
        <span class="text-[11px] text-[#858A80] truncate max-w-[200px]">
          Verdict: <strong class="text-[#D8FF3E] font-mono">${solved.verdict}</strong>
        </span>
        <a href="#/optimizer" class="text-[11px] font-bold text-[#D8FF3E] hover:underline flex items-center space-x-1">
          <span>Open Full Solver</span>
          <i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>
        </a>
      </div>
    `;

    // Trigger smooth count-up numbers from previous state
    const prevP = prevSolved ? prevSolved.total_protein_g : 0;
    const prevC = prevSolved ? prevSolved.total_cost_inr : 0;
    const prevR = prevSolved ? prevSolved.remaining_budget_inr : 0;
    animateValue(document.getElementById("hero-stat-protein"), prevP, solved.total_protein_g, 350, "+", "g");
    animateValue(document.getElementById("hero-stat-cost"), prevC, solved.total_cost_inr, 350, "₹", "");
    animateValue(document.getElementById("hero-stat-remaining"), prevR, solved.remaining_budget_inr, 350, "₹", "");
    if (window.lucide) window.lucide.createIcons();
  }

  // Initial computation for ₹80 default budget
  computeHeroDiet();

  if (window.lucide) window.lucide.createIcons();
}

