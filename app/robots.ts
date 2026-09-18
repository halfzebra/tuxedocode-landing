import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/constants";

// /keystatic and /api/keystatic are listed here as defense-in-depth /
// documentation only — they aren't the real security boundary. See the
// "CMS is deliberately never deployed to Vercel" note in AGENTS.md: on
// Vercel those routes are deleted before the build even runs, so there is
// nothing at these paths for a crawler to reach either way.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/keystatic", "/api/keystatic"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
