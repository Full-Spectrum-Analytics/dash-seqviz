"""Log SeqViz visualizations to MLflow and compare variants in the UI.

The idea
--------
SeqViz is a browser component, so it can't be "pickled" into MLflow like a
model. But the ``seqviz`` npm package ships a plain-JS ``Viewer`` (the same
one the Dash wrapper uses under the hood), served as a UMD bundle from
unpkg. That lets us render a **self-contained HTML file** for any sequence +
annotation configuration, with no build step.

MLflow renders ``.html`` artifacts inline in its UI (the same mechanism that
makes Plotly figures interactive), so a logged ``seqviz.html`` shows the
*actual, interactive* viewer inside the run's Artifacts tab.

Two complementary MLflow surfaces are used:

* **Runs + artifacts (primary).** Each variant is one run. Structured
  ``params``/``metrics``/``tags`` make variants sortable, filterable and
  diffable in the "Compare" view; the ``seqviz.html`` artifact is the
  visual. Variants of the same underlying sequence share a
  ``seq_sha256`` tag so they group cleanly.
* **Tracing (secondary).** Each render is wrapped in an MLflow span, so the
  render operation and its config/output metadata show up in the Traces
  tab for lineage. (A trace captures inputs/outputs as JSON — it does *not*
  render the interactive widget; that's what the HTML artifact is for.)

This module reproduces the Dash component's ``theme`` support (dark mode,
the CVD-safe palettes, and the xkcd easter egg) by inlining
``dash_seqviz/dash_seqviz.css`` and mirroring the palette-injection logic,
so the MLflow artifact looks exactly like the Dash component would.

Run ``python seqviz_mlflow.py`` to log a demo comparison set, then launch
the UI (see examples/mlflow/README.md).
"""
from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
from typing import Any, Dict, List, Optional

import mlflow

# --- seqviz UMD bundle (same package the Dash wrapper depends on) ----------
# Pinned to match package.json's `seqviz` dependency. `render()` mounts into
# the target div; options are the same camelCase keys as the React props.
SEQVIZ_CDN = "https://unpkg.com/seqviz@3.10.20/dist/seqviz.min.js"

# --- theme support, mirrored from src/lib/fragments/SeqViz.react.js --------
# CVD-safe qualitative palettes. When a colorblind theme is active and an
# element has no explicit `color`, it gets one from the palette by index —
# exactly what the Dash wrapper's applyPalette() does in JS.
PALETTES: Dict[str, List[str]] = {
    "okabe-ito-light": ["#E69F00", "#56B4E9", "#009E73", "#F0E442", "#0072B2", "#D55E00", "#CC79A7"],
    "okabe-ito-dark":  ["#E69F00", "#56B4E9", "#009E73", "#F0E442", "#0072B2", "#D55E00", "#CC79A7"],
    "colorbrewer-light": ["#66c2a5", "#fc8d62", "#8da0cb", "#e78ac3", "#a6d854", "#ffd92f", "#e5c494", "#b3b3b3"],
    "colorbrewer-dark":  ["#1b9e77", "#d95f02", "#7570b3", "#e7298a", "#66a61e", "#e6ab02", "#a6761d", "#666666"],
    "tol-light": ["#4477AA", "#EE6677", "#228833", "#CCBB44", "#66CCEE", "#AA3377", "#BBBBBB"],
    "tol-dark":  ["#4477AA", "#EE6677", "#228833", "#CCBB44", "#66CCEE", "#AA3377", "#BBBBBB"],
}

VALID_THEMES = {
    "light", "dark", "xkcd", "xkcd-light", "xkcd-dark",
    *PALETTES.keys(),
}

# Hidden SVG filter that gives the xkcd themes their hand-drawn wobble
# (matches the one the Dash wrapper injects).
_XKCD_WOBBLE_SVG = (
    '<svg aria-hidden="true" width="0" height="0" style="position:absolute">'
    '<defs><filter id="dash-seqviz-xkcd-wobble">'
    '<feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" seed="1"/>'
    '<feDisplacementMap in="SourceGraphic" scale="2"/>'
    "</filter></defs></svg>"
)

# Colored elements that a palette theme should recolor when unset.
_PALETTE_TARGETS = ("annotations", "primers", "highlights", "translations")

_REPO_ROOT = Path(__file__).resolve().parents[2]
_CSS_PATH = _REPO_ROOT / "dash_seqviz" / "dash_seqviz.css"


def _theme_css() -> str:
    """Inline the component's theme stylesheet so artifacts are self-contained."""
    try:
        return _CSS_PATH.read_text(encoding="utf-8")
    except OSError:
        return ""  # themes silently no-op if the stylesheet can't be found


def _theme_background(theme: str) -> str:
    """Body background for a theme (dark themes get the Mantine dark shade)."""
    if theme == "xkcd-dark":
        return "#1a1b1e"
    if theme.endswith("dark"):
        return "#1a1b1e"
    return "#ffffff"


def _normalize_theme(theme: Optional[str]) -> str:
    theme = theme or "light"
    if theme not in VALID_THEMES:
        theme = "light"
    # Bare "xkcd" is the historical alias for the light variant.
    return "xkcd-light" if theme == "xkcd" else theme


def _apply_palette(elements: Optional[List[Dict[str, Any]]], palette: Optional[List[str]]):
    """Assign a palette color by index to elements that lack one (user colors win)."""
    if not elements or not palette:
        return elements
    out = []
    for i, el in enumerate(elements):
        if el.get("color"):
            out.append(el)
        else:
            out.append({**el, "color": palette[i % len(palette)]})
    return out


def _viewer_options(config: Dict[str, Any], theme: str) -> Dict[str, Any]:
    """Translate a config dict into camelCase options for seqviz.Viewer()."""
    palette = PALETTES.get(theme)
    height = config.get("height", "480px")
    opts: Dict[str, Any] = {
        "name": config.get("name", ""),
        "seq": config["seq"],
        "viewer": config.get("viewer", "both"),
        "style": {"height": height, "width": "100%"},
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


# --- quantitative features (become MLflow metrics -> plottable in Compare) --
def sequence_features(seq: str, annotations: Optional[List[Dict[str, Any]]] = None) -> Dict[str, float]:
    """Derive numeric features so runs get comparable metric axes."""
    seq = (seq or "").upper()
    n = len(seq)
    gc = sum(seq.count(b) for b in ("G", "C"))
    annotations = annotations or []

    # Coverage = fraction of positions covered by >=1 annotation (union).
    covered = set()
    total_ann_len = 0
    for a in annotations:
        start, end = int(a.get("start", 0)), int(a.get("end", 0))
        span = range(start, end) if end >= start else range(start, n)  # allow wrap-ish
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


def _ensure_experiment(name: str, artifact_location: Optional[str] = None) -> None:
    """Select the experiment, creating it (with an artifact root) if needed."""
    if mlflow.get_experiment_by_name(name) is None:
        mlflow.create_experiment(name, artifact_location=artifact_location)
    mlflow.set_experiment(name)


def log_seqviz_run(
    config: Dict[str, Any],
    *,
    experiment_name: str = "seqviz",
    run_name: Optional[str] = None,
    trace: bool = True,
    artifact_location: Optional[str] = None,
) -> str:
    """Log one SeqViz variant as an MLflow run. Returns the run_id.

    Logs structured params/metrics/tags for comparison plus a ``seqviz.html``
    artifact that renders the interactive viewer inline in the MLflow UI.
    """
    seq = config["seq"]
    theme = _normalize_theme(config.get("theme"))
    annotations = config.get("annotations") or []
    ann_names = [a.get("name", "") for a in annotations]

    _ensure_experiment(experiment_name, artifact_location)
    with mlflow.start_run(run_name=run_name) as run:
        mlflow.log_params({
            "name": config.get("name", ""),
            "viewer": config.get("viewer", "both"),
            "theme": theme,
            "n_annotations": len(annotations),
            "annotation_names": ", ".join(ann_names) if ann_names else "(none)",
        })
        mlflow.set_tags({
            "kind": "seqviz",
            "seq_name": config.get("name", ""),
            "seq_sha256": _seq_sha(seq)[:12],  # groups same-sequence variants
        })
        mlflow.log_metrics(sequence_features(seq, annotations))

        # The interactive visual. log_text writes a UTF-8 artifact; the .html
        # suffix triggers MLflow's inline HTML renderer.
        html = _render_traced(config) if trace else build_seqviz_html(config)
        mlflow.log_text(html, "seqviz.html")

        # Machine-readable config alongside the visual, for reproducibility.
        mlflow.log_dict(
            {k: v for k, v in config.items()},
            "config.json",
        )
        return run.info.run_id


def _render_traced(config: Dict[str, Any]) -> str:
    """Build the HTML inside an MLflow span so the render shows in Traces."""
    if not hasattr(mlflow, "start_span"):
        return build_seqviz_html(config)
    with mlflow.start_span(name="render_seqviz") as span:
        theme = _normalize_theme(config.get("theme"))
        annotations = config.get("annotations") or []
        # Inputs: summarize (avoid dumping a long raw sequence into the span).
        span.set_inputs({
            "name": config.get("name", ""),
            "viewer": config.get("viewer", "both"),
            "theme": theme,
            "seq_len": len(config.get("seq", "")),
            "annotation_names": [a.get("name", "") for a in annotations],
        })
        html = build_seqviz_html(config)
        span.set_outputs({
            "artifact": "seqviz.html",
            "html_bytes": len(html),
            **sequence_features(config.get("seq", ""), annotations),
        })
        return html


def log_variants(
    name: str,
    seq: str,
    variants: List[Dict[str, Any]],
    *,
    experiment_name: str = "seqviz",
    base: Optional[Dict[str, Any]] = None,
    artifact_location: Optional[str] = None,
) -> List[str]:
    """Log several variants of the *same* sequence as comparable runs.

    Each entry in ``variants`` is a partial config (e.g. different
    ``annotations``/``theme``/``viewer``) merged over ``base``. All runs
    share a ``seq_sha256`` tag, so they group in the runs table and diff
    cleanly in the Compare view.
    """
    base = base or {}
    run_ids = []
    for v in variants:
        cfg = {"name": name, "seq": seq, **base, **v}
        run_ids.append(
            log_seqviz_run(
                cfg,
                experiment_name=experiment_name,
                run_name=v.get("run_name"),
                artifact_location=artifact_location,
            )
        )
    return run_ids


# --- demo -------------------------------------------------------------------
def _demo_variants() -> List[Dict[str, Any]]:
    """Same sequence, different annotation sets / themes — the comparison set."""
    promoter = {"start": 5, "end": 90, "name": "Strong promoter", "direction": 1}
    rbs = {"start": 110, "end": 200, "name": "RBS", "direction": 1}
    cds = {"start": 210, "end": 480, "name": "GFP CDS", "direction": 1}
    terminator = {"start": 500, "end": 560, "name": "Terminator", "direction": -1}
    return [
        {"run_name": "bare", "annotations": [], "theme": "light"},
        {"run_name": "promoter+rbs", "annotations": [promoter, rbs], "theme": "light"},
        {"run_name": "full-construct", "annotations": [promoter, rbs, cds, terminator], "theme": "light"},
        {"run_name": "full-dark", "annotations": [promoter, rbs, cds, terminator], "theme": "dark"},
        {"run_name": "full-okabe-ito", "annotations": [promoter, rbs, cds, terminator], "theme": "okabe-ito-light"},
        {"run_name": "full-colorbrewer-dark", "annotations": [promoter, rbs, cds, terminator], "theme": "colorbrewer-dark"},
    ]


def main() -> None:
    parser = argparse.ArgumentParser(description="Log a SeqViz comparison set to MLflow.")
    parser.add_argument("--tracking-uri", default="sqlite:///mlflow.db",
                        help="MLflow tracking URI (default: sqlite:///mlflow.db). "
                             "MLflow 3 requires a database backend.")
    parser.add_argument("--artifact-location", default=None,
                        help="Artifact root for new experiments (e.g. ./mlartifacts). "
                             "Defaults to MLflow's built-in location.")
    parser.add_argument("--experiment", default="seqviz-annotations",
                        help="Experiment name.")
    args = parser.parse_args()

    mlflow.set_tracking_uri(args.tracking_uri)

    # A demo sequence (repeated motif keeps it readable in the viewer).
    seq = "ATGCGTACGT" * 60  # 600 bp

    run_ids = log_variants(
        name="pDemo-GFP",
        seq=seq,
        variants=_demo_variants(),
        experiment_name=args.experiment,
        base={"viewer": "both"},
        artifact_location=args.artifact_location,
    )

    print(f"Logged {len(run_ids)} runs to experiment '{args.experiment}'")
    print(f"Tracking URI: {args.tracking_uri}")
    print("Launch the UI with:")
    print(f"  mlflow ui --backend-store-uri {args.tracking_uri}")
    print("Then: open the experiment, select the runs, and click 'Compare';")
    print("open any run's Artifacts tab to see seqviz.html render inline.")


if __name__ == "__main__":
    main()
