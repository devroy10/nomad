"use client";

import { CornerDots } from "@/components/ui/corner-dots";
import { ArrowRight } from "@/components/ui/icons";
import {
  ListenerIllustration,
  TasksIllustration,
  BrowserIllustration,
  FixIllustration,
  AutomationsIllustration,
  IncidentLogIllustration,
  ByoiIllustration,
} from "@/components/pillar-visuals";

export type PillarVisual =
  | "issues" // Observe — syslog listener (static SVG)
  | "parallel-agents" // Detect — parallel scanners (static SVG)
  | "in-app-browser" // Diagnose — incidents dashboard (static SVG)
  | "diff-review" // Fix — remediation review (static SVG)
  | "automations" // Forwarding — log forwarding (static SVG)
  | "ssh" // Incident Log — searchable history (static SVG)
  | "byoi"; // Human in the Loop — approval gate (static SVG)

export function PillarCard({
  title,
  description,
  label,
  visual,
}: {
  title: string;
  description: string;
  label: string;
  visual: PillarVisual;
}) {
  return (
    <div className="group/cardlink relative flex flex-col border-x border-b border-border bg-surface-1 transition-colors hover:bg-surface-1/80">
      <CornerDots />
      <div className="relative aspect-368/260 overflow-hidden border-b border-border bg-bg-primary">
        <CornerDots />
        <div className="absolute inset-0">
          <PillarVisualArt visual={visual} />
        </div>
      </div>
      <div className="flex flex-1 flex-col justify-between gap-8 p-6">
        <div>
          <h2 className="-tracking-[0.04em] text-[16px] font-medium leading-[1.3] text-text-primary">
            {title}
          </h2>
          <p className="mt-1 -tracking-[0.04em] text-[16px] text-balance leading-[1.3] text-text-tertiary">
            {description}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <span className="-tracking-[0.03em] text-[12px] font-medium leading-[1.3] text-accent-primary transition-colors group-hover/cardlink:text-accent-primary/80">
            [ {label} ]
          </span>
          <ArrowRight className="text-text-secondary" />
        </div>
      </div>
    </div>
  );
}

function PillarVisualArt({ visual }: { visual: PillarVisual }) {
  return (
    <div className="absolute inset-0">
      <StaticIllustration visual={visual} />
    </div>
  );
}

function StaticIllustration({ visual }: { visual: PillarVisual }) {
  switch (visual) {
    case "issues":
      return <ListenerIllustration className="size-full" />;
    case "parallel-agents":
      return <TasksIllustration className="size-full" />;
    case "in-app-browser":
      return <BrowserIllustration className="size-full" />;
    case "diff-review":
      return <FixIllustration className="size-full" />;
    case "automations":
      return <AutomationsIllustration className="size-full" />;
    case "ssh":
      return <IncidentLogIllustration className="size-full" />;
    case "byoi":
      return <ByoiIllustration className="size-full" />;
    default:
      return null;
  }
}
