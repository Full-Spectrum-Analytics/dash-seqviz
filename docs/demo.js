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

    // ---- Annotation colors ---------------------------------------------------

    var ANNO_COLORS = [
        "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899",
        "#06b6d4", "#84cc16", "#f97316", "#6366f1", "#14b8a6", "#e11d48"
    ];

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
        enzymes: ["PstI", "EcoRI", "XbaI", "SpeI"],
        enzymeFilter: ""
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
    }

    function handleSearch(results) {
        var count = Array.isArray(results) ? results.length : 0;
        el("search-readout").textContent = "searchResults: " + count;
    }

    function getProps() {
        return {
            name: state.name,
            seq: state.seq,
            viewer: state.viewer,
            annotations: state.annotations,
            primers: state.primers,
            translations: state.showTranslations ? state.translations : [],
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

    function render() {
        if (!viewer) {
            viewer = seqviz.Viewer("seqviz-root", getProps());
            viewer.render();
        } else {
            viewer.setState(getProps());
        }
    }

    // ---- NCBI GenBank parser -------------------------------------------------

    function parseGenBank(text) {
        var result = { name: "", seq: "", annotations: [], translations: [] };

        // Prefer short identifiers for the viewer title — seqviz renders it
        // in the center of the circular view and long names break mid-word.
        // Priority: ACCESSION -> LOCUS -> DEFINITION (only if very short)

        var accMatch = text.match(/^ACCESSION\s+(\S+)/m);
        if (accMatch) { result.name = accMatch[1]; }

        if (!result.name) {
            var locusMatch = text.match(/^LOCUS\s+(\S+)/m);
            if (locusMatch) { result.name = locusMatch[1]; }
        }

        // Only fall back to DEFINITION for very short ones that render cleanly
        if (!result.name) {
            var defMatch = text.match(/^DEFINITION\s+(.+?)(?:\n\S|\n$)/ms);
            if (defMatch) {
                var def = defMatch[1].replace(/\s+/g, " ").trim().replace(/\.$/, "");
                if (def.length <= 30) { result.name = def; }
            }
        }

        // Extract sequence from ORIGIN section
        var originMatch = text.match(/ORIGIN\s*\n([\s\S]*?)\/\//);
        if (originMatch) {
            result.seq = originMatch[1].replace(/[\s0-9]/g, "").toUpperCase();
        }

        // Extract features (CDS, gene, regulatory, misc_feature, etc.)
        var featBlock = text.match(/FEATURES\s+Location\/Qualifiers\n([\s\S]*?)(?=ORIGIN|CONTIG)/);
        if (!featBlock) { return result; }

        var features = featBlock[1];
        var featureRegex = /^\s{5}(\S+)\s+(complement\()?<?(\d+)\.\.>?(\d+)\)?\s*\n((?:\s{21}\/[\s\S]*?)(?=\n\s{5}\S|\n(?:ORIGIN|CONTIG)|$))/gm;
        var m;
        var colorIdx = 0;

        while ((m = featureRegex.exec(features)) !== null) {
            var type = m[1];
            var isComplement = !!m[2];
            var start = parseInt(m[3], 10) - 1; // GenBank is 1-based
            var end = parseInt(m[4], 10);
            var qualifiers = m[5];
            var direction = isComplement ? -1 : 1;

            // Extract /gene, /product, /label, /note qualifiers for the name
            var nameVal = extractQualifier(qualifiers, "gene") ||
                          extractQualifier(qualifiers, "product") ||
                          extractQualifier(qualifiers, "label") ||
                          extractQualifier(qualifiers, "note") ||
                          type;

            var color = ANNO_COLORS[colorIdx % ANNO_COLORS.length];
            colorIdx++;

            if (type === "CDS") {
                result.annotations.push({ start: start, end: end, name: nameVal, direction: direction, color: color });
                result.translations.push({ start: start, end: end, direction: direction, name: nameVal, color: color });
            } else if (type === "gene" || type === "regulatory" || type === "promoter" ||
                       type === "terminator" || type === "misc_feature" || type === "rep_origin") {
                result.annotations.push({ start: start, end: end, name: nameVal, direction: direction, color: color });
            }
        }

        return result;
    }

    function extractQualifier(text, key) {
        var re = new RegExp('/' + key + '="([^"]*(?:"\\s+"[^"]*)*)"', "m");
        var m = re.exec(text);
        if (m) { return m[1].replace(/"\s+"/g, "").trim(); }
        return null;
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
    var EMAIL_KEY      = "dashSeqviz.email";
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
        try { localStorage.setItem(EMAIL_KEY, email); } catch (_) { /* private mode — ignore */ }

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
                var parsed = parseGenBank(text);
                fetchCache[accession] = parsed;
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

    // Restore saved email from localStorage (if any)
    try {
        var savedEmail = localStorage.getItem(EMAIL_KEY);
        if (savedEmail) { el("ctrl-email").value = savedEmail; }
    } catch (_) { /* private browsing — ignore */ }

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
