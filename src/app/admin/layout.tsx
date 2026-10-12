import type { Metadata } from "next";
import { getAdminOrNull } from "@/lib/auth/admin";
import { peekFlash } from "@/lib/erp/flash";
import { AdminNav } from "./admin-nav";
import { AdminToast } from "./toast";

export const metadata: Metadata = {
  title: "ERP",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [admin, flash] = await Promise.all([getAdminOrNull(), peekFlash()]);

  return (
    <div
      className="min-h-dvh max-w-[100vw] overflow-x-clip bg-background text-foreground"
      data-lenis-prevent
    >
      {admin ? <AdminNav email={admin.email} /> : null}
      <main
        className={`mx-auto min-w-0 max-w-6xl px-4 py-6 sm:px-6 sm:py-8 ${
          admin ? "pt-[4.75rem] sm:pt-[5.25rem]" : ""
        }`}
      >
        {children}
      </main>
      <AdminToast key={flash?.id ?? "empty"} initial={flash} />
    </div>
  );
}
