# dash-seqviz — Component Library Roadmap

Forward-looking features for the **Dash component library itself** — the
things that make `dash_seqviz.SeqViz` more useful inside a Dash/Plotly app.

This is distinct from `specs/`, which covers backend/app-level products
(Designer Sandbox, QC Dashboard, Examples Manager, API, Enterprise). Nothing
here needs a server: every item ships in the pip/npm package.

Legend — **Effort**: S (<1d), M (1-3d), L (>3d). **Risk**: how much it
depends on seqviz internals or fragile browser behavior.

---

## Epic A — Data ingestion (Python-side)

seqviz deprecated its in-browser `file`/`accession` props. Researchers still
need to get real records into the component. Do it in Python, where
biopython already lives (it's a project dependency).

### A1. `dash_seqviz.parse()` — file → props
Parse FASTA / GenBank (and, stretch, SnapGene `.dna`) into a ready-to-spread
props dict: `seq`, `name`, `annotations`, `translations`.
```python
props = dash_seqviz.parse("plasmid.gb")      # -> {"seq":..., "annotations":[...]}
SeqViz(id="v", **props)
```
- Audience: researchers, bioinformaticians. **Effort: M. Risk: Low.**
- Note: `usage.py` already hand-rolls GenBank extraction — promote and
  generalize that logic into the package.

### A2. `dash_seqviz.fetch_ncbi()` — accession → props
Server-side Entrez fetch (biopython) returning the same props dict.
- Audience: researchers doing exploratory work. **Effort: M. Risk: Med**
  (network, NCBI rate limits, needs email/api-key config).

---

## Epic B — Publication figure export

### B1. Export the current viewer to SVG / PNG
The single highest-value ask for academics. Add a write prop
`export_request` (e.g. `{"format": "svg", "token": 123}`) and a read prop
`export_result` (data-URI); a clientside handler serializes the live seqviz
SVG (inlining computed styles + the theme CSS) and hands it back to Dash for
`dcc.Download`.
- Audience: anyone making a paper/poster figure. **Effort: L. Risk: Med**
  (SVG style inlining, font embedding, PNG rasterization via canvas).

---

## Epic C — Richer interactivity / two-way props

### C1. Read-only event props for linked views
Expose what the user interacts with so Dash callbacks can react:
`clicked_element`, `hovered_element` (the annotation/primer/enzyme/translation
under the cursor), and `center_index` (circular rotation state).
- Audience: Dash devs building dashboards (click an annotation → update a
  table/plot). **Effort: M. Risk: Low.**

---

## Epic D — Typed, validated inputs (developer experience)

### D1. TypedDicts + input validation
Ship `TypedDict`s (`Annotation`, `Primer`, `Translation`, `Enzyme`) and an
optional `validate=True` that raises clear errors (start<end, required keys)
instead of silent mis-renders. Improves editor autocomplete and catches bugs
before they reach the browser.
- Audience: all Python developers. **Effort: S-M. Risk: Low.**

---

## Epic E — Theming completeness

Builds on the theming just added (light/dark, CVD palettes, xkcd).

### E1. `theme="auto"` + Mantine sync helper
Auto-detect `data-mantine-color-scheme` on the page (or a one-line
`dash_seqviz.mantine_theme_callback(...)` factory) so the viewer follows a
dashboard's theme switch with zero boilerplate.
- Audience: dash-mantine-components users. **Effort: S. Risk: Low.**

### E2. `dash_seqviz.Legend` companion component
A small component that renders annotation names + colors as a legend, синхро-
nized with the viewer's palette/selection.
- Audience: dashboard builders, figure makers. **Effort: M. Risk: Low.**

---

## Epic F — Performance / scale

### F1. Long-sequence handling
Expose seqviz's basepair-render cutoff and document/guard large-sequence
behavior (whole chromosomes). Possibly a `render_threshold` prop and lazy
mount.
- Audience: genomics (Mb-scale sequences). **Effort: M-L. Risk: Med**
  (bounded by seqviz internals).

---

## Epic G — Ecosystem integrations

### G1. First-class MLflow logging module
Promote the `examples/mlflow` prototype into an optional
`dash_seqviz.integrations.mlflow` (log a viewer as a rendered HTML artifact;
compare variants across runs). Keep mlflow an optional/extra dependency.
- Audience: ML/experiment-tracking users. **Effort: S (prototype exists).
  Risk: Low.**

### G2. Linked-selection recipes (docs)
Worked examples: AG Grid / DataTable ⇄ SeqViz selection sync, and dash-bio
interop/conversion helpers. Docs + example apps, no core code.
- Audience: Dash devs. **Effort: S. Risk: Low.**

---

## Foundational (cross-cutting)

### H1. Accessibility
ARIA roles/labels on the SVG, keyboard navigation for
annotations/selection, focus states. Widens adoption (institutional a11y
requirements). **Effort: M. Risk: Low.**

### H2. Integration test coverage
Selenium/pytest tests driving the real component (selection, search, theme,
callbacks) in CI, so features land without regressions. **Effort: M. Risk:
Low.**

---

## At a glance

| ID | Feature | Audience | Effort | Risk |
|----|---------|----------|--------|------|
| A1 | `parse()` file → props | Research | M | Low |
| A2 | `fetch_ncbi()` | Research | M | Med |
| B1 | SVG/PNG export | Academia | L | Med |
| C1 | Event props (click/hover/center) | Dash devs | M | Low |
| D1 | Typed + validated inputs | All devs | S-M | Low |
| E1 | `theme="auto"` + Mantine sync | Mantine | S | Low |
| E2 | `Legend` component | Dashboards | M | Low |
| F1 | Long-sequence handling | Genomics | M-L | Med |
| G1 | MLflow module | ML users | S | Low |
| G2 | Linked-selection recipes | Dash devs | S | Low |
| H1 | Accessibility | Institutional | M | Low |
| H2 | Integration tests | Maintainers | M | Low |
