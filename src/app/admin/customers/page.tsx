import Link from "next/link";
import { requireAdmin } from "@/lib/auth/admin";
import { listCustomers } from "@/lib/erp/dal";
import { formatMoney } from "@/lib/erp/money";
import { createCustomerAction } from "../actions";
import { Field, PageHeader, Panel, SelectField, SubmitButton } from "../ui";

export default async function CustomersPage() {
  await requireAdmin();
  const rows = await listCustomers();

  return (
    <div className="min-w-0">
      <PageHeader
        title="Customers"
        description="Client records for domains, hours, and payments."
      />

      <Panel className="mb-8">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-accent">
          Customers
        </h2>
        {rows.length === 0 ? (
          <p className="text-sm text-muted">No customers yet.</p>
        ) : (
          <ul className="space-y-3">
            {rows.map((customer) => (
              <li
                key={customer.id}
                className="border border-line bg-background/60 transition-colors hover:border-accent/50"
              >
                <Link
                  href={`/admin/customers/${customer.id}`}
                  className="block px-4 py-4 sm:px-5 sm:py-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-display text-xl tracking-wide text-foreground sm:text-2xl">
                      {customer.name}
                    </p>
                    <span className="shrink-0 capitalize text-xs uppercase tracking-wider text-muted">
                      {customer.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-muted">
                    {customer.defaultHourlyRateCents != null
                      ? `${formatMoney(customer.defaultHourlyRateCents, customer.currency)} / hr`
                      : "No hourly rate"}
                  </p>
                </Link>
                {(customer.email || customer.phone) && (
                  <div className="flex flex-wrap gap-2 border-t border-line px-4 py-3 sm:px-5">
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
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <Panel>
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
    </div>
  );
}
