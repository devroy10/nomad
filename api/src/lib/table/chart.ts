import { and, sql, type Column, type SQL } from "drizzle-orm";
import type { PgTable } from "drizzle-orm/pg-core";
import type { BaseChartDatum } from "@nomad/shared";
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

type ChartRow = { bucket: Date; value: number };

/**
 * Bucket counts over the filtered time range using `date_bin`.
 * Returns `{ timestamp, value }` points for the frontend timeline chart.
 */
export async function buildChartData(
  db: DrizzleDB,
  table: PgTable,
  dateColumn: Column,
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
        COUNT(*)::int as value
      FROM ${table}
      ${whereCondition ? sql`WHERE ${whereCondition}` : sql``}
      GROUP BY bucket
      ORDER BY bucket ASC`,
  );

  const result: ChartRow[] = Array.isArray(raw)
    ? (raw as ChartRow[])
    : (raw as unknown as { rows: ChartRow[] }).rows;

  return result.map((r) => ({
    timestamp: new Date(r.bucket).getTime(),
    value: Number(r.value),
  }));
}
