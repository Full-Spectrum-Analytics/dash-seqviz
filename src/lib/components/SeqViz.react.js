import React from 'react';
import PropTypes from 'prop-types';
import { SeqViz as RealComponent } from '../LazyLoader';

/**
 * SeqViz is a Dash wrapper for the seqviz JavaScript library.
 * It provides DNA, RNA, and protein sequence visualization with
 * circular and linear viewers, annotations, primers, and more.
 */
const SeqViz = (props) => {
    return (
        <React.Suspense fallback={null}>
            <RealComponent {...props}/>
        </React.Suspense>
    );
};

SeqViz.defaultProps = {
    viewer: 'both',
    annotations: [],
    primers: [],
    highlights: [],
    translations: [],
    enzymes: [],
    colors: [],
    bp_colors: {},
    show_complement: true,
    rotate_on_scroll: true,
    disable_external_fonts: false,
    zoom: { linear: 50 },
    enable_copy_event: true,
    enable_select_all_event: true,
    hidden_elements: [],
    theme: 'light'
};

SeqViz.propTypes = {
    /**
     * The ID used to identify this component in Dash callbacks.
     */
    id: PropTypes.string,

    /**
     * The sequence to render. Can be DNA, RNA, or amino acid sequence.
     */
    seq: PropTypes.string,

    /**
     * The name of the sequence/plasmid. Shown at the center of the circular viewer.
     */
    name: PropTypes.string,

    /**
     * The type and orientation of the sequence viewers.
     * Options: "linear", "circular", "both", "both_flip"
     */
    viewer: PropTypes.oneOf(['linear', 'circular', 'both', 'both_flip']),

    /**
     * Array of annotation objects to render.
     * Each annotation: { start: number, end: number, name: string, direction?: number, color?: string }
     */
    annotations: PropTypes.arrayOf(PropTypes.shape({
        start: PropTypes.number.isRequired,
        end: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        direction: PropTypes.number,
        color: PropTypes.string
    })),

    /**
     * Array of primer objects to render.
     * Each primer: { start: number, end: number, name: string, direction: number, color?: string }
     */
    primers: PropTypes.arrayOf(PropTypes.shape({
        start: PropTypes.number.isRequired,
        end: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        direction: PropTypes.number.isRequired,
        color: PropTypes.string
    })),

    /**
     * Array of highlight objects.
     * Each highlight: { start: number, end: number, color?: string }
     */
    highlights: PropTypes.arrayOf(PropTypes.shape({
        start: PropTypes.number.isRequired,
        end: PropTypes.number.isRequired,
        color: PropTypes.string
    })),

    /**
     * Array of translation objects.
     * Each translation: { start: number, end: number, direction: number, name?: string, color?: string }
     */
    translations: PropTypes.arrayOf(PropTypes.shape({
        start: PropTypes.number.isRequired,
        end: PropTypes.number.isRequired,
        direction: PropTypes.number.isRequired,
        name: PropTypes.string,
        color: PropTypes.string
    })),

    /**
     * Array of restriction enzymes.
     * Can be enzyme names (strings) or custom enzyme objects.
     */
    enzymes: PropTypes.arrayOf(PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            rseq: PropTypes.string.isRequired,
            fcut: PropTypes.number.isRequired,
            rcut: PropTypes.number.isRequired,
            color: PropTypes.string,
            range: PropTypes.shape({
                start: PropTypes.number,
                end: PropTypes.number
            })
        })
    ])),

    /**
     * Search configuration object.
     * { query: string, mismatch?: number }
     */
    search: PropTypes.shape({
        query: PropTypes.string.isRequired,
        mismatch: PropTypes.number
    }),

    /**
     * Selection state object.
     * { start: number, end: number, clockwise?: boolean }
     */
    selection: PropTypes.shape({
        start: PropTypes.number.isRequired,
        end: PropTypes.number.isRequired,
        clockwise: PropTypes.bool
    }),

    /**
     * Array of colors for annotations, translations, and highlights.
     */
    colors: PropTypes.arrayOf(PropTypes.string),

    /**
     * Object mapping base pairs or indexes to custom colors.
     */
    bp_colors: PropTypes.object,

    /**
     * CSS styles for the outer container div.
     */
    style: PropTypes.object,

    /**
     * Zoom configuration object.
     * Currently supports: { linear: number } (0-100)
     */
    zoom: PropTypes.shape({
        linear: PropTypes.number
    }),

    /**
     * Whether to show the complement sequence.
     */
    show_complement: PropTypes.bool,

    /**
     * Whether the circular viewer rotates on scroll.
     */
    rotate_on_scroll: PropTypes.bool,

    /**
     * Whether to disable downloading external fonts.
     */
    disable_external_fonts: PropTypes.bool,

    /**
     * Callback function for selection events.
     */
    on_selection: PropTypes.func,

    /**
     * Callback function for search events.
     */
    on_search: PropTypes.func,

    /**
     * When false, disables the default copyEvent (ctrl/cmd + C).
     */
    enable_copy_event: PropTypes.bool,

    /**
     * When false, disables the default selectAllEvent (ctrl/cmd + A).
     */
    enable_select_all_event: PropTypes.bool,

    /**
     * Search results emitted by seqviz (read-only for Dash usage).
     */
    search_results: PropTypes.array,

    /**
     * Write prop to trigger a figure export. Set it to an object like
     * { format: "svg" | "png", scale?: number, token?: any }; the component
     * serializes the current viewer and puts a data URI in `export_result`.
     * Include a changing `token` (e.g. an n_clicks counter) so repeated
     * exports of the same format re-fire. `scale` (PNG only, default 2) sets
     * the raster resolution multiplier.
     */
    export_request: PropTypes.object,

    /**
     * Read-only. The most recent export as a data URI (`data:image/svg+xml,…`
     * or `data:image/png;base64,…`). Feed it to a download, e.g. set it as
     * the href of an html.A(download=...) via a callback.
     */
    export_result: PropTypes.string,

    /**
     * Guard for very long sequences. seqviz's linear viewer renders per-base
     * DOM and can hang the tab on multi-megabase input. When set and the
     * sequence length exceeds this value, the component renders a lightweight
     * placeholder instead of mounting the viewer. Omit (default) for no
     * guard. For very long sequences that must render, prefer
     * viewer="circular".
     */
    max_seq_length: PropTypes.number,

    /**
     * Accessible name for the viewer. seqviz renders an unlabeled SVG, so the
     * component gives its container role="group" with this label (and labels
     * the circular SVG as role="img"). Defaults to an auto-generated summary
     * ("Sequence viewer: <name>, <N> bp, <M> annotations"). Note: seqviz
     * provides no keyboard navigation of individual features, so this is
     * screen-reader labeling only.
     */
    aria_label: PropTypes.string,

    /**
     * Read-only. The most recently clicked feature (annotation, primer,
     * enzyme, translation, highlight, or search hit), as
     * { type, name, start, end, direction, id, color }. Updated only when a
     * feature is clicked (bare sequence selections leave it unchanged), so a
     * callback with Input("id", "clicked_element") gets clean feature-click
     * events. Use it to drive linked views (e.g. highlight a table row when
     * its annotation is clicked).
     *
     * Note: seqviz exposes no hover or rotation/center-index callbacks, so
     * those are not available as props.
     */
    clicked_element: PropTypes.object,

    /**
     * Built-in interactive legend. Set to a dict (or True for defaults) to
     * render a Plotly-style legend around the viewer; omit for none. Options
     * follow Dash Mantine conventions. Keys:
     * - show (bool): render the legend (default True when `legend` is given).
     * - title (str): optional heading above the sections.
     * - position ("top" | "right" | "bottom" | "left"): which side of the
     *   viewer to place the legend on. Default "bottom".
     * - direction ("vertical" | "horizontal"): item flow. Defaults to
     *   horizontal for top/bottom and vertical for left/right.
     * - align ("start" | "center" | "end"): cross-axis alignment of items.
     * - size ("xs" | "sm" | "md" | "lg" | "xl"): text + swatch scale.
     *   Default "sm".
     * - spacing, radius ("xs".."xl" or a number of px): gap between items, and
     *   the swatch + container corner radius.
     * - withBorder (bool): wrap the legend in a bordered surface.
     * - p ("xs".."xl" or number): inner padding, applied when withBorder.
     * - categories (list of str): which element types to include, any of
     *   "annotations", "translations", "primers", "highlights". Default: every
     *   type that has items.
     *
     * Interaction mirrors Plotly legends: single-click an item to hide/show it,
     * double-click to isolate it (hide the others), and double-click the
     * isolated item again to restore all. Swatch colors match what the viewer
     * renders (theme palettes included).
     */
    legend: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),

    /**
     * Read/write. Keys of the legend items currently toggled off (hidden from
     * the viewer), each formatted "<category>:<name>" (or "<category>:<index>"
     * for unnamed items such as highlights). The component updates this as the
     * user clicks the legend, so a callback can observe which elements are
     * hidden; set it from a callback to control visibility programmatically.
     */
    hidden_elements: PropTypes.arrayOf(PropTypes.string),

    /**
     * Visual theme. The underlying seqviz library hardcodes dark-gray text,
     * so this prop applies CSS overrides (shipped with dash_seqviz) scoped
     * to a data-dash-seqviz-theme attribute on the wrapper, and — for the
     * colorblind themes — injects a CVD-safe qualitative palette into the
     * `colors` prop when the user hasn't supplied their own.
     *
     * Available themes:
     * - "light" (default) — seqviz default.
     * - "dark" — adjusts text/tick/selector colors for dark backgrounds.
     * - "auto" — follow the page color scheme (Mantine
     *   data-mantine-color-scheme, else prefers-color-scheme), updating live.
     * - "okabe-ito-light", "okabe-ito-dark" — Okabe & Ito's 7-color CVD-safe
     *   palette. The de facto standard for categorical CVD-safe data viz.
     * - "colorbrewer-light", "colorbrewer-dark" — ColorBrewer Set2 (light) /
     *   Dark2 (dark). CVD-safe qualitative palettes with pastel (Set2) or
     *   saturated (Dark2) tones.
     * - "tol-light", "tol-dark" — Paul Tol's Bright. 7 colors engineered
     *   for CVD distinction across deuteranopia, protanopia, tritanopia.
     *
     * Per-annotation `color` values supplied by the user always override
     * the theme palette, so explicit color choices are preserved.
     *
     * Wire this to a theme switcher via a Dash callback — e.g. with
     * dash-mantine-components, read the `colorScheme` and push "dark" or
     * "light" to this prop.
     */
    theme: PropTypes.oneOf([
        'light', 'dark', 'auto', 'xkcd', 'xkcd-light', 'xkcd-dark',
        'okabe-ito-light', 'okabe-ito-dark',
        'colorbrewer-light', 'colorbrewer-dark',
        'tol-light', 'tol-dark',
    ]),

    /**
     * Dash-assigned callback that should be called to report property changes
     * to Dash, to make them available for callbacks.
     */
    setProps: PropTypes.func
};

export default SeqViz;

export const defaultProps = SeqViz.defaultProps;
export const propTypes = SeqViz.propTypes;
