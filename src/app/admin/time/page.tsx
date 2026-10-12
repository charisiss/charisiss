import Link from "next/link";
import { requireAdmin } from "@/lib/auth/admin";
import { listCustomers, listTimeEntries } from "@/lib/erp/dal";
import { formatMoney } from "@/lib/erp/money";
import {
  createTimeEntryAction,
  deleteTimeEntryAction,
  updateTimeEntryStatusAction,
} from "../actions";
import {
  DangerButton,
  Field,
  PageHeader,
  Panel,
  SelectField,
  SubmitButton,
  Table,
} from "../ui";

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
            options={[
              { value: "unbilled", label: "Unbilled" },
              { value: "billed", label: "Billed" },
              { value: "paid", label: "Paid" },
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
              <tr key={entry.id} className="border-b border-line/60 align-top">
                <td className="py-2 pr-3">{entry.workDate}</td>
                <td className="py-2 pr-3">
                  <Link
                    href={`/admin/customers/${entry.customerId}`}
                    className="hover:text-accent"
                  >
                    {entry.customerName}
                  </Link>
                </td>
                <td className="py-2 pr-3">{entry.hours ?? "—"}</td>
                <td className="py-2 pr-3">
                  {formatMoney(entry.amountCents, entry.currency)}
                </td>
                <td className="py-2 pr-3">
                  <form action={updateTimeEntryStatusAction} className="flex gap-2">
                    <input type="hidden" name="id" value={entry.id} />
                    <input type="hidden" name="customerId" value={entry.customerId} />
                    <select
                      name="billingStatus"
                      defaultValue={entry.billingStatus}
                      className="rounded-sm border border-line bg-background px-2 py-1 text-xs"
                    >
                      <option value="unbilled">Unbilled</option>
                      <option value="billed">Billed</option>
                      <option value="paid">Paid</option>
                    </select>
                    <SubmitButton
                      pendingLabel="…"
                      className="text-xs text-accent hover:underline disabled:opacity-60"
                    >
                      Save
                    </SubmitButton>
                  </form>
                </td>
                <td className="py-2 pr-3 text-muted">{entry.description ?? "—"}</td>
                <td className="py-2">
                  <form action={deleteTimeEntryAction}>
                    <input type="hidden" name="id" value={entry.id} />
                    <input type="hidden" name="customerId" value={entry.customerId} />
                    <DangerButton>Delete</DangerButton>
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
