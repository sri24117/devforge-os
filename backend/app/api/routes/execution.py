"""Production-ready Python execution facade.

Backends:
- local: reliable developer/demo runner with AST safety checks
- docker: throwaway container with network disabled and memory/pid limits
- judge0: external sandbox API for public SaaS scale

Set EXECUTION_BACKEND=judge0 or docker before public distribution.
"""
from __future__ import annotations

import ast
import base64
import json
import os
import subprocess
import tempfile
import sys
from typing import Any

import httpx
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field

from app.api.deps import get_current_user
from app.core.config import settings
from app.models.models import User

router = APIRouter()

BLOCKED_IMPORTS = {
    "os", "sys", "subprocess", "socket", "shutil", "importlib", "pathlib",
    "multiprocessing", "threading", "ctypes", "resource", "signal", "builtins",
}
BLOCKED_NAMES = {"open", "exec", "eval", "compile", "__import__", "input", "globals", "locals", "vars"}
MAX_CODE_CHARS = 12000
MAX_TESTS = 12


class ExecuteTestCase(BaseModel):
    args: list[Any] = Field(default_factory=list)
    expected: Any


class ExecuteRequest(BaseModel):
    code: str = Field(min_length=1, max_length=MAX_CODE_CHARS)
    language: str = "python"
    problem_title: str | None = None
    tests: list[ExecuteTestCase] | None = None
    function_name: str = "solve"
    timeout_seconds: float = Field(default=4.0, ge=1.0, le=10.0)


class ExecuteResponse(BaseModel):
    stdout: str = ""
    stderr: str = ""
    exit_code: int | None = None
    backend: str = "local"
    test_results: list[dict[str, Any]] | None = None
    safety_note: str = "Use EXECUTION_BACKEND=judge0 or docker before public launch."


MOCK_TEST_CASES = {
    "Two Sum": [
        {"args": [[2, 7, 11, 15], 9], "expected": [0, 1]},
        {"args": [[3, 2, 4], 6], "expected": [1, 2]},
        {"args": [[3, 3], 6], "expected": [0, 1]},
    ],
    "Valid Parentheses": [
        {"args": ["()"], "expected": True},
        {"args": ["()[]{}"], "expected": True},
        {"args": ["(]"], "expected": False},
    ],
    "Best Time to Buy and Sell Stock": [
        {"args": [[7, 1, 5, 3, 6, 4]], "expected": 5},
        {"args": [[7, 6, 4, 3, 1]], "expected": 0},
    ],
}


def validate_code_safety(code: str) -> None:
    try:
        tree = ast.parse(code)
    except SyntaxError as exc:
        raise HTTPException(status_code=400, detail=f"Syntax error: {exc}")
    for node in ast.walk(tree):
        if isinstance(node, ast.Import):
            for alias in node.names:
                root = alias.name.split(".")[0]
                if root in BLOCKED_IMPORTS:
                    raise HTTPException(status_code=400, detail=f"Import '{root}' is not allowed in this practice runner")
        if isinstance(node, ast.ImportFrom):
            root = (node.module or "").split(".")[0]
            if root in BLOCKED_IMPORTS:
                raise HTTPException(status_code=400, detail=f"Import '{root}' is not allowed in this practice runner")
        if isinstance(node, ast.Call) and isinstance(node.func, ast.Name) and node.func.id in BLOCKED_NAMES:
            raise HTTPException(status_code=400, detail=f"Function '{node.func.id}' is disabled in this practice runner")


def _prepare_tests(body: ExecuteRequest) -> list[dict[str, Any]]:
    tests = [t.model_dump() for t in body.tests] if body.tests else []
    if not tests and body.problem_title:
        for title, cases in MOCK_TEST_CASES.items():
            if title.lower() in body.problem_title.lower() or body.problem_title.lower() in title.lower():
                tests = cases
                break
    return tests[:MAX_TESTS]


def build_runner(code: str, tests: list[dict[str, Any]], function_name: str) -> str:
    safe_tests = json.dumps(tests[:MAX_TESTS])
    return f'''
import json
{code}

def __devforge_run_tests():
    tests = {safe_tests}
    results = []
    fn = globals().get({function_name!r})
    if not callable(fn):
        print("___TEST_RESULTS___" + json.dumps([{{"case": 1, "passed": False, "expected": "function {function_name}()", "actual": "Missing function. Define def {function_name}(...):"}}]))
        return
    for idx, test in enumerate(tests, start=1):
        try:
            actual = fn(*test.get("args", []))
            expected = test.get("expected")
            results.append({{"case": idx, "passed": actual == expected, "expected": expected, "actual": actual}})
        except Exception as e:
            results.append({{"case": idx, "passed": False, "expected": test.get("expected"), "actual": "Error: " + str(e)}})
    print("___TEST_RESULTS___" + json.dumps(results, default=str))

__devforge_run_tests()
'''


def parse_output(stdout: str) -> tuple[str, list[dict[str, Any]] | None]:
    test_results = None
    if "___TEST_RESULTS___" in stdout:
        before, _, after = stdout.partition("___TEST_RESULTS___")
        stdout = before
        try:
            test_results = json.loads(after.strip().splitlines()[0])
        except Exception:
            test_results = [{"passed": False, "expected": "valid test result", "actual": "Could not parse test output"}]
    return stdout, test_results


async def run_judge0(full_code: str, timeout_seconds: float) -> ExecuteResponse:
    if not settings.JUDGE0_API_URL:
        raise HTTPException(status_code=400, detail="JUDGE0_API_URL is not configured")
    headers = {"Content-Type": "application/json"}
    if settings.JUDGE0_API_KEY:
        headers["X-RapidAPI-Key"] = settings.JUDGE0_API_KEY
    payload = {
        "language_id": settings.JUDGE0_PYTHON_LANGUAGE_ID,
        "source_code": base64.b64encode(full_code.encode()).decode(),
        "cpu_time_limit": timeout_seconds,
        "memory_limit": 128000,
    }
    base = settings.JUDGE0_API_URL.rstrip("/")
    async with httpx.AsyncClient(timeout=20) as client:
        create = await client.post(f"{base}/submissions?base64_encoded=true&wait=true", json=payload, headers=headers)
    if create.status_code >= 400:
        return ExecuteResponse(stderr=f"Judge0 error: {create.text[:300]}", backend="judge0", exit_code=1)
    data = create.json()
    stdout = base64.b64decode(data.get("stdout") or "").decode(errors="ignore") if data.get("stdout") else ""
    stderr = "\n".join(filter(None, [
        base64.b64decode(data.get("stderr") or "").decode(errors="ignore") if data.get("stderr") else "",
        base64.b64decode(data.get("compile_output") or "").decode(errors="ignore") if data.get("compile_output") else "",
        data.get("message") or "",
    ])).strip()
    stdout, tests = parse_output(stdout)
    return ExecuteResponse(stdout=stdout, stderr=stderr, exit_code=0 if not stderr else 1, backend="judge0", test_results=tests, safety_note="Executed in Judge0 sandbox.")


def run_docker(full_code: str, timeout_seconds: float) -> ExecuteResponse:
    with tempfile.TemporaryDirectory() as td:
        path = os.path.join(td, "solution.py")
        with open(path, "w", encoding="utf-8") as f:
            f.write(full_code)
        cmd = [
            "docker", "run", "--rm", "--network", "none", "--memory", "128m", "--cpus", "0.5", "--pids-limit", "64",
            "-v", f"{td}:/workspace:ro", "-w", "/workspace", settings.DOCKER_PYTHON_IMAGE,
            "python", "-I", "solution.py",
        ]
        try:
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=timeout_seconds + 2)
            stdout, tests = parse_output(result.stdout)
            return ExecuteResponse(stdout=stdout, stderr=result.stderr, exit_code=result.returncode, backend="docker", test_results=tests, safety_note="Executed in throwaway Docker container with network disabled.")
        except FileNotFoundError:
            return ExecuteResponse(stderr="Docker is not installed or not available. Set EXECUTION_BACKEND=local for dev or judge0 for production.", exit_code=1, backend="docker")
        except subprocess.TimeoutExpired:
            return ExecuteResponse(stderr=f"Error: Docker execution timed out ({timeout_seconds}s limit)", exit_code=124, backend="docker")


def run_local(full_code: str, timeout_seconds: float) -> ExecuteResponse:
    temp_path = ""
    try:
        with tempfile.NamedTemporaryFile(mode="w", suffix=".py", delete=False, encoding="utf-8") as f:
            f.write(full_code)
            temp_path = f.name
        result = subprocess.run(
            [sys.executable, "-I", temp_path],
            capture_output=True,
            text=True,
            timeout=timeout_seconds,
            cwd=tempfile.gettempdir(),
            env={"PYTHONIOENCODING": "utf-8"},
        )
        stdout, tests = parse_output(result.stdout)
        stderr = result.stderr.replace(temp_path, "solution.py")
        return ExecuteResponse(stdout=stdout, stderr=stderr, exit_code=result.returncode, backend="local", test_results=tests)
    except subprocess.TimeoutExpired:
        return ExecuteResponse(stderr=f"Error: Execution timed out ({timeout_seconds}s limit)", exit_code=124, backend="local")
    except Exception as exc:
        return ExecuteResponse(stderr=f"Runner error: {str(exc)[:300]}", exit_code=1, backend="local")
    finally:
        if temp_path and os.path.exists(temp_path):
            try:
                os.remove(temp_path)
            except OSError:
                pass


@router.post("", response_model=ExecuteResponse)
async def execute_code(body: ExecuteRequest, current_user: User = Depends(get_current_user)):
    if body.language != "python":
        raise HTTPException(status_code=400, detail="Only Python is supported currently")
    validate_code_safety(body.code)
    tests = _prepare_tests(body)
    full_code = build_runner(body.code, tests, body.function_name) if tests else body.code
    backend = (settings.EXECUTION_BACKEND or "local").lower()
    if backend == "judge0":
        return await run_judge0(full_code, body.timeout_seconds)
    if backend == "docker":
        return run_docker(full_code, body.timeout_seconds)
    return run_local(full_code, body.timeout_seconds)


@router.get("/backend-status")
async def execution_backend_status(current_user: User = Depends(get_current_user)):
    return {
        "backend": settings.EXECUTION_BACKEND,
        "judge0_configured": bool(settings.JUDGE0_API_URL),
        "docker_image": settings.DOCKER_PYTHON_IMAGE,
        "recommendation": "Use judge0 or docker for public users. Local is only for development/demo.",
    }
