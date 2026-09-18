import type { Metadata } from "next";

import { COMPANY_NAME, CVR, CONTACT_EMAIL, SITE_URL } from "@/lib/constants";
import ContactForm from "../../contact-form";

const title = `Contact - ${COMPANY_NAME}`;
const description =
  "Get in touch with Tuxedo Code ApS about a software development or consulting project.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${SITE_URL}/contact` },
  openGraph: {
    type: "website",
    siteName: "Tuxedo Code",
    title,
    description,
    url: `${SITE_URL}/contact`,
  },
};

const facts = [
  { label: "Email", value: CONTACT_EMAIL },
  { label: "Based in", value: "Nordhavn, Copenhagen" },
  { label: "Company", value: `${COMPANY_NAME} · CVR ${CVR}` },
];

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-[1180px] px-8 pt-16 pb-24 md:pt-20">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-[1fr_1.15fr] md:items-start md:gap-16">
        <div className="md:col-start-1 md:row-start-1">
          <p className="mb-6 font-mono text-[11px] tracking-[0.16em] text-label uppercase">
            Contact
          </p>
          <h1 className="mb-6 text-[36px] leading-[1.05] font-extrabold tracking-[-0.04em] text-balance md:text-[56px] md:leading-[1.04] md:tracking-[-0.045em]">
            Let&apos;s talk about your project
          </h1>
          <p className="text-base leading-[1.55] text-body-muted text-pretty md:max-w-[40ch] md:text-[19px]">
            Tell me what you are building and where it is stuck. You will
            hear back from me directly, usually within one working day.
          </p>
        </div>

        <ContactForm />

        <div className="grid min-w-0 grid-cols-1 gap-px border border-rule bg-rule md:col-start-1 md:row-start-2">
          {facts.map((fact) => (
            <div
              key={fact.label}
              className="flex min-w-0 flex-col gap-[6px] bg-surface px-6 py-5"
            >
              <span className="font-mono text-[10px] tracking-[0.12em] text-label-light uppercase">
                {fact.label}
              </span>
              <p className="text-base leading-[1.4] font-semibold tracking-[-0.015em] break-words">
                {fact.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
