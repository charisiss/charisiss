"use server";

import { cookies } from "next/headers";

const COOKIE = "erp_flash";

export type FlashToast = {
  id: string;
  type: "success" | "error";
  message: string;
};

export async function setFlash(toast: Omit<FlashToast, "id">) {
  const jar = await cookies();
  const payload: FlashToast = {
    ...toast,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  };
  jar.set(COOKIE, JSON.stringify(payload), {
    path: "/admin",
    maxAge: 60,
    sameSite: "lax",
    httpOnly: true,
  });
}

export async function peekFlash(): Promise<FlashToast | null> {
  const jar = await cookies();
  const raw = jar.get(COOKIE)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as FlashToast;
  } catch {
    return null;
  }
}

export async function clearFlash() {
  const jar = await cookies();
  jar.set(COOKIE, "", {
    path: "/admin",
    maxAge: 0,
    sameSite: "lax",
    httpOnly: true,
  });
}
