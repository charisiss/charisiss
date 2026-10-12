import {
  boolean,
  date,
  index,
  integer,
  jsonb,
  numeric,
  pgSchema,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const erp = pgSchema("erp");

export const customers = erp.table("customers", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  vatNumber: text("vat_number"),
  notes: text("notes"),
  status: text("status").notNull().default("active"),
  defaultHourlyRateCents: integer("default_hourly_rate_cents"),
  currency: text("currency").notNull().default("EUR"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const assets = erp.table(
  "assets",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    customerId: uuid("customer_id")
      .notNull()
      .references(() => customers.id, { onDelete: "restrict" }),
    kind: text("kind").notNull(),
    label: text("label").notNull(),
    provider: text("provider"),
    expiresOn: date("expires_on"),
    renewalPriceCents: integer("renewal_price_cents"),
    autoRenew: boolean("auto_renew").notNull().default(false),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("assets_customer_id_idx").on(table.customerId),
    index("assets_expires_on_idx").on(table.expiresOn),
  ],
);

export const timeEntries = erp.table(
  "time_entries",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    customerId: uuid("customer_id")
      .notNull()
      .references(() => customers.id, { onDelete: "restrict" }),
    workDate: date("work_date").notNull().defaultNow(),
    hours: numeric("hours", { precision: 8, scale: 2 }),
    amountCents: integer("amount_cents"),
    description: text("description"),
    billingStatus: text("billing_status").notNull().default("unbilled"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("time_entries_customer_id_idx").on(table.customerId),
    index("time_entries_work_date_idx").on(table.workDate),
    index("time_entries_billing_status_idx").on(table.billingStatus),
  ],
);

export const payments = erp.table(
  "payments",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    customerId: uuid("customer_id")
      .notNull()
      .references(() => customers.id, { onDelete: "restrict" }),
    amountCents: integer("amount_cents").notNull(),
    currency: text("currency").notNull().default("EUR"),
    paidOn: date("paid_on").notNull().defaultNow(),
    method: text("method"),
    reference: text("reference"),
    note: text("note"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("payments_customer_id_idx").on(table.customerId),
    index("payments_paid_on_idx").on(table.paidOn),
  ],
);

export const auditLog = erp.table(
  "audit_log",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    actor: text("actor").notNull(),
    action: text("action").notNull(),
    entity: text("entity").notNull(),
    entityId: uuid("entity_id"),
    meta: jsonb("meta"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("audit_log_created_at_idx").on(table.createdAt),
    index("audit_log_entity_idx").on(table.entity, table.entityId),
  ],
);

export type Customer = typeof customers.$inferSelect;
export type Asset = typeof assets.$inferSelect;
export type TimeEntry = typeof timeEntries.$inferSelect;
export type Payment = typeof payments.$inferSelect;
