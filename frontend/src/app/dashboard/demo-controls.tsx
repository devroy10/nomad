"use client";

import { Button } from "@dtf/registry/components/ui/button";
import { HeartPulse, LoaderCircle, Play } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

export function DemoControls() {
  const [busy, setBusy] = React.useState<"break" | "heal" | null>(null);

  async function run(action: "break" | "heal") {
    setBusy(action);
    try {
      const res = await fetch("/dashboard/api/demo", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string; detail?: unknown };
      if (!res.ok || !json.ok) {
        toast.error(json.error ?? "Demo call failed");
        return;
      }
      if (action === "break") {
        toast.success("Target broken — the incident table will pick it up shortly");
      } else {
        toast.success("Target healed");
      }
    } catch {
      toast.error("Demo call failed");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        size="sm"
        variant="destructive"
        disabled={busy !== null}
        onClick={() => run("break")}
      >
        {busy === "break" ? (
          <LoaderCircle className="size-4 animate-spin" />
        ) : (
          <Play className="size-4" />
        )}
        Break target
      </Button>
      <Button
        size="sm"
        variant="outline"
        disabled={busy !== null}
        onClick={() => run("heal")}
      >
        {busy === "heal" ? (
          <LoaderCircle className="size-4 animate-spin" />
        ) : (
          <HeartPulse className="size-4" />
        )}
        Heal target
      </Button>
    </div>
  );
}
