"""Typed shapes and optional validation for SeqViz inputs.

These ``TypedDict``s give editors autocomplete and type-checkers something to
check against when you build annotation/primer/translation lists::

    from dash_seqviz import Annotation

    anns: list[Annotation] = [
        {"start": 0, "end": 22, "name": "promoter", "direction": 1},
    ]

They are documentation/tooling aids, not runtime enforcement — Dash still
accepts plain dicts. For runtime checks (before a silent mis-render in the
browser), call :func:`validate_props`.
"""

from __future__ import annotations

from typing import Any, Dict, List, Optional

from typing_extensions import NotRequired, Required, TypedDict


class Annotation(TypedDict, total=False):
    start: Required[int]
    end: Required[int]
    name: Required[str]
    direction: NotRequired[int]
    color: NotRequired[str]


class Primer(TypedDict, total=False):
    start: Required[int]
    end: Required[int]
    name: Required[str]
    direction: Required[int]
    color: NotRequired[str]


class Highlight(TypedDict, total=False):
    start: Required[int]
    end: Required[int]
    color: NotRequired[str]


class Translation(TypedDict, total=False):
    start: Required[int]
    end: Required[int]
    direction: Required[int]
    name: NotRequired[str]
    color: NotRequired[str]


class Enzyme(TypedDict, total=False):
    name: Required[str]
    rseq: Required[str]
    fcut: Required[int]
    rcut: Required[int]
    color: NotRequired[str]
    range: NotRequired[Dict[str, int]]


# Which keys are required for each element list accepted by validate_props.
_REQUIRED = {
    "annotations": ("start", "end", "name"),
    "primers": ("start", "end", "name", "direction"),
    "highlights": ("start", "end"),
    "translations": ("start", "end", "direction"),
}


def validate_props(
    *,
    annotations: Optional[List[Dict[str, Any]]] = None,
    primers: Optional[List[Dict[str, Any]]] = None,
    highlights: Optional[List[Dict[str, Any]]] = None,
    translations: Optional[List[Dict[str, Any]]] = None,
) -> None:
    """Validate SeqViz element lists, raising ``ValueError`` on the first problem.

    Checks required keys are present, ``start``/``end`` are ints with
    ``start <= end``, and ``direction`` (when present) is one of -1, 0, 1.
    Silent about extra keys. Raises with the list name and index so the
    offending element is easy to find.
    """
    for kind, items in (
        ("annotations", annotations),
        ("primers", primers),
        ("highlights", highlights),
        ("translations", translations),
    ):
        if items is None:
            continue
        if not isinstance(items, (list, tuple)):
            raise ValueError(f"{kind} must be a list, got {type(items).__name__}.")
        required = _REQUIRED[kind]
        for i, el in enumerate(items):
            where = f"{kind}[{i}]"
            if not isinstance(el, dict):
                raise ValueError(f"{where} must be a dict, got {type(el).__name__}.")
            missing = [k for k in required if k not in el]
            if missing:
                raise ValueError(f"{where} is missing required key(s): {', '.join(missing)}.")
            for key in ("start", "end"):
                if key in el and not isinstance(el[key], int):
                    raise ValueError(f"{where}.{key} must be an int, got {type(el[key]).__name__}.")
            if "start" in el and "end" in el and el["start"] > el["end"]:
                raise ValueError(f"{where}: start ({el['start']}) must be <= end ({el['end']}).")
            if "direction" in el and el["direction"] not in (-1, 0, 1):
                raise ValueError(f"{where}.direction must be -1, 0, or 1, got {el['direction']!r}.")
