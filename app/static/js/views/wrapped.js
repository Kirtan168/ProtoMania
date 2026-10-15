/**
 * PROTOMANIA Fitness Wrapped View
 * Spotify-style shareable monthly recap card showcasing workouts, protein eaten,
 * money saved, and the user's official Fitness Era title.
 */

import { api } from "../api.js";
import { renderProtoMark, renderProtoWordmark } from "../components/logo.js";
import { showToast } from "../components/toast.js";

export async function renderWrappedView(container) {
  container.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 animate-fade-in">
      <div class="flex items-center justify-center py-20 text-[#858A80]">
        <i data-lucide="loader" class="w-6 h-6 animate-spin text-[#D8FF3E]"></i>
        <span class="ml-2 font-mono text-xs">Curating your Fitness Wrapped Era...</span>
      </div>
    </div>
  `;
  if (window.lucide) window.lucide.createIcons();

  try {
    const wrapped = await api.getWrapped();

    container.innerHTML = `
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        <!-- Header -->
        <div class="text-center space-y-2">
          <div class="inline-flex items-center space-x-2 text-xs font-mono text-[#D8FF3E]">
            <span class="w-2 h-2 rounded-full bg-[#D8FF3E] animate-pulse"></span>
            <span>GEN Z FITNESS WRAPPED</span>
          </div>
          <h1 class="text-3xl sm:text-5xl font-black text-[#F4F5EF] tracking-tight">Your Campus Fitness Wrapped</h1>
          <p class="text-xs sm:text-sm text-[#858A80]">
            A shareable monthly recap of your real student gains, discipline, and budget optimization.
          </p>
        </div>

        <!-- SHAREABLE WRAPPED CARD (Spotify-style aesthetic) -->
        <div id="wrapped-card" class="wrapped-gradient p-8 sm:p-12 rounded-3xl relative overflow-hidden space-y-8 max-w-xl mx-auto shadow-2xl">
          <!-- Top Header inside card -->
          <div class="flex items-center justify-between border-b border-[#34382F] pb-4">
            <div class="flex items-center space-x-3">
              ${renderProtoMark(32)}
              ${renderProtoWordmark("text-base")}
            </div>
            <span class="text-[10px] font-mono text-[#D8FF3E] border border-[#D8FF3E]/30 bg-[#D8FF3E]/10 px-2 py-0.5 rounded font-bold">
              ${wrapped.period}
            </span>
          </div>

          <!-- Official Era Title -->
          <div class="space-y-2 text-center py-4">
            <span class="text-xs font-mono uppercase tracking-widest text-[#858A80]">Your Official 2026 Title:</span>
            <h2 class="text-3xl sm:text-4xl font-black text-[#D8FF3E] tracking-tight">
              ${wrapped.era_title}
            </h2>
            <p class="text-xs text-[#F4F5EF] italic max-w-sm mx-auto">"${wrapped.highlight_quote}"</p>
          </div>

          <!-- 4 Core Highlight Metrics -->
          <div class="grid grid-cols-2 gap-4 text-xs font-mono">
            <div class="bg-[#111410]/80 p-4 rounded-2xl border border-[#34382F] space-y-1">
              <span class="text-[10px] text-[#858A80] uppercase">Workouts Smashed</span>
              <div class="text-2xl font-black text-[#F4F5EF]">${wrapped.stats.workouts_completed}</div>
              <div class="text-[10px] text-[#D8FF3E]">${wrapped.stats.minutes_trained} mins in the gym</div>
            </div>

            <div class="bg-[#111410]/80 p-4 rounded-2xl border border-[#34382F] space-y-1">
              <span class="text-[10px] text-[#858A80] uppercase">Protein Ingested</span>
              <div class="text-2xl font-black text-[#D8FF3E]">${wrapped.stats.protein_consumed_g}g</div>
              <div class="text-[10px] text-[#858A80]">Clean student aminos</div>
            </div>

            <div class="bg-[#111410]/80 p-4 rounded-2xl border border-[#34382F] space-y-1">
              <span class="text-[10px] text-[#858A80] uppercase">Food Budget Spent</span>
              <div class="text-2xl font-black text-[#F4F5EF]">₹${wrapped.stats.money_spent_inr}</div>
              <div class="text-[10px] text-emerald-400">Saved ~₹${wrapped.stats.estimated_money_saved_inr} vs whey</div>
            </div>

            <div class="bg-[#111410]/80 p-4 rounded-2xl border border-[#34382F] space-y-1">
              <span class="text-[10px] text-[#858A80] uppercase">Iron Consistency</span>
              <div class="text-2xl font-black text-[#D8FF3E]">${wrapped.stats.consistency_streak_days} Days</div>
              <div class="text-[10px] text-[#858A80]">Zero skipped sessions</div>
            </div>
          </div>

          <!-- MVP Protein Staple -->
          <div class="bg-[#111410]/90 p-4 rounded-2xl border border-[#D8FF3E]/40 flex items-center space-x-4">
            <div class="w-12 h-12 rounded-xl bg-[#D8FF3E]/10 text-[#D8FF3E] flex items-center justify-center font-bold text-xl flex-shrink-0">
              🏆
            </div>
            <div>
              <div class="flex items-center space-x-2">
                <span class="text-xs font-bold text-[#F4F5EF]">${wrapped.mvp_protein_source.name}</span>
                <span class="text-[9px] font-mono text-[#D8FF3E] bg-[#D8FF3E]/10 px-1.5 py-0.5 rounded">${wrapped.mvp_protein_source.badge}</span>
              </div>
              <p class="text-[11px] text-[#858A80] mt-0.5">${wrapped.mvp_protein_source.achievement}</p>
            </div>
          </div>

          <!-- Card Footer -->
          <div class="pt-4 border-t border-[#34382F] flex items-center justify-between text-[10px] font-mono text-[#858A80]">
            <span>@${wrapped.user} • Level ${wrapped.stats.current_level}</span>
            <span class="text-[#D8FF3E] font-bold">PROTOMANIA.APP</span>
          </div>
        </div>

        <!-- Share Actions -->
        <div class="flex items-center justify-center space-x-3 pt-2">
          <button id="copy-share-btn" class="btn-acid px-6 py-2.5 text-xs font-bold flex items-center space-x-2 shadow-lg">
            <i data-lucide="share-2" class="w-4 h-4"></i>
            <span>Share My Fitness Wrapped</span>
          </button>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();

    document.getElementById("copy-share-btn")?.addEventListener("click", () => {
      navigator.clipboard.writeText(`I hit ${wrapped.stats.protein_consumed_g}g of protein on a student budget and earned "${wrapped.era_title}" on PROTOMANIA! ⚡ Check out protomania.app`);
      showToast("Wrapped link copied to clipboard! Share on Instagram / WhatsApp!", "success");
    });

  } catch (err) {
    container.innerHTML = `<div class="p-8 text-center text-red-400">Failed to generate Wrapped: ${err.message}</div>`;
  }
}
