/**
 * PROTOMANIA API Client
 * Robust asynchronous fetch wrapper connecting frontend views to FastAPI endpoints.
 */

const BASE_URL = window.location.origin;

class ApiClient {
  constructor() {
    this.token = localStorage.getItem("protomania_token") || null;
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem("protomania_token", token);
    } else {
      localStorage.removeItem("protomania_token");
    }
  }

  getHeaders() {
    const headers = {
      "Content-Type": "application/json"
    };
    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }
    return headers;
  }

  toQueryString(params = {}) {
    const clean = {};
    for (const [key, val] of Object.entries(params)) {
      if (val !== null && val !== undefined && val !== "" && val !== "null") {
        clean[key] = val;
      }
    }
    const qs = new URLSearchParams(clean).toString();
    return qs ? `?${qs}` : '';
  }

  async request(endpoint, options = {}) {
    const url = `${BASE_URL}${endpoint}`;
    const config = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...(options.headers || {})
      }
    };

    try {
      const response = await fetch(url, config);
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          errorData = { detail: response.statusText };
        }
        throw new Error(errorData.detail || "API Request failed");
      }
      return await response.json();
    } catch (err) {
      console.error(`API Error on [${options.method || 'GET'} ${endpoint}]:`, err);
      throw err;
    }
  }

  // --- Auth ---
  register(data) {
    return this.request("/api/auth/register", { method: "POST", body: JSON.stringify(data) });
  }

  login(data) {
    return this.request("/api/auth/login", { method: "POST", body: JSON.stringify(data) });
  }

  guestLogin() {
    return this.request("/api/auth/guest-login", { method: "POST" });
  }

  getMe() {
    return this.request("/api/auth/me");
  }

  updateProfile(data) {
    return this.request("/api/auth/profile", { method: "PUT", body: JSON.stringify(data) });
  }

  // --- Onboarding ---
  saveProfile(profileData) {
    return this.request("/api/onboarding/profile", { method: "POST", body: JSON.stringify(profileData) });
  }

  getProfile() {
    return this.request("/api/onboarding/profile");
  }

  getTargets() {
    return this.request("/api/onboarding/targets");
  }

  // --- Budget Optimizer ---
  getFoods(params = {}) {
    const qs = this.toQueryString(params);
    return this.request(`/api/optimizer/foods${qs}`);
  }

  solveBudget(payload) {
    return this.request("/api/optimizer/solve", { method: "POST", body: JSON.stringify(payload) });
  }

  getFiftyRupeeChallenge(diet = "vegetarian") {
    return this.request(`/api/optimizer/50-rupee-challenge?dietary_preference=${diet}`);
  }

  getSubstitutions(foodId, diet = null) {
    return this.request("/api/optimizer/substitute", {
      method: "POST",
      body: JSON.stringify({ food_id: foodId, dietary_preference: diet })
    });
  }

  overridePrice(foodId, price) {
    return this.request("/api/optimizer/price-override", {
      method: "POST",
      body: JSON.stringify({ food_id: foodId, custom_price_inr: price })
    });
  }

  // --- Meals ---
  getMealPlan(mode = "hostel", budget = null, diet = null) {
    const params = new URLSearchParams();
    if (mode) params.set("mode", mode);
    if (budget) params.set("budget", budget);
    if (diet) params.set("diet", diet);
    const qs = params.toString() ? `?${params.toString()}` : "";
    return this.request(`/api/meals/plan${qs}`);
  }

  getTodaySummary() {
    return this.request("/api/meals/today-summary");
  }

  resetTodayMeals() {
    return this.request("/api/meals/today", { method: "DELETE" });
  }

  logMeal(mealData) {
    return this.request("/api/meals/log", { method: "POST", body: JSON.stringify(mealData) });
  }

  getMealLogs() {
    return this.request("/api/meals/logs");
  }

  getGroceryList(mode = "hostel", budget = null, diet = null) {
    const params = new URLSearchParams();
    if (mode) params.set("mode", mode);
    if (budget) params.set("budget", budget);
    if (diet) params.set("diet", diet);
    const qs = params.toString() ? `?${params.toString()}` : "";
    return this.request(`/api/meals/grocery-list${qs}`);
  }

  // --- Workouts ---
  getWorkoutSplit(params = {}) {
    const qs = this.toQueryString(params);
    return this.request(`/api/workouts/split${qs}`);
  }

  getExercises(category = "all") {
    return this.request(`/api/workouts/exercises?category=${category}`);
  }

  logWorkout(workoutData) {
    return this.request("/api/workouts/log", { method: "POST", body: JSON.stringify(workoutData) });
  }

  getWorkoutHistory() {
    return this.request("/api/workouts/history");
  }

  // --- Gen Z Features ---
  getWrapped() {
    return this.request("/api/genz/wrapped");
  }

  solveBrokeBuilding(payload) {
    return this.request("/api/genz/broke-building", { method: "POST", body: JSON.stringify(payload) });
  }

  getRadar() {
    return this.request("/api/genz/radar");
  }

  getXpMissions() {
    return this.request("/api/genz/xp");
  }

  getSquads() {
    return this.request("/api/genz/squads");
  }

  createSquad(name, description) {
    return this.request("/api/genz/squads/create", { method: "POST", body: JSON.stringify({ name, description }) });
  }

  analyzeVisionMenu(filename = "mess_menu.jpg") {
    return this.request(`/api/genz/vision-menu?filename=${filename}`, { method: "POST" });
  }

  // --- AI Fitness Buddy ---
  chatWithBuddy(message, history = []) {
    return this.request("/api/ai/chat", { method: "POST", body: JSON.stringify({ message, history }) });
  }

  // --- Developer Hub ---
  getDevOverview() {
    return this.request("/api/developer/overview");
  }

  getDevApis() {
    return this.request("/api/developer/apis");
  }

  getDevSchema() {
    return this.request("/api/developer/schema");
  }

  getDevHealth() {
    return this.request("/api/developer/health");
  }
}

export const api = new ApiClient();
