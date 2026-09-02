/**
 * Contentful's Post content type has no category field (see
 * lib/generated/contentful-types.ts) — that's intentional, not a gap.
 * Add an entry here by hand whenever a new post is published in Contentful.
 */
const POST_CATEGORIES: Record<string, string> = {};

const DEFAULT_POST_CATEGORY = "Writing";

export function getPostCategory(slug?: string | null): string {
  if (!slug) return DEFAULT_POST_CATEGORY;
  return POST_CATEGORIES[slug] ?? DEFAULT_POST_CATEGORY;
}
