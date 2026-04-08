import asyncio
from app.core.database import engine, Base
from app.models.models import User, DSAProblem, ProjectTask, Application, Interview, SystemDesignSession, InterviewRound, LeetCodeProfile, RoadmapPhase, RoadmapDay, UserProgress, ProblemAttempt

async def migrate():
    print("Creating new Journey-Centric tables...")
    async with engine.begin() as conn:
        # Create all tables (only those that don't exist)
        await conn.run_sync(Base.metadata.create_all)
    print("Migration finished.")

if __name__ == "__main__":
    asyncio.run(migrate())
