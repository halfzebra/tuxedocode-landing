/**
 * The Post content model has no category field — that's intentional, not a
 * gap. Categories are hand-maintained here instead of in the CMS schema.
 * Add an entry here by hand whenever a new post is published via Keystatic.
 */
const POST_CATEGORIES: Record<string, string> = {};

const DEFAULT_POST_CATEGORY = "Writing";

export function getPostCategory(slug?: string | null): string {
  if (!slug) return DEFAULT_POST_CATEGORY;
  return POST_CATEGORIES[slug] ?? DEFAULT_POST_CATEGORY;
}
