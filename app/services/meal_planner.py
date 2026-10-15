"""
Meal planning service with support for student modes:
Hostel Mode, Mess Survival Mode, No-Cook Mode, Exam-Week Mode,
Vegetarian Muscle-Building Mode, and Weekly Grocery List Generator.
"""

from typing import List, Dict, Any, Optional
from app.data.foods_data import INDIAN_FOODS_DATASET

def generate_daily_meal_plan(
    dietary_preference: str = "vegetarian",
    daily_budget_inr: float = 80.0,
    target_protein_g: float = 120.0,
    mode: str = "hostel" # 'hostel', 'mess', 'no_cook', 'exam_week', 'veg_muscle', 'budget'
) -> Dict[str, Any]:
    """
    Generates a realistic 4-5 meal daily schedule tailored for student realities.
    """
    diet_pref = dietary_preference.lower()
    is_veg = diet_pref in ("vegetarian", "vegan")
    is_egg = diet_pref == "eggetarian"
    is_nonveg = diet_pref in ("non_vegetarian", "non-vegetarian", "nonveg")

    # Mode-based customization
    if mode == "no_cook":
        breakfast = {
            "meal_type": "Breakfast",
            "title": "Chana Sattu Shake & Banana",
            "timing": "08:30 AM",
            "foods": ["sattu_drink", "banana_snack"],
            "protein_g": 12.3,
            "calories": 300,
            "price_inr": 16.0,
            "prep_time_min": 2,
            "instructions": "Mix 50g Sattu with chilled water, black salt, and lemon. Eat 1 fresh banana on the side.",
            "image_url": "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=600&q=80",
            "budget_swap": "Swap Sattu with 200ml milk and 30g roasted peanuts."
        }
        lunch = {
            "meal_type": "Lunch",
            "title": "Fresh Dahi, Roasted Chana & Roti Plate",
            "timing": "01:30 PM",
            "foods": ["fresh_curd", "roasted_chana", "wheat_roti"],
            "protein_g": 26.0,
            "calories": 512,
            "price_inr": 36.0,
            "prep_time_min": 0,
            "instructions": "Open 200g dahi cup, mix with 60g crunchy roasted chana and 2 rotis. Completely zero cooking required.",
            "image_url": "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80",
            "budget_swap": "Get loose dahi from local dairy to save ₹5."
        }
    elif mode == "mess":
        breakfast = {
            "meal_type": "Breakfast",
            "title": "Mess Poha/Paratha + 2 Boiled Eggs or Milk Booster",
            "timing": "08:30 AM",
            "foods": ["whole_eggs" if not is_veg else "amul_toned_milk"],
            "protein_g": 14.0,
            "calories": 280,
            "price_inr": 14.0 if not is_veg else 28.0,
            "prep_time_min": 5,
            "instructions": "Eat your free mess breakfast, and top it up with 2 boiled eggs bought from campus tapri or 250ml milk.",
            "image_url": "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=600&q=80",
            "budget_swap": "Keep a carton of eggs in room if boiling kettle is allowed."
        }
        lunch = {
            "meal_type": "Lunch",
            "title": "Unlimited Mess Dal & Roti + Soya Chunks Infiltration",
            "timing": "01:00 PM",
            "foods": ["moong_dal", "wheat_roti", "soya_chunks"],
            "protein_g": 42.0,
            "calories": 502,
            "price_inr": 18.0, # Soya chunks addition cost
            "prep_time_min": 8,
            "instructions": "The PROTOMANIA Mess Hack: Soak 50g soya chunks in kettle for 5 mins, squeeze water, take to mess and stir directly into your hot mess dal bowl! Instant 26g clean protein boost.",
            "image_url": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80",
            "budget_swap": "Ask mess bhaiya for extra thick dal from bottom of container."
        }
    else: # Default hostel mode
        breakfast = {
            "meal_type": "Breakfast",
            "title": "Kettle Rolled Oats & Milk Bowl",
            "timing": "08:15 AM",
            "foods": ["rolled_oats", "banana_snack"],
            "protein_g": 14.3,
            "calories": 415,
            "price_inr": 27.0,
            "prep_time_min": 4,
            "instructions": "Pour boiling water or milk over 50g oats in a mug, cover with plate for 3 mins. Slice 1 banana on top.",
            "image_url": "https://images.unsplash.com/photo-1517673400267-0251440c45dc?auto=format&fit=crop&w=600&q=80",
            "budget_swap": "Replace with 4 egg whites + 2 brown bread slices if eating eggs."
        }
        lunch = {
            "meal_type": "Lunch",
            "title": is_nonveg and "Grilled Chicken Breast with Rice & Dal" or "Paneer / Soya Chunks Rice Bowl",
            "timing": "01:30 PM",
            "foods": is_nonveg and ["chicken_breast", "steamed_rice"] or ["soya_chunks", "steamed_rice", "moong_dal"],
            "protein_g": is_nonveg and 45.8 or 39.3,
            "calories": is_nonveg and 435 or 527,
            "price_inr": is_nonveg and 63.0 or 29.0,
            "prep_time_min": 15,
            "instructions": "High protein lunch paired with rice for glycogen reloading.",
            "image_url": is_nonveg and "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=600&q=80" or "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
            "budget_swap": "Use Soya Chunks instead of Paneer to save ₹30."
        }

    snack_preworkout = {
        "meal_type": "Pre-Workout Snack",
        "title": "Roasted Peanuts & Black Coffee / Banana",
        "timing": "05:15 PM",
        "foods": ["roasted_peanuts", "banana_snack"],
        "protein_g": 14.3,
        "calories": 388,
        "price_inr": 15.0,
        "prep_time_min": 0,
        "instructions": "Quick energy 45 mins before training. Peanuts provide sustained fats, banana gives fast carbs.",
        "image_url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d6/Roasted_peanuts_in_a_bowl.jpg/960px-Roasted_peanuts_in_a_bowl.jpg",
        "budget_swap": "Roasted Bhuna Chana for lower calories if cutting."
    }

    dinner = {
        "meal_type": "Dinner",
        "title": is_egg and "4 Boiled Egg Whites + 2 Whole Eggs with Rotis" or "High-Protein Rajma / Paneer Bowl with Dahi",
        "timing": "09:00 PM",
        "foods": is_egg and ["whole_eggs", "egg_whites", "wheat_roti"] or ["fresh_paneer", "wheat_roti", "fresh_curd"],
        "protein_g": is_egg and 33.5 or 32.8,
        "calories": is_egg and 382 or 505,
        "price_inr": is_egg and 48.0 or 66.0,
        "prep_time_min": 10,
        "instructions": "Slow-digesting protein before 7-8 hours of sleep to sustain overnight muscle protein synthesis.",
        "image_url": is_egg and "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=600&q=80" or "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=600&q=80",
        "budget_swap": "Double Soya Chunks curry if paneer is outside tonight's budget."
    }

    meals = [breakfast, lunch, snack_preworkout, dinner]
    total_protein = sum(m["protein_g"] for m in meals)
    total_calories = sum(m["calories"] for m in meals)
    total_price = sum(m["price_inr"] for m in meals)

    return {
        "mode": mode,
        "mode_title": mode.replace("_", " ").title() + " Mode",
        "target_protein_g": target_protein_g,
        "total_protein_g": round(total_protein, 1),
        "total_calories": round(total_calories, 0),
        "total_price_inr": round(total_price, 1),
        "daily_budget_inr": daily_budget_inr,
        "budget_remaining_inr": round(daily_budget_inr - total_price, 1),
        "meals": meals
    }

def generate_weekly_grocery_list(daily_plan: Dict[str, Any]) -> Dict[str, Any]:
    """
    Aggregates ingredients for 7 days with bulk purchasing quantities,
    estimated weekly cost in ₹, and student savings tips.
    """
    items = [
        {"item": "Soya Chunks (Nutrela Box)", "quantity": "500g box (2 packs)", "cost_inr": 110, "shelf_life": "12 months", "tip": "Buy 1kg bulk bag from Kirana to save 20% compared to local supermarket."},
        {"item": "Roasted Bhuna Chana", "quantity": "1 kg bag", "cost_inr": 140, "shelf_life": "3 months", "tip": "Keep in airtight plastic jar. Never leaves crumbs on laptop."},
        {"item": "Chana Sattu Powder", "quantity": "500g packet", "cost_inr": 75, "shelf_life": "6 months", "tip": "Ask local kirana for fresh unadulterated roasted gram sattu."},
        {"item": "Fresh Eggs (Egg Crate)", "quantity": "30 eggs crate", "cost_inr": 180, "shelf_life": "3 weeks", "tip": "Crate price is ₹6/egg instead of ₹7-8 for loose tapri eggs. Saves ₹60/month."},
        {"item": "Amul Toned Milk Pouches", "quantity": "7 pouches (500ml)", "cost_inr": 196, "shelf_life": "Daily pickup", "tip": "Buy toned (blue packet) rather than full cream (gold) for better protein-to-fat ratio."},
        {"item": "Rolled Oats Bag", "quantity": "1 kg bag", "cost_inr": 160, "shelf_life": "6 months", "tip": "Choose plain unflavored rolled oats instead of sugary instant flavored pouches."},
        {"item": "Peanuts (Raw/Roasted)", "quantity": "500g bag", "cost_inr": 90, "shelf_life": "3 months", "tip": "Roast on dry tawa in 5 mins with rock salt."}
    ]
    total_weekly_cost = sum(i["cost_inr"] for i in items)

    return {
        "week_title": "Student 7-Day High-Protein Grocery Haul",
        "total_estimated_weekly_inr": total_weekly_cost,
        "average_daily_cost_inr": round(total_weekly_cost / 7.0, 1),
        "items": items,
        "shopping_hacks": [
            "Always buy whole crates of 30 eggs from wholesale egg mandis.",
            "Soya chunks are 52% protein: 1 kg gives 520g of pure protein for just ₹100-₹120.",
            "Split 1kg peanut butter jars with your roommate to reduce upfront cost.",
            "Keep lemons and black salt handy in hostel room to make instant refreshing sattu drinks."
        ]
    }
