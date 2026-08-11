import { col, createTableSchema } from "@dtf/registry/lib/table-schema";
import type { Level } from "@nomad/shared";
import { INCIDENT_STATUSES, LEVELS } from "@/lib/constants";
import { getLevelColor } from "@/lib/level";
import { cn } from "@/lib/utils";

export const tableSchema = createTableSchema({
  select: col.select().size(37),

  level: col
    .presets
    .logLevel(LEVELS)
    .label("Level")
    .filterable("checkbox", {
      options: LEVELS.map((level) => ({ label: level, value: level })),
      component: (props) => {
        const value = props.value as Level;
        return (
          <div className="flex w-full max-w-28 items-center justify-between gap-2 font-mono">
            <span className="text-foreground/70 group-hover:text-accent-foreground capitalize">
              {props.label}
            </span>
            <div
              className={cn("h-2.5 w-2.5 rounded-[2px]", getLevelColor(value).bg)}
            />
          </div>
        );
      },
    })
    .size(90),

  status: col
    .enum(INCIDENT_STATUSES)
    .label("Status")
    .filterable("checkbox", {
      options: INCIDENT_STATUSES.map((s) => ({ label: s, value: s })),
    })
    .size(120),

  service: col.string().label("Service").filterable("input").size(110),

  symptom: col.string().label("Symptom").filterable("input").size(280),

  date: col
    .timestamp()
    .label("Created")
    .display("timestamp")
    .sortable()
    .defaultOpen()
    .size(180),

  id: col
    .string()
    .label("Incident ID")
    .notFilterable()
    .hidden()
    .sheet({ label: "Incident ID", skeletonClassName: "w-64" }),

  rootCause: col
    .string()
    .optional()
    .label("Root cause")
    .notFilterable()
    .hidden()
    .sheet({ label: "Root cause", skeletonClassName: "w-64" }),

  fixApplied: col
    .string()
    .optional()
    .label("Fix")
    .notFilterable()
    .hidden()
    .sheet({ label: "Fix applied", skeletonClassName: "w-40" }),

  resolvedAt: col
    .timestamp()
    .optional()
    .label("Resolved")
    .notFilterable()
    .hidden()
    .sheet({ label: "Resolved", skeletonClassName: "w-40" }),
});
