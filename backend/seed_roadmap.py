import asyncio
import json
from app.core.database import AsyncSessionLocal
from app.models.models import RoadmapDay
from sqlalchemy import select

ROADMAP_DATA = [
    {
        "day_number": 1,
        "topic": "Array & Hashing: Foundations",
        "description": "Master Two-Sum and Sliding Window basics. These are the building blocks of 30% of FAANG problems.",
        "problem_ids": json.dumps(["Two Sum", "Valid Anagram", "Group Anagrams"])
    },
    {
        "day_number": 2,
        "topic": "Array & Hashing: Advanced",
        "description": "Push into Top K Frequent Elements and Product of Array Except Self.",
        "problem_ids": json.dumps(["Top K Frequent Elements", "Product of Array Except Self", "Longest Consecutive Sequence"])
    },
    {
        "day_number": 3,
        "topic": "Two Pointers: Linear Mastery",
        "description": "Valid Palindrome and 3Sum. Critical for memory-efficient string/array processing.",
        "problem_ids": json.dumps(["Valid Palindrome", "Two Sum II", "3Sum"])
    },
    {
        "day_number": 4,
        "topic": "Sliding Window: Variable Overlap",
        "description": "Maximize sub-array logic. Longest Substring Without Repeating Characters.",
        "problem_ids": json.dumps(["Longest Substring Without Repeating Characters", "Longest Repeating Character Replacement"])
    },
    {
        "day_number": 5,
        "topic": "Stack Fundamentals",
        "description": "Valid Parentheses and Min Stack. Understanding DFS in disguise.",
        "problem_ids": json.dumps(["Valid Parentheses", "Min Stack", "Evaluate Reverse Polish Notation"])
    },
    {
        "day_number": 6,
        "topic": "Binary Search: Logarithmic Power",
        "description": "Search in Rotated Sorted Array. The classic 'Optimal or Bust' interview round.",
        "problem_ids": json.dumps(["Search in Rotated Sorted Array", "Find Minimum in Rotated Sorted Array"])
    },
    {
        "day_number": 7,
        "topic": "Linked List: Pointers & Cycles",
        "description": "Reversing and merging. Floyd's cycle detection.",
        "problem_ids": json.dumps(["Reverse Linked List", "Merge Two Sorted Lists", "Linked List Cycle"])
    },
    {
        "day_number": 8,
        "topic": "Trees: DFS Foundations",
        "description": "Inverting and Maximum Depth of Binary Tree.",
        "problem_ids": json.dumps(["Invert Binary Tree", "Maximum Depth of Binary Tree", "Diameter of Binary Tree"])
    },
    {
        "day_number": 9,
        "topic": "Trees: BFS & Level Order",
        "description": "Traversing trees horizontally. Binary Tree Level Order Traversed.",
        "problem_ids": json.dumps(["Binary Tree Level Order Traversal", "Binary Tree Right Side View"])
    },
    {
        "day_number": 10,
        "topic": "Tries: Prefix Mastery",
        "description": "Implementing a Trie. This is why search engines are fast.",
        "problem_ids": json.dumps(["Implement Trie (Prefix Tree)", "Design Add and Search Words Data Structure"])
    }
]

async def seed():
    async with AsyncSessionLocal() as db:
        print("Seeding FAANG Roadmap...")
        for day_data in ROADMAP_DATA:
            # Check if day already exists
            result = await db.execute(select(RoadmapDay).where(RoadmapDay.day_number == day_data['day_number']))
            if not result.scalar_one_or_none():
                day = RoadmapDay(**day_data)
                db.add(day)
        await db.commit()
    print("Seeding finished.")

if __name__ == "__main__":
    asyncio.run(seed())
