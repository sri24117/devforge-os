
"""
DevForge V7 — Razorpay Payments
Production-minded flow:
1. Backend creates Razorpay Order.
2. Frontend opens Razorpay Checkout using order_id.
3. Backend verifies Checkout signature before activating plan.
4. Razorpay webhook validates raw body signature and processes idempotently.

Official Razorpay notes:
- Checkout verification uses HMAC SHA256 over order_id|payment_id.
- Webhooks use X-Razorpay-Signature over raw request body.
"""

from __future__ import annotations

import json
import hmac
import hashlib
import secrets
from datetime import datetime, timedelta
from typing import Literal

import httpx
from fastapi import APIRouter, Depends, HTTPException, Request, Header
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.core.config import settings
from app.core.database import get_db
from app.models.models import User, UserSubscription, PaymentOrder, PaymentWebhookEvent


router = APIRouter()


PlanName = Literal["starter", "pro", "premium", "lifetime"]
BillingCycle = Literal["monthly", "lifetime"]


PLAN_PRICES = {
    "starter": lambda: settings.STARTER_PRICE_INR,
    "pro": lambda: settings.PRO_PRICE_INR,
    "premium": lambda: settings.PREMIUM_PRICE_INR,
    "lifetime": lambda: settings.LIFETIME_PRICE_INR,
}


PLAN_FEATURES = {
    "free": [
        "Today mission",
        "10 DSA problems",
        "5 Python runs/day",
        "1 AI chat/day",
        "1 resume scan/month",
    ],
    "starter": [
        "5 resume scans/month",
        "30 DSA problems",
        "20 Python runs/day",
        "Basic question bank",
        "Basic project explanation trainer",
    ],
    "pro": [
        "Unlimited DSA access",
        "Resume-to-JD match",
        "AI rewritten resume bullets",
        "Project explanation trainer",
        "Analytics/weakness detector",
        "50 AI mentor chats/day",
    ],
    "premium": [
        "Deep AI mentor",
        "Company interview packs",
        "Voice mock interview",
        "GitHub repo analyzer",
        "Weekly readiness report",
        "Advanced JD-specific mock interviews",
    ],
    "lifetime": [
        "Lifetime Pro access",
        "Founder early access badge",
        "All current Pro features",
        "Early access to new features",
    ],
}


class CreateOrderRequest(BaseModel):
    plan: PlanName
    billing_cycle: BillingCycle = "monthly"


class CreateOrderResponse(BaseModel):
    key_id: str
    order_id: str
    amount: int
    currency: str
    plan: str
    billing_cycle: str
    company_name: str
    user: dict
    description: str


class VerifyPaymentRequest(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str


class PaymentHistoryOut(BaseModel):
    id: int
    plan: str
    billing_cycle: str
    amount_paise: int
    currency: str
    status: str
    razorpay_order_id: str
    razorpay_payment_id: str | None
    created_at: str
    paid_at: str | None


def _require_razorpay_config() -> tuple[str, str]:
    if not settings.RAZORPAY_KEY_ID or not settings.RAZORPAY_KEY_SECRET:
        raise HTTPException(
            status_code=503,
            detail="Razorpay is not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.",
        )
    return settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET


def _price_for(plan: str) -> int:
    if plan not in PLAN_PRICES:
        raise HTTPException(status_code=400, detail="Unsupported plan")
    return int(PLAN_PRICES[plan]())


def _target_plan(plan: str) -> str:
    if plan == "lifetime":
        return "pro"
    return plan


def _subscription_expiry(plan: str, billing_cycle: str) -> datetime | None:
    if billing_cycle == "lifetime" or plan == "lifetime":
        return None
    return datetime.utcnow() + timedelta(days=30)


def _verify_checkout_signature(order_id: str, payment_id: str, signature: str) -> bool:
    _, key_secret = _require_razorpay_config()
    message = f"{order_id}|{payment_id}".encode()
    expected = hmac.new(key_secret.encode(), message, hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected, signature)


def _verify_webhook_signature(raw_body: bytes, signature: str | None) -> bool:
    if not settings.RAZORPAY_WEBHOOK_SECRET:
        raise HTTPException(status_code=503, detail="RAZORPAY_WEBHOOK_SECRET is not configured")
    if not signature:
        return False
    expected = hmac.new(
        settings.RAZORPAY_WEBHOOK_SECRET.encode(),
        raw_body,
        hashlib.sha256,
    ).hexdigest()
    return hmac.compare_digest(expected, signature)


async def _activate_subscription(
    db: AsyncSession,
    user_id: int,
    plan: str,
    billing_cycle: str,
) -> UserSubscription:
    active_plan = _target_plan(plan)
    expires_at = _subscription_expiry(plan, billing_cycle)

    result = await db.execute(
        select(UserSubscription).where(UserSubscription.user_id == user_id)
    )
    sub = result.scalar_one_or_none()

    if sub is None:
        sub = UserSubscription(
            user_id=user_id,
            plan=active_plan,
            status="active",
            started_at=datetime.utcnow(),
            expires_at=expires_at,
        )
        db.add(sub)
    else:
        sub.plan = active_plan
        sub.status = "active"
        sub.started_at = datetime.utcnow()
        sub.expires_at = expires_at

    await db.flush()
    return sub


async def _mark_order_paid(
    db: AsyncSession,
    order: PaymentOrder,
    payment_id: str | None = None,
    signature: str | None = None,
) -> None:
    order.status = "paid"
    order.razorpay_payment_id = payment_id or order.razorpay_payment_id
    order.razorpay_signature = signature or order.razorpay_signature
    order.paid_at = datetime.utcnow()
    await _activate_subscription(db, order.user_id, order.plan, order.billing_cycle)


@router.get("/plans")
async def get_plans(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(
        select(UserSubscription).where(UserSubscription.user_id == current_user.id)
    )
    sub = result.scalar_one_or_none()
    current_plan = sub.plan if sub and sub.status == "active" else "free"

    plans = [
        {
            "id": "starter",
            "name": "Starter",
            "price_inr": settings.STARTER_PRICE_INR,
            "billing_cycle": "monthly",
            "best_for": "Low-cost resume + roadmap users",
            "features": PLAN_FEATURES["starter"],
        },
        {
            "id": "pro",
            "name": "Pro",
            "price_inr": settings.PRO_PRICE_INR,
            "billing_cycle": "monthly",
            "best_for": "Serious backend/AI interview prep",
            "features": PLAN_FEATURES["pro"],
            "recommended": True,
        },
        {
            "id": "premium",
            "name": "Premium",
            "price_inr": settings.PREMIUM_PRICE_INR,
            "billing_cycle": "monthly",
            "best_for": "Deep AI mentor + voice + company packs",
            "features": PLAN_FEATURES["premium"],
        },
        {
            "id": "lifetime",
            "name": "Lifetime Early Access",
            "price_inr": settings.LIFETIME_PRICE_INR,
            "billing_cycle": "lifetime",
            "best_for": "First 100 founder users",
            "features": PLAN_FEATURES["lifetime"],
        },
    ]

    return {
        "current_plan": current_plan,
        "currency": settings.RAZORPAY_CURRENCY,
        "plans": plans,
        "configured": bool(settings.RAZORPAY_KEY_ID and settings.RAZORPAY_KEY_SECRET),
    }


@router.post("/create-order", response_model=CreateOrderResponse)
async def create_order(
    body: CreateOrderRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    key_id, key_secret = _require_razorpay_config()

    amount_paise = _price_for(body.plan) * 100
    currency = settings.RAZORPAY_CURRENCY
    receipt = f"devforge_{current_user.id}_{body.plan}_{secrets.token_hex(5)}"

    payload = {
        "amount": amount_paise,
        "currency": currency,
        "receipt": receipt,
        "notes": {
            "user_id": str(current_user.id),
            "email": current_user.email,
            "plan": body.plan,
            "billing_cycle": body.billing_cycle,
            "product": "DevForge OS",
        },
    }

    async with httpx.AsyncClient(timeout=20) as client:
        res = await client.post(
            "https://api.razorpay.com/v1/orders",
            auth=(key_id, key_secret),
            json=payload,
        )

    if res.status_code >= 400:
        raise HTTPException(status_code=502, detail=f"Razorpay order creation failed: {res.text}")

    order_data = res.json()
    order = PaymentOrder(
        user_id=current_user.id,
        plan=body.plan,
        billing_cycle=body.billing_cycle,
        amount_paise=amount_paise,
        currency=currency,
        razorpay_order_id=order_data["id"],
        receipt=receipt,
        status="created",
    )
    db.add(order)
    await db.flush()

    return CreateOrderResponse(
        key_id=key_id,
        order_id=order_data["id"],
        amount=amount_paise,
        currency=currency,
        plan=body.plan,
        billing_cycle=body.billing_cycle,
        company_name=settings.RAZORPAY_COMPANY_NAME,
        user={"name": current_user.name, "email": current_user.email},
        description=f"DevForge {body.plan.title()} plan",
    )


@router.post("/verify")
async def verify_payment(
    body: VerifyPaymentRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not _verify_checkout_signature(
        body.razorpay_order_id,
        body.razorpay_payment_id,
        body.razorpay_signature,
    ):
        raise HTTPException(status_code=400, detail="Invalid Razorpay payment signature")

    result = await db.execute(
        select(PaymentOrder).where(
            PaymentOrder.razorpay_order_id == body.razorpay_order_id,
            PaymentOrder.user_id == current_user.id,
        )
    )
    order = result.scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=404, detail="Payment order not found")

    await _mark_order_paid(db, order, body.razorpay_payment_id, body.razorpay_signature)

    return {
        "status": "success",
        "message": "Payment verified and plan activated",
        "plan": _target_plan(order.plan),
        "billing_cycle": order.billing_cycle,
    }


@router.post("/webhook")
async def razorpay_webhook(
    request: Request,
    db: AsyncSession = Depends(get_db),
    x_razorpay_signature: str | None = Header(default=None),
    x_razorpay_event_id: str | None = Header(default=None),
):
    raw_body = await request.body()
    if not _verify_webhook_signature(raw_body, x_razorpay_signature):
        raise HTTPException(status_code=400, detail="Invalid webhook signature")

    payload = json.loads(raw_body.decode("utf-8"))
    event_type = payload.get("event", "unknown")
    event_id = x_razorpay_event_id or payload.get("payload", {}).get("payment", {}).get("entity", {}).get("id")

    if not event_id:
        event_id = f"fallback_{hashlib.sha256(raw_body).hexdigest()}"

    existing = await db.execute(
        select(PaymentWebhookEvent).where(PaymentWebhookEvent.event_id == event_id)
    )
    if existing.scalar_one_or_none():
        return {"status": "duplicate_ignored"}

    event = PaymentWebhookEvent(
        event_id=event_id,
        event_type=event_type,
        payload=raw_body.decode("utf-8"),
        processed=False,
    )
    db.add(event)

    # Prefer order.paid because it contains order + payment entities when Orders API is used.
    if event_type in {"order.paid", "payment.captured"}:
        order_entity = payload.get("payload", {}).get("order", {}).get("entity", {})
        payment_entity = payload.get("payload", {}).get("payment", {}).get("entity", {})

        order_id = order_entity.get("id") or payment_entity.get("order_id")
        payment_id = payment_entity.get("id")

        if order_id:
            result = await db.execute(
                select(PaymentOrder).where(PaymentOrder.razorpay_order_id == order_id)
            )
            order = result.scalar_one_or_none()
            if order and order.status != "paid":
                await _mark_order_paid(db, order, payment_id)

    event.processed = True
    return {"status": "ok"}


@router.get("/history")
async def payment_history(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(PaymentOrder)
        .where(PaymentOrder.user_id == current_user.id)
        .order_by(PaymentOrder.created_at.desc())
    )
    rows = result.scalars().all()
    return {
        "payments": [
            {
                "id": r.id,
                "plan": r.plan,
                "billing_cycle": r.billing_cycle,
                "amount_paise": r.amount_paise,
                "currency": r.currency,
                "status": r.status,
                "razorpay_order_id": r.razorpay_order_id,
                "razorpay_payment_id": r.razorpay_payment_id,
                "created_at": r.created_at.isoformat(),
                "paid_at": r.paid_at.isoformat() if r.paid_at else None,
            }
            for r in rows
        ]
    }


@router.get("/current-plan")
async def current_plan(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(UserSubscription).where(UserSubscription.user_id == current_user.id)
    )
    sub = result.scalar_one_or_none()
    if not sub:
        return {"plan": "free", "status": "active", "expires_at": None}

    if sub.expires_at and sub.expires_at < datetime.utcnow():
        sub.status = "expired"
        return {"plan": "free", "status": "expired", "expires_at": sub.expires_at.isoformat()}

    return {
        "plan": sub.plan,
        "status": sub.status,
        "expires_at": sub.expires_at.isoformat() if sub.expires_at else None,
    }
