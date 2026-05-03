/**
 * Thin helpers around the seqviz UMD bundle used on example detail pages
 * and the home-page mini demo. The Explorer has its own richer demo.js.
 *
 * Expects:
 *   window.seqviz    — Viewer bundle (seqviz.min.js, ~3.10.x)
 *
 * Dynamically imports Lattice Automation's seqparse for GenBank parsing
 * (/gene, /product, /note label extraction). We use esm.sh rather than
 * the unpkg UMD bundle because the UMD's webpack build leaves Node
 * require() calls for its internal dependencies (buffer, node-fetch,
 * fast-xml-parser) which blow up in the browser. esm.sh rewrites those
 * into ES-module imports that Just Work.
 */
(function (global) {
    var NCBI_EFETCH = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi";
    var SEQPARSE_URL = "https://esm.sh/seqparse@0.2.2";

    // Cache the dynamic import Promise so we only load the module once
    // per page load. The call is lazy — it doesn't fire until the first
    // parseGenBank() call, which happens after the user fetches an
    // accession, so the cost is amortized.
    var seqparsePromise = null;
    function loadSeqparse() {
        if (seqparsePromise) return seqparsePromise;
        seqparsePromise = import(SEQPARSE_URL).then(function (mod) {
            var fn = (mod && mod.default) || mod;
            if (typeof fn !== "function") {
                throw new Error("seqparse module did not expose a callable default export");
            }
            // Also stash on window so demo.js (Explorer) can reuse
            // the cached instance rather than double-loading the module.
            global.seqparse = fn;
            return fn;
        });
        return seqparsePromise;
    }

    function renderViewer(elementId, opts) {
        if (!global.seqviz || typeof global.seqviz.Viewer !== "function") {
            console.error("seqviz bundle missing");
            return null;
        }
        var el = document.getElementById(elementId);
        if (!el) return null;
        el.innerHTML = "";
        var viewer = global.seqviz.Viewer(elementId, opts);
        viewer.render();
        return viewer;
    }

    /**
     * Parse a GenBank record string into the shape seqviz.Viewer expects.
     *
     * Returns a Promise — both the dynamic import of seqparse AND the
     * seqparse call itself are async, so the whole thing resolves with
     * {name, seq, annotations, translations}.
     *
     * The translations array is derived from CDS annotations (seqviz
     * renders these as separate amino-acid tracks). We dedupe coincident
     * gene+CDS pairs so a single ORF doesn't stack two bars on top of
     * each other.
     */
    function parseGenBank(text) {
        if (!text || text.indexOf("LOCUS") === -1) {
            return Promise.reject(new Error("Not a GenBank record"));
        }

        return loadSeqparse().then(function (seqparse) {
            return seqparse(text);
        }).then(function (parsed) {
            if (!parsed || !parsed.seq) {
                throw new Error("Could not parse GenBank record");
            }

            // Dedupe overlapping annotations: GenBank typically encodes
            // every ORF as a `gene` feature plus a `CDS` feature at the
            // same coordinates. Keep the CDS (richer qualifiers ⇒ better
            // label) and drop the gene so the viewer doesn't stack bars.
            var byCoord = {};
            (parsed.annotations || []).forEach(function (a) {
                var dir = (a.direction == null ? 1 : a.direction);
                var key = a.start + ":" + a.end + ":" + dir;
                var prev = byCoord[key];
                if (!prev) {
                    byCoord[key] = a;
                    return;
                }
                // CDS beats gene. Otherwise whichever has a richer name wins.
                var prevScore = (prev.type === "CDS" ? 2 : 0) +
                                (prev.name && prev.name !== prev.type ? 1 : 0);
                var curScore = (a.type === "CDS" ? 2 : 0) +
                               (a.name && a.name !== a.type ? 1 : 0);
                if (curScore > prevScore) byCoord[key] = a;
            });

            // Some NCBI /note fields are 300+ chars (multi-sentence prose).
            // Keep them readable when seqviz shows them as hover tooltips /
            // inline labels.
            function trim(label) {
                label = String(label || "feature").replace(/\s+/g, " ").trim();
                if (label.length > 64) label = label.slice(0, 61) + "\u2026";
                return label;
            }

            var annotations = [];
            var translations = [];
            Object.keys(byCoord).forEach(function (k) {
                var a = byCoord[k];
                var dir = (a.direction == null ? 1 : a.direction);
                var label = trim(a.name || a.type);
                var entry = {
                    start: a.start,
                    end: a.end,
                    direction: dir,
                    name: label
                };
                annotations.push(entry);
                if (a.type === "CDS") {
                    translations.push({
                        start: a.start,
                        end: a.end,
                        direction: dir,
                        name: label
                    });
                }
            });

            // Stable left-to-right ordering so overlapping annotations
            // stack predictably in the viewer.
            annotations.sort(function (x, y) {
                if (x.start !== y.start) return x.start - y.start;
                return (y.end - y.start) - (x.end - x.start);
            });

            return {
                name: parsed.name || "GenBank",
                seq: String(parsed.seq || "").toUpperCase(),
                annotations: annotations,
                translations: translations
            };
        });
    }

    function fetchAccession(accession, email) {
        var url = NCBI_EFETCH +
            "?db=nuccore&id=" + encodeURIComponent(accession) +
            "&rettype=gb&retmode=text" +
            "&tool=dash-seqviz&email=" + encodeURIComponent(email || "");
        return fetch(url).then(function (r) {
            if (!r.ok) throw new Error("NCBI returned " + r.status);
            return r.text();
        }).then(function (text) {
            return parseGenBank(text);
        });
    }

    function wireCopy(rootEl) {
        if (!rootEl) return;
        var snippets = rootEl.querySelectorAll(".snippet");
        snippets.forEach(function (snip) {
            if (snip.querySelector(".snippet-copy")) return;
            var pre = snip.querySelector("pre");
            if (!pre) return;
            var btn = document.createElement("button");
            btn.type = "button";
            btn.className = "snippet-copy";
            btn.textContent = "Copy";
            btn.addEventListener("click", function () {
                var code = pre.innerText;
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(code).then(function () {
                        btn.classList.add("copied");
                        setTimeout(function () {
                            btn.classList.remove("copied");
                        }, 1000);
                    });
                }
            });
            snip.appendChild(btn);
        });
    }

    global.SeqVizSite = {
        renderViewer: renderViewer,
        parseGenBank: parseGenBank,
        fetchAccession: fetchAccession,
        wireCopy: wireCopy
    };
})(window);
