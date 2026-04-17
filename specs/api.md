# Spec: dash-seqviz API

## Problem

The static site can get us to "read-only demos + link-shared designs encoded
in URL hashes," but every real-app feature (Designer persistence, QC runs,
Examples Manager, enterprise integrations) needs an HTTP API.

This spec defines the shape of that API so that individual feature specs
(`designer-sandbox.md`, `qc-dashboard.md`, `examples-manager.md`) can refer
to it instead of redefining routes ad hoc.

## Principles

1. **REST-ish + JSON.** No GraphQL. No RPC framework.
2. **Stateless.** Every request carries its own auth context. No server-side
   sessions.
3. **Versioned.** Prefix every route with `/api/v1/`. Break in v2.
4. **Predictable pagination.** Cursor-based (`?cursor=...&limit=...`), never
   offset-based.
5. **Errors as structured JSON.** No HTML error pages.

## Authentication

- **Public endpoints** (read published examples, create anonymous design):
  no auth.
- **User endpoints** (my designs, my submissions): bearer token issued by
  GitHub OAuth flow.
- **Admin endpoints**: same bearer token + server-side allow-list check.

```
Authorization: Bearer <jwt>
```

Tokens are 24-hour JWTs. Refresh by re-doing the OAuth dance.

## Rate Limiting

- **Anonymous**: 60 req/min per IP, 1000 req/day per IP.
- **Authenticated user**: 300 req/min, 10k req/day.
- **Design creation**: 20/day anonymous, 200/day user.
- **QC runs**: 10/day anonymous, 100/day user (expensive).
- Response header `X-RateLimit-Remaining` on every response.
- 429 with `Retry-After` header on breach.

## Resource Routes

### Examples (read-only, from Examples Manager)

```
GET    /api/v1/examples?category=&tag=&cursor=&limit=       # list published
GET    /api/v1/examples/:id                                 # full example, current revision
GET    /api/v1/examples/:id/revisions                       # version history (public)
```

### Example submissions (Examples Manager)

```
POST   /api/v1/submissions                                  # public, creates pending
GET    /api/v1/submissions/:id                              # submitter + admin only
```

### Examples admin

```
GET    /api/v1/admin/submissions?status=pending             # admin only
POST   /api/v1/admin/submissions/:id/approve                # admin only
POST   /api/v1/admin/submissions/:id/reject                 # admin only
PATCH  /api/v1/admin/examples/:id                           # admin only
```

### Designs (Designer Sandbox)

```
POST   /api/v1/designs                                      # create; body = Design payload
GET    /api/v1/designs/:id                                  # honors visibility
PATCH  /api/v1/designs/:id                                  # owner only (or anon if unclaimed)
DELETE /api/v1/designs/:id                                  # owner only
POST   /api/v1/designs/:id/export?format=genbank|fasta|svg|json
GET    /api/v1/users/me/designs                             # authenticated user's designs
```

### QC runs (QC Dashboard)

```
POST   /api/v1/qc-runs                                      # enqueues a run
GET    /api/v1/qc-runs/:id                                  # poll status + read report
GET    /api/v1/qc-runs/:id/report.pdf                       # PDF render
GET    /api/v1/qc-runs/:id/report.json                      # machine-readable
GET    /api/v1/rulesets?owner=me|public
POST   /api/v1/rulesets                                     # user-owned custom rulesets
```

### NCBI proxy (optional, v2)

Today the static site calls NCBI directly from the browser. If we ever need
a proxy (e.g. to attach our own API key), expose:

```
GET    /api/v1/ncbi/fetch?accession=&format=genbank|fasta
```

Rate-limited per-IP to prevent us being a free NCBI CDN.

## Error Shape

```json
{
  "error": {
    "code": "validation_error",
    "message": "Field 'seq' contains non-ACGT characters",
    "field": "seq",
    "details": {}
  },
  "request_id": "req_abc123"
}
```

Error codes: `validation_error`, `not_found`, `unauthorized`, `forbidden`,
`rate_limited`, `upstream_error`, `internal_error`.

## Pagination

```
GET /api/v1/examples?cursor=eyJ2IjoxLCJpZCI6...&limit=20

=> {
  "items": [...],
  "next_cursor": "eyJ2IjoxLCJpZCI6..."  // null at end
}
```

## Stability

- `v1` routes are stable from launch; breaking changes go to `v2`.
- Deprecations are announced via a `Sunset: Thu, 01 Jan 2099 00:00:00 GMT`
  header and a 6-month minimum migration window.
- Additive changes (new optional fields) are *not* considered breaking.

## Tech

- **Framework**: FastAPI (Python 3.11+).
- **ORM**: SQLAlchemy 2 + Alembic migrations.
- **DB**: Postgres (Supabase or RDS).
- **Queue**: Redis + RQ (for QC runs).
- **Deployment**: single container, Fly.io or Render. Horizontal scale later.

## Non-goals

- Public webhooks / event subscriptions (out of scope for v1).
- GraphQL facade.
- Server-sent events / websockets (polling is fine for QC).
- Multi-region deployment.

## Open Questions

- Do we want a **read-only key-based API** for power users who want to pull
  published examples into their own teaching materials? Likely yes — an
  unauthenticated scoped token that just reads `/examples`. Defer to v1.1.
- **OpenAPI publishing**: FastAPI gives us `openapi.json` for free. We should
  publish it at `/openapi.json` and a Swagger UI at `/docs`. Yes, out of the
  box.
