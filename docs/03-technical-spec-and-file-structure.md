# Nomad — Technical Spec & File Structure

## 1. Confirmed Zerops integration model

Two separate, confirmed mechanisms — do not conflate them.

### 1a. Control actions → Zerops REST API

- **Base URL:** `https://api.app-prg1.zerops.io/api/rest/public`
- **Auth:** Bearer token (Personal Access Token, generated in Zerops GUI under Access Token management). The user pastes this into Nomad's setup screen; store it encrypted in the `projects` table.
- **Swagger:** `https://api.app-prg1.zerops.io/api/rest/public/swagger`
- Relevant resource groups (note the non-obvious naming):
  - **`/service-stack`** — service management. Use for **restart**.
  - **`/app-version`** — application versions, builds, deployments. Use for **rollback** (Zerops keeps the last 10 versions; reactivating an older one is the rollback mechanism).
  - **`/project`** — project metadata (to resolve project/service IDs on setup).
  - **`/project-env`** / **`/user-data`** — env variable management (stretch: patch config).
- This is the only way to *act* on a Zerops project programmatically. There is no MCP-less alternative for a hosted product like Nomad — MCP (ZCP) is for coding agents in a dev loop, not for a deployed third-party service, so Nomad talks to the REST API directly.

### 1b. Log ingestion → syslog-ng log forwarding (NOT a pull API)

Zerops does **not** expose a "fetch logs" REST endpoint for arbitrary querying. Logs live in the built-in logger service and reach the outside world in exactly one way: **Advanced Observability → Log Forwarding**, which uses **syslog-ng** and supports forwarding to any syslog-ng-compatible target.

Implication for Nomad: the `worker` service must run a small **UDP syslog listener** (RFC 5424 / syslog-ng compatible) that the *monitored* Zerops project forwards logs to. Setup, from the user's side:
1. In the monitored project → **Advanced Observability** → "Setup forwarding to any syslog-ng compatible software"
2. Point it at Nomad's `worker` service hostname/port (public port, since forwarding crosses project boundaries — see §1c)
3. **Important:** Zerops requires the source config name to be `s_src` (not `s_sys`, despite most vendor docs assuming Papertrail-style naming) — Nomad's listener doesn't need to care about this, it's config on the sender side, but this should be called out explicitly in Nomad's setup instructions to the user.

This is genuinely one of Nomad's best demo beats: "connect your project to Nomad" is a two-minute, two-click setup on real Zerops infrastructure — not a fake API key paste.

### 1c. Cross-project networking

Since Nomad and the monitored app are logically separate concerns, plan for them as **separate Zerops projects** (this also matches how a real user would use Nomad against *their own* existing project). Per Zerops docs, services in different projects don't share a private network — the `worker`'s syslog listener must be exposed via **Direct Port Access** (public UDP port, optionally firewalled to expected source IPs).

For the hackathon demo specifically, it's simplest to run the "target app" as a service *inside the same project* as Nomad (still using public forwarding config to keep the demo honest to how a real cross-project user would set it up), so you don't fight two-project auth/networking under time pressure. Document both paths; ship the single-project version.

## 2. Architecture

```
┌─────────────────────────── Zerops Project: "nomad" ───────────────────────────┐
│                                                                                 │
│  ┌────────────┐      ┌────────────┐      ┌────────────┐      ┌─────────────┐  │
│  │  frontend  │◄────►│    api     │◄────►│     db     │      │   target    │  │
│  │  (Vite/    │ HTTP │  (Fastify) │ SQL  │ (Postgres) │      │   (demo app │  │
│  │   React)   │      │            │      │            │      │   to break) │  │
│  └────────────┘      └─────┬──────┘      └─────▲──────┘      └──────┬──────┘  │
│                             │                    │                    │        │
│                             │ SQL         ┌───────┴───────┐    syslog │        │
│                             │             │    worker     │◄──────────┘        │
│                             └────────────►│ (log listener │  UDP forward       │
│                                            │ + anomaly     │  (s_src)           │
│                                            │ + diagnosis)  │                    │
│                                            └───────┬───────┘                    │
│                                                     │ Bearer token               │
│                                                     ▼                            │
│                                        Zerops REST API (restart / rollback)      │
│                                        api.app-prg1.zerops.io                    │
│                                                     │                            │
│                                                     ▼                            │
│                                          Claude API (diagnosis + chat)           │
└──────────────────────────────────────────────────────────────────────────────────┘
```

Four Zerops services (`frontend`, `api`, `worker`, `db`) plus the `target` demo service — genuine multi-service footprint, private networking between `api`/`worker`/`db` by hostname, public HTTP for `frontend`/`api`, public UDP for `worker`'s syslog port.

## 3. `zerops.yaml` (monorepo, all services)

```yaml
zerops:
  - setup: frontend
    build:
      base: nodejs@22
      buildCommands:
        - npm install
        - npm run build --workspace=frontend
      deployFiles: frontend/dist
    run:
      base: static
      ports:
        - port: 80
          httpSupport: true

  - setup: api
    build:
      base: nodejs@22
      buildCommands:
        - npm install
        - npm run build --workspace=api
      deployFiles:
        - api/dist
        - api/package.json
        - node_modules
    run:
      base: nodejs@22
      ports:
        - port: 3000
          httpSupport: true
      start: node api/dist/index.js
      envVariables:
        DATABASE_URL: ${db_connectionString}
        ANTHROPIC_API_KEY: ${ANTHROPIC_API_KEY}

  - setup: worker
    build:
      base: nodejs@22
      buildCommands:
        - npm install
        - npm run build --workspace=worker
      deployFiles:
        - worker/dist
        - worker/package.json
        - node_modules
    run:
      base: nodejs@22
      ports:
        - port: 3001
          httpSupport: true    # health/control HTTP endpoint
        - port: 5140
          protocol: UDP        # syslog listener (public — cross-project forwarding)
      start: node worker/dist/index.js
      envVariables:
        DATABASE_URL: ${db_connectionString}
        ANTHROPIC_API_KEY: ${ANTHROPIC_API_KEY}
        ZEROPS_API_TOKEN: ${ZEROPS_API_TOKEN}

  - setup: target
    build:
      base: nodejs@22
      buildCommands:
        - npm install
        - npm run build --workspace=target
      deployFiles:
        - target/dist
        - target/package.json
        - node_modules
    run:
      base: nodejs@22
      ports:
        - port: 4000
          httpSupport: true
      start: node target/dist/index.js
```

Notes:
- `db` (Postgres) is provisioned as a managed service via the Zerops GUI/recipe, not defined in `zerops.yaml` — its connection string is exposed automatically as `${db_connectionString}` (or `db_connectionString` referenced across services per Zerops' cross-service env variable convention: `<hostname>_<VAR>`).
- `worker`'s UDP port (5140) needs **Direct Port Access** enabled in the GUI post-first-deploy (this can't be done from `zerops.yaml` alone — the public IP/port mapping is a project-level GUI/API step).
- `frontend` deploys as a static build (Vite output) — fastest, cheapest to run.

## 4. Monorepo file structure

```
nomad/
├─ zerops.yaml
├─ package.json                  # npm workspaces root
├─ tsconfig.base.json
│
├─ db/
│  └─ drizzle/
│     ├─ schema.ts               # incidents, logs, fixes, projects tables
│     ├─ index.ts                # drizzle(node-postgres) client
│     └─ migrations/
│
├─ api/                          # Fastify API service
│  ├─ package.json
│  ├─ src/
│  │  ├─ index.ts                # Fastify bootstrap
│  │  ├─ plugins/
│  │  │  ├─ db.ts                # decorate fastify with drizzle db
│  │  │  └─ cors.ts
│  │  ├─ routes/
│  │  │  ├─ incidents/
│  │  │  │  ├─ index.ts          # GET /api/incidents  (data-table backend, see §5)
│  │  │  │  └─ [id].ts           # GET /api/incidents/:id
│  │  │  ├─ chat.ts              # POST /api/chat  (ask about incident history)
│  │  │  ├─ demo.ts              # POST /api/demo/break  (trigger the demo scenario)
│  │  │  └─ fixes.ts             # POST /api/fixes/:incidentId/apply
│  │  └─ lib/
│  │     ├─ zerops-client.ts     # thin wrapper around Zerops REST API
│  │     └─ table/               # PORTED from data-table.openstatus.dev — see §5
│  │        ├─ build-where.ts
│  │        ├─ build-order-by.ts
│  │        ├─ build-cursor-pagination.ts
│  │        └─ compute-facets.ts
│  └─ tsconfig.json
│
├─ worker/                       # log receiver + anomaly detection + diagnosis
│  ├─ package.json
│  ├─ src/
│  │  ├─ index.ts                # bootstrap: starts syslog listener + HTTP health server
│  │  ├─ syslog/
│  │  │  ├─ listener.ts          # UDP server, RFC5424 parsing
│  │  │  └─ parse.ts
│  │  ├─ anomaly/
│  │  │  ├─ rules.ts             # crash-loop, 5xx spike, service-down detectors
│  │  │  └─ evaluate.ts
│  │  ├─ diagnosis/
│  │  │  ├─ context-builder.ts   # gathers recent logs + zerops.yaml + version history
│  │  │  ├─ claude-client.ts     # Claude API call, structured output
│  │  │  └─ prompt.ts
│  │  ├─ remediation/
│  │  │  ├─ restart.ts           # calls /service-stack restart
│  │  │  └─ rollback.ts          # calls /app-version rollback
│  │  └─ lib/
│  │     └─ zerops-client.ts     # shared with api/ (consider a shared package)
│  └─ tsconfig.json
│
├─ frontend/                     # React + Vite dashboard
│  ├─ package.json
│  ├─ vite.config.ts
│  ├─ src/
│  │  ├─ main.tsx
│  │  ├─ App.tsx
│  │  ├─ components/
│  │  │  └─ data-table/          # from data-table.openstatus.dev agent skill
│  │  ├─ incidents/
│  │  │  ├─ table-schema.tsx     # col.* definitions (see §5)
│  │  │  ├─ column-mapping.ts
│  │  │  ├─ schema.ts            # zod ColumnSchema
│  │  │  ├─ query-options.ts     # react-query infinite query
│  │  │  ├─ client.tsx           # DataTableInfinite wiring
│  │  │  └─ IncidentDetail.tsx   # row detail / sheet view
│  │  ├─ chat/
│  │  │  └─ ChatPanel.tsx
│  │  └─ lib/
│  │     └─ api.ts
│  └─ index.html
│
├─ target/                       # seeded demo app Nomad monitors
│  ├─ package.json
│  └─ src/
│     └─ index.ts                # a couple routes + a hidden /break endpoint
│
└─ shared/
   └─ types.ts                   # Incident, LogEntry, Fix, DiagnosisResult types
```

## 5. Data-table integration (adapted from data-table.openstatus.dev, Fastify not Next.js)

The library's own file checklist assumes Next.js route handlers. The actual filtering/pagination/faceting logic is framework-agnostic (`buildWhereConditions`, `buildOrderBy`, `buildCursorPagination`, `computeFacets` from `@/lib/drizzle`) — port these into `api/src/lib/table/` directly, don't try to force Next.js conventions into Fastify.

- **Schema** (`db/drizzle/schema.ts`): `incidents` table — `id`, `level` (enum: `info` | `warning` | `error` | `critical`), `service` (text — which Zerops service), `symptom` (text), `rootCause` (text, nullable until diagnosed), `status` (enum: `open` | `diagnosing` | `fix_suggested` | `fixed`), `fixApplied` (text, nullable), `createdAt`, `resolvedAt`
- **Column mapping** (`frontend/src/incidents/column-mapping.ts`): maps UI keys → Drizzle columns, same pattern as the docs example
- **Table schema** (`frontend/src/incidents/table-schema.tsx`): use `col.presets.logLevel(["info","warning","error","critical"])` for `level` — this preset exists specifically for this use case — plus `col.string().filterable("input")` for `service`/`symptom`, `col.timestamp().display("timestamp").defaultOpen().sortable()` for `createdAt`
- **API route** (`api/src/routes/incidents/index.ts`): Fastify handler that mirrors `createDrizzleHandler`'s three-pass filtering — call the ported `buildWhereConditions`/`buildCursorPagination`/`computeFacets` helpers directly against the `incidents` Drizzle table, return the same `{ data, meta: { totalRowCount, filterRowCount, facets }, prevCursor, nextCursor }` shape so the client components need zero changes
- **State management**: use the **Zustand adapter**, not `nuqs` — `nuqs` assumes Next.js's router; Zustand is the framework-agnostic option the library explicitly supports and is the correct choice for a Vite app
- **Client** (`frontend/src/incidents/client.tsx`): same `DataTableInfinite` + `DataTableStoreProvider` wiring as the docs example, with `adapterType="zustand"` and `useZustandAdapter` in place of `useNuqsAdapter`
- Row detail drawer (`.sheet()` column config) is the natural home for the full diagnosis text + "Apply fix" button

## 6. Diagnosis pipeline detail

1. Anomaly detector in `worker` flags a pattern (e.g., same service restarts 3x within 60s, or 5xx rate > 20% over a rolling window)
2. `context-builder.ts` assembles:
   - Last ~50 log lines for the affected service (from the `logs` table, populated by the syslog listener)
   - The project's current `zerops.yaml` (fetched via `/app-version` or cached at setup time)
   - Last 3 deploy timestamps/versions for that service (via `/app-version`)
3. `claude-client.ts` sends this as structured context, requests a structured response: `{ rootCause: string, confidence: "low"|"medium"|"high", suggestedFix: "restart"|"rollback"|"manual", explanation: string }`
4. Result written to `incidents` table, status → `fix_suggested`
5. If `suggestedFix` is `restart` or `rollback` **and** confidence is `high` **and** auto-apply is enabled for that project → `remediation/*.ts` calls the Zerops REST API, status → `fixed`
6. Otherwise, fix stays suggested until a human clicks "Apply" in the dashboard (calls `POST /api/fixes/:incidentId/apply`, which does the same REST call server-side)

## 7. Environment variables required

| Variable | Used by | Purpose |
|---|---|---|
| `DATABASE_URL` | api, worker | Postgres connection (auto-injected by Zerops) |
| `ANTHROPIC_API_KEY` | api, worker | Claude API calls |
| `ZEROPS_API_TOKEN` | worker (and api, for manual fix apply) | Bearer token for Zerops REST API |
| `ZEROPS_PROJECT_ID` | worker | Which project's services to act on |

## 8. Key risks to test early, not late

- UDP syslog listener actually receiving forwarded logs cross-project (test by hour 10, not hour 40)
- `/service-stack` restart endpoint's exact request shape (confirm against Swagger at setup time, not from memory)
- `/app-version` rollback semantics — confirm whether "activate an older version" is a POST to a specific endpoint or a PATCH; check the Swagger UI directly since exact verb/payload isn't in the narrative docs
