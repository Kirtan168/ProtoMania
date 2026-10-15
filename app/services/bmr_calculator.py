"""
Deterministic, scientifically validated metabolic calculation engine.
Implements Mifflin-St Jeor equation, WHO/CDC BMI categories, TDEE activity multipliers,
and student budget feasibility guardrails.
"""

from typing import Dict, Any, Tuple

def calculate_bmi(weight_kg: float, height_cm: float) -> Tuple[float, str, str]:
    height_m = height_cm / 100.0
    bmi = round(weight_kg / (height_m ** 2), 1)
    
    if bmi < 18.5:
        category = "Underweight"
        note = "Focus on caloric surplus with nutrient-dense protein foods like peanuts, eggs, milk, and banana."
    elif 18.5 <= bmi < 24.9:
        category = "Normal / Healthy Weight"
        note = "Prime zone for lean muscle building or recomposition."
    elif 25.0 <= bmi < 29.9:
        category = "Overweight"
        note = "Moderate deficit (-350 to -500 kcal) with high protein preserves muscle while cutting body fat."
    else:
        category = "Obesity"
        note = "Prioritize sustainable whole foods, daily step count, and moderate strength training."
        
    limitation_disclaimer = (
        "Note: BMI does not differentiate between skeletal muscle mass and adipose fat tissue. "
        "Athletic students with high muscle mass may be classified as overweight despite low body fat."
    )
    return bmi, category, f"{note} {limitation_disclaimer}"

def calculate_bmr(weight_kg: float, height_cm: float, age: int, sex: str = "male") -> float:
    """
    Mifflin-St Jeor Equation:
    Men: BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) + 5
    Women: BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) - 161
    Neutral/Skip: Average offset (-78)
    """
    base = (10.0 * weight_kg) + (6.25 * height_cm) - (5.0 * age)
    sex_lower = (sex or "male").lower()
    if sex_lower in ("male", "m"):
        return round(base + 5.0, 1)
    elif sex_lower in ("female", "f"):
        return round(base - 161.0, 1)
    else:
        return round(base - 78.0, 1)

def get_activity_multiplier(activity_level: str) -> float:
    multipliers = {
        "sedentary": 1.2,       # Little to no exercise, desk work
        "light": 1.375,         # Light training 1-3 days/wk or walking campus
        "moderate": 1.55,       # Moderate training 3-5 days/wk
        "very_active": 1.725    # Hard training 6-7 days/wk or physical job
    }
    return multipliers.get(activity_level.lower(), 1.45)

def calculate_nutrition_targets(
    weight_kg: float,
    height_cm: float,
    age: int,
    sex: str,
    goal: str,
    activity_level: str,
    daily_budget_inr: float,
    dietary_preference: str = "vegetarian"
) -> Dict[str, Any]:
    bmi, bmi_category, bmi_notes = calculate_bmi(weight_kg, height_cm)
    bmr = calculate_bmr(weight_kg, height_cm, age, sex)
    tdee = round(bmr * get_activity_multiplier(activity_level), 0)

    # Caloric adjustment by goal
    goal_lower = goal.lower()
    if "muscle" in goal_lower or "bulk" in goal_lower:
        caloric_delta = 300  # Lean surplus
    elif "loss" in goal_lower or "cut" in goal_lower:
        caloric_delta = -450 # Moderate deficit
    elif "strength" in goal_lower:
        caloric_delta = 150
    elif "recomp" in goal_lower:
        caloric_delta = -100
    else:
        caloric_delta = 0

    target_calories = max(1350.0, tdee + caloric_delta) # Safety floor: Never sub-1350 kcal for young adults

    # Protein target calculation with budget feasibility
    # Base: 1.6 to 2.0 g/kg bodyweight
    if daily_budget_inr < 50.0:
        protein_multiplier = 1.4 # Minimum effective dose to prevent impossible budget targets
        budget_note = "Budget is lean (<₹50/day). Optimized for highest protein density per rupee (soya chunks, eggs, roasted chana)."
    elif daily_budget_inr < 90.0:
        protein_multiplier = 1.7
        budget_note = "Balanced student budget (₹50-₹90/day). Healthy mix of dairy, pulses, and whole eggs/tofu."
    else:
        protein_multiplier = 2.0
        budget_note = "Comfortable budget (>₹90/day). Ample room for paneer, curd, milk, chicken breast or whey."

    target_protein_g = round(weight_kg * protein_multiplier, 0)
    
    # Macro distribution
    # 1g Protein = 4 kcal, 1g Carb = 4 kcal, 1g Fat = 9 kcal
    protein_calories = target_protein_g * 4.0
    fat_calories = target_calories * 0.25 # 25% of total calories from healthy fats
    target_fat_g = round(fat_calories / 9.0, 0)
    
    carb_calories = max(400.0, target_calories - protein_calories - fat_calories)
    target_carbs_g = round(carb_calories / 4.0, 0)

    protein_per_rupee = round(target_protein_g / max(1.0, daily_budget_inr), 2)

    return {
        "bmi": bmi,
        "bmi_category": bmi_category,
        "bmi_notes": bmi_notes,
        "bmr": bmr,
        "tdee": tdee,
        "target_calories": round(target_calories, 0),
        "target_protein_g": target_protein_g,
        "target_carbs_g": target_carbs_g,
        "target_fat_g": target_fat_g,
        "target_cost_inr": daily_budget_inr,
        "protein_per_rupee": protein_per_rupee,
        "limitations_notes": f"{budget_note} All caloric guidelines are progressive estimates."
    }
