import "server-only";

import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./server";

export type AdminUser = {
  id: string;
  email: string;
  name: string | null;
};

function allowedAdminEmails(): Set<string> {
  const raw = process.env.ADMIN_EMAIL ?? "";
  return new Set(
    raw
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean),
  );
}

function isAllowedAdmin(email: string | null | undefined, emailVerified?: boolean | null) {
  if (!email || emailVerified !== true) return false;
  return allowedAdminEmails().has(email.trim().toLowerCase());
}

export const getSessionUser = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session?.user ?? null;
});

/** Authoritative gate — call from every page, action, and DAL entry. */
export const requireAdmin = cache(async (): Promise<AdminUser> => {
  const user = await getSessionUser();

  if (!user?.email || !isAllowedAdmin(user.email, user.emailVerified)) {
    redirect("/admin/login");
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name ?? null,
  };
});

export async function getAdminOrNull(): Promise<AdminUser | null> {
  const user = await getSessionUser();
  if (!user?.email || !isAllowedAdmin(user.email, user.emailVerified)) {
    return null;
  }
  return {
    id: user.id,
    email: user.email,
    name: user.name ?? null,
  };
}
