"""
DevForge OS - FastAPI Backend
Replaces the Express/SQLite server with Python FastAPI + PostgreSQL + Redis
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.database import engine, Base
from app.core.redis_client import redis_client
from app.api.routes import dashboard, dsa, applications, interviews, system_design, projects, auth, ai, execution, roadmap


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup / Shutdown events."""
    # Create all DB tables on startup
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("✅ PostgreSQL tables created")

    # Test Redis connection
    await redis_client.ping()
    print("✅ Redis connected")

    yield

    # Cleanup
    await redis_client.close()
    await engine.dispose()
    print("🛑 Connections closed")


app = FastAPI(
    title="DevForge OS API",
    description="Interview Prep Platform - Backend",
    version="2.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["Dashboard"])
app.include_router(dsa.router, prefix="/api/dsa", tags=["DSA Problems"])
app.include_router(applications.router, prefix="/api/applications", tags=["Applications"])
app.include_router(interviews.router, prefix="/api/interviews", tags=["Interviews"])
app.include_router(system_design.router, prefix="/api/system-design", tags=["System Design"])
app.include_router(projects.router, prefix="/api/projects", tags=["Projects"])
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(ai.router, prefix="/api/ai", tags=["AI Proxy"])
app.include_router(execution.router, prefix="/api/execute", tags=["Code Execution"])
app.include_router(roadmap.router, prefix="/api/roadmap", tags=["Readiness Roadmap"])


@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "devforge-api"}
