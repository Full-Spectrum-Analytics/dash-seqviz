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

        // Extract name from LOCUS line
        var locusMatch = text.match(/^LOCUS\s+(\S+)/m);
        if (locusMatch) { result.name = locusMatch[1]; }

        // Extract DEFINITION for a friendlier name
        var defMatch = text.match(/^DEFINITION\s+(.+?)(?:\n\S|\n$)/ms);
        if (defMatch) {
            var def = defMatch[1].replace(/\s+/g, " ").trim();
            if (def.length < 80) { result.name = def.replace(/\.$/, ""); }
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

    // ---- NCBI eFetch / EBI fallback -------------------------------------------

    var NCBI_EFETCH = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi";
    var EBI_FETCH   = "https://www.ebi.ac.uk/ena/browser/api/embl/";

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

        statusEl.innerHTML = "Loaded <strong>" + escapeHtml(state.name) + "</strong> &mdash; " +
                             state.seq.length.toLocaleString() + " bp" +
                             (state.annotations.length ? ", " + state.annotations.length + " annotations" : "") +
                             (state.translations.length ? ", " + state.translations.length + " CDS translations" : "") +
                             ".";
        statusEl.style.color = "#16a34a";

        viewer = null;
        el("seqviz-root").innerHTML = "";
        render();
    }

    function fetchAccession(accession) {
        var statusEl = el("fetch-status");
        accession = (accession || "").trim();
        if (!accession) {
            statusEl.textContent = "Please enter an accession.";
            statusEl.style.color = "#dc2626";
            return;
        }

        statusEl.textContent = "Fetching " + accession + " from NCBI (GenBank format)...";
        statusEl.style.color = "var(--color-text-muted)";
        el("btn-fetch").disabled = true;

        var ncbiUrl = NCBI_EFETCH + "?db=nuccore&id=" + encodeURIComponent(accession) +
                      "&rettype=gb&retmode=text&tool=dash-seqviz&email=evanroyrees@gmail.com";

        fetch(ncbiUrl)
            .then(function (res) {
                if (!res.ok) { throw new Error("HTTP " + res.status); }
                return res.text();
            })
            .then(function (text) {
                if (text.indexOf("LOCUS") === -1) {
                    throw new Error("Not a valid GenBank record.");
                }
                var parsed = parseGenBank(text);
                loadParsed(parsed, accession, statusEl);
            })
            .catch(function (ncbiErr) {
                // NCBI may fail due to CORS — try NCBI FASTA as fallback
                statusEl.textContent = "NCBI GenBank failed (" + ncbiErr.message + "), trying FASTA...";

                var fastaUrl = NCBI_EFETCH + "?db=nuccore&id=" + encodeURIComponent(accession) +
                               "&rettype=fasta&retmode=text&tool=dash-seqviz&email=evanroyrees@gmail.com";

                return fetch(fastaUrl)
                    .then(function (res) {
                        if (!res.ok) { throw new Error("HTTP " + res.status); }
                        return res.text();
                    })
                    .then(function (text) {
                        if (text.charAt(0) !== ">") { throw new Error("Not a valid FASTA record."); }
                        var parsed = parseFasta(text);
                        statusEl.innerHTML = "";
                        loadParsed(parsed, accession, statusEl);
                        statusEl.innerHTML += " <em>(FASTA only — no annotations. GenBank format was unavailable.)</em>";
                    });
            })
            .catch(function (err) {
                statusEl.textContent = "Failed to fetch: " + err.message +
                    ". NCBI may not support CORS from this browser. Try a different accession or use the demo sequence.";
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

    el("btn-fetch").addEventListener("click", function () {
        fetchAccession(el("ctrl-accession").value);
    });

    el("ctrl-accession").addEventListener("keydown", function (ev) {
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
    render();
})();
