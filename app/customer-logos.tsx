import ContentfulImage from "@/lib/contentful-image";
import { type Customer } from "@/lib/generated/contentful-types";

export default function CustomerLogos({
  customers,
}: {
  customers: Customer[];
}) {
  if (!customers || customers.length === 0) {
    return null;
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-5">
        <h2 className="mb-8 text-4xl md:text-5xl font-bold tracking-tighter leading-tight text-center">
          I've had the pleasure of working for
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 items-center justify-items-center">
          {customers
            .filter(
              (customer) =>
                customer.name && customer.website && customer.logo?.url
            )
            .map((customer, index) =>
              customer.name && customer.logo && customer.website ? (
                <div
                  key={index}
                  className="flex items-center justify-center p-4"
                >
                  <a
                    href={customer.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-opacity hover:opacity-70"
                    title={customer.name}
                  >
                    <ContentfulImage
                      src={customer.logo!.url!}
                      alt={
                        customer.logo!.description ||
                        customer.logo!.title ||
                        customer.name!
                      }
                      width={Math.min(customer.logo!.width || 200, 200)}
                      height={Math.min(customer.logo!.height || 60, 60)}
                      className="max-w-full h-auto object-contain"
                    />
                  </a>
                </div>
              ) : null
            )}
        </div>
      </div>
    </section>
  );
}
