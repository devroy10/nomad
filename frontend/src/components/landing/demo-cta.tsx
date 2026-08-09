import Link from "next/link";
import { Activity, ArrowRight } from "lucide-react";

export function DemoCta() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <div className="mx-auto flex max-w-2xl flex-col items-center rounded-2xl border border-border bg-card p-10 text-center">
        <Activity className="size-8 text-primary" />
        <h2 className="mt-4 text-2xl font-semibold tracking-tight">
          Try the live demo
        </h2>
        <p className="mt-3 text-muted-foreground">
          Break the bundled demo target, watch Nomad detect the burst, read the
          Claude diagnosis, and apply the suggested fix — all from the
          dashboard.
        </p>
        <Link
          href="/dashboard"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          Go to incidents
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  );
}
