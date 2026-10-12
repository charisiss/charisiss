-- Least-privilege app role (SQL-created — avoids Neon API neon_superuser / BYPASSRLS).
-- Replace the password at apply time; never commit a real password.

CREATE ROLE erp_runtime LOGIN PASSWORD 'REPLACE_AT_APPLY_TIME'
  NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT NOBYPASSRLS;

GRANT CONNECT ON DATABASE neondb TO erp_runtime;
GRANT USAGE ON SCHEMA erp TO erp_runtime;
GRANT SELECT, INSERT, UPDATE, DELETE ON
  erp.customers, erp.assets, erp.time_entries, erp.payments
TO erp_runtime;
GRANT SELECT, INSERT ON erp.audit_log TO erp_runtime;

CREATE POLICY erp_runtime_all ON erp.customers
  FOR ALL TO erp_runtime USING (true) WITH CHECK (true);
CREATE POLICY erp_runtime_all ON erp.assets
  FOR ALL TO erp_runtime USING (true) WITH CHECK (true);
CREATE POLICY erp_runtime_all ON erp.time_entries
  FOR ALL TO erp_runtime USING (true) WITH CHECK (true);
CREATE POLICY erp_runtime_all ON erp.payments
  FOR ALL TO erp_runtime USING (true) WITH CHECK (true);
CREATE POLICY erp_runtime_select ON erp.audit_log
  FOR SELECT TO erp_runtime USING (true);
CREATE POLICY erp_runtime_insert ON erp.audit_log
  FOR INSERT TO erp_runtime WITH CHECK (true);
