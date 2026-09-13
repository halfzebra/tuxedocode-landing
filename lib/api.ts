import { createReader } from "@keystatic/core/reader";

import keystaticConfig from "@/keystatic.config";

const reader = createReader(process.cwd(), keystaticConfig);

export async function getAllPosts() {
  const posts = await reader.collections.posts.all({
    resolveLinkedFiles: true,
  });

  return posts
    .map(({ slug, entry }) => ({ ...entry, slug }))
    .sort((a, b) => {
      const dateA = a.date ?? "";
      const dateB = b.date ?? "";
      return dateA < dateB ? 1 : dateA > dateB ? -1 : 0;
    });
}

export async function getPostBySlug(slug: string) {
  const entry = await reader.collections.posts.read(slug, {
    resolveLinkedFiles: true,
  });
  if (!entry) return null;
  return { ...entry, slug };
}

export async function getAllCustomers() {
  const customers = await reader.collections.customers.all();

  return customers
    .map(({ slug, entry }) => ({ ...entry, slug }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export type Post = NonNullable<Awaited<ReturnType<typeof getPostBySlug>>>;
export type Customer = Awaited<ReturnType<typeof getAllCustomers>>[number];
