"""Parse sequence files into SeqViz props.

seqviz deprecated its in-browser ``file`` / ``accession`` props, so the
recommended path is to parse records in Python and spread the result into
the component::

    from dash_seqviz import SeqViz, parse

    props = parse("plasmid.gb")
    SeqViz(id="viewer", **props)

Parsing uses Biopython (already a project dependency). FASTA yields ``seq``
and ``name``; GenBank additionally yields ``annotations`` and, for CDS
features, ``translations``.
"""

from __future__ import annotations

import io
from pathlib import Path
from typing import IO, Any, Dict, List, Optional, Union

Source = Union[str, Path, IO[str]]

_FASTA_EXT = {".fa", ".fasta", ".fna", ".ffn", ".faa", ".frn", ".fas", ".mpfa"}
_GENBANK_EXT = {".gb", ".gbk", ".genbank", ".gbff"}

# Feature types that span the whole record or carry no useful label; never
# emitted as annotations.
_SKIP_FEATURE_TYPES = {"source"}

# Qualifier keys checked, in order, when naming an annotation.
_NAME_QUALIFIERS = ("label", "gene", "product", "note", "standard_name")


def parse(
    source: Source,
    fmt: Optional[str] = None,
    *,
    record: int = 0,
    include_translations: bool = True,
) -> Dict[str, Any]:
    """Parse a FASTA or GenBank source into a SeqViz props dict.

    Parameters
    ----------
    source:
        A path to a file, an open text handle, or a raw string containing
        FASTA/GenBank text.
    fmt:
        ``"fasta"`` or ``"genbank"``. When ``None`` (default) the format is
        detected from the file extension, then by sniffing the content.
    record:
        Zero-based index of the record to use in a multi-record file
        (default the first).
    include_translations:
        When ``True`` (default), GenBank CDS features also populate the
        ``translations`` key.

    Returns
    -------
    dict
        ``{"seq", "name", "annotations", "translations"}``. ``annotations``
        and ``translations`` are empty lists for FASTA input. Spread it
        straight into ``SeqViz(**props)``.
    """
    from Bio import SeqIO  # imported lazily so importing dash_seqviz stays cheap

    text = _read_text(source)
    resolved = (fmt or _detect_format(source, text) or "").lower()
    if resolved not in ("fasta", "genbank"):
        raise ValueError(
            "Could not determine sequence format; pass fmt='fasta' or "
            "fmt='genbank' explicitly."
        )

    records = list(SeqIO.parse(io.StringIO(text), resolved))
    if not records:
        raise ValueError("No sequence records found in the source.")
    if record < 0 or record >= len(records):
        raise IndexError(
            f"record index {record} out of range (found {len(records)} records)."
        )
    rec = records[record]

    seq = str(rec.seq).upper()
    name = rec.name or rec.id or ""
    if name in ("", "<unknown name>", "<unknown id>"):
        name = getattr(rec, "description", "") or ""

    annotations: List[Dict[str, Any]] = []
    translations: List[Dict[str, Any]] = []
    seq_len = len(seq)

    for feat in getattr(rec, "features", []) or []:
        ftype = getattr(feat, "type", "") or ""
        if ftype in _SKIP_FEATURE_TYPES:
            continue
        span = _feature_span(feat, seq_len)
        if span is None:
            continue
        start, end, direction = span
        ann = {
            "start": start,
            "end": end,
            "name": _feature_name(feat, ftype),
            "direction": direction,
        }
        annotations.append(ann)
        if include_translations and ftype == "CDS":
            translations.append(
                {
                    "start": start,
                    "end": end,
                    "direction": direction,
                    "name": ann["name"],
                }
            )

    annotations.sort(key=lambda a: (a["start"], a["end"]))
    translations.sort(key=lambda t: (t["start"], t["end"]))

    return {
        "seq": seq,
        "name": name,
        "annotations": annotations,
        "translations": translations,
    }


def _read_text(source: Source) -> str:
    """Return the text content of a path, handle, or raw string."""
    if hasattr(source, "read"):  # file-like
        return source.read()
    if isinstance(source, (str, Path)):
        p = Path(source)
        # Guard against passing raw content that is too long to be a path.
        try:
            is_file = p.is_file()
        except OSError:
            is_file = False
        if is_file:
            return p.read_text()
        if isinstance(source, str) and _looks_like_sequence_text(source):
            return source
        raise FileNotFoundError(f"No such file, and not recognizable sequence text: {source!r}")
    raise TypeError(f"Unsupported source type: {type(source).__name__}")


def _looks_like_sequence_text(text: str) -> bool:
    stripped = text.lstrip()
    return stripped.startswith(">") or stripped.startswith("LOCUS")


def _detect_format(source: Source, text: str) -> Optional[str]:
    """Detect format from extension first, then by sniffing content."""
    if isinstance(source, (str, Path)):
        ext = Path(source).suffix.lower()
        if ext in _FASTA_EXT:
            return "fasta"
        if ext in _GENBANK_EXT:
            return "genbank"
    stripped = text.lstrip()
    if stripped.startswith(">"):
        return "fasta"
    if stripped.startswith("LOCUS"):
        return "genbank"
    return None


def _feature_span(feat: Any, seq_len: int):
    """Return (start, end, direction) for a feature, or None if unusable."""
    loc = getattr(feat, "location", None)
    if loc is None:
        return None
    try:
        start = int(loc.start)
        end = int(loc.end)
    except (TypeError, ValueError):
        return None
    if end < start:
        start, end = end, start
    strand = getattr(loc, "strand", 1)
    direction = -1 if strand == -1 else 1
    return start, end, direction


def _feature_name(feat: Any, ftype: str) -> str:
    quals = getattr(feat, "qualifiers", {}) or {}
    for key in _NAME_QUALIFIERS:
        vals = quals.get(key)
        if vals:
            val = vals[0] if isinstance(vals, (list, tuple)) else vals
            if val:
                return str(val)
    return ftype or "feature"
