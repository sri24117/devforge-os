from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.core.redis_client import cache_delete
from app.models.models import Interview, User
from app.schemas.schemas import InterviewCreate, InterviewOut
from app.api.deps import get_current_user

router = APIRouter()

@router.get("", response_model=list[InterviewOut])
async def list_interviews(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(Interview).where(Interview.user_id == current_user.id).order_by(Interview.timestamp.desc()))
    return result.scalars().all()

@router.post("", response_model=InterviewOut, status_code=201)
async def create_interview(body: InterviewCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    interview = Interview(**body.model_dump(), user_id=current_user.id)
    db.add(interview)
    await db.flush()
    await cache_delete(f"dashboard:stats:{current_user.id}")
    return interview

@router.delete("/{interview_id}", status_code=204)
async def delete_interview(interview_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(Interview).where(Interview.id == interview_id, Interview.user_id == current_user.id))
    interview = result.scalar_one_or_none()
    if not interview:
        raise HTTPException(404, "Interview not found")
    await db.delete(interview)
    await cache_delete(f"dashboard:stats:{current_user.id}")
