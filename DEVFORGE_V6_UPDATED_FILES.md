# DevForge V6 Updated Files

## Backend
- `backend/app/api/routes/execution.py` — added local/docker/judge0 execution backend facade and clearer compiler error handling.
- `backend/app/api/routes/v6_production.py` — added GitHub OAuth/import, resume PDF parser, voice mock review, and admin dashboard APIs.
- `backend/app/core/config.py` — added V6 environment settings.
- `backend/main.py` — registered `/api/v6` production routes.
- `backend/requirements.txt` — added `pypdf`.
- `.env.example` — added V6 configuration keys.

## Frontend
- `frontend/src/components/ResumeUploadView.tsx`
- `frontend/src/components/GitHubImportView.tsx`
- `frontend/src/components/VoiceMockView.tsx`
- `frontend/src/components/AdminDashboardView.tsx`
- `frontend/src/services/apiService.ts` — added V6 API calls.
- `frontend/src/App.tsx` — added V6 navigation and routes.

## Docs
- `docs/V6_PRODUCTION_FEATURES.md`
