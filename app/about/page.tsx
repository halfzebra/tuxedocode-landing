import Image from "next/image";
import { COMPANY_NAME } from "@/lib/constants";

export const metadata = {
  title: `About - ${COMPANY_NAME}`,
  description:
    "Eduard Kyvenko runs Tuxedo Code ApS as a one-person software consulting practice from Nordhavn, Copenhagen.",
};

const facts = [
  { label: "Based in", value: "Nordhavn, Copenhagen" },
  { label: "Experience", value: "13+ years in software" },
  { label: "Sectors", value: "Fintech, pharma, public sector" },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-[1180px] px-8 pt-16 md:pt-20">
      <section className="grid grid-cols-1 items-start gap-12 md:grid-cols-[1fr_380px] md:gap-16">
        <div>
          <p className="mb-6 font-mono text-[11px] tracking-[0.16em] text-label uppercase">
            About me
          </p>
          <h1 className="mb-6 text-[40px] leading-[1.08] font-extrabold tracking-[-0.045em] text-balance md:text-[56px] md:leading-[1.04]">
            Eduard Kyvenko
          </h1>
          <p className="mb-8 max-w-[46ch] text-xl leading-[1.55] text-body-muted text-pretty">
            I run Tuxedo Code ApS as a one-person practice from Nordhavn in
            Copenhagen. Clients work directly with me, from the first
            architecture conversation to the code in production.
          </p>
          <p className="mb-5 max-w-[62ch] text-[17px] leading-[1.75] text-body text-pretty">
            Over 13+ years I have shipped large-scale systems, complex user
            interfaces, and production LLM pipelines for fintech, pharma, and
            public-sector clients. Most of that work sits in environments
            where a feature is not finished until it can be reviewed, logged,
            and explained months later.
          </p>
          <p className="max-w-[62ch] text-[17px] leading-[1.75] text-body text-pretty">
            I take on a small number of engagements at a time, which keeps
            the accountability clear: no account layer, no handover between
            teams, and the same person on the call and in the repository.
          </p>
        </div>
        <div>
          <div className="relative aspect-square w-full">
            <Image
              src="/images/about-portrait.jpg"
              alt="Eduard Kyvenko"
              fill
              sizes="(min-width: 768px) 380px, 100vw"
              className="object-cover"
            />
          </div>
          <p className="mt-[10px] font-mono text-[10px] tracking-[0.1em] text-label-light">
            FOUNDER · TUXEDO CODE APS
          </p>
        </div>
      </section>

      <section className="mt-16 mb-24 grid grid-cols-1 gap-px border border-rule bg-rule sm:grid-cols-3">
        {facts.map((fact) => (
          <div
            key={fact.label}
            className="flex flex-col gap-[10px] bg-surface p-[30px] pt-8 pb-9"
          >
            <span className="font-mono text-[10px] tracking-[0.12em] text-label-light uppercase">
              {fact.label}
            </span>
            <p className="text-lg leading-[1.4] font-bold tracking-[-0.02em]">
              {fact.value}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}
