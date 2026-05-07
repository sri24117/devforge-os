# DevForge V4 Test Results

## Completed in sandbox

- Backend Python compile check: **PASSED**

Command:

```bash
python -m py_compile $(find backend/app -name '*.py')
```

## Frontend build note

The sandbox does not contain `node_modules`, so full Vite build was not run here. Run locally:

```bash
cd frontend
npm ci
npm run build
```

## Required manual checks

1. Register/login.
2. Confirm default page opens at `#today`.
3. Open Practice and verify 42 seeded problems.
4. Use top focus timer, save session, call `/api/focus/summary`.
5. Highlight code/question and click Ask AI.
6. Add `OPENROUTER_API_KEY` and test quick/deep modes.
7. Run Python `solve()` test cases.
8. Verify Free plan blocks deep AI mode.
