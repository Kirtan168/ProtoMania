# PROTOMANIA ⚡
### AI-Powered Fitness, Nutrition & Budget Optimization Platform for Students
**Official Tagline:** *Your Body. Your Budget. Your Era.*

---

## 1. Project Overview & Problem Statement
Modern fitness and nutrition advice assumes disposable income, expensive gym passes, and imported whey protein isolate ($₹3,500+/kg$). For the 40+ million college students in India living in hostels, PGs, and shared rooms on strict daily food stipends ($₹30 - ₹150$/day), this advice fails.

**PROTOMANIA** is a complete, production-quality fitness-tech platform designed from the ground up around student economics. Its signature engine is a **mathematical budget-protein optimizer** that calculates maximum complete protein yield from accessible Indian staples (Soya chunks, boiled eggs, roasted bhuna chana, dahi/curd, sattu, and toned milk) while respecting student realities: electric kettles, college mess menus, exam stress, and zero refrigeration.

Additionally, PROTOMANIA includes a dedicated **Developer Hub** (`/developers`) designed for university faculty and academic reviewers to inspect real technical architecture, OpenAPI schemas, SQLite relational database tables, ER diagrams, data pipelines, and live system diagnostics.

---

## 2. Brand Identity & Design System
* **Brand Name:** PROTOMANIA
* **Logo Concept A — The Proto Mark:** Distinctive sharp geometric hexagon incorporating a dynamic lightning bolt, symbolizing energy, precision, and tech-powered progress.
* **Palette:**
  * **Proto Black (`#111410`):** Main dark-mode background.
  * **Acid Lime (`#D8FF3E`):** Primary action CTAs, progress rings, numbers, and active badges.
  * **Cloud White (`#F4F5EF`):** Primary editorial typography.
  * **Steel Grey (`#858A80`):** Secondary information and subtitles.
  * **Electric Violet (`#9C8AFF`):** AI-specific indicators and conversational buddy badge.
  * **Dark Surface (`#1B1E19`):** Elevated cards, modals, and navbars.
  * **Border Grey (`#34382F`):** Subtle dividers and geometric borders.
* **Typography:** Plus Jakarta Sans & Space Grotesk.

---

## 3. Core Features & Capabilities

### ⚡ 1. Signature Budget Protein Optimizer
* **Heuristic Knapsack Solver:** Formulates a constrained optimization problem balancing protein density per rupee ($P / ₹$).
* **₹50 Protein Challenge:** Algorithmic combo solver that yields 55g–70g of pure protein strictly under ₹50.
* **Verified Indian Food Staples:** Complete macro and micronutrient metrics for 24+ Indian foods (raw dry weights, cooked conversions, cost per 10g protein).
* **Smart Substitution Engine:** Replaces any food item with Cheaper, Higher Protein, 100% Vegetarian, or Zero-Cook Hostel alternatives.
* **Local Market Price Overrides:** Allows students to adjust local kirana / campus tapri prices in real time.

### 🍽️ 2. Personalized Meal Planner & Student Modes
* **Hostel Mode:** Minimal equipment, kettle boiling, and shelf-stable room staples.
* **Mess Mode ("Mess Survival Guide"):** Infiltrates high-carb college mess meals with targeted protein boosters.
* **No-Cook Mode:** Zero gas stove needed (Sattu drinks, curd bowls, bhuna chana, roasted peanuts).
* **Exam-Week Mode:** Low prep time (<3 mins), high satiety, zero food coma.
* **7-Day Bulk Grocery Haul:** Aggregated weekly weights, procurement discounts, and market hacks.

### 🏋️ 3. AI Workout Planner & Progressive Overload Engine
* **Splits:** Push/Pull/Legs (PPL), 4-Day Upper/Lower, 3-Day Full Body, and Hostel Calisthenics.
* **Progressive Overload Evaluation:** Automatically calculates total volume tonnage ($Weight \times Reps$) and compares against prior sessions.
* **30-Minute Time Crunch Mode:** Condenses volume into antagonist supersets for busy college exam schedules.
* **Interactive Rest Interval Timer:** Visual and audio rest countdown between sets.

### 📱 4. Gen Z & Campus Community Features
* **Fitness Wrapped:** Spotify-style shareable monthly recap card highlighting workouts completed, grams of protein eaten, money saved vs whey, and official "Fitness Era" titles.
* **Broke but Building:** Emergency solver when students only have loose change ($₹20 - ₹40$) left in their UPI wallet.
* **Protein Price Radar:** Live index comparing cost per 10g of protein across Indian staples.
* **Fitness XP & Gamification:** Progression levels (Novice to Proto Titan), milestone badges, weekly missions, and consistency streaks.
* **College Squads:** Privacy-first group challenges (e.g. 50,000 Push-Ups) where only XP and streak days are shared—personal body measurements and meal logs remain private.
* **Meal Photo & Mess Menu Helper:** Computer vision meal plate macro estimation with protein deficit alerts.

### 🤖 5. AI Fitness Buddy
* Context-aware conversational assistant configured with student budget constraints and hostel knowledge.
* Integrated with **Google Gemini 1.5 Flash** (via `GEMINI_API_KEY`) and backed by a local expert heuristic engine for seamless offline evaluation.

---

## 4. Technical Architecture

```
PROTOMANIA /
├── app/
│   ├── main.py                  # FastAPI application entry point & static mounts
│   ├── config.py                # App configuration, settings & secret keys
│   ├── database.py              # SQLite connection, tables, migrations & seeds
│   ├── models/                  # Pydantic v2 schemas
│   │   ├── user.py              # Auth & Profile models
│   │   ├── nutrition.py         # Food, budget solve & substitution schemas
│   │   ├── workout.py           # Exercise & session logging models
│   │   └── squad.py             # Squad & gamification models
│   ├── services/                # Deterministic calculation & AI engines
│   │   ├── bmr_calculator.py    # Mifflin-St Jeor BMR & WHO TDEE engine
│   │   ├── budget_optimizer.py  # Knapsack protein optimization solver
│   │   ├── meal_planner.py      # Student mode meal & grocery generator
│   │   ├── workout_planner.py   # Training split & progressive overload tracker
│   │   ├── ai_buddy.py          # Google Gemini + contextual heuristic expert
│   │   └── vision_helper.py     # Mess menu & food photo analyzer
│   ├── data/                    # Datasets
│   │   ├── foods_data.py        # Verified Indian foods with CDN photography
│   │   └── exercises_data.py    # Exercises with instructions and form cues
│   ├── api/                     # REST API Routers
│   │   ├── auth.py              # Token auth & demo student profile login
│   │   ├── onboarding.py        # 5-step wizard profile targets
│   │   ├── optimizer.py         # Budget solver endpoints & price overrides
│   │   ├── meals.py             # Meal schedule & 1-click logging (+50 XP)
│   │   ├── workouts.py          # Active workout tracking & overload (+100 XP)
│   │   ├── genz.py              # Wrapped, Broke-Building, Radar, XP, Squads
│   │   ├── ai_chat.py           # Conversational assistant endpoint
│   │   └── developer_hub.py     # University academic evaluation & diagnostics API
│   ├── static/                  # Frontend static files
│   │   ├── css/styles.css       # Acid Lime design tokens, glowing cards, themes
│   │   └── js/                  # Modular ES6 frontend
│   │       ├── api.js           # Asynchronous REST client wrapper
│   │       ├── state.js         # Reactive global state store
│   │       ├── components/      # Logo SVG, Navbar, Footer, Toast notifications
│   │       ├── views/           # Home, Dashboard, Optimizer, Meals, Workouts, Wrapped, etc.
│   │       └── app.js           # Client router & controller
│   └── templates/
│       └── index.html           # HTML shell with Tailwind CSS & Lucide icons
├── protomania.db                # SQLite relational database
├── run.py                       # Server launcher
└── requirements.txt             # Dependency definitions
```

---

## 5. How to Run Locally

### Prerequisites
* Python 3.10+ (Tested on Python 3.14)

### Quick Start
```bash
# 1. Navigate to directory
cd C:\Users\hp\OneDrive\Desktop\PROTOMANIA

# 2. Run the application
.\.venv\Scripts\python.exe run.py
```

The application will be live at:
* **Web Application:** `http://127.0.0.1:8000`
* **Developer Hub:** `http://127.0.0.1:8000/developers`
* **Interactive OpenAPI Docs:** `http://127.0.0.1:8000/docs`

---

## 6. University Evaluation & Developer Hub Route
To inspect the system for academic review, click **Dev Hub** in the top navigation or visit `/developers`:
* **API Registry:** Live inspection of all 28 API endpoints with methods, request/response models, and live test buttons.
* **ER Diagrams & SQLite Schema:** Detailed view of tables (`users`, `profiles`, `calculated_targets`, `foods`, `meal_plans`, `meal_logs`, `workout_logs`, `user_xp`, `squads`).
* **Data Flow Pipelines:** Visual breakdown of BMR calculation, linear knapsack budget optimization, and progressive overload tracking.
* **Security & Safeguards:** Parameterized SQL queries, JWT cryptographic verification, biometric privacy isolation, and minimum 1350 kcal health guardrails.
* **Live System Health:** Real-time database latency roundtrip test, SQLite file metrics, and AI subsystem status.

---
© 2026 **PROTOMANIA**. All Rights Reserved. *Your Body. Your Budget. Your Era.*
