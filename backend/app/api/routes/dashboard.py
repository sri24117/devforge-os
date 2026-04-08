"""
Dashboard Route - Upgraded
Changes vs original:
  - Now returns LeetCode profile data (synced from import) in the github field
  - Logging added
  - LeetCode profile injected into dashboard response so DashboardView shows it
"""

import logging
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, case

from app.core.database import get_db
from app.core.redis_client import cache_get, cache_set
from app.models.models import (
    DSAProblem, ProjectTask, Application,
    User, Interview, SystemDesignSession, LeetCodeProfile
)
from app.schemas.schemas import DashboardStats
from app.api.deps import get_current_user

logger = logging.getLogger("devforge.dashboard")
router = APIRouter()

CACHE_KEY = "dashboard:stats"
CACHE_TTL = 300  # 5 minutes


@router.get("", response_model=DashboardStats)
async def get_dashboard(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    user_cache_key = f"{CACHE_KEY}:{current_user.id}"

    cached = await cache_get(user_cache_key)
    if cached:
        logger.debug(f"Dashboard cache HIT for user {current_user.id}")
        return cached

    logger.info(f"Dashboard cache MISS for user {current_user.id} — querying DB")

    # ── DSA ─────────────────────────────────────────────────────
    dsa_total = (await db.execute(
        select(func.count()).select_from(DSAProblem).where(DSAProblem.user_id == current_user.id)
    )).scalar() or 0
    dsa_done = (await db.execute(
        select(func.count()).select_from(DSAProblem)
        .where(DSAProblem.user_id == current_user.id, DSAProblem.completed == True)
    )).scalar() or 0

    # ── Projects ─────────────────────────────────────────────────
    proj_total = (await db.execute(
        select(func.count()).select_from(ProjectTask).where(ProjectTask.user_id == current_user.id)
    )).scalar() or 0
    proj_done = (await db.execute(
        select(func.count()).select_from(ProjectTask)
        .where(ProjectTask.user_id == current_user.id, ProjectTask.completed == True)
    )).scalar() or 0

    # ── Applications ─────────────────────────────────────────────
    app_count = (await db.execute(
        select(func.count()).select_from(Application).where(Application.user_id == current_user.id)
    )).scalar() or 0

    # ── Interviews & System Design ────────────────────────────────
    interview_count = (await db.execute(
        select(func.count()).select_from(Interview).where(Interview.user_id == current_user.id)
    )).scalar() or 0
    sys_design_count = (await db.execute(
        select(func.count()).select_from(SystemDesignSession).where(SystemDesignSession.user_id == current_user.id)
    )).scalar() or 0

    # ── Pattern Stats ─────────────────────────────────────────────
    completed_case = case((DSAProblem.completed == True, 1), else_=0)
    pattern_rows = (await db.execute(
        select(DSAProblem.pattern, func.count().label("total"), func.sum(completed_case).label("completed"))
        .where(DSAProblem.user_id == current_user.id)
        .group_by(DSAProblem.pattern)
    )).all()

    patterns = [
        {"pattern": r.pattern, "total": r.total, "completed": r.completed or 0}
        for r in pattern_rows
    ]

    # ── LeetCode Profile (NEW) ────────────────────────────────────
    lc_result = await db.execute(
        select(LeetCodeProfile).where(LeetCodeProfile.user_id == current_user.id)
    )
    lc_profile = lc_result.scalar_one_or_none()
    github_data = None
    if lc_profile:
        github_data = {
            "username": lc_profile.username,
            "total_solved": lc_profile.total_solved,
            "easy_solved": lc_profile.easy_solved,
            "medium_solved": lc_profile.medium_solved,
            "hard_solved": lc_profile.hard_solved,
        }

    # ── Readiness Score ───────────────────────────────────────────
    streak = current_user.streak or 0
    dsa_pct       = (dsa_done / dsa_total * 30)  if dsa_total  else 0
    proj_pct      = (proj_done / proj_total * 30) if proj_total else 0
    app_pct       = min(app_count * 2, 20)
    interview_bonus = min(interview_count * 5, 10)
    sys_bonus     = min(sys_design_count * 5, 10)
    lc_bonus      = min((lc_profile.total_solved // 10) if lc_profile else 0, 10)
    readiness     = round(dsa_pct + proj_pct + app_pct + interview_bonus + sys_bonus, 1)

    # ── Weaknesses ────────────────────────────────────────────────
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
    if not lc_profile:
        weaknesses.append("Import your LeetCode profile for insights")
    if not weaknesses:
        weaknesses = ["Looking good! Keep the momentum going."]

    result = {
        "streak": streak,
        "dsa": {"total": dsa_total, "completed": dsa_done},
        "project": {"total": proj_total, "completed": proj_done},
        "applications": {"count": app_count},
        "interviews": {"count": interview_count},
        "system_design": {"count": sys_design_count},
        "patterns": patterns,
        "github": github_data,  # Now includes LeetCode data
        "readinessScore": readiness,
        "weaknesses": weaknesses,
    }

    await cache_set(user_cache_key, result, ttl=CACHE_TTL)
    return result
