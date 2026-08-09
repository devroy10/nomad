import Link from "next/link";
import { Activity } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-10 sm:flex-row">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Activity className="size-4" />
          Nomad
        </div>
        <p className="text-sm text-muted-foreground">
          Watch. Diagnose. Fix.
        </p>
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <Link href="/dashboard" className="hover:text-foreground">
            Dashboard
          </Link>
          <Link href="/dashboard/logs" className="hover:text-foreground">
            Logs
          </Link>
        </div>
      </div>
    </footer>
  );
}
