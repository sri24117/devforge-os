"""V4 AI assistant, focus timer, feature-gate tables

Revision ID: 20260506_v4_ai_focus
Revises: fb2f2720c8e9
Create Date: 2026-05-06
"""
from alembic import op
import sqlalchemy as sa

revision = '20260506_v4_ai_focus'
down_revision = 'fb2f2720c8e9'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        'user_subscriptions',
        sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('user_id', sa.Integer(), sa.ForeignKey('users.id'), index=True),
        sa.Column('plan', sa.String(length=30), nullable=False, server_default='free'),
        sa.Column('status', sa.String(length=30), nullable=False, server_default='active'),
        sa.Column('started_at', sa.DateTime(), nullable=False),
        sa.Column('expires_at', sa.DateTime(), nullable=True),
    )
    op.create_table(
        'focus_sessions',
        sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('user_id', sa.Integer(), sa.ForeignKey('users.id'), index=True),
        sa.Column('context', sa.String(length=80), nullable=False, server_default='practice'),
        sa.Column('task_title', sa.String(length=255), nullable=True),
        sa.Column('target_minutes', sa.Integer(), nullable=False, server_default='25'),
        sa.Column('elapsed_seconds', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('completed', sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column('speed_flag', sa.String(length=50), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
    )
    op.create_table(
        'ai_interactions',
        sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('user_id', sa.Integer(), sa.ForeignKey('users.id'), index=True),
        sa.Column('mode', sa.String(length=30), nullable=False, server_default='quick'),
        sa.Column('model', sa.String(length=120), nullable=False),
        sa.Column('prompt', sa.Text(), nullable=False),
        sa.Column('response', sa.Text(), nullable=True),
        sa.Column('tokens_estimate', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('created_at', sa.DateTime(), nullable=False),
    )
    op.create_table(
        'user_preferences',
        sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('user_id', sa.Integer(), sa.ForeignKey('users.id'), unique=True, index=True),
        sa.Column('target_role', sa.String(length=120), nullable=False, server_default='Python Backend Developer'),
        sa.Column('target_days', sa.Integer(), nullable=False, server_default='45'),
        sa.Column('weekly_hours', sa.Integer(), nullable=False, server_default='12'),
        sa.Column('preferred_ai_model', sa.String(length=120), nullable=False, server_default='quick'),
    )


def downgrade() -> None:
    op.drop_table('user_preferences')
    op.drop_table('ai_interactions')
    op.drop_table('focus_sessions')
    op.drop_table('user_subscriptions')
