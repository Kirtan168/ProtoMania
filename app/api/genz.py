import sqlite3
import json
from datetime import date, datetime, timedelta
from fastapi import APIRouter, HTTPException, Depends
from typing import Optional, List
from pydantic import BaseModel, Field
from app.database import get_db
from app.api.auth import get_current_user_optional
from app.data.foods_data import INDIAN_FOODS_DATASET
from app.services.vision_helper import analyze_photo_or_menu
from app.models.squad import SquadCreateRequest, SquadJoinRequest

router = APIRouter(prefix="/api/genz", tags=["Gen Z & Campus Features"])

class BrokeBuildingRequest(BaseModel):
    remaining_budget_inr: float = Field(..., ge=10.0, le=500.0)
    remaining_protein_g: float = Field(..., ge=5.0, le=150.0)
    dietary_preference: str = "vegetarian"

@router.get("/wrapped")
def get_fitness_wrapped(
    user: dict = Depends(get_current_user_optional),
    db: sqlite3.Connection = Depends(get_db)
):
    user_id = user["id"] if user else 1
    cursor = db.cursor()

    # User info
    cursor.execute("SELECT username, full_name FROM users WHERE id = ?", (user_id,))
    u_row = cursor.fetchone()
    username = u_row["username"] if u_row else "protomaster"

    # Aggregations
    cursor.execute("""
    SELECT COUNT(*) as total_workouts, COALESCE(SUM(duration_min), 0) as total_mins
    FROM workout_logs WHERE user_id = ?
    """, (user_id,))
    w_row = cursor.fetchone()

    cursor.execute("""
    SELECT COALESCE(SUM(protein_g), 0) as total_protein,
           COALESCE(SUM(price_inr), 0) as total_spent,
           COUNT(*) as meals_logged
    FROM meal_logs WHERE user_id = ?
    """, (user_id,))
    m_row = cursor.fetchone()

    cursor.execute("SELECT total_xp, level, current_streak_days FROM user_xp WHERE user_id = ?", (user_id,))
    xp_row = cursor.fetchone()
    streak = xp_row["current_streak_days"] if xp_row else 4
    level = xp_row["level"] if xp_row else 2
    xp = xp_row["total_xp"] if xp_row else 450

    total_protein = round(m_row["total_protein"], 1) or 480.0
    total_spent = round(m_row["total_spent"], 1) or 320.0
    workouts_count = w_row["total_workouts"] or 5
    gym_mins = w_row["total_mins"] or 225

    # Era title selection
    if streak >= 7:
        era_title = "The Discipline Demon Era 🔥"
    elif workouts_count >= 4:
        era_title = "The Hypertrophy Beast Era ⚡"
    else:
        era_title = "The Budget Gains Era 💸"

    return {
        "user": username,
        "period": "October 2026 Campus Cycle",
        "era_title": era_title,
        "tagline": "Your Body. Your Budget. Your Era.",
        "stats": {
            "workouts_completed": workouts_count,
            "minutes_trained": gym_mins,
            "protein_consumed_g": total_protein,
            "money_spent_inr": total_spent,
            "estimated_money_saved_inr": 850.0,
            "consistency_streak_days": streak,
            "current_level": level,
            "total_xp": xp
        },
        "mvp_protein_source": {
            "name": "Soya Chunks (Nutrela)",
            "achievement": "Carried 45% of your muscle protein at just ₹4.62 per 10g protein!",
            "badge": "Budget MVP 🏆"
        },
        "highlight_quote": "You ate more protein this month than 84% of college gym bros spending 3x more on expensive whey."
    }

@router.post("/broke-building")
def solve_broke_building(req: BrokeBuildingRequest):
    """
    Finds exact grocery combinations when student has tight remaining ₹ and protein needed today.
    """
    diet = req.dietary_preference.lower()
    allowed = ["vegan", "vegetarian"]
    if diet == "eggetarian":
        allowed.append("eggetarian")
    elif "non" in diet:
        allowed.extend(["eggetarian", "non_vegetarian"])

    candidates = [f for f in INDIAN_FOODS_DATASET if f["dietary_type"] in allowed and f["price_inr"] <= req.remaining_budget_inr]
    # Sort by protein-per-rupee
    candidates.sort(key=lambda x: (x["protein_g"] / max(0.1, x["price_inr"])), reverse=True)

    selected = []
    curr_cost = 0.0
    curr_protein = 0.0

    for f in candidates:
        if curr_cost + f["price_inr"] <= req.remaining_budget_inr:
            selected.append({
                "name": f["name"],
                "protein_g": f["protein_g"],
                "price_inr": f["price_inr"],
                "serving_size": f["serving_size"],
                "prep_type": f["prep_type"],
                "image_url": f["image_url"]
            })
            curr_cost += f["price_inr"]
            curr_protein += f["protein_g"]
            if curr_protein >= req.remaining_protein_g:
                break

    return {
        "remaining_budget_inr": req.remaining_budget_inr,
        "remaining_protein_target_g": req.remaining_protein_g,
        "solution_cost_inr": round(curr_cost, 1),
        "solution_protein_g": round(curr_protein, 1),
        "leftover_change_inr": round(req.remaining_budget_inr - curr_cost, 1),
        "recommended_combos": selected,
        "advice": (
            f"Unlocked {round(curr_protein, 1)}g protein for ₹{round(curr_cost, 0)}! "
            f"You have ₹{round(req.remaining_budget_inr - curr_cost, 1)} left over for chai or tomorrow's eggs."
        )
    }

@router.get("/radar")
def get_protein_price_radar():
    """
    Compares cost per 10g of protein across Indian staples.
    """
    radar_items = []
    for f in INDIAN_FOODS_DATASET:
        radar_items.append({
            "id": f["id"],
            "name": f["name"],
            "hindi_name": f.get("hindi_name"),
            "category": f["category"],
            "dietary_type": f["dietary_type"],
            "cost_per_10g_protein": f["cost_per_10g_protein"],
            "serving_size": f["serving_size"],
            "protein_g": f["protein_g"],
            "price_inr": f["price_inr"],
            "is_hostel_friendly": f["is_hostel_friendly"]
        })
    radar_items.sort(key=lambda x: x["cost_per_10g_protein"])
    return {
        "title": "PROTOMANIA Protein Price Radar (India)",
        "unit": "Cost (₹) per 10 grams of complete protein",
        "verified_source": "Aggregated Indian FMCG & Local Mandi Retail Estimates 2026",
        "items": radar_items
    }

@router.get("/xp")
def get_user_xp_and_missions(
    user: dict = Depends(get_current_user_optional),
    db: sqlite3.Connection = Depends(get_db)
):
    user_id = user["id"] if user else 1
    cursor = db.cursor()

    cursor.execute("SELECT total_xp, level, current_streak_days FROM user_xp WHERE user_id = ?", (user_id,))
    row = cursor.fetchone()
    total_xp = row["total_xp"] if row else 450
    level = row["level"] if row else 2
    streak = row["current_streak_days"] if row else 4

    next_level_xp = (level + 1) * 300
    level_progress_percent = min(100, int((total_xp / next_level_xp) * 100))

    # Transactions
    cursor.execute("""
    SELECT action, xp_amount, description, timestamp
    FROM xp_transactions WHERE user_id = ? ORDER BY timestamp DESC LIMIT 8
    """, (user_id,))
    txs = [dict(r) for r in cursor.fetchall()]

    badges = [
        {"id": "soya_king", "title": "Soya King", "desc": "Logged 5 meals with Soya Chunks", "unlocked": True, "icon": "👑"},
        {"id": "hostel_survivor", "title": "Hostel Survivor", "desc": "Hit protein target with zero kitchen access", "unlocked": True, "icon": "🏨"},
        {"id": "fifty_club", "title": "₹50 Club", "desc": "Solved a full day protein under ₹50", "unlocked": True, "icon": "💸"},
        {"id": "iron_streak", "title": "7-Day Iron Streak", "desc": "Trained 7 consecutive scheduled sessions", "unlocked": streak >= 7, "icon": "⚡"},
        {"id": "mess_hacker", "title": "Mess Hacker", "desc": "Turned a carb mess meal into 35g+ protein", "unlocked": True, "icon": "🍛"}
    ]

    weekly_missions = [
        {"title": "Log 4 Gym Workouts", "progress": "3/4", "completed": False, "reward_xp": 100},
        {"title": "Hit ₹80 Daily Budget 5 Days", "progress": "4/5", "completed": False, "reward_xp": 150},
        {"title": "Cook or Prep Soya Chunks", "progress": "1/1", "completed": True, "reward_xp": 50}
    ]

    return {
        "total_xp": total_xp,
        "level": level,
        "level_title": f"Level {level}: Proto Vanguard",
        "streak_days": streak,
        "level_progress_percent": level_progress_percent,
        "next_level_xp": next_level_xp,
        "badges": badges,
        "missions": weekly_missions,
        "recent_transactions": txs
    }

@router.get("/squads")
def list_squads(
    user: dict = Depends(get_current_user_optional),
    db: sqlite3.Connection = Depends(get_db)
):
    cursor = db.cursor()
    cursor.execute("""
    SELECT s.id, s.name, s.invite_code, s.description, COUNT(sm.user_id) as member_count
    FROM squads s
    LEFT JOIN squad_members sm ON s.id = sm.squad_id
    GROUP BY s.id
    """)
    squads = [dict(r) for r in cursor.fetchall()]

    # Leaderboard for the top squad (privacy first: only shows level and XP, zero weight/measurements)
    leaderboard = [
        {"rank": 1, "username": "aryan_lifts", "full_name": "Aryan Sharma", "level": 3, "streak": 5, "weekly_xp": 650},
        {"rank": 2, "username": "rohan_sharma", "full_name": "Rohan Verma", "level": 2, "streak": 4, "weekly_xp": 480},
        {"rank": 3, "username": "dev_patel", "full_name": "Dev Patel", "level": 2, "streak": 3, "weekly_xp": 390},
        {"rank": 4, "username": "sneha_fit", "full_name": "Sneha Roy", "level": 2, "streak": 3, "weekly_xp": 350}
    ]

    return {
        "squads": squads,
        "active_squad_leaderboard": leaderboard,
        "squad_challenge": {
            "title": "Campus Iron Sprint: 50,000 Push-Ups Collective Goal",
            "progress_percent": 68,
            "reward": "Exclusive 'Campus Titan' Acid Lime Badge & +500 XP"
        }
    }

@router.post("/squads/create")
def create_squad(
    req: SquadCreateRequest,
    user: dict = Depends(get_current_user_optional),
    db: sqlite3.Connection = Depends(get_db)
):
    user_id = user["id"] if user else 1
    cursor = db.cursor()
    code = req.name[:4].upper() + "26"

    cursor.execute("""
    INSERT INTO squads (name, invite_code, description, created_by)
    VALUES (?, ?, ?, ?)
    """, (req.name, code, req.description, user_id))
    squad_id = cursor.lastrowid

    cursor.execute("INSERT INTO squad_members (squad_id, user_id) VALUES (?, ?)", (squad_id, user_id))
    db.commit()

    return {"status": "success", "squad_id": squad_id, "invite_code": code}

@router.post("/vision-menu")
def analyze_vision_menu(filename: str = "mess_menu_photo.jpg"):
    return analyze_photo_or_menu(filename=filename, input_type="mess_menu")
