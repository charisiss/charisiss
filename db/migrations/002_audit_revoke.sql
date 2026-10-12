-- Harden audit_log: app role is append-only
REVOKE UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER ON erp.audit_log FROM erp_app;
REVOKE ALL ON erp.audit_log FROM PUBLIC;
GRANT SELECT, INSERT ON erp.audit_log TO erp_app;
