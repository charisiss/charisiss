-- ERP schema: customers, assets, time entries, payments, audit log
-- Roles: erp_migrator (DDL, applied via Neon MCP owner), erp_app (DML only)

CREATE SCHEMA IF NOT EXISTS erp;

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

CREATE TABLE erp.customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text,
  phone text,
  vat_number text,
  notes text,
  status text NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'inactive', 'archived')),
  default_hourly_rate_cents integer
    CHECK (default_hourly_rate_cents IS NULL OR default_hourly_rate_cents >= 0),
  currency text NOT NULL DEFAULT 'EUR',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE erp.assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES erp.customers (id) ON DELETE RESTRICT,
  kind text NOT NULL
    CHECK (kind IN ('domain', 'server', 'hosting', 'other')),
  label text NOT NULL,
  provider text,
  expires_on date,
  renewal_price_cents integer
    CHECK (renewal_price_cents IS NULL OR renewal_price_cents >= 0),
  auto_renew boolean NOT NULL DEFAULT false,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX assets_customer_id_idx ON erp.assets (customer_id);
CREATE INDEX assets_expires_on_idx ON erp.assets (expires_on);

CREATE TABLE erp.time_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES erp.customers (id) ON DELETE RESTRICT,
  work_date date NOT NULL DEFAULT CURRENT_DATE,
  hours numeric(8, 2)
    CHECK (hours IS NULL OR hours >= 0),
  amount_cents integer
    CHECK (amount_cents IS NULL OR amount_cents >= 0),
  description text,
  billing_status text NOT NULL DEFAULT 'unbilled'
    CHECK (billing_status IN ('unbilled', 'billed', 'paid')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT time_entries_hours_or_amount_chk
    CHECK (hours IS NOT NULL OR amount_cents IS NOT NULL)
);

CREATE INDEX time_entries_customer_id_idx ON erp.time_entries (customer_id);
CREATE INDEX time_entries_work_date_idx ON erp.time_entries (work_date);
CREATE INDEX time_entries_billing_status_idx ON erp.time_entries (billing_status);

CREATE TABLE erp.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES erp.customers (id) ON DELETE RESTRICT,
  amount_cents integer NOT NULL CHECK (amount_cents >= 0),
  currency text NOT NULL DEFAULT 'EUR',
  paid_on date NOT NULL DEFAULT CURRENT_DATE,
  method text
    CHECK (method IS NULL OR method IN ('bank', 'cash', 'card', 'paypal', 'other')),
  reference text,
  note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX payments_customer_id_idx ON erp.payments (customer_id);
CREATE INDEX payments_paid_on_idx ON erp.payments (paid_on);

CREATE TABLE erp.audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor text NOT NULL,
  action text NOT NULL,
  entity text NOT NULL,
  entity_id uuid,
  meta jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX audit_log_created_at_idx ON erp.audit_log (created_at DESC);
CREATE INDEX audit_log_entity_idx ON erp.audit_log (entity, entity_id);

-- updated_at is set by the application on every UPDATE (avoids plpgsql in MCP)

-- ---------------------------------------------------------------------------
-- Privileges: revoke world access, grant erp_app DML only
-- ---------------------------------------------------------------------------

REVOKE ALL ON SCHEMA erp FROM PUBLIC;
GRANT USAGE ON SCHEMA erp TO erp_app;

REVOKE ALL ON ALL TABLES IN SCHEMA erp FROM PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON
  erp.customers,
  erp.assets,
  erp.time_entries,
  erp.payments
TO erp_app;

-- audit_log is append-only for the app role
REVOKE UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER ON erp.audit_log FROM erp_app;
GRANT SELECT, INSERT ON erp.audit_log TO erp_app;

ALTER DEFAULT PRIVILEGES IN SCHEMA erp
  REVOKE ALL ON TABLES FROM PUBLIC;

-- ---------------------------------------------------------------------------
-- Row Level Security (defense in depth; app is single-admin)
-- ---------------------------------------------------------------------------

ALTER TABLE erp.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE erp.assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE erp.time_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE erp.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE erp.audit_log ENABLE ROW LEVEL SECURITY;

ALTER TABLE erp.customers FORCE ROW LEVEL SECURITY;
ALTER TABLE erp.assets FORCE ROW LEVEL SECURITY;
ALTER TABLE erp.time_entries FORCE ROW LEVEL SECURITY;
ALTER TABLE erp.payments FORCE ROW LEVEL SECURITY;
ALTER TABLE erp.audit_log FORCE ROW LEVEL SECURITY;

CREATE POLICY erp_app_all ON erp.customers
  FOR ALL TO erp_app USING (true) WITH CHECK (true);

CREATE POLICY erp_app_all ON erp.assets
  FOR ALL TO erp_app USING (true) WITH CHECK (true);

CREATE POLICY erp_app_all ON erp.time_entries
  FOR ALL TO erp_app USING (true) WITH CHECK (true);

CREATE POLICY erp_app_all ON erp.payments
  FOR ALL TO erp_app USING (true) WITH CHECK (true);

CREATE POLICY erp_app_select ON erp.audit_log
  FOR SELECT TO erp_app USING (true);

CREATE POLICY erp_app_insert ON erp.audit_log
  FOR INSERT TO erp_app WITH CHECK (true);
