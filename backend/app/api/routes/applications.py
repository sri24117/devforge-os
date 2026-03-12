"""Applications Route"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.core.redis_client import cache_delete
from app.models.models import Application
from app.schemas.schemas import ApplicationCreate, ApplicationOut

router = APIRouter()

@router.get("", response_model=list[ApplicationOut])
async def list_applications(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Application).order_by(Application.applied_date.desc()))
    return result.scalars().all()

@router.post("", response_model=ApplicationOut, status_code=201)
async def create_application(body: ApplicationCreate, db: AsyncSession = Depends(get_db)):
    app = Application(**body.model_dump())
    db.add(app)
    await db.flush()
    await cache_delete("dashboard:stats")
    return app

@router.patch("/{app_id}", response_model=ApplicationOut)
async def update_application(app_id: int, body: ApplicationCreate, db: AsyncSession = Depends(get_db)):
    app = await db.get(Application, app_id)
    if not app:
        raise HTTPException(404, "Application not found")
    for k, v in body.model_dump(exclude_none=True).items():
        setattr(app, k, v)
    await cache_delete("dashboard:stats")
    return app

@router.delete("/{app_id}", status_code=204)
async def delete_application(app_id: int, db: AsyncSession = Depends(get_db)):
    app = await db.get(Application, app_id)
    if not app:
        raise HTTPException(404, "Application not found")
    await db.delete(app)
    await cache_delete("dashboard:stats")
