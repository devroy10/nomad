import { asc, desc, type SQL } from "drizzle-orm";
import type { ColumnMapping, SortDescriptor } from "./types.js";

export function buildOrderBy(
  mapping: ColumnMapping,
  sort: SortDescriptor,
): SQL | undefined {
  if (!sort) return undefined;

  const column = mapping[sort.id];
  if (!column) return undefined;

  return sort.desc ? desc(column) : asc(column);
}
