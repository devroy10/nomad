import { col, createTableSchema } from "@dtf/registry/lib/table-schema";
import { LEVELS } from "@/lib/constants";

export const tableSchema = createTableSchema({
  select: col.select().size(37),

  level: col.presets.logLevel(LEVELS).label("Level").size(90),

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
