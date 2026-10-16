/**
 * PROTOMANIA Signature Feature: Budget Protein Optimizer
 * The heart of student fitness economics. Interactive budget slider, ₹50 Challenge,
 * Smart Substitutions, and local price overrides.
 */

import { api } from "../api.js";
import { state } from "../state.js";
import { showToast } from "../components/toast.js";
import { animateValue } from "../utils.js";

export async function renderOptimizerView(container) {
  let activeBudget = 80;
  let activeDiet = "all";
  let activeSort = "protein_per_rupee";
  let hostelOnly = false;
  let noCookOnly = false;
  let searchQuery = "";
  let currentSolvedCombo = null;

  async function loadDataAndRender() {
    container.innerHTML = `
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 animate-fade-in">
        <div class="flex items-center justify-center py-20 text-[#858A80]">
          <i data-lucide="loader" class="w-6 h-6 animate-spin text-[#D8FF3E]"></i>
          <span class="ml-2 font-mono text-xs">Computing optimal protein yield per rupee...</span>
        </div>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();

    try {
      // Parallel fetch: foods list + solved combination for active budget
      const [foodsData, solvedData] = await Promise.all([
        api.getFoods({
          dietary_preference: activeDiet,
          sort_by: activeSort,
          hostel_only: hostelOnly,
          no_cook_only: noCookOnly,
          search: searchQuery
        }),
        api.solveBudget({
          budget_inr: activeBudget,
          dietary_preference: activeDiet === "all" ? "vegetarian" : activeDiet,
          hostel_only: hostelOnly,
          no_cook_only: noCookOnly
        })
      ]);

      currentSolvedCombo = solvedData;
      renderUI(foodsData.foods, solvedData);
    } catch (err) {
      container.innerHTML = `<div class="p-8 text-center text-red-400">Failed to load optimizer: ${err.message}</div>`;
    }
  }

  function renderUI(foods, solved) {
    container.innerHTML = `
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        <!-- Header -->
        <div class="space-y-2">
          <div class="inline-flex items-center space-x-2 text-xs font-mono text-[#D8FF3E]">
            <span class="w-2 h-2 rounded-full bg-[#D8FF3E] animate-pulse"></span>
            <span>SIGNATURE OPTIMIZATION ENGINE</span>
          </div>
          <h1 class="text-3xl sm:text-4xl font-extrabold text-[#F4F5EF]">
            Budget Protein Optimizer
          </h1>
          <p class="text-xs sm:text-sm text-[#858A80] max-w-2xl leading-relaxed">
            Maximize your daily protein intake within your actual available student budget. 
            Adjust the budget slider to dynamically compute mathematically optimal Indian staple combinations.
          </p>
        </div>

        <!-- SOLVER CONTROL PANEL: Interactive Slider & Quick Presets -->
        <div class="card-proto p-6 sm:p-8 border-[#D8FF3E]/40 bg-gradient-to-b from-[#1B1E19] to-[#141712] space-y-6">
          <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#34382F]">
            <!-- Slider -->
            <div class="flex-1 space-y-3">
              <div class="flex justify-between items-baseline">
                <span class="text-xs font-mono uppercase tracking-wider text-[#858A80] font-bold">Daily Available Budget (₹)</span>
                <span class="text-3xl font-mono font-black text-[#D8FF3E]">₹<span id="slider-budget-val">${activeBudget}</span> <span class="text-xs text-[#858A80]">/ day</span></span>
              </div>
              <input type="range" id="budget-live-slider" min="30" max="250" step="5" value="${activeBudget}" class="slider-cyber w-full cursor-pointer" />
              <div class="flex justify-between text-[10px] text-[#858A80] font-mono">
                <span>₹30 Micro-Budget</span>
                <span>₹50 Challenge</span>
                <span>₹80 Optimal</span>
                <span>₹150 High-Yield</span>
                <span>₹250 Max Surplus</span>
              </div>
            </div>

            <!-- Quick Action Pills -->
            <div class="lg:w-96 space-y-2">
              <span class="text-[11px] font-mono uppercase text-[#858A80] font-bold block">Quick Actions:</span>
              <div class="flex flex-wrap gap-2">
                <button class="quick-pill text-[11px] font-mono px-3 py-1.5 rounded-lg border border-[#D8FF3E]/30 bg-[#D8FF3E]/10 text-[#D8FF3E] hover:bg-[#D8FF3E] hover:text-[#111410] font-bold transition-all cursor-pointer" data-preset="50_challenge">
                  ⚡ ₹50 Protein Challenge
                </button>
                <button class="quick-pill text-[11px] px-2.5 py-1 rounded-lg border border-[#34382F] bg-[#111410] text-[#858A80] hover:text-[#F4F5EF] cursor-pointer" data-preset="30_left">
                  "I have ₹30 left"
                </button>
                <button class="quick-pill text-[11px] px-2.5 py-1 rounded-lg border border-[#34382F] bg-[#111410] text-[#858A80] hover:text-[#F4F5EF] cursor-pointer" data-preset="25g_more">
                  "Need 25g more"
                </button>
                <button class="quick-pill text-[11px] px-2.5 py-1 rounded-lg border border-[#34382F] bg-[#111410] text-[#858A80] hover:text-[#F4F5EF] cursor-pointer" data-preset="no_kitchen">
                  "No Kitchen / Hostel"
                </button>
              </div>
            </div>
          </div>

          <!-- Computed Knapsack Solution Card -->
          <div class="space-y-4">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div class="flex items-center space-x-2">
                <i data-lucide="sparkles" class="w-4 h-4 text-[#D8FF3E]"></i>
                <h3 class="text-sm font-bold text-[#F4F5EF] font-mono">OPTIMAL COMBO UNLOCKED FOR ₹${activeBudget}</h3>
              </div>
              <div class="flex items-center space-x-3 text-xs font-mono">
                <span id="opt-stat-protein" class="text-[#D8FF3E] font-bold text-sm">+${solved.total_protein_g}g Protein</span>
                <span class="text-[#858A80]">|</span>
                <span id="opt-stat-cost" class="text-[#F4F5EF]">Cost: ₹${solved.total_cost_inr}</span>
                <span class="text-[#858A80]">|</span>
                <span id="opt-stat-change" class="text-[#858A80]">Change: ₹${solved.remaining_budget_inr}</span>
              </div>
            </div>

            <!-- Solved Items Row (Staggered Animation) -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              ${solved.items.map((item, idx) => `
                <div class="stagger-${Math.min(idx + 1, 4)} bg-[#111410] p-3 rounded-xl border border-[#34382F] hover:border-[#D8FF3E]/40 transition-colors flex items-center space-x-3">
                  <img src="${item.food.image_url}" alt="${item.food.name}" class="w-12 h-12 rounded-lg object-cover border border-[#34382F]" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'" />
                  <div class="flex-1 min-w-0">
                    <h4 class="text-xs font-bold text-[#F4F5EF] truncate">${item.food.name}</h4>
                    <div class="text-[11px] text-[#858A80] font-mono">${item.servings > 1 ? `${item.servings}x servings` : item.food.serving_size}</div>
                    <div class="text-[11px] font-mono font-bold text-[#D8FF3E] mt-0.5">
                      +${item.total_protein_g}g P • ₹${item.total_price_inr}
                    </div>
                  </div>
                  <button class="swap-btn p-1.5 rounded-lg border border-[#34382F] text-[#858A80] hover:text-[#D8FF3E] hover:border-[#D8FF3E] transition-colors cursor-pointer" data-food-id="${item.food.id}" title="Swap with alternative">
                    <i data-lucide="arrow-left-right" class="w-3.5 h-3.5"></i>
                  </button>
                </div>
              `).join('')}
            </div>

            <!-- Student Tip Banner -->
            <div class="bg-[#111410] border-l-2 border-[#D8FF3E] p-3 rounded-r-xl flex items-center space-x-3 text-xs">
              <i data-lucide="info" class="w-4 h-4 text-[#D8FF3E] flex-shrink-0"></i>
              <p class="text-[#858A80]">${solved.student_tip} <strong class="text-[#F4F5EF]">${solved.verdict}</strong></p>
            </div>
          </div>
        </div>

        <!-- FILTERS & SEARCH CONTROLS -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
          <!-- Diet Tabs -->
          <div class="flex flex-wrap gap-2 text-xs">
            ${['all', 'vegetarian', 'eggetarian', 'non_vegetarian', 'vegan'].map(d => `
              <button class="diet-filter-btn px-3 py-1.5 rounded-lg border transition-all ${activeDiet === d ? 'border-[#D8FF3E] bg-[#D8FF3E]/10 text-[#D8FF3E] font-bold' : 'border-[#34382F] bg-[#1B1E19] text-[#858A80]'}" data-diet="${d}">
                ${d.replace('_', ' ').toUpperCase()}
              </button>
            `).join('')}
          </div>

          <!-- Secondary Controls: Hostel Toggle, No-Cook Toggle, Sorting -->
          <div class="flex flex-wrap items-center gap-3 text-xs">
            <label class="flex items-center space-x-1.5 cursor-pointer bg-[#1B1E19] border border-[#34382F] px-2.5 py-1.5 rounded-lg">
              <input type="checkbox" id="hostel-toggle" ${hostelOnly ? 'checked' : ''} class="accent-[#D8FF3E]" />
              <span class="text-[#858A80]">Hostel Ready</span>
            </label>

            <label class="flex items-center space-x-1.5 cursor-pointer bg-[#1B1E19] border border-[#34382F] px-2.5 py-1.5 rounded-lg">
              <input type="checkbox" id="nocook-toggle" ${noCookOnly ? 'checked' : ''} class="accent-[#D8FF3E]" />
              <span class="text-[#858A80]">No-Cook Only</span>
            </label>

            <select id="sort-select" class="bg-[#1B1E19] border border-[#34382F] rounded-lg px-2.5 py-1.5 text-[#F4F5EF] focus:border-[#D8FF3E] focus:outline-none font-mono">
              <option value="protein_per_rupee" ${activeSort === 'protein_per_rupee' ? 'selected' : ''}>Sort: Highest Protein/₹</option>
              <option value="lowest_cost" ${activeSort === 'lowest_cost' ? 'selected' : ''}>Sort: Lowest Cost</option>
              <option value="highest_protein" ${activeSort === 'highest_protein' ? 'selected' : ''}>Sort: Highest Protein/Serving</option>
              <option value="prep_time" ${activeSort === 'prep_time' ? 'selected' : ''}>Sort: Fastest Prep</option>
            </select>
          </div>
        </div>

        <!-- FOODS DIRECTORY CARDS -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          ${foods.map(f => `
            <div class="card-proto overflow-hidden group flex flex-col justify-between">
              <div>
                <!-- Authentic Food Photography -->
                <div class="relative h-44 overflow-hidden bg-[#111410]">
                  <img src="${f.image_url}" alt="${f.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'" />
                  <div class="img-badge px-2 py-0.5 rounded text-[10px] font-mono font-bold ${f.cost_per_10g_protein <= 10 ? 'text-[#D8FF3E] border-[#D8FF3E]/40' : 'text-[#F4F5EF]'}">
                    ₹${f.cost_per_10g_protein} / 10g Protein
                  </div>
                </div>

                <div class="p-4 space-y-3">
                  <div>
                    <div class="flex items-center justify-between">
                      <span class="text-[10px] font-mono uppercase text-[#858A80]">${f.category}</span>
                      <span class="text-[10px] font-bold ${f.dietary_type === 'vegan' ? 'text-green-400' : (f.dietary_type === 'vegetarian' ? 'text-emerald-400' : (f.dietary_type === 'eggetarian' ? 'text-amber-400' : 'text-red-400'))}">
                        ${f.dietary_type.toUpperCase()}
                      </span>
                    </div>
                    <h4 class="font-bold text-sm text-[#F4F5EF] mt-0.5">${f.name}</h4>
                    <div class="text-[11px] text-[#858A80]">${f.serving_size} • ${f.prep_time_min === 0 ? 'No-Cook Ready' : `${f.prep_time_min} mins prep`}</div>
                  </div>

                  <!-- Macros Grid -->
                  <div class="grid grid-cols-3 gap-1.5 bg-[#111410] p-2 rounded-lg border border-[#34382F] text-center font-mono">
                    <div>
                      <div class="text-[9px] text-[#858A80]">Protein</div>
                      <div class="font-bold text-xs text-[#D8FF3E]">${f.protein_g}g</div>
                    </div>
                    <div>
                      <div class="text-[9px] text-[#858A80]">Energy</div>
                      <div class="font-bold text-xs text-[#F4F5EF]">${f.calories} kcal</div>
                    </div>
                    <div>
                      <div class="text-[9px] text-[#858A80]">Price</div>
                      <div class="font-bold text-xs text-[#F4F5EF]">₹${f.price_inr}</div>
                    </div>
                  </div>

                  <p class="text-[11px] text-[#858A80] line-clamp-2 leading-relaxed">
                    ${f.description}
                  </p>
                </div>
              </div>

              <!-- Card Actions -->
              <div class="p-4 pt-0 border-t border-[#34382F]/40 flex items-center justify-between text-xs mt-2">
                <button class="edit-price-btn text-[11px] text-[#858A80] hover:text-[#D8FF3E] flex items-center space-x-1" data-food-id="${f.id}" data-food-name="${f.name}" data-current-price="${f.price_inr}">
                  <i data-lucide="edit-3" class="w-3 h-3"></i>
                  <span>Edit Local Price</span>
                </button>

                <button class="swap-modal-btn btn-ghost px-2.5 py-1 text-[11px] font-bold" data-food-id="${f.id}">
                  Find Swaps
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
    animateValue(document.getElementById("opt-stat-protein"), 0, solved.total_protein_g, 500, "+", "g Protein");
    animateValue(document.getElementById("opt-stat-cost"), 0, solved.total_cost_inr, 500, "Cost: ₹", "");
    animateValue(document.getElementById("opt-stat-change"), 0, solved.remaining_budget_inr, 500, "Change: ₹", "");
    attachListeners();
  }

  function attachListeners() {
    // Slider
    const slider = document.getElementById("budget-live-slider");
    const display = document.getElementById("slider-budget-val");
    let optDebounceTimer = null;
    if (slider && display) {
      slider.addEventListener("input", (e) => {
        display.textContent = e.target.value;
        activeBudget = parseFloat(e.target.value);
        clearTimeout(optDebounceTimer);
        optDebounceTimer = setTimeout(() => {
          loadDataAndRender();
        }, 120);
      });
      slider.addEventListener("change", (e) => {
        clearTimeout(optDebounceTimer);
        activeBudget = parseFloat(e.target.value);
        loadDataAndRender();
      });
    }

    // Quick Action Pills
    document.querySelectorAll(".quick-pill").forEach(btn => {
      btn.addEventListener("click", () => {
        const preset = btn.getAttribute("data-preset");
        if (preset === "50_challenge") {
          activeBudget = 50;
          hostelOnly = true;
        } else if (preset === "30_left") {
          activeBudget = 30;
        } else if (preset === "25g_more") {
          activeBudget = 40;
        } else if (preset === "no_kitchen") {
          hostelOnly = true;
          noCookOnly = true;
        }
        loadDataAndRender();
      });
    });

    // Diet Filters
    document.querySelectorAll(".diet-filter-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        activeDiet = btn.getAttribute("data-diet");
        loadDataAndRender();
      });
    });

    // Toggles & Sorting
    document.getElementById("hostel-toggle")?.addEventListener("change", (e) => {
      hostelOnly = e.target.checked;
      loadDataAndRender();
    });

    document.getElementById("nocook-toggle")?.addEventListener("change", (e) => {
      noCookOnly = e.target.checked;
      loadDataAndRender();
    });

    document.getElementById("sort-select")?.addEventListener("change", (e) => {
      activeSort = e.target.value;
      loadDataAndRender();
    });

    // Swap Buttons
    document.querySelectorAll(".swap-btn, .swap-modal-btn").forEach(btn => {
      btn.addEventListener("click", async () => {
        const foodId = btn.getAttribute("data-food-id");
        openSubstitutionModal(foodId);
      });
    });

    // Edit Local Price Buttons
    document.querySelectorAll(".edit-price-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const foodId = btn.getAttribute("data-food-id");
        const foodName = btn.getAttribute("data-food-name");
        const currentPrice = btn.getAttribute("data-current-price");
        openPriceOverrideModal(foodId, foodName, currentPrice);
      });
    });
  }

  async function openSubstitutionModal(foodId) {
    const modalRoot = document.getElementById("modal-root");
    if (!modalRoot) return;

    modalRoot.innerHTML = `
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop">
        <div class="card-proto p-6 max-w-xl w-full space-y-4 border-[#D8FF3E]/40 animate-fade-in">
          <div class="flex items-center justify-between border-b border-[#34382F] pb-3">
            <h3 class="text-sm font-bold text-[#F4F5EF] flex items-center space-x-2">
              <i data-lucide="arrow-left-right" class="w-4 h-4 text-[#D8FF3E]"></i>
              <span>Smart Substitutions for ${foodId.replace('_', ' ').toUpperCase()}</span>
            </h3>
            <button id="close-modal-btn" class="text-[#858A80] hover:text-[#F4F5EF]"><i data-lucide="x" class="w-5 h-5"></i></button>
          </div>
          <div id="modal-content" class="py-4 text-center text-xs text-[#858A80]">
            <i data-lucide="loader" class="w-5 h-5 animate-spin mx-auto text-[#D8FF3E]"></i>
            <span class="mt-2 block">Calculating optimal nutrient-matched swaps...</span>
          </div>
        </div>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
    document.getElementById("close-modal-btn")?.addEventListener("click", () => modalRoot.innerHTML = "");

    try {
      const res = await api.getSubstitutions(foodId);
      const content = document.getElementById("modal-content");
      if (!content) return;

      const recs = res.recommendations;
      content.innerHTML = `
        <div class="space-y-3 text-left">
          <div class="text-[11px] text-[#858A80] pb-1">
            Replaces <strong class="text-[#F4F5EF]">${res.original_food.name}</strong> (₹${res.original_food.price_inr} • ${res.original_food.protein_g}g P)
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <!-- Cheaper -->
            <div class="p-3 bg-[#111410] border border-[#34382F] rounded-xl space-y-1.5">
              <span class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold">${recs.cheapest_substitute.tag}</span>
              <h4 class="font-bold text-[#F4F5EF]">${recs.cheapest_substitute.food.name}</h4>
              <div class="font-mono text-[11px] text-[#D8FF3E]">+${recs.cheapest_substitute.food.protein_g}g P • ₹${recs.cheapest_substitute.food.price_inr}</div>
              <p class="text-[10px] text-[#858A80]">${recs.cheapest_substitute.reason}</p>
            </div>

            <!-- Higher Protein -->
            <div class="p-3 bg-[#111410] border border-[#34382F] rounded-xl space-y-1.5">
              <span class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#D8FF3E]/10 text-[#D8FF3E] font-bold">${recs.higher_protein_substitute.tag}</span>
              <h4 class="font-bold text-[#F4F5EF]">${recs.higher_protein_substitute.food.name}</h4>
              <div class="font-mono text-[11px] text-[#D8FF3E]">+${recs.higher_protein_substitute.food.protein_g}g P • ₹${recs.higher_protein_substitute.food.price_inr}</div>
              <p class="text-[10px] text-[#858A80]">${recs.higher_protein_substitute.reason}</p>
            </div>

            <!-- Veg Swap -->
            <div class="p-3 bg-[#111410] border border-[#34382F] rounded-xl space-y-1.5">
              <span class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-green-500/10 text-green-400 font-bold">${recs.vegetarian_substitute.tag}</span>
              <h4 class="font-bold text-[#F4F5EF]">${recs.vegetarian_substitute.food.name}</h4>
              <div class="font-mono text-[11px] text-[#D8FF3E]">+${recs.vegetarian_substitute.food.protein_g}g P • ₹${recs.vegetarian_substitute.food.price_inr}</div>
              <p class="text-[10px] text-[#858A80]">${recs.vegetarian_substitute.reason}</p>
            </div>

            <!-- Zero Cook -->
            <div class="p-3 bg-[#111410] border border-[#34382F] rounded-xl space-y-1.5">
              <span class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#9C8AFF]/10 text-[#9C8AFF] font-bold">${recs.zero_cook_substitute.tag}</span>
              <h4 class="font-bold text-[#F4F5EF]">${recs.zero_cook_substitute.food.name}</h4>
              <div class="font-mono text-[11px] text-[#D8FF3E]">+${recs.zero_cook_substitute.food.protein_g}g P • ₹${recs.zero_cook_substitute.food.price_inr}</div>
              <p class="text-[10px] text-[#858A80]">${recs.zero_cook_substitute.reason}</p>
            </div>
          </div>
        </div>
      `;
      if (window.lucide) window.lucide.createIcons();
    } catch (e) {
      modalRoot.innerHTML = "";
      showToast("Could not load substitutions", "error");
    }
  }

  function openPriceOverrideModal(foodId, foodName, currentPrice) {
    const modalRoot = document.getElementById("modal-root");
    if (!modalRoot) return;

    modalRoot.innerHTML = `
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop">
        <div class="card-proto p-6 max-w-sm w-full space-y-4 border-[#34382F] animate-fade-in">
          <div class="flex items-center justify-between border-b border-[#34382F] pb-3">
            <h3 class="text-sm font-bold text-[#F4F5EF]">Edit Local Market Price</h3>
            <button id="close-price-modal" class="text-[#858A80] hover:text-[#F4F5EF]"><i data-lucide="x" class="w-5 h-5"></i></button>
          </div>

          <div class="space-y-3 text-xs">
            <p class="text-[#858A80]">
              Override the default price for <strong class="text-[#F4F5EF]">${foodName}</strong> based on your local kirana or campus mess rates.
            </p>
            <div>
              <label class="block text-[#858A80] font-bold mb-1">Your Local Price (INR ₹):</label>
              <input type="number" step="0.5" id="custom-price-input" value="${currentPrice}" min="1" max="500" class="w-full bg-[#111410] border border-[#34382F] rounded-lg px-3 py-2 text-[#F4F5EF] focus:border-[#D8FF3E] focus:outline-none font-mono text-base font-bold" />
            </div>
            <button id="save-price-btn" class="btn-acid w-full py-2.5 font-bold text-xs mt-2">
              Save Local Price
            </button>
          </div>
        </div>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
    document.getElementById("close-price-modal")?.addEventListener("click", () => modalRoot.innerHTML = "");

    document.getElementById("save-price-btn")?.addEventListener("click", async () => {
      const newPrice = parseFloat(document.getElementById("custom-price-input")?.value);
      if (!newPrice || newPrice <= 0) return;

      try {
        await api.overridePrice(foodId, newPrice);
        modalRoot.innerHTML = "";
        showToast(`Updated local price for ${foodName} to ₹${newPrice}`, "success");
        loadDataAndRender();
      } catch (e) {
        showToast(`Failed: ${e.message}`, "error");
      }
    });
  }

  loadDataAndRender();
}
