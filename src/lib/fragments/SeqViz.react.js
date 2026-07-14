import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import { SeqViz as SeqVizLib } from 'seqviz';

// Detect the page's active color scheme for theme="auto". Prefers Mantine's
// `data-mantine-color-scheme` on <html> (set by dmc's theme switch), then
// falls back to the prefers-color-scheme media query.
function detectColorScheme() {
    if (typeof document === 'undefined') return 'light';
    const attr = document.documentElement.getAttribute('data-mantine-color-scheme');
    if (attr === 'dark' || attr === 'light') return attr;
    if (typeof window !== 'undefined' && window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
    }
    return 'light';
}

const SVG_NS = 'http://www.w3.org/2000/svg';

// Collect the CSS rules that style the viewer (seqviz's own `.la-vz-*` rules
// and this library's theme overrides) so an exported standalone SVG keeps
// its appearance without the page's external stylesheets.
function collectViewerCss() {
    let out = '';
    for (const sheet of Array.from(document.styleSheets || [])) {
        let rules;
        try {
            rules = sheet.cssRules;
        } catch (e) {
            continue; // cross-origin stylesheet; skip
        }
        if (!rules) continue;
        for (const rule of Array.from(rules)) {
            const sel = rule.selectorText || '';
            if (sel.indexOf('la-vz') !== -1 || sel.indexOf('data-dash-seqviz-theme') !== -1) {
                out += rule.cssText + '\n';
            }
        }
    }
    return out;
}

// Build a self-contained SVG string from the viewer SVG(s) inside `root`.
// Multiple SVGs (e.g. linear seqblocks, or circular+linear) are stacked
// vertically as nested <svg> elements. Returns { svg, width, height } or null.
function buildStandaloneSvg(root, theme, background) {
    const svgs = Array.from(root.querySelectorAll('svg')).filter((s) => {
        if (s.hasAttribute('aria-hidden')) return false; // xkcd wobble-filter defs
        const r = s.getBoundingClientRect();
        return r.width > 1 && r.height > 1;
    });
    if (!svgs.length) return null;

    const serializer = new XMLSerializer();
    let width = 0;
    let height = 0;
    let body = '';
    for (const s of svgs) {
        const r = s.getBoundingClientRect();
        const w = Math.ceil(parseFloat(s.getAttribute('width')) || r.width);
        const h = Math.ceil(parseFloat(s.getAttribute('height')) || r.height);
        const clone = s.cloneNode(true);
        clone.setAttribute('xmlns', SVG_NS);
        clone.setAttribute('x', '0');
        clone.setAttribute('y', String(height));
        clone.setAttribute('width', String(w));
        clone.setAttribute('height', String(h));
        body += serializer.serializeToString(clone);
        width = Math.max(width, w);
        height += h;
    }

    const css = collectViewerCss().replace(/]]>/g, ']]&gt;');
    const svg =
        `<svg xmlns="${SVG_NS}" width="${width}" height="${height}" ` +
        `viewBox="0 0 ${width} ${height}" data-dash-seqviz-theme="${theme}">` +
        `<style><![CDATA[\n${css}]]></style>` +
        `<rect x="0" y="0" width="${width}" height="${height}" fill="${background}"/>` +
        body +
        `</svg>`;
    return { svg, width, height };
}

function svgToDataUri(svg) {
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

// Rasterize an SVG string to a PNG data URI at `scale`x resolution.
function svgToPngDataUri(svg, width, height, scale) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            try {
                const canvas = document.createElement('canvas');
                canvas.width = Math.max(1, Math.round(width * scale));
                canvas.height = Math.max(1, Math.round(height * scale));
                const ctx = canvas.getContext('2d');
                ctx.setTransform(scale, 0, 0, scale, 0, 0);
                ctx.drawImage(img, 0, 0);
                resolve(canvas.toDataURL('image/png'));
            } catch (e) {
                reject(e);
            }
        };
        img.onerror = reject;
        img.src = svgToDataUri(svg);
    });
}

// seqviz selection `type` values that represent a click on a rendered
// feature (as opposed to a bare sequence range or empty selection). Used to
// populate the read-only `clicked_element` prop. seqviz exposes no hover or
// center-index callbacks, so those are intentionally not surfaced.
const FEATURE_SELECTION_TYPES = new Set([
    'ANNOTATION',
    'PRIMER',
    'ENZYME',
    'TRANSLATION',
    'TRANSLATION_HANDLE',
    'HIGHLIGHT',
    'FIND',
]);

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
        export_request,
        max_seq_length,
        aria_label,
        legend,
        hidden_elements,
    } = props;

    const containerRef = useRef(null);

    // theme="auto" tracks the page's color scheme and updates live when a
    // dashboard theme switch flips it.
    const [autoScheme, setAutoScheme] = useState('light');
    useEffect(() => {
        if (theme !== 'auto' || typeof document === 'undefined') return undefined;
        const update = () => setAutoScheme(detectColorScheme());
        update();
        const observer = new MutationObserver(update);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-mantine-color-scheme'],
        });
        const mql = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
        if (mql) {
            if (mql.addEventListener) mql.addEventListener('change', update);
            else mql.addListener(update);
        }
        return () => {
            observer.disconnect();
            if (mql) {
                if (mql.removeEventListener) mql.removeEventListener('change', update);
                else mql.removeListener(update);
            }
        };
    }, [theme]);

    // ---- Built-in interactive legend (Plotly-style) --------------------------
    // `hidden_elements` holds the keys ("<category>:<name|index>") of legend
    // items toggled off. It is a read/write prop: clicks push the new list via
    // setProps so Dash callbacks can observe or control it, with a local mirror
    // so the component still works outside Dash. A click timer distinguishes a
    // single click (toggle one) from a double click (isolate / restore).
    const [hiddenSet, setHiddenSet] = useState(() => new Set(hidden_elements || []));
    useEffect(() => {
        setHiddenSet(new Set(hidden_elements || []));
    }, [hidden_elements]);
    const clickTimer = useRef(null);
    const commitHidden = useCallback((next) => {
        const arr = Array.from(next);
        setHiddenSet(new Set(arr));
        if (setProps) setProps({ hidden_elements: arr });
    }, [setProps]);

    const handleSelection = useCallback((sel) => {
        if (on_selection) {
            on_selection(sel);
        }
        if (setProps) {
            const update = { selection: sel };
            // seqviz emits selections for bare sequence ranges *and* for
            // clicks on features. When a feature was clicked, surface a
            // trimmed clicked_element so Dash callbacks get a clean
            // "user clicked annotation X" signal without inspecting
            // selection.type. Bare sequence selections leave the last
            // clicked_element untouched.
            if (sel && FEATURE_SELECTION_TYPES.has(sel.type)) {
                update.clicked_element = {
                    type: sel.type,
                    name: sel.name || '',
                    start: sel.start,
                    end: sel.end,
                    direction: sel.direction,
                    id: sel.id,
                    color: sel.color,
                };
            }
            setProps(update);
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
        'light', 'dark', 'auto', 'xkcd', 'xkcd-light', 'xkcd-dark',
        'okabe-ito-light', 'okabe-ito-dark',
        'colorbrewer-light', 'colorbrewer-dark',
        'tol-light', 'tol-dark',
    ]);
    // "auto" resolves to the detected page color scheme. Bare 'xkcd' is the
    // historical name for the light variant; normalize it so CSS only ever
    // sees the explicit -light / -dark suffixed form.
    let rawTheme = validThemes.has(theme) ? theme : 'light';
    if (rawTheme === 'auto') rawTheme = autoScheme;
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

    // Palette-applied element arrays. Colors are seeded by index over the FULL
    // array so hiding one item never reshuffles the others' colors; the legend
    // swatches reuse these exact colors.
    const annsColored = applyPalette(annotations) || [];
    const primersColored = applyPalette(primers) || [];
    const translationsColored = applyPalette(translations) || [];
    const highlightsColored = applyPalette(highlights) || [];

    // Legend config. `legend` is a dict (or True for defaults); omit for none.
    const legendCfg = legend === true
        ? {}
        : (legend && typeof legend === 'object' ? legend : null);
    const legendShow = !!legendCfg && legendCfg.show !== false;
    const legendDirection = (legendCfg && legendCfg.direction) === 'horizontal'
        ? 'horizontal' : 'vertical';
    const legendPosition = (legendCfg && legendCfg.position) === 'right'
        ? 'right' : 'bottom';

    const legendKey = (cat, el, i) => `${cat}:${el && el.name ? el.name : i}`;

    const allFacets = [
        {key: 'annotations', label: 'Annotations', singular: 'Annotation', items: annsColored},
        {key: 'translations', label: 'Translations', singular: 'Translation', items: translationsColored},
        {key: 'primers', label: 'Primers', singular: 'Primer', items: primersColored},
        {key: 'highlights', label: 'Highlights', singular: 'Highlight', items: highlightsColored},
    ];
    const wantCategories = legendCfg && Array.isArray(legendCfg.categories)
        ? legendCfg.categories : null;
    const legendFacets = allFacets.filter(
        (f) => f.items.length && (!wantCategories || wantCategories.indexOf(f.key) !== -1)
    );

    // Elements the user has toggled off are removed before rendering.
    const visibleItems = (cat, arr) =>
        arr.filter((el, i) => !hiddenSet.has(legendKey(cat, el, i)));

    // Export: when export_request changes (a new token), serialize the live
    // viewer SVG(s) to a standalone SVG or a rasterized PNG data URI and hand
    // it back via export_result for the app to download.
    useEffect(() => {
        if (!export_request || !setProps) return;
        const root = containerRef.current;
        if (!root) return;
        const fmt = String(export_request.format || 'svg').toLowerCase();
        const background = resolvedTheme.endsWith('dark') ? '#1a1b1e' : '#ffffff';
        const built = buildStandaloneSvg(root, resolvedTheme, background);
        if (!built) {
            setProps({ export_result: null });
            return;
        }
        if (fmt === 'png') {
            const scale = export_request.scale || 2;
            svgToPngDataUri(built.svg, built.width, built.height, scale)
                .then((uri) => setProps({ export_result: uri }))
                .catch(() => setProps({ export_result: null }));
        } else {
            setProps({ export_result: svgToDataUri(built.svg) });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [export_request]);

    const seqvizProps = {
        seq,
        name,
        viewer,
        annotations: visibleItems('annotations', annsColored),
        primers: visibleItems('primers', primersColored),
        highlights: visibleItems('highlights', highlightsColored),
        translations: visibleItems('translations', translationsColored),
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

    // Large-sequence guard: seqviz's linear viewer renders per-base DOM and
    // can hang the tab on very long sequences. When max_seq_length is set and
    // exceeded, show a lightweight placeholder instead of mounting the viewer.
    const seqLen = typeof seq === 'string' ? seq.length : 0;
    const tooLong = typeof max_seq_length === 'number' &&
        max_seq_length >= 0 && seqLen > max_seq_length;

    // Accessible name for the viewer. seqviz renders an unlabeled SVG, so we
    // give the container a role + description (explicit aria_label, else an
    // auto summary). Note: seqviz provides no keyboard navigation of
    // individual features, so this covers labeling only, not focus nav.
    const annCount = Array.isArray(annotations) ? annotations.length : 0;
    const effectiveLabel = aria_label || (
        `Sequence viewer${name ? ': ' + name : ''}` +
        (seqLen ? `, ${seqLen.toLocaleString()} bp` : '') +
        (annCount ? `, ${annCount} annotation${annCount === 1 ? '' : 's'}` : '')
    );

    // Best-effort: label the circular viewer SVG as an image once mounted.
    useEffect(() => {
        const root = containerRef.current;
        if (!root) return undefined;
        const label = () => {
            root.querySelectorAll('.la-vz-viewer-circular').forEach((svg) => {
                svg.setAttribute('role', 'img');
                svg.setAttribute('aria-label', effectiveLabel);
            });
        };
        label();
        const observer = new MutationObserver(label);
        observer.observe(root, { childList: true, subtree: true });
        return () => observer.disconnect();
    }, [effectiveLabel, viewer, seq]);

    // Legend interactions (Plotly semantics): a single click toggles one item's
    // visibility; a double click isolates it (hide the rest), and double
    // clicking the already-isolated item restores all.
    const toggleItem = (k) => {
        const next = new Set(hiddenSet);
        if (next.has(k)) next.delete(k);
        else next.add(k);
        commitHidden(next);
    };
    const isolateItem = (k) => {
        const allKeys = [];
        legendFacets.forEach((f) =>
            f.items.forEach((el, i) => allKeys.push(legendKey(f.key, el, i))));
        const others = allKeys.filter((x) => x !== k);
        const isIsolated = !hiddenSet.has(k) && others.every((x) => hiddenSet.has(x));
        commitHidden(isIsolated ? new Set() : new Set(others));
    };
    const onItemClick = (k) => {
        if (clickTimer.current) return; // the second click of a double click
        clickTimer.current = setTimeout(() => {
            clickTimer.current = null;
            toggleItem(k);
        }, 220);
    };
    const onItemDblClick = (k) => {
        if (clickTimer.current) {
            clearTimeout(clickTimer.current);
            clickTimer.current = null;
        }
        isolateItem(k);
    };

    const legendNode = legendShow && legendFacets.length > 0 ? (
        <div
            className="dash-seqviz-legend"
            data-direction={legendDirection}
            style={{
                // seqviz's linear scroller is position:relative and would
                // otherwise paint over (and swallow clicks to) the legend, so
                // give the legend its own positioned layer on top.
                position: 'relative',
                zIndex: 1,
                font: '13px sans-serif',
                display: 'flex',
                flexWrap: 'wrap',
                flexDirection: legendDirection === 'vertical' ? 'column' : 'row',
                gap: legendDirection === 'vertical' ? '8px 0' : '8px 20px',
                alignItems: legendDirection === 'vertical' ? 'stretch' : 'flex-start',
                ...(legendPosition === 'right'
                    ? { flex: '0 0 auto', maxWidth: 220, overflow: 'auto' }
                    : { marginTop: 10 }),
            }}
        >
            {legendCfg && legendCfg.title ? (
                <div
                    className="dash-seqviz-legend-title"
                    style={{
                        fontWeight: 700, fontSize: '0.8em', textTransform: 'uppercase',
                        letterSpacing: '0.04em', width: '100%', marginBottom: 2,
                    }}
                >
                    {legendCfg.title}
                </div>
            ) : null}
            {legendFacets.map((f) => (
                <div key={f.key} className="dash-seqviz-legend-facet">
                    {legendFacets.length > 1 ? (
                        <div
                            className="dash-seqviz-legend-facet-title"
                            style={{
                                fontWeight: 700, fontSize: '0.72em', textTransform: 'uppercase',
                                letterSpacing: '0.05em', opacity: 0.7, marginBottom: 3,
                            }}
                        >
                            {f.label}
                        </div>
                    ) : null}
                    <div
                        className="dash-seqviz-legend-items"
                        style={{
                            display: 'flex', flexWrap: 'wrap',
                            flexDirection: legendDirection === 'vertical' ? 'column' : 'row',
                            gap: legendDirection === 'vertical' ? '3px 0' : '4px 14px',
                        }}
                    >
                        {f.items.map((el, i) => {
                            const k = legendKey(f.key, el, i);
                            const isHidden = hiddenSet.has(k);
                            const nm = (el && el.name) || `${f.singular} ${i + 1}`;
                            const color = (el && el.color) || '#888';
                            return (
                                <span
                                    key={k}
                                    role="button"
                                    tabIndex={0}
                                    className={`dash-seqviz-legend-item${isHidden ? ' is-hidden' : ''}`}
                                    aria-pressed={!isHidden}
                                    title={`${nm} — click to toggle, double-click to isolate`}
                                    onClick={() => onItemClick(k)}
                                    onDoubleClick={() => onItemDblClick(k)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault();
                                            toggleItem(k);
                                        }
                                    }}
                                    style={{
                                        display: 'inline-flex', alignItems: 'center', gap: 6,
                                        cursor: 'pointer', userSelect: 'none',
                                        opacity: isHidden ? 0.4 : 1,
                                        textDecoration: isHidden ? 'line-through' : 'none',
                                    }}
                                >
                                    <span
                                        aria-hidden="true"
                                        style={{
                                            width: 13, height: 13, borderRadius: 3, background: color,
                                            flex: '0 0 auto', border: '1px solid rgba(0,0,0,0.2)',
                                        }}
                                    />
                                    {nm}
                                </span>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    ) : null;

    const viewerBlock = (
        <React.Fragment>
            {resolvedTheme.startsWith('xkcd') && (
                <svg aria-hidden="true" width="0" height="0" style={{ position: 'absolute' }}>
                    <defs>
                        <filter id="dash-seqviz-xkcd-wobble">
                            <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" seed="1" />
                            <feDisplacementMap in="SourceGraphic" scale="2" />
                        </filter>
                    </defs>
                </svg>
            )}
            <SeqVizLib {...seqvizProps} />
        </React.Fragment>
    );

    return (
        <div
            id={id}
            ref={containerRef}
            data-dash-seqviz-theme={resolvedTheme}
            role="group"
            aria-label={effectiveLabel}
        >
            {tooLong ? (
                <div
                    className="dash-seqviz-too-long"
                    style={{
                        padding: '16px',
                        border: '1px dashed currentColor',
                        borderRadius: 6,
                        opacity: 0.75,
                        font: '14px sans-serif',
                    }}
                >
                    {`Sequence not rendered: ${seqLen.toLocaleString()} bp exceeds ` +
                        `max_seq_length (${max_seq_length.toLocaleString()} bp). ` +
                        `Raise max_seq_length to render, or use viewer="circular" for very long sequences.`}
                </div>
            ) : (legendPosition === 'right' && legendNode ? (
                // Side-by-side: the viewer flexes, the legend is a fixed rail.
                <div style={{ display: 'flex', flexDirection: 'row', gap: 16, alignItems: 'flex-start' }}>
                    <div style={{ flex: '1 1 auto', minWidth: 0 }}>{viewerBlock}</div>
                    {legendNode}
                </div>
            ) : (
                // Default: viewer in normal flow (seqviz sizes itself), legend below.
                <React.Fragment>
                    {viewerBlock}
                    {legendNode}
                </React.Fragment>
            ))}
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
    hidden_elements: [],
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
    clicked_element: PropTypes.object,
    export_request: PropTypes.object,
    export_result: PropTypes.string,
    max_seq_length: PropTypes.number,
    aria_label: PropTypes.string,
    legend: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
    hidden_elements: PropTypes.arrayOf(PropTypes.string),
    theme: PropTypes.oneOf([
        'light', 'dark', 'auto', 'xkcd', 'xkcd-light', 'xkcd-dark',
        'okabe-ito-light', 'okabe-ito-dark',
        'colorbrewer-light', 'colorbrewer-dark',
        'tol-light', 'tol-dark',
    ]),
};

export default SeqViz;
