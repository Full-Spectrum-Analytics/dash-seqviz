"""Browser integration tests for the SeqViz component (dash.testing).

These drive a real browser via the `dash_duo` fixture. They are skipped
automatically when selenium can't start a browser (e.g. no Chrome/driver in
the environment), so the rest of the suite still runs in CI without a
browser. Run locally with:

    pytest tests/test_integration.py --headless
"""

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
