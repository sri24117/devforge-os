"""
DSA Problems Route - Full CRUD
Upgrades vs original:
  - Added /{id}/complete POST endpoint (was referenced in apiService but didn't exist)
  - Added logging
  - Cache invalidation on all mutations
"""

import logging
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.core.redis_client import cache_delete
from app.models.models import DSAProblem, User
from app.schemas.schemas import DSAProblemCreate, DSAProblemUpdate, DSAProblemOut
from app.api.deps import get_current_user

logger = logging.getLogger("devforge.dsa")
router = APIRouter()


DEFAULT_DSA_PROBLEMS = [
    ("Two Sum", "Hash Map", "Easy"), ("Valid Parentheses", "Stack", "Easy"), ("Best Time to Buy and Sell Stock", "Sliding Window", "Easy"),
    ("Contains Duplicate", "Hash Map", "Easy"), ("Valid Anagram", "Hash Map", "Easy"), ("Product of Array Except Self", "Prefix/Suffix", "Medium"),
    ("Maximum Subarray", "Kadane", "Medium"), ("Merge Intervals", "Intervals", "Medium"), ("Binary Search", "Binary Search", "Easy"),
    ("Search in Rotated Sorted Array", "Binary Search", "Medium"), ("Longest Substring Without Repeating Characters", "Sliding Window", "Medium"),
    ("Minimum Window Substring", "Sliding Window", "Hard"), ("3Sum", "Two Pointers", "Medium"), ("Container With Most Water", "Two Pointers", "Medium"),
    ("Linked List Cycle", "Linked List", "Easy"), ("Reverse Linked List", "Linked List", "Easy"), ("Merge Two Sorted Lists", "Linked List", "Easy"),
    ("LRU Cache", "Design", "Medium"), ("Number of Islands", "BFS/DFS", "Medium"), ("Clone Graph", "Graph", "Medium"),
    ("Course Schedule", "Topological Sort", "Medium"), ("Pacific Atlantic Water Flow", "BFS/DFS", "Medium"), ("Binary Tree Level Order Traversal", "Tree/BFS", "Medium"),
    ("Validate Binary Search Tree", "Tree/DFS", "Medium"), ("Lowest Common Ancestor", "Tree", "Medium"), ("Kth Smallest Element in BST", "Tree", "Medium"),
    ("Climbing Stairs", "Dynamic Programming", "Easy"), ("House Robber", "Dynamic Programming", "Medium"), ("Coin Change", "Dynamic Programming", "Medium"),
    ("Longest Increasing Subsequence", "Dynamic Programming", "Medium"), ("Word Break", "Dynamic Programming", "Medium"), ("Combination Sum", "Backtracking", "Medium"),
    ("Permutations", "Backtracking", "Medium"), ("Subsets", "Backtracking", "Medium"), ("Top K Frequent Elements", "Heap", "Medium"),
    ("Find Median from Data Stream", "Heap", "Hard"), ("Kth Largest Element", "Heap", "Medium"), ("Implement Trie", "Trie", "Medium"),
    ("Word Search", "Backtracking", "Medium"), ("Decode Ways", "Dynamic Programming", "Medium"), ("Graph Valid Tree", "Union Find", "Medium"),
    ("Merge K Sorted Lists", "Heap/Linked List", "Hard"),
]

async def ensure_default_problems(db: AsyncSession, user_id: int):
    existing = await db.execute(select(DSAProblem.id).where(DSAProblem.user_id == user_id).limit(1))
    if existing.scalar_one_or_none() is not None:
        return
    for title, pattern, difficulty in DEFAULT_DSA_PROBLEMS:
        db.add(DSAProblem(user_id=user_id, title=title, pattern=pattern, difficulty=difficulty, completed=False))
    await db.commit()


@router.get("", response_model=list[DSAProblemOut])
async def list_problems(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    await ensure_default_problems(db, current_user.id)
    result = await db.execute(
        select(DSAProblem)
        .where(DSAProblem.user_id == current_user.id)
        .order_by(DSAProblem.id)
    )
    return result.scalars().all()


@router.post("", response_model=DSAProblemOut, status_code=201)
async def create_problem(
    body: DSAProblemCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    problem = DSAProblem(**body.model_dump(), user_id=current_user.id)
    db.add(problem)
    await db.commit()
    await db.refresh(problem)
    await cache_delete(f"dashboard:stats:{current_user.id}")
    logger.info(f"User {current_user.id} created DSA problem: {problem.title}")
    return problem


@router.patch("/{problem_id}", response_model=DSAProblemOut)
async def update_problem(
    problem_id: int,
    body: DSAProblemUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(DSAProblem).where(DSAProblem.id == problem_id, DSAProblem.user_id == current_user.id)
    )
    problem = result.scalar_one_or_none()
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")

    for field, value in body.model_dump(exclude_none=True).items():
        setattr(problem, field, value)

    await db.commit()
    await db.refresh(problem)
    await cache_delete(f"dashboard:stats:{current_user.id}")
    return problem


@router.post("/{problem_id}/complete", response_model=DSAProblemOut)
async def complete_problem(
    problem_id: int,
    body: DSAProblemUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Mark a DSA problem as complete.
    Body (all optional): { time_taken: int, confidence: int (1-5), reflection: str }
    
    This endpoint was called by apiService.ts (completeDSAProblem) but was
    missing from the original routes — now fixed.
    """
    result = await db.execute(
        select(DSAProblem).where(DSAProblem.id == problem_id, DSAProblem.user_id == current_user.id)
    )
    problem = result.scalar_one_or_none()
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")

    problem.completed = True
    data = body.model_dump(exclude_none=True)
    if data.get("time_taken") is not None:
        problem.time_taken = int(data["time_taken"])
    if data.get("confidence") is not None:
        problem.confidence = max(1, min(5, int(data["confidence"])))
    if data.get("reflection"):
        problem.reflection = str(data["reflection"])

    today = datetime.utcnow().date()
    if current_user.last_active:
        last = current_user.last_active.date()
        if last == today - timedelta(days=1):
            current_user.streak = (current_user.streak or 0) + 1
        elif last < today - timedelta(days=1):
            current_user.streak = 1
    else:
        current_user.streak = 1
    current_user.last_active = datetime.utcnow()

    await db.commit()
    await db.refresh(problem)
    await cache_delete(f"dashboard:stats:{current_user.id}")
    logger.info(f"User {current_user.id} completed DSA problem {problem_id}: {problem.title}")
    return problem


@router.delete("/{problem_id}", status_code=204)
async def delete_problem(
    problem_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(DSAProblem).where(DSAProblem.id == problem_id, DSAProblem.user_id == current_user.id)
    )
    problem = result.scalar_one_or_none()
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")

    await db.delete(problem)
    await db.commit()
    await cache_delete(f"dashboard:stats:{current_user.id}")
