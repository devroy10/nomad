CREATE TABLE "fixes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"incident_id" uuid NOT NULL,
	"action" text NOT NULL,
	"status" text DEFAULT 'suggested' NOT NULL,
	"detail" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "incidents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"service" text NOT NULL,
	"level" text DEFAULT 'warning' NOT NULL,
	"symptom" text NOT NULL,
	"root_cause" text,
	"status" text DEFAULT 'open' NOT NULL,
	"fix_applied" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"resolved_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"service" text NOT NULL,
	"level" text DEFAULT 'info' NOT NULL,
	"facility" integer NOT NULL,
	"severity" integer NOT NULL,
	"hostname" text,
	"app_name" text,
	"proc_id" text,
	"msg_id" text,
	"message" text NOT NULL,
	"structured_data" jsonb,
	"timestamp" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "fixes" ADD CONSTRAINT "fixes_incident_id_incidents_id_fk" FOREIGN KEY ("incident_id") REFERENCES "public"."incidents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "incidents_created_at_idx" ON "incidents" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "incidents_service_idx" ON "incidents" USING btree ("service");--> statement-breakpoint
CREATE INDEX "logs_timestamp_idx" ON "logs" USING btree ("timestamp");--> statement-breakpoint
CREATE INDEX "logs_service_idx" ON "logs" USING btree ("service");