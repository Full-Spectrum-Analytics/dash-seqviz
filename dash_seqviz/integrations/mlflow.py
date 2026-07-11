"""Log SeqViz visualizations to MLflow and compare variants in the UI.

SeqViz is a browser component, so it can't be pickled into MLflow like a
model. But the ``seqviz`` npm package ships a plain-JS ``Viewer`` (the same
one the Dash wrapper uses), served as a UMD bundle from unpkg. That lets us
render a **self-contained HTML file** for any sequence + annotation config,
with no build step. MLflow renders ``.html`` artifacts inline (the mechanism
that makes Plotly figures interactive), so a logged ``seqviz.html`` shows the
actual interactive viewer in the run's Artifacts tab.

The API follows MLflow's fluent conventions: :func:`log_seqviz` logs into the
active run just like ``mlflow.log_figure`` / ``mlflow.log_text`` (payload
first, then ``artifact_file``), so it composes with your own run and
experiment management.

Usage::

    import mlflow
    from dash_seqviz.integrations import mlflow as mlflow_seqviz

    mlflow.set_experiment("plasmids")
    with mlflow.start_run():
        mlflow.log_params({"host": "E. coli"})
        mlflow_seqviz.log_seqviz({"name": "pUC19", "seq": seq, "annotations": [...]})

    # or log several variants of one sequence as comparable runs:
    mlflow_seqviz.log_variants(seq, [
        {"run_name": "v1", "annotations": [...]},
        {"run_name": "v2", "annotations": [...], "theme": "dark"},
    ], name="pUC19")

``mlflow`` is an *optional* dependency: install with
``pip install dash-seqviz[mlflow]`` (or add it to your conda env). The HTML
builder (:func:`build_seqviz_html`) and :func:`sequence_features` work
without mlflow; only the logging helpers require it.
"""

from __future__ import annotations

import hashlib
import json
from pathlib import Path
from typing import Any, Dict, List, Optional

# seqviz UMD bundle (same package the Dash wrapper depends on). Pinned to
# package.json's `seqviz` version; options are the camelCase React props.
SEQVIZ_CDN = "https://unpkg.com/seqviz@3.10.20/dist/seqviz.min.js"

# CVD-safe qualitative palettes, mirrored from
# src/lib/fragments/SeqViz.react.js so artifacts match the Dash component.
PALETTES: Dict[str, List[str]] = {
    "okabe-ito-light": ["#E69F00", "#56B4E9", "#009E73", "#F0E442", "#0072B2", "#D55E00", "#CC79A7"],
    "okabe-ito-dark":  ["#E69F00", "#56B4E9", "#009E73", "#F0E442", "#0072B2", "#D55E00", "#CC79A7"],
    "colorbrewer-light": ["#66c2a5", "#fc8d62", "#8da0cb", "#e78ac3", "#a6d854", "#ffd92f", "#e5c494", "#b3b3b3"],
    "colorbrewer-dark":  ["#1b9e77", "#d95f02", "#7570b3", "#e7298a", "#66a61e", "#e6ab02", "#a6761d", "#666666"],
    "tol-light": ["#4477AA", "#EE6677", "#228833", "#CCBB44", "#66CCEE", "#AA3377", "#BBBBBB"],
    "tol-dark":  ["#4477AA", "#EE6677", "#228833", "#CCBB44", "#66CCEE", "#AA3377", "#BBBBBB"],
}

VALID_THEMES = {"light", "dark", "xkcd", "xkcd-light", "xkcd-dark", *PALETTES.keys()}

_XKCD_WOBBLE_SVG = (
    '<svg aria-hidden="true" width="0" height="0" style="position:absolute">'
    '<defs><filter id="dash-seqviz-xkcd-wobble">'
    '<feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" seed="1"/>'
    '<feDisplacementMap in="SourceGraphic" scale="2"/>'
    "</filter></defs></svg>"
)

_PALETTE_TARGETS = ("annotations", "primers", "highlights", "translations")

# dash_seqviz.css lives one level up (dash_seqviz/dash_seqviz.css).
_CSS_PATH = Path(__file__).resolve().parents[1] / "dash_seqviz.css"


def _require_mlflow():
    """Import mlflow or raise a clear, actionable error."""
    try:
        import mlflow  # noqa: WPS433 (intentional lazy import)
        return mlflow
    except ImportError as exc:  # pragma: no cover - exercised only without mlflow
        raise ImportError(
            "The MLflow integration requires the optional 'mlflow' dependency. "
            "Install it with: pip install dash-seqviz[mlflow]  (or: conda install "
            "-c conda-forge mlflow)."
        ) from exc


def _theme_css() -> str:
    try:
        return _CSS_PATH.read_text(encoding="utf-8")
    except OSError:
        return ""  # themes silently no-op if the stylesheet can't be found


def _theme_background(theme: str) -> str:
    return "#1a1b1e" if theme.endswith("dark") else "#ffffff"


def _normalize_theme(theme: Optional[str]) -> str:
    theme = theme or "light"
    if theme not in VALID_THEMES:
        theme = "light"
    return "xkcd-light" if theme == "xkcd" else theme


def _apply_palette(elements, palette):
    """Assign a palette color by index to elements lacking one (user colors win)."""
    if not elements or not palette:
        return elements
    out = []
    for i, el in enumerate(elements):
        out.append(el if el.get("color") else {**el, "color": palette[i % len(palette)]})
    return out


def _viewer_options(config: Dict[str, Any], theme: str) -> Dict[str, Any]:
    palette = PALETTES.get(theme)
    opts: Dict[str, Any] = {
        "name": config.get("name", ""),
        "seq": config["seq"],
        "viewer": config.get("viewer", "both"),
        "style": {"height": config.get("height", "480px"), "width": "100%"},
    }
    for key in _PALETTE_TARGETS:
        if config.get(key):
            opts[key] = _apply_palette(config[key], palette)
    if config.get("enzymes"):
        opts["enzymes"] = config["enzymes"]
    if "showComplement" in config:
        opts["showComplement"] = config["showComplement"]
    if config.get("zoom"):
        opts["zoom"] = config["zoom"]
    return opts


def build_seqviz_html(config: Dict[str, Any]) -> str:
    """Return a self-contained HTML document rendering the SeqViz viewer.

    ``config`` accepts the same fields as the Dash component: ``seq`` (req),
    ``name``, ``viewer``, ``annotations``, ``primers``, ``highlights``,
    ``translations``, ``enzymes``, ``theme``, ``zoom``, ``showComplement``.
    Does not require mlflow.
    """
    theme = _normalize_theme(config.get("theme"))
    options_json = json.dumps(_viewer_options(config, theme))
    background = _theme_background(theme)
    wobble = _XKCD_WOBBLE_SVG if theme.startswith("xkcd") else ""
    css = _theme_css()

    # JS is concatenated (not interpolated) so seqviz's option braces never
    # collide with the f-string; only our own named fields are interpolated.
    boot = 'seqviz.Viewer("dash-seqviz-root", ' + options_json + ").render();"

    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>SeqViz - {config.get('name', 'sequence')}</title>
<style>
body {{ margin: 0; }}
{css}
</style>
</head>
<body style="background:{background};">
<div data-dash-seqviz-theme="{theme}">
{wobble}
<div id="dash-seqviz-root"></div>
</div>
<script src="{SEQVIZ_CDN}"></script>
<script>{boot}</script>
</body>
</html>
"""


def sequence_features(seq: str, annotations: Optional[List[Dict[str, Any]]] = None) -> Dict[str, float]:
    """Derive numeric features so runs get comparable metric axes.

    Does not require mlflow.
    """
    seq = (seq or "").upper()
    n = len(seq)
    gc = sum(seq.count(b) for b in ("G", "C"))
    annotations = annotations or []

    covered = set()
    total_ann_len = 0
    for a in annotations:
        start, end = int(a.get("start", 0)), int(a.get("end", 0))
        span = range(start, end) if end >= start else range(start, n)
        for p in span:
            if 0 <= p < n:
                covered.add(p)
        total_ann_len += (end - start) if end >= start else (n - start)

    return {
        "seq_len": float(n),
        "gc_content_pct": round(100 * gc / n, 3) if n else 0.0,
        "n_annotations": float(len(annotations)),
        "annotation_coverage_pct": round(100 * len(covered) / n, 3) if n else 0.0,
        "mean_annotation_len": round(total_ann_len / len(annotations), 2) if annotations else 0.0,
    }


def _seq_sha(seq: str) -> str:
    return hashlib.sha256((seq or "").upper().encode()).hexdigest()


def log_seqviz(
    config: Dict[str, Any],
    artifact_file: str = "seqviz.html",
    *,
    run_id: Optional[str] = None,
) -> None:
    """Log a SeqViz viewer as an HTML artifact to the active MLflow run.

    Mirrors :func:`mlflow.log_figure` / :func:`mlflow.log_text`: the viewer
    ``config`` comes first, then the ``artifact_file`` path. The artifact
    renders the interactive viewer inline in the run's Artifacts tab. Logs
    into the currently active run (or ``run_id``), creating a run if none is
    active -- exactly like MLflow's other ``log_*`` functions. Requires
    mlflow.

    Parameters
    ----------
    config:
        SeqViz config -- the same keys as the Dash component (``seq``
        required, plus ``name``, ``viewer``, ``annotations``, ``theme``, ...).
    artifact_file:
        Run-relative path for the artifact (default ``"seqviz.html"``).
    run_id:
        Run to log to. Defaults to the active run.

    Examples
    --------
    >>> import mlflow
    >>> from dash_seqviz.integrations import mlflow as mlflow_seqviz
    >>> with mlflow.start_run():
    ...     mlflow_seqviz.log_seqviz({"name": "pUC19", "seq": seq, "annotations": anns})
    """
    mlflow = _require_mlflow()
    mlflow.log_text(build_seqviz_html(config), artifact_file, run_id=run_id)


def log_variants(
    seq: str,
    variants: List[Dict[str, Any]],
    *,
    name: str = "",
    base: Optional[Dict[str, Any]] = None,
) -> List[str]:
    """Log variants of one sequence as separate runs for side-by-side compare.

    Each entry in ``variants`` is a partial config merged over ``base`` (e.g.
    a different ``annotations`` set, ``theme``, or ``viewer``). Every variant
    becomes its own run in the *current* experiment -- set it first with
    ``mlflow.set_experiment(...)`` -- carrying:

    * a shared ``seq_sha256`` tag, so variants of one sequence group together;
    * sequence-feature metrics (length, GC%, annotation coverage) for plotting;
    * the ``seqviz.html`` artifact (via :func:`log_seqviz`).

    Select the runs in the MLflow UI and click **Compare**. Returns the list
    of created run ids. Requires mlflow.

    A ``run_name`` key on a variant sets that run's name.
    """
    mlflow = _require_mlflow()
    base = base or {}
    run_ids: List[str] = []
    for v in variants:
        config = {"name": name, "seq": seq, **base, **v}
        annotations = config.get("annotations") or []
        ann_names = [a.get("name", "") for a in annotations]
        with mlflow.start_run(run_name=v.get("run_name")) as run:
            mlflow.log_params({
                "name": config.get("name", ""),
                "viewer": config.get("viewer", "both"),
                "theme": _normalize_theme(config.get("theme")),
                "n_annotations": len(annotations),
                "annotation_names": ", ".join(ann_names) if ann_names else "(none)",
            })
            mlflow.set_tags({
                "kind": "seqviz",
                "seq_name": config.get("name", ""),
                "seq_sha256": _seq_sha(seq)[:12],  # groups same-sequence variants
            })
            mlflow.log_metrics(sequence_features(seq, annotations))
            log_seqviz(config)
            mlflow.log_dict(dict(config), "config.json")
            run_ids.append(run.info.run_id)
    return run_ids
