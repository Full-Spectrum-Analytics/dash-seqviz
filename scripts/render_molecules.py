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

    print(f"\nDone — {total} SVGs written to {os.path.relpath(out_dir, repo_root)}")
    if failures:
        print(f"\n{len(failures)} failure(s):")
        for f in failures:
            print(f"  - {f}")


if __name__ == "__main__":
    main()
