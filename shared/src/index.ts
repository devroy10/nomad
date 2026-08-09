import { z } from "zod";

// --- Domain enums ---

export const LEVELS = ["info", "warning", "error", "critical"] as const;
export const levelSchema = z.enum(LEVELS);
export type Level = z.infer<typeof levelSchema>;

export const INCIDENT_STATUSES = [
  "open",
  "diagnosing",
  "fix_suggested",
  "fixed",
] as const;
export const incidentStatusSchema = z.enum(INCIDENT_STATUSES);
export type IncidentStatus = z.infer<typeof incidentStatusSchema>;

export const FIX_STATUSES = ["suggested", "applied", "failed", "reverted"] as const;
export const fixStatusSchema = z.enum(FIX_STATUSES);
export type FixStatus = z.infer<typeof fixStatusSchema>;

// --- Domain rows ---

export const incidentSchema = z.object({
  id: z.string().uuid(),
  service: z.string(),
  level: levelSchema,
  symptom: z.string(),
  rootCause: z.string().nullable(),
  status: incidentStatusSchema,
  fixApplied: z.string().nullable(),
  createdAt: z.date(),
  resolvedAt: z.date().nullable(),
});
export type Incident = z.infer<typeof incidentSchema>;

export const logEntrySchema = z.object({
  id: z.string().uuid(),
  service: z.string(),
  level: levelSchema,
  facility: z.number(),
  severity: z.number(),
  hostname: z.string().nullable(),
  appName: z.string().nullable(),
  procId: z.string().nullable(),
  msgId: z.string().nullable(),
  message: z.string(),
  structuredData: z.record(z.string(), z.string()).nullable(),
  timestamp: z.date(),
});
export type LogEntry = z.infer<typeof logEntrySchema>;

export const fixSchema = z.object({
  id: z.string().uuid(),
  incidentId: z.string().uuid(),
  action: z.string(),
  status: fixStatusSchema,
  detail: z.record(z.string(), z.unknown()).nullable(),
  createdAt: z.date(),
});
export type Fix = z.infer<typeof fixSchema>;

// --- Data-table wire contract (Fastify <-> frontend) ---

export type SortDescriptor = { id: string; desc: boolean } | null;

/** Parsed URL search state shared between the nuqs adapter and the API. */
export interface TableQuery {
  level?: string[];
  service?: string;
  status?: string[];
  date?: [Date, Date];
  sort?: SortDescriptor;
  cursor?: number | string | null;
  direction?: "prev" | "next";
  size?: number;
  uuid?: string;
}

export interface FacetRow {
  value: string | number | boolean;
  total: number;
}

export interface FacetMetadata {
  rows: FacetRow[];
  total: number;
  min: number | undefined;
  max: number | undefined;
}

export type BaseChartDatum = { timestamp: number; value: number };

export interface TableResponse<T> {
  data: T[];
  meta: {
    totalRowCount: number;
    filterRowCount: number;
    chartData: BaseChartDatum[];
    facets: Record<string, FacetMetadata>;
  };
  prevCursor: number | null;
  nextCursor: number | null;
}
