"use client";

import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { testimonials } from "@/lib/content";
import { SectionHeading } from "./SectionHeading";

export function Testimonials() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const [bounds, setBounds] = useState({ left: 0, right: 0 });
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const progress = useMotionValue(0);
  const progressScale = useTransform(progress, [0, 1], [1 / testimonials.length, 1]);

  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;
    const observer = new ResizeObserver(() => {
      const overflow = track.scrollWidth - viewport.clientWidth;
      setBounds({ left: -Math.max(overflow, 0), right: 0 });
    });
    observer.observe(viewport);
    observer.observe(track);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    function sync(value: number) {
      setAtStart(value >= -1);
      setAtEnd(value <= bounds.left + 1);
      progress.set(bounds.left === 0 ? 1 : Math.min(Math.max(value / bounds.left, 0), 1));
    }
    sync(x.get());
    return x.on("change", sync);
  }, [x, progress, bounds.left]);

  function go(direction: 1 | -1) {
    const card = trackRef.current?.firstElementChild as HTMLElement | null;
    if (!card) return;
    const step = card.offsetWidth + 24;
    const next = Math.min(Math.max(x.get() - direction * step, bounds.left), 0);
    animate(x, next, { type: "spring", stiffness: 200, damping: 30 });
  }

  const companies = testimonials.map((t) => t.company);

  return (
    <section id="testimonials" className="relative overflow-hidden py-28 md:py-40">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SectionHeading index="04" label="Testimonials" title="Kind words" />
          <Reveal
            delay={0.15}
            className={`flex items-center gap-3 self-start md:self-auto ${
              bounds.left === 0 ? "invisible" : ""
            }`}
          >
            <span className="relative mr-3 block h-px w-24 overflow-hidden bg-line">
              <motion.span
                className="absolute inset-0 origin-left bg-accent"
                style={{ scaleX: progressScale }}
              />
            </span>
            <CarouselButton label="Previous testimonial" onClick={() => go(-1)} disabled={atStart}>
              ←
            </CarouselButton>
            <CarouselButton label="Next testimonial" onClick={() => go(1)} disabled={atEnd}>
              →
            </CarouselButton>
          </Reveal>
        </div>

        <div ref={viewportRef} className="mt-16 md:mt-24" data-cursor="Drag">
          <motion.div
            ref={trackRef}
            className="flex cursor-grab gap-6 active:cursor-grabbing"
            drag="x"
            dragConstraints={bounds}
            dragElastic={0.08}
            style={{ x }}
          >
            {testimonials.map((testimonial, i) => (
              <Reveal
                key={testimonial.name}
                delay={i * 0.08}
                className="w-[min(85vw,360px)] shrink-0 sm:w-[480px] lg:w-[520px]"
              >
                <figure className="flex h-full min-h-[340px] select-none flex-col justify-between gap-10 rounded-3xl border border-line bg-surface p-7 md:min-h-[380px] md:gap-12 md:p-10">
                  <div>
                    <span aria-hidden className="font-display text-5xl leading-none text-accent">
                      “
                    </span>
                    <blockquote className="mt-4 text-base leading-relaxed text-foreground/85 md:text-xl">
                      {testimonial.quote}
                    </blockquote>
                  </div>
                  <figcaption className="flex items-center gap-4 border-t border-line pt-6">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-accent/10 text-sm font-semibold text-accent">
                      {testimonial.name
                        .split(" ")
                        .map((part) => part[0])
                        .join("")}
                    </span>
                    <span className="min-w-0">
                      <span className="block font-semibold">{testimonial.name}</span>
                      <span className="block truncate text-sm text-muted">{testimonial.company}</span>
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="marquee mt-24 overflow-hidden border-y border-line py-8 md:mt-32">
        <p className="sr-only">Clients include {companies.join(", ")}</p>
        <div aria-hidden className="marquee-track flex w-max">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 items-center">
              {Array.from({ length: 4 }, () => companies)
                .flat()
                .map((company, i) => (
                  <span key={`${copy}-${i}`} className="flex items-center">
                    <span className="px-8 text-4xl font-semibold tracking-[-0.02em] text-foreground/20 md:text-6xl">
                      {company}
                    </span>
                    <span className="size-2 rounded-full bg-accent/60" />
                  </span>
                ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CarouselButton({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className="flex size-12 items-center justify-center rounded-full border border-line text-lg transition-colors hover:border-accent hover:text-accent disabled:pointer-events-none disabled:opacity-30"
    >
      {children}
    </button>
  );
}
