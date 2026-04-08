import asyncio
from app.core.database import AsyncSessionLocal
from app.models.models import User
from sqlalchemy import select

async def run():
    async with AsyncSessionLocal() as db:
        users = (await db.execute(select(User))).scalars().all()
        for u in users:
            print(f"Name: {u.name} | Email: {u.email}")

if __name__ == "__main__":
    asyncio.run(run())
