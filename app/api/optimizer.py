import sqlite3
from fastapi import APIRouter, HTTPException, Depends, Query
from typing import Optional, List
from app.database import get_db
from app.api.auth import get_current_user_optional
from app.models.nutrition import BudgetSolveRequest, BudgetSolveResponse, SubstitutionRequest
from app.services.budget_optimizer import (
    filter_foods,
    solve_budget_protein_combination,
    solve_fifty_rupee_challenge,
    get_smart_substitutions
)
from pydantic import BaseModel

router = APIRouter(prefix="/api/optimizer", tags=["Budget Protein Optimizer"])

class PriceOverrideRequest(BaseModel):
    food_id: str
    custom_price_inr: float

@router.get("/foods")
def list_foods(
    dietary_preference: Optional[str] = "all",
    category: Optional[str] = "all",
    sort_by: Optional[str] = "protein_per_rupee", # 'protein_per_rupee', 'lowest_cost', 'highest_protein', 'prep_time'
    hostel_only: bool = False,
    no_cook_only: bool = False,
    search: Optional[str] = None,
    user: dict = Depends(get_current_user_optional),
    db: sqlite3.Connection = Depends(get_db)
):
    user_id = user["id"] if user else 1
    cursor = db.cursor()

    # Fetch custom user price overrides
    cursor.execute("SELECT food_id, custom_price_inr FROM food_price_overrides WHERE user_id = ?", (user_id,))
    price_overrides = {row["food_id"]: row["custom_price_inr"] for row in cursor.fetchall()}

    diet_filter = "non_vegetarian" if dietary_preference == "all" else dietary_preference
    foods = filter_foods(
        dietary_preference=diet_filter,
        hostel_only=hostel_only,
        no_cook_only=no_cook_only,
        custom_prices=price_overrides
    )

    if category and category != "all":
        foods = [f for f in foods if f["category"].lower() == category.lower()]

    if search:
        s = search.lower()
        foods = [f for f in foods if s in f["name"].lower() or s in (f.get("hindi_name") or "").lower()]

    # Sort
    if sort_by == "lowest_cost":
        foods.sort(key=lambda x: x["price_inr"])
    elif sort_by == "highest_protein":
        foods.sort(key=lambda x: x["protein_g"], reverse=True)
    elif sort_by == "prep_time":
        foods.sort(key=lambda x: x["prep_time_min"])
    else: # Default protein_per_rupee
        foods.sort(key=lambda x: (x["protein_g"] / max(0.1, x["price_inr"])), reverse=True)

    return {"count": len(foods), "foods": foods}

@router.post("/solve", response_model=BudgetSolveResponse)
def solve_budget(
    req: BudgetSolveRequest,
    user: dict = Depends(get_current_user_optional),
    db: sqlite3.Connection = Depends(get_db)
):
    user_id = user["id"] if user else 1
    cursor = db.cursor()
    cursor.execute("SELECT food_id, custom_price_inr FROM food_price_overrides WHERE user_id = ?", (user_id,))
    price_overrides = {row["food_id"]: row["custom_price_inr"] for row in cursor.fetchall()}

    result = solve_budget_protein_combination(
        budget_inr=req.budget_inr,
        target_protein_g=req.target_protein_g,
        dietary_preference=req.dietary_preference,
        hostel_only=req.hostel_only,
        no_cook_only=req.no_cook_only,
        exclude_food_ids=req.exclude_food_ids,
        custom_prices=price_overrides
    )
    return BudgetSolveResponse(**result)

@router.get("/50-rupee-challenge")
def get_fifty_rupee_challenge(dietary_preference: str = "vegetarian"):
    return solve_fifty_rupee_challenge(dietary_preference=dietary_preference)

@router.post("/substitute")
def get_substitutions(req: SubstitutionRequest):
    return get_smart_substitutions(food_id=req.food_id, dietary_preference=req.dietary_preference)

@router.post("/price-override")
def override_local_price(
    req: PriceOverrideRequest,
    user: dict = Depends(get_current_user_optional),
    db: sqlite3.Connection = Depends(get_db)
):
    user_id = user["id"] if user else 1
    cursor = db.cursor()
    cursor.execute("""
    INSERT INTO food_price_overrides (user_id, food_id, custom_price_inr, updated_at)
    VALUES (?, ?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(user_id, food_id) DO UPDATE SET
        custom_price_inr = excluded.custom_price_inr,
        updated_at = CURRENT_TIMESTAMP
    """, (user_id, req.food_id, req.custom_price_inr))
    db.commit()
    return {"status": "success", "message": f"Updated local price for {req.food_id} to ₹{req.custom_price_inr}"}
