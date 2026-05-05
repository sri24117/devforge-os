"""Safer Python execution for interview practice.

Production note: this is a restricted subprocess runner for local MVP/demo.
For public paid launch, set EXECUTION_BACKEND=judge0 or move this route into a
throwaway Docker sandbox with network disabled, CPU quota, pids limit, and 128MB RAM.
"""
import ast
import json
import os
import resource
import subprocess
import tempfile
from typing import Any
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field

from app.api.deps import get_current_user
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
    timeout_seconds: float = Field(default=4.0, ge=1.0, le=8.0)

class ExecuteResponse(BaseModel):
    stdout: str = ""
    stderr: str = ""
    exit_code: int | None = None
    test_results: list[dict[str, Any]] | None = None
    safety_note: str = "Restricted demo runner. Use Judge0/Docker sandbox before public launch."

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
}

def validate_code_safety(code: str) -> None:
    try:
        tree = ast.parse(code)
    except SyntaxError as exc:
        raise HTTPException(status_code=400, detail=f"Syntax error: {exc}")
    for node in ast.walk(tree):
        if isinstance(node, ast.Import):
            for alias in node.names:
                root = alias.name.split('.')[0]
                if root in BLOCKED_IMPORTS:
                    raise HTTPException(status_code=400, detail=f"Import '{root}' is not allowed in this practice runner")
        if isinstance(node, ast.ImportFrom):
            root = (node.module or '').split('.')[0]
            if root in BLOCKED_IMPORTS:
                raise HTTPException(status_code=400, detail=f"Import '{root}' is not allowed in this practice runner")
        if isinstance(node, ast.Call) and isinstance(node.func, ast.Name) and node.func.id in BLOCKED_NAMES:
            raise HTTPException(status_code=400, detail=f"Function '{node.func.id}' is disabled in this practice runner")

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
        print("___TEST_RESULTS___" + json.dumps([{{"passed": False, "expected": "function {function_name}()", "actual": "Missing function"}}]))
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

def limit_resources():
    # Linux only; safe no-op if platform doesn't support. 128MB address space, 2s CPU.
    try:
        resource.setrlimit(resource.RLIMIT_AS, (128 * 1024 * 1024, 128 * 1024 * 1024))
        resource.setrlimit(resource.RLIMIT_CPU, (2, 2))
        resource.setrlimit(resource.RLIMIT_FSIZE, (1024 * 1024, 1024 * 1024))
    except Exception:
        pass

@router.post("", response_model=ExecuteResponse)
async def execute_code(body: ExecuteRequest, current_user: User = Depends(get_current_user)):
    if body.language != "python":
        raise HTTPException(status_code=400, detail="Only Python is supported currently")
    validate_code_safety(body.code)

    tests = [t.model_dump() for t in body.tests] if body.tests else []
    if not tests and body.problem_title:
        for title, cases in MOCK_TEST_CASES.items():
            if title.lower() in body.problem_title.lower() or body.problem_title.lower() in title.lower():
                tests = cases
                break

    full_code = build_runner(body.code, tests, body.function_name) if tests else body.code
    temp_path = ""
    try:
        with tempfile.NamedTemporaryFile(mode="w", suffix=".py", delete=False) as f:
            f.write(full_code)
            temp_path = f.name
        result = subprocess.run(
            ["python", "-I", temp_path],
            capture_output=True,
            text=True,
            timeout=body.timeout_seconds,
            preexec_fn=limit_resources if os.name == "posix" else None,
            cwd=tempfile.gettempdir(),
            env={"PYTHONIOENCODING": "utf-8"},
        )
        stdout, stderr = result.stdout, result.stderr.replace(temp_path, "solution.py")
        test_results = None
        if "___TEST_RESULTS___" in stdout:
            before, marker, after = stdout.partition("___TEST_RESULTS___")
            stdout = before
            try:
                test_results = json.loads(after.strip().splitlines()[0])
            except Exception:
                test_results = [{"passed": False, "expected": "valid test result", "actual": "Could not parse test output"}]
        return ExecuteResponse(stdout=stdout, stderr=stderr, exit_code=result.returncode, test_results=test_results)
    except subprocess.TimeoutExpired:
        return ExecuteResponse(stderr=f"Error: Execution timed out ({body.timeout_seconds}s limit)")
    finally:
        if temp_path and os.path.exists(temp_path):
            try:
                os.remove(temp_path)
            except OSError:
                pass
