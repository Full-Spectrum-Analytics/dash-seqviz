"""Recipe: export the SeqViz viewer as an SVG or PNG figure.

Click a button -> the component serializes the current viewer into a data
URI (`export_result`) -> a download link picks it up. SVG is vector
(publication-ready); PNG is a raster at `scale`x resolution.

Run:
    python export_figure.py

Uses only `dash` + `dash_seqviz`.
"""
from dash import Dash, Input, Output, ctx, html
from dash.exceptions import PreventUpdate

from dash_seqviz import SeqViz

SEQ = "ATGCGTACGT" * 30

app = Dash(__name__)
app.layout = html.Div(
    [
        html.Button("Export SVG", id="svg-btn"),
        html.Button("Export PNG", id="png-btn", style={"marginLeft": 8}),
        html.A("Download", id="download", download="seqviz-figure.svg", href="",
               style={"marginLeft": 16}),
        SeqViz(
            id="viewer",
            seq=SEQ,
            name="pDemo",
            viewer="circular",
            annotations=[
                {"start": 5, "end": 90, "name": "Strong promoter", "direction": 1, "color": "#3b82f6"},
                {"start": 110, "end": 160, "name": "RBS", "direction": 1, "color": "#10b981"},
            ],
            style={"height": "480px", "width": "100%"},
        ),
    ],
    style={"maxWidth": 900, "margin": "0 auto", "padding": 16},
)


@app.callback(
    Output("viewer", "export_request"),
    Input("svg-btn", "n_clicks"),
    Input("png-btn", "n_clicks"),
    prevent_initial_call=True,
)
def request_export(svg_n, png_n):
    # A changing token ensures repeated same-format exports re-fire.
    if ctx.triggered_id == "svg-btn":
        return {"format": "svg", "token": svg_n}
    return {"format": "png", "token": png_n, "scale": 2}


@app.callback(
    Output("download", "href"),
    Output("download", "download"),
    Input("viewer", "export_result"),
    prevent_initial_call=True,
)
def to_download(uri):
    if not uri:
        raise PreventUpdate
    ext = "png" if uri.startswith("data:image/png") else "svg"
    return uri, f"seqviz-figure.{ext}"


if __name__ == "__main__":
    app.run(debug=True, port=8875)
