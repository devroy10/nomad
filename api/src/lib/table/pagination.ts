import { asc, desc, gt, lt, type SQL } from "drizzle-orm";
import type { CursorPaginationParams } from "./types.js";

export function buildCursorPagination(params: CursorPaginationParams): {
  cursorCondition: SQL | undefined;
  orderBy: SQL;
  needsReverse: boolean;
} {
  const { cursor, direction, cursorColumn } = params;

  const cursorValue =
    cursor instanceof Date
      ? cursor
      : cursor != null
        ? new Date(cursor)
        : new Date();

  if (direction === "prev") {
    return {
      cursorCondition: gt(cursorColumn, cursorValue),
      orderBy: asc(cursorColumn),
      needsReverse: true,
    };
  }

  return {
    cursorCondition: lt(cursorColumn, cursorValue),
    orderBy: desc(cursorColumn),
    needsReverse: false,
  };
}
