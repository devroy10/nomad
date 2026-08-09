# Nomad — Build Plan & Winning Thesis

## The winning thesis (why this idea, evidenced)

This isn't a guess — it's pattern-matched against what actually won recent, comparable hackathons.

1. **GitLab AI Hackathon 2026 grand-tier winner, LORE** — a multi-agent knowledge system judged by Anthropic's own team as "This feels like a product, not a hackathon project." It won on depth of execution (8 agents, a real test suite), not on novelty of concept.
2. **WeMakeDevs' own prior hackathon (FutureStack, same organizer, same judging culture)** — the three headline winners were:
   - **VoiceGraph** — voice-driven automation with a *visual debugging dashboard*
   - **Sure AI** — multi-agent platform with *real, working integrations* (Stripe, Slack, Cal.com)
   - **SRE Sentinel** — an AI agent that watches Docker containers, root-causes failures, and **auto-heals them via MCP**. This is functionally the same category of product as Nomad, applied to a different sponsor's infrastructure.
3. **The general 2026 pattern across hackathon retrospectives**: judges are fatigued by "GPT wrapper" submissions. Projects that use agentic reasoning to solve one specific, real operational problem consistently outperform broader, shallower ideas.

**The conclusion this points to:** the single highest-leverage move for *this* hackathon is not "build something impressive that happens to deploy on Zerops" — it's "build something where Zerops itself is the subject." Zerops' own judging rubric confirms this explicitly: idea, execution, and *how Zerops is used* are the three criteria, and their suggested categories name "deployment analyser" directly.

Nomad is SRE Sentinel's winning formula, purpose-built for the one platform being judged this weekend, submitted to that platform's own hackathon.

## What "winning" requires, concretely

From the winner patterns above:
- A **live, working fix applied on camera** — not just detection (SRE Sentinel's "no developer needs to step in" moment)
- A **real dashboard**, not a console log (VoiceGraph, LORE)
- **Deep integration with the sponsor's actual APIs/primitives**, not a generic wrapper (Sure AI's real integrations vs. "we call OpenAI")
- A **tight, legible demo** under 2 minutes that doesn't require narration to follow

## 48-hour build plan

Solo, Node/TypeScript, deploying incrementally to Zerops from hour 1 (don't wait until the end to deploy — Zerops usage judging rewards it being real infrastructure throughout).

### Friday evening / Hour 0–4 — Foundation
- Register on Zerops, spin up the project via ZCP (or by hand), scaffold the monorepo (see `03-technical-spec-and-file-structure.md`)
- Deploy skeleton services immediately: `frontend`, `api`, `worker`, `db` (Postgres) — even empty, so Zerops usage is real from hour 4, not bolted on at hour 40
- Set up Drizzle schema + migrations for `incidents`, `logs`, `fixes` tables
- Stand up the seeded "target app" service (the thing Nomad will monitor) — keep it trivial, e.g. a small Fastify app with a couple of routes that can be made to fail on command

### Hour 4–10 — Log ingestion (Tier 1, #1–2)
- Build the syslog-ng-compatible UDP listener in the `worker` service
- Configure the target app's project to forward logs to it (Custom Log Forwarding → `s_src` source)
- Parse incoming syslog lines into the `logs` table
- Basic anomaly rules: crash-loop detection, non-2xx rate spike, service down

### Hour 10–18 — Diagnosis pipeline (Tier 1, #3)
- On anomaly detection, worker gathers: recent logs for the service, current `zerops.yaml`, recent deploy/version history (via `/app-version`)
- Calls Claude API with that context → structured diagnosis (root cause, confidence, suggested fix type)
- Writes result to `incidents` table

### Hour 18–26 — Dashboard (Tier 1, #4) — sleep somewhere in here
- Build the incident feed using the OpenStatus data-table (Drizzle-backed, ported into Fastify — see technical spec)
- Incident detail view: timeline, root cause explanation, status
- Live status indicator per monitored service

### Hour 26–32 — Real remediation (Tier 1, #5–6)
- Implement one real fix: restart via `/service-stack` REST endpoint
- Build the "break it on demand" trigger (a hidden route on the target app, or a button in Nomad's own dashboard) — this is your demo's ignition switch
- Wire the full loop end-to-end and test it live, repeatedly, until it's reliable

### Hour 32–40 — Tier 2 differentiators (pick 1–2, don't do all)
- Chat interface over incident history (highest ROI — cheap to build, great demo moment)
- Rollback as a second real fix type (via `/app-version`)
- Public status page (doubles as a build-post artifact)

### Hour 40–46 — Polish, harden, record
- Fix the rough edges the anomaly detector produces (false positives are worse than missed ones for a demo)
- Record the demo video per `DEMO_SCRIPT.md` — do this early enough to re-record if it's rocky
- Write the build post

### Hour 46–48 — Submit
- Final deploy check — confirm the app is reachable and will *stay* reachable through judging
- Submit repo, live URL, video, build post per `04-submission-checklist.md`

## Risk mitigation

- **Real infra failures won't happen on cue during judging** → the deliberate "break it" trigger is not optional, it is the demo
- **LLM diagnosis can hallucinate a wrong root cause on stream** → keep the demo scenarios to failure modes you've tested repeatedly (crash loop, bad deploy) rather than open-ended organic failures
- **Auto-fix could do something scary in front of judges** → scope auto-fix to two safe, reversible actions only (restart, rollback); everything else is "suggested, not applied"
- **Log forwarding setup could eat hours** → build and test this first (Hour 4–10 slot), since everything downstream depends on it working
