"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SignOutButton } from "./sign-out-button";

const links: { href: string; label: string; exact?: boolean }[] = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/customers", label: "Customers" },
  { href: "/admin/assets", label: "Assets" },
  { href: "/admin/time", label: "Time" },
  { href: "/admin/payments", label: "Payments" },
];

function isActive(pathname: string, href: string, exact?: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminNav({ email }: { email: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-line bg-surface/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
        <Link href="/admin" className="wordmark shrink-0 text-sm text-accent">
          Charisiss ERP
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => {
            const active = isActive(pathname, link.href, link.exact);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-sm px-2.5 py-1.5 text-sm transition-colors ${
                  active ? "bg-accent/10 text-accent" : "text-muted hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <span className="hidden max-w-[14rem] truncate text-sm text-muted lg:inline">
            {email}
          </span>
          <div className="hidden md:block">
            <SignOutButton />
          </div>
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-sm border border-line text-foreground md:hidden"
            aria-expanded={open}
            aria-controls="admin-mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <span className="flex w-4 flex-col gap-1" aria-hidden>
              <span
                className={`h-px w-full bg-current transition ${open ? "translate-y-[5px] rotate-45" : ""}`}
              />
              <span className={`h-px w-full bg-current transition ${open ? "opacity-0" : ""}`} />
              <span
                className={`h-px w-full bg-current transition ${open ? "-translate-y-[5px] -rotate-45" : ""}`}
              />
            </span>
          </button>
        </div>
      </div>

      <div
        id="admin-mobile-nav"
        hidden={!open}
        className="border-t border-line md:hidden"
      >
        <nav className="mx-auto flex max-w-6xl flex-col px-2 py-2 sm:px-4">
          {links.map((link) => {
            const active = isActive(pathname, link.href, link.exact);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-sm px-3 py-3 text-sm ${
                  active ? "bg-accent/10 text-accent" : "text-muted"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="mt-1 flex items-center justify-between gap-3 border-t border-line px-3 py-3 md:hidden">
            <span className="min-w-0 truncate text-xs text-muted">{email}</span>
            <SignOutButton />
          </div>
        </nav>
      </div>
    </header>
  );
}
