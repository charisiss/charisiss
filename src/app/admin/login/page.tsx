"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth/client";

export default function AdminLoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  return (
    <div className="mx-auto flex min-h-[70dvh] max-w-md flex-col justify-center">
      <p className="eyebrow mb-3">Private</p>
      <h1 className="font-display text-3xl tracking-wide">ERP Sign in</h1>
      <p className="mt-3 text-sm text-muted">
        Google sign-in only. Access is limited to the allowlisted admin account.
      </p>

      <button
        type="button"
        disabled={pending}
        className="mt-8 rounded-sm bg-accent px-4 py-3 text-sm font-semibold text-background transition-opacity hover:opacity-90 disabled:opacity-60"
        onClick={async () => {
          setPending(true);
          setError(null);
          const { error: signInError } = await authClient.signIn.social({
            provider: "google",
            callbackURL: `${window.location.origin}/admin`,
          });
          if (signInError) {
            setError(signInError.message || "Sign-in failed");
            setPending(false);
          }
        }}
      >
        {pending ? "Redirecting…" : "Continue with Google"}
      </button>

      {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}
    </div>
  );
}
