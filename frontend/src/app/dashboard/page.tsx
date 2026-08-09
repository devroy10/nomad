import Link from "next/link";
import { DemoControls } from "./demo-controls";
import { ChatBox } from "./chat-box";
import { AlertTriangle, ScrollText } from "lucide-react";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Mission control</h1>
          <p className="text-sm text-muted-foreground">
            Break the demo target and watch Nomad detect, diagnose, and suggest a fix.
          </p>
        </div>
        <DemoControls />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Link
          href="/dashboard/incidents"
          className="group rounded-xl border border-border bg-card p-6 transition-colors hover:bg-muted/40"
        >
          <AlertTriangle className="size-6 text-primary" />
          <h2 className="mt-4 font-semibold">Incidents</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Anomaly detection, Claude diagnoses, and suggested fixes. Apply a fix
            straight from the row sheet.
          </p>
        </Link>
        <Link
          href="/dashboard/logs"
          className="group rounded-xl border border-border bg-card p-6 transition-colors hover:bg-muted/40"
        >
          <ScrollText className="size-6 text-primary" />
          <h2 className="mt-4 font-semibold">Logs</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Every syslog line forwarded to the listener, filterable and charted.
          </p>
        </Link>
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="font-semibold">Ask Nomad</h2>
          <p className="mt-1 mb-4 text-sm text-muted-foreground">
            Q&A over the open incidents.
          </p>
          <ChatBox />
        </div>
      </div>
    </div>
  );
}
