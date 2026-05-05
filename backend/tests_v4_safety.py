"""Lightweight V4 safety checks.
Run from backend root with: python tests_v4_safety.py
"""
import ast
from app.api.routes.execution import validate_code_safety


def assert_raises(fn):
    try:
        fn()
    except Exception:
        return
    raise AssertionError('expected exception')


def test_blocks_os_import():
    assert_raises(lambda: validate_code_safety('import os\nprint(os.getcwd())'))


def test_allows_simple_solution():
    validate_code_safety('def solve(nums, target):\n    return [0, 1]\n')


if __name__ == '__main__':
    test_blocks_os_import()
    test_allows_simple_solution()
    print('V4 safety tests passed')
