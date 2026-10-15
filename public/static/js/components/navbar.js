/**
 * PROTOMANIA Navigation Bar
 * Sticky desktop header with Concept A Proto Mark, navigation links,
 * quick login/user avatar, theme toggle, and mobile bottom bar.
 */

import { renderBrandLogo } from "./logo.js";
import { state } from "../state.js";
import { api } from "../api.js";
import { showToast } from "./toast.js";

export function initNavbar() {
  const root = document.getElementById("navbar-root");
  const mobileRoot = document.getElementById("mobile-nav-root");
  if (!root) return;

  function render() {
    const user = state.get("user");
    const currentView = state.get("currentView");
    const theme = state.get("theme");

    root.innerHTML = `
      <header class="fixed top-0 left-0 right-0 z-40 bg-[#111410]/90 backdrop-blur-md border-b border-[#34382F] transition-colors">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <!-- Logo -->
          <div class="flex items-center space-x-6">
            ${renderBrandLogo(36, "text-xl", false)}
          </div>

          <!-- Desktop Navigation -->
          <nav class="hidden lg:flex items-center space-x-1 font-medium text-xs font-mono">
            <a href="#/" class="px-3 py-1.5 rounded-lg transition-all ${currentView === 'home' ? 'text-[#D8FF3E] bg-[#D8FF3E]/10 border border-[#D8FF3E]/30 font-bold shadow-[0_0_12px_rgba(216,255,62,0.15)]' : 'text-[#858A80] hover:text-[#F4F5EF] border border-transparent'}">Home</a>
            <a href="#/dashboard" class="px-3 py-1.5 rounded-lg transition-all ${currentView === 'dashboard' ? 'text-[#D8FF3E] bg-[#D8FF3E]/10 border border-[#D8FF3E]/30 font-bold shadow-[0_0_12px_rgba(216,255,62,0.15)]' : 'text-[#858A80] hover:text-[#F4F5EF] border border-transparent'}">Dashboard</a>
            <a href="#/optimizer" class="px-3 py-1.5 rounded-lg transition-all ${currentView === 'optimizer' ? 'text-[#D8FF3E] bg-[#D8FF3E]/10 border border-[#D8FF3E]/30 font-bold shadow-[0_0_12px_rgba(216,255,62,0.15)]' : 'text-[#858A80] hover:text-[#F4F5EF] border border-transparent'}">Optimizer</a>
            <a href="#/meals" class="px-3 py-1.5 rounded-lg transition-all ${currentView === 'meals' ? 'text-[#D8FF3E] bg-[#D8FF3E]/10 border border-[#D8FF3E]/30 font-bold shadow-[0_0_12px_rgba(216,255,62,0.15)]' : 'text-[#858A80] hover:text-[#F4F5EF] border border-transparent'}">Meal Plans</a>
            <a href="#/workouts" class="px-3 py-1.5 rounded-lg transition-all ${currentView === 'workouts' ? 'text-[#D8FF3E] bg-[#D8FF3E]/10 border border-[#D8FF3E]/30 font-bold shadow-[0_0_12px_rgba(216,255,62,0.15)]' : 'text-[#858A80] hover:text-[#F4F5EF] border border-transparent'}">Workouts</a>
            <a href="#/wrapped" class="px-3 py-1.5 rounded-lg transition-all ${currentView === 'wrapped' ? 'text-[#D8FF3E] bg-[#D8FF3E]/10 border border-[#D8FF3E]/30 font-bold shadow-[0_0_12px_rgba(216,255,62,0.15)]' : 'text-[#858A80] hover:text-[#F4F5EF] border border-transparent'}">Wrapped</a>
            <a href="#/radar" class="px-3 py-1.5 rounded-lg transition-all ${currentView === 'radar' ? 'text-[#D8FF3E] bg-[#D8FF3E]/10 border border-[#D8FF3E]/30 font-bold shadow-[0_0_12px_rgba(216,255,62,0.15)]' : 'text-[#858A80] hover:text-[#F4F5EF] border border-transparent'}">Price Radar</a>
            <a href="#/assistant" class="px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1 ${currentView === 'assistant' ? 'text-[#9C8AFF] bg-[#9C8AFF]/10 border border-[#9C8AFF]/30 font-bold shadow-[0_0_12px_rgba(156,138,255,0.15)]' : 'text-[#858A80] hover:text-[#9C8AFF] border border-transparent'}">
              <i data-lucide="sparkles" class="w-3.5 h-3.5 text-[#9C8AFF]"></i>
              <span>AI Buddy</span>
            </a>
            <a href="#/squad" class="px-3 py-1.5 rounded-lg transition-all ${currentView === 'squad' ? 'text-[#D8FF3E] bg-[#D8FF3E]/10 border border-[#D8FF3E]/30 font-bold shadow-[0_0_12px_rgba(216,255,62,0.15)]' : 'text-[#858A80] hover:text-[#F4F5EF] border border-transparent'}">Squads</a>
            <a href="#/developers" class="px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1 ${currentView === 'developers' ? 'text-[#D8FF3E] bg-[#D8FF3E]/10 border border-[#D8FF3E]/30 font-bold shadow-[0_0_12px_rgba(216,255,62,0.15)]' : 'text-[#858A80] hover:text-[#F4F5EF] border border-transparent'}">
              <i data-lucide="code" class="w-3.5 h-3.5 text-[#D8FF3E]"></i>
              <span>Dev Hub</span>
            </a>
          </nav>

          <!-- Right Actions -->
          <div class="flex items-center space-x-3">
            <!-- Theme Toggle -->
            <button id="theme-toggle-btn" class="p-2 rounded-lg text-[#858A80] hover:text-[#F4F5EF] hover:bg-[#1B1E19] border border-[#34382F] transition-colors" title="Toggle Theme">
              <i data-lucide="${theme === 'dark' ? 'sun' : 'moon'}" class="w-4 h-4"></i>
            </button>

            <!-- User Auth / Demo Login -->
            ${user ? `
              <div class="flex items-center space-x-2.5 bg-[#1B1E19] border border-[#34382F] py-1 px-2.5 rounded-full">
                <img src="${user.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}" class="w-6 h-6 rounded-full object-cover border border-[#D8FF3E]" alt="${user.username}" />
                <span class="text-xs font-bold text-[#F4F5EF] hidden sm:inline">${user.username}</span>
                <span class="text-[10px] bg-[#D8FF3E]/20 text-[#D8FF3E] px-1.5 py-0.5 rounded font-mono font-bold">LVL ${state.get("xpData")?.level || 2}</span>
              </div>
            ` : `
              <button id="guest-login-btn" class="text-xs font-bold px-3 py-2 rounded-lg bg-[#1B1E19] text-[#F4F5EF] border border-[#34382F] hover:border-[#D8FF3E] transition-all">
                ⚡ Demo Student
              </button>
            `}

            <!-- Prominent Primary CTA -->
            <a href="#/onboarding" class="btn-acid text-xs sm:text-sm px-4 py-2 flex items-center space-x-1.5 shadow-sm">
              <i data-lucide="zap" class="w-4 h-4 fill-current"></i>
              <span>Build My Plan</span>
            </a>
          </div>
        </div>
      </header>
    `;

    // Mobile Bottom Bar
    if (mobileRoot) {
      mobileRoot.innerHTML = `
        <div class="grid grid-cols-5 py-2 text-center text-[10px] font-medium text-[#858A80]">
          <a href="#/" class="flex flex-col items-center justify-center space-y-1 ${currentView === 'home' ? 'text-[#D8FF3E]' : ''}">
            <i data-lucide="home" class="w-5 h-5"></i>
            <span>Home</span>
          </a>
          <a href="#/dashboard" class="flex flex-col items-center justify-center space-y-1 ${currentView === 'dashboard' ? 'text-[#D8FF3E]' : ''}">
            <i data-lucide="layout-dashboard" class="w-5 h-5"></i>
            <span>Daily</span>
          </a>
          <a href="#/optimizer" class="flex flex-col items-center justify-center space-y-1 ${currentView === 'optimizer' ? 'text-[#D8FF3E]' : ''}">
            <i data-lucide="calculator" class="w-5 h-5 text-[#D8FF3E]"></i>
            <span class="text-[#D8FF3E] font-bold">Optimizer</span>
          </a>
          <a href="#/assistant" class="flex flex-col items-center justify-center space-y-1 ${currentView === 'assistant' ? 'text-[#9C8AFF]' : ''}">
            <i data-lucide="sparkles" class="w-5 h-5 text-[#9C8AFF]"></i>
            <span>AI Buddy</span>
          </a>
          <a href="#/developers" class="flex flex-col items-center justify-center space-y-1 ${currentView === 'developers' ? 'text-[#D8FF3E]' : ''}">
            <i data-lucide="code" class="w-5 h-5"></i>
            <span>Dev Hub</span>
          </a>
        </div>
      `;
    }

    if (window.lucide) window.lucide.createIcons();

    // Attach Handlers
    const themeBtn = document.getElementById("theme-toggle-btn");
    if (themeBtn) {
      themeBtn.addEventListener("click", () => state.toggleTheme());
    }

    const guestBtn = document.getElementById("guest-login-btn");
    if (guestBtn) {
      guestBtn.addEventListener("click", async () => {
        try {
          const res = await api.guestLogin();
          api.setToken(res.access_token);
          state.set("user", res.user);
          showToast(`Logged in as ${res.user.full_name}!`, "success");
          window.location.hash = "#/dashboard";
        } catch (e) {
          showToast("Demo login failed", "error");
        }
      });
    }
  }

  state.subscribe(() => render());
  render();
}
