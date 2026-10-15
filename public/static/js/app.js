/**
 * PROTOMANIA Application Controller & Client Router
 */

import { initNavbar } from "./components/navbar.js";
import { initFooter } from "./components/footer.js";
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

  // Initialize UI Shell
  initNavbar();
  initFooter();

  // Try authenticating existing session or fallback to demo student profile
  try {
    const user = await api.getMe();
    state.set("user", user);
  } catch (e) {
    // Attempt auto-login as demo student for university review convenience
    try {
      const demoRes = await api.guestLogin();
      api.setToken(demoRes.access_token);
      state.set("user", demoRes.user);
    } catch (guestErr) {
      console.warn("Guest session unavailable:", guestErr);
    }
  }

  // Routing
  window.addEventListener("hashchange", router);
  router();
}

document.addEventListener("DOMContentLoaded", initApp);
