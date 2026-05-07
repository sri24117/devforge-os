"""DevForge V5 Market-Ready Hooks
Resume/JD gap analyzer, GitHub project analyzer, company interview packs,
and gym-room style training plan APIs.
"""
from __future__ import annotations

import re
from typing import Any
from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field
from app.api.deps import get_current_user
from app.models.models import User

router = APIRouter()

BACKEND_KEYWORDS = {
    "python": 8, "fastapi": 10, "django": 8, "flask": 5, "postgresql": 8, "mysql": 5,
    "redis": 8, "docker": 8, "aws": 7, "api": 6, "rest": 6, "jwt": 5, "oauth": 5,
    "sqlalchemy": 6, "celery": 6, "kafka": 7, "microservices": 7, "testing": 6,
    "pytest": 6, "ci/cd": 6, "kubernetes": 7, "system design": 8, "cache": 6,
}
AI_KEYWORDS = {
    "llm": 8, "rag": 10, "langchain": 9, "llamaindex": 8, "openai": 7, "gemini": 7,
    "vector": 8, "chromadb": 7, "pinecone": 7, "agents": 7, "prompt": 5,
    "evaluation": 7, "streaming": 6, "embeddings": 8,
}
PROFILE_KEYWORDS = {
    "github": 4, "deployed": 6, "docker": 6, "readme": 4, "metrics": 8, "latency": 7,
    "uptime": 7, "users": 6, "production": 8, "security": 6, "rbac": 7,
}

COMPANY_PACKS = [
    {
        "id": "ai-backend-startups",
        "title": "AI Backend Startup Pack",
        "role_fit": "AI Backend Engineer / GenAI App Developer",
        "hook": "Best for OpenRouter, LangChain, RAG and production API interviews.",
        "dsa_patterns": ["Hash Map", "Sliding Window", "Graphs", "Heap", "DP basics"],
        "system_design": ["RAG Code Review Assistant", "AI Agent Tool Calling", "Rate Limiter", "LLM Cost Control"],
        "resume_keywords": ["FastAPI", "LangChain", "RAG", "OpenRouter", "PostgreSQL", "Redis", "Docker"],
        "mock_questions": [
            "How do you reduce LLM latency and cost?",
            "When would you choose RAG instead of fine-tuning?",
            "Design an AI code review assistant for a large repo.",
        ],
    },
    {
        "id": "python-backend-product",
        "title": "Python Backend Product Company Pack",
        "role_fit": "Python Backend / Software Engineer Backend",
        "hook": "Best for Razorpay/Freshworks/Zoho/Postman-style backend interviews.",
        "dsa_patterns": ["Binary Search", "Hash Map", "Stack", "BFS/DFS", "Intervals"],
        "system_design": ["API Gateway", "Notification System", "Multi-tenant SaaS", "File Upload Pipeline"],
        "resume_keywords": ["REST APIs", "JWT", "PostgreSQL", "Redis cache", "Docker", "pytest", "scalability"],
        "mock_questions": [
            "Explain how you designed authentication and authorization.",
            "How would you handle 10x traffic growth?",
            "Design a multi-tenant SaaS backend.",
        ],
    },
    {
        "id": "service-to-product-switch",
        "title": "Service-to-Product Switch Pack",
        "role_fit": "Backend Developer moving to product/startup roles",
        "hook": "Turns normal project work into measurable production impact stories.",
        "dsa_patterns": ["Two Pointers", "Hash Map", "Linked List", "Tree", "DP classics"],
        "system_design": ["URL Shortener", "Rate Limiter", "Attendance System", "Dashboard Analytics"],
        "resume_keywords": ["ownership", "latency", "automation", "users", "uptime", "monitoring", "security"],
        "mock_questions": [
            "Tell me about a production bug you fixed.",
            "What was your measurable impact?",
            "How did you make your app usable for non-technical users?",
        ],
    },
]

class ResumeGapRequest(BaseModel):
    resume_text: str = Field(min_length=20, max_length=25000)
    job_description: str = Field(min_length=20, max_length=25000)
    target_role: str = "Python Backend Developer"

class ResumeGapResponse(BaseModel):
    match_score: int
    readiness_label: str
    matched_keywords: list[str]
    missing_keywords: list[str]
    top_blockers: list[str]
    seven_day_plan: list[dict[str, str]]
    improved_headline: str
    rewrite_bullets: list[str]
    paid_hook: str

class GitHubAnalyzeRequest(BaseModel):
    github_username: str | None = None
    repo_names: list[str] = Field(default_factory=list)
    project_description: str = ""

class GitHubAnalyzeResponse(BaseModel):
    score: int
    label: str
    missing: list[str]
    quick_fixes: list[str]
    portfolio_bullets: list[str]
    readme_sections: list[str]

class GymRoomPlanResponse(BaseModel):
    title: str
    subtitle: str
    today_blocks: list[dict[str, Any]]
    weekly_targets: list[dict[str, Any]]
    upgrade_hooks: list[str]


def tokenize(text: str) -> set[str]:
    text = text.lower().replace("ci cd", "ci/cd")
    return set(re.findall(r"[a-z0-9+#./-]+", text))


def phrase_present(text: str, phrase: str) -> bool:
    return phrase.lower() in text.lower()


def score_keywords(resume: str, jd: str) -> tuple[int, list[str], list[str]]:
    resume_tokens = tokenize(resume)
    jd_lower = jd.lower()
    all_kw = {**BACKEND_KEYWORDS, **AI_KEYWORDS, **PROFILE_KEYWORDS}
    relevant = [k for k in all_kw if k in jd_lower or k in resume.lower()]
    if not relevant:
        relevant = list(BACKEND_KEYWORDS)[:12]
    matched, missing = [], []
    total_weight = 0
    gained = 0
    for kw in relevant:
        w = all_kw[kw]
        total_weight += w
        ok = phrase_present(resume, kw) or kw in resume_tokens
        if ok:
            gained += w
            matched.append(kw)
        elif phrase_present(jd, kw):
            missing.append(kw)
    if total_weight == 0:
        return 45, matched, missing
    return min(96, max(18, round((gained / total_weight) * 100))), matched[:20], missing[:20]

@router.post("/resume-gap", response_model=ResumeGapResponse)
async def resume_gap(body: ResumeGapRequest, current_user: User = Depends(get_current_user)):
    score, matched, missing = score_keywords(body.resume_text, body.job_description)
    if score >= 80:
        label = "Interview-call ready"
    elif score >= 60:
        label = "Close, but needs targeting"
    else:
        label = "Needs focused repair"

    blockers = []
    if any(k in missing for k in ["fastapi", "django", "postgresql", "redis", "docker"]):
        blockers.append("Backend stack keywords are not strong enough for this JD.")
    if any(k in missing for k in ["rag", "llm", "langchain", "embeddings", "vector"]):
        blockers.append("AI/LLM proof is missing or not visible enough.")
    if not any(x in body.resume_text.lower() for x in ["%", "users", "latency", "uptime", "daily", "reduced", "improved"]):
        blockers.append("Resume lacks measurable impact metrics.")
    if "docker" in missing or "deployed" in missing:
        blockers.append("Deployment/GitHub proof needs to be clearer.")
    blockers = blockers[:4] or ["Your resume is decent; improve keyword alignment and project proof."]

    missing_display = missing[:10] or ["Add stronger project metrics", "Add deployment link", "Add test coverage proof"]
    plan = [
        {"day": "Day 1", "task": "Rewrite summary/headline for the target role", "output": "1 strong backend/AI backend positioning line"},
        {"day": "Day 2", "task": f"Add missing keywords: {', '.join(missing_display[:4])}", "output": "ATS-aligned skills and project bullets"},
        {"day": "Day 3", "task": "Convert one project into STAR + architecture story", "output": "30-sec and 2-min interview answer"},
        {"day": "Day 4", "task": "Add GitHub README, screenshots, API docs, .env.example", "output": "Recruiter-visible proof"},
        {"day": "Day 5", "task": "Practice one system design matching this JD", "output": "Diagram + tradeoffs"},
        {"day": "Day 6", "task": "Run timed Python/DSA drills from weak patterns", "output": "2 solved problems under target time"},
        {"day": "Day 7", "task": "Apply to 10 targeted roles with tailored resume", "output": "Application tracker updated"},
    ]
    headline_role = body.target_role.strip() or "Python Backend Developer"
    return ResumeGapResponse(
        match_score=score,
        readiness_label=label,
        matched_keywords=matched,
        missing_keywords=missing_display,
        top_blockers=blockers,
        seven_day_plan=plan,
        improved_headline=f"{headline_role} | Python · FastAPI/Django · PostgreSQL · Redis · Docker | Building production AI/backend systems",
        rewrite_bullets=[
            "Built production-grade backend APIs with authentication, validation, database design, and deployment-ready configuration.",
            "Improved reliability and speed using caching, query optimization, structured error handling, and clean API contracts.",
            "Integrated AI-assisted workflows for interview prep, profile readiness, and role-specific project explanation.",
        ],
        paid_hook="Unlock Pro to generate JD-specific resume bullets, mock interview questions, and project explanations for this exact role.",
    )

@router.post("/github-analyzer", response_model=GitHubAnalyzeResponse)
async def github_analyzer(body: GitHubAnalyzeRequest, current_user: User = Depends(get_current_user)):
    text = " ".join(body.repo_names) + " " + body.project_description
    lower = text.lower()
    checks = {
        "README quality": any(w in lower for w in ["readme", "documentation", "docs"]),
        "Docker setup": "docker" in lower,
        "API documentation": any(w in lower for w in ["swagger", "openapi", "api docs", "fastapi"]),
        "Screenshots/demo": any(w in lower for w in ["screenshot", "demo", "vercel", "render", "live"]),
        "Tests": any(w in lower for w in ["test", "pytest", "unit"]),
        "Architecture": any(w in lower for w in ["architecture", "diagram", "system design"]),
    }
    score = 35 + sum(10 for ok in checks.values() if ok)
    score = min(score, 95)
    missing = [name for name, ok in checks.items() if not ok]
    return GitHubAnalyzeResponse(
        score=score,
        label="Portfolio-ready" if score >= 80 else "Needs proof polish" if score >= 60 else "Weak for product roles",
        missing=missing,
        quick_fixes=[
            "Add a README with problem, solution, stack, setup, screenshots, and API routes.",
            "Add .env.example and Docker Compose so reviewers can run it.",
            "Add 3 screenshots/GIFs and one architecture diagram.",
            "Add at least 5 backend tests and mention them in README.",
        ][: max(2, len(missing))],
        portfolio_bullets=[
            "Production-style SaaS with auth, dashboard, AI assistant, timed practice, and feature gates.",
            "Designed backend APIs with FastAPI, PostgreSQL, Redis, Docker, and OpenRouter-ready AI workflows.",
            "Built interview-focused analytics: speed bottlenecks, resume gaps, role tracks, and daily missions.",
        ],
        readme_sections=["Problem", "Solution", "Architecture", "Tech Stack", "Features", "API Routes", "Screenshots", "Setup", "Security Notes", "Future Roadmap"],
    )

@router.get("/company-packs")
async def company_packs(current_user: User = Depends(get_current_user)):
    return {"packs": COMPANY_PACKS}

@router.get("/gym-room-plan", response_model=GymRoomPlanResponse)
async def gym_room_plan(current_user: User = Depends(get_current_user)):
    return GymRoomPlanResponse(
        title="DevForge Training Room",
        subtitle="One screen. One mission. Timed reps. AI coach. Career proof.",
        today_blocks=[
            {"zone": "Warm-up", "task": "Review one resume gap", "minutes": 8, "cta": "Open Resume Lab"},
            {"zone": "Strength", "task": "Solve one timed Python problem", "minutes": 25, "cta": "Open Practice"},
            {"zone": "Skill", "task": "Answer two interview questions", "minutes": 15, "cta": "Open Company Pack"},
            {"zone": "Proof", "task": "Upgrade one GitHub project bullet", "minutes": 12, "cta": "Open GitHub Lab"},
        ],
        weekly_targets=[
            {"metric": "DSA reps", "target": 15},
            {"metric": "Mock answers", "target": 10},
            {"metric": "Resume/JD scans", "target": 5},
            {"metric": "Applications", "target": 35},
        ],
        upgrade_hooks=[
            "Find why your resume is not getting callbacks in 2 minutes.",
            "Turn every project into a confident interview story.",
            "Stop random LeetCode grinding; train by role and speed bottleneck.",
        ],
    )
