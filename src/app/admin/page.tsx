import Link from "next/link";
import { requireAdmin } from "@/lib/auth/admin";
import { getDashboard } from "@/lib/erp/dal";
import { daysUntil, formatMoney } from "@/lib/erp/money";
import { ExpiryBadge, PageHeader, Panel, Table } from "./ui";

export default async function AdminDashboardPage() {
  await requireAdmin();
  const data = await getDashboard();

  return (
    <div className="min-w-0">
      <PageHeader
        title="Dashboard"
        description="Expiring domains/servers, unbilled work, and recent payments."
      />

      <div className="mb-8 grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Panel>
          <p className="text-xs uppercase tracking-wider text-muted">Customers</p>
          <p className="mt-2 font-display text-3xl">{data.customerCount}</p>
        </Panel>
        <Panel>
          <p className="text-xs uppercase tracking-wider text-muted">They owe you</p>
          <p className="mt-2 font-display text-3xl">
            {formatMoney(data.owedCents, data.owedCurrency)}
          </p>
        </Panel>
        <Panel>
          <p className="text-xs uppercase tracking-wider text-muted">Expiring ≤90d</p>
          <p className="mt-2 font-display text-3xl">{data.expiringAssets.length}</p>
        </Panel>
        <Panel>
          <p className="text-xs uppercase tracking-wider text-muted">Unbilled customers</p>
          <p className="mt-2 font-display text-3xl">{data.unbilled.length}</p>
        </Panel>
      </div>

      <div className="grid min-w-0 gap-6 lg:grid-cols-2">
        <Panel>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-accent">
            Expiring assets
          </h2>
          {data.expiringAssets.length === 0 ? (
            <p className="text-sm text-muted">Nothing expiring in the next 90 days.</p>
          ) : (
            <Table>
              <thead>
                <tr className="border-b border-line text-muted">
                  <th className="py-2 pr-3 font-medium">Asset</th>
                  <th className="py-2 pr-3 font-medium">Customer</th>
                  <th className="py-2 pr-3 font-medium">Expires</th>
                  <th className="py-2 font-medium">In</th>
                </tr>
              </thead>
              <tbody>
                {data.expiringAssets.map((asset) => (
                  <tr key={asset.id} className="border-b border-line/60">
                    <td className="py-2 pr-3">
                      <span className="text-foreground">{asset.label}</span>
                      <span className="ml-2 text-xs text-muted">{asset.kind}</span>
                    </td>
                    <td className="py-2 pr-3">
                      <Link
                        href={`/admin/customers/${asset.customerId}`}
                        className="hover:text-accent"
                      >
                        {asset.customerName}
                      </Link>
                    </td>
                    <td className="py-2 pr-3">{asset.expiresOn}</td>
                    <td className="py-2">
                      <ExpiryBadge days={daysUntil(asset.expiresOn)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Panel>

        <Panel>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-accent">
            Unbilled work
          </h2>
          {data.unbilled.length === 0 ? (
            <p className="text-sm text-muted">No unbilled time entries.</p>
          ) : (
            <Table>
              <thead>
                <tr className="border-b border-line text-muted">
                  <th className="py-2 pr-3 font-medium">Customer</th>
                  <th className="py-2 pr-3 font-medium">Hours</th>
                  <th className="py-2 font-medium">Amount</th>
                </tr>
              </thead>
              <tbody>
                {data.unbilled.map((row) => (
                  <tr key={row.customerId} className="border-b border-line/60">
                    <td className="py-2 pr-3">
                      <Link
                        href={`/admin/customers/${row.customerId}`}
                        className="hover:text-accent"
                      >
                        {row.customerName}
                      </Link>
                    </td>
                    <td className="py-2 pr-3">{Number(row.hours).toFixed(2)}</td>
                    <td className="py-2">{formatMoney(Number(row.amountCents), row.currency)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Panel>
      </div>

      <Panel className="mt-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-accent">
          Recent payments
        </h2>
        {data.recentPayments.length === 0 ? (
          <p className="text-sm text-muted">No payments recorded yet.</p>
        ) : (
          <Table>
            <thead>
              <tr className="border-b border-line text-muted">
                <th className="py-2 pr-3 font-medium">Date</th>
                <th className="py-2 pr-3 font-medium">Customer</th>
                <th className="py-2 pr-3 font-medium">Amount</th>
                <th className="py-2 font-medium">Method</th>
              </tr>
            </thead>
            <tbody>
              {data.recentPayments.map((payment) => (
                <tr key={payment.id} className="border-b border-line/60">
                  <td className="py-2 pr-3">{payment.paidOn}</td>
                  <td className="py-2 pr-3">{payment.customerName}</td>
                  <td className="py-2 pr-3">
                    {formatMoney(payment.amountCents, payment.currency)}
                  </td>
                  <td className="py-2 text-muted">{payment.method ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Panel>
    </div>
  );
}
