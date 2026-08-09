import { and, count, max, min, sql, type SQL } from "drizzle-orm";
import type { PgTable } from "drizzle-orm/pg-core";
import type { FacetMetadata } from "@nomad/shared";
import type { ColumnMapping, DrizzleDB } from "./types.js";

export async function computeFacets(
  db: DrizzleDB,
  table: PgTable,
  mapping: ColumnMapping,
  baseConditions: SQL[],
  facetKeys: string[],
  options?: { sliderKeys?: string[] },
): Promise<Record<string, FacetMetadata>> {
  const whereCondition =
    baseConditions.length > 0 ? and(...baseConditions) : undefined;
  const sliderKeys = options?.sliderKeys ?? [];

  function rowsOf<T>(raw: unknown): T[] {
    if (Array.isArray(raw)) return raw as T[];
    return (raw as { rows: T[] }).rows;
  }

  const queries = facetKeys.map(async (key) => {
    const column = mapping[key];
    if (!column) return [key, null] as const;

    if (sliderKeys.includes(key)) {
      const result = await db
        .select({ min: min(column), max: max(column), total: count() })
        .from(table)
        .where(whereCondition);

      const row = result[0];
      return [
        key,
        {
          rows: [],
          total: Number(row?.total ?? 0),
          min: row?.min != null ? Number(row.min) : undefined,
          max: row?.max != null ? Number(row.max) : undefined,
        } satisfies FacetMetadata,
      ] as const;
    }

    if (column.dataType === "array") {
      const raw = await db.execute(
        sql`SELECT val as value, COUNT(*)::int as total
            FROM (
              SELECT unnest(${column}) as val
              FROM ${table}
              ${whereCondition ? sql`WHERE ${whereCondition}` : sql``}
            ) sub
            GROUP BY val
            ORDER BY total DESC`,
      );
      const result = rowsOf<{ value: string; total: number }>(raw);

      const total = result.reduce((sum, r) => sum + Number(r.total), 0);

      return [
        key,
        {
          rows: result.map((r) => ({ value: r.value, total: Number(r.total) })),
          total,
          min: undefined,
          max: undefined,
        } satisfies FacetMetadata,
      ] as const;
    }

    const raw = await db.execute(
      sql`SELECT ${column} as value, COUNT(*)::int as total
          FROM ${table}
          ${whereCondition ? sql`WHERE ${whereCondition}` : sql``}
          GROUP BY ${column}
          ORDER BY total DESC`,
    );
    const result = rowsOf<{ value: string | number | boolean; total: number }>(
      raw,
    );

    const total = result.reduce((sum, r) => sum + Number(r.total), 0);

    let minVal: number | undefined;
    let maxVal: number | undefined;
    if (result.length > 0 && typeof result[0]?.value === "number") {
      const values = result.map((r) => Number(r.value));
      minVal = Math.min(...values);
      maxVal = Math.max(...values);
    }

    return [
      key,
      {
        rows: result.map((r) => ({ value: r.value, total: Number(r.total) })),
        total,
        min: minVal,
        max: maxVal,
      } satisfies FacetMetadata,
    ] as const;
  });

  const results = await Promise.all(queries);
  const pairs = results.filter(
    (entry): entry is [string, FacetMetadata] => entry[1] !== null,
  );
  return Object.fromEntries(pairs);
}
