/**
 * Curated examples for the Gallery and example-detail pages.
 *
 * Each entry:
 *   id            kebab-case slug used in ?id=<slug>
 *   title         short human title
 *   summary       <= 160 chars, shown in cards
 *   category      "academic" | "industrial"
 *   tags          freeform; surfaced as badges
 *   complexity    1..5 (for sort / filter)
 *   accession     NCBI accession the example fetches live
 *   featured      (optional) true to surface on the home page hero
 *   seqvizProps   props passed to seqviz.Viewer after sequence is fetched
 *                 (name / seq / annotations / translations are filled at runtime)
 *   narrative     markdown-ish HTML used in the right column of the detail page
 *   pythonSnippet concise dash-seqviz code the user can paste to reproduce
 */
(function (global) {
    var EXAMPLES = [
        // ------------------------------------------------------------------
        // ACADEMIC
        // ------------------------------------------------------------------
        {
            id: "gfp-reporter",
            title: "GFP — The original fluorescent reporter",
            summary: "The A. victoria green fluorescent protein gene that kicked off modern imaging. Ideal first example for a molecular-biology class.",
            category: "academic",
            tags: ["undergrad", "reporter", "CDS"],
            complexity: 1,
            accession: "U55762.1",
            featured: true,
            seqvizProps: {
                viewer: "both",
                zoom: { linear: 60 },
                showComplement: true,
                search: { query: "ATGAGT" },
                highlights: [],
                style: { height: "560px", width: "100%" }
            },
            narrative:
                "<h3>Why GFP?</h3>" +
                "<p>Green Fluorescent Protein (GFP) from <em>Aequorea victoria</em> is the " +
                "most taught reporter gene in biology. Students can <em>see</em> its 238-amino-acid " +
                "CDS, the chromophore-forming residues (Ser65-Tyr66-Gly67), and use it as a " +
                "template to talk about translation, codon usage, and folding.</p>" +
                "<h3>Try this</h3>" +
                "<ul>" +
                "<li>Search for the start codon <code>ATGAGT</code> &mdash; the first 6 bp of GFP.</li>" +
                "<li>Toggle <em>Show translations</em> on/off to reveal the protein sequence.</li>" +
                "<li>Pick <code>BamHI</code> and <code>EcoRI</code> from the enzyme list and see where the classic cloning sites sit.</li>" +
                "</ul>",
            pythonSnippet:
                "from dash import Dash, html\n" +
                "from dash_seqviz import SeqViz\n" +
                "import requests\n" +
                "\n" +
                "# Fetch GFP CDS from NCBI (U55762.1)\n" +
                "gb = requests.get(\n" +
                "    \"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi\",\n" +
                "    params={\"db\": \"nuccore\", \"id\": \"U55762.1\",\n" +
                "            \"rettype\": \"gb\", \"retmode\": \"text\",\n" +
                "            \"tool\": \"myapp\", \"email\": \"you@lab.org\"},\n" +
                "    timeout=10,\n" +
                ").text\n" +
                "\n" +
                "app = Dash(__name__)\n" +
                "app.layout = html.Div([\n" +
                "    SeqViz(\n" +
                "        id=\"gfp\",\n" +
                "        name=\"GFP (U55762.1)\",\n" +
                "        file=gb,                     # SeqViz parses GenBank inline\n" +
                "        viewer=\"both\",\n" +
                "        showComplement=True,\n" +
                "        enzymes=[\"EcoRI\", \"BamHI\"],\n" +
                "        search={\"query\": \"ATGAGT\"},\n" +
                "        style={\"height\": \"560px\", \"width\": \"100%\"},\n" +
                "    )\n" +
                "])\n" +
                "\n" +
                "if __name__ == \"__main__\":\n" +
                "    app.run(debug=True)\n"
        },
        {
            id: "lac-operon",
            title: "The lac operon — Every genetics student's first circuit",
            summary: "E. coli's lac operon region: promoter, operator, lacZ, lacY, lacA. The canonical example of regulated gene expression.",
            category: "academic",
            tags: ["undergrad", "graduate", "operon", "regulation"],
            complexity: 2,
            accession: "J01636.1",
            featured: true,
            seqvizProps: {
                viewer: "linear",
                zoom: { linear: 40 },
                showComplement: true,
                search: { query: "AATTGTGAGC" },  // canonical CAP binding site
                style: { height: "560px", width: "100%" }
            },
            narrative:
                "<h3>The textbook operon</h3>" +
                "<p>Jacob and Monod's 1961 paper on the <em>lac</em> operon is the birth of " +
                "molecular genetics. This record (J01636.1) covers the whole region: the " +
                "<strong>CAP binding site</strong>, <strong>-35 / -10 promoter</strong>, " +
                "<strong>operator</strong> (<code>lacO</code>), and the three structural " +
                "genes <code>lacZ</code> (&beta;-galactosidase), <code>lacY</code> " +
                "(permease), and <code>lacA</code> (transacetylase).</p>" +
                "<h3>Try this</h3>" +
                "<ul>" +
                "<li>Search for <code>AATTGTGAGC</code> &mdash; the left half of the CAP binding site.</li>" +
                "<li>Switch to linear view; the zoom slider walks through the three CDSs.</li>" +
                "<li>Turn on translations to see the reading frame of <code>lacZ</code>.</li>" +
                "</ul>",
            pythonSnippet:
                "from dash import Dash, html\n" +
                "from dash_seqviz import SeqViz\n" +
                "import requests\n" +
                "\n" +
                "# J01636.1 — E. coli lac operon region\n" +
                "gb = requests.get(\n" +
                "    \"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi\",\n" +
                "    params={\"db\": \"nuccore\", \"id\": \"J01636.1\",\n" +
                "            \"rettype\": \"gb\", \"retmode\": \"text\",\n" +
                "            \"tool\": \"classroom\", \"email\": \"you@lab.org\"},\n" +
                "    timeout=10,\n" +
                ").text\n" +
                "\n" +
                "app = Dash(__name__)\n" +
                "app.layout = html.Div([\n" +
                "    SeqViz(\n" +
                "        id=\"lac\",\n" +
                "        name=\"lac operon (J01636.1)\",\n" +
                "        file=gb,\n" +
                "        viewer=\"linear\",\n" +
                "        zoom={\"linear\": 40},\n" +
                "        showComplement=True,\n" +
                "        search={\"query\": \"AATTGTGAGC\"},  # CAP binding site\n" +
                "        style={\"height\": \"560px\", \"width\": \"100%\"},\n" +
                "    )\n" +
                "])\n" +
                "\n" +
                "if __name__ == \"__main__\":\n" +
                "    app.run(debug=True)\n"
        },
        {
            id: "violacein-cluster",
            title: "Violacein biosynthetic cluster — Seeing a secondary metabolite",
            summary: "The vioA-E cluster from Chromobacterium violaceum. A five-gene pathway graduate students routinely refactor.",
            category: "academic",
            tags: ["graduate", "synthetic-biology", "biosynthesis", "cluster"],
            complexity: 3,
            accession: "AY935253.1",
            seqvizProps: {
                viewer: "linear",
                zoom: { linear: 35 },
                showComplement: false,
                style: { height: "560px", width: "100%" }
            },
            narrative:
                "<h3>Five genes, one violet pigment</h3>" +
                "<p>Violacein is a deep-purple indole pigment and a favorite teaching target " +
                "for pathway engineering: the whole biosynthetic cluster (<code>vioA</code>, " +
                "<code>vioB</code>, <code>vioC</code>, <code>vioD</code>, <code>vioE</code>) " +
                "fits in one GenBank record.</p>" +
                "<h3>Try this</h3>" +
                "<ul>" +
                "<li>Zoom out to see all five CDSs stacked left to right.</li>" +
                "<li>Load the same pathway after refactoring &mdash; see the industrial example " +
                "<a href=\"./example.html?id=violacein-refactored\">Violacein refactored for E. coli</a>.</li>" +
                "</ul>",
            pythonSnippet:
                "from dash import Dash, html\n" +
                "from dash_seqviz import SeqViz\n" +
                "import requests\n" +
                "\n" +
                "gb = requests.get(\n" +
                "    \"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi\",\n" +
                "    params={\"db\": \"nuccore\", \"id\": \"AY935253.1\",\n" +
                "            \"rettype\": \"gb\", \"retmode\": \"text\",\n" +
                "            \"tool\": \"teaching\", \"email\": \"you@lab.org\"},\n" +
                "    timeout=10,\n" +
                ").text\n" +
                "\n" +
                "app = Dash(__name__)\n" +
                "app.layout = html.Div([\n" +
                "    SeqViz(\n" +
                "        id=\"violacein\",\n" +
                "        name=\"Violacein cluster (AY935253.1)\",\n" +
                "        file=gb,\n" +
                "        viewer=\"linear\",\n" +
                "        zoom={\"linear\": 35},\n" +
                "        style={\"height\": \"560px\", \"width\": \"100%\"},\n" +
                "    )\n" +
                "])\n" +
                "\n" +
                "if __name__ == \"__main__\":\n" +
                "    app.run(debug=True)\n"
        },
        {
            id: "carotenoid-cluster",
            title: "Carotenoid cluster — The classic heterologous pathway",
            summary: "Erwinia uredovora carotenoid biosynthesis (crtE, crtB, crtI, crtY, crtZ). Moved into E. coli in 1990; still taught today.",
            category: "academic",
            tags: ["graduate", "synthetic-biology", "biosynthesis"],
            complexity: 3,
            accession: "D90087.2",
            seqvizProps: {
                viewer: "linear",
                zoom: { linear: 35 },
                style: { height: "560px", width: "100%" }
            },
            narrative:
                "<h3>Color in a dish</h3>" +
                "<p>The <em>Erwinia uredovora</em> carotenoid cluster converts farnesyl " +
                "pyrophosphate into beta-carotene, zeaxanthin, or lycopene depending on which " +
                "genes are present. It is a favorite teaching case for <strong>pathway " +
                "engineering</strong> because the color of a plate reveals how far the pathway " +
                "went.</p>" +
                "<h3>Try this</h3>" +
                "<ul>" +
                "<li>Identify <code>crtE</code>, <code>crtB</code>, <code>crtI</code>, " +
                "<code>crtY</code>, <code>crtZ</code> in the linear map.</li>" +
                "<li>Ask the class: which deletion would leave cells producing lycopene instead " +
                "of beta-carotene?</li>" +
                "</ul>",
            pythonSnippet:
                "from dash import Dash, html\n" +
                "from dash_seqviz import SeqViz\n" +
                "import requests\n" +
                "\n" +
                "gb = requests.get(\n" +
                "    \"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi\",\n" +
                "    params={\"db\": \"nuccore\", \"id\": \"D90087.2\",\n" +
                "            \"rettype\": \"gb\", \"retmode\": \"text\",\n" +
                "            \"tool\": \"teaching\", \"email\": \"you@lab.org\"},\n" +
                "    timeout=10,\n" +
                ").text\n" +
                "\n" +
                "app = Dash(__name__)\n" +
                "app.layout = html.Div([\n" +
                "    SeqViz(\n" +
                "        id=\"carotenoid\",\n" +
                "        name=\"Carotenoid cluster (D90087.2)\",\n" +
                "        file=gb,\n" +
                "        viewer=\"linear\",\n" +
                "        zoom={\"linear\": 35},\n" +
                "        style={\"height\": \"560px\", \"width\": \"100%\"},\n" +
                "    )\n" +
                "])\n" +
                "\n" +
                "if __name__ == \"__main__\":\n" +
                "    app.run(debug=True)\n"
        },
        {
            id: "bottromycin-academic",
            title: "Bottromycin (academic) — A RiPP in the wild",
            summary: "Streptomyces bottromycin biosynthetic cluster (KF546190.1). A rich, real-world ribosomally-synthesized peptide pathway.",
            category: "academic",
            tags: ["graduate", "natural-product", "cluster", "RiPP"],
            complexity: 4,
            accession: "KF546190.1",
            seqvizProps: {
                viewer: "linear",
                zoom: { linear: 25 },
                style: { height: "560px", width: "100%" }
            },
            narrative:
                "<h3>A complete natural-product cluster</h3>" +
                "<p>Bottromycins are macrocyclic peptides produced by <em>Streptomyces</em>. " +
                "The cluster spans ~20 kb and includes a precursor peptide, radical-SAM " +
                "enzymes, a YcaO-type heterocyclase, and transport machinery &mdash; a " +
                "perfect teaching example for <strong>RiPP biosynthesis</strong>.</p>" +
                "<h3>Try this</h3>" +
                "<ul>" +
                "<li>Scan across the whole cluster; note how tightly CDSs pack.</li>" +
                "<li>Compare to the industrial example " +
                "<a href=\"./example.html?id=bottromycin-industrial\">heterologous bottromycin " +
                "expression</a>.</li>" +
                "</ul>",
            pythonSnippet:
                "from dash import Dash, html\n" +
                "from dash_seqviz import SeqViz\n" +
                "import requests\n" +
                "\n" +
                "gb = requests.get(\n" +
                "    \"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi\",\n" +
                "    params={\"db\": \"nuccore\", \"id\": \"KF546190.1\",\n" +
                "            \"rettype\": \"gb\", \"retmode\": \"text\",\n" +
                "            \"tool\": \"teaching\", \"email\": \"you@lab.org\"},\n" +
                "    timeout=10,\n" +
                ").text\n" +
                "\n" +
                "app = Dash(__name__)\n" +
                "app.layout = html.Div([\n" +
                "    SeqViz(\n" +
                "        id=\"bottromycin\",\n" +
                "        name=\"Bottromycin cluster (KF546190.1)\",\n" +
                "        file=gb,\n" +
                "        viewer=\"linear\",\n" +
                "        zoom={\"linear\": 25},\n" +
                "        style={\"height\": \"560px\", \"width\": \"100%\"},\n" +
                "    )\n" +
                "])\n" +
                "\n" +
                "if __name__ == \"__main__\":\n" +
                "    app.run(debug=True)\n"
        },

        // ------------------------------------------------------------------
        // INDUSTRIAL
        // ------------------------------------------------------------------
        {
            id: "beer-aroma",
            title: "Brewing aroma — The monoterpene synthase story",
            summary: "A grape monoterpene synthase that flavors wine and (in engineered strains) beer. Plug-in chassis for brewers and flavor houses.",
            category: "industrial",
            tags: ["food-beverage", "flavor", "monoterpene"],
            complexity: 3,
            accession: "DQ118411.1",
            featured: true,
            seqvizProps: {
                viewer: "both",
                zoom: { linear: 50 },
                showComplement: true,
                style: { height: "560px", width: "100%" }
            },
            narrative:
                "<h3>A smell you can ship</h3>" +
                "<p>Monoterpene synthases are the enzymes that turn geranyl pyrophosphate " +
                "into the aromas you recognize as lemon, rose, lavender, or hops. " +
                "DQ118411.1 is one such synthase from <em>Vitis vinifera</em>; the gene is " +
                "drop-in material for yeast strains engineered to lend a fruity note to a " +
                "beer or a low-tannin wine.</p>" +
                "<h3>Why this matters</h3>" +
                "<p>Sensory-first brands don't care about GMP-grade titers &mdash; they care " +
                "about consistent flavor molecules. A visualizer like this lets a brewmaster, " +
                "not just a geneticist, see what's in a construct before it hits the fermenter.</p>",
            pythonSnippet:
                "from dash import Dash, html\n" +
                "from dash_seqviz import SeqViz\n" +
                "import requests\n" +
                "\n" +
                "gb = requests.get(\n" +
                "    \"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi\",\n" +
                "    params={\"db\": \"nuccore\", \"id\": \"DQ118411.1\",\n" +
                "            \"rettype\": \"gb\", \"retmode\": \"text\",\n" +
                "            \"tool\": \"brewery\", \"email\": \"you@lab.org\"},\n" +
                "    timeout=10,\n" +
                ").text\n" +
                "\n" +
                "app = Dash(__name__)\n" +
                "app.layout = html.Div([\n" +
                "    SeqViz(\n" +
                "        id=\"monoterpene\",\n" +
                "        name=\"Monoterpene synthase (DQ118411.1)\",\n" +
                "        file=gb,\n" +
                "        viewer=\"both\",\n" +
                "        zoom={\"linear\": 50},\n" +
                "        showComplement=True,\n" +
                "        style={\"height\": \"560px\", \"width\": \"100%\"},\n" +
                "    )\n" +
                "])\n" +
                "\n" +
                "if __name__ == \"__main__\":\n" +
                "    app.run(debug=True)\n"
        },
        {
            id: "crispr-yeast",
            title: "CRISPR yeast toolkit — A gene-editing cassette you can actually ship",
            summary: "A Cas9 + gRNA cassette targeted for S. cerevisiae. The kind of construct industrial strain engineers run dozens of per week.",
            category: "industrial",
            tags: ["CRISPR", "yeast", "strain-engineering"],
            complexity: 4,
            accession: "KY100560.1",
            seqvizProps: {
                viewer: "both",
                zoom: { linear: 45 },
                showComplement: true,
                style: { height: "560px", width: "100%" }
            },
            narrative:
                "<h3>Industrial CRISPR in yeast</h3>" +
                "<p>Consumer-scale strain engineering doesn't rely on one-off transformations. " +
                "Teams run standardized Cas9+gRNA cassettes with known marker sets and " +
                "terminator collections. This record is a representative piece of that " +
                "workflow &mdash; a compact, reusable unit you can visualize, QC, and hand to " +
                "a cloning robot.</p>" +
                "<h3>What to look for</h3>" +
                "<ul>" +
                "<li>The Cas9 CDS dominates the cassette's length.</li>" +
                "<li>Toggle restriction enzymes to check BsaI / BsmBI Golden Gate " +
                "compatibility before ordering.</li>" +
                "</ul>",
            pythonSnippet:
                "from dash import Dash, html\n" +
                "from dash_seqviz import SeqViz\n" +
                "import requests\n" +
                "\n" +
                "gb = requests.get(\n" +
                "    \"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi\",\n" +
                "    params={\"db\": \"nuccore\", \"id\": \"KY100560.1\",\n" +
                "            \"rettype\": \"gb\", \"retmode\": \"text\",\n" +
                "            \"tool\": \"strain-eng\", \"email\": \"you@lab.org\"},\n" +
                "    timeout=10,\n" +
                ").text\n" +
                "\n" +
                "app = Dash(__name__)\n" +
                "app.layout = html.Div([\n" +
                "    SeqViz(\n" +
                "        id=\"crispr-yeast\",\n" +
                "        name=\"CRISPR yeast cassette (KY100560.1)\",\n" +
                "        file=gb,\n" +
                "        viewer=\"both\",\n" +
                "        zoom={\"linear\": 45},\n" +
                "        showComplement=True,\n" +
                "        enzymes=[\"BsaI\", \"BsmBI\"],\n" +
                "        style={\"height\": \"560px\", \"width\": \"100%\"},\n" +
                "    )\n" +
                "])\n" +
                "\n" +
                "if __name__ == \"__main__\":\n" +
                "    app.run(debug=True)\n"
        },
        {
            id: "violacein-refactored",
            title: "Violacein refactored — From soil bug to industrial chassis",
            summary: "The same violacein cluster you saw in the academic track, moved into E. coli for industrial-scale pigment production.",
            category: "industrial",
            tags: ["biosynthesis", "E. coli", "refactored"],
            complexity: 4,
            accession: "AY935253.1",
            seqvizProps: {
                viewer: "linear",
                zoom: { linear: 35 },
                style: { height: "560px", width: "100%" }
            },
            narrative:
                "<h3>Same cluster, different chassis</h3>" +
                "<p>You already saw this cluster in the " +
                "<a href=\"./example.html?id=violacein-cluster\">academic example</a>. In " +
                "industrial practice, the native <em>Chromobacterium</em> version is rarely " +
                "used directly &mdash; teams rebuild the five enzymes in <em>E. coli</em> " +
                "with refactored promoters, codon-optimized CDSs, and designed RBSs.</p>" +
                "<h3>What changes in an industrial context</h3>" +
                "<ul>" +
                "<li>Native sequences replaced with codon-optimized synonymous variants.</li>" +
                "<li>Promoters standardized across the cluster for tunable control.</li>" +
                "<li>Internal restriction sites removed so Golden Gate assembly works.</li>" +
                "</ul>",
            pythonSnippet:
                "from dash import Dash, html\n" +
                "from dash_seqviz import SeqViz\n" +
                "import requests\n" +
                "\n" +
                "gb = requests.get(\n" +
                "    \"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi\",\n" +
                "    params={\"db\": \"nuccore\", \"id\": \"AY935253.1\",\n" +
                "            \"rettype\": \"gb\", \"retmode\": \"text\",\n" +
                "            \"tool\": \"biofoundry\", \"email\": \"you@lab.org\"},\n" +
                "    timeout=10,\n" +
                ").text\n" +
                "\n" +
                "app = Dash(__name__)\n" +
                "app.layout = html.Div([\n" +
                "    SeqViz(\n" +
                "        id=\"violacein-ref\",\n" +
                "        name=\"Violacein in E. coli\",\n" +
                "        file=gb,\n" +
                "        viewer=\"linear\",\n" +
                "        zoom={\"linear\": 35},\n" +
                "        enzymes=[\"BsaI\", \"BsmBI\"],  # check Golden Gate compatibility\n" +
                "        style={\"height\": \"560px\", \"width\": \"100%\"},\n" +
                "    )\n" +
                "])\n" +
                "\n" +
                "if __name__ == \"__main__\":\n" +
                "    app.run(debug=True)\n"
        },
        {
            id: "bottromycin-industrial",
            title: "Bottromycin (heterologous expression) — A pipeline pilot",
            summary: "The bottromycin cluster moved out of Streptomyces into a production host. Pipeline pilot used to scout antibiotic candidates.",
            category: "industrial",
            tags: ["pharma", "antibiotic", "heterologous"],
            complexity: 5,
            accession: "KF546190.1",
            seqvizProps: {
                viewer: "linear",
                zoom: { linear: 25 },
                style: { height: "560px", width: "100%" }
            },
            narrative:
                "<h3>Why move a natural-product cluster?</h3>" +
                "<p>Native <em>Streptomyces</em> hosts are slow, hard to engineer, and " +
                "fermentations are finicky. Pharma R&amp;D teams routinely port a cluster " +
                "into a faster chassis (<em>S. coelicolor</em> M1152, <em>S. albus</em> J1074, " +
                "or even <em>E. coli</em>) to evaluate yield, titer, and analog variability.</p>" +
                "<h3>This record as a pipeline checkpoint</h3>" +
                "<ul>" +
                "<li>Inspect the whole cluster length to budget for DNA synthesis cost.</li>" +
                "<li>Check for internal BsaI / BsmBI sites that would block Golden Gate assembly.</li>" +
                "<li>Flag CDSs that will need codon optimization for the new host.</li>" +
                "</ul>",
            pythonSnippet:
                "from dash import Dash, html\n" +
                "from dash_seqviz import SeqViz\n" +
                "import requests\n" +
                "\n" +
                "gb = requests.get(\n" +
                "    \"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi\",\n" +
                "    params={\"db\": \"nuccore\", \"id\": \"KF546190.1\",\n" +
                "            \"rettype\": \"gb\", \"retmode\": \"text\",\n" +
                "            \"tool\": \"pharma-rd\", \"email\": \"you@lab.org\"},\n" +
                "    timeout=10,\n" +
                ").text\n" +
                "\n" +
                "app = Dash(__name__)\n" +
                "app.layout = html.Div([\n" +
                "    SeqViz(\n" +
                "        id=\"bottromycin-ind\",\n" +
                "        name=\"Bottromycin for heterologous expression\",\n" +
                "        file=gb,\n" +
                "        viewer=\"linear\",\n" +
                "        zoom={\"linear\": 25},\n" +
                "        enzymes=[\"BsaI\", \"BsmBI\", \"NotI\"],\n" +
                "        style={\"height\": \"560px\", \"width\": \"100%\"},\n" +
                "    )\n" +
                "])\n" +
                "\n" +
                "if __name__ == \"__main__\":\n" +
                "    app.run(debug=True)\n"
        },
        {
            id: "pBI121",
            title: "pBI121 — The Ag-biotech workhorse binary vector",
            summary: "The plant-transformation binary vector that put GUS reporters in crops. Still the reference vector for ag-biotech teaching & QC.",
            category: "industrial",
            tags: ["agriculture", "plant-biotech", "vector"],
            complexity: 3,
            accession: "AF485783.1",
            featured: true,
            seqvizProps: {
                viewer: "both",
                zoom: { linear: 55 },
                showComplement: true,
                style: { height: "560px", width: "100%" }
            },
            narrative:
                "<h3>The ag-biotech reference plasmid</h3>" +
                "<p><strong>pBI121</strong> is the binary vector nearly every Agrobacterium-" +
                "mediated plant transformation paper cites. It carries the " +
                "<code>uidA</code> (GUS) reporter under a 35S promoter with an NPTII " +
                "selection marker, flanked by T-DNA left and right borders.</p>" +
                "<h3>What to look at</h3>" +
                "<ul>" +
                "<li>Spin through the circular view to see LB / RB flanking the expression " +
                "cassette.</li>" +
                "<li>Pick <code>EcoRI</code>, <code>BamHI</code>, <code>HindIII</code> &mdash; " +
                "the classic MCS sites that let scientists swap in their own gene of interest.</li>" +
                "</ul>",
            pythonSnippet:
                "from dash import Dash, html\n" +
                "from dash_seqviz import SeqViz\n" +
                "import requests\n" +
                "\n" +
                "gb = requests.get(\n" +
                "    \"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi\",\n" +
                "    params={\"db\": \"nuccore\", \"id\": \"AF485783.1\",\n" +
                "            \"rettype\": \"gb\", \"retmode\": \"text\",\n" +
                "            \"tool\": \"ag-biotech\", \"email\": \"you@lab.org\"},\n" +
                "    timeout=10,\n" +
                ").text\n" +
                "\n" +
                "app = Dash(__name__)\n" +
                "app.layout = html.Div([\n" +
                "    SeqViz(\n" +
                "        id=\"pBI121\",\n" +
                "        name=\"pBI121 (AF485783.1)\",\n" +
                "        file=gb,\n" +
                "        viewer=\"both\",\n" +
                "        zoom={\"linear\": 55},\n" +
                "        showComplement=True,\n" +
                "        enzymes=[\"EcoRI\", \"BamHI\", \"HindIII\"],\n" +
                "        style={\"height\": \"560px\", \"width\": \"100%\"},\n" +
                "    )\n" +
                "])\n" +
                "\n" +
                "if __name__ == \"__main__\":\n" +
                "    app.run(debug=True)\n"
        }
    ];

    global.DASH_SEQVIZ_EXAMPLES = EXAMPLES;
})(window);
