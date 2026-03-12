# 🛠️ DevForge OS — Full-Stack Hands-On Upgrade Guide

> **Goal**: Graduate from a single-file Express/SQLite prototype to a production-grade stack with React + FastAPI + Flask + Redis + PostgreSQL + Docker — all on free hosting.

---

## 📐 Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                    Browser (React)                   │
│              Vite + TypeScript + Tailwind            │
└──────────┬──────────────────────────┬───────────────┘
           │ /api/*                   │ /microservice/api/*
           ▼                          ▼
┌──────────────────┐       ┌──────────────────────┐
│  FastAPI Backend  │       │  Flask Microservice   │
│  (Python 3.12)   │       │  (AI Proxy + LeetCode)│
│  Port 8000       │       │  Port 5001            │
└────────┬─────────┘       └──────────┬────────────┘
         │                            │
         ▼                            ▼
┌──────────────────┐       ┌──────────────────────┐
│   PostgreSQL 16  │       │     Redis 7           │
│   (Main DB)      │       │     (Cache + Rate     │
│   Port 5432      │       │      Limiting)        │
└──────────────────┘       └──────────────────────┘

Free Deploy Path:
  Frontend  → Vercel (free)
  FastAPI   → Render.com (free)
  Flask     → Render.com (free)
  Postgres  → Supabase (free, no expiry)
  Redis     → Upstash (free, 10k req/day)
```

---

## 🧰 Prerequisites

Install these once:

| Tool | Version | Install |
|------|---------|---------|
| Node.js | ≥ 20 | https://nodejs.org |
| Python | ≥ 3.12 | https://python.org |
| Docker Desktop | latest | https://docker.com |
| Git | any | https://git-scm.com |

---

## 📁 Project Structure

```
devforge/
├── backend/                    ← FastAPI (Python)
│   ├── main.py                 ← App entry point
│   ├── requirements.txt
│   ├── Dockerfile
│   └── app/
│       ├── core/
│       │   ├── database.py     ← PostgreSQL SQLAlchemy setup
│       │   └── redis_client.py ← Redis cache helpers
│       ├── models/
│       │   └── models.py       ← SQLAlchemy ORM tables
│       ├── schemas/
│       │   └── schemas.py      ← Pydantic request/response models
│       └── api/routes/
│           ├── dashboard.py    ← GET /api/dashboard (cached)
│           ├── dsa.py          ← CRUD /api/dsa
│           ├── applications.py ← CRUD /api/applications
│           ├── interviews.py   ← CRUD /api/interviews
│           ├── system_design.py
│           └── projects.py
│
├── microservice/               ← Flask (Python)
│   ├── app.py                  ← AI proxy + LeetCode scraper
│   ├── requirements.txt
│   └── Dockerfile
│
├── frontend/                   ← React (copy your src/ here)
│   ├── src/
│   │   └── services/
│   │       └── apiService.ts   ← Updated API calls
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
│
├── docker/
│   └── init.sql                ← Seed data
├── deploy/
│   ├── render.yaml             ← Render.com blueprint
│   └── vercel.json             ← Vercel config
├── docker-compose.yml
├── .env.example
└── .gitignore
```

---

## 🚀 Step 1: Git Setup

```bash
# 1a. Initialize Git repo
cd devforge
git init
git add .
git commit -m "feat: initial full-stack scaffold"

# 1b. Create GitHub repo (via browser or GitHub CLI)
gh repo create devforge-os --public
git remote add origin https://github.com/YOUR_USERNAME/devforge-os.git
git push -u origin main
```

**What you learn**: Git init, staging, commits, remotes, push.

---

## 🐳 Step 2: Run Everything with Docker

```bash
# 2a. Copy environment file
cp .env.example .env
# Edit .env — add your GEMINI_API_KEY

# 2b. Start all 5 services
docker compose up --build

# You should see:
#   ✅ PostgreSQL tables created
#   ✅ Redis connected
#   FastAPI running on http://localhost:8000
#   Flask running on http://localhost:5001
#   React running on http://localhost:5173

# 2c. Verify each service is healthy
curl http://localhost:8000/health
curl http://localhost:5001/health
open http://localhost:5173
```

**What you learn**: Docker Compose, multi-service orchestration, health checks, volume mounts.

---

## 🐍 Step 3: FastAPI Deep Dive

```bash
# 3a. Enter the backend container
docker compose exec backend bash

# 3b. Explore the interactive API docs (Swagger UI)
open http://localhost:8000/docs

# 3c. Test endpoints manually
curl http://localhost:8000/api/dsa
curl -X POST http://localhost:8000/api/dsa \
  -H "Content-Type: application/json" \
  -d '{"title":"Two Sum","pattern":"Hash Map","difficulty":"Easy"}'

# 3d. Run outside Docker (local dev)
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

**Key concepts to understand in the code**:

### 3.1 Async Database Session (database.py)
```python
# SQLAlchemy async engine — non-blocking DB calls
engine = create_async_engine(DATABASE_URL, echo=False)

# Dependency injection pattern — FastAPI injects DB session per request
async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
```

### 3.2 Path Operations (dsa.py)
```python
@router.get("", response_model=list[DSAProblemOut])   # GET /api/dsa
@router.post("", response_model=DSAProblemOut)          # POST /api/dsa
@router.patch("/{problem_id}")                          # PATCH /api/dsa/1
@router.delete("/{problem_id}", status_code=204)        # DELETE /api/dsa/1
```

### 3.3 Pydantic Validation (schemas.py)
```python
class DSAProblemCreate(BaseModel):
    title: str           # Required string
    pattern: str         # Required
    difficulty: str      # Required
    completed: bool = False  # Optional with default

# FastAPI auto-validates incoming JSON against this schema
# Returns 422 Unprocessable Entity if validation fails
```

---

## 🗄️ Step 4: PostgreSQL Deep Dive

```bash
# 4a. Connect to Postgres inside Docker
docker compose exec postgres psql -U devforge -d devforge

# 4b. Explore the tables
\dt                          -- list all tables
SELECT * FROM dsa_problems;
SELECT * FROM users;
\d dsa_problems              -- describe table schema

# 4c. Watch queries in real-time (enable query logging)
# In another terminal:
docker compose exec postgres tail -f /var/log/postgresql/postgresql.log

# 4d. Exit psql
\q
```

### 4.1 Understanding SQLAlchemy Mapped Columns (models.py)
```python
class DSAProblem(Base):
    __tablename__ = "dsa_problems"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(255))
    completed: Mapped[bool] = mapped_column(Boolean, default=False)
```
Each `Mapped[type]` → maps to a PostgreSQL column type automatically.

### 4.2 Async Queries
```python
# SELECT * FROM dsa_problems WHERE completed = true
result = await db.execute(
    select(DSAProblem).where(DSAProblem.completed == True)
)
problems = result.scalars().all()

# INSERT
problem = DSAProblem(title="Two Sum", pattern="Hash Map", difficulty="Easy")
db.add(problem)
await db.flush()   # INSERT without commit
# commit happens automatically in get_db() on success
```

---

## ⚡ Step 5: Redis Deep Dive

```bash
# 5a. Open Redis CLI inside Docker
docker compose exec redis redis-cli

# 5b. Basic Redis commands — hands on
SET name "DevForge"
GET name
SETEX temp_key 60 "expires in 60 sec"
TTL temp_key
DEL name
KEYS *

# 5c. Watch cache in action
# Terminal 1 — watch Redis live
docker compose exec redis redis-cli MONITOR

# Terminal 2 — hit the dashboard endpoint (cache MISS first time)
curl http://localhost:8000/api/dashboard
# You'll see SET dashboard:stats in the monitor

# Hit it again — cache HIT (no DB query)
curl http://localhost:8000/api/dashboard

# 5d. Manually invalidate cache
docker compose exec redis redis-cli DEL dashboard:stats
```

### 5.1 How caching works in dashboard.py
```python
# Pattern: Cache-Aside
cached = await cache_get("dashboard:stats")
if cached:
    return cached            # ← Redis hit, ~1ms

# Cache miss: query PostgreSQL (~10-50ms)
result = build_stats_from_db(db)

# Store result in Redis for 5 minutes
await cache_set("dashboard:stats", result, ttl=300)
return result
```

### 5.2 Cache Invalidation
Every time you write data (new DSA problem, new application), the dashboard cache is invalidated:
```python
await cache_delete("dashboard:stats")   # in dsa.py, applications.py, etc.
```

---

## 🧪 Step 6: Flask Microservice Deep Dive

```bash
# 6a. Test AI feedback endpoint
curl -X POST http://localhost:5001/api/ai-feedback \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Give feedback on bubble sort time complexity", "cache_key": "bubble-sort"}'

# 6b. Hit it again — response is cached in Redis
curl -X POST http://localhost:5001/api/ai-feedback \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Give feedback on bubble sort time complexity", "cache_key": "bubble-sort"}'
# → {"response": "...", "cached": true}

# 6c. Test rate limiter (send 11 requests quickly)
for i in {1..12}; do
  curl -s -o /dev/null -w "%{http_code}\n" \
    -X POST http://localhost:5001/api/ai-feedback \
    -H "Content-Type: application/json" \
    -d '{"prompt": "test"}'
done
# 11th+ request returns 429 Too Many Requests

# 6d. Test LeetCode stats
curl http://localhost:5001/api/leetcode/leetcode  # public LeetCode account
```

### 6.1 Rate Limiter Logic
```python
def rate_limit(max_calls: int, window: int):
    def decorator(f):
        def wrapper(*args, **kwargs):
            ip = request.remote_addr
            key = f"rate:{f.__name__}:{ip}"

            count = redis_client.incr(key)    # Increment counter
            if count == 1:
                redis_client.expire(key, window)  # Start timer on first call

            if count > max_calls:
                return jsonify({"error": "Rate limit exceeded"}), 429
            return f(*args, **kwargs)
        return wrapper
    return decorator
```

---

## ⚛️ Step 7: React Integration

Copy your original `src/` folder into `frontend/src/`, then update API calls:

```bash
# 7a. In each component, replace direct fetch() calls:

# OLD (Express/SQLite)
const res = await fetch('/api/dashboard');

# NEW (FastAPI via apiService.ts)
import { getDashboard } from '../services/apiService';
const data = await getDashboard();
```

### 7.1 Using AI Feedback from Flask (in any component)
```typescript
import { getAIFeedback } from '../services/apiService';

// In SimulatorView.tsx, BehavioralTrainer.tsx etc:
const handleGetFeedback = async (userAnswer: string) => {
  setLoading(true);
  try {
    const result = await getAIFeedback(
      `Evaluate this behavioral answer using STAR method: ${userAnswer}`,
      `behavioral-${Date.now()}`  // cache key
    );
    setFeedback(result.response);
  } catch (err) {
    setError('Failed to get AI feedback');
  } finally {
    setLoading(false);
  }
};
```

### 7.2 Using LeetCode Stats
```typescript
import { getLeetCodeStats } from '../services/apiService';

const fetchStats = async (username: string) => {
  const stats = await getLeetCodeStats(username);
  // stats = { username, total_solved, easy_solved, medium_solved, hard_solved }
};
```

---

## 🗃️ Step 8: Database Migrations with Alembic

```bash
# 8a. Initialize Alembic (run inside backend/)
cd backend
alembic init alembic

# 8b. Edit alembic/env.py — add these lines:
# from app.core.database import Base
# from app.models.models import *   # import all models
# target_metadata = Base.metadata

# 8c. Generate a migration after changing models
alembic revision --autogenerate -m "add confidence column to dsa_problems"

# 8d. Apply migration
alembic upgrade head

# 8e. Roll back one migration
alembic downgrade -1

# 8f. See migration history
alembic history
```

**Why migrations matter**: When you change a SQLAlchemy model (add a column, rename something), Alembic generates a versioned SQL file that updates your production DB without data loss.

---

## 🌐 Step 9: Free-Tier Deployment

### 9.1 PostgreSQL → Supabase (free, no time limit)
```
1. Go to https://supabase.com → New Project
2. Database → Connection String → copy URI
3. Replace 'postgres://' with 'postgresql+asyncpg://'
4. Set DATABASE_URL in Render env vars
```

### 9.2 Redis → Upstash (free, 10k req/day)
```
1. Go to https://upstash.com → Create Database → Redis
2. Choose region, copy "Redis URL" (starts with rediss://)
3. Set REDIS_URL in Render + Flask env vars
```

### 9.3 FastAPI + Flask → Render.com (free tier)
```bash
# Push your code to GitHub first
git push origin main

# In Render Dashboard:
# 1. New → Blueprint → Connect GitHub repo
# 2. Point to deploy/render.yaml
# 3. Add env vars: GEMINI_API_KEY, DATABASE_URL, REDIS_URL
# 4. Deploy → gets a public URL like https://devforge-api.onrender.com
```

### 9.4 React → Vercel (free tier)
```bash
# Option A: CLI
npm install -g vercel
cd frontend
vercel --prod

# Option B: Browser
# 1. https://vercel.com → Import Git Repository
# 2. Root Directory: frontend
# 3. Framework: Vite
# 4. Add env vars from deploy/vercel.json
# 5. Deploy
```

**⚠️ Free Tier Notes**:
- Render free services sleep after 15 min inactivity (cold start ~30s)
- Render PostgreSQL free tier expires after 90 days → use Supabase instead
- Upstash free = 10,000 commands/day (enough for dev/prep)

---

## 🔁 Git Workflow for Development

```bash
# Feature branch workflow
git checkout -b feature/redis-cache
# ... make changes ...
git add .
git commit -m "feat: add Redis caching to dashboard endpoint"
git push origin feature/redis-cache

# Create PR on GitHub → review → merge to main
# main branch auto-deploys to Render + Vercel

# Useful git commands
git log --oneline --graph   # visualize commit history
git diff HEAD               # see unstaged changes
git stash                   # save uncommitted work temporarily
git stash pop               # restore stashed work
```

---

## 🧩 Connecting All Pieces — Data Flow Example

When you open the Dashboard tab:

```
React (DashboardView.tsx)
  → calls getDashboard() from apiService.ts
  → GET http://localhost:8000/api/dashboard
  → FastAPI dashboard.py receives request
  → Checks Redis: cache_get("dashboard:stats")
      ✅ HIT  → returns cached JSON in ~1ms
      ❌ MISS → queries PostgreSQL (5 SELECT queries)
               → builds stats dict
               → cache_set("dashboard:stats", result, ttl=300)
               → returns JSON in ~50ms
  → React renders stats
```

When you mark a DSA problem as complete:

```
React (PracticeView.tsx)
  → calls updateDSAProblem(id, {completed: true})
  → PATCH http://localhost:8000/api/dsa/5
  → FastAPI dsa.py updates row in PostgreSQL
  → cache_delete("dashboard:stats")    ← invalidate stale cache
  → returns updated problem
  → React optimistically updates UI
```

When you request AI feedback:

```
React (SimulatorView.tsx)
  → calls getAIFeedback(prompt, cacheKey)
  → POST http://localhost:5001/api/ai-feedback
  → Flask rate limiter checks Redis counter
  → Checks Redis: GET ai:{cacheKey}
      ✅ HIT  → returns cached AI response
      ❌ MISS → calls Gemini API (~2-5s)
               → caches response for 10 min
               → returns response
```

---

## 🎯 Interview Talking Points

Once you've built this, you can speak confidently about:

| Technology | What to say |
|-----------|-------------|
| **React** | "I built a multi-view SPA with Vite, TypeScript, custom hooks for data fetching, and a centralized API service layer" |
| **FastAPI** | "I built async REST APIs with SQLAlchemy, Pydantic validation, dependency injection for DB sessions, and automatic OpenAPI docs" |
| **Flask** | "I built a lightweight microservice with rate limiting and Redis-backed response caching as an AI proxy layer" |
| **PostgreSQL** | "I replaced SQLite with PostgreSQL using async SQLAlchemy, wrote migrations with Alembic, and designed relational schemas with foreign keys" |
| **Redis** | "I implemented cache-aside pattern for dashboard aggregations (5-min TTL), cache invalidation on writes, and Redis-backed IP rate limiting" |
| **Docker** | "I orchestrated 5 services with Docker Compose — postgres, redis, fastapi, flask, react — with health checks, volume mounts, and multi-stage builds" |
| **Git** | "I followed feature-branch workflow, wrote conventional commits, and set up CI/CD with auto-deploy on push to main" |

---

## 🐛 Troubleshooting

| Problem | Fix |
|---------|-----|
| `connection refused` on port 5432 | Run `docker compose up postgres` first |
| `Redis connection error` | Check `REDIS_URL` in .env |
| `422 Unprocessable Entity` | Check request body matches Pydantic schema |
| FastAPI docs not loading | Visit http://localhost:8000/docs |
| React can't reach API | Check `VITE_API_URL` in .env |
| `asyncpg` import error | `pip install asyncpg` in the venv |
| Docker build fails | Run `docker compose build --no-cache` |

---

## ✅ Progress Checklist

- [ ] Project structure created and understood
- [ ] Git repo initialized and pushed to GitHub
- [ ] `docker compose up` runs all 5 services
- [ ] FastAPI Swagger UI working at /docs
- [ ] PostgreSQL tables seeded with data
- [ ] Redis cache working (see MISS → HIT in logs)
- [ ] Flask rate limiter tested (429 on 11th request)
- [ ] React connected to FastAPI via apiService.ts
- [ ] AI feedback flowing through Flask microservice
- [ ] Alembic migration run successfully
- [ ] Deployed FastAPI to Render.com
- [ ] Deployed React to Vercel
- [ ] Supabase PostgreSQL connected to production
- [ ] Upstash Redis connected to production

---

*Built with: React 19 · FastAPI 0.115 · Flask 3.1 · PostgreSQL 16 · Redis 7 · Docker · Deployed on Vercel + Render + Supabase + Upstash*
