import { GitBranch, ShieldCheck, TerminalSquare, Activity } from "lucide-react";

const features = [
  {
    icon: Activity,
    title: "Syslog-native ingestion",
    body: "A UDP RFC 5424 listener that accepts syslog-ng forwarding straight out of Zerops Advanced Observability.",
  },
  {
    icon: ShieldCheck,
    title: "Anomaly detection",
    body: "Sliding-window rules flag error and critical bursts per service before they page anyone.",
  },
  {
    icon: TerminalSquare,
    title: "Claude-powered diagnosis",
    body: "Every incident is summarized from the actual log context, with a confidence score and reasoning.",
  },
  {
    icon: GitBranch,
    title: "Real remediation",
    body: "Suggested fixes apply through the Zerops REST API — service-stack restart or app-version rollback.",
  },
];

export function Features() {
  return (
    <section id="features" className="border-t border-border/60 bg-muted/30">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight">
            Built for the Zerops way of doing things
          </h2>
          <p className="mt-4 text-muted-foreground">
            Log forwarding, managed Postgres, private networking, and the REST
            API — Nomad uses the platform as designed.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border border-border bg-card p-6"
            >
              <feature.icon className="size-6 text-primary" />
              <h3 className="mt-4 font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {feature.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
