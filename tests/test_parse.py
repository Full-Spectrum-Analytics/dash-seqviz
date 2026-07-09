"""Tests for dash_seqviz.parse()."""

import io
from pathlib import Path

import pytest

from dash_seqviz import parse

FIXTURES = Path(__file__).parent
GB = FIXTURES / "MN623123.gb"
FASTA = FIXTURES / "MN623123.fasta"


def test_parse_fasta_path():
    props = parse(FASTA)
    assert set(props) == {"seq", "name", "annotations", "translations"}
    assert props["seq"] and props["seq"] == props["seq"].upper()
    assert props["name"]
    # FASTA carries no features.
    assert props["annotations"] == []
    assert props["translations"] == []


def test_parse_genbank_path_has_annotations():
    props = parse(GB)
    assert props["seq"]
    assert len(props["annotations"]) > 0
    # Every annotation is a well-formed SeqViz annotation.
    for ann in props["annotations"]:
        assert isinstance(ann["start"], int)
        assert isinstance(ann["end"], int)
        assert ann["start"] <= ann["end"]
        assert ann["direction"] in (1, -1)
        assert isinstance(ann["name"], str) and ann["name"]
    # Annotations are sorted by start.
    starts = [a["start"] for a in props["annotations"]]
    assert starts == sorted(starts)
    # No whole-record 'source' feature leaked in.
    seq_len = len(props["seq"])
    assert not any(a["start"] == 0 and a["end"] == seq_len for a in props["annotations"])


def test_genbank_translations_track_cds():
    props = parse(GB)
    # translations only appear when there are CDS features; this record has them.
    for tr in props["translations"]:
        assert tr["direction"] in (1, -1)
        assert tr["start"] <= tr["end"]


def test_include_translations_false():
    props = parse(GB, include_translations=False)
    assert props["translations"] == []
    # annotations still present.
    assert props["annotations"]


def test_explicit_format_overrides_extension():
    props = parse(str(FASTA), fmt="fasta")
    assert props["seq"]


def test_parse_from_handle():
    with open(GB) as fh:
        props = parse(fh, fmt="genbank")
    assert props["annotations"]


def test_parse_raw_fasta_string():
    raw = ">seq1 demo\nATGCATGCATGC\n"
    props = parse(raw)
    assert props["seq"] == "ATGCATGCATGC"
    assert props["name"] in ("seq1", "seq1 demo")
    assert props["annotations"] == []


def test_missing_file_raises():
    # A string that is neither an existing file nor recognizable sequence
    # text fails fast before format detection.
    with pytest.raises(FileNotFoundError):
        parse("not a real path and not sequence text", fmt=None)


def test_unresolvable_format_raises():
    # Readable content whose format cannot be sniffed → ValueError.
    junk = io.StringIO("just some plain words with no fasta or genbank markers")
    with pytest.raises(ValueError):
        parse(junk, fmt=None)


def test_bad_record_index_raises():
    with pytest.raises(IndexError):
        parse(FASTA, record=99)


def test_props_spread_into_component():
    # The returned dict must be accepted by the SeqViz constructor.
    from dash_seqviz import SeqViz

    props = parse(GB)
    component = SeqViz(id="from-parse", **props)
    assert component.seq == props["seq"]
