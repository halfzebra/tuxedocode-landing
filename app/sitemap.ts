import type { MetadataRoute } from "next";

import { getAllPosts } from "@/lib/api";
import { SITE_URL } from "@/lib/constants";

// Customers have no dedicated detail route (just a logo band on the
// homepage), so getAllCustomers() has nothing to contribute here.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, priority: 1, changeFrequency: "monthly" },
    { url: `${SITE_URL}/about`, priority: 0.6, changeFrequency: "yearly" },
    { url: `${SITE_URL}/services`, priority: 0.8, changeFrequency: "yearly" },
    { url: `${SITE_URL}/blog`, priority: 0.7, changeFrequency: "weekly" },
    { url: `${SITE_URL}/contact`, priority: 0.6, changeFrequency: "yearly" },
  ];

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/posts/${post.slug}`,
    lastModified: post.date ?? undefined,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticRoutes, ...postRoutes];
}
