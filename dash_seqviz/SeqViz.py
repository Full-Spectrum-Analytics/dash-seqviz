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

- aria_label (string; optional):
    Accessible name for the viewer. seqviz renders an unlabeled SVG,
    so the component gives its container role=\"group\" with this
    label (and labels the circular SVG as role=\"img\"). Defaults to
    an auto-generated summary (\"Sequence viewer: <name>, <N> bp, <M>
    annotations\"). Note: seqviz provides no keyboard navigation of
    individual features, so this is screen-reader labeling only.

- bp_colors (dict; optional):
    Object mapping base pairs or indexes to custom colors.

- clicked_element (dict; optional):
    Read-only. The most recently clicked feature (annotation, primer,
    enzyme, translation, highlight, or search hit), as { type, name,
    start, end, direction, id, color }. Updated only when a feature is
    clicked (bare sequence selections leave it unchanged), so a
    callback with Input(\"id\", \"clicked_element\") gets clean
    feature-click events. Use it to drive linked views (e.g. highlight
    a table row when its annotation is clicked).  Note: seqviz exposes
    no hover or rotation/center-index callbacks, so those are not
    available as props.

- colors (list of strings; optional):
    Array of colors for annotations, translations, and highlights.

- disable_external_fonts (boolean; default False):
    Whether to disable downloading external fonts.

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

- export_request (dict; optional):
    Write prop to trigger a figure export. Set it to an object like {
    format: \"svg\" | \"png\", scale?: number, token?: any }; the
    component serializes the current viewer and puts a data URI in
    `export_result`. Include a changing `token` (e.g. an n_clicks
    counter) so repeated exports of the same format re-fire. `scale`
    (PNG only, default 2) sets the raster resolution multiplier.

- export_result (string; optional):
    Read-only. The most recent export as a data URI
    (`data:image/svg+xml,…` or `data:image/png;base64,…`). Feed it to
    a download, e.g. set it as the href of an html.A(download=...) via
    a callback.

- highlights (list of dicts; optional):
    Array of highlight objects. Each highlight: { start: number, end:
    number, color?: string }.

    `highlights` is a list of dicts with keys:

    - start (number; required)

    - end (number; required)

    - color (string; optional)

- max_seq_length (number; optional):
    Guard for very long sequences. seqviz's linear viewer renders
    per-base DOM and can hang the tab on multi-megabase input. When
    set and the sequence length exceeds this value, the component
    renders a lightweight placeholder instead of mounting the viewer.
    Omit (default) for no guard. For very long sequences that must
    render, prefer viewer=\"circular\".

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

- rotate_on_scroll (boolean; default True):
    Whether the circular viewer rotates on scroll.

- search (dict; optional):
    Search configuration object. { query: string, mismatch?: number }.

    `search` is a dict with keys:

    - query (string; required)

    - mismatch (number; optional)

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

- show_complement (boolean; default True):
    Whether to show the complement sequence.

- theme (a value equal to: 'light', 'dark', 'auto', 'xkcd', 'xkcd-light', 'xkcd-dark', 'okabe-ito-light', 'okabe-ito-dark', 'colorbrewer-light', 'colorbrewer-dark', 'tol-light', 'tol-dark'; default 'light'):
    Visual theme. The underlying seqviz library hardcodes dark-gray
    text, so this prop applies CSS overrides (shipped with
    dash_seqviz) scoped to a data-dash-seqviz-theme attribute on the
    wrapper, and — for the colorblind themes — injects a CVD-safe
    qualitative palette into the `colors` prop when the user hasn't
    supplied their own.  Available themes: - \"light\" (default) —
    seqviz default. - \"dark\" — adjusts text/tick/selector colors for
    dark backgrounds. - \"auto\" — follow the page color scheme
    (Mantine   data-mantine-color-scheme, else prefers-color-scheme),
    updating live. - \"okabe-ito-light\", \"okabe-ito-dark\" — Okabe &
    Ito's 7-color CVD-safe   palette. The de facto standard for
    categorical CVD-safe data viz. - \"colorbrewer-light\",
    \"colorbrewer-dark\" — ColorBrewer Set2 (light) /   Dark2 (dark).
    CVD-safe qualitative palettes with pastel (Set2) or   saturated
    (Dark2) tones. - \"tol-light\", \"tol-dark\" — Paul Tol's Bright.
    7 colors engineered   for CVD distinction across deuteranopia,
    protanopia, tritanopia.  Per-annotation `color` values supplied by
    the user always override the theme palette, so explicit color
    choices are preserved.  Wire this to a theme switcher via a Dash
    callback — e.g. with dash-mantine-components, read the
    `colorScheme` and push \"dark\" or \"light\" to this prop.

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
        export_request: typing.Optional[dict] = None,
        export_result: typing.Optional[str] = None,
        max_seq_length: typing.Optional[NumberType] = None,
        aria_label: typing.Optional[str] = None,
        clicked_element: typing.Optional[dict] = None,
        theme: typing.Optional[Literal["light", "dark", "auto", "xkcd", "xkcd-light", "xkcd-dark", "okabe-ito-light", "okabe-ito-dark", "colorbrewer-light", "colorbrewer-dark", "tol-light", "tol-dark"]] = None,
        **kwargs
    ):
        self._prop_names = ['id', 'annotations', 'aria_label', 'bp_colors', 'clicked_element', 'colors', 'disable_external_fonts', 'enable_copy_event', 'enable_select_all_event', 'enzymes', 'export_request', 'export_result', 'highlights', 'max_seq_length', 'name', 'primers', 'rotate_on_scroll', 'search', 'search_results', 'selection', 'seq', 'show_complement', 'style', 'theme', 'translations', 'viewer', 'zoom']
        self._valid_wildcard_attributes =            []
        self.available_properties = ['id', 'annotations', 'aria_label', 'bp_colors', 'clicked_element', 'colors', 'disable_external_fonts', 'enable_copy_event', 'enable_select_all_event', 'enzymes', 'export_request', 'export_result', 'highlights', 'max_seq_length', 'name', 'primers', 'rotate_on_scroll', 'search', 'search_results', 'selection', 'seq', 'show_complement', 'style', 'theme', 'translations', 'viewer', 'zoom']
        self.available_wildcard_properties =            []
        _explicit_args = kwargs.pop('_explicit_args')
        _locals = locals()
        _locals.update(kwargs)  # For wildcard attrs and excess named props
        args = {k: _locals[k] for k in _explicit_args}

        super(SeqViz, self).__init__(**args)

setattr(SeqViz, "__init__", _explicitize_args(SeqViz.__init__))
