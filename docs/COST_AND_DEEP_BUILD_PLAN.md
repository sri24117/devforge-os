# DevForge Cost + Deep Build Plan

## Minimal launch cost in India

| Item | Suggested tool | Monthly cost |
|---|---|---:|
| Frontend hosting | Vercel / Netlify | ₹0–₹1,500 |
| Backend hosting | Render / Railway / Fly.io / VPS | ₹700–₹3,000 |
| PostgreSQL | Supabase / Neon / Render Postgres | ₹0–₹2,000 |
| Redis | Upstash / Render Redis | ₹0–₹1,500 |
| AI API | OpenRouter | Start ₹1,000–₹5,000 test budget |
| Compiler sandbox | Judge0 / small Docker worker | ₹0–₹3,000 initially |
| Domain | .in / .com | ₹700–₹1,200/year |
| Email | Resend / Brevo | ₹0–₹1,000 |
| Error tracking | Sentry | Free to start |

**Practical MVP budget:** ₹2,000–₹8,000/month.

## AI model strategy

- **Quick mode:** Gemma 2 9B or similar low-cost/free OpenRouter model.
- **Balanced mode:** GPT-4o mini / Claude Haiku class.
- **Deep mode:** Claude Sonnet / GPT-4o class only for paid users.

## Fine-tuning recommendation

Do **not** fine-tune first. Start with:

1. Good system prompts.
2. Role-specific question bank.
3. RAG over your own interview notes, resume templates, project explanations.
4. Save best answers from users and convert them into templates.

Fine-tune only after you have:

- 1,000+ real mock answers.
- 500+ reviewed project explanations.
- Clear repeatable scoring rubric.

## 9/10 roadmap

### Phase 1 — This V4 package
- AI assistant.
- Timer logging.
- Minimal home.
- Feature gates.
- Safer compiler.

### Phase 2 — Paid beta
- Razorpay.
- Judge0/Docker sandbox.
- Admin dashboard.
- Password reset/email verification.

### Phase 3 — Deep AI moat
- RAG over interview guide + project bank.
- Voice mock interviews.
- Resume parser.
- Personalized weakness recovery plans.
