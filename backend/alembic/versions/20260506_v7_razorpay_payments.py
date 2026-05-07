
"""v7 razorpay payments

Revision ID: 20260506_v7
Revises: 20260506_v6
Create Date: 2026-05-06
"""
from alembic import op
import sqlalchemy as sa

revision = "20260506_v7"
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "payment_orders",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("plan", sa.String(length=30), nullable=False),
        sa.Column("billing_cycle", sa.String(length=30), nullable=False, server_default="monthly"),
        sa.Column("amount_paise", sa.Integer(), nullable=False),
        sa.Column("currency", sa.String(length=10), nullable=False, server_default="INR"),
        sa.Column("razorpay_order_id", sa.String(length=120), nullable=False),
        sa.Column("razorpay_payment_id", sa.String(length=120), nullable=True),
        sa.Column("razorpay_signature", sa.String(length=255), nullable=True),
        sa.Column("status", sa.String(length=30), nullable=False, server_default="created"),
        sa.Column("receipt", sa.String(length=120), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("paid_at", sa.DateTime(), nullable=True),
    )
    op.create_index("ix_payment_orders_user_id", "payment_orders", ["user_id"])
    op.create_index("ix_payment_orders_plan", "payment_orders", ["plan"])
    op.create_index("ix_payment_orders_razorpay_order_id", "payment_orders", ["razorpay_order_id"], unique=True)
    op.create_index("ix_payment_orders_razorpay_payment_id", "payment_orders", ["razorpay_payment_id"])

    op.create_table(
        "payment_webhook_events",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("event_id", sa.String(length=160), nullable=False),
        sa.Column("event_type", sa.String(length=120), nullable=False),
        sa.Column("payload", sa.Text(), nullable=False),
        sa.Column("processed", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column("created_at", sa.DateTime(), nullable=False),
    )
    op.create_index("ix_payment_webhook_events_event_id", "payment_webhook_events", ["event_id"], unique=True)
    op.create_index("ix_payment_webhook_events_event_type", "payment_webhook_events", ["event_type"])


def downgrade():
    op.drop_index("ix_payment_webhook_events_event_type", table_name="payment_webhook_events")
    op.drop_index("ix_payment_webhook_events_event_id", table_name="payment_webhook_events")
    op.drop_table("payment_webhook_events")
    op.drop_index("ix_payment_orders_razorpay_payment_id", table_name="payment_orders")
    op.drop_index("ix_payment_orders_razorpay_order_id", table_name="payment_orders")
    op.drop_index("ix_payment_orders_plan", table_name="payment_orders")
    op.drop_index("ix_payment_orders_user_id", table_name="payment_orders")
    op.drop_table("payment_orders")
