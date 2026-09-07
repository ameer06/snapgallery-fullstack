interface SectionLabelProps {
  children: string;
  className?: string;
}

/** JetBrains Mono uppercase label (used above section headings) */
export default function SectionLabel({ children, className = '' }: SectionLabelProps) {
  return (
    <p className={`font-mono text-label-caps tracking-[0.08em] uppercase text-secondary ${className}`}>
      {children}
    </p>
  );
}
