import { Reveal } from "@/components/motion/Reveal";
import { skills } from "@/lib/content";
import { SectionHeading } from "./SectionHeading";

export function Services() {
  return (
    <section id="services" className="relative py-28 md:py-40">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <SectionHeading index="02" label="Services" title="What I do" className="md:col-span-7" />
          <Reveal className="md:col-span-4 md:col-start-9" delay={0.15}>
            <p className="text-base leading-relaxed text-foreground/70 md:text-lg">
              Strategy, design and engineering under one roof, so ideas move from sketch to
              production without losing their edge.
            </p>
          </Reveal>
        </div>

        <ul className="mt-20 border-t border-line md:mt-28">
          {skills.map((skill, i) => (
            <li key={skill.id} className="group relative border-b border-line">
              <span
                aria-hidden
                className="absolute inset-0 origin-bottom scale-y-0 bg-accent/[0.06] transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-y-100"
              />
              <Reveal className="relative grid gap-6 py-10 md:grid-cols-12 md:items-start md:py-14">
                <span className="text-sm font-medium tabular-nums text-muted md:col-span-1 md:pt-3">
                  0{i + 1}
                </span>
                <h3 className="text-4xl font-semibold tracking-[-0.03em] transition-[color,transform] duration-700 ease-[var(--ease-out-expo)] group-hover:translate-x-3 group-hover:text-accent md:col-span-4 md:text-6xl">
                  {skill.title}
                </h3>
                <p className="max-w-md leading-relaxed text-foreground/70 md:col-span-3 md:pt-3">
                  {skill.description}
                </p>
                <ul className="flex flex-wrap gap-2 md:col-span-4 md:justify-end md:pt-2">
                  {skill.items.map((item) => (
                    <li
                      key={item}
                      className="rounded-full border border-line px-4 py-1.5 text-sm text-foreground/80 transition-colors duration-500 group-hover:border-accent/30"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
