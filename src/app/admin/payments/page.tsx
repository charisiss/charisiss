import Link from "next/link";
import { requireAdmin } from "@/lib/auth/admin";
import { listCustomers, listPayments } from "@/lib/erp/dal";
import { formatMoney } from "@/lib/erp/money";
import { createPaymentAction, deletePaymentAction } from "../actions";
import {
  DangerButton,
  Field,
  PageHeader,
  Panel,
  SelectField,
  SubmitButton,
  Table,
} from "../ui";

export default async function PaymentsPage() {
  await requireAdmin();
  const [rows, customers] = await Promise.all([listPayments(), listCustomers()]);
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div>
      <PageHeader title="Payments" description="Record what clients have paid." />

      <Panel className="mb-8">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-accent">
          Record payment
        </h2>
        <form action={createPaymentAction} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <SelectField
            label="Customer"
            name="customerId"
            options={customers.map((c) => ({ value: c.id, label: c.name }))}
          />
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
          <Field label="Note" name="note" />
          <input type="hidden" name="currency" value="EUR" />
          <div className="flex items-end">
            <SubmitButton>Save payment</SubmitButton>
          </div>
        </form>
      </Panel>

      <Panel>
        <Table>
          <thead>
            <tr className="border-b border-line text-muted">
              <th className="py-2 pr-3 font-medium">Date</th>
              <th className="py-2 pr-3 font-medium">Customer</th>
              <th className="py-2 pr-3 font-medium">Amount</th>
              <th className="py-2 pr-3 font-medium">Method</th>
              <th className="py-2 pr-3 font-medium">Reference</th>
              <th className="py-2 font-medium" />
            </tr>
          </thead>
          <tbody>
            {rows.map((payment) => (
              <tr key={payment.id} className="border-b border-line/60">
                <td className="py-2 pr-3">{payment.paidOn}</td>
                <td className="py-2 pr-3">
                  <Link
                    href={`/admin/customers/${payment.customerId}`}
                    className="hover:text-accent"
                  >
                    {payment.customerName}
                  </Link>
                </td>
                <td className="py-2 pr-3">
                  {formatMoney(payment.amountCents, payment.currency)}
                </td>
                <td className="py-2 pr-3">{payment.method ?? "—"}</td>
                <td className="py-2 pr-3 text-muted">{payment.reference ?? "—"}</td>
                <td className="py-2">
                  <form action={deletePaymentAction}>
                    <input type="hidden" name="id" value={payment.id} />
                    <input type="hidden" name="customerId" value={payment.customerId} />
                    <DangerButton>Delete</DangerButton>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        {rows.length === 0 ? <p className="mt-4 text-sm text-muted">No payments yet.</p> : null}
      </Panel>
    </div>
  );
}
