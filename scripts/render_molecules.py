"""
Render curated pathway molecules as aligned 2D SVGs.

Usage:
    mamba run -n dash-seqviz python scripts/render_molecules.py

Writes one SVG per compound to docs/assets/molecules/<slug>.svg, where
<slug> matches the client-side slugify(node.name) in docs/example.html
(lowercase, greek → roman, non-alphanumeric → '-').

Pathways with a clean shared substructure are rendered with that
template locked in — every molecule in the chain has the scaffold at
the same coordinates, so the biosynthetic transformation "pops" when
viewed left-to-right (e.g. the indole ring across the violacein
series).

Pathways that don't share a clean single template (polyene carotenoids
grow/desaturate/cyclize; prenyl-PP pathways change connectivity; RiPP
peptides reshape the whole backbone) fall back to CoordGen-only.
That's still much cleaner than the browser-side SmilesDrawer fallback,
and the eye naturally follows the enzyme annotations on each arrow.

This file is the source of truth for the pre-rendered SVGs. Keep the
SMILES here in sync with docs/data/examples.js (the site still ships
the SMILES in the data so SmilesDrawer can render if an SVG happens
to be missing).
"""

from __future__ import annotations

import os
import re
from dataclasses import dataclass
from typing import List, Optional

from rdkit import Chem
from rdkit.Chem import AllChem, rdCoordGen
from rdkit.Chem.Draw import rdMolDraw2D


@dataclass
class Node:
    name: str
    smiles: str


@dataclass
class Pathway:
    slug: str
    nodes: List[Node]
    # Optional SMILES fragment every node should be aligned against.
    # When None, each node is laid out independently with CoordGen.
    template_smiles: Optional[str] = None


# ---------------------------------------------------------------------------
# Violacein (Chromobacterium violaceum vioA-E). Every intermediate
# carries at least one indole, so anchoring to an indole scaffold puts
# the ring at the same coordinates in every drawing.
# ---------------------------------------------------------------------------

INDOLE_TEMPLATE_SMILES = "c1ccc2[nH]ccc2c1"

VIOLACEIN_NODES: List[Node] = [
    Node("L-Tryptophan", "N[C@@H](Cc1c[nH]c2ccccc12)C(=O)O"),
    Node("Indole-3-pyruvic acid imine", "OC(=O)C(=N)Cc1c[nH]c2ccccc12"),
    Node(
        "Protodeoxyviolaceinic acid",
        "OC(=O)C1=C(Cc2c[nH]c3ccccc23)NC(Cc2c[nH]c3ccccc23)=C1",
    ),
    Node(
        "Protodeoxyviolacein",
        "O=C1NC(=Cc2c[nH]c3ccccc23)C1=Cc1c[nH]c2ccccc12",
    ),
    Node(
        "Protoviolacein",
        "O=C1NC(=Cc2c[nH]c3ccccc23)C1=Cc1c[nH]c2ccc(O)cc12",
    ),
    # Violacein canonical keto form (PubChem CID 11053).
    Node(
        "Violacein",
        "O=C1Nc2ccccc2/C1=C1\\C=C(c2c[nH]c3cc(O)ccc23)NC1=O",
    ),
]


# ---------------------------------------------------------------------------
# Carotenoid cluster (Erwinia uredovora crtE, crtB, crtI, crtY, crtZ).
# FPP → GGPP → phytoene → lycopene → β-carotene → zeaxanthin. Polyene
# connectivity and endpoint geometry change at every step, so we let
# CoordGen lay each one out cleanly rather than forcing a single
# template to fit both linear polyenes and β-ionone bicyclics.
# ---------------------------------------------------------------------------

CAROTENOID_NODES: List[Node] = [
    Node(
        "Farnesyl pyrophosphate",
        "CC(C)=CCC/C(C)=C/CC/C(C)=C/COP(=O)(O)OP(=O)(O)O",
    ),
    Node(
        "Geranylgeranyl pyrophosphate",
        "CC(C)=CCC/C(C)=C/CC/C(C)=C/CC/C(C)=C/COP(=O)(O)OP(=O)(O)O",
    ),
    # Phytoene (PubChem CID 5281242) — 15-cis 40-C polyene, 3 conjugated
    # double bonds at the centre, flanked by non-conjugated prenyl tails.
    Node(
        "Phytoene",
        "CC(=CCCC(=CCCC(=CCC=C(C)C=CC=C(C)CCC=C(C)CCC=C(C)C)C)C)C",
    ),
    # Lycopene (PubChem CID 446925) — all-trans C40, 11 conjugated C=C.
    Node(
        "Lycopene",
        "CC(=CCCC(=CCC=C(C)C=CC=C(C)C=CC=C(C)C=CC=C(C)CCC=C(C)C)C)C",
    ),
    # β-Carotene (PubChem CID 5280489) — both ends cyclised to β-ionone.
    Node(
        "β-Carotene",
        "CC1=C(C(CCC1)(C)C)C=CC(=CC=CC(=CC=CC=C(C)C=CC=C(C)C=CC2=C(CCCC2(C)C)C)C)C",
    ),
    # Zeaxanthin (PubChem CID 5280899) — 3,3'-dihydroxy-β-carotene.
    Node(
        "Zeaxanthin",
        "CC1=C(C(CC(C1)O)(C)C)C=CC(=CC=CC(=CC=CC=C(C)C=CC=C(C)C=CC2=C(CC(CC2(C)C)O)C)C)C",
    ),
]


# ---------------------------------------------------------------------------
# Linalool biosynthesis (beer-aroma example, Humulus lupulus MTS2).
# DMAPP + IPP → GPP (GPPS) → linalool (MTS2).
# The pyrophosphate headgroup disappears at the terpene-synthase step,
# so a shared alignment template doesn't fit — CoordGen alone.
# ---------------------------------------------------------------------------

LINALOOL_NODES: List[Node] = [
    Node("Dimethylallyl pyrophosphate", "CC(C)=CCOP(=O)(O)OP(=O)(O)O"),
    Node(
        "Geranyl pyrophosphate",
        "CC(C)=CCC/C(C)=C/COP(=O)(O)OP(=O)(O)O",
    ),
    Node("Linalool", "C=CC(C)(O)CCC=C(C)C"),
]


# ---------------------------------------------------------------------------
# Lovastatin (Aspergillus terreus lovB/lovC/lovA/lovD cluster).
# Textbook fungal polyketide: LovB iteratively condenses nine acetate
# units to release dihydromonacolin L, LovA oxidizes twice (monacolin L
# → monacolin J), LovD tacks on the 2-methylbutyrate side chain.
# ---------------------------------------------------------------------------

LOVASTATIN_NODES: List[Node] = [
    # Acetyl-CoA — the starter unit. Drawn as acetyl-SNAc, the common
    # in-vitro PKS surrogate (cysteamine stub in place of full CoA) so
    # the thumbnail stays readable at pathway-card size.
    Node("Acetyl-CoA", "CC(=O)SCCNC(C)=O"),
    Node(
        "Dihydromonacolin L",
        "CCC(C)C1CCC2CCC(C)C(CCC3CC(O)CC(=O)O3)C12",
    ),
    Node(
        "Monacolin L",
        "CCC(C)C1CC=C2C=CC(C)C(CCC3CC(O)CC(=O)O3)C12",
    ),
    Node(
        "Monacolin J",
        "OC1CC(C)C=C2C=CC(C)C(CCC3CC(O)CC(=O)O3)C12",
    ),
    Node(
        "Lovastatin",
        "CCC(C)C(=O)OC1CC(C)C=C2C=CC(C)C(CCC3CC(O)CC(=O)O3)C12",
    ),
]


# ---------------------------------------------------------------------------
# Bottromycin biosynthesis (RiPP; Streptomyces bottromycin cluster).
# The precursor peptide BotA is cleaved to the GPVVVFDC octapeptide,
# then macro-amidinated, thiazole-installed, C-methylated (×3), and
# O-methylated into bottromycin A2. The many intermediate PTMs are
# telescoped into one arrow for teaching clarity; the narrative
# covers the full enzyme set (BotP/BotH/BotAH, BotCD, BotRMT1–3,
# BotOMT, BotCYP).
#
# Note: the bottromycin A2 SMILES below matches the simplified form
# already used in docs/data/examples.js. It depicts a macrocyclic
# peptide scaffold — accurate enough for a teaching visual but omits
# the thiazole (shown as an imidazole in the existing data) and some
# non-proteinogenic stereochemistry. Worth revisiting if/when the
# underlying compound SMILES is tightened.
# ---------------------------------------------------------------------------

BOTTROMYCIN_NODES: List[Node] = [
    Node(
        "BotA core peptide",
        # G-P-V-V-V-F-D-C linear octapeptide (core after leader cleavage).
        "NCC(=O)N1CCCC1C(=O)NC(C(C)C)C(=O)NC(C(C)C)C(=O)NC(C(C)C)C(=O)"
        "NC(Cc1ccccc1)C(=O)NC(CC(=O)O)C(=O)NC(CS)C(=O)O",
    ),
    Node(
        "Bottromycin A2",
        "CC(C)CC1NC(=O)C(Cc2c[nH]cn2)NC(=O)C(C(CC)C)NC(=O)C(CC(C)C)"
        "NC(=O)C3CCCN3C(=O)C(C)NC1=O",
    ),
]


PATHWAYS: List[Pathway] = [
    Pathway(
        slug="violacein",
        nodes=VIOLACEIN_NODES,
        template_smiles=INDOLE_TEMPLATE_SMILES,
    ),
    Pathway(slug="carotenoid", nodes=CAROTENOID_NODES),
    Pathway(slug="linalool", nodes=LINALOOL_NODES),
    Pathway(slug="bottromycin", nodes=BOTTROMYCIN_NODES),
    # Lovastatin shares a decalin scaffold across all four intermediates,
    # so a decalin SMILES template aligns each drawing predictably.
    Pathway(
        slug="lovastatin",
        nodes=LOVASTATIN_NODES,
        template_smiles="C1CCC2CCCCC2C1",
    ),
]


# ---------------------------------------------------------------------------
# Standalone "compound" thumbnails used by the examples gallery
# (docs/examples.html → thumbSlugFor). These examples carry a single
# `compound: {...}` instead of a multi-step `pathway: {...}`, so they
# aren't in any of the pathways above — but the gallery cards still
# want a structure thumbnail. SMILES must stay in sync with
# docs/data/examples.js.
# ---------------------------------------------------------------------------

STANDALONE_COMPOUNDS: List[Node] = [
    # GFP chromophore (p-HBDI) — gfp-reporter example.
    Node("GFP chromophore (p-HBDI)", "OC1=CC=C(/C=C2\\N=C(C)C(=O)N2)C=C1"),
    # IPTG — lac-operon example.
    Node("IPTG", "CC(C)SC1OC(CO)C(O)C(O)C1O"),
    # Kanamycin A — pBI121 example.
    Node(
        "Kanamycin A",
        "NC1CC(N)C(OC2OC(CO)C(O)C(N)C2O)C(O)C1OC3OC(CO)C(O)C(O)C3O",
    ),
    # Maltose — waxy-corn-crispr example. A stand-in for the amylose
    # α-1,4 linkage that the Wx1 (GBSSI) enzyme extends.
    Node(
        "Maltose",
        "OC[C@H]1O[C@@H](O[C@H]2[C@H](O)[C@@H](O)[C@H](O)[C@@H](CO)O2)"
        "[C@H](O)[C@@H](O)[C@@H]1O",
    ),
    # Glyphosate — cp4-epsps example. The phosphonate herbicide whose
    # target (EPSPS) the CP4 variant resists.
    Node("Glyphosate", "OC(=O)CNCP(=O)(O)O"),
    # Amylose — info-term tooltip on the waxy-corn-crispr narrative.
    # Simplified α-1,4-linked glucose trimer representing the linear
    # helical glucan laid down by GBSSI (Wx1).
    Node(
        "Amylose",
        "OC[C@H]1O[C@@H](O[C@H]2[C@H](O)[C@@H](O)[C@H](O[C@@H]3O[C@H](CO)"
        "[C@@H](O)[C@H](O)[C@@H]3O)[C@@H](CO)O2)[C@H](O)[C@@H](O)[C@@H]1O",
    ),
    # Amylopectin — info-term tooltip. α-1,4 backbone with an α-1,6
    # branch point (shown with a single glucose branch at the C6 of
    # the middle residue).
    Node(
        "Amylopectin",
        "OC[C@H]1O[C@@H](O[C@H]2[C@H](O)[C@@H](O)[C@H](O)[C@@H]"
        "(CO[C@H]3O[C@H](CO)[C@@H](O)[C@H](O)[C@@H]3O)O2)"
        "[C@H](O)[C@@H](O)[C@@H]1O",
    ),
    # IPP (isopentenyl pyrophosphate) — cosubstrate in linalool and
    # carotenoid pathways. Slug "ipp" matches cosubstrate name in
    # docs/data/examples.js so the pathway card picks up the thumbnail.
    Node("IPP", "C=C(C)CCOP(=O)(O)OP(=O)(O)O"),
    # PEP (phosphoenolpyruvate) — cp4-epsps info-term. The native
    # EPSPS substrate that glyphosate mimics.
    Node("PEP", "C(=C)(C(=O)O)OP(=O)(O)O"),
    # Shikimate — cp4-epsps info-term for the pathway name.
    Node(
        "Shikimate",
        "O[C@H]1CC(=C[C@H](O)[C@H]1O)C(=O)O",
    ),
    # PKS building blocks used as cosubstrates in the lovastatin pathway.
    # Drawn as the N-acetylcysteamine (SNAc) analogs: the same acyl head
    # group on a cysteamine tail — the model substrates everyone uses in
    # in-vitro PKS assays because they're simpler than full CoA but keep
    # the reactive thioester chemistry intact.
    Node("Malonyl-CoA", "OC(=O)CC(=O)SCCNC(C)=O"),
    Node("2-Methylbutyryl-CoA", "CC[C@H](C)C(=O)SCCNC(C)=O"),
    # ----------------------------------------------------------------
    # Marine natural-product compounds (for the 6 new gallery cards).
    # SMILES lifted from PubChem (verified against PubChem CIDs
    # 6437364 / 157454 / 49787031 / 5281967 / 5701995 and the ET-743
    # canonical notation).
    # ----------------------------------------------------------------
    # Bryostatin 1 is manually sourced from Wikimedia Commons (File:
    # Bryostatin_1_ACS.svg, public domain) rather than RDKit-rendered,
    # because the ACS-style publication layout has cleaner bond angles
    # and explicit stereochemistry that CoordGen doesn't match on this
    # 20-member macrolactone. Do NOT re-add a Node for Bryostatin 1
    # here -- the handcrafted SVG at docs/assets/molecules/bryostatin-1
    # .svg is the canonical asset and would be overwritten if this
    # script renders it.
    Node(
        "Patellamide A",
        "CCC(C)C1C2=NC(CO2)C(=O)NC(C3=NC(=CS3)C(=O)NC(C4=NC(C(O4)C)"
        "C(=O)NC(C5=NC(=CS5)C(=O)N1)C(C)C)C(C)CC)C(C)C",
    ),
    Node(
        "Jamaicamide A",
        "CC1C=CC(=O)N1C(=O)C=C(CCNC(=O)CCC=CC(C)CCC(=CCl)CCCC#CBr)OC",
    ),
    Node("Curacin A", "CC1CC1C2=NC(CS2)C=CCCC=CC=C(C)CCC(CC=C)OC"),
    Node(
        "Barbamide",
        "CC(CC(=CC(=O)N(C)C(CC1=CC=CC=C1)C2=NC=CS2)OC)C(Cl)(Cl)Cl",
    ),
    Node(
        "Trabectedin",
        "CC1=CC2=C(C3C4C5C6=C(C(=C7C(=C6C(N4C(C(C2)N3C)O)COC(=O)C8(CS5)"
        "C9=CC(=C(C=C9CCN8)O)OC)OCO7)C)OC(=O)C)C(=C1OC)O",
    ),
    Node(
        "Pederin",
        "C[C@H]1[C@H](O[C@](CC1=C)([C@@H](C(=O)N[C@H]([C@@H]2C[C@H]"
        "(C([C@H](O2)C[C@@H](COC)OC)(C)C)O)OC)O)OC)C",
    ),
    # ----------------------------------------------------------------
    # Plant + symbiont natural products from the expanded gallery set.
    # SMILES are the PubChem *isomeric* canonical strings (CIDs
    # 146684558 / 11342965 / 36314 / 24360 / 31553) so wedge bonds
    # render correctly instead of the stereo-free connectivity form.
    # ----------------------------------------------------------------
    Node(
        "Lagriamide",
        "CC1CCC(OC1CC(=O)NCC(C(C)C(=O)NCCCC2C(CCC3(O2)CCCC(O3)CCC(C)"
        "/C=C(\\C)/CCC(=O)O)C)O)CC(=O)C4C(O4)C",
    ),
    Node(
        "Lasonolide A",
        "C[C@@H]1[C@H](C[C@@H]2C/C=C/C=C/C(=O)O[C@@H]3C[C@@H]"
        "(/C=C/C/C=C/C(=C\\[C@H]1O2)/C)O[C@H]([C@]3(C)CO)C/C=C\\C"
        "[C@H](C(=O)OCC(=C)CCC(C)C)O)O",
    ),
    Node(
        "Paclitaxel (Taxol)",
        "CC1=C2[C@H](C(=O)[C@@]3([C@H](C[C@@H]4[C@]([C@H]3[C@@H]"
        "([C@@](C2(C)C)(C[C@@H]1OC(=O)[C@@H]([C@H](C5=CC=CC=C5)"
        "NC(=O)C6=CC=CC=C6)O)O)OC(=O)C7=CC=CC=C7)(CO4)OC(=O)C)O)C)"
        "OC(=O)C",
    ),
    Node(
        "Camptothecin",
        "CC[C@@]1(C2=C(COC1=O)C(=O)N3CC4=CC5=CC=CC=C5N=C4C3=C2)O",
    ),
    Node(
        "Silybin A",
        "COC1=C(C=CC(=C1)[C@@H]2[C@H](OC3=C(O2)C=C(C=C3)[C@@H]4"
        "[C@H](C(=O)C5=C(C=C(C=C5O4)O)O)O)CO)O",
    ),
]


def slugify(name: str) -> str:
    """Match the JS slugify in docs/example.html so filenames line up."""
    s = name.lower()
    s = s.replace("\u03b2", "beta").replace("\u03b1", "alpha")
    s = re.sub(r"[^a-z0-9]+", "-", s)
    return s.strip("-")


def prepare_template(smiles: str) -> Chem.Mol:
    tmpl = Chem.MolFromSmiles(smiles)
    # CoordGen first so the template has a canonical orientation; without
    # this the default algorithm occasionally flips the ring and cascades
    # the rotation into every aligned drawing.
    rdCoordGen.AddCoords(tmpl)
    return tmpl


def render(node: Node, template: Optional[Chem.Mol], out_dir: str) -> str:
    mol = Chem.MolFromSmiles(node.smiles)
    if mol is None:
        raise ValueError(f"Invalid SMILES for {node.name!r}: {node.smiles}")

    # CoordGen always — gives much cleaner polycyclic / polyene layouts
    # than the default depiction.
    rdCoordGen.AddCoords(mol)
    if template is not None and mol.HasSubstructMatch(template):
        AllChem.GenerateDepictionMatching2DStructure(mol, template)

    drawer = rdMolDraw2D.MolDraw2DSVG(360, 280)
    opts = drawer.drawOptions()
    opts.bondLineWidth = 1.4
    opts.padding = 0.08
    opts.baseFontSize = 0.7
    # Transparent background so the card hover color bleeds through
    # instead of a white frame sitting on top of the card surface.
    opts.clearBackground = False
    drawer.DrawMolecule(mol)
    drawer.FinishDrawing()
    svg = drawer.GetDrawingText()

    # RDKit wraps its SVG in an XML processing instruction — drop it so
    # the file drops cleanly into an <img> tag or innerHTML.
    svg = re.sub(r"<\?xml[^?]*\?>\s*", "", svg)

    path = os.path.join(out_dir, slugify(node.name) + ".svg")
    with open(path, "w") as f:
        f.write(svg)
    return path


def render_rgroup_fragment(
    slug: str,
    smiles: str,
    out_dir: str,
    width: int = 180,
    height: int = 110,
) -> str:
    """Render a small R-group substituent fragment (e.g. the C7
    acetate, the C20 octadienoate) for use inline in the bryostatin-
    family R-group table. The '*' dummy atom in the SMILES marks the
    attachment point; RDKit draws it as a single bond leading to a
    small open circle, which is the convention for "R" in R-group
    tables. Output is a compact SVG sized to sit in a table cell.
    """
    mol = Chem.MolFromSmiles(smiles)
    if mol is None:
        raise ValueError(f"Invalid R-group SMILES: {smiles}")

    # The dummy atom gets a blank label so it renders as just the
    # wedge bond with a floating "~" marker where the attachment is;
    # setting atomLabel to empty keeps the visual minimal.
    for atom in mol.GetAtoms():
        if atom.GetSymbol() == "*":
            atom.SetAtomMapNum(0)
            atom.SetProp("atomLabel", "R")

    rdCoordGen.AddCoords(mol)
    drawer = rdMolDraw2D.MolDraw2DSVG(width, height)
    opts = drawer.drawOptions()
    opts.bondLineWidth = 1.3
    opts.padding = 0.12
    opts.baseFontSize = 0.9
    opts.clearBackground = False
    drawer.DrawMolecule(mol)
    drawer.FinishDrawing()
    svg = drawer.GetDrawingText()
    svg = re.sub(r"<\?xml[^?]*\?>\s*", "", svg)

    path = os.path.join(out_dir, f"rgroup-{slug}.svg")
    with open(path, "w") as f:
        f.write(svg)
    return path


# R-group fragments observed in the bryostatin family. SMILES use '*'
# as the attachment point. These get rendered as small inline SVGs
# in the R-group table row cells.
BRYOSTATIN_RGROUPS = [
    # Acetate ester at C7 (bryostatins 1, 3, 5, 7, 9, ...)
    ("acetate", "*OC(=O)C"),
    # Free hydroxyl at C7 (bryostatin 2)
    ("hydroxyl", "*O"),
    # Pivalate ester at C7 (bryostatins 4, 10, ...)
    ("pivalate", "*OC(=O)C(C)(C)C"),
    # Butanoate ester (bryostatins 4, 6, 8, 9, ...) at R2
    ("butanoate", "*OC(=O)CCC"),
    # (2E,4E)-octa-2,4-dienoate at C20 (bryostatins 1, 2, ...)
    ("octa-2-4-dienoate", "*OC(=O)/C=C/C=C/CCC"),
    # Free H (bryostatin 10 at R2)
    ("hydrogen", "[H]*"),
]


def render_bryostatin_scaffold(out_dir: str) -> str:
    """Render the bryostatin macrolactone scaffold with R1 / R2 labels
    at the C7 and C20 substituent positions. This is the "class"
    figure: one drawing that makes clear bryostatin is a family of
    compounds whose core is conserved and whose variation is local.

    SMILES is the full bryostatin 1 isomeric form with the C7 acetyl
    and the C20 octadienoyl groups replaced by dummy atoms carrying
    atom-map numbers 1 and 2 respectively. RDKit renders dummy atoms
    as '*' by default; we override via atomLabel so the glyphs appear
    as R1 and R2.
    """
    # Derived from the PubChem isomeric SMILES of bryostatin 1
    # (CID 5280757) with two substitutions: the C20 octadienoate
    # acyl ('CCC/C=C/C=C/C(=O)O' prefix) replaced by [*:2], and the
    # C7 acetyl ('OC(=O)C' inside the ring chain) replaced by [*:1].
    # Stereochemistry is preserved so RDKit's CoordGen lays the
    # macrolactone out with correct bond angles and wedges instead
    # of the flattened-spaghetti depiction you get from a stereo-
    # stripped SMILES.
    scaffold_smiles = (
        "[*:2][C@H]1/C(=C/C(=O)OC)/C[C@H]2C[C@@H](OC(=O)C[C@@H]"
        "(C[C@@H]3C[C@@H](C([C@@](O3)(C[C@@H]4C/C(=C/C(=O)OC)/"
        "C[C@@H](O4)/C=C/C([C@@]1(O2)O)(C)C)O)(C)C)[*:1])O)[C@@H](C)O"
    )
    mol = Chem.MolFromSmiles(scaffold_smiles)
    if mol is None:
        raise ValueError(f"Invalid scaffold SMILES: {scaffold_smiles}")

    # Attach display labels to the two dummy atoms. RDKit will use the
    # atomLabel property as the rendered glyph when set; we clear the
    # atom-map number so it doesn't override the label at draw time,
    # and use plain "R1" / "R2" strings because RDKit's path-stroked
    # text doesn't include superscript Unicode coverage (R\u00B9
    # renders as a blank / missing glyph).
    label_by_mapnum = {1: "R1", 2: "R2"}
    for atom in mol.GetAtoms():
        if atom.GetSymbol() == "*":
            map_num = atom.GetAtomMapNum()
            if map_num in label_by_mapnum:
                atom.SetProp("atomLabel", label_by_mapnum[map_num])
                atom.SetAtomMapNum(0)

    rdCoordGen.AddCoords(mol)

    drawer = rdMolDraw2D.MolDraw2DSVG(560, 440)
    opts = drawer.drawOptions()
    opts.bondLineWidth = 1.6
    opts.padding = 0.1
    opts.baseFontSize = 0.75
    opts.clearBackground = False
    drawer.DrawMolecule(mol)
    drawer.FinishDrawing()
    svg = drawer.GetDrawingText()
    svg = re.sub(r"<\?xml[^?]*\?>\s*", "", svg)

    path = os.path.join(out_dir, "bryostatin-scaffold.svg")
    with open(path, "w") as f:
        f.write(svg)
    return path


def main() -> None:
    repo_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    out_dir = os.path.join(repo_root, "docs", "assets", "molecules")
    os.makedirs(out_dir, exist_ok=True)

    total = 0
    failures: List[str] = []
    for pw in PATHWAYS:
        tmpl = prepare_template(pw.template_smiles) if pw.template_smiles else None
        align = "aligned to template" if tmpl is not None else "CoordGen only"
        print(f"\n[{pw.slug}]  {len(pw.nodes)} nodes  ({align})")
        for node in pw.nodes:
            try:
                path = render(node, tmpl, out_dir)
            except Exception as exc:  # pragma: no cover — surfaces bad SMILES
                failures.append(f"{pw.slug}/{node.name}: {exc}")
                print(f"  FAILED  {node.name!r}: {exc}")
                continue
            rel = os.path.relpath(path, repo_root)
            print(f"  wrote   {rel}")
            total += 1

    # Standalone single-compound thumbnails (no pathway to align to).
    print(f"\n[standalone]  {len(STANDALONE_COMPOUNDS)} compounds  (CoordGen only)")
    for node in STANDALONE_COMPOUNDS:
        try:
            path = render(node, None, out_dir)
        except Exception as exc:
            failures.append(f"standalone/{node.name}: {exc}")
            print(f"  FAILED  {node.name!r}: {exc}")
            continue
        rel = os.path.relpath(path, repo_root)
        print(f"  wrote   {rel}")
        total += 1

    # Bryostatin scaffold: special-case render because it uses
    # labelled dummy atoms (R1 / R2) rather than a standalone SMILES
    # that a Node could carry.
    try:
        path = render_bryostatin_scaffold(out_dir)
        rel = os.path.relpath(path, repo_root)
        print(f"\n[scaffold]  bryostatin class scaffold")
        print(f"  wrote   {rel}")
        total += 1
    except Exception as exc:
        failures.append(f"scaffold/bryostatin: {exc}")
        print(f"  FAILED  bryostatin scaffold: {exc}")

    # Bryostatin R-group fragments (OAc, OH, OPiv, OBu, octadienoate,
    # H). Small SVGs sized to sit in an R-group table row cell.
    print(f"\n[rgroups]  {len(BRYOSTATIN_RGROUPS)} fragments")
    for slug, smi in BRYOSTATIN_RGROUPS:
        try:
            path = render_rgroup_fragment(slug, smi, out_dir)
            rel = os.path.relpath(path, repo_root)
            print(f"  wrote   {rel}")
            total += 1
        except Exception as exc:
            failures.append(f"rgroup/{slug}: {exc}")
            print(f"  FAILED  rgroup {slug}: {exc}")

    print(f"\nDone — {total} SVGs written to {os.path.relpath(out_dir, repo_root)}")
    if failures:
        print(f"\n{len(failures)} failure(s):")
        for f in failures:
            print(f"  - {f}")


if __name__ == "__main__":
    main()
