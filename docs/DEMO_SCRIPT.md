# Nomad — Demo Script (target: under 2 minutes)

Record on the live deployed URL, not localhost. Do a full dry run at least twice before the take you'll submit — this is the single highest-leverage artifact in the submission (judged explicitly on "clarity of the story, the demo, and its reach").

---

**[0:00–0:12] Cold open — the problem, stated, not narrated over a slide**

Show the empty Nomad dashboard. One sentence, spoken plainly:

> "This is Nomad — it watches a live Zerops deployment, and when something breaks, it tells you why and fixes it."

Cut immediately. No logo animation, no team intro.

**[0:12–0:20] Show the setup is real**

Quick cut to the Zerops GUI: the `target` project's Advanced Observability → log forwarding pointed at Nomad's worker. One sentence:

> "It connects the way Zerops actually works — log forwarding, not a fake webhook."

**[0:20–0:30] Trigger the break**

Click the "Break target" button in Nomad's own dashboard (or hit the `/break` endpoint directly, whichever reads better on camera). Say nothing — let it happen.

**[0:30–0:55] The detection + diagnosis moment — this is the payoff, give it room**

Cut to the incident feed: a new row appears, status flips from `open` → `diagnosing` → `fix_suggested` in view. Open the row detail drawer. Read (or let the viewer read) the plain-English root cause explanation. This should NOT be narrated over — the text itself is the proof of the product working. Hold for 3–4 seconds after it appears before moving on.

**[0:55–1:15] The real fix**

Click "Apply fix" (or show it auto-applying if confidence was high). Cut to a split view or quick cut to the Zerops GUI showing the service actually restarting — this is the moment that proves it's not fake. One sentence:

> "That's a real restart, through the Zerops API — not a mock."

**[1:15–1:30] Incident closes**

Back to the dashboard: incident status → `fixed`, target service healthy again. Let it breathe for a second.

**[1:30–1:50] Zoom out — architecture, fast**

Quick screen of the architecture diagram (from the technical spec) with a voiceover, ~15 seconds max:

> "Under the hood: a syslog listener ingesting real Zerops logs, Claude doing root-cause analysis against the logs and deploy history, and the Zerops REST API closing the loop. Five services, one Zerops project."

**[1:50–2:00] Close**

> "Nomad — the SRE Zerops doesn't come with. Live at [URL], code's public."

Cut. No outro music swell, no "thanks for watching."

---

## Filming notes

- Record the browser at a resolution/zoom level where text in the incident drawer is actually legible on a phone screen — judges may watch on mobile
- Cut dead air aggressively; nothing above should take longer than stated even if the real system is a bit slower — speed up in editing if needed, but don't fake the *result*
- If the LLM diagnosis text is long, choose (in testing beforehand) a break scenario that produces a root-cause explanation that reads well in 3–4 seconds, not a wall of text
- Keep test failures OUT of the final cut — if the break scenario misfires on a take, cut the whole take, don't patch around it
- Voice: plain, direct, slightly fast — this is a technical demo for other technical people and judges who've watched dozens of these, not a product launch trailer
