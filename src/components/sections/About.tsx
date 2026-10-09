import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { Reveal } from "@/components/motion/Reveal";
import { ScrollWords } from "@/components/motion/ScrollWords";
import { about, hero } from "@/lib/content";

const facts = [
  { label: "Role", value: hero.role },
  { label: "Based in", value: "Thessaloniki, Greece" },
  { label: "Focus", value: "Web products, end to end" },
];

export function About() {
  return (
    <section id="about" className="relative py-28 md:py-40">
      <div className="mx-auto grid max-w-[1600px] gap-16 px-6 md:grid-cols-12 md:px-10">
        <div className="md:col-span-3">
          <Reveal y={12}>
            <p className="eyebrow flex items-center gap-3">
              <span className="text-accent">(01)</span>
              {about.label}
            </p>
          </Reveal>
        </div>

        <div className="md:col-span-9">
          <ScrollWords
            text={about.body}
            className="text-3xl font-medium leading-[1.2] tracking-[-0.02em] md:text-5xl lg:text-[3.6rem]"
          />

          <dl className="mt-16 grid gap-8 border-t border-line pt-8 sm:grid-cols-3">
            {facts.map((fact, i) => (
              <Reveal key={fact.label} delay={i * 0.08}>
                <dt className="eyebrow">{fact.label}</dt>
                <dd className="mt-2 text-lg font-medium">{fact.value}</dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </div>

      <div className="mx-auto mt-20 grid max-w-[1600px] gap-4 px-6 md:mt-32 md:grid-cols-12 md:gap-6 md:px-10">
        <Reveal className="md:col-span-5">
          <ParallaxImage
            src={hero.portrait}
            alt="Charisis Samaras"
            sizes="(min-width: 768px) 40vw, 100vw"
            className="aspect-[4/5] rounded-2xl bg-surface"
          />
        </Reveal>
        <div className="grid grid-cols-2 gap-4 md:col-span-7 md:gap-6 md:pt-24">
          {about.images.map((image, i) => (
            <Reveal key={image.src} delay={0.1 + i * 0.08} className={i % 2 === 1 ? "md:translate-y-16" : ""}>
              <ParallaxImage
                src={image.src}
                alt={image.alt}
                sizes="(min-width: 768px) 28vw, 50vw"
                amount={8}
                className="aspect-[4/5] rounded-2xl bg-surface"
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
