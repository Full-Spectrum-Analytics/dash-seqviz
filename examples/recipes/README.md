# SeqViz recipes

Worked examples of wiring `dash_seqviz.SeqViz` into common Dash patterns.

## Linked selection: DataTable ⇄ SeqViz

[`linked_selection_datatable.py`](linked_selection_datatable.py) — a table of
annotations and a viewer kept in sync both ways:

- Selecting a table row drives the viewer's `selection` prop to that
  annotation's range.
- A drag-selection in the viewer updates a readout and, when the range
  matches a known annotation, reflects it back to the table's selected row.

Uses only `dash` + `dash_seqviz`. Run it with `python
linked_selection_datatable.py`.

### dash-ag-grid variant

The same pattern works with [dash-ag-grid](https://dash.plotly.com/dash-ag-grid)
(`pip install dash-ag-grid`); swap the `DataTable` for an `AgGrid` and read
its `selectedRows` instead of `selected_rows`:

```python
import dash_ag_grid as dag

dag.AgGrid(
    id="ann-grid",
    rowData=[{k: a.get(k) for k in ("name", "start", "end", "direction")} for a in ANNOTATIONS],
    columnDefs=[{"field": c} for c in ("name", "start", "end", "direction")],
    dashGridOptions={"rowSelection": "single"},
)

@app.callback(Output("viewer", "selection"), Input("ann-grid", "selectedRows"))
def select_from_grid(rows):
    if not rows:
        return no_update
    a = rows[0]
    return {"start": a["start"], "end": a["end"], "clockwise": True}
```

## Export a figure (SVG / PNG)

[`export_figure.py`](export_figure.py) — buttons that export the current
viewer via the `export_request` / `export_result` props into a download
link. SVG is vector (publication-ready); PNG rasterizes at `scale`x.

## dash-bio interop

[dash-bio](https://dash.plotly.com/dash-bio) ships its own sequence widgets
(`SequenceViewer`, `AlignmentChart`). SeqViz complements them: SeqViz excels
at annotated circular/linear plasmid views, while dash-bio's `AlignmentChart`
handles multiple-sequence alignments.

Feed both from the same source with `dash_seqviz.parse()`:

```python
from dash_seqviz import SeqViz, parse
import dash_bio

props = parse("plasmid.gb")

# SeqViz: annotated circular/linear view
SeqViz(id="viewer", **props)

# dash-bio: raw sequence string for its SequenceViewer
dash_bio.SequenceViewer(id="seq", sequence=props["seq"])
```

Because `parse()` returns plain dicts/strings, the same parsed record drives
either component; pick the one that fits the view you need.
