/**
 * PROTOMANIA Personalized Meal Planner View
 * Multi-mode daily schedules (Hostel, Mess Survival, No-Cook, Exam-Week)
 * and weekly bulk grocery haul generator.
 */

import { api } from "../api.js";
import { state } from "../state.js";
import { showToast } from "../components/toast.js";
import { animateValue } from "../utils.js";

export async function renderMealsView(container) {
  let activeMode = "hostel";

  async function loadAndRender() {
    container.innerHTML = `
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 animate-fade-in">
        <div class="flex items-center justify-center py-20 text-[#858A80]">
          <i data-lucide="loader" class="w-6 h-6 animate-spin text-[#D8FF3E]"></i>
          <span class="ml-2 font-mono text-xs">Assembling meal schedule in ${activeMode.replace('_', ' ')} mode...</span>
        </div>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();

    try {
      const plan = await api.getMealPlan(activeMode);
      renderUI(plan);
    } catch (e) {
      container.innerHTML = `<div class="p-8 text-center text-red-400">Failed to load meal plan: ${e.message}</div>`;
    }
  }

  function renderUI(plan) {
    container.innerHTML = `
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        <!-- Header -->
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div class="space-y-2">
            <div class="inline-flex items-center space-x-2 text-xs font-mono text-[#D8FF3E]">
              <span class="w-2 h-2 rounded-full bg-[#D8FF3E] animate-pulse"></span>
              <span>SMART MEAL TIMELINE</span>
            </div>
            <h1 class="text-3xl sm:text-4xl font-extrabold text-[#F4F5EF]">Student Meal Planner</h1>
            <p class="text-xs sm:text-sm text-[#858A80] max-w-xl">
              Realistic meal timings tailored to hostel living, campus mess compromises, and tight pocket money.
            </p>
          </div>

          <!-- Top CTA: Grocery List -->
          <button id="open-grocery-btn" class="btn-acid text-xs px-4 py-2.5 font-bold flex items-center space-x-2 shadow-md self-start md:self-auto cursor-pointer">
            <i data-lucide="shopping-bag" class="w-4 h-4 fill-current"></i>
            <span>Generate 7-Day Grocery List</span>
          </button>
        </div>

        <!-- Student Modes Bar -->
        <div class="card-proto p-4 flex flex-wrap items-center justify-between gap-3 bg-[#1B1E19]">
          <span class="text-xs font-mono uppercase text-[#858A80] font-bold">Select Student Reality:</span>
          <div class="flex flex-wrap gap-2 text-xs">
            ${[
              { id: 'hostel', label: 'Hostel Mode' },
              { id: 'mess', label: 'Mess Survival Mode' },
              { id: 'no_cook', label: 'Zero-Cook Mode' },
              { id: 'exam_week', label: 'Exam-Week Mode' },
              { id: 'veg_muscle', label: 'Veg Muscle Mode' }
            ].map(m => `
              <button class="mode-btn px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${activeMode === m.id ? 'border-[#D8FF3E] bg-[#D8FF3E]/10 text-[#D8FF3E] font-bold' : 'border-[#34382F] bg-[#111410] text-[#858A80] hover:text-[#F4F5EF]'}" data-mode="${m.id}">
                ${m.label}
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Macro & Budget Tally Bar -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div class="card-proto p-4 space-y-1">
            <span class="text-[10px] text-[#858A80]">Total Planned Protein</span>
            <div id="meal-stat-protein" class="text-xl font-bold text-[#D8FF3E]">${plan.total_protein_g}g</div>
          </div>
          <div class="card-proto p-4 space-y-1">
            <span class="text-[10px] text-[#858A80]">Total Daily Calories</span>
            <div id="meal-stat-calories" class="text-xl font-bold text-[#F4F5EF]">${plan.total_calories} kcal</div>
          </div>
          <div class="card-proto p-4 space-y-1">
            <span class="text-[10px] text-[#858A80]">Estimated Cost</span>
            <div id="meal-stat-cost" class="text-xl font-bold text-[#F4F5EF]">₹${plan.total_price_inr}</div>
          </div>
          <div class="card-proto p-4 space-y-1">
            <span class="text-[10px] text-[#858A80]">Budget Remaining</span>
            <div id="meal-stat-remaining" class="text-xl font-bold ${plan.budget_remaining_inr >= 0 ? 'text-[#D8FF3E]' : 'text-red-400'}">₹${plan.budget_remaining_inr}</div>
          </div>
        </div>

        <!-- Meal Cards Timeline -->
        <div class="space-y-6">
          ${plan.meals.map((m, idx) => `
            <div class="stagger-${Math.min(idx + 1, 4)} card-proto p-6 border-[#34382F] hover:border-[#D8FF3E]/30 transition-all space-y-5">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#34382F] pb-4">
                <div class="flex items-center space-x-3">
                  <span class="w-8 h-8 rounded-full bg-[#D8FF3E]/10 text-[#D8FF3E] flex items-center justify-center font-mono font-bold text-xs">
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
                  <button class="log-this-meal-btn btn-acid px-3 py-1.5 text-xs font-bold shadow-sm" data-title="${m.title}" data-protein="${m.protein_g}" data-calories="${m.calories}" data-price="${m.price_inr}">
                    Mark Eaten (+50 XP)
                  </button>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <!-- Photography -->
                <div class="md:col-span-4 h-48 rounded-xl overflow-hidden bg-[#111410] border border-[#34382F]">
                  <img src="${m.image_url}" alt="${m.title}" class="w-full h-full object-cover" />
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
    animateValue(document.getElementById("meal-stat-protein"), 0, plan.total_protein_g, 500, "", "g");
    animateValue(document.getElementById("meal-stat-calories"), 0, plan.total_calories, 500, "", " kcal");
    animateValue(document.getElementById("meal-stat-cost"), 0, plan.total_price_inr, 500, "₹", "");
    animateValue(document.getElementById("meal-stat-remaining"), 0, plan.budget_remaining_inr, 500, "₹", "");
    attachListeners();
  }

  function attachListeners() {
    // Mode switcher
    document.querySelectorAll(".mode-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        activeMode = btn.getAttribute("data-mode");
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
                <h3 class="text-base font-bold text-[#F4F5EF]">Student 7-Day High-Protein Grocery Haul</h3>
              </div>
              <button id="close-grocery-modal" class="text-[#858A80] hover:text-[#F4F5EF]"><i data-lucide="x" class="w-5 h-5"></i></button>
            </div>
            <div id="grocery-modal-body" class="py-4 text-center text-xs text-[#858A80]">
              <i data-lucide="loader" class="w-6 h-6 animate-spin mx-auto text-[#D8FF3E]"></i>
              <span class="mt-2 block">Calculating 7-day raw weights and bulk procurement discounts...</span>
            </div>
          </div>
        </div>
      `;
      if (window.lucide) window.lucide.createIcons();
      document.getElementById("close-grocery-modal")?.addEventListener("click", () => modalRoot.innerHTML = "");

      try {
        const gList = await api.getGroceryList(activeMode);
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
