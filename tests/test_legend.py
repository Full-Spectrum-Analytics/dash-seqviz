"""Tests for dash_seqviz.legend() and the shared palette resolution."""

from dash import html

from dash_seqviz import legend
from dash_seqviz.palettes import (
    PALETTES,
    SEQVIZ_DEFAULT_COLORS,
    resolve_colors,
)

ANNS = [
    {"start": 0, "end": 10, "name": "promoter"},
    {"start": 20, "end": 30, "name": "RBS", "color": "#123456"},
    {"start": 40, "end": 50, "name": "CDS"},
]


def _swatch_colors(div):
    """Pull the backgroundColor from each legend item's swatch span."""
    out = []
    for item in div.children:
        if getattr(item, "className", "") == "dash-seqviz-legend-item":
            swatch = item.children[0]
            out.append(swatch.style["backgroundColor"])
    return out


# --- resolve_colors --------------------------------------------------------

def test_resolve_user_color_wins():
    cols = resolve_colors(ANNS)
    assert cols[1] == "#123456"  # explicit color preserved


def test_resolve_default_cycle():
    cols = resolve_colors(ANNS)
    assert cols[0] == SEQVIZ_DEFAULT_COLORS[0]
    assert cols[2] == SEQVIZ_DEFAULT_COLORS[2]


def test_resolve_theme_palette():
    cols = resolve_colors(ANNS, theme="okabe-ito-light")
    pal = PALETTES["okabe-ito-light"]
    assert cols[0] == pal[0]
    assert cols[1] == "#123456"      # user color still wins over palette
    assert cols[2] == pal[2]


def test_resolve_explicit_colors_override_theme():
    cols = resolve_colors(ANNS, theme="okabe-ito-light", colors=["#aaa", "#bbb", "#ccc"])
    assert cols[0] == "#aaa"
    assert cols[2] == "#ccc"


# --- legend() --------------------------------------------------------------

def test_legend_returns_div_with_one_item_per_annotation():
    lg = legend(ANNS)
    assert isinstance(lg, html.Div)
    items = [c for c in lg.children if getattr(c, "className", "") == "dash-seqviz-legend-item"]
    assert len(items) == 3


def test_legend_swatch_colors_match_resolution():
    lg = legend(ANNS, theme="okabe-ito-light")
    assert _swatch_colors(lg) == resolve_colors(ANNS, theme="okabe-ito-light")


def test_legend_title_rendered():
    lg = legend(ANNS, title="Features")
    titles = [c for c in lg.children if getattr(c, "className", "") == "dash-seqviz-legend-title"]
    assert titles and titles[0].children == "Features"


def test_legend_horizontal_direction():
    lg = legend(ANNS, direction="horizontal")
    assert lg.style["flexDirection"] == "row"


def test_legend_empty_annotations():
    lg = legend([])
    items = [c for c in lg.children if getattr(c, "className", "") == "dash-seqviz-legend-item"]
    assert items == []


def test_legend_id_passthrough():
    lg = legend(ANNS, id="my-legend")
    assert lg.id == "my-legend"


# --- legend() faceted (grouped input) --------------------------------------

PRIMERS = [{"start": 0, "end": 24, "name": "Fwd primer", "color": "#ef4444"}]
FACETS = {"Annotations": ANNS, "Primers": PRIMERS}


def _facets(div):
    return [c for c in div.children if getattr(c, "className", "") == "dash-seqviz-legend-facet"]


def _facet_item_count(facet):
    items_container = facet.children[1]  # [title, items]
    return len(
        [c for c in items_container.children
         if getattr(c, "className", "") == "dash-seqviz-legend-item"]
    )


def test_legend_faceted_one_section_per_key():
    facets = _facets(legend(FACETS))
    assert len(facets) == 2


def test_legend_faceted_titles_in_order():
    facets = _facets(legend(FACETS))
    titles = [f.children[0] for f in facets]
    assert [t.className for t in titles] == ["dash-seqviz-legend-facet-title"] * 2
    assert [t.children for t in titles] == ["Annotations", "Primers"]


def test_legend_faceted_items_per_section():
    facets = _facets(legend(FACETS))
    assert _facet_item_count(facets[0]) == 3
    assert _facet_item_count(facets[1]) == 1


def test_legend_faceted_umbrella_title():
    lg = legend(FACETS, title="Legend")
    assert lg.children[0].className == "dash-seqviz-legend-title"
    assert lg.children[0].children == "Legend"


def test_legend_faceted_swatch_colors_match_resolution():
    facets = _facets(legend(FACETS, theme="okabe-ito-light"))
    items = [c for c in facets[0].children[1].children
             if getattr(c, "className", "") == "dash-seqviz-legend-item"]
    swatches = [it.children[0].style["backgroundColor"] for it in items]
    assert swatches == resolve_colors(ANNS, theme="okabe-ito-light")


def test_legend_faceted_horizontal():
    lg = legend(FACETS, direction="horizontal")
    assert lg.style["flexDirection"] == "row"
