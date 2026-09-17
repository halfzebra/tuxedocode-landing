import Header from "./header";
import Footer from "./footer";

export default function SiteChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </section>
  );
}
