"""Build a color legend for a set of SeqViz annotations.

`legend()` returns a Dash layout component (an ``html.Div`` of swatch + name
rows) whose swatch colors match what the viewer renders for the same
annotations and theme. Drop it next to a ``SeqViz`` in your layout::

    from dash_seqviz import SeqViz, legend

    anns = [{"start": 0, "end": 20, "name": "promoter", "direction": 1}]
    html.Div([SeqViz(id="v", seq=seq, annotations=anns, theme="okabe-ito-light"),
              legend(anns, theme="okabe-ito-light")])

To link the legend to clicks, pair it with the viewer's read-only
``clicked_element`` prop in a callback.
"""

from __future__ import annotations

from typing import Any, Dict, List, Optional

from dash import html

from .palettes import resolve_colors


def legend(
    annotations: List[Dict[str, Any]],
    *,
    theme: Optional[str] = None,
    colors: Optional[List[str]] = None,
    title: Optional[str] = None,
    direction: str = "vertical",
    swatch_size: int = 14,
    id: Optional[str] = None,
) -> html.Div:
    """Return an ``html.Div`` legend of swatch + name rows.

    Parameters
    ----------
    annotations:
        The same annotation dicts passed to ``SeqViz``.
    theme, colors:
        Match the viewer's ``theme`` / ``colors`` so swatch colors line up.
    title:
        Optional heading above the entries.
    direction:
        ``"vertical"`` (default) or ``"horizontal"`` layout.
    swatch_size:
        Swatch edge length in pixels.
    id:
        Optional id for the container (for callbacks/styling).
    """
    resolved = resolve_colors(annotations or [], theme=theme, colors=colors)
    horizontal = direction == "horizontal"

    rows = []
    for ann, color in zip(annotations or [], resolved):
        swatch = html.Span(
            style={
                "display": "inline-block",
                "width": swatch_size,
                "height": swatch_size,
                "backgroundColor": color,
                "borderRadius": 3,
                "flex": "0 0 auto",
            }
        )
        label = html.Span(ann.get("name", "") if isinstance(ann, dict) else "")
        rows.append(
            html.Div(
                [swatch, label],
                className="dash-seqviz-legend-item",
                style={"display": "flex", "alignItems": "center", "gap": 6},
            )
        )

    children = []
    if title:
        children.append(
            html.Div(title, className="dash-seqviz-legend-title",
                     style={"fontWeight": 600, "marginBottom": 4})
        )
    children.extend(rows)

    container_style = {
        "display": "flex",
        "flexDirection": "row" if horizontal else "column",
        "flexWrap": "wrap" if horizontal else "nowrap",
        "gap": 12 if horizontal else 4,
        "alignItems": "center" if horizontal else "flex-start",
    }
    return html.Div(children, id=id, className="dash-seqviz-legend", style=container_style) \
        if id is not None else \
        html.Div(children, className="dash-seqviz-legend", style=container_style)
