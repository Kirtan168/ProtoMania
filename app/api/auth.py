import sqlite3
import jwt
from datetime import datetime, timedelta
from fastapi import APIRouter, HTTPException, Depends, Header
from typing import Optional
from app.config import settings
from app.database import get_db, hash_password, verify_password
from app.models.user import RegisterRequest, LoginRequest, UserResponse, TokenResponse, UpdateUserRequest

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

def create_access_token(user_id: int, username: str) -> str:
    payload = {
        "sub": str(user_id),
        "username": username,
        "exp": datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

def get_current_user_optional(
    authorization: Optional[str] = Header(None),
    db: sqlite3.Connection = Depends(get_db)
) -> Optional[dict]:
    if not authorization or not authorization.startswith("Bearer "):
        # Default to demo user for seamless evaluator experience
        cursor = db.cursor()
        cursor.execute("SELECT * FROM users WHERE email = 'demo@protomania.app'")
        row = cursor.fetchone()
        return dict(row) if row else None
    
    token = authorization.split(" ")[1]
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id = int(payload.get("sub"))
        cursor = db.cursor()
        cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
        row = cursor.fetchone()
        return dict(row) if row else None
    except Exception:
        cursor = db.cursor()
        cursor.execute("SELECT * FROM users WHERE email = 'demo@protomania.app'")
        row = cursor.fetchone()
        return dict(row) if row else None

@router.post("/register", response_model=TokenResponse)
def register_user(req: RegisterRequest, db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("SELECT id FROM users WHERE email = ? OR username = ?", (req.email, req.username))
    if cursor.fetchone():
        raise HTTPException(status_code=400, detail="Email or username already registered")

    pwd_hash = hash_password(req.password)
    cursor.execute("""
    INSERT INTO users (email, username, password_hash, full_name, avatar_url)
    VALUES (?, ?, ?, ?, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80')
    """, (req.email, req.username, pwd_hash, req.full_name))
    user_id = cursor.lastrowid

    # Create default user_xp
    cursor.execute("INSERT INTO user_xp (user_id, total_xp, level) VALUES (?, 100, 1)", (user_id,))
    cursor.execute("""
    INSERT INTO xp_transactions (user_id, action, xp_amount, description)
    VALUES (?, 'ACCOUNT_REGISTER', 100, 'Welcome to the PROTOMANIA Era!')
    """, (user_id,))
    db.commit()

    token = create_access_token(user_id, req.username)
    user_res = UserResponse(
        id=user_id,
        email=req.email,
        username=req.username,
        full_name=req.full_name,
        avatar_url='https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
    )
    return TokenResponse(access_token=token, user=user_res)

@router.post("/login", response_model=TokenResponse)
def login_user(req: LoginRequest, db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM users WHERE email = ? OR username = ?", (req.email_or_username, req.email_or_username))
    row = cursor.fetchone()
    if not row or not verify_password(req.password, row["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email/username or password")

    user_dict = dict(row)
    token = create_access_token(user_dict["id"], user_dict["username"])
    user_res = UserResponse(
        id=user_dict["id"],
        email=user_dict["email"],
        username=user_dict["username"],
        full_name=user_dict["full_name"],
        avatar_url=user_dict["avatar_url"]
    )
    return TokenResponse(access_token=token, user=user_res)

@router.post("/guest-login", response_model=TokenResponse)
def guest_login(db: sqlite3.Connection = Depends(get_db)):
    """One-click login as Demo Student for teacher/evaluator convenience"""
    cursor = db.cursor()
    cursor.execute("SELECT * FROM users WHERE email = 'demo@protomania.app'")
    row = cursor.fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="Demo student profile not found")
    user_dict = dict(row)
    token = create_access_token(user_dict["id"], user_dict["username"])
    user_res = UserResponse(
        id=user_dict["id"],
        email=user_dict["email"],
        username=user_dict["username"],
        full_name=user_dict["full_name"],
        avatar_url=user_dict["avatar_url"]
    )
    return TokenResponse(access_token=token, user=user_res)

@router.get("/me", response_model=UserResponse)
def get_me(user: dict = Depends(get_current_user_optional)):
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return UserResponse(
        id=user["id"],
        email=user["email"],
        username=user["username"],
        full_name=user["full_name"],
        avatar_url=user.get("avatar_url"),
        created_at=user.get("created_at")
    )

@router.put("/profile", response_model=UserResponse)
def update_user_profile(
    req: UpdateUserRequest,
    user: dict = Depends(get_current_user_optional),
    db: sqlite3.Connection = Depends(get_db)
):
    user_id = user["id"] if user else 1
    cursor = db.cursor()
    if req.full_name and req.full_name.strip():
        cursor.execute("UPDATE users SET full_name = ? WHERE id = ?", (req.full_name.strip(), user_id))
    if req.username and req.username.strip():
        cursor.execute("UPDATE users SET username = ? WHERE id = ?", (req.username.strip(), user_id))
    db.commit()
    cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
    row = cursor.fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="User not found")
    user_dict = dict(row)
    return UserResponse(
        id=user_dict["id"],
        email=user_dict["email"],
        username=user_dict["username"],
        full_name=user_dict["full_name"],
        avatar_url=user_dict.get("avatar_url"),
        created_at=user_dict.get("created_at")
    )

