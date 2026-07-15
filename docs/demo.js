/**
 * dash-seqviz landing page demo.
 * Mirrors the controls from usage.py, driving the seqviz Viewer API.
 * Uses the standalone Viewer() function from seqviz's UMD bundle, which
 * handles its own React rendering internally — no external React needed.
 *
 * Also supports fetching sequences from NCBI by accession using their
 * public eFetch API (CORS-enabled, no backend required).
 */
(function () {
    "use strict";

    // Default annotation-hover template (mirrors the component default).
    var DEFAULT_TOOLTIP_TMPL = "%{name}<br>%{start}..%{end} (%{length} bp)";

    // ---- Default demo data ---------------------------------------------------

    var DEFAULT_SEQ =
        "TTGACGGCTAGCTCAGTCCTAGGTACAGTGCTAGCAATTTCTTAAGACCCACTTTCACATTTAAGTTGTT" +
        "TTTCTAATCCGCATATGATCAATTCAAGGCCGAATAAGAAGGCTGGCTCTGCACCTTGGTGATCAAATAA" +
        "TTCGATAGCTTGTCGTAATAATGGCGGCATACTATCAGTAGTAGGTGTTTCCCTTTCTTCTTTAGCGACT" +
        "TGATGCTCTTGATCTTCCAATACGCAACCTAAAGTAAAATGCCCCACAGCGCTGAGTGCATATAATGCAT" +
        "TCTCTAGTGAAAAACCTTGTTGGCATAAAAAGGCTAATTGATTTTCGAGAGTTTCATACTGTTTTTCTGT" +
        "AGGCCGTGTACCTAAATGTACTTTTGCTCCATCGCGATGACTTAGTAAAGCACATCTAAAACTTTTAGCG" +
        "TTATTACGTAAAAAATCTTGCCAGCTTTCCCCTTCTAAAGGGCAAAAGTGAGTATGGTGCCTATCTAACA" +
        "TCTCAATGGCTAAGGCGTCGAGCAAAGCCCGCTTATTTTTTACATGCCAATACAATGTAGGCTGCTCTAC" +
        "ACCTAGCTTCTGGGCGAGTTTACGGGTTGTTAAACCTTCGATTCCGACCTCATTAAGCAGCTCTAATGCG" +
        "CTGTTAATCACTTTACTTTTATCTAATCTAGACATCATTAATTCCTAATTTTTGTTGACACTCTATCGTT" +
        "GATAGAGTTATTTTACCACTCCCTATCAGTGATAGAGAAAAGAATTC";

    var DEFAULT_NAME = "Demo plasmid";

    var DEFAULT_ANNOTATIONS = [
        { start: 0, end: 35, name: "J23100 Promoter", direction: 1, color: "#3b82f6" },
        { start: 36, end: 160, name: "RBS + ORF", direction: 1, color: "#10b981" },
        { start: 440, end: 540, name: "Terminator", direction: -1, color: "#f59e0b" }
    ];

    // Parallel to DEFAULT_ANNOTATIONS (Plotly-style customdata): row i is
    // [part, role] for annotation i, referenced positionally in a hovertemplate
    // as %{customdata[0]} / %{customdata[1]}.
    var DEFAULT_CUSTOMDATA = [
        ["BBa_J23100", "constitutive promoter"],
        ["BBa_B0034", "expression cassette"],
        ["BBa_B0015", "double terminator"]
    ];

    var DEFAULT_PRIMERS = [
        { start: 0, end: 24, name: "Fwd primer", direction: 1, color: "#ef4444" },
        { start: 500, end: 530, name: "Rev primer", direction: -1, color: "#8b5cf6" }
    ];

    var DEFAULT_TRANSLATIONS = [
        { start: 36, end: 160, direction: 1, name: "ORF 1", color: "#fb7185" }
    ];

    var DEFAULT_HIGHLIGHTS = [
        { start: 200, end: 260, color: "#fde047" }
    ];

    var SAMPLE_ACCESSIONS = [
        "MN623123.1",   // SARS-CoV-2 isolate, linear ~30 kbp
        "NM_000686",    // Human MAOA mRNA, linear ~3 kbp
        "NC_001416.1",  // Lambda phage genome, linear ~48 kbp (dense CDS)
        "J01749.1",     // pBR322 cloning vector, circular ~4.4 kbp
        "NC_012920.1"   // Human mitochondrion, circular ~16.6 kbp
    ];

    // ---- Annotation colors ---------------------------------------------------

    var ANNO_COLORS = [
        "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899",
        "#06b6d4", "#84cc16", "#f97316", "#6366f1", "#14b8a6", "#e11d48"
    ];

    // ---- Theming (mirrors src/lib/fragments/SeqViz.react.js) -----------------

    // CVD-safe qualitative palettes. When a palette theme is active, element
    // colors are seeded from these by index (same idea the Dash wrapper uses).
    var PALETTES = {
        "okabe-ito-light": ["#E69F00", "#56B4E9", "#009E73", "#F0E442", "#0072B2", "#D55E00", "#CC79A7"],
        "okabe-ito-dark":  ["#E69F00", "#56B4E9", "#009E73", "#F0E442", "#0072B2", "#D55E00", "#CC79A7"],
        "colorbrewer-light": ["#66c2a5", "#fc8d62", "#8da0cb", "#e78ac3", "#a6d854", "#ffd92f", "#e5c494", "#b3b3b3"],
        "colorbrewer-dark":  ["#1b9e77", "#d95f02", "#7570b3", "#e7298a", "#66a61e", "#e6ab02", "#a6761d", "#666666"],
        "tol-light": ["#4477AA", "#EE6677", "#228833", "#CCBB44", "#66CCEE", "#AA3377", "#BBBBBB"],
        "tol-dark":  ["#4477AA", "#EE6677", "#228833", "#CCBB44", "#66CCEE", "#AA3377", "#BBBBBB"]
    };

    // seqviz selection types that count as a feature click (for clicked_element).
    var FEATURE_TYPES = {
        ANNOTATION: 1, PRIMER: 1, ENZYME: 1, TRANSLATION: 1,
        TRANSLATION_HANDLE: 1, HIGHLIGHT: 1, FIND: 1
    };

    var SVG_NS = "http://www.w3.org/2000/svg";

    function paletteFor(theme) { return PALETTES[theme] || null; }

    // "auto" resolves to the OS/page color scheme.
    function resolvedTheme() {
        var t = state.theme || "light";
        if (t === "auto") {
            t = (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches)
                ? "dark" : "light";
        }
        return t;
    }

    function isDarkTheme(t) { return /dark$/.test(t); }

    // Seed palette colors by index (used when a palette theme is active).
    function applyPalette(items, palette) {
        if (!palette || !items) { return items; }
        return items.map(function (it, i) {
            return Object.assign({}, it, { color: palette[i % palette.length] });
        });
    }

    // ---- State ---------------------------------------------------------------

    var state = {
        name: DEFAULT_NAME,
        seq: DEFAULT_SEQ,
        annotations: DEFAULT_ANNOTATIONS,
        customdata: DEFAULT_CUSTOMDATA,
        primers: DEFAULT_PRIMERS,
        translations: DEFAULT_TRANSLATIONS,
        highlights: DEFAULT_HIGHLIGHTS,
        viewer: "both",
        zoom: { linear: 60 },
        search: { query: "ttnnnaat", mismatch: 0 },
        showComplement: true,
        rotateOnScroll: true,
        showTranslations: true,
        showPrimers: true,
        showHighlights: true,
        maxSeqLength: null,   // F1 guard; null = off
        bpColors: { A: "#1f78b4", T: "#33a02c", C: "#e31a1c", G: "#ff7f00" },
        // Legend (E2) is a separate `legend()` helper, not a SeqViz prop.
        // Its config: show it, its title, and vertical vs horizontal layout.
        legend: {
            show: true, title: "", direction: "horizontal", position: "bottom",
            // Which element types the legend lists. All four by default (= no
            // constraint); narrowing this maps to the component's
            // legend={"categories": [...]} filter.
            categories: ["annotations", "translations", "primers", "highlights"]
        },
        // Annotation hover tooltip (Plotly-style %{field} template). The demo
        // default references the parallel customdata (part + role) to show it
        // off; blank customdata lines are dropped, so it degrades cleanly.
        tooltip: {
            show: true,
            hovertemplate: "%{name}<br>%{customdata[0]}"
        },
        theme: "light",
        enzymes: ["PstI", "EcoRI", "XbaI", "SpeI"],
        enzymeFilter: "",
        accession: null, // set when a sequence is fetched from NCBI
        email: ""        // tracked from the email input so the snippet stays runnable
    };

    // ---- DOM refs ------------------------------------------------------------

    var el = function (id) { return document.getElementById(id); };

    var enzymeListEl = el("enzyme-list");
    var enzymeSelectedEl = el("enzyme-selected");

    // ---- seqviz Viewer (standalone API) --------------------------------------

    var viewer = null;

    function handleSelection(sel) {
        var node = el("selection-readout");
        var banner = el("copied-banner");
        if (!sel || typeof sel.start !== "number" || typeof sel.end !== "number" || sel.start === sel.end) {
            node.textContent = "selection: none";
            banner.textContent = "";
            return;
        }
        node.textContent = "selection: start=" + sel.start + " end=" + sel.end +
                           " length=" + Math.abs(sel.end - sel.start);
        var start = Math.min(sel.start, sel.end);
        var end   = Math.max(sel.start, sel.end);
        var text  = state.seq.substring(start, end);
        banner.textContent = "Selection: " + text.substring(0, 50) + (text.length > 50 ? "..." : "");

        // clicked_element: only updates on feature clicks (bare selections
        // leave it), mirroring the component's read-only prop.
        if (sel.type && FEATURE_TYPES[sel.type]) {
            el("clicked-readout").textContent = "clicked_element: " + sel.type +
                " " + (sel.name || "") + " (" + sel.start + ".." + sel.end + ")";
        }
    }

    function handleSearch(results) {
        var count = Array.isArray(results) ? results.length : 0;
        el("search-readout").textContent = "search_results: " + count;
    }

    // Elements as the viewer will render them: for a palette theme, colors are
    // seeded from the palette by index; otherwise the configured colors stand.
    function resolvedAnnotations() {
        return applyPalette(state.annotations, paletteFor(resolvedTheme()));
    }

    // Map the demo state to the real component's props (snake_case). The
    // component applies theme palettes and the max_seq_length guard itself, so
    // we pass raw arrays + theme and let it do the work.
    function getProps() {
        return {
            name: state.name,
            seq: state.seq,
            viewer: state.viewer,
            annotations: state.annotations,
            customdata: state.customdata || undefined,
            primers: state.showPrimers ? state.primers : [],
            translations: state.showTranslations ? state.translations : [],
            highlights: state.showHighlights ? state.highlights : [],
            enzymes: state.enzymes,
            search: state.search,
            zoom: state.zoom,
            show_complement: state.showComplement,
            rotate_on_scroll: state.rotateOnScroll,
            bp_colors: state.bpColors,
            theme: state.theme,
            max_seq_length: state.maxSeqLength == null ? undefined : state.maxSeqLength,
            legend: legendProp(),
            tooltip: tooltipProp(),
            on_selection: handleSelection,
            on_search: handleSearch,
            // seqviz needs a definite height (percentage heights collapse with
            // no fixed-height ancestor). A viewport-relative height keeps the
            // viewer prominent while the page stays within one screen.
            style: { height: "52vh", width: "100%", minHeight: "320px" }
        };
    }

    // The rail's legend controls -> the component's `legend` config prop. Null
    // hides the legend entirely.
    function legendProp() {
        var lg = state.legend || {};
        if (!lg.show) { return null; }
        var prop = {
            show: true,
            title: lg.title || "",
            direction: lg.direction || "horizontal",
            position: lg.position || "bottom",
            withBorder: true,
            radius: "sm",
            p: "sm"
        };
        // Only constrain categories when the user has narrowed the set; passing
        // all four is equivalent to the default (list every populated facet).
        var cats = lg.categories;
        if (Array.isArray(cats) && cats.length < 4) {
            prop.categories = cats.slice();
        }
        return prop;
    }

    // The rail's tooltip controls -> the component's `tooltip` prop. False
    // disables hover text; otherwise pass the template through.
    function tooltipProp() {
        var tp = state.tooltip || {};
        if (!tp.show) { return false; }
        return { show: true, hovertemplate: tp.hovertemplate || DEFAULT_TOOLTIP_TMPL };
    }

    // Apply the theme to the wrapper: the CSS in seqviz-themes.css is scoped
    // to [data-dash-seqviz-theme], so setting it recolors the mounted viewer.
    function applyThemeToDom() {
        var t = resolvedTheme();
        var root = el("seqviz-root");
        root.setAttribute("data-dash-seqviz-theme", t);
        root.style.background = isDarkTheme(t) ? "#1a1b1e" : "#fff";
    }

    // The legend is faceted by element type: the viewer color-codes
    // annotations, translations, primers and highlights, so the legend gets a
    // titled section for each *shown* type instead of one flat list. Mirrors
    // what the grouped `legend({...})` Python helper produces.
    function legendFacets() {
        var facets = [];
        var anns = resolvedAnnotations();
        if (anns && anns.length) {
            facets.push({ label: "Annotations", items: anns });
        }
        if (state.showTranslations && state.translations && state.translations.length) {
            facets.push({ label: "Translations", items: state.translations });
        }
        if (state.showPrimers && state.primers && state.primers.length) {
            facets.push({ label: "Primers", items: state.primers });
        }
        if (state.showHighlights && state.highlights && state.highlights.length) {
            facets.push({
                label: "Highlights",
                items: state.highlights.map(function (h, i) {
                    return { color: h.color, name: h.name || ("Highlight " + (i + 1)) };
                })
            });
        }
        return facets;
    }

    function legendItemHtml(a) {
        var color = /^#[0-9a-zA-Z]+$|^[a-zA-Z]+$/.test(a.color || "") ? a.color : "#888";
        return '<span class="legend-item"><span class="legend-swatch" style="background:' +
               color + '"></span>' + escapeHtml(a.name || "(unnamed)") + "</span>";
    }

    function renderLegend() {
        var host = el("legend");
        if (!host) { return; }
        var cfg = state.legend || {};
        var dirClass = cfg.direction === "vertical" ? " is-vertical" : " is-horizontal";
        host.className = "seqviz-legend" + dirClass;

        var facets = legendFacets();
        if (!cfg.show || !facets.length) { host.innerHTML = ""; return; }

        var title = cfg.title
            ? '<div class="legend-title">' + escapeHtml(cfg.title) + "</div>"
            : "";
        var body = facets.map(function (f) {
            var items = f.items.map(legendItemHtml).join("");
            return '<div class="legend-facet">' +
                   '<div class="legend-facet-title">' + escapeHtml(f.label) + "</div>" +
                   '<div class="legend-items">' + items + "</div></div>";
        }).join("");
        host.innerHTML = title + body;
    }

    // aria_label (H1): the auto-generated accessible name the Dash wrapper
    // gives the viewer. Shown as a readout and set on the wrapper element.
    function ariaLabelText() {
        var n = (state.seq || "").length;
        var ac = (state.annotations || []).length;
        return "Sequence viewer" + (state.name ? ": " + state.name : "") +
            (n ? ", " + n.toLocaleString() + " bp" : "") +
            (ac ? ", " + ac + " annotation" + (ac === 1 ? "" : "s") : "");
    }

    function updateAriaLabel() {
        var label = ariaLabelText();
        var root = el("seqviz-root");
        root.setAttribute("role", "group");
        root.setAttribute("aria-label", label);
        var ro = el("aria-readout");
        if (ro) { ro.textContent = "aria_label: " + label; }
    }

    // Render by mounting the REAL dash_seqviz component (bundled standalone for
    // the static site). The component owns the viewer, the interactive legend,
    // theme palettes and the max_seq_length guard, so the demo just maps state
    // to its props and re-renders; React reconciles.
    function render() {
        applyThemeToDom();
        var root = el("seqviz-root");
        if (window.DashSeqVizStandalone) {
            window.DashSeqVizStandalone.render(root, getProps());
        }
        updateAriaLabel();
        updateLiveSnippet();
        renderTemplateVars();
    }

    // Live customdata preview under the Template box: shows what each
    // %{customdata[i]} resolves to for the first annotation (e.g.
    // "BBa_J23100"), so the placeholder is concrete. The self-explanatory
    // built-in fields (%{name}, %{start}, ...) are listed in the static hint.
    function renderTemplateVars() {
        var host = el("tmpl-vars");
        if (!host) { return; }
        host.innerHTML = "";
        var anns = state.annotations || [];
        var a = anns[0];
        var cd = a && state.customdata && state.customdata[0];
        if (!Array.isArray(cd) || !cd.length) { return; }

        var frag = document.createDocumentFragment();
        var head = document.createElement("div");
        head.className = "tv-head";
        head.textContent = "customdata · " + (a.name || "first annotation");
        frag.appendChild(head);
        cd.forEach(function (v, i) {
            var code = document.createElement("code");
            code.textContent = "%{customdata[" + i + "]}";
            var val = document.createElement("span");
            val.className = "tv-val";
            val.textContent = v == null ? "" : String(v);
            frag.appendChild(code);
            frag.appendChild(val);
        });
        host.appendChild(frag);
    }

    // ---- Live Python snippet -------------------------------------------------
    //
    // For fetched accessions we emit `requests.get(...) + file=gb` (matches the
    // pattern in docs/data/examples.js); otherwise an inline `seq="..."` with a
    // truncation comment so long sequences stay readable.

    function pyStr(s) {
        return '"' + String(s)
            .replace(/\\/g, "\\\\")
            .replace(/"/g, '\\"')
            .replace(/\n/g, "\\n")
            .replace(/\r/g, "\\r")
            .replace(/\t/g, "\\t") + '"';
    }

    function pyBool(b) { return b ? "True" : "False"; }

    function generatePythonSnippet(s) {
        var lines = [];
        var usesRequests = !!s.accession;
        var lg = s.legend || {};
        var emitAnns = !usesRequests && s.annotations && s.annotations.length;
        var showLegend = !!lg.show && s.annotations && s.annotations.length;

        lines.push("from dash import Dash, html");
        lines.push("from dash_seqviz import SeqViz");
        if (usesRequests) { lines.push("import requests"); }
        lines.push("");

        // Each shown element type becomes a variable so SeqViz and the
        // faceted legend() can share the same lists. Only for the inline-seq
        // case; a fetched GenBank carries its own features via file=.
        function inlineList(items, mapper) {
            return "[" + items.map(mapper).join(", ") + "]";
        }
        var facetDefs = [];  // { label, varName, def: [lines] }
        if (emitAnns) {
            var annDef = ["annotations = ["];
            s.annotations.forEach(function (a) {
                annDef.push('    {"start": ' + a.start + ', "end": ' + a.end +
                    ', "name": ' + pyStr(a.name || "") +
                    ', "direction": ' + (a.direction || 1) +
                    ', "color": ' + pyStr(a.color || "") + "},");
            });
            annDef.push("]");
            facetDefs.push({ label: "Annotations", varName: "annotations", def: annDef });

            if (s.showTranslations && s.translations && s.translations.length) {
                facetDefs.push({ label: "Translations", varName: "translations", def: [
                    "translations = " + inlineList(s.translations, function (t) {
                        return '{"start": ' + t.start + ', "end": ' + t.end +
                            ', "direction": ' + t.direction + ', "name": ' + pyStr(t.name) +
                            ', "color": ' + pyStr(t.color) + "}";
                    })] });
            }
            if (s.showPrimers && s.primers && s.primers.length) {
                facetDefs.push({ label: "Primers", varName: "primers", def: [
                    "primers = " + inlineList(s.primers, function (p) {
                        return '{"start": ' + p.start + ', "end": ' + p.end +
                            ', "direction": ' + (p.direction || 1) + ', "name": ' + pyStr(p.name) +
                            ', "color": ' + pyStr(p.color) + "}";
                    })] });
            }
            if (s.showHighlights && s.highlights && s.highlights.length) {
                facetDefs.push({ label: "Highlights", varName: "highlights", def: [
                    "highlights = " + inlineList(s.highlights, function (h) {
                        return '{"start": ' + h.start + ', "end": ' + h.end +
                            ', "color": ' + pyStr(h.color) + "}";
                    })] });
            }

            facetDefs.forEach(function (f) { f.def.forEach(function (l) { lines.push(l); }); });
            lines.push("");
        }

        if (usesRequests) {
            lines.push("# Fetch GenBank from NCBI; SeqViz parses it inline via file=");
            lines.push("gb = requests.get(");
            lines.push('    "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi",');
            lines.push('    params={"db": "nuccore", "id": ' + pyStr(s.accession) + ",");
            lines.push('            "rettype": "gb", "retmode": "text",');
            lines.push('            "tool": "myapp", "email": ' + pyStr(s.email || "<your_email>") + "},");
            lines.push("    timeout=10,");
            lines.push(").text");
            lines.push("");
        }

        lines.push("app = Dash(__name__)");
        lines.push("app.layout = html.Div([");
        lines.push("    SeqViz(");
        lines.push('        id="demo",');
        lines.push("        name=" + pyStr(s.name) + ",");

        if (usesRequests) {
            lines.push("        file=gb,");
        } else if (s.seq && s.seq.length > 200) {
            lines.push("        seq=" + pyStr(s.seq.substring(0, 100)) +
                       ",  # ... (" + s.seq.length + " bp total, truncated)");
        } else {
            lines.push("        seq=" + pyStr(s.seq || "") + ",");
        }

        facetDefs.forEach(function (f) {
            lines.push("        " + f.varName + "=" + f.varName + ",");
        });

        lines.push("        viewer=" + pyStr(s.viewer) + ",");
        lines.push("        zoom={\"linear\": " + (s.zoom && s.zoom.linear != null ? s.zoom.linear : 50) + "},");
        lines.push("        show_complement=" + pyBool(s.showComplement) + ",");
        lines.push("        rotate_on_scroll=" + pyBool(s.rotateOnScroll) + ",");
        if (s.theme && s.theme !== "light") {
            lines.push("        theme=" + pyStr(s.theme) + ",");
        }
        if (s.maxSeqLength != null) {
            lines.push("        max_seq_length=" + s.maxSeqLength + ",");
        }

        var bp = s.bpColors || {};
        lines.push("        bp_colors={" +
                   '"A": ' + pyStr(bp.A || "") + ", " +
                   '"T": ' + pyStr(bp.T || "") + ", " +
                   '"C": ' + pyStr(bp.C || "") + ", " +
                   '"G": ' + pyStr(bp.G || "") + "},");

        if (s.enzymes && s.enzymes.length) {
            var enz = s.enzymes.map(pyStr).join(", ");
            lines.push("        enzymes=[" + enz + "],");
        }

        if (s.search && s.search.query) {
            lines.push("        search={\"query\": " + pyStr(s.search.query) +
                       ", \"mismatch\": " + (s.search.mismatch || 0) + "},");
        }

        // Built-in interactive legend (a component prop, not a separate call).
        if (showLegend) {
            var lgOpts = [
                '"show": True',
                '"position": ' + pyStr(lg.position || "bottom"),
                '"direction": ' + pyStr(lg.direction || "horizontal"),
            ];
            if (lg.title) { lgOpts.push('"title": ' + pyStr(lg.title)); }
            var lgCats = lg.categories;
            if (Array.isArray(lgCats) && lgCats.length < 4) {
                lgOpts.push('"categories": [' + lgCats.map(pyStr).join(", ") + "]");
            }
            lines.push("        legend={" + lgOpts.join(", ") + "},");
        }

        // Parallel customdata, emitted only when the hovertemplate references it.
        var tt = s.tooltip || {};
        if (tt.show && tt.hovertemplate && /customdata/.test(tt.hovertemplate) &&
            Array.isArray(s.customdata) && s.customdata.length) {
            var cd = s.customdata.map(function (row) {
                return Array.isArray(row) ? "[" + row.map(pyStr).join(", ") + "]" : pyStr(row);
            }).join(", ");
            lines.push("        customdata=[" + cd + "],");
        }

        // Annotation hover tooltip: True for the default template, else a dict
        // carrying the custom %{field} template.
        if (tt.show) {
            if (tt.hovertemplate && tt.hovertemplate !== DEFAULT_TOOLTIP_TMPL) {
                lines.push("        tooltip={\"hovertemplate\": " + pyStr(tt.hovertemplate) + "},");
            } else {
                lines.push("        tooltip=True,");
            }
        }
        lines.push('        style={"height": "520px", "width": "100%"},');
        lines.push("    )");
        lines.push("])");
        lines.push("");
        lines.push('if __name__ == "__main__":');
        lines.push("    app.run(debug=True)");

        return lines.join("\n");
    }

    function updateLiveSnippet() {
        var node = document.querySelector("#live-snippet code");
        if (!node) { return; }
        node.textContent = generatePythonSnippet(state);
    }

    // ---- NCBI GenBank parser -------------------------------------------------
    //
    // Delegates to the site-wide SeqVizSite.parseGenBank (seqviz-adapter.js),
    // which dynamically imports Lattice Automation's `seqparse` from
    // esm.sh and does the /gene /product /note label extraction, gene+CDS
    // dedup, and translations derivation. Here we just enrich the result
    // with cycling colors from ANNO_COLORS so overlapping annotations stay
    // visually distinct in the Explorer.
    //
    // Returns a Promise; callers need to .then() the result.

    function parseGenBank(text) {
        if (!window.SeqVizSite || typeof window.SeqVizSite.parseGenBank !== "function") {
            return Promise.reject(new Error("SeqVizSite adapter not loaded"));
        }
        return window.SeqVizSite.parseGenBank(text).then(function (result) {
            // Same palette cycling for coincident annotation+translation so
            // a CDS annotation and its amino-acid track get matching colors.
            var colorByKey = {};
            result.annotations.forEach(function (a, i) {
                a.color = ANNO_COLORS[i % ANNO_COLORS.length];
                colorByKey[a.start + ":" + a.end + ":" + a.direction] = a.color;
            });
            result.translations.forEach(function (t) {
                t.color = colorByKey[t.start + ":" + t.end + ":" + t.direction] ||
                          ANNO_COLORS[0];
            });
            return result;
        });
    }

    // ---- NCBI eFetch with safeguards -----------------------------------------
    //
    // Policy enforcement (client-side):
    // - Require a user-provided email (stored in localStorage, sent per NCBI
    //   usage guidelines at https://www.ncbi.nlm.nih.gov/books/NBK25497/)
    //   NOTE: email format is regex-validated only. We can't truly verify
    //   ownership without a backend — real accountability is NCBI's end.
    // - Validate accession format before any network call
    // - Rate limit to 3 requests/second (NCBI unauthenticated cap)
    // - Per-browser daily quota (UTC rollover) to cap total damage
    // - Cache fetched records in memory to avoid re-hitting NCBI
    // - Retry with exponential backoff on 429/503, honor Retry-After
    // - Cap displayable sequence size with a warning for very large records

    var NCBI_EFETCH    = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi";
    var MIN_REQ_GAP_MS = 350;          // ~3 req/s
    var MAX_RETRIES    = 3;
    var LARGE_SEQ_WARN = 500000;       // 500 kb
    var DAILY_QUOTA    = 50;           // requests per browser per UTC day
    var QUOTA_KEY      = "dashSeqviz.quota";

    // Minimal client-side sanity check. We do NOT try to encode NCBI's full
    // accession spec (40+ prefix formats, evolves over time) — NCBI itself is
    // the authoritative validator. This regex only rejects obvious garbage
    // (spaces, HTML, SQL, empty, overly long) to avoid wasted requests.
    // Anything that looks like an alphanumeric identifier passes through;
    // NCBI decides whether it actually exists.
    var ACCESSION_RE = /^[A-Za-z][A-Za-z0-9_.]{2,31}$/;
    var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    var fetchCache = {};
    var lastRequestAt = 0;

    // ---- Daily quota ---------------------------------------------------------

    function todayUTC() {
        var d = new Date();
        return d.getUTCFullYear() + "-" +
               String(d.getUTCMonth() + 1).padStart(2, "0") + "-" +
               String(d.getUTCDate()).padStart(2, "0");
    }

    function readQuota() {
        try {
            var raw = localStorage.getItem(QUOTA_KEY);
            if (!raw) { return { date: todayUTC(), count: 0 }; }
            var parsed = JSON.parse(raw);
            if (parsed.date !== todayUTC()) { return { date: todayUTC(), count: 0 }; }
            return parsed;
        } catch (_) {
            return { date: todayUTC(), count: 0 };
        }
    }

    function writeQuota(q) {
        try { localStorage.setItem(QUOTA_KEY, JSON.stringify(q)); } catch (_) { /* ignore */ }
    }

    function quotaRemaining() {
        return Math.max(0, DAILY_QUOTA - readQuota().count);
    }

    function incrementQuota() {
        var q = readQuota();
        q.count += 1;
        writeQuota(q);
    }

    function parseFasta(text) {
        var lines = text.split("\n");
        var name = "";
        var seq = "";
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i].trim();
            if (line.charAt(0) === ">") {
                name = line.substring(1).trim();
            } else {
                seq += line;
            }
        }
        return { name: name, seq: seq.toUpperCase(), annotations: [], translations: [] };
    }

    function loadParsed(parsed, accession, statusEl) {
        if (!parsed.seq) {
            throw new Error("No sequence found in the record.");
        }

        state.name = parsed.name || accession;
        state.seq = parsed.seq;
        state.annotations = parsed.annotations;
        state.customdata = null;  // parsed annotations carry no parallel customdata
        state.translations = parsed.translations;
        state.primers = [];
        state.highlights = [];  // demo highlights are positioned for the default seq

        var sizeNote = state.seq.length > LARGE_SEQ_WARN
            ? ' <em style="color: #b45309;">(large record &mdash; rendering may be slow)</em>'
            : "";

        statusEl.innerHTML = "Loaded <strong>" + escapeHtml(state.name) + "</strong> &mdash; " +
                             state.seq.length.toLocaleString() + " bp" +
                             (state.annotations.length ? ", " + state.annotations.length + " annotations" : "") +
                             (state.translations.length ? ", " + state.translations.length + " CDS translations" : "") +
                             "." + sizeNote;
        statusEl.style.color = "#16a34a";

        render();
    }

    function sleep(ms) {
        return new Promise(function (resolve) { setTimeout(resolve, ms); });
    }

    // Throttled fetch with retry/backoff. Honors Retry-After for 429/503.
    function rateLimitedFetch(url) {
        var now = Date.now();
        var wait = Math.max(0, lastRequestAt + MIN_REQ_GAP_MS - now);

        return sleep(wait).then(function () {
            lastRequestAt = Date.now();

            var attempt = function (tries) {
                return fetch(url).then(function (res) {
                    if (res.status === 429 || res.status === 503) {
                        if (tries >= MAX_RETRIES) {
                            throw new Error("NCBI is rate-limiting (HTTP " + res.status + "). Please wait a minute and try again.");
                        }
                        var retryAfter = parseFloat(res.headers.get("Retry-After"));
                        var delay = isNaN(retryAfter)
                            ? Math.pow(2, tries) * 1000
                            : retryAfter * 1000;
                        return sleep(delay).then(function () { return attempt(tries + 1); });
                    }
                    if (!res.ok) { throw new Error("HTTP " + res.status); }
                    return res.text();
                });
            };

            return attempt(0);
        });
    }

    function buildUrl(accession, rettype, email) {
        return NCBI_EFETCH +
               "?db=nuccore" +
               "&id=" + encodeURIComponent(accession) +
               "&rettype=" + rettype +
               "&retmode=text" +
               "&tool=dash-seqviz" +
               "&email=" + encodeURIComponent(email);
    }

    function updateQuotaDisplay() {
        var remaining = quotaRemaining();
        var quotaEl = el("quota-display");
        if (quotaEl) {
            quotaEl.textContent = remaining + " / " + DAILY_QUOTA + " NCBI requests left today";
            quotaEl.style.color = remaining < 10 ? "#b45309" : "var(--color-text-muted)";
        }
    }

    function fetchAccession(accessionRaw) {
        var statusEl = el("fetch-status");

        var email = (el("ctrl-email").value || "").trim();
        if (!EMAIL_RE.test(email)) {
            statusEl.textContent = "Please enter a valid email — NCBI requires it for public API use.";
            statusEl.style.color = "#dc2626";
            el("ctrl-email").focus();
            return;
        }

        var accession = (accessionRaw || "").trim();
        if (!accession) {
            statusEl.textContent = "Please enter an accession.";
            statusEl.style.color = "#dc2626";
            return;
        }
        if (!ACCESSION_RE.test(accession)) {
            statusEl.textContent = "\"" + accession + "\" doesn't look like an accession identifier " +
                                   "(letters/digits/underscores/dots, 3-32 chars, starts with a letter).";
            statusEl.style.color = "#dc2626";
            return;
        }

        // Serve from cache if we already fetched this accession this session
        // (doesn't count against the daily quota)
        if (fetchCache[accession]) {
            statusEl.textContent = "Loading cached " + accession + "...";
            statusEl.style.color = "var(--color-text-muted)";
            loadParsed(fetchCache[accession], accession, statusEl);
            return;
        }

        // Enforce daily quota per browser
        if (quotaRemaining() <= 0) {
            statusEl.innerHTML = "Daily NCBI request quota reached (" + DAILY_QUOTA + "/day). " +
                "Resets at 00:00 UTC. For heavier use, please " +
                '<a href="https://ncbiinsights.ncbi.nlm.nih.gov/2017/11/02/new-api-keys-for-the-e-utilities/" target="_blank" rel="noopener">get an NCBI API key</a> ' +
                "and run your workload separately.";
            statusEl.style.color = "#dc2626";
            return;
        }

        statusEl.textContent = "Fetching " + accession + " from NCBI (GenBank format)...";
        statusEl.style.color = "var(--color-text-muted)";
        el("btn-fetch").disabled = true;

        // Reserve a quota slot before the network call so rapid concurrent
        // clicks can't exceed the limit.
        incrementQuota();
        updateQuotaDisplay();

        rateLimitedFetch(buildUrl(accession, "gb", email))
            .then(function (text) {
                if (text.indexOf("LOCUS") === -1) {
                    throw new Error("Not a valid GenBank record — check the accession.");
                }
                return parseGenBank(text);
            })
            .then(function (parsed) {
                fetchCache[accession] = parsed;
                state.accession = accession;
                loadParsed(parsed, accession, statusEl);
            })
            .catch(function (gbErr) {
                statusEl.textContent = "GenBank fetch failed (" + gbErr.message + "), trying FASTA...";
                incrementQuota();
                updateQuotaDisplay();
                return rateLimitedFetch(buildUrl(accession, "fasta", email))
                    .then(function (text) {
                        if (text.charAt(0) !== ">") { throw new Error("Not a valid FASTA record."); }
                        var parsed = parseFasta(text);
                        fetchCache[accession] = parsed;
                        state.accession = accession;
                        statusEl.innerHTML = "";
                        loadParsed(parsed, accession, statusEl);
                        statusEl.innerHTML += ' <em>(FASTA only &mdash; no annotations available)</em>';
                    });
            })
            .catch(function (err) {
                statusEl.textContent = "Failed to fetch " + accession + ": " + err.message +
                    ". Verify the accession or try again in a moment.";
                statusEl.style.color = "#dc2626";
            })
            .finally(function () {
                el("btn-fetch").disabled = false;
            });
    }

    function resetDemo() {
        state.name = DEFAULT_NAME;
        state.seq = DEFAULT_SEQ;
        state.annotations = DEFAULT_ANNOTATIONS;
        state.customdata = DEFAULT_CUSTOMDATA;
        state.primers = DEFAULT_PRIMERS;
        state.translations = DEFAULT_TRANSLATIONS;
        state.highlights = DEFAULT_HIGHLIGHTS;
        state.accession = null;

        el("ctrl-accession").value = "";
        el("fetch-status").textContent = "";

        render();
    }

    function escapeHtml(str) {
        var div = document.createElement("div");
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
    }

    // ---- Figure export (mirrors the component's export_request/result) -------
    //
    // Serializes the live viewer SVG(s) into a self-contained SVG (embedding
    // the la-vz/theme CSS rules) and downloads it, or rasterizes to PNG.

    function collectViewerCss() {
        var out = "";
        var sheets = Array.prototype.slice.call(document.styleSheets || []);
        sheets.forEach(function (sheet) {
            var rules;
            try { rules = sheet.cssRules; } catch (e) { return; }
            if (!rules) { return; }
            Array.prototype.slice.call(rules).forEach(function (rule) {
                var sel = rule.selectorText || "";
                if (sel.indexOf("la-vz") !== -1 || sel.indexOf("data-dash-seqviz-theme") !== -1) {
                    out += rule.cssText + "\n";
                }
            });
        });
        return out;
    }

    function buildStandaloneSvg(root, theme, background) {
        var svgs = Array.prototype.slice.call(root.querySelectorAll("svg")).filter(function (s) {
            if (s.hasAttribute("aria-hidden")) { return false; }
            var r = s.getBoundingClientRect();
            return r.width > 1 && r.height > 1;
        });
        if (!svgs.length) { return null; }

        var serializer = new XMLSerializer();
        var width = 0, height = 0, body = "";
        svgs.forEach(function (s) {
            var r = s.getBoundingClientRect();
            var w = Math.ceil(parseFloat(s.getAttribute("width")) || r.width);
            var h = Math.ceil(parseFloat(s.getAttribute("height")) || r.height);
            var clone = s.cloneNode(true);
            clone.setAttribute("xmlns", SVG_NS);
            clone.setAttribute("x", "0");
            clone.setAttribute("y", String(height));
            clone.setAttribute("width", String(w));
            clone.setAttribute("height", String(h));
            body += serializer.serializeToString(clone);
            width = Math.max(width, w);
            height += h;
        });

        var css = collectViewerCss().replace(/]]>/g, "]]&gt;");
        var svg =
            '<svg xmlns="' + SVG_NS + '" width="' + width + '" height="' + height + '" ' +
            'viewBox="0 0 ' + width + " " + height + '" data-dash-seqviz-theme="' + theme + '">' +
            "<style><![CDATA[\n" + css + "]]></style>" +
            '<rect x="0" y="0" width="' + width + '" height="' + height + '" fill="' + background + '"/>' +
            body + "</svg>";
        return { svg: svg, width: width, height: height };
    }

    function svgToDataUri(svg) {
        return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
    }

    function svgToPngDataUri(svg, width, height, scale) {
        return new Promise(function (resolve, reject) {
            var img = new Image();
            img.onload = function () {
                try {
                    var canvas = document.createElement("canvas");
                    canvas.width = Math.max(1, Math.round(width * scale));
                    canvas.height = Math.max(1, Math.round(height * scale));
                    var ctx = canvas.getContext("2d");
                    ctx.setTransform(scale, 0, 0, scale, 0, 0);
                    ctx.drawImage(img, 0, 0);
                    resolve(canvas.toDataURL("image/png"));
                } catch (e) { reject(e); }
            };
            img.onerror = reject;
            img.src = svgToDataUri(svg);
        });
    }

    function triggerDownload(uri, filename) {
        var a = document.createElement("a");
        a.href = uri;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    function exportFigure(fmt) {
        var t = resolvedTheme();
        var bg = isDarkTheme(t) ? "#1a1b1e" : "#ffffff";
        var built = buildStandaloneSvg(el("seqviz-root"), t, bg);
        if (!built) { return; }
        if (fmt === "png") {
            svgToPngDataUri(built.svg, built.width, built.height, 2)
                .then(function (uri) { triggerDownload(uri, "seqviz-figure.png"); });
        } else {
            triggerDownload(svgToDataUri(built.svg), "seqviz-figure.svg");
        }
    }

    // ---- Enzyme multi-select -------------------------------------------------

    function renderEnzymeList() {
        var filter = state.enzymeFilter.toLowerCase();
        var names = window.NEB_ENZYME_NAMES || [];
        var html = "";
        for (var i = 0; i < names.length; i++) {
            var name = names[i];
            if (filter && name.toLowerCase().indexOf(filter) === -1) { continue; }
            var checked = state.enzymes.indexOf(name) !== -1 ? " checked" : "";
            html += '<label class="enzyme-item">' +
                    '<input type="checkbox" data-enzyme="' + name + '"' + checked + '>' +
                    name + '</label>';
        }
        enzymeListEl.innerHTML = html || '<div style="padding: 8px; color: #94a3b8; font-size: 0.82rem;">No matches</div>';
    }

    function renderEnzymeChips() {
        var html = "";
        for (var i = 0; i < state.enzymes.length; i++) {
            var name = state.enzymes[i];
            html += '<span class="enzyme-chip">' + name +
                    '<button type="button" data-remove="' + name + '" aria-label="Remove ' + name + '">&times;</button>' +
                    '</span>';
        }
        enzymeSelectedEl.innerHTML = html;
    }

    enzymeListEl.addEventListener("change", function (ev) {
        var target = ev.target;
        if (!target || target.tagName !== "INPUT") { return; }
        var name = target.getAttribute("data-enzyme");
        if (!name) { return; }
        if (target.checked) {
            if (state.enzymes.indexOf(name) === -1) {
                state.enzymes = state.enzymes.concat([name]);
            }
        } else {
            state.enzymes = state.enzymes.filter(function (n) { return n !== name; });
        }
        renderEnzymeChips();
        render();
    });

    enzymeSelectedEl.addEventListener("click", function (ev) {
        var target = ev.target;
        if (!target || target.tagName !== "BUTTON") { return; }
        var name = target.getAttribute("data-remove");
        if (!name) { return; }
        state.enzymes = state.enzymes.filter(function (n) { return n !== name; });
        renderEnzymeList();
        renderEnzymeChips();
        render();
    });

    el("enzyme-search").addEventListener("input", function (ev) {
        state.enzymeFilter = ev.target.value;
        renderEnzymeList();
    });

    el("btn-enzyme-clear").addEventListener("click", function () {
        if (state.enzymes.length === 0) { return; }
        state.enzymes = [];
        renderEnzymeList();
        renderEnzymeChips();
        render();
    });

    // ---- Control wiring ------------------------------------------------------

    // The linear-zoom slider only affects the linear track, so hide it when
    // the viewer is purely circular.
    function updateZoomVisibility() {
        var field = el("zoom-field");
        if (!field) { return; }
        field.hidden = (state.viewer === "circular");
    }

    el("ctrl-viewer").addEventListener("change", function (ev) {
        state.viewer = ev.target.value;
        updateZoomVisibility();
        render();
    });

    el("ctrl-zoom").addEventListener("input", function (ev) {
        var v = Number(ev.target.value);
        el("zoom-val").textContent = v;
        state.zoom = { linear: v };
        render();
    });

    el("ctrl-search").addEventListener("input", function (ev) {
        state.search = { query: ev.target.value, mismatch: state.search.mismatch };
        render();
    });

    el("ctrl-mismatch").addEventListener("input", function (ev) {
        var mm = Math.max(0, parseInt(ev.target.value, 10) || 0);
        state.search = { query: state.search.query, mismatch: mm };
        render();
    });

    el("ctrl-complement").addEventListener("change", function (ev) {
        state.showComplement = ev.target.checked;
        render();
    });

    el("ctrl-rotate").addEventListener("change", function (ev) {
        state.rotateOnScroll = ev.target.checked;
        render();
    });

    el("ctrl-translations").addEventListener("change", function (ev) {
        state.showTranslations = ev.target.checked;
        render();
    });

    el("ctrl-primers").addEventListener("change", function (ev) {
        state.showPrimers = ev.target.checked;
        render();
    });

    el("ctrl-highlights").addEventListener("change", function (ev) {
        state.showHighlights = ev.target.checked;
        render();
    });

    // Legend (E2) config: show / layout / title. These don't touch the viewer,
    // so re-render the legend + snippet only.
    function refreshLegend() { render(); }
    var legendShow = el("ctrl-legend-show");
    if (legendShow) {
        legendShow.addEventListener("change", function (ev) {
            state.legend.show = ev.target.checked;
            refreshLegend();
        });
    }
    var legendPos = el("ctrl-legend-pos");
    if (legendPos) {
        legendPos.addEventListener("change", function (ev) {
            state.legend.position = ev.target.value;
            refreshLegend();
        });
    }
    var legendDir = el("ctrl-legend-dir");
    if (legendDir) {
        legendDir.addEventListener("change", function (ev) {
            state.legend.direction = ev.target.value;
            refreshLegend();
        });
    }
    var legendTitle = el("ctrl-legend-title");
    if (legendTitle) {
        legendTitle.addEventListener("input", function (ev) {
            state.legend.title = ev.target.value;
            refreshLegend();
        });
    }
    // Category checkboxes: rebuild the canonical-ordered list from whatever is
    // ticked so the viewer's legend and the live snippet stay in lockstep.
    var legendCats = document.querySelectorAll(".ctrl-legend-cat");
    if (legendCats.length) {
        var syncLegendCats = function () {
            var picked = [];
            legendCats.forEach(function (cb) {
                if (cb.checked) { picked.push(cb.value); }
            });
            state.legend.categories = picked;
            refreshLegend();
        };
        legendCats.forEach(function (cb) {
            cb.addEventListener("change", syncLegendCats);
        });
    }

    // Annotation tooltip: on/off + editable template. The template edit is
    // debounced so a heavy viewer re-render doesn't fire on every keystroke.
    var tooltipShow = el("ctrl-tooltip-show");
    if (tooltipShow) {
        tooltipShow.addEventListener("change", function (ev) {
            state.tooltip.show = ev.target.checked;
            var tmpl = el("ctrl-tooltip-tmpl");
            if (tmpl) { tmpl.disabled = !ev.target.checked; }
            render();
        });
    }
    var tooltipTmpl = el("ctrl-tooltip-tmpl");
    if (tooltipTmpl) {
        var tmplTimer = null;
        tooltipTmpl.addEventListener("input", function (ev) {
            state.tooltip.hovertemplate = ev.target.value;
            if (tmplTimer) { clearTimeout(tmplTimer); }
            tmplTimer = setTimeout(render, 300);
        });
    }

    el("ctrl-maxlen").addEventListener("input", function (ev) {
        var v = ev.target.value.trim();
        state.maxSeqLength = v === "" ? null : Math.max(0, parseInt(v, 10) || 0);
        render();
    });

    el("ctrl-theme").addEventListener("change", function (ev) {
        state.theme = ev.target.value;
        render();
    });

    // Keep "auto" live: re-render if the OS scheme flips while auto is active.
    if (window.matchMedia) {
        var mql = window.matchMedia("(prefers-color-scheme: dark)");
        var onSchemeChange = function () { if (state.theme === "auto") { render(); } };
        if (mql.addEventListener) { mql.addEventListener("change", onSchemeChange); }
        else if (mql.addListener) { mql.addListener(onSchemeChange); }
    }

    el("btn-export-svg").addEventListener("click", function () { exportFigure("svg"); });
    el("btn-export-png").addEventListener("click", function () { exportFigure("png"); });

    function wireBpColor(inputId, base) {
        el(inputId).addEventListener("input", function (ev) {
            var val = (ev.target.value || "").trim();
            var next = Object.assign({}, state.bpColors);
            if (val) { next[base] = val; } else { delete next[base]; }
            state.bpColors = next;
            render();
        });
    }
    wireBpColor("ctrl-bp-a", "A");
    wireBpColor("ctrl-bp-t", "T");
    wireBpColor("ctrl-bp-c", "C");
    wireBpColor("ctrl-bp-g", "G");

    // ---- NCBI fetch wiring ---------------------------------------------------

    // Keep state.email in sync with the input so the live Python snippet
    // echoes whatever the user typed. Field starts empty each session — we
    // intentionally don't restore from localStorage so users always confirm
    // the email being sent to NCBI.
    el("ctrl-email").addEventListener("input", function (ev) {
        state.email = (ev.target.value || "").trim();
        updateLiveSnippet();
    });

    el("btn-fetch").addEventListener("click", function () {
        fetchAccession(el("ctrl-accession").value);
    });

    el("ctrl-accession").addEventListener("keydown", function (ev) {
        if (ev.key === "Enter") { fetchAccession(el("ctrl-accession").value); }
    });

    el("ctrl-email").addEventListener("keydown", function (ev) {
        if (ev.key === "Enter") { fetchAccession(el("ctrl-accession").value); }
    });

    el("btn-reset").addEventListener("click", resetDemo);

    el("btn-accession-sample").addEventListener("click", function () {
        var input = el("ctrl-accession");
        var current = input.value.trim();
        // Avoid re-picking the current value so repeated clicks always cycle.
        var pool = SAMPLE_ACCESSIONS.length > 1 && current
            ? SAMPLE_ACCESSIONS.filter(function (a) { return a !== current; })
            : SAMPLE_ACCESSIONS;
        input.value = pool[Math.floor(Math.random() * pool.length)];
        input.focus();
    });

    // ---- Wheel handling over the viewer --------------------------------------
    // The linear view has its own scroll container (.la-vz-linear-scroller); let
    // wheel events there scroll it natively. Only suppress the default over the
    // circular view, where scrolling rotates instead of scrolling the page.

    el("seqviz-root").addEventListener("wheel", function (ev) {
        if (ev.target.closest && ev.target.closest(".la-vz-linear-scroller")) {
            return;  // let the linear sequence scroll
        }
        if (state.rotateOnScroll) {
            ev.preventDefault();
        }
    }, { passive: false });

    // ---- Init ----------------------------------------------------------------

    renderEnzymeList();
    renderEnzymeChips();
    updateQuotaDisplay();
    updateZoomVisibility();
    render();
})();
