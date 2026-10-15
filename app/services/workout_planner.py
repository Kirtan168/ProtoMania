"""
Workout Planner & Progressive Overload Engine.
Generates personalized training splits (PPL, Upper/Lower, Full Body, Bodyweight),
interactive workout trackers, rest timers, and 'Time Crunch' adaptors.
"""

from typing import List, Dict, Any, Optional
from app.data.exercises_data import EXERCISES_DATASET

def generate_weekly_workout_split(
    split_type: str = "ppl",
    days_per_week: int = 4,
    equipment: str = "full_gym",
    time_crunch_minutes: Optional[int] = None
) -> List[Dict[str, Any]]:
    """
    Builds a weekly training split tailored to the student's available schedule and gear.
    """
    days = []
    
    # Map split
    if days_per_week <= 3:
        # Full Body Routine
        split_title = "3-Day Full Body Frequency"
        days.append({
            "day_name": "Day 1 (Monday)",
            "title": "Full Body A (Squat & Press Focus)",
            "duration_min": time_crunch_minutes or 45,
            "focus": "Compound strength & full body stimulus",
            "exercise_ids": ["barbell_back_squat", "barbell_bench_press", "barbell_bent_row", "lateral_raises", "plank_hold"]
        })
        days.append({
            "day_name": "Day 2 (Wednesday)",
            "title": "Full Body B (Hinge & Pull Focus)",
            "duration_min": time_crunch_minutes or 45,
            "focus": "Posterior chain & upper body density",
            "exercise_ids": ["romanian_deadlift", "pullups_chinups", "incline_dumbbell_press", "bicep_curls", "hanging_leg_raises"]
        })
        days.append({
            "day_name": "Day 3 (Friday)",
            "title": "Full Body C (Hypertrophy & Pump)",
            "duration_min": time_crunch_minutes or 45,
            "focus": "High volume muscle building & posture correction",
            "exercise_ids": ["bulgarian_split_squat", "overhead_shoulder_press", "triceps_dips_bench", "rear_delt_flyes", "standing_calf_raises"]
        })
    elif days_per_week == 4:
        # Upper / Lower Split
        split_title = "4-Day Upper / Lower Split"
        days.append({
            "day_name": "Day 1 (Monday)",
            "title": "Upper Body A (Horizontal Push/Pull)",
            "duration_min": time_crunch_minutes or 45,
            "focus": "Chest thickness, upper back density & lateral delts",
            "exercise_ids": ["barbell_bench_press", "barbell_bent_row", "lateral_raises", "triceps_dips_bench", "bicep_curls"]
        })
        days.append({
            "day_name": "Day 2 (Tuesday)",
            "title": "Lower Body A (Quad & Core Dominant)",
            "duration_min": time_crunch_minutes or 45,
            "focus": "Squat strength, quads & athletic core",
            "exercise_ids": ["barbell_back_squat", "bulgarian_split_squat", "standing_calf_raises", "hanging_leg_raises", "plank_hold"]
        })
        days.append({
            "day_name": "Day 3 (Thursday)",
            "title": "Upper Body B (Vertical Push/Pull & Arms)",
            "duration_min": time_crunch_minutes or 45,
            "focus": "V-Taper lats, upper chest & 3D deltoids",
            "exercise_ids": ["pullups_chinups", "incline_dumbbell_press", "overhead_shoulder_press", "rear_delt_flyes", "bicep_curls"]
        })
        days.append({
            "day_name": "Day 4 (Friday)",
            "title": "Lower Body B (Posterior Chain & Calves)",
            "duration_min": time_crunch_minutes or 45,
            "focus": "Hamstrings, glute power & calves",
            "exercise_ids": ["romanian_deadlift", "bulgarian_split_squat", "standing_calf_raises", "plank_hold"]
        })
    else:
        # 5 or 6-Day Push / Pull / Legs Split
        split_title = "Push / Pull / Legs (PPL) Split"
        days.append({
            "day_name": "Day 1 (Monday)",
            "title": "Push Day (Chest, Shoulders, Triceps)",
            "duration_min": time_crunch_minutes or 45,
            "focus": "Upper body pressing volume and tricep extension",
            "exercise_ids": ["barbell_bench_press", "incline_dumbbell_press", "overhead_shoulder_press", "lateral_raises", "triceps_dips_bench"]
        })
        days.append({
            "day_name": "Day 2 (Tuesday)",
            "title": "Pull Day (Back, Biceps, Rear Delts)",
            "duration_min": time_crunch_minutes or 45,
            "focus": "V-taper width, row thickness and bicep peak",
            "exercise_ids": ["pullups_chinups", "barbell_bent_row", "rear_delt_flyes", "bicep_curls", "hanging_leg_raises"]
        })
        days.append({
            "day_name": "Day 3 (Wednesday)",
            "title": "Legs & Core Day (Quads, Hamstrings, Calves)",
            "duration_min": time_crunch_minutes or 45,
            "focus": "Quad quad drive, hamstring hinge, calf burn",
            "exercise_ids": ["barbell_back_squat", "romanian_deadlift", "bulgarian_split_squat", "standing_calf_raises", "plank_hold"]
        })
        days.append({
            "day_name": "Day 4 (Friday)",
            "title": "Push Hypertrophy Day",
            "duration_min": time_crunch_minutes or 45,
            "focus": "Upper chest incline emphasis and lateral delt burnout",
            "exercise_ids": ["incline_dumbbell_press", "pushups_standard", "lateral_raises", "overhead_shoulder_press", "triceps_dips_bench"]
        })
        days.append({
            "day_name": "Day 5 (Saturday)",
            "title": "Pull & Arm Blast Day",
            "duration_min": time_crunch_minutes or 45,
            "focus": "Pull-up progression and arm hypertrophy supersets",
            "exercise_ids": ["pullups_chinups", "barbell_bent_row", "bicep_curls", "rear_delt_flyes", "hanging_leg_raises"]
        })

    # Hydrate exercise objects and apply equipment filtering if hostel bodyweight
    exercise_dict = {e["id"]: e for e in EXERCISES_DATASET}
    
    hydrated_days = []
    for d in days:
        ex_list = []
        for ex_id in d["exercise_ids"]:
            if ex_id in exercise_dict:
                ex_copy = dict(exercise_dict[ex_id])
                
                # If bodyweight/hostel equipment mode, swap barbell with alternative
                if equipment in ("bodyweight", "hostel_room") and ex_copy["equipment"] != "bodyweight":
                    ex_copy["name"] = f"Hostel: {ex_copy['alternatives'][0]}"
                    ex_copy["equipment"] = "bodyweight / hostel furniture"

                # If time crunch, reduce sets and rest
                if time_crunch_minutes and time_crunch_minutes <= 30:
                    ex_copy["default_sets"] = max(2, ex_copy["default_sets"] - 1)
                    ex_copy["rest_seconds"] = 45

                ex_list.append(ex_copy)
        
        hydrated_days.append({
            "day_name": d["day_name"],
            "title": d["title"],
            "duration_min": d["duration_min"],
            "focus": d["focus"],
            "exercises": ex_list
        })

    return hydrated_days

def check_progressive_overload(last_log: Optional[Dict[str, Any]], current_log: Dict[str, Any]) -> Dict[str, Any]:
    """
    Evaluates progressive overload by comparing volume load (weight x reps)
    against the previous workout session.
    """
    if not last_log:
        return {
            "overload_achieved": True,
            "summary": "Baseline logged! Future sessions will track your strength progression against today's numbers.",
            "xp_bonus": 25
        }

    # Compare total weight lifted
    last_volume = sum(s.get("weight_kg", 0) * s.get("reps", 0) for ex in last_log.get("exercises", []) for s in ex.get("sets", []))
    curr_volume = sum(s.get("weight_kg", 0) * s.get("reps", 0) for ex in current_log.get("exercises", []) for s in ex.get("sets", []))

    diff = curr_volume - last_volume
    if diff > 0:
        return {
            "overload_achieved": True,
            "diff_kg": round(diff, 1),
            "summary": f"Progressive Overload Unlocked! You moved +{round(diff, 1)} kg more total volume than last session! +50 XP",
            "xp_bonus": 50
        }
    elif diff == 0:
        return {
            "overload_achieved": True,
            "diff_kg": 0,
            "summary": "Consistency maintained! Equal volume logged.",
            "xp_bonus": 20
        }
    else:
        return {
            "overload_achieved": False,
            "diff_kg": round(diff, 1),
            "summary": "Deload or lighter technique session. Focus on rest and protein intake tonight.",
            "xp_bonus": 10
        }
