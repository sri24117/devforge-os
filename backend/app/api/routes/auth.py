"""
DevForge OS - Auth Routes (Upgraded)
Adds:
  - /github/url   → GitHub OAuth redirect URL
  - /github/callback → GitHub OAuth callback
  - /leetcode/import → Sync LeetCode stats into DB for current user
"""

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import httpx
import json

from app.core import security
from app.core.database import get_db
from app.core.redis_client import cache_delete
from app.models.models import User, LeetCodeProfile
from app.schemas.schemas import UserCreate, UserOut, Token
from app.api.deps import get_current_user
from app.core.config import settings

router = APIRouter()

# ─── Registration & Login ────────────────────────────────────────

@router.post("/register", response_model=UserOut)
async def register(body: UserCreate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == body.email))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="User with this email already exists")

    db_user = User(
        email=body.email,
        hashed_password=security.get_password_hash(body.password),
        name=body.name,
    )
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    return db_user


@router.post("/login", response_model=Token)
async def login(db: AsyncSession = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()):
    result = await db.execute(select(User).where(User.email == form_data.username))
    user = result.scalar_one_or_none()

    if not user or not security.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = security.create_access_token(subject=user.id)
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/me", response_model=UserOut)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user


# ─── GitHub OAuth ────────────────────────────────────────────────

@router.get("/github/url")
async def github_auth_url():
    """
    Returns the GitHub OAuth URL for the frontend to redirect to.
    Set GITHUB_CLIENT_ID in your .env to enable.
    """
    client_id = getattr(settings, "GITHUB_CLIENT_ID", None)
    if not client_id:
        raise HTTPException(
            status_code=503,
            detail="GitHub OAuth not configured. Add GITHUB_CLIENT_ID to .env"
        )
    url = (
        f"https://github.com/login/oauth/authorize"
        f"?client_id={client_id}"
        f"&scope=read:user,user:email"
        f"&redirect_uri={getattr(settings, 'GITHUB_REDIRECT_URI', 'http://localhost:5173')}"
    )
    return {"url": url}


# ─── LeetCode Import (CRITICAL MISSING ENDPOINT) ─────────────────

@router.post("/leetcode/import")
async def import_leetcode(
    body: dict,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Fetches LeetCode stats for `username` and syncs them to the DB
    under the current authenticated user. Invalidates dashboard cache.

    Body: { "username": "your_lc_username" }
    """
    username = body.get("username", "").strip()
    if not username:
        raise HTTPException(status_code=400, detail="username is required")

    # ── Fetch from LeetCode GraphQL ──────────────────────────────
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
        async with httpx.AsyncClient(timeout=12) as client:
            resp = await client.post(
                "https://leetcode.com/graphql",
                json={"query": query, "variables": {"username": username}},
                headers={"Content-Type": "application/json", "Referer": "https://leetcode.com"},
            )
            resp.raise_for_status()
            data = resp.json()

        matched = data.get("data", {}).get("matchedUser")
        if not matched:
            raise HTTPException(status_code=404, detail=f"LeetCode user '{username}' not found")

        stats = matched["submitStats"]["acSubmissionNum"]
        total   = next((x["count"] for x in stats if x["difficulty"] == "All"),    0)
        easy    = next((x["count"] for x in stats if x["difficulty"] == "Easy"),   0)
        medium  = next((x["count"] for x in stats if x["difficulty"] == "Medium"), 0)
        hard    = next((x["count"] for x in stats if x["difficulty"] == "Hard"),   0)

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"LeetCode fetch failed: {str(e)}")

    # ── Upsert LeetCodeProfile ───────────────────────────────────
    result = await db.execute(
        select(LeetCodeProfile).where(LeetCodeProfile.user_id == current_user.id)
    )
    profile = result.scalar_one_or_none()

    if profile:
        profile.username      = username
        profile.total_solved  = total
        profile.easy_solved   = easy
        profile.medium_solved = medium
        profile.hard_solved   = hard
    else:
        profile = LeetCodeProfile(
            user_id=current_user.id,
            username=username,
            total_solved=total,
            easy_solved=easy,
            medium_solved=medium,
            hard_solved=hard,
        )
        db.add(profile)

    await db.commit()
    await db.refresh(profile)

    # Invalidate dashboard cache so new stats show immediately
    await cache_delete(f"dashboard:stats:{current_user.id}")

    return {
        "message": f"Synced LeetCode profile for '{username}'",
        "username": username,
        "total_solved": total,
        "easy_solved": easy,
        "medium_solved": medium,
        "hard_solved": hard,
    }
