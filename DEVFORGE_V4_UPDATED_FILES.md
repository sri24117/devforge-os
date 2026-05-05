# DevForge V4 Updated Files

## Backend
- `backend/app/core/config.py` — OpenRouter, feature limits, production config.
- `backend/app/core/security.py` — JWT secret now reads from settings.
- `backend/app/models/models.py` — added `UserSubscription`, `FocusSession`, `AIInteraction`, `UserPreference`.
- `backend/app/schemas/schemas.py` — added assistant, focus, entitlements schemas.
- `backend/app/api/routes/assistant.py` — OpenRouter/Gemma-ready AI assistant with fallback and usage logging.
- `backend/app/api/routes/focus.py` — focus timer logging + speed bottleneck analytics.
- `backend/app/api/routes/entitlements.py` — Free/Pro/Premium feature gates.
- `backend/app/api/routes/execution.py` — safer Python execution with AST safety, resource limits, typed tests.
- `backend/app/api/routes/dsa.py` — seeded 42 problems, typed completion, streak update.
- `backend/main.py` — mounted V4 routes.
- `backend/alembic/versions/20260506_v4_ai_focus_tables.py` — V4 DB migration.

## Frontend
- `frontend/src/components/FloatingAIAssistant.tsx` — minimalist Ask AI FAB with highlight context.
- `frontend/src/components/FocusTimer.tsx` — top-screen timer with save/log button.
- `frontend/src/components/MinimalHomeView.tsx` — Daily Mission hub to reduce feature fatigue.
- `frontend/src/App.tsx` — default tab changed to Today, minimalist navigation, global timer, AI assistant.
- `frontend/src/services/apiService.ts` — V4 API clients for assistant, focus, entitlements, test execution.

## Docs
- `docs/V4_POLISH_NOTES.md`
- `docs/COST_AND_DEEP_BUILD_PLAN.md`
