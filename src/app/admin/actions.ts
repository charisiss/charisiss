"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createAsset,
  createCustomer,
  createPayment,
  createTimeEntry,
  deleteAsset,
  deleteCustomer,
  deletePayment,
  deleteTimeEntry,
  updateAsset,
  updateCustomer,
  updateTimeEntryStatus,
} from "@/lib/erp/dal";
import { setFlash } from "@/lib/erp/flash";
import { eurosToCents } from "@/lib/erp/money";

function formString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function revalidateErp(customerId?: string) {
  revalidatePath("/admin");
  revalidatePath("/admin/customers");
  revalidatePath("/admin/assets");
  revalidatePath("/admin/time");
  revalidatePath("/admin/payments");
  if (customerId) revalidatePath(`/admin/customers/${customerId}`);
}

async function finish(path: string, message: string) {
  await setFlash({ type: "success", message });
  redirect(path);
}

export async function createCustomerAction(formData: FormData) {
  const rate = eurosToCents(formString(formData, "hourlyRateEuros"));
  const customer = await createCustomer({
    name: formString(formData, "name"),
    email: formString(formData, "email"),
    phone: formString(formData, "phone"),
    vatNumber: formString(formData, "vatNumber"),
    notes: formString(formData, "notes"),
    status: formString(formData, "status") || "active",
    defaultHourlyRateCents: rate,
    currency: formString(formData, "currency") || "EUR",
  });
  revalidateErp(customer.id);
  await finish(`/admin/customers/${customer.id}`, "Customer created");
}

export async function updateCustomerAction(formData: FormData) {
  const id = formString(formData, "id");
  const rate = eurosToCents(formString(formData, "hourlyRateEuros"));
  await updateCustomer(id, {
    name: formString(formData, "name"),
    email: formString(formData, "email"),
    phone: formString(formData, "phone"),
    vatNumber: formString(formData, "vatNumber"),
    notes: formString(formData, "notes"),
    status: formString(formData, "status") || "active",
    defaultHourlyRateCents: rate,
    currency: formString(formData, "currency") || "EUR",
  });
  revalidateErp(id);
  await finish(`/admin/customers/${id}`, "Customer saved");
}

export async function deleteCustomerAction(formData: FormData) {
  const id = formString(formData, "id");
  await deleteCustomer(id);
  revalidateErp();
  await finish("/admin/customers", "Customer deleted");
}

export async function createAssetAction(formData: FormData) {
  const customerId = formString(formData, "customerId");
  await createAsset({
    customerId,
    kind: formString(formData, "kind"),
    label: formString(formData, "label"),
    provider: formString(formData, "provider"),
    expiresOn: formString(formData, "expiresOn"),
    renewalPriceCents: eurosToCents(formString(formData, "renewalPriceEuros")),
    autoRenew: formData.get("autoRenew") === "on",
    notes: formString(formData, "notes"),
  });
  revalidateErp(customerId);
  await finish("/admin/assets", "Asset added");
}

export async function updateAssetAction(formData: FormData) {
  const id = formString(formData, "id");
  const customerId = formString(formData, "customerId");
  await updateAsset(id, {
    customerId,
    kind: formString(formData, "kind"),
    label: formString(formData, "label"),
    provider: formString(formData, "provider"),
    expiresOn: formString(formData, "expiresOn"),
    renewalPriceCents: eurosToCents(formString(formData, "renewalPriceEuros")),
    autoRenew: formData.get("autoRenew") === "on",
    notes: formString(formData, "notes"),
  });
  revalidateErp(customerId);
  await finish("/admin/assets", "Asset saved");
}

export async function deleteAssetAction(formData: FormData) {
  const id = formString(formData, "id");
  const customerId = formString(formData, "customerId");
  await deleteAsset(id);
  revalidateErp(customerId || undefined);
  await finish("/admin/assets", "Asset deleted");
}

export async function createTimeEntryAction(formData: FormData) {
  const customerId = formString(formData, "customerId");
  const hoursRaw = formString(formData, "hours");
  const amountRaw = formString(formData, "amountEuros");
  await createTimeEntry({
    customerId,
    workDate: formString(formData, "workDate"),
    hours: hoursRaw ? Number(hoursRaw) : null,
    amountCents: eurosToCents(amountRaw),
    description: formString(formData, "description"),
    billingStatus: formString(formData, "billingStatus") || "unbilled",
  });
  revalidateErp(customerId);
  await finish("/admin/time", "Time entry added");
}

export async function updateTimeEntryStatusAction(formData: FormData) {
  const id = formString(formData, "id");
  const status = formString(formData, "billingStatus") as "unbilled" | "billed" | "paid";
  const customerId = formString(formData, "customerId");
  await updateTimeEntryStatus(id, status);
  revalidateErp(customerId || undefined);
  await finish("/admin/time", "Billing status updated");
}

export async function deleteTimeEntryAction(formData: FormData) {
  const id = formString(formData, "id");
  const customerId = formString(formData, "customerId");
  await deleteTimeEntry(id);
  revalidateErp(customerId || undefined);
  await finish("/admin/time", "Time entry deleted");
}

export async function createPaymentAction(formData: FormData) {
  const customerId = formString(formData, "customerId");
  const amount = eurosToCents(formString(formData, "amountEuros"));
  if (amount === null) throw new Error("Amount required");
  await createPayment({
    customerId,
    amountCents: amount,
    currency: formString(formData, "currency") || "EUR",
    paidOn: formString(formData, "paidOn"),
    method: formString(formData, "method") || null,
    reference: formString(formData, "reference"),
    note: formString(formData, "note"),
  });
  revalidateErp(customerId);
  await finish("/admin/payments", "Payment recorded");
}

export async function deletePaymentAction(formData: FormData) {
  const id = formString(formData, "id");
  const customerId = formString(formData, "customerId");
  await deletePayment(id);
  revalidateErp(customerId || undefined);
  await finish("/admin/payments", "Payment deleted");
}
