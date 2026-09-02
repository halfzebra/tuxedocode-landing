import { COMPANY_NAME, CONTACT_EMAIL } from "@/lib/constants";
import Image from "next/image";

export const metadata = {
  title: `Services - ${COMPANY_NAME}`,
  description:
    "Freelance software consulting services: full-stack development, cloud & DevOps, AI/LLM integration, solution architecture, test automation, and data engineering.",
};

const services = [
  {
    title: "Enterprise-Scale Delivery",
    description:
      "Systems built for real organizational scale — including a case-handling platform used daily by 1,000+ staff and a shared GraphQL backbone serving 3 product teams at once. Comfortable in fintech, pharma, and public-sector environments.",
  },
  {
    title: "Complex UI Engineering",
    description:
      "Data-dense, workflow-heavy interfaces — case management, accounting, financial onboarding — built to stay fast and usable under real complexity, with accessibility audited using axe-core, not bolted on after the fact.",
  },
  {
    title: "Functional Programming",
    description:
      "Production experience in Clojure, ClojureScript, and Elm, including leading a full ClojureScript-to-React/TypeScript migration across 3 teams to cut long-term maintenance cost without a rewrite-everything risk.",
  },
  {
    title: "Test Automation & Reporting",
    description:
      "Playwright and Cypress E2E suites built to be owned by QA teams, not just engineers — plus automated compliance and security reporting pipelines that keep regulated codebases audit-ready by default.",
  },
  {
    title: "Custom Developer Tooling",
    description:
      "Purpose-built internal tooling that pays for itself — from CI pipeline work that cut build times by 50% to internal proxies and build tooling that let teams ship and migrate in parallel instead of blocking each other.",
  },
  {
    title: "LLM Pipelines & Agentic Systems",
    description:
      "Production agentic systems in Python with PydanticAI and Claude, built for real workflows rather than demos — alongside ongoing research into feedback and skill-improvement loops that let agents get better at a task over time.",
  },
];

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-[1180px] px-8">
      <section className="pt-16 md:pt-20">
        <h1 className="mb-6 text-[40px] leading-[1.05] font-extrabold tracking-[-0.045em] md:text-[60px] md:leading-[1.03]">
          Services
        </h1>
        <p className="mb-14 max-w-[62ch] text-lg leading-[1.55] text-body-muted text-pretty">
          13+ years shipping large-scale systems, complex UIs, and production
          LLM pipelines for fintech, pharma, and public-sector clients —
          available for freelance and consulting engagements.
        </p>
      </section>

      <section className="mb-16 grid grid-cols-1 gap-px border border-rule bg-rule sm:grid-cols-2 md:grid-cols-3">
        {services.map((service, index) => (
          <div
            key={service.title}
            className="flex min-h-[210px] flex-col gap-[14px] bg-white p-[30px] pt-9 pb-10 hover:bg-surface"
          >
            <span className="font-mono text-[10px] tracking-[0.12em] text-label-light">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h2 className="text-xl leading-[1.25] font-bold tracking-[-0.025em]">
              {service.title}
            </h2>
            <p className="text-[15px] leading-[1.6] text-meta">
              {service.description}
            </p>
          </div>
        ))}
      </section>

      <section className="mb-24 grid grid-cols-1 border border-rule md:grid-cols-2">
        <div className="relative h-[220px] w-full md:h-[300px]">
          <Image
            src="/images/services-closing.jpg"
            alt="The fort seen between harbour buildings at low winter sun"
            fill
            sizes="(min-width: 1180px) 589px, 100vw"
            className="object-cover object-[50%_55%]"
          />
        </div>
        <div className="flex flex-col justify-center gap-[18px] p-9 md:p-10">
          <h2 className="text-2xl leading-[1.15] font-extrabold tracking-[-0.03em] text-balance md:text-[30px]">
            One consultant, full accountability
          </h2>
          <p className="text-base leading-[1.6] text-body-muted text-pretty">
            You work directly with the person writing the code. No account
            layer, no handover between teams.
          </p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="self-start bg-ink px-6 py-[13px] text-[15px] font-semibold text-white hover:bg-accent"
          >
            Get In Touch
          </a>
        </div>
      </section>
    </div>
  );
}
