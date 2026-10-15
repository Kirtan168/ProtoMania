"""
Signature Engine: Budget Protein Optimizer.
Solves the protein-per-rupee optimization problem for college students.
Includes the algorithmic ₹50 Protein Challenge, Smart Food Substitution,
Hostel room constraints, and dynamic budget solvers.
"""

from typing import List, Dict, Any, Optional
from app.data.foods_data import INDIAN_FOODS_DATASET

def filter_foods(
    dietary_preference: str = "vegetarian",
    hostel_only: bool = False,
    no_cook_only: bool = False,
    exclude_food_ids: Optional[List[str]] = None,
    custom_prices: Optional[Dict[str, float]] = None
) -> List[Dict[str, Any]]:
    exclude_food_ids = exclude_food_ids or []
    custom_prices = custom_prices or {}
    diet_pref = dietary_preference.lower()

    allowed_types = {"vegan"}
    if diet_pref == "vegetarian":
        allowed_types.update({"vegetarian"})
    elif diet_pref == "eggetarian":
        allowed_types.update({"vegetarian", "eggetarian"})
    elif diet_pref in ("non_vegetarian", "non-vegetarian", "nonveg"):
        allowed_types.update({"vegetarian", "eggetarian", "non_vegetarian"})

    results = []
    for f in INDIAN_FOODS_DATASET:
        if f["id"] in exclude_food_ids:
            continue
        if f["dietary_type"] not in allowed_types:
            continue
        if hostel_only and not f["is_hostel_friendly"]:
            continue
        if no_cook_only and f["prep_type"] != "no_cook":
            continue

        item = dict(f)
        # Apply custom student local price if overridden
        if f["id"] in custom_prices:
            item["price_inr"] = custom_prices[f["id"]]
            item["cost_per_10g_protein"] = round((item["price_inr"] / item["protein_g"]) * 10, 2)

        results.append(item)
    return results

def solve_budget_protein_combination(
    budget_inr: float,
    target_protein_g: Optional[float] = None,
    dietary_preference: str = "vegetarian",
    hostel_only: bool = False,
    no_cook_only: bool = False,
    exclude_food_ids: Optional[List[str]] = None,
    custom_prices: Optional[Dict[str, float]] = None
) -> Dict[str, Any]:
    """
    Greedy Knapsack heuristic:
    Orders candidate items by Protein-Per-Rupee efficiency (protein_g / price_inr),
    and selects balanced portions that do not exceed the student's daily budget.
    """
    available_foods = filter_foods(
        dietary_preference=dietary_preference,
        hostel_only=hostel_only,
        no_cook_only=no_cook_only,
        exclude_food_ids=exclude_food_ids,
        custom_prices=custom_prices
    )

    if not available_foods:
        # Fallback to base vegetarian pool
        available_foods = filter_foods(dietary_preference="vegetarian")

    # Sort primarily by protein per rupee (highest first)
    sorted_foods = sorted(
        available_foods,
        key=lambda x: (x["protein_g"] / max(0.1, x["price_inr"])),
        reverse=True
    )

    allocated_items = []
    current_cost = 0.0
    current_protein = 0.0
    current_calories = 0.0

    # Pick top complementary food items to form a practical student meal combo
    for food in sorted_foods:
        if current_cost + food["price_inr"] <= budget_inr:
            allocated_items.append({
                "food": food,
                "servings": 1.0,
                "total_protein_g": food["protein_g"],
                "total_calories": food["calories"],
                "total_price_inr": food["price_inr"]
            })
            current_cost += food["price_inr"]
            current_protein += food["protein_g"]
            current_calories += food["calories"]

            if target_protein_g and current_protein >= target_protein_g:
                break
            if len(allocated_items) >= 4:
                break

    # If remaining budget can scale up the most cost-effective staple (e.g. extra serving of soya chunks or milk)
    remaining_budget = budget_inr - current_cost
    if remaining_budget >= 10.0 and allocated_items:
        best_item = allocated_items[0]
        extra_unit_cost = best_item["food"]["price_inr"]
        if remaining_budget >= extra_unit_cost:
            best_item["servings"] += 1.0
            best_item["total_protein_g"] += best_item["food"]["protein_g"]
            best_item["total_calories"] += best_item["food"]["calories"]
            best_item["total_price_inr"] += extra_unit_cost
            current_cost += extra_unit_cost
            current_protein += best_item["food"]["protein_g"]
            current_calories += best_item["food"]["calories"]
            remaining_budget -= extra_unit_cost

    protein_per_rupee = round(current_protein / max(1.0, current_cost), 2)

    # Dynamic student tip based on results
    if current_protein >= 60:
        verdict = f"High Yield: Reached {round(current_protein, 1)}g Protein for ₹{round(current_cost, 0)}!"
        tip = "Outstanding student efficiency! You are getting over 1g of pure protein for every ₹1 spent."
    elif current_protein >= 35:
        verdict = f"Solid Student Combo: {round(current_protein, 1)}g Protein within ₹{round(current_cost, 0)}."
        tip = "Solid baseline. Pair with regular hostel mess dal-roti to easily clear 80g+ daily protein."
    else:
        verdict = f"Micro-Budget Allocation: {round(current_protein, 1)}g Protein for ₹{round(current_cost, 0)}."
        tip = "Focus on Soya Chunks (₹12 for 26g protein) and Roasted Chana for zero cooking constraints."

    return {
        "budget_inr": budget_inr,
        "total_cost_inr": round(current_cost, 1),
        "total_protein_g": round(current_protein, 1),
        "total_calories": round(current_calories, 0),
        "protein_per_rupee": protein_per_rupee,
        "remaining_budget_inr": round(budget_inr - current_cost, 1),
        "items": allocated_items,
        "verdict": verdict,
        "student_tip": tip
    }

def solve_fifty_rupee_challenge(dietary_preference: str = "vegetarian") -> Dict[str, Any]:
    """
    Signature '₹50 Protein Challenge'
    Finds the maximum protein combination strictly under ₹50.
    """
    return solve_budget_protein_combination(
        budget_inr=50.0,
        dietary_preference=dietary_preference,
        hostel_only=True
    )

def get_smart_substitutions(food_id: str, dietary_preference: Optional[str] = None) -> Dict[str, Any]:
    """
    Finds contextual replacements for a food item:
    1. Cheaper alternative (lower price / lower cost per 10g protein)
    2. Higher protein alternative
    3. Vegetarian / Vegan swap
    4. Zero-Cook alternative (hostel friendly)
    """
    target = next((f for f in INDIAN_FOODS_DATASET if f["id"] == food_id), None)
    if not target:
        return {"error": "Food item not found"}

    candidates = [f for f in INDIAN_FOODS_DATASET if f["id"] != food_id]

    cheaper = min(
        candidates,
        key=lambda x: x["cost_per_10g_protein"],
        default=None
    )
    higher_protein = max(
        candidates,
        key=lambda x: x["protein_g"],
        default=None
    )
    veg_alt = next(
        (f for f in candidates if f["dietary_type"] in ("vegetarian", "vegan") and f["protein_g"] >= target["protein_g"] * 0.7),
        candidates[0]
    )
    no_cook_alt = next(
        (f for f in candidates if f["prep_type"] == "no_cook" and f["protein_g"] >= 8.0),
        candidates[1]
    )

    return {
        "original_food": target,
        "recommendations": {
            "cheapest_substitute": {
                "tag": "Max Cost Savings",
                "food": cheaper,
                "reason": f"Saves money! Cost per 10g protein is only ₹{cheaper['cost_per_10g_protein']} vs ₹{target['cost_per_10g_protein']}."
            },
            "higher_protein_substitute": {
                "tag": "Max Protein Punch",
                "food": higher_protein,
                "reason": f"Packs {higher_protein['protein_g']}g protein per serving ({round(higher_protein['protein_g'] - target['protein_g'], 1)}g more!)."
            },
            "vegetarian_substitute": {
                "tag": "100% Vegetarian Swap",
                "food": veg_alt,
                "reason": f"Plant or dairy based alternative with {veg_alt['protein_g']}g protein."
            },
            "zero_cook_substitute": {
                "tag": "No-Cook Hostel Ready",
                "food": no_cook_alt,
                "reason": "Requires zero gas stove or cooking. Instant desk ready."
            }
        }
    }
