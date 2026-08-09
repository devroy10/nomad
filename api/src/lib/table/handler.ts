import { and, count, sql, type SQL } from "drizzle-orm";
import type { PgTable } from "drizzle-orm/pg-core";
import type { FacetMetadata } from "@nomad/shared";
import { computeFacets } from "./facets.js";
import { buildWhereConditions } from "./filters.js";
import { buildCursorPagination } from "./pagination.js";
import { buildOrderBy } from "./sorting.js";
import type { ColumnMapping, DrizzleDB, SortDescriptor, TableKey } from "./types.js";

export type TableHandlerResult = {
  data: Record<string, unknown>[];
  facets: Record<string, FacetMetadata>;
  totalRowCount: number;
  filterRowCount: number;
  nextCursor: number | null;
  prevCursor: number | null;
  allConditions: SQL[];
};

export type TableHandlerConfig = TableKey & {
  db: DrizzleDB;
  table: PgTable;
  columnMapping: ColumnMapping;
  cursorColumn: string;
  defaultSize?: number;
};

/**
 * Three-pass filtering + facets + counts + cursor pagination for one table.
 * Ported from @dtf/registry/src/lib/drizzle/handler.ts.
 */
export function createTableHandler(config: TableHandlerConfig) {
  const {
    db,
    table,
    columnMapping,
    cursorColumn,
    defaultSize = 40,
    sliderKeys,
    facetKeys,
    dateKeys,
  } = config;

  const cursorCol = columnMapping[cursorColumn];
  if (!cursorCol) {
    throw new Error(`cursorColumn "${cursorColumn}" not found in columnMapping`);
  }

  return {
    async execute(search: Record<string, unknown>): Promise<TableHandlerResult> {
      const size = typeof search.size === "number" ? search.size : defaultSize;
      const sort = (search.sort as SortDescriptor) ?? null;
      const cursor = (search.cursor as Date | number | null) ?? null;
      const direction = (search.direction as "prev" | "next") ?? "next";

      const dateFilters = Object.fromEntries(
        Object.entries(search).filter(([key]) => dateKeys.includes(key)),
      );
      const dateConditions = buildWhereConditions(columnMapping, dateFilters);

      const nonSliderFilters = Object.fromEntries(
        Object.entries(search).filter(
          ([key]) => !sliderKeys.includes(key) && !dateKeys.includes(key),
        ),
      );
      const nonSliderConditions = buildWhereConditions(
        columnMapping,
        nonSliderFilters,
      );
      const pass2Conditions = [...dateConditions, ...nonSliderConditions];

      const sliderFilters = Object.fromEntries(
        Object.entries(search).filter(([key]) => sliderKeys.includes(key)),
      );
      const sliderConditions = buildWhereConditions(
        columnMapping,
        sliderFilters,
      );
      const allConditions = [...pass2Conditions, ...sliderConditions];

      const [sliderFacets, otherFacets] = await Promise.all([
        computeFacets(db, table, columnMapping, pass2Conditions, sliderKeys, {
          sliderKeys,
        }),
        computeFacets(
          db,
          table,
          columnMapping,
          allConditions,
          facetKeys.filter((k) => !sliderKeys.includes(k)),
        ),
      ]);
      const facets = { ...sliderFacets, ...otherFacets };

      const allWhere =
        allConditions.length > 0 ? and(...allConditions) : undefined;

      const [totalResult, filterResult] = await Promise.all([
        db.select({ total: count() }).from(table),
        db.select({ total: count() }).from(table).where(allWhere),
      ]);

      const totalRowCount = totalResult[0]?.total ?? 0;
      const filterRowCount = filterResult[0]?.total ?? 0;

      const orderBy = buildOrderBy(columnMapping, sort);
      const {
        cursorCondition,
        orderBy: cursorOrderBy,
        needsReverse,
      } = buildCursorPagination({
        cursor,
        direction,
        size,
        cursorColumn: cursorCol,
      });

      const dataConditions = cursorCondition
        ? [...allConditions, cursorCondition]
        : allConditions;
      const dataWhere =
        dataConditions.length > 0 ? and(...dataConditions) : undefined;

      const orderClauses = orderBy
        ? sql`${cursorOrderBy}, ${orderBy}`
        : cursorOrderBy;

      const rows = await db
        .select()
        .from(table)
        .where(dataWhere)
        .orderBy(orderClauses)
        .limit(size);

      if (needsReverse) {
        rows.reverse();
      }

      const lastRow = rows[rows.length - 1];
      const firstRow = rows[0];

      const getCursorValue = (row: Record<string, unknown>): number | null => {
        if (!row) return null;
        const val = row[cursorCol.name];
        if (val instanceof Date) return val.getTime();
        if (typeof val === "number") return val;
        return null;
      };

      const nextCursor = lastRow ? getCursorValue(lastRow) : null;
      const prevCursor = firstRow ? getCursorValue(firstRow) : new Date().getTime();

      return {
        data: rows as unknown as Record<string, unknown>[],
        facets,
        totalRowCount,
        filterRowCount,
        nextCursor,
        prevCursor,
        allConditions,
      };
    },
  };
}
