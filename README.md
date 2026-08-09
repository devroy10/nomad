<p align="center">
  <strong>Nomad — the SRE Zerops doesn't come with.</strong>
</p>
<p align="center">
  Watches a live Zerops deployment, explains why it broke, and fixes what it can — live.
</p>
<p align="center">
  <a href="#how-it-works">How it works</a>
  ·
  <a href="#quickstart">Quickstart</a>
  ·
  <a href="#api">API</a>
  ·
  <a href="#development">Development</a>
  ·
  <a href="docs/03-technical-spec-and-file-structure.md">Architecture</a>
  ·
  <a href="docs/DEMO_SCRIPT.md">Demo script</a>
</p>

---

# Nomad

Nomad sits next to a Zerops project and closes the loop between "something broke" and "it's fixed." It receives syslog from the services it watches, detects error bursts, has Claude correlate the failure against recent log lines to find the root cause, and applies a fix — a real restart or rollback through the Zerops REST API, or a heal over the private network for the bundled demo service. Every incident lands in a searchable, filterable timeline.

It is built on Zerops primitives end to end: syslog log-forwarding for ingestion, the REST API for remediation, and `zerops.yaml` for topology. Zerops is the subject of the product, not just the host.

## Contents

- [How it works](#how-it-works)
- [Services](#services)
- [The loop, end to end](#the-loop-end-to-end)
- [Quickstart](#quickstart)
- [Setup](#setup)
- [API](#api)
- [What Nomad can do](#what-nomad-can-do)
- [Scope](#scope)
- [Development](#development)
- [License](#license)

## How it works

1. **Observe.** The `worker` runs a UDP syslog listener (RFC 5424, tolerant of RFC 3164). Any service in the project forwards its logs there; the `target` demo service does it over the private network.
2. **Detect.** Every 15 seconds the anomaly scanner looks for bursts of `error`/`critical` lines — five or more for one service within 60 seconds. A burst opens an incident.
3. **Diagnose.** Claude receives the affected service, the symptom, and the last ~50 log lines for that service, and returns a structured root cause, suggested fix, and confidence. Without `ANTHROPIC_API_KEY`, a heuristic fallback is used.
4. **Fix.** The suggested fix is recorded. Apply it from the dashboard, or Nomad can apply it itself when the failure mode is safe and well understood.
5. **Log.** The incident and its fix stay in the database, viewable in the dashboard's incident timeline.

## Services

All run in one Zerops project. `frontend`, `api`, `worker`, and `target` are Node.js 22 runtimes defined in `zerops.yaml`; `db` is a managed Postgres 18.

| Service | Runtime | Port | Role |
|---|---|---|---|
| `frontend` | Next.js (nodejs@22) | 3000 | Landing page + dashboard. Data tables with facets, cursor pagination, and a row-detail drawer for diagnosis and "Apply fix" |
| `api` | Fastify (nodejs@22) | 3000 | REST backend: incidents, logs, chat, demo break/heal, fix application |
| `worker` | Node (nodejs@22) | 3001, UDP 5140 | Syslog listener, anomaly detection, Claude diagnosis, remediation |
| `target` | Node (nodejs@22) | 4000 | Small demo app to break and heal; emits RFC 5424 syslog to `worker:5140` |
| `db` | Postgres 18 (managed) | — | `incidents`, `logs`, `fixes` tables via Drizzle ORM |

Schema and indexes live in `db/src/schema.ts`. Migrations run automatically on deploy (`zsc execOnce` gated, idempotent).

## The loop, end to end

1. Break the target: `POST /api/demo/break` → target starts emitting error lines over UDP to `worker:5140`.
2. The worker parses each line and stores it in the `logs` table.
3. The anomaly scan trips the burst threshold and opens an incident (`status: open` → `diagnosing`).
4. Claude returns a root cause and a suggested fix (`status: fix_suggested`), stored as a row in `fixes`.
5. Apply the fix: `POST /api/fixes/:incidentId/apply` → the target is healed over the private network, the fix is marked `applied`, and the incident moves to `fixed` with a resolved timestamp.

For the demo service this needs no credentials. For real services, the fix is a restart or rollback executed through the Zerops REST API, which requires `ZEROPS_API_TOKEN`.

## Quickstart

```bash
git clone https://github.com/devroy10/nomad.git && cd nomad
pnpm install
pnpm -r run build
```

Run the whole stack locally:

```bash
pnpm dev:api        # API on :3000
pnpm dev:worker     # worker on :3001, syslog on :5140
pnpm dev:target     # target on :4000
pnpm dev:frontend   # Next.js on :3000 (dashboard)
```

`api` and `worker` need `DATABASE_URL` pointing at a Postgres you can reach; the schema is applied with `pnpm db:migrate`. The frontend proxies `/api/*` to the API service.

## Setup

Environment variables for the deployed services:

| Variable | Used by | Purpose |
|---|---|---|
| `DATABASE_URL` | api, worker | Postgres connection. Auto-injected by Zerops via `${db_connectionString}` |
| `ANTHROPIC_API_KEY` | api, worker | Claude diagnosis and chat. Without it, Nomad uses a heuristic fallback |
| `ZEROPS_API_TOKEN` | api | Bearer token for the Zerops REST API — enables real service-stack restart and app-version rollback |
| `CLAUDE_MODEL` | api, worker | Claude model override (default `claude-3-5-sonnet-latest`) |

### Deploying to Zerops

`zerops.yaml` at the repo root defines the `api`, `worker`, `target`, and `frontend` setups; the managed `db` is provisioned in the Zerops dashboard. Pushing to the repo triggers a webhook build for each service; `zsc execOnce` runs the DB migration on first start.

To watch a service outside this project, point its **Advanced Observability → Log Forwarding** at the worker's public syslog endpoint. Cross-project forwarding requires **Direct Port Access** on `worker` UDP 5140 in the GUI.

## API

All routes live on the `api` service.

| Method | Path | Purpose |
|---|---|---|
| GET | `/` | Health probe |
| GET | `/api/incidents` | Incident data-table backend: filters, facets, cursor pagination, chart series |
| GET | `/api/logs` | Same, for stored syslog entries |
| POST | `/api/chat` | Ask about open incidents (`{ "question": "..." }`) |
| POST | `/api/demo/break` | Break the target demo service |
| POST | `/api/demo/heal` | Heal the target demo service |
| GET | `/api/fixes/:incidentId` | Suggested fixes for an incident |
| POST | `/api/fixes/:incidentId/apply` | Execute the incident's suggested fix |

**target** exposes `GET /`, `POST /break`, `POST /heal`, and `POST /simulate-error`. **worker** exposes `GET /` (health) and listens on UDP 5140.

## What Nomad can do

- **Syslog ingestion**: RFC 5424 and tolerant RFC 3164 parsing, including structured data. Malformed lines are dropped, never thrown.
- **Anomaly detection**: error/critical bursts (≥5 lines for one service in 60s) open an incident; a 5-minute dedup window prevents storming.
- **Claude diagnosis**: correlates the burst with recent logs for the affected service and returns `rootCause`, `fix`, `confidence`, `reasoning` as strict JSON.
- **Remediation**: the demo service is healed over the private network; real services get a restart or rollback through the Zerops REST API when a token is configured.
- **Dashboard**: filterable incident and log tables with facets, date-range charts, a row-detail drawer, and a chat panel for incident history.
- **Idempotent migrations**: `zsc execOnce ${appVersionId}` runs the Drizzle migration on container start, exactly once per version.

## Scope

- Restart/rollback of real services requires `ZEROPS_API_TOKEN` and a service or version id; the demo's `heal-target` fix works without any credentials.
- The `target` service is a demo fixture, not a supported integration. It exists so the loop can be demonstrated end to end.
- Cross-project log forwarding needs Direct Port Access on the worker's UDP 5140, configured in the Zerops GUI.
- Without `ANTHROPIC_API_KEY`, diagnosis and chat fall back to heuristics and explicit "not configured" messages.

## Development

```bash
pnpm -r run typecheck   # type-check all workspaces
pnpm -r run build       # compile all workspaces to dist/
pnpm db:generate        # regenerate Drizzle migrations
pnpm db:migrate         # apply migrations
pnpm db:push            # push schema without migration files
```

Monorepo layout (pnpm workspaces):

- `api/` — Fastify server, data-table query backend, Claude chat, Zerops REST client
- `worker/` — syslog listener, anomaly scanner, diagnosis pipeline, remediation
- `target/` — breakable demo service emitting syslog
- `frontend/` — Next.js landing page and dashboard
- `db/` — Drizzle schema, client, migration runner
- `shared/` — types shared across workspaces
- `packages/registry/` — the data-table system used by the dashboard (facet filters, cursor pagination, charts)
- `docs/` — technical spec, demo script, and challenge notes

## License

MIT
