"""DevForge V4 AI Assistant
OpenRouter integration with safe offline fallback, model modes, and usage logging.
"""
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
import httpx

from app.api.deps import get_current_user
from app.core.config import settings
from app.core.database import get_db
from app.models.models import User, AIInteraction, UserSubscription
from app.schemas.schemas import AIAssistantRequest, AIAssistantResponse

router = APIRouter()

MODE_TO_MODEL = {
    "quick": settings.AI_QUICK_MODEL,
    "balanced": settings.AI_BALANCED_MODEL,
    "deep": settings.AI_DEEP_MODEL,
}

SYSTEM_PROMPT = """You are DevForge AI, a concise interview-cracking assistant for Python backend, FastAPI, Django, DSA, system design, AI backend, resume, and project explanation. Give practical, interview-ready answers. Prefer bullets, examples, complexity, and next action. Never reveal hidden chain-of-thought; give concise reasoning summaries."""

async def get_plan(db: AsyncSession, user_id: int) -> str:
    result = await db.execute(select(UserSubscription).where(UserSubscription.user_id == user_id, UserSubscription.status == "active"))
    sub = result.scalar_one_or_none()
    return (sub.plan if sub else "free").lower()

def limit_for_plan(plan: str) -> int:
    if plan == "premium":
        return settings.PREMIUM_AI_DAILY_LIMIT
    if plan == "pro":
        return settings.PRO_AI_DAILY_LIMIT
    return settings.FREE_AI_DAILY_LIMIT

async def usage_today(db: AsyncSession, user_id: int) -> int:
    since = datetime.utcnow() - timedelta(hours=24)
    result = await db.execute(select(func.count(AIInteraction.id)).where(AIInteraction.user_id == user_id, AIInteraction.created_at >= since))
    return int(result.scalar() or 0)

def offline_answer(req: AIAssistantRequest) -> str:
    ctx = f"\nContext: {req.context}" if req.context else ""
    selected = f"\nSelected text/code: {req.selected_text[:1200]}" if req.selected_text else ""
    return (
        "I can help with this. OpenRouter is not configured, so this is the offline DevForge fallback.\n\n"
        f"Your question: {req.message}{ctx}{selected}\n\n"
        "Suggested interview-ready approach:\n"
        "1. State the core idea in one line.\n"
        "2. Explain the trade-off: time complexity, space complexity, scale, or product impact.\n"
        "3. Give one concrete example from your project/code.\n"
        "4. End with how you would improve it in production.\n\n"
        "For production AI responses, add OPENROUTER_API_KEY in .env and use quick/deep mode."
    )

@router.get("/models")
async def models(current_user: User = Depends(get_current_user)):
    return {
        "quick": settings.AI_QUICK_MODEL,
        "balanced": settings.AI_BALANCED_MODEL,
        "deep": settings.AI_DEEP_MODEL,
        "recommendation": {
            "quick": "Gemma for fast code hints and short explanations",
            "balanced": "GPT-4o mini for normal coaching",
            "deep": "Claude/Sonnet-class model for project trainer, resume match, system design",
        },
    }

@router.post("/chat", response_model=AIAssistantResponse)
async def chat(req: AIAssistantRequest, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not req.message.strip() and not req.selected_text:
        raise HTTPException(status_code=400, detail="message or selected_text is required")

    plan = await get_plan(db, current_user.id)
    used = await usage_today(db, current_user.id)
    daily_limit = limit_for_plan(plan)
    if used >= daily_limit:
        raise HTTPException(status_code=402, detail=f"Daily AI limit reached for {plan} plan")
    if req.mode == "deep" and plan == "free":
        raise HTTPException(status_code=402, detail="Deep AI mode is available on Pro/Premium")

    model = req.model or MODE_TO_MODEL.get(req.mode, settings.AI_QUICK_MODEL)
    prompt = req.message
    if req.context:
        prompt += f"\n\nScreen/context: {req.context}"
    if req.selected_text:
        prompt += f"\n\nUser highlighted this text/code/question:\n{req.selected_text[:6000]}"

    fallback = False
    answer = ""
    if settings.OPENROUTER_API_KEY:
        try:
            headers = {
                "Authorization": f"Bearer {settings.OPENROUTER_API_KEY}",
                "HTTP-Referer": settings.OPENROUTER_SITE_URL,
                "X-Title": settings.OPENROUTER_APP_NAME,
            }
            payload = {
                "model": model,
                "messages": [
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": prompt},
                ],
                "temperature": 0.35,
                "max_tokens": 1200 if req.mode == "quick" else 2500,
            }
            async with httpx.AsyncClient(timeout=45) as client:
                resp = await client.post(f"{settings.OPENROUTER_BASE_URL}/chat/completions", json=payload, headers=headers)
                resp.raise_for_status()
                data = resp.json()
                answer = data["choices"][0]["message"]["content"]
        except Exception as exc:
            fallback = True
            answer = offline_answer(req) + f"\n\nOpenRouter error: {str(exc)[:160]}"
    else:
        fallback = True
        answer = offline_answer(req)

    db.add(AIInteraction(user_id=current_user.id, mode=req.mode, model=model, prompt=prompt[:12000], response=answer[:24000], tokens_estimate=max(1, len(prompt)//4)))
    await db.commit()
    return AIAssistantResponse(response=answer, model=model, mode=req.mode, fallback=fallback, remaining_today=max(0, daily_limit - used - 1))
