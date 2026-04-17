# Spec: Examples Manager

## Problem

The Examples Gallery today is statically defined in
`docs/data/examples.js`. Adding a new example means editing a JS file and
pushing a PR. That's fine for the 10 launch examples, but as we grow into
classroom decks, field-campaign examples, and partner-contributed examples,
we'll want:

- Non-engineers (me, a TA, a partner scientist) to submit examples via a web
  form.
- A review/approval workflow so we don't publish noise.
- Richer content per example — multiple sequences, embedded screenshots,
  exercise prompts, solution walk-throughs.

## Users

- **Curators** (us): need an admin UI to accept/reject submissions and edit
  published examples.
- **Contributors** (educators, partner teams): need a submit form that asks
  for accession, narrative, tags, and a code snippet.
- **Readers** (everyone): just see examples in the Gallery. No change to
  their experience other than more and better examples.

## Scope (in)

- Admin UI at `/admin/examples`. Login-gated (GitHub OAuth).
- Submit form at `/contribute/example.html` — public, no login required to
  submit, but submissions go into moderation.
- DB-backed examples; the Gallery page renders from an API (with a
  static-fallback JSON generated at build time for SEO / offline).
- Versioning: edits create new revisions; admins can roll back.
- Taxonomy: categories (academic / industrial), subcategories (undergrad,
  highschool, pharma, …), free-form tags.
- Search: full-text over title, narrative, tags.

## Scope (out)

- User comments / Q&A on examples (that's Discourse / GitHub Discussions,
  not us).
- Forking examples into a user's personal library (maybe in Designer
  Sandbox, not here).
- Monetization / paywalled examples.

## UX — Submit Flow

1. Contributor lands on `/contribute/example.html`.
2. Form fields:
   - Title
   - Short summary (<= 280 chars)
   - Category (academic / industrial)
   - Tags (multi-select + free-form)
   - Sequence source: NCBI accession *or* paste GenBank/FASTA
   - Narrative (markdown)
   - Python snippet (the `dash-seqviz` code to reproduce)
   - Contributor name + email (for crediting)
3. Submit → stored with status `pending`.
4. Admin gets a GitHub issue or email notification.
5. Admin reviews at `/admin/examples/review/:id` → approve / reject / request
   edits.

## UX — Admin Review Flow

1. `/admin/examples` → table view: pending / published / rejected tabs.
2. Click row → side-by-side preview (rendered example) + raw submission.
3. Buttons: Approve, Reject, Edit, Mark-as-featured.
4. On approve: example becomes publicly visible; next static build picks it
   up.

## Data Model

### `Example`
```
id: str                         # short slug (kebab-case)
title: str
summary: str                    # <= 280 chars
category: "academic" | "industrial"
tags: list[str]
complexity: 1..5
featured_order: int | null      # if set, shows on home hero; null hides from hero
status: "draft" | "pending" | "published" | "rejected" | "archived"
visibility: "public" | "unlisted"
created_at, updated_at, published_at
current_revision_id: str
```

### `ExampleRevision`
```
id: str
example_id: str
revision_no: int                # 1, 2, 3, …
narrative_md: str
python_snippet: str
seqviz_config_json: str         # the props object (seq, annotations, etc.)
sequence_source: {
    kind: "ncbi" | "inline"
    accession: str | null
    seq: str | null             # if inline
}
screenshots: list[{url, caption}]
editor_id: str                  # who made this revision
created_at
```

### `Submission` (a pending `Example` before it becomes one)
```
id: str
submitted_by_name: str
submitted_by_email: str
example_id: str                 # pre-assigned slug
payload: ExampleRevision        # the proposed first revision
status: "pending" | "approved" | "rejected"
reviewer_notes: str | null
submitted_at, reviewed_at
```

## Integration with the Static Site

We want the Gallery to stay fast and offline-viewable. Approach:

1. Dynamic source-of-truth lives in the DB.
2. A CI job (hourly + on-approve webhook) exports all published examples
   to `docs/data/examples.generated.json` and commits.
3. `docs/examples.html` reads `examples.generated.json` when present, falls
   back to the handwritten `examples.js` otherwise.
4. New-since-last-build examples are flagged with a small badge.

This lets us ship a CMS without breaking the static-GH-Pages hosting model.

## Non-goals

- WYSIWYG editor for narrative (markdown textarea + live preview is enough).
- Translation / i18n of example content (later; English-only for now).
- Per-example analytics dashboard inside admin (basic page-view counts is
  fine; deeper analytics → Plausible or GA).

## Open Questions

- **Auth for admin**: GitHub OAuth restricted to an allow-list of usernames
  is simplest and ties nicely to our release workflow. No user accounts
  needed.
- **Hosting**: deploy admin + API as a single small FastAPI service on Fly.io
  or Render. Neither is free indefinitely — factor into the budget when the
  project is approved.
- **Spam on the contributor form**: Cloudflare Turnstile + a one-question
  honeypot ("what enzyme recognizes GAATTC?") filters almost all of it.
- **Ownership of contributed content**: contributors grant us a perpetual,
  non-exclusive license to publish and modify. Explicit in the submit form's
  fine print.
