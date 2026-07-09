# Implementation notes: logging a SeqViz component as an MLflow artifact

Audience: an agent wiring SeqViz into a **real** MLflow experiment/run (not
the local demo). A working reference lives in
[`seqviz_mlflow.py`](seqviz_mlflow.py) — crib from it; this doc is the map
and the landmines.

## The mechanism (why it works)

SeqViz is a browser component — you can't pickle it. But the `seqviz`
package ships a plain-JS `Viewer` as a UMD bundle on unpkg, so you render a
**self-contained HTML file** and log it as an artifact named `seqviz.html`.
MLflow's artifact viewer renders `.html` inline (same path that makes
Plotly interactive), so the run's Artifacts tab shows the *live* viewer.

## Minimum viable implementation

```python
import json, hashlib, mlflow

SEQVIZ_CDN = "https://unpkg.com/seqviz@3.10.20/dist/seqviz.min.js"

def build_seqviz_html(options: dict) -> str:
    # options are the SAME camelCase keys as the React props:
    # seq (required), name, viewer, annotations, primers, translations, ...
    boot = 'seqviz.Viewer("root", ' + json.dumps(options) + ").render();"
    return (
        '<!doctype html><html><head><meta charset="utf-8"></head>'
        '<body style="margin:0"><div id="root"></div>'
        f'<script src="{SEQVIZ_CDN}"></script>'
        f'<script>{boot}</script></body></html>'
    )

seq = "ATGC..."
opts = {"name": "pUC19", "seq": seq, "viewer": "both",
        "annotations": [{"start": 0, "end": 50, "name": "ori", "direction": 1}]}

mlflow.set_experiment("my-plasmids")           # create-if-missing
with mlflow.start_run(run_name="variant-a"):
    mlflow.log_text(build_seqviz_html(opts), "seqviz.html")   # the visual
    mlflow.log_params({"viewer": opts["viewer"], "n_annotations": 1})
    mlflow.log_metrics({"seq_len": len(seq)})
    mlflow.set_tag("seq_sha256", hashlib.sha256(seq.encode()).hexdigest()[:12])
```

That's the whole idea. Everything below is either polish (themes,
comparison metadata) or a gotcha that will cost you an hour if skipped.

## Targeting a run in a real experiment

Three ways, depending on whether a run is already open:

- **New run:** `with mlflow.start_run(run_name=...):` then `log_text(...)`.
- **The currently-active run** (e.g. logging SeqViz alongside a training
  run): just call `mlflow.log_text(html, "seqviz.html")` — the fluent API
  targets `mlflow.active_run()`. Do **not** wrap it in a second
  `start_run`.
- **A specific run by id, without making it active:**
  `MlflowClient().log_text(run_id, html, "seqviz.html")`, or
  `mlflow.log_text(html, "seqviz.html", run_id=run_id)`.

Select/create the experiment with `mlflow.set_experiment(name)`; to control
the artifact root, `mlflow.create_experiment(name, artifact_location=...)`
before first use.

## Gotchas (the load-bearing part)

1. **MLflow 3 deprecated the file store.** A `file:./mlruns` tracking URI
   raises `MlflowException` ("filesystem tracking backend ... maintenance
   mode"). Use a database backend (`sqlite:///mlflow.db`) or an `http://`
   tracking server. The URI your code logs to and the URI the UI reads
   (`mlflow ui --backend-store-uri ...`) **must match**. Escape hatch if you
   truly need the file store: env `MLFLOW_ALLOW_FILE_STORE=true`.

2. **The `.html` suffix triggers inline rendering.** Name the artifact
   `seqviz.html`. Other extensions download instead of previewing.

3. **seqviz's `colors` prop is dead in v3.** It's declared but never read;
   annotations get colored from a built-in `COLORS` constant via
   `element.color || colorByIndex(i)`. To apply a custom/CVD-safe palette
   you must set `color` on each element yourself before serializing — do
   not pass a top-level `colors` array and expect it to take. (See
   `_apply_palette` in the reference module.)

4. **f-string vs. JS braces.** `json.dumps(options)` emits `{...}`. If you
   splice it into an f-string template you'll hit "invalid format
   specifier" or have to double every brace. Build the `<script>` body by
   **concatenation** (as above), and keep any literal CSS/JS braces out of
   f-strings.

5. **The CDN is required at *view* time.** The artifact pulls seqviz from
   unpkg when the MLflow UI renders it. If the machine viewing the UI can't
   reach unpkg (air-gapped, strict CSP), the viewer stays blank. For
   offline use, self-host `seqviz.min.js` and point `SEQVIZ_CDN` at a URL
   the environment can serve.

6. **Rendering is async.** The CDN script loads, then `render()` mounts the
   SVG. If you screenshot or scrape the iframe programmatically, wait for
   the `.la-vz-*` SVG to appear — do not assume it's painted on load. (Only
   matters for automation; humans won't notice.)

7. **`sandbox="allow-scripts"` is fine.** MLflow embeds HTML artifacts in a
   sandboxed iframe (from a `blob:` URL). Scripts still run and CSS still
   applies, so seqviz renders and themes work — verified. Not a blocker.

8. **Remote artifact stores just work.** With S3/GCS/Azure/Databricks
   artifact roots, `log_text` uploads through the artifact repository; no
   special handling. Inline HTML preview works as long as the MLflow server
   serves/proxies the artifact back to the browser.

## Reproducing the component's themes (optional polish)

The bare MVP renders in seqviz's default light style. To make the artifact
look like the Dash `SeqViz` component's `theme` prop, embed three things in
the HTML (all shown in `build_seqviz_html` in the reference module):

- Inline `dash_seqviz/dash_seqviz.css` inside a `<style>` block.
- Wrap the mount point: `<div data-dash-seqviz-theme="{theme}">…</div>`.
  The CSS is scoped to that attribute (`$="dark"` covers every dark
  variant).
- Set the page background per theme (`#1a1b1e` for dark themes) via an
  inline `<body style>`.
- For `xkcd`/`xkcd-*`, also inject the hidden `<svg><filter
  id="dash-seqviz-xkcd-wobble">` turbulence filter the CSS references.
- Palette themes (`okabe-ito-*`, `colorbrewer-*`, `tol-*`) are applied by
  setting element `color`s (gotcha #3), **not** by CSS.
- Note: bare `"xkcd"` should normalize to `"xkcd-light"`.

## Making runs comparable (the point of doing this)

Log the same sequence's variants as separate runs so MLflow's **Compare**
view can diff them:

- **params** — `theme`, `viewer`, `n_annotations`, `annotation_names`
  (differing ones auto-highlight in Compare).
- **metrics** — `seq_len`, `gc_content_pct`, `annotation_coverage_pct`,
  `mean_annotation_len` (numeric → parallel-coords / scatter plots; flat
  `seq_len`/`gc_content` confirm the sequence didn't change).
- **tag** — `seq_sha256` (first ~12 chars) so same-sequence variants group
  and are filterable (`tags.seq_sha256 = '...'`).

## Verification checklist

1. Run appears under the target experiment.
2. Artifacts tab lists `seqviz.html`.
3. Clicking it renders the interactive viewer (allow a beat for the CDN).
4. Select multiple runs → **Compare**: differing params highlighted,
   metrics plotted.
5. Same-sequence variants share the `seq_sha256` tag.

Reference implementation: [`seqviz_mlflow.py`](seqviz_mlflow.py) —
`build_seqviz_html`, `_apply_palette`, `sequence_features`,
`log_seqviz_run`, `log_variants`.
```
