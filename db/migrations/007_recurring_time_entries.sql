-- Move recurring flags from payments to time_entries (retainers / fixed recurring work)

ALTER TABLE erp.time_entries
  ADD COLUMN IF NOT EXISTS is_recurring boolean NOT NULL DEFAULT false;

ALTER TABLE erp.time_entries
  ADD COLUMN IF NOT EXISTS recurrence_interval text;

ALTER TABLE erp.time_entries
  ADD COLUMN IF NOT EXISTS next_due_on date;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'time_entries_recurrence_interval_check'
  ) THEN
    ALTER TABLE erp.time_entries
      ADD CONSTRAINT time_entries_recurrence_interval_check
      CHECK (
        recurrence_interval IS NULL
        OR recurrence_interval IN ('monthly', 'yearly')
      );
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS time_entries_next_due_on_idx
  ON erp.time_entries (next_due_on)
  WHERE is_recurring = true AND next_due_on IS NOT NULL;

DROP INDEX IF EXISTS erp.payments_next_due_on_idx;

ALTER TABLE erp.payments DROP COLUMN IF EXISTS is_recurring;
ALTER TABLE erp.payments DROP COLUMN IF EXISTS recurrence_interval;
ALTER TABLE erp.payments DROP COLUMN IF EXISTS next_due_on;
