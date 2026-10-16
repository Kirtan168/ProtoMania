"""
PROTOMANIA Day-Wise 7-Day Student Meal Planning Engine
Generates authentic, budget-calibrated 7-day weekly schedules (Monday through Sunday)
strictly tailored to student pocket money (₹60, ₹80, ₹100, ₹120, ₹150+),
dietary preference (Vegetarian, Eggetarian, Non-Vegetarian), and living conditions
(Hostel, Mess Survival, Zero-Cook, Exam-Week, Veg Muscle).

Includes authentic Indian recipes: Egg Bhurji, Masala Omelette, Paneer Bhurji,
Besan Chilla, Moong Dal Chilla, Homestyle Chicken Curry, Tawa Fish Fry,
Soya Keema Bhurji, Kala Chana Chaat, Dahi Tadka, and campus staples.
"""

from typing import List, Dict, Any, Optional

def get_day_recipes(tier_key: str, diet_pref: str, mode: str, day_idx: int) -> Dict[str, Any]:
    """
    Returns 4 distinct meals (Breakfast, Lunch, Pre-Workout Snack, Dinner)
    for a specific day index (0=Monday to 6=Sunday), calibrated to tier and diet.
    """
    is_veg = diet_pref in ("vegetarian", "vegan")
    is_egg = diet_pref == "eggetarian"
    is_nonveg = diet_pref in ("non_vegetarian", "non-vegetarian", "nonveg")

    # Day metadata
    day_names = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    day_shorts = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    day_name = day_names[day_idx % 7]
    day_short = day_shorts[day_idx % 7]

    # Target budgets per tier
    tier_targets = {
        "tier_60": 60.0,
        "tier_80": 80.0,
        "tier_100": 100.0,
        "tier_120": 120.0,
        "tier_150": 150.0
    }
    target_budget = tier_targets.get(tier_key, 80.0)

    # =========================================================================
    # RECIPE GENERATION MATRICES (7 DAYS x 3 DIETARY PREFERENCES x 5 TIERS)
    # =========================================================================

    if is_veg or mode == "veg_muscle":
        # ----------------- VEGETARIAN -----------------
        if day_idx == 0:  # Monday: Moong Dal Chilla Kickoff
            theme = "Moong Chilla & Soya Pulao Power Kickoff"
            breakfast = {
                "meal_type": "Breakfast",
                "title": "Moong Dal Chillas (2 pcs) with Mint Dahi (100g)",
                "timing": "08:15 AM",
                "foods": ["moong_chilla", "fresh_curd"],
                "protein_g": 20.0,
                "calories": 295,
                "price_inr": 22.0 if tier_key != "tier_60" else 18.0,
                "prep_time_min": 10,
                "instructions": "Make 2 crisp moong dal chillas seasoned with ginger, cumin and green chillies. Serve with cool dahi.",
                "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Moong_dal_chilla.jpg/960px-Moong_dal_chilla.jpg",
                "budget_swap": "Soak loose whole moong overnight to get ₹8/portion cost."
            }
            lunch = {
                "meal_type": "Lunch",
                "title": "High-Protein Soya Chunks (50g) Pulao with Mess Dal",
                "timing": "01:15 PM",
                "foods": ["soya_chunks", "moong_dal", "steamed_rice"],
                "protein_g": 34.5,
                "calories": 480,
                "price_inr": 22.0 if tier_key != "tier_60" else 16.0,
                "prep_time_min": 8,
                "instructions": "Boil 50g soya chunks in kettle, squeeze dry, toss into mess steamed rice and yellow dal for 34g protein.",
                "image_url": "https://upload.wikimedia.org/wikipedia/commons/5/5e/Textured_vegetable_protein.jpg",
                "budget_swap": "Buy 1kg Nutrela bulk sack from wholesale grocery."
            }
            snack = {
                "meal_type": "Pre-Workout Snack",
                "title": "Roasted Bhuna Chana (40g) + Black Coffee",
                "timing": "05:15 PM",
                "foods": ["roasted_chana"],
                "protein_g": 8.0,
                "calories": 145,
                "price_inr": 9.0 if tier_key != "tier_60" else 8.0,
                "prep_time_min": 0,
                "instructions": "Crunchy roasted chana directly from your desk jar 45 mins before training.",
                "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Torraos-Las_Mayas-2011.JPG/960px-Torraos-Las_Mayas-2011.JPG",
                "budget_swap": "Zero cooking needed. Prevents expensive canteen junk food."
            }
            dinner = {
                "meal_type": "Dinner",
                "title": "Spicy Soya Keema Bhurji with 3 Whole Wheat Rotis",
                "timing": "08:45 PM",
                "foods": ["soya_bhurji", "wheat_roti"],
                "protein_g": 37.0 if tier_key != "tier_60" else 28.0,
                "calories": 420,
                "price_inr": 25.0 if tier_key != "tier_60" else 18.0,
                "prep_time_min": 10,
                "instructions": "Sauté minced soya granules with onions, tomatoes, turmeric and chaat masala. Enjoy with 3 fresh rotis.",
                "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Soya_bhurji.jpg/960px-Soya_bhurji.jpg",
                "budget_swap": "Unbeatable budget muscle fuel: ₹14 gives over 30g protein."
            }
        elif day_idx == 1:  # Tuesday: Besan Chilla & Rajma Chawal
            theme = "Besan Cheela & Desi Rajma Chawal"
            breakfast = {
                "meal_type": "Breakfast",
                "title": "Besan Chillas (2 pcs) with Ajwain & Green Chillies",
                "timing": "08:15 AM",
                "foods": ["besan_chilla"],
                "protein_g": 13.5,
                "calories": 235,
                "price_inr": 15.0,
                "prep_time_min": 8,
                "instructions": "Whisk 60g gram flour with water, carom seeds (ajwain), chopped onions and chillies. Pan roast both sides crisp.",
                "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Besan_Cheela.jpg/960px-Besan_Cheela.jpg",
                "budget_swap": "Besan is naturally shelf-stable and requires no refrigeration."
            }
            lunch = {
                "meal_type": "Lunch",
                "title": "Authentic Rajma Curry (200g) with Steamed Rice & Onion Salad",
                "timing": "01:30 PM",
                "foods": ["rajma_curry", "steamed_rice"],
                "protein_g": 15.0,
                "calories": 410,
                "price_inr": 21.0,
                "prep_time_min": 15,
                "instructions": "Rich North Indian kidney bean curry paired with steamed rice for complete branched amino acids.",
                "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Rajma_Chawal.jpg/960px-Rajma_Chawal.jpg",
                "budget_swap": "Ask the college mess cook for extra thick rajma gravy."
            }
            snack = {
                "meal_type": "Pre-Workout Snack",
                "title": "Roasted Peanuts (35g) + 1 Fresh Banana",
                "timing": "05:15 PM",
                "foods": ["roasted_peanuts", "banana_snack"],
                "protein_g": 10.5,
                "calories": 290,
                "price_inr": 13.0,
                "prep_time_min": 0,
                "instructions": "Healthy monounsaturated fats from peanuts paired with fast-acting fructose from banana.",
                "image_url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d6/Roasted_peanuts_in_a_bowl.jpg/960px-Roasted_peanuts_in_a_bowl.jpg",
                "budget_swap": "Dry roast raw peanuts in bulk on weekends to save 50%."
            }
            dinner = {
                "meal_type": "Dinner",
                "title": "Spiced Dahi Tadka with Thick Moong Dal & 3 Rotis",
                "timing": "09:00 PM",
                "foods": ["dahi_tadka", "moong_dal", "wheat_roti"],
                "protein_g": 24.5,
                "calories": 480,
                "price_inr": 26.0,
                "prep_time_min": 8,
                "instructions": "Whisk fresh curd with mustard seed and curry leaf tadka. Eat with yellow dal and warm chapatis.",
                "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Dahi_Tadka.jpg/960px-Dahi_Tadka.jpg",
                "budget_swap": "Slow casein protein protects against muscle breakdown overnight."
            }
        elif day_idx == 2:  # Wednesday: Paneer Bhurji / Soya Feast
            theme = "Paneer Bhurji / Sattu Muscle Builder"
            breakfast = {
                "meal_type": "Breakfast",
                "title": "Chana Sattu Shake (50g) with Lemon & 1 Banana",
                "timing": "08:15 AM",
                "foods": ["sattu_drink", "banana_snack"],
                "protein_g": 13.0,
                "calories": 290,
                "price_inr": 15.0,
                "prep_time_min": 2,
                "instructions": "Mix 50g roasted chana sattu with cold water, black salt and half a lemon in a shaker bottle.",
                "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Torraos-Las_Mayas-2011.JPG/960px-Torraos-Las_Mayas-2011.JPG",
                "budget_swap": "Desi student protein shake: 0 min cook time for ₹15."
            }
            lunch = {
                "meal_type": "Lunch",
                "title": "Chole Masala Bowl with Steamed Rice & Chaas",
                "timing": "01:15 PM",
                "foods": ["chole_chickpeas", "steamed_rice", "chaas_buttermilk"],
                "protein_g": 18.2,
                "calories": 470,
                "price_inr": 28.0 if tier_key != "tier_60" else 18.0,
                "prep_time_min": 10,
                "instructions": "Spiced white chickpeas with steamed rice and a 200ml chilled spiced buttermilk pack.",
                "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Chana_masala.jpg/960px-Chana_masala.jpg",
                "budget_swap": "Amul Masti buttermilk is ₹12 across all college campuses."
            }
            snack = {
                "meal_type": "Pre-Workout Snack",
                "title": "Kala Chana Chaat (Boiled Black Chickpeas with Lemon)",
                "timing": "05:15 PM",
                "foods": ["kala_chana_chaat"],
                "protein_g": 12.5,
                "calories": 210,
                "price_inr": 12.0,
                "prep_time_min": 3,
                "instructions": "Boiled black chickpeas tossed with chopped onions, green chillies, lemon and chaat masala.",
                "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Kala_chana_chaat.jpg/960px-Kala_chana_chaat.jpg",
                "budget_swap": "Traditional wrestler power snack. High in magnesium and iron."
            }
            dinner = {
                "meal_type": "Dinner",
                "title": "Paneer Bhurji (100g) with 3 Rotis & Green Salad" if target_budget >= 90.0 else "Spicy Soya Keema Bhurji with 3 Rotis",
                "timing": "08:45 PM",
                "foods": ["paneer_bhurji", "wheat_roti"] if target_budget >= 90.0 else ["soya_bhurji", "wheat_roti"],
                "protein_g": 25.0 if target_budget >= 90.0 else 32.0,
                "calories": 445,
                "price_inr": 38.0 if target_budget >= 90.0 else 20.0,
                "prep_time_min": 10,
                "instructions": "Crumble fresh paneer into sautéed onions, tomatoes, turmeric, and cumin. Serve with warm rotis.",
                "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Paneer_Bhurji.jpg/960px-Paneer_Bhurji.jpg" if target_budget >= 90.0 else "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Soya_bhurji.jpg/960px-Soya_bhurji.jpg",
                "budget_swap": "Buy paneer blocks from local sweet dairy to save 30% over retail."
            }
        elif day_idx == 3:  # Thursday: Oatmeal Muscle Fuel
            theme = "Kettle Oatmeal & Soya Curry Sustenance"
            breakfast = {
                "meal_type": "Breakfast",
                "title": "Hostel Kettle Oats (45g) with Warm Milk & Banana",
                "timing": "08:00 AM",
                "foods": ["rolled_oats", "amul_toned_milk", "banana_snack"],
                "protein_g": 13.0,
                "calories": 330,
                "price_inr": 23.0,
                "prep_time_min": 4,
                "instructions": "Pour boiling toned milk over rolled oats in your hostel mug. Slice ripe banana on top.",
                "image_url": "https://images.unsplash.com/photo-1517673400267-0251440c45dc?auto=format&fit=crop&w=600&q=80",
                "budget_swap": "Use loose rolled oats from Kirana instead of branded boxed oats."
            }
            lunch = {
                "meal_type": "Lunch",
                "title": "Soya Chunks Curry with 100g Fresh Dahi & Rice",
                "timing": "01:15 PM",
                "foods": ["soya_chunks", "fresh_curd", "steamed_rice"],
                "protein_g": 34.0,
                "calories": 510,
                "price_inr": 24.0,
                "prep_time_min": 10,
                "instructions": "Soak 50g soya chunks in hot water, squeeze, toss into mess gravy with rice and cool curd.",
                "image_url": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
                "budget_swap": "Fresh curd provides live digestive enzymes."
            }
            snack = {
                "meal_type": "Pre-Workout Snack",
                "title": "Roasted Bhuna Chana (40g) + Water/Tea",
                "timing": "05:15 PM",
                "foods": ["roasted_chana"],
                "protein_g": 8.5,
                "calories": 150,
                "price_inr": 9.0,
                "prep_time_min": 0,
                "instructions": "Study desk crunch that keeps blood sugar steady before gym.",
                "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Torraos-Las_Mayas-2011.JPG/960px-Torraos-Las_Mayas-2011.JPG",
                "budget_swap": "Buy 1kg roasted chana packet for ₹140."
            }
            dinner = {
                "meal_type": "Dinner",
                "title": "Pan-Fried Tofu Cubes (100g) with Mess Dal & 3 Rotis" if target_budget >= 90.0 else "Soya Keema with 3 Rotis",
                "timing": "08:45 PM",
                "foods": ["tofu_soya_paneer", "wheat_roti", "moong_dal"] if target_budget >= 90.0 else ["soya_bhurji", "wheat_roti"],
                "protein_g": 26.5 if target_budget >= 90.0 else 31.0,
                "calories": 420,
                "price_inr": 34.0 if target_budget >= 90.0 else 18.0,
                "prep_time_min": 8,
                "instructions": "Pan-sear golden tofu cubes in 1 tsp oil with black pepper, salt and chaat masala. Eat with rotis and dal.",
                "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Fried_Pieces_of_Tofu.JPG/800px-Fried_Pieces_of_Tofu.JPG" if target_budget >= 90.0 else "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Soya_bhurji.jpg/960px-Soya_bhurji.jpg",
                "budget_swap": "Tofu gives clean 15g protein with 0 cholesterol and zero lactose."
            }
        elif day_idx == 4:  # Friday: Moong Chilla & Sprout Power
            theme = "Moong Dal Chilla & Sprouted Salad Friday"
            breakfast = {
                "meal_type": "Breakfast",
                "title": "Crisp Moong Dal Chillas (2 pcs) with Fresh Curd",
                "timing": "08:15 AM",
                "foods": ["moong_chilla", "fresh_curd"],
                "protein_g": 20.0,
                "calories": 295,
                "price_inr": 22.0,
                "prep_time_min": 10,
                "instructions": "Crisp pan-roasted moong dal chillas accompanied with thick curd.",
                "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Moong_dal_chilla.jpg/960px-Moong_dal_chilla.jpg",
                "budget_swap": "Moong dal is easiest on student digestion."
            }
            lunch = {
                "meal_type": "Lunch",
                "title": "Sprouted Moong Salad + Soya Chunks & Dal Rice",
                "timing": "01:30 PM",
                "foods": ["sprouted_moong", "soya_chunks", "steamed_rice"],
                "protein_g": 32.0,
                "calories": 460,
                "price_inr": 23.0,
                "prep_time_min": 8,
                "instructions": "Toss raw sprouted moong with lemon and salt; enjoy alongside warm soya rice.",
                "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Mung_bean_sprouts%2C_close-up.jpg/960px-Mung_bean_sprouts%2C_close-up.jpg",
                "budget_swap": "Sprout whole green moong in a plastic tiffin box."
            }
            snack = {
                "meal_type": "Pre-Workout Snack",
                "title": "Natural Peanut Butter (2 tbsp) on Whole Wheat Roti",
                "timing": "05:15 PM",
                "foods": ["peanut_butter", "wheat_roti"],
                "protein_g": 12.0,
                "calories": 270,
                "price_inr": 16.0,
                "prep_time_min": 1,
                "instructions": "Spread 2 tablespoons of unsweetened peanut butter over a warm chapati.",
                "image_url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a2/Peanut_butter_glass.jpg/960px-Peanut_butter_glass.jpg",
                "budget_swap": "Get 1kg unsweetened peanut butter tub to save 40%."
            }
            dinner = {
                "meal_type": "Dinner",
                "title": "Thick Yellow Moong Dal Tadka with Dahi & 3 Rotis",
                "timing": "08:45 PM",
                "foods": ["moong_dal", "fresh_curd", "wheat_roti"],
                "protein_g": 22.0,
                "calories": 440,
                "price_inr": 21.0,
                "prep_time_min": 8,
                "instructions": "Soothing Friday dinner high in restorative plant proteins and calcium.",
                "image_url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b6/Dal_Tadka.jpg/960px-Dal_Tadka.jpg",
                "budget_swap": "Add a pinch of roasted cumin on dahi."
            }
        elif day_idx == 5:  # Saturday: Besan Chilla & Soya Pulao Weekend
            theme = "Besan Chilla & Soya Pulao Weekend Feast"
            breakfast = {
                "meal_type": "Breakfast",
                "title": "Spiced Besan Chillas (2 pcs) with Mint Chutney",
                "timing": "08:45 AM",
                "foods": ["besan_chilla"],
                "protein_g": 13.2,
                "calories": 230,
                "price_inr": 14.0,
                "prep_time_min": 8,
                "instructions": "Savory gram flour pancakes loaded with chopped onions and coriander.",
                "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Besan_Cheela.jpg/960px-Besan_Cheela.jpg",
                "budget_swap": "High fiber keeps you full through weekend study sessions."
            }
            lunch = {
                "meal_type": "Lunch",
                "title": "Soya Granules Biryani / Pulao with 100g Fresh Dahi",
                "timing": "01:30 PM",
                "foods": ["soya_chunks", "fresh_curd", "steamed_rice"],
                "protein_g": 34.0,
                "calories": 510,
                "price_inr": 24.0,
                "prep_time_min": 10,
                "instructions": "Cook soaked soya chunks with biryani masala, rice and serve with cold dahi.",
                "image_url": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
                "budget_swap": "Weekend batch prep allows easy leftovers."
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
                "instructions": "Energy-dense fuel before weekend gym heavy lifting.",
                "image_url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d6/Roasted_peanuts_in_a_bowl.jpg/960px-Roasted_peanuts_in_a_bowl.jpg",
                "budget_swap": "Wholesale peanuts are ₹160/kg."
            }
            dinner = {
                "meal_type": "Dinner",
                "title": "Paneer Bhurji (100g) with 3 Rotis" if target_budget >= 90.0 else "Spicy Soya Keema Bhurji with 3 Rotis",
                "timing": "09:00 PM",
                "foods": ["paneer_bhurji", "wheat_roti"] if target_budget >= 90.0 else ["soya_bhurji", "wheat_roti"],
                "protein_g": 25.0 if target_budget >= 90.0 else 31.0,
                "calories": 445,
                "price_inr": 38.0 if target_budget >= 90.0 else 18.0,
                "prep_time_min": 10,
                "instructions": "Scrambled paneer sautéed with onions, tomatoes and pav bhaji spices.",
                "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Paneer_Bhurji.jpg/960px-Paneer_Bhurji.jpg" if target_budget >= 90.0 else "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Soya_bhurji.jpg/960px-Soya_bhurji.jpg",
                "budget_swap": "Top-tier student muscle repair before Sunday rest."
            }
        else:  # Sunday: Paneer & Sattu Sunday Special
            theme = "Sunday Special: Paneer Bhurji & Rajma Feast"
            breakfast = {
                "meal_type": "Breakfast",
                "title": "Chana Sattu Shake (50g) + 2 Bananas",
                "timing": "09:00 AM",
                "foods": ["sattu_drink", "banana_snack"],
                "protein_g": 14.5,
                "calories": 390,
                "price_inr": 18.0,
                "prep_time_min": 2,
                "instructions": "Double banana and cold sattu shake for high-calorie Sunday recovery.",
                "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Torraos-Las_Mayas-2011.JPG/960px-Torraos-Las_Mayas-2011.JPG",
                "budget_swap": "Wholesale sattu provides 25g protein for ₹12."
            }
            lunch = {
                "meal_type": "Lunch",
                "title": "Sunday Mess Rajma Chawal with Extra Dahi",
                "timing": "01:30 PM",
                "foods": ["rajma_curry", "steamed_rice", "fresh_curd"],
                "protein_g": 19.0,
                "calories": 480,
                "price_inr": 26.0,
                "prep_time_min": 15,
                "instructions": "The legendary Sunday student staple: hot rajma over steamed rice with fresh curd.",
                "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Rajma_Chawal.jpg/960px-Rajma_Chawal.jpg",
                "budget_swap": "Ask the mess staff for refill."
            }
            snack = {
                "meal_type": "Pre-Workout Snack",
                "title": "Kala Chana Chaat (150g boiled with lemon & spices)",
                "timing": "05:15 PM",
                "foods": ["kala_chana_chaat"],
                "protein_g": 12.5,
                "calories": 210,
                "price_inr": 12.0,
                "prep_time_min": 3,
                "instructions": "Boiled black chana with chopped onions, tomato, lemon and chaat masala.",
                "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Kala_chana_chaat.jpg/960px-Kala_chana_chaat.jpg",
                "budget_swap": "Zero oil, high potassium and dietary fiber."
            }
            dinner = {
                "meal_type": "Dinner",
                "title": "Paneer Bhurji (100g) with 3 Phulkas" if target_budget >= 90.0 else "Spicy Soya Keema with 3 Rotis",
                "timing": "08:45 PM",
                "foods": ["paneer_bhurji", "wheat_roti"] if target_budget >= 90.0 else ["soya_bhurji", "wheat_roti"],
                "protein_g": 25.0 if target_budget >= 90.0 else 31.0,
                "calories": 445,
                "price_inr": 38.0 if target_budget >= 90.0 else 18.0,
                "prep_time_min": 10,
                "instructions": "Sunday night dinner ensuring a deep anabolic protein surplus.",
                "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Paneer_Bhurji.jpg/960px-Paneer_Bhurji.jpg" if target_budget >= 90.0 else "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Soya_bhurji.jpg/960px-Soya_bhurji.jpg",
                "budget_swap": "Paneer block from local dairy is 30% cheaper."
            }

    elif is_egg:
        # ----------------- EGGETARIAN -----------------
        if day_idx == 0:  # Monday: Egg Bhurji Kickoff
            theme = "Anda Bhurji & Soya Pulao Power Kickoff"
            breakfast = {
                "meal_type": "Breakfast",
                "title": "Egg Bhurji (3 Eggs) with 2 Whole Wheat Rotis",
                "timing": "08:15 AM",
                "foods": ["egg_bhurji", "wheat_roti"],
                "protein_g": 24.5,
                "calories": 385,
                "price_inr": 28.0,
                "prep_time_min": 7,
                "instructions": "Scramble 3 whole eggs with chopped onions, green chillies, turmeric and tomatoes. Serve with 2 warm rotis.",
                "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Anda_bhurji_pav.jpg/960px-Anda_bhurji_pav.jpg",
                "budget_swap": "Egg crate purchase brings egg cost to ₹6 each."
            }
            lunch = {
                "meal_type": "Lunch",
                "title": "Soya Chunks (40g) & Mess Dal Rice with Dahi",
                "timing": "01:15 PM",
                "foods": ["soya_chunks", "moong_dal", "steamed_rice", "fresh_curd"],
                "protein_g": 34.0,
                "calories": 510,
                "price_inr": 22.0,
                "prep_time_min": 8,
                "instructions": "Soak soya chunks in boiling water, add to mess dal and steamed rice with a cup of curd.",
                "image_url": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80",
                "budget_swap": "Get curd loose from local dairy."
            }
            snack = {
                "meal_type": "Pre-Workout Snack",
                "title": "Roasted Bhuna Chana (40g) + Black Coffee",
                "timing": "05:15 PM",
                "foods": ["roasted_chana"],
                "protein_g": 8.0,
                "calories": 145,
                "price_inr": 9.0,
                "prep_time_min": 0,
                "instructions": "Quick clean crunch 45 mins before evening workout.",
                "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Torraos-Las_Mayas-2011.JPG/960px-Torraos-Las_Mayas-2011.JPG",
                "budget_swap": "Zero cook time. Ideal for hostel room desk."
            }
            dinner = {
                "meal_type": "Dinner",
                "title": "2 Boiled Whole Eggs Masala Curry with 3 Rotis",
                "timing": "08:45 PM",
                "foods": ["whole_eggs", "wheat_roti"],
                "protein_g": 20.0,
                "calories": 400,
                "price_inr": 20.0,
                "prep_time_min": 10,
                "instructions": "Boil 2 eggs in kettle, peel and toss in quick tomato-onion masala with 3 rotis.",
                "image_url": "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=600&q=80",
                "budget_swap": "Boiled eggs require zero oil."
            }
        elif day_idx == 1:  # Tuesday: Masala Omelette & Rajma
            theme = "Masala Omelette & Desi Rajma Chawal"
            breakfast = {
                "meal_type": "Breakfast",
                "title": "Masala Omelette (2 Eggs) with 2 Bread Slices & Chai",
                "timing": "08:15 AM",
                "foods": ["masala_omelette", "wheat_roti"],
                "protein_g": 19.5,
                "calories": 330,
                "price_inr": 24.0,
                "prep_time_min": 5,
                "instructions": "Fluffy 2-egg pan omelette with chopped onions, green chillies and pepper. Eat with 2 toast or rotis.",
                "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Masala_Omelette.jpg/960px-Masala_Omelette.jpg",
                "budget_swap": "Ready in 5 minutes on hostel single hotplate."
            }
            lunch = {
                "meal_type": "Lunch",
                "title": "Rajma Chawal with 100g Fresh Dahi",
                "timing": "01:30 PM",
                "foods": ["rajma_curry", "steamed_rice", "fresh_curd"],
                "protein_g": 19.0,
                "calories": 480,
                "price_inr": 26.0,
                "prep_time_min": 12,
                "instructions": "North Indian comfort kidney beans with rice and probiotic dahi.",
                "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Rajma_Chawal.jpg/960px-Rajma_Chawal.jpg",
                "budget_swap": "Mess rajma is free/included; add your own dahi."
            }
            snack = {
                "meal_type": "Pre-Workout Snack",
                "title": "Roasted Peanuts (35g) + 1 Fresh Banana",
                "timing": "05:15 PM",
                "foods": ["roasted_peanuts", "banana_snack"],
                "protein_g": 10.5,
                "calories": 290,
                "price_inr": 13.0,
                "prep_time_min": 0,
                "instructions": "Pre-workout energy booster with complex carbs and plant protein.",
                "image_url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d6/Roasted_peanuts_in_a_bowl.jpg/960px-Roasted_peanuts_in_a_bowl.jpg",
                "budget_swap": "Roast raw peanuts on Sunday."
            }
            dinner = {
                "meal_type": "Dinner",
                "title": "Egg Bhurji (2 eggs + 1 white) with 3 Rotis",
                "timing": "09:00 PM",
                "foods": ["egg_bhurji", "wheat_roti"],
                "protein_g": 21.5,
                "calories": 360,
                "price_inr": 22.0,
                "prep_time_min": 8,
                "instructions": "Quick spicy scrambled eggs cooked with cumin, onions and tomatoes.",
                "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Anda_bhurji_pav.jpg/960px-Anda_bhurji_pav.jpg",
                "budget_swap": "Add green peas or chopped capsicum for volume."
            }
        elif day_idx == 2:  # Wednesday: Moong Chilla & Boiled Eggs
            theme = "Moong Dal Chilla & Hard Boiled Eggs"
            breakfast = {
                "meal_type": "Breakfast",
                "title": "Moong Dal Chilla (1 pc) + 2 Boiled Eggs",
                "timing": "08:15 AM",
                "foods": ["moong_chilla", "whole_eggs"],
                "protein_g": 20.6,
                "calories": 260,
                "price_inr": 22.0,
                "prep_time_min": 8,
                "instructions": "Crisp moong dal chilla paired with 2 kettle-boiled eggs dusted with chaat masala.",
                "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Moong_dal_chilla.jpg/960px-Moong_dal_chilla.jpg",
                "budget_swap": "Dual protein source: plant legume + complete animal amino acids."
            }
            lunch = {
                "meal_type": "Lunch",
                "title": "Chole Chickpeas Bowl with Rice & Spiced Buttermilk",
                "timing": "01:15 PM",
                "foods": ["chole_chickpeas", "steamed_rice", "chaas_buttermilk"],
                "protein_g": 18.2,
                "calories": 470,
                "price_inr": 26.0,
                "prep_time_min": 10,
                "instructions": "Chana masala with steamed rice and cooling buttermilk.",
                "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Chana_masala.jpg/960px-Chana_masala.jpg",
                "budget_swap": "Amul Masti buttermilk pack is ₹12."
            }
            snack = {
                "meal_type": "Pre-Workout Snack",
                "title": "Chana Sattu Shake (50g) with Black Salt & Lemon",
                "timing": "05:15 PM",
                "foods": ["sattu_drink"],
                "protein_g": 11.5,
                "calories": 190,
                "price_inr": 11.0,
                "prep_time_min": 2,
                "instructions": "Zero-cook sattu shake for sustained pre-workout stamina.",
                "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Torraos-Las_Mayas-2011.JPG/960px-Torraos-Las_Mayas-2011.JPG",
                "budget_swap": "Buy loose chana sattu from wholesale grocery."
            }
            dinner = {
                "meal_type": "Dinner",
                "title": "Spiced Egg Curry (3 Boiled Eggs) with 3 Rotis",
                "timing": "08:45 PM",
                "foods": ["whole_eggs", "wheat_roti"],
                "protein_g": 25.0,
                "calories": 440,
                "price_inr": 26.0,
                "prep_time_min": 10,
                "instructions": "3 boiled eggs halved in a rich onion tomato gravy with 3 rotis.",
                "image_url": "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=600&q=80",
                "budget_swap": "Crate eggs cost ₹6 each."
            }
        elif day_idx == 3:  # Thursday: Besan Chilla & Soya Pulao
            theme = "Besan Chilla & Egg Pulao Hypertrophy"
            breakfast = {
                "meal_type": "Breakfast",
                "title": "Besan Chilla (2 pcs) with Mint Dahi",
                "timing": "08:15 AM",
                "foods": ["besan_chilla", "fresh_curd"],
                "protein_g": 17.5,
                "calories": 290,
                "price_inr": 20.0,
                "prep_time_min": 8,
                "instructions": "Gram flour chilla with carom seeds and cool curd.",
                "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Besan_Cheela.jpg/960px-Besan_Cheela.jpg",
                "budget_swap": "Besan is rich in magnesium and zinc."
            }
            lunch = {
                "meal_type": "Lunch",
                "title": "Egg & Soya Pulao (2 Eggs + 30g Soya) with Dal",
                "timing": "01:30 PM",
                "foods": ["whole_eggs", "soya_chunks", "steamed_rice"],
                "protein_g": 32.5,
                "calories": 510,
                "price_inr": 24.0,
                "prep_time_min": 10,
                "instructions": "Combine boiled eggs and soaked soya chunks into hot mess rice with spices.",
                "image_url": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
                "budget_swap": "Double protein punch for ₹24."
            }
            snack = {
                "meal_type": "Pre-Workout Snack",
                "title": "Kala Chana Chaat (Boiled Black Chickpeas with Lemon)",
                "timing": "05:15 PM",
                "foods": ["kala_chana_chaat"],
                "protein_g": 12.5,
                "calories": 210,
                "price_inr": 12.0,
                "prep_time_min": 3,
                "instructions": "Wrestler power snack tossed with lemon, black salt and onions.",
                "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Kala_chana_chaat.jpg/960px-Kala_chana_chaat.jpg",
                "budget_swap": "High iron and complex carbs."
            }
            dinner = {
                "meal_type": "Dinner",
                "title": "Egg Bhurji (3 Eggs) with 3 Rotis & Salad",
                "timing": "09:00 PM",
                "foods": ["egg_bhurji", "wheat_roti"],
                "protein_g": 24.5,
                "calories": 385,
                "price_inr": 28.0,
                "prep_time_min": 7,
                "instructions": "Spicy Indian scrambled eggs with fresh rotis.",
                "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Anda_bhurji_pav.jpg/960px-Anda_bhurji_pav.jpg",
                "budget_swap": "Add 20g soya granules for extra +10g protein."
            }
        elif day_idx == 4:  # Friday: Masala Omelette & Moong Dal
            theme = "Masala Omelette & Moong Dal Sustenance"
            breakfast = {
                "meal_type": "Breakfast",
                "title": "2-Egg Masala Omelette + 1 Banana + Black Coffee",
                "timing": "08:15 AM",
                "foods": ["masala_omelette", "banana_snack"],
                "protein_g": 14.5,
                "calories": 265,
                "price_inr": 23.0,
                "prep_time_min": 5,
                "instructions": "Hot pan omelette with onions, tomatoes, and chillies paired with 1 fresh banana.",
                "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Masala_Omelette.jpg/960px-Masala_Omelette.jpg",
                "budget_swap": "Wholesale eggs save ₹2 per egg."
            }
            lunch = {
                "meal_type": "Lunch",
                "title": "High-Protein Soya Chunks (40g) & Mess Dal Rice",
                "timing": "01:30 PM",
                "foods": ["soya_chunks", "moong_dal", "steamed_rice"],
                "protein_g": 30.0,
                "calories": 470,
                "price_inr": 18.0,
                "prep_time_min": 8,
                "instructions": "Infiltrate mess dal with soaked soya chunks for cheap clean protein.",
                "image_url": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80",
                "budget_swap": "Ask mess staff for extra dal ladle."
            }
            snack = {
                "meal_type": "Pre-Workout Snack",
                "title": "Roasted Peanuts (35g) + Hot Black Coffee",
                "timing": "05:15 PM",
                "foods": ["roasted_peanuts"],
                "protein_g": 9.0,
                "calories": 195,
                "price_inr": 8.0,
                "prep_time_min": 0,
                "instructions": "Pre-workout energy booster with sustained mono fats.",
                "image_url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d6/Roasted_peanuts_in_a_bowl.jpg/960px-Roasted_peanuts_in_a_bowl.jpg",
                "budget_swap": "Buy raw peanuts in bulk."
            }
            dinner = {
                "meal_type": "Dinner",
                "title": "Egg Bhurji (3 Eggs) with 3 Rotis & Spiced Dahi",
                "timing": "08:45 PM",
                "foods": ["egg_bhurji", "wheat_roti", "fresh_curd"],
                "protein_g": 28.5,
                "calories": 460,
                "price_inr": 34.0,
                "prep_time_min": 8,
                "instructions": "Hearty Friday dinner pairing egg protein with slow casein curd.",
                "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Anda_bhurji_pav.jpg/960px-Anda_bhurji_pav.jpg",
                "budget_swap": "Local dairy curd is ₹35/500g."
            }
        elif day_idx == 5:  # Saturday: Boiled Egg Stack & Soya Pulao
            theme = "Boiled Egg Stack & Weekend Soya Biryani"
            breakfast = {
                "meal_type": "Breakfast",
                "title": "4 Boiled Eggs (2 whole + 2 whites) with Black Pepper",
                "timing": "08:45 AM",
                "foods": ["whole_eggs", "egg_whites"],
                "protein_g": 23.0,
                "calories": 210,
                "price_inr": 28.0,
                "prep_time_min": 8,
                "instructions": "Boil 4 eggs in kettle, peel, sprinkle rock salt and black pepper.",
                "image_url": "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=600&q=80",
                "budget_swap": "Wholesale eggs in a 30-egg tray cost ₹6 each."
            }
            lunch = {
                "meal_type": "Lunch",
                "title": "Weekend Soya Pulao (50g) with 100g Fresh Dahi",
                "timing": "01:30 PM",
                "foods": ["soya_chunks", "fresh_curd", "steamed_rice"],
                "protein_g": 34.0,
                "calories": 510,
                "price_inr": 24.0,
                "prep_time_min": 10,
                "instructions": "Soak soya chunks in hot kettle water, mix with rice and spiced curd.",
                "image_url": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
                "budget_swap": "High volume keeps hunger away."
            }
            snack = {
                "meal_type": "Pre-Workout Snack",
                "title": "Roasted Bhuna Chana (40g) + 1 Banana",
                "timing": "05:15 PM",
                "foods": ["roasted_chana", "banana_snack"],
                "protein_g": 9.5,
                "calories": 250,
                "price_inr": 13.0,
                "prep_time_min": 0,
                "instructions": "Fast carb + complex fiber power fuel before gym.",
                "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Torraos-Las_Mayas-2011.JPG/960px-Torraos-Las_Mayas-2011.JPG",
                "budget_swap": "Desk snack ready at a moment's notice."
            }
            dinner = {
                "meal_type": "Dinner",
                "title": "Egg Bhurji (3 Eggs) with 3 Wheat Rotis",
                "timing": "09:00 PM",
                "foods": ["egg_bhurji", "wheat_roti"],
                "protein_g": 24.5,
                "calories": 385,
                "price_inr": 28.0,
                "prep_time_min": 7,
                "instructions": "3 eggs scrambled with onions, tomatoes and green chillies.",
                "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Anda_bhurji_pav.jpg/960px-Anda_bhurji_pav.jpg",
                "budget_swap": "Quickest hot meal to cook in a student room."
            }
        else:  # Sunday: Double Omelette & Dhaba Feast
            theme = "Sunday Special: Double Omelette & Egg Curry Feast"
            breakfast = {
                "meal_type": "Breakfast",
                "title": "Masala Omelette (3 Eggs) with 2 Rotis or Bread",
                "timing": "09:00 AM",
                "foods": ["masala_omelette", "wheat_roti"],
                "protein_g": 26.0,
                "calories": 410,
                "price_inr": 30.0,
                "prep_time_min": 6,
                "instructions": "Rich 3-egg omelette folded with chopped onions, green chillies and coriander.",
                "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Masala_Omelette.jpg/960px-Masala_Omelette.jpg",
                "budget_swap": "Sunday luxury breakfast under ₹30."
            }
            lunch = {
                "meal_type": "Lunch",
                "title": "Sunday Rajma Chawal with 100g Fresh Dahi",
                "timing": "01:30 PM",
                "foods": ["rajma_curry", "steamed_rice", "fresh_curd"],
                "protein_g": 19.0,
                "calories": 480,
                "price_inr": 26.0,
                "prep_time_min": 12,
                "instructions": "Thick Sunday mess rajma with rice and cool dahi.",
                "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Rajma_Chawal.jpg/960px-Rajma_Chawal.jpg",
                "budget_swap": "Refill dal in the mess."
            }
            snack = {
                "meal_type": "Pre-Workout Snack",
                "title": "Chana Sattu Shake (50g) + Lemon",
                "timing": "05:15 PM",
                "foods": ["sattu_drink"],
                "protein_g": 11.5,
                "calories": 190,
                "price_inr": 11.0,
                "prep_time_min": 2,
                "instructions": "Cold sattu shake with black salt and lemon.",
                "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Torraos-Las_Mayas-2011.JPG/960px-Torraos-Las_Mayas-2011.JPG",
                "budget_swap": "Zero stove cooking required."
            }
            dinner = {
                "meal_type": "Dinner",
                "title": "Egg Curry (3 Boiled Eggs) with 3 Rotis & Onion Salad",
                "timing": "08:45 PM",
                "foods": ["whole_eggs", "wheat_roti"],
                "protein_g": 25.0,
                "calories": 440,
                "price_inr": 26.0,
                "prep_time_min": 10,
                "instructions": "Halved boiled eggs in rich tomato-onion masala with fresh rotis.",
                "image_url": "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=600&q=80",
                "budget_swap": "Buy eggs in 30-egg crates."
            }

    else:
        # ----------------- NON-VEGETARIAN -----------------
        if day_idx == 0:  # Monday: Chicken Curry & Egg Bhurji Kickoff
            theme = "Homestyle Chicken Curry & Egg Bhurji Kickoff"
            breakfast = {
                "meal_type": "Breakfast",
                "title": "Egg Bhurji (3 Eggs) with 2 Rotis",
                "timing": "08:15 AM",
                "foods": ["egg_bhurji", "wheat_roti"],
                "protein_g": 24.5,
                "calories": 385,
                "price_inr": 28.0,
                "prep_time_min": 7,
                "instructions": "Scramble 3 whole eggs with chopped onions, green chillies and turmeric. Eat with 2 rotis.",
                "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Anda_bhurji_pav.jpg/960px-Anda_bhurji_pav.jpg",
                "budget_swap": "Egg crates cost ₹6/egg in wholesale."
            }
            lunch = {
                "meal_type": "Lunch",
                "title": "Homestyle Desi Chicken Curry (150g) with Steamed Rice",
                "timing": "01:15 PM",
                "foods": ["chicken_curry_homestyle", "steamed_rice"],
                "protein_g": 35.8,
                "calories": 455,
                "price_inr": 55.0 if target_budget >= 100.0 else 35.0,
                "prep_time_min": 20,
                "instructions": "Tender chicken pieces simmered in spiced onion-tomato gravy with steamed rice.",
                "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Indian_Chicken_Curry.jpg/960px-Indian_Chicken_Curry.jpg",
                "budget_swap": "Buy fresh chicken from local meat mandi at ₹180-₹220/kg."
            }
            snack = {
                "meal_type": "Pre-Workout Snack",
                "title": "Roasted Bhuna Chana (40g) + Black Coffee",
                "timing": "05:15 PM",
                "foods": ["roasted_chana"],
                "protein_g": 8.0,
                "calories": 145,
                "price_inr": 9.0,
                "prep_time_min": 0,
                "instructions": "Crunchy roasted chana directly from your desk jar 45 mins before training.",
                "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Torraos-Las_Mayas-2011.JPG/960px-Torraos-Las_Mayas-2011.JPG",
                "budget_swap": "Zero cook time. Prevents expensive canteen spending."
            }
            dinner = {
                "meal_type": "Dinner",
                "title": "Spicy Soya Keema Bhurji with 3 Rotis",
                "timing": "08:45 PM",
                "foods": ["soya_bhurji", "wheat_roti"],
                "protein_g": 37.5,
                "calories": 425,
                "price_inr": 20.0,
                "prep_time_min": 10,
                "instructions": "Economical muscle repair: sautéed minced soya granules with cumin and spices.",
                "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Soya_bhurji.jpg/960px-Soya_bhurji.jpg",
                "budget_swap": "Balances total daily food cost while hitting 100g+ protein."
            }
        elif day_idx == 1:  # Tuesday: Masala Omelette & Tawa Fish
            theme = "Masala Omelette & Tawa Fish Fry"
            breakfast = {
                "meal_type": "Breakfast",
                "title": "2-Egg Masala Omelette with 2 Bread Slices & Chai",
                "timing": "08:15 AM",
                "foods": ["masala_omelette", "wheat_roti"],
                "protein_g": 19.5,
                "calories": 330,
                "price_inr": 24.0,
                "prep_time_min": 5,
                "instructions": "Fluffy pan omelette folded with onions, chillies and pepper. Eat with 2 toast or rotis.",
                "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Masala_Omelette.jpg/960px-Masala_Omelette.jpg",
                "budget_swap": "5-minute fast breakfast."
            }
            lunch = {
                "meal_type": "Lunch",
                "title": "Soya Chunks (40g) & Mess Dal Rice with Dahi",
                "timing": "01:30 PM",
                "foods": ["soya_chunks", "moong_dal", "steamed_rice", "fresh_curd"],
                "protein_g": 34.0,
                "calories": 510,
                "price_inr": 22.0,
                "prep_time_min": 8,
                "instructions": "Soak soya chunks in boiling water, add to mess dal and steamed rice with a cup of curd.",
                "image_url": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80",
                "budget_swap": "Probiotic curd improves protein absorption."
            }
            snack = {
                "meal_type": "Pre-Workout Snack",
                "title": "Roasted Peanuts (35g) + 1 Fresh Banana",
                "timing": "05:15 PM",
                "foods": ["roasted_peanuts", "banana_snack"],
                "protein_g": 10.5,
                "calories": 290,
                "price_inr": 13.0,
                "prep_time_min": 0,
                "instructions": "Pre-workout energy booster with complex carbs and plant protein.",
                "image_url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d6/Roasted_peanuts_in_a_bowl.jpg/960px-Roasted_peanuts_in_a_bowl.jpg",
                "budget_swap": "Peanuts cost only ₹10 for 13g protein."
            }
            dinner = {
                "meal_type": "Dinner",
                "title": "Tawa Fish Fry (150g Rohu Fillet) with 3 Rotis" if target_budget >= 100.0 else "2 Boiled Whole Eggs Curry with 3 Rotis",
                "timing": "08:45 PM",
                "foods": ["fish_fry_tawa", "wheat_roti"] if target_budget >= 100.0 else ["whole_eggs", "wheat_roti"],
                "protein_g": 35.0 if target_budget >= 100.0 else 20.0,
                "calories": 395,
                "price_inr": 51.0 if target_budget >= 100.0 else 20.0,
                "prep_time_min": 12,
                "instructions": "Pan-seared fish fillet coated in turmeric, red chilli and lemon. High Omega-3s and lean protein.",
                "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Fish_fry_indian.jpg/960px-Fish_fry_indian.jpg" if target_budget >= 100.0 else "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=600&q=80",
                "budget_swap": "Rohu/Tilapia is cheap and nutrient dense."
            }
        elif day_idx == 2:  # Wednesday: Chicken Breast & Rice Bowl
            theme = "Grilled Chicken Breast & Chole Power"
            breakfast = {
                "meal_type": "Breakfast",
                "title": "Moong Dal Chilla (1 pc) + 2 Boiled Eggs",
                "timing": "08:15 AM",
                "foods": ["moong_chilla", "whole_eggs"],
                "protein_g": 20.6,
                "calories": 260,
                "price_inr": 22.0,
                "prep_time_min": 8,
                "instructions": "Crisp moong dal chilla paired with 2 kettle-boiled eggs dusted with chaat masala.",
                "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Moong_dal_chilla.jpg/960px-Moong_dal_chilla.jpg",
                "budget_swap": "Moong dal + eggs deliver full amino spectrum."
            }
            lunch = {
                "meal_type": "Lunch",
                "title": "Grilled Chicken Breast (150g) with Steamed Rice & Salad" if target_budget >= 100.0 else "Chole Chickpeas Bowl with Rice",
                "timing": "01:15 PM",
                "foods": ["chicken_breast", "steamed_rice"] if target_budget >= 100.0 else ["chole_chickpeas", "steamed_rice"],
                "protein_g": 45.8 if target_budget >= 100.0 else 14.6,
                "calories": 435,
                "price_inr": 63.0 if target_budget >= 100.0 else 21.0,
                "prep_time_min": 15,
                "instructions": "Pan-seared or grilled boneless chicken breast seasoned with lemon, black pepper and salt.",
                "image_url": "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=600&q=80" if target_budget >= 100.0 else "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Chana_masala.jpg/960px-Chana_masala.jpg",
                "budget_swap": "Buy whole breast cuts from wholesale butcher."
            }
            snack = {
                "meal_type": "Pre-Workout Snack",
                "title": "Chana Sattu Shake (50g) with Black Salt & Lemon",
                "timing": "05:15 PM",
                "foods": ["sattu_drink"],
                "protein_g": 11.5,
                "calories": 190,
                "price_inr": 11.0,
                "prep_time_min": 2,
                "instructions": "Zero-cook sattu shake for sustained pre-workout stamina.",
                "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Torraos-Las_Mayas-2011.JPG/960px-Torraos-Las_Mayas-2011.JPG",
                "budget_swap": "Best pre-workout drink for under ₹12."
            }
            dinner = {
                "meal_type": "Dinner",
                "title": "Egg Bhurji (3 Eggs) with 3 Rotis",
                "timing": "08:45 PM",
                "foods": ["egg_bhurji", "wheat_roti"],
                "protein_g": 24.5,
                "calories": 385,
                "price_inr": 28.0,
                "prep_time_min": 7,
                "instructions": "Spicy Indian scrambled eggs with fresh rotis.",
                "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Anda_bhurji_pav.jpg/960px-Anda_bhurji_pav.jpg",
                "budget_swap": "Cook in 1 tsp oil."
            }
        elif day_idx == 3:  # Thursday: Rohu Fish Curry
            theme = "Rohu Freshwater Fish Curry & Oatmeal"
            breakfast = {
                "meal_type": "Breakfast",
                "title": "Hostel Kettle Oats (45g) with Milk & 2 Boiled Eggs",
                "timing": "08:15 AM",
                "foods": ["rolled_oats", "amul_toned_milk", "whole_eggs"],
                "protein_g": 25.6,
                "calories": 390,
                "price_inr": 36.0 if target_budget >= 100.0 else 24.0,
                "prep_time_min": 8,
                "instructions": "Hot oats cooked with milk, paired with 2 kettle-boiled whole eggs.",
                "image_url": "https://images.unsplash.com/photo-1517673400267-0251440c45dc?auto=format&fit=crop&w=600&q=80",
                "budget_swap": "High morning energy for exams and lectures."
            }
            lunch = {
                "meal_type": "Lunch",
                "title": "Rohu Fish Curry (150g piece) with Steamed Rice" if target_budget >= 100.0 else "Homestyle Chicken Curry with Rice",
                "timing": "01:15 PM",
                "foods": ["rohu_fish_curry", "steamed_rice"] if target_budget >= 100.0 else ["chicken_curry_homestyle", "steamed_rice"],
                "protein_g": 30.8 if target_budget >= 100.0 else 35.8,
                "calories": 405,
                "price_inr": 53.0 if target_budget >= 100.0 else 35.0,
                "prep_time_min": 18,
                "instructions": "Freshwater Rohu fish in mustard-tomato curry gravy over hot steamed rice.",
                "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Bata_machher_jhol_DSCN2820.jpg/960px-Bata_machher_jhol_DSCN2820.jpg",
                "budget_swap": "Fresh fish gives pure Omega-3 EPA/DHA."
            }
            snack = {
                "meal_type": "Pre-Workout Snack",
                "title": "Kala Chana Chaat (Boiled Black Chickpeas with Lemon)",
                "timing": "05:15 PM",
                "foods": ["kala_chana_chaat"],
                "protein_g": 12.5,
                "calories": 210,
                "price_inr": 12.0,
                "prep_time_min": 3,
                "instructions": "Desi power snack tossed with lemon, black salt and onions.",
                "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Kala_chana_chaat.jpg/960px-Kala_chana_chaat.jpg",
                "budget_swap": "Zero cooking needed if boiled."
            }
            dinner = {
                "meal_type": "Dinner",
                "title": "Spicy Soya Keema Bhurji with 3 Rotis",
                "timing": "08:45 PM",
                "foods": ["soya_bhurji", "wheat_roti"],
                "protein_g": 37.5,
                "calories": 425,
                "price_inr": 20.0,
                "prep_time_min": 10,
                "instructions": "Minced soya granules sautéed with cumin, green chillies and garam masala.",
                "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Soya_bhurji.jpg/960px-Soya_bhurji.jpg",
                "budget_swap": "31g protein for ₹14."
            }
        elif day_idx == 4:  # Friday: Besan Chilla & Chicken Feast
            theme = "Besan Chilla & Homestyle Chicken Curry"
            breakfast = {
                "meal_type": "Breakfast",
                "title": "Besan Chilla (2 pcs) with Mint Chutney & 1 Banana",
                "timing": "08:15 AM",
                "foods": ["besan_chilla", "banana_snack"],
                "protein_g": 14.5,
                "calories": 335,
                "price_inr": 19.0,
                "prep_time_min": 8,
                "instructions": "Savory gram flour pancakes loaded with chopped onions and coriander.",
                "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Besan_Cheela.jpg/960px-Besan_Cheela.jpg",
                "budget_swap": "High fiber keeps you full through morning."
            }
            lunch = {
                "meal_type": "Lunch",
                "title": "Homestyle Chicken Curry (150g) with 3 Rotis & Salad",
                "timing": "01:30 PM",
                "foods": ["chicken_curry_homestyle", "wheat_roti"],
                "protein_g": 38.5,
                "calories": 430,
                "price_inr": 56.0 if target_budget >= 100.0 else 38.0,
                "prep_time_min": 20,
                "instructions": "Slow cooked chicken in rich onion-tomato curry served with hot rotis.",
                "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Indian_Chicken_Curry.jpg/960px-Indian_Chicken_Curry.jpg",
                "budget_swap": "Campus mess Friday special chicken or dhaba meal."
            }
            snack = {
                "meal_type": "Pre-Workout Snack",
                "title": "Roasted Peanuts (35g) + Hot Black Coffee",
                "timing": "05:15 PM",
                "foods": ["roasted_peanuts"],
                "protein_g": 9.0,
                "calories": 195,
                "price_inr": 8.0,
                "prep_time_min": 0,
                "instructions": "Pre-workout energy booster with sustained mono fats.",
                "image_url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d6/Roasted_peanuts_in_a_bowl.jpg/960px-Roasted_peanuts_in_a_bowl.jpg",
                "budget_swap": "Natural caffeine + healthy fats."
            }
            dinner = {
                "meal_type": "Dinner",
                "title": "Egg Bhurji (3 Eggs) with 3 Rotis & Spiced Dahi",
                "timing": "08:45 PM",
                "foods": ["egg_bhurji", "wheat_roti", "fresh_curd"],
                "protein_g": 28.5,
                "calories": 460,
                "price_inr": 34.0,
                "prep_time_min": 8,
                "instructions": "Hearty Friday dinner pairing egg protein with slow casein curd.",
                "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Anda_bhurji_pav.jpg/960px-Anda_bhurji_pav.jpg",
                "budget_swap": "Local dairy curd is ₹35/500g."
            }
        elif day_idx == 5:  # Saturday: Tawa Fish Fry Weekend
            theme = "Tawa Fish Fry & Double Omelette Saturday"
            breakfast = {
                "meal_type": "Breakfast",
                "title": "Masala Omelette (2 Eggs) with 2 Rotis or Bread",
                "timing": "08:45 AM",
                "foods": ["masala_omelette", "wheat_roti"],
                "protein_g": 19.5,
                "calories": 330,
                "price_inr": 24.0,
                "prep_time_min": 5,
                "instructions": "Hot pan omelette with onions, chillies and pepper.",
                "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Masala_Omelette.jpg/960px-Masala_Omelette.jpg",
                "budget_swap": "Wholesale eggs save ₹2 per egg."
            }
            lunch = {
                "meal_type": "Lunch",
                "title": "Tawa Fish Fry (150g) with Steamed Rice & Dal" if target_budget >= 100.0 else "Soya & Dal Rice with 2 Boiled Eggs",
                "timing": "01:30 PM",
                "foods": ["fish_fry_tawa", "steamed_rice", "moong_dal"] if target_budget >= 100.0 else ["soya_chunks", "whole_eggs", "steamed_rice"],
                "protein_g": 41.8 if target_budget >= 100.0 else 35.0,
                "calories": 480,
                "price_inr": 58.0 if target_budget >= 100.0 else 28.0,
                "prep_time_min": 15,
                "instructions": "Pan-seared fish coated in spicy lemon marinade with rice and dal.",
                "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Fish_fry_indian.jpg/960px-Fish_fry_indian.jpg" if target_budget >= 100.0 else "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80",
                "budget_swap": "Saturday market fish is freshest and cheapest."
            }
            snack = {
                "meal_type": "Pre-Workout Snack",
                "title": "Roasted Bhuna Chana (40g) + 1 Banana",
                "timing": "05:15 PM",
                "foods": ["roasted_chana", "banana_snack"],
                "protein_g": 9.5,
                "calories": 250,
                "price_inr": 13.0,
                "prep_time_min": 0,
                "instructions": "Pre-workout energy booster with complex carbs and plant protein.",
                "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Torraos-Las_Mayas-2011.JPG/960px-Torraos-Las_Mayas-2011.JPG",
                "budget_swap": "Desk snack ready in 0 seconds."
            }
            dinner = {
                "meal_type": "Dinner",
                "title": "Egg Bhurji (3 Eggs) with 3 Rotis & Salad",
                "timing": "09:00 PM",
                "foods": ["egg_bhurji", "wheat_roti"],
                "protein_g": 24.5,
                "calories": 385,
                "price_inr": 28.0,
                "prep_time_min": 7,
                "instructions": "Spicy Indian scrambled eggs with fresh rotis.",
                "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Anda_bhurji_pav.jpg/960px-Anda_bhurji_pav.jpg",
                "budget_swap": "Add green chillies and coriander."
            }
        else:  # Sunday: Chicken Biryani Feast
            theme = "Sunday Special: Desi Chicken Feast & Double Egg Bhurji"
            breakfast = {
                "meal_type": "Breakfast",
                "title": "Egg Bhurji (3 Eggs) with 2 Rotis or Bread",
                "timing": "09:00 AM",
                "foods": ["egg_bhurji", "wheat_roti"],
                "protein_g": 24.5,
                "calories": 385,
                "price_inr": 28.0,
                "prep_time_min": 7,
                "instructions": "Sunday morning 3-egg bhurji with toasted bread or warm rotis.",
                "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Anda_bhurji_pav.jpg/960px-Anda_bhurji_pav.jpg",
                "budget_swap": "High protein recovery breakfast."
            }
            lunch = {
                "meal_type": "Lunch",
                "title": "Sunday Mess Chicken Curry (180g) with Steamed Rice & Dahi",
                "timing": "01:30 PM",
                "foods": ["chicken_curry_homestyle", "steamed_rice", "fresh_curd"],
                "protein_g": 40.0,
                "calories": 520,
                "price_inr": 62.0 if target_budget >= 100.0 else 42.0,
                "prep_time_min": 25,
                "instructions": "Traditional Sunday student chicken curry feast with extra gravy over rice.",
                "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Indian_Chicken_Curry.jpg/960px-Indian_Chicken_Curry.jpg",
                "budget_swap": "Every campus mess offers Sunday chicken meal."
            }
            snack = {
                "meal_type": "Pre-Workout Snack",
                "title": "Chana Sattu Shake (50g) with Black Salt & Lemon",
                "timing": "05:15 PM",
                "foods": ["sattu_drink"],
                "protein_g": 11.5,
                "calories": 190,
                "price_inr": 11.0,
                "prep_time_min": 2,
                "instructions": "Cold sattu shake with black salt and lemon.",
                "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Torraos-Las_Mayas-2011.JPG/960px-Torraos-Las_Mayas-2011.JPG",
                "budget_swap": "Zero cook drink."
            }
            dinner = {
                "meal_type": "Dinner",
                "title": "Homestyle Chicken Curry with 3 Rotis" if target_budget >= 100.0 else "Spicy Soya Keema Bhurji with 3 Rotis",
                "timing": "08:45 PM",
                "foods": ["chicken_curry_homestyle", "wheat_roti"] if target_budget >= 100.0 else ["soya_bhurji", "wheat_roti"],
                "protein_g": 38.5 if target_budget >= 100.0 else 37.5,
                "calories": 430,
                "price_inr": 56.0 if target_budget >= 100.0 else 20.0,
                "prep_time_min": 15,
                "instructions": "Sunday night dinner ensuring a deep anabolic protein surplus.",
                "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Indian_Chicken_Curry.jpg/960px-Indian_Chicken_Curry.jpg" if target_budget >= 100.0 else "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Soya_bhurji.jpg/960px-Soya_bhurji.jpg",
                "budget_swap": "Wrap chicken pieces in rotis for easy eating."
            }

    # Aggregate day metrics
    day_meals = [breakfast, lunch, snack, dinner]
    tot_prot = round(sum(m["protein_g"] for m in day_meals), 1)
    tot_cal = int(sum(m["calories"] for m in day_meals))
    tot_price = round(sum(m["price_inr"] for m in day_meals), 1)

    return {
        "day_number": day_idx + 1,
        "day_name": day_name,
        "day_short": day_short,
        "theme": theme,
        "total_protein_g": tot_prot,
        "total_calories": tot_cal,
        "total_price_inr": tot_price,
        "budget_inr": target_budget,
        "budget_remaining_inr": max(0.0, round(target_budget - tot_price, 1)),
        "meals": day_meals
    }

def generate_daily_meal_plan(
    dietary_preference: str = "vegetarian",
    daily_budget_inr: float = 80.0,
    target_protein_g: float = 120.0,
    mode: str = "hostel" # 'hostel', 'mess', 'no_cook', 'exam_week', 'veg_muscle'
) -> Dict[str, Any]:
    """
    Generates a personalized 7-Day Day-Wise meal schedule tailored precisely to the user's
    daily budget, dietary preference, and student living constraints.
    """
    diet_pref = (dietary_preference or "vegetarian").lower()
    b = float(daily_budget_inr or 80.0)

    # Determine budget tier
    if b < 75.0:
        tier_key = "tier_60"
        tier_title = "Hostel Survival Tier (₹60 - ₹70/day)"
        tier_tagline = "Maximum protein per rupee using high-efficiency staples (Sattu, Soya Chunks, Besan/Moong Chilla, Roasted Chana)."
    elif b < 95.0:
        tier_key = "tier_80"
        tier_title = "Smart Student Standard (₹80/day)"
        tier_tagline = "Balanced nutrition featuring Moong & Besan Chillas, Egg/Paneer Bhurji, Soya Pulao, Dahi Tadka, and Oats."
    elif b < 115.0:
        tier_key = "tier_100"
        tier_title = "Performance Booster (₹100/day)"
        tier_tagline = "Upgraded daily variety with Masala Omelettes, Paneer/Egg Bhurji, Kala Chana Chaat, and Homestyle Chicken."
    elif b < 140.0:
        tier_key = "tier_120"
        tier_title = "Hypertrophy Tier (₹120/day)"
        tier_tagline = "Real dairy paneer blocks, juicy chicken breast, fresh Tawa Fish Fry, multi-egg stacks, and rich oatmeal."
    else:
        tier_key = "tier_150"
        tier_title = "Pro Campus Athlete (₹150+/day)"
        tier_tagline = "Top-shelf student bodybuilding stack with peak protein density, chicken, fish, double bhurji, and high-calorie fuel."

    # Build all 7 days (Monday=0 to Sunday=6)
    days = []
    for day_i in range(7):
        day_data = get_day_recipes(tier_key, diet_pref, mode, day_i)
        days.append(day_data)

    # Calculate weekly summaries
    tot_week_prot = round(sum(d["total_protein_g"] for d in days), 1)
    tot_week_cost = round(sum(d["total_price_inr"] for d in days), 1)
    avg_daily_cost = round(tot_week_cost / 7.0, 1)
    avg_daily_prot = round(tot_week_prot / 7.0, 1)

    # Day 1 is default active day for backward compatibility
    day_one = days[0]

    return {
        "budget_tier": tier_key,
        "tier_title": tier_title,
        "tier_tagline": tier_tagline,
        "dietary_preference": diet_pref,
        "target_protein_g": target_protein_g,
        "daily_budget_inr": b,
        "total_weekly_cost_inr": tot_week_cost,
        "average_daily_cost_inr": avg_daily_cost,
        "average_daily_protein_g": avg_daily_prot,
        "days": days,
        # Backward compatibility for direct consumers of day-1 meals
        "total_protein_g": day_one["total_protein_g"],
        "total_calories": day_one["total_calories"],
        "total_price_inr": day_one["total_price_inr"],
        "budget_remaining_inr": day_one["budget_remaining_inr"],
        "meals": day_one["meals"]
    }

def generate_weekly_grocery_list(daily_plan: Dict[str, Any]) -> Dict[str, Any]:
    """
    Aggregates ingredients for 7 days with bulk purchasing quantities,
    estimated weekly cost in ₹, and student savings tips, dynamically calibrated
    to the daily plan's budget tier and diet.
    """
    daily_budget = daily_plan.get("daily_budget_inr", 80.0)
    tier = daily_plan.get("budget_tier", "tier_80")
    diet = daily_plan.get("dietary_preference", "vegetarian").lower()

    if tier == "tier_60":
        items = [
            {"item": "Moong Dal & Besan (Combo Pack)", "quantity": "1 kg (500g each)", "cost_inr": 120, "shelf_life": "6 months", "tip": "Use for morning Moong Chillas and Besan Cheelas. 25g plant protein per 100g."},
            {"item": "Soya Chunks / Granules (Bulk)", "quantity": "1 kg wholesale sack", "cost_inr": 110, "shelf_life": "12 months", "tip": "52% pure protein: 1 kg provides 520g pure protein for ₹110."},
            {"item": "Chana Sattu Powder", "quantity": "1 kg packet", "cost_inr": 140, "shelf_life": "6 months", "tip": "Mix with cold water, salt, and lemon for zero-cook 26g protein shakes."},
            {"item": "Roasted Bhuna Chana", "quantity": "1 kg bag", "cost_inr": 140, "shelf_life": "3 months", "tip": "Desk study snack that prevents canteen impulse spending."},
            {"item": "Fresh Eggs Crate (if Eggetarian/Non-Veg)", "quantity": "30 eggs crate", "cost_inr": 180, "shelf_life": "3 weeks", "tip": "Wholesale crate cuts cost to ₹6/egg instead of ₹8 tapri price."}
        ]
    elif tier == "tier_80":
        items = [
            {"item": "Moong Dal & Besan (Chilla Flour)", "quantity": "1.5 kg combo", "cost_inr": 160, "shelf_life": "6 months", "tip": "Whisk with ajwain and chillies for instant high-protein breakfast."},
            {"item": "Fresh Eggs Crate (if Egg/Non-Veg)", "quantity": "30 eggs crate", "cost_inr": 180, "shelf_life": "3 weeks", "tip": "Boil 2-3 eggs daily in hostel kettle or make spicy Egg Bhurji."},
            {"item": "Rolled Oats (Plain)", "quantity": "1 kg bag", "cost_inr": 150, "shelf_life": "6 months", "tip": "Unflavored oats cost 40% less than sugary branded packets."},
            {"item": "Amul Toned Milk (Blue Pouch)", "quantity": "7 pouches (500ml)", "cost_inr": 196, "shelf_life": "Daily pickup", "tip": "Blue pouch gives superior protein-to-fat ratio for students."},
            {"item": "Soya Chunks & Granules", "quantity": "500g box (2 packs)", "cost_inr": 100, "shelf_life": "12 months", "tip": "Add to mess dal or make spicy Soya Keema Bhurji."},
            {"item": "Fresh Curd / Dahi", "quantity": "1.5 kg loose from local dairy", "cost_inr": 90, "shelf_life": "5 days", "tip": "Local dairy dahi is cheaper, thicker, and probiotic."}
        ]
    elif tier == "tier_100":
        items = [
            {"item": "Fresh Dairy Paneer (Block)", "quantity": "700g block", "cost_inr": 245, "shelf_life": "4 days", "tip": "Buy block from local dairy for ₹350/kg vs ₹480/kg packaged. Make Paneer Bhurji."},
            {"item": "Fresh Chicken (if Non-Veg)", "quantity": "1 kg fresh cut", "cost_inr": 220, "shelf_life": "3 days", "tip": "Cook homestyle chicken curry on Wednesday and Sunday."},
            {"item": "Fresh Eggs Crate", "quantity": "30 eggs crate", "cost_inr": 180, "shelf_life": "3 weeks", "tip": "Provides daily eggs for Masala Omelettes and Egg Bhurji."},
            {"item": "Moong Dal & Besan", "quantity": "1 kg bag", "cost_inr": 120, "shelf_life": "6 months", "tip": "Morning chillas guarantee 20g protein before first lecture."},
            {"item": "Peanut Butter (Unsweetened 1kg)", "quantity": "1 kg tub", "cost_inr": 280, "shelf_life": "6 months", "tip": "Split a 1kg tub with your hostel roommate to halve the upfront cost."}
        ]
    elif tier == "tier_120":
        items = [
            {"item": "Fresh Dairy Paneer (Block)", "quantity": "1 kg block", "cost_inr": 350, "shelf_life": "5 days", "tip": "Cube and store in cold water in fridge/cooler to stay soft. Great for Bhurji."},
            {"item": "Chicken Breast & Rohu Fish", "quantity": "1.5 kg combo (if Non-Veg)", "cost_inr": 360, "shelf_life": "3 days", "tip": "Alternate between homestyle chicken curry and crisp tawa fish fry."},
            {"item": "Fresh Eggs Crate", "quantity": "2 crates (60 eggs)", "cost_inr": 360, "shelf_life": "3 weeks", "tip": "Provides 4-5 eggs daily for uninterrupted hypertrophy."},
            {"item": "Moong Dal & Besan Chilla Stack", "quantity": "1.5 kg flour combo", "cost_inr": 180, "shelf_life": "6 months", "tip": "Morning protein powerhouse pancakes."},
            {"item": "Amul Toned Milk", "quantity": "10 pouches (500ml)", "cost_inr": 280, "shelf_life": "Daily pickup", "tip": "High bioavailability casein and whey protein."}
        ]
    else: # tier_150
        items = [
            {"item": "Fresh Dairy Paneer & Chicken Breast", "quantity": "2 kg combo", "cost_inr": 580, "shelf_life": "Fresh", "tip": "Peak protein intake for high-volume athletic training."},
            {"item": "Fresh Eggs Crate (60 Eggs)", "quantity": "2 crates (60 eggs)", "cost_inr": 360, "shelf_life": "3 weeks", "tip": "Wholesale mandi purchase saves up to ₹120 per fortnight."},
            {"item": "Moong & Besan Chilla Flour Stack", "quantity": "2 kg", "cost_inr": 240, "shelf_life": "6 months", "tip": "Loaded breakfast with zero refined flour."},
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
            "Always buy whole crates of 30 eggs from wholesale egg mandis (₹6/egg vs ₹8-₹10 tapri price).",
            "Soya chunks & granules are 52% protein: 1 kg gives 520g pure protein for ₹100-₹110.",
            "Buy besan and moong dal from local wholesale kirana for fresh, preservative-free chilla batter.",
            "Buy paneer in loose 500g/1kg blocks from local sweet shops (dairies) instead of branded retail packets to save 25-30%.",
            "Keep lemons and rock salt handy in hostel room to turn plain water and sattu into instant refreshing protein shakes."
        ]
    }
