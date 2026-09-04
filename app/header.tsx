"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import Monogram from "./monogram";
import ThemeToggle from "./theme-toggle";
import MobileNav from "./mobile-nav";
import { CONTACT_EMAIL } from "@/lib/constants";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About Me" },
];

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-20 border-b border-rule bg-header backdrop-blur-md">
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
            className="hidden bg-ink px-4 py-2 font-semibold text-bg hover:bg-accent md:inline-block"
          >
            Contact
          </a>
          <div className="hidden md:block">
            <ThemeToggle />
          </div>
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            className="-mr-[10px] flex h-11 w-11 flex-col items-end justify-center gap-[6px] md:hidden"
          >
            <span className="block h-[2px] w-6 bg-ink" />
            <span className="block h-[2px] w-6 bg-ink" />
          </button>
        </nav>
      </div>
      {menuOpen && <MobileNav onClose={() => setMenuOpen(false)} />}
    </header>
  );
}
