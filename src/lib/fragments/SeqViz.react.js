import React, {useCallback, useMemo} from 'react';
import PropTypes from 'prop-types';
import { SeqViz as SeqVizLib } from 'seqviz';

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
        bpColors,
        style,
        zoom,
        showComplement,
        rotateOnScroll,
        disableExternalFonts,
        enableCopyEvent,
        enableSelectAllEvent,
        setProps,
        onSelection,
        onSearch,
    } = props;

    const handleSelection = useCallback((sel) => {
        if (onSelection) {
            onSelection(sel);
        }
        if (setProps) {
            setProps({ selection: sel });
        }
    }, [setProps, onSelection]);

    const handleSearch = useCallback((results) => {
        if (onSearch) {
            onSearch(results);
        }
        if (setProps) {
            setProps({ searchResults: results });
        }
    }, [setProps, onSearch]);

    const copyEvent = useMemo(
        () => (enableCopyEvent === false ? (() => false) : undefined),
        [enableCopyEvent]
    );

    const selectAllEvent = useMemo(
        () => (enableSelectAllEvent === false ? (() => false) : undefined),
        [enableSelectAllEvent]
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
        bpColors,
        style,
        zoom,
        showComplement,
        rotateOnScroll,
        disableExternalFonts,
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
    bpColors: {},
    showComplement: true,
    rotateOnScroll: true,
    disableExternalFonts: false,
    zoom: { linear: 50 }
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
    bpColors: PropTypes.object,

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
    showComplement: PropTypes.bool,

    /**
     * Whether the circular viewer rotates on scroll.
     */
    rotateOnScroll: PropTypes.bool,

    /**
     * Whether to disable downloading external fonts.
     */
    disableExternalFonts: PropTypes.bool,

    /**
     * Callback function for selection events.
     */
    onSelection: PropTypes.func,

    /**
     * Callback function for search events.
     */
    onSearch: PropTypes.func,

    /**
     * When false, disables the default copyEvent (ctrl/cmd + C).
     * Dash cannot pass JS functions, so use this boolean to control behavior.
     */
    enableCopyEvent: PropTypes.bool,

    /**
     * When false, disables the default selectAllEvent (ctrl/cmd + A).
     * Dash cannot pass JS functions, so use this boolean to control behavior.
     */
    enableSelectAllEvent: PropTypes.bool,

    /**
     * Search results emitted by seqviz (read-only for Dash usage).
     */
    searchResults: PropTypes.array,

    /**
     * Dash-assigned callback that should be called to report property changes
     * to Dash, to make them available for callbacks.
     */
    setProps: PropTypes.func
};

export default SeqViz;
