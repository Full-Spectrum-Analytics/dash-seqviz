import React, {useCallback, useMemo} from 'react';
import PropTypes from 'prop-types';
import { SeqViz as SeqVizLib } from 'seqviz';

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

    bp_colors: PropTypes.object,
    show_complement: PropTypes.bool,
    rotate_on_scroll: PropTypes.bool,
    disable_external_fonts: PropTypes.bool,
    enable_copy_event: PropTypes.bool,
    enable_select_all_event: PropTypes.bool,
    on_selection: PropTypes.func,
    on_search: PropTypes.func,
    search_results: PropTypes.array,
};

export default SeqViz;
