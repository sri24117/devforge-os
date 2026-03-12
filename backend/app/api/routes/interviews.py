"""Interviews Route"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models.models import Interview
from app.schemas.schemas import InterviewCreate, InterviewOut

router = APIRouter()

@router.get("", response_model=list[InterviewOut])
async def list_interviews(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Interview).order_by(Interview.timestamp.desc()))
    return result.scalars().all()

@router.post("", response_model=InterviewOut, status_code=201)
async def create_interview(body: InterviewCreate, db: AsyncSession = Depends(get_db)):
    interview = Interview(**body.model_dump())
    db.add(interview)
    await db.flush()
    return interview

@router.delete("/{interview_id}", status_code=204)
async def delete_interview(interview_id: int, db: AsyncSession = Depends(get_db)):
    interview = await db.get(Interview, interview_id)
    if not interview:
        raise HTTPException(404, "Interview not found")
    await db.delete(interview)
