import subprocess
from fastapi import APIRouter, HTTPException

router = APIRouter()


@router.post("")
async def execute_code(body: dict):
    """
    Executes Python code in a subprocess. 
    WARNING: This is NOT SECURE for public production without sandboxing.
    """
    code = body.get("code")
    language = body.get("language", "python")

    if language != "python":
        raise HTTPException(status_code=400, detail="Only Python is supported currently")

    try:
        # Using a timeout to prevent infinite loops
        result = subprocess.run(
            ["python", "-c", code],
            capture_output=True,
            text=True,
            timeout=5.0
        )
        return {
            "stdout": result.stdout,
            "stderr": result.stderr,
            "exit_code": result.returncode
        }
    except subprocess.TimeoutExpired:
        return {"stderr": "Error: Execution timed out (5s limit)"}
    except Exception as e:
        return {"stderr": f"Error: {str(e)}"}
