import { and, sql, type Column, type SQL } from "drizzle-orm";
import type { PgTable } from "drizzle-orm/pg-core";
import type { BaseChartDatum, Level } from "@nomad/shared";
import type { DrizzleDB } from "./types.js";

function evaluateIntervalMs(durationMs: number): number {
  const durationMinutes = durationMs / 60000;

  const intervals = [
    { threshold: 1, interval: 1000 },
    { threshold: 5, interval: 5000 },
    { threshold: 10, interval: 10000 },
    { threshold: 30, interval: 30000 },
    { threshold: 60, interval: 60000 },
    { threshold: 120, interval: 120000 },
    { threshold: 240, interval: 240000 },
    { threshold: 480, interval: 480000 },
    { threshold: 1440, interval: 1440000 },
    { threshold: 2880, interval: 2880000 },
    { threshold: 5760, interval: 5760000 },
    { threshold: 11520, interval: 11520000 },
    { threshold: 23040, interval: 23040000 },
  ];

  for (const { threshold, interval } of intervals) {
    if (durationMinutes < threshold) return interval;
  }

  return 46080000;
}

const CHART_LEVELS: Level[] = ["info", "warning", "error", "critical"];

type ChartRow = { bucket: Date; level: string | null; value: number };

function emptyDatum(timestamp: number): BaseChartDatum {
  return { timestamp, info: 0, warning: 0, error: 0, critical: 0 };
}

/**
 * Bucket counts per severity level over the filtered time range using `date_bin`.
 * Returns `{ timestamp, info, warning, error, critical }` points for the
 * frontend stacked timeline chart. Buckets with no rows for a given level are
 * zeroed so every level renders in the stack.
 */
export async function buildChartData(
  db: DrizzleDB,
  table: PgTable,
  dateColumn: Column,
  levelColumn: Column,
  conditions: SQL[],
  dateRange?: (Date | null)[],
): Promise<BaseChartDatum[]> {
  const whereCondition =
    conditions.length > 0 ? and(...conditions) : undefined;

  let minDate: Date | undefined;
  let maxDate: Date | undefined;

  const validDates = dateRange?.filter((d): d is Date => d !== null);
  if (validDates && validDates.length >= 1) {
    minDate = validDates[0];
    maxDate = validDates.length >= 2 ? validDates[1] : undefined;
  }

  if (!minDate) {
    const rangeResult = await db
      .select({
        minDate: sql<Date>`MIN(${dateColumn})`,
        maxDate: sql<Date>`MAX(${dateColumn})`,
      })
      .from(table)
      .where(whereCondition);

    const row = rangeResult[0];
    if (!row?.minDate || !row?.maxDate) return [];
    minDate = new Date(row.minDate);
    maxDate = new Date(row.maxDate);
  }

  if (!maxDate) {
    maxDate = new Date(minDate.getTime() + 60 * 60 * 1000);
  }

  const durationMs = maxDate.getTime() - minDate.getTime();
  const intervalMs = Math.max(1, evaluateIntervalMs(durationMs));
  const intervalSeconds = Math.floor(intervalMs / 1000);

  const raw = await db.execute(
    sql`SELECT
        date_bin(${intervalSeconds + " seconds"}::interval, ${dateColumn}, ${minDate.toISOString()}::timestamptz) as bucket,
        ${levelColumn} as level,
        COUNT(*)::int as value
      FROM ${table}
      ${whereCondition ? sql`WHERE ${whereCondition}` : sql``}
      GROUP BY bucket, ${levelColumn}
      ORDER BY bucket ASC`,
  );

  const rows: ChartRow[] = Array.isArray(raw)
    ? (raw as ChartRow[])
    : (raw as unknown as { rows: ChartRow[] }).rows;

  const byBucket = new Map<number, BaseChartDatum>();
  for (const row of rows) {
    const timestamp = new Date(row.bucket).getTime();
    const level = row.level as Level | null;
    if (!level || !CHART_LEVELS.includes(level)) continue;

    let datum = byBucket.get(timestamp);
    if (!datum) {
      datum = emptyDatum(timestamp);
      byBucket.set(timestamp, datum);
    }
    datum[level] = Number(row.value);
  }

  return [...byBucket.values()];
}
