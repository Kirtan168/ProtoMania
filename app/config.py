import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

class Settings:
    PROJECT_NAME: str = "PROTOMANIA"
    PROJECT_VERSION: str = "1.0.0"
    TAGLINE: str = "Your Body. Your Budget. Your Era."
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "protomania-ultra-secure-key-2026-genz-fitness-acidlime")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # Database
    DATABASE_PATH: Path = BASE_DIR / "protomania.db"
    
    # AI Provider (Google Gemini if available in env, or graceful fallback)
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", os.getenv("GOOGLE_API_KEY", ""))
    AI_MODEL: str = "gemini-1.5-flash"
    
    # Brand Identity Colors
    COLOR_PROTO_BLACK: str = "#111410"
    COLOR_ACID_LIME: str = "#D8FF3E"
    COLOR_CLOUD_WHITE: str = "#F4F5EF"
    COLOR_STEEL_GREY: str = "#858A80"
    COLOR_ELECTRIC_VIOLET: str = "#9C8AFF"
    COLOR_DARK_SURFACE: str = "#1B1E19"
    COLOR_BORDER_GREY: str = "#34382F"

settings = Settings()
