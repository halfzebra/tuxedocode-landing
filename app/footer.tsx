import { COMPANY_NAME, CVR, CONTACT_EMAIL } from "@/lib/constants";
import Link from "next/link";
import Monogram from "./monogram";

export default function Footer() {
  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto max-w-[1180px] px-8 py-20 pb-10">
        <div className="grid grid-cols-1 items-end gap-12 border-b border-rule-dark pb-14 md:grid-cols-[1.3fr_1fr]">
          <h2 className="text-[32px] leading-[1.1] font-extrabold tracking-[-0.04em] md:text-[44px] md:leading-[1.05]">
            Ready to elevate your software?
          </h2>
          <div className="flex flex-col items-start gap-[18px]">
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="bg-white px-7 py-[15px] text-[15px] font-bold text-ink hover:bg-accent-tint"
            >
              Get In Touch
            </a>
            <Link
              href="/services"
              className="ml-7 border-b border-rule-dark-2 pb-[2px] text-[15px] font-medium text-[#b9bec6] hover:text-white"
            >
              Our Services
            </Link>
          </div>
        </div>
        <div className="flex items-center justify-between gap-6 pt-7">
          <Monogram variant="footer" />
          <p className="font-mono text-[11px] tracking-[0.06em] text-label-light">
            {COMPANY_NAME} · CVR {CVR} · {CONTACT_EMAIL}
          </p>
        </div>
      </div>
    </footer>
  );
}
