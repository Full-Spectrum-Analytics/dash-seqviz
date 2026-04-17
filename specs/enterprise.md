# Spec: Enterprise features

## Problem

The companies we want to attract (Ginkgo, Corteva, LanzaTech, Terra Bioforge,
mid-size pharma, seed biotech) will not use a public demo to design real
constructs. They need:

- SSO (Okta, Azure AD, Google Workspace).
- Audit logging with retention.
- Data residency / on-prem option (designs never leave their VPC).
- Integration with their LIMS or internal registry (Benchling, Geneious
  Biologics, internal systems).

This spec scopes what an "Enterprise Edition" of dash-seqviz looks like.
It is explicitly a commercial offering, not open-source.

## Users

- **Platform / IT team** at a synbio company: cares about SSO, audit,
  on-prem, VPC, SLAs.
- **Scientist** inside that company: same Designer + QC experience as the
  public site, but tied to their identity and org data.

## Scope (in)

### Deployment
- Single-binary container image, published to a private registry.
- Helm chart for Kubernetes.
- Terraform module for AWS (ECS/Fargate + RDS + ElastiCache).
- Full on-prem install guide (no outbound calls required except for sequence
  databases if desired).

### Identity
- OIDC / SAML2 SSO.
- Role-based access: Admin, Editor, Reader.
- SCIM user provisioning (optional).

### Audit
- Every read/write on a Design, QC run, or Example is logged.
- Log fields: actor, action, resource, old/new state, timestamp, IP, user-agent.
- Retention: configurable (default 1 year), export to S3 / GCS / Splunk.

### LIMS / Registry integrations
- Benchling bi-directional sync: pull sequences, push finished designs.
- Geneious Biologics import/export.
- Generic webhook outbox: "design updated" events to customer endpoints.

### Licensing / billing
- Per-seat licensing.
- License key validated at container boot; offline grace period.
- Usage telemetry is opt-in (aggregate counts only, never sequence data).

## Scope (out)

- Multi-tenant SaaS billing (we're not running a SaaS for enterprises in
  v1 — they self-host).
- Marketplace for third-party plugins.
- HIPAA compliance. If a customer asks, we scope that engagement separately.

## UX

From the scientist's point of view: unchanged from the public app. Same
Explorer, Designer, Examples, QC. The only visible difference: their org
logo in the nav, their projects in the sidebar, their LIMS data surfaced
where relevant.

From the admin's point of view: new `/admin/org` section.
- Tabs: Users, Roles, SSO, Audit log, Integrations, License.

## Data isolation

- Each org deploys its own instance. No shared infrastructure.
- Within an instance, designs are partitioned by `org_id` (belt-and-
  suspenders; an org only sees one org-id anyway).
- Encryption at rest: Postgres-native (customer's cloud KMS).
- Encryption in transit: TLS 1.2+.

## Audit log schema

```
id: uuid
org_id: str
actor_user_id: str
actor_email: str                # denormalized for log integrity
actor_ip: str
action: str                     # "design.create", "design.update", "qc.run.create", ...
resource_type: str
resource_id: str
before: json | null             # previous state (for update/delete)
after: json | null              # new state (for create/update)
request_id: str
user_agent: str
at: datetime
```

## Support tier

- Business hours email support: included.
- P1 (service down) 24/7 pager: add-on.
- Custom feature development: add-on, quoted.
- Professional services (LIMS integration consulting): billed separately.

## Go-to-market notes

- First 1–2 customers serve as design partners; give heavy discount in
  exchange for reference rights and feedback cycles.
- Target list: Terra Bioforge (warm intro), Corteva, Ginkgo, LanzaTech,
  Inari. Mid-tier: Zymergen-successor shops, seed plant-biotech.

## Non-goals

- Being a full LIMS ourselves.
- Being a synthesis vendor (don't manufacture oligos).
- Being a CRO.

## Open Questions

- **Pricing model**: per-seat vs. per-org flat rate. Per-seat scales with the
  customer's team size but is hostile to adoption. Lean toward per-org flat,
  with a soft seat cap (e.g. "up to 25 seats in Starter, up to 100 in Team,
  unlimited in Enterprise").
- **License enforcement**: how strict? Soft limit with a "please upgrade"
  banner vs hard limit. Probably soft for seats, hard for feature flags
  (e.g. SSO only in Team+).
- **Air-gapped installs**: some government / defense biotech customers will
  demand air-gapped. Doable but means shipping Pfam / CAI databases inside
  the container image (~1.5 GB). Factor into pricing.
- **Anti-abuse telemetry**: even opt-in, some customers refuse any
  outbound phone-home. License keys must verify offline.
