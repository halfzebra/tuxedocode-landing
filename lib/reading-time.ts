import type { Post } from "@/lib/generated/contentful-types";

const WORDS_PER_MINUTE = 200;

function extractText(node: any): string {
  if (!node) return "";
  if (typeof node.value === "string") return node.value;
  if (Array.isArray(node.content)) {
    return node.content.map(extractText).join(" ");
  }
  return "";
}

export function getReadingTime(content: Post["content"]): number {
  if (!content?.json) return 1;
  const words = extractText(content.json)
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}
