"""
Dashboard Route - aggregates stats with Redis caching
Cache key: dashboard:stats | TTL: 5 minutes
"""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, case, Integer

from app.core.database import get_db
from app.core.redis_client import cache_get, cache_set
from app.models.models import DSAProblem, ProjectTask, Application, User, Interview
from app.schemas.schemas import DashboardStats

router = APIRouter()

CACHE_KEY = "dashboard:stats"
CACHE_TTL = 300  # 5 minutes


@router.get("", response_model=DashboardStats)
async def get_dashboard(db: AsyncSession = Depends(get_db)):
    """
    Returns aggregated dashboard stats.
    ✅ Redis Cache: Hit = instant response. Miss = DB query + cache set.
    ✅ Graceful: Returns valid zeros when DB is empty.
    """

    # ── 1. Try Redis cache first ─────────────────────────────────
    cached = await cache_get(CACHE_KEY)
    if cached:
        print("📦 Dashboard: cache HIT")
        return cached

    print("🔍 Dashboard: cache MISS — querying PostgreSQL")

    # ── 2. Query PostgreSQL ───────────────────────────────────────
    dsa_total = (await db.execute(select(func.count()).select_from(DSAProblem))).scalar() or 0
    dsa_done = (await db.execute(
        select(func.count()).select_from(DSAProblem).where(DSAProblem.completed == True)
    )).scalar() or 0

    proj_total = (await db.execute(select(func.count()).select_from(ProjectTask))).scalar() or 0
    proj_done = (await db.execute(
        select(func.count()).select_from(ProjectTask).where(ProjectTask.completed == True)
    )).scalar() or 0

    app_count = (await db.execute(select(func.count()).select_from(Application))).scalar() or 0

    # Pattern stats
    completed_case = case((DSAProblem.completed == True, 1), else_=0)
    pattern_rows = (await db.execute(
        select(DSAProblem.pattern, func.count().label("total"),
               func.sum(completed_case).label("completed"))
        .group_by(DSAProblem.pattern)
    )).all()

    patterns = [
        {"pattern": r.pattern, "total": r.total, "completed": r.completed or 0}
        for r in pattern_rows
    ]

    # Streak from users table (graceful when no user exists)
    user = (await db.execute(select(User).limit(1))).scalar_one_or_none()
    streak = user.streak if user else 0

    # Readiness score
    dsa_pct = (dsa_done / dsa_total * 40) if dsa_total else 0
    proj_pct = (proj_done / proj_total * 40) if proj_total else 0
    app_pct = min(app_count * 2, 20)
    readiness = round(dsa_pct + proj_pct + app_pct, 1)

    # Weaknesses
    weaknesses = []
    if dsa_total == 0:
        weaknesses.append("No DSA problems added yet")
    elif dsa_done / dsa_total < 0.5:
        weaknesses.append("DSA completion below 50%")
    if proj_total == 0:
        weaknesses.append("No project tasks added yet")
    elif proj_done / proj_total < 0.5:
        weaknesses.append("Project tasks incomplete")
    if app_count == 0:
        weaknesses.append("No job applications tracked")

    result = {
        "streak": streak,
        "dsa": {"total": dsa_total, "completed": dsa_done},
        "project": {"total": proj_total, "completed": proj_done},
        "applications": {"count": app_count},
        "patterns": patterns,
        "github": None,
        "readinessScore": readiness,
        "weaknesses": weaknesses if weaknesses else ["Looking good! Keep going."],
    }

    # ── 3. Cache result in Redis ──────────────────────────────────
    await cache_set(CACHE_KEY, result, ttl=CACHE_TTL)

    return result
