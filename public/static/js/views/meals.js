/**
 * PROTOMANIA Personalized 7-Day Day-Wise Meal Planner View
 * Multi-tier budget schedules (₹60, ₹80, ₹100, ₹120, ₹150+),
 * 7-Day day-wise variety (Monday to Sunday with distinct recipes),
 * multi-mode realities (Hostel, Mess Survival, Zero-Cook, Exam-Week, Veg Muscle),
 * and dynamic weekly bulk grocery haul generator.
 */

import { api } from "../api.js";
import { state } from "../state.js";
import { showToast } from "../components/toast.js";
import { animateValue } from "../utils.js";

export async function renderMealsView(container) {
  const userProfile = state.get("profile") || {};
  let activeMode = "hostel";
  let activeBudget = parseFloat(userProfile.daily_budget_inr) || 80.0;
  let activeDiet = userProfile.dietary_preference || "vegetarian";
  let activeDayIndex = 0; // 0 = Monday ... 6 = Sunday
  let currentPlan = null;

  async function loadAndRender() {
    container.innerHTML = `
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 animate-fade-in">
        <div class="flex items-center justify-center py-20 text-[#858A80]">
          <i data-lucide="loader" class="w-6 h-6 animate-spin text-[#D8FF3E]"></i>
          <span class="ml-2 font-mono text-xs">Assembling 7-day ₹${activeBudget}/day meal schedule in ${activeMode.replace('_', ' ')} mode...</span>
        </div>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();

    try {
      currentPlan = await api.getMealPlan(activeMode, activeBudget, activeDiet);
      renderUI(currentPlan);
    } catch (e) {
      container.innerHTML = `<div class="p-8 text-center text-red-400">Failed to load meal plan: ${e.message}</div>`;
    }
  }

  function renderUI(plan) {
    if (!plan) return;

    // Normalize 7-day schedule array
    const days = (plan.days && plan.days.length > 0) ? plan.days : [{
      day_number: 1,
      day_name: "Today",
      day_short: "Today",
      theme: plan.tier_title || "Daily Nutrition Plan",
      meals: plan.meals || [],
      total_protein_g: plan.total_protein_g || 0,
      total_calories: plan.total_calories || 0,
      total_price_inr: plan.total_price_inr || 0,
      budget_remaining_inr: plan.budget_remaining_inr || 0
    }];

    // Clamp activeDayIndex within range
    if (activeDayIndex >= days.length) {
      activeDayIndex = 0;
    }

    const currentDay = days[activeDayIndex];

    container.innerHTML = `
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        <!-- Header -->
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div class="space-y-2">
            <div class="inline-flex items-center space-x-2 text-xs font-mono text-[#D8FF3E]">
              <span class="w-2 h-2 rounded-full bg-[#D8FF3E] animate-pulse"></span>
              <span>7-DAY HIGH-PROTEIN DIET SCHEDULE</span>
            </div>
            <h1 class="text-3xl sm:text-4xl font-extrabold text-[#F4F5EF]">Student Diet & Meal Planner</h1>
            <p class="text-xs sm:text-sm text-[#858A80] max-w-xl">
              Authentic Indian student recipes engineered day-by-day to fit your exact ₹${activeBudget}/day budget and hostel conditions.
            </p>
          </div>

          <!-- Top CTA: Grocery List -->
          <button id="open-grocery-btn" class="btn-acid text-xs px-4 py-2.5 font-bold flex items-center space-x-2 shadow-md self-start md:self-auto cursor-pointer">
            <i data-lucide="shopping-bag" class="w-4 h-4 fill-current"></i>
            <span>Generate 7-Day Grocery List</span>
          </button>
        </div>

        <!-- 1. Dedicated Budget Tier Selector Bar -->
        <div class="card-proto p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#1B1E19] border-[#34382F]">
          <div class="flex items-center space-x-2">
            <i data-lucide="wallet" class="w-4 h-4 text-[#D8FF3E]"></i>
            <span class="text-xs font-mono uppercase text-[#F4F5EF] font-bold">Daily Budget Tier:</span>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            ${[
              { budget: 60, label: '₹60 Broke' },
              { budget: 80, label: '₹80 Standard' },
              { budget: 100, label: '₹100 Booster' },
              { budget: 120, label: '₹120 Hypertrophy' },
              { budget: 150, label: '₹150 Pro Beast' }
            ].map(b => `
              <button class="budget-tier-btn px-3.5 py-1.5 rounded-lg border text-xs font-mono font-bold transition-all cursor-pointer ${Math.abs(activeBudget - b.budget) < 10 ? 'border-[#D8FF3E] bg-[#D8FF3E] text-[#111410] shadow-[0_0_12px_rgba(216,255,62,0.3)]' : 'border-[#34382F] bg-[#111410] text-[#858A80] hover:text-[#F4F5EF] hover:border-[#858A80]'}" data-budget="${b.budget}">
                ${b.label}
              </button>
            `).join('')}
            <div class="flex items-center space-x-1.5 pl-2 border-l border-[#34382F]">
              <span class="text-xs text-[#858A80] font-mono">Custom:</span>
              <input type="number" id="custom-budget-input" value="${activeBudget}" min="40" max="350" step="10" class="w-16 bg-[#111410] border border-[#34382F] rounded px-2 py-1 text-xs font-mono text-[#D8FF3E] font-bold focus:border-[#D8FF3E] focus:outline-none" />
              <button id="apply-custom-budget-btn" class="px-2 py-1 text-[11px] font-mono font-bold rounded bg-[#242921] border border-[#34382F] text-[#F4F5EF] hover:border-[#D8FF3E] cursor-pointer">Go</button>
            </div>
          </div>
        </div>

        <!-- 2. Dual Controls Bar: Living Reality Mode & Dietary Preference -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <!-- Student Reality Mode -->
          <div class="lg:col-span-8 card-proto p-3.5 px-4 flex flex-wrap items-center justify-between gap-3 bg-[#1B1E19]">
            <span class="text-xs font-mono uppercase text-[#858A80] font-bold">Living Mode:</span>
            <div class="flex flex-wrap gap-1.5 text-xs">
              ${[
                { id: 'hostel', label: 'Hostel Mode' },
                { id: 'mess', label: 'Mess Survival' },
                { id: 'no_cook', label: 'Zero-Cook' },
                { id: 'exam_week', label: 'Exam-Week' },
                { id: 'veg_muscle', label: 'Veg Muscle' }
              ].map(m => `
                <button class="mode-btn px-3 py-1 rounded-lg border transition-all cursor-pointer ${activeMode === m.id ? 'border-[#D8FF3E] bg-[#D8FF3E]/10 text-[#D8FF3E] font-bold' : 'border-[#34382F] bg-[#111410] text-[#858A80] hover:text-[#F4F5EF]'}" data-mode="${m.id}">
                  ${m.label}
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Dietary Preference Switcher -->
          <div class="lg:col-span-4 card-proto p-3.5 px-4 flex flex-wrap items-center justify-between gap-2 bg-[#1B1E19]">
            <span class="text-xs font-mono uppercase text-[#858A80] font-bold">Diet:</span>
            <div class="flex items-center gap-1.5 text-xs">
              ${[
                { id: 'vegetarian', label: '🌱 Veg' },
                { id: 'eggetarian', label: '🥚 Egg' },
                { id: 'non_vegetarian', label: '🍗 Non-Veg' }
              ].map(d => `
                <button class="diet-btn px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${activeDiet === d.id ? 'border-[#D8FF3E] bg-[#D8FF3E]/10 text-[#D8FF3E] font-bold' : 'border-[#34382F] bg-[#111410] text-[#858A80] hover:text-[#F4F5EF]'}" data-diet="${d.id}">
                  ${d.label}
                </button>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- 3. Interactive 7-Day Day-Wise Navigation Selector -->
        <div class="card-proto p-4 bg-[#1B1E19] border-[#34382F] space-y-3">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#34382F] pb-2.5">
            <div class="flex items-center space-x-2">
              <i data-lucide="calendar" class="w-4 h-4 text-[#D8FF3E]"></i>
              <span class="text-xs font-mono uppercase text-[#F4F5EF] font-bold">Select Day of Week:</span>
              <span class="text-[11px] text-[#858A80] font-mono hidden sm:inline">(Tap to view recipes & macros)</span>
            </div>
            <div class="text-xs font-mono text-[#D8FF3E] font-semibold">
              Weekly Total: ₹${plan.total_weekly_cost_inr || (plan.average_daily_cost_inr * 7)} • Avg ${plan.average_daily_protein_g || currentDay.total_protein_g}g Protein/day
            </div>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
            ${days.map((d, idx) => {
              const isActive = activeDayIndex === idx;
              return `
                <button 
                  class="day-pill-btn p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${isActive ? 'border-[#D8FF3E] bg-[#D8FF3E] text-[#111410] shadow-[0_0_15px_rgba(216,255,62,0.35)] scale-[1.02]' : 'border-[#34382F] bg-[#111410] text-[#858A80] hover:text-[#F4F5EF] hover:border-[#858A80]'}" 
                  data-day-idx="${idx}">
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-mono font-black uppercase ${isActive ? 'text-[#111410]' : 'text-[#F4F5EF]'}">${d.day_short}</span>
                    <span class="text-[10px] font-mono px-1.5 py-0.5 rounded ${isActive ? 'bg-[#111410] text-[#D8FF3E] font-bold' : 'bg-[#1B1E19] text-[#858A80]'}">Day 0${idx + 1}</span>
                  </div>
                  <div class="mt-1.5 font-mono">
                    <div class="text-xs font-extrabold ${isActive ? 'text-[#111410]' : 'text-[#D8FF3E]'}">${d.total_protein_g}g Prot</div>
                    <div class="text-[10px] ${isActive ? 'text-[#111410]/80' : 'text-[#858A80]'}">₹${d.total_price_inr}</div>
                  </div>
                </button>
              `;
            }).join('')}
          </div>
        </div>

        <!-- 4. Dynamic Tier & Day Focus Banner Display -->
        <div class="p-4 rounded-xl bg-gradient-to-r from-[#D8FF3E]/10 via-[#1B1E19] to-[#1B1E19] border border-[#D8FF3E]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
          <div class="space-y-1">
            <div class="flex items-center space-x-2">
              <span class="w-2 h-2 rounded-full bg-[#D8FF3E] animate-pulse"></span>
              <span class="text-xs font-mono font-bold text-[#D8FF3E] uppercase">${currentDay.day_name} Focus:</span>
              <span class="text-xs font-bold text-[#F4F5EF]">${currentDay.theme}</span>
            </div>
            <p class="text-xs text-[#858A80] leading-relaxed">
              <strong class="text-[#F4F5EF]">${plan.tier_title}</strong> — ${plan.tier_tagline}
            </p>
          </div>
          <div class="text-right font-mono text-xs text-[#858A80] flex-shrink-0">
            <div>${currentDay.day_name} Cost: <strong class="text-[#D8FF3E] font-bold text-sm">₹${currentDay.total_price_inr}</strong></div>
            <div class="text-[11px]">Daily Budget: ₹${activeBudget} (Leftover: ₹${currentDay.budget_remaining_inr})</div>
          </div>
        </div>

        <!-- 5. Macro & Budget Tally Bar -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div class="card-proto p-4 space-y-1 border-l-2 border-[#D8FF3E]">
            <span class="text-[10px] text-[#858A80] uppercase">${currentDay.day_short} Protein</span>
            <div id="meal-stat-protein" class="text-xl font-bold text-[#D8FF3E]">${currentDay.total_protein_g}g</div>
          </div>
          <div class="card-proto p-4 space-y-1">
            <span class="text-[10px] text-[#858A80] uppercase">${currentDay.day_short} Calories</span>
            <div id="meal-stat-calories" class="text-xl font-bold text-[#F4F5EF]">${currentDay.total_calories} kcal</div>
          </div>
          <div class="card-proto p-4 space-y-1">
            <span class="text-[10px] text-[#858A80] uppercase">${currentDay.day_short} Cost</span>
            <div id="meal-stat-cost" class="text-xl font-bold text-[#F4F5EF]">₹${currentDay.total_price_inr}</div>
          </div>
          <div class="card-proto p-4 space-y-1 border-r-2 ${currentDay.budget_remaining_inr >= 0 ? 'border-[#D8FF3E]' : 'border-red-400'}">
            <span class="text-[10px] text-[#858A80] uppercase">Pocket Leftover</span>
            <div id="meal-stat-remaining" class="text-xl font-bold ${currentDay.budget_remaining_inr >= 0 ? 'text-[#D8FF3E]' : 'text-red-400'}">₹${currentDay.budget_remaining_inr}</div>
          </div>
        </div>

        <!-- 6. Meal Cards Timeline for Current Day -->
        <div class="space-y-6">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-bold text-[#F4F5EF] flex items-center space-x-2">
              <span>${currentDay.day_name}'s Meal Timeline</span>
              <span class="text-xs font-mono px-2 py-0.5 rounded bg-[#1B1E19] text-[#D8FF3E] border border-[#34382F]">
                ${currentDay.meals.length} Meals Planned
              </span>
            </h2>
            <span class="text-xs font-mono text-[#858A80]">Strict Student Budget Scaled</span>
          </div>

          ${currentDay.meals.map((m, idx) => `
            <div class="stagger-${Math.min(idx + 1, 4)} card-proto p-6 border-[#34382F] hover:border-[#D8FF3E]/30 transition-all space-y-5">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#34382F] pb-4">
                <div class="flex items-center space-x-3">
                  <span class="w-8 h-8 rounded-full bg-[#D8FF3E]/10 text-[#D8FF3E] flex items-center justify-center font-mono font-bold text-xs border border-[#D8FF3E]/30">
                    0${idx + 1}
                  </span>
                  <div>
                    <div class="flex items-center space-x-2">
                      <span class="text-xs font-bold text-[#D8FF3E]">${m.meal_type}</span>
                      <span class="text-[11px] font-mono text-[#858A80]">(${m.timing})</span>
                    </div>
                    <h3 class="text-lg font-bold text-[#F4F5EF] mt-0.5">${m.title}</h3>
                  </div>
                </div>

                <div class="flex items-center space-x-3 text-xs font-mono self-end sm:self-auto">
                  <span class="text-[#D8FF3E] font-bold text-sm">+${m.protein_g}g Protein</span>
                  <span class="text-[#858A80]">|</span>
                  <span class="text-[#F4F5EF] font-bold">₹${m.price_inr}</span>
                  <button class="log-this-meal-btn btn-acid px-3 py-1.5 text-xs font-bold shadow-sm cursor-pointer" data-title="${m.title}" data-protein="${m.protein_g}" data-calories="${m.calories}" data-price="${m.price_inr}">
                    Mark Eaten (+50 XP)
                  </button>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <!-- Authentic Photography -->
                <div class="md:col-span-4 h-48 rounded-xl overflow-hidden bg-[#111410] border border-[#34382F] relative group">
                  <img src="${m.image_url}" alt="${m.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'" />
                  <div class="absolute bottom-2 left-2 bg-[#111410]/80 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-mono text-[#D8FF3E] border border-[#34382F]">
                    ${m.prep_time_min === 0 ? 'Zero-Cook' : `${m.prep_time_min}m prep`}
                  </div>
                </div>

                <!-- Prep Details & Hacks -->
                <div class="md:col-span-8 space-y-3 text-xs">
                  <div>
                    <h4 class="font-bold text-[#858A80] uppercase tracking-wider text-[10px]">Preparation Protocol (${m.prep_time_min} mins):</h4>
                    <p class="text-[#F4F5EF] mt-1 leading-relaxed">${m.instructions}</p>
                  </div>

                  <!-- Budget Swap Suggestion -->
                  <div class="bg-[#111410] p-3 rounded-xl border border-[#34382F] space-y-1">
                    <span class="text-[10px] font-mono text-[#D8FF3E] font-bold flex items-center space-x-1">
                      <i data-lucide="arrow-left-right" class="w-3 h-3"></i>
                      <span>BUDGET-SAVING SWAP</span>
                    </span>
                    <p class="text-[#858A80] text-[11px]">${m.budget_swap}</p>
                  </div>

                  <div class="flex items-center space-x-4 text-[11px] text-[#858A80] pt-1 font-mono">
                    <span>Calories: <strong class="text-[#F4F5EF]">${m.calories} kcal</strong></span>
                    <span>Prep Time: <strong class="text-[#F4F5EF]">${m.prep_time_min === 0 ? 'Zero-Cook' : `${m.prep_time_min} mins`}</strong></span>
                  </div>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
    animateValue(document.getElementById("meal-stat-protein"), 0, currentDay.total_protein_g, 300, "", "g");
    animateValue(document.getElementById("meal-stat-calories"), 0, currentDay.total_calories, 300, "", " kcal");
    animateValue(document.getElementById("meal-stat-cost"), 0, currentDay.total_price_inr, 300, "₹", "");
    animateValue(document.getElementById("meal-stat-remaining"), 0, currentDay.budget_remaining_inr, 300, "₹", "");
    attachListeners();
  }

  function attachListeners() {
    // 7-Day Day Selector Buttons
    document.querySelectorAll(".day-pill-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        activeDayIndex = parseInt(btn.getAttribute("data-day-idx"));
        renderUI(currentPlan);
      });
    });

    // Budget Tier switcher
    document.querySelectorAll(".budget-tier-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        activeBudget = parseFloat(btn.getAttribute("data-budget"));
        const prof = state.get("profile") || {};
        prof.daily_budget_inr = activeBudget;
        state.set("profile", prof);
        loadAndRender();
      });
    });

    // Custom budget apply
    const customInput = document.getElementById("custom-budget-input");
    const applyBtn = document.getElementById("apply-custom-budget-btn");
    if (applyBtn && customInput) {
      applyBtn.addEventListener("click", () => {
        const val = parseFloat(customInput.value);
        if (val && val >= 30) {
          activeBudget = val;
          const prof = state.get("profile") || {};
          prof.daily_budget_inr = activeBudget;
          state.set("profile", prof);
          loadAndRender();
        }
      });
      customInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          applyBtn.click();
        }
      });
    }

    // Mode switcher
    document.querySelectorAll(".mode-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        activeMode = btn.getAttribute("data-mode");
        loadAndRender();
      });
    });

    // Diet switcher
    document.querySelectorAll(".diet-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        activeDiet = btn.getAttribute("data-diet");
        const prof = state.get("profile") || {};
        prof.dietary_preference = activeDiet;
        state.set("profile", prof);
        loadAndRender();
      });
    });

    // Mark Eaten
    document.querySelectorAll(".log-this-meal-btn").forEach(btn => {
      btn.addEventListener("click", async () => {
        const title = btn.getAttribute("data-title");
        const protein = parseFloat(btn.getAttribute("data-protein"));
        const calories = parseFloat(btn.getAttribute("data-calories"));
        const price = parseFloat(btn.getAttribute("data-price"));

        btn.disabled = true;
        btn.textContent = "Logging...";

        try {
          const res = await api.logMeal({
            meal_name: title,
            protein_g: protein,
            calories: calories,
            price_inr: price,
            meal_type: "lunch"
          });
          showToast(res.message, "success");
          btn.textContent = "Logged ✓";
          btn.classList.add("bg-emerald-500", "text-white");
        } catch (e) {
          showToast(`Error: ${e.message}`, "error");
          btn.disabled = false;
          btn.textContent = "Mark Eaten";
        }
      });
    });

    // Grocery List Modal
    document.getElementById("open-grocery-btn")?.addEventListener("click", async () => {
      const modalRoot = document.getElementById("modal-root");
      if (!modalRoot) return;

      modalRoot.innerHTML = `
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop">
          <div class="card-proto p-6 max-w-2xl w-full space-y-4 border-[#D8FF3E]/40 max-h-[90vh] overflow-y-auto animate-fade-in">
            <div class="flex items-center justify-between border-b border-[#34382F] pb-3">
              <div class="flex items-center space-x-2">
                <i data-lucide="shopping-bag" class="w-5 h-5 text-[#D8FF3E]"></i>
                <h3 class="text-base font-bold text-[#F4F5EF]">Student 7-Day High-Protein Grocery Haul (₹${activeBudget}/day)</h3>
              </div>
              <button id="close-grocery-modal" class="text-[#858A80] hover:text-[#F4F5EF] cursor-pointer"><i data-lucide="x" class="w-5 h-5"></i></button>
            </div>
            <div id="grocery-modal-body" class="py-4 text-center text-xs text-[#858A80]">
              <i data-lucide="loader" class="w-6 h-6 animate-spin mx-auto text-[#D8FF3E]"></i>
              <span class="mt-2 block">Calculating 7-day raw weights and bulk procurement discounts for ₹${activeBudget}/day...</span>
            </div>
          </div>
        </div>
      `;
      if (window.lucide) window.lucide.createIcons();
      document.getElementById("close-grocery-modal")?.addEventListener("click", () => modalRoot.innerHTML = "");

      try {
        const gList = await api.getGroceryList(activeMode, activeBudget, activeDiet);
        const body = document.getElementById("grocery-modal-body");
        if (!body) return;

        body.innerHTML = `
          <div class="space-y-4 text-left">
            <div class="bg-[#111410] p-4 rounded-xl border border-[#34382F] flex justify-between items-center font-mono">
              <div>
                <span class="text-[10px] text-[#858A80] uppercase">Estimated Weekly Spend:</span>
                <div class="text-2xl font-black text-[#D8FF3E]">₹${gList.total_estimated_weekly_inr}</div>
              </div>
              <div class="text-right">
                <span class="text-[10px] text-[#858A80] uppercase">Average Daily Cost:</span>
                <div class="text-base font-bold text-[#F4F5EF]">₹${gList.average_daily_cost_inr} / day</div>
              </div>
            </div>

            <div class="space-y-2 text-xs">
              <h4 class="font-bold text-[#F4F5EF]">Items to Procure in Bulk:</h4>
              <div class="space-y-2">
                ${gList.items.map(it => `
                  <div class="p-3 bg-[#111410] rounded-xl border border-[#34382F] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div class="font-bold text-[#F4F5EF]">${it.item}</div>
                      <div class="text-[11px] text-[#858A80]">${it.quantity} • Shelf life: ${it.shelf_life}</div>
                      <div class="text-[10px] text-[#D8FF3E] mt-0.5">💡 Tip: ${it.tip}</div>
                    </div>
                    <div class="font-mono font-bold text-[#F4F5EF] text-sm self-end sm:self-center">
                      ₹${it.cost_inr}
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Student Shopping Hacks -->
            <div class="bg-[#111410] p-4 rounded-xl border border-[#34382F] space-y-2 text-xs">
              <h4 class="font-bold text-[#D8FF3E] flex items-center space-x-1">
                <i data-lucide="zap" class="w-3.5 h-3.5"></i>
                <span>Campus Procurement Hacks</span>
              </h4>
              <ul class="space-y-1 text-[#858A80] text-[11px] list-disc list-inside">
                ${gList.shopping_hacks.map(h => `<li>${h}</li>`).join('')}
              </ul>
            </div>
          </div>
        `;
        if (window.lucide) window.lucide.createIcons();
      } catch (err) {
        showToast("Error loading grocery list", "error");
      }
    });
  }

  loadAndRender();
}
