import { incidents } from "@nomad/db";
import type { Incident } from "@nomad/shared";
import type { FastifyInstance } from "fastify";
import SuperJSON from "superjson";
import { buildChartData } from "../lib/table/chart.js";
import { createTableHandler } from "../lib/table/handler.js";
import { parseTableQuery } from "../lib/table/parse.js";
import type { ColumnMapping } from "../lib/table/types.js";
import { getDb } from "../lib/db.js";

const columnMapping = {
  id: incidents.id,
  service: incidents.service,
  level: incidents.level,
  symptom: incidents.symptom,
  status: incidents.status,
  createdAt: incidents.createdAt,
  date: incidents.createdAt,
} satisfies ColumnMapping;

const handler = createTableHandler({
  db: getDb(),
  table: incidents,
  columnMapping,
  cursorColumn: "createdAt",
  sliderKeys: [],
  facetKeys: ["level", "service", "status"],
  dateKeys: ["date"],
});

export async function incidentsRoutes(app: FastifyInstance) {
  app.get("/", async (req, reply) => {
    const raw = req.query as Record<string, string>;
    const search = parseTableQuery(raw, {
      arrayFields: ["level", "status"],
      dateRangeFields: ["date"],
    });

    const result = await handler.execute(search);
    const chartData = await buildChartData(
      getDb(),
      incidents,
      incidents.createdAt,
      incidents.level,
      result.allConditions,
      search.date as (Date | null)[] | undefined,
    );

    const data = (result.data as Incident[]).map((row) => ({
      ...row,
      date: row.createdAt,
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
