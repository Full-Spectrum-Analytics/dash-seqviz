# SeqViz + MLflow

Log SeqViz visualizations to MLflow and compare variants of the same
sequence (different annotations, themes, viewers) in the MLflow UI.

## Can you log a SeqViz component to MLflow?

Yes. SeqViz is a browser component, so it can't be pickled like a model —
but the `seqviz` npm package ships a plain-JS `Viewer` (the same one the
Dash wrapper uses), served as a UMD bundle from unpkg. That lets us render
a **self-contained HTML file** for any sequence + annotation config, with
no build step.

MLflow renders `.html` artifacts inline in its UI (the same mechanism that
makes Plotly figures interactive), so a logged `seqviz.html` shows the
**actual, interactive viewer** inside a run's Artifacts tab — themes and
all.

Two MLflow surfaces are used together:

| Surface | What it's for | Renders the viewer? |
|---|---|---|
| **Run + HTML artifact** (primary) | The visual + structured params/metrics/tags for comparison | ✅ inline in the Artifacts tab |
| **Trace** (secondary) | Lineage: the render op with its config as inputs, artifact + features as outputs | ❌ shows JSON I/O, not the widget |

## Comparing variants of the same sequence

Each variant is one run. All variants of a sequence share a `seq_sha256`
tag (so they group), and record:

- **params** — `theme`, `viewer`, `n_annotations`, `annotation_names`
- **metrics** — `seq_len`, `gc_content_pct`, `annotation_coverage_pct`,
  `mean_annotation_len` (numeric axes for the Compare plots)
- **artifact** — `seqviz.html` (the interactive viewer) + `config.json`

In the UI: select the runs → **Compare**. Differing params (e.g. `theme`,
`annotation_names`) are highlighted; metrics get a parallel-coordinates /
scatter plot; and each run's `seqviz.html` can be previewed side by side.
Because the sequence is identical, `seq_len` / `gc_content_pct` stay flat
while the annotation-driven metrics move.

## Run the demo

MLflow 3 requires a database backend (the file store is deprecated), so
the demo defaults to a local SQLite DB.

```bash
# from the repo root, in the project env
mamba run -n dash-seqviz python examples/mlflow/seqviz_mlflow.py

# then launch the UI against the same DB
mamba run -n dash-seqviz mlflow ui --backend-store-uri sqlite:///mlflow.db
# open http://127.0.0.1:5000  (use --port 5001 if 5000 is taken, e.g. macOS AirPlay)
```

This logs 6 runs of one 600 bp sequence: bare, promoter+RBS, and the full
construct rendered in several themes. Open the experiment, select the runs,
and click **Compare**; open any run's **Artifacts → seqviz.html** to see
the viewer render inline.

## Use it in your own code

```python
import mlflow
from seqviz_mlflow import log_seqviz_run, log_variants

mlflow.set_tracking_uri("sqlite:///mlflow.db")

# one variant
log_seqviz_run(
    {"name": "pUC19", "seq": "ATGC...", "viewer": "both",
     "annotations": [{"start": 0, "end": 50, "name": "ori", "direction": 1}],
     "theme": "okabe-ito-light"},
    experiment_name="my-plasmids",
)

# several variants of the same sequence, as a comparable set
log_variants(
    "pUC19", "ATGC...",
    variants=[
        {"run_name": "minimal",  "annotations": [ori]},
        {"run_name": "annotated", "annotations": [ori, ampR, lacZ], "theme": "dark"},
    ],
    experiment_name="my-plasmids",
)
```

`config` accepts the same fields as the Dash `SeqViz` component:
`seq` (required), `name`, `viewer`, `annotations`, `primers`, `highlights`,
`translations`, `enzymes`, `theme`, `zoom`, `showComplement`. Per-element
`color` values you set are preserved; colorblind themes only fill in colors
where you didn't specify one.

## Notes

- **Requires internet at view time.** The artifact loads seqviz from unpkg;
  the MLflow UI must be able to reach the CDN to render the viewer. Edit
  `SEQVIZ_CDN` in `seqviz_mlflow.py` to point at a self-hosted bundle for
  offline use.
- `mlflow` is listed in the repo `environment.yml` but is only needed for
  this example, not for the `dash_seqviz` component itself.
