import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";

type SectionHeadingProps = {
  index: string;
  label: string;
  title: string;
  className?: string;
};

export function SectionHeading({ index, label, title, className }: SectionHeadingProps) {
  return (
    <div className={className}>
      <Reveal y={12}>
        <p className="eyebrow flex items-center gap-3">
          <span className="text-accent">({index})</span>
          {label}
        </p>
      </Reveal>
      <h2 className="mt-6 text-5xl font-semibold leading-[0.95] tracking-[-0.03em] md:text-7xl lg:text-8xl">
        <SplitText text={title} />
      </h2>
    </div>
  );
}
