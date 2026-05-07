"""Project Tasks Route"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.core.redis_client import cache_delete
from app.models.models import ProjectTask, User
from app.schemas.schemas import ProjectTaskCreate, ProjectTaskOut
from app.api.deps import get_current_user

router = APIRouter()

@router.get("", response_model=list[ProjectTaskOut])
async def list_tasks(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(ProjectTask).where(ProjectTask.user_id == current_user.id))
    return result.scalars().all()

@router.post("", response_model=ProjectTaskOut, status_code=201)
async def create_task(body: ProjectTaskCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    task = ProjectTask(**body.model_dump(), user_id=current_user.id)
    db.add(task)
    await db.flush()
    await cache_delete(f"dashboard:stats:{current_user.id}")
    return task

@router.patch("/{task_id}", response_model=ProjectTaskOut)
async def toggle_task(task_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(ProjectTask).where(ProjectTask.id == task_id, ProjectTask.user_id == current_user.id))
    task = result.scalar_one_or_none()
    if not task:
        raise HTTPException(404, "Task not found")
    task.completed = not task.completed
    await cache_delete(f"dashboard:stats:{current_user.id}")
    return task
