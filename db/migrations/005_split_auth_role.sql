-- Split Better Auth from ERP: erp_auth owns auth tables; erp_runtime keeps erp.* only.
-- Replace erp_auth password at apply time; never commit a real password.
-- Auth table grants previously given to erp_runtime in 004 are revoked here.

CREATE ROLE erp_auth LOGIN PASSWORD 'REPLACE_AT_APPLY_TIME'
  NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT NOBYPASSRLS;

GRANT CONNECT ON DATABASE neondb TO erp_auth;

GRANT SELECT, INSERT, UPDATE, DELETE ON
  "user", "session", "account", "verification"
TO erp_auth;

REVOKE ALL ON TABLE "user", "session", "account", "verification" FROM erp_runtime;
