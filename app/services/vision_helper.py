"""
Meal Photo & Hostel Mess Menu Vision Helper.
Analyzes uploaded food imagery or weekly college mess timetables,
detects likely dishes, computes macro estimates, detects protein deficits,
and prompts users for portion confirmation.
"""

from typing import Dict, Any, List

SAMPLE_MESS_PRESETS = {
    "monday_lunch": {
        "menu_name": "Standard College Mess Monday Lunch",
        "detected_items": [
            {"dish": "Moong Dal Tadka (1 katori)", "estimated_protein_g": 6.5, "calories": 140, "confidence": 0.92},
            {"dish": "Steamed White Rice (1 scoop)", "estimated_protein_g": 3.2, "calories": 180, "confidence": 0.95},
            {"dish": "Aloo Gobhi Sabzi (1 ladle)", "estimated_protein_g": 2.1, "calories": 150, "confidence": 0.88},
            {"dish": "Whole Wheat Rotis (2 pcs)", "estimated_protein_g": 6.0, "calories": 160, "confidence": 0.94}
        ],
        "total_estimated_protein_g": 17.8,
        "total_calories": 630,
        "protein_deficit_warning": "Warning: High carb meal (630 kcal) with only 17.8g protein (~11% protein ratio).",
        "budget_protein_remedy": "Stir in 40g pre-soaked Soya Chunks (+21g P, ₹10) or add 2 boiled eggs (+12.6g P, ₹14) to reach 38g+ Protein."
    },
    "wednesday_dinner": {
        "menu_name": "Mess Wednesday Night Special",
        "detected_items": [
            {"dish": "Rajma Masala (1 bowl)", "estimated_protein_g": 11.2, "calories": 210, "confidence": 0.93},
            {"dish": "Jeera Rice (1 plate)", "estimated_protein_g": 3.5, "calories": 200, "confidence": 0.91},
            {"dish": "Mixed Salad & Cucumber", "estimated_protein_g": 0.8, "calories": 30, "confidence": 0.85},
            {"dish": "Boiled Egg (Optional non-veg mess)", "estimated_protein_g": 6.0, "calories": 72, "confidence": 0.80}
        ],
        "total_estimated_protein_g": 21.5,
        "total_calories": 512,
        "protein_deficit_warning": "Moderate protein yield. Good lysine + methionine pairing between Rajma & Rice.",
        "budget_protein_remedy": "Add 1 cup fresh dahi (₹18, +8g P) to boost digestion and round out protein to 29.5g."
    }
}

def analyze_photo_or_menu(filename: str, input_type: str = "food_photo") -> Dict[str, Any]:
    """
    Simulates / processes meal identification and mess menu OCR.
    Always includes scientific disclaimers on photographic estimation limits.
    """
    preset = SAMPLE_MESS_PRESETS.get("monday_lunch")
    if "menu" in filename.lower() or input_type == "mess_menu":
        title = "Hostel Mess Timetable Analysis"
    else:
        title = "Meal Plate Visual Recognition"

    return {
        "analysis_title": title,
        "input_filename": filename,
        "input_type": input_type,
        "detected_dishes": preset["detected_items"],
        "total_estimated_protein_g": preset["total_estimated_protein_g"],
        "total_estimated_calories": preset["total_calories"],
        "assessment": preset["protein_deficit_warning"],
        "actionable_hack": preset["budget_protein_remedy"],
        "requires_user_confirmation": True,
        "confirmation_prompt": "Please confirm the number of rotis and whether extra oil/ghee was used, as photos cannot gauge cooking oil volume.",
        "scientific_disclaimer": (
            "Caution: Computer vision cannot detect hidden cooking fats, sugar, or sodium. "
            "Estimated protein values are based on standard Indian council of medical research (ICMR) portion tables."
        )
    }
