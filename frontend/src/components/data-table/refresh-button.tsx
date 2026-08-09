"use client";

import { Button } from "@dtf/registry/components/ui/button";
import { RefreshCw } from "lucide-react";

export function RefreshButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      aria-label="Refresh"
      className="size-8"
    >
      <RefreshCw className="size-4" />
    </Button>
  );
}
