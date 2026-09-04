import Link from "next/link";

import Monogram from "./monogram";
import ThemeToggle from "./theme-toggle";
import { COMPANY_NAME, CVR, CONTACT_EMAIL } from "@/lib/constants";

const NAV = [
  { num: "01", href: "/", label: "Home" },
  { num: "02", href: "/services", label: "Services" },
  { num: "03", href: "/blog", label: "Blog" },
  { num: "04", href: "/about", label: "About Me" },
];

export default function MobileNav({
  onClose,
}: {
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-30 flex flex-col bg-footer-bg text-footer-ink md:hidden">
      <div className="flex items-center justify-between border-b border-footer-rule px-5 py-[14px]">
        <div className="flex items-center gap-[10px]">
          <Monogram variant="footer" />
          <span className="font-mono text-[10px] tracking-[0.14em] text-label-light uppercase">
            Menu
          </span>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle variant="inverse" />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="relative -mr-[10px] flex h-11 w-11 items-center justify-center"
          >
            <span className="relative block h-6 w-6">
              <span className="absolute top-[11px] left-0 block h-[2px] w-6 rotate-45 bg-footer-ink" />
              <span className="absolute top-[11px] left-0 block h-[2px] w-6 -rotate-45 bg-footer-ink" />
            </span>
          </button>
        </div>
      </div>
      <nav className="flex flex-1 flex-col px-5 pt-2">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className="flex items-baseline gap-[14px] border-b border-footer-rule py-[22px] text-[32px] leading-none font-extrabold tracking-[-0.035em] text-footer-ink hover:text-accent-tint"
          >
            <span className="font-mono text-[10px] font-normal tracking-[0.12em] text-label">
              {item.num}
            </span>
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="flex flex-col gap-[18px] px-5 pt-6 pb-8">
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="bg-footer-ink px-6 py-4 text-center text-base font-bold text-footer-bg"
        >
          Contact
        </a>
        <p className="font-mono text-[10px] tracking-[0.08em] text-label">
          {CONTACT_EMAIL.toUpperCase()} · CVR {CVR} · {COMPANY_NAME}
        </p>
      </div>
    </div>
  );
}
