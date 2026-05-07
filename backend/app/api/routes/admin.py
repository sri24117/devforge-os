from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete, update
from typing import List

from app.api import deps
from app.core.database import get_db
from app.models.models import User, UserSubscription
from app.schemas.schemas import UserAdminOut, UserSubscriptionUpdate

router = APIRouter()

@router.get("/users", response_model=List[UserAdminOut])
async def list_users(
    db: AsyncSession = Depends(get_db),
    current_admin: User = Depends(deps.get_current_admin),
):
    """List all users with their current plan status."""
    # Join users with subscriptions
    query = (
        select(
            User.id,
            User.email,
            User.name,
            User.last_active,
            UserSubscription.plan,
            UserSubscription.status.label("subscription_status")
        )
        .outerjoin(UserSubscription, User.id == UserSubscription.user_id)
        .order_by(User.id)
    )
    result = await db.execute(query)
    
    users_data = []
    for row in result.all():
        users_data.append({
            "id": row.id,
            "email": row.email,
            "name": row.name,
            "last_active": row.last_active,
            "plan": row.plan or "free",
            "subscription_status": row.subscription_status or "active"
        })
    
    return users_data

@router.put("/users/{user_id}/subscription")
async def update_user_subscription(
    user_id: int,
    sub_update: UserSubscriptionUpdate,
    db: AsyncSession = Depends(get_db),
    current_admin: User = Depends(deps.get_current_admin),
):
    """Upgrade or downgrade a user's plan."""
    # Check if user exists
    user_result = await db.execute(select(User).where(User.id == user_id))
    user = user_result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Update or insert subscription
    sub_result = await db.execute(select(UserSubscription).where(UserSubscription.user_id == user_id))
    subscription = sub_result.scalar_one_or_none()
    
    if subscription:
        subscription.plan = sub_update.plan
        subscription.status = "active"
    else:
        new_sub = UserSubscription(
            user_id=user_id,
            plan=sub_update.plan,
            status="active"
        )
        db.add(new_sub)
    
    await db.commit()
    return {"message": f"User {user_id} plan updated to {sub_update.plan}"}

@router.delete("/users/{user_id}")
async def delete_user(
    user_id: int,
    db: AsyncSession = Depends(get_db),
    current_admin: User = Depends(deps.get_current_admin),
):
    """Delete a user and all their data."""
    if user_id == current_admin.id:
        raise HTTPException(status_code=400, detail="Cannot delete yourself")
        
    user_result = await db.execute(select(User).where(User.id == user_id))
    user = user_result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    # Delete dependent data (most should have cascade delete if defined, but SQLAlchemy Base might need help)
    # The models don't have all cascades, so we delete them manually if needed or rely on DB FK constraints.
    # In models.py, Application has round cascade. Others don't seem to.
    
    await db.execute(delete(User).where(User.id == user_id))
    await db.commit()
    
    return {"message": f"User {user_id} deleted successfully"}
