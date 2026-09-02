import { COMPANY_NAME } from "@/lib/constants";
import "./globals.css";
import { Manrope, Space_Mono } from "next/font/google";

import Header from "./header";
import Footer from "./footer";

export const metadata = {
  title: `${COMPANY_NAME} - Premium Software Development`,
  description:
    "Professional software development and consulting services. We build modern, scalable applications for businesses.",
};

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "800"],
  display: "swap",
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${manrope.variable} ${spaceMono.variable}`}>
      <body>
        <section className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </section>
      </body>
    </html>
  );
}
