"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import Monogram from "./monogram";
import { CONTACT_EMAIL } from "@/lib/constants";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About Me" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-20 border-b border-rule bg-white/88 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1180px] items-center justify-between gap-8 px-8 py-[18px]">
        <Link href="/" className="flex items-center gap-3">
          <Monogram variant="header" />
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-label">
            Tuxedo Code
          </span>
        </Link>
        <nav className="flex items-center gap-4 text-sm font-medium md:gap-[34px]">
          <div className="hidden items-center gap-[34px] md:flex">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={pathname === item.href ? "page" : undefined}
                className={`border-b py-1 ${
                  pathname === item.href
                    ? "border-ink"
                    : "border-transparent hover:border-ink"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="bg-ink px-4 py-2 font-semibold text-white hover:bg-accent"
          >
            Contact
          </a>
        </nav>
      </div>
    </header>
  );
}
