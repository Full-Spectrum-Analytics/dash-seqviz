import React, {useCallback, useMemo} from 'react';
import PropTypes from 'prop-types';
import { SeqViz as SeqVizLib } from 'seqviz';

// Color-vision-deficiency-safe qualitative palettes, used as the default
// annotation/primer/translation color cycle when the theme requests them
// and the user hasn't supplied their own `colors` prop. Per-annotation
// `color` values supplied by the user always win — seqviz prefers
// element.color over the cycled palette.
const PALETTES = {
    // Okabe & Ito (2008). The de facto standard for categorical CVD-safe
    // data viz. Black dropped from the canonical 8 because it collides
    // with default text on light and is invisible on dark.
    'okabe-ito-light': ['#E69F00', '#56B4E9', '#009E73', '#F0E442', '#0072B2', '#D55E00', '#CC79A7'],
    'okabe-ito-dark':  ['#E69F00', '#56B4E9', '#009E73', '#F0E442', '#0072B2', '#D55E00', '#CC79A7'],
    // ColorBrewer Set2 (soft pastels — naturally a light-background palette).
    'colorbrewer-light': ['#66c2a5', '#fc8d62', '#8da0cb', '#e78ac3', '#a6d854', '#ffd92f', '#e5c494', '#b3b3b3'],
    // ColorBrewer Dark2 (saturated — naturally a dark-background palette).
    'colorbrewer-dark':  ['#1b9e77', '#d95f02', '#7570b3', '#e7298a', '#66a61e', '#e6ab02', '#a6761d', '#666666'],
    // Paul Tol's Bright (7 colors, engineered for CVD distinction).
    'tol-light': ['#4477AA', '#EE6677', '#228833', '#CCBB44', '#66CCEE', '#AA3377', '#BBBBBB'],
    'tol-dark':  ['#4477AA', '#EE6677', '#228833', '#CCBB44', '#66CCEE', '#AA3377', '#BBBBBB'],
};

/**
 * SeqViz is a Dash wrapper for the seqviz JavaScript library.
 * It provides DNA, RNA, and protein sequence visualization with
 * circular and linear viewers, annotations, primers, and more.
 *
 * As of 0.3.0 only snake_case prop names are accepted. The legacy
 * camelCase aliases (bpColors, showComplement, rotateOnScroll,
 * disableExternalFonts, enableCopyEvent, enableSelectAllEvent,
 * onSelection, onSearch, searchResults) were deprecated in 0.2.2 and
 * removed here. The seqviz JS library itself still uses camelCase, so
 * the Dash wrapper translates snake_case props to camelCase before
 * passing them to the underlying component.
 */
const SeqViz = (props) => {
    const {
        id,
        seq,
        name,
        viewer,
        annotations,
        primers,
        highlights,
        translations,
        enzymes,
        search,
        selection,
        colors,
        style,
        zoom,
        setProps,
        bp_colors,
        show_complement,
        rotate_on_scroll,
        disable_external_fonts,
        enable_copy_event,
        enable_select_all_event,
        on_selection,
        on_search,
        theme,
    } = props;

    const handleSelection = useCallback((sel) => {
        if (on_selection) {
            on_selection(sel);
        }
        if (setProps) {
            setProps({ selection: sel });
        }
    }, [setProps, on_selection]);

    const handleSearch = useCallback((results) => {
        if (on_search) {
            on_search(results);
        }
        if (setProps) {
            setProps({ search_results: results });
        }
    }, [setProps, on_search]);

    const copyEvent = useMemo(
        () => (enable_copy_event === false ? (() => false) : undefined),
        [enable_copy_event]
    );

    const selectAllEvent = useMemo(
        () => (enable_select_all_event === false ? (() => false) : undefined),
        [enable_select_all_event]
    );

    const validThemes = new Set([
        'light', 'dark', 'xkcd', 'xkcd-light', 'xkcd-dark',
        'okabe-ito-light', 'okabe-ito-dark',
        'colorbrewer-light', 'colorbrewer-dark',
        'tol-light', 'tol-dark',
    ]);
    // Bare 'xkcd' is the historical name for the light variant; normalize
    // it so CSS only ever sees the explicit -light / -dark suffixed form.
    const rawTheme = validThemes.has(theme) ? theme : 'light';
    const resolvedTheme = rawTheme === 'xkcd' ? 'xkcd-light' : rawTheme;

    // For colorblind themes, walk every element without an explicit `color`
    // and assign one from the palette in array order. The seqviz library
    // colors annotations via its built-in COLORS constant (the `colors`
    // prop is dead), and resolves per-element color via `a.color || ...`,
    // so seeding `a.color` here is the only way to actually swap palettes.
    // Per-element user colors are preserved.
    const themePalette = PALETTES[resolvedTheme];
    const userSuppliedPalette = colors && colors.length > 0 ? colors : null;
    const effectivePalette = userSuppliedPalette || themePalette;

    const applyPalette = (items) => {
        if (!effectivePalette || !items) return items;
        return items.map((item, i) => (
            item && item.color
                ? item
                : { ...item, color: effectivePalette[i % effectivePalette.length] }
        ));
    };

    const seqvizProps = {
        seq,
        name,
        viewer,
        annotations: applyPalette(annotations),
        primers: applyPalette(primers),
        highlights: applyPalette(highlights),
        translations: applyPalette(translations),
        enzymes,
        search,
        selection,
        colors: effectivePalette || colors,
        bpColors: bp_colors,
        style,
        zoom,
        showComplement: show_complement,
        rotateOnScroll: rotate_on_scroll,
        disableExternalFonts: disable_external_fonts,
        copyEvent,
        selectAllEvent,
        onSelection: handleSelection,
        onSearch: handleSearch,
    };

    return (
        <div id={id} data-dash-seqviz-theme={resolvedTheme}>
            {resolvedTheme.startsWith('xkcd') && (
                <svg
                    aria-hidden="true"
                    width="0"
                    height="0"
                    style={{ position: 'absolute' }}
                >
                    <defs>
                        <filter id="dash-seqviz-xkcd-wobble">
                            <feTurbulence
                                type="fractalNoise"
                                baseFrequency="0.02"
                                numOctaves="3"
                                seed="1"
                            />
                            <feDisplacementMap in="SourceGraphic" scale="2" />
                        </filter>
                    </defs>
                </svg>
            )}
            <SeqVizLib {...seqvizProps} />
        </div>
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
    theme: 'light'
};

SeqViz.propTypes = {
    id: PropTypes.string,
    seq: PropTypes.string,
    name: PropTypes.string,
    viewer: PropTypes.oneOf(['linear', 'circular', 'both', 'both_flip']),
    annotations: PropTypes.arrayOf(PropTypes.shape({
        start: PropTypes.number.isRequired,
        end: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        direction: PropTypes.number,
        color: PropTypes.string
    })),
    primers: PropTypes.arrayOf(PropTypes.shape({
        start: PropTypes.number.isRequired,
        end: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        direction: PropTypes.number.isRequired,
        color: PropTypes.string
    })),
    highlights: PropTypes.arrayOf(PropTypes.shape({
        start: PropTypes.number.isRequired,
        end: PropTypes.number.isRequired,
        color: PropTypes.string
    })),
    translations: PropTypes.arrayOf(PropTypes.shape({
        start: PropTypes.number.isRequired,
        end: PropTypes.number.isRequired,
        direction: PropTypes.number.isRequired,
        name: PropTypes.string,
        color: PropTypes.string
    })),
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
    search: PropTypes.shape({
        query: PropTypes.string.isRequired,
        mismatch: PropTypes.number
    }),
    selection: PropTypes.shape({
        start: PropTypes.number.isRequired,
        end: PropTypes.number.isRequired,
        clockwise: PropTypes.bool
    }),
    colors: PropTypes.arrayOf(PropTypes.string),
    style: PropTypes.object,
    zoom: PropTypes.shape({
        linear: PropTypes.number
    }),
    setProps: PropTypes.func,

    bp_colors: PropTypes.object,
    show_complement: PropTypes.bool,
    rotate_on_scroll: PropTypes.bool,
    disable_external_fonts: PropTypes.bool,
    enable_copy_event: PropTypes.bool,
    enable_select_all_event: PropTypes.bool,
    on_selection: PropTypes.func,
    on_search: PropTypes.func,
    search_results: PropTypes.array,
    theme: PropTypes.oneOf([
        'light', 'dark', 'xkcd', 'xkcd-light', 'xkcd-dark',
        'okabe-ito-light', 'okabe-ito-dark',
        'colorbrewer-light', 'colorbrewer-dark',
        'tol-light', 'tol-dark',
    ]),
};

export default SeqViz;
