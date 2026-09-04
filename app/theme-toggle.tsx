"use client";

import { useEffect, useState } from "react";

const THEME_EVENT = "tc-theme-change";

function currentTheme(): "dark" | "light" {
  return document.documentElement.getAttribute("data-theme") === "dark"
    ? "dark"
    : "light";
}

const VARIANTS = {
  default: "border-rule text-label hover:border-ink hover:text-ink",
  inverse:
    "border-rule-dark-2 text-footer-link hover:border-footer-ink hover:text-footer-ink",
} as const;

export default function ThemeToggle({
  variant = "default",
}: {
  variant?: keyof typeof VARIANTS;
}) {
  // Starts in sync with the server-rendered (light) markup; the
  // beforeInteractive theme script may have already set data-theme="dark"
  // on <html> by the time this mounts, so sync up right after mount rather
  // than reading the DOM during the initial render (which would mismatch
  // the SSR output and trigger a hydration error).
  const [theme, setTheme] = useState<"dark" | "light">("light");

  useEffect(() => {
    setTheme(currentTheme());
    const sync = () => setTheme(currentTheme());
    window.addEventListener(THEME_EVENT, sync);
    return () => window.removeEventListener(THEME_EVENT, sync);
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    if (next === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    localStorage.setItem("tc-theme", next);
    setTheme(next);
    window.dispatchEvent(new Event(THEME_EVENT));
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Switch theme"
      className={`flex h-[34px] w-[34px] shrink-0 items-center justify-center border font-mono text-xs ${VARIANTS[variant]}`}
    >
      {theme === "dark" ? "☾" : "☀"}
    </button>
  );
}
