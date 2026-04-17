# Spec: QC Dashboard

## Problem

Once a user has a sequence (from NCBI, from their own GenBank, or from the
Designer Sandbox), they want quick answers to questions that today require
stitching together BioPython, CAI tables, HMMER/Pfam, and a spreadsheet:

- Does this CDS have enough codon bias for expression in *E. coli* / yeast /
  CHO?
- Does it contain a forbidden restriction site for my downstream cloning
  workflow?
- Does the predicted protein have a recognizable Pfam domain?
- Are there any rule-violations based on my lab's internal design rules
  (e.g. "no BsaI sites inside CDSs")?

The QC Dashboard surfaces this alongside the seqviz view.

## Users

- **Industrial scientists** at synbio shops (Ginkgo / Bioforge / Corteva / LanzaTech)
  who need to QC designs before ordering.
- **Grad students** checking a construct before wet-lab.
- **Teaching labs** using it as a learning aid ("look at codon-adaptation
  index for your design").

## Scope (in)

### Overlays on the seqviz view
- **Forbidden-enzyme panel**: list of enzymes that must not cut the CDS;
  show red markers if they do.
- **Codon heat-strip**: a per-codon track colored by CAI (relative adaptation)
  for a chosen host.
- **Domain track**: predicted Pfam / InterPro domains projected onto the CDS
  as annotations.
- **GC-content heat-strip**: sliding-window GC%.

### Side panel
- Score cards: CAI, mean GC%, GC skew, rare-codon count, domain coverage.
- Rules engine report: list of violations with jump-to-location links.
- Export: PDF report, JSON report.

## Scope (out)

- Full protein structure prediction (that's AlphaFold territory).
- Primer design / PCR thermodynamics.
- Off-target / guide-RNA scoring (separate spec if we ever build it).
- Real-time predictions for large bacterial genomes — we cap at ~50 kb per QC
  run; larger designs get the per-feature-only QC path.

## UX Flow

1. User lands on `/qc.html?design=<id>` (from Designer) or
   `/qc.html?accession=<id>` (from Explorer), or pastes a sequence.
2. Chooses host organism for CAI: *E. coli* K-12, *S. cerevisiae*, CHO, *B. subtilis*,
   *P. putida*, custom upload.
3. Chooses forbidden-enzyme set: Golden-Gate (BsaI + BsmBI + SapI), MoClo,
   custom.
4. Clicks **Run QC**. Spinner for ~3–10s.
5. Report appears in three columns:
   - Left: score cards (CAI, GC, domain count, violations).
   - Center: seqviz with overlays toggle-able on/off.
   - Right: narrative report ("Design passes 9 of 10 rules. 1 warning: BsaI
     site at position 1,142 inside CDS.").
6. Export → PDF (for lab notebook) or JSON (for automation).

## Data Model

### `QCRun`
```
id: str
input_kind: "design" | "accession" | "raw"
input_ref: str                        # design_id or accession or sha256 of seq
seq_hash: str                         # sha256 of uppercased seq, used for caching
host: str                             # "ecoli_k12" | ...
enzyme_set: "golden_gate" | "moclo" | "custom"
custom_enzymes: list[str] | null
ruleset_id: str                       # fk to Ruleset
status: "queued" | "running" | "done" | "error"
created_at, finished_at
```

### `QCReport` (one per CDS within a run)
```
run_id: str
cds_start, cds_end, cds_strand: int
cds_name: str
cai: float                            # 0..1
gc_percent: float
gc_skew_window: list[{position, gc_skew}]
rare_codons: list[{position, codon, freq}]
domains: list[{start, end, pfam_id, name, evalue}]
violations: list[Violation]
```

### `Ruleset`
```
id: str
name: str                             # "MoClo L0", "My Team's rules"
owner_id: str | null                  # null = system / shared
rules: list[Rule]                     # ordered
```

### `Rule`
```
id: str
kind: "no_enzyme_in_cds" | "min_cai" | "max_gc_in_window" | "no_homopolymer" | "custom_regex"
params: dict                          # kind-specific
severity: "error" | "warning" | "info"
message_template: str
```

## Backend Requirements

- **CAI tables**: bundled per organism. Use `codonusage.org` as a starting
  reference; commit the tables.
- **Domain detection**: HMMER + Pfam-A locally (~1.5 GB) is the gold standard.
  Alternative: InterProScan REST (slow, rate-limited). v1 ships HMMER local.
- **Compute**: jobs run on an async worker (Celery / RQ / plain asyncio task
  queue). Keep median job <10s by only scanning CDSs, not whole genomes.
- **Caching**: `seq_hash + host + ruleset_id → QCReport` is a deterministic
  function, so cache aggressively in Redis or the DB.

## Non-goals

- Real-time interactive QC on every keystroke in the Designer.
- Predicting mRNA secondary structure / expression level.
- Lab-specific LIMS integration (that's enterprise).

## Open Questions

- **HMMER or InterPro?** HMMER local is fast and deterministic; shipping a
  1.5 GB Pfam db is fine for a self-hosted install but heavy for our public
  demo. Likely: local HMMER for production, InterPro REST for the public
  free tier.
- **CAI source**: Kazusa tables are permissively licensed and widely used,
  but old. Consider supplementing with a per-project upload path ("upload
  your own codon-usage table from a reference genome").
- **Ruleset sharing**: should teams be able to *publish* their rulesets to a
  public registry so the community can build on them? Yes — but defer to v2.
- **Scoring methodology**: when CAI is "low" is subjective. We should surface
  the raw number + a colored badge, not a binary pass/fail.
