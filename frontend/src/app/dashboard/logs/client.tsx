"use client";

import { DataTableInfinite } from "@dtf/registry/components/data-table/data-table-infinite";
import { useDataTable } from "@dtf/registry/components/data-table/data-table-provider";
import { DataTableSheetDetails } from "@dtf/registry/components/data-table/data-table-sheet/data-table-sheet-details";
import { MemoizedDataTableSheetContent } from "@dtf/registry/components/data-table/data-table-sheet/data-table-sheet-content";
import type { SheetField } from "@dtf/registry/components/data-table/types";
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
import { useInfiniteQuery } from "@tanstack/react-query";
import * as React from "react";
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

export function LogsClient({ initialState }: { initialState: SearchParamsType }) {
  const adapter = useNuqsAdapter(filterSchema.definition, {
    id: "logs",
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
      toolbarActions={[<RefreshButton key="refresh" onClick={refetch} />]}
      chartSlot={<TimelineChart data={chartData ?? []} className="-mb-2" />}
      sheetSlot={
        <LogsSheetSlot
          sheetFields={sheetFields}
          totalRows={totalDBRowCount ?? 0}
          filterRows={filterDBRowCount ?? 0}
          totalRowsFetched={totalFetched}
        />
      }
      tableId="logs"
    />
  );
}

function LogsSheetSlot({
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

  return (
    <DataTableSheetDetails
      title={
        selectedRow?.original
          ? `${selectedRow.original.service} · ${selectedRow.original.message.slice(0, 60)}`
          : undefined
      }
      titleClassName="font-mono"
    >
      <MemoizedDataTableSheetContent
        table={table}
        data={selectedRow?.original}
        filterFields={filterFields}
        fields={fields}
        metadata={{ totalRows, filterRows, totalRowsFetched }}
      />
    </DataTableSheetDetails>
  );
}
