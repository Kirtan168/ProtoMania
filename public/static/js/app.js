/**
 * PROTOMANIA Application Controller & Client Router
 */

import { initNavbar } from "./components/navbar.js";
import { initFooter } from "./components/footer.js";
import { initCinematicIntro } from "./components/intro.js?v=2.4";
import { state } from "./state.js";
import { api } from "./api.js";

// Views
import { renderHomeView } from "./views/home.js";
import { renderOnboardingView } from "./views/onboarding.js";
import { renderDashboardView } from "./views/dashboard.js";
import { renderOptimizerView } from "./views/optimizer.js";
import { renderMealsView } from "./views/meals.js";
import { renderWorkoutsView } from "./views/workouts.js";
import { renderWrappedView } from "./views/wrapped.js";
import { renderBrokeBuildingView } from "./views/broke_building.js";
import { renderAssistantView } from "./views/assistant.js";
import { renderRadarView } from "./views/radar.js";
import { renderXpSquadView } from "./views/xp_squad.js";
import { renderDeveloperHubView } from "./views/developer_hub.js";

const routes = {
  "/": renderHomeView,
  "/onboarding": renderOnboardingView,
  "/dashboard": renderDashboardView,
  "/optimizer": renderOptimizerView,
  "/meals": renderMealsView,
  "/workouts": renderWorkoutsView,
  "/wrapped": renderWrappedView,
  "/broke-building": renderBrokeBuildingView,
  "/assistant": renderAssistantView,
  "/radar": renderRadarView,
  "/squad": renderXpSquadView,
  "/developers": renderDeveloperHubView
};

function router() {
  const container = document.getElementById("app");
  if (!container) return;

  // Handle direct paths like /developers
  if (window.location.pathname === "/developers" && !window.location.hash) {
    window.location.hash = "#/developers";
  }

  const hash = window.location.hash.slice(1) || "/";
  const path = hash.split("?")[0];

  const viewFn = routes[path] || renderHomeView;
  const viewKey = path === "/" ? "home" : path.replace("/", "");
  state.set("currentView", viewKey);

  window.scrollTo(0, 0);
  viewFn(container);

  if (window.lucide) window.lucide.createIcons();
}

async function initApp() {
  // Theme check
  const savedTheme = state.get("theme");
  document.documentElement.classList.toggle("dark", savedTheme === "dark");
  document.documentElement.setAttribute("data-theme", savedTheme);

  // Check if opening cinematic intro will play
  const hasSeen = sessionStorage.getItem('protomania_intro_played') === 'true';
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const willPlayIntro = !hasSeen && !prefersReduced;

  window.replayIntro = () => initCinematicIntro(true);

  if (willPlayIntro) {
    // 1. Immediately launch cinematic intro with 0ms delay
    initCinematicIntro();

    // 2. Initialize lightweight UI shell
    initNavbar();
    initFooter();

    // 3. Defer heavy background routing & knapsack calculations until dumbbell has landed
    // This frees 100% of the main thread during the gravitational drop (250ms - 770ms)
    setTimeout(() => {
      window.addEventListener("hashchange", router);
      router();

      // Background authentication without blocking the UI
      api.getMe().then(user => state.set("user", user)).catch(() => {
        api.guestLogin().then(demoRes => {
          api.setToken(demoRes.access_token);
          state.set("user", demoRes.user);
        }).catch(() => {});
      });
    }, 1000);
  } else {
    // Direct boot (intro already viewed or reduced-motion enabled)
    initNavbar();
    initFooter();

    window.addEventListener("hashchange", router);
    router();

    try {
      const user = await api.getMe();
      state.set("user", user);
    } catch (e) {
      try {
        const demoRes = await api.guestLogin();
        api.setToken(demoRes.access_token);
        state.set("user", demoRes.user);
      } catch (guestErr) {}
    }
  }
}

document.addEventListener("DOMContentLoaded", initApp);
