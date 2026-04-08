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
OLLAMA_URL = os.getenv("OLLAMA_URL", "") # e.g. http://localhost:11434
BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models"

MODELS = {
    "gemini": "gemini-2.0-flash",
    "gemma": "gemma-4-31b-it", # Just released!
}

# ─── Helper: AI Dispatcher ──────────────────────────────────────

async def get_ai_response(prompt: str, model_type: str) -> str:
    """Dispatches request to either Google AI (API) or Ollama (Local)."""
    
    # Priority 1: Use Local Ollama for Gemma if URL provided
    if model_type == "gemma" and OLLAMA_URL:
        async with httpx.AsyncClient() as client:
            resp = await client.post(
                f"{OLLAMA_URL}/api/generate",
                json={
                    "model": "gemma4:31b", 
                    "prompt": prompt,
                    "stream": False
                },
                timeout=120.0
            )
            resp.raise_for_status()
            return resp.json()["response"]

    # Priority 2: Use Google Cloud API
    if not GEMINI_API_KEY:
        raise Exception("Missing GEMINI_API_KEY and No Local OLLAMA_URL configured.")
        
    model_id = MODELS.get(model_type, MODELS["gemini"])
    async with httpx.AsyncClient() as client:
        resp = await client.post(
            f"{BASE_URL}/{model_id}:generateContent?key={GEMINI_API_KEY}",
            json={"contents": [{"parts": [{"text": prompt}]}]},
            timeout=60.0,
        )
        resp.raise_for_status()
        return resp.json()["candidates"][0]["content"]["parts"][0]["text"]


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
    return jsonify({"status": "ok", "service": "devforge-microservice", "ai_models": list(MODELS.keys())})


@app.post("/api/ai-feedback")
@rate_limit(max_calls=15, window=60)
async def ai_feedback():
    """
    Proxies prompt to Gemini/Gemma and caches result.
    Uses Local Ollama if configured, otherwise Gemini API.
    """
    data = request.get_json()
    if not data or "prompt" not in data:
        return jsonify({"error": "Missing prompt"}), 400

    prompt = data["prompt"]
    model_type = data.get("model", "gemini")
    cache_key = data.get("cache_key")

    # Check Redis cache first
    if cache_key:
        cached = redis_client.get(f"ai:{model_type}:{cache_key}")
        if cached:
            return jsonify({"response": cached, "cached": True})

    # Call AI Dispatcher (Local/Cloud)
    try:
        text = await get_ai_response(prompt, model_type)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    # Cache AI response for 15 minutes
    if cache_key:
        redis_client.setex(f"ai:{model_type}:{cache_key}", 900, text)

    return jsonify({
        "response": text, 
        "cached": False, 
        "model": model_type if OLLAMA_URL and model_type == "gemma" else MODELS.get(model_type)
    })


@app.post("/api/workflow-prep")
@rate_limit(max_calls=5, window=60)
async def workflow_prep():
    """
    Advanced AI Workflow Architect (Gemma 4 Exclusive).
    """
    data = request.get_json()
    workflow_goal = data.get("goal", "Generic automation")
    
    system_prompt = (
        "You are a Senior AI Automation Architect specializing in n8n and Gemma 4. "
        "Design a professional, scalable workflow for the following goal: " + workflow_goal + ". "
        "Provide: 1. Core Logic 2. Necessary n8n Nodes 3. Key LLM Prompts 4. Error handling strategy."
    )

    try:
        text = await get_ai_response(system_prompt, "gemma")
        return jsonify({"architecture": text, "model": "gemma-4-local" if OLLAMA_URL else "gemma-4-cloud"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


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
