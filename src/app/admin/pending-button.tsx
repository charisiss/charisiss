"use client";

import type { ReactNode } from "react";
import { useFormStatus } from "react-dom";

export function SubmitButton({
  children,
  pendingLabel = "Saving…",
  className = "w-full rounded-sm bg-accent px-4 py-2.5 text-sm font-semibold text-background transition-opacity hover:opacity-90 disabled:opacity-60 sm:w-auto sm:py-2",
}: {
  children: ReactNode;
  pendingLabel?: string;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={className} aria-busy={pending}>
      {pending ? pendingLabel : children}
    </button>
  );
}

export function DangerButton({
  children,
  pendingLabel = "Working…",
}: {
  children: ReactNode;
  pendingLabel?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className="rounded-sm border border-red-500/40 px-3 py-2 text-xs uppercase tracking-wider text-red-300 transition-colors hover:border-red-400 hover:text-red-200 disabled:opacity-60 sm:py-1.5"
    >
      {pending ? pendingLabel : children}
    </button>
  );
}
