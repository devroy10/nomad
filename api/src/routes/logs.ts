import { logs } from "@nomad/db";
import type { LogEntry } from "@nomad/shared";
import type { FastifyInstance } from "fastify";
import SuperJSON from "superjson";
import { buildChartData } from "../lib/table/chart.js";
import { createTableHandler } from "../lib/table/handler.js";
import { parseTableQuery } from "../lib/table/parse.js";
import type { ColumnMapping } from "../lib/table/types.js";
import { getDb } from "../lib/db.js";

const columnMapping = {
  id: logs.id,
  service: logs.service,
  level: logs.level,
  hostname: logs.hostname,
  appName: logs.appName,
  message: logs.message,
  timestamp: logs.timestamp,
  date: logs.timestamp,
} satisfies ColumnMapping;

const handler = createTableHandler({
  db: getDb(),
  table: logs,
  columnMapping,
  cursorColumn: "timestamp",
  sliderKeys: [],
  facetKeys: ["level", "service", "hostname", "appName"],
  dateKeys: ["date"],
});

export async function logsRoutes(app: FastifyInstance) {
  app.get("/", async (req, reply) => {
    const raw = req.query as Record<string, string>;
    const search = parseTableQuery(raw, {
      arrayFields: ["level"],
      dateRangeFields: ["date"],
    });

    const result = await handler.execute(search);
    const chartData = await buildChartData(
      getDb(),
      logs,
      logs.timestamp,
      logs.level,
      result.allConditions,
      search.date as (Date | null)[] | undefined,
    );

    const data = (result.data as LogEntry[]).map((row) => ({
      ...row,
      date: row.timestamp,
    }));

    const payload = {
      data,
      meta: {
        totalRowCount: result.totalRowCount,
        filterRowCount: result.filterRowCount,
        chartData,
        facets: result.facets,
      },
      prevCursor: result.prevCursor,
      nextCursor: result.nextCursor,
    };

    return reply.type("application/json").send(SuperJSON.stringify(payload));
  });
}
