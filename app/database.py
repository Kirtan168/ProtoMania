import sqlite3
import json
import hashlib
from datetime import datetime, date
from pathlib import Path
from app.config import settings
from app.data.foods_data import INDIAN_FOODS_DATASET

def get_db():
    settings.DATABASE_PATH.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(settings.DATABASE_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.close()

def get_connection():
    settings.DATABASE_PATH.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(settings.DATABASE_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn

def hash_password(password: str) -> str:
    """Deterministic secure salted SHA-256 for student evaluation portability"""
    salt = "protomania_salt_2026_"
    return hashlib.sha256((salt + password).encode("utf-8")).hexdigest()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return hash_password(plain_password) == hashed_password

def init_db():
    conn = get_connection()
    cursor = conn.cursor()

    # 1. Users table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        full_name TEXT NOT NULL,
        avatar_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # 2. Profiles table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS profiles (
        user_id INTEGER PRIMARY KEY,
        age INTEGER NOT NULL DEFAULT 20,
        height_cm REAL NOT NULL DEFAULT 172.0,
        weight_kg REAL NOT NULL DEFAULT 65.0,
        target_weight_kg REAL,
        waist_cm REAL,
        sex TEXT NOT NULL DEFAULT 'male',
        fitness_level TEXT NOT NULL DEFAULT 'beginner',
        goal TEXT NOT NULL DEFAULT 'muscle_building',
        training_location TEXT NOT NULL DEFAULT 'gym',
        equipment TEXT NOT NULL DEFAULT 'full_gym',
        days_per_week INTEGER NOT NULL DEFAULT 4,
        workout_duration INTEGER NOT NULL DEFAULT 45,
        dietary_preference TEXT NOT NULL DEFAULT 'vegetarian',
        allergies TEXT DEFAULT 'none',
        dislikes TEXT DEFAULT '',
        daily_budget_inr REAL NOT NULL DEFAULT 80.0,
        budget_mode TEXT NOT NULL DEFAULT 'protein_only',
        supplement_budget REAL DEFAULT 0.0,
        hostel_mode INTEGER DEFAULT 1,
        cooking_access TEXT NOT NULL DEFAULT 'kettle_or_mess',
        activity_level TEXT NOT NULL DEFAULT 'moderate',
        average_steps INTEGER DEFAULT 6000,
        sleep_hours REAL DEFAULT 7.0,
        college_schedule TEXT DEFAULT 'morning_classes',
        preferred_workout_time TEXT DEFAULT 'evening',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
    """)

    # 3. Calculated Targets table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS calculated_targets (
        user_id INTEGER PRIMARY KEY,
        bmi REAL,
        bmi_category TEXT,
        bmr REAL,
        tdee REAL,
        target_calories REAL,
        target_protein_g REAL,
        target_carbs_g REAL,
        target_fat_g REAL,
        target_cost_inr REAL,
        protein_per_rupee REAL,
        limitations_notes TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
    """)

    # 4. Foods table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS foods (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        hindi_name TEXT,
        category TEXT NOT NULL,
        dietary_type TEXT NOT NULL,
        serving_size TEXT NOT NULL,
        serving_unit TEXT NOT NULL,
        serving_amount REAL NOT NULL,
        protein_g REAL NOT NULL,
        calories REAL NOT NULL,
        carbs_g REAL NOT NULL,
        fat_g REAL NOT NULL,
        price_inr REAL NOT NULL,
        cost_per_10g_protein REAL NOT NULL,
        prep_time_min INTEGER NOT NULL,
        prep_type TEXT NOT NULL,
        refrigeration_needed INTEGER NOT NULL,
        is_hostel_friendly INTEGER NOT NULL,
        image_url TEXT NOT NULL,
        description TEXT NOT NULL
    );
    """)

    # 5. Meal Plans table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS meal_plans (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        day_of_week TEXT NOT NULL,
        meal_type TEXT NOT NULL,
        title TEXT NOT NULL,
        foods_json TEXT NOT NULL,
        total_protein_g REAL NOT NULL,
        total_calories REAL NOT NULL,
        total_price_inr REAL NOT NULL,
        prep_time_min INTEGER NOT NULL,
        instructions TEXT,
        is_eaten INTEGER DEFAULT 0,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
    """)

    # 6. Meal Logs table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS meal_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        log_date DATE NOT NULL,
        meal_name TEXT NOT NULL,
        protein_g REAL NOT NULL,
        calories REAL NOT NULL,
        price_inr REAL NOT NULL,
        meal_type TEXT,
        logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
    """)

    # 7. Workout Plans table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS workout_plans (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        split_type TEXT NOT NULL,
        day_name TEXT NOT NULL,
        duration_min INTEGER NOT NULL,
        difficulty TEXT NOT NULL,
        exercises_json TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
    """)

    # 8. Workout Logs table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS workout_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        workout_title TEXT NOT NULL,
        date DATE NOT NULL,
        duration_min INTEGER NOT NULL,
        exercises_completed_json TEXT NOT NULL,
        notes TEXT,
        xp_earned INTEGER DEFAULT 100,
        completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
    """)

    # 9. User XP & Gamification table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS user_xp (
        user_id INTEGER PRIMARY KEY,
        total_xp INTEGER DEFAULT 150,
        level INTEGER DEFAULT 1,
        current_streak_days INTEGER DEFAULT 1,
        last_active_date DATE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
    """)

    # 10. XP Transactions table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS xp_transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        action TEXT NOT NULL,
        xp_amount INTEGER NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        description TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
    """)

    # 11. Squads table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS squads (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        invite_code TEXT UNIQUE NOT NULL,
        description TEXT NOT NULL,
        created_by INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (created_by) REFERENCES users(id)
    );
    """)

    # 12. Squad Members table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS squad_members (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        squad_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(squad_id, user_id),
        FOREIGN KEY (squad_id) REFERENCES squads(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
    """)

    # 13. Food Price Overrides (student Kirana / local canteen custom prices)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS food_price_overrides (
        user_id INTEGER NOT NULL,
        food_id TEXT NOT NULL,
        custom_price_inr REAL NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (user_id, food_id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (food_id) REFERENCES foods(id) ON DELETE CASCADE
    );
    """)

    # Seed & sync Foods table with latest verified dataset
    for f in INDIAN_FOODS_DATASET:
        cursor.execute("""
        INSERT INTO foods (
            id, name, hindi_name, category, dietary_type, serving_size,
            serving_unit, serving_amount, protein_g, calories, carbs_g,
            fat_g, price_inr, cost_per_10g_protein, prep_time_min,
            prep_type, refrigeration_needed, is_hostel_friendly,
            image_url, description
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
            name = excluded.name,
            hindi_name = excluded.hindi_name,
            category = excluded.category,
            dietary_type = excluded.dietary_type,
            serving_size = excluded.serving_size,
            serving_unit = excluded.serving_unit,
            serving_amount = excluded.serving_amount,
            protein_g = excluded.protein_g,
            calories = excluded.calories,
            carbs_g = excluded.carbs_g,
            fat_g = excluded.fat_g,
            price_inr = excluded.price_inr,
            cost_per_10g_protein = excluded.cost_per_10g_protein,
            prep_time_min = excluded.prep_time_min,
            prep_type = excluded.prep_type,
            refrigeration_needed = excluded.refrigeration_needed,
            is_hostel_friendly = excluded.is_hostel_friendly,
            image_url = excluded.image_url,
            description = excluded.description
        """, (
            f["id"], f["name"], f["hindi_name"], f["category"], f["dietary_type"],
            f["serving_size"], f["serving_unit"], f["serving_amount"], f["protein_g"],
            f["calories"], f["carbs_g"], f["fat_g"], f["price_inr"],
            f["cost_per_10g_protein"], f["prep_time_min"], f["prep_type"],
            1 if f["refrigeration_needed"] else 0,
            1 if f["is_hostel_friendly"] else 0,
            f["image_url"], f["description"]
        ))

    # Seed Default Student Demo User for instant evaluators testing
    cursor.execute("SELECT id FROM users WHERE email = 'demo@protomania.app'")
    demo_user = cursor.fetchone()
    if not demo_user:
        cursor.execute("""
        INSERT INTO users (email, username, password_hash, full_name, avatar_url)
        VALUES ('demo@protomania.app', 'protomaster', ?, 'Student Athlete', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80')
        """, (hash_password("student123"),))
        user_id = cursor.lastrowid

        # Profile for Demo User
        cursor.execute("""
        INSERT INTO profiles (
            user_id, age, height_cm, weight_kg, target_weight_kg, waist_cm,
            sex, fitness_level, goal, training_location, equipment,
            days_per_week, workout_duration, dietary_preference, allergies,
            dislikes, daily_budget_inr, budget_mode, supplement_budget,
            hostel_mode, cooking_access, activity_level, average_steps,
            sleep_hours, college_schedule, preferred_workout_time
        ) VALUES (
            ?, 20, 174.0, 64.0, 70.0, 78.0,
            'male', 'beginner', 'muscle_building', 'gym', 'full_gym',
            4, 45, 'vegetarian', 'none',
            'mushrooms', 80.0, 'protein_only', 0.0,
            1, 'kettle_or_mess', 'moderate', 7500,
            7.0, 'morning_classes', 'evening'
        )
        """, (user_id,))

        # Calculated targets
        cursor.execute("""
        INSERT INTO calculated_targets (
            user_id, bmi, bmi_category, bmr, tdee, target_calories,
            target_protein_g, target_carbs_g, target_fat_g, target_cost_inr,
            protein_per_rupee, limitations_notes
        ) VALUES (
            ?, 21.1, 'Normal', 1610, 2495, 2750,
            130.0, 360.0, 65.0, 80.0,
            1.625, 'Focus on lean bulk surplus (+250 kcal) maximizing budget staples: Soya Chunks + Roasted Chana + Curd.'
        )
        """, (user_id,))

        # Initial XP (Day 1 fresh start)
        cursor.execute("""
        INSERT INTO user_xp (user_id, total_xp, level, current_streak_days, last_active_date)
        VALUES (?, 150, 1, 1, ?)
        """, (user_id, date.today().isoformat()))

        # XP Transactions
        cursor.execute("""
        INSERT INTO xp_transactions (user_id, action, xp_amount, description)
        VALUES (?, 'PROFILE_SETUP', 150, 'Completed Onboarding & Budget Setup')
        """, (user_id,))

        # Seed sample Squad
        cursor.execute("""
        INSERT INTO squads (name, invite_code, description, created_by)
        VALUES ('Hostel 4 Iron Club', 'H4IRON', 'College campus lifting & budget protein squad. No missed days!', ?)
        """, (user_id,))
        squad_id = cursor.lastrowid
        cursor.execute("""
        INSERT INTO squad_members (squad_id, user_id) VALUES (?, ?)
        """, (squad_id, user_id))

    conn.commit()
    conn.close()
