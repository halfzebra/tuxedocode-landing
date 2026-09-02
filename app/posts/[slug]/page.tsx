import Link from "next/link";
import { notFound } from "next/navigation";
import { draftMode } from "next/headers";

import CoverImage from "../../cover-image";
import Date from "../../date";
import Byline from "../../byline";

import { Markdown } from "@/lib/markdown";
import { getAllPosts, getPostBySlug } from "@/lib/api";
import { CONTACT_EMAIL } from "@/lib/constants";
import { getPostCategory } from "@/lib/post-categories";
import { getReadingTime } from "@/lib/reading-time";

export async function generateStaticParams() {
  const allPosts = await getAllPosts(false);

  return allPosts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { isEnabled } = await draftMode();
  const post = await getPostBySlug(slug, isEnabled);

  if (!post) {
    notFound();
  }

  return (
    <article>
      <div className="mx-auto max-w-[1180px] px-8 pt-14">
        <CoverImage title={post.title} url={post.coverImage?.url} />
      </div>
      <div className="mx-auto max-w-[720px] px-8 pt-14 pb-24">
        <p className="mb-5 font-mono text-[11px] tracking-[0.12em] text-label uppercase">
          {getPostCategory(post.slug)} · <Date dateString={post.date} />
        </p>
        <h1 className="mb-7 text-[32px] leading-[1.1] font-extrabold tracking-[-0.04em] text-balance md:text-[46px] md:leading-[1.08]">
          {post.title}
        </h1>
        <Byline
          authorName={post.author?.name}
          readingTimeMinutes={getReadingTime(post.content)}
        />

        <Markdown content={post.content} />

        <div className="mt-13 flex items-center justify-between gap-6 border-t border-rule pt-8">
          <Link
            href="/blog"
            className="font-mono text-[11px] tracking-[0.1em] text-label uppercase"
          >
            ← All posts
          </Link>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="border-b border-[#c9ccd1] pb-[2px] text-[15px] font-semibold"
          >
            Discuss a project
          </a>
        </div>
      </div>
    </article>
  );
}

// Enable ISR: Regenerate individual posts at most once every hour (3600 seconds)
export const revalidate = 3600;
