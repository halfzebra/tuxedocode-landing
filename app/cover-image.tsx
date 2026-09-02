import ContentfulImage from "../lib/contentful-image";

export default function CoverImage({
  title,
  url,
}: {
  title?: string | null;
  url?: string | null;
}) {
  if (!url) {
    return null;
  }

  const alt = title ? `Cover Image for ${title}` : "Cover image";

  return (
    <div className="relative h-[260px] w-full md:h-[420px]">
      <ContentfulImage
        alt={alt}
        priority
        fill
        sizes="(min-width: 1180px) 1180px, 100vw"
        className="object-cover object-[50%_76%]"
        src={url}
      />
    </div>
  );
}
