import sqlite3
import json
from datetime import date
from fastapi import APIRouter, HTTPException, Depends, Query
from typing import Optional, List
from app.database import get_db
from app.api.auth import get_current_user_optional
from app.models.workout import WorkoutPlanRequest, WorkoutLogRequest
from app.services.workout_planner import generate_weekly_workout_split, check_progressive_overload
from app.data.exercises_data import EXERCISES_DATASET

router = APIRouter(prefix="/api/workouts", tags=["Workout Planner & Tracking"])

@router.get("/split")
def get_workout_split(
    split_type: Optional[str] = None,
    days_per_week: Optional[str] = None,
    time_crunch_minutes: Optional[str] = None,
    user: dict = Depends(get_current_user_optional),
    db: sqlite3.Connection = Depends(get_db)
):
    user_id = user["id"] if user else 1
    cursor = db.cursor()

    # Parse days_per_week safely
    parsed_days = None
    if days_per_week and days_per_week not in ("null", "undefined", ""):
        try:
            parsed_days = int(days_per_week)
        except (ValueError, TypeError):
            parsed_days = None

    # Parse time_crunch_minutes safely
    parsed_crunch = None
    if time_crunch_minutes and time_crunch_minutes not in ("null", "undefined", ""):
        try:
            parsed_crunch = int(time_crunch_minutes)
        except (ValueError, TypeError):
            parsed_crunch = None

    cursor.execute("SELECT days_per_week, equipment, goal FROM profiles WHERE user_id = ?", (user_id,))
    p_row = cursor.fetchone()
    user_days = parsed_days or (p_row["days_per_week"] if p_row else 4)
    equipment = p_row["equipment"] if p_row else "full_gym"

    split = generate_weekly_workout_split(
        split_type=split_type or "ppl",
        days_per_week=user_days,
        equipment=equipment,
        time_crunch_minutes=parsed_crunch
    )
    return {
        "split_type": split_type or "ppl",
        "days_per_week": user_days,
        "time_crunch_minutes": parsed_crunch,
        "days": split
    }

@router.get("/exercises")
def get_exercises(category: Optional[str] = "all"):
    if category and category != "all":
        return [e for e in EXERCISES_DATASET if e["category"].lower() == category.lower()]
    return EXERCISES_DATASET

@router.post("/log")
def log_workout(
    req: WorkoutLogRequest,
    user: dict = Depends(get_current_user_optional),
    db: sqlite3.Connection = Depends(get_db)
):
    user_id = user["id"] if user else 1
    today_str = date.today().isoformat()
    cursor = db.cursor()

    # Fetch last workout for progressive overload evaluation
    cursor.execute("""
    SELECT exercises_completed_json FROM workout_logs
    WHERE user_id = ? ORDER BY completed_at DESC LIMIT 1
    """, (user_id,))
    last_row = cursor.fetchone()
    last_log_data = json.loads(last_row["exercises_completed_json"]) if last_row else None

    current_log_dict = req.model_dump()
    overload_result = check_progressive_overload(last_log_data, current_log_dict)

    base_xp = 100
    total_xp = base_xp + overload_result.get("xp_bonus", 0)

    # Insert log
    cursor.execute("""
    INSERT INTO workout_logs (user_id, workout_title, date, duration_min, exercises_completed_json, notes, xp_earned)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        user_id, req.workout_title, today_str, req.duration_min,
        json.dumps(current_log_dict), req.notes, total_xp
    ))

    # Update user XP & streak
    cursor.execute("""
    UPDATE user_xp SET
        total_xp = total_xp + ?,
        current_streak_days = current_streak_days + 1,
        last_active_date = ?
    WHERE user_id = ?
    """, (total_xp, today_str, user_id))

    cursor.execute("""
    INSERT INTO xp_transactions (user_id, action, xp_amount, description)
    VALUES (?, 'WORKOUT_COMPLETED', ?, ?)
    """, (user_id, total_xp, f"Crushed {req.workout_title} ({req.duration_min} min). {overload_result['summary']}"))

    db.commit()

    return {
        "status": "success",
        "message": f"Workout logged! +{total_xp} XP gained.",
        "xp_earned": total_xp,
        "overload_analysis": overload_result
    }

@router.get("/history")
def get_workout_history(
    user: dict = Depends(get_current_user_optional),
    db: sqlite3.Connection = Depends(get_db)
):
    user_id = user["id"] if user else 1
    cursor = db.cursor()
    cursor.execute("""
    SELECT id, workout_title, date, duration_min, notes, xp_earned, completed_at
    FROM workout_logs WHERE user_id = ? ORDER BY completed_at DESC LIMIT 15
    """, (user_id,))
    rows = cursor.fetchall()
    return [dict(r) for r in rows]
