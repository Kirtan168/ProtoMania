import os
from pathlib import Path
from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.config import settings
from app.database import init_db
from app.api import (
    auth,
    onboarding,
    optimizer,
    meals,
    workouts,
    genz,
    ai_chat,
    developer_hub
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure database tables and initial seed data exist
    init_db()
    yield

app = FastAPI(
    title="PROTOMANIA",
    description="AI-Powered Fitness, Nutrition & Budget Optimization Platform for Students",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router)
app.include_router(onboarding.router)
app.include_router(optimizer.router)
app.include_router(meals.router)
app.include_router(workouts.router)
app.include_router(genz.router)
app.include_router(ai_chat.router)
app.include_router(developer_hub.router)

# Mount static assets
STATIC_DIR = Path(__file__).resolve().parent / "static"
TEMPLATES_DIR = Path(__file__).resolve().parent / "templates"

app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")

@app.get("/", response_class=HTMLResponse)
async def serve_home():
    index_file = TEMPLATES_DIR / "index.html"
    if index_file.exists():
        return HTMLResponse(content=index_file.read_text(encoding="utf-8"))
    return HTMLResponse("<h1>PROTOMANIA</h1>")

@app.get("/developers", response_class=HTMLResponse)
async def serve_developers():
    index_file = TEMPLATES_DIR / "index.html"
    if index_file.exists():
        return HTMLResponse(content=index_file.read_text(encoding="utf-8"))
    return HTMLResponse("<h1>PROTOMANIA Developer Hub</h1>")

# Catch-all client-side router fallback so direct URLs like /dashboard, /optimizer, /meals, /workouts, /wrapped, /developers work seamlessly
@app.get("/{full_path:path}", response_class=HTMLResponse)
async def catch_all(full_path: str):
    if full_path.startswith("api/") or full_path.startswith("docs") or full_path.startswith("static"):
        return HTMLResponse(status_code=404, content="Not found")
    index_file = TEMPLATES_DIR / "index.html"
    if index_file.exists():
        return HTMLResponse(content=index_file.read_text(encoding="utf-8"))
    return HTMLResponse("<h1>PROTOMANIA</h1>")
