import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";

config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL);
const rows = await sql`
  SELECT
    current_user,
    has_table_privilege(current_user, 'erp.audit_log', 'DELETE') AS can_delete_audit,
    has_schema_privilege(current_user, 'erp', 'CREATE') AS can_ddl,
    (SELECT count(*)::int FROM erp.customers) AS customers
`;
console.log(rows);
