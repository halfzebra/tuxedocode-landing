import type { Metadata } from "next";

import { COMPANY_NAME, SITE_URL } from "@/lib/constants";
import "./globals.css";
import { Manrope, Space_Mono } from "next/font/google";
import Script from "next/script";

const description =
  "Professional software development and consulting services. We build modern, scalable applications for businesses.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${COMPANY_NAME} - Premium Software Development`,
    template: "%s | Tuxedo Code",
  },
  description,
  openGraph: {
    type: "website",
    siteName: "Tuxedo Code",
    url: SITE_URL,
    locale: "en_US",
    title: `${COMPANY_NAME} - Premium Software Development`,
    description,
  },
  twitter: {
    card: "summary_large_image",
  },
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
    <html
      lang="en"
      className={`${manrope.variable} ${spaceMono.variable}`}
      suppressHydrationWarning
    >
      <body>
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function initTheme(){try{var stored=localStorage.getItem("tc-theme");if(stored==="light"){document.documentElement.setAttribute("data-theme","light");return}if(stored==="dark"){return}if(window.matchMedia&&window.matchMedia("(prefers-color-scheme: light)").matches){document.documentElement.setAttribute("data-theme","light")}}catch(e){}})();`,
          }}
        />
        {children}
      </body>
    </html>
  );
}
