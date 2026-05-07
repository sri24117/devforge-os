"""Applications Route"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.core.redis_client import cache_delete
from app.models.models import Application, User
from app.schemas.schemas import ApplicationCreate, ApplicationOut
from app.api.deps import get_current_user

router = APIRouter()

@router.get("", response_model=list[ApplicationOut])
async def list_applications(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(Application).where(Application.user_id == current_user.id).order_by(Application.applied_date.desc()))
    return result.scalars().all()

@router.post("", response_model=ApplicationOut, status_code=201)
async def create_application(body: ApplicationCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    app = Application(**body.model_dump(), user_id=current_user.id)
    db.add(app)
    await db.flush()
    await cache_delete(f"dashboard:stats:{current_user.id}")
    return app

@router.patch("/{app_id}", response_model=ApplicationOut)
async def update_application(app_id: int, body: ApplicationCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(Application).where(Application.id == app_id, Application.user_id == current_user.id))
    app = result.scalar_one_or_none()
    if not app:
        raise HTTPException(404, "Application not found")
    for k, v in body.model_dump(exclude_none=True).items():
        setattr(app, k, v)
    await cache_delete(f"dashboard:stats:{current_user.id}")
    return app

@router.delete("/{app_id}", status_code=204)
async def delete_application(app_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(Application).where(Application.id == app_id, Application.user_id == current_user.id))
    app = result.scalar_one_or_none()
    if not app:
        raise HTTPException(404, "Application not found")
    await db.delete(app)
    await cache_delete(f"dashboard:stats:{current_user.id}")
