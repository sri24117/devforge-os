"""
Redis client - used for caching dashboard stats, rate-limiting, session data
Free tier: Upstash Redis (https://upstash.com)
"""

import os
import json
import redis.asyncio as aioredis

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

redis_client: aioredis.Redis = aioredis.from_url(
    REDIS_URL,
    encoding="utf-8",
    decode_responses=True,
)

# ─── Cache Helpers ──────────────────────────────────────────────


async def cache_get(key: str):
    """Get a JSON value from Redis cache."""
    value = await redis_client.get(key)
    return json.loads(value) if value else None


async def cache_set(key: str, value, ttl: int = 300):
    """Set a JSON value in Redis with TTL (seconds). Default 5 min."""
    await redis_client.set(key, json.dumps(value), ex=ttl)


async def cache_delete(key: str):
    """Invalidate a cache key."""
    await redis_client.delete(key)


async def cache_invalidate_pattern(pattern: str):
    """Delete all keys matching a pattern e.g. 'dashboard:*'"""
    keys = await redis_client.keys(pattern)
    if keys:
        await redis_client.delete(*keys)
