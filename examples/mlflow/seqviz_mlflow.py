"""Demo: log a SeqViz comparison set to MLflow.

The reusable logic now lives in the package at
``dash_seqviz.integrations.mlflow``; this script is just a runnable demo that
logs several annotation/theme variants of one sequence so you can compare
them in the MLflow UI.

    python seqviz_mlflow.py
    mlflow ui --backend-store-uri sqlite:///mlflow.db

Then open the experiment, select the runs, click "Compare", and open any
run's Artifacts tab to see seqviz.html render inline. See README.md and
IMPLEMENTATION.md in this folder for details.
"""
from __future__ import annotations

import argparse
from typing import Any, Dict, List

import mlflow

from dash_seqviz.integrations.mlflow import log_variants


def _demo_variants() -> List[Dict[str, Any]]:
    """Same sequence, different annotation sets / themes -- the comparison set."""
    promoter = {"start": 5, "end": 90, "name": "Strong promoter", "direction": 1}
    rbs = {"start": 110, "end": 200, "name": "RBS", "direction": 1}
    cds = {"start": 210, "end": 480, "name": "GFP CDS", "direction": 1}
    terminator = {"start": 500, "end": 560, "name": "Terminator", "direction": -1}
    return [
        {"run_name": "bare", "annotations": [], "theme": "light"},
        {"run_name": "promoter+rbs", "annotations": [promoter, rbs], "theme": "light"},
        {"run_name": "full-construct", "annotations": [promoter, rbs, cds, terminator], "theme": "light"},
        {"run_name": "full-dark", "annotations": [promoter, rbs, cds, terminator], "theme": "dark"},
        {"run_name": "full-okabe-ito", "annotations": [promoter, rbs, cds, terminator], "theme": "okabe-ito-light"},
        {"run_name": "full-colorbrewer-dark", "annotations": [promoter, rbs, cds, terminator], "theme": "colorbrewer-dark"},
    ]


def main() -> None:
    parser = argparse.ArgumentParser(description="Log a SeqViz comparison set to MLflow.")
    parser.add_argument("--tracking-uri", default="sqlite:///mlflow.db",
                        help="MLflow tracking URI (default: sqlite:///mlflow.db). "
                             "MLflow 3 requires a database backend.")
    parser.add_argument("--artifact-location", default=None,
                        help="Artifact root for new experiments (e.g. ./mlartifacts).")
    parser.add_argument("--experiment", default="seqviz-annotations",
                        help="Experiment name.")
    args = parser.parse_args()

    mlflow.set_tracking_uri(args.tracking_uri)
    # Select the experiment the idiomatic way (log_variants logs into it).
    if mlflow.get_experiment_by_name(args.experiment) is None:
        mlflow.create_experiment(args.experiment, artifact_location=args.artifact_location)
    mlflow.set_experiment(args.experiment)

    seq = "ATGCGTACGT" * 60  # 600 bp demo sequence

    run_ids = log_variants(seq, _demo_variants(), name="pDemo-GFP", base={"viewer": "both"})

    print(f"Logged {len(run_ids)} runs to experiment '{args.experiment}'")
    print(f"Launch the UI with:\n  mlflow ui --backend-store-uri {args.tracking_uri}")
    print("Open the experiment, select the runs, click 'Compare'; open a run's")
    print("Artifacts tab to see seqviz.html render inline.")


if __name__ == "__main__":
    main()
