import Image from "next/image";
import { type Customer } from "@/lib/generated/contentful-types";

export default function CustomerLogos({
  customers,
}: {
  customers: Customer[];
}) {
  const validCustomers = customers.filter(
    (customer) => customer.name && customer.website && customer.logo?.url
  );

  if (validCustomers.length === 0) {
    return null;
  }

  return (
    <section className="border-y border-rule bg-surface">
      <div className="mx-auto max-w-[1180px] px-8 py-[52px]">
        <h2 className="mb-8 font-mono text-[11px] font-normal tracking-[0.16em] text-label uppercase">
          Companies I&apos;ve worked with
        </h2>
        <div className="grid grid-cols-2 gap-px border border-rule bg-rule sm:grid-cols-3 md:grid-cols-5">
          {validCustomers.map((customer, index) => (
            <div
              key={index}
              className="flex h-[88px] items-center justify-center bg-white p-4"
            >
              <a
                href={customer.website!}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-opacity hover:opacity-70"
                title={customer.name!}
              >
                <Image
                  src={customer.logo!.url!}
                  alt={
                    customer.logo!.description ||
                    customer.logo!.title ||
                    customer.name!
                  }
                  width={Math.min(customer.logo!.width || 160, 160)}
                  height={Math.min(customer.logo!.height || 48, 48)}
                  className="h-auto max-h-[48px] max-w-full object-contain"
                />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
