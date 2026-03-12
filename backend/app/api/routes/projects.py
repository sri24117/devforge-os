"""Project Tasks Route"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.core.redis_client import cache_delete
from app.models.models import ProjectTask
from app.schemas.schemas import ProjectTaskCreate, ProjectTaskOut

router = APIRouter()

@router.get("", response_model=list[ProjectTaskOut])
async def list_tasks(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(ProjectTask))
    return result.scalars().all()

@router.post("", response_model=ProjectTaskOut, status_code=201)
async def create_task(body: ProjectTaskCreate, db: AsyncSession = Depends(get_db)):
    task = ProjectTask(**body.model_dump())
    db.add(task)
    await db.flush()
    await cache_delete("dashboard:stats")
    return task

@router.patch("/{task_id}", response_model=ProjectTaskOut)
async def toggle_task(task_id: int, db: AsyncSession = Depends(get_db)):
    task = await db.get(ProjectTask, task_id)
    if not task:
        raise HTTPException(404, "Task not found")
    task.completed = not task.completed
    await cache_delete("dashboard:stats")
    return task
