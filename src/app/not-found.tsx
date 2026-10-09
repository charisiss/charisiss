"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Magnetic } from "@/components/motion/Magnetic";
import { site } from "@/lib/content";

const ease = [0.16, 1, 0.3, 1] as const;

export default function NotFound() {
  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6 py-24 text-center">
      <div aria-hidden className="hero-fallback absolute inset-0" />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 size-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/15 blur-[120px]"
      />

      <div className="relative z-10 mx-auto max-w-3xl">
        <motion.p
          className="eyebrow mb-8 inline-flex items-center gap-3"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease }}
        >
          <span className="h-px w-8 bg-accent" />
          Lost in the void
          <span className="h-px w-8 bg-accent" />
        </motion.p>

        <motion.div
          className="relative select-none"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease }}
        >
          <p
            aria-hidden
            className="pointer-events-none absolute inset-0 font-display text-[28vw] leading-none tracking-[-0.06em] text-accent/10 blur-[2px] md:text-[12rem]"
          >
            404
          </p>
          <GlitchTitle />
        </motion.div>

        <motion.h1
          className="mt-8 text-3xl font-semibold tracking-[-0.03em] md:text-5xl"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.15 }}
        >
          This page went on vacation.
        </motion.h1>

        <motion.p
          className="mx-auto mt-5 max-w-md text-base leading-relaxed text-foreground/70 md:text-lg"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.25 }}
        >
          Either the URL wandered off, or I haven&apos;t built this yet. Either way,
          let&apos;s get you back somewhere useful.
        </motion.p>

        <motion.div
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.35 }}
        >
          <Magnetic>
            <Link
              href="/"
              className="group inline-flex h-14 items-center gap-3 rounded-full bg-accent px-8 text-sm font-semibold text-background transition-[box-shadow] duration-500 hover:shadow-[0_0_40px_-6px_var(--accent)]"
            >
              Take me home
              <span className="transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-1">
                →
              </span>
            </Link>
          </Magnetic>
          <Link
            href={site.meetUrl}
            className="inline-flex h-14 items-center rounded-full border border-line px-8 text-sm font-semibold transition-colors hover:border-foreground/40"
          >
            Book a call instead
          </Link>
        </motion.div>

        <motion.p
          className="mt-16 text-xs tracking-[0.22em] text-muted uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          Error code · page not found · {site.name}
        </motion.p>
      </div>

      <FloatingBits />
    </main>
  );
}

function GlitchTitle() {
  return (
    <p
      aria-label="404"
      className="relative font-display text-[28vw] leading-none tracking-[-0.06em] text-accent md:text-[12rem]"
    >
      <motion.span
        aria-hidden
        className="absolute inset-0 text-[#ff4d6d]/70"
        animate={{ x: [0, -4, 3, 0], opacity: [0, 0.55, 0] }}
        transition={{ duration: 0.28, repeat: Infinity, repeatDelay: 2.6 }}
      >
        404
      </motion.span>
      <motion.span
        aria-hidden
        className="absolute inset-0 text-[#4de8ff]/60"
        animate={{ x: [0, 4, -2, 0], opacity: [0, 0.45, 0] }}
        transition={{ duration: 0.28, repeat: Infinity, repeatDelay: 2.6, delay: 0.05 }}
      >
        404
      </motion.span>
      <span className="relative">404</span>
    </p>
  );
}

function FloatingBits() {
  const bits = [
    { top: "18%", left: "12%", delay: 0, size: "size-2" },
    { top: "28%", left: "82%", delay: 0.4, size: "size-1.5" },
    { top: "72%", left: "18%", delay: 0.8, size: "size-1.5" },
    { top: "68%", left: "78%", delay: 1.1, size: "size-2.5" },
    { top: "42%", left: "8%", delay: 0.2, size: "size-1" },
    { top: "55%", left: "90%", delay: 0.6, size: "size-1" },
  ];

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {bits.map((bit, i) => (
        <motion.span
          key={i}
          className={`absolute rounded-full bg-accent ${bit.size}`}
          style={{ top: bit.top, left: bit.left }}
          animate={{ y: [0, -14, 0], opacity: [0.25, 0.8, 0.25] }}
          transition={{
            duration: 3.6,
            delay: bit.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
