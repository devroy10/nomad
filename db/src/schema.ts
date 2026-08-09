import { relations } from "drizzle-orm";
import {
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const incidents = pgTable(
  "incidents",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    service: text("service").notNull(),
    level: text("level").notNull().default("warning"),
    symptom: text("symptom").notNull(),
    rootCause: text("root_cause"),
    status: text("status").notNull().default("open"),
    fixApplied: text("fix_applied"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    resolvedAt: timestamp("resolved_at", { withTimezone: true }),
  },
  (table) => [
    index("incidents_created_at_idx").on(table.createdAt),
    index("incidents_service_idx").on(table.service),
  ],
);

export const logs = pgTable(
  "logs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    service: text("service").notNull(),
    level: text("level").notNull().default("info"),
    facility: integer("facility").notNull(),
    severity: integer("severity").notNull(),
    hostname: text("hostname"),
    appName: text("app_name"),
    procId: text("proc_id"),
    msgId: text("msg_id"),
    message: text("message").notNull(),
    structuredData: jsonb("structured_data"),
    timestamp: timestamp("timestamp", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("logs_timestamp_idx").on(table.timestamp),
    index("logs_service_idx").on(table.service),
  ],
);

export const fixes = pgTable("fixes", {
  id: uuid("id").defaultRandom().primaryKey(),
  incidentId: uuid("incident_id")
    .notNull()
    .references(() => incidents.id, { onDelete: "cascade" }),
  action: text("action").notNull(),
  status: text("status").notNull().default("suggested"),
  detail: jsonb("detail"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const incidentsRelations = relations(incidents, ({ many }) => ({
  fixes: many(fixes),
}));

export const fixesRelations = relations(fixes, ({ one }) => ({
  incident: one(incidents, {
    fields: [fixes.incidentId],
    references: [incidents.id],
  }),
}));
