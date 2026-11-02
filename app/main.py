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

def get_index_html() -> str:
    candidates = [
        TEMPLATES_DIR / "index.html",
        Path(__file__).resolve().parent / "templates" / "index.html",
        Path.cwd() / "app" / "templates" / "index.html",
        Path("/var/task/app/templates/index.html"),
    ]
    for p in candidates:
        if p.exists():
            return p.read_text(encoding="utf-8")
    return "<h1>PROTOMANIA</h1>"

@app.get("/", response_class=HTMLResponse)
async def serve_home():
    return HTMLResponse(content=get_index_html())

@app.get("/download/agile-backlog")
async def download_agile_backlog():
    candidates = [
        STATIC_DIR / "downloads" / "PROTOMANIA_Agile_Epics_and_User_Stories.docx",
        Path.cwd() / "app" / "static" / "downloads" / "PROTOMANIA_Agile_Epics_and_User_Stories.docx",
        Path("/var/task/app/static/downloads/PROTOMANIA_Agile_Epics_and_User_Stories.docx")
    ]
    for p in candidates:
        if p.exists():
            return FileResponse(
                path=str(p),
                filename="PROTOMANIA_Agile_Epics_and_User_Stories.docx",
                media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            )
    return HTMLResponse(status_code=404, content="Agile Backlog document not found")

@app.get("/download/jira-csv")
async def download_jira_csv():
    candidates = [
        STATIC_DIR / "downloads" / "jira_user_stories_import.csv",
        Path.cwd() / "app" / "static" / "downloads" / "jira_user_stories_import.csv",
        Path("/var/task/app/static/downloads/jira_user_stories_import.csv")
    ]
    for p in candidates:
        if p.exists():
            return FileResponse(
                path=str(p),
                filename="jira_user_stories_import.csv",
                media_type="text/csv"
            )
    return HTMLResponse(status_code=404, content="Jira CSV import file not found")

@app.get("/download/prd-docx")
async def download_prd_docx():
    candidates = [
        STATIC_DIR / "downloads" / "PROTOMANIA_Product_Strategy_and_PRD.docx",
        Path.cwd() / "app" / "static" / "downloads" / "PROTOMANIA_Product_Strategy_and_PRD.docx",
        Path("/var/task/app/static/downloads/PROTOMANIA_Product_Strategy_and_PRD.docx")
    ]
    for p in candidates:
        if p.exists():
            return FileResponse(
                path=str(p),
                filename="PROTOMANIA_Product_Strategy_and_PRD.docx",
                media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            )
    return HTMLResponse(status_code=404, content="PRD Word document not found")

@app.get("/download/future-stories-csv")
async def download_future_stories_csv():
    candidates = [
        STATIC_DIR / "downloads" / "jira_future_user_stories.csv",
        Path.cwd() / "app" / "static" / "downloads" / "jira_future_user_stories.csv",
        Path("/var/task/app/static/downloads/jira_future_user_stories.csv")
    ]
    for p in candidates:
        if p.exists():
            return FileResponse(
                path=str(p),
                filename="jira_future_user_stories.csv",
                media_type="text/csv"
            )
    return HTMLResponse(status_code=404, content="Future User Stories CSV file not found")

@app.get("/download/prd-csv")
@app.get("/download/confluence-csv")
async def download_confluence_prd_csv():
    candidates = [
        STATIC_DIR / "downloads" / "confluence_prd_and_strategy.csv",
        Path.cwd() / "app" / "static" / "downloads" / "confluence_prd_and_strategy.csv",
        Path.cwd() / "public" / "static" / "downloads" / "confluence_prd_and_strategy.csv",
        Path("/var/task/app/static/downloads/confluence_prd_and_strategy.csv"),
        Path("/var/task/public/static/downloads/confluence_prd_and_strategy.csv")
    ]
    for p in candidates:
        if p.exists():
            return FileResponse(
                path=str(p),
                filename="confluence_prd_and_strategy.csv",
                media_type="text/csv"
            )
    return HTMLResponse(status_code=404, content="Confluence PRD & Strategy CSV file not found")

# Catch-all client-side router fallback so direct URLs like /dashboard, /optimizer, /meals, /workouts, /wrapped, /developers work seamlessly
@app.get("/{full_path:path}", response_class=HTMLResponse)
async def catch_all(full_path: str):
    if full_path.startswith("api/") or full_path.startswith("docs") or full_path.startswith("static"):
        return HTMLResponse(status_code=404, content="Not found")
    return HTMLResponse(content=get_index_html())
