import type { Column } from "drizzle-orm";
import type { PgTable } from "drizzle-orm/pg-core";
import type { Db } from "@nomad/db";

export type ColumnMapping = Record<string, Column>;

/** Concrete database handle from @nomad/db — no `any` in the call chain. */
export type DrizzleDB = Db;

export type SortDescriptor = { id: string; desc: boolean } | null;

export type CursorPaginationParams = {
  cursor: Date | number | null;
  direction: "prev" | "next";
  size: number;
  cursorColumn: Column;
};

export type TableKey = {
  sliderKeys: string[];
  facetKeys: string[];
  dateKeys: string[];
};

export type { PgTable };
