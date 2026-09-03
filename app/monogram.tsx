const VARIANTS = {
  header: "w-[34px] h-[34px] bg-ink text-white",
  byline: "w-[32px] h-[32px] bg-ink text-white",
  footer: "w-[30px] h-[30px] border border-rule-dark-2 text-white",
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
      className={`inline-flex shrink-0 items-center justify-center ${VARIANTS[variant]} ${className}`}
    >
      <svg
        viewBox="0 0 64 64"
        className="h-full w-full"
        role="img"
        aria-label="Tuxedo Code"
      >
        <g
          fill="currentColor"
          transform="translate(32.4 32.3) scale(0.8) translate(-32 -32)"
        >
          <path d="M8.75 19 H26.75 V25 H20.75 V45 H14.75 V25 H8.75 Z" />
          <path d="M53.27 25.11 A13 13 0 1 0 53.27 38.89 L48.19 35.71 A7 7 0 1 1 48.19 28.29 Z" />
        </g>
      </svg>
    </span>
  );
}
