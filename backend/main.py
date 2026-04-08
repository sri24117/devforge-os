"""
DevForge OS - FastAPI Backend (Upgraded)
Changes vs original:
  - CORS now reads allowed origins from settings (env var) so prod deploy works
  - /api/leetcode/import registered directly on auth router (avoids double proxy)
  - Structured logging added via Python logging module
  - /api/auth/github/url endpoint now available
"""

import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.database import engine, Base
from app.core.redis_client import redis_client
from app.api.routes import (
    dashboard, dsa, applications, interviews,
    system_design, projects, auth, ai, execution, roadmap
)

# ─── Logging Setup ───────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger("devforge")


@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    logger.info("✅ PostgreSQL tables verified/created")

    await redis_client.ping()
    logger.info("✅ Redis connected")

    yield

    await redis_client.close()
    await engine.dispose()
    logger.info("🛑 Connections closed")


app = FastAPI(
    title="DevForge OS API",
    description="Interview Prep Platform - Backend",
    version="2.1.0",
    lifespan=lifespan,
)

# ─── CORS ────────────────────────────────────────────────────────
# In production, set ALLOWED_ORIGINS env var:
# ALLOWED_ORIGINS=https://devforge.vercel.app,https://yourdomain.com
import os
_raw_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000")
ALLOWED_ORIGINS = [o.strip() for o in _raw_origins.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Routes ──────────────────────────────────────────────────────
app.include_router(dashboard.router,       prefix="/api/dashboard",     tags=["Dashboard"])
app.include_router(dsa.router,             prefix="/api/dsa",           tags=["DSA Problems"])
app.include_router(applications.router,    prefix="/api/applications",  tags=["Applications"])
app.include_router(interviews.router,      prefix="/api/interviews",    tags=["Interviews"])
app.include_router(system_design.router,   prefix="/api/system-design", tags=["System Design"])
app.include_router(projects.router,        prefix="/api/projects",      tags=["Projects"])
app.include_router(auth.router,            prefix="/api/auth",          tags=["Auth"])
app.include_router(ai.router,              prefix="/api/ai",            tags=["AI Proxy"])
app.include_router(execution.router,       prefix="/api/execute",       tags=["Code Execution"])
app.include_router(roadmap.router,         prefix="/api/roadmap",       tags=["Roadmap"])

# NOTE: /api/leetcode/import is now registered INSIDE auth.router as /api/auth/leetcode/import
# The frontend apiService.ts calls /api/leetcode/import — add this alias:
from fastapi import APIRouter
_lc_alias = APIRouter()

from app.api.routes.auth import import_leetcode
from app.core.database import get_db
from app.api.deps import get_current_user

@_lc_alias.post("/import")
async def lc_import_alias(body: dict, db=None, current_user=None):
    # Re-export so the original frontend URL still works
    pass

# Simpler: just mount auth's leetcode endpoint at /api/leetcode too
from app.api.routes import auth as auth_module
app.add_api_route(
    "/api/leetcode/import",
    auth_module.import_leetcode,
    methods=["POST"],
    tags=["LeetCode"],
    summary="Import LeetCode profile stats"
)


@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "devforge-api", "version": "2.1.0"}
