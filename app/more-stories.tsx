import Link from "next/link";
import DateComponent from "./date";
import { type Post } from "@/lib/generated/contentful-types";
import { getPostCategory } from "@/lib/post-categories";

function PostPreview({
  title,
  date,
  excerpt,
  slug,
}: Pick<Post, "title" | "date" | "excerpt" | "slug">) {
  return (
    <Link
      href={`/posts/${slug}`}
      className="flex flex-col gap-[14px] border-t border-rule pt-5 hover:border-ink"
    >
      <p className="font-mono text-[10px] tracking-[0.1em] text-label-light uppercase">
        <DateComponent dateString={date} /> · {getPostCategory(slug)}
      </p>
      <h3 className="text-xl leading-[1.25] font-bold tracking-[-0.025em] text-pretty">
        {title}
      </h3>
      <p className="text-[15px] leading-[1.6] text-meta">{excerpt}</p>
    </Link>
  );
}

function hasSlug(post: Post): post is Post & { slug: string } {
  return Boolean(post.slug);
}

export default function MoreStories({ morePosts }: { morePosts: Post[] }) {
  const postsWithSlug = morePosts.filter(hasSlug);

  if (postsWithSlug.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto max-w-[1180px] px-8 pt-16 pb-24">
      <h2 className="mb-6 font-mono text-[11px] font-normal tracking-[0.16em] text-label uppercase">
        More stories
      </h2>
      <div className="grid grid-cols-1 gap-9 md:grid-cols-3">
        {postsWithSlug.map((post) => (
          <PostPreview
            key={post.slug}
            title={post.title}
            date={post.date}
            slug={post.slug}
            excerpt={post.excerpt}
          />
        ))}
      </div>
    </section>
  );
}
