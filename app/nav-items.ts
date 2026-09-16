export type NavItem = {
  href: string;
  label: string;
};

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About Me" },
  { href: "/contact", label: "Contact" },
];

/** Two-digit index label ("01", "02", …) used by the mobile menu. */
export function navNumber(index: number) {
  return String(index + 1).padStart(2, "0");
}
