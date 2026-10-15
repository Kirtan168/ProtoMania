from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class ExerciseItemModel(BaseModel):
    id: str
    name: str
    category: str
    target_muscles: List[str]
    equipment: str
    difficulty: str
    default_sets: int
    default_reps: str
    rest_seconds: int
    instructions: str
    form_cues: List[str]
    warmup_guidance: str
    alternatives: List[str]
    time_crunch_swap: str
    image_url: str

class WorkoutPlanRequest(BaseModel):
    split_type: Optional[str] = None # 'ppl', 'upper_lower', 'full_body', 'bodyweight'
    days_per_week: int = 4
    equipment: str = "full_gym"
    time_crunch_minutes: Optional[int] = None # 20 or 30 or 45

class SetLog(BaseModel):
    set_number: int
    weight_kg: float
    reps: int
    completed: bool = True

class ExerciseLog(BaseModel):
    exercise_id: str
    exercise_name: str
    sets: List[SetLog]

class WorkoutLogRequest(BaseModel):
    workout_title: str
    duration_min: int
    exercises: List[ExerciseLog]
    notes: Optional[str] = ""
