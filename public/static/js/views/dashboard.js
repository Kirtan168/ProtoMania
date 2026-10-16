/**
 * PROTOMANIA Main User Dashboard
 * Daily fitness command center with live progress rings, macro balance,
 * budget tracking, today's meal schedule, workout trigger, and consistency streak.
 */

import { api } from "../api.js";
import { state } from "../state.js";
import { showToast } from "../components/toast.js";

export async function renderDashboardView(container) {
  container.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 animate-fade-in">
      <div class="flex items-center justify-center py-24 text-[#858A80]">
        <div class="flex flex-col items-center space-y-3">
          <i data-lucide="loader" class="w-8 h-8 animate-spin text-[#D8FF3E]"></i>
          <span class="font-mono text-xs uppercase tracking-wider text-[#F4F5EF]">Syncing your daily student metrics...</span>
        </div>
      </div>
    </div>
  `;
  if (window.lucide) window.lucide.createIcons();

  try {
    // 1. Fetch user profile first safely
    let profile = null;
    try {
      profile = await api.getProfile();
    } catch (e) {
      profile = {
        goal: "muscle_building",
        daily_budget_inr: 80,
        hostel_mode: 1
      };
    }

    // 2. Parallel fetch remaining data safely with individual fallbacks
    const [summary, targets, mealsPlan, xpData] = await Promise.all([
      api.getTodaySummary().catch(() => ({
        protein: { consumed_g: 0, target_g: 130, percent: 0 },
        calories: { consumed_kcal: 0, target_kcal: 2400, percent: 0 },
        budget: { spent_inr: 0, limit_inr: profile?.daily_budget_inr || 80, remaining_inr: profile?.daily_budget_inr || 80, percent: 0 },
        logged_meals_count: 0
      })),
      api.getTargets().catch(() => ({
        bmi: 21.1,
        bmi_category: "Normal",
        bmr: 1610,
        tdee: 2495,
        target_calories: 2750,
        target_protein_g: 130,
        target_carbs_g: 360,
        target_fat_g: 65
      })),
      api.getMealPlan(
        profile?.hostel_mode ? "hostel" : "hostel",
        profile?.daily_budget_inr || summary?.budget?.limit_inr || 80,
        profile?.dietary_preference || "vegetarian"
      ).catch(() => ({
        meals: [],
        total_protein_g: 0,
        total_calories: 0,
        total_price_inr: 0
      })),
      api.getXpMissions().catch(() => ({
        streak_days: 1,
        total_xp: 150,
        next_level_xp: 500,
        level: 1,
        level_title: "Level 1: Iron Cadet"
      }))
    ]);

    state.set("todaySummary", summary);
    state.set("targets", targets);
    state.set("xpData", xpData);
    state.set("profile", profile);

    const rawUser = state.get("user") || {};
    const storedCustomName = localStorage.getItem("protomania_custom_name");
    let currentFullName = storedCustomName || rawUser.full_name || "Athlete";
    if (currentFullName.toLowerCase().includes("aryan")) {
      currentFullName = storedCustomName || "Athlete";
    }
    const firstName = currentFullName.split(' ')[0] || "Athlete";
    const goalTitle = (profile?.goal || "muscle_building").replace(/_/g, " ").toUpperCase();
    const budgetLimit = profile?.daily_budget_inr || summary?.budget?.limit_inr || 80;

    // Progress rings circumference calculation
    const proteinCirc = 264;
    const proteinConsumed = summary?.protein?.consumed_g || 0;
    const proteinTarget = summary?.protein?.target_g || targets?.target_protein_g || 130;
    const proteinPct = Math.min(100, Math.round((proteinConsumed / Math.max(1, proteinTarget)) * 100));
    const proteinOffset = proteinCirc - (proteinCirc * proteinPct) / 100;

    const budgetCirc = 264;
    const budgetSpent = summary?.budget?.spent_inr || 0;
    const budgetPct = Math.min(100, Math.round((budgetSpent / Math.max(1, budgetLimit)) * 100));
    const budgetOffset = budgetCirc - (budgetCirc * budgetPct) / 100;
    const budgetRemaining = Math.max(0, budgetLimit - budgetSpent);

    const consumedCalories = summary?.calories?.consumed_kcal || 0;
    const targetCalories = summary?.calories?.target_kcal || targets?.target_calories || 2400;
    const calPct = Math.min(100, Math.round((consumedCalories / Math.max(1, targetCalories)) * 100));

    container.innerHTML = `
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 animate-fade-in">
        <!-- Top Command Bar: Greeting, Goal Era & Quick Actions -->
        <div class="card-proto p-6 sm:p-8 border-[#34382F] bg-gradient-to-r from-[#1B1E19] via-[#20261C] to-[#1B1E19] flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl relative overflow-hidden border-glow-pulse">
          <div class="absolute -right-10 -top-10 w-48 h-48 bg-[#D8FF3E]/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div class="space-y-2 relative z-10">
            <div class="flex items-center space-x-2 text-xs font-mono text-[#D8FF3E]">
              <span class="w-2 h-2 rounded-full bg-[#D8FF3E] animate-pulse"></span>
              <span>DAILY COMMAND CENTER</span>
              <span class="text-[#858A80]">| ${new Date().toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
            </div>
            <div class="flex items-center gap-3">
              <h1 class="text-3xl sm:text-4xl font-extrabold text-[#F4F5EF] tracking-tight">
                Welcome, <span id="dash-greeting-name">${firstName}</span> ⚡
              </h1>
              <button id="edit-dash-name-btn" title="Change your name" class="text-xs px-2.5 py-1 rounded bg-[#111410] border border-[#34382F] hover:border-[#D8FF3E] text-[#858A80] hover:text-[#D8FF3E] transition-colors flex items-center gap-1.5 cursor-pointer">
                <i data-lucide="edit-3" class="w-3.5 h-3.5"></i>
                <span>Edit</span>
              </button>
            </div>
            <!-- Gen Z Holographic Status Pills -->
            <div class="flex flex-wrap items-center gap-2 pt-1">
              <span class="badge-sticker text-[11px] py-1 px-3">
                <i data-lucide="flame" class="w-3.5 h-3.5 text-[#D8FF3E]"></i>
                <span>${xpData?.streak_days || 1}-DAY STREAK</span>
              </span>
              <span class="badge-sticker badge-sticker-violet text-[11px] py-1 px-3">
                <i data-lucide="zap" class="w-3.5 h-3.5 text-[#9C8AFF]"></i>
                <span>${xpData?.level_title || 'Level 1: Iron Cadet'}</span>
              </span>
              <span class="badge-sticker text-[11px] py-1 px-3">
                <i data-lucide="wallet" class="w-3.5 h-3.5 text-[#D8FF3E]"></i>
                <span>₹${budgetLimit}/DAY BUDGET</span>
              </span>
              <span class="badge-sticker text-[11px] py-1 px-3 border-[#858A80]/40 text-[#858A80]">
                <span>${goalTitle}</span>
              </span>
            </div>
          </div>

          <!-- Quick Actions Dock -->
          <div class="flex flex-wrap items-center gap-2.5 relative z-10">
            <a href="#/meals" class="btn-acid text-xs px-4 py-2.5 font-bold flex items-center space-x-1.5 shadow-md hover:scale-105 transition-transform">
              <i data-lucide="plus-circle" class="w-4 h-4"></i>
              <span>Log Meal</span>
            </a>
            <a href="#/workouts" class="btn-ghost text-xs px-4 py-2.5 font-semibold flex items-center space-x-1.5 hover:border-[#D8FF3E] transition-all">
              <i data-lucide="dumbbell" class="w-4 h-4 text-[#D8FF3E]"></i>
              <span>Start Workout</span>
            </a>
            <a href="#/optimizer" class="btn-ghost text-xs px-3.5 py-2.5 font-semibold flex items-center space-x-1.5">
              <i data-lucide="calculator" class="w-4 h-4"></i>
              <span>Cheap Protein</span>
            </a>
            <a href="#/assistant" class="btn-ghost text-xs px-3.5 py-2.5 font-semibold flex items-center space-x-1.5 text-[#9C8AFF] border-[#9C8AFF]/30 hover:border-[#9C8AFF]">
              <i data-lucide="sparkles" class="w-4 h-4"></i>
              <span>Ask AI</span>
            </a>
          </div>
        </div>

        <!-- 3 Core Metric Rings -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
          <!-- Ring 1: Daily Protein Progress -->
          <div class="card-proto p-6 flex items-center justify-between relative overflow-hidden group">
            <div class="space-y-2">
              <span class="text-xs font-mono uppercase tracking-wider text-[#858A80] font-bold">Protein Consumed</span>
              <div class="flex items-baseline space-x-1">
                <span class="text-4xl font-extrabold font-mono text-[#D8FF3E]">${proteinConsumed}</span>
                <span class="text-sm font-bold text-[#858A80]">/ ${proteinTarget}g</span>
              </div>
              <div class="text-[11px] text-[#858A80]">
                ${proteinConsumed >= proteinTarget 
                  ? `<span class="text-[#D8FF3E] font-bold flex items-center space-x-1"><i data-lucide="check" class="w-3 h-3"></i><span>Goal Cleared! Anabolic state secured.</span></span>`
                  : `Need <strong class="text-[#F4F5EF]">${Math.max(0, proteinTarget - proteinConsumed).toFixed(1)}g</strong> more today.`}
              </div>
            </div>

            <!-- SVG Ring -->
            <div class="relative w-24 h-24 flex items-center justify-center flex-shrink-0">
              <svg class="w-24 h-24" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" stroke="#242921" stroke-width="8" fill="none" />
                <circle cx="50" cy="50" r="42" stroke="#D8FF3E" stroke-width="8" stroke-dasharray="264" stroke-dashoffset="${proteinOffset}" stroke-linecap="round" fill="none" class="progress-ring-circle" filter="drop-shadow(0 0 4px rgba(216, 255, 62, 0.5))" />
              </svg>
              <span class="absolute font-mono font-bold text-sm text-[#F4F5EF]">${proteinPct}%</span>
            </div>
          </div>

          <!-- Ring 2: Student Budget Spent & Remaining -->
          <div class="card-proto p-6 flex items-center justify-between relative overflow-hidden group">
            <div class="space-y-2">
              <span class="text-xs font-mono uppercase tracking-wider text-[#858A80] font-bold">Daily Budget (₹)</span>
              <div class="flex items-baseline space-x-1">
                <span class="text-4xl font-extrabold font-mono text-[#F4F5EF]">₹${budgetSpent}</span>
                <span class="text-sm font-bold text-[#858A80]">/ ₹${budgetLimit}</span>
              </div>
              <div class="text-[11px] text-[#858A80]">
                Remaining: <strong class="text-[#D8FF3E] font-mono font-bold">₹${budgetRemaining}</strong> to spend.
              </div>
            </div>

            <!-- SVG Ring -->
            <div class="relative w-24 h-24 flex items-center justify-center flex-shrink-0">
              <svg class="w-24 h-24" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" stroke="#242921" stroke-width="8" fill="none" />
                <circle cx="50" cy="50" r="42" stroke="#F4F5EF" stroke-width="8" stroke-dasharray="264" stroke-dashoffset="${budgetOffset}" stroke-linecap="round" fill="none" class="progress-ring-circle" />
              </svg>
              <span class="absolute font-mono font-bold text-sm text-[#D8FF3E]">${100 - budgetPct}%</span>
            </div>
          </div>

          <!-- Ring 3: Calories & Macro Balance -->
          <div class="card-proto p-6 flex flex-col justify-between space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-xs font-mono uppercase tracking-wider text-[#858A80] font-bold">Daily Calories</span>
              <span class="text-xs font-mono font-bold text-[#D8FF3E]">${summary?.calories?.consumed_kcal || 0} / ${summary?.calories?.target_kcal || targets?.target_calories || 2400} kcal</span>
            </div>

            <!-- Stacked Macro Bar -->
            <div class="space-y-2">
              <div class="w-full h-3 rounded-full bg-[#111410] border border-[#34382F] overflow-hidden flex items-center">
                ${consumedCalories === 0 ? `
                  <div class="w-full text-center text-[9px] font-mono text-[#858A80]">0 kcal logged today (0%)</div>
                ` : `
                  <div class="h-full bg-[#D8FF3E]" style="width: ${Math.round(calPct * 0.35)}%" title="Protein"></div>
                  <div class="h-full bg-[#F4F5EF]" style="width: ${Math.round(calPct * 0.45)}%" title="Carbs"></div>
                  <div class="h-full bg-[#9C8AFF]" style="width: ${Math.max(0, calPct - Math.round(calPct * 0.35) - Math.round(calPct * 0.45))}%" title="Fats"></div>
                `}
              </div>
              <div class="flex justify-between text-[10px] font-mono">
                <span class="flex items-center space-x-1"><span class="w-2 h-2 rounded-full bg-[#D8FF3E]"></span><span>Protein: ${targets?.target_protein_g || 130}g</span></span>
                <span class="flex items-center space-x-1"><span class="w-2 h-2 rounded-full bg-[#F4F5EF]"></span><span>Carbs: ${targets?.target_carbs_g || 360}g</span></span>
                <span class="flex items-center space-x-1"><span class="w-2 h-2 rounded-full bg-[#9C8AFF]"></span><span>Fats: ${targets?.target_fat_g || 65}g</span></span>
              </div>
            </div>

            <div class="text-[10px] text-[#858A80] pt-1">
              BMI: <strong class="text-[#F4F5EF]">${targets?.bmi || 21.1}</strong> (${targets?.bmi_category || 'Normal'}) • BMR: ${targets?.bmr || 1610} kcal
            </div>
          </div>
        </div>

        <!-- Two Column Main Body: Today's Meal Plan & Today's Workout -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <!-- Left Col (7 cols): Today's Meals Timeline -->
          <div class="lg:col-span-7 space-y-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <i data-lucide="utensils" class="w-5 h-5 text-[#D8FF3E]"></i>
                <h3 class="text-xl font-bold text-[#F4F5EF]">Today's Scheduled Meals</h3>
                <span class="text-[11px] font-mono px-2 py-0.5 rounded bg-[#D8FF3E]/10 text-[#D8FF3E] border border-[#D8FF3E]/30 font-bold">₹${budgetLimit}/day plan</span>
              </div>
              <div class="flex items-center space-x-3">
                <button id="reset-today-logs-btn" class="text-xs text-[#858A80] hover:text-[#FF6B6B] border border-[#34382F] hover:border-[#FF6B6B]/40 px-2.5 py-1 rounded transition-colors flex items-center space-x-1 cursor-pointer" title="Reset today's consumed protein to 0g">
                  <i data-lucide="rotate-ccw" class="w-3 h-3"></i>
                  <span>Reset Today (0g)</span>
                </button>
                <a href="#/meals" class="text-xs font-bold text-[#D8FF3E] hover:underline flex items-center space-x-1">
                  <span>View Full Plan</span>
                  <i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>
                </a>
              </div>
            </div>

            <div class="space-y-3">
              ${(mealsPlan?.meals && mealsPlan.meals.length > 0) ? mealsPlan.meals.map((m, idx) => `
                <div class="card-proto p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">
                  <div class="flex items-center space-x-3.5">
                    <img src="${m.image_url}" alt="${m.title}" class="w-16 h-16 rounded-xl object-cover border border-[#34382F] group-hover:border-[#D8FF3E]/50 transition-colors" />
                    <div>
                      <div class="flex items-center space-x-2">
                        <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-[#111410] text-[#858A80] border border-[#34382F]">${m.timing}</span>
                        <span class="text-xs font-bold text-[#D8FF3E]">${m.meal_type}</span>
                      </div>
                      <h4 class="text-sm font-bold text-[#F4F5EF] mt-1">${m.title}</h4>
                      <div class="text-[11px] text-[#858A80] font-mono flex items-center space-x-2 mt-0.5">
                        <span class="text-[#D8FF3E] font-bold">+${m.protein_g}g Protein</span>
                        <span>•</span>
                        <span>${m.calories} kcal</span>
                        <span>•</span>
                        <span class="text-[#F4F5EF] font-bold">₹${m.price_inr}</span>
                      </div>
                    </div>
                  </div>

                  <button class="mark-eaten-btn btn-ghost px-3.5 py-2 text-xs font-bold self-end sm:self-center hover:bg-[#D8FF3E] hover:text-[#111410] transition-colors" data-title="${m.title}" data-protein="${m.protein_g}" data-calories="${m.calories}" data-price="${m.price_inr}">
                    Mark Eaten
                  </button>
                </div>
              `).join('') : `
                <div class="card-proto p-8 text-center text-[#858A80] space-y-3">
                  <i data-lucide="utensils" class="w-8 h-8 text-[#D8FF3E] mx-auto"></i>
                  <p class="text-xs">No meals logged yet today.</p>
                  <a href="#/meals" class="btn-acid inline-block px-4 py-2 text-xs font-bold">Assemble Meal Plan</a>
                </div>
              `}
            </div>
          </div>

          <!-- Right Col (5 cols): Today's Workout & Streak/XP Widget -->
          <div class="lg:col-span-5 space-y-6">
            <!-- Today's Workout Preview Card with Photography -->
            <div class="card-proto overflow-hidden border-[#D8FF3E]/40 group">
              <div class="relative h-44 overflow-hidden bg-[#111410]">
                <img 
                  src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=700&q=80" 
                  alt="Training session" 
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80" 
                />
                <div class="absolute inset-0 bg-gradient-to-t from-[#1B1E19] via-[#1B1E19]/40 to-transparent"></div>
                
                <div class="absolute top-3 left-3 bg-[#111410]/90 border border-[#D8FF3E]/40 px-2.5 py-1 rounded-lg text-[10px] font-mono text-[#D8FF3E] font-bold">
                  TODAY'S TRAINING
                </div>

                <div class="absolute top-3 right-3 bg-[#111410]/90 border border-[#34382F] px-2.5 py-1 rounded-lg text-[10px] font-mono text-[#F4F5EF] font-bold">
                  45 MINS TARGET
                </div>

                <div class="absolute bottom-3 left-3 right-3">
                  <h3 class="text-xl font-black text-[#F4F5EF]">Upper Body Push Focus</h3>
                  <p class="text-xs text-[#858A80]">Bench Press • Incline Dumbbells • Lateral Raises</p>
                </div>
              </div>

              <div class="p-5 space-y-4">
                <div class="bg-[#111410] p-3 rounded-xl border border-[#34382F] space-y-2 text-xs font-mono">
                  <div class="flex justify-between">
                    <span class="text-[#858A80]">Muscle Focus:</span>
                    <span class="text-[#F4F5EF] font-semibold">Chest, Delts, Triceps</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-[#858A80]">Rest Intervals:</span>
                    <span class="text-[#D8FF3E] font-bold">60 - 75 Seconds</span>
                  </div>
                </div>

                <a href="#/workouts" class="btn-acid w-full py-3 text-center text-xs font-bold flex items-center justify-center space-x-2 shadow-lg hover:scale-[1.02] transition-transform">
                  <i data-lucide="play" class="w-4 h-4 fill-current"></i>
                  <span>Start Workout Session</span>
                </a>
              </div>
            </div>

            <!-- Gamification & Streak Status Card -->
            <div class="card-proto p-6 space-y-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <i data-lucide="zap" class="w-5 h-5 text-[#D8FF3E]"></i>
                  <h4 class="font-bold text-sm text-[#F4F5EF]">Iron Consistency</h4>
                </div>
                <span class="text-xs font-mono text-[#D8FF3E] font-bold">${xpData?.streak_days || 1}-Day Streak 🔥</span>
              </div>

              <!-- GitHub-style streak blocks -->
              <div class="space-y-1.5">
                <div class="text-[11px] text-[#858A80]">Weekly Consistency Heatmap:</div>
                <div class="grid grid-cols-7 gap-1.5">
                  ${['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => `
                    <div class="flex flex-col items-center space-y-1">
                      <div class="w-full h-8 rounded-md ${i < (xpData?.streak_days || 1) ? 'bg-[#D8FF3E] text-[#111410] shadow-[0_0_10px_rgba(216,255,62,0.3)]' : 'bg-[#111410] border border-[#34382F] text-[#858A80]'} flex items-center justify-center text-[10px] font-mono font-bold">
                        ${i < (xpData?.streak_days || 1) ? '✓' : ''}
                      </div>
                      <span class="text-[9px] text-[#858A80] font-mono">${day}</span>
                    </div>
                  `).join('')}
                </div>
              </div>

              <div class="pt-2 border-t border-[#34382F] flex justify-between items-center text-xs">
                <span class="text-[#858A80]">Level Progress:</span>
                <span class="font-mono text-[#D8FF3E] font-bold">${xpData?.total_xp || 150} / ${xpData?.next_level_xp || 500} XP</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();

    // Edit Name Button Listener
    document.getElementById("edit-dash-name-btn")?.addEventListener("click", async () => {
      const current = localStorage.getItem("protomania_custom_name") || currentFullName;
      const newName = prompt("Enter your Name / Lifting Alias:", current === "Athlete" ? "" : current);
      if (newName !== null && newName.trim() !== "") {
        const trimmed = newName.trim();
        localStorage.setItem("protomania_custom_name", trimmed);
        const u = state.get("user") || {};
        u.full_name = trimmed;
        state.set("user", u);
        try {
          await api.updateProfile({ full_name: trimmed });
        } catch (e) {
          console.warn("Could not sync profile to backend:", e);
        }
        showToast(`Welcome, ${trimmed}!`, "success");
        renderDashboardView(container);
      }
    });

    // Reset Today Meals Listener
    document.getElementById("reset-today-logs-btn")?.addEventListener("click", async () => {
      if (confirm("Reset today's logged meals to 0g protein and ₹0 budget?")) {
        try {
          await api.resetTodayMeals();
          showToast("Today's meal logs reset to 0g / ₹0!", "success");
          renderDashboardView(container);
        } catch (e) {
          showToast(`Reset failed: ${e.message}`, "error");
        }
      }
    });

    // Mark as eaten listeners
    document.querySelectorAll(".mark-eaten-btn").forEach(btn => {
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
          renderDashboardView(container);
        } catch (e) {
          showToast(`Failed: ${e.message}`, "error");
          btn.disabled = false;
          btn.textContent = "Mark Eaten";
        }
      });
    });

  } catch (err) {
    console.error("Dashboard render error:", err);
    container.innerHTML = `
      <div class="max-w-xl mx-auto py-20 text-center space-y-4">
        <i data-lucide="alert-triangle" class="w-12 h-12 text-[#D8FF3E] mx-auto"></i>
        <h2 class="text-2xl font-bold text-[#F4F5EF]">Failed to Load Dashboard</h2>
        <p class="text-xs text-[#858A80] font-mono bg-[#111410] p-3 rounded-lg border border-[#34382F]">${err.message}</p>
        <button id="retry-btn" class="btn-acid px-6 py-2.5 text-xs font-bold">Retry</button>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
    document.getElementById("retry-btn")?.addEventListener("click", () => renderDashboardView(container));
  }
}
