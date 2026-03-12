"""
DSA Problems Route - Full CRUD
Auto-invalidates Redis dashboard cache on mutations
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.core.redis_client import cache_delete
from app.models.models import DSAProblem
from app.schemas.schemas import DSAProblemCreate, DSAProblemUpdate, DSAProblemOut

router = APIRouter()


@router.get("", response_model=list[DSAProblemOut])
async def list_problems(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(DSAProblem).order_by(DSAProblem.id))
    return result.scalars().all()


@router.post("", response_model=DSAProblemOut, status_code=201)
async def create_problem(body: DSAProblemCreate, db: AsyncSession = Depends(get_db)):
    problem = DSAProblem(**body.model_dump())
    db.add(problem)
    await db.flush()
    await cache_delete("dashboard:stats")  # invalidate cache
    return problem


@router.patch("/{problem_id}", response_model=DSAProblemOut)
async def update_problem(
    problem_id: int, body: DSAProblemUpdate, db: AsyncSession = Depends(get_db)
):
    problem = await db.get(DSAProblem, problem_id)
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")

    for field, value in body.model_dump(exclude_none=True).items():
        setattr(problem, field, value)

    await cache_delete("dashboard:stats")  # invalidate cache
    return problem


@router.delete("/{problem_id}", status_code=204)
async def delete_problem(problem_id: int, db: AsyncSession = Depends(get_db)):
    problem = await db.get(DSAProblem, problem_id)
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")
    await db.delete(problem)
    await cache_delete("dashboard:stats")
