import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { meetPage, site } from "@/lib/content";

export const metadata: Metadata = {
  title: meetPage.title,
  description: meetPage.description,
};

export default function MeetPage() {
  return (
    <>
      <Header />
      <main className="hero-fallback pt-32 md:pt-40">
        <div className="mx-auto max-w-[1600px] px-6 md:px-10">
          <p className="eyebrow flex items-center gap-3">
            <span className="h-px w-10 bg-accent" />
            Book a call
          </p>
          <h1 className="mt-6 max-w-4xl text-5xl font-semibold leading-[0.95] tracking-[-0.03em] md:text-7xl">
            Let&apos;s talk about your project.
          </h1>
          <p className="mt-6 max-w-2xl leading-relaxed text-foreground/70">{meetPage.description}</p>

          <div className="mt-12 overflow-hidden rounded-3xl border border-line bg-white md:mt-16">
            <iframe
              src={site.calendarEmbed}
              title="Book a meeting with Charisiss"
              className="h-[800px] w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              data-lenis-prevent
            />
          </div>

          <p className="mt-6 pb-24 text-sm text-muted">
            Prefer email?{" "}
            <a href={`mailto:${site.email}`} className="text-foreground transition-colors hover:text-accent">
              {site.email}
            </a>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
