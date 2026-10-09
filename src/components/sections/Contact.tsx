"use client";

import Image from "next/image";
import Link from "next/link";
import { Magnetic } from "@/components/motion/Magnetic";
import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";
import { contact, site } from "@/lib/content";

export function Contact() {
  return (
    <section id="contact" className="relative overflow-hidden py-24 md:py-44">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[40%] size-[90vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/[0.08] blur-[100px] md:top-1/2 md:size-[70vw] md:bg-accent/10 md:blur-[120px]"
      />

      <div className="relative mx-auto max-w-[1600px] px-6 md:px-10">
        <Reveal y={16}>
          <p className="eyebrow flex items-center gap-3">
            <span className="text-accent">(05)</span>
            Contact
          </p>
        </Reveal>

        <div className="mt-8 flex items-start gap-4 md:mt-10 md:items-center md:gap-5">
          <Reveal y={16}>
            <span className="relative mt-0.5 block size-14 shrink-0 overflow-hidden rounded-full border border-line md:mt-0 md:size-20">
              <Image src={contact.avatar} alt="" fill sizes="80px" className="object-cover" />
            </span>
          </Reveal>
          <Reveal y={16} delay={0.08}>
            <p className="max-w-sm text-sm leading-relaxed text-foreground/70 md:text-base">
              {contact.body}
            </p>
          </Reveal>
        </div>

        <h2 className="mt-10 text-[13vw] font-semibold leading-[0.92] tracking-[-0.045em] md:mt-12 md:text-[10vw]">
          <SplitText text="Let's work" className="block" />
          <SplitText text="together!" delay={0.12} className="block text-accent" />
        </h2>

        {/* Mobile: full-width pill CTA, matches hero rhythm */}
        <Reveal y={20} className="mt-10 md:hidden">
          <Link
            href={site.meetUrl}
            className="group relative flex h-16 w-full items-center justify-between overflow-hidden rounded-full bg-accent px-7 text-sm font-semibold uppercase tracking-[0.16em] text-background transition-[box-shadow,transform] duration-500 ease-[var(--ease-out-expo)] active:scale-[0.98]"
          >
            <span>Book a call</span>
            <span
              aria-hidden
              className="flex size-10 items-center justify-center rounded-full bg-background/15 text-lg transition-transform duration-500 ease-[var(--ease-out-expo)] group-active:translate-x-0.5"
            >
              →
            </span>
          </Link>
          <a
            href={`mailto:${site.email}`}
            className="mt-5 block text-center text-base font-medium text-foreground/70 transition-colors active:text-accent"
          >
            or email {site.email}
          </a>
        </Reveal>

        {/* Desktop: email + magnetic circle */}
        <div className="mt-16 hidden border-t border-line pt-10 md:mt-20 md:flex md:items-center md:justify-between">
          <Reveal>
            <a
              href={`mailto:${site.email}`}
              className="group inline-flex items-center gap-3 text-4xl font-medium tracking-tight"
            >
              <span className="bg-gradient-to-r from-accent to-accent bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-1 transition-[background-size] duration-700 ease-[var(--ease-out-expo)] group-hover:bg-[length:100%_1px]">
                {site.email}
              </span>
            </a>
          </Reveal>

          <Reveal delay={0.1}>
            <Magnetic strength={0.25}>
              <Link
                href={site.meetUrl}
                className="group relative flex size-48 items-center justify-center overflow-hidden rounded-full bg-accent text-center text-sm font-semibold uppercase tracking-[0.18em] text-background"
              >
                <span className="absolute inset-0 translate-y-full rounded-full bg-foreground transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:translate-y-0" />
                <span className="relative">
                  Book a<br />
                  call →
                </span>
              </Link>
            </Magnetic>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
