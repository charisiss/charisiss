"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import { useIntroReady } from "@/components/layout/Preloader";
import { Magnetic } from "@/components/motion/Magnetic";
import { SplitText } from "@/components/motion/SplitText";
import { hero, site } from "@/lib/content";
import { HeroCanvas } from "./HeroCanvas";

const ease = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const ready = useIntroReady();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: 24 },
    animate: ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 },
    transition: { duration: 1, ease, delay },
  });

  return (
    <section
      ref={ref}
      id="top"
      className="relative flex h-[100svh] min-h-[640px] flex-col overflow-hidden"
    >
      <HeroCanvas />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-background to-transparent" />

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative mx-auto flex w-full max-w-[1600px] flex-1 flex-col justify-end px-6 pb-10 pt-28 md:px-10 md:pb-14"
      >
        <motion.p className="eyebrow mb-6 flex items-center gap-3" {...fadeUp(0.1)}>
          <span className="h-px w-10 bg-accent" />
          {hero.role}
        </motion.p>

        <h1 className="text-[20vw] font-semibold leading-[0.88] tracking-[-0.04em] md:text-[12.5vw] xl:text-[11.5vw]">
          <SplitText text="Charisis" play={ready} delay={0.15} className="block" />
          <SplitText
            text="Samaras"
            play={ready}
            delay={0.25}
            className="block md:pl-[12vw]"
            wordClassName="text-outline"
          />
        </h1>

        <div className="mt-10 grid gap-8 md:mt-14 md:grid-cols-12 md:items-end">
          <motion.p
            className="max-w-md text-base leading-relaxed text-foreground/75 md:col-span-5 md:text-lg"
            {...fadeUp(0.55)}
          >
            {hero.tagline}
          </motion.p>

          <motion.div
            className="flex flex-wrap items-center gap-4 md:col-span-4 md:col-start-9 md:justify-end"
            {...fadeUp(0.7)}
          >
            <Magnetic>
              <Link
                href={site.meetUrl}
                className="group inline-flex h-14 items-center gap-3 rounded-full bg-accent px-7 text-sm font-semibold text-background transition-[box-shadow] duration-500 hover:shadow-[0_0_40px_-6px_var(--accent)]"
              >
                Book a call
                <span className="transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </Magnetic>
            <a
              href="#work"
              className="inline-flex h-14 items-center rounded-full border border-line px-7 text-sm font-semibold transition-colors hover:border-foreground/40"
            >
              View work
            </a>
          </motion.div>
        </div>

        <motion.div
          className="mt-12 flex items-center justify-between border-t border-line pt-6 text-xs tracking-[0.2em] text-muted uppercase"
          {...fadeUp(0.85)}
        >
          <span>Based in Thessaloniki, Greece</span>
          <span className="flex items-center gap-3">
            Scroll
            <span className="relative block h-8 w-px overflow-hidden bg-line">
              <motion.span
                className="absolute inset-x-0 top-0 h-1/2 bg-accent"
                animate={{ y: ["-100%", "200%"] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              />
            </span>
          </span>
        </motion.div>
      </motion.div>
    </section>
  );
}
