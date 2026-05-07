
# DevForge V7 — Razorpay Payments

## What this adds

DevForge now supports a production payment flow:

1. Backend creates a Razorpay Order.
2. Frontend opens Razorpay Checkout.
3. Backend verifies the Checkout payment signature.
4. Backend activates the user's subscription plan.
5. Razorpay webhook validates raw-body signature and processes events idempotently.
6. User can view current plan and payment history.

## Environment variables

```env
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret_from_dashboard
RAZORPAY_CURRENCY=INR
RAZORPAY_COMPANY_NAME=DevForge OS
FRONTEND_URL=http://localhost:5173

STARTER_PRICE_INR=199
PRO_PRICE_INR=499
PREMIUM_PRICE_INR=999
LIFETIME_PRICE_INR=2499
```

## Backend APIs

```text
GET  /api/payments/plans
POST /api/payments/create-order
POST /api/payments/verify
POST /api/payments/webhook
GET  /api/payments/current-plan
GET  /api/payments/history
```

## Razorpay dashboard setup

Set webhook URL:

```text
https://your-api-domain.com/api/payments/webhook
```

Recommended webhook events:

```text
order.paid
payment.captured
payment.failed
```

## Security notes

- Never expose `RAZORPAY_KEY_SECRET` in the frontend.
- The frontend only receives `RAZORPAY_KEY_ID`.
- Checkout verification uses `order_id|payment_id` HMAC SHA256.
- Webhook verification uses the raw request body and `X-Razorpay-Signature`.
- Webhook idempotency is handled using `x-razorpay-event-id`.
- Use Razorpay Test Mode first before going live.

## Pricing strategy used

India-first early pricing:

```text
Free: daily mission + limited practice
Starter: ₹199/month
Pro: ₹499/month
Premium: ₹999/month
Lifetime Early Access: ₹2499 one-time
```

Best paid hooks:

```text
Resume/JD gap score
AI resume bullet rewrite
GitHub proof analyzer
Company interview packs
Voice mock interview
Deep AI mentor
```
