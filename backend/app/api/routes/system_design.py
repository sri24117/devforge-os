"""System Design Sessions Route"""
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.core.redis_client import cache_delete
from app.models.models import SystemDesignSession, User
from app.schemas.schemas import SystemDesignCreate, SystemDesignOut
from app.api.deps import get_current_user

router = APIRouter()

@router.get("", response_model=list[SystemDesignOut])
async def list_sessions(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(SystemDesignSession).where(SystemDesignSession.user_id == current_user.id).order_by(SystemDesignSession.timestamp.desc()))
    return result.scalars().all()

@router.post("", response_model=SystemDesignOut, status_code=201)
async def create_session(body: SystemDesignCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    session = SystemDesignSession(**body.model_dump(), user_id=current_user.id)
    db.add(session)
    await db.flush()
    await cache_delete(f"dashboard:stats:{current_user.id}")
    return session
