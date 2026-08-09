"use client";

import { DataTableInfinite } from "@dtf/registry/components/data-table/data-table-infinite";
import { useDataTable } from "@dtf/registry/components/data-table/data-table-provider";
import { DataTableSheetDetails } from "@dtf/registry/components/data-table/data-table-sheet/data-table-sheet-details";
import { MemoizedDataTableSheetContent } from "@dtf/registry/components/data-table/data-table-sheet/data-table-sheet-content";
import type { SheetField } from "@dtf/registry/components/data-table/types";
import { Button } from "@dtf/registry/components/ui/button";
import { getFacetedMinMaxValues, getFacetedUniqueValues } from "@dtf/registry/lib/data-table/faceted";
import { useNuqsAdapter } from "@dtf/registry/lib/store/adapters/nuqs";
import { useFilterState } from "@dtf/registry/lib/store/hooks/useFilterState";
import { DataTableStoreProvider } from "@dtf/registry/lib/store/provider/DataTableStoreProvider";
import {
  generateColumns,
  generateFilterFields,
  generateSheetFields,
  getDefaultColumnVisibility,
} from "@dtf/registry/lib/table-schema";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { LoaderCircle, Wrench } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";
import { TimelineChart } from "@/components/chart/timeline-chart";
import { RefreshButton } from "@/components/data-table/refresh-button";
import { getLevelRowClassName } from "@/lib/level";
import { cn } from "@/lib/utils";
import { dataOptions } from "./query-options";
import { filterSchema } from "./schema";
import type { ColumnSchema, FilterState } from "./schema";
import type { SearchParamsType } from "./search-params";
import { tableSchema } from "./table-schema";

const columns = generateColumns<ColumnSchema>(tableSchema.definition);
const filterFields = generateFilterFields<ColumnSchema>(tableSchema.definition);
const sheetFields = generateSheetFields<ColumnSchema>(tableSchema.definition);
const defaultColumnVisibility = getDefaultColumnVisibility(tableSchema.definition);

export function IncidentsClient({
  initialState,
}: {
  initialState: SearchParamsType;
}) {
  const adapter = useNuqsAdapter(filterSchema.definition, {
    id: "incidents",
    initialState,
  });

  return (
    <DataTableStoreProvider adapter={adapter}>
      <ClientInner />
    </DataTableStoreProvider>
  );
}

function ClientInner() {
  const search = useFilterState<FilterState>();

  const {
    data,
    isFetching,
    isLoading,
    fetchNextPage,
    hasNextPage,
    fetchPreviousPage,
    refetch,
  } = useInfiniteQuery(dataOptions(search));

  const flatData = React.useMemo(
    () => data?.pages?.flatMap((page) => page.data ?? []) ?? [],
    [data?.pages],
  );

  const lastPage = data?.pages?.[data?.pages.length - 1];
  const totalDBRowCount = lastPage?.meta?.totalRowCount;
  const filterDBRowCount = lastPage?.meta?.filterRowCount;
  const chartData = lastPage?.meta?.chartData;
  const facets = lastPage?.meta?.facets;
  const totalFetched = flatData?.length;

  const { sort, size, uuid, cursor, direction, live, ...filter } = search;

  const dynamicFilterFields = React.useMemo(() => {
    return filterFields.map((field) => {
      const facetsField = facets?.[field.value as string];
      if (!facetsField) return field;
      if (field.options && field.options.length > 0) return field;

      const options = facetsField.rows.map(({ value }) => ({
        label: `${value}`,
        value,
      }));

      if (field.type === "slider") {
        return {
          ...field,
          min: facetsField.min ?? field.min,
          max: facetsField.max ?? field.max,
          options,
        };
      }

      return { ...field, options };
    });
  }, [facets]);

  const defaultColumnFilters = React.useMemo(() => {
    return Object.entries(filter)
      .map(([key, value]) => ({ id: key, value }))
      .filter(({ value }) => {
        if (value === null || value === undefined) return false;
        if (Array.isArray(value) && value.length === 0) return false;
        return true;
      });
  }, [filter]);

  return (
    <DataTableInfinite
      columns={columns}
      data={flatData}
      totalRows={totalDBRowCount}
      filterRows={filterDBRowCount}
      totalRowsFetched={totalFetched}
      defaultColumnFilters={defaultColumnFilters}
      defaultColumnSorting={sort ? [sort] : undefined}
      defaultRowSelection={search.uuid ? { [search.uuid]: true } : undefined}
      defaultColumnVisibility={defaultColumnVisibility}
      filterFields={dynamicFilterFields}
      isFetching={isFetching}
      isLoading={isLoading}
      fetchNextPage={fetchNextPage}
      hasNextPage={hasNextPage}
      fetchPreviousPage={fetchPreviousPage}
      refetch={refetch}
      getRowClassName={(row) => cn(getLevelRowClassName(row.original.level))}
      getRowId={(row) => row.id}
      getFacetedUniqueValues={getFacetedUniqueValues(facets)}
      getFacetedMinMaxValues={getFacetedMinMaxValues(facets)}
      toolbarActions={[
        <RefreshButton key="refresh" onClick={refetch} />,
      ]}
      chartSlot={<TimelineChart data={chartData ?? []} className="-mb-2" />}
      sheetSlot={
        <IncidentSheetSlot
          sheetFields={sheetFields}
          totalRows={totalDBRowCount ?? 0}
          filterRows={filterDBRowCount ?? 0}
          totalRowsFetched={totalFetched}
        />
      }
      tableId="incidents"
    />
  );
}

function IncidentSheetSlot({
  sheetFields: fields,
  totalRows,
  filterRows,
  totalRowsFetched,
}: {
  sheetFields: SheetField<ColumnSchema>[];
  totalRows: number;
  filterRows: number;
  totalRowsFetched: number;
}) {
  const { table, rowSelection, isLoading, filterFields } = useDataTable<
    ColumnSchema,
    unknown
  >();
  const selectedRowKey = Object.keys(rowSelection)?.[0];
  const selectedRow = React.useMemo(() => {
    if (isLoading && !selectedRowKey) return undefined;
    return table
      .getCoreRowModel()
      .flatRows.find((row) => row.id === selectedRowKey);
  }, [selectedRowKey, isLoading, table]);

  const incident = selectedRow?.original;

  return (
    <DataTableSheetDetails
      title={incident ? `${incident.service} · ${incident.symptom}` : undefined}
      titleClassName="font-mono"
    >
      <MemoizedDataTableSheetContent
        table={table}
        data={incident}
        filterFields={filterFields}
        fields={fields}
        metadata={{ totalRows, filterRows, totalRowsFetched }}
      />
      <ApplyFixButton incidentId={incident?.id} status={incident?.status} />
    </DataTableSheetDetails>
  );
}

function ApplyFixButton({
  incidentId,
  status,
}: {
  incidentId?: string;
  status?: ColumnSchema["status"];
}) {
  const [applying, setApplying] = React.useState(false);
  const queryClient = useQueryClient();

  if (!incidentId || status === "fixed") return null;

  const canApply = status === "open" || status === "diagnosing" || status === "fix_suggested";

  return (
    <div className="flex items-center justify-between gap-4 border-t px-4 py-3">
      <span className="text-sm text-muted-foreground">
        {status === "fix_suggested"
          ? "Suggested fix ready"
          : "Waiting for diagnosis…"}
      </span>
      <Button
        size="sm"
        disabled={!canApply || applying}
        onClick={async () => {
          setApplying(true);
          try {
            const res = await fetch("/dashboard/api/fixes", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({ incidentId }),
            });
            const json = (await res.json()) as { ok?: boolean; error?: string; outcome?: string };
            if (!res.ok || !json.ok) {
              toast.error(json.error ?? "Failed to apply fix");
              return;
            }
            toast.success(json.outcome ?? "Fix applied");
            await queryClient.invalidateQueries({ queryKey: ["incidents"] });
          } catch {
            toast.error("Failed to apply fix");
          } finally {
            setApplying(false);
          }
        }}
      >
        {applying ? (
          <LoaderCircle className="size-4 animate-spin" />
        ) : (
          <Wrench className="size-4" />
        )}
        Apply fix
      </Button>
    </div>
  );
}
