import "server-only";

import { and, asc, desc, eq, gte, lte, sql } from "drizzle-orm";
import { requireAdmin, type AdminUser } from "@/lib/auth/admin";
import { db } from "@/lib/db";
import { assets, auditLog, customers, payments, timeEntries } from "@/lib/db/schema";
import { addMonthsIso } from "./money";
import {
  assetInputSchema,
  customerInputSchema,
  paymentInputSchema,
  timeEntryInputSchema,
  uuidSchema,
} from "./validators";

async function writeAudit(
  admin: AdminUser,
  action: string,
  entity: string,
  entityId?: string | null,
  meta?: Record<string, unknown>,
) {
  await db.insert(auditLog).values({
    actor: admin.email,
    action,
    entity,
    entityId: entityId ?? null,
    meta: meta ?? null,
  });
}

function computeAmountFromHours(
  hours: number | null | undefined,
  amountCents: number | null | undefined,
  hourlyRateCents: number | null | undefined,
) {
  if (amountCents !== null && amountCents !== undefined) return amountCents;
  if (hours === null || hours === undefined || hourlyRateCents === null || hourlyRateCents === undefined) {
    return amountCents ?? null;
  }
  return Math.round(hours * hourlyRateCents);
}

// ---------------------------------------------------------------------------
// Dashboard
// ---------------------------------------------------------------------------

export async function getDashboard() {
  await requireAdmin();

  const today = new Date();
  const in90 = new Date(today);
  in90.setDate(in90.getDate() + 90);
  const todayStr = today.toISOString().slice(0, 10);
  const in90Str = in90.toISOString().slice(0, 10);

  const [expiringAssets, unbilled, recentPayments, customerCount] = await Promise.all([
    db
      .select({
        id: assets.id,
        label: assets.label,
        kind: assets.kind,
        expiresOn: assets.expiresOn,
        renewalPriceCents: assets.renewalPriceCents,
        customerId: assets.customerId,
        customerName: customers.name,
      })
      .from(assets)
      .innerJoin(customers, eq(assets.customerId, customers.id))
      .where(and(gte(assets.expiresOn, todayStr), lte(assets.expiresOn, in90Str)))
      .orderBy(asc(assets.expiresOn))
      .limit(50),
    db
      .select({
        customerId: timeEntries.customerId,
        customerName: customers.name,
        currency: customers.currency,
        hours: sql<string>`coalesce(sum(${timeEntries.hours}), 0)`,
        amountCents: sql<number>`coalesce(sum(${timeEntries.amountCents}), 0)::int`,
      })
      .from(timeEntries)
      .innerJoin(customers, eq(timeEntries.customerId, customers.id))
      .where(eq(timeEntries.billingStatus, "unbilled"))
      .groupBy(timeEntries.customerId, customers.name, customers.currency),
    db
      .select({
        id: payments.id,
        amountCents: payments.amountCents,
        currency: payments.currency,
        paidOn: payments.paidOn,
        customerName: customers.name,
        method: payments.method,
      })
      .from(payments)
      .innerJoin(customers, eq(payments.customerId, customers.id))
      .orderBy(desc(payments.paidOn), desc(payments.createdAt))
      .limit(10),
    db.select({ count: sql<number>`count(*)::int` }).from(customers),
  ]);

  const owedCents = unbilled.reduce((sum, row) => sum + Number(row.amountCents || 0), 0);
  const owedCurrency = unbilled[0]?.currency ?? "EUR";

  return {
    expiringAssets,
    unbilled,
    recentPayments,
    customerCount: customerCount[0]?.count ?? 0,
    owedCents,
    owedCurrency,
  };
}

// ---------------------------------------------------------------------------
// Customers
// ---------------------------------------------------------------------------

export async function listCustomers() {
  await requireAdmin();
  return db.select().from(customers).orderBy(asc(customers.name));
}

export async function getCustomer(id: string) {
  await requireAdmin();
  const parsed = uuidSchema.parse(id);
  const [customer] = await db.select().from(customers).where(eq(customers.id, parsed)).limit(1);
  return customer ?? null;
}

export async function getCustomerDetail(id: string) {
  await requireAdmin();
  const parsed = uuidSchema.parse(id);
  const customer = await getCustomer(parsed);
  if (!customer) return null;

  const [customerAssets, entries, customerPayments] = await Promise.all([
    db.select().from(assets).where(eq(assets.customerId, parsed)).orderBy(asc(assets.expiresOn)),
    db
      .select()
      .from(timeEntries)
      .where(eq(timeEntries.customerId, parsed))
      .orderBy(desc(timeEntries.workDate), desc(timeEntries.createdAt)),
    db
      .select()
      .from(payments)
      .where(eq(payments.customerId, parsed))
      .orderBy(desc(payments.paidOn), desc(payments.createdAt)),
  ]);

  const unbilledCents = entries
    .filter((e) => e.billingStatus === "unbilled")
    .reduce((sum, e) => sum + (e.amountCents ?? 0), 0);
  const paidCents = customerPayments.reduce((sum, p) => sum + p.amountCents, 0);

  return {
    customer,
    assets: customerAssets,
    timeEntries: entries,
    payments: customerPayments,
    unbilledCents,
    paidCents,
  };
}

export async function createCustomer(raw: unknown) {
  const admin = await requireAdmin();
  const input = customerInputSchema.parse(raw);
  const [row] = await db
    .insert(customers)
    .values({
      name: input.name,
      email: input.email ?? null,
      phone: input.phone ?? null,
      vatNumber: input.vatNumber ?? null,
      notes: input.notes ?? null,
      status: input.status,
      defaultHourlyRateCents: input.defaultHourlyRateCents ?? null,
      currency: input.currency,
    })
    .returning();
  await writeAudit(admin, "create", "customer", row.id, { name: row.name });
  return row;
}

export async function updateCustomer(id: string, raw: unknown) {
  const admin = await requireAdmin();
  const parsedId = uuidSchema.parse(id);
  const input = customerInputSchema.parse(raw);
  const [row] = await db
    .update(customers)
    .set({
      name: input.name,
      email: input.email ?? null,
      phone: input.phone ?? null,
      vatNumber: input.vatNumber ?? null,
      notes: input.notes ?? null,
      status: input.status,
      defaultHourlyRateCents: input.defaultHourlyRateCents ?? null,
      currency: input.currency,
      updatedAt: new Date(),
    })
    .where(eq(customers.id, parsedId))
    .returning();
  if (row) await writeAudit(admin, "update", "customer", row.id);
  return row ?? null;
}

export async function deleteCustomer(id: string) {
  const admin = await requireAdmin();
  const parsedId = uuidSchema.parse(id);

  const [assetCount] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(assets)
    .where(eq(assets.customerId, parsedId));
  const [entryCount] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(timeEntries)
    .where(eq(timeEntries.customerId, parsedId));
  const [paymentCount] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(payments)
    .where(eq(payments.customerId, parsedId));

  if ((assetCount?.count ?? 0) + (entryCount?.count ?? 0) + (paymentCount?.count ?? 0) > 0) {
    throw new Error("Cannot delete customer with related records. Archive instead.");
  }

  const [row] = await db.delete(customers).where(eq(customers.id, parsedId)).returning();
  if (row) await writeAudit(admin, "delete", "customer", row.id, { name: row.name });
  return row ?? null;
}

export async function exportCustomer(id: string) {
  const detail = await getCustomerDetail(id);
  if (!detail) return null;
  return detail;
}

// ---------------------------------------------------------------------------
// Assets
// ---------------------------------------------------------------------------

export async function listAssets() {
  await requireAdmin();
  return db
    .select({
      id: assets.id,
      kind: assets.kind,
      label: assets.label,
      provider: assets.provider,
      expiresOn: assets.expiresOn,
      renewalPriceCents: assets.renewalPriceCents,
      autoRenew: assets.autoRenew,
      customerId: assets.customerId,
      customerName: customers.name,
    })
    .from(assets)
    .innerJoin(customers, eq(assets.customerId, customers.id))
    .orderBy(asc(assets.expiresOn), asc(assets.label));
}

export async function createAsset(raw: unknown) {
  const admin = await requireAdmin();
  const input = assetInputSchema.parse(raw);
  const [row] = await db
    .insert(assets)
    .values({
      customerId: input.customerId,
      kind: input.kind,
      label: input.label,
      provider: input.provider ?? null,
      expiresOn: input.expiresOn ?? null,
      renewalPriceCents: input.renewalPriceCents ?? null,
      autoRenew: input.autoRenew,
      notes: input.notes ?? null,
    })
    .returning();
  await writeAudit(admin, "create", "asset", row.id, { label: row.label });
  return row;
}

export async function updateAsset(id: string, raw: unknown) {
  const admin = await requireAdmin();
  const parsedId = uuidSchema.parse(id);
  const input = assetInputSchema.parse(raw);
  const [row] = await db
    .update(assets)
    .set({
      customerId: input.customerId,
      kind: input.kind,
      label: input.label,
      provider: input.provider ?? null,
      expiresOn: input.expiresOn ?? null,
      renewalPriceCents: input.renewalPriceCents ?? null,
      autoRenew: input.autoRenew,
      notes: input.notes ?? null,
      updatedAt: new Date(),
    })
    .where(eq(assets.id, parsedId))
    .returning();
  if (row) await writeAudit(admin, "update", "asset", row.id);
  return row ?? null;
}

export async function deleteAsset(id: string) {
  const admin = await requireAdmin();
  const parsedId = uuidSchema.parse(id);
  const [row] = await db.delete(assets).where(eq(assets.id, parsedId)).returning();
  if (row) await writeAudit(admin, "delete", "asset", row.id, { label: row.label });
  return row ?? null;
}

export async function getExpiringAssets(withinDays = 90) {
  await requireAdmin();
  const today = new Date();
  const end = new Date(today);
  end.setDate(end.getDate() + withinDays);
  return db
    .select({
      id: assets.id,
      label: assets.label,
      kind: assets.kind,
      expiresOn: assets.expiresOn,
      customerName: customers.name,
      renewalPriceCents: assets.renewalPriceCents,
    })
    .from(assets)
    .innerJoin(customers, eq(assets.customerId, customers.id))
    .where(
      and(
        gte(assets.expiresOn, today.toISOString().slice(0, 10)),
        lte(assets.expiresOn, end.toISOString().slice(0, 10)),
      ),
    )
    .orderBy(asc(assets.expiresOn));
}

// ---------------------------------------------------------------------------
// Time entries
// ---------------------------------------------------------------------------

export async function listTimeEntries() {
  await requireAdmin();
  return db
    .select({
      id: timeEntries.id,
      workDate: timeEntries.workDate,
      hours: timeEntries.hours,
      amountCents: timeEntries.amountCents,
      description: timeEntries.description,
      billingStatus: timeEntries.billingStatus,
      isRecurring: timeEntries.isRecurring,
      recurrenceInterval: timeEntries.recurrenceInterval,
      nextDueOn: timeEntries.nextDueOn,
      customerId: timeEntries.customerId,
      customerName: customers.name,
      currency: customers.currency,
    })
    .from(timeEntries)
    .innerJoin(customers, eq(timeEntries.customerId, customers.id))
    .orderBy(desc(timeEntries.workDate), desc(timeEntries.createdAt))
    .limit(200);
}

export async function createTimeEntry(raw: unknown) {
  const admin = await requireAdmin();
  const input = timeEntryInputSchema.parse(raw);
  const customer = await getCustomer(input.customerId);
  if (!customer) throw new Error("Customer not found");

  const amountCents = computeAmountFromHours(
    input.hours ?? null,
    input.amountCents ?? null,
    customer.defaultHourlyRateCents,
  );

  const interval = input.isRecurring ? input.recurrenceInterval : null;
  const nextDueOn =
    input.isRecurring && interval
      ? addMonthsIso(input.workDate, interval === "yearly" ? 12 : 1)
      : null;

  const [row] = await db
    .insert(timeEntries)
    .values({
      customerId: input.customerId,
      workDate: input.workDate,
      hours: input.hours !== null && input.hours !== undefined ? String(input.hours) : null,
      amountCents,
      description: input.description ?? null,
      billingStatus: input.billingStatus,
      isRecurring: input.isRecurring,
      recurrenceInterval: interval,
      nextDueOn,
    })
    .returning();
  await writeAudit(admin, "create", "time_entry", row.id, {
    isRecurring: row.isRecurring,
  });
  return row;
}

export async function updateTimeEntryStatus(id: string, billingStatus: "unbilled" | "billed" | "paid") {
  const admin = await requireAdmin();
  const parsedId = uuidSchema.parse(id);
  const [row] = await db
    .update(timeEntries)
    .set({ billingStatus, updatedAt: new Date() })
    .where(eq(timeEntries.id, parsedId))
    .returning();
  if (row) await writeAudit(admin, "update_status", "time_entry", row.id, { billingStatus });
  return row ?? null;
}

export async function deleteTimeEntry(id: string) {
  const admin = await requireAdmin();
  const parsedId = uuidSchema.parse(id);
  const [row] = await db.delete(timeEntries).where(eq(timeEntries.id, parsedId)).returning();
  if (row) await writeAudit(admin, "delete", "time_entry", row.id);
  return row ?? null;
}

// ---------------------------------------------------------------------------
// Payments
// ---------------------------------------------------------------------------

export async function listPayments() {
  await requireAdmin();
  return db
    .select({
      id: payments.id,
      amountCents: payments.amountCents,
      currency: payments.currency,
      paidOn: payments.paidOn,
      method: payments.method,
      reference: payments.reference,
      note: payments.note,
      customerId: payments.customerId,
      customerName: customers.name,
    })
    .from(payments)
    .innerJoin(customers, eq(payments.customerId, customers.id))
    .orderBy(desc(payments.paidOn), desc(payments.createdAt))
    .limit(200);
}

export async function createPayment(raw: unknown) {
  const admin = await requireAdmin();
  const input = paymentInputSchema.parse(raw);
  const [row] = await db
    .insert(payments)
    .values({
      customerId: input.customerId,
      amountCents: input.amountCents,
      currency: input.currency,
      paidOn: input.paidOn,
      method: input.method ?? null,
      reference: input.reference ?? null,
      note: input.note ?? null,
    })
    .returning();
  await writeAudit(admin, "create", "payment", row.id, {
    amountCents: row.amountCents,
  });
  return row;
}

export async function deletePayment(id: string) {
  const admin = await requireAdmin();
  const parsedId = uuidSchema.parse(id);
  const [row] = await db.delete(payments).where(eq(payments.id, parsedId)).returning();
  if (row) await writeAudit(admin, "delete", "payment", row.id);
  return row ?? null;
}
