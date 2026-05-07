# DevForge V6 — Production Upgrade Notes

## Added

1. **Judge0 / Docker sandbox compiler support**
   - `EXECUTION_BACKEND=local | docker | judge0`
   - `GET /api/execute/backend-status`
   - Local runner remains for development, Docker/Judge0 are recommended for public users.

2. **GitHub OAuth + public repo import**
   - `GET /api/v6/github/auth-url`
   - `GET /api/v6/github/callback`
   - `POST /api/v6/github/import`
   - Frontend: `GitHubImportView.tsx`

3. **Resume PDF upload parser**
   - `POST /api/v6/resume/upload`
   - Uses `pypdf` when available and falls back to safe text extraction.
   - Frontend: `ResumeUploadView.tsx`

4. **Voice mock interview**
   - `POST /api/v6/voice/mock-review`
   - Browser speech-to-text support with manual transcript fallback.
   - Scores pace, clarity, filler words, structure, and stores a mock interview record.
   - Frontend: `VoiceMockView.tsx`

5. **Admin dashboard**
   - `GET /api/v6/admin/summary`
   - Requires the logged-in user email to be in `ADMIN_EMAILS`.
   - Frontend: `AdminDashboardView.tsx`

## Production settings

```env
EXECUTION_BACKEND=judge0
JUDGE0_API_URL=https://your-judge0-host
JUDGE0_API_KEY=optional-key
JUDGE0_PYTHON_LANGUAGE_ID=71

GITHUB_CLIENT_ID=your-client-id
GITHUB_CLIENT_SECRET=your-client-secret
GITHUB_REDIRECT_URI=https://api.yourdomain.com/api/v6/github/callback
ADMIN_EMAILS=you@example.com,admin@example.com
MAX_RESUME_UPLOAD_MB=4
```

## Compiler recommendation

- Use `local` only for your laptop/demo.
- Use `docker` if you control the server and Docker is available.
- Use `judge0` for public SaaS because it is the safest and simplest operational model.

## Remaining hardening before paid public launch

- Store GitHub OAuth tokens encrypted, not plain text.
- Add Razorpay payments and webhook verification.
- Move JWT auth from localStorage to httpOnly cookie.
- Add Sentry or equivalent error monitoring.
- Add rate limits for resume upload, voice review, repo import, and compiler usage.
