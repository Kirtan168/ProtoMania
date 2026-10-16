"""
PROTOMANIA Dynamic Meal Planning Engine
Accurately generates realistic, student-focused 4-meal daily schedules that
strictly adapt to user budget tiers (₹60, ₹80, ₹100, ₹120, ₹150+), dietary
preferences (Vegetarian, Eggetarian, Non-Vegetarian), and living conditions
(Hostel, Mess Survival, Zero-Cook, Exam-Week, Veg Muscle).
"""

from typing import List, Dict, Any, Optional

def generate_daily_meal_plan(
    dietary_preference: str = "vegetarian",
    daily_budget_inr: float = 80.0,
    target_protein_g: float = 120.0,
    mode: str = "hostel" # 'hostel', 'mess', 'no_cook', 'exam_week', 'veg_muscle'
) -> Dict[str, Any]:
    """
    Generates a personalized daily meal plan tailored precisely to the user's
    daily budget, dietary preference, and student living constraints.
    """
    diet_pref = (dietary_preference or "vegetarian").lower()
    is_veg = diet_pref in ("vegetarian", "vegan")
    is_egg = diet_pref == "eggetarian"
    is_nonveg = diet_pref in ("non_vegetarian", "non-vegetarian", "nonveg")

    # Determine budget tier
    b = float(daily_budget_inr or 80.0)
    if b < 75.0:
        tier_key = "tier_60"
        tier_title = "Hostel Survival Tier (₹60 - ₹70/day)"
        tier_tagline = "Maximum protein per rupee using high-efficiency staples (Sattu, Soya Chunks, Roasted Chana)."
    elif b < 95.0:
        tier_key = "tier_80"
        tier_title = "Smart Student Standard (₹80/day)"
        tier_tagline = "Balanced nutrition featuring oats, milk, high-protein soya pulao, and fresh curd."
    elif b < 115.0:
        tier_key = "tier_100"
        tier_title = "Performance Booster (₹100/day)"
        tier_tagline = "Upgraded variety with peanut butter, enhanced dairy, and paneer/egg bhurji combos."
    elif b < 140.0:
        tier_key = "tier_120"
        tier_title = "Hypertrophy Tier (₹120/day)"
        tier_tagline = "Real 100g dairy paneer, juicy chicken breast, multi-egg stacks, and rich oatmeal."
    else:
        tier_key = "tier_150"
        tier_title = "Pro Campus Athlete (₹150+/day)"
        tier_tagline = "Top-shelf student bodybuilding stack with peak protein density and high-calorie muscle fuel."

    # Generate meals based on tier, diet, and mode
    if tier_key == "tier_60":
        # Ultra-budget: target ~₹58 - ₹68
        if is_veg or mode == "veg_muscle":
            breakfast = {
                "meal_type": "Breakfast",
                "title": "Chana Sattu & Lemon Shake + 1 Fresh Banana",
                "timing": "08:30 AM",
                "foods": ["sattu_drink", "banana_snack"],
                "protein_g": 13.0,
                "calories": 290,
                "price_inr": 15.0,
                "prep_time_min": 2,
                "instructions": "Mix 50g roasted chana sattu in chilled water with black salt and half a lemon. Drink right away with 1 ripe banana. 0 min stove time.",
                "image_url": "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=600&q=80",
                "budget_swap": "Buy 1kg sattu bag from local wholesale kirana for ₹140 to get ₹7/serving."
            }
            lunch = {
                "meal_type": "Lunch",
                "title": "Thick Mess Dal + 50g Soya Chunks + Steamed Rice",
                "timing": "01:15 PM",
                "foods": ["soya_chunks", "moong_dal", "steamed_rice"],
                "protein_g": 36.5,
                "calories": 485,
                "price_inr": 16.0,
                "prep_time_min": 5,
                "instructions": "Soak 50g soya chunks in hot kettle water for 5 minutes, squeeze dry, and stir into your campus mess dal with rice for an instant 26g protein upgrade.",
                "image_url": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80",
                "budget_swap": "Get loose soya chunks from wholesale stores at ₹90/kg."
            }
            snack = {
                "meal_type": "Pre-Workout Snack",
                "title": "Roasted Bhuna Chana (40g) + Hot Black Coffee",
                "timing": "05:15 PM",
                "foods": ["roasted_chana"],
                "protein_g": 8.5,
                "calories": 155,
                "price_inr": 9.0,
                "prep_time_min": 0,
                "instructions": "Crunchy roasted chana directly from your desk jar with black coffee 45 minutes before hitting the campus gym or calisthenics.",
                "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Torraos-Las_Mayas-2011.JPG/960px-Torraos-Las_Mayas-2011.JPG",
                "budget_swap": "Keep a 1kg plastic container on your desk to prevent canteen snacking."
            }
            dinner = {
                "meal_type": "Dinner",
                "title": "Quick Soya Bhurji (40g) + 3 Wheat Rotis & Onion Salad",
                "timing": "08:45 PM",
                "foods": ["soya_chunks", "wheat_roti"],
                "protein_g": 26.0,
                "calories": 410,
                "price_inr": 18.0,
                "prep_time_min": 8,
                "instructions": "Chop boiled soya chunks, sauté with green chillies, turmeric, salt, and cumin in 1 tsp oil. Enjoy with 3 mess rotis.",
                "image_url": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
                "budget_swap": "Substitute with 1 bowl thickened moong dal if kettle cooking is restricted."
            }
        elif is_egg:
            breakfast = {
                "meal_type": "Breakfast",
                "title": "3 Boiled Eggs (1 whole + 2 whites) + 1 Banana",
                "timing": "08:30 AM",
                "foods": ["whole_eggs", "egg_whites", "banana_snack"],
                "protein_g": 17.0,
                "calories": 220,
                "price_inr": 21.0,
                "prep_time_min": 8,
                "instructions": "Boil 3 eggs in hostel kettle with egg rack. Peel, sprinkle chaat masala, and eat with 1 banana.",
                "image_url": "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=600&q=80",
                "budget_swap": "Buy eggs in 30-egg wholesale crates for ₹6 each instead of tapri prices."
            }
            lunch = {
                "meal_type": "Lunch",
                "title": "Kettle Soya Chunks (40g) & Mess Dal Rice",
                "timing": "01:15 PM",
                "foods": ["soya_chunks", "moong_dal", "steamed_rice"],
                "protein_g": 30.0,
                "calories": 450,
                "price_inr": 14.0,
                "prep_time_min": 5,
                "instructions": "Infiltrate mess dal with soaked soya chunks for cheap clean protein.",
                "image_url": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80",
                "budget_swap": "Ask mess staff for extra dal ladle."
            }
            snack = {
                "meal_type": "Pre-Workout Snack",
                "title": "Roasted Bhuna Chana (35g) + Black Coffee",
                "timing": "05:15 PM",
                "foods": ["roasted_chana"],
                "protein_g": 7.5,
                "calories": 135,
                "price_inr": 8.0,
                "prep_time_min": 0,
                "instructions": "Pre-workout energy booster with complex carbs and plant protein.",
                "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Torraos-Las_Mayas-2011.JPG/960px-Torraos-Las_Mayas-2011.JPG",
                "budget_swap": "Eat plain roasted peanuts if chana is out of stock."
            }
            dinner = {
                "meal_type": "Dinner",
                "title": "2 Boiled Whole Eggs Masala Curry with 3 Rotis",
                "timing": "08:45 PM",
                "foods": ["whole_eggs", "wheat_roti"],
                "protein_g": 19.5,
                "calories": 390,
                "price_inr": 19.0,
                "prep_time_min": 10,
                "instructions": "Halve 2 boiled eggs and toss into a quick onion-tomato gravy with 3 rotis.",
                "image_url": "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=600&q=80",
                "budget_swap": "Eat boiled eggs plain with salt to skip cooking."
            }
        else: # Non-veg
            breakfast = {
                "meal_type": "Breakfast",
                "title": "3 Boiled Eggs (1 whole + 2 whites) + 1 Banana",
                "timing": "08:30 AM",
                "foods": ["whole_eggs", "egg_whites", "banana_snack"],
                "protein_g": 17.0,
                "calories": 220,
                "price_inr": 21.0,
                "prep_time_min": 8,
                "instructions": "Fast morning protein with boiled eggs from kettle.",
                "image_url": "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=600&q=80",
                "budget_swap": "Whole egg crate purchase saves ₹50 per week."
            }
            lunch = {
                "meal_type": "Lunch",
                "title": "Chicken Liver & Soya Dal Rice Bowl",
                "timing": "01:15 PM",
                "foods": ["chicken_breast", "soya_chunks", "steamed_rice"],
                "protein_g": 38.0,
                "calories": 470,
                "price_inr": 20.0,
                "prep_time_min": 12,
                "instructions": "Chicken liver / mess chicken gravy supplemented with soya chunks for extreme budget economy.",
                "image_url": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80",
                "budget_swap": "Chicken liver costs only ₹80-₹100/kg from local butchers."
            }
            snack = {
                "meal_type": "Pre-Workout Snack",
                "title": "Roasted Bhuna Chana (35g) + Water/Tea",
                "timing": "05:15 PM",
                "foods": ["roasted_chana"],
                "protein_g": 7.5,
                "calories": 135,
                "price_inr": 8.0,
                "prep_time_min": 0,
                "instructions": "Quick clean crunch before evening training.",
                "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Torraos-Las_Mayas-2011.JPG/960px-Torraos-Las_Mayas-2011.JPG",
                "budget_swap": "Swap with 30g roasted peanuts."
            }
            dinner = {
                "meal_type": "Dinner",
                "title": "2 Boiled Whole Eggs Curry + 3 Wheat Rotis",
                "timing": "08:45 PM",
                "foods": ["whole_eggs", "wheat_roti"],
                "protein_g": 19.5,
                "calories": 390,
                "price_inr": 18.0,
                "prep_time_min": 8,
                "instructions": "High satiety egg curry before sleeping.",
                "image_url": "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=600&q=80",
                "budget_swap": "Add 20g soya chunks for +10g protein for ₹5."
            }

    elif tier_key == "tier_80":
        # Smart Student Standard: target ₹78 - ₹80
        if is_veg or mode == "veg_muscle":
            breakfast = {
                "meal_type": "Breakfast",
                "title": "Kettle Rolled Oats (40g) with 150ml Milk & Banana",
                "timing": "08:15 AM",
                "foods": ["rolled_oats", "amul_toned_milk", "banana_snack"],
                "protein_g": 12.5,
                "calories": 340,
                "price_inr": 22.0,
                "prep_time_min": 4,
                "instructions": "Pour 150ml boiling toned milk over 40g rolled oats in your hostel mug. Cover for 3 minutes and slice half a banana on top.",
                "image_url": "https://images.unsplash.com/photo-1517673400267-0251440c45dc?auto=format&fit=crop&w=600&q=80",
                "budget_swap": "Use loose rolled oats from Kirana instead of branded boxed oats."
            }
            lunch = {
                "meal_type": "Lunch",
                "title": "High-Protein Soya Chunks (50g) Pulao with 100g Fresh Dahi",
                "timing": "01:30 PM",
                "foods": ["soya_chunks", "fresh_curd", "steamed_rice"],
                "protein_g": 34.0,
                "calories": 510,
                "price_inr": 24.0,
                "prep_time_min": 10,
                "instructions": "Boil 50g soya chunks in kettle, squeeze out water, and mix with mess steamed rice and 100g fresh curd seasoned with jeera powder.",
                "image_url": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
                "budget_swap": "Get loose fresh dahi from local dairy instead of branded cups to save ₹4."
            }
            snack = {
                "meal_type": "Pre-Workout Snack",
                "title": "Roasted Peanuts (35g) + 1 Fresh Banana",
                "timing": "05:15 PM",
                "foods": ["roasted_peanuts", "banana_snack"],
                "protein_g": 10.5,
                "calories": 290,
                "price_inr": 12.0,
                "prep_time_min": 0,
                "instructions": "Crunchy roasted peanuts provide sustained mono-unsaturated fats and banana gives fast carbs 45 mins before training.",
                "image_url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d6/Roasted_peanuts_in_a_bowl.jpg/960px-Roasted_peanuts_in_a_bowl.jpg",
                "budget_swap": "Roast raw peanuts on dry pan on Sunday to last all week."
            }
            dinner = {
                "meal_type": "Dinner",
                "title": "Fresh Dahi (150g) & Thick Moong Dal Tadka with 3 Rotis",
                "timing": "09:00 PM",
                "foods": ["fresh_curd", "moong_dal", "wheat_roti"],
                "protein_g": 22.0,
                "calories": 460,
                "price_inr": 21.0,
                "prep_time_min": 8,
                "instructions": "High-protein vegetarian dinner pairing legumes with dairy casein for sustained overnight muscle protein synthesis.",
                "image_url": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80",
                "budget_swap": "Double the dal portion if you prefer warmer comfort food."
            }
        elif is_egg:
            breakfast = {
                "meal_type": "Breakfast",
                "title": "3 Boiled Whole Eggs + 2 Slices Brown Bread",
                "timing": "08:15 AM",
                "foods": ["whole_eggs", "wheat_roti"],
                "protein_g": 21.0,
                "calories": 320,
                "price_inr": 25.0,
                "prep_time_min": 8,
                "instructions": "3 kettle-boiled eggs peeled and salted, served with 2 bread slices or 1 roti.",
                "image_url": "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=600&q=80",
                "budget_swap": "Wholesale eggs cost ₹6/egg in a 30-tray."
            }
            lunch = {
                "meal_type": "Lunch",
                "title": "Soya Chunks (40g) Vegetable Khichdi with Dahi",
                "timing": "01:30 PM",
                "foods": ["soya_chunks", "fresh_curd", "steamed_rice"],
                "protein_g": 28.5,
                "calories": 480,
                "price_inr": 22.0,
                "prep_time_min": 10,
                "instructions": "Protein-dense comfort khichdi/rice with soaked soya and cool dahi.",
                "image_url": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
                "budget_swap": "Substitute with mess dal rice."
            }
            snack = {
                "meal_type": "Pre-Workout Snack",
                "title": "Roasted Peanuts (35g) + 1 Banana",
                "timing": "05:15 PM",
                "foods": ["roasted_peanuts", "banana_snack"],
                "protein_g": 10.5,
                "calories": 290,
                "price_inr": 12.0,
                "prep_time_min": 0,
                "instructions": "Natural energy snack before training.",
                "image_url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d6/Roasted_peanuts_in_a_bowl.jpg/960px-Roasted_peanuts_in_a_bowl.jpg",
                "budget_swap": "Roasted chana if cutting calories."
            }
            dinner = {
                "meal_type": "Dinner",
                "title": "2 Whole Eggs + 2 Egg Whites Curry with 3 Rotis",
                "timing": "09:00 PM",
                "foods": ["whole_eggs", "egg_whites", "wheat_roti"],
                "protein_g": 23.0,
                "calories": 390,
                "price_inr": 20.0,
                "prep_time_min": 10,
                "instructions": "High protein, low fat egg curry cooked with spices and eaten with rotis.",
                "image_url": "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=600&q=80",
                "budget_swap": "Add raw onion and lemon on side."
            }
        else: # Non-veg
            breakfast = {
                "meal_type": "Breakfast",
                "title": "3 Boiled Whole Eggs + 2 Slices Bread",
                "timing": "08:15 AM",
                "foods": ["whole_eggs", "wheat_roti"],
                "protein_g": 21.0,
                "calories": 320,
                "price_inr": 25.0,
                "prep_time_min": 8,
                "instructions": "Boiled eggs and toast.",
                "image_url": "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=600&q=80",
                "budget_swap": "Egg crate buying saves ₹2 per egg."
            }
            lunch = {
                "meal_type": "Lunch",
                "title": "Egg & Soya Rice Bowl with Dahi",
                "timing": "01:30 PM",
                "foods": ["whole_eggs", "soya_chunks", "steamed_rice"],
                "protein_g": 31.0,
                "calories": 490,
                "price_inr": 24.0,
                "prep_time_min": 10,
                "instructions": "Double protein source bowl with rice.",
                "image_url": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
                "budget_swap": "Use mess rice."
            }
            snack = {
                "meal_type": "Pre-Workout Snack",
                "title": "Roasted Peanuts (35g) + Banana",
                "timing": "05:15 PM",
                "foods": ["roasted_peanuts", "banana_snack"],
                "protein_g": 10.5,
                "calories": 290,
                "price_inr": 12.0,
                "prep_time_min": 0,
                "instructions": "Energy booster.",
                "image_url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d6/Roasted_peanuts_in_a_bowl.jpg/960px-Roasted_peanuts_in_a_bowl.jpg",
                "budget_swap": "Roasted Chana."
            }
            dinner = {
                "meal_type": "Dinner",
                "title": "Homestyle Egg Curry (2 Eggs) with Dal & 3 Rotis",
                "timing": "09:00 PM",
                "foods": ["whole_eggs", "moong_dal", "wheat_roti"],
                "protein_g": 19.5,
                "calories": 430,
                "price_inr": 18.0,
                "prep_time_min": 10,
                "instructions": "Egg curry with hot rotis.",
                "image_url": "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=600&q=80",
                "budget_swap": "Mess gravy with boiled eggs."
            }

    elif tier_key == "tier_100":
        # Performance Booster: target ₹96 - ₹100
        if is_veg or mode == "veg_muscle":
            breakfast = {
                "meal_type": "Breakfast",
                "title": "High-Protein Oats (50g) in 200ml Milk + 1 tbsp Peanut Butter",
                "timing": "08:15 AM",
                "foods": ["rolled_oats", "amul_toned_milk", "peanut_butter"],
                "protein_g": 17.5,
                "calories": 420,
                "price_inr": 30.0,
                "prep_time_min": 4,
                "instructions": "Cook 50g rolled oats with 200ml milk, stir in 1 tbsp creamy peanut butter for rich taste and anabolic fats.",
                "image_url": "https://images.unsplash.com/photo-1517673400267-0251440c45dc?auto=format&fit=crop&w=600&q=80",
                "budget_swap": "Buy 1kg peanut butter tub to get ₹8/serving."
            }
            lunch = {
                "meal_type": "Lunch",
                "title": "Soya Chunks (40g) & Fresh Paneer (40g) Rice Bowl with Salad",
                "timing": "01:30 PM",
                "foods": ["soya_chunks", "fresh_paneer", "steamed_rice"],
                "protein_g": 35.0,
                "calories": 540,
                "price_inr": 33.0,
                "prep_time_min": 10,
                "instructions": "Sauté 40g soaked soya chunks and 40g cubed paneer with mild spices over steamed rice with cucumbers.",
                "image_url": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
                "budget_swap": "Buy fresh dairy block paneer instead of packaged packets to save 25%."
            }
            snack = {
                "meal_type": "Pre-Workout Snack",
                "title": "Roasted Bhuna Chana (40g) + 150g Fresh Dahi Cup",
                "timing": "05:15 PM",
                "foods": ["roasted_chana", "fresh_curd"],
                "protein_g": 14.5,
                "calories": 230,
                "price_inr": 16.0,
                "prep_time_min": 0,
                "instructions": "Stir roasted chana directly into fresh curd with rock salt for a refreshing afternoon protein booster.",
                "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Torraos-Las_Mayas-2011.JPG/960px-Torraos-Las_Mayas-2011.JPG",
                "budget_swap": "Local dairy dahi ₹10 per 150g."
            }
            dinner = {
                "meal_type": "Dinner",
                "title": "High-Protein Rajma / Dal Makhani Lite + 3 Rotis & Salad",
                "timing": "09:00 PM",
                "foods": ["fresh_curd", "wheat_roti"],
                "protein_g": 21.0,
                "calories": 440,
                "price_inr": 19.0,
                "prep_time_min": 10,
                "instructions": "Fiber-dense rajma red kidney beans paired with whole wheat rotis.",
                "image_url": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80",
                "budget_swap": "Cook extra rajma on weekend to freeze."
            }
        elif is_egg:
            breakfast = {
                "meal_type": "Breakfast",
                "title": "4 Boiled Eggs (2 whole + 2 whites) + 2 Toast & Coffee",
                "timing": "08:15 AM",
                "foods": ["whole_eggs", "egg_whites"],
                "protein_g": 24.0,
                "calories": 340,
                "price_inr": 28.0,
                "prep_time_min": 8,
                "instructions": "4 eggs boiled, salted, with brown toast.",
                "image_url": "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=600&q=80",
                "budget_swap": "Egg crate buying."
            }
            lunch = {
                "meal_type": "Lunch",
                "title": "Soya-Egg Bhurji (40g Soya + 2 Eggs) with Steamed Rice",
                "timing": "01:30 PM",
                "foods": ["soya_chunks", "whole_eggs", "steamed_rice"],
                "protein_g": 35.0,
                "calories": 520,
                "price_inr": 29.0,
                "prep_time_min": 10,
                "instructions": "High-leucine hybrid bhurji.",
                "image_url": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
                "budget_swap": "Use kettle to boil soya first."
            }
            snack = {
                "meal_type": "Pre-Workout Snack",
                "title": "Roasted Peanuts (40g) + 1 Banana",
                "timing": "05:15 PM",
                "foods": ["roasted_peanuts", "banana_snack"],
                "protein_g": 12.0,
                "calories": 330,
                "price_inr": 15.0,
                "prep_time_min": 0,
                "instructions": "Energizing pre-workout snack.",
                "image_url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d6/Roasted_peanuts_in_a_bowl.jpg/960px-Roasted_peanuts_in_a_bowl.jpg",
                "budget_swap": "Roasted chana."
            }
            dinner = {
                "meal_type": "Dinner",
                "title": "3 Boiled Eggs Masala Curry with 3 Rotis & Salad",
                "timing": "09:00 PM",
                "foods": ["whole_eggs", "wheat_roti"],
                "protein_g": 22.0,
                "calories": 420,
                "price_inr": 26.0,
                "prep_time_min": 10,
                "instructions": "Flavorful egg curry with 3 rotis.",
                "image_url": "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=600&q=80",
                "budget_swap": "Mess rotis save ₹10."
            }
        else: # Non-veg
            breakfast = {
                "meal_type": "Breakfast",
                "title": "4 Boiled Eggs (2 whole + 2 whites) + 2 Slices Toast",
                "timing": "08:15 AM",
                "foods": ["whole_eggs", "egg_whites"],
                "protein_g": 24.0,
                "calories": 340,
                "price_inr": 28.0,
                "prep_time_min": 8,
                "instructions": "Eggs and toast with black coffee.",
                "image_url": "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=600&q=80",
                "budget_swap": "Wholesale eggs."
            }
            lunch = {
                "meal_type": "Lunch",
                "title": "Chicken Liver & Egg Bhurji Rice Bowl",
                "timing": "01:30 PM",
                "foods": ["chicken_breast", "whole_eggs", "steamed_rice"],
                "protein_g": 38.0,
                "calories": 510,
                "price_inr": 34.0,
                "prep_time_min": 12,
                "instructions": "Iron and protein powerhouse bowl.",
                "image_url": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80",
                "budget_swap": "Substitute with mess chicken on chicken days."
            }
            snack = {
                "meal_type": "Pre-Workout Snack",
                "title": "Roasted Peanuts (40g) & Banana",
                "timing": "05:15 PM",
                "foods": ["roasted_peanuts", "banana_snack"],
                "protein_g": 12.0,
                "calories": 330,
                "price_inr": 14.0,
                "prep_time_min": 0,
                "instructions": "Natural energy snack.",
                "image_url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d6/Roasted_peanuts_in_a_bowl.jpg/960px-Roasted_peanuts_in_a_bowl.jpg",
                "budget_swap": "Roasted chana."
            }
            dinner = {
                "meal_type": "Dinner",
                "title": "Homestyle 3-Egg Curry with 3 Rotis & Dal",
                "timing": "09:00 PM",
                "foods": ["whole_eggs", "moong_dal", "wheat_roti"],
                "protein_g": 22.0,
                "calories": 420,
                "price_inr": 22.0,
                "prep_time_min": 10,
                "instructions": "3 boiled eggs in curry sauce with rotis.",
                "image_url": "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=600&q=80",
                "budget_swap": "Add 20g soya chunks."
            }

    elif tier_key == "tier_120":
        # Hypertrophy Tier: target ₹116 - ₹120
        if is_veg or mode == "veg_muscle":
            breakfast = {
                "meal_type": "Breakfast",
                "title": "Creamy Peanut Butter Oats (50g) in 250ml Milk + Banana & Almonds",
                "timing": "08:15 AM",
                "foods": ["rolled_oats", "amul_toned_milk", "peanut_butter", "banana_snack"],
                "protein_g": 20.0,
                "calories": 490,
                "price_inr": 35.0,
                "prep_time_min": 4,
                "instructions": "Thick creamy oats cooked in 250ml milk, 1.5 tbsp peanut butter, sliced banana, and 5 crushed almonds.",
                "image_url": "https://images.unsplash.com/photo-1517673400267-0251440c45dc?auto=format&fit=crop&w=600&q=80",
                "budget_swap": "Buy 500ml milk pouch for ₹28 and split across breakfast and night."
            }
            lunch = {
                "meal_type": "Lunch",
                "title": "80g Fresh Paneer Tikka + 30g Soya Chunks over Jeera Rice",
                "timing": "01:30 PM",
                "foods": ["fresh_paneer", "soya_chunks", "steamed_rice"],
                "protein_g": 33.5,
                "calories": 580,
                "price_inr": 42.0,
                "prep_time_min": 12,
                "instructions": "80g pure dairy paneer cubes sautéed with 30g soaked soya chunks in a tomato-onion masala gravy over jeera rice.",
                "image_url": "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=600&q=80",
                "budget_swap": "Local dairy paneer costs ₹350/kg (₹28 for 80g)."
            }
            snack = {
                "meal_type": "Pre-Workout Snack",
                "title": "Roasted Bhuna Chana (40g) + 200g Fresh Dahi Bowl",
                "timing": "05:15 PM",
                "foods": ["roasted_chana", "fresh_curd"],
                "protein_g": 16.5,
                "calories": 250,
                "price_inr": 19.0,
                "prep_time_min": 0,
                "instructions": "Thick 200g dahi bowl with crunchy roasted chana for afternoon satiety and sustained digestion.",
                "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Torraos-Las_Mayas-2011.JPG/960px-Torraos-Las_Mayas-2011.JPG",
                "budget_swap": "Add black salt and roasted cumin powder."
            }
            dinner = {
                "meal_type": "Dinner",
                "title": "Moong Dal Tadka + 50g Paneer Bhurji with 3 Multigrain Rotis",
                "timing": "09:00 PM",
                "foods": ["fresh_paneer", "moong_dal", "wheat_roti"],
                "protein_g": 28.0,
                "calories": 490,
                "price_inr": 22.0,
                "prep_time_min": 10,
                "instructions": "Fresh paneer bhurji paired with rotis and yellow moong dal for balanced complete amino acid profile.",
                "image_url": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80",
                "budget_swap": "Swap paneer for soya on days you want to save ₹15."
            }
        elif is_egg:
            breakfast = {
                "meal_type": "Breakfast",
                "title": "4 Boiled Eggs (2 whole + 2 whites) with 2 Butter Rotis & Milk",
                "timing": "08:15 AM",
                "foods": ["whole_eggs", "egg_whites", "amul_toned_milk"],
                "protein_g": 26.0,
                "calories": 410,
                "price_inr": 32.0,
                "prep_time_min": 8,
                "instructions": "4 eggs boiled, salted, with warm rotis and a glass of milk.",
                "image_url": "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=600&q=80",
                "budget_swap": "Egg crate purchasing."
            }
            lunch = {
                "meal_type": "Lunch",
                "title": "75g Fresh Paneer & 2-Egg Scramble with Steamed Rice & Dal",
                "timing": "01:30 PM",
                "foods": ["fresh_paneer", "whole_eggs", "steamed_rice"],
                "protein_g": 36.5,
                "calories": 590,
                "price_inr": 42.0,
                "prep_time_min": 12,
                "instructions": "Paneer egg scramble over basmati rice.",
                "image_url": "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=600&q=80",
                "budget_swap": "Use fresh dairy paneer."
            }
            snack = {
                "meal_type": "Pre-Workout Snack",
                "title": "Roasted Peanuts (40g) + 200ml Toned Milk",
                "timing": "05:15 PM",
                "foods": ["roasted_peanuts", "amul_toned_milk"],
                "protein_g": 17.5,
                "calories": 340,
                "price_inr": 20.0,
                "prep_time_min": 0,
                "instructions": "High protein pre-workout drink with peanuts.",
                "image_url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d6/Roasted_peanuts_in_a_bowl.jpg/960px-Roasted_peanuts_in_a_bowl.jpg",
                "budget_swap": "Drink milk cold with cocoa powder."
            }
            dinner = {
                "meal_type": "Dinner",
                "title": "4 Boiled Egg Whites + 1 Whole Egg Curry with 3 Rotis",
                "timing": "09:00 PM",
                "foods": ["egg_whites", "whole_eggs", "wheat_roti"],
                "protein_g": 22.5,
                "calories": 380,
                "price_inr": 24.0,
                "prep_time_min": 10,
                "instructions": "Lean egg white heavy curry before sleep.",
                "image_url": "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=600&q=80",
                "budget_swap": "Mess rotis."
            }
        else: # Non-veg
            breakfast = {
                "meal_type": "Breakfast",
                "title": "4 Boiled Eggs (2 whole + 2 whites) with 2 Bread Slices & Milk",
                "timing": "08:15 AM",
                "foods": ["whole_eggs", "egg_whites", "amul_toned_milk"],
                "protein_g": 27.0,
                "calories": 390,
                "price_inr": 32.0,
                "prep_time_min": 8,
                "instructions": "Eggs, toast, and milk.",
                "image_url": "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=600&q=80",
                "budget_swap": "Wholesale eggs."
            }
            lunch = {
                "meal_type": "Lunch",
                "title": "120g Juicy Grilled Chicken Breast / Curry with Rice & Salad",
                "timing": "01:30 PM",
                "foods": ["chicken_breast", "steamed_rice"],
                "protein_g": 43.0,
                "calories": 510,
                "price_inr": 48.0,
                "prep_time_min": 15,
                "instructions": "120g skinless chicken breast marinated in curd, garlic, and tandoori spices, cooked in pan, paired with basmati rice.",
                "image_url": "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=600&q=80",
                "budget_swap": "Buy 1kg boneless chicken breast at ₹240/kg (₹29 for 120g) to save ₹19/day."
            }
            snack = {
                "meal_type": "Pre-Workout Snack",
                "title": "Roasted Peanuts (40g) & Banana",
                "timing": "05:15 PM",
                "foods": ["roasted_peanuts", "banana_snack"],
                "protein_g": 12.0,
                "calories": 330,
                "price_inr": 14.0,
                "prep_time_min": 0,
                "instructions": "Energy snack.",
                "image_url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d6/Roasted_peanuts_in_a_bowl.jpg/960px-Roasted_peanuts_in_a_bowl.jpg",
                "budget_swap": "Roasted chana."
            }
            dinner = {
                "meal_type": "Dinner",
                "title": "3 Boiled Egg Whites + 1 Whole Egg Gravy with 3 Rotis",
                "timing": "09:00 PM",
                "foods": ["egg_whites", "whole_eggs", "wheat_roti"],
                "protein_g": 21.0,
                "calories": 390,
                "price_inr": 24.0,
                "prep_time_min": 10,
                "instructions": "Egg curry with rotis.",
                "image_url": "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=600&q=80",
                "budget_swap": "Add soya chunks."
            }

    else: # tier_150 (Pro Campus Athlete: target ₹148 - ₹160)
        if is_veg or mode == "veg_muscle":
            breakfast = {
                "meal_type": "Breakfast",
                "title": "Anabolic Oats Shake (60g Oats, 300ml Milk, 2 tbsp PB, Banana, Almonds)",
                "timing": "08:15 AM",
                "foods": ["rolled_oats", "amul_toned_milk", "peanut_butter", "banana_snack"],
                "protein_g": 25.0,
                "calories": 580,
                "price_inr": 44.0,
                "prep_time_min": 5,
                "instructions": "High calorie muscle shake blending 60g oats, 300ml milk, 2 tbsp peanut butter, banana, and 6 almonds.",
                "image_url": "https://images.unsplash.com/photo-1517673400267-0251440c45dc?auto=format&fit=crop&w=600&q=80",
                "budget_swap": "Buy 1kg jars of peanut butter."
            }
            lunch = {
                "meal_type": "Lunch",
                "title": "120g Fresh Paneer Tikka + Soya Chunks (30g) over Jeera Rice & Dal",
                "timing": "01:30 PM",
                "foods": ["fresh_paneer", "soya_chunks", "steamed_rice", "moong_dal"],
                "protein_g": 44.0,
                "calories": 680,
                "price_inr": 55.0,
                "prep_time_min": 15,
                "instructions": "120g fresh paneer cubes and soya chunks sautéed in rich tomato gravy with rice and dal.",
                "image_url": "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=600&q=80",
                "budget_swap": "Buy 1kg block paneer from dairy."
            }
            snack = {
                "meal_type": "Pre-Workout Snack",
                "title": "200g Greek-Style Thick Curd + Roasted Chana (50g)",
                "timing": "05:15 PM",
                "foods": ["fresh_curd", "roasted_chana"],
                "protein_g": 19.5,
                "calories": 280,
                "price_inr": 22.0,
                "prep_time_min": 0,
                "instructions": "Thick hung curd with roasted chana for power workout fuel.",
                "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Torraos-Las_Mayas-2011.JPG/960px-Torraos-Las_Mayas-2011.JPG",
                "budget_swap": "Make hung curd using cloth overnight in hostel room."
            }
            dinner = {
                "meal_type": "Dinner",
                "title": "80g Paneer Bhurji + Thick Rajma with 3 Multigrain Rotis",
                "timing": "09:00 PM",
                "foods": ["fresh_paneer", "wheat_roti"],
                "protein_g": 33.0,
                "calories": 540,
                "price_inr": 31.0,
                "prep_time_min": 12,
                "instructions": "Paneer bhurji and kidney beans for complete amino recovery.",
                "image_url": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80",
                "budget_swap": "Mess rotis."
            }
        elif is_egg:
            breakfast = {
                "meal_type": "Breakfast",
                "title": "5 Boiled Eggs (3 whole + 2 whites) + 2 Toast with PB & Milk",
                "timing": "08:15 AM",
                "foods": ["whole_eggs", "egg_whites", "peanut_butter", "amul_toned_milk"],
                "protein_g": 34.0,
                "calories": 520,
                "price_inr": 44.0,
                "prep_time_min": 8,
                "instructions": "5 boiled eggs, peanut butter toast, and a glass of milk.",
                "image_url": "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=600&q=80",
                "budget_swap": "Buy egg crates."
            }
            lunch = {
                "meal_type": "Lunch",
                "title": "100g Fresh Paneer + 2 Egg Bhurji Rice Bowl",
                "timing": "01:30 PM",
                "foods": ["fresh_paneer", "whole_eggs", "steamed_rice"],
                "protein_g": 43.0,
                "calories": 650,
                "price_inr": 52.0,
                "prep_time_min": 12,
                "instructions": "Heavy bodybuilding protein lunch.",
                "image_url": "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=600&q=80",
                "budget_swap": "Fresh dairy paneer."
            }
            snack = {
                "meal_type": "Pre-Workout Snack",
                "title": "Roasted Peanuts (50g) + 250ml Milk",
                "timing": "05:15 PM",
                "foods": ["roasted_peanuts", "amul_toned_milk"],
                "protein_g": 20.0,
                "calories": 410,
                "price_inr": 24.0,
                "prep_time_min": 0,
                "instructions": "Pre-workout energy.",
                "image_url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d6/Roasted_peanuts_in_a_bowl.jpg/960px-Roasted_peanuts_in_a_bowl.jpg",
                "budget_swap": "Bulk peanuts."
            }
            dinner = {
                "meal_type": "Dinner",
                "title": "4 Boiled Eggs Masala Curry with 3 Rotis & Salad",
                "timing": "09:00 PM",
                "foods": ["whole_eggs", "wheat_roti"],
                "protein_g": 26.0,
                "calories": 460,
                "price_inr": 30.0,
                "prep_time_min": 10,
                "instructions": "4 egg curry with rotis.",
                "image_url": "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=600&q=80",
                "budget_swap": "Mess rotis."
            }
        else: # Non-veg
            breakfast = {
                "meal_type": "Breakfast",
                "title": "5 Boiled Eggs (2 whole + 3 whites) + 2 Toast + 200ml Milk",
                "timing": "08:15 AM",
                "foods": ["whole_eggs", "egg_whites", "amul_toned_milk"],
                "protein_g": 33.0,
                "calories": 460,
                "price_inr": 42.0,
                "prep_time_min": 8,
                "instructions": "5 eggs, toast, and milk.",
                "image_url": "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=600&q=80",
                "budget_swap": "Egg crates."
            }
            lunch = {
                "meal_type": "Lunch",
                "title": "150g Grilled Chicken Breast + Herb Rice & Sautéed Veggies",
                "timing": "01:30 PM",
                "foods": ["chicken_breast", "steamed_rice"],
                "protein_g": 51.0,
                "calories": 560,
                "price_inr": 58.0,
                "prep_time_min": 15,
                "instructions": "150g skinless chicken breast grilled with spices, paired with herb rice.",
                "image_url": "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=600&q=80",
                "budget_swap": "Wholesale butcher chicken breast ₹230/kg."
            }
            snack = {
                "meal_type": "Pre-Workout Snack",
                "title": "Roasted Peanuts (40g) + Chana Sattu Shake / Milk",
                "timing": "05:15 PM",
                "foods": ["roasted_peanuts", "sattu_drink"],
                "protein_g": 22.0,
                "calories": 340,
                "price_inr": 24.0,
                "prep_time_min": 2,
                "instructions": "Natural anabolic shake with peanuts.",
                "image_url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d6/Roasted_peanuts_in_a_bowl.jpg/960px-Roasted_peanuts_in_a_bowl.jpg",
                "budget_swap": "Bulk peanuts."
            }
            dinner = {
                "meal_type": "Dinner",
                "title": "4 Boiled Eggs (2 whole + 2 whites) with Dal & 3 Rotis",
                "timing": "09:00 PM",
                "foods": ["whole_eggs", "egg_whites", "moong_dal", "wheat_roti"],
                "protein_g": 25.0,
                "calories": 430,
                "price_inr": 26.0,
                "prep_time_min": 10,
                "instructions": "4 eggs with yellow dal and rotis.",
                "image_url": "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=600&q=80",
                "budget_swap": "Mess dal."
            }

    # Fine-tune instructions for specific student modes
    if mode == "no_cook":
        for m in [breakfast, lunch, snack, dinner]:
            m["prep_time_min"] = min(m["prep_time_min"], 2)
            m["instructions"] = f"[ZERO-COOK MODE] No stove or kettle needed. " + m["instructions"]
    elif mode == "mess":
        lunch["instructions"] = "[MESS HACK] Take your hot free mess dal/rice bowl, and stir in your protein booster! " + lunch["instructions"]
    elif mode == "exam_week":
        for m in [breakfast, lunch, snack, dinner]:
            m["instructions"] = f"[EXAM MODE] Quick 2-min brain fuel. " + m["instructions"]

    meals = [breakfast, lunch, snack, dinner]
    total_protein = round(sum(m["protein_g"] for m in meals), 1)
    total_calories = round(sum(m["calories"] for m in meals), 0)
    total_price = round(sum(m["price_inr"] for m in meals), 1)
    budget_remaining = round(daily_budget_inr - total_price, 1)

    return {
        "mode": mode,
        "mode_title": mode.replace("_", " ").title() + " Mode",
        "budget_tier": tier_key,
        "tier_title": tier_title,
        "tier_tagline": tier_tagline,
        "dietary_preference": diet_pref,
        "target_protein_g": target_protein_g,
        "total_protein_g": total_protein,
        "total_calories": total_calories,
        "total_price_inr": total_price,
        "daily_budget_inr": daily_budget_inr,
        "budget_remaining_inr": max(0.0, budget_remaining),
        "meals": meals
    }

def generate_weekly_grocery_list(daily_plan: Dict[str, Any]) -> Dict[str, Any]:
    """
    Aggregates ingredients for 7 days with bulk purchasing quantities,
    estimated weekly cost in ₹, and student savings tips, dynamically calibrated
    to the daily plan's budget tier.
    """
    daily_budget = daily_plan.get("daily_budget_inr", 80.0)
    tier = daily_plan.get("budget_tier", "tier_80")

    if tier == "tier_60":
        items = [
            {"item": "Chana Sattu Powder", "quantity": "1 kg packet", "cost_inr": 140, "shelf_life": "6 months", "tip": "Mix with cold water, salt, and lemon for zero-cook 26g protein shakes."},
            {"item": "Soya Chunks (Nutrela Bulk)", "quantity": "1 kg wholesale bag", "cost_inr": 110, "shelf_life": "12 months", "tip": "52% pure protein: 1 kg provides 520g pure protein for ₹110."},
            {"item": "Roasted Bhuna Chana", "quantity": "1 kg bag", "cost_inr": 140, "shelf_life": "3 months", "tip": "Desk study snack that prevents canteen impulse spending."},
            {"item": "Fresh Eggs Crate (if Eggetarian)", "quantity": "30 eggs crate", "cost_inr": 180, "shelf_life": "3 weeks", "tip": "Wholesale crate cuts cost to ₹6/egg instead of ₹8 tapri price."}
        ]
    elif tier == "tier_80":
        items = [
            {"item": "Rolled Oats (Plain)", "quantity": "1 kg bag", "cost_inr": 150, "shelf_life": "6 months", "tip": "Unflavored oats cost 40% less than sugary branded packets."},
            {"item": "Amul Toned Milk (Blue Pouch)", "quantity": "7 pouches (500ml)", "cost_inr": 196, "shelf_life": "Daily pickup", "tip": "Blue pouch gives superior protein-to-fat ratio for students."},
            {"item": "Soya Chunks (Nutrela)", "quantity": "500g box (2 packs)", "cost_inr": 100, "shelf_life": "12 months", "tip": "Add to mess dal daily for +26g protein."},
            {"item": "Roasted Peanuts", "quantity": "500g bag", "cost_inr": 90, "shelf_life": "3 months", "tip": "Great pre-workout fats and energy."},
            {"item": "Fresh Curd / Dahi", "quantity": "1 kg loose from dairy", "cost_inr": 70, "shelf_life": "5 days", "tip": "Local dairy dahi is cheaper and thicker than branded cups."}
        ]
    elif tier == "tier_100":
        items = [
            {"item": "Peanut Butter (Unsweetened 1kg)", "quantity": "1 kg tub", "cost_inr": 280, "shelf_life": "6 months", "tip": "Split a 1kg tub with your hostel roommate to halve the upfront cost."},
            {"item": "Rolled Oats (Plain)", "quantity": "1 kg bag", "cost_inr": 150, "shelf_life": "6 months", "tip": "Cook in kettle with milk and PB for thick protein porridge."},
            {"item": "Fresh Dairy Paneer (Block)", "quantity": "500g block", "cost_inr": 175, "shelf_life": "4 days", "tip": "Buy block from local dairy for ₹350/kg vs ₹480/kg packaged."},
            {"item": "Fresh Eggs Crate", "quantity": "30 eggs crate", "cost_inr": 180, "shelf_life": "3 weeks", "tip": "Boil 4 eggs every morning in kettle."},
            {"item": "Amul Toned Milk", "quantity": "7 pouches (500ml)", "cost_inr": 196, "shelf_life": "Daily pickup", "tip": "Drink 250ml morning and 250ml evening."}
        ]
    elif tier == "tier_120":
        items = [
            {"item": "Fresh Dairy Paneer (Block)", "quantity": "1 kg block", "cost_inr": 350, "shelf_life": "5 days", "tip": "Cube and store in cold water in fridge/cooler to stay soft."},
            {"item": "Chicken Breast (Boneless)", "quantity": "1 kg (if Non-Veg)", "cost_inr": 240, "shelf_life": "3 days", "tip": "Ask local butcher for clean skinless breast cut in bite-size cubes."},
            {"item": "Fresh Eggs Crate", "quantity": "30 eggs crate (2 crates)", "cost_inr": 360, "shelf_life": "3 weeks", "tip": "Provides 4-5 eggs daily for uninterrupted hypertrophy."},
            {"item": "Peanut Butter & Rolled Oats", "quantity": "Combo pack", "cost_inr": 380, "shelf_life": "6 months", "tip": "Morning power staple for energy and clean bulk."},
            {"item": "Amul Toned Milk", "quantity": "10 pouches (500ml)", "cost_inr": 280, "shelf_life": "Daily pickup", "tip": "High bioavailability casein and whey protein."}
        ]
    else: # tier_150
        items = [
            {"item": "Fresh Dairy Paneer & Chicken Breast", "quantity": "1.5 kg combo", "cost_inr": 480, "shelf_life": "Fresh", "tip": "Peak protein intake for high-volume athletic training."},
            {"item": "Fresh Eggs Crate (60 Eggs)", "quantity": "2 crates (60 eggs)", "cost_inr": 360, "shelf_life": "3 weeks", "tip": "Wholesale mandi purchase saves up to ₹120 per fortnight."},
            {"item": "Peanut Butter (1kg) & Almonds (250g)", "quantity": "Premium Nut Stack", "cost_inr": 450, "shelf_life": "6 months", "tip": "Dense micronutrients, vitamin E, magnesium, and healthy fats."},
            {"item": "Amul Toned Milk (14 Pouches)", "quantity": "14 pouches (500ml)", "cost_inr": 392, "shelf_life": "Daily", "tip": "1 litre per day delivers 32g complete dairy protein."}
        ]

    total_weekly_cost = sum(i["cost_inr"] for i in items)

    return {
        "week_title": f"Student 7-Day Grocery Haul ({daily_plan.get('tier_title', 'Student Plan')})",
        "total_estimated_weekly_inr": total_weekly_cost,
        "average_daily_cost_inr": round(total_weekly_cost / 7.0, 1),
        "items": items,
        "shopping_hacks": [
            "Always buy whole crates of 30 eggs from wholesale egg mandis.",
            "Soya chunks are 52% protein: 1 kg gives 520g pure protein for ₹100-₹110.",
            "Buy paneer in loose 500g/1kg blocks from local sweet shops (dairies) instead of branded retail packets to save 25-30%.",
            "Keep lemons and rock salt handy in hostel room to turn plain water and sattu into instant refreshing protein shakes."
        ]
    }
