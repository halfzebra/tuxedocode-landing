import Monogram from "./monogram";

export default function Byline({
  authorName,
  readingTimeMinutes,
}: {
  authorName?: string | null;
  readingTimeMinutes: number;
}) {
  return (
    <div className="mb-10 flex items-center gap-3 border-b border-rule pb-8">
      <Monogram variant="byline" />
      <span className="text-sm font-medium text-body-muted">
        {authorName || "Tuxedo Code"} · {readingTimeMinutes} min read
      </span>
    </div>
  );
}
