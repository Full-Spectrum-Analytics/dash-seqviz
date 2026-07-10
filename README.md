# Dash SeqViz

Dash SeqViz is a Dash component library that provides a Python wrapper for the [SeqViz](https://github.com/Lattice-Automation/seqviz) JavaScript library. SeqViz is a powerful DNA, RNA, and protein sequence visualization tool that supports circular and linear viewers, annotations, primers, restriction enzymes, and more.

## Features

- **Multiple Viewer Types**: Support for linear, circular, and both viewers
- **Rich Annotations**: Add annotations, primers, highlights, and translations to sequences
- **Restriction Enzymes**: Visualize restriction enzyme cut sites
- **Interactive**: Full interactivity including selection, search, and zooming
- **Custom Styling**: Comprehensive styling options
- **Dash Integration**: Seamless integration with Dash applications and callbacks

## Quick Start

```python
from dash_seqviz import SeqViz
from dash import Dash, html

app = Dash(__name__)

app.layout = html.Div([
    SeqViz(
        id='my-seqviz',
        seq="TTGACGGCTAGCTCAGTCCTAGGTACAGTGCTAGC",
        name="J23100",
        viewer="both",
        annotations=[
            {
                "start": 0,
                "end": 22,
                "name": "Strong promoter",
                "direction": 1,
                "color": "blue"
            }
        ],
        style={"height": "500px", "width": "100%"}
    )
])

if __name__ == '__main__':
    app.run(debug=True)
```

## Parsing sequence files

seqviz deprecated its in-browser `file` / `accession` props. Parse records
in Python instead with `dash_seqviz.parse()` and spread the result into the
component:

```python
from dash_seqviz import SeqViz, parse

props = parse("plasmid.gb")        # FASTA or GenBank; format auto-detected
app.layout = SeqViz(id="viewer", **props)
```

`parse(source, fmt=None, *, record=0, include_translations=True)` accepts a
file path, an open text handle, or a raw FASTA/GenBank string, and returns
`{"seq", "name", "annotations", "translations"}`. FASTA input yields the
sequence and name; GenBank additionally extracts feature `annotations` and,
for CDS features, `translations`. Requires Biopython (a project dependency).

To pull a record straight from NCBI by accession, use `fetch_ncbi()`, which
fetches a GenBank record and runs it through `parse()`:

```python
from dash_seqviz import SeqViz, fetch_ncbi

props = fetch_ncbi("MN623123.1", email="you@example.com")
SeqViz(id="viewer", **props)
```

NCBI's E-utilities require a contact email: pass `email=` or set the
`NCBI_EMAIL` environment variable (an optional `api_key=` / `NCBI_API_KEY`
raises the rate limit).

## Typed inputs & validation

`dash_seqviz` ships `TypedDict`s (`Annotation`, `Primer`, `Highlight`,
`Translation`, `Enzyme`) for editor autocomplete and static type-checking of
your element lists, plus a runtime `validate_props()` helper that raises
clear errors (missing keys, `start > end`, bad `direction`) before a silent
mis-render reaches the browser:

```python
from dash_seqviz import Annotation, validate_props

anns: list[Annotation] = [{"start": 0, "end": 22, "name": "promoter", "direction": 1}]
validate_props(annotations=anns)   # raises ValueError on the first problem
```

## Annotation legend

`dash_seqviz.legend(annotations, theme=..., colors=...)` returns a Dash
layout (`html.Div` of swatch + name rows) whose colors match what the viewer
renders for the same annotations and theme:

```python
from dash import html
from dash_seqviz import SeqViz, legend

anns = [{"start": 0, "end": 20, "name": "promoter", "direction": 1}]
html.Div([
    SeqViz(id="v", seq=seq, annotations=anns, theme="okabe-ito-light"),
    legend(anns, theme="okabe-ito-light", title="Features"),
])
```

Per-annotation `color`s win; otherwise swatches follow the same palette the
viewer uses (theme palette, or seqviz's default cycle). Supports
`direction="horizontal"`, a `title`, and an `id` for callbacks — pair it with
the viewer's `clicked_element` prop to highlight the clicked feature.

## Exporting figures (SVG / PNG)

Export the current viewer as a publication-ready figure. Set `export_request`
to `{"format": "svg" | "png", "token": <changing>, "scale"?: <n>}`; the
component serializes the live viewer (theme and colors preserved) and returns
a data URI in the read-only `export_result` prop, which you can wire to a
download link:

```python
from dash import Dash, Input, Output, ctx, html
from dash.exceptions import PreventUpdate
from dash_seqviz import SeqViz

@app.callback(Output("viewer", "export_request"),
              Input("svg-btn", "n_clicks"), Input("png-btn", "n_clicks"),
              prevent_initial_call=True)
def request_export(svg_n, png_n):
    fmt = "svg" if ctx.triggered_id == "svg-btn" else "png"
    return {"format": fmt, "token": (svg_n or 0) + (png_n or 0)}

@app.callback(Output("dl", "href"), Output("dl", "download"),
              Input("viewer", "export_result"), prevent_initial_call=True)
def to_download(uri):
    if not uri:
        raise PreventUpdate
    ext = "png" if uri.startswith("data:image/png") else "svg"
    return uri, f"figure.{ext}"
```

SVG is vector (best for papers/posters); PNG rasterizes at `scale`x (default
2). A runnable version is in
[`examples/recipes/export_figure.py`](examples/recipes/export_figure.py).

## API Reference

### SeqViz Properties

#### Required Properties

- **`seq`** (string): The sequence to render. Can be DNA, RNA, or amino acid sequence.

#### Optional Properties

- **`id`** (string): The ID used to identify this component in Dash callbacks.

- **`name`** (string): The name of the sequence/plasmid. Shown at the center of the circular viewer.

- **`viewer`** (string): The type and orientation of the sequence viewers.
  - Options: `"linear"`, `"circular"`, `"both"`, `"both_flip"`
  - Default: `"both"`

- **`annotations`** (list): Array of annotation objects to render.
  - Each annotation: `{"start": int, "end": int, "name": str, "direction"?: int, "color"?: str}`

- **`primers`** (list): Array of primer objects to render.
  - Each primer: `{"start": int, "end": int, "name": str, "direction": int, "color"?: str}`

- **`highlights`** (list): Array of highlight objects.
  - Each highlight: `{"start": int, "end": int, "color"?: str}`

- **`translations`** (list): Array of translation objects.
  - Each translation: `{"start": int, "end": int, "direction": int, "name"?: str, "color"?: str}`

- **`enzymes`** (list): Array of restriction enzymes.
  - Can be enzyme names (strings) or custom enzyme objects.
  - Custom enzyme: `{"name": str, "rseq": str, "fcut": int, "rcut": int, "color"?: str, "range"?: {"start": int, "end": int}}`

- **`search`** (dict): Search configuration object.
  - Format: `{"query": str, "mismatch"?: int}`

- **`selection`** (dict): Selection state object.
  - Format: `{"start": int, "end": int, "clockwise"?: bool}`

- **`colors`** (list): Array of colors for annotations, translations, and highlights.

- **`bp_colors`** (dict): Object mapping base pairs or indexes to custom colors.
  - Example: `{"A": "#FF0000", "T": "#00FF00", 12: "#0000FF"}`

- **`style`** (dict): CSS styles for the outer container div.
  - Example: `{"height": "500px", "width": "100%"}`

- **`zoom`** (dict): Zoom configuration object.
  - Format: `{"linear": int}` (0-100)
  - Default: `{"linear": 50}`

- **`show_complement`** (bool): Whether to show the complement sequence.
  - Default: `true`

- **`rotate_on_scroll`** (bool): Whether the circular viewer rotates on scroll.
  - Default: `true`

- **`disable_external_fonts`** (bool): Whether to disable downloading external fonts.
  - Default: `false`

- **`max_seq_length`** (number): Guard for very long sequences. seqviz's
  linear viewer renders per-base DOM and can hang the tab on multi-megabase
  input. When set and the sequence length exceeds it, the component renders a
  lightweight placeholder instead of mounting the viewer. Omit for no guard.
  For very long sequences that must render, prefer `viewer="circular"` (which
  seqviz renders without per-base DOM above its internal cutoff).

- **`aria_label`** (string): Accessible name for the viewer. seqviz renders
  an unlabeled SVG, so the component gives its container `role="group"` with
  this label (and labels the circular SVG `role="img"`). Defaults to an
  auto-generated summary (`"Sequence viewer: <name>, <N> bp, <M>
  annotations"`). Note: seqviz provides no keyboard navigation of individual
  features, so this is screen-reader labeling only.

- **`theme`** (string): Visual theme. The underlying seqviz library
  hardcodes dark-gray text and ticks tuned for light backgrounds, so on a
  dark dashboard the annotation labels, index numbers, and ticks lose
  contrast and effectively disappear. Setting a dark theme activates a
  bundled CSS override that recolors those elements; the colorblind themes
  additionally inject a CVD-safe qualitative palette into the `colors`
  prop. Per-annotation `color` values you supply always win.

  Available values:
  - `"light"` (default) — seqviz default.
  - `"dark"` — text / ticks / selector recolored for dark backgrounds.
  - `"auto"` — follow the page's color scheme automatically. Detects
    `data-mantine-color-scheme` on `<html>` (set by a dash-mantine-components
    theme switch) and updates live when it flips, falling back to the
    `prefers-color-scheme` media query. Zero-boilerplate for Mantine
    dashboards — no callback needed.
  - `"okabe-ito-light"`, `"okabe-ito-dark"` — Okabe & Ito's 7-color
    CVD-safe palette. The de facto standard for categorical CVD-safe data
    visualization.
  - `"colorbrewer-light"`, `"colorbrewer-dark"` — ColorBrewer Set2 (pastel,
    naturally light) / Dark2 (saturated, naturally dark). CVD-safe.
  - `"tol-light"`, `"tol-dark"` — Paul Tol's Bright palette (7 colors
    engineered for deuteranopia / protanopia / tritanopia distinction).

  Wire this to a theme switcher with a Dash callback — for
  dash-mantine-components, read the colorScheme and push it through:

  ```python
  @app.callback(
      Output("seqviz", "theme"),
      Input("mantine-provider", "forceColorScheme"),
  )
  def sync_theme(color_scheme):
      return "dark" if color_scheme == "dark" else "light"
  ```

- Deprecated (prefer parsing externally with `seqparse`):
  - **`file`** (string | File): FASTA, GenBank, SnapGene, JBEI, or SBOL file
  - **`accession`** (string): NCBI accession-ID

- Events / Read-only:
  - **`on_selection`** (function): Called after selection events; selection returned also via `selection`
  - **`on_search`** (function): Called after search; results returned also via `search_results` (read-only)
  - **`clicked_element`** (dict, read-only): The most recently clicked feature
    (annotation, primer, enzyme, translation, highlight, or search hit), as
    `{"type", "name", "start", "end", "direction", "id", "color"}`. Updates
    only on feature clicks (bare sequence selections leave it unchanged), so
    `Input("id", "clicked_element")` gives clean feature-click events for
    linked views. (seqviz exposes no hover or center-index callbacks, so
    those are not available.)

## Examples

### Basic Sequence Viewer

```python
dash_seqviz.SeqViz(
    seq="ATCGATCGATCGATCG",
    name="Simple Sequence",
    viewer="linear"
)
```

### Advanced Sequence with Annotations

```python
dash_seqviz.SeqViz(
    seq="TTGACGGCTAGCTCAGTCCTAGGTACAGTGCTAGC",
    name="J23100 Promoter",
    viewer="both",
    annotations=[
        {
            "start": 0,
            "end": 22,
            "name": "Strong promoter",
            "direction": 1,
            "color": "blue"
        },
        {
            "start": 23,
            "end": 43,
            "name": "RBS",
            "direction": 1,
            "color": "green"
        }
    ],
    primers=[
        {
            "start": 0,
            "end": 20,
            "name": "Forward Primer",
            "direction": 1,
            "color": "red"
        }
    ],
    highlights=[
        {
            "start": 10,
            "end": 30,
            "color": "yellow"
        }
    ],
    style={"height": "500px", "width": "100%"}
)
```

### With Restriction Enzymes

```python
dash_seqviz.SeqViz(
    seq="GAATTCCTGCAGTTAA",  # Contains EcoRI and PstI sites
    name="Enzyme Test",
    viewer="circular",
    enzymes=["EcoRI", "PstI"],
    style={"height": "400px", "width": "400px"}
)
```

### With Search Functionality

```python
dash_seqviz.SeqViz(
    seq="TTGACGGCTAGCTCAGTCCTAGGTACAGTGCTAGC",
    name="Search Example",
    viewer="both",
    search={
        "query": "GCTAGC",
        "mismatch": 1
    },
    style={"height": "500px", "width": "100%"}
)
```

## Contributing

Contributions are welcome. See [CONTRIBUTING.md](./CONTRIBUTING.md) for local
development setup — environment, building the component, running the tests, and
previewing the docs site.

- Docs & live explorer: <https://dash-seqviz.com>
- Source, issues & PRs: <https://github.com/Full-Spectrum-Analytics/dash-seqviz>

Releases are automated with
[release-please](https://github.com/googleapis/release-please): merges to
`main` update the changelog and version, and CI publishes to PyPI and npm.
