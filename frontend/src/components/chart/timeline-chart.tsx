"use client";

import { useDataTable } from "@dtf/registry/components/data-table/data-table-provider";
import type { BaseChartSchema } from "@dtf/registry/lib/data-table/types";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@dtf/registry/components/ui/chart";
import type { Level } from "@nomad/shared";
import { format } from "date-fns";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceArea,
  XAxis,
} from "recharts";
import type { CategoricalChartFunc } from "recharts/types/chart/generateCategoricalChart";
import { cn } from "@/lib/utils";

const chartConfig = {
  info: {
    label: <TooltipLabel level="info" />,
    color: "var(--info)",
  },
  warning: {
    label: <TooltipLabel level="warning" />,
    color: "var(--warning)",
  },
  error: {
    label: <TooltipLabel level="error" />,
    color: "var(--error)",
  },
  critical: {
    label: <TooltipLabel level="critical" />,
    color: "var(--critical)",
  },
} satisfies ChartConfig;

interface TimelineChartProps<TChart extends BaseChartSchema> {
  className?: string;
  /**
   * The table column id to filter by — needs to be a `timerange` filter
   * (e.g. "date"). Used by the drag-to-select range filter.
   */
  columnId: string;
  /**
   * Per-level bucket counts from the table meta.
   */
  data: TChart[];
}

export function TimelineChart<TChart extends BaseChartSchema>({
  data,
  className,
  columnId,
}: TimelineChartProps<TChart>) {
  const { table } = useDataTable();
  const [refAreaLeft, setRefAreaLeft] = useState<string | null>(null);
  const [refAreaRight, setRefAreaRight] = useState<string | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);

  // REMINDER: date has to be a string for the tooltip label to work
  const chart = useMemo(
    () =>
      data.map((item) => ({
        ...item,
        [columnId]: new Date(item.timestamp).toString(),
      })),
    [data, columnId],
  );

  const timerange = useMemo(() => {
    if (data.length === 0) return { interval: 0, period: undefined };
    const first = data[0].timestamp;
    const last = data[data.length - 1].timestamp;
    const interval = Math.abs(first - last);
    return { interval, period: calculatePeriod(interval) };
  }, [data]);

  const handleMouseDown: CategoricalChartFunc = (e) => {
    if (e.activeLabel) {
      setRefAreaLeft(e.activeLabel);
      setIsSelecting(true);
    }
  };

  const handleMouseMove: CategoricalChartFunc = (e) => {
    if (isSelecting && e.activeLabel) {
      setRefAreaRight(e.activeLabel);
    }
  };

  const handleMouseUp: CategoricalChartFunc = (e) => {
    if (refAreaLeft && refAreaRight) {
      const [left, right] = [refAreaLeft, refAreaRight].sort(
        (a, b) => new Date(a).getTime() - new Date(b).getTime(),
      );
      table.getColumn(columnId)?.setFilterValue([new Date(left), new Date(right)]);
    }
    setRefAreaLeft(null);
    setRefAreaRight(null);
    setIsSelecting(false);
  };

  return (
    <ChartContainer
      config={chartConfig}
      className={cn(
        "aspect-auto h-[60px] w-full",
        "[&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted/50",
        "select-none",
        className,
      )}
    >
      <BarChart
        accessibilityLayer
        data={chart}
        margin={{ top: 0, left: 0, right: 0, bottom: 0 }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ cursor: "crosshair" }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey={columnId}
          tickLine={false}
          minTickGap={32}
          axisLine={false}
          tickFormatter={(value) => {
            const date = new Date(value);
            if (isNaN(date.getTime())) return "N/A";
            if (timerange.period === "10m") {
              return format(date, "HH:mm:ss");
            } else if (timerange.period === "1d") {
              return format(date, "HH:mm");
            } else if (timerange.period === "1w") {
              return format(date, "LLL dd HH:mm");
            }
            return format(date, "LLL dd, y");
          }}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              labelFormatter={(value) => {
                const date = new Date(value);
                if (isNaN(date.getTime())) return "N/A";
                if (timerange.period === "10m") {
                  return format(date, "LLL dd, HH:mm:ss");
                }
                return format(date, "LLL dd, y HH:mm");
              }}
            />
          }
        />
        <Bar dataKey="critical" stackId="a" fill="var(--color-critical)" />
        <Bar dataKey="error" stackId="a" fill="var(--color-error)" />
        <Bar dataKey="warning" stackId="a" fill="var(--color-warning)" />
        <Bar dataKey="info" stackId="a" fill="var(--color-info)" />
        {refAreaLeft && refAreaRight && (
          <ReferenceArea
            x1={refAreaLeft}
            x2={refAreaRight}
            strokeOpacity={0.3}
            fill="var(--foreground)"
            fillOpacity={0.08}
          />
        )}
      </BarChart>
    </ChartContainer>
  );
}

function calculatePeriod(interval: number): "10m" | "1d" | "1w" | "1mo" {
  if (interval <= 1000 * 60 * 10) {
    return "10m";
  } else if (interval <= 1000 * 60 * 60 * 24) {
    return "1d";
  } else if (interval <= 1000 * 60 * 60 * 24 * 7) {
    return "1w";
  }
  return "1mo";
}

function TooltipLabel({ level }: { level: Level }) {
  return (
    <div className="mr-2 flex w-20 items-center justify-between gap-2 font-mono">
      <div className="text-foreground/70 capitalize">{level}</div>
    </div>
  );
}
