import ContentfulImage from "../lib/contentful-image";
import Link from "next/link";

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

export default function CoverImage({
  title,
  url,
  slug,
}: {
  title?: string | null;
  url?: string | null;
  slug?: string | null;
}) {
  if (!url) {
    return null;
  }

  const alt = title ? `Cover Image for ${title}` : "Cover image";

  const image = (
    <ContentfulImage
      alt={alt}
      priority
      width={2000}
      height={1000}
      className={cn("shadow-small", {
        "hover:shadow-medium transition-shadow duration-200": slug,
      })}
      src={url}
    />
  );

  return (
    <div className="sm:mx-0">
      {slug ? (
        <Link href={`/posts/${slug}`} aria-label={alt}>
          {image}
        </Link>
      ) : (
        image
      )}
    </div>
  );
}
