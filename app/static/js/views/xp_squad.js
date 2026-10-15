/**
 * PROTOMANIA Fitness XP & College Squad View
 * Gamified levels, achievement badges, and privacy-first campus squad boards.
 */

import { api } from "../api.js";
import { state } from "../state.js";
import { showToast } from "../components/toast.js";

export async function renderXpSquadView(container) {
  container.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 animate-fade-in">
      <div class="flex items-center justify-center py-20 text-[#858A80]">
        <i data-lucide="loader" class="w-6 h-6 animate-spin text-[#D8FF3E]"></i>
        <span class="ml-2 font-mono text-xs">Loading campus squad rankings and XP missions...</span>
      </div>
    </div>
  `;
  if (window.lucide) window.lucide.createIcons();

  try {
    const [xpData, squadsData] = await Promise.all([
      api.getXpMissions(),
      api.getSquads()
    ]);

    container.innerHTML = `
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 animate-fade-in">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div class="space-y-2">
            <div class="inline-flex items-center space-x-2 text-xs font-mono text-[#D8FF3E]">
              <span class="w-2 h-2 rounded-full bg-[#D8FF3E] animate-pulse"></span>
              <span>CAMPUS MOTIVATION ENGINE</span>
            </div>
            <h1 class="text-3xl sm:text-4xl font-extrabold text-[#F4F5EF]">Fitness XP & College Squad</h1>
            <p class="text-xs sm:text-sm text-[#858A80] max-w-xl">
              Level up through consistency. Challenge your hostel wing, train together, and unlock badges.
            </p>
          </div>

          <!-- Create Squad Button -->
          <button id="create-squad-btn" class="btn-acid text-xs px-4 py-2.5 font-bold flex items-center space-x-2 shadow-md self-start sm:self-auto">
            <i data-lucide="users" class="w-4 h-4"></i>
            <span>Create Hostel Squad</span>
          </button>
        </div>

        <!-- LEVEL & XP PROGRESSION CARD -->
        <div class="card-proto p-6 sm:p-8 border-[#D8FF3E]/40 bg-gradient-to-r from-[#1B1E19] via-[#20251C] to-[#1B1E19] space-y-6">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div class="space-y-1">
              <span class="text-xs font-mono text-[#D8FF3E] font-bold">CURRENT RANK</span>
              <h2 class="text-2xl sm:text-3xl font-black text-[#F4F5EF]">${xpData.level_title}</h2>
              <p class="text-xs text-[#858A80]">Streak multiplier: <strong class="text-[#D8FF3E]">${xpData.streak_days}-Day Iron Discipline 🔥</strong></p>
            </div>

            <div class="text-right font-mono">
              <span class="text-3xl font-black text-[#D8FF3E]">${xpData.total_xp}</span>
              <span class="text-xs text-[#858A80]"> / ${xpData.next_level_xp} XP</span>
            </div>
          </div>

          <!-- Progress Bar -->
          <div class="space-y-1.5">
            <div class="w-full h-3 rounded-full bg-[#111410] border border-[#34382F] overflow-hidden">
              <div class="h-full bg-[#D8FF3E] rounded-full transition-all duration-700" style="width: ${xpData.level_progress_percent}%"></div>
            </div>
            <div class="flex justify-between text-[10px] text-[#858A80] font-mono">
              <span>Level ${xpData.level}</span>
              <span>Level ${xpData.level + 1} (${100 - xpData.level_progress_percent}% remaining)</span>
            </div>
          </div>
        </div>

        <!-- 2 Columns: Badges & Weekly Missions -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <!-- Left: Badges (6 cols) -->
          <div class="lg:col-span-6 space-y-4">
            <h3 class="text-base font-bold text-[#F4F5EF] flex items-center space-x-2">
              <i data-lucide="award" class="w-4 h-4 text-[#D8FF3E]"></i>
              <span>Earned Badges & Feats</span>
            </h3>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              ${xpData.badges.map(b => `
                <div class="card-proto p-4 flex items-center space-x-3.5 ${b.unlocked ? 'border-[#34382F]' : 'opacity-40 border-dashed border-[#34382F]'}">
                  <div class="w-12 h-12 rounded-xl bg-[#111410] border border-[#34382F] flex items-center justify-center text-xl flex-shrink-0">
                    ${b.icon}
                  </div>
                  <div>
                    <h4 class="font-bold text-xs text-[#F4F5EF]">${b.title}</h4>
                    <p class="text-[11px] text-[#858A80] leading-tight mt-0.5">${b.desc}</p>
                    <span class="text-[9px] font-mono ${b.unlocked ? 'text-[#D8FF3E]' : 'text-[#858A80]'} mt-1 block">
                      ${b.unlocked ? '✓ UNLOCKED' : 'LOCKED'}
                    </span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Right: Weekly Missions (6 cols) -->
          <div class="lg:col-span-6 space-y-4">
            <h3 class="text-base font-bold text-[#F4F5EF] flex items-center space-x-2">
              <i data-lucide="target" class="w-4 h-4 text-[#D8FF3E]"></i>
              <span>Active Weekly Missions</span>
            </h3>

            <div class="space-y-3">
              ${xpData.missions.map(m => `
                <div class="card-proto p-4 space-y-2">
                  <div class="flex items-center justify-between text-xs">
                    <span class="font-bold text-[#F4F5EF]">${m.title}</span>
                    <span class="font-mono text-[#D8FF3E] font-bold">+${m.reward_xp} XP</span>
                  </div>
                  <div class="flex justify-between items-center text-[11px] text-[#858A80] font-mono">
                    <span>Progress: ${m.progress}</span>
                    <span>${m.completed ? '<strong class="text-emerald-400">Completed ✓</strong>' : 'In Progress'}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- SQUAD LEADERBOARD (Privacy-First) -->
        <div class="card-proto p-6 sm:p-8 border-[#34382F] space-y-6">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#34382F] pb-4">
            <div>
              <span class="text-xs font-mono text-[#D8FF3E] font-bold">PRIVACY-FIRST SOCIAL GAINS</span>
              <h3 class="text-lg font-bold text-[#F4F5EF]">Hostel 4 Iron Club Leaderboard</h3>
              <p class="text-[11px] text-[#858A80]">Only workout consistency and XP are shared. Private body weights and biometric data are never visible.</p>
            </div>
            <span class="text-xs font-mono text-[#D8FF3E] bg-[#D8FF3E]/10 px-2.5 py-1 rounded-full border border-[#D8FF3E]/20">
              Squad Code: H4IRON
            </span>
          </div>

          <!-- Squad Challenge Banner -->
          <div class="bg-[#111410] p-4 rounded-xl border border-[#D8FF3E]/30 space-y-2">
            <div class="flex justify-between items-center text-xs">
              <span class="font-bold text-[#F4F5EF] flex items-center space-x-2">
                <i data-lucide="flame" class="w-4 h-4 text-[#D8FF3E]"></i>
                <span>${squadsData.squad_challenge.title}</span>
              </span>
              <span class="font-mono text-[#D8FF3E] font-bold">${squadsData.squad_challenge.progress_percent}%</span>
            </div>
            <div class="w-full h-2 rounded-full bg-[#1B1E19] border border-[#34382F] overflow-hidden">
              <div class="h-full bg-[#D8FF3E] rounded-full" style="width: ${squadsData.squad_challenge.progress_percent}%"></div>
            </div>
            <div class="text-[10px] text-[#858A80] font-mono">Reward: ${squadsData.squad_challenge.reward}</div>
          </div>

          <!-- Leaderboard Table -->
          <div class="space-y-2">
            ${squadsData.active_squad_leaderboard.map(u => `
              <div class="p-3 bg-[#111410] rounded-xl border border-[#34382F] flex items-center justify-between text-xs">
                <div class="flex items-center space-x-3">
                  <span class="w-6 h-6 rounded-full bg-[#1B1E19] border border-[#34382F] text-center font-mono font-bold text-xs flex items-center justify-center ${u.rank === 1 ? 'text-[#D8FF3E] border-[#D8FF3E]' : 'text-[#858A80]'}">
                    ${u.rank}
                  </span>
                  <div>
                    <h4 class="font-bold text-[#F4F5EF]">${u.full_name} <span class="text-[#858A80] font-normal">(@${u.username})</span></h4>
                    <span class="text-[10px] text-[#858A80] font-mono">${u.streak}-Day Streak</span>
                  </div>
                </div>

                <div class="flex items-center space-x-3 font-mono">
                  <span class="text-[10px] px-2 py-0.5 rounded bg-[#D8FF3E]/10 text-[#D8FF3E] font-bold">LVL ${u.level}</span>
                  <span class="font-bold text-[#F4F5EF]">${u.weekly_xp} XP</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
    attachListeners();
  } catch (err) {
    container.innerHTML = `<div class="p-8 text-center text-red-400">Failed to load XP & Squads: ${err.message}</div>`;
  }

  function attachListeners() {
    document.getElementById("create-squad-btn")?.addEventListener("click", () => {
      openCreateSquadModal();
    });
  }

  function openCreateSquadModal() {
    const modalRoot = document.getElementById("modal-root");
    if (!modalRoot) return;

    modalRoot.innerHTML = `
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop">
        <div class="card-proto p-6 max-w-sm w-full space-y-4 border-[#34382F] animate-fade-in">
          <div class="flex items-center justify-between border-b border-[#34382F] pb-3">
            <h3 class="text-sm font-bold text-[#F4F5EF]">Create Campus Squad</h3>
            <button id="close-squad-modal" class="text-[#858A80] hover:text-[#F4F5EF]"><i data-lucide="x" class="w-5 h-5"></i></button>
          </div>

          <div class="space-y-3 text-xs">
            <div>
              <label class="block text-[#858A80] font-bold mb-1">Squad Name:</label>
              <input type="text" id="squad-name-input" placeholder="e.g. Block C Iron Wing" class="w-full bg-[#111410] border border-[#34382F] rounded-lg px-3 py-2 text-[#F4F5EF] focus:border-[#D8FF3E] focus:outline-none" required />
            </div>

            <div>
              <label class="block text-[#858A80] font-bold mb-1">Squad Description / Motto:</label>
              <textarea id="squad-desc-input" rows="2" placeholder="e.g. Daily hostel workout squad. 100g protein minimum." class="w-full bg-[#111410] border border-[#34382F] rounded-lg px-3 py-2 text-[#F4F5EF] focus:border-[#D8FF3E] focus:outline-none"></textarea>
            </div>

            <button id="submit-create-squad" class="btn-acid w-full py-2.5 font-bold text-xs mt-2">
              Launch Squad
            </button>
          </div>
        </div>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
    document.getElementById("close-squad-modal")?.addEventListener("click", () => modalRoot.innerHTML = "");

    document.getElementById("submit-create-squad")?.addEventListener("click", async () => {
      const name = document.getElementById("squad-name-input")?.value?.trim();
      const desc = document.getElementById("squad-desc-input")?.value?.trim() || "Hostel lifting crew";
      if (!name) return;

      try {
        const res = await api.createSquad(name, desc);
        modalRoot.innerHTML = "";
        showToast(`Squad "${name}" created! Invite code: ${res.invite_code}`, "success");
        renderXpSquadView(container);
      } catch (err) {
        showToast(`Error: ${err.message}`, "error");
      }
    });
  }
}
