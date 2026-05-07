
# DevForge V7 Test Results

## Backend compile check

Command:

```bash
python -m compileall -q backend/app
```

Result:

```text
PASSED
```

Note: The sandbox printed a spreadsheet runtime warmup warning unrelated to DevForge. Python compile returned exit code 0.

## Razorpay flow sanity checks

Added tests:

```text
backend/tests/test_v7_payments.py
```

Covers:

```text
Checkout signature HMAC shape
Webhook raw body signature HMAC shape
```

## Manual test checklist

1. Add Razorpay Test Mode keys in `.env`.
2. Start backend and frontend.
3. Login as a user.
4. Open `Upgrade` tab.
5. Select Starter/Pro/Premium.
6. Razorpay Checkout should open.
7. Complete test payment.
8. Backend `/api/payments/verify` should activate plan.
9. Configure Razorpay webhook to `/api/payments/webhook`.
10. Trigger `order.paid` or `payment.captured` test event.
11. Confirm webhook event is stored once and duplicate events are ignored.
