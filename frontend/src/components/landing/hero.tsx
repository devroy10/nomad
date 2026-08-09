import { ArrowRight, RadioTower } from "lucide-react";

export function Hero() {
  return (
    <section className="relative mx-auto flex max-w-6xl flex-col items-center px-6 pb-24 pt-28 text-center">
      <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground">
        <RadioTower className="size-3.5" />
        Autonomous SRE for Zerops
      </div>
      <h1 className="mt-6 max-w-3xl text-balance text-5xl font-semibold tracking-tight sm:text-6xl">
        The SRE Zerops doesn't come with
      </h1>
      <p className="mt-6 max-w-2xl text-pretty text-lg text-muted-foreground">
        Nomad watches a live Zerops deployment through its forwarded syslog,
        diagnoses failures with Claude, and applies real fixes through the
        Zerops REST API — restart, rollback, or heal — without you digging
        through the dashboard at 3 a.m.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <a
          href="/dashboard"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          Open the dashboard
          <ArrowRight className="size-4" />
        </a>
        <a
          href="#how-it-works"
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
        >
          How it works
        </a>
      </div>
      <div className="mt-16 w-full max-w-3xl overflow-hidden rounded-xl border border-border bg-card text-left shadow-sm">
        <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-error" />
            <span className="size-2.5 rounded-full bg-warning" />
            <span className="size-2.5 rounded-full bg-success" />
          </div>
          <span className="font-mono text-xs text-muted-foreground">
            target → anomaly → incident #12
          </span>
        </div>
        <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed">
          <code>
{`[anomaly] 9 error log lines from "target" in the last minute
[incident] #12 opened  status=open      level=error
[diagnosis] rootCause: database pool exhausted (timeout waiting for connection)
            confidence: 0.91
[fix]       suggested  action=restart
[apply]     target healed · incident #12 → fixed`}
          </code>
        </pre>
      </div>
    </section>
  );
}
