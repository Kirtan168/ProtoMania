import sqlite3
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from app.database import get_db
from app.api.auth import get_current_user_optional
from app.services.ai_buddy import ask_fitness_buddy

router = APIRouter(prefix="/api/ai", tags=["AI Fitness Buddy"])

class ChatMessage(BaseModel):
    role: str # 'user' or 'assistant'
    content: str

class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1)
    history: Optional[List[ChatMessage]] = []

@router.post("/chat")
async def chat_with_buddy(
    req: ChatRequest,
    user: dict = Depends(get_current_user_optional),
    db: sqlite3.Connection = Depends(get_db)
):
    user_id = user["id"] if user else 1
    cursor = db.cursor()

    # Retrieve user profile & budget context
    cursor.execute("SELECT * FROM profiles WHERE user_id = ?", (user_id,))
    p_row = cursor.fetchone()
    profile_dict = dict(p_row) if p_row else {}
    budget = profile_dict.get("daily_budget_inr", 80.0)

    # Format history
    history_list = [{"role": m.role, "content": m.content} for m in req.history or []]

    response = await ask_fitness_buddy(
        message=req.message,
        conversation_history=history_list,
        user_profile=profile_dict,
        budget_inr=budget
    )

    return response
