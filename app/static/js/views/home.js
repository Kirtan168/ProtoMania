/**
 * PROTOMANIA Homepage View
 * Bold, high-energy landing experience for college students and young adults in India.
 */

import { renderProtoMark } from "../components/logo.js";

export function renderHomeView(container) {
  container.innerHTML = `
    <div class="space-y-24">
      <!-- HERO SECTION -->
      <section class="relative pt-6 pb-12 lg:pt-14 lg:pb-20 overflow-hidden">
        <!-- Background Ambient Glow -->
        <div class="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[#D8FF3E]/10 blur-[130px] rounded-full pointer-events-none -z-10"></div>
        
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <!-- Hero Left Copy -->
            <div class="lg:col-span-7 space-y-6">
              <div class="inline-flex items-center space-x-2 bg-[#1B1E19] border border-[#34382F] px-3 py-1.5 rounded-full text-xs font-mono">
                <span class="w-2 h-2 rounded-full bg-[#D8FF3E] animate-pulse"></span>
                <span class="text-[#D8FF3E] font-bold">BUDGET-FIRST FITNESS AI</span>
                <span class="text-[#858A80]">| Built for College Life</span>
              </div>

              <h1 class="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#F4F5EF] leading-[1.05]">
                YOUR BODY.<br/>
                <span class="text-[#D8FF3E] underline decoration-[#D8FF3E]/30 underline-offset-8">YOUR BUDGET.</span><br/>
                YOUR ERA.
              </h1>

              <p class="text-base sm:text-lg text-[#858A80] max-w-xl leading-relaxed">
                Your AI-powered fitness companion for affordable protein, personalized workouts, and smarter progress. Built for your goals, your lifestyle, and your student budget.
              </p>

              <!-- CTAs -->
              <div class="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-2">
                <a href="#/onboarding" class="btn-acid px-8 py-3.5 text-center text-sm font-bold flex items-center justify-center space-x-2 shadow-lg">
                  <i data-lucide="zap" class="w-4 h-4 fill-current"></i>
                  <span>Build My Fitness Plan</span>
                </a>
                <a href="#/optimizer" class="btn-ghost px-6 py-3.5 text-center text-sm font-semibold flex items-center justify-center space-x-2">
                  <i data-lucide="calculator" class="w-4 h-4"></i>
                  <span>Explore Budget Meals</span>
                </a>
              </div>

              <!-- Value Points -->
              <div class="pt-4 grid grid-cols-3 gap-4 border-t border-[#34382F]/60 text-xs">
                <div>
                  <div class="font-mono font-bold text-lg text-[#F4F5EF]">₹12<span class="text-xs text-[#858A80]">/day</span></div>
                  <div class="text-[#858A80]">26g Protein (Soya)</div>
                </div>
                <div>
                  <div class="font-mono font-bold text-lg text-[#D8FF3E]">0 Fake Whey</div>
                  <div class="text-[#858A80]">Whole Indian Staples</div>
                </div>
                <div>
                  <div class="font-mono font-bold text-lg text-[#9C8AFF]">Hostel Mode</div>
                  <div class="text-[#858A80]">Kettle & Mess Friendly</div>
                </div>
              </div>

              <!-- Gen Z Floating Holographic Badges -->
              <div class="flex flex-wrap items-center gap-2 pt-2">
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
                  <span>₹80/DAY BUDGET LOCKED</span>
                </div>
              </div>
            </div>

            <!-- Hero Right Visuals & Live Preview Card -->
            <div class="lg:col-span-5 relative hero-tilt">
              <!-- Real Authentic Gym Photography Frame -->
              <div class="relative rounded-3xl overflow-hidden border border-[#D8FF3E]/40 shadow-2xl bg-[#1B1E19] glow-lime-sm">
                <img 
                  src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80" 
                  alt="Young student training with progressive overload in gym" 
                  class="w-full h-72 sm:h-80 object-cover opacity-85"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-[#111410] via-[#111410]/50 to-transparent"></div>

                <!-- Floating Live Dashboard Preview Badge -->
                <div class="absolute top-4 left-4 bg-[#111410]/90 backdrop-blur-md border border-[#D8FF3E]/40 px-3 py-1.5 rounded-xl flex items-center space-x-2 shadow-lg">
                  <span class="w-2 h-2 rounded-full bg-[#D8FF3E] animate-ping"></span>
                  <span class="text-[11px] font-mono font-bold text-[#D8FF3E]">₹52 / 60g PROTEIN COMBO</span>
                </div>

                <!-- Live Dashboard Card Overlay -->
                <div class="relative p-5 -mt-20 m-4 rounded-xl bg-[#1B1E19]/95 backdrop-blur-md border border-[#34382F] space-y-4">
                  <div class="flex items-center justify-between border-b border-[#34382F] pb-3">
                    <div>
                      <div class="text-[10px] uppercase font-mono text-[#858A80]">Today's Target</div>
                      <div class="text-sm font-bold text-[#F4F5EF]">130g Protein • ₹80 Budget</div>
                    </div>
                    <span class="text-xs px-2 py-1 rounded bg-[#D8FF3E]/10 text-[#D8FF3E] font-mono font-bold">ON TRACK</span>
                  </div>

                  <!-- Macro Progress Bar -->
                  <div class="space-y-1.5">
                    <div class="flex justify-between text-xs">
                      <span class="text-[#858A80]">Protein Progress</span>
                      <span class="font-bold text-[#D8FF3E]">95g / 130g (73%)</span>
                    </div>
                    <div class="w-full h-2 rounded-full bg-[#111410] overflow-hidden border border-[#34382F]">
                      <div class="h-full bg-[#D8FF3E] rounded-full" style="width: 73%"></div>
                    </div>
                  </div>

                  <!-- Quick Meal recommendation -->
                  <div class="flex items-center space-x-3 bg-[#111410] p-2.5 rounded-lg border border-[#34382F]">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Textured_vegetable_protein.jpg" class="w-10 h-10 rounded-md object-cover" alt="Soya chunks meal" />
                    <div class="flex-1 min-w-0">
                      <div class="text-xs font-bold text-[#F4F5EF] truncate">Soya Chunks & Dal Mess Booster</div>
                      <div class="text-[11px] text-[#858A80] font-mono">+26g Protein • Just ₹12</div>
                    </div>
                    <a href="#/optimizer" class="text-xs font-bold text-[#D8FF3E] hover:underline">View</a>
                  </div>

                  <div class="flex items-center justify-between text-[11px] text-[#858A80] pt-1">
                    <span class="flex items-center space-x-1">
                      <i data-lucide="flame" class="w-3.5 h-3.5 text-[#D8FF3E]"></i>
                      <span>4-Day Iron Streak</span>
                    </span>
                    <span class="font-mono text-[#D8FF3E]">+150 XP today</span>
                  </div>
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

  if (window.lucide) window.lucide.createIcons();
}
