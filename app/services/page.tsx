import { COMPANY_NAME, CONTACT_EMAIL } from "@/lib/constants";

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
    <div className="container mx-auto px-5">
      <section className="mt-16 mb-16 md:mb-12">
        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-tight">
          Services
        </h1>
        <h2 className="text-lg mt-5 max-w-2xl">
          13+ years shipping large-scale systems, complex UIs, and production
          LLM pipelines for fintech, pharma, and public-sector clients —
          available for freelance and consulting engagements.
        </h2>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12 mb-20 md:mb-28">
        {services.map((service) => (
          <div key={service.title}>
            <h3 className="text-2xl font-bold tracking-tighter leading-tight mb-3">
              {service.title}
            </h3>
            <p className="text-lg leading-relaxed">{service.description}</p>
          </div>
        ))}
      </section>

      <section className="mb-20 md:mb-28 text-center">
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="inline-block bg-black hover:bg-white hover:text-black border border-black text-white font-bold py-3 px-12 duration-200 transition-colors"
        >
          Discuss Your Project
        </a>
      </section>
    </div>
  );
}
