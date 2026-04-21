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
                "<figure class=\"organism-figure figure-right\">" +
                    "<img src=\"./assets/images/aequorea-victoria.jpg\" " +
                         "alt=\"A crystal jelly, Aequorea victoria, in an aquarium, " +
                              "its translucent bell and radial canals visible against " +
                              "dark water.\">" +
                    "<figcaption><em>Aequorea victoria</em>, the crystal jelly. A " +
                    "hydromedusa of the Pacific Northwest coast; the source of the " +
                    "original GFP cDNA in 1992. Image: Sierra Blakely / Wikimedia " +
                    "Commons (CC BY-SA 4.0).</figcaption>" +
                "</figure>" +
                "<h3>Why GFP?</h3>" +
                "<p>Green Fluorescent Protein (GFP) from <em>Aequorea victoria</em> is the " +
                "most taught reporter gene in biology. Students can <em>see</em> its 238-amino-acid " +
                "CDS, the chromophore-forming residues (Ser65-Tyr66-Gly67), and use it as a " +
                "template to talk about translation, codon usage, and folding.</p>" +
                "<h3>Try this</h3>" +
                "<ul>" +
                "<li><strong>Land at the start codon.</strong> Search for <code>ATGAGT</code> " +
                "&mdash; the first 6 bp of the GFP CDS. The highlight anchors you at residue 1 " +
                "so the rest of the walkthrough has a reference point.</li>" +
                "<li><strong>Turn on <em>Show translations</em>.</strong> Now every codon is " +
                "rendered in frame under the DNA. The single-letter protein track is what lets " +
                "you <em>see</em> codon usage, the signal-less N-terminus, and the conserved " +
                "&beta;-barrel residues without leaving the viewer.</li>" +
                "<li><strong>Find the chromophore triad.</strong> With translations on, search " +
                "for <code>SYG</code> (or the DNA <code>AGCTATGGT</code>) to jump to residues " +
                "<strong>Ser65-Tyr66-Gly67</strong>. Those three residues auto-cyclize inside " +
                "the folded barrel to form the fluorophore shown in the compound panel " +
                "&mdash; no enzyme required. This is why a single CDS is enough to make a cell " +
                "glow.</li>" +
                "<li><strong>Toggle the classic cloning sites below.</strong> They land in " +
                "flanking sequence, not in the CDS &mdash; a reminder that reporter gene design " +
                "is as much about where you <em>can</em> cut as about what you&rsquo;re putting in.</li>" +
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
                "# Fetch GFP CDS from NCBI (M62653.1 — Aequorea victoria, 1992)\n" +
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
                "(permease), and <code>lacA</code> (transacetylase). Read left to right, those " +
                "features are the whole regulation story in the order RNA polymerase " +
                "encounters them.</p>" +
                "<h3>Try this: walk the regulatory region</h3>" +
                "<ul>" +
                "<li><strong>Search <code>AATTGTGAGC</code> &mdash; the CAP site.</strong> " +
                "This is the left half of the CRP/CAP binding site. When glucose is low, " +
                "cAMP-CAP sits here and bends the DNA so RNA polymerase can productively " +
                "engage the promoter. This is the <em>activation</em> input to the operon.</li>" +
                "<li><strong>Zoom in ~40&ndash;60 bp downstream to the &minus;35 / &minus;10 " +
                "promoter.</strong> Switch to linear view and nudge the zoom slider up &mdash; " +
                "the two hexamer boxes are where &sigma;<sup>70</sup> contacts DNA. With " +
                "translations off you can read the spacer length (17 bp) that sets promoter " +
                "strength.</li>" +
                "<li><strong>Continue to <code>lacO</code>, the operator.</strong> It overlaps " +
                "the transcription start. In the <em>repressed</em> state, LacI tetramer sits " +
                "on <code>lacO</code> and physically blocks RNAP elongation &mdash; CAP can be " +
                "bound and it still won&rsquo;t transcribe. This is the <em>repression</em> " +
                "input.</li>" +
                "<li><strong>Hover <span class=\"info-term\" data-term=\"iptg\">IPTG</span></strong> " +
                "in this sentence to see the small-molecule inducer that flips the circuit " +
                "<em>on</em>. IPTG (or the natural inducer allolactose) binds LacI, drops its " +
                "affinity for <code>lacO</code>, and the operator clears &mdash; now CAP-activated " +
                "polymerase can run straight into <code>lacZ</code>.</li>" +
                "<li><strong>Turn on translations over <code>lacZ</code>.</strong> You&rsquo;ll " +
                "see the &beta;-galactosidase reading frame &mdash; the enzyme that cleaves " +
                "lactose into glucose and galactose and, in the classroom, cleaves X-gal into " +
                "the blue indigo product. That color change is the same transcriptional output " +
                "you just walked through in four steps above.</li>" +
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
                search: { query: "ATGAAGCATTCT" },  // vioA start codon + 9 bp (M-K-H-S)
                style: { height: "560px", width: "100%" }
            },
            narrative:
                "<figure class=\"organism-figure figure-right\">" +
                    "<img src=\"./assets/images/chromobacterium-violaceum.jpg\" " +
                         "alt=\"Blood agar plate culture of Chromobacterium violaceum " +
                              "showing deep-violet pigmented colonies caused by the " +
                              "endogenous violacein.\">" +
                    "<figcaption><em>Chromobacterium violaceum</em> on blood agar. The " +
                    "violet colour is violacein, produced endogenously by the vioABCDE " +
                    "cluster. Image: CDC / Dr. W.A. Clark / Wikimedia Commons " +
                    "(public domain).</figcaption>" +
                "</figure>" +
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
                "<li>Hover <span class=\"info-term\" data-term=\"l-tryptophan\">L-tryptophan</span> " +
                "in the paragraph above to pop the substrate card \u2014 this is the aromatic " +
                "amino acid the whole cluster consumes, two molecules per violacein.</li>" +
                "<li>On the pathway card to the right, flip between <em>Full reaction scheme</em> " +
                "and <em>Intermediates only</em>. In the full scheme you can see O\u2082 drawn in " +
                "as a cosubstrate at three distinct steps (VioA, VioD, VioC) \u2014 this cluster " +
                "is <strong>oxygen-hungry</strong>, which matters when you try to push titer in a " +
                "bioreactor.</li>" +
                "<li>Tie each arrow on the pathway card to its gene in the linear viewer: find " +
                "<code>vioA</code>, <code>vioB</code>, <code>vioC</code>, <code>vioD</code>, " +
                "<code>vioE</code> in order and match each to the transformation it catalyzes " +
                "(VioA flavin oxidase \u2192 IPA imine; VioB+VioE dimerizes; VioD hydroxylates; " +
                "VioC oxidizes to violet).</li>" +
                "<li>The viewer is already searching for <code>ATGAAGCATTCT</code> \u2014 the " +
                "<code>vioA</code> start codon and its first three codons (M-K-H-S). The match " +
                "highlights the 5\u2032 end of the cluster so you can see exactly where the " +
                "pathway boots up.</li>" +
                "<li>When you're ready to see how this cluster gets rebuilt for a production " +
                "chassis, load the industrial companion: " +
                "<a href=\"./example.html?id=violacein-refactored\">Violacein refactored for " +
                "E. coli</a>.</li>" +
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
                "<p>The " +
                "<span class=\"info-term\" data-term=\"pantoea-ananatis\">" +
                "<em>Erwinia uredovora</em></span> carotenoid cluster converts " +
                "<span class=\"info-term\" data-term=\"fpp\">farnesyl pyrophosphate</span> " +
                "into " +
                "<span class=\"info-term\" data-term=\"beta-carotene\">\u03b2-carotene</span>, " +
                "<span class=\"info-term\" data-term=\"zeaxanthin\">zeaxanthin</span>, or " +
                "<span class=\"info-term\" data-term=\"lycopene\">lycopene</span> " +
                "depending on which genes are present. It is a favorite teaching case for " +
                "<strong>pathway engineering</strong> because the color of a plate reveals " +
                "how far the pathway went.</p>" +
                "<h3>Try this: follow the color of the plate</h3>" +
                "<p>Each enzyme in this cluster changes what you'd see on a plate. " +
                "Use the pathway card + the viewer together to map genes \u2192 chemistry " +
                "\u2192 color.</p>" +
                "<ul>" +
                "<li><strong>Land on the five crt genes.</strong> In the linear viewer, " +
                "identify <code>crtE</code>, <code>crtB</code>, <code>crtI</code>, " +
                "<code>crtY</code>, <code>crtZ</code> left-to-right. Each one's deletion " +
                "halts the pathway at a different intermediate \u2014 and a different color.</li>" +
                "<li><strong>Walk the pathway card, with \u201CFull reaction scheme\u201D " +
                "selected.</strong> Watch the intermediates change: " +
                "<span class=\"info-term\" data-term=\"fpp\">FPP</span> " +
                "\u2192 GGPP \u2192 " +
                "<span class=\"info-term\" data-term=\"phytoene\">phytoene</span> " +
                "(colorless) \u2192 " +
                "<span class=\"info-term\" data-term=\"lycopene\">lycopene</span> " +
                "(red) \u2192 " +
                "<span class=\"info-term\" data-term=\"beta-carotene\">\u03b2-carotene</span> " +
                "(orange) \u2192 " +
                "<span class=\"info-term\" data-term=\"zeaxanthin\">zeaxanthin</span> " +
                "(yellow). Hover any intermediate to see the 2D structure that produces that color.</li>" +
                "<li><strong>Flip to \u201CIntermediates only\u201D.</strong> The enzyme " +
                "names and cosubstrates drop out so the chain of compounds reads as a pure " +
                "color ladder \u2014 useful for the \"what color does each plate turn?\" " +
                "classroom question.</li>" +
                "<li><strong>Answer the deletion question with the viewer.</strong> Deleting " +
                "<code>crtY</code> (the bicyclase) stops at lycopene \u2192 red colonies. " +
                "Deleting <code>crtI</code> stops at phytoene \u2192 colorless. Deleting " +
                "<code>crtZ</code> stops at \u03b2-carotene \u2192 orange. Trace each " +
                "scenario by picking a crt gene in the viewer and walking the pathway card " +
                "up to that step's product.</li>" +
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
                "<p>Bottromycins are macrocyclic peptides produced by " +
                "<span class=\"info-term\" data-term=\"streptomyces\">" +
                "<em>Streptomyces</em></span>. " +
                "The cluster spans ~20 kb and includes a precursor peptide, radical-SAM " +
                "enzymes, a YcaO-type heterocyclase, and transport machinery &mdash; a " +
                "perfect teaching example for <strong>RiPP biosynthesis</strong>.</p>" +
                "<h3>Try this</h3>" +
                "<ul>" +
                "<li><strong>Spot BotA, the 44-aa precursor.</strong> It's the smallest CDS " +
                "in the cluster &mdash; a ribbon-thin box next to its bulky modification " +
                "neighbors. Paste <code>GPVVVFDC</code> into the viewer's search box to land " +
                "directly on the core-peptide motif; everything N-terminal to it is leader " +
                "sequence that BotP / BotH / BotAH cleave off. The whole drug is carved out " +
                "of that eight-residue core.</li>" +
                "<li><strong>Walk the pathway card.</strong> The default view shows the " +
                "precursor and the finished scaffold. Click to <em>Full reaction scheme</em> " +
                "and the five-enzyme pipeline unfolds: " +
                "<strong>BotP / BotH / BotAH</strong> (leader peptidases), " +
                "<strong>BotCD</strong> (YcaO-type cyclodehydratase that installs the Cys " +
                "thiazole), <strong>BotRMT1\u20133</strong> (three radical-SAM C-methylations), " +
                "<strong>BotOMT</strong> (O-methyl ester on the Asp carboxylate), and " +
                "<strong>BotCYP</strong> (P450 oxidation). Toggle back to the condensed " +
                "view to see the net transformation in one arrow.</li>" +
                "<li><strong>Map each enzyme to its CDS.</strong> Scroll the linear viewer " +
                "left-to-right and tag each ORF by name &mdash; the precursor sits at one " +
                "end, the radical-SAM methyltransferases cluster together, and the " +
                "cytochrome P450 (BotCYP) is the last big box before the transport genes. " +
                "Every arrow you pass is one post-translational modification on the core " +
                "octapeptide. Compare to the industrial example " +
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
                "<figure class=\"organism-figure figure-right\">" +
                    "<img src=\"./assets/images/humulus-lupulus.jpg\" " +
                         "alt=\"A close-up of pale-green Humulus lupulus hop cones on " +
                              "the vine, showing the imbricated bracts that store the " +
                              "aroma compounds.\">" +
                    "<figcaption><em>Humulus lupulus</em>, common hop. The cone's " +
                    "bracts harbour glandular trichomes packed with the monoterpenes " +
                    "and acyl-phloroglucinols that flavour beer. Image: H. Zell / " +
                    "Wikimedia Commons (CC BY-SA 3.0).</figcaption>" +
                "</figure>" +
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
                "<h3>Try this</h3>" +
                "<ul>" +
                "<li>Follow the monoterpene route on the pathway card: " +
                "<span class=\"info-term\" data-term=\"dmapp\">DMAPP</span> \u2192 " +
                "<span class=\"info-term\" data-term=\"gpp\">GPP</span> \u2192 " +
                "<span class=\"info-term\" data-term=\"linalool\">linalool</span>. " +
                "Toggle \"Full reaction scheme\" to expose the " +
                "<span class=\"info-term\" data-term=\"ipp\">IPP</span> cosubstrate on the " +
                "GPPS arrow \u2014 that's the C5 + C5 \u2192 C10 prenyl extension that feeds " +
                "every monoterpene synthase.</li>" +
                "<li>Hover each intermediate above to pop a 2D structure and a Wikipedia " +
                "link. DMAPP and IPP are the allylic/homoallylic C5 starter pair, GPP is the " +
                "C10 handoff, and linalool is the floral-citrus top note you actually smell " +
                "in the glass.</li>" +
                "<li>This is a single-CDS record, not a cluster &mdash; the whole linear " +
                "view <em>is</em> the MTS2 gene. Zoom in on the 5\u2032 end of the CDS, " +
                "flip on the translation track, and find the ATG start codon / initial " +
                "methionine. Good sanity check before you drop the ORF into a yeast " +
                "expression vector.</li>" +
                "<li>Toggle the complement strand to confirm MTS2 is annotated on the " +
                "expected strand &mdash; a real-world QC step before committing a new " +
                "aroma cassette to a brewing yeast line.</li>" +
                "</ul>" +
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
                "promoters. <strong>pX2-Cas9</strong> (PV704592.1) is the " +
                "broad-host-range Cas9 plasmid that drives CREATE &mdash; a platform for " +
                "genome-wide, tracked mutagenesis &mdash; a compact, reusable unit you can " +
                "visualize, QC, and hand to a cloning robot.</p>" +
                "<h3>Try this</h3>" +
                "<ul>" +
                "<li><strong>Locate the Cas9 CDS.</strong> Zoom fully out and look for " +
                "the one huge ORF \u2014 " +
                "<span class=\"info-term\" data-term=\"streptococcus-pyogenes\">" +
                "<em>S. pyogenes</em></span> Cas9 is ~4.1 kb and dwarfs " +
                "everything else on the plasmid. Search for <code>ATGGA</code> to land on " +
                "the canonical SpCas9 start codon, then flip <em>Show translations</em> on " +
                "to confirm you're reading into the Cas9 polypeptide rather than an " +
                "unrelated ORF.</li>" +
                "<li><strong>Find the gRNA cassette and toggle BsaI.</strong> The sgRNA " +
                "cloning site is the destination for Golden Gate assembly \u2014 the two " +
                "BsaI sites flanking the placeholder dropout are what release it so you " +
                "can ligate in your 20-bp spacer. Because BsaI is a Type IIS cutter, it " +
                "leaves the scar <em>outside</em> its recognition site, giving you a " +
                "directional, scarless fusion between the U6/SNR52 promoter and your " +
                "spacer in a single one-pot reaction.</li>" +
                "<li><strong>Spot the selection marker.</strong> The aminoglycoside " +
                "phosphotransferase CDS confers " +
                "<span class=\"info-term\" data-term=\"kanamycin\">kanamycin</span> " +
                "resistance \u2014 hover the term for the mechanism. This is the marker " +
                "you'll plate on after transforming your spacer-loaded construct.</li>" +
                "<li><strong>Cross-compatibility check.</strong> Toggle BsmBI and SapI. " +
                "Any internal cut sites in the Cas9 or marker CDSs mean this plasmid " +
                "would need <em>domestication</em> (silent mutation of the offending " +
                "sites) before combining it with MoClo or Loop toolkits that use those " +
                "enzymes as their assembly cutter. Clean backbones here are the difference " +
                "between a one-pot assembly that works and a three-day debug.</li>" +
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
            summary: "The same violacein cluster you saw in the academic track, moved into E. coli for industrial-scale pigment production. Rendered side-by-side as native vs. Golden Gate\u2013ready so you can eyeball the cut-site domestication.",
            category: "industrial",
            tags: ["biosynthesis", "E. coli", "refactored"],
            complexity: 4,
            // Two viewers side by side on one page. Both reference the same
            // NCBI record (AF172851.1) \u2014 we don't ship a fully refactored
            // synthetic construct, so the teaching value is the comparison
            // itself: a "native" viewer with no Golden Gate enzymes selected,
            // and a "refactored" viewer where flipping BsaI/BsmBI on reveals
            // exactly the sites a real refactor would have to domesticate.
            accessions: [
                {
                    id: "AF172851.1",
                    label: "Native (for reference)",
                    // No enzymes on the native panel so the default view
                    // is visually clean; the shared controls panel still
                    // affects this cell unless overridden further.
                    override: { enzymes: [] }
                },
                {
                    id: "AF172851.1",
                    label: "Refactored (Golden Gate\u2013ready)",
                    // Refactored panel starts with BsaI + BsmBI selected
                    // so the Type IIS cut marks appear on first paint.
                    // That is the whole point of the comparison: the reader
                    // sees the sites a real refactor would have to
                    // synonymously mutate out, without hunting for the
                    // enzyme button.
                    override: { enzymes: ["BsaI", "BsmBI"] }
                }
            ],
            compound: {
                name: "Violacein",
                smiles: "OC1=CC=C(NC(=O)/C(=C2\\C(=O)C3=CC=CC=C3N2)C2=CNC3=CC=CC=C23)C=C1",
                description: "Same bisindole pigment as the academic example. In an industrial context, titer optimization is the goal \u2014 codon-optimized CDSs and calibrated promoters push E. coli to produce grams per liter."
            },
            seqvizProps: {
                // Multi-viewer pages force a single-topology default \u2014
                // Both / Both flipped are auto-disabled by example.html so
                // the two viewers stay in lockstep.
                viewer: "circular",
                zoom: { linear: 1 },
                style: { height: "560px", width: "100%" }
            },
            narrative:
                "<h3>Same cluster, different chassis</h3>" +
                "<p>You already saw this cluster in the " +
                "<a href=\"./example.html?id=violacein-cluster\">academic example</a>. In " +
                "industrial practice, the native " +
                "<span class=\"info-term\" data-term=\"chromobacterium-violaceum\">" +
                "<em>Chromobacterium</em></span> version is rarely used directly &mdash; " +
                "teams rebuild the five enzymes in <em>E. coli</em> with refactored " +
                "promoters, codon-optimized CDSs, and designed RBSs.</p>" +
                "<p>Both viewers above point at the same GenBank record so the comparison " +
                "is apples-to-apples: the left panel is your <em>as-deposited</em> reference " +
                "with no enzymes selected, the right panel is the same DNA with " +
                "<strong>BsaI and BsmBI lit up by default</strong>. Every cut mark in " +
                "the right panel is a site a real refactor would have to silently mutate " +
                "out of the codon-optimized CDSs before the cluster survives a Golden " +
                "Gate reaction. Left clean, right dotted with cut marks: that is the " +
                "delta, visible at a glance.</p>" +
                "<h3>What changes in an industrial context</h3>" +
                "<ul>" +
                "<li>Native sequences replaced with codon-optimized synonymous variants.</li>" +
                "<li>Promoters standardized across the cluster for tunable control.</li>" +
                "<li>Internal restriction sites removed so Golden Gate assembly works.</li>" +
                "</ul>" +
                "<h3>Try this</h3>" +
                "<ul>" +
                "<li>Start in Circular view. The left panel is your baseline: the cluster " +
                "as it exists in nature. The right panel has BsaI and BsmBI selected, so " +
                "every Type IIS cut site is already marked. The right panel's cut marks " +
                "<em>are</em> the domestication punch list \u2014 the sites a refactor " +
                "team has to silently mutate out of the codon-optimized CDSs before the " +
                "cluster will survive a Golden Gate reaction.</li>" +
                "<li>Switch the topology radio to <em>Linear</em> and scroll along each " +
                "panel. The cut marks stay put; now you can see which gene each site " +
                "lives in. A BsaI hit inside <code>vioC</code> is a <code>vioC</code> " +
                "synthesis problem; a BsmBI hit in <code>vioD</code> is a " +
                "<code>vioD</code> synthesis problem. Counting by CDS gives you the " +
                "synonymous-mutation budget, gene by gene.</li>" +
                "<li>Imagine the right panel with <em>zero</em> cut marks once those " +
                "silent swaps land: that's the deliverable of a refactor project. " +
                "Side-by-side with the native reference trains your eye to spot the " +
                "delta at a glance \u2014 native-has-sites vs. refactored-is-clean \u2014 " +
                "which is exactly how a build report would be reviewed before ordering " +
                "synthesis.</li>" +
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
                "\"\"\"Violacein refactor: native vs. Golden Gate\u2013ready, side by side.\n" +
                "\n" +
                "Mirrors the multi-viewer pattern used on the web page \u2014 two SeqViz\n" +
                "components driven by a single topology radio, with a grid that flips\n" +
                "between side-by-side (Circular) and stacked (Linear) layouts. Both\n" +
                "viewers point at AF172851.1 so the learner can eyeball the BsaI /\n" +
                "BsmBI sites a refactor team would have to domesticate before the\n" +
                "cluster will survive a Golden Gate reaction.\n" +
                "\"\"\"\n" +
                "from dash import Dash, html, dcc, Input, Output, callback\n" +
                "from dash_seqviz import SeqViz\n" +
                "import requests\n" +
                "\n" +
                "ACCESSIONS = [\n" +
                "    (\"AF172851.1\", \"Native (for reference)\"),\n" +
                "    (\"AF172851.1\", \"Refactored (Golden Gate\u2013ready)\"),\n" +
                "]\n" +
                "\n" +
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
                "                \"tool\": \"biofoundry\", \"email\": \"you@lab.org\"},\n" +
                "        timeout=10,\n" +
                "    ).text\n" +
                "\n" +
                "# Both labels resolve to the same record \u2014 the refactor is illustrative.\n" +
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
                "                    # Pattern-matching id carries the label so the two\n" +
                "                    # panels can receive different enzyme lists from\n" +
                "                    # separate callbacks if you want per-panel control.\n" +
                "                    id={\"type\": \"viz\", \"panel\": label},\n" +
                "                    name=f\"{acc} \u2014 {label}\",\n" +
                "                    file=records[acc],\n" +
                "                    viewer=\"circular\",\n" +
                "                    zoom={\"linear\": 1},\n" +
                "                    # Native panel starts clean; refactored panel shows the\n" +
                "                    # sites the domestication pass needs to remove.\n" +
                "                    enzymes=[] if label.startswith(\"Native\")\n" +
                "                            else [\"BsaI\", \"BsmBI\"],\n" +
                "                    style={\"height\": \"560px\", \"width\": \"100%\"},\n" +
                "                ),\n" +
                "            ]) for acc, label in ACCESSIONS\n" +
                "        ],\n" +
                "        style=GRID_SIDE_BY_SIDE,\n" +
                "    ),\n" +
                "])\n" +
                "\n" +
                "# Callback 1: topology radio \u2192 every SeqViz at once via pattern-matching IDs.\n" +
                "@callback(\n" +
                "    Output({\"type\": \"viz\", \"panel\": \"ALL\"}, \"viewer\", allow_duplicate=True),\n" +
                "    Input(\"topology\", \"value\"),\n" +
                "    prevent_initial_call=True,\n" +
                ")\n" +
                "def set_topology(value):\n" +
                "    return [value] * len(ACCESSIONS)\n" +
                "\n" +
                "# Callback 2: same topology radio \u2192 grid layout. Side-by-side for\n" +
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
                "<p>Native " +
                "<span class=\"info-term\" data-term=\"streptomyces\">" +
                "<em>Streptomyces</em></span> hosts are slow, hard to engineer, and " +
                "fermentations are finicky. Pharma R&amp;D teams routinely port a cluster " +
                "into a faster chassis (<em>S. coelicolor</em> M1152, <em>S. albus</em> J1074, " +
                "or even <em>E. coli</em>) to evaluate yield, titer, and analog variability.</p>" +
                "<h3>Try this</h3>" +
                "<ul>" +
                "<li><strong>BsaI / BsmBI &mdash; the Golden Gate type IIS enzymes.</strong> " +
                "Toggle them and every internal recognition site lights up across the " +
                "cluster. Each cut inside <code>botA</code>, <code>botCD</code>, the " +
                "<code>botRMT</code> trio, <code>botOMT</code>, or <code>botCYP</code> is a " +
                "site you have to <em>domesticate</em> &mdash; silently mutate away with a " +
                "synonymous codon &mdash; before the pieces can go through a Golden Gate " +
                "reaction without self-digesting. Count them to scope the synonymous-mutation " +
                "budget before the gene synthesis order goes out.</li>" +
                "<li><strong>NotI &mdash; the 8-cutter module boundary.</strong> NotI's " +
                "rare 8-bp recognition site (GCGGCCGC) makes it the go-to enzyme for " +
                "snapping whole cluster-sized fragments in and out of a backbone. Toggle " +
                "it: if nothing lights up inside the cluster, that's the outcome you want " +
                "&mdash; the whole ~20 kb insert can ride on flanking NotI sites as a " +
                "single cloneable unit. Any internal NotI hits would have to be " +
                "domesticated too, or the module would shatter on the first digest.</li>" +
                "<li><strong>Budget the synthesis cost.</strong> Zoom out to <code>1</code> " +
                "on the linear viewer and read the total bp count off the header. At a " +
                "rough industry rate of ~&dollar;0.07/bp for de novo synthesis, a ~20 kb " +
                "cluster lands near &dollar;1.4K in DNA alone &mdash; before codon " +
                "optimization, domestication, or assembly QC. That number is what a " +
                "cluster-level viewer is <em>for</em>: turning an abstract pathway into a " +
                "line-item on a pilot-project budget.</li>" +
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
                "<p><strong>pBI121</strong> is the binary vector nearly every " +
                "<span class=\"info-term\" data-term=\"agrobacterium-tumefaciens\">" +
                "<em>Agrobacterium</em></span>-mediated plant transformation paper cites. " +
                "It carries the " +
                "<code>uidA</code> (GUS) reporter under a 35S promoter with an NPTII " +
                "(<span class=\"info-term\" data-term=\"kanamycin\">kanamycin</span>) " +
                "selection marker, flanked by T-DNA left and right borders.</p>" +
                "<h3>Try this</h3>" +
                "<ul>" +
                "<li>Hover <span class=\"info-term\" data-term=\"kanamycin\">kanamycin</span> " +
                "in the paragraph above to see the aminoglycoside the NPTII marker confers " +
                "resistance to \u2014 the selection agent that lets only transformed plant " +
                "cells grow on the plate.</li>" +
                "<li>Spin through the circular view to see the <em>LB</em> and <em>RB</em> " +
                "imperfect 25-bp direct repeats flanking the expression cassette \u2014 " +
                "everything between them is what Agrobacterium actually ferries into the " +
                "plant genome.</li>" +
                "<li>Paste <code>GGCAGGATATAT</code> into the viewer's search box \u2014 that " +
                "conserved core of the T-DNA border repeat lights up on both LB and RB and " +
                "shows you exactly where VirD1/VirD2 nicks to excise the transgene.</li>" +
                "<li>Toggle the classic MCS cutters below \u2014 the sites that let scientists " +
                "swap in their own gene of interest. Each one matters for a different reason:" +
                "<ul>" +
                "<li><strong>EcoRI</strong> leaves 5' <code>AATT</code> overhangs \u2014 " +
                "compatible with a huge legacy of tagged-reporter fragments, which is why " +
                "it's still the default drop-in site for a fluorescent protein or epitope " +
                "tag.</li>" +
                "<li><strong>HindIII</strong> gives 5' <code>AGCT</code> overhangs and sits " +
                "just outside the GUS cassette \u2014 handy for swapping the whole " +
                "<code>uidA</code> reporter for your own ORF.</li>" +
                "<li><strong>BamHI</strong> and <strong>XbaI</strong> bracket the cassette " +
                "in a polylinker that's shared with many plant-expression vectors, so " +
                "cassettes move between backbones without redesign.</li>" +
                "<li><strong>SacI</strong> sits at the 3' end near the NOS terminator \u2014 " +
                "a clean exit point when you're replacing the terminator or adding a 3' " +
                "tag.</li>" +
                "</ul>" +
                "</li>" +
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
                "<figure class=\"organism-figure figure-right\">" +
                    "<img src=\"./assets/images/waxy-corn.jpg\" " +
                         "alt=\"Ears of waxy maize with the pale, dull-white glutinous " +
                              "kernels characteristic of amylose-free starch.\">" +
                    "<figcaption>Waxy maize, the glutinous variety of <em>Zea mays</em>. " +
                    "The kernels lack amylose and are almost pure amylopectin, giving " +
                    "them a dull, waxy appearance. Image: National Institute of Korean " +
                    "Language / Wikimedia Commons (CC BY-SA 2.0 KR).</figcaption>" +
                "</figure>" +
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
                "<li>Start with the molecules. Hover " +
                "<span class=\"info-term\" data-term=\"amylose\">amylose</span> in the first " +
                "paragraph to see the straight \u03b1-1,4 glucose chain, then hover " +
                "<span class=\"info-term\" data-term=\"amylopectin\">amylopectin</span> to see " +
                "the same backbone with \u03b1-1,6 branch points grafted on. That single " +
                "structural difference is the whole story: disrupt <code>Wx1</code>, lose " +
                "GBSSI, lose the straight chains \u2014 and the kernel fills with nothing but " +
                "the branched form.</li>" +
                "<li>Zoom in on the <code>Wx1</code> CDS and pick a 20 bp PAM-adjacent window " +
                "inside an early exon \u2014 that's a plausible CRISPR cut site. An early-exon " +
                "frameshift knocks GBSSI out cleanly, which is why Corteva's edit targets this " +
                "neighborhood rather than a later domain.</li>" +
                "<li>Toggle the cloning cutters below to see whether the native sequence has " +
                "compatible restriction sites for traditional cloning \u2014 a useful " +
                "counterfactual for how much slower the pre-CRISPR route to the same " +
                "phenotype would have been:</li>" +
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
                "# Maize Wx1 (waxy) locus \u2014 first cloned in 1983\n" +
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
                "<li>Do the molecule triptych first. Hover " +
                "<span class=\"info-term\" data-term=\"glyphosate\">glyphosate</span>, then " +
                "<span class=\"info-term\" data-term=\"pep\">PEP</span>, then " +
                "<span class=\"info-term\" data-term=\"shikimate\">shikimate</span>. PEP is " +
                "the natural EPSPS substrate; glyphosate is a phosphonate near-perfect mimic " +
                "that slots into the same pocket and won't leave; shikimate-3-phosphate is " +
                "the second substrate that never gets its enolpyruvyl transfer. The whole " +
                "Roundup Ready story is this structural coincidence \u2014 and you should see " +
                "it before you look at the sequence.</li>" +
                "<li>Find the CDS start codon and inspect the N-terminal <em>chloroplast " +
                "transit peptide</em> \u2014 plants need it to target EPSPS to the chloroplast " +
                "stroma where the shikimate pathway runs. Without this N-terminal extension " +
                "the bacterial CP4 enzyme would sit uselessly in the cytosol.</li>" +
                "<li>Search the CDS for <code>GCC</code> (an Ala codon) around the Gly101 " +
                "\u2192 Ala substitution region \u2014 that single amino-acid change is what " +
                "sterically excludes glyphosate from the active site while still letting PEP " +
                "bind. A one-codon swap is the entire basis of a multi-billion-dollar trait.</li>" +
                "<li>Toggle the Golden Gate cutters below to check domestication " +
                "compatibility \u2014 any internal <code>BsaI</code> or <code>BsmBI</code> " +
                "sites need to be synonymously recoded before the CDS can drop into a Type " +
                "IIS assembly vector:</li>" +
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
            title: "Lovastatin: the iterative fungal PKS that founded a drug class",
            summary: "One megasynthase, nine condensations, a statin.",
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
                { id: "AF151722.1", label: "LovB, the nonaketide synthase" }
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
                "<figure class=\"organism-figure figure-right\">" +
                    "<img src=\"./assets/images/aspergillus-terreus.jpg\" " +
                         "alt=\"A Petri dish culture of Aspergillus terreus, showing " +
                             "a brownish velvety colony with concentric zones.\">" +
                    "<figcaption><em>Aspergillus terreus</em>, a soil and litter " +
                    "fungus with a cinnamon-brown colony and a pharmacologically " +
                    "prolific secondary metabolism. Image: Wikimedia Commons (CC0)." +
                    "</figcaption>" +
                "</figure>" +
                "<p><span class=\"info-term\" data-term=\"lovastatin\">Lovastatin</span> " +
                "was approved by the FDA as Mevacor in 1987, the first of the statins " +
                "and the molecule that would launch the single most prescribed drug " +
                "class in medical history. The compound came out of an " +
                "<em>Aspergillus terreus</em> fermentation as part of Merck's " +
                "cholesterol-lowering programme; it bound " +
                "<span class=\"info-term\" data-term=\"hmg-coa-reductase\">" +
                "HMG-CoA reductase</span>, the rate-limiting enzyme of cholesterol " +
                "biosynthesis, at nanomolar concentrations; and the decalin-lactone " +
                "scaffold it advanced became the structural template that simvastatin, " +
                "atorvastatin, and rosuvastatin would all modify.</p>" +
                "<p>Lovastatin is also the textbook case study for how a fungal " +
                "<em>iterative</em> " +
                "<span class=\"info-term\" data-term=\"polyketide-synthase\">" +
                "polyketide synthase</span> works. Bacterial systems build complex " +
                "polyketides with modular PKSs, where a separate set of domains is " +
                "dedicated to each round of condensation (see " +
                "<a href=\"./example.html?id=bryostatin-cluster\">bryostatin</a>). " +
                "Fungal iterative PKSs do the opposite. <strong>LovB</strong>, the ten- " +
                "thousand-base open reading frame that dominates the lovastatin cluster, " +
                "carries <em>one</em> set of domains and reuses them for nine rounds in " +
                "a row, executing a different programme each round: sometimes " +
                "ketoreduction, sometimes dehydration, sometimes methylation, sometimes " +
                "a Diels-Alder-like cyclisation. No one has ever written a full " +
                "predictive model for how the enzyme chooses.</p>" +
                "<p>The full producing cluster is deposited in GenBank in two pieces. " +
                "<code>AH007774</code> is the segmented record covering the accessory " +
                "genes (<code>lovA</code> P450, <code>lovC</code> trans-enoyl reductase, " +
                "<code>lovD</code> acyltransferase, <code>lovF</code> diketide synthase, " +
                "plus transport and regulatory genes). <code>AF151722</code> is the " +
                "<code>lovB</code> megasynthase on its own. The viewers below show both " +
                "records at the same time; the topology and zoom controls apply to both " +
                "in parallel, so flipping between circular and linear takes you from " +
                "cluster-overview to megasynthase-on-one-polypeptide with a single " +
                "click.</p>" +
                "<p>The downstream steps are captured in the biosynthesis panel below. " +
                "LovB builds the decalin scaffold and releases dihydromonacolin L. " +
                "LovA (a cytochrome P450) oxidises the scaffold twice, first installing " +
                "a pair of double bonds and then a C8 hydroxyl, to produce monacolin J. " +
                "LovF, a separate diketide synthase, independently makes (S)-2-methyl- " +
                "butyryl-CoA out of malonyl-CoA and S-adenosylmethionine. LovD then " +
                "transesterifies that side chain onto the monacolin J hydroxyl. The " +
                "finished lovastatin molecule is that ester; without the LovD step, the " +
                "output is monacolin J (essentially simvastatin's acid form). That " +
                "single step is the difference between two different drugs.</p>" +
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
                "also flips with topology: side-by-side for Circular so the\n" +
                "plasmids sit next to each other, stacked for Linear so each\n" +
                "sequence gets the full card width to scroll through.\n" +
                "\"\"\"\n" +
                "from dash import Dash, html, dcc, Input, Output, callback\n" +
                "from dash_seqviz import SeqViz\n" +
                "import requests\n" +
                "\n" +
                "ACCESSIONS = [\n" +
                "    (\"AH007774\",   \"Core cluster (lovA / lovC / lovD / lovF)\"),\n" +
                "    (\"AF151722.1\", \"LovB, the nonaketide synthase\"),\n" +
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
                "                html.Div([html.Strong(acc), html.Span(f\": {label}\")]),\n" +
                "                SeqViz(\n" +
                "                    id={\"type\": \"viz\", \"acc\": acc},\n" +
                "                    name=f\"{acc}: {label}\",\n" +
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
                "<p><strong>pUC19</strong>, first described in 1985, is the " +
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
                "<h3>Try this: the three regions every cloning vector needs</h3>" +
                "<ul>" +
                "<li><strong>Start on <em>Circular</em>.</strong> pUC19 is only 2,686 bp " +
                "&mdash; the full plasmid fits on one dial. You can see at a glance that the " +
                "replication origin, selection marker, and cloning site occupy three distinct " +
                "arcs of the circle. This is the anatomy every downstream synbio toolkit " +
                "scales up from.</li>" +
                "<li><strong>Find <code>bla</code> (ampR) &mdash; the selection marker.</strong> " +
                "Look for the ~860 bp CDS labeled <code>bla</code>/AmpR. It encodes " +
                "&beta;-lactamase, which hydrolyzes ampicillin&rsquo;s &beta;-lactam ring. " +
                "Cells without the plasmid die on ampicillin plates; cells with it survive. " +
                "That&rsquo;s how you pick transformants before you ever check the insert.</li>" +
                "<li><strong>Locate the ColE1 origin.</strong> Rotate to the opposite arc from " +
                "<code>bla</code> &mdash; the <em>rep</em> / ColE1 origin is what drives the " +
                "high copy number (~500&ndash;700 per cell) that made pUC19 such a convenient " +
                "prep target. Change the origin and you change the yield, the compatibility " +
                "group, and whether the plasmid even propagates.</li>" +
                "<li><strong>Toggle the six MCS cutters below.</strong> All six sit inside " +
                "<em>lacZα</em> &mdash; the N-terminal fragment of &beta;-galactosidase that " +
                "complements a <code>lacZ&Delta;M15</code> host to give blue colonies on " +
                "X-gal/<span class=\"info-term\" data-term=\"iptg\">IPTG</span> plates. " +
                "Drop any fragment into one of these sites and you shift lacZα out of frame; " +
                "&alpha;-complementation fails and the colony comes up <strong>white</strong>. " +
                "That&rsquo;s the classic blue/white screen &mdash; a colorimetric readout of " +
                "whether the ligation actually worked, written into the vector geometry itself.</li>" +
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
                "# pUC19 \u2014 the classic cloning vector (first described in 1985)\n" +
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
            summary: "The original 1985 HER2 cDNA. The molecular target of trastuzumab (Herceptin) \u2014 Genentech's landmark humanized monoclonal antibody.",
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
                "<p><strong>HER2</strong> (ERBB2) was first cloned in 1985 as a " +
                "tyrosine-kinase receptor homologous to EGFR and co-located with the " +
                "<em>neu</em> oncogene \u2014 the discovery captured in this " +
                "<code>M11730</code> record. A decade later it would become the most " +
                "important drug target in oncology: HER2 is amplified in ~20% of breast " +
                "cancers, where it drives aggressive tumor growth.</p>" +
                "<p>In the mid-1990s, <strong>Genentech</strong> humanized a murine anti-HER2 " +
                "antibody (4D5) by grafting its complementarity-determining regions onto a " +
                "human IgG1 framework \u2014 a landmark use of <em>CDR grafting</em> " +
                "documented in the 1992 humanization paper. The resulting antibody, " +
                "<strong>trastuzumab</strong> " +
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
                "<li><strong>Find the CDS start and signal peptide.</strong> Turn on " +
                "<em>Show translations</em> and jump to the ATG. The first ~22 residues " +
                "are the secretion signal peptide that routes the nascent chain into the " +
                "ER \u2014 it's cleaved off the mature receptor. The extracellular " +
                "subdomains I\u2013IV follow (~residues 23\u2013652) and tile the entire " +
                "exterior of the cell.</li>" +
                "<li><strong>Zoom to extracellular domain IV \u2014 the Herceptin epitope.</strong> " +
                "Roughly residues 480\u2013620 of ERBB2 form the membrane-proximal " +
                "subdomain that the 4D5 paratope grips. Scroll to that window with " +
                "translations on; this is the span you'd PCR out when building a " +
                "soluble-antigen construct for phage display panning or surface plasmon " +
                "resonance binders.</li>" +
                "<li><strong>Spot the transmembrane domain.</strong> Around residue 650 " +
                "the sequence shifts into a short stretch of hydrophobic residues \u2014 " +
                "that's the single-pass TM helix that anchors HER2 in the plasma membrane. " +
                "It delineates the <em>ECD</em> (before) from the cytoplasmic " +
                "<em>kinase domain</em> (after), which matters when you're engineering " +
                "bispecifics or ADCs: you typically clone only the ECD, stopping just " +
                "before this helix.</li>" +
                "<li><strong>Count internal cut sites in the classic mammalian MCS pairs.</strong> " +
                "EcoRI + NotI is the textbook expression-vector cloning pair for CHO " +
                "production; HindIII + XbaI is the <code>pcDNA3.x</code> multiple-cloning-site " +
                "pair. Toggle each enzyme and count the cut sites that land inside the " +
                "ECD \u2014 any conflict means you'd need to linearize elsewhere (or silently " +
                "mutate the offending codon) before sub-cloning.</li>" +
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
                "# HER2 mRNA \u2014 the original 1985 clone,\n" +
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
        },

        // ------------------------------------------------------------------
        // MARINE NATURAL PRODUCTS — symbiont clusters + cyanobacterial
        // biosynthesis. Six stories that pharma/natural-product teams
        // instantly recognize. All six clusters are >10 kb; several are
        // >40 kb, so the "cluster-as-single-contig" viewer view is the
        // point.
        // ------------------------------------------------------------------
        {
            id: "bryostatin-cluster",
            title: "Bryostatin: an anticancer PKS from an uncultured bryozoan symbiont",
            summary: "A cancer drug whose producer you cannot grow.",
            category: "industrial",
            tags: ["natural-product", "PKS", "symbiont", "pharma", "anticancer"],
            complexity: 5,
            accession: "DQ889941",
            featured: true,
            compound: {
                name: "Bryostatin 1",
                smiles: "CCCC=CC=CC(=O)OC1C(=CC(=O)OC)CC2CC(OC(=O)CC(CC3CC(C(C(O3)(CC4CC(=CC(=O)OC)CC(O4)C=CC(C1(O2)O)(C)C)O)(C)C)OC(=O)C)O)C(C)O",
                description: "A macrocyclic lactone that binds and activates protein kinase C, a family of enzymes central to mammalian cell signalling. Isolated from the marine bryozoan Bugula neritina, but the chemistry is done by an obligate bacterial symbiont, Candidatus Endobugula sertula, which has so far resisted isolation into pure culture."
            },
            seqvizProps: {
                viewer: "both",
                zoom: { linear: 1 },
                style: { height: "560px", width: "100%" }
            },
            narrative:
                "<figure class=\"organism-figure figure-right\">" +
                    "<img src=\"./assets/images/bugula-neritina.jpg\" " +
                         "alt=\"A colony of Bugula neritina, a marine bryozoan, " +
                              "appearing as a soft brown twig-like arborescent growth.\">" +
                    "<figcaption><em>Bugula neritina</em>. A cosmopolitan fouling " +
                    "organism on docks, ship hulls, and coastal substrates. " +
                    "Image: Wikimedia Commons (CC BY-SA).</figcaption>" +
                "</figure>" +
                "<p>Pluck a frond of <em>Bugula neritina</em> off a dock piling and " +
                "you are handling, in gram quantities, one of the most studied " +
                "molecules in marine pharmacology. The bryozoan is unassuming: " +
                "centimeters tall, beige, twig-like, a filter feeder whose larvae " +
                "brood in ovicells before release. What lives inside it is not. Deep " +
                "in the larval tissue sits an obligate bacterial symbiont, " +
                "<span class=\"info-term\" data-term=\"endobugula-sertula\">" +
                "<em>Candidatus</em> Endobugula sertula</span>, which produces " +
                "<strong>bryostatin 1</strong>. The compound is a " +
                "<span class=\"info-term\" data-term=\"protein-kinase-c\">" +
                "protein kinase C</span> modulator, and the US National Cancer Institute " +
                "has carried it through five decades of clinical evaluation for " +
                "leukemia, melanoma, and Alzheimer's disease.</p>" +
                "<p>Molecules like this one are why \"the Supply Problem\" became " +
                "founding vocabulary for pharmacognosy. The symbiont is not a hard " +
                "case of uncultivable: it lives inside <em>B. neritina</em>, and the " +
                "bryozoan itself can be brought into closed-system aquaculture, so in " +
                "principle a bryozoan farm can produce bryostatin indirectly. What " +
                "nobody has yet done is grow the symbiont on its own, isolated in a " +
                "flask or on a plate, where titer and biomass could actually be " +
                "engineered. Until that happens, scale stays lashed to the host's " +
                "slow biology, and the compound sits in marine tissue at parts-per-" +
                "million. A single US National Cancer Institute collection in 1991 " +
                "pulled roughly fourteen tons of <em>B. neritina</em> off the Californian " +
                "coast, shipped to Maryland in a hundred and twenty fifty-five-gallon " +
                "drums, and yielded about eighteen grams of drug. " +
                "A 29-step total synthesis reported in 2017 finally put gram-scale " +
                "bryostatin within reach at the bench, but the pull of biology remains: " +
                "a producer you could actually culture would change the arithmetic " +
                "again.</p>" +
                "<figure class=\"class-figure scaffold-figure\">" +
                    "<img class=\"scaffold-core\" " +
                         "src=\"./assets/molecules/bryostatin-1.svg\" " +
                         "alt=\"Bryostatin 1 skeletal structure with stereochemistry. " +
                              "The 20-member macrolactone core is conserved across the " +
                              "bryostatin family; the C7 substituent (here an acetate " +
                              "ester, R\u00B9 in the table below) and the C20 " +
                              "substituent (here an octa-2,4-dienoate ester, R\u00B2) " +
                              "are the two positions that vary across natural bryostatins.\">" +
                    "<table class=\"r-group-table\">" +
                        "<thead><tr>" +
                            "<th scope=\"col\">Bryostatin</th>" +
                            "<th scope=\"col\">R\u00B9 at C7</th>" +
                            "<th scope=\"col\">R\u00B2 at C20</th>" +
                        "</tr></thead>" +
                        "<tbody>" +
                            "<tr><th scope=\"row\">1</th>" +
                                "<td><img src=\"./assets/molecules/rgroup-acetate.svg\" alt=\"acetate ester\"></td>" +
                                "<td><img src=\"./assets/molecules/rgroup-octa-2-4-dienoate.svg\" alt=\"(2E,4E)-octa-2,4-dienoate ester\"></td></tr>" +
                            "<tr><th scope=\"row\">2</th>" +
                                "<td><img src=\"./assets/molecules/rgroup-hydroxyl.svg\" alt=\"free hydroxyl\"></td>" +
                                "<td><img src=\"./assets/molecules/rgroup-octa-2-4-dienoate.svg\" alt=\"(2E,4E)-octa-2,4-dienoate ester\"></td></tr>" +
                            "<tr><th scope=\"row\">4</th>" +
                                "<td><img src=\"./assets/molecules/rgroup-pivalate.svg\" alt=\"pivalate ester\"></td>" +
                                "<td><img src=\"./assets/molecules/rgroup-butanoate.svg\" alt=\"butanoate ester\"></td></tr>" +
                            "<tr><th scope=\"row\">7</th>" +
                                "<td><img src=\"./assets/molecules/rgroup-acetate.svg\" alt=\"acetate ester\"></td>" +
                                "<td><img src=\"./assets/molecules/rgroup-acetate.svg\" alt=\"acetate ester\"></td></tr>" +
                            "<tr><th scope=\"row\">10</th>" +
                                "<td><img src=\"./assets/molecules/rgroup-pivalate.svg\" alt=\"pivalate ester\"></td>" +
                                "<td><img src=\"./assets/molecules/rgroup-hydrogen.svg\" alt=\"free hydrogen, no substituent\"></td></tr>" +
                        "</tbody>" +
                    "</table>" +
                    "<figcaption>Bryostatin 1 shown in full. The macrolactone " +
                    "core is conserved across the family; variation concentrates " +
                    "at C7 (R\u00B9) and C20 (R\u00B2), where different ester " +
                    "substituents (or, in bryostatin 10, an unsubstituted H at C20) " +
                    "define each member. Bryostatin 1 is the clinical candidate and " +
                    "the most potent PKC binder in the series.</figcaption>" +
                "</figure>" +
                "<p>The deadlock began to loosen in 2007. Total DNA extracted from " +
                "<em>B. neritina</em> tissue is a mixture: host chromatin, " +
                "<em>Ca.</em> E. sertula, a tail of cohabitant bacteria, environmental " +
                "hitchhikers. Shotgun " +
                "<span class=\"info-term\" data-term=\"metagenomics\">" +
                "metagenomic</span> sequencing reads it all at once, and the producer's " +
                "contribution is separated out computationally. From one such dataset " +
                "emerged the 73 kb <strong>bryABCDX</strong> " +
                "<span class=\"info-term\" data-term=\"polyketide-synthase\">" +
                "polyketide synthase</span> cluster, assembled as a single continuous " +
                "block without anyone ever isolating the bacterium that encodes it. " +
                "Sixteen kilobases of that block belong to one open reading frame: " +
                "<code>bryA</code> encodes a multi-module assembly line in a single " +
                "translated protein, threading carbon after carbon onto a growing " +
                "chain until a macrolactone falls off the end.</p>" +
                "<div class=\"inline-viewer\" " +
                     "data-accession=\"DQ889941\" " +
                     "data-viewer=\"circular\" " +
                     "data-height=\"420px\" " +
                     "data-annotation-min-length=\"10000\" " +
                     "data-annotation-hide-names=\"bryostatin ABCDX gene cluster\" " +
                     "data-caption=\"The 73 kb bryABCDX cluster pulled straight from " +
                                    "the bryozoan metagenome. With the sub-gene features " +
                                    "filtered out, the five bry genes resolve cleanly " +
                                    "around the contig. Note how much of the record is " +
                                    "one open reading frame: bryA spans roughly a " +
                                    "quarter of the circle.\"></div>" +
                "<p>The story may not stop at <em>Bugula neritina</em>. A recent " +
                "comparative-genomic survey of bugulid bryozoans, not yet peer-" +
                "reviewed at the time of writing, suggests a complicated pattern. " +
                "<span class=\"info-term\" data-term=\"bugulina-simplex\">" +
                "<em>Bugulina simplex</em></span> appears to host a closely related " +
                "symbiont (tentatively <em>Ca.</em> E. glebosa) that carries a " +
                "homologous <em>bry</em>-like cluster, and its tissues test positive " +
                "for bryostatin-like PKC-binding activity. The symbiont associated " +
                "with <span class=\"info-term\" data-term=\"crisularia-pacifica\">" +
                "<em>Crisularia pacifica</em></span>, provisionally named " +
                "<em>Ca.</em> Endobugula tacita, appears instead to carry an " +
                "unrelated trans-AT PKS in roughly the same genomic neighbourhood, " +
                "with no detectable <em>bry</em> cluster. If those findings hold up " +
                "to further work, the bugulid lineage may have arrived at more than " +
                "one chemical solution to the same ecological problem. Until then, " +
                "these remain questions worth asking, not answers.</p>" +
                "<p>The <a href=\"./example.html?id=pederin-cluster\">pederin</a> " +
                "cluster, one example over, offers a useful comparison. Pederin is " +
                "also a polyketide produced by an uncultured bacterial symbiont of an " +
                "invertebrate (a rove beetle in that case), and its gene cluster is " +
                "also organised as a " +
                "<span class=\"info-term\" data-term=\"trans-at-pks\">" +
                "trans-AT polyketide synthase</span>. Modular layout and chemistry " +
                "diverge between the two, and the clusters are not understood to " +
                "share a close biosynthetic origin. What they share is a discovery " +
                "pattern: the symbionts were for years invisible to standard " +
                "microbiology, and the sequences that encode their drug payloads had " +
                "to be read out of host metagenomes.</p>" +
                "<h3>References</h3>" +
                "<ul>" +
                "<li>Sudek S, Lopanik NB, Waggoner LE, Hildebrand M, Anderson C, Liu H " +
                "<em>et al.</em> " +
                "<a href=\"https://pubmed.ncbi.nlm.nih.gov/17253852/\" target=\"_blank\" rel=\"noopener\">" +
                "Identification of the putative bryostatin polyketide synthase gene cluster " +
                "from \"Candidatus Endobugula sertula\".</a> " +
                "<em>J Nat Prod</em> 70(1):67-74 (2007). PMID: 17253852.</li>" +
                "<li>Miller IJ, Vanee N, Fong SS, Lim-Fong GE, Kwan JC. " +
                "<a href=\"https://pubmed.ncbi.nlm.nih.gov/27590822/\" target=\"_blank\" rel=\"noopener\">" +
                "Lack of overt genome reduction in the bryostatin-producing bryozoan " +
                "symbiont \"Candidatus Endobugula sertula\".</a> " +
                "<em>Appl Environ Microbiol</em> 82(22):6573-6583 (2016). PMID: 27590822. " +
                "(Surprising result: unlike Prochloron and many other defensive " +
                "symbionts, <em>Ca.</em> E. sertula has <em>not</em> undergone dramatic " +
                "genome reduction, complicating the tidy \"obligate symbiont equals " +
                "streamlined genome\" narrative.)</li>" +
                "<li>Hale KJ, Hummersone MG, Manaviazar S, Frigerio M. " +
                "<a href=\"https://pubmed.ncbi.nlm.nih.gov/12085154/\" target=\"_blank\" rel=\"noopener\">" +
                "The chemistry and biology of the bryostatin antitumour macrolides.</a> " +
                "<em>Nat Prod Rep</em> 19(4):413-53 (2002). PMID: 12085154.</li>" +
                "<li>Wender PA, DeBrabander J, Harran PG, Jimenez JM, Koehler MF, " +
                "Lippa B, Park CM, Siedenbiedel C, Pettit GR. " +
                "<a href=\"https://pubmed.ncbi.nlm.nih.gov/9618462/\" target=\"_blank\" rel=\"noopener\">" +
                "The design, computer modeling, solution structure, and biological " +
                "evaluation of synthetic analogs of bryostatin 1.</a> " +
                "<em>Proc Natl Acad Sci USA</em> 95(12):6624-6629 (1998). " +
                "PMID: 9618462. " +
                "(Early design of simplified bryostatin analogs, the bryologs, " +
                "that preserve PKC-binding activity while stripping the macrolactone " +
                "down to the essentials.)</li>" +
                "<li>Wender PA, Hardman CT, Ho S, Jeffreys MS, Maclaren JK, " +
                "Quiroz RV, Ryckbosch SM, Shimizu AJ, Sloane JL, Stevens MC. " +
                "<a href=\"https://pubmed.ncbi.nlm.nih.gov/29026042/\" target=\"_blank\" rel=\"noopener\">" +
                "Scalable synthesis of bryostatin 1 and analogs, adjuvant leads " +
                "against latent HIV.</a> " +
                "<em>Science</em> 358(6360):218-223 (2017). PMID: 29026042. " +
                "(A 29-step route delivering gram quantities of bryostatin 1, " +
                "reframing the Supply Problem as a chemistry problem that has been " +
                "largely solved.)</li>" +
                "<li>Buchholz TJ, Rath CM, Lopanik NB, Gardner NP, H\u00e5kansson K, " +
                "Sherman DH. " +
                "<a href=\"https://pubmed.ncbi.nlm.nih.gov/21035732/\" target=\"_blank\" rel=\"noopener\">" +
                "Polyketide \u03b2-branching in bryostatin biosynthesis: " +
                "identification of surrogate acetyl-ACP donors for BryR, an HMG-ACP " +
                "synthase.</a> " +
                "<em>Chem Biol</em> 17(10):1092-1100 (2010). PMID: 21035732. " +
                "(Mechanistic dissection of the BryR \u03b2-branching step, one of " +
                "the chemically distinctive moves the bryostatin PKS makes.)</li>" +
                "<li>Rees ER. " +
                "<a href=\"https://asset.library.wisc.edu/1711.dl/MRXGAWLDM2ADQ8W/R/file-d3a3f.pdf\" target=\"_blank\" rel=\"noopener\">" +
                "Development and Application of Metagenomic and Comparative Genomic " +
                "Techniques for Environmental Analysis.</a> " +
                "PhD dissertation, University of Wisconsin\u2013Madison (2023). " +
                "(Comparative-genomics analysis characterising <em>Ca.</em> E. glebosa " +
                "and establishing <em>Ca.</em> E. tacita, the genome-level context " +
                "for how <em>bry</em> is distributed across the bryozoan symbiont clade.)" +
                "</li>" +
                "</ul>",
            pythonSnippet:
                "from dash import Dash, html\n" +
                "from dash_seqviz import SeqViz\n" +
                "import requests\n" +
                "\n" +
                "# Bryostatin cluster (Ca. Endobugula sertula, 2007)\n" +
                "gb = requests.get(\n" +
                "    \"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi\",\n" +
                "    params={\"db\": \"nuccore\", \"id\": \"DQ889941\",\n" +
                "            \"rettype\": \"gb\", \"retmode\": \"text\",\n" +
                "            \"tool\": \"natural-products\", \"email\": \"you@lab.org\"},\n" +
                "    timeout=10,\n" +
                ").text\n" +
                "\n" +
                "app = Dash(__name__)\n" +
                "app.layout = html.Div([\n" +
                "    SeqViz(\n" +
                "        id=\"bryostatin\",\n" +
                "        name=\"Bryostatin cluster (DQ889941)\",\n" +
                "        file=gb,\n" +
                "        viewer=\"both\",\n" +
                "        zoom={\"linear\": 1},\n" +
                "        style={\"height\": \"560px\", \"width\": \"100%\"},\n" +
                "    )\n" +
                "])\n" +
                "\n" +
                "if __name__ == \"__main__\":\n" +
                "    app.run(debug=True)\n"
        },
        {
            id: "pederin-cluster",
            title: "Pederin: a beetle blister toxin from an uncultured bacterial symbiont",
            summary: "Two centuries of dermatitis. The chemist turned out to be a bacterium.",
            category: "academic",
            tags: ["natural-product", "PKS", "trans-AT", "symbiont", "graduate"],
            complexity: 5,
            accession: "AH013687.2",
            compound: {
                name: "Pederin",
                smiles: "C[C@H]1[C@H](O[C@](CC1=C)([C@@H](C(=O)N[C@H]([C@@H]2C[C@H](C([C@H](O2)C[C@@H](COC)OC)(C)C)O)OC)O)OC)C",
                description: "A potent eukaryotic protein-synthesis inhibitor. Crushed Paederus rove beetles release it onto skin via their hemolymph; the result is a blistering dermatitis known to agricultural workers across the tropics and subtropics for centuries before the responsible chemistry, let alone the responsible organism, was known."
            },
            seqvizProps: {
                viewer: "both",
                zoom: { linear: 1 },
                style: { height: "560px", width: "100%" }
            },
            narrative:
                "<figure class=\"organism-figure figure-right\">" +
                    "<img src=\"./assets/images/paederus-rove-beetle.jpg\" " +
                         "alt=\"A rove beetle of the genus Paederus, showing the " +
                              "characteristic slender black-and-orange body.\">" +
                    "<figcaption><em>Paederus</em> sp. rove beetle. Slate and orange, " +
                    "a few millimetres long, phototropic at night; the carrier of " +
                    "pederin. Image: gailhampshire / Wikimedia Commons (CC BY 2.0).</figcaption>" +
                "</figure>" +
                "<p>The <em>Paederus</em> rove beetles have been poisoning farm workers " +
                "for at least two centuries. Crush one against skin by accident, and the " +
                "insect releases a clear fluid from its hemolymph that raises a severe " +
                "blister within a day or two. Agricultural workers across Asia, Africa, " +
                "and Latin America have their own names for the reaction; Western " +
                "clinical literature settled on Paederus dermatitis. The responsible " +
                "molecule, crystallised in 1953 and its structure nailed down in " +
                "1966, is a compact vinyl-amide macrolactone called <strong>" +
                "pederin</strong>, one of the most potent eukaryotic protein-synthesis " +
                "inhibitors ever characterised.</p>" +
                "<p>For the rest of the twentieth century the working assumption was that " +
                "the beetle itself made pederin. The chemistry did not quite fit any " +
                "insect biosynthetic machinery anyone knew, and culturable bacteria from " +
                "the beetle gut produced none of it. Total synthesis took decades and " +
                "never approached the scales needed for biological study. The producer " +
                "was somewhere, and somewhere kept being nowhere anyone could isolate.</p>" +
                "<p>In 2002 the producer arrived by a different route. Shotgun sequencing " +
                "of the bulk DNA from female <em>Paederus fuscipes</em> beetles, including " +
                "whatever uncultured bacteria they carried, recovered a 54 kb " +
                "<span class=\"info-term\" data-term=\"polyketide-synthase\">" +
                "polyketide synthase</span> cluster whose predicted chemistry matched pederin " +
                "atom for atom. The cluster used a " +
                "<span class=\"info-term\" data-term=\"trans-at-pks\">" +
                "trans-AT PKS</span> architecture, at the time a rarely-seen organisation in " +
                "which the acyltransferase activity lives on a separate protein rather " +
                "than in every module. The producer was a Pseudomonas-like " +
                "endosymbiont that lives in the beetle's reproductive tract, passes " +
                "vertically to eggs, and has so far refused every attempt to isolate it " +
                "into pure culture.</p>" +
                "<div class=\"inline-viewer\" " +
                     "data-accession=\"AH013687.2\" " +
                     "data-viewer=\"circular\" " +
                     "data-height=\"420px\" " +
                     "data-annotation-min-length=\"6000\" " +
                     "data-caption=\"The ped cluster wrapped. Two enormous open reading " +
                                    "frames encode the PKS assembly line; a handful of " +
                                    "smaller genes supply the trans-AT activity and the " +
                                    "tailoring steps.\"></div>" +
                "<p>Pederin's discovery turned out to be the first of a family. The same " +
                "trans-AT PKS signature appeared in the " +
                "<a href=\"./example.html?id=bryostatin-cluster\">bryostatin</a>, " +
                "onnamide, psymberin, and theopederin clusters over the following decade, " +
                "each from an uncultured bacterial symbiont of an invertebrate host. The " +
                "producers were invisible to standard microbiology; the sequences that " +
                "encoded their drug-grade payloads were invisible until shotgun " +
                "sequencing reached the hosts that held them.</p>" +
                "<h3>References</h3>" +
                "<ul>" +
                "<li>Piel J. " +
                "<a href=\"https://pubmed.ncbi.nlm.nih.gov/12381784/\" target=\"_blank\" rel=\"noopener\">" +
                "A polyketide synthase-peptide synthetase gene cluster from an uncultured " +
                "bacterial symbiont of Paederus beetles.</a> " +
                "<em>Proc Natl Acad Sci USA</em> 99(22):14002-14007 (2002). PMID: 12381784. " +
                "(The foundational paper, and the first trans-AT PKS cluster linked to an " +
                "uncultured insect symbiont.)</li>" +
                "<li>Piel J, Hofer I, Hui D. " +
                "<a href=\"https://pubmed.ncbi.nlm.nih.gov/14973122/\" target=\"_blank\" rel=\"noopener\">" +
                "Evidence for a symbiosis island involved in horizontal acquisition of " +
                "pederin biosynthetic capabilities by the bacterial symbiont of Paederus " +
                "fuscipes beetles.</a> " +
                "<em>J Bacteriol</em> 186(5):1280-1286 (2004). PMID: 14973122.</li>" +
                "<li>Piel J, Butzke D, Fusetani N, Hui D, Platzer M, Wen G, Matsunaga S. " +
                "<a href=\"https://pubmed.ncbi.nlm.nih.gov/15828666/\" target=\"_blank\" rel=\"noopener\">" +
                "Exploring the chemistry of uncultivated bacterial symbionts: antitumor " +
                "polyketides of the pederin family.</a> " +
                "<em>J Nat Prod</em> 68(3):472-479 (2005). PMID: 15828666. " +
                "(Ties pederin architecturally to the onnamide/theopederin family from " +
                "marine sponge symbionts; the uncultured-symbiont trans-AT PKS " +
                "story generalising across host phyla.)</li>" +
                "</ul>",
            pythonSnippet:
                "from dash import Dash, html\n" +
                "from dash_seqviz import SeqViz\n" +
                "import requests\n" +
                "\n" +
                "# Pederin cluster (Paederus fuscipes symbiont, 2002)\n" +
                "gb = requests.get(\n" +
                "    \"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi\",\n" +
                "    params={\"db\": \"nuccore\", \"id\": \"AH013687.2\",\n" +
                "            \"rettype\": \"gb\", \"retmode\": \"text\",\n" +
                "            \"tool\": \"natural-products\", \"email\": \"you@lab.org\"},\n" +
                "    timeout=10,\n" +
                ").text\n" +
                "\n" +
                "app = Dash(__name__)\n" +
                "app.layout = html.Div([\n" +
                "    SeqViz(\n" +
                "        id=\"pederin\",\n" +
                "        name=\"Pederin cluster (AH013687.2)\",\n" +
                "        file=gb,\n" +
                "        viewer=\"both\",\n" +
                "        zoom={\"linear\": 1},\n" +
                "        style={\"height\": \"560px\", \"width\": \"100%\"},\n" +
                "    )\n" +
                "])\n" +
                "\n" +
                "if __name__ == \"__main__\":\n" +
                "    app.run(debug=True)\n"
        },
        {
            id: "patellamide-cluster",
            title: "Patellamides: cyanobactin RiPPs from a tunicate symbiont",
            summary: "The ribosome is the chemist.",
            category: "academic",
            tags: ["natural-product", "RiPP", "cyanobactin", "symbiont", "graduate"],
            complexity: 4,
            accession: "AY986476",
            compound: {
                name: "Patellamide A",
                smiles: "CCC(C)C1C2=NC(CO2)C(=O)NC(C3=NC(=CS3)C(=O)NC(C4=NC(C(O4)C)C(=O)NC(C5=NC(=CS5)C(=O)N1)C(C)C)C(C)CC)C(C)C",
                description: "A head-to-tail cyclic octapeptide decorated with alternating thiazoline and oxazoline heterocycles. Biosynthesised as a 71-residue ribosomal precursor (PatE), cleaved to its eight-residue core, and heterocyclised plus macrocyclised by a small set of post-translational enzymes encoded in the same cluster."
            },
            seqvizProps: {
                viewer: "both",
                zoom: { linear: 1 },
                style: { height: "560px", width: "100%" }
            },
            narrative:
                "<figure class=\"organism-figure figure-right\">" +
                    "<img src=\"./assets/images/lissoclinum-patella.jpg\" " +
                         "alt=\"A chartreuse tunicate colony, Lissoclinum patella, " +
                              "attached to a coral-reef substrate. The green colour " +
                              "comes from its intracellular cyanobacterial symbiont, " +
                              "Prochloron didemni.\">" +
                    "<figcaption><em>Lissoclinum patella</em>, a colonial ascidian on " +
                    "Indo-Pacific coral reefs. The chartreuse colour is not the tunicate; " +
                    "it is <em>Prochloron didemni</em>, an obligate cyanobacterial " +
                    "symbiont that lives in the ascidian's extracellular spaces and " +
                    "synthesises the patellamides. Image: Nhobgood / Wikimedia Commons " +
                    "(CC BY-SA 3.0).</figcaption>" +
                "</figure>" +
                "<p>Pick a <em>Lissoclinum patella</em> colony off an Indo-Pacific reef " +
                "and crack it open and you will find, in its intracellular spaces, the " +
                "reason it looks chartreuse: a thick suspension of " +
                "<span class=\"info-term\" data-term=\"prochloron-didemni\">" +
                "<em>Prochloron didemni</em></span>, an obligate cyanobacterium that " +
                "the tunicate does not grow outside of and cannot be grown without. " +
                "<em>Prochloron</em> provides photosynthate to its host, UV-absorbing " +
                "pigments, and, as a chemical bonus, a class of cyclic peptides called " +
                "the <strong>patellamides</strong>: eight-residue macrocycles dressed " +
                "with alternating thiazoline and oxazoline rings, and cytotoxic enough " +
                "to have been pursued as anticancer leads since the mid-1980s.</p>" +
                "<figure class=\"compound-figure figure-left\">" +
                    "<img src=\"./assets/molecules/patellamide-a.svg\" " +
                         "alt=\"Skeletal structure of patellamide A, a cyclic octapeptide " +
                              "with alternating thiazoline and oxazoline heterocycles.\">" +
                    "<figcaption>Patellamide A. An eight-residue head-to-tail cyclic " +
                    "peptide; every other residue has been dehydrated into a thiazoline " +
                    "or oxazoline ring. Image: Wikimedia Commons (public domain).</figcaption>" +
                "</figure>" +
                "<p>The patellamides looked, at first glance, like exactly the sort of " +
                "peptide a large " +
                "<span class=\"info-term\" data-term=\"nonribosomal-peptide-synthetase\">" +
                "nonribosomal peptide synthetase</span> would build. The amino-acid " +
                "sequence is chemically exotic, the heterocycles are not standard " +
                "ribosomal chemistry, and the macrocyclisation needs dedicated " +
                "enzymology. The 2005 cluster paper overturned all of it. The " +
                "<em>pat</em> locus is only about eleven kilobases, and sitting " +
                "inside it is a single 213-base open reading frame, <code>patE</code>, " +
                "that encodes a seventy-one-residue precursor peptide. Eight residues " +
                "of PatE are the core. The remaining <em>pat</em> genes encode a " +
                "protease, two heterocyclisation enzymes, and a macrocyclase, all of " +
                "which act <em>after</em> translation to deliver the mature drug " +
                "scaffold.</p>" +
                "<div class=\"inline-viewer\" " +
                     "data-accession=\"AY986476\" " +
                     "data-viewer=\"circular\" " +
                     "data-height=\"420px\" " +
                     "data-caption=\"The 11 kb pat cluster in circular view. patE is " +
                                    "the shortest CDS in the cluster; patG and the other " +
                                    "tailoring enzymes take up most of the real estate.\"></div>" +
                "<p>This was one of the founding " +
                "<span class=\"info-term\" data-term=\"ripp\">" +
                "RiPP</span> papers, the template that tied cyanobactins, lantibiotics, " +
                "sactipeptides, and later the " +
                "<a href=\"./example.html?id=bottromycin-academic\">bottromycins</a> into " +
                "one biosynthetic logic. It also provided a decisive experimental " +
                "handle. Because the chemistry happens after the ribosome, and because " +
                "the enzymes are few and small, the full <em>pat</em> pathway could be " +
                "lifted out of <em>Prochloron</em> and refactored in <em>E. coli</em> " +
                "in 2008. Patellamides A and C came out of the heterologous host at " +
                "detectable titer. A tunicate-bound symbiosis had been reduced to a " +
                "single plasmid.</p>" +
                "<h3>References</h3>" +
                "<ul>" +
                "<li>Schmidt EW, Nelson JT, Rasko DA, Sudek S, Eisen JA, Haygood MG, Ravel J. " +
                "<a href=\"https://pubmed.ncbi.nlm.nih.gov/15983371/\" target=\"_blank\" rel=\"noopener\">" +
                "Patellamide A and C biosynthesis by a microcin-like pathway in Prochloron " +
                "didemni, the cyanobacterial symbiont of Lissoclinum patella.</a> " +
                "<em>Proc Natl Acad Sci USA</em> 102(20):7315-20 (2005). PMID: 15983371.</li>" +
                "<li>Kwan JC, Donia MS, Han AW, Hirose E, Haygood MG, Schmidt EW. " +
                "<a href=\"https://pubmed.ncbi.nlm.nih.gov/23185008/\" target=\"_blank\" rel=\"noopener\">" +
                "Genome streamlining and chemical defense in a coral reef symbiosis.</a> " +
                "<em>Proc Natl Acad Sci USA</em> 109(50):20655-60 (2012). PMID: 23185008. " +
                "(Ties the <em>pat</em> cluster to the broader story of " +
                "<em>Prochloron</em>'s reduced genome and the chemical protection it " +
                "provides to its tunicate host.)</li>" +
                "<li>Donia MS, Ravel J, Schmidt EW. " +
                "<a href=\"https://pubmed.ncbi.nlm.nih.gov/18425111/\" target=\"_blank\" rel=\"noopener\">" +
                "A global assembly line for cyanobactins.</a> " +
                "<em>Nat Chem Biol</em> 4(6):341-343 (2008). PMID: 18425111. " +
                "(Heterologous expression of <em>pat</em> and related cyanobactin pathways " +
                "in <em>E. coli</em>; the receipts for \"a ribosomal-peptide drug " +
                "scaffold is portable between organisms\".)</li>" +
                "</ul>",
            pythonSnippet:
                "from dash import Dash, html\n" +
                "from dash_seqviz import SeqViz\n" +
                "import requests\n" +
                "\n" +
                "# Patellamide cluster (Prochloron didemni / Lissoclinum patella, 2005)\n" +
                "gb = requests.get(\n" +
                "    \"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi\",\n" +
                "    params={\"db\": \"nuccore\", \"id\": \"AY986476\",\n" +
                "            \"rettype\": \"gb\", \"retmode\": \"text\",\n" +
                "            \"tool\": \"natural-products\", \"email\": \"you@lab.org\"},\n" +
                "    timeout=10,\n" +
                ").text\n" +
                "\n" +
                "app = Dash(__name__)\n" +
                "app.layout = html.Div([\n" +
                "    SeqViz(\n" +
                "        id=\"patellamide\",\n" +
                "        name=\"Patellamide cluster (AY986476)\",\n" +
                "        file=gb,\n" +
                "        viewer=\"both\",\n" +
                "        zoom={\"linear\": 1},\n" +
                "        style={\"height\": \"560px\", \"width\": \"100%\"},\n" +
                "    )\n" +
                "])\n" +
                "\n" +
                "if __name__ == \"__main__\":\n" +
                "    app.run(debug=True)\n"
        },
        {
            id: "jamaicamide-cluster",
            title: "Jamaicamides — Halogenated PKS-NRPS from a marine cyanobacterium",
            summary: "The ~70 kb jam cluster from Lyngbya majuscula. A hybrid PKS-NRPS that installs a vinyl chloride AND a terminal alkyne bromine in the same molecule.",
            category: "academic",
            tags: ["natural-product", "PKS-NRPS", "halogenation", "cyanobacterium"],
            complexity: 4,
            accession: "AY522504",
            compound: {
                name: "Jamaicamide A",
                smiles: "CC1C=CC(=O)N1C(=O)C=C(CCNC(=O)CCC=CC(C)CCC(=CCl)CCCC#CBr)OC",
                description: "A lipopeptide from Lyngbya majuscula with two rare structural features: a vinyl chloride (C=CCl) and a terminal alkynyl bromide (C\u2261C-Br). Sodium-channel modulator with anticancer activity in some cell lines."
            },
            seqvizProps: {
                viewer: "both",
                zoom: { linear: 1 },
                style: { height: "560px", width: "100%" }
            },
            narrative:
                "<figure class=\"organism-figure figure-right\">" +
                    "<img src=\"./assets/images/lyngbya-majuscula.jpg\" " +
                         "alt=\"A tuft of Lyngbya majuscula, a dark-olive filamentous " +
                              "marine cyanobacterium, attached to submerged reef " +
                              "substrate on Reunion Island.\">" +
                    "<figcaption><em>Lyngbya majuscula</em> (recently reclassified " +
                    "<em>Moorena producens</em>), a filamentous marine cyanobacterium. " +
                    "The chemical source of jamaicamides, curacin A, barbamide, and " +
                    "many other halogenated PKS-NRPS natural products. Image: Philippe " +
                    "Bourjon / Wikimedia Commons (CC BY-SA 4.0).</figcaption>" +
                "</figure>" +
                "<h3>A cyanobacterium that halogenates like it's going out of style</h3>" +
                "<p><strong>Jamaicamides</strong> are hybrid PKS-NRPS lipopeptides from the " +
                "marine cyanobacterium <em>Lyngbya majuscula</em> (now <em>Moorena " +
                "producens</em>). Two structural features make them a natural-product " +
                "chemistry teaching favorite: a <strong>vinyl chloride</strong> installed " +
                "mid-chain by a radical halogenase, and a <strong>terminal alkyne " +
                "brominated</strong> at the omega position. Each of those steps alone is " +
                "rare; together in one molecule, they're iconic.</p>" +
                "<p>Sequencing of the ~70 kb <em>jam</em> cluster in 2004 revealed " +
                "17 open reading frames, including a dedicated halogenase " +
                "(<code>jamD</code>) for the vinyl chloride and a terminal-alkyne " +
                "desaturase (<code>jamB</code>). The cluster is big \u2014 about the same " +
                "footprint as a bacterial secondary-metabolite mega-cluster \u2014 and it's " +
                "all on one contig.</p>" +
                "<h3>Try this</h3>" +
                "<ul>" +
                "<li><strong>Zoom out to see all 17 ORFs.</strong> Hold at zoom=1 in " +
                "linear view. The hybrid PKS-NRPS modules are the big ones; the tailoring " +
                "enzymes (halogenase, desaturase, methyltransferase) are the smaller " +
                "CDSs scattered through.</li>" +
                "<li><strong>Find <code>jamD</code>.</strong> It's the radical halogenase " +
                "\u2014 a cytochrome-P450-like domain responsible for the vinyl chloride. " +
                "Search for product labels matching \"halogenase\" in the annotation.</li>" +
                "<li><strong>Find <code>jamB</code> and <code>jamC</code>.</strong> " +
                "Together they install the terminal alkynyl bromide. This is one of very " +
                "few characterized biosynthetic pathways to a C\u2261C-Br group anywhere in " +
                "nature.</li>" +
                "<li><strong>Look at the compound card below</strong> to see the 2D structure: " +
                "note the Cl dangling off the vinyl and the Br at the chain terminus.</li>" +
                "</ul>" +
                "<h3>References</h3>" +
                "<ul>" +
                "<li>Edwards DJ, Marquez BL, Nogle LM, McPhail K, Goeger DE, Roberts MA, " +
                "Gerwick WH. " +
                "<a href=\"https://pubmed.ncbi.nlm.nih.gov/15123209/\" target=\"_blank\" rel=\"noopener\">" +
                "Structure and biosynthesis of the jamaicamides, new mixed polyketide-" +
                "peptide neurotoxins from the marine cyanobacterium Lyngbya majuscula.</a> " +
                "<em>Chem Biol</em> 11(6):817-33 (2004). PMID: 15123209.</li>" +
                "</ul>",
            pythonSnippet:
                "from dash import Dash, html\n" +
                "from dash_seqviz import SeqViz\n" +
                "import requests\n" +
                "\n" +
                "# Jamaicamide cluster (Lyngbya majuscula, 2004)\n" +
                "gb = requests.get(\n" +
                "    \"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi\",\n" +
                "    params={\"db\": \"nuccore\", \"id\": \"AY522504\",\n" +
                "            \"rettype\": \"gb\", \"retmode\": \"text\",\n" +
                "            \"tool\": \"natural-products\", \"email\": \"you@lab.org\"},\n" +
                "    timeout=10,\n" +
                ").text\n" +
                "\n" +
                "app = Dash(__name__)\n" +
                "app.layout = html.Div([\n" +
                "    SeqViz(\n" +
                "        id=\"jamaicamide\",\n" +
                "        name=\"Jamaicamide cluster (AY522504)\",\n" +
                "        file=gb,\n" +
                "        viewer=\"both\",\n" +
                "        zoom={\"linear\": 1},\n" +
                "        style={\"height\": \"560px\", \"width\": \"100%\"},\n" +
                "    )\n" +
                "])\n" +
                "\n" +
                "if __name__ == \"__main__\":\n" +
                "    app.run(debug=True)\n"
        },
        {
            id: "curacin-a-cluster",
            title: "Curacin A — Antimitotic PKS-NRPS with a cyclopropane ring",
            summary: "The 64 kb cur cluster from Lyngbya majuscula. Hybrid PKS-NRPS whose GNAT/HCS/ECH module installs a cyclopropane ring via a carefully-timed carbanion attack.",
            category: "academic",
            tags: ["natural-product", "PKS-NRPS", "antimitotic", "cyanobacterium"],
            complexity: 4,
            accession: "AY652953.1",
            compound: {
                name: "Curacin A",
                smiles: "CC1CC1C2=NC(CS2)C=CCCC=CC=C(C)CCC(CC=C)OC",
                description: "A lipid-tailed thiazoline-bearing polyketide with a cyclopropane ring, from the marine cyanobacterium Lyngbya majuscula. Potent antimitotic (disrupts microtubule polymerization); anticancer lead in the late 1990s."
            },
            seqvizProps: {
                viewer: "both",
                zoom: { linear: 1 },
                style: { height: "560px", width: "100%" }
            },
            narrative:
                "<figure class=\"organism-figure figure-right\">" +
                    "<img src=\"./assets/images/lyngbya-majuscula.jpg\" " +
                         "alt=\"A tuft of Lyngbya majuscula, a dark-olive filamentous " +
                              "marine cyanobacterium, growing on a submerged reef.\">" +
                    "<figcaption><em>Lyngbya majuscula</em> (<em>Moorena producens</em>). " +
                    "The same tropical cyanobacterial lineage that produces the " +
                    "<a href=\"./example.html?id=jamaicamide-cluster\">jamaicamides</a> " +
                    "and <a href=\"./example.html?id=barbamide-cluster\">barbamide</a>. " +
                    "Image: Philippe Bourjon / Wikimedia Commons (CC BY-SA 4.0)." +
                    "</figcaption>" +
                "</figure>" +
                "<h3>How do you put a cyclopropane ring on a PKS product?</h3>" +
                "<p><strong>Curacin A</strong> is one of the most chemically distinctive " +
                "marine natural products: it combines a thiazoline ring, a terminal alkene, " +
                "an all-Z polyene, <em>and</em> a cyclopropane ring on the same backbone. " +
                "The cyclopropane is the interesting one \u2014 it's installed by a GNAT " +
                "(GCN5-related N-acetyltransferase) + HMG-CoA synthase + enoyl-CoA " +
                "hydratase triad embedded mid-cluster, which primes a carbanion that " +
                "attacks its own methyl branch.</p>" +
                "<p>Sequencing of the ~64 kb <em>cur</em> cluster (AY652953) in 2004 " +
                "revealed a pathway that is fully collinear: gene order on the chromosome " +
                "matches biosynthetic step order. That makes this cluster a uniquely " +
                "clean teaching target for reading PKS biosynthesis \"off the page\".</p>" +
                "<h3>Try this</h3>" +
                "<ul>" +
                "<li><strong>Read the cluster left-to-right as biosynthetic steps.</strong> " +
                "In linear view at zoom=1, each CDS corresponds to one biochemical step. " +
                "<code>curA</code> is the loading module; downstream modules extend + " +
                "tailor; <code>curM</code> is the offloading step. Read gene-order-as-" +
                "step-order.</li>" +
                "<li><strong>Find the GNAT / HCS / ECH triad.</strong> These three CDSs " +
                "(around <code>curD</code>/<code>curE</code>/<code>curF</code>) are what " +
                "build the cyclopropane. This is one of the canonical examples of on-PKS " +
                "cyclopropanation machinery.</li>" +
                "<li><strong>Compare to <a href=\"./example.html?id=jamaicamide-cluster\">" +
                "jamaicamide</a>.</strong> Same cyanobacterium, similar-sized cluster, " +
                "very different chemistry: curacin uses cyclopropane + thiazoline, " +
                "jamaicamide uses halogenation. Both are cases of cyanobacterial PKS-NRPS " +
                "decorating otherwise simple chains with wild tailoring.</li>" +
                "<li><strong>Look at the compound card below</strong> to see the cyclopropane " +
                "+ thiazoline geometry on the 2D structure.</li>" +
                "</ul>" +
                "<h3>References</h3>" +
                "<ul>" +
                "<li>Chang Z, Sitachitta N, Rossi JV, Roberts MA, Flatt PM, Jia J, Sherman " +
                "DH, Gerwick WH. " +
                "<a href=\"https://pubmed.ncbi.nlm.nih.gov/15332855/\" target=\"_blank\" rel=\"noopener\">" +
                "Biosynthetic pathway and gene cluster analysis of curacin A, an antitubulin " +
                "natural product from the tropical marine cyanobacterium Lyngbya majuscula.</a> " +
                "<em>J Nat Prod</em> 67(8):1356-67 (2004). PMID: 15332855.</li>" +
                "</ul>",
            pythonSnippet:
                "from dash import Dash, html\n" +
                "from dash_seqviz import SeqViz\n" +
                "import requests\n" +
                "\n" +
                "# Curacin A cluster (Lyngbya majuscula, 2004)\n" +
                "gb = requests.get(\n" +
                "    \"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi\",\n" +
                "    params={\"db\": \"nuccore\", \"id\": \"AY652953.1\",\n" +
                "            \"rettype\": \"gb\", \"retmode\": \"text\",\n" +
                "            \"tool\": \"natural-products\", \"email\": \"you@lab.org\"},\n" +
                "    timeout=10,\n" +
                ").text\n" +
                "\n" +
                "app = Dash(__name__)\n" +
                "app.layout = html.Div([\n" +
                "    SeqViz(\n" +
                "        id=\"curacin\",\n" +
                "        name=\"Curacin A cluster (AY652953)\",\n" +
                "        file=gb,\n" +
                "        viewer=\"both\",\n" +
                "        zoom={\"linear\": 1},\n" +
                "        style={\"height\": \"560px\", \"width\": \"100%\"},\n" +
                "    )\n" +
                "])\n" +
                "\n" +
                "if __name__ == \"__main__\":\n" +
                "    app.run(debug=True)\n"
        },
        {
            id: "barbamide-cluster",
            title: "Barbamide — Trichloromethyl group built by an NRPS halogenase",
            summary: "The 40 kb bar cluster from Lyngbya majuscula. The only natural-product pathway known to install a -CCl\u2083 group by dedicated halogenase enzymology.",
            category: "academic",
            tags: ["natural-product", "NRPS", "halogenation", "cyanobacterium"],
            complexity: 4,
            accession: "AF516145",
            compound: {
                name: "Barbamide",
                smiles: "CC(CC(=CC(=O)N(C)C(CC1=CC=CC=C1)C2=NC=CS2)OC)C(Cl)(Cl)Cl",
                description: "A molluscicidal lipopeptide from Lyngbya majuscula with a terminal -CCl\u2083 (trichloromethyl) group \u2014 one of the very few known examples of enzymatic trichlorination in natural-product biosynthesis."
            },
            seqvizProps: {
                viewer: "both",
                zoom: { linear: 1 },
                style: { height: "560px", width: "100%" }
            },
            narrative:
                "<figure class=\"organism-figure figure-right\">" +
                    "<img src=\"./assets/images/lyngbya-majuscula.jpg\" " +
                         "alt=\"A tuft of Lyngbya majuscula, a dark-olive filamentous " +
                              "marine cyanobacterium, growing on a submerged reef.\">" +
                    "<figcaption><em>Lyngbya majuscula</em> (<em>Moorena producens</em>). " +
                    "Same tropical cyanobacterium that produces the " +
                    "<a href=\"./example.html?id=jamaicamide-cluster\">jamaicamides</a> " +
                    "and <a href=\"./example.html?id=curacin-a-cluster\">curacin A</a> " +
                    "\u2014 a single producer lineage with three very different " +
                    "halogenation chemistries. Image: Philippe Bourjon / Wikimedia " +
                    "Commons (CC BY-SA 4.0).</figcaption>" +
                "</figure>" +
                "<h3>Three chlorines on one methyl \u2014 built by an enzyme</h3>" +
                "<p>If you synthesized <strong>barbamide</strong> in an undergraduate " +
                "organic lab, you'd make the <strong>-CCl\u2083</strong> group via radical " +
                "chlorination: lots of CCl\u2084, UV light, messy selectivity. Barbamide's " +
                "producer, the marine cyanobacterium <em>Lyngbya majuscula</em>, just " +
                "uses two enzymes: <code>barB1</code> and <code>barB2</code>, non-heme " +
                "iron halogenases that install three chlorines on the same methyl group " +
                "of a leucyl-S-ACP intermediate.</p>" +
                "<p>Sequencing of the ~40 kb <em>bar</em> cluster (AF516145) in 2002 " +
                "mapped each step. The halogenases sit upstream in the " +
                "cluster; the NRPS modules that load the trichlorinated leucine and " +
                "extend it with a phenylalanine + thiazole come downstream. Read the " +
                "cluster left-to-right and you read the biosynthesis in order.</p>" +
                "<h3>Try this</h3>" +
                "<ul>" +
                "<li><strong>Find the two halogenase CDSs.</strong> <code>barB1</code> " +
                "and <code>barB2</code> are the non-heme Fe halogenases \u2014 scan the " +
                "linear view for their annotations. Each installs one chlorine; together " +
                "with a later step they give the signature CCl\u2083.</li>" +
                "<li><strong>Look at the compound card below</strong> to see the CCl\u2083 group " +
                "on the 2D structure \u2014 the three chlorines sitting on one carbon " +
                "is unmistakable.</li>" +
                "<li><strong>Compare to <a href=\"./example.html?id=jamaicamide-cluster\">" +
                "jamaicamide</a> and <a href=\"./example.html?id=curacin-a-cluster\">" +
                "curacin A</a>.</strong> Same cyanobacterial producer; three different " +
                "approaches to decorating polyketide scaffolds. Jamaicamide gets a vinyl " +
                "chloride + alkynyl bromide; curacin gets a cyclopropane + thiazoline; " +
                "barbamide gets a trichloromethyl. One cyanobacterium, a wild chemistry " +
                "toolbox.</li>" +
                "</ul>" +
                "<h3>References</h3>" +
                "<ul>" +
                "<li>Chang Z, Flatt P, Gerwick WH, Nguyen VA, Willis CL, Sherman DH. " +
                "<a href=\"https://pubmed.ncbi.nlm.nih.gov/12220770/\" target=\"_blank\" rel=\"noopener\">" +
                "The barbamide biosynthetic gene cluster: a novel marine cyanobacterial " +
                "system of mixed polyketide synthase (PKS)-non-ribosomal peptide synthetase " +
                "(NRPS) origin involving an unusual trichloroleucyl starter unit.</a> " +
                "<em>Gene</em> 296(1-2):235-47 (2002). PMID: 12220770.</li>" +
                "</ul>",
            pythonSnippet:
                "from dash import Dash, html\n" +
                "from dash_seqviz import SeqViz\n" +
                "import requests\n" +
                "\n" +
                "# Barbamide cluster (Lyngbya majuscula, 2002)\n" +
                "gb = requests.get(\n" +
                "    \"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi\",\n" +
                "    params={\"db\": \"nuccore\", \"id\": \"AF516145\",\n" +
                "            \"rettype\": \"gb\", \"retmode\": \"text\",\n" +
                "            \"tool\": \"natural-products\", \"email\": \"you@lab.org\"},\n" +
                "    timeout=10,\n" +
                ").text\n" +
                "\n" +
                "app = Dash(__name__)\n" +
                "app.layout = html.Div([\n" +
                "    SeqViz(\n" +
                "        id=\"barbamide\",\n" +
                "        name=\"Barbamide cluster (AF516145)\",\n" +
                "        file=gb,\n" +
                "        viewer=\"both\",\n" +
                "        zoom={\"linear\": 1},\n" +
                "        style={\"height\": \"560px\", \"width\": \"100%\"},\n" +
                "    )\n" +
                "])\n" +
                "\n" +
                "if __name__ == \"__main__\":\n" +
                "    app.run(debug=True)\n"
        },
        {
            id: "trabectedin-cluster",
            title: "Trabectedin (ET-743): an FDA-approved anticancer drug from a tunicate symbiont",
            summary: "A bacterium that spends a quarter of its genome on one molecule.",
            category: "industrial",
            tags: ["natural-product", "NRPS", "symbiont", "pharma", "anticancer"],
            complexity: 5,
            accession: "HQ609499.1",
            featured: true,
            compound: {
                name: "Trabectedin",
                smiles: "CC1=CC2=C(C3C4C5C6=C(C(=C7C(=C6C(N4C(C(C2)N3C)O)COC(=O)C8(CS5)C9=CC(=C(C=C9CCN8)O)OC)OCO7)C)OC(=O)C)C(=C1OC)O",
                description: "A pentacyclic tetrahydroisoquinoline alkaloid that alkylates DNA in the minor groove. Isolated from the Caribbean mangrove tunicate Ecteinascidia turbinata; biosynthesised by an obligate uncultured bacterial endosymbiont, Candidatus Endoecteinascidia frumentensis. Marketed as Yondelis for soft-tissue sarcoma and advanced ovarian cancer."
            },
            seqvizProps: {
                viewer: "both",
                zoom: { linear: 1 },
                style: { height: "560px", width: "100%" }
            },
            narrative:
                "<figure class=\"organism-figure figure-right\">" +
                    "<img src=\"./assets/images/ecteinascidia-turbinata.jpeg\" " +
                         "alt=\"A colony of zooids of the mangrove tunicate Ecteinascidia " +
                              "turbinata, translucent orange tubular animals attached to a " +
                              "substrate underwater.\">" +
                    "<figcaption><em>Ecteinascidia turbinata</em>, the mangrove tunicate. " +
                    "Translucent orange zooids attached to mangrove roots and dock " +
                    "pilings in the Caribbean. Image: NIH / Wikimedia Commons " +
                    "(public domain).</figcaption>" +
                "</figure>" +
                "<p><strong>Trabectedin</strong>, marketed as Yondelis, is one of the " +
                "few marine natural products to have made it through late-stage clinical " +
                "trials into approved therapy. The European Medicines Agency cleared " +
                "it for advanced soft-tissue sarcoma in 2007, the US Food and Drug " +
                "Administration followed in 2015, and it is now a second-line option " +
                "for patients whose sarcomas have progressed through anthracyclines. " +
                "Mechanistically it is a minor-groove DNA alkylator, binding at guanine " +
                "N2 and bending the duplex enough to recruit a broken-transcription " +
                "response that kills dividing cells.</p>" +
                "<figure class=\"compound-figure figure-left\">" +
                    "<img src=\"./assets/molecules/trabectedin.svg\" " +
                         "alt=\"Skeletal structure of trabectedin, a pentacyclic tetra" +
                              "hydroisoquinoline alkaloid with three fused rings in a " +
                              "bridged core and a pendant alkylating C-ring.\">" +
                    "<figcaption>Trabectedin. Three fused tetrahydroisoquinoline rings " +
                    "form the core; the pendant C-ring bears the carbinolamine that " +
                    "alkylates DNA. Image: Wikimedia Commons (public domain).</figcaption>" +
                "</figure>" +
                "<p>The compound was isolated decades earlier, in the late 1980s, from " +
                "the Caribbean mangrove tunicate <em>Ecteinascidia turbinata</em>. " +
                "Getting enough material to study it meant dredging up tons of tunicate " +
                "colonies from Florida and the Bahamas, and even then yields were in the " +
                "parts-per-million range. Industrial supply was eventually solved by " +
                "semi-synthesis from a fermentation-derived bacterial intermediate, but " +
                "the biological producer inside the tunicate itself remained unknown " +
                "through the entire approval process.</p>" +
                "<p>The metagenomic trail arrived after the clinical trials did. A 2011 " +
                "shotgun-sequencing study of <em>E. turbinata</em> tissue recovered " +
                "partial " +
                "<span class=\"info-term\" data-term=\"nonribosomal-peptide-synthetase\">" +
                "nonribosomal peptide synthetase</span> (NRPS) biosynthetic contigs " +
                "matching ET-743's chemistry. A 2015 follow-up completed the picture: " +
                "the full genome of the producer, " +
                "<span class=\"info-term\" data-term=\"endoecteinascidia-frumentensis\">" +
                "<em>Candidatus</em> Endoecteinascidia frumentensis</span>, is only " +
                "about 631 kilobases, one of the smallest bacterial genomes ever " +
                "sequenced. The ET-743 biosynthetic genes are not arranged as a " +
                "single contiguous cluster the way most bacterial secondary-metabolite " +
                "loci are; they are scattered across three distinct regions of the " +
                "chromosome that together span roughly 173 kilobases. Even broken " +
                "apart like that, more than a quarter of the organism's DNA is " +
                "dedicated to making this single molecule.</p>" +
                "<div class=\"inline-viewer\" " +
                     "data-accession=\"HQ609499.1\" " +
                     "data-viewer=\"linear\" " +
                     "data-zoom=\"1\" " +
                     "data-height=\"340px\" " +
                     "data-caption=\"A 35 kb partial contig carrying part of the ET-743 " +
                                    "biosynthetic machinery. Three NRPS modules visible " +
                                    "here encode the tetrahydroisoquinoline core; the " +
                                    "rest of the pathway lives on other contigs elsewhere " +
                                    "in the 631 kb genome.\"></div>" +
                "<p>The <a href=\"./example.html?id=bryostatin-cluster\">bryostatin</a> " +
                "and <a href=\"./example.html?id=pederin-cluster\">pederin</a> stories " +
                "share an arc with trabectedin: a striking natural product is isolated " +
                "from an invertebrate; its chemistry resists synthesis at scale; the " +
                "producer is not the invertebrate but a bacterial symbiont that will " +
                "not grow in isolation; and the biosynthetic genes are recovered, " +
                "years or decades later, by sequencing the host metagenome. Trabectedin " +
                "is the member of the set that has gone furthest into the clinic.</p>" +
                "<h3>References</h3>" +
                "<ul>" +
                "<li>Rath CM, Janto B, Earl J, Ahmed A, Hu FZ, Hiller L <em>et al.</em> " +
                "<a href=\"https://pubmed.ncbi.nlm.nih.gov/22035036/\" target=\"_blank\" rel=\"noopener\">" +
                "Meta-omic characterization of the marine invertebrate microbial consortium " +
                "that produces the chemotherapeutic natural product ET-743.</a> " +
                "<em>ACS Chem Biol</em> 6(11):1244-56 (2011). PMID: 22035036.</li>" +
                "<li>Schofield MM, Jain S, Porat D, Dick GJ, Sherman DH. " +
                "<a href=\"https://pubmed.ncbi.nlm.nih.gov/26013440/\" target=\"_blank\" rel=\"noopener\">" +
                "Identification and analysis of the bacterial endosymbiont specialized for " +
                "production of the chemotherapeutic natural product ET-743.</a> " +
                "<em>Environ Microbiol</em> 17(10):3964-75 (2015). PMID: 26013440.</li>" +
                "</ul>",
            pythonSnippet:
                "from dash import Dash, html\n" +
                "from dash_seqviz import SeqViz\n" +
                "import requests\n" +
                "\n" +
                "# ET-743 partial NRPS cluster (Ca. Endoecteinascidia frumentensis, 2011)\n" +
                "gb = requests.get(\n" +
                "    \"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi\",\n" +
                "    params={\"db\": \"nuccore\", \"id\": \"HQ609499.1\",\n" +
                "            \"rettype\": \"gb\", \"retmode\": \"text\",\n" +
                "            \"tool\": \"natural-products\", \"email\": \"you@lab.org\"},\n" +
                "    timeout=10,\n" +
                ").text\n" +
                "\n" +
                "app = Dash(__name__)\n" +
                "app.layout = html.Div([\n" +
                "    SeqViz(\n" +
                "        id=\"trabectedin\",\n" +
                "        name=\"ET-743 cluster (HQ609499.1)\",\n" +
                "        file=gb,\n" +
                "        viewer=\"both\",\n" +
                "        zoom={\"linear\": 1},\n" +
                "        style={\"height\": \"560px\", \"width\": \"100%\"},\n" +
                "    )\n" +
                "])\n" +
                "\n" +
                "if __name__ == \"__main__\":\n" +
                "    app.run(debug=True)\n"
        },
        // ------------------------------------------------------------------
        // Marine/terrestrial symbiont-derived polyketides: lagriamide
        // (beetle egg defensive PKS) and lasonolide A (deep-sea sponge
        // anticancer lead). Both assembled from uncultured-symbiont
        // metagenomes -- the modern pederin/bryostatin template in action.
        // ------------------------------------------------------------------
        {
            id: "lagriamide-cluster",
            title: "Lagriamide: a beetle-egg defensive PKS from a horizontally acquired symbiont",
            summary: "A mother beetle coats her eggs in antifungal bacteria.",
            category: "academic",
            tags: ["natural-product", "PKS", "NRPS", "symbiont", "defensive", "graduate"],
            complexity: 5,
            accession: "MH171092.1",
            compound: {
                name: "Lagriamide",
                smiles: "CC1CCC(OC1CC(=O)NCC(C(C)C(=O)NCCCC2C(CCC3(O2)CCCC(O3)CCC(C)/C=C(\\C)/CCC(=O)O)C)O)CC(=O)C4C(O4)C",
                description: "An antifungal hybrid polyketide-peptide carrying a spiroacetal, a tetrahydropyran, and a pendant epoxide. Produced by an obligate Burkholderia gladioli lineage (Lv-StB) that Lagria villosa beetles transfer to their eggs as a chemical shield against soil-dwelling fungi."
            },
            seqvizProps: {
                viewer: "both",
                zoom: { linear: 1 },
                style: { height: "560px", width: "100%" }
            },
            narrative:
                "<figure class=\"organism-figure figure-right\">" +
                    "<img src=\"./assets/images/lagria-villosa.jpeg\" " +
                         "alt=\"A Lagria villosa beetle, showing the dark elongate " +
                              "body and orange-red soft-haired prothorax characteristic " +
                              "of the species.\">" +
                    "<figcaption><em>Lagria villosa</em>, the hairy darkling beetle. " +
                    "Native to sub-Saharan Africa and invasive in Brazil, where it " +
                    "feeds on soybean and other legumes. Image: Wikimedia Commons " +
                    "(CC0).</figcaption>" +
                "</figure>" +
                "<p>A female <em>Lagria villosa</em> beetle lays her eggs on damp " +
                "soil, and before she walks away she smears them with bacteria. The " +
                "smear is precise, repeated on every egg in a clutch, and it is not " +
                "accidental. The bacteria are strains of <em>Burkholderia gladioli</em> " +
                "that the beetle has cultivated in specialised abdominal glands; on " +
                "the egg surface they begin producing an antifungal compound called " +
                "<strong>lagriamide</strong>, a hybrid polyketide-peptide potent " +
                "enough to shut out the soil fungi that would otherwise consume the " +
                "embryos before they hatch. Eggs experimentally stripped of their " +
                "smear die at dramatically elevated rates.</p>" +
                "<p>One of the beetle's <em>Burkholderia</em> strains, " +
                "<span class=\"info-term\" data-term=\"burkholderia-gladioli-lv-stb\">" +
                "known as Lv-StB</span>, is the sole producer. It has resisted every " +
                "attempt to grow it on its own outside the beetle, and sequencing " +
                "shows why: its genome has lost the usual complement of free-living " +
                "<em>Burkholderia</em> genes and shrunk into something that can " +
                "survive only in the very specific nutritional environment of its " +
                "host. What it has kept, in near-pristine condition, is a " +
                "<span class=\"info-term\" data-term=\"trans-at-pks\">" +
                "trans-AT PKS</span>/NRPS cluster (<em>lgaA</em>\u2013<em>lgaM</em>) " +
                "whose seventeen catalytic modules draw out lagriamide's carbon " +
                "skeleton.</p>" +
                "<div class=\"inline-viewer\" " +
                     "data-accession=\"MH171092.1\" " +
                     "data-viewer=\"circular\" " +
                     "data-height=\"420px\" " +
                     "data-annotation-min-length=\"5000\" " +
                     "data-caption=\"The lga locus pulled from the Lv-StB genome. " +
                                    "Most of the footprint is multi-module PKS/NRPS " +
                                    "megasynthases; the trans-AT partner and tailoring " +
                                    "enzymes cluster around the periphery.\"></div>" +
                "<p>The cluster itself is a clue about where lagriamide came from. It " +
                "sits on a clearly delineated genomic island, flanked by the sequence " +
                "signatures of a past " +
                "<span class=\"info-term\" data-term=\"horizontal-gene-transfer\">" +
                "horizontal gene transfer</span> event. The beetle's defensive chemistry, " +
                "in other words, was not invented by the resident symbiont. It was " +
                "acquired, probably from a free-living relative, and then retained " +
                "under selection strong enough to keep it intact while the rest of " +
                "the symbiont genome eroded.</p>" +
                "<p>The pattern is familiar by now: a drug-grade compound produced by " +
                "an uncultured bacterial symbiont of an invertebrate, recovered only " +
                "by sequencing the host metagenome. Lagriamide is the terrestrial " +
                "cousin to " +
                "<a href=\"./example.html?id=bryostatin-cluster\">bryostatin</a>, " +
                "<a href=\"./example.html?id=pederin-cluster\">pederin</a>, and " +
                "<a href=\"./example.html?id=trabectedin-cluster\">ET-743</a>, and " +
                "the beetle is one more host whose biology we can read only through " +
                "its passengers.</p>" +
                "<h3>References</h3>" +
                "<ul>" +
                "<li>Fl\u00f3rez LV, Scherlach K, Miller IJ, Rodrigues A, Kwan JC, " +
                "Hertweck C, Kaltenpoth M. " +
                "<a href=\"https://pubmed.ncbi.nlm.nih.gov/29946103/\" target=\"_blank\" rel=\"noopener\">" +
                "An antifungal polyketide associated with horizontally acquired genes " +
                "supports symbiont-mediated defense in Lagria villosa beetles.</a> " +
                "<em>Nat Commun</em> 9(1):2478 (2018). PMID: 29946103.</li>" +
                "<li>Waterworth SC, Flores-Bocanegra L, Fl\u00f3rez LV, Kaltenpoth M, " +
                "Ch\u00e1vez-Rom\u00e1n I, Rees ER, Oberlies NH, Kwan JC. " +
                "<a href=\"https://pubmed.ncbi.nlm.nih.gov/31964734/\" target=\"_blank\" rel=\"noopener\">" +
                "Horizontal gene transfer to a defensive symbiont with a reduced " +
                "genome in a multipartite beetle microbiome.</a> " +
                "<em>mBio</em> 11(1):e02430-19 (2020). PMID: 31964734. " +
                "(Follow-up work reconstructing Lv-StB as a heavily reduced " +
                "<em>Burkholderia</em> whose retained genome is disproportionately " +
                "the <em>lga</em> cluster itself.)</li>" +
                "<li>Fergusson CH, Saulog J, Paulo BS, Wilson DM, Liu DY, Morehouse NJ, " +
                "Waterworth S, Barkei J, Gray CA, Kwan JC " +
                "<em>et al.</em> " +
                "<a href=\"https://doi.org/10.1039/D4SC00825A\" target=\"_blank\" rel=\"noopener\">" +
                "Discovery of the polyketide lagriamide B by integrated genome mining, " +
                "isotopic labeling, and untargeted metabolomics.</a> " +
                "<em>Chem Sci</em> 15(19):7126\u20137139 (2024). " +
                "(Lagriamide B discovered by genome mining a cultured relative; " +
                "the same template extended to the next molecule.)</li>" +
                "</ul>",
            pythonSnippet:
                "from dash import Dash, html\n" +
                "from dash_seqviz import SeqViz\n" +
                "import requests\n" +
                "\n" +
                "# Lagriamide cluster (Burkholderia gladioli Lv-StB, 2018)\n" +
                "gb = requests.get(\n" +
                "    \"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi\",\n" +
                "    params={\"db\": \"nuccore\", \"id\": \"MH171092.1\",\n" +
                "            \"rettype\": \"gb\", \"retmode\": \"text\",\n" +
                "            \"tool\": \"natural-products\", \"email\": \"you@lab.org\"},\n" +
                "    timeout=10,\n" +
                ").text\n" +
                "\n" +
                "app = Dash(__name__)\n" +
                "app.layout = html.Div([\n" +
                "    SeqViz(\n" +
                "        id=\"lagriamide\",\n" +
                "        name=\"Lagriamide cluster (MH171092.1)\",\n" +
                "        file=gb,\n" +
                "        viewer=\"both\",\n" +
                "        zoom={\"linear\": 1},\n" +
                "        style={\"height\": \"560px\", \"width\": \"100%\"},\n" +
                "    )\n" +
                "])\n" +
                "\n" +
                "if __name__ == \"__main__\":\n" +
                "    app.run(debug=True)\n"
        },
        {
            id: "lasonolide-cluster",
            title: "Lasonolide A: an NCI anticancer lead tied to its producer via metagenomics",
            summary: "An NCI-60 orphan, finally given a producer.",
            category: "industrial",
            tags: ["natural-product", "PKS", "trans-AT", "symbiont", "pharma", "anticancer"],
            complexity: 5,
            accession: "ON409580.1",
            featured: true,
            compound: {
                name: "Lasonolide A",
                smiles: "C[C@@H]1[C@H](C[C@@H]2C/C=C/C=C/C(=O)O[C@@H]3C[C@@H](/C=C/C/C=C/C(=C\\[C@H]1O2)/C)O[C@H]([C@]3(C)CO)C/C=C\\C[C@H](C(=O)OCC(=C)CCC(C)C)O)O",
                description: "A macrolactone polyketide from deep-water Forcepia sp. sponges. Sub-nanomolar cytotoxic on the NCI-60 panel with an activity fingerprint unlike any other compound in the COMPARE database, a signature usually reserved for novel mechanisms of action. The producer is an uncultured Verrucomicrobium, Candidatus Thermopylae lasonolidus."
            },
            seqvizProps: {
                viewer: "both",
                zoom: { linear: 1 },
                style: { height: "560px", width: "100%" }
            },
            narrative:
                "<figure class=\"organism-figure figure-right\">" +
                    "<img src=\"./assets/images/forcepia-sponge.jpg\" " +
                         "alt=\"A Forcepia sp. sponge photographed on the seafloor " +
                              "several hundred metres below the Caribbean surface, " +
                              "during an NCI-affiliated deep-sea collection expedition.\">" +
                    "<figcaption><em>Forcepia</em> sp., a deep-water Caribbean " +
                    "demosponge. The NCI-affiliated expedition photograph shows " +
                    "an individual specimen at collection depth. Image: NOAA " +
                    "Ocean Explorer / Wikimedia Commons (public domain).</figcaption>" +
                "</figure>" +
                "<p>Deep-water sponges of the genus " +
                "<span class=\"info-term\" data-term=\"forcepia-sponge\">" +
                "<em>Forcepia</em></span> live several hundred metres below the " +
                "surface on Caribbean carbonate banks. They have been on the US " +
                "National Cancer Institute's radar since the 1980s because their " +
                "extracts carry <strong>lasonolide A</strong>, a macrolactone " +
                "polyketide that kills cancer cells at sub-nanomolar concentrations. " +
                "What has kept lasonolide interesting long after the initial " +
                "excitement is the way it fails to match anything else: in the " +
                "NCI's COMPARE algorithm, which correlates a compound's activity " +
                "fingerprint across sixty tumour cell lines to the fingerprints of " +
                "known mechanisms, lasonolide is an orphan. No existing drug behaves " +
                "quite like it. That is usually read as a signal of a mechanism no one " +
                "has seen.</p>" +
                "<figure class=\"compound-figure figure-left\">" +
                    "<img src=\"./assets/molecules/lasonolide-a.svg\" " +
                         "alt=\"Skeletal structure of lasonolide A, a macrolactone " +
                              "polyketide with two fused tetrahydropyran rings, a long " +
                              "unsaturated side chain, and a conjugated diene in the " +
                              "macrocycle.\">" +
                    "<figcaption>Lasonolide A. Two fused tetrahydropyran rings, an " +
                    "extended unsaturated side chain, and a conjugated diene embedded " +
                    "in the 20-membered macrolactone.</figcaption>" +
                "</figure>" +
                "<p>The problem, as with so many marine natural products, was supply. " +
                "<em>Forcepia</em> yields lasonolide at parts-per-million and lives at " +
                "a depth that rules out ordinary collection. Total synthesis is " +
                "available but not scalable. And the actual biosynthetic producer, " +
                "assumed for years to be one of the sponge's many bacterial tenants, " +
                "had never been identified, let alone cultured.</p>" +
                "<p>A 2022 study closed the biosynthesis end of the problem using " +
                "<span class=\"info-term\" data-term=\"metagenomics\">" +
                "genome-resolved metagenomics</span>. Shotgun sequencing the sponge gave " +
                "total DNA from every organism in it; computational binning recovered " +
                "discrete genomes. One of them was a previously-unknown member of the " +
                "<em>Verrucomicrobia</em>, named " +
                "<span class=\"info-term\" data-term=\"thermopylae-lasonolidus\">" +
                "<em>Candidatus</em> Thermopylae lasonolidus</span>, and its draft " +
                "genome carried not one but <em>three</em> near-identical copies of " +
                "a ~98 kilobase " +
                "<span class=\"info-term\" data-term=\"trans-at-pks\">" +
                "trans-AT polyketide synthase</span> locus whose predicted chemistry " +
                "matched lasonolide A module by module.</p>" +
                "<div class=\"inline-viewer\" " +
                     "data-accession=\"ON409580.1\" " +
                     "data-viewer=\"circular\" " +
                     "data-height=\"420px\" " +
                     "data-annotation-min-length=\"8000\" " +
                     "data-caption=\"One of the three near-identical copies of the " +
                                    "las cluster pulled from the Ca. T. lasonolidus bin. " +
                                    "The producer's genome devotes roughly 300 kb, " +
                                    "in triplicate, to this single molecule.\"></div>" +
                "<p>Three copies of a ~100 kilobase cluster in one small bacterial " +
                "genome is an unusual amount of redundancy. It could be a dosage " +
                "play, boosting titer in an obligate symbiont that cannot scale by " +
                "dividing faster. It could be insurance against the gene decay that " +
                "tends to chew away at reduced symbiont genomes over evolutionary " +
                "time. Either way, the arithmetic is striking. Lasonolide is the " +
                "extension of the " +
                "<a href=\"./example.html?id=pederin-cluster\">pederin</a> and " +
                "<a href=\"./example.html?id=bryostatin-cluster\">bryostatin</a> " +
                "metagenomic template into a deeper water column and a stranger host " +
                "phylogeny, and it was the triplicated locus, not the single-copy one, " +
                "that the sequencer finally caught.</p>" +
                "<h3>References</h3>" +
                "<ul>" +
                "<li>Uppal S, Metz JL, Xavier RKM, Nepal KK, Xu D, Wang G, Kwan JC. " +
                "<a href=\"https://pubmed.ncbi.nlm.nih.gov/36125273/\" target=\"_blank\" rel=\"noopener\">" +
                "Uncovering lasonolide A biosynthesis using genome-resolved " +
                "metagenomics.</a> " +
                "<em>mBio</em> 13(5):e0152422 (2022). PMID: 36125273. " +
                "(Identifies <em>Ca.</em> Thermopylae lasonolidus as the producer and " +
                "characterises the <em>las</em> cluster.)</li>" +
                "<li>Miller IJ, Rees ER, Ross J, Miller I, Baxa J, Lopera J, Kerby RL, " +
                "Rey FE, Kwan JC. " +
                "<a href=\"https://pubmed.ncbi.nlm.nih.gov/30838416/\" target=\"_blank\" rel=\"noopener\">" +
                "Autometa: automated extraction of microbial genomes from individual " +
                "shotgun metagenomes.</a> " +
                "<em>Nucleic Acids Res</em> 47(10):e57 (2019). PMID: 30838416. " +
                "(The binning pipeline used to pull the producer out of the " +
                "<em>Forcepia</em> sponge metagenome.)</li>" +
                "</ul>",
            pythonSnippet:
                "from dash import Dash, html\n" +
                "from dash_seqviz import SeqViz\n" +
                "import requests\n" +
                "\n" +
                "# Lasonolide A cluster (Ca. Thermopylae lasonolidus, 2022)\n" +
                "gb = requests.get(\n" +
                "    \"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi\",\n" +
                "    params={\"db\": \"nuccore\", \"id\": \"ON409580.1\",\n" +
                "            \"rettype\": \"gb\", \"retmode\": \"text\",\n" +
                "            \"tool\": \"natural-products\", \"email\": \"you@lab.org\"},\n" +
                "    timeout=10,\n" +
                ").text\n" +
                "\n" +
                "app = Dash(__name__)\n" +
                "app.layout = html.Div([\n" +
                "    SeqViz(\n" +
                "        id=\"lasonolide\",\n" +
                "        name=\"Lasonolide A cluster (ON409580.1)\",\n" +
                "        file=gb,\n" +
                "        viewer=\"both\",\n" +
                "        zoom={\"linear\": 1},\n" +
                "        style={\"height\": \"560px\", \"width\": \"100%\"},\n" +
                "    )\n" +
                "])\n" +
                "\n" +
                "if __name__ == \"__main__\":\n" +
                "    app.run(debug=True)\n"
        },
        // ------------------------------------------------------------------
        // Plant natural products: taxol (Pacific yew anticancer), camptothecin
        // (Chinese happy tree, topoisomerase-I inhibitor ancestor of topotecan
        // / irinotecan), silybin (milk thistle hepatoprotectant). Each is
        // represented by the pivotal cloned gene rather than a full BGC, since
        // plant NP biosynthesis is scattered across chromosomes rather than
        // clustered bacterial-style.
        // ------------------------------------------------------------------
        {
            id: "taxadiene-synthase",
            title: "Taxadiene synthase: the committed step of Taxol biosynthesis",
            summary: "Thirteen thousand trees for eight kilograms of drug.",
            category: "academic",
            tags: ["natural-product", "terpene-synthase", "plant", "pharma", "anticancer", "graduate"],
            complexity: 3,
            accession: "U48796.1",
            compound: {
                name: "Paclitaxel (Taxol)",
                smiles: "CC1=C2[C@H](C(=O)[C@@]3([C@H](C[C@@H]4[C@]([C@H]3[C@@H]([C@@](C2(C)C)(C[C@@H]1OC(=O)[C@@H]([C@H](C5=CC=CC=C5)NC(=O)C6=CC=CC=C6)O)O)OC(=O)C7=CC=CC=C7)(CO4)OC(=O)C)O)C)OC(=O)C",
                description: "A microtubule-stabilising diterpenoid from the bark of the Pacific yew (Taxus brevifolia); now approved for ovarian, breast, lung, pancreatic, Kaposi sarcoma, and several other cancers. Taxadiene synthase (TDC1) catalyses the first committed step of its biosynthesis, the cyclisation of geranylgeranyl diphosphate into taxa-4(5),11(12)-diene."
            },
            seqvizProps: {
                viewer: "both",
                zoom: { linear: 1 },
                style: { height: "560px", width: "100%" }
            },
            narrative:
                "<figure class=\"organism-figure figure-right\">" +
                    "<img src=\"./assets/images/taxus-brevifolia.jpg\" " +
                         "alt=\"Foliage and red aril-covered fruit of Taxus brevifolia, " +
                              "the Pacific yew, a slow-growing coniferous tree of the " +
                              "Pacific Northwest.\">" +
                    "<figcaption><em>Taxus brevifolia</em>, the Pacific yew. A slow- " +
                    "growing understory tree of the Pacific Northwest whose bark was " +
                    "the first source of paclitaxel. Image: Jason Hollinger / Wikimedia " +
                    "Commons (CC BY 2.0).</figcaption>" +
                "</figure>" +
                "<p>The story of <strong>paclitaxel</strong> is the story of how a " +
                "single natural product reset the expectations of an entire field. " +
                "Isolated in 1971 from the bark of the Pacific yew, the compound turned " +
                "out to bind microtubules in a way no previous drug did: stabilising " +
                "rather than disrupting them, locking mitotic spindles in place, and " +
                "killing dividing cancer cells through an unusual mechanism of action. " +
                "By the late 1980s the US National Cancer Institute had it in clinical " +
                "trials for refractory ovarian cancer with striking results.</p>" +
                "<figure class=\"compound-figure figure-left\">" +
                    "<img src=\"./assets/molecules/paclitaxel-taxol.svg\" " +
                         "alt=\"Skeletal structure of paclitaxel, with its fused four-ring " +
                              "taxane core and a benzamide-substituted side chain " +
                              "attached at C13.\">" +
                    "<figcaption>Paclitaxel. The fused taxane core was the target of " +
                    "biosynthesis efforts; the C13 side chain was the target of " +
                    "chemistry. Image: Wikimedia Commons (public domain).</figcaption>" +
                "</figure>" +
                "<p>The problem was where to get it. The Pacific yew is a slow- " +
                "growing understory tree; paclitaxel lives at parts-per-million in " +
                "its bark; and harvesting the bark kills the tree. A 1991 NCI order " +
                "to the US Forest Service was for three quarters of a million pounds " +
                "of yew bark, about 340 tonnes, estimated to require the felling of " +
                "roughly 150,000 mature trees. And clinical demand projected to " +
                "require much more. Conservation alarm about the " +
                "yew grew in parallel with patient demand, and the pharmaceutical " +
                "community, for the first time in recent memory, had to reckon with " +
                "the idea that its supply chain was ecologically unsustainable. The " +
                "Supply Problem, as pharmacognosy came to call it, became the canonical " +
                "case for needing biosynthetic access to complex natural products.</p>" +
                "<p>The biosynthetic door opened in 1996 with the cloning of " +
                "<strong>taxadiene synthase</strong> (TDC1), the first committed step " +
                "of the pathway. TDC1 is a class-I " +
                "<span class=\"info-term\" data-term=\"terpene-synthase\">" +
                "terpene synthase</span> that cyclises geranylgeranyl diphosphate into " +
                "taxa-4(5),11(12)-diene, the scaffold that a dozen downstream " +
                "tailoring enzymes then decorate into paclitaxel. The cDNA (GenBank " +
                "<code>U48796</code>) has since been the starting point for " +
                "<em>E. coli</em> and yeast fermentation platforms that produce " +
                "taxadiene at gram-per-litre scale, and was one of the anchors used " +
                "in the 2021 chromosome-scale assembly of the <em>Taxus</em> genome.</p>" +
                "<div class=\"inline-viewer\" " +
                     "data-accession=\"U48796.1\" " +
                     "data-viewer=\"linear\" " +
                     "data-zoom=\"45\" " +
                     "data-show-translations=\"true\" " +
                     "data-height=\"360px\" " +
                     "data-caption=\"The TDC1 cDNA with translation turned on. A class-I " +
                                    "terpene synthase of ~860 residues; the conserved " +
                                    "aspartate-rich DDxxD motif that coordinates the " +
                                    "catalytic Mg2+ sits near residue 613.\"></div>" +
                "<p>Taxol is not a cluster story. Plant natural-product genes do not " +
                "sit next to each other the way bacterial " +
                "<a href=\"./example.html?id=bryostatin-cluster\">bryostatin</a> or " +
                "<a href=\"./example.html?id=pederin-cluster\">pederin</a> genes do; " +
                "they are scattered across large, repetitive gymnosperm chromosomes. " +
                "The cDNA shown here, a single 2.7 kb mRNA for a single enzyme, is " +
                "one piece of a biosynthesis that proceeds through roughly nineteen " +
                "steps across as many genes. But it is the piece that first turned " +
                "taxol from a harvesting problem into a sequence on a screen, which " +
                "is what every biosynthetic engineering project since has needed to " +
                "start with.</p>" +
                "<h3>References</h3>" +
                "<ul>" +
                "<li>Wildung MR, Croteau R. " +
                "<a href=\"https://pubmed.ncbi.nlm.nih.gov/8621577/\" target=\"_blank\" rel=\"noopener\">" +
                "A cDNA clone for taxadiene synthase, the diterpene cyclase that " +
                "catalyzes the committed step of taxol biosynthesis.</a> " +
                "<em>J Biol Chem</em> 271(16):9201-4 (1996). PMID: 8621577.</li>" +
                "<li>Cech NB, Oberlies NH. " +
                "<a href=\"https://pubmed.ncbi.nlm.nih.gov/37232025/\" target=\"_blank\" rel=\"noopener\">" +
                "From plant to cancer drug: lessons learned from the discovery of taxol.</a> " +
                "<em>Nat Prod Rep</em> 40(7):1153-1157 (2023). PMID: 37232025. " +
                "(Retrospective on how a plant natural product became a cancer drug, " +
                "and what the Supply Problem taught the field about biosynthesis.)</li>" +
                "<li>Wani MC, Taylor HL, Wall ME, Coggon P, McPhail AT. " +
                "<a href=\"https://pubmed.ncbi.nlm.nih.gov/5553076/\" target=\"_blank\" rel=\"noopener\">" +
                "Plant antitumor agents. VI. The isolation and structure of taxol, a " +
                "novel antileukemic and antitumor agent from Taxus brevifolia.</a> " +
                "<em>J Am Chem Soc</em> 93(9):2325-7 (1971). PMID: 5553076. " +
                "(The foundational isolation and structure paper for paclitaxel.)</li>" +
                "</ul>",
            pythonSnippet:
                "from dash import Dash, html\n" +
                "from dash_seqviz import SeqViz\n" +
                "import requests\n" +
                "\n" +
                "# Taxadiene synthase cDNA (Taxus brevifolia, 1996)\n" +
                "gb = requests.get(\n" +
                "    \"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi\",\n" +
                "    params={\"db\": \"nuccore\", \"id\": \"U48796.1\",\n" +
                "            \"rettype\": \"gb\", \"retmode\": \"text\",\n" +
                "            \"tool\": \"natural-products\", \"email\": \"you@lab.org\"},\n" +
                "    timeout=10,\n" +
                ").text\n" +
                "\n" +
                "app = Dash(__name__)\n" +
                "app.layout = html.Div([\n" +
                "    SeqViz(\n" +
                "        id=\"taxadiene-synthase\",\n" +
                "        name=\"Taxadiene synthase (U48796.1)\",\n" +
                "        file=gb,\n" +
                "        viewer=\"both\",\n" +
                "        zoom={\"linear\": 1},\n" +
                "        style={\"height\": \"560px\", \"width\": \"100%\"},\n" +
                "    )\n" +
                "])\n" +
                "\n" +
                "if __name__ == \"__main__\":\n" +
                "    app.run(debug=True)\n"
        },
        {
            id: "strictosidine-synthase-cpt",
            title: "Strictosidine synthase: gateway enzyme to camptothecin and the TIA alkaloids",
            summary: "One enzyme, three thousand alkaloids.",
            category: "academic",
            tags: ["natural-product", "plant", "alkaloid", "pharma", "anticancer"],
            complexity: 3,
            accession: "JF508375.1",
            compound: {
                name: "Camptothecin",
                smiles: "CC[C@@]1(C2=C(COC1=O)C(=O)N3CC4=CC5=CC=CC=C5N=C4C3=C2)O",
                description: "A pentacyclic quinoline alkaloid from the Chinese happy tree (Camptotheca acuminata). Isolated in 1966, five years before paclitaxel, at the same research institute. Too toxic for the clinic in its native form, but its semi-synthetic derivatives topotecan and irinotecan are topoisomerase-I inhibitors used worldwide against ovarian, colorectal, cervical, and small-cell lung cancer."
            },
            seqvizProps: {
                viewer: "both",
                zoom: { linear: 1 },
                style: { height: "560px", width: "100%" }
            },
            narrative:
                "<figure class=\"organism-figure figure-right\">" +
                    "<img src=\"./assets/images/camptotheca-acuminata.jpg\" " +
                         "alt=\"Trunk of Camptotheca acuminata, the Chinese happy tree, " +
                              "a deciduous tree native to southern China.\">" +
                    "<figcaption><em>Camptotheca acuminata</em>, the Chinese happy " +
                    "tree. Native to southern China; its bark and leaves were the " +
                    "original source of camptothecin. Image: Geographer / Wikimedia " +
                    "Commons (CC BY-SA 3.0).</figcaption>" +
                "</figure>" +
                "<p><strong>Camptothecin</strong> was isolated in 1966 from the bark " +
                "and leaves of the Chinese happy tree, <em>Camptotheca acuminata</em>, " +
                "as part of the same mid-century natural-product screening programme " +
                "that would later yield " +
                "<a href=\"./example.html?id=taxadiene-synthase\">paclitaxel</a>. The " +
                "compound turned out to be the first known inhibitor of topoisomerase " +
                "I, the enzyme that relieves DNA torsional stress during replication " +
                "and transcription. Early clinical trials of camptothecin itself " +
                "failed on toxicity, but the two semi-synthetic derivatives the " +
                "chemistry eventually produced, <strong>topotecan</strong> and " +
                "<strong>irinotecan</strong>, are still clinical mainstays against " +
                "ovarian, colorectal, cervical, and small-cell lung cancer.</p>" +
                "<figure class=\"compound-figure figure-left\">" +
                    "<img src=\"./assets/molecules/camptothecin.svg\" " +
                         "alt=\"Skeletal structure of camptothecin, a planar pentacyclic " +
                              "quinoline alkaloid with a chiral alpha-hydroxy-delta-lactone.\">" +
                    "<figcaption>Camptothecin. The pentacyclic core intercalates into " +
                    "topoisomerase-I cleavage complexes; the E-ring alpha-hydroxy " +
                    "lactone is the pharmacophore modified in topotecan and irinotecan. " +
                    "Image: Wikimedia Commons (public domain).</figcaption>" +
                "</figure>" +
                "<p>Camptothecin is also a member of one of the largest natural-" +
                "product families in biology. The <strong>terpenoid indole alkaloids</strong> " +
                "(TIAs) are a class of roughly three thousand plant secondary " +
                "metabolites, and along with camptothecin it includes vincristine " +
                "and vinblastine (the anticancer alkaloids of " +
                "<span class=\"info-term\" data-term=\"catharanthus-roseus\">" +
                "Madagascar periwinkle</span>), strychnine, quinine, and reserpine. " +
                "Every one of these molecules passes through the same gateway: a " +
                "Pictet-Spengler condensation of tryptamine and secologanin that " +
                "forms strictosidine, catalysed by <strong>strictosidine synthase</strong> " +
                "(STR).</p>" +
                "<p>The CDS shown here is <code>JF508375</code>, the " +
                "<em>Camptotheca acuminata</em> strictosidine synthase (CaPSTR), a " +
                "compact plant STR that phylogenetic analyses place among the " +
                "TIA-pathway STRs of alkaloid-producing plants including " +
                "<em>Catharanthus roseus</em>. Plant natural-product pathways are " +
                "usually scattered across multiple chromosomes rather than clustered, " +
                "and this single enzyme is the upstream fork from which three " +
                "thousand related molecules downstream all diverge.</p>" +
                "<div class=\"inline-viewer\" " +
                     "data-accession=\"JF508375.1\" " +
                     "data-viewer=\"linear\" " +
                     "data-zoom=\"60\" " +
                     "data-show-translations=\"true\" " +
                     "data-height=\"340px\" " +
                     "data-caption=\"The CaPSTR cDNA with translation enabled. The mature " +
                                    "enzyme is a compact six-bladed beta-propeller; the " +
                                    "catalytic glutamate that protonates the iminium " +
                                    "intermediate sits around residue 309.\"></div>" +
                "<p>The contrast with the cluster examples elsewhere in the gallery " +
                "is the point. <a href=\"./example.html?id=bryostatin-cluster\">" +
                "Bryostatin</a> and <a href=\"./example.html?id=lagriamide-cluster\">" +
                "lagriamide</a> spend tens of kilobases on single compounds; " +
                "camptothecin's gateway enzyme spends roughly one. What the plant " +
                "has that the bacterium does not is the rest of the genome, and " +
                "over three thousand variations on the strictosidine theme are " +
                "distributed across it.</p>" +
                "<h3>References</h3>" +
                "<ul>" +
                "<li>Wall ME, Wani MC, Cook CE, Palmer KH, McPhail AT, Sim GA. " +
                "<a href=\"https://pubs.acs.org/doi/10.1021/ja00968a057\" target=\"_blank\" rel=\"noopener\">" +
                "Plant antitumor agents. I. The isolation and structure of camptothecin, " +
                "a novel alkaloidal leukemia and tumor inhibitor from Camptotheca " +
                "acuminata.</a> " +
                "<em>J Am Chem Soc</em> 88(16):3888-3890 (1966). " +
                "(The foundational isolation and structure paper for camptothecin.)</li>" +
                "<li>Sun Y, Luo H, Li Y, Sun C, Song J, Niu Y, Zhu Y, Dong L, Lv A, " +
                "Tramontano E, Chen S. " +
                "<a href=\"https://pubmed.ncbi.nlm.nih.gov/22035094/\" target=\"_blank\" rel=\"noopener\">" +
                "Pyrosequencing of the Camptotheca acuminata transcriptome reveals " +
                "putative genes involved in camptothecin biosynthesis and transport.</a> " +
                "<em>BMC Genomics</em> 12:533 (2011). PMID: 22035094. " +
                "(Transcriptome-level characterisation that yielded the CaPSTR " +
                "accession used here.)</li>" +
                "</ul>",
            pythonSnippet:
                "from dash import Dash, html\n" +
                "from dash_seqviz import SeqViz\n" +
                "import requests\n" +
                "\n" +
                "# Camptotheca strictosidine synthase (CaPSTR)\n" +
                "gb = requests.get(\n" +
                "    \"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi\",\n" +
                "    params={\"db\": \"nuccore\", \"id\": \"JF508375.1\",\n" +
                "            \"rettype\": \"gb\", \"retmode\": \"text\",\n" +
                "            \"tool\": \"natural-products\", \"email\": \"you@lab.org\"},\n" +
                "    timeout=10,\n" +
                ").text\n" +
                "\n" +
                "app = Dash(__name__)\n" +
                "app.layout = html.Div([\n" +
                "    SeqViz(\n" +
                "        id=\"cpt-str\",\n" +
                "        name=\"Camptotheca STR (JF508375.1)\",\n" +
                "        file=gb,\n" +
                "        viewer=\"both\",\n" +
                "        zoom={\"linear\": 1},\n" +
                "        style={\"height\": \"560px\", \"width\": \"100%\"},\n" +
                "    )\n" +
                "])\n" +
                "\n" +
                "if __name__ == \"__main__\":\n" +
                "    app.run(debug=True)\n"
        },
        {
            id: "silybin-chs3",
            title: "Silybum marianum CHS3: gateway to the silymarin flavonolignans",
            summary: "From Dioscorides to hepatocellular carcinoma trials.",
            category: "academic",
            tags: ["natural-product", "plant", "type-III-PKS", "flavonoid", "hepatoprotective"],
            complexity: 3,
            accession: "PP965198.1",
            compound: {
                name: "Silybin A",
                smiles: "COC1=C(C=CC(=C1)[C@@H]2[C@H](OC3=C(O2)C=C(C=C3)[C@@H]4[C@H](C(=O)C5=C(C=C(C=C5O4)O)O)O)CO)O",
                description: "A flavonolignan from milk thistle (Silybum marianum) fruits. The principal active component of silymarin, used as a hepatoprotective agent since antiquity and currently in clinical trials against hepatocellular carcinoma. Formed by peroxidase-mediated oxidative coupling of taxifolin (from the flavonoid pathway) with coniferyl alcohol (from the monolignol pathway)."
            },
            seqvizProps: {
                viewer: "both",
                zoom: { linear: 1 },
                style: { height: "560px", width: "100%" }
            },
            narrative:
                "<figure class=\"organism-figure figure-right\">" +
                    "<img src=\"./assets/images/silybum-marianum.jpg\" " +
                         "alt=\"A purple flower head of Silybum marianum, milk thistle, " +
                              "with its characteristic spiny bracts.\">" +
                    "<figcaption><em>Silybum marianum</em>, milk thistle. The plant " +
                    "of Dioscorides, the plant of European grandmothers, and the " +
                    "source of silymarin. Image: Wikimedia Commons (CC BY-SA 3.0)." +
                    "</figcaption>" +
                "</figure>" +
                "<p>Milk thistle shows up in Dioscorides's <em>De Materia Medica</em> " +
                "in the first century AD, recommended for liver complaints. The plant " +
                "appears in European herbal traditions continuously from that point " +
                "forward, in Culpeper and Gerard and Linnaeus, and it kept its " +
                "reputation through the twentieth century as a hepatoprotective " +
                "botanical. The 1960s isolated the chemistry behind the reputation: " +
                "<strong>silymarin</strong>, a mixture of seven flavonolignans " +
                "extractable from the seed, dominated by <strong>silybin</strong> " +
                "(itself a roughly 1:1 mix of diastereomers silybin A and silybin " +
                "B).</p>" +
                "<figure class=\"compound-figure figure-left\">" +
                    "<img src=\"./assets/molecules/silybin-a.svg\" " +
                         "alt=\"Skeletal structure of silybin A, a flavonolignan built " +
                              "from a taxifolin flavanonol linked through a 1,4-dioxane " +
                              "to a coniferyl-alcohol-derived aryl unit.\">" +
                    "<figcaption>Silybin A. The flavanonol on the left derives from " +
                    "the flavonoid pathway; the benzodioxane ring in the middle is " +
                    "the oxidative-coupling handiwork linking it to the monolignol " +
                    "on the right. Image: Wikimedia Commons (public domain).</figcaption>" +
                "</figure>" +
                "<p>Silybin is a biosynthetic hybrid, and that is what makes it " +
                "unusual among plant natural products. Most flavonoids are purely " +
                "flavonoid, most lignans are purely phenylpropanoid, but silybin is " +
                "assembled from one of each. A peroxidase in the developing milk " +
                "thistle seed oxidises two substrates at once: <strong>taxifolin</strong>, " +
                "a dihydroflavonol from the flavonoid pathway, and <strong>coniferyl " +
                "alcohol</strong>, a monolignol from the phenylpropanoid pathway. The " +
                "resulting radicals couple, the taxifolin phenol adds across coniferyl " +
                "alcohol's quinone methide, and a benzodioxane closes to give the " +
                "finished flavonolignan.</p>" +
                "<p>The gene shown here sits far upstream of that coupling. " +
                "<strong>Chalcone synthase 3</strong> (CHS3) is a type-III " +
                "<span class=\"info-term\" data-term=\"polyketide-synthase\">" +
                "polyketide synthase</span>, a small homodimeric enzyme that condenses " +
                "one 4-coumaroyl-CoA with three malonyl-CoAs to give naringenin " +
                "chalcone, the precursor to every flavonoid in the plant. A few " +
                "enzymatic steps later naringenin chalcone has become taxifolin, and " +
                "taxifolin is what ends up as the flavanonol half of silybin. CHS3 " +
                "is, in other words, the gatekeeper of the entire flavonoid half of " +
                "the silybin biosynthesis.</p>" +
                "<div class=\"inline-viewer\" " +
                     "data-accession=\"PP965198.1\" " +
                     "data-viewer=\"linear\" " +
                     "data-zoom=\"60\" " +
                     "data-show-translations=\"true\" " +
                     "data-height=\"340px\" " +
                     "data-caption=\"The CHS3 cDNA with translation enabled. Type-III " +
                                    "PKSs use a compact ~390-residue fold with a Cys- " +
                                    "His-Asn catalytic triad; the catalytic cysteine " +
                                    "that anchors the growing tetraketide sits near " +
                                    "residue 164.\"></div>" +
                "<p>Plant polyketide biosynthesis is a different shape of thing from " +
                "the bacterial symbiont systems elsewhere in this gallery. " +
                "<a href=\"./example.html?id=bryostatin-cluster\">Bryostatin</a>'s " +
                "megasynthases run to sixteen kilobases of one open reading frame; " +
                "CHS3 fits inside a thousand bases and does its job as a small " +
                "homodimer. What it lacks in machinery it makes up for in ubiquity: " +
                "essentially every flavonoid in the plant kingdom, silybin included, " +
                "passes through a CHS at some point on its way to the tissues where " +
                "it accumulates.</p>" +
                "<h3>References</h3>" +
                "<ul>" +
                "<li>Althagafy HS, Meza-Avi\u00f1a ME, Oberlies NH, Croatt MP. " +
                "<a href=\"https://pubmed.ncbi.nlm.nih.gov/23600740/\" target=\"_blank\" rel=\"noopener\">" +
                "Mechanistic study of the biomimetic synthesis of flavonolignan " +
                "diastereoisomers in milk thistle.</a> " +
                "<em>J Org Chem</em> 78(15):7594\u20137600 (2013). PMID: 23600740. " +
                "(Biomimetic synthesis that replicates the oxidative-coupling " +
                "stereochemistry observed in the plant.)</li>" +
                "<li>Abenavoli L, Izzo AA, Milic N, Cicala C, Santini A, Capasso R. " +
                "<a href=\"https://pubmed.ncbi.nlm.nih.gov/29936283/\" target=\"_blank\" rel=\"noopener\">" +
                "Milk thistle (Silybum marianum): A concise overview on its chemistry, " +
                "pharmacological, and nutraceutical uses in liver diseases.</a> " +
                "<em>Phytother Res</em> 32(11):2202\u20132213 (2018). PMID: 29936283.</li>" +
                "<li>Lv Y, Gao S, Xu S, Du G, Zhou J, Chen J. " +
                "<a href=\"https://pubmed.ncbi.nlm.nih.gov/28990236/\" target=\"_blank\" rel=\"noopener\">" +
                "Spatial organization of silybin biosynthesis in milk thistle " +
                "[Silybum marianum (L.) Gaertn].</a> " +
                "<em>Plant J</em> 92(6):995\u20131004 (2017). PMID: 28990236. " +
                "(Localises the flavonoid and monolignol branches of silybin " +
                "biosynthesis within the milk thistle fruit.)</li>" +
                "</ul>",
            pythonSnippet:
                "from dash import Dash, html\n" +
                "from dash_seqviz import SeqViz\n" +
                "import requests\n" +
                "\n" +
                "# Silybum marianum chalcone synthase 3\n" +
                "gb = requests.get(\n" +
                "    \"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi\",\n" +
                "    params={\"db\": \"nuccore\", \"id\": \"PP965198.1\",\n" +
                "            \"rettype\": \"gb\", \"retmode\": \"text\",\n" +
                "            \"tool\": \"natural-products\", \"email\": \"you@lab.org\"},\n" +
                "    timeout=10,\n" +
                ").text\n" +
                "\n" +
                "app = Dash(__name__)\n" +
                "app.layout = html.Div([\n" +
                "    SeqViz(\n" +
                "        id=\"silybin-chs\",\n" +
                "        name=\"Silybum CHS3 (PP965198.1)\",\n" +
                "        file=gb,\n" +
                "        viewer=\"both\",\n" +
                "        zoom={\"linear\": 1},\n" +
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
