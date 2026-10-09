"use client";

import { useLenis } from "lenis/react";
import Link from "next/link";
import { navLinks, site } from "@/lib/content";

const socials = [
  { label: "Instagram", href: site.social.instagram },
  { label: "LinkedIn", href: site.social.linkedin },
  { label: "Facebook", href: site.social.facebook },
];

export function Footer() {
  const lenis = useLenis();

  function backToTop() {
    if (lenis) lenis.scrollTo(0, { duration: 1.6 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <footer className="relative overflow-hidden border-t border-line">
      <div className="mx-auto grid max-w-[1600px] gap-12 px-6 pb-10 pt-16 md:grid-cols-12 md:px-10 md:pt-24">
        <div className="md:col-span-5">
          <p className="eyebrow">Say hello</p>
          <a
            href={`mailto:${site.email}`}
            className="mt-4 inline-block text-2xl font-semibold tracking-tight transition-colors hover:text-accent md:text-3xl"
          >
            {site.email}
          </a>
        </div>

        <nav aria-label="Footer" className="md:col-span-3 md:col-start-7">
          <p className="eyebrow">Menu</p>
          <ul className="mt-4 space-y-2 text-foreground/80">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition-colors hover:text-accent">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-3">
          <p className="eyebrow">Socials</p>
          <ul className="mt-4 space-y-2 text-foreground/80">
            {socials.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="transition-colors hover:text-accent"
                >
                  {social.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        <p
          aria-hidden
          className="wordmark select-none whitespace-nowrap text-center text-[15.5vw] leading-[0.8] text-foreground/[0.06] md:text-[15.8vw]"
        >
          {site.name}
        </p>
      </div>

      <div className="mx-auto flex max-w-[1600px] flex-col gap-4 border-t border-line px-6 py-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between md:px-10">
        <p>
          © {new Date().getFullYear()} {site.name.toUpperCase()} · {site.tagline}
        </p>
        <button
          type="button"
          onClick={backToTop}
          className="self-start tracking-[0.2em] uppercase transition-colors hover:text-foreground sm:self-auto"
        >
          Back to top ↑
        </button>
      </div>
    </footer>
  );
}
