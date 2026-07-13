"""Build a color legend for a set of SeqViz annotations.

``legend()`` returns a Dash layout component (an ``html.Div`` of swatch + name
rows) whose swatch colors match what the viewer renders for the same
annotations and theme. Drop it next to a ``SeqViz`` in your layout::

    from dash_seqviz import SeqViz, legend

    anns = [{"start": 0, "end": 20, "name": "promoter", "direction": 1}]
    html.Div([SeqViz(id="v", seq=seq, annotations=anns, theme="okabe-ito-light"),
              legend(anns, theme="okabe-ito-light")])

The viewer color-codes more than one kind of element (annotations, primers,
translations, highlights), so the legend can be **faceted**: pass a mapping of
section label to items instead of a flat list, and each section is rendered
with its own heading::

    legend({
        "Annotations": anns,
        "Primers": primers,
        "Translations": translations,
    }, theme="okabe-ito-light")

To link the legend to clicks, pair it with the viewer's read-only
``clicked_element`` prop in a callback.
"""

from __future__ import annotations

from typing import Any, Dict, List, Mapping, Optional, Union

from dash import html

from .palettes import resolve_colors

Annotations = List[Dict[str, Any]]
# Either a flat list of items, or a mapping of facet label -> items.
LegendInput = Union[Annotations, Mapping[str, Annotations]]


def legend(
    annotations: LegendInput,
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
        Either the flat list of annotation dicts passed to ``SeqViz``, or a
        mapping of section label to items (e.g. ``{"Annotations": [...],
        "Primers": [...]}``) to render a faceted legend with one titled
        section per key.
    theme, colors:
        Match the viewer's ``theme`` / ``colors`` so swatch colors line up.
    title:
        Optional heading above the entries (an umbrella title over any facets).
    direction:
        ``"vertical"`` (default) or ``"horizontal"`` layout. Applies to facets
        and to the items within each facet.
    swatch_size:
        Swatch edge length in pixels.
    id:
        Optional id for the container (for callbacks/styling).
    """
    horizontal = direction == "horizontal"

    def _rows(items: Annotations) -> List[html.Div]:
        resolved = resolve_colors(items or [], theme=theme, colors=colors)
        rows = []
        for ann, color in zip(items or [], resolved):
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
        return rows

    def _items_container(items: Annotations) -> html.Div:
        return html.Div(
            _rows(items),
            className="dash-seqviz-legend-items",
            style={
                "display": "flex",
                "flexDirection": "row" if horizontal else "column",
                "flexWrap": "wrap" if horizontal else "nowrap",
                "gap": 12 if horizontal else 4,
                "alignItems": "center" if horizontal else "flex-start",
            },
        )

    children: List[Any] = []
    if title:
        children.append(
            html.Div(
                title,
                className="dash-seqviz-legend-title",
                style={"fontWeight": 600, "marginBottom": 4},
            )
        )

    if isinstance(annotations, Mapping):
        # Faceted: one titled section per key (preserving insertion order).
        for facet_label, items in annotations.items():
            children.append(
                html.Div(
                    [
                        html.Div(
                            facet_label,
                            className="dash-seqviz-legend-facet-title",
                            style={
                                "fontWeight": 600,
                                "fontSize": "0.75em",
                                "textTransform": "uppercase",
                                "letterSpacing": "0.04em",
                                "opacity": 0.7,
                                "marginBottom": 3,
                            },
                        ),
                        _items_container(items),
                    ],
                    className="dash-seqviz-legend-facet",
                    style={"marginRight": 20} if horizontal else {"marginBottom": 8},
                )
            )
    else:
        children.extend(_rows(annotations))

    container_style = {
        "display": "flex",
        "flexDirection": "row" if horizontal else "column",
        "flexWrap": "wrap" if horizontal else "nowrap",
        "gap": 12 if horizontal else 4,
        "alignItems": "center" if horizontal else "flex-start",
    }
    kwargs: Dict[str, Any] = {
        "className": "dash-seqviz-legend",
        "style": container_style,
    }
    if id is not None:
        kwargs["id"] = id
    return html.Div(children, **kwargs)
