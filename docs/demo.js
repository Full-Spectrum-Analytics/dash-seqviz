/**
 * dash-seqviz landing page demo.
 * Mirrors the controls from usage.py, driving the seqviz Viewer API.
 * Uses the standalone Viewer() function from seqviz's UMD bundle, which
 * handles its own React rendering internally — no external React needed.
 */
(function () {
    "use strict";

    // ---- Demo data -----------------------------------------------------------

    var DEMO_SEQ =
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

    var DEMO_ANNOTATIONS = [
        { start: 0, end: 35, name: "J23100 Promoter", direction: 1, color: "#3b82f6" },
        { start: 36, end: 160, name: "RBS + ORF", direction: 1, color: "#10b981" },
        { start: 440, end: 540, name: "Terminator", direction: -1, color: "#f59e0b" }
    ];

    var DEMO_PRIMERS = [
        { start: 0, end: 24, name: "Fwd primer", direction: 1, color: "#ef4444" },
        { start: 500, end: 530, name: "Rev primer", direction: -1, color: "#8b5cf6" }
    ];

    var DEMO_TRANSLATIONS = [
        { start: 36, end: 160, direction: 1, name: "ORF 1", color: "#fb7185" }
    ];

    // ---- State ---------------------------------------------------------------

    var state = {
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

    // ---- seqviz Viewer (standalone API — no external React needed) -----------

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
        var text  = DEMO_SEQ.substring(start, end);
        banner.textContent = "Selection: " + text.substring(0, 50) + (text.length > 50 ? "..." : "");
    }

    function handleSearch(results) {
        var count = Array.isArray(results) ? results.length : 0;
        el("search-readout").textContent = "searchResults: " + count;
    }

    function getProps() {
        return {
            name: "Demo plasmid",
            seq: DEMO_SEQ,
            viewer: state.viewer,
            annotations: DEMO_ANNOTATIONS,
            primers: DEMO_PRIMERS,
            translations: state.showTranslations ? DEMO_TRANSLATIONS : [],
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
            if (state.enzymes.indexOf(name) === -1) { state.enzymes.push(name); }
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

    // ---- Init ----------------------------------------------------------------

    renderEnzymeList();
    renderEnzymeChips();
    render();
})();
