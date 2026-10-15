import sys
import os
from pathlib import Path

# Add project root directory to sys.path so 'app' module is directly importable
ROOT_DIR = Path(__file__).resolve().parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

# Signal Vercel serverless environment
os.environ["VERCEL"] = "1"

from app.main import app
from app.database import init_db

# Ensure SQLite schema and initial seed data are populated on cold start
try:
    init_db()
except Exception as e:
    print(f"Serverless DB initialization: {e}")
