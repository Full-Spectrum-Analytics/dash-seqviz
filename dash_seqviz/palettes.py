"""Color palettes and color resolution shared across dash-seqviz helpers.

`resolve_colors` mirrors how the viewer assigns annotation colors: an
element's own ``color`` wins; otherwise a color is taken by index from the
active palette (a CVD-safe palette for the colorblind themes, else seqviz's
built-in default cycle). This lets a `legend()` show exactly the colors the
viewer renders.
"""

from __future__ import annotations

from typing import Any, Dict, List, Optional

# seqviz's built-in default annotation color cycle (COLORS in the seqviz
# source), used when no theme palette and no per-element color apply.
SEQVIZ_DEFAULT_COLORS: List[str] = [
    "#9DEAED", "#8FDE8C", "#CFF283", "#8CDEBD", "#F0A3CE", "#F7C672",
    "#F07F7F", "#FAA887", "#F099F7", "#C59CFF", "#6B81FF", "#85A6FF",
]

# CVD-safe qualitative palettes, matching src/lib/fragments/SeqViz.react.js
# and the theme names accepted by the component's `theme` prop.
PALETTES: Dict[str, List[str]] = {
    "okabe-ito-light": ["#E69F00", "#56B4E9", "#009E73", "#F0E442", "#0072B2", "#D55E00", "#CC79A7"],
    "okabe-ito-dark":  ["#E69F00", "#56B4E9", "#009E73", "#F0E442", "#0072B2", "#D55E00", "#CC79A7"],
    "colorbrewer-light": ["#66c2a5", "#fc8d62", "#8da0cb", "#e78ac3", "#a6d854", "#ffd92f", "#e5c494", "#b3b3b3"],
    "colorbrewer-dark":  ["#1b9e77", "#d95f02", "#7570b3", "#e7298a", "#66a61e", "#e6ab02", "#a6761d", "#666666"],
    "tol-light": ["#4477AA", "#EE6677", "#228833", "#CCBB44", "#66CCEE", "#AA3377", "#BBBBBB"],
    "tol-dark":  ["#4477AA", "#EE6677", "#228833", "#CCBB44", "#66CCEE", "#AA3377", "#BBBBBB"],
}


def palette_for(theme: Optional[str] = None, colors: Optional[List[str]] = None) -> List[str]:
    """Return the color cycle for a theme / explicit colors override."""
    if colors:
        return list(colors)
    if theme in PALETTES:
        return PALETTES[theme]
    return SEQVIZ_DEFAULT_COLORS


def resolve_colors(
    elements: List[Dict[str, Any]],
    *,
    theme: Optional[str] = None,
    colors: Optional[List[str]] = None,
) -> List[str]:
    """Return the rendered color for each element, matching the viewer.

    Per-element ``color`` wins; otherwise a color is cycled from the active
    palette by index (same rule seqviz uses).
    """
    palette = palette_for(theme, colors)
    out: List[str] = []
    for i, el in enumerate(elements or []):
        el_color = el.get("color") if isinstance(el, dict) else None
        out.append(el_color or palette[i % len(palette)])
    return out
