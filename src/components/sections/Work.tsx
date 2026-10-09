"use client";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
} from "framer-motion";
import Image from "next/image";
import { useRef, useState, type PointerEvent } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { projects } from "@/lib/content";
import { SectionHeading } from "./SectionHeading";

export function Work() {
  const listRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 20, mass: 0.6 });
  const springY = useSpring(y, { stiffness: 150, damping: 20, mass: 0.6 });
  const { scrollY } = useScroll();

  function handleMove(event: PointerEvent<HTMLUListElement>) {
    x.set(event.clientX);
    y.set(event.clientY);
  }

  // Wheel scrolling moves rows under a stationary pointer without firing pointer events.
  useMotionValueEvent(scrollY, "change", () => {
    if (active === null || !listRef.current) return;
    const hit = document.elementFromPoint(x.get(), y.get());
    const row = hit?.closest("li");
    const rows = Array.from(listRef.current.children);
    const index = row ? rows.indexOf(row) : -1;
    setActive(index === -1 ? null : index);
  });

  return (
    <section id="work" className="relative py-28 md:py-40">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SectionHeading index="03" label="Selected work" title="Featured projects" />
          <Reveal delay={0.15}>
            <p className="text-sm text-muted">
              {String(projects.length).padStart(2, "0")} selected projects
            </p>
          </Reveal>
        </div>

        <ul
          ref={listRef}
          className="mt-20 border-t border-line md:mt-28"
          onPointerMove={handleMove}
          onPointerLeave={() => setActive(null)}
        >
          {projects.map((project, i) => {
            const content = (
              <ProjectRow
                index={i}
                project={project}
                dimmed={active !== null && active !== i}
              />
            );

            return (
              <li
                key={project.title}
                className="border-b border-line"
                onPointerEnter={(event) => {
                  if (event.pointerType === "mouse") setActive(i);
                }}
              >
                {project.href ? (
                  <a
                    href={project.href}
                    target="_blank"
                    rel="noreferrer"
                    data-cursor="Open project"
                    className="block outline-none focus-visible:bg-accent/[0.06]"
                  >
                    {content}
                  </a>
                ) : (
                  <div data-cursor="Private project">{content}</div>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-40 hidden md:block"
        style={{ x: springX, y: springY }}
      >
        <AnimatePresence>
          {active !== null && (
            <motion.div
              key="preview"
              className="relative -ml-[180px] -mt-[125px] h-[250px] w-[360px] overflow-hidden rounded-xl lg:-ml-[210px] lg:-mt-[145px] lg:h-[290px] lg:w-[420px]"
              initial={{ opacity: 0, scale: 0.6, rotate: -6 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.6, rotate: 6 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              {projects.map((project, i) => (
                <motion.div
                  key={project.image}
                  className="absolute inset-0"
                  initial={false}
                  animate={{
                    clipPath: i === active ? "inset(0% 0 0% 0)" : i < active ? "inset(0 0 100% 0)" : "inset(100% 0 0 0)",
                    scale: i === active ? 1 : 1.15,
                  }}
                  transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
                >
                  <Image src={project.image} alt="" fill sizes="420px" className="object-cover" />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}

function ProjectRow({
  index,
  project,
  dimmed,
}: {
  index: number;
  project: (typeof projects)[number];
  dimmed: boolean;
}) {
  return (
    <div className={`transition-opacity duration-500 ${dimmed ? "md:opacity-30" : ""}`}>
      <Reveal className="group grid gap-5 py-10 md:grid-cols-12 md:items-center md:py-12">
        <div className="relative aspect-[16/10] overflow-hidden rounded-xl md:hidden">
          <Image
            src={project.image}
            alt={project.title}
            fill
            sizes="(max-width: 767px) 100vw, 1px"
            className="object-cover"
          />
        </div>
        <span className="hidden text-sm font-medium tabular-nums text-muted md:col-span-1 md:block">
          0{index + 1}
        </span>
        <h3 className="text-4xl font-semibold tracking-[-0.03em] transition-transform duration-700 ease-[var(--ease-out-expo)] md:col-span-5 md:text-6xl md:group-hover:translate-x-4 lg:text-7xl">
          {project.title}
        </h3>
        <p className="max-w-sm text-sm leading-relaxed text-foreground/65 md:col-span-4">
          {project.description}
        </p>
        <div className="flex items-center justify-between gap-4 md:col-span-2 md:flex-col md:items-end">
          <span className="eyebrow">{project.role}</span>
          {project.href && (
            <span className="flex size-11 items-center justify-center rounded-full border border-line text-lg transition-all duration-500 group-hover:-rotate-45 group-hover:border-accent group-hover:bg-accent group-hover:text-background md:hidden lg:flex">
              →
            </span>
          )}
        </div>
      </Reveal>
    </div>
  );
}
