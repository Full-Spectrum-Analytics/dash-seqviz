/**
 * Thin helpers around the seqviz UMD bundle used on example detail pages
 * and the home-page mini demo. The Explorer has its own richer demo.js.
 *
 * Expects: window.seqviz (3.10.x), window.NEB_ENZYME_NAMES.
 */
(function (global) {
    var NCBI_EFETCH = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi";

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

    function parseGenBank(text) {
        if (!text || text.indexOf("LOCUS") === -1) return null;

        var locusMatch = text.match(/^LOCUS\s+(\S+)/m);
        var accMatch = text.match(/^ACCESSION\s+(\S+)/m);
        var defMatch = text.match(/^DEFINITION\s+([\s\S]+?)(?=\n[A-Z]{2})/m);

        var name = "";
        if (accMatch) name = accMatch[1];
        else if (locusMatch) name = locusMatch[1];
        else if (defMatch) {
            var d = defMatch[1].replace(/\s+/g, " ").trim();
            if (d.length <= 30) name = d;
        }
        name = name || "GenBank";

        var originIdx = text.indexOf("\nORIGIN");
        if (originIdx === -1) return null;
        var originBlock = text.slice(originIdx);
        var seq = originBlock.replace(/[^acgtACGTnN]/g, "").toUpperCase();
        if (!seq) return null;

        var annotations = [];
        var translations = [];
        var featStart = text.indexOf("\nFEATURES");
        if (featStart !== -1) {
            var featBlock = text.slice(featStart, originIdx);
            var featRe = /\n\s{5}(\S+)\s+(complement\()?(\d+)\.\.(\d+)\)?/g;
            var m;
            while ((m = featRe.exec(featBlock)) !== null) {
                var type = m[1];
                var dir = m[2] ? -1 : 1;
                var start = parseInt(m[3], 10) - 1;
                var end = parseInt(m[4], 10);
                if (type === "CDS" || type === "gene" || type === "regulatory" ||
                    type === "misc_feature" || type === "promoter" || type === "terminator") {
                    annotations.push({ start: start, end: end, direction: dir, name: type });
                    if (type === "CDS") {
                        translations.push({ start: start, end: end, direction: dir, name: type });
                    }
                }
            }
        }

        return { name: name, seq: seq, annotations: annotations, translations: translations };
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
            var parsed = parseGenBank(text);
            if (!parsed) throw new Error("Could not parse GenBank record");
            return parsed;
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
                        btn.textContent = "Copied";
                        btn.classList.add("copied");
                        setTimeout(function () {
                            btn.textContent = "Copy";
                            btn.classList.remove("copied");
                        }, 1600);
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
