"""Tests for dash_seqviz typed inputs + validate_props()."""

import pytest

from dash_seqviz import validate_props


def test_valid_annotations_pass():
    validate_props(annotations=[{"start": 0, "end": 10, "name": "x", "direction": 1}])


def test_valid_all_lists_pass():
    validate_props(
        annotations=[{"start": 0, "end": 10, "name": "a"}],
        primers=[{"start": 0, "end": 5, "name": "p", "direction": 1}],
        highlights=[{"start": 1, "end": 2}],
        translations=[{"start": 0, "end": 9, "direction": -1}],
    )


def test_none_lists_are_skipped():
    validate_props()  # nothing to check, no error


def test_missing_required_key_raises():
    with pytest.raises(ValueError, match="missing required key"):
        validate_props(annotations=[{"start": 0, "end": 10}])  # no name


def test_primer_requires_direction():
    with pytest.raises(ValueError, match="direction"):
        validate_props(primers=[{"start": 0, "end": 5, "name": "p"}])


def test_start_after_end_raises():
    with pytest.raises(ValueError, match="must be <= end"):
        validate_props(annotations=[{"start": 10, "end": 0, "name": "x"}])


def test_non_int_coord_raises():
    with pytest.raises(ValueError, match="must be an int"):
        validate_props(annotations=[{"start": "0", "end": 10, "name": "x"}])


def test_bad_direction_raises():
    with pytest.raises(ValueError, match="direction"):
        validate_props(annotations=[{"start": 0, "end": 10, "name": "x", "direction": 2}])


def test_error_message_points_at_index():
    with pytest.raises(ValueError, match=r"annotations\[1\]"):
        validate_props(
            annotations=[
                {"start": 0, "end": 10, "name": "ok"},
                {"start": 0, "end": 10},  # missing name
            ]
        )


def test_non_list_raises():
    with pytest.raises(ValueError, match="must be a list"):
        validate_props(annotations={"start": 0})


def test_typeddicts_importable():
    from dash_seqviz import Annotation, Primer, Highlight, Translation, Enzyme

    # TypedDicts are usable as plain dict annotations at runtime.
    ann: Annotation = {"start": 0, "end": 1, "name": "x"}
    assert ann["name"] == "x"
