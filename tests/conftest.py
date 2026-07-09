"""Shared pytest fixtures for the dash-seqviz test suite."""

import os
import shutil

import pytest


def _has_browser() -> bool:
    """True if a Chrome/Chromium binary is available for selenium."""
    names = ("google-chrome", "google-chrome-stable", "chromium", "chromium-browser", "chrome")
    if any(shutil.which(n) for n in names):
        return True
    # macOS default install location
    return os.path.exists("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome")


@pytest.fixture(autouse=True)
def _skip_without_browser(request):
    """Skip selenium-backed tests (those using `dash_duo`) when no browser
    is installed, so the rest of the suite still runs everywhere."""
    if "dash_duo" in request.fixturenames and not _has_browser():
        pytest.skip("no Chrome/Chromium available for selenium integration tests")
