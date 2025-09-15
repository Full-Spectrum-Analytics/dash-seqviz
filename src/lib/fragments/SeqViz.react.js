import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { SeqViz as SeqVizLib } from 'seqviz';

/**
 * SeqViz is a Dash wrapper for the seqviz JavaScript library.
 * It provides DNA, RNA, and protein sequence visualization with
 * circular and linear viewers, annotations, primers, and more.
 */
export default class SeqViz extends Component {
    constructor(props) {
        super(props);
        this.handleSelection = this.handleSelection.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
    }

    handleSelection(selection) {
        const { setProps, onSelection } = this.props;
        if (onSelection) {
            onSelection(selection);
        }
        // Report selection changes back to Dash
        if (setProps) {
            setProps({ selection });
        }
    }

    handleSearch(results) {
        const { setProps, onSearch } = this.props;
        if (onSearch) {
            onSearch(results);
        }
        // Report search results back to Dash
        if (setProps) {
            setProps({ searchResults: results });
        }
    }

    render() {
        const {
            id,
            seq,
            file,
            accession,
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
            setProps,
            ...otherProps
        } = this.props;

        // Remove Dash-specific props that shouldn't be passed to seqviz
        const seqvizProps = {
            seq,
            file,
            accession,
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
            // Map simple Dash booleans to seqviz predicate fns when disabling defaults
            copyEvent: this.props.enableCopyEvent === false ? (() => false) : undefined,
            selectAllEvent: this.props.enableSelectAllEvent === false ? (() => false) : undefined,
            onSelection: this.handleSelection,
            onSearch: this.handleSearch,
            ...otherProps
        };

        return (
            <div id={id}>
                <SeqVizLib {...seqvizProps} />
            </div>
        );
    }
}

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
     * (Deprecated upstream) Sequence file or URL. Prefer parsing with seqparse.
     */
    file: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),

    /**
     * (Deprecated upstream) NCBI accession ID. Prefer parsing with seqparse.
     */
    accession: PropTypes.string,

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
     * Dash-assigned callback that should be called to report property changes
     * to Dash, to make them available for callbacks.
     */
    setProps: PropTypes.func
};
