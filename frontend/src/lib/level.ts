import type { Level } from "@nomad/shared";
import { cn } from "@/lib/utils";

export function getLevelColor(
  value: Level,
): Record<"text" | "bg" | "border", string> {
  switch (value) {
    case "critical":
      return {
        text: "text-destructive",
        bg: "bg-destructive",
        border: "border-destructive",
      };
    case "error":
      return {
        text: "text-error",
        bg: "bg-error",
        border: "border-error",
      };
    case "warning":
      return {
        text: "text-warning",
        bg: "bg-warning",
        border: "border-warning",
      };
    case "info":
    default:
      return {
        text: "text-info",
        bg: "bg-info",
        border: "border-info",
      };
  }
}

export function getLevelRowClassName(value: Level): string {
  switch (value) {
    case "critical":
      return cn(
        "bg-destructive/10 hover:bg-destructive/15 focus-visible:bg-destructive/15 data-detail:bg-destructive/20 data-checked:bg-destructive/20",
        "dark:bg-destructive/15 dark:hover:bg-destructive/25 dark:data-detail:bg-destructive/30 dark:data-checked:bg-destructive/30",
      );
    case "error":
      return cn(
        "bg-error/5 hover:bg-error/10 focus-visible:bg-error/10 data-detail:bg-error/20 data-checked:bg-error/20",
        "dark:bg-error/10 dark:hover:bg-error/20 dark:focus-visible:bg-error/20 dark:data-detail:bg-error/30 dark:data-checked:bg-error/30",
      );
    case "warning":
      return cn(
        "bg-warning/5 hover:bg-warning/10 focus-visible:bg-warning/10 data-detail:bg-warning/20 data-checked:bg-warning/20",
        "dark:bg-warning/10 dark:hover:bg-warning/20 dark:data-detail:bg-warning/30 dark:data-checked:bg-warning/30",
      );
    case "info":
    default:
      return cn(
        "bg-info/5 hover:bg-info/10 focus-visible:bg-info/10 data-detail:bg-info/20 data-checked:bg-info/20",
        "dark:bg-info/10 dark:hover:bg-info/20 dark:data-detail:bg-info/30 dark:data-checked:bg-info/30",
      );
  }
}

export function getLevelLabel(value: Level): string {
  return value.toUpperCase();
}
