# Nomad — Claude Code / ZCP Init Prompt

Paste this as the first message to Claude Code (running inside the `zcp` service, or locally with `zcli vpn up`). It assumes the `data-table` agent skill is already installed, per the project's existing setup.

---

```
You are bootstrapping "Nomad" — an autonomous SRE agent for Zerops deployments —
for a 48-hour solo hackathon submission to The Zerops Challenge. Read this whole
brief before writing any code. Work in strict tier order; do not start Tier 2
work until every Tier 1 item is deployed and verified working end-to-end on
live Zerops infrastructure, not just locally.

## What we're building
I have a landing page from another project, change the wording and copy to reflect this project, use it as the marketing landing site. It is already built so jut move it in properly and wire it in.
Nomad watches a live Zerops project, detects anomalies from its logs, uses an
LLM to diagnose root cause, and applies real fixes (restart / rollback) via the
Zerops REST API. Full spec: see 03-technical-spec-and-file-structure.md in this
repo (I'm attaching/pasting it below — read it fully before scaffolding).

## Non-negotiable architectural facts (do not deviate from these)

1. Zerops has NO pull-based "get logs" API. The only way to receive logs
   programmatically is syslog-ng log forwarding, configured on the Zerops
   project side (Advanced Observability), pointed at a UDP listener we run
   ourselves. The `worker` service must implement this listener
   (RFC5424/syslog-ng compatible, UDP). Build and test this FIRST — everything
   downstream depends on it.
2. Control actions (restart, rollback) go through the Zerops REST API:
   base URL `https://api.app-prg1.zerops.io/api/rest/public`, Bearer token
   auth. `/service-stack` for restart, `/app-version` for rollback (Zerops
   keeps the last 10 versions per service). CHECK THE LIVE SWAGGER
   (`{base}/swagger`) for exact request/response shapes before implementing —
   do not guess the payload shape from memory.
3. `frontend`, `api`, `worker`, `db`, and `target` are five distinct Zerops
   services defined in one `zerops.yaml` at repo root (monorepo, npm
   workspaces). Use the exact `zerops.yaml` in the technical spec as the
   starting point.
4. The incident dashboard uses the OpenStatus data-table system drizzle example, you can check the data-table-filters folder for the drizzle example under /apps/web/app/drizzle. It is perfect example of what we need.
   (data-table.openstatus.dev). Its documented pattern assumes Next.js route
   handlers — we are NOT using Next.js. Port the framework-agnostic helpers
   (`buildWhereConditions`, `buildOrderBy`, `buildCursorPagination`,
   `computeFacets` — normally imported from `@/lib/drizzle`) directly into a
   Fastify route instead of trying to force Next.js conventions. Use the
   Zustand state adapter for the frontend, not nuqs (nuqs assumes Next's
   router; this is a Vite app).
5. API layer is Fastify, not Express — use it idiomatically (plugins for
   db/cors, typed route schemas), don't write Express-style middleware chains.

## Build order (strict)

### Phase 1 — Foundation (do this first, deploy immediately)
- Scaffold the npm-workspaces monorepo per the file structure in the tech spec
- Write `zerops.yaml` for all 5 services
- Set up Drizzle schema: `incidents`, `logs`, `fixes` tables (see tech spec §5
  for the `incidents` shape; add `logs` for raw ingested lines and `fixes` for
  the remediation audit trail)
- Deploy skeleton versions of all 5 services to Zerops NOW, even mostly empty —
  confirm they all show green/running before writing feature code. This matters
  for the "Zerops usage is real, not bolted on" judging signal.

### Phase 2 — Log ingestion (Tier 1)
- Build the UDP syslog listener in `worker/src/syslog/listener.ts`
- Parse incoming lines, write to `logs` table
- Configure log forwarding on the `target` service's project settings pointing
  at the `worker`'s public UDP port (you'll need Direct Port Access enabled on
  `worker` in the Zerops GUI — this can't be done from `zerops.yaml` alone)
- VERIFY: trigger a log line from `target`, confirm it lands in the `logs`
  table via forwarded syslog, not a stub. Do not proceed until this works on
  real deployed infrastructure.
- Implement anomaly rules: crash-loop (N restarts in T seconds), 5xx rate
  spike, service-down

### Phase 3 — Diagnosis pipeline (Tier 1)
- `worker/src/diagnosis/context-builder.ts`: on anomaly, gather last ~50 log
  lines for the affected service + current `zerops.yaml` + last 3 deploy
  versions (via `/app-version`)
- `worker/src/diagnosis/claude-client.ts`: call the Claude API with this
  context, request structured JSON output:
  `{ rootCause, confidence: "low"|"medium"|"high", suggestedFix:
  "restart"|"rollback"|"manual", explanation }`
- Write result to `incidents` table, status → `fix_suggested`

### Phase 4 — Dashboard (Tier 1)
- Build the incident table using the data-table agent skill + the port-to-
  Fastify approach from the tech spec §5
- Row detail drawer showing full diagnosis + an "Apply fix" button
- Live status per monitored service

### Phase 5 — Real remediation (Tier 1 — this is the demo's climax, don't rush it)
- `worker/src/remediation/restart.ts`: call `/service-stack` restart endpoint
- Wire auto-apply for high-confidence restart suggestions; everything else
  waits for a human click on "Apply fix" (`POST /api/fixes/:incidentId/apply`)
- Build the demo trigger: a `/break` endpoint on `target` that deliberately
  crashes it in a reproducible way, plus a button in Nomad's own dashboard
  that calls it
- TEST THE FULL LOOP repeatedly against the live deployment: break → detect →
  diagnose → fix → incident closes. This must be reliable, not "worked once."

### Phase 6 — Tier 2 (only after Phase 5 is rock solid)
- Chat panel over incident history (cheapest, best ROI)
- Rollback as a second real fix type
- Public status page

## What to ask me before proceeding

- Confirm the Zerops project ID and a scoped Personal Access Token before
  Phase 5 (don't fabricate placeholder tokens and move on — stop and ask)
- Confirm exact `/service-stack` and `/app-version` request/response shapes
  against the live Swagger before implementing remediation — report back what
  you find rather than guessing
- If the UDP log forwarding setup requires a GUI step you can't script, tell
  me exactly what to click rather than silently working around it with a fake
  log source

## Definition of done for this session

A live URL where I can click "break the target," watch an incident appear,
see a correct root-cause explanation, and see a real restart happen via the
Zerops API — reflected in the Zerops GUI, not just in Nomad's own database.
```
