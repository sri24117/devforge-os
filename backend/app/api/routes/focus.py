"""Focus timer logging and speed bottleneck analytics."""
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.models import User, FocusSession
from app.schemas.schemas import FocusSessionCreate, FocusSessionOut

router = APIRouter()

TARGET_BY_DIFFICULTY = {"easy": 20, "medium": 35, "hard": 45}

def speed_flag(elapsed_seconds: int, target_minutes: int) -> str | None:
    elapsed_min = elapsed_seconds / 60
    if elapsed_min > target_minutes * 1.5:
        return "speed_bottleneck"
    if elapsed_min > target_minutes:
        return "slightly_over_target"
    if elapsed_min < max(5, target_minutes * 0.35):
        return "fast_finish_review_quality"
    return None

@router.post("/sessions", response_model=FocusSessionOut)
async def create_session(body: FocusSessionCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    target = body.target_minutes
    if body.difficulty:
        target = TARGET_BY_DIFFICULTY.get(body.difficulty.lower(), target)
    session = FocusSession(
        user_id=current_user.id,
        context=body.context,
        task_title=body.task_title,
        target_minutes=target,
        elapsed_seconds=body.elapsed_seconds,
        completed=body.completed,
        speed_flag=speed_flag(body.elapsed_seconds, target),
    )
    db.add(session)
    await db.commit()
    await db.refresh(session)
    return session

@router.get("/summary")
async def summary(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    since = datetime.utcnow() - timedelta(days=7)
    result = await db.execute(select(FocusSession).where(FocusSession.user_id == current_user.id, FocusSession.created_at >= since).order_by(FocusSession.created_at.desc()))
    sessions = result.scalars().all()
    total_seconds = sum(s.elapsed_seconds for s in sessions)
    bottlenecks = [s for s in sessions if s.speed_flag == "speed_bottleneck"]
    return {
        "sessions_count": len(sessions),
        "total_minutes": round(total_seconds / 60, 1),
        "average_minutes": round((total_seconds / 60) / len(sessions), 1) if sessions else 0,
        "speed_bottlenecks": len(bottlenecks),
        "recent": [
            {
                "task_title": s.task_title,
                "context": s.context,
                "minutes": round(s.elapsed_seconds / 60, 1),
                "target_minutes": s.target_minutes,
                "speed_flag": s.speed_flag,
            } for s in sessions[:10]
        ],
        "recommendation": "Reduce time on Easy problems under 20 minutes" if bottlenecks else "Good pace. Keep logging focus sessions.",
    }
