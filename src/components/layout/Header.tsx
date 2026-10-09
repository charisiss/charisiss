"use client";

import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import Link from "next/link";
import { useCallback, useState } from "react";
import { site } from "@/lib/content";
import { useIntroReady } from "./Preloader";
import { MenuOverlay } from "./MenuOverlay";

export function Header() {
  const ready = useIntroReady();
  const [menuOpen, setMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    setHidden(latest > previous && latest > 160);
    setScrolled(latest > 40);
  });

  const visible = ready && (!hidden || menuOpen);

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-[70]"
        initial={{ y: "-100%" }}
        animate={{ y: visible ? "0%" : "-100%" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div
          className={`pointer-events-none absolute inset-0 bg-gradient-to-b from-background/90 to-transparent transition-opacity duration-500 ${
            scrolled && !menuOpen ? "opacity-100" : "opacity-0"
          }`}
        />
        <div className="relative mx-auto flex h-20 max-w-[1600px] items-center justify-between px-6 md:h-24 md:px-10">
          <Link
            href="/"
            className="wordmark text-sm text-foreground transition-colors hover:text-accent md:text-base"
            onClick={closeMenu}
          >
            {site.name}
          </Link>

          <div className="flex items-center gap-6">
            <Link
              href={site.meetUrl}
              className="group hidden items-center gap-2 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground sm:flex"
            >
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-accent" />
              </span>
              Available for projects
            </Link>

            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="site-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="group flex h-11 items-center gap-3 rounded-full border border-line bg-background/40 pl-5 pr-4 text-xs font-semibold tracking-[0.2em] backdrop-blur-md transition-colors hover:border-accent/60"
            >
              <span className="w-12 text-left">{menuOpen ? "CLOSE" : "MENU"}</span>
              <span className="relative block h-3 w-5">
                <span
                  className={`absolute left-0 h-px w-5 bg-current transition-all duration-500 ease-[var(--ease-out-expo)] ${
                    menuOpen ? "top-1.5 rotate-45" : "top-0.5"
                  }`}
                />
                <span
                  className={`absolute left-0 h-px w-5 bg-current transition-all duration-500 ease-[var(--ease-out-expo)] ${
                    menuOpen ? "top-1.5 -rotate-45" : "top-2.5"
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </motion.header>

      <MenuOverlay open={menuOpen} onClose={closeMenu} />
    </>
  );
}
