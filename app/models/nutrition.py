from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class FoodItemModel(BaseModel):
    id: str
    name: str
    hindi_name: Optional[str] = None
    category: str
    dietary_type: str
    serving_size: str
    serving_unit: str
    serving_amount: float
    protein_g: float
    calories: float
    carbs_g: float
    fat_g: float
    price_inr: float
    cost_per_10g_protein: float
    prep_time_min: int
    prep_type: str
    refrigeration_needed: bool
    is_hostel_friendly: bool
    image_url: str
    description: str

class BudgetSolveRequest(BaseModel):
    budget_inr: float = Field(..., ge=20.0, le=1000.0)
    target_protein_g: Optional[float] = None
    dietary_preference: str = "vegetarian" # 'vegetarian', 'eggetarian', 'non_vegetarian', 'vegan'
    hostel_only: bool = False
    no_cook_only: bool = False
    exclude_food_ids: List[str] = []

class FoodComboItem(BaseModel):
    food: FoodItemModel
    servings: float
    total_protein_g: float
    total_calories: float
    total_price_inr: float

class BudgetSolveResponse(BaseModel):
    budget_inr: float
    total_cost_inr: float
    total_protein_g: float
    total_calories: float
    protein_per_rupee: float
    remaining_budget_inr: float
    items: List[FoodComboItem]
    verdict: str
    student_tip: str

class SubstitutionRequest(BaseModel):
    food_id: str
    dietary_preference: Optional[str] = None
    reason: str = "cheaper" # 'cheaper', 'higher_protein', 'veg_alternative', 'no_cook'

class MealLogRequest(BaseModel):
    meal_name: str
    protein_g: float
    calories: float
    price_inr: float
    meal_type: str = "lunch"
