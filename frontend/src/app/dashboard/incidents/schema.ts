import { z } from "zod";
import type { BaseChartSchema } from "@dtf/registry/lib/data-table/types";
import { INCIDENT_STATUSES, LEVELS } from "@/lib/constants";

export const columnSchema = z.object({
  id: z.string(),
  service: z.string(),
  level: z.enum(LEVELS),
  status: z.enum(INCIDENT_STATUSES),
  symptom: z.string(),
  rootCause: z.string().nullable().optional(),
  fixApplied: z.string().nullable().optional(),
  createdAt: z.date(),
  resolvedAt: z.date().nullable().optional(),
});

export type ColumnSchema = z.infer<typeof columnSchema>;
export type { BaseChartSchema };

export { filterSchema, type FilterState } from "./filter-schema";
