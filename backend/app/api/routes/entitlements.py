"""Plan-based feature gates for Free / Pro / Premium."""
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.api.deps import get_current_user
from app.core.config import settings
from app.core.database import get_db
from app.models.models import User, UserSubscription
from app.schemas.schemas import FeatureEntitlements

router = APIRouter()

async def get_plan(db: AsyncSession, user_id: int) -> str:
    result = await db.execute(select(UserSubscription).where(UserSubscription.user_id == user_id, UserSubscription.status == "active"))
    sub = result.scalar_one_or_none()
    return (sub.plan if sub else "free").lower()

@router.get("", response_model=FeatureEntitlements)
async def entitlements(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    plan = await get_plan(db, current_user.id)
    if plan == "premium":
        return FeatureEntitlements(plan=plan, ai_daily_limit=settings.PREMIUM_AI_DAILY_LIMIT, compiler_daily_limit=settings.PREMIUM_COMPILER_DAILY_LIMIT, resume_match_enabled=True, deep_ai_enabled=True, voice_mock_enabled=True, admin_enabled=False)
    if plan == "pro":
        return FeatureEntitlements(plan=plan, ai_daily_limit=settings.PRO_AI_DAILY_LIMIT, compiler_daily_limit=settings.PRO_COMPILER_DAILY_LIMIT, resume_match_enabled=True, deep_ai_enabled=True, voice_mock_enabled=False, admin_enabled=False)
    return FeatureEntitlements(plan=plan, ai_daily_limit=settings.FREE_AI_DAILY_LIMIT, compiler_daily_limit=settings.FREE_COMPILER_DAILY_LIMIT, resume_match_enabled=False, deep_ai_enabled=False, voice_mock_enabled=False, admin_enabled=False)
