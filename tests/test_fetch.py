"""Tests for dash_seqviz.fetch_ncbi().

Network access is mocked: Bio.Entrez.efetch is monkeypatched to return the
local GenBank fixture, so these run offline and deterministically.
"""

import io
from pathlib import Path

import pytest

from dash_seqviz import fetch_ncbi

FIXTURES = Path(__file__).parent
GB_TEXT = (FIXTURES / "MN623123.gb").read_text()


class _FakeHandle:
    def __init__(self, text):
        self._text = text
        self.closed = False

    def read(self):
        return self._text

    def close(self):
        self.closed = True


@pytest.fixture
def mock_efetch(monkeypatch):
    """Patch Entrez.efetch; record the kwargs it was called with."""
    import Bio.Entrez as Entrez

    calls = {}

    def fake_efetch(**kwargs):
        calls.update(kwargs)
        return _FakeHandle(GB_TEXT)

    monkeypatch.setattr(Entrez, "efetch", fake_efetch)
    # Ensure email requirement is satisfied via env for most tests.
    monkeypatch.setenv("NCBI_EMAIL", "test@example.com")
    return calls


def test_fetch_returns_props(mock_efetch):
    props = fetch_ncbi("MN623123.1")
    assert set(props) == {"seq", "name", "annotations", "translations"}
    assert props["seq"]
    assert props["annotations"]


def test_fetch_passes_accession_and_db(mock_efetch):
    fetch_ncbi("MN623123.1", db="nuccore")
    assert mock_efetch["id"] == "MN623123.1"
    assert mock_efetch["db"] == "nuccore"
    assert mock_efetch["rettype"] == "gb"


def test_missing_email_raises(monkeypatch):
    monkeypatch.delenv("NCBI_EMAIL", raising=False)
    with pytest.raises(ValueError, match="email"):
        fetch_ncbi("MN623123.1")


def test_explicit_email_overrides_env(monkeypatch):
    import Bio.Entrez as Entrez

    monkeypatch.delenv("NCBI_EMAIL", raising=False)
    monkeypatch.setattr(Entrez, "efetch", lambda **k: _FakeHandle(GB_TEXT))
    props = fetch_ncbi("MN623123.1", email="explicit@example.com")
    assert props["seq"]
    assert Entrez.email == "explicit@example.com"


def test_empty_response_raises(monkeypatch):
    import Bio.Entrez as Entrez

    monkeypatch.setenv("NCBI_EMAIL", "test@example.com")
    monkeypatch.setattr(Entrez, "efetch", lambda **k: _FakeHandle("   \n"))
    with pytest.raises(ValueError, match="no data"):
        fetch_ncbi("BOGUS.0")


def test_handle_is_closed(mock_efetch, monkeypatch):
    import Bio.Entrez as Entrez

    handle = _FakeHandle(GB_TEXT)
    monkeypatch.setattr(Entrez, "efetch", lambda **k: handle)
    fetch_ncbi("MN623123.1")
    assert handle.closed is True
