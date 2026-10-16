from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class RegisterRequest(BaseModel):
    email: str = Field(..., min_length=5, description="Student email address")
    username: str = Field(..., min_length=3, max_length=30)
    password: str = Field(..., min_length=6)
    full_name: str = Field(..., min_length=2)

class LoginRequest(BaseModel):
    email_or_username: str
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    username: str
    full_name: str
    avatar_url: Optional[str] = None
    created_at: Optional[str] = None

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class UpdateUserRequest(BaseModel):
    full_name: Optional[str] = None
    username: Optional[str] = None

class ProfileRequest(BaseModel):
    full_name: Optional[str] = None
    age: int = Field(..., ge=14, le=80)
    height_cm: float = Field(..., ge=100.0, le=250.0)
    weight_kg: float = Field(..., ge=30.0, le=250.0)
    target_weight_kg: Optional[float] = None
    waist_cm: Optional[float] = None
    sex: str = "male" # 'male', 'female', 'other_skip'
    fitness_level: str = "beginner" # 'beginner', 'intermediate', 'advanced'
    goal: str = "muscle_building" # 'muscle_building', 'fat_loss', 'body_recomp', 'strength', 'endurance', 'maintenance'
    training_location: str = "gym" # 'gym', 'home', 'hostel', 'outdoor'
    equipment: str = "full_gym" # 'full_gym', 'dumbbells', 'pullup_bar', 'bodyweight'
    days_per_week: int = Field(4, ge=2, le=7)
    workout_duration: int = Field(45, ge=20, le=120)
    dietary_preference: str = "vegetarian" # 'vegetarian', 'eggetarian', 'non_vegetarian', 'vegan'
    allergies: str = "none" # comma-separated or 'none'
    dislikes: str = ""
    daily_budget_inr: float = Field(..., ge=20.0, le=1000.0)
    budget_mode: str = "protein_only" # 'protein_only' vs 'total_food'
    supplement_budget: float = 0.0
    hostel_mode: int = 1 # 1 or 0
    cooking_access: str = "kettle_or_mess" # 'hostel_mess', 'kettle_or_mess', 'shared_kitchen', 'full_kitchen', 'no_cook'
    activity_level: str = "moderate" # 'sedentary', 'light', 'moderate', 'very_active'
    average_steps: Optional[int] = 6000
    sleep_hours: Optional[float] = 7.0
    college_schedule: Optional[str] = "morning_classes"
    preferred_workout_time: Optional[str] = "evening"

class TargetsResponse(BaseModel):
    bmi: float
    bmi_category: str
    bmr: float
    tdee: float
    target_calories: float
    target_protein_g: float
    target_carbs_g: float
    target_fat_g: float
    target_cost_inr: float
    protein_per_rupee: float
    limitations_notes: str
