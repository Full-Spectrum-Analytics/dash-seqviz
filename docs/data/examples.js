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
            accession: "M62653.1",
            featured: true,
            compound: {
                name: "GFP chromophore (p-HBDI)",
                smiles: "OC1=CC=C(/C=C2\\N=C(C)C(=O)N2)C=C1",
                description: "The mature chromophore auto-catalytically formed by Ser65-Tyr66-Gly67 cyclization. This small molecule is what actually fluoresces green."
            },
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
                "</ul>" +
                "<h3>References</h3>" +
                "<ul>" +
                "<li>Prasher DC, Eckenrode VK, Ward WW, Prendergast FG, Cormier MJ. " +
                "<a href=\"https://pubmed.ncbi.nlm.nih.gov/1347277/\" target=\"_blank\" rel=\"noopener\">" +
                "Primary structure of the <em>Aequorea victoria</em> green-fluorescent protein.</a> " +
                "<em>Gene</em> 111(2):229-33 (1992). PMID: 1347277.</li>" +
                "<li>Chalfie M, Tu Y, Euskirchen G, Ward WW, Prasher DC. " +
                "<a href=\"https://pubmed.ncbi.nlm.nih.gov/8303295/\" target=\"_blank\" rel=\"noopener\">" +
                "Green fluorescent protein as a marker for gene expression.</a> " +
                "<em>Science</em> 263(5148):802-5 (1994). PMID: 8303295.</li>" +
                "</ul>",
            pythonSnippet:
                "from dash import Dash, html\n" +
                "from dash_seqviz import SeqViz\n" +
                "import requests\n" +
                "\n" +
                "# Fetch GFP CDS from NCBI (M62653.1 — Prasher et al. 1992)\n" +
                "gb = requests.get(\n" +
                "    \"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi\",\n" +
                "    params={\"db\": \"nuccore\", \"id\": \"M62653.1\",\n" +
                "            \"rettype\": \"gb\", \"retmode\": \"text\",\n" +
                "            \"tool\": \"myapp\", \"email\": \"you@lab.org\"},\n" +
                "    timeout=10,\n" +
                ").text\n" +
                "\n" +
                "app = Dash(__name__)\n" +
                "app.layout = html.Div([\n" +
                "    SeqViz(\n" +
                "        id=\"gfp\",\n" +
                "        name=\"GFP (M62653.1)\",\n" +
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
            compound: {
                name: "IPTG",
                smiles: "CC(C)SC1OC(CO)C(O)C(O)C1O",
                description: "Isopropyl \u03b2-D-1-thiogalactopyranoside \u2014 the gratuitous inducer every student uses to switch on the lac promoter. Unlike allolactose, IPTG is not metabolized."
            },
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
                "</ul>" +
                "<h3>References</h3>" +
                "<ul>" +
                "<li>Jacob F, Monod J. " +
                "<a href=\"https://pubmed.ncbi.nlm.nih.gov/13718526/\" target=\"_blank\" rel=\"noopener\">" +
                "Genetic regulatory mechanisms in the synthesis of proteins.</a> " +
                "<em>J Mol Biol</em> 3:318-56 (1961). PMID: 13718526.</li>" +
                "<li>Kalnins A, Otto K, R&uuml;ther U, M&uuml;ller-Hill B. " +
                "<a href=\"https://pubmed.ncbi.nlm.nih.gov/6313349/\" target=\"_blank\" rel=\"noopener\">" +
                "Sequence of the <em>lacZ</em> gene of <em>Escherichia coli</em>.</a> " +
                "<em>EMBO J</em> 2(4):593-7 (1983). PMID: 6313349.</li>" +
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
            accession: "AF172851.1",
            compound: {
                name: "Violacein",
                smiles: "OC1=CC=C(NC(=O)/C(=C2\\C(=O)C3=CC=CC=C3N2)C2=CNC3=CC=CC=C23)C=C1",
                description: "A bisindole pigment with deep violet color. The five-enzyme pathway (vioA\u2013E) converts L-tryptophan into this compound, which also shows anti-tumor and antibacterial activity."
            },
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
                "fits in one ~10 kb GenBank record from <em>Chromobacterium violaceum</em>.</p>" +
                "<h3>Try this</h3>" +
                "<ul>" +
                "<li>Zoom out to see all five CDSs stacked left to right.</li>" +
                "<li>Load the same pathway after refactoring &mdash; see the industrial example " +
                "<a href=\"./example.html?id=violacein-refactored\">Violacein refactored for E. coli</a>.</li>" +
                "</ul>" +
                "<h3>References</h3>" +
                "<ul>" +
                "<li>August PR, Grossman TH, Minor C, Draper MP, MacNeil IA, Pemberton JM <em>et al.</em> " +
                "<a href=\"https://pubmed.ncbi.nlm.nih.gov/11075930/\" target=\"_blank\" rel=\"noopener\">" +
                "Sequence analysis and functional characterization of the violacein biosynthetic pathway " +
                "from <em>Chromobacterium violaceum</em>.</a> " +
                "<em>J Mol Microbiol Biotechnol</em> 2(4):513-9 (2000). PMID: 11075930.</li>" +
                "<li>Balibar CJ, Walsh CT. " +
                "<a href=\"https://pubmed.ncbi.nlm.nih.gov/17048874/\" target=\"_blank\" rel=\"noopener\">" +
                "In vitro biosynthesis of violacein from L-tryptophan by the enzymes VioA-E from " +
                "<em>Chromobacterium violaceum</em>.</a> " +
                "<em>Biochemistry</em> 45(51):15444-57 (2006). PMID: 17048874.</li>" +
                "</ul>",
            pythonSnippet:
                "from dash import Dash, html\n" +
                "from dash_seqviz import SeqViz\n" +
                "import requests\n" +
                "\n" +
                "gb = requests.get(\n" +
                "    \"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi\",\n" +
                "    params={\"db\": \"nuccore\", \"id\": \"AF172851.1\",\n" +
                "            \"rettype\": \"gb\", \"retmode\": \"text\",\n" +
                "            \"tool\": \"teaching\", \"email\": \"you@lab.org\"},\n" +
                "    timeout=10,\n" +
                ").text\n" +
                "\n" +
                "app = Dash(__name__)\n" +
                "app.layout = html.Div([\n" +
                "    SeqViz(\n" +
                "        id=\"violacein\",\n" +
                "        name=\"Violacein cluster (AF172851.1)\",\n" +
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
            compound: {
                name: "\u03b2-Carotene",
                smiles: "CC1=CCCC(C)(C)C1/C=C/C(C)=C/C=C/C(C)=C/C=C/C=C(C)/C=C/C=C(C)/C=C/C2=C(C)CCCC2(C)C",
                description: "The orange-red C40 terpenoid. The full crt pathway converts farnesyl-PP through phytoene, lycopene, and finally into \u03b2-carotene (provitamin A). Plate color reveals how far the pathway went."
            },
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
                "</ul>" +
                "<h3>References</h3>" +
                "<ul>" +
                "<li>Misawa N, Nakagawa M, Kobayashi K, Yamano S, Izawa Y, Nakamura K, Harashima K. " +
                "<a href=\"https://pubmed.ncbi.nlm.nih.gov/2254247/\" target=\"_blank\" rel=\"noopener\">" +
                "Elucidation of the <em>Erwinia uredovora</em> carotenoid biosynthetic pathway by " +
                "functional analysis of gene products expressed in <em>Escherichia coli</em>.</a> " +
                "<em>J Bacteriol</em> 172(12):6704-12 (1990). PMID: 2254247.</li>" +
                "<li>Cunningham FX Jr, Gantt E. " +
                "<a href=\"https://pubmed.ncbi.nlm.nih.gov/15012220/\" target=\"_blank\" rel=\"noopener\">" +
                "A portfolio of plasmids for identification and analysis of carotenoid pathway enzymes " +
                "in <em>Escherichia coli</em>.</a> " +
                "<em>Photosynth Res</em> 92(2):245-59 (2007). PMID: 17634749.</li>" +
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
            summary: "Streptomyces bottromycin biosynthetic cluster (JX235926.1). A rich, real-world ribosomally-synthesized peptide pathway.",
            category: "academic",
            tags: ["graduate", "natural-product", "cluster", "RiPP"],
            complexity: 4,
            accession: "JX235926.1",
            compound: {
                name: "Bottromycin A2",
                smiles: "CC(C)CC1NC(=O)C(Cc2c[nH]cn2)NC(=O)C(C(CC)C)NC(=O)C(CC(C)C)NC(=O)C3CCCN3C(=O)C(C)NC1=O",
                description: "A macrocyclic peptide antibiotic produced by Streptomyces. Contains a thiazole, a macrolactam ring, and several non-proteinogenic residues \u2014 all installed by the RiPP biosynthetic machinery."
            },
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
                "</ul>" +
                "<h3>References</h3>" +
                "<ul>" +
                "<li>Hou Y, Tianero MD, Kwan JC, Wyche TP, Michel CR, Ellis GA <em>et al.</em> " +
                "<a href=\"https://pubmed.ncbi.nlm.nih.gov/22984892/\" target=\"_blank\" rel=\"noopener\">" +
                "Structure and biosynthesis of the antibiotic bottromycin D.</a> " +
                "<em>Org Lett</em> 14(19):5050-3 (2012). PMID: 22984892.</li>" +
                "<li>Huo L, Rachid S, Stadler M, Wenzel SC, M&uuml;ller R. " +
                "<a href=\"https://pubmed.ncbi.nlm.nih.gov/23021914/\" target=\"_blank\" rel=\"noopener\">" +
                "Synthetic biotechnology to study and engineer ribosomal bottromycin biosynthesis.</a> " +
                "<em>Chem Biol</em> 19(10):1278-87 (2012). PMID: 23021914.</li>" +
                "</ul>",
            pythonSnippet:
                "from dash import Dash, html\n" +
                "from dash_seqviz import SeqViz\n" +
                "import requests\n" +
                "\n" +
                "gb = requests.get(\n" +
                "    \"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi\",\n" +
                "    params={\"db\": \"nuccore\", \"id\": \"JX235926.1\",\n" +
                "            \"rettype\": \"gb\", \"retmode\": \"text\",\n" +
                "            \"tool\": \"teaching\", \"email\": \"you@lab.org\"},\n" +
                "    timeout=10,\n" +
                ").text\n" +
                "\n" +
                "app = Dash(__name__)\n" +
                "app.layout = html.Div([\n" +
                "    SeqViz(\n" +
                "        id=\"bottromycin\",\n" +
                "        name=\"Bottromycin cluster (JX235926.1)\",\n" +
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
            summary: "A hop monoterpene synthase (MTS2) that drives the linalool-rich aroma of dry-hopped beers. Plug-in chassis for brewers and flavor houses.",
            category: "industrial",
            tags: ["food-beverage", "flavor", "monoterpene"],
            complexity: 3,
            accession: "EU760349.1",
            featured: true,
            compound: {
                name: "Linalool",
                smiles: "C=CC(C)(O)CCC=C(C)C",
                description: "A monoterpene alcohol with a floral-citrus aroma. It is a primary flavor contributor in Muscat grapes, lavender, and hop-forward beers. This enzyme converts geranyl pyrophosphate into linalool."
            },
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
                "EU760349.1 is <em>MTS2</em> from <em>Humulus lupulus</em> (hops, cultivar " +
                "Phoenix) &mdash; a linalool synthase responsible for the floral-citrus top " +
                "note of dry-hopped beers. The gene is drop-in material for yeast strains " +
                "engineered to lend a fruity note to a beer or a low-tannin wine.</p>" +
                "<h3>Why this matters</h3>" +
                "<p>Sensory-first brands don't care about GMP-grade titers &mdash; they care " +
                "about consistent flavor molecules. A visualizer like this lets a brewmaster, " +
                "not just a geneticist, see what's in a construct before it hits the fermenter.</p>" +
                "<h3>References</h3>" +
                "<ul>" +
                "<li>Wang G, Tian L, Aziz N, Broun P, Dai X, He J <em>et al.</em> " +
                "<a href=\"https://pubmed.ncbi.nlm.nih.gov/18753283/\" target=\"_blank\" rel=\"noopener\">" +
                "Terpene biosynthesis in glandular trichomes of hop.</a> " +
                "<em>Plant Physiol</em> 148(3):1254-66 (2008). PMID: 18753283.</li>" +
                "<li>Takoi K, Itoga Y, Koie K, Kosugi T, Shimase M, Katayama Y <em>et al.</em> " +
                "<a href=\"https://pubmed.ncbi.nlm.nih.gov/20509651/\" target=\"_blank\" rel=\"noopener\">" +
                "The contribution of geraniol metabolism to the citrus flavour of beer: " +
                "synergy of geraniol and beta-citronellol.</a> " +
                "<em>J Inst Brew</em> 116(3):251-60 (2010).</li>" +
                "</ul>",
            pythonSnippet:
                "from dash import Dash, html\n" +
                "from dash_seqviz import SeqViz\n" +
                "import requests\n" +
                "\n" +
                "gb = requests.get(\n" +
                "    \"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi\",\n" +
                "    params={\"db\": \"nuccore\", \"id\": \"EU760349.1\",\n" +
                "            \"rettype\": \"gb\", \"retmode\": \"text\",\n" +
                "            \"tool\": \"brewery\", \"email\": \"you@lab.org\"},\n" +
                "    timeout=10,\n" +
                ").text\n" +
                "\n" +
                "app = Dash(__name__)\n" +
                "app.layout = html.Div([\n" +
                "    SeqViz(\n" +
                "        id=\"monoterpene\",\n" +
                "        name=\"Hop MTS2 linalool synthase (EU760349.1)\",\n" +
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
            title: "CRISPR Cas9 plasmid — A gene-editing cassette you can actually ship",
            summary: "pX2-Cas9: a compact Cas9 expression plasmid used for genome-wide mutagenesis in industrial strain engineering pipelines.",
            category: "industrial",
            tags: ["CRISPR", "strain-engineering", "plasmid"],
            complexity: 4,
            accession: "PV704592.1",
            compound: null,
            seqvizProps: {
                viewer: "both",
                zoom: { linear: 45 },
                showComplement: true,
                style: { height: "560px", width: "100%" }
            },
            narrative:
                "<h3>Industrial CRISPR at the plasmid level</h3>" +
                "<p>Consumer-scale strain engineering doesn't rely on one-off transformations. " +
                "Teams run standardized Cas9 plasmids with known marker sets and calibrated " +
                "promoters. <strong>pX2-Cas9</strong> (PV704592.1) is the Garst et al. " +
                "broad-host-range Cas9 plasmid used to drive CREATE &mdash; a platform for " +
                "genome-wide, tracked mutagenesis &mdash; a compact, reusable unit you can " +
                "visualize, QC, and hand to a cloning robot.</p>" +
                "<h3>What to look for</h3>" +
                "<ul>" +
                "<li>The Cas9 CDS dominates the plasmid's length.</li>" +
                "<li>Spot the aminoglycoside phosphotransferase (kanamycin resistance) marker.</li>" +
                "<li>Toggle restriction enzymes to check BsaI / BsmBI Golden Gate " +
                "compatibility before ordering.</li>" +
                "</ul>" +
                "<h3>References</h3>" +
                "<ul>" +
                "<li>Garst AD, Bassalo MC, Pines G, Lynch SA, Halweg-Edwards AL, Liu R <em>et al.</em> " +
                "<a href=\"https://pubmed.ncbi.nlm.nih.gov/27941803/\" target=\"_blank\" rel=\"noopener\">" +
                "Genome-wide mapping of mutations at single-nucleotide resolution for protein, " +
                "metabolic and genome engineering.</a> " +
                "<em>Nat Biotechnol</em> 35(1):48-55 (2017). PMID: 27941803.</li>" +
                "<li>DiCarlo JE, Norville JE, Mali P, Rios X, Aach J, Church GM. " +
                "<a href=\"https://pubmed.ncbi.nlm.nih.gov/23460208/\" target=\"_blank\" rel=\"noopener\">" +
                "Genome engineering in <em>Saccharomyces cerevisiae</em> using CRISPR-Cas systems.</a> " +
                "<em>Nucleic Acids Res</em> 41(7):4336-43 (2013). PMID: 23460208.</li>" +
                "</ul>",
            pythonSnippet:
                "from dash import Dash, html\n" +
                "from dash_seqviz import SeqViz\n" +
                "import requests\n" +
                "\n" +
                "gb = requests.get(\n" +
                "    \"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi\",\n" +
                "    params={\"db\": \"nuccore\", \"id\": \"PV704592.1\",\n" +
                "            \"rettype\": \"gb\", \"retmode\": \"text\",\n" +
                "            \"tool\": \"strain-eng\", \"email\": \"you@lab.org\"},\n" +
                "    timeout=10,\n" +
                ").text\n" +
                "\n" +
                "app = Dash(__name__)\n" +
                "app.layout = html.Div([\n" +
                "    SeqViz(\n" +
                "        id=\"crispr-cas9\",\n" +
                "        name=\"pX2-Cas9 (PV704592.1)\",\n" +
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
            accession: "AF172851.1",
            compound: {
                name: "Violacein",
                smiles: "OC1=CC=C(NC(=O)/C(=C2\\C(=O)C3=CC=CC=C3N2)C2=CNC3=CC=CC=C23)C=C1",
                description: "Same bisindole pigment as the academic example. In an industrial context, titer optimization is the goal \u2014 codon-optimized CDSs and calibrated promoters push E. coli to produce grams per liter."
            },
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
                "</ul>" +
                "<h3>References</h3>" +
                "<ul>" +
                "<li>August PR, Grossman TH, Minor C, Draper MP, MacNeil IA, Pemberton JM <em>et al.</em> " +
                "<a href=\"https://pubmed.ncbi.nlm.nih.gov/11075930/\" target=\"_blank\" rel=\"noopener\">" +
                "Sequence analysis and functional characterization of the violacein biosynthetic pathway.</a> " +
                "<em>J Mol Microbiol Biotechnol</em> 2(4):513-9 (2000). PMID: 11075930.</li>" +
                "<li>Jones JA, Vernacchio VR, Lachance DM, Lebovich M, Fu L, Shirke AN <em>et al.</em> " +
                "<a href=\"https://pubmed.ncbi.nlm.nih.gov/26271488/\" target=\"_blank\" rel=\"noopener\">" +
                "ePathOptimize: a combinatorial approach for transcriptional balancing of metabolic pathways.</a> " +
                "<em>Sci Rep</em> 5:11301 (2015). PMID: 26071488.</li>" +
                "</ul>",
            pythonSnippet:
                "from dash import Dash, html\n" +
                "from dash_seqviz import SeqViz\n" +
                "import requests\n" +
                "\n" +
                "gb = requests.get(\n" +
                "    \"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi\",\n" +
                "    params={\"db\": \"nuccore\", \"id\": \"AF172851.1\",\n" +
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
            accession: "JX235926.1",
            compound: {
                name: "Bottromycin A2",
                smiles: "CC(C)CC1NC(=O)C(Cc2c[nH]cn2)NC(=O)C(C(CC)C)NC(=O)C(CC(C)C)NC(=O)C3CCCN3C(=O)C(C)NC1=O",
                description: "Same macrocyclic peptide \u2014 but in an industrial pipeline the goal is titer in a tractable host, not structural elucidation. Visualizing the cluster helps budget DNA synthesis and plan the assembly."
            },
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
                "</ul>" +
                "<h3>References</h3>" +
                "<ul>" +
                "<li>Huo L, Rachid S, Stadler M, Wenzel SC, M&uuml;ller R. " +
                "<a href=\"https://pubmed.ncbi.nlm.nih.gov/23021914/\" target=\"_blank\" rel=\"noopener\">" +
                "Synthetic biotechnology to study and engineer ribosomal bottromycin biosynthesis.</a> " +
                "<em>Chem Biol</em> 19(10):1278-87 (2012). PMID: 23021914.</li>" +
                "<li>Eyles TH, Vior NM, Truman AW. " +
                "<a href=\"https://pubmed.ncbi.nlm.nih.gov/29993226/\" target=\"_blank\" rel=\"noopener\">" +
                "Rapid and robust optimisation of the bottromycin biosynthetic pathway using " +
                "yeast-based cluster refactoring.</a> " +
                "<em>ACS Synth Biol</em> 7(6):1481-1490 (2018). PMID: 29793226.</li>" +
                "</ul>",
            pythonSnippet:
                "from dash import Dash, html\n" +
                "from dash_seqviz import SeqViz\n" +
                "import requests\n" +
                "\n" +
                "gb = requests.get(\n" +
                "    \"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi\",\n" +
                "    params={\"db\": \"nuccore\", \"id\": \"JX235926.1\",\n" +
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
            compound: {
                name: "Kanamycin A",
                smiles: "NC1CC(N)C(OC2OC(CO)C(O)C(N)C2O)C(O)C1OC3OC(CO)C(O)C(O)C3O",
                description: "An aminoglycoside antibiotic. pBI121 carries the NPTII gene (neomycin phosphotransferase II) conferring kanamycin resistance \u2014 the selectable marker that lets you pick transformed plant cells."
            },
            seqvizProps: {
                viewer: "both",
                zoom: { linear: 25 },
                showComplement: true,
                enzymes: [],
                style: { height: "620px", width: "100%" }
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
                "<li>Toggle the classic MCS cutters below &mdash; the sites that let scientists " +
                "swap in their own gene of interest:</li>" +
                "</ul>" +
                "<div class=\"enzyme-toggle-row\">" +
                "<button type=\"button\" class=\"enzyme-toggle\" data-enzyme=\"EcoRI\">EcoRI</button>" +
                "<button type=\"button\" class=\"enzyme-toggle\" data-enzyme=\"BamHI\">BamHI</button>" +
                "<button type=\"button\" class=\"enzyme-toggle\" data-enzyme=\"HindIII\">HindIII</button>" +
                "<button type=\"button\" class=\"enzyme-toggle\" data-enzyme=\"SacI\">SacI</button>" +
                "<button type=\"button\" class=\"enzyme-toggle\" data-enzyme=\"XbaI\">XbaI</button>" +
                "</div>" +
                "<h3>References</h3>" +
                "<ul>" +
                "<li>Jefferson RA, Kavanagh TA, Bevan MW. " +
                "<a href=\"https://pubmed.ncbi.nlm.nih.gov/3327686/\" target=\"_blank\" rel=\"noopener\">" +
                "GUS fusions: &beta;-glucuronidase as a sensitive and versatile gene fusion marker " +
                "in higher plants.</a> " +
                "<em>EMBO J</em> 6(13):3901-7 (1987). PMID: 3327686.</li>" +
                "<li>Chen PY, Wang CK, Soong SC, To KY. " +
                "<a href=\"https://pubmed.ncbi.nlm.nih.gov/12650989/\" target=\"_blank\" rel=\"noopener\">" +
                "Complete sequence of the binary vector pBI121 and its application in cloning T-DNA " +
                "insertion from transgenic plants.</a> " +
                "<em>Mol Breed</em> 11(4):287-93 (2003).</li>" +
                "</ul>",
            pythonSnippet:
                "from dash import Dash, Input, Output, html, dcc\n" +
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
                "MCS_ENZYMES = [\"EcoRI\", \"BamHI\", \"HindIII\", \"SacI\", \"XbaI\"]\n" +
                "\n" +
                "app = Dash(__name__)\n" +
                "app.layout = html.Div([\n" +
                "    dcc.Checklist(\n" +
                "        id=\"enzyme-picker\",\n" +
                "        options=[{\"label\": e, \"value\": e} for e in MCS_ENZYMES],\n" +
                "        value=[],  # empty; let the user toggle\n" +
                "        inline=True,\n" +
                "    ),\n" +
                "    SeqViz(\n" +
                "        id=\"pBI121\",\n" +
                "        name=\"pBI121 (AF485783.1)\",\n" +
                "        file=gb,\n" +
                "        viewer=\"both\",\n" +
                "        zoom={\"linear\": 25},\n" +
                "        showComplement=True,\n" +
                "        enzymes=[],\n" +
                "        style={\"height\": \"620px\", \"width\": \"100%\"},\n" +
                "    ),\n" +
                "])\n" +
                "\n" +
                "\n" +
                "@app.callback(Output(\"pBI121\", \"enzymes\"), Input(\"enzyme-picker\", \"value\"))\n" +
                "def update_enzymes(selected):\n" +
                "    return selected or []\n" +
                "\n" +
                "\n" +
                "if __name__ == \"__main__\":\n" +
                "    app.run(debug=True)\n"
        }
    ];

    global.DASH_SEQVIZ_EXAMPLES = EXAMPLES;
})(window);
