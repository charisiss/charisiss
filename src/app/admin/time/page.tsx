import Link from "next/link";
import { requireAdmin } from "@/lib/auth/admin";
import { listCustomers, listTimeEntries } from "@/lib/erp/dal";
import { formatMoney } from "@/lib/erp/money";
import { AutoSubmitSelect } from "../auto-submit-select";
import {
  createTimeEntryAction,
  deleteTimeEntryAction,
  updateTimeEntryStatusAction,
} from "../actions";
import {
  Field,
  PageHeader,
  Panel,
  SelectField,
  SubmitButton,
  Table,
} from "../ui";

const statusOptions = [
  { value: "unbilled", label: "Unbilled" },
  { value: "billed", label: "Billed" },
  { value: "paid", label: "Paid" },
];

export default async function TimePage() {
  await requireAdmin();
  const [rows, customers] = await Promise.all([listTimeEntries(), listCustomers()]);
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div>
      <PageHeader
        title="Time & pricing"
        description="Log hours, a fixed price, or both. Hourly rate fills amount when only hours are set."
      />

      <Panel className="mb-8">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-accent">
          Log work
        </h2>
        <form action={createTimeEntryAction} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <SelectField
            label="Customer"
            name="customerId"
            options={customers.map((c) => ({ value: c.id, label: c.name }))}
          />
          <Field label="Work date" name="workDate" type="date" required defaultValue={today} />
          <Field label="Hours" name="hours" type="number" step="0.25" />
          <Field label="Amount (EUR)" name="amountEuros" type="number" step="0.01" />
          <Field label="Comment" name="description" />
          <SelectField
            label="Status"
            name="billingStatus"
            defaultValue="unbilled"
            options={statusOptions}
          />
          <label className="flex items-center gap-2 text-sm text-muted">
            <input type="checkbox" name="isRecurring" /> Recurring
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
          <div className="flex items-end">
            <SubmitButton>Add entry</SubmitButton>
          </div>
        </form>
      </Panel>

      <Panel>
        <Table>
          <thead>
            <tr className="border-b border-line text-muted">
              <th className="py-2 pr-3 font-medium">Date</th>
              <th className="py-2 pr-3 font-medium">Customer</th>
              <th className="py-2 pr-3 font-medium">Hours</th>
              <th className="py-2 pr-3 font-medium">Amount</th>
              <th className="py-2 pr-3 font-medium">Status</th>
              <th className="py-2 pr-3 font-medium">Note</th>
              <th className="py-2 font-medium" />
            </tr>
          </thead>
          <tbody>
            {rows.map((entry) => (
              <tr key={entry.id} className="border-b border-line/60">
                <td className="py-2.5 pr-3 whitespace-nowrap">{entry.workDate}</td>
                <td className="py-2.5 pr-3">
                  <Link
                    href={`/admin/customers/${entry.customerId}`}
                    className="hover:text-accent"
                  >
                    {entry.customerName}
                  </Link>
                </td>
                <td className="py-2.5 pr-3">{entry.hours ?? "—"}</td>
                <td className="py-2.5 pr-3 whitespace-nowrap">
                  {formatMoney(entry.amountCents, entry.currency)}
                </td>
                <td className="py-2.5 pr-3">
                  <form action={updateTimeEntryStatusAction}>
                    <input type="hidden" name="id" value={entry.id} />
                    <input type="hidden" name="customerId" value={entry.customerId} />
                    <AutoSubmitSelect
                      name="billingStatus"
                      defaultValue={entry.billingStatus}
                      options={statusOptions}
                    />
                  </form>
                </td>
                <td className="py-2.5 pr-3 text-muted">
                  <span>{entry.description ?? "—"}</span>
                  {entry.isRecurring ? (
                    <span className="mt-0.5 block text-xs">
                      {entry.recurrenceInterval ?? "monthly"} · next{" "}
                      {entry.nextDueOn ?? "—"}
                    </span>
                  ) : null}
                </td>
                <td className="py-2.5 text-right">
                  <form action={deleteTimeEntryAction}>
                    <input type="hidden" name="id" value={entry.id} />
                    <input type="hidden" name="customerId" value={entry.customerId} />
                    <SubmitButton
                      pendingLabel="…"
                      className="text-xs text-muted underline-offset-2 hover:text-red-300 hover:underline disabled:opacity-60"
                    >
                      Delete
                    </SubmitButton>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        {rows.length === 0 ? <p className="mt-4 text-sm text-muted">No time entries yet.</p> : null}
      </Panel>
    </div>
  );
}
