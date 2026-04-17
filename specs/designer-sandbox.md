# Spec: Designer Sandbox

## Problem

The Examples Gallery and Explorer are read-only: a user can look at a plasmid
but can't *build* one. Synthetic-biology teams (academic labs, industrial R&D)
routinely need to:

- Drop a promoter, RBS, CDS, terminator into a vector and see the result.
- Try a few restriction enzymes on the assembled piece before ordering.
- Share the resulting design as a link or a GenBank file with a collaborator.

The Designer Sandbox is the authoring surface for this.

## Users

- **Students / undergrads** following a class exercise ("build a GFP reporter").
- **Academic post-docs / grad students** prototyping a cloning design.
- **Industrial scientists** sketching a design before handing it to a cloning
  or DNA-synthesis vendor.

## Scope (in)

- Part palette: promoters, RBSs, CDSs, terminators, origins, selection markers.
- Drag-and-drop onto a linear canvas; reorder by drag.
- Real-time seqviz render of the assembled sequence as parts are arranged.
- Restriction-enzyme check: "which enzymes cut inside a CDS?" warning.
- Golden Gate / BsaI / BsmBI overhang compatibility check.
- Export: GenBank (`.gb`), FASTA, SVG (the seqviz render).
- Share link: short URL that encodes the design.
- Import: paste GenBank / FASTA; fetch by NCBI accession (reuses Explorer fetcher).

## Scope (out)

- CRISPR guide scoring (separate spec — QC Dashboard covers CAI/Pfam, not
  guides).
- Primer design / PCR design.
- Automated codon optimization (mention as a future add-on; not v1).
- Real cloning workflow tracking (LIMS, inventory) — that's enterprise.

## UX Flow

1. User lands on `/designer.html` with an empty canvas and a parts palette.
2. Choose a **template** (e.g. "E. coli expression cassette", "yeast
   CRISPR knock-in", "Bsai Golden Gate destination vector") or start blank.
3. Drag parts into a linear strip; each part shows its length and its role.
4. Right panel: live seqviz view (`both` topology), restriction-enzyme picker,
   warnings.
5. Click **Save** → prompt for name → returns a short URL
   (`dash-seqviz.com/d/abc123`) and a download button.
6. Click **Share** → copies the short URL.
7. Click **Export** → offers `.gb`, `.fasta`, `.svg`, `.json` (raw design).

## Data Model

### `Part`
```
id: str                         # uuid
kind: "promoter" | "rbs" | "cds" | "terminator" | "origin" | "marker" | "custom"
name: str                       # "pLac", "GFP", "T7 terminator"
seq: str                        # DNA sequence (uppercase, ACGT)
source: {                       # where the part came from
    registry: "iGEM" | "SynBioHub" | "user" | "ncbi"
    external_id: str | null
}
annotations: list[Annotation]   # inherited when dropped into design
color: str | null
```

### `Design`
```
id: str                         # short ID for share URLs
name: str
created_at: datetime
updated_at: datetime
owner_id: str | null            # null for anonymous
visibility: "private" | "unlisted" | "public"
backbone: Part | null           # vector into which parts are inserted
parts_linear: list[Part]        # ordered
enzymes_of_interest: list[str]
notes: str | null
```

### Derived (not stored)
- Assembled sequence: concatenation of `backbone` + `parts_linear` (respecting
  insert site).
- Cut sites: computed on demand.

## API (see `api.md`)

- `POST /api/designs` → create
- `GET /api/designs/:id` → read (honors visibility)
- `PATCH /api/designs/:id` → update
- `DELETE /api/designs/:id`
- `POST /api/designs/:id/export` → `?format=genbank|fasta|svg|json`

## Non-goals

- Modeling transcription/translation rates (this is a *drawing* tool, not a
  simulator).
- Running BLAST against the design (nice-to-have, not v1).
- Auth: v1 supports anonymous designs with share URLs. Logged-in accounts =
  later.

## Open Questions

- **Parts source of truth**: do we curate a list of iGEM parts ourselves, or
  federate to SynBioHub? The latter is correct long-term but slower to ship.
- **Storage**: SQLite on a tiny VM vs. Supabase vs. DIY Postgres? Probably
  Supabase — free tier is enough for public sandbox use.
- **Short URL scheme**: hash-based (stateless, no DB needed for read) vs.
  ID-based (requires DB but cleaner). Hash-based means we can start without a
  DB.
- **Rate limiting**: share creation is cheap, but preventing someone from
  using us as a sequence CDN (creating 100k designs in a loop) needs some
  form of IP-level limit.
