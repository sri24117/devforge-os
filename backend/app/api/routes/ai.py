import httpx
from fastapi import APIRouter, Depends, HTTPException
from app.api import deps
from app.core.config import settings

router = APIRouter()


@router.post("/feedback")
async def ai_feedback(
    body: dict,
    current_user = Depends(deps.get_current_user)
):
    """
    Proxy AI feedback requests to the Flask Microservice.
    """
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                f"{settings.MICROSERVICE_URL}/api/ai-feedback",
                json=body,
                timeout=30.0
            )
            return response.json()
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Microservice error: {str(e)}")


@router.post("/workflow-prep")
async def workflow_prep(
    body: dict,
    current_user = Depends(deps.get_current_user)
):
    """
    Proxy Workflow Prep requests to the Flask Microservice (Gemma 4).
    """
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                f"{settings.MICROSERVICE_URL}/api/workflow-prep",
                json=body,
                timeout=60.0
            )
            return response.json()
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Microservice error: {str(e)}")


@router.get("/leetcode/{username}")
async def leetcode_stats(
    username: str,
    current_user = Depends(deps.get_current_user)
):
    """
    Proxy LeetCode stats requests to the Flask Microservice.
    """
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(
                f"{settings.MICROSERVICE_URL}/api/leetcode/{username}",
                timeout=10.0
            )
            return response.json()
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Microservice error: {str(e)}")
