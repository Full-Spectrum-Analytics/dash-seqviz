"""Browser integration tests for the SeqViz component (dash.testing).

These drive a real browser via the `dash_duo` fixture. They are skipped
automatically when selenium can't start a browser (e.g. no Chrome/driver in
the environment), so the rest of the suite still runs in CI without a
browser. Run locally with:

    pytest tests/test_integration.py --headless
"""

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


def _wait_tooltip(dash_duo):
    return WebDriverWait(dash_duo.driver, 10).until(
        EC.visibility_of_element_located((By.CSS_SELECTOR, ".dash-seqviz-tooltip"))
    )


def test_tooltip_shows_on_hover(dash_duo):
    dash_duo.start_server(_tooltip_app())
    _hover(dash_duo, ".la-vz-annotation")
    tip = _wait_tooltip(dash_duo)
    # Default template: name on the first line, then start..end (length bp).
    assert "promoter" in tip.text
    assert "5..90" in tip.text


def test_tooltip_custom_template(dash_duo):
    dash_duo.start_server(
        _tooltip_app(tooltip={"template": "%{name} | %{length} bp | %{direction}"})
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


def test_tooltip_customdata_dict(dash_duo):
    anns = [{"start": 5, "end": 90, "name": "promoter", "direction": 1,
             "customdata": {"locus": "b0344"}}]
    dash_duo.start_server(
        _tooltip_app(tooltip={"template": "%{name} @ %{customdata.locus}"}, annotations=anns)
    )
    _hover(dash_duo, ".la-vz-annotation")
    tip = _wait_tooltip(dash_duo)
    assert "promoter @ b0344" in tip.text


def test_tooltip_customdata_list(dash_duo):
    anns = [{"start": 5, "end": 90, "name": "promoter", "direction": 1,
             "customdata": ["alpha", "beta"]}]
    dash_duo.start_server(
        _tooltip_app(tooltip={"template": "%{customdata[1]}"}, annotations=anns)
    )
    _hover(dash_duo, ".la-vz-annotation")
    tip = _wait_tooltip(dash_duo)
    assert "beta" in tip.text
