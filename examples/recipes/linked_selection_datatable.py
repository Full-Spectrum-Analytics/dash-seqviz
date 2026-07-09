"""Recipe: link a Dash DataTable to a SeqViz viewer (two-way selection).

Click an annotation row in the table -> the viewer selects that range.
Drag-select in the viewer -> the readout (and, if it matches an annotation,
the table's selected row) updates.

Run:
    python linked_selection_datatable.py

Uses only `dash` + `dash_seqviz`, so it works out of the box.
"""
from dash import Dash, Input, Output, dash_table, html, no_update

from dash_seqviz import SeqViz

SEQ = "ATGCGTACGT" * 30  # 300 bp demo sequence

ANNOTATIONS = [
    {"start": 5, "end": 90, "name": "Strong promoter", "direction": 1, "color": "#3b82f6"},
    {"start": 110, "end": 160, "name": "RBS", "direction": 1, "color": "#10b981"},
    {"start": 170, "end": 250, "name": "CDS", "direction": 1, "color": "#f59e0b"},
    {"start": 260, "end": 295, "name": "Terminator", "direction": -1, "color": "#ec4899"},
]

_COLS = ("name", "start", "end", "direction")

app = Dash(__name__)
app.layout = html.Div(
    [
        html.H3("DataTable <-> SeqViz linked selection"),
        dash_table.DataTable(
            id="ann-table",
            columns=[{"name": c, "id": c} for c in _COLS],
            data=[{k: a.get(k) for k in _COLS} for a in ANNOTATIONS],
            row_selectable="single",
            style_table={"maxWidth": 640},
        ),
        html.Div(id="sel-readout", style={"margin": "8px 0", "fontFamily": "monospace"}),
        SeqViz(
            id="viewer",
            seq=SEQ,
            name="pDemo",
            annotations=ANNOTATIONS,
            viewer="both",
            style={"height": "480px", "width": "100%"},
        ),
    ],
    style={"maxWidth": 900, "margin": "0 auto", "padding": 16},
)


@app.callback(Output("viewer", "selection"), Input("ann-table", "selected_rows"))
def select_from_table(selected_rows):
    """Table row -> viewer selection range."""
    if not selected_rows:
        return no_update
    a = ANNOTATIONS[selected_rows[0]]
    return {"start": a["start"], "end": a["end"], "clockwise": True}


@app.callback(
    Output("sel-readout", "children"),
    Output("ann-table", "selected_rows"),
    Input("viewer", "selection"),
)
def show_selection(sel):
    """Viewer selection -> readout, and reflect a matching annotation back to the table."""
    if not sel:
        return "No selection", no_update
    start, end = sel.get("start"), sel.get("end")
    matched = [
        i for i, a in enumerate(ANNOTATIONS) if a["start"] == start and a["end"] == end
    ]
    return f"selection: {start}..{end}", (matched or no_update)


if __name__ == "__main__":
    app.run(debug=True, port=8871)
