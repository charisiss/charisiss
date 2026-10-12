"use client";

import { useEffect, useState } from "react";
import { clearFlash, type FlashToast } from "@/lib/erp/flash";

export function AdminToast({ initial }: { initial: FlashToast | null }) {
  const [toast, setToast] = useState<FlashToast | null>(initial);
  const [visible, setVisible] = useState(Boolean(initial));

  useEffect(() => {
    if (!initial) return;
    setToast(initial);
    setVisible(true);
    void clearFlash();

    const hide = window.setTimeout(() => setVisible(false), 3200);
    const clear = window.setTimeout(() => setToast(null), 3600);
    return () => {
      window.clearTimeout(hide);
      window.clearTimeout(clear);
    };
  }, [initial?.id]);

  if (!toast) return null;

  const isError = toast.type === "error";

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed inset-x-3 z-50 transition-all duration-300 sm:inset-x-auto sm:right-6 sm:max-w-sm ${
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-3 opacity-0 sm:translate-y-2"
      }`}
      style={{
        bottom: "max(0.75rem, env(safe-area-inset-bottom, 0px))",
      }}
    >
      <button
        type="button"
        onClick={() => {
          setVisible(false);
          window.setTimeout(() => setToast(null), 280);
        }}
        className={`w-full border px-4 py-3.5 text-left text-sm shadow-lg backdrop-blur-md sm:py-3 ${
          isError
            ? "border-red-500/40 bg-surface/95 text-red-200"
            : "border-accent/40 bg-surface/95 text-foreground"
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-[0.16em] text-muted">
              {isError ? "Error" : "Saved"}
            </p>
            <p className="mt-1 break-words leading-snug">{toast.message}</p>
          </div>
          <span aria-hidden className="mt-0.5 shrink-0 text-base leading-none text-muted">
            ×
          </span>
        </div>
      </button>
    </div>
  );
}
