import Image from "next/image";
import { type Customer } from "@/lib/api";

export default function CustomerLogos({
  customers,
}: {
  customers: Customer[];
}) {
  const validCustomers = customers.filter(
    (customer) => customer.name && customer.website && customer.logo
  );

  if (validCustomers.length === 0) {
    return null;
  }

  return (
    <section className="border-y border-rule bg-band">
      <div className="mx-auto max-w-[1180px] px-8 py-[52px]">
        <h2 className="mb-8 font-mono text-[11px] font-normal tracking-[0.16em] text-label uppercase">
          Companies I&apos;ve worked with
        </h2>
        <div className="grid grid-cols-2 gap-px border border-rule bg-rule sm:grid-cols-3 md:grid-cols-5">
          {validCustomers.map((customer) => (
            <div
              key={customer.slug}
              className="flex h-[88px] items-center justify-center bg-white p-4"
            >
              <a
                href={customer.website!}
                target="_blank"
                rel="noopener noreferrer"
                title={customer.name}
                className="relative h-[48px] w-full transition-opacity hover:opacity-70"
              >
                <Image
                  src={customer.logo!}
                  alt={customer.name}
                  fill
                  sizes="160px"
                  className="object-contain"
                />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
