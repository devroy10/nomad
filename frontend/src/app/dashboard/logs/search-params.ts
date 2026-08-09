import { createNuqsSearchParams } from "@dtf/registry/lib/store/adapters/nuqs/server";
import type { inferParserType } from "@dtf/registry/lib/store/adapters/nuqs/server";
import { filterSchema } from "./filter-schema";

export const {
  searchParamsParser,
  searchParamsCache,
  searchParamsSerializer,
} = createNuqsSearchParams(filterSchema.definition);

export type SearchParamsType = inferParserType<typeof searchParamsParser>;
