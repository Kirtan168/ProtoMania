import sqlite3
import json
from fastapi import APIRouter, HTTPException, Depends
from app.database import get_db
from app.api.auth import get_current_user_optional
from app.models.user import ProfileRequest, TargetsResponse
from app.services.bmr_calculator import calculate_nutrition_targets

router = APIRouter(prefix="/api/onboarding", tags=["Onboarding & Profile"])

@router.post("/profile", response_model=TargetsResponse)
def save_profile_and_calculate_plan(
    req: ProfileRequest,
    user: dict = Depends(get_current_user_optional),
    db: sqlite3.Connection = Depends(get_db)
):
    user_id = user["id"] if user else 1
    cursor = db.cursor()

    # Calculate deterministic targets
    targets = calculate_nutrition_targets(
        weight_kg=req.weight_kg,
        height_cm=req.height_cm,
        age=req.age,
        sex=req.sex,
        goal=req.goal,
        activity_level=req.activity_level,
        daily_budget_inr=req.daily_budget_inr,
        dietary_preference=req.dietary_preference
    )

    # Upsert Profile
    cursor.execute("""
    INSERT INTO profiles (
        user_id, age, height_cm, weight_kg, target_weight_kg, waist_cm,
        sex, fitness_level, goal, training_location, equipment,
        days_per_week, workout_duration, dietary_preference, allergies,
        dislikes, daily_budget_inr, budget_mode, supplement_budget,
        hostel_mode, cooking_access, activity_level, average_steps,
        sleep_hours, college_schedule, preferred_workout_time, updated_at
    ) VALUES (
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, CURRENT_TIMESTAMP
    )
    ON CONFLICT(user_id) DO UPDATE SET
        age=excluded.age, height_cm=excluded.height_cm, weight_kg=excluded.weight_kg,
        target_weight_kg=excluded.target_weight_kg, waist_cm=excluded.waist_cm,
        sex=excluded.sex, fitness_level=excluded.fitness_level, goal=excluded.goal,
        training_location=excluded.training_location, equipment=excluded.equipment,
        days_per_week=excluded.days_per_week, workout_duration=excluded.workout_duration,
        dietary_preference=excluded.dietary_preference, allergies=excluded.allergies,
        dislikes=excluded.dislikes, daily_budget_inr=excluded.daily_budget_inr,
        budget_mode=excluded.budget_mode, supplement_budget=excluded.supplement_budget,
        hostel_mode=excluded.hostel_mode, cooking_access=excluded.cooking_access,
        activity_level=excluded.activity_level, average_steps=excluded.average_steps,
        sleep_hours=excluded.sleep_hours, college_schedule=excluded.college_schedule,
        preferred_workout_time=excluded.preferred_workout_time, updated_at=CURRENT_TIMESTAMP
    """, (
        user_id, req.age, req.height_cm, req.weight_kg, req.target_weight_kg, req.waist_cm,
        req.sex, req.fitness_level, req.goal, req.training_location, req.equipment,
        req.days_per_week, req.workout_duration, req.dietary_preference, req.allergies,
        req.dislikes, req.daily_budget_inr, req.budget_mode, req.supplement_budget,
        req.hostel_mode, req.cooking_access, req.activity_level, req.average_steps,
        req.sleep_hours, req.college_schedule, req.preferred_workout_time
    ))

    # Upsert Calculated Targets
    cursor.execute("""
    INSERT INTO calculated_targets (
        user_id, bmi, bmi_category, bmr, tdee, target_calories,
        target_protein_g, target_carbs_g, target_fat_g, target_cost_inr,
        protein_per_rupee, limitations_notes, updated_at
    ) VALUES (
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, CURRENT_TIMESTAMP
    )
    ON CONFLICT(user_id) DO UPDATE SET
        bmi=excluded.bmi, bmi_category=excluded.bmi_category, bmr=excluded.bmr,
        tdee=excluded.tdee, target_calories=excluded.target_calories,
        target_protein_g=excluded.target_protein_g, target_carbs_g=excluded.target_carbs_g,
        target_fat_g=excluded.target_fat_g, target_cost_inr=excluded.target_cost_inr,
        protein_per_rupee=excluded.protein_per_rupee, limitations_notes=excluded.limitations_notes,
        updated_at=CURRENT_TIMESTAMP
    """, (
        user_id, targets["bmi"], targets["bmi_category"], targets["bmr"], targets["tdee"],
        targets["target_calories"], targets["target_protein_g"], targets["target_carbs_g"],
        targets["target_fat_g"], targets["target_cost_inr"], targets["protein_per_rupee"],
        targets["limitations_notes"]
    ))

    # Award onboarding XP
    cursor.execute("UPDATE user_xp SET total_xp = total_xp + 150 WHERE user_id = ?", (user_id,))
    cursor.execute("""
    INSERT INTO xp_transactions (user_id, action, xp_amount, description)
    VALUES (?, 'ONBOARDING_SAVED', 150, 'Completed Personalized Fitness & Budget Plan')
    """, (user_id,))

    db.commit()

    return TargetsResponse(**targets)

@router.get("/profile")
def get_user_profile(
    user: dict = Depends(get_current_user_optional),
    db: sqlite3.Connection = Depends(get_db)
):
    user_id = user["id"] if user else 1
    cursor = db.cursor()
    cursor.execute("SELECT * FROM profiles WHERE user_id = ?", (user_id,))
    row = cursor.fetchone()
    if not row:
        # Return default student profile
        cursor.execute("SELECT * FROM profiles WHERE user_id = 1")
        row = cursor.fetchone()
    return dict(row) if row else {}

@router.get("/targets")
def get_user_targets(
    user: dict = Depends(get_current_user_optional),
    db: sqlite3.Connection = Depends(get_db)
):
    user_id = user["id"] if user else 1
    cursor = db.cursor()
    cursor.execute("SELECT * FROM calculated_targets WHERE user_id = ?", (user_id,))
    row = cursor.fetchone()
    if not row:
        cursor.execute("SELECT * FROM calculated_targets WHERE user_id = 1")
        row = cursor.fetchone()
    return dict(row) if row else {}
