"""
DSA Problems Route - Full CRUD
Upgrades vs original:
  - Added /{id}/complete POST endpoint (was referenced in apiService but didn't exist)
  - Added logging
  - Cache invalidation on all mutations
"""

import logging
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.core.redis_client import cache_delete
from app.models.models import DSAProblem, User
from app.schemas.schemas import DSAProblemCreate, DSAProblemUpdate, DSAProblemOut
from app.api.deps import get_current_user

logger = logging.getLogger("devforge.dsa")
router = APIRouter()


@router.get("", response_model=list[DSAProblemOut])
async def list_problems(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(DSAProblem)
        .where(DSAProblem.user_id == current_user.id)
        .order_by(DSAProblem.id)
    )
    return result.scalars().all()


@router.post("", response_model=DSAProblemOut, status_code=201)
async def create_problem(
    body: DSAProblemCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    problem = DSAProblem(**body.model_dump(), user_id=current_user.id)
    db.add(problem)
    await db.commit()
    await db.refresh(problem)
    await cache_delete(f"dashboard:stats:{current_user.id}")
    logger.info(f"User {current_user.id} created DSA problem: {problem.title}")
    return problem


@router.patch("/{problem_id}", response_model=DSAProblemOut)
async def update_problem(
    problem_id: int,
    body: DSAProblemUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(DSAProblem).where(DSAProblem.id == problem_id, DSAProblem.user_id == current_user.id)
    )
    problem = result.scalar_one_or_none()
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")

    for field, value in body.model_dump(exclude_none=True).items():
        setattr(problem, field, value)

    await db.commit()
    await db.refresh(problem)
    await cache_delete(f"dashboard:stats:{current_user.id}")
    return problem


@router.post("/{problem_id}/complete", response_model=DSAProblemOut)
async def complete_problem(
    problem_id: int,
    body: dict = {},
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Mark a DSA problem as complete.
    Body (all optional): { time_taken: int, confidence: int (1-5), reflection: str }
    
    This endpoint was called by apiService.ts (completeDSAProblem) but was
    missing from the original routes — now fixed.
    """
    result = await db.execute(
        select(DSAProblem).where(DSAProblem.id == problem_id, DSAProblem.user_id == current_user.id)
    )
    problem = result.scalar_one_or_none()
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")

    problem.completed = True
    if body.get("time_taken") is not None:
        problem.time_taken = int(body["time_taken"])
    if body.get("confidence") is not None:
        problem.confidence = int(body["confidence"])
    if body.get("reflection"):
        problem.reflection = str(body["reflection"])

    await db.commit()
    await db.refresh(problem)
    await cache_delete(f"dashboard:stats:{current_user.id}")
    logger.info(f"User {current_user.id} completed DSA problem {problem_id}: {problem.title}")
    return problem


@router.delete("/{problem_id}", status_code=204)
async def delete_problem(
    problem_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(DSAProblem).where(DSAProblem.id == problem_id, DSAProblem.user_id == current_user.id)
    )
    problem = result.scalar_one_or_none()
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")

    await db.delete(problem)
    await db.commit()
    await cache_delete(f"dashboard:stats:{current_user.id}")
