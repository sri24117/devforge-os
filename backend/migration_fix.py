import asyncio
from sqlalchemy import text
from app.core.database import engine

async def migrate():
    tables = [
        "dsa_problems", "project_tasks", "applications", 
        "interviews", "system_design_sessions", 
        "leetcode_profiles", "roadmap_phases"
    ]
    
    async with engine.begin() as conn:
        # 1. Ensure we have at least one user if not any
        result = await conn.execute(text("SELECT id FROM users LIMIT 1;"))
        user = result.fetchone()
        
        if not user:
            # Create a bootstrap user if none exists
            await conn.execute(text(
                "INSERT INTO users (name, email, hashed_password, streak) "
                "VALUES ('Bootstrap Admin', 'admin@example.com', 'noset', 0);"
            ))
            result = await conn.execute(text("SELECT id FROM users LIMIT 1;"))
            user = result.fetchone()
        
        user_id = user[0]
        
        for table in tables:
            print(f"Migrating {table}...")
            # Check if column exists
            check_res = await conn.execute(text(
                f"SELECT column_name FROM information_schema.columns "
                f"WHERE table_name='{table}' AND column_name='user_id';"
            ))
            if not check_res.fetchone():
                # Add column nullable first
                await conn.execute(text(f"ALTER TABLE {table} ADD COLUMN user_id INTEGER;"))
                # Update existing rows
                await conn.execute(text(f"UPDATE {table} SET user_id = {user_id};"))
                # Set as not null
                await conn.execute(text(f"ALTER TABLE {table} ALTER COLUMN user_id SET NOT NULL;"))
                # Add Foreign Key
                await conn.execute(text(f"ALTER TABLE {table} ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id);"))
                print(f"Added user_id to {table}")
            else:
                print(f"Column user_id already exists in {table}")
        
    print("Migration finished.")

if __name__ == "__main__":
    asyncio.run(migrate())
