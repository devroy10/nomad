import { z } from "zod";
import type { BaseChartSchema } from "@dtf/registry/lib/data-table/types";
import { LEVELS } from "@/lib/constants";

export const columnSchema = z.object({
  id: z.string(),
  service: z.string(),
  level: z.enum(LEVELS),
  facility: z.number(),
  severity: z.number(),
  hostname: z.string().nullable().optional(),
  appName: z.string().nullable().optional(),
  procId: z.string().nullable().optional(),
  msgId: z.string().nullable().optional(),
  message: z.string(),
  structuredData: z.record(z.string(), z.string()).nullable().optional(),
  timestamp: z.date(),
  date: z.date(),
});

export type ColumnSchema = z.infer<typeof columnSchema>;
export type { BaseChartSchema };

export { filterSchema, type FilterState } from "./filter-schema";
