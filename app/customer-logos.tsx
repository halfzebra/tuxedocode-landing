import ContentfulImage from "@/lib/contentful-image";

interface Customer {
  name: string;
  website?: string;
  logo: {
    title: string;
    description?: string;
    contentType: string;
    fileName: string;
    size: number;
    url: string;
    width: number;
    height: number;
  };
}

export default function CustomerLogos({
  customers,
}: {
  customers: Customer[];
}) {
  // Don't show the section if there are no customers
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
          {customers.map((customer, index) => (
            <div key={index} className="flex items-center justify-center p-4">
              {customer.website ? (
                <a
                  href={customer.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-opacity hover:opacity-70"
                  title={customer.name}
                >
                  <ContentfulImage
                    src={customer.logo.url}
                    alt={
                      customer.logo.description ||
                      customer.logo.title ||
                      customer.name
                    }
                    width={Math.min(customer.logo.width, 120)}
                    height={Math.min(customer.logo.height, 60)}
                    className="max-w-full h-auto object-contain"
                  />
                </a>
              ) : (
                <ContentfulImage
                  src={customer.logo.url}
                  alt={
                    customer.logo.description ||
                    customer.logo.title ||
                    customer.name
                  }
                  width={Math.min(customer.logo.width, 120)}
                  height={Math.min(customer.logo.height, 60)}
                  className="max-w-full h-auto object-contain"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
