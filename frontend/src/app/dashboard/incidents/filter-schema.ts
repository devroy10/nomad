import { field } from "@dtf/registry/lib/store/schema";
import { generateFilterSchema } from "@dtf/registry/lib/table-schema/generators/filter-schema";
import { tableSchema } from "./table-schema";

const DIRECTIONS = ["prev", "next"] as const;

export const filterSchema = generateFilterSchema(tableSchema.definition, {
  sort: field.sort(),
  uuid: field.string(),
  live: field.boolean().default(false),
  size: field.number().default(40),
  direction: field.stringLiteral(DIRECTIONS).default("next"),
  cursor: field.timestamp(),
});

export type FilterState = typeof filterSchema._type;
