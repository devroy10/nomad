"use client";

import type { BaseChartSchema } from "@dtf/registry/lib/data-table/types";
import { format } from "date-fns";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface TimelineChartProps {
  data: BaseChartSchema[];
  className?: string;
}

export function TimelineChart({ data, className }: TimelineChartProps) {
  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={80}>
        <BarChart
          data={data}
          margin={{ top: 8, right: 8, bottom: 0, left: 8 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
          <XAxis
            dataKey="timestamp"
            hide
            type="number"
            domain={["dataMin", "dataMax"]}
            tickFormatter={(ts: number) => format(ts, "HH:mm")}
          />
          <YAxis hide />
          <Tooltip
            cursor={{ fill: "var(--accent)" }}
            labelFormatter={(label) => format(Number(label), "LLL dd HH:mm:ss")}
            contentStyle={{
              backgroundColor: "var(--popover)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              fontSize: 12,
            }}
            labelStyle={{ color: "var(--muted-foreground)" }}
          />
          <Bar dataKey="value" fill="var(--primary)" radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
