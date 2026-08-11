import { PillarCard, type PillarVisual } from "@/components/pillar-card";
import { HeaderBar } from "@/components/ui/header-bar";
import { SectionSpacer } from "@/components/section-spacer";

const SCALE_IT: {
  title: string;
  description: string;
  label: string;
  visual: PillarVisual;
}[] = [
  {
    title: "Watch any Zerops service.",
    description:
      "Point Advanced Observability's log forwarding at Nomad's listener and any service in your project streams into one timeline.",
    label: "Forwarding",
    visual: "automations",
  },
  {
    title: "Recover with confidence.",
    description:
      "Every incident stores the diagnosis, the fix, and the outcome in a searchable history, so the next one is faster.",
    label: "Incident Log",
    visual: "ssh",
  },
  {
    title: "Stay in control.",
    description:
      "Fixes apply automatically only for safe, well-understood failures; everything else waits for a one-click approval.",
    label: "Human in the Loop",
    visual: "byoi",
  },
];

export function ScaleIt() {
  return (
    <section className="containers isolate -mt-px flex flex-1 flex-col">
      <div className="flex w-full flex-1 flex-col border-x border-border">
        <div className="isolate ">
          <div className="border-dashed-b">
            <HeaderBar label="[ Operating Model ]" />
          </div>
          <div className="border-dashed-b">
            <div className="mx-auto grid max-w-[1160px] grid-cols-1 gap-6 tablet:grid-cols-3">
              {SCALE_IT.map((c) => (
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
