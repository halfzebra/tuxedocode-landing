const VARIANTS = {
  header: "w-[34px] h-[34px] text-[13px] bg-ink text-white",
  byline: "w-[32px] h-[32px] text-[11px] bg-ink text-white",
  footer: "w-[30px] h-[30px] text-[11px] border border-rule-dark-2 text-white",
} as const;

export default function Monogram({
  variant = "header",
  className = "",
}: {
  variant?: keyof typeof VARIANTS;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center font-extrabold tracking-[-0.04em] ${VARIANTS[variant]} ${className}`}
    >
      TC
    </span>
  );
}
