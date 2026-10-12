-- Recurring payment flags on erp.payments

ALTER TABLE erp.payments
  ADD COLUMN IF NOT EXISTS is_recurring boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS recurrence_interval text
    CHECK (
      recurrence_interval IS NULL
      OR recurrence_interval IN ('monthly', 'yearly')
    ),
  ADD COLUMN IF NOT EXISTS next_due_on date;

CREATE INDEX IF NOT EXISTS payments_next_due_on_idx
  ON erp.payments (next_due_on)
  WHERE is_recurring = true AND next_due_on IS NOT NULL;
