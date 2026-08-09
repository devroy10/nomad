import { endOfDay, startOfDay } from "date-fns";
import {
  and,
  between,
  eq,
  gte,
  ilike,
  inArray,
  lte,
  sql,
  type SQL,
} from "drizzle-orm";
import type { ColumnMapping } from "./types.js";

/**
 * Build WHERE conditions from filter state and a column mapping.
 * Ported from @dtf/registry/src/lib/drizzle/filters.ts (registry stays React-free).
 */
export function buildWhereConditions(
  mapping: ColumnMapping,
  filters: Record<string, unknown>,
  options?: { exclude?: string[]; only?: string[] },
): SQL[] {
  const conditions: SQL[] = [];

  for (const [key, value] of Object.entries(filters)) {
    if (value === null || value === undefined) continue;
    if (Array.isArray(value) && value.length === 0) continue;
    if (options?.exclude?.includes(key)) continue;
    if (options?.only && !options.only.includes(key)) continue;

    const column = mapping[key];
    if (!column) continue;

    if (typeof value === "string") {
      conditions.push(ilike(column, `%${value}%`));
      continue;
    }

    if (typeof value === "number") {
      conditions.push(eq(column, value));
      continue;
    }

    if (typeof value === "boolean") {
      conditions.push(eq(column, value));
      continue;
    }

    if (Array.isArray(value)) {
      if (value[0] instanceof Date) {
        const dates = value as Date[];
        const first = dates[0];
        const second = dates[1];
        if (dates.length === 1) {
          if (!first) continue;
          conditions.push(
            and(
              gte(column, startOfDay(first)),
              lte(column, endOfDay(first)),
            )!,
          );
        } else if (dates.length === 2) {
          if (!first || !second) continue;
          conditions.push(and(gte(column, first), lte(column, second))!);
        }
        continue;
      }

      if (typeof value[0] === "number") {
        const nums = value as number[];
        const first = nums[0];
        const second = nums[1];
        if (nums.length === 1) {
          if (first === undefined) continue;
          conditions.push(eq(column, first));
        } else if (nums.length === 2) {
          if (first === undefined || second === undefined) continue;
          conditions.push(between(column, first, second));
        } else {
          conditions.push(inArray(column, nums));
        }
        continue;
      }

      if (typeof value[0] === "string") {
        const strs = value as string[];
        if (column.dataType === "array") {
          conditions.push(
            sql`${column} && ARRAY[${sql.join(
              strs.map((s) => sql`${s}`),
              sql`, `,
            )}]::text[]`,
          );
        } else {
          conditions.push(inArray(column, strs));
        }
        continue;
      }
    }
  }

  return conditions;
}
