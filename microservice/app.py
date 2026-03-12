"""
DevForge OS - Flask Microservice
Responsibilities:
  1. /api/ai-feedback  → Queues Gemini AI prompts (rate-limit protection)
  2. /api/leetcode     → Scrapes LeetCode profile stats
  3. /health           → Health check

Why Flask here (not FastAPI)?
  - Demonstrates polyglot microservice pattern
  - Flask is lighter for simple HTTP relay tasks
  - Hands-on experience with both frameworks
"""

import os
import json
import time
import httpx
from flask import Flask, request, jsonify
from functools import wraps
import redis

app = Flask(__name__)

# Redis for simple rate limiting & job queue
redis_client = redis.from_url(
    os.getenv("REDIS_URL", "redis://localhost:6379/0"),
    decode_responses=True
)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"

# ─── Rate Limiter Decorator ─────────────────────────────────────

def rate_limit(max_calls: int, window: int):
    """Simple Redis-backed rate limiter."""
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            ip = request.remote_addr or "unknown"
            key = f"rate:{f.__name__}:{ip}"
            count = redis_client.incr(key)
            if count == 1:
                redis_client.expire(key, window)
            if count > max_calls:
                ttl = redis_client.ttl(key)
                return jsonify({
                    "error": "Rate limit exceeded",
                    "retry_after": ttl
                }), 429
            return f(*args, **kwargs)
        return wrapper
    return decorator


# ─── Routes ─────────────────────────────────────────────────────

@app.get("/health")
def health():
    return jsonify({"status": "ok", "service": "devforge-microservice"})


@app.post("/api/ai-feedback")
@rate_limit(max_calls=10, window=60)  # 10 req/min per IP
def ai_feedback():
    """
    Proxies prompt to Gemini and caches result in Redis.
    Body: { "prompt": "...", "cache_key": "optional-key" }
    """
    data = request.get_json()
    if not data or "prompt" not in data:
        return jsonify({"error": "Missing prompt"}), 400

    prompt = data["prompt"]
    cache_key = data.get("cache_key")

    # Check Redis cache first
    if cache_key:
        cached = redis_client.get(f"ai:{cache_key}")
        if cached:
            return jsonify({"response": cached, "cached": True})

    # Call Gemini API
    try:
        resp = httpx.post(
            f"{GEMINI_URL}?key={GEMINI_API_KEY}",
            json={"contents": [{"parts": [{"text": prompt}]}]},
            timeout=30,
        )
        resp.raise_for_status()
        text = resp.json()["candidates"][0]["content"]["parts"][0]["text"]
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    # Cache AI response for 10 minutes
    if cache_key:
        redis_client.setex(f"ai:{cache_key}", 600, text)

    return jsonify({"response": text, "cached": False})


@app.get("/api/leetcode/<username>")
@rate_limit(max_calls=5, window=300)  # 5 req per 5 min
def leetcode_stats(username: str):
    """
    Fetches LeetCode stats via public GraphQL API.
    Caches result for 30 minutes.
    """
    cache_key = f"leetcode:{username}"
    cached = redis_client.get(cache_key)
    if cached:
        return jsonify(json.loads(cached))

    query = """
    query getUserProfile($username: String!) {
      matchedUser(username: $username) {
        submitStats: submitStatsGlobal {
          acSubmissionNum {
            difficulty
            count
          }
        }
      }
    }
    """
    try:
        resp = httpx.post(
            "https://leetcode.com/graphql",
            json={"query": query, "variables": {"username": username}},
            headers={"Content-Type": "application/json"},
            timeout=10,
        )
        resp.raise_for_status()
        data = resp.json()
        stats = data["data"]["matchedUser"]["submitStats"]["acSubmissionNum"]

        result = {
            "username": username,
            "total_solved": next((x["count"] for x in stats if x["difficulty"] == "All"), 0),
            "easy_solved": next((x["count"] for x in stats if x["difficulty"] == "Easy"), 0),
            "medium_solved": next((x["count"] for x in stats if x["difficulty"] == "Medium"), 0),
            "hard_solved": next((x["count"] for x in stats if x["difficulty"] == "Hard"), 0),
        }
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    redis_client.setex(cache_key, 1800, json.dumps(result))  # 30 min
    return jsonify(result)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=False)
