import Link from "next/link";
import { requireAdmin } from "@/lib/auth/admin";
import { listCustomers } from "@/lib/erp/dal";
import { formatMoney } from "@/lib/erp/money";
import { createCustomerAction } from "../actions";
import { Field, PageHeader, Panel, SelectField, SubmitButton, Table } from "../ui";

export default async function CustomersPage() {
  await requireAdmin();
  const rows = await listCustomers();

  return (
    <div>
      <PageHeader
        title="Customers"
        description="Client records for domains, hours, and payments."
      />

      <Panel className="mb-8">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-accent">
          Add customer
        </h2>
        <form action={createCustomerAction} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Name" name="name" required />
          <Field label="Email" name="email" type="email" />
          <Field label="Phone" name="phone" />
          <Field label="VAT number" name="vatNumber" />
          <Field label="Hourly rate (EUR)" name="hourlyRateEuros" type="number" step="0.01" />
          <SelectField
            label="Status"
            name="status"
            defaultValue="active"
            options={[
              { value: "active", label: "Active" },
              { value: "inactive", label: "Inactive" },
              { value: "archived", label: "Archived" },
            ]}
          />
          <Field label="Notes" name="notes" />
          <input type="hidden" name="currency" value="EUR" />
          <div className="flex items-end">
            <SubmitButton>Create</SubmitButton>
          </div>
        </form>
      </Panel>

      <Panel>
        <Table>
          <thead>
            <tr className="border-b border-line text-muted">
              <th className="py-2 pr-3 font-medium">Name</th>
              <th className="py-2 pr-3 font-medium">Email</th>
              <th className="py-2 pr-3 font-medium">Rate</th>
              <th className="py-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((customer) => (
              <tr key={customer.id} className="border-b border-line/60">
                <td className="py-2 pr-3">
                  <Link href={`/admin/customers/${customer.id}`} className="hover:text-accent">
                    {customer.name}
                  </Link>
                </td>
                <td className="py-2 pr-3 text-muted">{customer.email ?? "—"}</td>
                <td className="py-2 pr-3">
                  {customer.defaultHourlyRateCents != null
                    ? formatMoney(customer.defaultHourlyRateCents, customer.currency)
                    : "—"}
                </td>
                <td className="py-2 capitalize text-muted">{customer.status}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        {rows.length === 0 ? (
          <p className="mt-4 text-sm text-muted">No customers yet.</p>
        ) : null}
      </Panel>
    </div>
  );
}
