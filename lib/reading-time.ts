import type { Post } from "@/lib/api";

const WORDS_PER_MINUTE = 200;

function extractText(node: any): string {
  if (!node) return "";
  if (typeof node.text === "string") return node.text;
  if (Array.isArray(node.children)) {
    return node.children.map(extractText).join(" ");
  }
  return "";
}

export function getReadingTime(content: Post["content"]): number {
  if (!content) return 1;
  const words = content
    .map(extractText)
    .join(" ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}
