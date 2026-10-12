import "server-only";

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

type Db = ReturnType<typeof drizzle<typeof schema>>;

let cached: Db | null = null;

export function getDb() {
  if (cached) return cached;
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not configured");
  }
  cached = drizzle({ client: neon(url), schema });
  return cached;
}

/** Prefer getDb(); kept for concise call sites after auth gate. */
export const db = new Proxy({} as Db, {
  get(_target, prop, receiver) {
    const instance = getDb() as unknown as Record<PropertyKey, unknown>;
    const value = Reflect.get(instance, prop, receiver);
    return typeof value === "function" ? value.bind(instance) : value;
  },
});
