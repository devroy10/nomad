# Nomad — Submission Checklist

## Judging criteria mapping (Zerops Challenge)

Confirm each is unambiguous in the final submission before you stop:

| Criteria | Where it shows up |
|---|---|
| **Idea** | One-pager framing: "the SRE Zerops doesn't come with" — specific, not generic AI wrapper |
| **Execution** | A real fix applied live during judging/demo, not just detection |
| **How Zerops is used** | Log forwarding (syslog-ng) + REST API (`/service-stack`, `/app-version`) + multi-service `zerops.yaml` — all load-bearing, not decorative |
| **Build post clarity** | Story: problem → what Nomad does → how it uses Zerops → demo → what's next |
| **Demo/reach** | 2-minute video, tight, no narration needed to follow |

## Hard requirements (from the rules page)

- [ ] Solo submission (confirm no team constraints violated)
- [ ] Live URL, reachable, **stays up through judging** (don't let it sleep/crash after the deadline — check Zerops service isn't set to scale to zero in a way that kills the demo)
- [ ] Public GitHub repository
- [ ] Deployed on Zerops (confirm all services show green/running in the GUI before submitting)
- [ ] Registration completed before the deadline (separate from project submission — don't confuse the two)

## Deliverables

- [ ] **Live deployed dashboard URL**
- [ ] **Public GitHub repo** — clean README (see below), no committed secrets (`.env` in `.gitignore`, confirm `ANTHROPIC_API_KEY` / `ZEROPS_API_TOKEN` never committed)
- [ ] **2-minute demo video** — per `DEMO_SCRIPT.md`, uploaded and linked
- [ ] **Build post** — the story, written for humans, not judges specifically (judged on clarity + reach)
- [ ] **`zerops.yaml`** — present at repo root, matches what's actually deployed (not a stale draft)

## README checklist

- [ ] One-paragraph summary a stranger can understand in 10 seconds
- [ ] Architecture diagram (reuse from `03-technical-spec-and-file-structure.md`)
- [ ] "How this uses Zerops" section, explicit — log forwarding + REST API, not just "we deployed here"
- [ ] Setup instructions if someone wants to point Nomad at their own project
- [ ] Link to demo video
- [ ] Screenshot of the dashboard mid-incident (not empty state)

## Pre-submission QA pass (do this ~2 hours before deadline, not 10 minutes before)

- [ ] Trigger the demo "break" scenario fresh, end to end, on the actual deployed URL — not localhost
- [ ] Confirm the fix really gets applied (check Zerops GUI shows the restart/rollback actually happened, not just that Nomad's dashboard *says* it did)
- [ ] Reload the dashboard from a clean browser/incognito — confirm nothing depends on your local dev state
- [ ] Check the incident table's filters/sort actually work against real data, not just seed data
- [ ] Confirm chat panel (if shipped) doesn't error on an empty incident history
- [ ] Kill and restart the `worker` service once, manually, to confirm the syslog listener reconnects and doesn't need a manual nudge

## Common pitfalls (from researched winner/loser patterns)

- **Detection without a real fix** — judges have seen this; "we would auto-remediate but didn't have time" reads as unfinished, not ambitious. Ship one real fix, even a narrow one, over three half-built ones.
- **Zerops as an afterthought host** — if the write-up could describe the same product deployed on Vercel with no changes, the "how Zerops is used" score suffers. Keep the log-forwarding + REST API usage front and center in both the README and the demo.
- **Demo depends on a real failure happening on cue** — it won't. The manual "break" trigger is mandatory, not optional polish.
- **Overloaded scope** — a working restart-only loop beats a half-working restart+rollback+patch+voice loop. Cut Tier 2/3 features ruthlessly if Tier 1 isn't rock solid by hour 32.

## Submission form — have ready before you open it

- Project name, one-line tagline, category (if applicable)
- Live URL
- GitHub URL
- Video URL
- Build post URL/text
- Tech stack list
- Team: solo, your name/handle
