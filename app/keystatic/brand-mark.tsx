// Same "TC" glyph as app/monogram.tsx, redrawn as a standalone Keystatic
// BrandMark (config.ui.brand.mark): Keystatic renders this inside its own
// nav chrome rather than our Tailwind theme, so it can't reuse the
// bg-logo-bg/text-logo-fg tokens Monogram depends on — currentColor is used
// instead, matching how Keystatic's own default mark (ZapLogo) picks up the
// surrounding nav text color for both color schemes.
export default function KeystaticBrandMark() {
  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
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
  );
}
