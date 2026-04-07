import asyncio
from sqlalchemy import select, func
from app.core.database import AsyncSessionLocal
from app.models.models import DSAProblem, ProjectTask, User, RoadmapPhase

async def check():
    async with AsyncSessionLocal() as db:
        dsa = (await db.execute(select(func.count()).select_from(DSAProblem))).scalar()
        proj = (await db.execute(select(func.count()).select_from(ProjectTask))).scalar()
        users = (await db.execute(select(func.count()).select_from(User))).scalar()
        road = (await db.execute(select(func.count()).select_from(RoadmapPhase))).scalar()
        print(f"DSA: {dsa}, Projects: {proj}, Users: {users}, Roadmap: {road}")

asyncio.run(check())
