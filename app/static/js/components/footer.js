/**
 * PROTOMANIA Global Footer Component
 */

import { renderBrandLogo } from "./logo.js";

export function initFooter() {
  const root = document.getElementById("footer-root");
  if (!root) return;

  root.innerHTML = `
    <footer class="bg-[#111410] border-t border-[#34382F] text-[#858A80] pt-12 pb-16 transition-colors">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-[#34382F]">
          <!-- Col 1: Brand & Positioning -->
          <div class="space-y-4 md:col-span-1">
            ${renderBrandLogo(36, "text-xl", true)}
            <p class="text-xs text-[#858A80] leading-relaxed">
              The AI-powered fitness, nutrition, and protein optimizer built specifically for college students and young adults in India.
            </p>
            <div class="flex items-center space-x-2 pt-2">
              <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#D8FF3E]/10 text-[#D8FF3E] border border-[#D8FF3E]/20">
                ⚡ ACID LIME ERA
              </span>
              <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#9C8AFF]/10 text-[#9C8AFF] border border-[#9C8AFF]/20">
                AI ENGINE READY
              </span>
            </div>
          </div>

          <!-- Col 2: Core Platform -->
          <div>
            <h4 class="text-xs font-mono uppercase tracking-widest text-[#F4F5EF] font-bold mb-3">Platform</h4>
            <ul class="space-y-2 text-xs">
              <li><a href="#/dashboard" class="hover:text-[#D8FF3E] transition-colors">Daily Command Center</a></li>
              <li><a href="#/optimizer" class="hover:text-[#D8FF3E] transition-colors">Budget Protein Optimizer</a></li>
              <li><a href="#/meals" class="hover:text-[#D8FF3E] transition-colors">Student Meal Planner</a></li>
              <li><a href="#/workouts" class="hover:text-[#D8FF3E] transition-colors">AI Workout Generator</a></li>
              <li><a href="#/onboarding" class="hover:text-[#D8FF3E] transition-colors">Build Personalized Plan</a></li>
            </ul>
          </div>

          <!-- Col 3: Gen Z Features -->
          <div>
            <h4 class="text-xs font-mono uppercase tracking-widest text-[#F4F5EF] font-bold mb-3">Gen Z & Campus</h4>
            <ul class="space-y-2 text-xs">
              <li><a href="#/wrapped" class="hover:text-[#D8FF3E] transition-colors">Fitness Wrapped 2026</a></li>
              <li><a href="#/radar" class="hover:text-[#D8FF3E] transition-colors">Protein Price Radar (₹/10g)</a></li>
              <li><a href="#/broke-building" class="hover:text-[#D8FF3E] transition-colors">Broke but Building Solver</a></li>
              <li><a href="#/assistant" class="hover:text-[#9C8AFF] transition-colors">AI Fitness Buddy</a></li>
              <li><a href="#/squad" class="hover:text-[#D8FF3E] transition-colors">College Squad Leaderboards</a></li>
            </ul>
          </div>

          <!-- Col 4: Academic & Evaluation -->
          <div class="bg-[#1B1E19] p-4 rounded-xl border border-[#34382F] space-y-3">
            <div class="flex items-center space-x-2 text-[#D8FF3E]">
              <i data-lucide="graduation-cap" class="w-4 h-4"></i>
              <h4 class="text-xs font-mono font-bold tracking-wider text-[#F4F5EF]">University Evaluators</h4>
            </div>
            <p class="text-[11px] text-[#858A80] leading-normal">
              Built for engineering and product management academic defense. Inspect real architecture, schemas, and live API diagnostics.
            </p>
            <a href="#/developers" class="inline-flex items-center space-x-2 text-xs font-bold text-[#111410] bg-[#D8FF3E] hover:bg-[#c4ec2a] px-3 py-1.5 rounded-lg transition-colors w-full justify-center">
              <i data-lucide="code" class="w-3.5 h-3.5"></i>
              <span>Enter Developer Hub</span>
            </a>
          </div>
        </div>

        <!-- Copyright & Academic Tag -->
        <div class="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#858A80]">
          <div>
            © 2026 <strong class="text-[#F4F5EF]">PROTOMANIA</strong>. Your Body. Your Budget. Your Era.
          </div>
          <div class="mt-2 sm:mt-0 font-mono text-[10px]">
            Academic Capstone System • Python 3.14 + FastAPI + SQLite
          </div>
        </div>
      </div>
    </footer>
  `;

  if (window.lucide) window.lucide.createIcons();
}
