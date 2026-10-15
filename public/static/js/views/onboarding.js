/**
 * PROTOMANIA Multi-Step Onboarding Flow
 * 5-Step interactive wizard with signature Student Budget Calculator and instant target generation.
 */

import { api } from "../api.js";
import { state } from "../state.js";
import { showToast } from "../components/toast.js";

export function renderOnboardingView(container) {
  let currentStep = 1;

  // Onboarding Form State
  const formData = {
    // Step 1: Body Profile
    age: 20,
    height_cm: 174,
    weight_kg: 65,
    target_weight_kg: 70,
    waist_cm: 78,
    sex: "male",
    fitness_level: "beginner",

    // Step 2: Fitness Goals
    goal: "muscle_building",
    training_location: "gym",
    equipment: "full_gym",
    days_per_week: 4,
    workout_duration: 45,
    limitations: "none",

    // Step 3: Dietary Preferences
    dietary_preference: "vegetarian",
    allergies: "none",
    dislikes: "",
    cooking_access: "kettle_or_mess",
    hostel_mode: 1,

    // Step 4: Student Budget (Signature Step)
    daily_budget_inr: 80,
    budget_mode: "protein_only",
    supplement_budget: 0,

    // Step 5: Lifestyle
    activity_level: "moderate",
    average_steps: 6500,
    sleep_hours: 7.0,
    college_schedule: "morning_classes",
    preferred_workout_time: "evening"
  };

  function renderWizard() {
    container.innerHTML = `
      <div class="max-w-3xl mx-auto px-4 py-8">
        <!-- Progress Header -->
        <div class="mb-8 space-y-3">
          <div class="flex items-center justify-between text-xs font-mono">
            <span class="text-[#D8FF3E] font-bold">STEP ${currentStep} OF 5</span>
            <span class="text-[#858A80]">${getStepTitle(currentStep)}</span>
          </div>
          <!-- Progress bar -->
          <div class="w-full h-2 rounded-full bg-[#1B1E19] border border-[#34382F] overflow-hidden">
            <div class="h-full bg-[#D8FF3E] transition-all duration-300 rounded-full" style="width: ${(currentStep / 5) * 100}%"></div>
          </div>
        </div>

        <!-- Wizard Card -->
        <div class="card-proto p-6 sm:p-10 border-[#34382F] bg-[#1B1E19]/90">
          <form id="onboarding-form" class="space-y-6">
            ${renderCurrentStepContent(currentStep, formData)}

            <!-- Navigation Buttons -->
            <div class="pt-6 border-t border-[#34382F] flex items-center justify-between">
              ${currentStep > 1 ? `
                <button type="button" id="prev-step-btn" class="btn-ghost px-5 py-2.5 text-xs font-bold flex items-center space-x-1.5">
                  <i data-lucide="arrow-left" class="w-3.5 h-3.5"></i>
                  <span>Previous</span>
                </button>
              ` : `<div></div>`}

              ${currentStep < 5 ? `
                <button type="button" id="next-step-btn" class="btn-acid px-6 py-2.5 text-xs font-bold flex items-center space-x-1.5 shadow-md">
                  <span>Continue</span>
                  <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
                </button>
              ` : `
                <button type="button" id="submit-plan-btn" class="btn-acid px-8 py-3 text-sm font-bold flex items-center space-x-2 shadow-lg">
                  <i data-lucide="zap" class="w-4 h-4 fill-current"></i>
                  <span>Generate My Plan</span>
                </button>
              `}
            </div>
          </form>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
    attachListeners();
  }

  function getStepTitle(step) {
    switch (step) {
      case 1: return "Body Profile";
      case 2: return "Fitness Goals & Training";
      case 3: return "Dietary Preferences";
      case 4: return "Student Budget (Signature)";
      case 5: return "Campus Lifestyle & Habits";
      default: return "";
    }
  }

  function renderCurrentStepContent(step, data) {
    if (step === 1) {
      return `
        <div class="space-y-5">
          <div>
            <h2 class="text-xl font-bold text-[#F4F5EF]">Step 1: Your Body Profile</h2>
            <p class="text-xs text-[#858A80] mt-1">Used to accurately compute your baseline metabolic rate (Mifflin-St Jeor formula).</p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label class="block text-[#858A80] font-bold mb-1.5">Age (Years)</label>
              <input type="number" id="input-age" value="${data.age}" min="15" max="70" class="w-full bg-[#111410] border border-[#34382F] rounded-lg px-3 py-2 text-[#F4F5EF] focus:border-[#D8FF3E] focus:outline-none" required />
            </div>

            <div>
              <label class="block text-[#858A80] font-bold mb-1.5">Height (in Centimetres)</label>
              <input type="number" id="input-height" value="${data.height_cm}" min="120" max="230" class="w-full bg-[#111410] border border-[#34382F] rounded-lg px-3 py-2 text-[#F4F5EF] focus:border-[#D8FF3E] focus:outline-none" required />
            </div>

            <div>
              <label class="block text-[#858A80] font-bold mb-1.5">Current Weight (kg)</label>
              <input type="number" step="0.5" id="input-weight" value="${data.weight_kg}" min="35" max="200" class="w-full bg-[#111410] border border-[#34382F] rounded-lg px-3 py-2 text-[#F4F5EF] focus:border-[#D8FF3E] focus:outline-none" required />
            </div>

            <div>
              <label class="block text-[#858A80] font-bold mb-1.5">Target Weight (Optional kg)</label>
              <input type="number" step="0.5" id="input-target-weight" value="${data.target_weight_kg || ''}" class="w-full bg-[#111410] border border-[#34382F] rounded-lg px-3 py-2 text-[#F4F5EF] focus:border-[#D8FF3E] focus:outline-none" placeholder="e.g. 70" />
            </div>

            <div>
              <label class="block text-[#858A80] font-bold mb-1.5">Biological Input (for Calorie Formula)</label>
              <select id="input-sex" class="w-full bg-[#111410] border border-[#34382F] rounded-lg px-3 py-2 text-[#F4F5EF] focus:border-[#D8FF3E] focus:outline-none">
                <option value="male" ${data.sex === 'male' ? 'selected' : ''}>Male</option>
                <option value="female" ${data.sex === 'female' ? 'selected' : ''}>Female</option>
                <option value="other_skip" ${data.sex === 'other_skip' ? 'selected' : ''}>Prefer not to say (Neutral Avg)</option>
              </select>
            </div>

            <div>
              <label class="block text-[#858A80] font-bold mb-1.5">Fitness Experience Level</label>
              <select id="input-fitness-level" class="w-full bg-[#111410] border border-[#34382F] rounded-lg px-3 py-2 text-[#F4F5EF] focus:border-[#D8FF3E] focus:outline-none">
                <option value="beginner" ${data.fitness_level === 'beginner' ? 'selected' : ''}>Beginner (< 6 months)</option>
                <option value="intermediate" ${data.fitness_level === 'intermediate' ? 'selected' : ''}>Intermediate (6 - 24 months)</option>
                <option value="advanced" ${data.fitness_level === 'advanced' ? 'selected' : ''}>Advanced (2+ years consistent)</option>
              </select>
            </div>
          </div>
        </div>
      `;
    } else if (step === 2) {
      return `
        <div class="space-y-5">
          <div>
            <h2 class="text-xl font-bold text-[#F4F5EF]">Step 2: Fitness Goals & Training Setup</h2>
            <p class="text-xs text-[#858A80] mt-1">We tailor workout splits to what you actually have access to.</p>
          </div>

          <div class="space-y-4 text-xs">
            <div>
              <label class="block text-[#858A80] font-bold mb-1.5">Primary Physique Goal</label>
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                ${['muscle_building', 'fat_loss', 'body_recomp', 'strength', 'endurance', 'maintenance'].map(g => `
                  <button type="button" class="goal-pill p-3 rounded-lg border text-left transition-all ${data.goal === g ? 'border-[#D8FF3E] bg-[#D8FF3E]/10 text-[#D8FF3E] font-bold' : 'border-[#34382F] bg-[#111410] text-[#858A80]'}" data-goal="${g}">
                    ${g.replace('_', ' ').toUpperCase()}
                  </button>
                `).join('')}
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label class="block text-[#858A80] font-bold mb-1.5">Training Location</label>
                <select id="input-location" class="w-full bg-[#111410] border border-[#34382F] rounded-lg px-3 py-2 text-[#F4F5EF] focus:border-[#D8FF3E] focus:outline-none">
                  <option value="gym" ${data.training_location === 'gym' ? 'selected' : ''}>Commercial / College Campus Gym</option>
                  <option value="hostel" ${data.training_location === 'hostel' ? 'selected' : ''}>Hostel Room (Bed/Desk Setup)</option>
                  <option value="home" ${data.training_location === 'home' ? 'selected' : ''}>Home Workout</option>
                  <option value="outdoor" ${data.training_location === 'outdoor' ? 'selected' : ''}>Outdoor / Calisthenics Park</option>
                </select>
              </div>

              <div>
                <label class="block text-[#858A80] font-bold mb-1.5">Available Equipment</label>
                <select id="input-equipment" class="w-full bg-[#111410] border border-[#34382F] rounded-lg px-3 py-2 text-[#F4F5EF] focus:border-[#D8FF3E] focus:outline-none">
                  <option value="full_gym" ${data.equipment === 'full_gym' ? 'selected' : ''}>Full Gym (Barbells, Cables, Dumbbells)</option>
                  <option value="dumbbells" ${data.equipment === 'dumbbells' ? 'selected' : ''}>Dumbbells Only</option>
                  <option value="pullup_bar" ${data.equipment === 'pullup_bar' ? 'selected' : ''}>Pull-Up Bar + Bodyweight</option>
                  <option value="bodyweight" ${data.equipment === 'bodyweight' ? 'selected' : ''}>Zero Equipment (Calisthenics)</option>
                </select>
              </div>

              <div>
                <label class="block text-[#858A80] font-bold mb-1.5">Training Days per Week</label>
                <select id="input-days" class="w-full bg-[#111410] border border-[#34382F] rounded-lg px-3 py-2 text-[#F4F5EF] focus:border-[#D8FF3E] focus:outline-none">
                  <option value="3" ${data.days_per_week === 3 ? 'selected' : ''}>3 Days (Full Body Split)</option>
                  <option value="4" ${data.days_per_week === 4 ? 'selected' : ''}>4 Days (Upper / Lower Split)</option>
                  <option value="5" ${data.days_per_week === 5 ? 'selected' : ''}>5 Days (Push Pull Legs Split)</option>
                  <option value="6" ${data.days_per_week === 6 ? 'selected' : ''}>6 Days (High Frequency PPL)</option>
                </select>
              </div>

              <div>
                <label class="block text-[#858A80] font-bold mb-1.5">Workout Duration Target</label>
                <select id="input-duration" class="w-full bg-[#111410] border border-[#34382F] rounded-lg px-3 py-2 text-[#F4F5EF] focus:border-[#D8FF3E] focus:outline-none">
                  <option value="30" ${data.workout_duration === 30 ? 'selected' : ''}>30 Mins (Time Crunch Mode)</option>
                  <option value="45" ${data.workout_duration === 45 ? 'selected' : ''}>45 Mins (Standard Student Optimal)</option>
                  <option value="60" ${data.workout_duration === 60 ? 'selected' : ''}>60 Mins (Full Session)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      `;
    } else if (step === 3) {
      return `
        <div class="space-y-5">
          <div>
            <h2 class="text-xl font-bold text-[#F4F5EF]">Step 3: Dietary Preferences & Hostel Kitchen</h2>
            <p class="text-xs text-[#858A80] mt-1">We respect all cultural food boundaries and never recommend incompatible foods.</p>
          </div>

          <div class="space-y-4 text-xs">
            <div>
              <label class="block text-[#858A80] font-bold mb-1.5">Dietary Category</label>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                ${['vegetarian', 'eggetarian', 'non_vegetarian', 'vegan'].map(d => `
                  <button type="button" class="diet-pill p-3 rounded-lg border text-center transition-all ${data.dietary_preference === d ? 'border-[#D8FF3E] bg-[#D8FF3E]/10 text-[#D8FF3E] font-bold' : 'border-[#34382F] bg-[#111410] text-[#858A80]'}" data-diet="${d}">
                    ${d.replace('_', ' ').toUpperCase()}
                  </button>
                `).join('')}
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label class="block text-[#858A80] font-bold mb-1.5">Kitchen / Cooking Access</label>
                <select id="input-cooking" class="w-full bg-[#111410] border border-[#34382F] rounded-lg px-3 py-2 text-[#F4F5EF] focus:border-[#D8FF3E] focus:outline-none">
                  <option value="kettle_or_mess" ${data.cooking_access === 'kettle_or_mess' ? 'selected' : ''}>Electric Kettle + College Mess</option>
                  <option value="hostel_mess" ${data.cooking_access === 'hostel_mess' ? 'selected' : ''}>Hostel Mess Only (Zero Kitchen)</option>
                  <option value="no_cook" ${data.cooking_access === 'no_cook' ? 'selected' : ''}>Zero-Cook / Ready to Eat Only</option>
                  <option value="shared_kitchen" ${data.cooking_access === 'shared_kitchen' ? 'selected' : ''}>Shared Flat / PG Kitchen (Gas Stove)</option>
                  <option value="full_kitchen" ${data.cooking_access === 'full_kitchen' ? 'selected' : ''}>Full Home Kitchen with Refrigerator</option>
                </select>
              </div>

              <div>
                <label class="block text-[#858A80] font-bold mb-1.5">Allergies or Intolerances</label>
                <input type="text" id="input-allergies" value="${data.allergies}" class="w-full bg-[#111410] border border-[#34382F] rounded-lg px-3 py-2 text-[#F4F5EF] focus:border-[#D8FF3E] focus:outline-none" placeholder="e.g. lactose, gluten, peanuts, or none" />
              </div>
            </div>

            <div>
              <label class="block text-[#858A80] font-bold mb-1.5">Foods You Dislike (Excluded from recommendations)</label>
              <input type="text" id="input-dislikes" value="${data.dislikes}" class="w-full bg-[#111410] border border-[#34382F] rounded-lg px-3 py-2 text-[#F4F5EF] focus:border-[#D8FF3E] focus:outline-none" placeholder="e.g. mushrooms, brinjal, raw tofu" />
            </div>
          </div>
        </div>
      `;
    } else if (step === 4) {
      return `
        <div class="space-y-6">
          <div>
            <div class="inline-flex items-center space-x-2 text-[10px] font-mono text-[#D8FF3E] font-bold mb-1">
              <span>⚡ SIGNATURE FEATURE</span>
            </div>
            <h2 class="text-xl font-bold text-[#F4F5EF]">Step 4: Student Food Budget (₹)</h2>
            <p class="text-xs text-[#858A80] mt-1">
              PROTOMANIA's golden rule: We never silently exceed your budget. If a target is tight, we prioritize the cheapest protein per gram.
            </p>
          </div>

          <!-- Quick Budget Buttons -->
          <div class="space-y-2">
            <label class="block text-xs text-[#858A80] font-bold">Quick Select Daily Budget (INR ₹)</label>
            <div class="grid grid-cols-3 sm:grid-cols-6 gap-2">
              ${[50, 80, 100, 150, 200].map(b => `
                <button type="button" class="budget-btn py-2.5 rounded-lg border text-xs font-mono font-bold transition-all ${data.daily_budget_inr === b ? 'border-[#D8FF3E] bg-[#D8FF3E] text-[#111410]' : 'border-[#34382F] bg-[#111410] text-[#F4F5EF]'}" data-budget="${b}">
                  ₹${b}
                </button>
              `).join('')}
              <button type="button" id="budget-custom-pill" class="py-2.5 rounded-lg border border-[#34382F] bg-[#111410] text-xs font-mono text-[#858A80] hover:text-[#D8FF3E]">
                Custom
              </button>
            </div>
          </div>

          <!-- Interactive Slider -->
          <div class="bg-[#111410] p-4 rounded-xl border border-[#34382F] space-y-3">
            <div class="flex justify-between items-center">
              <span class="text-xs text-[#858A80] font-bold">Adjust Daily Amount:</span>
              <span class="text-2xl font-mono font-black text-[#D8FF3E]">₹<span id="budget-display">${data.daily_budget_inr}</span> <span class="text-xs text-[#858A80]">/ day</span></span>
            </div>
            <input type="range" id="input-budget-slider" min="30" max="300" step="5" value="${data.daily_budget_inr}" class="w-full accent-[#D8FF3E] cursor-pointer" />
            <div class="flex justify-between text-[10px] text-[#858A80] font-mono">
              <span>₹30 (Ultra Budget)</span>
              <span>₹80 (Balanced Student)</span>
              <span>₹150+ (High Protein)</span>
            </div>
          </div>

          <!-- Budget Mode Clarification -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
            <div>
              <label class="block text-[#858A80] font-bold mb-1.5">What does this budget cover?</label>
              <select id="input-budget-mode" class="w-full bg-[#111410] border border-[#34382F] rounded-lg px-3 py-2 text-[#F4F5EF] focus:border-[#D8FF3E] focus:outline-none">
                <option value="protein_only" ${data.budget_mode === 'protein_only' ? 'selected' : ''}>Additional Protein Only (Mess meals already free/paid)</option>
                <option value="total_food" ${data.budget_mode === 'total_food' ? 'selected' : ''}>Entire Total Food Budget</option>
              </select>
            </div>

            <div>
              <label class="block text-[#858A80] font-bold mb-1.5">Supplement Budget (Whey/Creatine in ₹/day)</label>
              <input type="number" id="input-supplement-budget" value="${data.supplement_budget}" min="0" max="300" class="w-full bg-[#111410] border border-[#34382F] rounded-lg px-3 py-2 text-[#F4F5EF] focus:border-[#D8FF3E] focus:outline-none" placeholder="₹0 if pure whole food" />
            </div>
          </div>
        </div>
      `;
    } else if (step === 5) {
      return `
        <div class="space-y-5">
          <div>
            <h2 class="text-xl font-bold text-[#F4F5EF]">Step 5: Campus Schedule & Lifestyle</h2>
            <p class="text-xs text-[#858A80] mt-1">Final touch to align nutrition timing with your real college timetable.</p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label class="block text-[#858A80] font-bold mb-1.5">Daily Physical Activity</label>
              <select id="input-activity" class="w-full bg-[#111410] border border-[#34382F] rounded-lg px-3 py-2 text-[#F4F5EF] focus:border-[#D8FF3E] focus:outline-none">
                <option value="sedentary" ${data.activity_level === 'sedentary' ? 'selected' : ''}>Sedentary (Mostly studying / desk)</option>
                <option value="light" ${data.activity_level === 'light' ? 'selected' : ''}>Light (Walking to classes, 4-6k steps)</option>
                <option value="moderate" ${data.activity_level === 'moderate' ? 'selected' : ''}>Moderate (Active campus life, 7-10k steps)</option>
                <option value="very_active" ${data.activity_level === 'very_active' ? 'selected' : ''}>Very Active (Sports / gym daily, 12k+ steps)</option>
              </select>
            </div>

            <div>
              <label class="block text-[#858A80] font-bold mb-1.5">Typical Sleep Duration</label>
              <select id="input-sleep" class="w-full bg-[#111410] border border-[#34382F] rounded-lg px-3 py-2 text-[#F4F5EF] focus:border-[#D8FF3E] focus:outline-none">
                <option value="6.0" ${data.sleep_hours === 6.0 ? 'selected' : ''}>6 Hours or less (Exam cramming)</option>
                <option value="7.0" ${data.sleep_hours === 7.0 ? 'selected' : ''}>7 - 8 Hours (Standard)</option>
                <option value="8.5" ${data.sleep_hours === 8.5 ? 'selected' : ''}>8+ Hours (Optimal Recovery)</option>
              </select>
            </div>

            <div>
              <label class="block text-[#858A80] font-bold mb-1.5">College Schedule</label>
              <select id="input-schedule" class="w-full bg-[#111410] border border-[#34382F] rounded-lg px-3 py-2 text-[#F4F5EF] focus:border-[#D8FF3E] focus:outline-none">
                <option value="morning_classes" ${data.college_schedule === 'morning_classes' ? 'selected' : ''}>Morning Classes (8 AM - 1 PM)</option>
                <option value="full_day_labs" ${data.college_schedule === 'full_day_labs' ? 'selected' : ''}>Full Day Labs & Lectures (9 AM - 5 PM)</option>
                <option value="night_owl" ${data.college_schedule === 'night_owl' ? 'selected' : ''}>Flexible / Night Study Schedule</option>
              </select>
            </div>

            <div>
              <label class="block text-[#858A80] font-bold mb-1.5">Preferred Workout Time</label>
              <select id="input-workout-time" class="w-full bg-[#111410] border border-[#34382F] rounded-lg px-3 py-2 text-[#F4F5EF] focus:border-[#D8FF3E] focus:outline-none">
                <option value="morning" ${data.preferred_workout_time === 'morning' ? 'selected' : ''}>Early Morning (6 AM - 8 AM)</option>
                <option value="evening" ${data.preferred_workout_time === 'evening' ? 'selected' : ''}>Evening Post-College (5 PM - 8 PM)</option>
                <option value="late_night" ${data.preferred_workout_time === 'late_night' ? 'selected' : ''}>Late Night (9 PM - 11 PM)</option>
              </select>
            </div>
          </div>

          <!-- Profile Preview Box -->
          <div class="bg-[#111410] p-4 rounded-xl border border-[#34382F] space-y-2 mt-4 text-xs">
            <div class="font-bold text-[#D8FF3E] flex items-center space-x-1.5">
              <i data-lucide="check" class="w-4 h-4"></i>
              <span>Summary Readiness</span>
            </div>
            <p class="text-[#858A80] leading-relaxed">
              Targeting <strong class="text-[#F4F5EF]">${data.goal.replace('_', ' ')}</strong> on a 
              <strong class="text-[#D8FF3E]">₹${data.daily_budget_inr}/day</strong> budget with 
              <strong class="text-[#F4F5EF]">${data.dietary_preference}</strong> dietary rules.
              Clicking below will execute the Mifflin-St Jeor metabolic engine and initialize your custom meal and workout plans.
            </p>
          </div>
        </div>
      `;
    }
  }

  function collectStepData() {
    if (currentStep === 1) {
      formData.age = parseInt(document.getElementById("input-age")?.value || formData.age);
      formData.height_cm = parseFloat(document.getElementById("input-height")?.value || formData.height_cm);
      formData.weight_kg = parseFloat(document.getElementById("input-weight")?.value || formData.weight_kg);
      formData.target_weight_kg = parseFloat(document.getElementById("input-target-weight")?.value) || null;
      formData.sex = document.getElementById("input-sex")?.value || formData.sex;
      formData.fitness_level = document.getElementById("input-fitness-level")?.value || formData.fitness_level;
    } else if (currentStep === 2) {
      formData.training_location = document.getElementById("input-location")?.value || formData.training_location;
      formData.equipment = document.getElementById("input-equipment")?.value || formData.equipment;
      formData.days_per_week = parseInt(document.getElementById("input-days")?.value || formData.days_per_week);
      formData.workout_duration = parseInt(document.getElementById("input-duration")?.value || formData.workout_duration);
    } else if (currentStep === 3) {
      formData.cooking_access = document.getElementById("input-cooking")?.value || formData.cooking_access;
      formData.allergies = document.getElementById("input-allergies")?.value || formData.allergies;
      formData.dislikes = document.getElementById("input-dislikes")?.value || formData.dislikes;
    } else if (currentStep === 4) {
      formData.daily_budget_inr = parseFloat(document.getElementById("input-budget-slider")?.value || formData.daily_budget_inr);
      formData.budget_mode = document.getElementById("input-budget-mode")?.value || formData.budget_mode;
      formData.supplement_budget = parseFloat(document.getElementById("input-supplement-budget")?.value || 0);
    } else if (currentStep === 5) {
      formData.activity_level = document.getElementById("input-activity")?.value || formData.activity_level;
      formData.sleep_hours = parseFloat(document.getElementById("input-sleep")?.value || formData.sleep_hours);
      formData.college_schedule = document.getElementById("input-schedule")?.value || formData.college_schedule;
      formData.preferred_workout_time = document.getElementById("input-workout-time")?.value || formData.preferred_workout_time;
    }
  }

  function attachListeners() {
    // Goal Pills
    document.querySelectorAll(".goal-pill").forEach(btn => {
      btn.addEventListener("click", () => {
        formData.goal = btn.getAttribute("data-goal");
        renderWizard();
      });
    });

    // Diet Pills
    document.querySelectorAll(".diet-pill").forEach(btn => {
      btn.addEventListener("click", () => {
        formData.dietary_preference = btn.getAttribute("data-diet");
        renderWizard();
      });
    });

    // Budget Quick Buttons
    document.querySelectorAll(".budget-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        formData.daily_budget_inr = parseFloat(btn.getAttribute("data-budget"));
        renderWizard();
      });
    });

    // Slider
    const slider = document.getElementById("input-budget-slider");
    const display = document.getElementById("budget-display");
    if (slider && display) {
      slider.addEventListener("input", (e) => {
        display.textContent = e.target.value;
        formData.daily_budget_inr = parseFloat(e.target.value);
      });
    }

    // Step Nav
    const nextBtn = document.getElementById("next-step-btn");
    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        collectStepData();
        if (currentStep < 5) {
          currentStep++;
          renderWizard();
        }
      });
    }

    const prevBtn = document.getElementById("prev-step-btn");
    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        collectStepData();
        if (currentStep > 1) {
          currentStep--;
          renderWizard();
        }
      });
    }

    // Final Submit
    const submitBtn = document.getElementById("submit-plan-btn");
    if (submitBtn) {
      submitBtn.addEventListener("click", async () => {
        collectStepData();
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span>Calculating Anabolic Targets...</span>`;

        try {
          const targets = await api.saveProfile(formData);
          state.set("profile", formData);
          state.set("targets", targets);
          showToast("Personalized Plan Generated! +150 XP", "success");
          window.location.hash = "#/dashboard";
        } catch (err) {
          showToast(`Error saving plan: ${err.message}`, "error");
          submitBtn.disabled = false;
          submitBtn.innerHTML = `<span>Try Again</span>`;
        }
      });
    }
  }

  renderWizard();
}
