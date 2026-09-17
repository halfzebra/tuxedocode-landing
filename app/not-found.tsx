import Link from "next/link";
import { COMPANY_NAME } from "@/lib/constants";
import SiteChrome from "./site-chrome";

export const metadata = {
  title: `Page Not Found - ${COMPANY_NAME}`,
};

export default function NotFound() {
  return (
    <SiteChrome>
      <div className="mx-auto flex max-w-[1180px] flex-col items-start px-8 py-24 md:py-32">
        <p className="mb-6 font-mono text-[11px] tracking-[0.16em] text-label uppercase">
          404
        </p>
        <h1 className="mb-6 text-[40px] leading-[1.08] font-extrabold tracking-[-0.045em] text-balance md:text-[56px] md:leading-[1.04]">
          Page not found
        </h1>
        <p className="mb-10 max-w-[52ch] text-xl leading-[1.55] text-body-muted text-pretty">
          The page you are looking for does not exist or may have been moved.
        </p>
        <Link
          href="/"
          className="bg-ink px-5 py-3 font-semibold text-bg hover:bg-accent"
        >
          Back to homepage
        </Link>
      </div>
    </SiteChrome>
  );
}
