import React, {useCallback, useMemo, useEffect, useRef} from 'react';
import PropTypes from 'prop-types';
import { SeqViz as SeqVizLib } from 'seqviz';

/**
 * Map of deprecated camelCase prop names to their snake_case replacements.
 * Removed in dash-seqviz 0.3.0.
 */
const DEPRECATED_PROPS = {
    bpColors: 'bp_colors',
    showComplement: 'show_complement',
    rotateOnScroll: 'rotate_on_scroll',
    disableExternalFonts: 'disable_external_fonts',
    enableCopyEvent: 'enable_copy_event',
    enableSelectAllEvent: 'enable_select_all_event',
    onSelection: 'on_selection',
    onSearch: 'on_search',
};

/**
 * Pick the snake_case value if defined, otherwise fall back to the camelCase
 * value. Used so 0.2.x continues to accept the legacy form.
 */
const pick = (snake, camel) => (snake !== undefined ? snake : camel);

/**
 * SeqViz is a Dash wrapper for the seqviz JavaScript library.
 * It provides DNA, RNA, and protein sequence visualization with
 * circular and linear viewers, annotations, primers, and more.
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
        // canonical (snake_case)
        bp_colors,
        show_complement,
        rotate_on_scroll,
        disable_external_fonts,
        enable_copy_event,
        enable_select_all_event,
        on_selection,
        on_search,
        // deprecated (camelCase) — removed in 0.3.0
        bpColors,
        showComplement,
        rotateOnScroll,
        disableExternalFonts,
        enableCopyEvent,
        enableSelectAllEvent,
        onSelection,
        onSearch,
    } = props;

    // Emit a one-time console warning per deprecated prop seen.
    const warned = useRef(new Set());
    useEffect(() => {
        Object.entries(DEPRECATED_PROPS).forEach(([oldName, newName]) => {
            if (props[oldName] !== undefined && !warned.current.has(oldName)) {
                warned.current.add(oldName);
                // eslint-disable-next-line no-console
                console.warn(
                    `[dash-seqviz] \`${oldName}\` is deprecated and will be removed in 0.3.0. ` +
                    `Use \`${newName}\` instead.`
                );
            }
        });
    }, [props]);

    const resolved_bp_colors = pick(bp_colors, bpColors);
    const resolved_show_complement = pick(show_complement, showComplement);
    const resolved_rotate_on_scroll = pick(rotate_on_scroll, rotateOnScroll);
    const resolved_disable_external_fonts = pick(disable_external_fonts, disableExternalFonts);
    const resolved_enable_copy_event = pick(enable_copy_event, enableCopyEvent);
    const resolved_enable_select_all_event = pick(enable_select_all_event, enableSelectAllEvent);
    const resolved_on_selection = pick(on_selection, onSelection);
    const resolved_on_search = pick(on_search, onSearch);

    const handleSelection = useCallback((sel) => {
        if (resolved_on_selection) {
            resolved_on_selection(sel);
        }
        if (setProps) {
            setProps({ selection: sel });
        }
    }, [setProps, resolved_on_selection]);

    const handleSearch = useCallback((results) => {
        if (resolved_on_search) {
            resolved_on_search(results);
        }
        if (setProps) {
            // Dual-write so callbacks subscribed to the legacy
            // `searchResults` prop continue to fire in 0.2.x.
            // The camelCase write is removed in 0.3.0.
            setProps({ search_results: results, searchResults: results });
        }
    }, [setProps, resolved_on_search]);

    const copyEvent = useMemo(
        () => (resolved_enable_copy_event === false ? (() => false) : undefined),
        [resolved_enable_copy_event]
    );

    const selectAllEvent = useMemo(
        () => (resolved_enable_select_all_event === false ? (() => false) : undefined),
        [resolved_enable_select_all_event]
    );

    const seqvizProps = {
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
        bpColors: resolved_bp_colors,
        style,
        zoom,
        showComplement: resolved_show_complement,
        rotateOnScroll: resolved_rotate_on_scroll,
        disableExternalFonts: resolved_disable_external_fonts,
        copyEvent,
        selectAllEvent,
        onSelection: handleSelection,
        onSearch: handleSearch,
    };

    return (
        <div id={id}>
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
    zoom: { linear: 50 }
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

    // Canonical snake_case props (added in 0.2.2).
    bp_colors: PropTypes.object,
    show_complement: PropTypes.bool,
    rotate_on_scroll: PropTypes.bool,
    disable_external_fonts: PropTypes.bool,
    enable_copy_event: PropTypes.bool,
    enable_select_all_event: PropTypes.bool,
    on_selection: PropTypes.func,
    on_search: PropTypes.func,
    search_results: PropTypes.array,

    // Deprecated camelCase aliases — removed in 0.3.0.
    bpColors: PropTypes.object,
    showComplement: PropTypes.bool,
    rotateOnScroll: PropTypes.bool,
    disableExternalFonts: PropTypes.bool,
    enableCopyEvent: PropTypes.bool,
    enableSelectAllEvent: PropTypes.bool,
    onSelection: PropTypes.func,
    onSearch: PropTypes.func,
    searchResults: PropTypes.array,
};

export default SeqViz;
