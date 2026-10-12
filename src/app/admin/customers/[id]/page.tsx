import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/admin";
import { getCustomerDetail } from "@/lib/erp/dal";
import { centsToEuroInput, daysUntil, formatMoney } from "@/lib/erp/money";
import {
  createAssetAction,
  createPaymentAction,
  createTimeEntryAction,
  deleteAssetAction,
  deleteCustomerAction,
  deletePaymentAction,
  updateCustomerAction,
} from "../../actions";
import {
  DangerButton,
  ExpiryBadge,
  Field,
  PageHeader,
  Panel,
  SelectField,
  SubmitButton,
  Table,
} from "../../ui";

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const detail = await getCustomerDetail(id);
  if (!detail) notFound();

  const { customer, assets, timeEntries, payments, unbilledCents, paidCents } = detail;
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="min-w-0">
      <PageHeader
        title={customer.name}
        description={customer.email ?? "No email on file"}
        action={
          <Link href="/admin/customers" className="text-sm text-muted hover:text-accent">
            ← Customers
          </Link>
        }
      />

      {(customer.email || customer.phone) && (
        <div className="mb-6 flex flex-wrap gap-2">
          {customer.email ? (
            <a
              href={`mailto:${customer.email}`}
              className="rounded-sm border border-line px-3 py-2 text-sm text-accent transition-colors hover:border-accent"
            >
              Email
            </a>
          ) : null}
          {customer.phone ? (
            <a
              href={`tel:${customer.phone.replace(/\s+/g, "")}`}
              className="rounded-sm border border-line px-3 py-2 text-sm text-accent transition-colors hover:border-accent"
            >
              Call
            </a>
          ) : null}
        </div>
      )}

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <a
          href="#payments"
          className="block outline-none transition-colors hover:border-accent focus-visible:border-accent"
        >
          <Panel className="h-full border-inherit hover:border-accent">
            <p className="text-xs uppercase tracking-wider text-muted">Unbilled</p>
            <p className="mt-2 font-display text-2xl">
              {formatMoney(unbilledCents, customer.currency)}
            </p>
          </Panel>
        </a>
        <a
          href="#payments"
          className="block outline-none transition-colors hover:border-accent focus-visible:border-accent"
        >
          <Panel className="h-full border-inherit hover:border-accent">
            <p className="text-xs uppercase tracking-wider text-muted">Paid total</p>
            <p className="mt-2 font-display text-2xl">
              {formatMoney(paidCents, customer.currency)}
            </p>
          </Panel>
        </a>
        <a
          href="#assets"
          className="block outline-none transition-colors hover:border-accent focus-visible:border-accent"
        >
          <Panel className="h-full border-inherit hover:border-accent">
            <p className="text-xs uppercase tracking-wider text-muted">Assets</p>
            <p className="mt-2 font-display text-2xl">{assets.length}</p>
          </Panel>
        </a>
      </div>

      <div className="mb-6 grid gap-6 lg:grid-cols-2">
        <Panel>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-accent">
            Quick time / payment
          </h2>
          <form action={createTimeEntryAction} className="mb-6 grid gap-3">
            <input type="hidden" name="customerId" value={customer.id} />
            <input type="hidden" name="returnTo" value={`/admin/customers/${customer.id}`} />
            <Field label="Work date" name="workDate" type="date" required defaultValue={today} />
            <Field label="Hours" name="hours" type="number" step="0.25" />
            <Field label="Amount (EUR)" name="amountEuros" type="number" step="0.01" />
            <Field label="Comment" name="description" />
            <label className="flex items-center gap-2 text-sm text-muted">
              <input type="checkbox" name="isRecurring" /> Recurring work
            </label>
            <SelectField
              label="Repeat"
              name="recurrenceInterval"
              defaultValue="monthly"
              options={[
                { value: "monthly", label: "Every month" },
                { value: "yearly", label: "Every year" },
              ]}
            />
            <SubmitButton>Log time</SubmitButton>
          </form>
          <form action={createPaymentAction} className="grid gap-3">
            <input type="hidden" name="customerId" value={customer.id} />
            <input type="hidden" name="returnTo" value={`/admin/customers/${customer.id}`} />
            <input type="hidden" name="currency" value={customer.currency} />
            <Field label="Paid on" name="paidOn" type="date" required defaultValue={today} />
            <Field label="Amount (EUR)" name="amountEuros" type="number" step="0.01" required />
            <SelectField
              label="Method"
              name="method"
              defaultValue="bank"
              options={[
                { value: "bank", label: "Bank" },
                { value: "cash", label: "Cash" },
                { value: "card", label: "Card" },
                { value: "paypal", label: "PayPal" },
                { value: "other", label: "Other" },
              ]}
            />
            <Field label="Reference" name="reference" />
            <SubmitButton>Record payment</SubmitButton>
          </form>
        </Panel>

        <Panel id="assets" className="scroll-mt-24">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-accent">
            Assets
          </h2>
          <form action={createAssetAction} className="mb-6 grid gap-3">
            <input type="hidden" name="customerId" value={customer.id} />
            <input type="hidden" name="returnTo" value={`/admin/customers/${customer.id}`} />
            <SelectField
              label="Kind"
              name="kind"
              defaultValue="domain"
              options={[
                { value: "domain", label: "Domain" },
                { value: "server", label: "Server" },
                { value: "hosting", label: "Hosting" },
                { value: "other", label: "Other" },
              ]}
            />
            <Field label="Label" name="label" required />
            <Field label="Provider" name="provider" />
            <Field label="Expires on" name="expiresOn" type="date" />
            <Field
              label="Renewal price (EUR)"
              name="renewalPriceEuros"
              type="number"
              step="0.01"
            />
            <label className="flex items-center gap-2 text-sm text-muted">
              <input type="checkbox" name="autoRenew" /> Auto renew
            </label>
            <SubmitButton>Add asset</SubmitButton>
          </form>
          <Table>
            <thead>
              <tr className="border-b border-line text-muted">
                <th className="py-2 pr-3 font-medium">Label</th>
                <th className="py-2 pr-3 font-medium">Expires</th>
                <th className="py-2 pr-3 font-medium">In</th>
                <th className="py-2 font-medium" />
              </tr>
            </thead>
            <tbody>
              {assets.map((asset) => (
                <tr key={asset.id} className="border-b border-line/60">
                  <td className="py-2 pr-3">
                    {asset.label}
                    <span className="ml-2 text-xs text-muted">{asset.kind}</span>
                  </td>
                  <td className="py-2 pr-3">{asset.expiresOn ?? "—"}</td>
                  <td className="py-2 pr-3">
                    <ExpiryBadge days={daysUntil(asset.expiresOn)} />
                  </td>
                  <td className="py-2">
                    <form action={deleteAssetAction}>
                      <input type="hidden" name="id" value={asset.id} />
                      <input type="hidden" name="customerId" value={customer.id} />
                      <input
                        type="hidden"
                        name="returnTo"
                        value={`/admin/customers/${customer.id}`}
                      />
                      <DangerButton>Delete</DangerButton>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          {assets.length === 0 ? (
            <p className="mt-3 text-sm text-muted">No assets yet.</p>
          ) : null}
        </Panel>
      </div>

      <Panel className="mb-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-accent">
          Time entries
        </h2>
        <Table>
          <thead>
            <tr className="border-b border-line text-muted">
              <th className="py-2 pr-3 font-medium">Date</th>
              <th className="py-2 pr-3 font-medium">Hours</th>
              <th className="py-2 pr-3 font-medium">Amount</th>
              <th className="py-2 pr-3 font-medium">Status</th>
              <th className="py-2 pr-3 font-medium">Recurring</th>
              <th className="py-2 font-medium">Note</th>
            </tr>
          </thead>
          <tbody>
            {timeEntries.map((entry) => (
              <tr key={entry.id} className="border-b border-line/60">
                <td className="py-2 pr-3">{entry.workDate}</td>
                <td className="py-2 pr-3">{entry.hours ?? "—"}</td>
                <td className="py-2 pr-3">
                  {formatMoney(entry.amountCents, customer.currency)}
                </td>
                <td className="py-2 pr-3 capitalize">{entry.billingStatus}</td>
                <td className="py-2 pr-3 text-muted">
                  {entry.isRecurring
                    ? `${entry.recurrenceInterval ?? "monthly"} · next ${entry.nextDueOn ?? "—"}`
                    : "—"}
                </td>
                <td className="py-2 text-muted">{entry.description ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Panel>

      <Panel id="payments" className="mb-6 scroll-mt-24">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-accent">
          Payments
        </h2>
        <Table>
          <thead>
            <tr className="border-b border-line text-muted">
              <th className="py-2 pr-3 font-medium">Date</th>
              <th className="py-2 pr-3 font-medium">Amount</th>
              <th className="py-2 pr-3 font-medium">Method</th>
              <th className="py-2 pr-3 font-medium">Reference</th>
              <th className="py-2 font-medium" />
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id} className="border-b border-line/60">
                <td className="py-2 pr-3">{payment.paidOn}</td>
                <td className="py-2 pr-3">
                  {formatMoney(payment.amountCents, payment.currency)}
                </td>
                <td className="py-2 pr-3">{payment.method ?? "—"}</td>
                <td className="py-2 pr-3 text-muted">{payment.reference ?? "—"}</td>
                <td className="py-2">
                  <form action={deletePaymentAction}>
                    <input type="hidden" name="id" value={payment.id} />
                    <input type="hidden" name="customerId" value={customer.id} />
                    <input
                      type="hidden"
                      name="returnTo"
                      value={`/admin/customers/${customer.id}`}
                    />
                    <DangerButton>Delete</DangerButton>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Panel>

      <Panel>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-accent">
          Edit customer
        </h2>
        <form action={updateCustomerAction} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <input type="hidden" name="id" value={customer.id} />
          <input type="hidden" name="currency" value={customer.currency} />
          <Field label="Name" name="name" required defaultValue={customer.name} />
          <Field label="Email" name="email" type="email" defaultValue={customer.email} />
          <Field label="Phone" name="phone" defaultValue={customer.phone} />
          <Field label="VAT number" name="vatNumber" defaultValue={customer.vatNumber} />
          <Field
            label="Hourly rate (EUR)"
            name="hourlyRateEuros"
            type="number"
            step="0.01"
            defaultValue={centsToEuroInput(customer.defaultHourlyRateCents)}
          />
          <SelectField
            label="Status"
            name="status"
            defaultValue={customer.status}
            options={[
              { value: "active", label: "Active" },
              { value: "inactive", label: "Inactive" },
              { value: "archived", label: "Archived" },
            ]}
          />
          <Field label="Notes" name="notes" defaultValue={customer.notes} />
          <div className="flex items-end gap-3">
            <SubmitButton>Save</SubmitButton>
          </div>
        </form>
        <form action={deleteCustomerAction} className="mt-4">
          <input type="hidden" name="id" value={customer.id} />
          <DangerButton>Delete customer (only if empty)</DangerButton>
        </form>
      </Panel>
    </div>
  );
}
