import Link from "next/link";
import { ArrowRight, Bot, Radar, Wrench } from "lucide-react";

const steps = [
  {
    icon: Radar,
    title: "Watch",
    body: "Zerops forwards your live logs to Nomad's syslog listener over UDP (RFC 5424).",
  },
  {
    icon: Bot,
    title: "Diagnose",
    body: "Nomad detects error bursts, then Claude reads the recent log context and proposes a root cause.",
  },
  {
    icon: Wrench,
    title: "Fix",
    body: "Every diagnosis lands as a suggested fix you can apply — restart, rollback, or heal — via the Zerops REST API.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto max-w-6xl px-6 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-medium text-muted-foreground">
          The loop
        </p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight">
          Watch. Diagnose. Fix.
        </h2>
        <p className="mt-4 text-muted-foreground">
          Nomad closes the loop between "something is wrong" and "it's fixed" —
          without a human glued to the logs.
        </p>
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {steps.map((step, index) => (
          <div
            key={step.title}
            className="relative rounded-xl border border-border bg-card p-6"
          >
            <span className="text-xs font-mono text-muted-foreground">
              step {index + 1}
            </span>
            <step.icon className="mt-4 size-6 text-primary" />
            <h3 className="mt-3 font-semibold">{step.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{step.body}</p>
          </div>
        ))}
      </div>
      <div className="mt-10 text-center">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          See it in action
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  );
}
