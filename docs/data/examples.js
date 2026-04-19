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
                enzymes: ["EcoRI", "BamHI"],
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
                "<li>Toggle the classic cloning sites below and see where they sit in the CDS:</li>" +
                "</ul>" +
                "<div class=\"enzyme-toggle-row\">" +
                "<button type=\"button\" class=\"enzyme-toggle\" data-enzyme=\"EcoRI\">EcoRI</button>" +
                "<button type=\"button\" class=\"enzyme-toggle\" data-enzyme=\"BamHI\">BamHI</button>" +
                "<button type=\"button\" class=\"enzyme-toggle\" data-enzyme=\"HindIII\">HindIII</button>" +
                "<button type=\"button\" class=\"enzyme-toggle\" data-enzyme=\"XhoI\">XhoI</button>" +
                "</div>" +
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
                viewer: "both",
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
            pathway: {
                title: "Violacein biosynthesis",
                description: "Five enzymes (VioA\u2013E) turn two L-tryptophan molecules into violacein, consuming O\u2082 at three steps.",
                nodes: [
                    {
                        name: "L-Tryptophan",
                        smiles: "N[C@@H](Cc1c[nH]c2ccccc12)C(=O)O"
                    },
                    {
                        name: "Indole-3-pyruvic acid imine",
                        smiles: "OC(=O)C(=N)Cc1c[nH]c2ccccc12",
                        enzyme: "VioA",
                        cosubstrates: [{ name: "O\u2082", smiles: "O=O" }]
                    },
                    {
                        name: "Protodeoxyviolaceinic acid",
                        smiles: "OC(=O)C1=C(Cc2c[nH]c3ccccc23)NC(Cc2c[nH]c3ccccc23)=C1",
                        enzyme: "VioB + VioE",
                        note: "2\u00d7 IPA imine condense"
                    },
                    {
                        name: "Protodeoxyviolacein",
                        smiles: "O=C1NC(=Cc2c[nH]c3ccccc23)C1=Cc1c[nH]c2ccccc12",
                        enzyme: "spontaneous",
                        note: "decarboxylation"
                    },
                    {
                        name: "Protoviolacein",
                        smiles: "O=C1NC(=Cc2c[nH]c3ccccc23)C1=Cc1c[nH]c2ccc(O)cc12",
                        enzyme: "VioD",
                        cosubstrates: [{ name: "O\u2082", smiles: "O=O" }]
                    },
                    {
                        name: "Violacein",
                        smiles: "OC1=CC=C(NC(=O)/C(=C2\\C(=O)C3=CC=CC=C3N2)C2=CNC3=CC=CC=C23)C=C1",
                        enzyme: "VioC",
                        cosubstrates: [{ name: "O\u2082", smiles: "O=O" }]
                    }
                ]
            },
            seqvizProps: {
                viewer: "both",
                zoom: { linear: 35 },
                showComplement: false,
                style: { height: "560px", width: "100%" }
            },
            narrative:
                "<h3>Five genes, one violet pigment</h3>" +
                "<p><span class=\"info-term\" data-term=\"violacein\">Violacein</span> is a " +
                "deep-purple indole pigment and a favorite teaching target for pathway " +
                "engineering: the whole biosynthetic cluster (<code>vioA</code>, " +
                "<code>vioB</code>, <code>vioC</code>, <code>vioD</code>, <code>vioE</code>) " +
                "fits in one ~10 kb GenBank record from <em>Chromobacterium violaceum</em>, " +
                "converting two " +
                "<span class=\"info-term\" data-term=\"l-tryptophan\">L-tryptophan</span> " +
                "molecules into violacein.</p>" +
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
            pathway: {
                title: "\u03b2-carotene / zeaxanthin biosynthesis",
                description: "Five Erwinia crt enzymes extend, condense, desaturate, cyclize, and finally hydroxylate prenyl units on the way to zeaxanthin. Each step shows up as a visible color change on the plate.",
                nodes: [
                    {
                        name: "Farnesyl pyrophosphate",
                        smiles: "CC(C)=CCC/C(C)=C/CC/C(C)=C/COP(=O)(O)OP(=O)(O)O"
                    },
                    {
                        name: "Geranylgeranyl pyrophosphate",
                        smiles: "CC(C)=CCC/C(C)=C/CC/C(C)=C/CC/C(C)=C/COP(=O)(O)OP(=O)(O)O",
                        enzyme: "CrtE",
                        cosubstrates: [{ name: "IPP" }],
                        note: "prenyl extension (C15 \u2192 C20)"
                    },
                    {
                        name: "Phytoene",
                        smiles: "CC(=CCCC(=CCCC(=CCC=C(C)C=CC=C(C)CCC=C(C)CCC=C(C)C)C)C)C",
                        enzyme: "CrtB",
                        cosubstrates: [{ name: "GGPP" }],
                        note: "head-to-head fusion (2\u00d7 GGPP)"
                    },
                    {
                        name: "Lycopene",
                        smiles: "CC(=CCCC(=CCC=C(C)C=CC=C(C)C=CC=C(C)C=CC=C(C)CCC=C(C)C)C)C",
                        enzyme: "CrtI",
                        note: "4\u00d7 desaturation (colorless \u2192 red)"
                    },
                    {
                        name: "\u03b2-Carotene",
                        smiles: "CC1=C(C(CCC1)(C)C)C=CC(=CC=CC(=CC=CC=C(C)C=CC=C(C)C=CC2=C(CCCC2(C)C)C)C)C",
                        enzyme: "CrtY",
                        note: "bicyclization (red \u2192 orange)"
                    },
                    {
                        name: "Zeaxanthin",
                        smiles: "CC1=C(C(CC(C1)O)(C)C)C=CC(=CC=CC(=CC=CC=C(C)C=CC=C(C)C=CC2=C(CC(CC2(C)C)O)C)C)C",
                        enzyme: "CrtZ",
                        cosubstrates: [{ name: "O\u2082" }],
                        note: "3,3\u2032-hydroxylation"
                    }
                ]
            },
            seqvizProps: {
                viewer: "both",
                zoom: { linear: 35 },
                style: { height: "560px", width: "100%" }
            },
            narrative:
                "<h3>Color in a dish</h3>" +
                "<p>The <em>Erwinia uredovora</em> carotenoid cluster converts " +
                "<span class=\"info-term\" data-term=\"fpp\">farnesyl pyrophosphate</span> " +
                "into " +
                "<span class=\"info-term\" data-term=\"beta-carotene\">\u03b2-carotene</span>, " +
                "<span class=\"info-term\" data-term=\"zeaxanthin\">zeaxanthin</span>, or " +
                "<span class=\"info-term\" data-term=\"lycopene\">lycopene</span> " +
                "depending on which genes are present. It is a favorite teaching case for " +
                "<strong>pathway engineering</strong> because the color of a plate reveals " +
                "how far the pathway went.</p>" +
                "<h3>Try this</h3>" +
                "<ul>" +
                "<li>Identify <code>crtE</code>, <code>crtB</code>, <code>crtI</code>, " +
                "<code>crtY</code>, <code>crtZ</code> in the linear map.</li>" +
                "<li>Ask the class: which deletion would leave cells producing " +
                "<span class=\"info-term\" data-term=\"lycopene\">lycopene</span> instead of " +
                "<span class=\"info-term\" data-term=\"beta-carotene\">\u03b2-carotene</span>?</li>" +
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
            pathway: {
                title: "Bottromycin biosynthesis",
                description: "A textbook RiPP: BotA is translated as a 44-aa precursor, leader-cleaved, macro-amidinated at the N-terminus, thiazole-installed at Cys, and methylated (3\u00d7 C-methyl + 1\u00d7 O-methyl) before the cytochrome P450 finishes the mature compound.",
                nodes: [
                    {
                        name: "BotA core peptide",
                        smiles: "NCC(=O)N1CCCC1C(=O)NC(C(C)C)C(=O)NC(C(C)C)C(=O)NC(C(C)C)C(=O)NC(Cc1ccccc1)C(=O)NC(CC(=O)O)C(=O)NC(CS)C(=O)O",
                        note: "linear GPVVVFDC octapeptide (leader cleaved by BotP / BotH / BotAH)"
                    },
                    {
                        name: "Bottromycin A2",
                        smiles: "CC(C)CC1NC(=O)C(Cc2c[nH]cn2)NC(=O)C(C(CC)C)NC(=O)C(CC(C)C)NC(=O)C3CCCN3C(=O)C(C)NC1=O",
                        enzyme: "BotCD + BotRMT1\u20133 + BotOMT + BotCYP",
                        cosubstrates: [{ name: "SAM (\u00d74)" }, { name: "O\u2082" }],
                        note: "macroamidine + thiazole + C/O-methylations"
                    }
                ]
            },
            seqvizProps: {
                viewer: "both",
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
            pathway: {
                title: "Linalool biosynthesis",
                description: "A two-enzyme monoterpene route: GPP synthase joins DMAPP + IPP into GPP, then MTS2 ionizes GPP and quenches with water to release linalool \u2014 the floral-citrus top note of dry-hopped beers.",
                nodes: [
                    {
                        name: "Dimethylallyl pyrophosphate",
                        smiles: "CC(C)=CCOP(=O)(O)OP(=O)(O)O"
                    },
                    {
                        name: "Geranyl pyrophosphate",
                        smiles: "CC(C)=CCC/C(C)=C/COP(=O)(O)OP(=O)(O)O",
                        enzyme: "GPPS",
                        cosubstrates: [{ name: "IPP" }],
                        note: "C5 + C5 \u2192 C10"
                    },
                    {
                        name: "Linalool",
                        smiles: "C=CC(C)(O)CCC=C(C)C",
                        enzyme: "MTS2",
                        note: "ionization + H\u2082O quench (releases PPi)"
                    }
                ]
            },
            seqvizProps: {
                viewer: "both",
                zoom: { linear: 50 },
                showComplement: true,
                style: { height: "560px", width: "100%" }
            },
            narrative:
                "<h3>A smell you can ship</h3>" +
                "<p>Monoterpene synthases are the enzymes that turn " +
                "<span class=\"info-term\" data-term=\"gpp\">geranyl pyrophosphate</span> " +
                "into the aromas you recognize as lemon, rose, lavender, or hops. " +
                "EU760349.1 is <em>MTS2</em> from <em>Humulus lupulus</em> (hops, cultivar " +
                "Phoenix) &mdash; a " +
                "<span class=\"info-term\" data-term=\"linalool\">linalool</span> " +
                "synthase responsible for the floral-citrus top " +
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
                enzymes: ["BsaI", "BsmBI"],
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
                "<li>Toggle Golden Gate cutters below to check compatibility before ordering:</li>" +
                "</ul>" +
                "<div class=\"enzyme-toggle-row\">" +
                "<button type=\"button\" class=\"enzyme-toggle\" data-enzyme=\"BsaI\">BsaI</button>" +
                "<button type=\"button\" class=\"enzyme-toggle\" data-enzyme=\"BsmBI\">BsmBI</button>" +
                "<button type=\"button\" class=\"enzyme-toggle\" data-enzyme=\"SapI\">SapI</button>" +
                "</div>" +
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
                viewer: "both",
                zoom: { linear: 35 },
                enzymes: ["BsaI", "BsmBI"],
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
                "<div class=\"enzyme-toggle-row\">" +
                "<button type=\"button\" class=\"enzyme-toggle\" data-enzyme=\"BsaI\">BsaI</button>" +
                "<button type=\"button\" class=\"enzyme-toggle\" data-enzyme=\"BsmBI\">BsmBI</button>" +
                "</div>" +
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
            pathway: {
                title: "Bottromycin biosynthesis",
                description: "A textbook RiPP: BotA is translated as a 44-aa precursor, leader-cleaved, macro-amidinated at the N-terminus, thiazole-installed at Cys, and methylated (3\u00d7 C-methyl + 1\u00d7 O-methyl) before the cytochrome P450 finishes the mature compound.",
                nodes: [
                    {
                        name: "BotA core peptide",
                        smiles: "NCC(=O)N1CCCC1C(=O)NC(C(C)C)C(=O)NC(C(C)C)C(=O)NC(C(C)C)C(=O)NC(Cc1ccccc1)C(=O)NC(CC(=O)O)C(=O)NC(CS)C(=O)O",
                        note: "linear GPVVVFDC octapeptide (leader cleaved by BotP / BotH / BotAH)"
                    },
                    {
                        name: "Bottromycin A2",
                        smiles: "CC(C)CC1NC(=O)C(Cc2c[nH]cn2)NC(=O)C(C(CC)C)NC(=O)C(CC(C)C)NC(=O)C3CCCN3C(=O)C(C)NC1=O",
                        enzyme: "BotCD + BotRMT1\u20133 + BotOMT + BotCYP",
                        cosubstrates: [{ name: "SAM (\u00d74)" }, { name: "O\u2082" }],
                        note: "macroamidine + thiazole + C/O-methylations"
                    }
                ]
            },
            seqvizProps: {
                viewer: "both",
                zoom: { linear: 25 },
                enzymes: ["BsaI", "BsmBI", "NotI"],
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
                "<li>Flag CDSs that will need codon optimization for the new host.</li>" +
                "<li>Toggle the Golden Gate + NotI cutters below to check compatibility:</li>" +
                "</ul>" +
                "<div class=\"enzyme-toggle-row\">" +
                "<button type=\"button\" class=\"enzyme-toggle\" data-enzyme=\"BsaI\">BsaI</button>" +
                "<button type=\"button\" class=\"enzyme-toggle\" data-enzyme=\"BsmBI\">BsmBI</button>" +
                "<button type=\"button\" class=\"enzyme-toggle\" data-enzyme=\"NotI\">NotI</button>" +
                "</div>" +
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
                enzymes: ["EcoRI", "BamHI", "HindIII"],
                style: { height: "620px", width: "100%" }
            },
            narrative:
                "<h3>The ag-biotech reference plasmid</h3>" +
                "<p><strong>pBI121</strong> is the binary vector nearly every Agrobacterium-" +
                "mediated plant transformation paper cites. It carries the " +
                "<code>uidA</code> (GUS) reporter under a 35S promoter with an NPTII " +
                "(<span class=\"info-term\" data-term=\"kanamycin\">kanamycin</span>) " +
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
                "DEFAULT_ENZYMES = [\"EcoRI\", \"BamHI\", \"HindIII\"]\n" +
                "\n" +
                "app = Dash(__name__)\n" +
                "app.layout = html.Div([\n" +
                "    dcc.Checklist(\n" +
                "        id=\"enzyme-picker\",\n" +
                "        options=[{\"label\": e, \"value\": e} for e in MCS_ENZYMES],\n" +
                "        value=DEFAULT_ENZYMES,\n" +
                "        inline=True,\n" +
                "    ),\n" +
                "    SeqViz(\n" +
                "        id=\"pBI121\",\n" +
                "        name=\"pBI121 (AF485783.1)\",\n" +
                "        file=gb,\n" +
                "        viewer=\"both\",\n" +
                "        zoom={\"linear\": 25},\n" +
                "        showComplement=True,\n" +
                "        enzymes=DEFAULT_ENZYMES,\n" +
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
        },

        // ------------------------------------------------------------------
        // INDUSTRIAL (account-research additions — ag-biotech, biopharma,
        // natural products, synbio standardized parts)
        // ------------------------------------------------------------------
        {
            id: "waxy-corn-crispr",
            title: "Waxy corn (Wx1) \u2014 Corteva's first commercial CRISPR crop",
            summary: "The maize Wx1 (waxy) locus. Corteva's 2021 commercial CRISPR product: a knock-out that eliminates amylose for 100% amylopectin starch.",
            category: "industrial",
            tags: ["agriculture", "CRISPR", "trait", "plant-biotech"],
            complexity: 3,
            accession: "X03935.1",
            compound: {
                name: "Maltose",
                smiles: "OC[C@H]1O[C@@H](O[C@H]2[C@H](O)[C@@H](O)[C@H](O)[C@@H](CO)O2)[C@H](O)[C@@H](O)[C@@H]1O",
                description: "The \u03b1-1,4-linked glucose dimer at the heart of starch. The Wx1 gene encodes GBSSI (granule-bound starch synthase I), the enzyme that lays down \u03b1-1,4 chains to build amylose. Disable Wx1 and you get pure amylopectin \u2014 glutinous \"waxy\" starch."
            },
            seqvizProps: {
                viewer: "both",
                zoom: { linear: 60 },
                showComplement: true,
                style: { height: "560px", width: "100%" }
            },
            narrative:
                "<h3>The first CRISPR crop Corteva put in the ground</h3>" +
                "<p>The <em>Waxy</em> (<code>Wx1</code>) locus in maize encodes <em>granule-bound " +
                "starch synthase I</em> (GBSSI), the enzyme that stitches glucose units into " +
                "straight-chain <span class=\"info-term\" data-term=\"amylose\">amylose</span>. " +
                "Disable Wx1 and the kernel makes only " +
                "<span class=\"info-term\" data-term=\"amylopectin\">amylopectin</span> " +
                "\u2014 the branched starch prized by confectioners, noodle makers, and the " +
                "adhesives industry for its clarity, stability, and freeze-thaw tolerance.</p>" +
                "<p>The spontaneous waxy mutation has been selected for in Asian maize and " +
                "glutinous rice for centuries. In 2016 Corteva (then DuPont Pioneer) announced " +
                "a CRISPR-edited waxy hybrid, and in 2021 it became <strong>the first CRISPR " +
                "crop in a US commercial pipeline</strong>. No transgenes, no foreign DNA \u2014 " +
                "just a targeted knock-out \u2014 which also simplified the regulatory path " +
                "(USDA ruled it outside GMO jurisdiction in 2016).</p>" +
                "<h3>Try this</h3>" +
                "<ul>" +
                "<li>Zoom in on the <code>Wx1</code> CDS and pick a 20 bp PAM-adjacent window " +
                "inside an early exon \u2014 that's a plausible CRISPR cut site.</li>" +
                "<li>Toggle the cloning cutters below to see whether the native sequence has " +
                "compatible restriction sites for traditional cloning (versus going gene-edit):</li>" +
                "</ul>" +
                "<div class=\"enzyme-toggle-row\">" +
                "<button type=\"button\" class=\"enzyme-toggle\" data-enzyme=\"EcoRI\">EcoRI</button>" +
                "<button type=\"button\" class=\"enzyme-toggle\" data-enzyme=\"HindIII\">HindIII</button>" +
                "<button type=\"button\" class=\"enzyme-toggle\" data-enzyme=\"BamHI\">BamHI</button>" +
                "</div>" +
                "<h3>References</h3>" +
                "<ul>" +
                "<li>Shure M, Wessler S, Fedoroff N. " +
                "<a href=\"https://pubmed.ncbi.nlm.nih.gov/6414718/\" target=\"_blank\" rel=\"noopener\">" +
                "Molecular identification and isolation of the <em>Waxy</em> locus in maize.</a> " +
                "<em>Cell</em> 35(1):225-33 (1983). PMID: 6414718.</li>" +
                "<li>Waltz E. " +
                "<a href=\"https://pubmed.ncbi.nlm.nih.gov/27097087/\" target=\"_blank\" rel=\"noopener\">" +
                "Gene-edited CRISPR mushroom escapes US regulation.</a> " +
                "<em>Nature</em> 532(7599):293 (2016). PMID: 27097087. (Same regulatory ruling that " +
                "covered DuPont Pioneer's waxy corn.)</li>" +
                "<li>Gao H <em>et al.</em> " +
                "<a href=\"https://pubmed.ncbi.nlm.nih.gov/32541957/\" target=\"_blank\" rel=\"noopener\">" +
                "Superior field performance of waxy corn engineered using CRISPR-Cas9.</a> " +
                "<em>Nat Biotechnol</em> 38(5):579-581 (2020). PMID: 32541957.</li>" +
                "</ul>",
            pythonSnippet:
                "from dash import Dash, html\n" +
                "from dash_seqviz import SeqViz\n" +
                "import requests\n" +
                "\n" +
                "# Maize Wx1 (waxy) locus \u2014 Shure, Wessler & Fedoroff 1983\n" +
                "gb = requests.get(\n" +
                "    \"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi\",\n" +
                "    params={\"db\": \"nuccore\", \"id\": \"X03935.1\",\n" +
                "            \"rettype\": \"gb\", \"retmode\": \"text\",\n" +
                "            \"tool\": \"agbiotech\", \"email\": \"you@lab.org\"},\n" +
                "    timeout=10,\n" +
                ").text\n" +
                "\n" +
                "app = Dash(__name__)\n" +
                "app.layout = html.Div([\n" +
                "    SeqViz(\n" +
                "        id=\"wx1\",\n" +
                "        name=\"Maize Wx1 (X03935.1)\",\n" +
                "        file=gb,\n" +
                "        viewer=\"both\",\n" +
                "        showComplement=True,\n" +
                "        zoom={\"linear\": 60},\n" +
                "        style={\"height\": \"560px\", \"width\": \"100%\"},\n" +
                "    )\n" +
                "])\n" +
                "\n" +
                "if __name__ == \"__main__\":\n" +
                "    app.run(debug=True)\n"
        },
        {
            id: "cp4-epsps",
            title: "CP4 EPSPS \u2014 The Roundup Ready trait",
            summary: "Agrobacterium sp. CP4's glyphosate-insensitive EPSPS. The most commercially deployed trait gene in the history of agriculture.",
            category: "industrial",
            tags: ["agriculture", "herbicide-tolerance", "trait", "plant-biotech"],
            complexity: 3,
            accession: "AF464188.1",
            compound: {
                name: "Glyphosate",
                smiles: "OC(=O)CNCP(=O)(O)O",
                description: "The active ingredient of Roundup. Glyphosate is a phosphonate analog of phosphoenolpyruvate (PEP) that tightly binds the EPSPS active site, choking off aromatic amino-acid biosynthesis. Plants die; mammals are unaffected because we don't have a shikimate pathway."
            },
            seqvizProps: {
                viewer: "both",
                zoom: { linear: 70 },
                showComplement: true,
                style: { height: "560px", width: "100%" }
            },
            narrative:
                "<h3>A bacterium's enzyme that saved a herbicide</h3>" +
                "<p><span class=\"info-term\" data-term=\"glyphosate\">Glyphosate</span> " +
                "kills plants by shutting down the <strong>" +
                "<span class=\"info-term\" data-term=\"shikimate\">shikimate</span> pathway</strong> " +
                "\u2014 specifically by blocking <em>5-enolpyruvylshikimate-3-phosphate synthase</em> " +
                "(EPSPS), which plants and microbes need to make phenylalanine, tyrosine, and " +
                "tryptophan. Mammals lack this pathway, which is why glyphosate has its famously " +
                "wide mammalian safety window.</p>" +
                "<p>In the early 1990s, a Monsanto-led team isolated a naturally glyphosate-insensitive " +
                "EPSPS from <em>Agrobacterium</em> strain <strong>CP4</strong>. A single active-site " +
                "substitution (Gly101 \u2192 Ala in the prokaryotic numbering) keeps " +
                "<span class=\"info-term\" data-term=\"pep\">PEP</span> binding tight " +
                "while sterically excluding glyphosate. Dropping this gene into soybean, cotton, " +
                "canola, and corn created the <strong>Roundup Ready</strong> trait franchise \u2014 " +
                "still the most-deployed GM trait today and core IP that flows through the " +
                "Corteva / Bayer / BASF ag-biotech ecosystem.</p>" +
                "<h3>Try this</h3>" +
                "<ul>" +
                "<li>Find the CDS start codon and inspect the N-terminal <em>chloroplast transit peptide</em> " +
                "\u2014 plants need it to target EPSPS to the chloroplast stroma where the shikimate " +
                "pathway runs.</li>" +
                "<li>Toggle the Golden Gate cutters below to check domestication compatibility:</li>" +
                "</ul>" +
                "<div class=\"enzyme-toggle-row\">" +
                "<button type=\"button\" class=\"enzyme-toggle\" data-enzyme=\"BsaI\">BsaI</button>" +
                "<button type=\"button\" class=\"enzyme-toggle\" data-enzyme=\"BsmBI\">BsmBI</button>" +
                "</div>" +
                "<h3>References</h3>" +
                "<ul>" +
                "<li>Padgette SR, Kolacz KH, Delannay X, Re DB, LaVallee BJ, Tinius CN <em>et al.</em> " +
                "<a href=\"https://doi.org/10.2135/cropsci1995.0011183X003500050004x\" target=\"_blank\" rel=\"noopener\">" +
                "Development, identification, and characterization of a glyphosate-tolerant soybean line.</a> " +
                "<em>Crop Sci</em> 35(5):1451-1461 (1995).</li>" +
                "<li>Funke T, Han H, Healy-Fried ML, Fischer M, Sch\u00f6nbrunn E. " +
                "<a href=\"https://pubmed.ncbi.nlm.nih.gov/16916934/\" target=\"_blank\" rel=\"noopener\">" +
                "Molecular basis for the herbicide resistance of Roundup Ready crops.</a> " +
                "<em>Proc Natl Acad Sci USA</em> 103(35):13010-5 (2006). PMID: 16916934.</li>" +
                "</ul>",
            pythonSnippet:
                "from dash import Dash, html\n" +
                "from dash_seqviz import SeqViz\n" +
                "import requests\n" +
                "\n" +
                "# CP4 EPSPS \u2014 the Roundup Ready trait gene\n" +
                "gb = requests.get(\n" +
                "    \"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi\",\n" +
                "    params={\"db\": \"nuccore\", \"id\": \"AF464188.1\",\n" +
                "            \"rettype\": \"gb\", \"retmode\": \"text\",\n" +
                "            \"tool\": \"agbiotech\", \"email\": \"you@lab.org\"},\n" +
                "    timeout=10,\n" +
                ").text\n" +
                "\n" +
                "app = Dash(__name__)\n" +
                "app.layout = html.Div([\n" +
                "    SeqViz(\n" +
                "        id=\"cp4-epsps\",\n" +
                "        name=\"CP4 EPSPS (AF464188.1)\",\n" +
                "        file=gb,\n" +
                "        viewer=\"both\",\n" +
                "        showComplement=True,\n" +
                "        zoom={\"linear\": 70},\n" +
                "        enzymes=[\"BsaI\", \"BsmBI\"],\n" +
                "        style={\"height\": \"560px\", \"width\": \"100%\"},\n" +
                "    )\n" +
                "])\n" +
                "\n" +
                "if __name__ == \"__main__\":\n" +
                "    app.run(debug=True)\n"
        },
        {
            id: "lovastatin-cluster",
            title: "Lovastatin biosynthetic cluster \u2014 The textbook fungal polyketide",
            summary: "Aspergillus terreus lovA/lovB/lovC/lovD/lovF cluster. A cholesterol-lowering blockbuster built by a classic iterative polyketide synthase (PKS).",
            category: "academic",
            tags: ["graduate", "biosynthesis", "polyketide", "fungal", "cluster"],
            complexity: 4,
            // The lovastatin cluster was deposited as two separate NCBI
            // records: AH007774 (segmented set covering lovA / lovC /
            // lovD / lovF / esterase / transport genes) and AF151722
            // (the lovB nonaketide synthase CDS). The page renders them
            // side by side in one live-viewer card so the full picture
            // reads as a single teaching unit.
            accessions: [
                { id: "AH007774",   label: "Core cluster (lovA / lovC / lovD / lovF)" },
                { id: "AF151722.1", label: "LovB \u2014 nonaketide synthase" }
            ],
            compound: {
                name: "Lovastatin",
                smiles: "CCC(C)C(=O)OC1CC(C)C=C2C=CC(C)C(CCC3CC(O)CC(=O)O3)C12",
                description: "An HMG-CoA reductase inhibitor that launched the statin class. LovB (a nonaketide synthase) iteratively condenses nine acetate units; LovC trims; LovA oxidizes; LovD tacks on a 2-methylbutyrate side chain. A 300 M&dollar;/yr scaffold that defines fungal polyketide teaching."
            },
            pathway: {
                title: "Lovastatin biosynthesis",
                description: "Acetyl-CoA seeds the chain; LovB (iterative nonaketide PKS) and LovC (trans-acting enoyl reductase) run nine condensation rounds with malonyl-CoA and two SAM-dependent C-methylations to build the decalin scaffold. LovA (P450) installs the double bonds and C8 hydroxyl. A parallel LovF diketide synthase makes (S)-2-methylbutyryl-CoA from its own malonyl + SAM pool, which LovD then transesterifies onto monacolin J to finish lovastatin.",
                nodes: [
                    {
                        name: "Acetyl-CoA",
                        smiles: "CC(=O)SCCNC(C)=O"
                    },
                    {
                        name: "Dihydromonacolin L",
                        smiles: "CCC(C)C1CCC2CCC(C)C(CCC3CC(O)CC(=O)O3)C12",
                        enzyme: "LovB + LovC",
                        cosubstrates: [
                            { name: "Malonyl-CoA" },
                            { name: "SAM" },
                            { name: "NADPH" }
                        ],
                        note: "iterative PKS: 9 rounds + 2\u00d7 C-methylation"
                    },
                    {
                        name: "Monacolin L",
                        smiles: "CCC(C)C1CC=C2C=CC(C)C(CCC3CC(O)CC(=O)O3)C12",
                        enzyme: "LovA (P450)",
                        cosubstrates: [{ name: "O\u2082" }, { name: "NADPH" }],
                        note: "two desaturations"
                    },
                    {
                        name: "Monacolin J",
                        smiles: "OC1CC(C)C=C2C=CC(C)C(CCC3CC(O)CC(=O)O3)C12",
                        enzyme: "LovA (P450)",
                        cosubstrates: [{ name: "O\u2082" }, { name: "NADPH" }],
                        note: "C8 hydroxylation"
                    },
                    {
                        name: "Lovastatin",
                        smiles: "CCC(C)C(=O)OC1CC(C)C=C2C=CC(C)C(CCC3CC(O)CC(=O)O3)C12",
                        enzyme: "LovD",
                        cosubstrates: [{ name: "2-Methylbutyryl-CoA" }],
                        note: "transesterification onto C8-OH (side chain made by LovF diketide synthase)"
                    }
                ]
            },
            seqvizProps: {
                // "Both" is disabled by the page on multi-viewer examples
                // (see multi-viewer logic in example.html), so we explicitly
                // default to "circular" here — it's the most useful single
                // view for comparing cluster vs. megasynthase side by side.
                viewer: "circular",
                // Default linear zoom fully zoomed out (1) so when the
                // user flips to "Linear" they see all of the lov CDSs
                // laid end-to-end at a glance rather than landing inside
                // a single gene.
                zoom: { linear: 1 },
                style: { height: "520px", width: "100%" }
            },
            narrative:
                "<h3>A fungal polyketide that moved a global cholesterol market</h3>" +
                "<p><span class=\"info-term\" data-term=\"lovastatin\">Lovastatin</span> " +
                "was the first statin approved (Merck's Mevacor, 1987) and the " +
                "proof-of-concept for a drug class that now underpins cardiovascular medicine. " +
                "It's also the <strong>textbook example</strong> for how fungal iterative " +
                "polyketide synthases (PKSs) work.</p>" +
                "<p>Two NCBI records tell the full story and they're shown side by side in " +
                "the live viewer above: <strong>AH007774</strong> is Kennedy <em>et al.</em>'s " +
                "segmented-set deposit covering <code>lovA</code>, <code>lovC</code>, " +
                "<code>lovD</code>, <code>lovF</code>, and the accessory transport/regulatory " +
                "genes; " +
                "<strong>AF151722</strong> is the ~11 kb <code>lovB</code> megasynthase CDS, " +
                "deposited separately. The topology toggle and zoom slider apply to both at " +
                "once \u2014 the multi-viewer pattern is a taste of how to compose " +
                "<code>dash-seqviz</code> components with shared state in a real Dash app " +
                "(see the snippet below).</p>" +
                "<h3>The five enzymes and what they do</h3>" +
                "<ul>" +
                "<li><strong><code>lovB</code></strong> (~10 kb CDS!) is the <em>nonaketide " +
                "synthase</em> \u2014 one enormous megasynthase that threads an acetyl-CoA " +
                "starter plus eight malonyl-CoA extenders through its own active site, running " +
                "a programmed sequence of condensation, ketoreduction, dehydration, and Diels\u2013" +
                "Alder-like cyclization. Two of the rounds include a SAM-dependent C-methylation " +
                "via its own MT domain. LovB releases <em>dihydromonacolin L acid</em> and " +
                "lactonizes it.</li>" +
                "<li><strong><code>lovC</code></strong> is a <em>trans-acting enoyl reductase</em>. " +
                "LovB's own ER domain is only active for some rounds \u2014 LovC shows up " +
                "in trans during rounds 2\u20133 to finish the job. Without LovC the chain " +
                "stalls.</li>" +
                "<li><strong><code>lovA</code></strong> is a <em>cytochrome P450</em> that " +
                "performs two successive oxidations on the released scaffold: first two " +
                "desaturations (Dihydromonacolin L \u2192 Monacolin L), then a C8 hydroxylation " +
                "(Monacolin L \u2192 Monacolin J).</li>" +
                "<li><strong><code>lovF</code></strong> is a <em>separate diketide synthase</em> " +
                "that builds the (S)-2-methylbutyryl-CoA side chain from malonyl-CoA + SAM in " +
                "parallel with the main nonaketide stream.</li>" +
                "<li><strong><code>lovD</code></strong> is the <em>acyltransferase</em> that " +
                "transesterifies LovF's 2-methylbutyryl group onto Monacolin J's C8 hydroxyl " +
                "\u2014 the final step that distinguishes lovastatin from simvastatin/monacolin J.</li>" +
                "</ul>" +
                "<h3>Try this</h3>" +
                "<ul>" +
                "<li>Switch the topology to <em>Linear</em> and watch both sequences jump to " +
                "the linear track at the same time \u2014 a single toggle drives every viewer " +
                "in the card.</li>" +
                "<li>In the <strong>AH007774</strong> viewer, zoom out to see the four " +
                "<em>lov</em> CDSs on this record \u2014 <code>lovA</code> (P450), " +
                "<code>lovC</code> (trans-ER), <code>lovD</code> (acyltransferase), and " +
                "<code>lovF</code> (diketide synthase for the 2-methylbutyryl side chain) " +
                "\u2014 plus the accessory transport/regulatory genes.</li>" +
                "<li>In the <strong>AF151722</strong> viewer, note <code>lovB</code>'s " +
                "single enormous CDS \u2014 the megasynthase is one polypeptide doing the " +
                "work of a seven-domain assembly line.</li>" +
                "<li>Use the pathway panel to follow the decalin scaffold from acetyl-CoA all " +
                "the way to lovastatin. Toggle \"Full reaction scheme\" to see the starter, " +
                "extender, and side-chain cosubstrates drawn inline.</li>" +
                "</ul>" +
                "<h3>References</h3>" +
                "<ul>" +
                "<li>Kennedy J, Auclair K, Kendrew SG, Park C, Vederas JC, Hutchinson CR. " +
                "<a href=\"https://pubmed.ncbi.nlm.nih.gov/10329708/\" target=\"_blank\" rel=\"noopener\">" +
                "Modulation of polyketide synthase activity by accessory proteins during " +
                "lovastatin biosynthesis.</a> " +
                "<em>Science</em> 284(5418):1368-72 (1999). PMID: 10329708.</li>" +
                "<li>Xu W, Chooi YH, Choi JW, Li S, Vederas JC, Da Silva NA, Tang Y. " +
                "<a href=\"https://pubmed.ncbi.nlm.nih.gov/23495210/\" target=\"_blank\" rel=\"noopener\">" +
                "LovG: the thioesterase required for dihydromonacolin L release and lovastatin " +
                "nonaketide synthase turnover in lovastatin biosynthesis.</a> " +
                "<em>Angew Chem Int Ed</em> 52(25):6472-5 (2013). PMID: 23495210.</li>" +
                "</ul>",
            pythonSnippet:
                "\"\"\"Lovastatin cluster: two records, one dashboard.\n" +
                "\n" +
                "Shows the multi-viewer pattern used on the web page: two SeqViz\n" +
                "components driven by a single topology radio. The grid layout\n" +
                "also flips with topology \u2014 side-by-side for Circular so the\n" +
                "plasmids sit next to each other, stacked for Linear so each\n" +
                "sequence gets the full card width to scroll through.\n" +
                "\"\"\"\n" +
                "from dash import Dash, html, dcc, Input, Output, callback\n" +
                "from dash_seqviz import SeqViz\n" +
                "import requests\n" +
                "\n" +
                "ACCESSIONS = [\n" +
                "    (\"AH007774\",   \"Core cluster (lovA / lovC / lovD / lovF)\"),\n" +
                "    (\"AF151722.1\", \"LovB \u2014 nonaketide synthase\"),\n" +
                "]\n" +
                "\n" +
                "# Layout presets keyed by the topology value. Keeping them at\n" +
                "# module scope lets both the layout and the callback below\n" +
                "# reference the same source of truth.\n" +
                "GRID_SIDE_BY_SIDE = {\n" +
                "    \"display\": \"grid\",\n" +
                "    \"gridTemplateColumns\": \"repeat(auto-fit, minmax(420px, 1fr))\",\n" +
                "    \"gap\": \"14px\",\n" +
                "}\n" +
                "GRID_STACKED = {\n" +
                "    \"display\": \"grid\",\n" +
                "    \"gridTemplateColumns\": \"1fr\",\n" +
                "    \"gap\": \"14px\",\n" +
                "}\n" +
                "\n" +
                "def fetch_gb(accession: str) -> str:\n" +
                "    return requests.get(\n" +
                "        \"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi\",\n" +
                "        params={\"db\": \"nuccore\", \"id\": accession,\n" +
                "                \"rettype\": \"gb\", \"retmode\": \"text\",\n" +
                "                \"tool\": \"natural-products\", \"email\": \"you@lab.org\"},\n" +
                "        timeout=10,\n" +
                "    ).text\n" +
                "\n" +
                "records = {acc: fetch_gb(acc) for acc, _ in ACCESSIONS}\n" +
                "\n" +
                "app = Dash(__name__)\n" +
                "app.layout = html.Div([\n" +
                "    dcc.RadioItems(\n" +
                "        id=\"topology\",\n" +
                "        options=[{\"label\": \"Circular\", \"value\": \"circular\"},\n" +
                "                 {\"label\": \"Linear\",   \"value\": \"linear\"}],\n" +
                "        value=\"circular\",\n" +
                "        inline=True,\n" +
                "    ),\n" +
                "    html.Div(\n" +
                "        id=\"viewer-grid\",\n" +
                "        children=[\n" +
                "            html.Div([\n" +
                "                html.Div([html.Strong(acc), html.Span(f\" \u2014 {label}\")]),\n" +
                "                SeqViz(\n" +
                "                    id={\"type\": \"viz\", \"acc\": acc},\n" +
                "                    name=f\"{acc} \u2014 {label}\",\n" +
                "                    file=records[acc],\n" +
                "                    viewer=\"circular\",\n" +
                "                    # Fully zoomed out so the linear view lands on an\n" +
                "                    # overview of all lov CDSs, not inside a single gene.\n" +
                "                    zoom={\"linear\": 1},\n" +
                "                    style={\"height\": \"520px\", \"width\": \"100%\"},\n" +
                "                ),\n" +
                "            ]) for acc, label in ACCESSIONS\n" +
                "        ],\n" +
                "        style=GRID_SIDE_BY_SIDE,\n" +
                "    ),\n" +
                "])\n" +
                "\n" +
                "# Callback 1: topology radio → every SeqViz at once via pattern-matching IDs.\n" +
                "@callback(\n" +
                "    Output({\"type\": \"viz\", \"acc\": \"ALL\"}, \"viewer\", allow_duplicate=True),\n" +
                "    Input(\"topology\", \"value\"),\n" +
                "    prevent_initial_call=True,\n" +
                ")\n" +
                "def set_topology(value):\n" +
                "    return [value] * len(ACCESSIONS)\n" +
                "\n" +
                "# Callback 2: same topology radio → grid layout. Side-by-side for\n" +
                "# Circular (square views), stacked for Linear (wide scrollers).\n" +
                "@callback(\n" +
                "    Output(\"viewer-grid\", \"style\"),\n" +
                "    Input(\"topology\", \"value\"),\n" +
                ")\n" +
                "def set_grid_layout(value):\n" +
                "    return GRID_STACKED if value == \"linear\" else GRID_SIDE_BY_SIDE\n" +
                "\n" +
                "if __name__ == \"__main__\":\n" +
                "    app.run(debug=True)\n"
        },
        {
            id: "puc19-modular-cloning",
            title: "pUC19 \u2014 The cloning workhorse that launched modular DNA assembly",
            summary: "The 2,686 bp pUC19 backbone. The most-deployed cloning vector in molecular biology and the philosophical ancestor of every standardized synbio parts kit.",
            category: "industrial",
            tags: ["synthetic-biology", "cloning", "standardized", "vector"],
            complexity: 2,
            accession: "L09137.1",
            seqvizProps: {
                // pUC19 is a 2.7 kb plasmid — circular view tells the
                // story (closed loop, MCS, markers); linear is just an
                // unrolled segment. Start on circular.
                viewer: "circular",
                zoom: { linear: 80 },
                enzymes: ["EcoRI", "BamHI", "HindIII", "SalI", "PstI", "SphI"],
                showComplement: true,
                style: { height: "560px", width: "100%" }
            },
            narrative:
                "<h3>The DNA that every modular cloning kit descends from</h3>" +
                "<p><strong>pUC19</strong> (Yanisch-Perron, Vieira &amp; Messing, 1985) is the " +
                "single most-cited plasmid in molecular biology. A <em>2,686 bp</em> circular " +
                "backbone carrying a ColE1 origin, <em>bla</em> (ampicillin resistance), and a " +
                "multi-cloning site embedded in <em>lacZα</em> for blue/white screening, it " +
                "defined what a general-purpose cloning vector <strong>should</strong> look " +
                "like \u2014 small, stable, high-copy, easy to screen.</p>" +
                "<p>Every modular-cloning toolkit built since \u2014 <strong>pSB1C3</strong> " +
                "(iGEM BioBricks), <strong>MoClo</strong>, <strong>pYTK</strong> (Dueber yeast " +
                "toolkit), the <strong>pGoldenGate</strong> family, and every industrial " +
                "biofoundry parts library since \u2014 traces its philosophy of \"one shared " +
                "backbone, interchangeable inserts\" back to pUC19. If you're teaching a new " +
                "scientist why standardized DNA parts matter, this is where you start.</p>" +
                "<h3>Try this</h3>" +
                "<ul>" +
                "<li>Toggle the classic MCS cutters below. All six sit in the lacZα MCS, close " +
                "enough that cloning into any of them disrupts lacZα and produces a white colony.</li>" +
                "<li>Switch the viewer to <em>Circular</em> to see the vector's compact geometry " +
                "\u2014 this is the shape every downstream synbio toolkit scales up from.</li>" +
                "</ul>" +
                "<div class=\"enzyme-toggle-row\">" +
                "<button type=\"button\" class=\"enzyme-toggle\" data-enzyme=\"EcoRI\">EcoRI</button>" +
                "<button type=\"button\" class=\"enzyme-toggle\" data-enzyme=\"BamHI\">BamHI</button>" +
                "<button type=\"button\" class=\"enzyme-toggle\" data-enzyme=\"HindIII\">HindIII</button>" +
                "<button type=\"button\" class=\"enzyme-toggle\" data-enzyme=\"SalI\">SalI</button>" +
                "<button type=\"button\" class=\"enzyme-toggle\" data-enzyme=\"PstI\">PstI</button>" +
                "<button type=\"button\" class=\"enzyme-toggle\" data-enzyme=\"SphI\">SphI</button>" +
                "</div>" +
                "<h3>References</h3>" +
                "<ul>" +
                "<li>Yanisch-Perron C, Vieira J, Messing J. " +
                "<a href=\"https://pubmed.ncbi.nlm.nih.gov/2985470/\" target=\"_blank\" rel=\"noopener\">" +
                "Improved M13 phage cloning vectors and host strains: nucleotide sequences of " +
                "the M13mp18 and pUC19 vectors.</a> " +
                "<em>Gene</em> 33(1):103-19 (1985). PMID: 2985470.</li>" +
                "<li>Lee ME, DeLoache WC, Cervantes B, Dueber JE. " +
                "<a href=\"https://pubmed.ncbi.nlm.nih.gov/25871405/\" target=\"_blank\" rel=\"noopener\">" +
                "A highly characterized yeast toolkit for modular, multipart assembly.</a> " +
                "<em>ACS Synth Biol</em> 4(9):975-86 (2015). PMID: 25871405. (One of many modern " +
                "MoClo kits built on the pUC-style backbone tradition.)</li>" +
                "</ul>",
            pythonSnippet:
                "from dash import Dash, html\n" +
                "from dash_seqviz import SeqViz\n" +
                "import requests\n" +
                "\n" +
                "# pUC19 \u2014 the classic cloning vector (Yanisch-Perron, Vieira & Messing 1985)\n" +
                "gb = requests.get(\n" +
                "    \"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi\",\n" +
                "    params={\"db\": \"nuccore\", \"id\": \"L09137.1\",\n" +
                "            \"rettype\": \"gb\", \"retmode\": \"text\",\n" +
                "            \"tool\": \"synbio\", \"email\": \"you@lab.org\"},\n" +
                "    timeout=10,\n" +
                ").text\n" +
                "\n" +
                "app = Dash(__name__)\n" +
                "app.layout = html.Div([\n" +
                "    SeqViz(\n" +
                "        id=\"puc19\",\n" +
                "        name=\"pUC19 (L09137.1)\",\n" +
                "        file=gb,\n" +
                "        viewer=\"circular\",\n" +
                "        showComplement=True,\n" +
                "        enzymes=[\"EcoRI\", \"BamHI\", \"HindIII\", \"SalI\", \"PstI\", \"SphI\"],\n" +
                "        style={\"height\": \"560px\", \"width\": \"100%\"},\n" +
                "    )\n" +
                "])\n" +
                "\n" +
                "if __name__ == \"__main__\":\n" +
                "    app.run(debug=True)\n"
        },
        {
            id: "trastuzumab-her2",
            title: "HER2 / ERBB2 \u2014 The receptor behind Herceptin",
            summary: "The original HER2 cDNA (Coussens et al. 1985). The molecular target of trastuzumab (Herceptin) \u2014 Genentech's landmark humanized monoclonal antibody.",
            category: "industrial",
            tags: ["biopharma", "antibody", "oncology", "mAb"],
            complexity: 4,
            accession: "M11730.1",
            seqvizProps: {
                viewer: "both",
                zoom: { linear: 40 },
                showComplement: false,
                style: { height: "560px", width: "100%" }
            },
            narrative:
                "<h3>The receptor that became a drug target</h3>" +
                "<p><strong>HER2</strong> (ERBB2) was first cloned by Coussens <em>et al.</em> " +
                "in 1985 as a tyrosine-kinase receptor homologous to EGFR and co-located with " +
                "the <em>neu</em> oncogene \u2014 the discovery captured in this <code>M11730</code> " +
                "record. A decade later it would become the most important drug target in " +
                "oncology: HER2 is amplified in ~20% of breast cancers, where it drives " +
                "aggressive tumor growth.</p>" +
                "<p>In the mid-1990s, <strong>Genentech</strong> humanized a murine anti-HER2 " +
                "antibody (4D5) by grafting its complementarity-determining regions onto a human " +
                "IgG1 framework \u2014 a landmark use of <em>CDR grafting</em> (Carter, Presta, " +
                "Gorman <em>et al.</em> 1992). The resulting antibody, <strong>trastuzumab</strong> " +
                "(Herceptin), was FDA-approved in 1998 and launched the era of targeted mAb " +
                "therapies in oncology. The part that matters for Herceptin binding is the " +
                "<em>extracellular domain IV</em> \u2014 roughly residues 480\u2013620 of the " +
                "ERBB2 protein. Modern antibody engineering teams at <strong>Genentech</strong>, " +
                "<strong>Merck</strong>, <strong>Regeneron</strong>, <strong>AbbVie</strong>, " +
                "and the wider biopharma ecosystem spend their days visualizing constructs " +
                "exactly like this when designing CHO-cell expression vectors for humanized " +
                "IgGs and their bispecific/ADC derivatives.</p>" +
                "<h3>Try this</h3>" +
                "<ul>" +
                "<li>Look for the CDS start \u2014 the signal peptide is the first ~22 residues, " +
                "followed by the extracellular subdomains I\u2013IV (~residues 23\u2013652).</li>" +
                "<li>Toggle the common mammalian expression cutters below \u2014 useful when " +
                "deciding whether to sub-clone the ECD for phage display or purified antigen.</li>" +
                "</ul>" +
                "<div class=\"enzyme-toggle-row\">" +
                "<button type=\"button\" class=\"enzyme-toggle\" data-enzyme=\"EcoRI\">EcoRI</button>" +
                "<button type=\"button\" class=\"enzyme-toggle\" data-enzyme=\"NotI\">NotI</button>" +
                "<button type=\"button\" class=\"enzyme-toggle\" data-enzyme=\"HindIII\">HindIII</button>" +
                "<button type=\"button\" class=\"enzyme-toggle\" data-enzyme=\"XbaI\">XbaI</button>" +
                "</div>" +
                "<h3>References</h3>" +
                "<ul>" +
                "<li>Coussens L, Yang-Feng TL, Liao YC, Chen E, Gray A, McGrath J <em>et al.</em> " +
                "<a href=\"https://pubmed.ncbi.nlm.nih.gov/3863936/\" target=\"_blank\" rel=\"noopener\">" +
                "Tyrosine kinase receptor with extensive homology to EGF receptor shares " +
                "chromosomal location with <em>neu</em> oncogene.</a> " +
                "<em>Science</em> 230(4730):1132-9 (1985). PMID: 3863936.</li>" +
                "<li>Carter P, Presta L, Gorman CM, Ridgway JB, Henner D, Wong WL <em>et al.</em> " +
                "<a href=\"https://pubmed.ncbi.nlm.nih.gov/1350088/\" target=\"_blank\" rel=\"noopener\">" +
                "Humanization of an anti-p185HER2 antibody for human cancer therapy.</a> " +
                "<em>Proc Natl Acad Sci USA</em> 89(10):4285-9 (1992). PMID: 1350088.</li>" +
                "<li>Cho HS, Mason K, Ramyar KX, Stanley AM, Gabelli SB, Denney DW Jr, Leahy DJ. " +
                "<a href=\"https://pubmed.ncbi.nlm.nih.gov/12610629/\" target=\"_blank\" rel=\"noopener\">" +
                "Structure of the extracellular region of HER2 alone and in complex with the " +
                "Herceptin Fab.</a> " +
                "<em>Nature</em> 421(6924):756-60 (2003). PMID: 12610629.</li>" +
                "</ul>",
            pythonSnippet:
                "from dash import Dash, html\n" +
                "from dash_seqviz import SeqViz\n" +
                "import requests\n" +
                "\n" +
                "# HER2 mRNA \u2014 the original Coussens et al. 1985 clone,\n" +
                "# target of trastuzumab (Herceptin).\n" +
                "gb = requests.get(\n" +
                "    \"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi\",\n" +
                "    params={\"db\": \"nuccore\", \"id\": \"M11730.1\",\n" +
                "            \"rettype\": \"gb\", \"retmode\": \"text\",\n" +
                "            \"tool\": \"biopharma\", \"email\": \"you@lab.org\"},\n" +
                "    timeout=10,\n" +
                ").text\n" +
                "\n" +
                "app = Dash(__name__)\n" +
                "app.layout = html.Div([\n" +
                "    SeqViz(\n" +
                "        id=\"erbb2\",\n" +
                "        name=\"HER2 / ERBB2 (M11730.1)\",\n" +
                "        file=gb,\n" +
                "        viewer=\"both\",\n" +
                "        zoom={\"linear\": 40},\n" +
                "        enzymes=[\"EcoRI\", \"NotI\", \"HindIII\", \"XbaI\"],\n" +
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
