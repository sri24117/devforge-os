from fastapi import APIRouter

router = APIRouter()


@router.get("")
async def get_roadmap():
    """
    Mock roadmap data. 
    In production, this would be computed per user.
    """
    return [
        {"id": 1, "title": "Foundation & Core Backend", "status": "In Progress"},
        {"id": 2, "title": "System Design Mastery", "status": "Locked"},
        {"id": 3, "title": "Advanced Scalability", "status": "Locked"},
        {"id": 4, "title": "The Job Pipeline", "status": "Locked"},
    ]
