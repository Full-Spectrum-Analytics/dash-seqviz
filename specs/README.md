# dash-seqviz — Product Specs

This folder holds forward-looking **specification documents** for features that
require a backend, a persistent data store, authentication, or other
server-side infrastructure. They are *not* implemented today and are out of
scope for the static GitHub Pages site (`docs/`).

They exist so that when we decide to stand up a real application (likely a
thin Python service behind the Dash app, or an API layer the Dash app calls
into), we have a reference for scope, data shapes, and UX.

## Index

| Spec | Status | Why it needs a backend |
|---|---|---|
| [`designer-sandbox.md`](designer-sandbox.md) | Planned | Save/share designs, golden-gate assembly solver, sequence persistence |
| [`qc-dashboard.md`](qc-dashboard.md) | Planned | CAI calculation, domain/Pfam detection, rules engine, report storage |
| [`examples-manager.md`](examples-manager.md) | Planned | CMS for the Examples Gallery — admin UI, DB-backed content |
| [`api.md`](api.md) | Planned | HTTP API that powers the above features (and 3rd-party integrations) |
| [`enterprise.md`](enterprise.md) | Planned | SSO, audit logging, LIMS integrations, on-prem deployment |

## Conventions

- Specs are written for engineering + product readers, not marketing.
- Each spec has: **Problem**, **Users**, **Scope (in/out)**, **UX flow**,
  **Data model**, **Non-goals**, **Open questions**.
- No code samples unless they clarify a data shape or contract.
- Keep them evergreen — if the landscape changes (new seqviz feature,
  new competitor), revise in place rather than forking.
