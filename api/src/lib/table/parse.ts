export const ARRAY_DELIMITER = ",";
export const RANGE_DELIMITER = "-";
export const SORT_DELIMITER = ".";

export interface ParseConfig {
  /** Keys serialized as comma-joined string arrays (checkbox filters). */
  arrayFields: string[];
  /** Keys serialized as `start-end` epoch-ms ranges (timerange filters). */
  dateRangeFields: string[];
}

/**
 * Parse the nuqs-serialized URL search params into the flat search object the
 * table handler consumes. Mirrors @dtf/registry/lib/store/schema/serialization.ts.
 */
export function parseTableQuery(
  raw: Record<string, string>,
  config: ParseConfig,
): Record<string, unknown> {
  const search: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(raw)) {
    if (value === "") continue;

    if (config.arrayFields.includes(key)) {
      const parts = value.split(ARRAY_DELIMITER).filter(Boolean);
      if (parts.length > 0) search[key] = parts;
      continue;
    }

    if (config.dateRangeFields.includes(key)) {
      const ms = value.split(RANGE_DELIMITER).map((p) => Number(p));
      const valid = ms.filter((n) => Number.isFinite(n));
      if (valid.length === 2) {
        search[key] = [new Date(valid[0]!), new Date(valid[1]!)];
      } else if (valid.length === 1) {
        search[key] = [new Date(valid[0]!)];
      }
      continue;
    }

    if (key === "sort") {
      const [id, dir] = value.split(SORT_DELIMITER);
      if (id) search.sort = { id, desc: dir === "desc" };
      continue;
    }

    if (key === "cursor") {
      const n = Number(value);
      search.cursor = Number.isFinite(n) ? n : value;
      continue;
    }

    if (key === "direction") {
      if (value === "prev" || value === "next") search.direction = value;
      continue;
    }

    if (key === "size") {
      const n = Number(value);
      if (Number.isFinite(n)) search.size = n;
      continue;
    }

    if (key === "live") {
      search.live = value === "true";
      continue;
    }

    search[key] = value;
  }

  return search;
}
