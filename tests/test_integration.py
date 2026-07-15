"""Browser integration tests for the SeqViz component (dash.testing).

These drive a real browser via the `dash_duo` fixture. They are skipped
automatically when selenium can't start a browser (e.g. no Chrome/driver in
the environment), so the rest of the suite still runs in CI without a
browser. Run locally with:

    pytest tests/test_integration.py --headless
"""

import re

import pytest
from dash import Dash, Input, Output, html
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait

from dash_seqviz import SeqViz

SEQ = "ATGCGTACGT" * 30
ANNS = [
    {"start": 5, "end": 90, "name": "promoter", "direction": 1, "color": "#3b82f6"},
    {"start": 110, "end": 160, "name": "RBS", "direction": 1, "color": "#10b981"},
]


def _app(**kwargs):
    app = Dash(__name__)
    app.layout = html.Div(
        [
            SeqViz(id="v", seq=SEQ, name="pDemo", annotations=ANNS,
                   style={"height": "420px", "width": "900px"}, **kwargs),
            html.Div(id="clicked", children="none"),
        ]
    )

    @app.callback(Output("clicked", "children"), Input("v", "clicked_element"))
    def _show(el):
        return el["name"] if el else "none"

    return app


def test_renders_circular(dash_duo):
    dash_duo.start_server(_app(viewer="circular"))
    dash_duo.wait_for_element(".la-vz-viewer-circular", timeout=15)
    assert dash_duo.find_element("#v").get_attribute("data-dash-seqviz-theme") == "light"


def test_dark_theme_applies(dash_duo):
    dash_duo.start_server(_app(viewer="circular", theme="dark"))
    dash_duo.wait_for_element(".la-vz-seqviz", timeout=15)
    assert dash_duo.find_element("#v").get_attribute("data-dash-seqviz-theme") == "dark"


def test_annotations_render(dash_duo):
    dash_duo.start_server(_app(viewer="circular"))
    dash_duo.wait_for_element(".la-vz-annotation", timeout=15)
    anns = dash_duo.find_elements(".la-vz-annotation")
    assert len(anns) == 2


# --- built-in interactive legend ------------------------------------------

def _legend_app(legend=True, **kwargs):
    app = Dash(__name__)
    app.layout = html.Div(
        [
            SeqViz(id="v", seq=SEQ, name="pDemo", annotations=ANNS, viewer="linear",
                   legend=legend, style={"height": "420px", "width": "900px"}, **kwargs),
            html.Div(id="hidden", children="none"),
        ]
    )

    @app.callback(Output("hidden", "children"), Input("v", "hidden_elements"))
    def _show_hidden(hidden):
        return ",".join(hidden or []) or "none"

    return app


def test_legend_renders_one_item_per_element(dash_duo):
    dash_duo.start_server(_legend_app())
    dash_duo.wait_for_element(".dash-seqviz-legend", timeout=15)
    items = dash_duo.find_elements(".dash-seqviz-legend-item")
    assert len(items) == 2  # promoter, RBS


def test_legend_click_toggles_hidden_elements(dash_duo):
    dash_duo.start_server(_legend_app())
    dash_duo.wait_for_element(".dash-seqviz-legend-item", timeout=15)
    items = dash_duo.find_elements(".dash-seqviz-legend-item")
    items[0].click()  # single click hides the first item (promoter)
    dash_duo.wait_for_text_to_equal("#hidden", "annotations:promoter", timeout=10)
    items = dash_duo.find_elements(".dash-seqviz-legend-item")
    items[0].click()  # click again shows it
    dash_duo.wait_for_text_to_equal("#hidden", "none", timeout=10)


def test_uncolored_annotation_gets_palette_swatch(dash_duo):
    # Elements without an explicit color are seeded from the theme palette, so
    # the legend swatch is a real color (matching the viewer), not the gray
    # #888 fallback.
    app = Dash(__name__)
    app.layout = html.Div(
        [
            SeqViz(id="v", seq=SEQ, name="pDemo",
                   annotations=[{"start": 5, "end": 90, "name": "a"}],
                   viewer="linear", legend=True,
                   style={"height": "420px", "width": "900px"}),
        ]
    )
    dash_duo.start_server(app)
    sw = dash_duo.wait_for_element('.dash-seqviz-legend-item span[aria-hidden="true"]', timeout=15)
    nums = [int(n) for n in re.findall(r"\d+", sw.value_of_css_property("background-color"))[:3]]
    assert nums != [136, 136, 136], f"uncolored annotation got the gray fallback swatch: {nums}"


def test_font_override_applies_to_viewer(dash_duo):
    # The `font` prop (dmc-style ff/fw) overrides the viewer's text font via a
    # scoped !important rule, even though seqviz sets its font inline.
    app = Dash(__name__)
    app.layout = html.Div(
        [
            SeqViz(id="v", seq=SEQ, name="pDemo", annotations=ANNS, viewer="linear",
                   font={"ff": "Georgia, serif", "fw": 700},
                   style={"height": "420px", "width": "900px"}),
        ]
    )
    dash_duo.start_server(app)
    txt = dash_duo.wait_for_element(".la-vz-seqviz text", timeout=15)
    assert "Georgia" in txt.value_of_css_property("font-family")
    assert txt.value_of_css_property("font-weight") in ("700", "bold")


def test_user_color_overrides_theme_palette(dash_duo):
    # An explicit element color must win over the theme palette, even under a
    # colorblind-safe theme that would otherwise recolor it.
    app = Dash(__name__)
    app.layout = html.Div(
        [
            SeqViz(id="v", seq=SEQ, name="pDemo",
                   annotations=[{"start": 5, "end": 90, "name": "a", "color": "#123456"}],
                   viewer="linear", legend=True, theme="okabe-ito-dark",
                   style={"height": "420px", "width": "900px"}),
        ]
    )
    dash_duo.start_server(app)
    sw = dash_duo.wait_for_element('.dash-seqviz-legend-item span[aria-hidden="true"]', timeout=15)
    nums = [int(n) for n in re.findall(r"\d+", sw.value_of_css_property("background-color"))[:3]]
    assert nums == [18, 52, 86], f"user color #123456 not preserved under a palette theme: {nums}"


def test_legend_text_light_on_dark_theme(dash_duo):
    # On dark themes the legend must use light text; otherwise it inherits the
    # ambient dark color and blends into the dark viewer background.
    dash_duo.start_server(_legend_app(theme="dark"))
    legend = dash_duo.wait_for_element(".dash-seqviz-legend", timeout=15)
    nums = [int(n) for n in re.findall(r"\d+", legend.value_of_css_property("color"))[:3]]
    assert sum(nums) / 3 > 160, f"legend text not light on dark theme: {nums}"


@pytest.mark.parametrize("position", ["top", "right", "bottom", "left"])
def test_legend_positions_render(dash_duo, position):
    dash_duo.start_server(
        _legend_app(legend={"position": position, "withBorder": True, "size": "md"})
    )
    dash_duo.wait_for_element(".dash-seqviz-legend", timeout=15)
    dash_duo.wait_for_element(".la-vz-seqviz", timeout=15)
    assert len(dash_duo.find_elements(".dash-seqviz-legend-item")) == 2


# --- annotation hover tooltip ---------------------------------------------

def _tooltip_app(tooltip=True, annotations=None, **kwargs):
    app = Dash(__name__)
    app.layout = html.Div(
        [
            SeqViz(id="v", seq=SEQ, name="pDemo",
                   annotations=ANNS if annotations is None else annotations,
                   viewer="linear", tooltip=tooltip,
                   style={"height": "420px", "width": "900px"}, **kwargs),
        ]
    )
    return app


def _hover(dash_duo, selector):
    """Move the pointer over the first element matching `selector`."""
    el = dash_duo.wait_for_element(selector, timeout=15)
    ActionChains(dash_duo.driver).move_to_element(el).perform()
    return el


def _hover_named(dash_duo, name):
    """Hover the annotation label whose text is `name`."""
    dash_duo.wait_for_element(".la-vz-annotation-label", timeout=15)
    labels = dash_duo.find_elements(".la-vz-annotation-label")
    target = next(el for el in labels if el.text == name)
    ActionChains(dash_duo.driver).move_to_element(target).perform()
    return target


def _wait_tooltip(dash_duo):
    return WebDriverWait(dash_duo.driver, 10).until(
        EC.visibility_of_element_located((By.CSS_SELECTOR, ".dash-seqviz-tooltip"))
    )


def test_tooltip_shows_on_hover(dash_duo):
    dash_duo.start_server(_tooltip_app())
    _hover(dash_duo, ".la-vz-annotation")
    tip = _wait_tooltip(dash_duo)
    # Default hovertemplate: name on the first line, then start..end (length bp).
    assert "promoter" in tip.text
    assert "5..90" in tip.text


def test_tooltip_custom_template(dash_duo):
    dash_duo.start_server(
        _tooltip_app(tooltip={"hovertemplate": "%{name} | %{length} bp | %{direction}"})
    )
    _hover(dash_duo, ".la-vz-annotation")
    tip = _wait_tooltip(dash_duo)
    # promoter spans 5..90 (85 bp), forward strand.
    assert "85 bp" in tip.text
    assert "forward" in tip.text


def test_tooltip_absent_when_disabled(dash_duo):
    dash_duo.start_server(_tooltip_app(tooltip=False))
    _hover(dash_duo, ".la-vz-annotation")
    # The tooltip node still exists but must stay hidden.
    tips = dash_duo.find_elements(".dash-seqviz-tooltip")
    assert tips and all(not t.is_displayed() for t in tips)


def test_tooltip_customdata(dash_duo):
    # customdata is a top-level list parallel to annotations, referenced
    # positionally (Plotly-style) in the hovertemplate.
    anns = [{"start": 5, "end": 90, "name": "promoter", "direction": 1}]
    dash_duo.start_server(
        _tooltip_app(
            tooltip={"hovertemplate": "%{name} @ %{customdata[0]} / %{customdata[1]}"},
            annotations=anns,
            customdata=[["b0344", "lacZ"]],
        )
    )
    _hover(dash_duo, ".la-vz-annotation")
    tip = _wait_tooltip(dash_duo)
    assert "promoter @ b0344 / lacZ" in tip.text


def test_tooltip_customdata_index_aligns(dash_duo):
    # customdata[i] must resolve for annotations[i]: hovering "second" reads row 1.
    anns = [
        {"start": 5, "end": 90, "name": "first", "direction": 1},
        {"start": 110, "end": 160, "name": "second", "direction": 1},
    ]
    dash_duo.start_server(
        _tooltip_app(
            tooltip={"hovertemplate": "%{name}=%{customdata[0]}"},
            annotations=anns,
            customdata=[["A"], ["B"]],
        )
    )
    _hover_named(dash_duo, "second")
    tip = _wait_tooltip(dash_duo)
    assert "second=B" in tip.text


def test_tooltip_skips_blank_customdata_line(dash_duo):
    # A hovertemplate line that resolves to nothing (customdata not supplied)
    # is dropped rather than rendered as an empty row.
    anns = [{"start": 5, "end": 90, "name": "promoter", "direction": 1}]
    dash_duo.start_server(
        _tooltip_app(
            tooltip={"hovertemplate": "%{name}<br>%{customdata[0]}<br>%{start}..%{end}"},
            annotations=anns,  # no customdata prop
        )
    )
    _hover(dash_duo, ".la-vz-annotation")
    tip = _wait_tooltip(dash_duo)
    rows = tip.find_elements(By.CSS_SELECTOR, "div")
    assert len(rows) == 2  # name + coords; the empty customdata line is skipped
    assert "promoter" in tip.text and "5..90" in tip.text
