# DevForge V5 — Market Ready Gym-Room Upgrade

## What changed

V5 turns DevForge from a feature-heavy interview dashboard into a focused training-room product:

1. Training Room home screen
   - One mission hub instead of 20 visible features.
   - Daily blocks: Resume warm-up, timed Python strength rep, company-pack skill work, GitHub proof work.

2. Resume Gap Lab
   - Paste resume + job description.
   - Produces match score, blockers, missing keywords, 7-day fix plan, headline, and rewrite bullets.
   - This is the strongest paid hook.

3. GitHub Lab
   - Scores portfolio/project proof.
   - Suggests README sections, Docker/docs/tests/screenshots fixes.
   - Turns GitHub into interview proof.

4. Company Packs
   - Role-specific prep packs for AI backend, Python backend product roles, and service-to-product switch.
   - Includes DSA patterns, system designs, resume keywords, and mock questions.

5. Practice Gym compiler fix
   - Practice page now uses function-based Python tests: `def solve(...)`.
   - Clearer errors instead of generic “Execution failed”.
   - Local runner no longer kills simple Python programs with too-strict memory limits.
   - Target-time pressure is visible on-screen.

## Critical production note

The local subprocess runner is now reliable for your personal practice and demos. For public paid users, replace it with:

- Judge0 API/self-hosted Judge0, or
- Throwaway Docker container per execution with no network, pids limit, CPU quota, and memory limit.

Blocked imports are not enough for public compiler security.

## Best monetization loop

Free:
- Training Room
- Limited Practice Gym
- One resume scan/month

Starter / Pro:
- Resume-to-JD scans
- AI rewrite bullets
- Company Packs
- GitHub Lab

Premium:
- Deep AI project trainer
- Voice mock interview
- Company-specific interview simulation
- Weekly readiness report

## Strongest landing-page hooks

- Find why your resume is not getting callbacks in 2 minutes.
- Turn every project into an interview-winning story.
- Stop random LeetCode grinding. Train by role, speed, and proof.
- Practice Python with test cases, timer, and AI feedback.
