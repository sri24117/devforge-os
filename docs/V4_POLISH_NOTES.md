# DevForge V4 — 9/10 Production Polish Notes

## Added

1. **Floating AI Assistant**
   - Small minimalist `Ask AI` FAB.
   - Supports highlighted text/code context.
   - OpenRouter-ready model modes:
     - `quick`: Gemma-style fast answers.
     - `balanced`: normal coaching.
     - `deep`: project/system design/resume reasoning.
   - Offline fallback when `OPENROUTER_API_KEY` is not set.
   - Daily plan limits by Free/Pro/Premium tier.

2. **Focus Timer + Time Analytics**
   - Global subtle timer in the top bar.
   - Logs focus sessions to backend.
   - Flags speed bottlenecks when user exceeds target time.
   - Targets: Easy 20m, Medium 35m, Hard 45m.

3. **Minimalist Daily Mission Hub**
   - Default screen is now `Today`, not crowded dashboard.
   - Shows one clear mission path.
   - Main navigation reduced to key areas: Today, Practice, Analytics, Roadmap, Mock Interview, System Design, Projects, Career, Library.

4. **Feature Gates**
   - `/api/entitlements` exposes plan-based limits.
   - Free users get daily missions and limited AI.
   - Pro/Premium unlock deeper AI and resume/JD features.

5. **Safer Python Runner**
   - Pydantic request validation.
   - Auth required.
   - AST-based import/function blocking.
   - Linux resource limits: 128MB memory, CPU and file-size caps.
   - Custom test case runner.
   - Clear warning: public launch should use Judge0 or Docker sandbox.

## Still required for a real paid public launch

- Razorpay payment + webhook signature verification.
- Email verification + password reset.
- Proper httpOnly cookie auth instead of localStorage tokens.
- Judge0/Docker sandbox for code execution.
- Admin panel for user/activity/revenue monitoring.
- Observability: Sentry + structured logs + uptime alerts.
- Rate limiting at API gateway level.
