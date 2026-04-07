"""
DevForge OS — Database Seeder
Run: docker compose exec backend python seed.py
Populates: 70 DSA problems, 12 project tasks, 4 roadmap phases, 1 default user
Idempotent: skips if data already exists.
"""

import asyncio
from sqlalchemy import select, func
from app.core.database import engine, get_db, Base
from app.core.security import get_password_hash
from app.models.models import DSAProblem, ProjectTask, User, RoadmapPhase

# ─── 70 DSA Problems (mirrors MasterGuide.tsx) ────────────────────
DSA_PROBLEMS = [
    # Sliding Window (1-5)
    ("Longest Substring Without Repeating Characters", "Sliding Window", "Medium"),
    ("Maximum Sum Subarray of Size K", "Sliding Window", "Easy"),
    ("Minimum Size Subarray Sum", "Sliding Window", "Medium"),
    ("Longest Substring with K Distinct Characters", "Sliding Window", "Medium"),
    ("Minimum Window Substring", "Sliding Window", "Hard"),
    # Two Pointers (6-10)
    ("3Sum", "Two Pointers", "Medium"),
    ("Two Sum II (Sorted Array)", "Two Pointers", "Medium"),
    ("Squares of a Sorted Array", "Two Pointers", "Easy"),
    ("Container With Most Water", "Two Pointers", "Medium"),
    ("Sort Colors (Dutch National Flag)", "Two Pointers", "Medium"),
    # Fast & Slow Pointers (11-13)
    ("Linked List Cycle", "Fast & Slow Pointers", "Easy"),
    ("Middle of the Linked List", "Fast & Slow Pointers", "Easy"),
    ("Happy Number", "Fast & Slow Pointers", "Easy"),
    # In-Place Linked List Reversal (14-16)
    ("Reverse a Linked List", "In-Place Reversal", "Easy"),
    ("Reverse a Sub-list", "In-Place Reversal", "Medium"),
    ("Reverse Nodes in k-Group", "In-Place Reversal", "Hard"),
    # Merge Intervals & Cyclic Sort (17-21)
    ("Merge Intervals", "Merge Intervals", "Medium"),
    ("Insert Interval", "Merge Intervals", "Medium"),
    ("Meeting Rooms II", "Merge Intervals", "Medium"),
    ("Missing Number", "Cyclic Sort", "Easy"),
    ("Find All Duplicates in an Array", "Cyclic Sort", "Medium"),
    # Trees: BFS & DFS (22-28)
    ("Binary Tree Level Order Traversal", "Tree BFS", "Medium"),
    ("Binary Tree Zigzag Level Order Traversal", "Tree BFS", "Medium"),
    ("Binary Tree Right Side View", "Tree BFS", "Medium"),
    ("Path Sum", "Tree DFS", "Easy"),
    ("Diameter of Binary Tree", "Tree DFS", "Easy"),
    ("Binary Tree Maximum Path Sum", "Tree DFS", "Hard"),
    ("Lowest Common Ancestor in a BST", "Tree DFS", "Medium"),
    # Graphs & Matrix Traversal (29-33)
    ("Number of Islands", "Graph BFS/DFS", "Medium"),
    ("Flood Fill", "Graph BFS/DFS", "Easy"),
    ("Rotting Oranges", "Graph BFS/DFS", "Medium"),
    ("01 Matrix", "Graph BFS/DFS", "Medium"),
    ("Clone Graph", "Graph BFS/DFS", "Medium"),
    # Binary Search (34-36)
    ("Binary Search", "Binary Search", "Easy"),
    ("Search in Rotated Sorted Array", "Binary Search", "Medium"),
    ("Find Minimum in Rotated Sorted Array", "Binary Search", "Medium"),
    # Heaps & K-Way Merge (37-43)
    ("Kth Largest Element in an Array", "Heaps", "Medium"),
    ("Top K Frequent Elements", "Heaps", "Medium"),
    ("K Closest Points to Origin", "Heaps", "Medium"),
    ("Find Median from Data Stream", "Heaps", "Hard"),
    ("Sliding Window Median", "Heaps", "Hard"),
    ("Merge K Sorted Lists", "K-Way Merge", "Hard"),
    ("Kth Smallest Element in a Sorted Matrix", "K-Way Merge", "Medium"),
    # Backtracking (44-48)
    ("Subsets", "Backtracking", "Medium"),
    ("Permutations", "Backtracking", "Medium"),
    ("Combination Sum", "Backtracking", "Medium"),
    ("Word Search", "Backtracking", "Medium"),
    ("N-Queens", "Backtracking", "Hard"),
    # Dynamic Programming (49-55)
    ("Climbing Stairs", "Dynamic Programming", "Easy"),
    ("House Robber", "Dynamic Programming", "Medium"),
    ("Longest Increasing Subsequence", "Dynamic Programming", "Medium"),
    ("Partition Equal Subset Sum", "Dynamic Programming", "Medium"),
    ("Coin Change", "Dynamic Programming", "Medium"),
    ("Longest Common Subsequence", "Dynamic Programming", "Medium"),
    ("Edit Distance", "Dynamic Programming", "Hard"),
    # Monotonic Stack & Advanced Graphs (56-60)
    ("Daily Temperatures", "Monotonic Stack", "Medium"),
    ("Next Greater Element I", "Monotonic Stack", "Easy"),
    ("Course Schedule", "Topological Sort", "Medium"),
    ("Alien Dictionary", "Topological Sort", "Hard"),
    ("Number of Provinces", "Union-Find", "Medium"),
    # Tries (61-63)
    ("Implement Trie (Prefix Tree)", "Trie", "Medium"),
    ("Design Add and Search Words", "Trie", "Medium"),
    ("Word Search II", "Trie", "Hard"),
    # Stack & Greedy (64-67)
    ("Valid Parentheses", "Stack", "Easy"),
    ("Largest Rectangle in Histogram", "Stack", "Hard"),
    ("Jump Game", "Greedy", "Medium"),
    ("Gas Station", "Greedy", "Medium"),
    # Advanced Graph & Design (68-70)
    ("Word Ladder", "Graph BFS", "Hard"),
    ("Range Sum Query – Mutable", "Segment Tree", "Medium"),
    ("LRU Cache", "Design", "Medium"),
]

# ─── Project Tasks (Capstone: Smart Attendance System) ────────────
PROJECT_TASKS = [
    ("FastAPI Project Setup & Clean Architecture", "Backend"),
    ("PostgreSQL Schema & Alembic Migrations", "Backend"),
    ("JWT Authentication & RBAC Middleware", "Backend"),
    ("Attendance CRUD API with Pagination", "Backend"),
    ("Redis Caching Layer", "Backend"),
    ("Background Jobs (Celery/ARQ)", "Backend"),
    ("Rate Limiting & Error Handling", "Backend"),
    ("Docker & CI/CD Pipeline", "Backend"),
    ("React Dashboard UI", "Frontend"),
    ("Attendance Calendar Component", "Frontend"),
    ("Analytics Charts (Chart.js)", "Frontend"),
    ("Responsive Mobile Layout", "Frontend"),
]

# ─── Roadmap Phases ───────────────────────────────────────────────
ROADMAP_PHASES = [
    ("Foundation & Core Backend", "In Progress"),
    ("System Design Mastery", "Locked"),
    ("Advanced Scalability", "Locked"),
    ("The Job Pipeline", "Locked"),
]


async def seed():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    from app.core.database import AsyncSessionLocal

    async with AsyncSessionLocal() as db:
        # Check if already seeded
        count = (await db.execute(select(func.count()).select_from(DSAProblem))).scalar()
        if count and count > 0:
            print(f"⏭️  Database already has {count} DSA problems. Skipping seed.")
            return

        # Seed DSA Problems
        for title, pattern, difficulty in DSA_PROBLEMS:
            db.add(DSAProblem(title=title, pattern=pattern, difficulty=difficulty))
        print(f"✅ Seeded {len(DSA_PROBLEMS)} DSA problems")

        # Seed Project Tasks
        for title, category in PROJECT_TASKS:
            db.add(ProjectTask(title=title, category=category))
        print(f"✅ Seeded {len(PROJECT_TASKS)} project tasks")

        # Seed Roadmap Phases
        for title, status in ROADMAP_PHASES:
            db.add(RoadmapPhase(title=title, status=status))
        print(f"✅ Seeded {len(ROADMAP_PHASES)} roadmap phases")

        # Seed Default User (pre-computed bcrypt hash for "devforge123")
        # This avoids runtime passlib/bcrypt issues in the container
        PRECOMPUTED_HASH = "$2b$12$LJ3m4ys3GZfHMhYRqOOZxOCxmCpjOQ8WzKf6MOJR0PxXnMFW3m1jK"
        existing_user = (await db.execute(
            select(User).where(User.email == "sri@devforge.io")
        )).scalar_one_or_none()
        if not existing_user:
            db.add(User(
                name="Sri",
                email="sri@devforge.io",
                hashed_password=PRECOMPUTED_HASH,
                streak=0,
            ))
            print("✅ Created default user: sri@devforge.io / devforge123")

        await db.commit()
        print("🎉 Database seeding complete!")


if __name__ == "__main__":
    import traceback
    try:
        asyncio.run(seed())
    except Exception as e:
        traceback.print_exc()
        print(f"\n❌ Seed failed: {e}")
