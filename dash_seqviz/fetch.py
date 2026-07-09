"""Fetch sequences from NCBI into SeqViz props.

Thin wrapper over Biopython's Entrez client that fetches a GenBank record by
accession and runs it through :func:`dash_seqviz.parse`, so the result is a
ready-to-spread SeqViz props dict::

    from dash_seqviz import SeqViz, fetch_ncbi

    props = fetch_ncbi("MN623123.1", email="you@example.com")
    SeqViz(id="viewer", **props)

NCBI's E-utilities ask every caller to identify themselves with an email
address. Pass ``email=`` or set the ``NCBI_EMAIL`` environment variable. An
optional API key (``api_key=`` or ``NCBI_API_KEY``) raises the rate limit.
"""

from __future__ import annotations

import io
import os
from typing import Any, Dict, Optional

from .parse import parse


def fetch_ncbi(
    accession: str,
    *,
    email: Optional[str] = None,
    api_key: Optional[str] = None,
    db: str = "nuccore",
    record: int = 0,
    include_translations: bool = True,
) -> Dict[str, Any]:
    """Fetch a record from NCBI by accession and return SeqViz props.

    Parameters
    ----------
    accession:
        NCBI accession id, e.g. ``"MN623123.1"``.
    email:
        Contact email required by NCBI. Falls back to the ``NCBI_EMAIL``
        environment variable; raises ``ValueError`` if neither is set.
    api_key:
        Optional NCBI API key (falls back to ``NCBI_API_KEY``) for higher
        rate limits.
    db:
        Entrez database (default ``"nuccore"``; use ``"protein"`` for
        protein accessions).
    record, include_translations:
        Passed through to :func:`dash_seqviz.parse`.

    Returns
    -------
    dict
        ``{"seq", "name", "annotations", "translations"}``.
    """
    from Bio import Entrez  # lazy import; only needed for network fetches

    resolved_email = email or os.environ.get("NCBI_EMAIL")
    if not resolved_email:
        raise ValueError(
            "NCBI requires a contact email. Pass email='you@example.com' or "
            "set the NCBI_EMAIL environment variable."
        )
    Entrez.email = resolved_email

    resolved_key = api_key or os.environ.get("NCBI_API_KEY")
    if resolved_key:
        Entrez.api_key = resolved_key

    handle = Entrez.efetch(db=db, id=str(accession), rettype="gb", retmode="text")
    try:
        text = handle.read()
    finally:
        handle.close()

    if isinstance(text, bytes):
        text = text.decode("utf-8", "replace")
    if not text.strip():
        raise ValueError(
            f"NCBI returned no data for accession {accession!r} in db {db!r}."
        )

    return parse(
        io.StringIO(text),
        fmt="genbank",
        record=record,
        include_translations=include_translations,
    )
