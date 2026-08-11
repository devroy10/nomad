import { PillarCard, type PillarVisual } from "@/components/pillar-card";
import { HeaderBar } from "@/components/ui/header-bar";
import { SectionSpacer } from "@/components/section-spacer";

const CORE_WORKFLOW: {
  title: string;
  description: string;
  label: string;
  visual: PillarVisual;
}[] = [
  {
    title: "Watch logs as they happen.",
    description:
      "A UDP syslog listener (RFC 5424) ingests every line your Zerops services forward. Parsed, structured, and stored.",
    label: "Observe",
    visual: "issues",
  },
  {
    title: "Detect anomalies automatically.",
    description:
      "Every 15 seconds Nomad scans for error and critical bursts: five or more lines for one service in a minute opens an incident.",
    label: "Detect",
    visual: "parallel-agents",
  },
  {
    title: "Explain failures in plain English.",
    description:
      "Claude correlates the burst against recent logs and returns a root cause, a suggested fix, and a confidence score.",
    label: "Diagnose",
    visual: "in-app-browser",
  },
  {
    title: "Apply real fixes, not mockups.",
    description:
      "Restart a service stack or roll back an app version through the Zerops REST API, or heal the demo target over the private network.",
    label: "Fix",
    visual: "diff-review",
  },
];

export function CoreWorkflow() {
  return (
    <section className="containers isolate -mt-px flex flex-1 flex-col">
      <div className="flex w-full flex-1 flex-col border-x border-border">
        <div className="isolate ">
          <div className="border-dashed-b">
            <HeaderBar label="[ The Loop ]" />
          </div>
          <div className="border-dashed-b">
            <div className="mx-auto grid max-w-[1160px] grid-cols-1 gap-6 tablet:grid-cols-2">
              {CORE_WORKFLOW.map((c) => (
                <PillarCard key={c.title} {...c} />
              ))}
            </div>
          </div>
          <SectionSpacer />
        </div>
      </div>
    </section>
  );
}
