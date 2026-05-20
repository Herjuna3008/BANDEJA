interface SectionHeadingProps {
  label: string;
  title: string;
}

export function SectionHeading({ label, title }: SectionHeadingProps) {
  return (
    <div>
      <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.28em] text-lime-300">
        {label}
      </p>
      <h2 className="mb-12 whitespace-pre-line font-display text-5xl uppercase leading-none tracking-[0.02em] text-neutral-100 md:text-7xl">
        {title}
      </h2>
    </div>
  );
}
