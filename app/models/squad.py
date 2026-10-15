from pydantic import BaseModel, Field
from typing import Optional, List

class SquadCreateRequest(BaseModel):
    name: str = Field(..., min_length=3, max_length=50)
    description: str = Field(..., min_length=5, max_length=200)

class SquadJoinRequest(BaseModel):
    invite_code: str = Field(..., min_length=4, max_length=12)

class SquadMemberResponse(BaseModel):
    user_id: int
    username: str
    full_name: str
    level: int
    streak_days: int
    weekly_xp: int
    avatar_url: Optional[str] = None

class SquadDetailResponse(BaseModel):
    id: int
    name: str
    invite_code: str
    description: str
    member_count: int
    members: List[SquadMemberResponse]
    challenge_title: str
    challenge_progress_percent: int
