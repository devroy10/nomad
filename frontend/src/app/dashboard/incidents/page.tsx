import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { IncidentsClient } from "./client";
import { dataOptions } from "./query-options";
import { searchParamsCache } from "./search-params";

export const dynamic = "force-dynamic";

export default async function IncidentsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolved = await searchParams;
  const flat: Record<string, string> = {};
  for (const [key, value] of Object.entries(resolved)) {
    if (typeof value === "string") flat[key] = value;
    else if (Array.isArray(value)) flat[key] = value[value.length - 1] ?? "";
  }

  const search = searchParamsCache.parse(flat);
  const queryClient = new QueryClient();
  await queryClient.prefetchInfiniteQuery(dataOptions(search));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <IncidentsClient initialState={search} />
    </HydrationBoundary>
  );
}
