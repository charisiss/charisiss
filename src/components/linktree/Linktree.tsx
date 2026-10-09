"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  CalendarIcon,
  FacebookIcon,
  GlobeIcon,
  InstagramIcon,
  LinkedInIcon,
} from "@/components/icons/SocialIcons";
import { linktreeLinks, site } from "@/lib/content";

const icons = {
  globe: GlobeIcon,
  linkedin: LinkedInIcon,
  instagram: InstagramIcon,
  facebook: FacebookIcon,
  calendar: CalendarIcon,
};

const ease = [0.16, 1, 0.3, 1] as const;

export function Linktree() {
  return (
    <main className="relative flex min-h-dvh flex-col items-center overflow-hidden px-5 py-16 sm:px-6 sm:py-20">
      <div aria-hidden className="hero-fallback pointer-events-none absolute inset-0 opacity-80" />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-24 size-[28rem] -translate-x-1/2 rounded-full bg-accent/15 blur-[100px]"
      />

      <div className="relative z-10 w-full max-w-md">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease }}
        >
          <p className="wordmark text-3xl text-accent sm:text-4xl">{site.name}</p>
          <p className="mt-3 text-xs font-semibold tracking-[0.28em] text-foreground uppercase">
            {site.tagline}
          </p>
        </motion.div>

        <ul className="mt-12 space-y-3.5">
          {linktreeLinks.map((item, i) => {
            const Icon = icons[item.icon];
            const className =
              "group flex w-full items-center gap-4 rounded-2xl border border-line bg-surface/90 px-4 py-4 text-left backdrop-blur-sm transition-[border-color,background-color,transform,box-shadow] duration-500 ease-[var(--ease-out-expo)] hover:border-accent/50 hover:bg-surface hover:shadow-[0_0_36px_-12px_var(--accent)] active:scale-[0.985]";

            const inner = (
              <>
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent transition-colors duration-500 group-hover:bg-accent group-hover:text-background">
                  <Icon className="size-5" />
                </span>
                <span className="flex-1 text-sm font-semibold tracking-[0.18em] uppercase">
                  {item.label}
                </span>
                <span
                  aria-hidden
                  className="text-muted transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-1 group-hover:text-accent"
                >
                  →
                </span>
              </>
            );

            return (
              <motion.li
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease, delay: 0.12 + i * 0.07 }}
              >
                {item.external ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className={className}
                  >
                    {inner}
                  </a>
                ) : (
                  <Link href={item.href} className={className}>
                    {inner}
                  </Link>
                )}
              </motion.li>
            );
          })}
        </ul>

        <motion.p
          className="mt-12 text-center text-xs tracking-[0.2em] text-muted uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          © {new Date().getFullYear()} {site.name}
        </motion.p>
      </div>
    </main>
  );
}
