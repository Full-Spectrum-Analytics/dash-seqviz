"""Tests for dash_seqviz.integrations.mlflow.

The pure helpers (build_seqviz_html, sequence_features) need no mlflow. The
logging round-trip uses a temporary sqlite backend + local artifact dir, so
it runs offline and is skipped if mlflow isn't installed.
"""

import pytest

from dash_seqviz.integrations import mlflow as sv


# --- pure helpers (no mlflow required) -------------------------------------

def test_build_html_is_self_contained():
    html = sv.build_seqviz_html({"name": "x", "seq": "ATGC" * 10})
    assert "<!doctype html>" in html.lower()
    assert 'id="dash-seqviz-root"' in html
    assert sv.SEQVIZ_CDN in html
    assert 'data-dash-seqviz-theme="light"' in html


def test_build_html_dark_theme_background_and_attr():
    html = sv.build_seqviz_html({"seq": "ATGC", "theme": "dark"})
    assert 'data-dash-seqviz-theme="dark"' in html
    assert "#1a1b1e" in html


def test_build_html_xkcd_injects_wobble_filter():
    html = sv.build_seqviz_html({"seq": "ATGC", "theme": "xkcd"})
    # bare xkcd normalizes to xkcd-light
    assert 'data-dash-seqviz-theme="xkcd-light"' in html
    assert "dash-seqviz-xkcd-wobble" in html


def test_palette_applied_only_when_color_absent():
    cfg = {
        "seq": "ATGC" * 20,
        "theme": "okabe-ito-light",
        "annotations": [
            {"start": 0, "end": 5, "name": "a"},                     # gets palette[0]
            {"start": 6, "end": 9, "name": "b", "color": "#123456"},  # keeps user color
        ],
    }
    html = sv.build_seqviz_html(cfg)
    assert sv.PALETTES["okabe-ito-light"][0] in html   # injected
    assert "#123456" in html                            # preserved


def test_sequence_features_gc_and_len():
    feats = sv.sequence_features("GGCC" + "ATAT")  # 4 GC of 8
    assert feats["seq_len"] == 8.0
    assert feats["gc_content_pct"] == 50.0
    assert feats["n_annotations"] == 0.0


def test_sequence_features_coverage():
    feats = sv.sequence_features("A" * 100, [{"start": 0, "end": 50, "name": "x"}])
    assert feats["annotation_coverage_pct"] == 50.0
    assert feats["n_annotations"] == 1.0


# --- logging round-trip (needs mlflow) -------------------------------------

def test_log_seqviz_run_creates_run_with_artifact(tmp_path, monkeypatch):
    mlflow = pytest.importorskip("mlflow")
    from mlflow.tracking import MlflowClient

    monkeypatch.chdir(tmp_path)
    mlflow.set_tracking_uri(f"sqlite:///{tmp_path/'mlflow.db'}")

    run_id = sv.log_seqviz_run(
        {"name": "pTest", "seq": "ATGCGT" * 20, "annotations": [{"start": 0, "end": 10, "name": "x"}]},
        experiment_name="test-seqviz",
        run_name="unit",
        artifact_location=f"file://{tmp_path/'artifacts'}",
    )
    assert run_id

    client = MlflowClient()
    run = client.get_run(run_id)
    assert run.data.tags["kind"] == "seqviz"
    assert "seq_sha256" in run.data.tags
    assert run.data.params["theme"] == "light"
    assert float(run.data.metrics["seq_len"]) == 120.0

    artifacts = {a.path for a in client.list_artifacts(run_id)}
    assert "seqviz.html" in artifacts
    assert "config.json" in artifacts


def test_log_variants_share_seq_tag(tmp_path, monkeypatch):
    mlflow = pytest.importorskip("mlflow")
    from mlflow.tracking import MlflowClient

    monkeypatch.chdir(tmp_path)
    mlflow.set_tracking_uri(f"sqlite:///{tmp_path/'mlflow.db'}")

    seq = "ATGC" * 30
    run_ids = sv.log_variants(
        "pV", seq,
        [{"run_name": "a", "annotations": []},
         {"run_name": "b", "annotations": [{"start": 0, "end": 4, "name": "z"}], "theme": "dark"}],
        experiment_name="test-variants",
        artifact_location=f"file://{tmp_path/'artifacts'}",
    )
    assert len(run_ids) == 2
    client = MlflowClient()
    shas = {client.get_run(r).data.tags["seq_sha256"] for r in run_ids}
    assert len(shas) == 1  # same sequence -> same tag
