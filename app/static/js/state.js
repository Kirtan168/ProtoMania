/**
 * PROTOMANIA State Store
 * Simple, reactive global state container.
 */

class StateStore {
  constructor() {
    this.state = {
      user: null,
      profile: null,
      targets: null,
      todaySummary: {
        protein: { consumed_g: 0, target_g: 130, percent: 0 },
        calories: { consumed_kcal: 0, target_kcal: 2400, percent: 0 },
        budget: { spent_inr: 0, limit_inr: 80, remaining_inr: 80, percent: 0 },
        logged_meals_count: 0
      },
      xpData: {
        total_xp: 450,
        level: 2,
        streak_days: 4
      },
      currentView: "home",
      theme: localStorage.getItem("protomania_theme") || "dark"
    };
    this.listeners = new Set();
  }

  get(key) {
    return this.state[key];
  }

  set(key, value) {
    this.state[key] = value;
    this.notify(key);
  }

  update(partialState) {
    Object.assign(this.state, partialState);
    this.notify("all");
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify(changedKey) {
    for (const listener of this.listeners) {
      listener(this.state, changedKey);
    }
  }

  toggleTheme() {
    const newTheme = this.state.theme === "dark" ? "light" : "dark";
    this.state.theme = newTheme;
    localStorage.setItem("protomania_theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    document.documentElement.setAttribute("data-theme", newTheme);
    this.notify("theme");
  }
}

export const state = new StateStore();
