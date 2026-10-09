"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useLenis } from "lenis/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, type MouseEvent } from "react";
import { navLinks, site } from "@/lib/content";

const ease = [0.76, 0, 0.24, 1] as const;

type MenuOverlayProps = {
  open: boolean;
  onClose: () => void;
};

export function MenuOverlay({ open, onClose }: MenuOverlayProps) {
  const lenis = useLenis();
  const pathname = usePathname();
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!open) return;
    lenis?.stop();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => firstLinkRef.current?.focus(), 350);

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);

    return () => {
      lenis?.start();
      document.body.style.overflow = previousOverflow;
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, lenis, onClose]);

  function handleNavigate(event: MouseEvent<HTMLAnchorElement>, href: string) {
    onClose();
    if (pathname !== "/" || !href.startsWith("/#")) return;
    event.preventDefault();
    const hash = href.slice(1);
    const target = document.querySelector<HTMLElement>(hash);
    if (!target) return;
    window.setTimeout(() => {
      if (lenis) lenis.scrollTo(target, { duration: 1.4 });
      else target.scrollIntoView({ behavior: "smooth" });
    }, 120);
  }

  const socials = [
    { label: "Instagram", href: site.social.instagram },
    { label: "LinkedIn", href: site.social.linkedin },
    { label: "Facebook", href: site.social.facebook },
  ];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="site-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="fixed inset-0 z-[60] flex flex-col bg-surface"
          initial={{ clipPath: "inset(0 0 100% 0)" }}
          animate={{ clipPath: "inset(0 0 0% 0)" }}
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.75, ease }}
          data-lenis-prevent
        >
          <div className="pointer-events-none absolute inset-0 hero-fallback opacity-60" />

          <nav className="relative mx-auto flex w-full max-w-[1600px] flex-1 flex-col justify-center px-6 pt-24 md:px-10">
            <ul className="flex flex-col gap-1 md:gap-2">
              {navLinks.map((link, i) => (
                <li key={link.href} className="overflow-hidden">
                  <motion.div
                    initial={{ y: "110%" }}
                    animate={{ y: "0%" }}
                    exit={{ y: "110%", transition: { duration: 0.4, ease } }}
                    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.25 + i * 0.06 }}
                  >
                    <Link
                      ref={i === 0 ? firstLinkRef : undefined}
                      href={link.href}
                      onClick={(event) => handleNavigate(event, link.href)}
                      className="group flex items-baseline gap-4 py-1 outline-none md:gap-8"
                    >
                      <span className="w-8 text-xs font-medium tabular-nums text-muted md:text-sm">
                        0{i + 1}
                      </span>
                      <span className="text-[13vw] font-semibold leading-[0.95] tracking-tight text-foreground transition-[color,transform] duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-4 group-hover:text-accent group-focus-visible:text-accent md:text-[7.5vw] lg:text-[6.5vw]">
                        {link.label}
                      </span>
                    </Link>
                  </motion.div>
                </li>
              ))}
            </ul>
          </nav>

          <motion.div
            className="relative mx-auto flex w-full max-w-[1600px] flex-col gap-6 border-t border-line px-6 py-8 text-sm md:flex-row md:items-center md:justify-between md:px-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.6, duration: 0.6 } }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
          >
            <a href={`mailto:${site.email}`} className="text-foreground transition-colors hover:text-accent">
              {site.email}
            </a>
            <ul className="flex gap-6 text-muted">
              {socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="transition-colors hover:text-foreground"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
