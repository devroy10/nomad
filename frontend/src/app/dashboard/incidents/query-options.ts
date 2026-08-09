import { createDataTableQueryOptions } from "@dtf/registry/lib/data-table";
import type { ColumnSchema } from "./schema";
import { searchParamsSerializer, type SearchParamsType } from "./search-params";

const _dataOptions = createDataTableQueryOptions<ColumnSchema[], unknown>({
  queryKeyPrefix: "incidents",
  apiEndpoint: "/dashboard/api/incidents",
  searchParamsSerializer: searchParamsSerializer as (
    search: Record<string, unknown>,
  ) => string,
});

export const dataOptions = (search: SearchParamsType) =>
  _dataOptions(search as unknown as Record<string, unknown>);
