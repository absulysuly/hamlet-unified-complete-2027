import subprocess
import sys
from pathlib import Path


def test_cli_dry_run(tmp_path):
    env = dict(**os_environ_copy(), PYTHONPATH=str(Path.cwd()))
    cmd = [sys.executable, "run_scrubber.py", "dry-run", "--offline-html", "tests/fixtures/sample_page_1.html"]
    result = subprocess.run(cmd, cwd=Path.cwd(), env=env, capture_output=True, text=True)
    assert result.returncode == 0, result.stderr


def os_environ_copy():
    import os

    env = os.environ.copy()
    env.pop("PYTHONPATH", None)
    return env
