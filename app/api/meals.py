import sqlite3
from datetime import date
from fastapi import APIRouter, HTTPException, Depends, Query
from typing import Optional, List
from app.database import get_db
from app.api.auth import get_current_user_optional
from app.models.nutrition import MealLogRequest
from app.services.meal_planner import generate_daily_meal_plan, generate_weekly_grocery_list

router = APIRouter(prefix="/api/meals", tags=["Meal Planner & Nutrition"])

@router.get("/plan")
def get_meal_plan(
    mode: str = "hostel", # 'hostel', 'mess', 'no_cook', 'exam_week', 'veg_muscle', 'budget'
    user: dict = Depends(get_current_user_optional),
    db: sqlite3.Connection = Depends(get_db)
):
    user_id = user["id"] if user else 1
    cursor = db.cursor()

    # Get user profile & target budget
    cursor.execute("SELECT dietary_preference, daily_budget_inr FROM profiles WHERE user_id = ?", (user_id,))
    p_row = cursor.fetchone()
    dietary_preference = p_row["dietary_preference"] if p_row else "vegetarian"
    daily_budget = p_row["daily_budget_inr"] if p_row else 80.0

    # Get target protein
    cursor.execute("SELECT target_protein_g FROM calculated_targets WHERE user_id = ?", (user_id,))
    t_row = cursor.fetchone()
    target_protein = t_row["target_protein_g"] if t_row else 120.0

    return generate_daily_meal_plan(
        dietary_preference=dietary_preference,
        daily_budget_inr=daily_budget,
        target_protein_g=target_protein,
        mode=mode
    )

@router.get("/today-summary")
def get_today_summary(
    user: dict = Depends(get_current_user_optional),
    db: sqlite3.Connection = Depends(get_db)
):
    user_id = user["id"] if user else 1
    today_str = date.today().isoformat()
    cursor = db.cursor()

    cursor.execute("""
    SELECT COALESCE(SUM(protein_g), 0) as total_protein,
           COALESCE(SUM(calories), 0) as total_calories,
           COALESCE(SUM(price_inr), 0) as total_spent,
           COUNT(*) as logged_count
    FROM meal_logs
    WHERE user_id = ? AND log_date = ?
    """, (user_id, today_str))
    log_row = cursor.fetchone()

    # Targets
    cursor.execute("SELECT target_protein_g, target_calories FROM calculated_targets WHERE user_id = ?", (user_id,))
    target_row = cursor.fetchone()
    target_protein = target_row["target_protein_g"] if target_row else 130.0
    target_calories = target_row["target_calories"] if target_row else 2400.0

    # Budget
    cursor.execute("SELECT daily_budget_inr FROM profiles WHERE user_id = ?", (user_id,))
    p_row = cursor.fetchone()
    daily_budget = p_row["daily_budget_inr"] if p_row else 80.0

    consumed_protein = round(log_row["total_protein"], 1)
    consumed_calories = round(log_row["total_calories"], 0)
    spent_inr = round(log_row["total_spent"], 1)

    return {
        "date": today_str,
        "protein": {
            "consumed_g": consumed_protein,
            "target_g": target_protein,
            "percent": min(100, int((consumed_protein / max(1.0, target_protein)) * 100))
        },
        "calories": {
            "consumed_kcal": consumed_calories,
            "target_kcal": target_calories,
            "percent": min(100, int((consumed_calories / max(1.0, target_calories)) * 100))
        },
        "budget": {
            "spent_inr": spent_inr,
            "limit_inr": daily_budget,
            "remaining_inr": max(0.0, round(daily_budget - spent_inr, 1)),
            "percent": min(100, int((spent_inr / max(1.0, daily_budget)) * 100))
        },
        "logged_meals_count": log_row["logged_count"]
    }

@router.delete("/today")
def reset_today_meals(
    user: dict = Depends(get_current_user_optional),
    db: sqlite3.Connection = Depends(get_db)
):
    user_id = user["id"] if user else 1
    today_str = date.today().isoformat()
    cursor = db.cursor()
    cursor.execute("DELETE FROM meal_logs WHERE user_id = ? AND log_date = ?", (user_id, today_str))
    db.commit()
    return {"message": "Today's meal logs have been reset to 0"}

@router.post("/log")
def log_meal_eaten(
    req: MealLogRequest,
    user: dict = Depends(get_current_user_optional),
    db: sqlite3.Connection = Depends(get_db)
):
    user_id = user["id"] if user else 1
    today_str = date.today().isoformat()
    cursor = db.cursor()

    cursor.execute("""
    INSERT INTO meal_logs (user_id, log_date, meal_name, protein_g, calories, price_inr, meal_type)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (user_id, today_str, req.meal_name, req.protein_g, req.calories, req.price_inr, req.meal_type))

    # Reward XP for logging meal (+50 XP)
    cursor.execute("UPDATE user_xp SET total_xp = total_xp + 50 WHERE user_id = ?", (user_id,))
    cursor.execute("""
    INSERT INTO xp_transactions (user_id, action, xp_amount, description)
    VALUES (?, 'MEAL_LOGGED', 50, ?)
    """, (user_id, f"Logged {req.meal_name} (+{req.protein_g}g Protein)"))

    db.commit()

    return {
        "status": "success",
        "message": f"Successfully logged {req.meal_name}! +50 XP awarded.",
        "xp_earned": 50
    }

@router.get("/logs")
def get_meal_logs(
    user: dict = Depends(get_current_user_optional),
    db: sqlite3.Connection = Depends(get_db)
):
    user_id = user["id"] if user else 1
    cursor = db.cursor()
    cursor.execute("""
    SELECT * FROM meal_logs WHERE user_id = ? ORDER BY logged_at DESC LIMIT 20
    """, (user_id,))
    rows = cursor.fetchall()
    return [dict(r) for r in rows]

@router.get("/grocery-list")
def get_grocery_list(
    mode: str = "hostel",
    user: dict = Depends(get_current_user_optional),
    db: sqlite3.Connection = Depends(get_db)
):
    user_id = user["id"] if user else 1
    cursor = db.cursor()
    cursor.execute("SELECT dietary_preference, daily_budget_inr FROM profiles WHERE user_id = ?", (user_id,))
    p_row = cursor.fetchone()
    dietary_preference = p_row["dietary_preference"] if p_row else "vegetarian"
    daily_budget = p_row["daily_budget_inr"] if p_row else 80.0

    daily_plan = generate_daily_meal_plan(
        dietary_preference=dietary_preference,
        daily_budget_inr=daily_budget,
        mode=mode
    )
    return generate_weekly_grocery_list(daily_plan)
