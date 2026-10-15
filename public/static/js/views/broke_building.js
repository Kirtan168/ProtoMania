/**
 * PROTOMANIA "Broke but Building" Emergency Solver
 * Calculates emergency protein combinations for students with tight leftover pocket money.
 */

import { api } from "../api.js";
import { showToast } from "../components/toast.js";

export function renderBrokeBuildingView(container) {
  let budget = 35;
  let protein = 30;
  let diet = "vegetarian";

  function render() {
    container.innerHTML = `
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 animate-fade-in">
        <!-- Header -->
        <div class="space-y-2">
          <div class="inline-flex items-center space-x-2 text-xs font-mono text-[#D8FF3E]">
            <span class="w-2 h-2 rounded-full bg-[#D8FF3E] animate-pulse"></span>
            <span>END-OF-DAY EMERGENCY CRUNCH SOLVER</span>
          </div>
          <h1 class="text-3xl sm:text-4xl font-black text-[#F4F5EF]">Broke but Building 💸</h1>
          <p class="text-xs sm:text-sm text-[#858A80] max-w-xl">
            Only have loose change in your UPI wallet tonight? Enter your leftover rupees and protein target; our heuristic solver finds the cheapest campus combo.
          </p>
        </div>

        <!-- Input Box -->
        <div class="card-proto p-6 sm:p-8 border-[#D8FF3E]/40 space-y-6">
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-5 text-xs">
            <div>
              <label class="block text-[#858A80] font-bold mb-1.5 font-mono">Rupees Left in Pocket (₹):</label>
              <input type="number" id="broke-budget-input" value="${budget}" min="10" max="300" class="w-full bg-[#111410] border border-[#34382F] rounded-lg px-3 py-2 text-[#D8FF3E] font-mono text-xl font-bold focus:border-[#D8FF3E] focus:outline-none" />
            </div>

            <div>
              <label class="block text-[#858A80] font-bold mb-1.5 font-mono">Protein Still Needed (Grams):</label>
              <input type="number" id="broke-protein-input" value="${protein}" min="5" max="100" class="w-full bg-[#111410] border border-[#34382F] rounded-lg px-3 py-2 text-[#F4F5EF] font-mono text-xl font-bold focus:border-[#D8FF3E] focus:outline-none" />
            </div>

            <div>
              <label class="block text-[#858A80] font-bold mb-1.5">Diet Rule:</label>
              <select id="broke-diet-select" class="w-full bg-[#111410] border border-[#34382F] rounded-lg px-3 py-2.5 text-[#F4F5EF] focus:border-[#D8FF3E] focus:outline-none text-xs font-semibold">
                <option value="vegetarian" ${diet === 'vegetarian' ? 'selected' : ''}>Vegetarian</option>
                <option value="eggetarian" ${diet === 'eggetarian' ? 'selected' : ''}>Eggetarian</option>
                <option value="non_vegetarian" ${diet === 'non_vegetarian' ? 'selected' : ''}>Non-Vegetarian</option>
              </select>
            </div>
          </div>

          <button id="solve-broke-btn" class="btn-acid w-full py-3 text-xs font-bold flex items-center justify-center space-x-2 shadow-lg">
            <i data-lucide="zap" class="w-4 h-4 fill-current"></i>
            <span>Solve Emergency Combo</span>
          </button>
        </div>

        <!-- Results Mount -->
        <div id="broke-results-mount" class="space-y-4"></div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
    attachListeners();
    executeSolve();
  }

  function attachListeners() {
    document.getElementById("solve-broke-btn")?.addEventListener("click", () => {
      budget = parseFloat(document.getElementById("broke-budget-input")?.value) || 35;
      protein = parseFloat(document.getElementById("broke-protein-input")?.value) || 30;
      diet = document.getElementById("broke-diet-select")?.value || "vegetarian";
      executeSolve();
    });
  }

  async function executeSolve() {
    const mount = document.getElementById("broke-results-mount");
    if (!mount) return;

    mount.innerHTML = `
      <div class="card-proto p-8 text-center text-[#858A80] text-xs">
        <i data-lucide="loader" class="w-6 h-6 animate-spin mx-auto text-[#D8FF3E]"></i>
        <span class="mt-2 block font-mono">Scanning local staples under ₹${budget}...</span>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();

    try {
      const res = await api.solveBrokeBuilding({
        remaining_budget_inr: budget,
        remaining_protein_g: protein,
        dietary_preference: diet
      });

      mount.innerHTML = `
        <div class="card-proto p-6 sm:p-8 border-[#34382F] space-y-5 animate-fade-in">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#34382F] pb-4 font-mono">
            <div>
              <span class="text-xs text-[#858A80] uppercase">Crunch Verdict:</span>
              <h3 class="text-xl font-bold text-[#D8FF3E] mt-0.5">${res.solution_protein_g}g Protein for ₹${res.solution_cost_inr}</h3>
            </div>
            <div class="text-right">
              <span class="text-xs text-[#858A80]">Remaining Pocket Change:</span>
              <div class="text-base font-bold text-[#F4F5EF]">₹${res.leftover_change_inr}</div>
            </div>
          </div>

          <p class="text-xs text-[#858A80] leading-relaxed">${res.advice}</p>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            ${res.recommended_combos.map(c => `
              <div class="p-3 bg-[#111410] rounded-xl border border-[#34382F] flex items-center space-x-3.5">
                <img src="${c.image_url}" alt="${c.name}" class="w-14 h-14 rounded-lg object-cover border border-[#34382F]" />
                <div class="flex-1 min-w-0">
                  <h4 class="font-bold text-xs text-[#F4F5EF] truncate">${c.name}</h4>
                  <div class="text-[11px] text-[#858A80] font-mono">${c.serving_size} • ${c.prep_type.replace('_', ' ')}</div>
                  <div class="text-[11px] font-mono font-bold text-[#D8FF3E] mt-0.5">
                    +${c.protein_g}g Protein • ₹${c.price_inr}
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
      if (window.lucide) window.lucide.createIcons();
    } catch (e) {
      mount.innerHTML = `<div class="p-4 text-center text-red-400 text-xs">Error solving: ${e.message}</div>`;
    }
  }

  render();
}
