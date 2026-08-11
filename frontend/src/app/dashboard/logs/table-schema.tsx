import { col, createTableSchema } from "@dtf/registry/lib/table-schema";
import type { Level } from "@nomad/shared";
import { LEVELS } from "@/lib/constants";
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

  service: col.string().label("Service").filterable("input").size(110),

  hostname: col.string().label("Host").filterable("input").size(110),

  appName: col
    .string()
    .optional()
    .label("App")
    .filterable("input")
    .size(100),

  message: col.string().label("Message").filterable("input").size(320),

  date: col
    .timestamp()
    .label("Timestamp")
    .display("timestamp")
    .sortable()
    .defaultOpen()
    .size(180),

  id: col
    .string()
    .label("Log ID")
    .notFilterable()
    .hidden()
    .sheet({ label: "Log ID", skeletonClassName: "w-64" }),

  facility: col
    .number()
    .optional()
    .label("Facility")
    .notFilterable()
    .hidden()
    .sheet({ label: "Facility", skeletonClassName: "w-12" }),

  severity: col
    .number()
    .optional()
    .label("Severity")
    .notFilterable()
    .hidden()
    .sheet({ label: "Syslog severity", skeletonClassName: "w-12" }),

  procId: col
    .string()
    .optional()
    .label("Process")
    .notFilterable()
    .hidden()
    .sheet({ label: "Process ID", skeletonClassName: "w-16" }),

  msgId: col
    .string()
    .optional()
    .label("Msg ID")
    .notFilterable()
    .hidden()
    .sheet({ label: "Message ID", skeletonClassName: "w-16" }),
});
