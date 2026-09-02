import Link from "next/link";
import { draftMode } from "next/headers";

import Date from "../date";
import { getAllPosts } from "@/lib/api";
import { COMPANY_NAME } from "@/lib/constants";

export const metadata = {
  title: `Blog - ${COMPANY_NAME}`,
  description:
    "Notes on architecture, delivery, and the practical side of shipping software in regulated industries.",
};

export default async function BlogPage() {
  const { isEnabled } = await draftMode();
  const allPosts = await getAllPosts(isEnabled);

  return (
    <div className="mx-auto max-w-[900px] px-8 pt-16 pb-24 md:pt-20">
      <h1 className="mb-4 text-[40px] leading-[1.05] font-extrabold tracking-[-0.045em] md:text-[60px] md:leading-[1.03]">
        Blog
      </h1>
      <p className="mb-14 max-w-[56ch] text-lg leading-[1.55] text-body-muted">
        Notes on architecture, delivery, and the practical side of shipping
        software in regulated industries.
      </p>
      <div className="flex flex-col">
        {allPosts.map((post) => (
          <Link
            key={post.slug}
            href={`/posts/${post.slug}`}
            className="grid grid-cols-1 items-baseline gap-2 border-t border-rule py-5 hover:border-ink sm:grid-cols-[150px_1fr] sm:gap-8 sm:py-[26px]"
          >
            <span className="font-mono text-[11px] tracking-[0.08em] text-label-light">
              <Date dateString={post.date} />
            </span>
            <div>
              <h2 className="mb-2 text-2xl leading-[1.22] font-bold tracking-[-0.028em] text-pretty">
                {post.title}
              </h2>
              <p className="text-[15px] leading-[1.6] text-meta">
                {post.excerpt}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

// Enable ISR: Regenerate this page at most once every hour (3600 seconds)
export const revalidate = 3600;
