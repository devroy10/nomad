# Nomad — Product One-Pager

**An autonomous SRE agent that watches, diagnoses, and heals Zerops deployments.**

Built for [The Zerops Challenge](https://www.wemakedevs.org/hackathons/zerops) (WeMakeDevs × Zerops), Aug 8–9, 2026.

---

## The problem

Zerops gives you production-grade infrastructure in minutes — but once it's live, you're on your own for operations. When a service crashes, starts erroring, or slows down, you're digging through the Logs Overview by hand, correlating it against your last few deploys, and guessing at root cause. There's no "why did this break, and what do I do about it" layer on top of Zerops today.

## The solution

Nomad sits next to a live Zerops project and closes that loop automatically:

**Observe → Diagnose → Explain → Fix → Log**

- Watches logs (via Zerops' syslog log-forwarding) and service health in real time
- When something breaks, an LLM agent correlates the failure against recent logs, the project's `zerops.yaml`, and recent deploy history to find root cause
- Explains what happened in plain English, not a stack trace dump
- For safe, well-understood failure modes, applies a real fix through the Zerops REST API — restart a crashed service, roll back to the last known-good deploy
- Logs every incident to a searchable, filterable timeline

## Who it's for

Any team or solo developer running production or staging workloads on Zerops who doesn't want to be the human anomaly detector at 2am.

## Why this, why now (for this hackathon specifically)

Zerops' own judging criteria weights "idea, execution, and **how Zerops is used**" above all else, and their suggested project categories explicitly include a "deployment analyser" and "architecture visualiser." Nomad doesn't host on Zerops incidentally — **Zerops is the subject of the product**. Every core feature (log ingestion, root cause, remediation) is built directly on Zerops-specific primitives (log forwarding, the REST API, `zerops.yaml`). That is the single highest-leverage thing this project can do to win.

## What makes it demoable, not just clever

Break something live on stream → dashboard lights up → agent explains why → agent fixes it → incident closes. Under two minutes, no narration needed to understand what happened.

## Tech stack

- **Frontend:** React (Vite) + the [OpenStatus data-table](https://data-table.openstatus.dev) system for the incident/log table
- **API:** Fastify (Node/TypeScript)
- **Worker:** Node/TypeScript — syslog-ng-compatible log receiver + anomaly detection + diagnosis pipeline
- **Database:** PostgreSQL (via Drizzle ORM)
- **LLM:** Claude API (diagnosis + chat)
- **Platform:** Zerops (multi-service: frontend, API, worker, Postgres, plus a small seeded target app to monitor for the demo)

## Prizes on the table

MacBook, Logitech MX Master 3, $5,000 in Zerops credits — split by category (idea/execution/Zerops usage, and best build post/demo).

## One-sentence pitch

*"Nomad is the SRE Zerops doesn't come with — it watches your deployment, tells you why it broke, and fixes what it can, live."*
