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

    var DEFAULT_PRIMERS = [
        { start: 0, end: 24, name: "Fwd primer", direction: 1, color: "#ef4444" },
        { start: 500, end: 530, name: "Rev primer", direction: -1, color: "#8b5cf6" }
    ];

    var DEFAULT_TRANSLATIONS = [
        { start: 36, end: 160, direction: 1, name: "ORF 1", color: "#fb7185" }
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
        primers: DEFAULT_PRIMERS,
        translations: DEFAULT_TRANSLATIONS,
        viewer: "both",
        zoom: { linear: 60 },
        search: { query: "ttnnnaat", mismatch: 0 },
        showComplement: true,
        rotateOnScroll: true,
        showTranslations: true,
        bpColors: { A: "#1f78b4", T: "#33a02c", C: "#e31a1c", G: "#ff7f00" },
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

    function getProps() {
        var palette = paletteFor(resolvedTheme());
        return {
            name: state.name,
            seq: state.seq,
            viewer: state.viewer,
            annotations: resolvedAnnotations(),
            primers: applyPalette(state.primers, palette),
            translations: state.showTranslations ? applyPalette(state.translations, palette) : [],
            enzymes: state.enzymes,
            search: state.search,
            zoom: state.zoom,
            showComplement: state.showComplement,
            rotateOnScroll: state.rotateOnScroll,
            bpColors: state.bpColors,
            onSelection: handleSelection,
            onSearch: handleSearch,
            style: { height: "500px", width: "100%" }
        };
    }

    // Apply the theme to the wrapper: the CSS in seqviz-themes.css is scoped
    // to [data-dash-seqviz-theme], so setting it recolors the mounted viewer.
    function applyThemeToDom() {
        var t = resolvedTheme();
        var root = el("seqviz-root");
        root.setAttribute("data-dash-seqviz-theme", t);
        root.style.background = isDarkTheme(t) ? "#1a1b1e" : "#fff";
    }

    function renderLegend() {
        var host = el("legend");
        if (!host) { return; }
        var anns = resolvedAnnotations();
        if (!anns || !anns.length) { host.innerHTML = ""; return; }
        host.innerHTML = anns.map(function (a) {
            var color = /^#[0-9a-zA-Z]+$|^[a-zA-Z]+$/.test(a.color || "") ? a.color : "#888";
            return '<span class="legend-item"><span class="legend-swatch" style="background:' +
                   color + '"></span>' + escapeHtml(a.name || "") + "</span>";
        }).join("");
    }

    function render() {
        applyThemeToDom();
        if (!viewer) {
            viewer = seqviz.Viewer("seqviz-root", getProps());
            viewer.render();
        } else {
            viewer.setState(getProps());
        }
        renderLegend();
        updateLiveSnippet();
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

        lines.push("from dash import Dash, html");
        lines.push("from dash_seqviz import SeqViz");
        if (usesRequests) { lines.push("import requests"); }
        lines.push("");

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

        lines.push("        viewer=" + pyStr(s.viewer) + ",");
        lines.push("        zoom={\"linear\": " + (s.zoom && s.zoom.linear != null ? s.zoom.linear : 50) + "},");
        lines.push("        show_complement=" + pyBool(s.showComplement) + ",");
        lines.push("        rotate_on_scroll=" + pyBool(s.rotateOnScroll) + ",");
        if (s.theme && s.theme !== "light") {
            lines.push("        theme=" + pyStr(s.theme) + ",");
        }

        if (s.showTranslations && s.translations && s.translations.length) {
            var trans = s.translations.map(function (t) {
                return '{"start": ' + t.start +
                       ', "end": ' + t.end +
                       ', "direction": ' + t.direction +
                       ', "name": ' + pyStr(t.name) +
                       ', "color": ' + pyStr(t.color) + "}";
            }).join(", ");
            lines.push("        translations=[" + trans + "],");
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

        lines.push('        style={"height": "500px", "width": "100%"},');
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
        state.translations = parsed.translations;
        state.primers = [];

        var sizeNote = state.seq.length > LARGE_SEQ_WARN
            ? ' <em style="color: #b45309;">(large record &mdash; rendering may be slow)</em>'
            : "";

        statusEl.innerHTML = "Loaded <strong>" + escapeHtml(state.name) + "</strong> &mdash; " +
                             state.seq.length.toLocaleString() + " bp" +
                             (state.annotations.length ? ", " + state.annotations.length + " annotations" : "") +
                             (state.translations.length ? ", " + state.translations.length + " CDS translations" : "") +
                             "." + sizeNote;
        statusEl.style.color = "#16a34a";

        viewer = null;
        el("seqviz-root").innerHTML = "";
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
        state.primers = DEFAULT_PRIMERS;
        state.translations = DEFAULT_TRANSLATIONS;
        state.accession = null;

        el("ctrl-accession").value = "";
        el("fetch-status").textContent = "";

        viewer = null;
        el("seqviz-root").innerHTML = "";
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

    el("ctrl-viewer").addEventListener("change", function (ev) {
        state.viewer = ev.target.value;
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

    // ---- Prevent page scroll while rotating circular viewer ------------------

    el("seqviz-root").addEventListener("wheel", function (ev) {
        if (state.rotateOnScroll) {
            ev.preventDefault();
        }
    }, { passive: false });

    // ---- Init ----------------------------------------------------------------

    renderEnzymeList();
    renderEnzymeChips();
    updateQuotaDisplay();
    render();
})();
