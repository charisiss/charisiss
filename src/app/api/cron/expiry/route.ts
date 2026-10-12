import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export const dynamic = "force-dynamic";

function authorize(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;

  const header = request.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) return false;

  const token = header.slice("Bearer ".length);
  const a = Buffer.from(token);
  const b = Buffer.from(secret);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function GET(request: Request) {
  if (!authorize(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    return NextResponse.json({ error: "Misconfigured" }, { status: 500 });
  }

  const sql = neon(databaseUrl);
  const today = new Date();
  const in30 = new Date(today);
  in30.setDate(in30.getDate() + 30);
  const in60 = new Date(today);
  in60.setDate(in60.getDate() + 60);
  const in90 = new Date(today);
  in90.setDate(in90.getDate() + 90);

  const rows = await sql`
    SELECT
      a.id,
      a.label,
      a.kind,
      a.expires_on,
      CASE
        WHEN a.expires_on <= ${in30.toISOString().slice(0, 10)}::date THEN 30
        WHEN a.expires_on <= ${in60.toISOString().slice(0, 10)}::date THEN 60
        ELSE 90
      END AS window_days
    FROM erp.assets a
    WHERE a.expires_on IS NOT NULL
      AND a.expires_on >= ${today.toISOString().slice(0, 10)}::date
      AND a.expires_on <= ${in90.toISOString().slice(0, 10)}::date
    ORDER BY a.expires_on ASC
  `;

  return NextResponse.json({
    checkedAt: new Date().toISOString(),
    count: rows.length,
    assets: rows,
  });
}
