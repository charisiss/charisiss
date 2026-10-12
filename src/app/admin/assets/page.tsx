import Link from "next/link";
import { requireAdmin } from "@/lib/auth/admin";
import { listAssets, listCustomers } from "@/lib/erp/dal";
import { daysUntil, formatMoney } from "@/lib/erp/money";
import { createAssetAction, deleteAssetAction } from "../actions";
import {
  DangerButton,
  ExpiryBadge,
  Field,
  PageHeader,
  Panel,
  SelectField,
  SubmitButton,
  Table,
} from "../ui";

export default async function AssetsPage() {
  await requireAdmin();
  const [rows, customers] = await Promise.all([listAssets(), listCustomers()]);

  return (
    <div>
      <PageHeader
        title="Assets"
        description="Domains, servers, and hosting renewals. Never store passwords here."
      />

      <Panel className="mb-8">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-accent">
          Add asset
        </h2>
        <form action={createAssetAction} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <SelectField
            label="Customer"
            name="customerId"
            options={customers.map((c) => ({ value: c.id, label: c.name }))}
          />
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
          <Field label="Renewal price (EUR)" name="renewalPriceEuros" type="number" step="0.01" />
          <label className="flex items-center gap-2 self-end text-sm text-muted">
            <input type="checkbox" name="autoRenew" /> Auto renew
          </label>
          <div className="flex items-end">
            <SubmitButton>Create</SubmitButton>
          </div>
        </form>
      </Panel>

      <Panel>
        <Table>
          <thead>
            <tr className="border-b border-line text-muted">
              <th className="py-2 pr-3 font-medium">Label</th>
              <th className="py-2 pr-3 font-medium">Customer</th>
              <th className="py-2 pr-3 font-medium">Expires</th>
              <th className="py-2 pr-3 font-medium">In</th>
              <th className="py-2 pr-3 font-medium">Renewal</th>
              <th className="py-2 font-medium" />
            </tr>
          </thead>
          <tbody>
            {rows.map((asset) => (
              <tr key={asset.id} className="border-b border-line/60">
                <td className="py-2 pr-3">
                  {asset.label}
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
                <td className="py-2 pr-3">{asset.expiresOn ?? "—"}</td>
                <td className="py-2 pr-3">
                  <ExpiryBadge days={daysUntil(asset.expiresOn)} />
                </td>
                <td className="py-2 pr-3">{formatMoney(asset.renewalPriceCents)}</td>
                <td className="py-2">
                  <form action={deleteAssetAction}>
                    <input type="hidden" name="id" value={asset.id} />
                    <input type="hidden" name="customerId" value={asset.customerId} />
                    <DangerButton>Delete</DangerButton>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        {rows.length === 0 ? <p className="mt-4 text-sm text-muted">No assets yet.</p> : null}
        {customers.length === 0 ? (
          <p className="mt-4 text-sm text-amber-300">Create a customer before adding assets.</p>
        ) : null}
      </Panel>
    </div>
  );
}
