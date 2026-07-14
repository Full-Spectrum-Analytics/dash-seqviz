"""Browser integration tests for the SeqViz component (dash.testing).

These drive a real browser via the `dash_duo` fixture. They are skipped
automatically when selenium can't start a browser (e.g. no Chrome/driver in
the environment), so the rest of the suite still runs in CI without a
browser. Run locally with:

    pytest tests/test_integration.py --headless
"""

import pytest
from dash import Dash, Input, Output, html

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
