"""System Design Sessions Route"""
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models.models import SystemDesignSession
from app.schemas.schemas import SystemDesignCreate, SystemDesignOut

router = APIRouter()

@router.get("", response_model=list[SystemDesignOut])
async def list_sessions(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(SystemDesignSession).order_by(SystemDesignSession.timestamp.desc()))
    return result.scalars().all()

@router.post("", response_model=SystemDesignOut, status_code=201)
async def create_session(body: SystemDesignCreate, db: AsyncSession = Depends(get_db)):
    session = SystemDesignSession(**body.model_dump())
    db.add(session)
    await db.flush()
    return session
