/**
 * PROTOMANIA Protein Price Radar View
 * Visual comparison dashboard tracking Indian staples by cost (₹) per 10g of protein.
 */

import { api } from "../api.js";
import { showToast } from "../components/toast.js";

export async function renderRadarView(container) {
  container.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 animate-fade-in">
      <div class="flex items-center justify-center py-20 text-[#858A80]">
        <i data-lucide="loader" class="w-6 h-6 animate-spin text-[#D8FF3E]"></i>
        <span class="ml-2 font-mono text-xs">Calibrating Protein Price Radar metrics...</span>
      </div>
    </div>
  `;
  if (window.lucide) window.lucide.createIcons();

  try {
    const radarData = await api.getRadar();

    container.innerHTML = `
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 animate-fade-in">
        <!-- Header -->
        <div class="space-y-2">
          <div class="inline-flex items-center space-x-2 text-xs font-mono text-[#D8FF3E]">
            <span class="w-2 h-2 rounded-full bg-[#D8FF3E] animate-pulse"></span>
            <span>INDIAN COMMODITY PROTEIN INDEX</span>
          </div>
          <h1 class="text-3xl sm:text-4xl font-black text-[#F4F5EF]">Protein Price Radar</h1>
          <p class="text-xs sm:text-sm text-[#858A80] max-w-2xl leading-relaxed">
            The true cost benchmark: How many rupees (₹) does it take to get 10 grams of complete protein across Indian staples? 
            Ranked from most affordable to premium.
          </p>
        </div>

        <!-- Radar Visual Bar Comparison -->
        <div class="card-proto p-6 sm:p-8 border-[#34382F] space-y-6">
          <div class="flex items-center justify-between border-b border-[#34382F] pb-4">
            <span class="text-xs font-mono uppercase text-[#858A80] font-bold">Staple & Category</span>
            <span class="text-xs font-mono text-[#D8FF3E] font-bold">Cost per 10g Protein (₹)</span>
          </div>

          <div class="space-y-4">
            ${radarData.items.map(item => {
              const maxCost = 40.0;
              const barWidthPercent = Math.min(100, Math.max(12, (item.cost_per_10g_protein / maxCost) * 100));
              const isBest = item.cost_per_10g_protein <= 10.0;
              const isMid = item.cost_per_10g_protein > 10.0 && item.cost_per_10g_protein <= 20.0;

              return `
                <div class="space-y-1.5">
                  <div class="flex justify-between items-center text-xs">
                    <div class="flex items-center space-x-2">
                      <span class="font-bold text-[#F4F5EF]">${item.name}</span>
                      <span class="text-[10px] text-[#858A80] font-mono">(${item.serving_size})</span>
                    </div>
                    <span class="font-mono font-bold ${isBest ? 'text-[#D8FF3E]' : (isMid ? 'text-[#F4F5EF]' : 'text-amber-400')}">
                      ₹${item.cost_per_10g_protein}
                    </span>
                  </div>

                  <!-- Relative Bar -->
                  <div class="w-full h-2.5 rounded-full bg-[#111410] border border-[#34382F] overflow-hidden">
                    <div class="h-full rounded-full transition-all duration-500 ${isBest ? 'bg-[#D8FF3E]' : (isMid ? 'bg-[#858A80]' : 'bg-amber-400')}" style="width: ${barWidthPercent}%"></div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>

          <!-- Price Transparency Disclaimer -->
          <div class="bg-[#111410] p-4 rounded-xl border border-[#34382F] flex items-center space-x-3 text-xs">
            <i data-lucide="shield-check" class="w-4 h-4 text-[#D8FF3E] flex-shrink-0"></i>
            <p class="text-[#858A80] text-[11px] leading-relaxed">
              <strong>Price Disclaimer:</strong> Estimates based on aggregated Indian retail FMCG and mandi staples. You can customize prices for your specific local campus canteen or kirana in the Budget Optimizer.
            </p>
          </div>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  } catch (err) {
    container.innerHTML = `<div class="p-8 text-center text-red-400">Failed to load radar: ${err.message}</div>`;
  }
}
