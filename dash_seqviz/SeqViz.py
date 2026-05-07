# AUTO GENERATED FILE - DO NOT EDIT

import typing  # noqa: F401
from typing_extensions import TypedDict, NotRequired, Literal # noqa: F401
from dash.development.base_component import Component, _explicitize_args

ComponentType = typing.Union[
    str,
    int,
    float,
    Component,
    None,
    typing.Sequence[typing.Union[str, int, float, Component, None]],
]

NumberType = typing.Union[
    typing.SupportsFloat, typing.SupportsInt, typing.SupportsComplex
]


class SeqViz(Component):
    """A SeqViz component.
SeqViz is a Dash wrapper for the seqviz JavaScript library.
It provides DNA, RNA, and protein sequence visualization with
circular and linear viewers, annotations, primers, and more.

Keyword arguments:

- id (string; optional):
    The ID used to identify this component in Dash callbacks.

- annotations (list of dicts; optional):
    Array of annotation objects to render. Each annotation: { start:
    number, end: number, name: string, direction?: number, color?:
    string }.

    `annotations` is a list of dicts with keys:

    - start (number; required)

    - end (number; required)

    - name (string; required)

    - direction (number; optional)

    - color (string; optional)

- bpColors (dict; optional):
    @deprecated since 0.2.2, use `bp_colors`. Removed in 0.3.0.

- bp_colors (dict; optional):
    Object mapping base pairs or indexes to custom colors.

- colors (list of strings; optional):
    Array of colors for annotations, translations, and highlights.

- disableExternalFonts (boolean; optional):
    @deprecated since 0.2.2, use `disable_external_fonts`. Removed in
    0.3.0.

- disable_external_fonts (boolean; default False):
    Whether to disable downloading external fonts.

- enableCopyEvent (boolean; optional):
    @deprecated since 0.2.2, use `enable_copy_event`. Removed in
    0.3.0.

- enableSelectAllEvent (boolean; optional):
    @deprecated since 0.2.2, use `enable_select_all_event`. Removed in
    0.3.0.

- enable_copy_event (boolean; default True):
    When False, disables the default copyEvent (ctrl/cmd + C).

- enable_select_all_event (boolean; default True):
    When False, disables the default selectAllEvent (ctrl/cmd + A).

- enzymes (list of dicts; optional):
    Array of restriction enzymes. Can be enzyme names (strings) or
    custom enzyme objects.

    `enzymes` is a list of string | dict with keys:

    - name (string; required)

    - rseq (string; required)

    - fcut (number; required)

    - rcut (number; required)

    - color (string; optional)

    - range (dict; optional)

        `range` is a dict with keys:

        - start (number; optional)

        - end (number; optional)s

- highlights (list of dicts; optional):
    Array of highlight objects. Each highlight: { start: number, end:
    number, color?: string }.

    `highlights` is a list of dicts with keys:

    - start (number; required)

    - end (number; required)

    - color (string; optional)

- name (string; optional):
    The name of the sequence/plasmid. Shown at the center of the
    circular viewer.

- primers (list of dicts; optional):
    Array of primer objects to render. Each primer: { start: number,
    end: number, name: string, direction: number, color?: string }.

    `primers` is a list of dicts with keys:

    - start (number; required)

    - end (number; required)

    - name (string; required)

    - direction (number; required)

    - color (string; optional)

- rotateOnScroll (boolean; optional):
    @deprecated since 0.2.2, use `rotate_on_scroll`. Removed in 0.3.0.

- rotate_on_scroll (boolean; default True):
    Whether the circular viewer rotates on scroll.

- search (dict; optional):
    Search configuration object. { query: string, mismatch?: number }.

    `search` is a dict with keys:

    - query (string; required)

    - mismatch (number; optional)

- searchResults (list; optional):
    @deprecated since 0.2.2, use `search_results`. Removed in 0.3.0.

- search_results (list; optional):
    Search results emitted by seqviz (read-only for Dash usage).

- selection (dict; optional):
    Selection state object. { start: number, end: number, clockwise?:
    boolean }.

    `selection` is a dict with keys:

    - start (number; required)

    - end (number; required)

    - clockwise (boolean; optional)

- seq (string; optional):
    The sequence to render. Can be DNA, RNA, or amino acid sequence.

- showComplement (boolean; optional):
    @deprecated since 0.2.2, use `show_complement`. Removed in 0.3.0.

- show_complement (boolean; default True):
    Whether to show the complement sequence.

- translations (list of dicts; optional):
    Array of translation objects. Each translation: { start: number,
    end: number, direction: number, name?: string, color?: string }.

    `translations` is a list of dicts with keys:

    - start (number; required)

    - end (number; required)

    - direction (number; required)

    - name (string; optional)

    - color (string; optional)

- viewer (a value equal to: 'linear', 'circular', 'both', 'both_flip'; default 'both'):
    The type and orientation of the sequence viewers. Options:
    \"linear\", \"circular\", \"both\", \"both_flip\".

- zoom (dict; default { linear: 50 }):
    Zoom configuration object. Currently supports: { linear: number }
    (0-100).

    `zoom` is a dict with keys:

    - linear (number; optional)"""
    _children_props = []
    _base_nodes = ['children']
    _namespace = 'dash_seqviz'
    _type = 'SeqViz'
    Annotations = TypedDict(
        "Annotations",
            {
            "start": NumberType,
            "end": NumberType,
            "name": str,
            "direction": NotRequired[NumberType],
            "color": NotRequired[str]
        }
    )

    Primers = TypedDict(
        "Primers",
            {
            "start": NumberType,
            "end": NumberType,
            "name": str,
            "direction": NumberType,
            "color": NotRequired[str]
        }
    )

    Highlights = TypedDict(
        "Highlights",
            {
            "start": NumberType,
            "end": NumberType,
            "color": NotRequired[str]
        }
    )

    Translations = TypedDict(
        "Translations",
            {
            "start": NumberType,
            "end": NumberType,
            "direction": NumberType,
            "name": NotRequired[str],
            "color": NotRequired[str]
        }
    )

    EnzymesRange = TypedDict(
        "EnzymesRange",
            {
            "start": NotRequired[NumberType],
            "end": NotRequired[NumberType]
        }
    )

    Enzymes = TypedDict(
        "Enzymes",
            {
            "name": str,
            "rseq": str,
            "fcut": NumberType,
            "rcut": NumberType,
            "color": NotRequired[str],
            "range": NotRequired["EnzymesRange"]
        }
    )

    Search = TypedDict(
        "Search",
            {
            "query": str,
            "mismatch": NotRequired[NumberType]
        }
    )

    Selection = TypedDict(
        "Selection",
            {
            "start": NumberType,
            "end": NumberType,
            "clockwise": NotRequired[bool]
        }
    )

    Zoom = TypedDict(
        "Zoom",
            {
            "linear": NotRequired[NumberType]
        }
    )


    def __init__(
        self,
        id: typing.Optional[typing.Union[str, dict]] = None,
        seq: typing.Optional[str] = None,
        name: typing.Optional[str] = None,
        viewer: typing.Optional[Literal["linear", "circular", "both", "both_flip"]] = None,
        annotations: typing.Optional[typing.Sequence["Annotations"]] = None,
        primers: typing.Optional[typing.Sequence["Primers"]] = None,
        highlights: typing.Optional[typing.Sequence["Highlights"]] = None,
        translations: typing.Optional[typing.Sequence["Translations"]] = None,
        enzymes: typing.Optional[typing.Sequence[typing.Union[str, "Enzymes"]]] = None,
        search: typing.Optional["Search"] = None,
        selection: typing.Optional["Selection"] = None,
        colors: typing.Optional[typing.Sequence[str]] = None,
        bp_colors: typing.Optional[dict] = None,
        style: typing.Optional[typing.Any] = None,
        zoom: typing.Optional["Zoom"] = None,
        show_complement: typing.Optional[bool] = None,
        rotate_on_scroll: typing.Optional[bool] = None,
        disable_external_fonts: typing.Optional[bool] = None,
        on_selection: typing.Optional[typing.Any] = None,
        on_search: typing.Optional[typing.Any] = None,
        enable_copy_event: typing.Optional[bool] = None,
        enable_select_all_event: typing.Optional[bool] = None,
        search_results: typing.Optional[typing.Sequence] = None,
        bpColors: typing.Optional[dict] = None,
        showComplement: typing.Optional[bool] = None,
        rotateOnScroll: typing.Optional[bool] = None,
        disableExternalFonts: typing.Optional[bool] = None,
        enableCopyEvent: typing.Optional[bool] = None,
        enableSelectAllEvent: typing.Optional[bool] = None,
        onSelection: typing.Optional[typing.Any] = None,
        onSearch: typing.Optional[typing.Any] = None,
        searchResults: typing.Optional[typing.Sequence] = None,
        **kwargs
    ):
        self._prop_names = ['id', 'annotations', 'bpColors', 'bp_colors', 'colors', 'disableExternalFonts', 'disable_external_fonts', 'enableCopyEvent', 'enableSelectAllEvent', 'enable_copy_event', 'enable_select_all_event', 'enzymes', 'highlights', 'name', 'primers', 'rotateOnScroll', 'rotate_on_scroll', 'search', 'searchResults', 'search_results', 'selection', 'seq', 'showComplement', 'show_complement', 'style', 'translations', 'viewer', 'zoom']
        self._valid_wildcard_attributes =            []
        self.available_properties = ['id', 'annotations', 'bpColors', 'bp_colors', 'colors', 'disableExternalFonts', 'disable_external_fonts', 'enableCopyEvent', 'enableSelectAllEvent', 'enable_copy_event', 'enable_select_all_event', 'enzymes', 'highlights', 'name', 'primers', 'rotateOnScroll', 'rotate_on_scroll', 'search', 'searchResults', 'search_results', 'selection', 'seq', 'showComplement', 'show_complement', 'style', 'translations', 'viewer', 'zoom']
        self.available_wildcard_properties =            []
        _explicit_args = kwargs.pop('_explicit_args')
        _locals = locals()
        _locals.update(kwargs)  # For wildcard attrs and excess named props
        args = {k: _locals[k] for k in _explicit_args}

        super(SeqViz, self).__init__(**args)

setattr(SeqViz, "__init__", _explicitize_args(SeqViz.__init__))
