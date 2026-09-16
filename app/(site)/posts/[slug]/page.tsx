import Link from "next/link";
import { notFound } from "next/navigation";

import CoverImage from "../../../cover-image";
import Date from "../../../date";
import Byline from "../../../byline";

import { Markdown } from "@/lib/markdown";
import { getAllPosts, getPostBySlug } from "@/lib/api";
import { getPostCategory } from "@/lib/post-categories";
import { getReadingTime } from "@/lib/reading-time";

export async function generateStaticParams() {
  const allPosts = await getAllPosts();

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
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <article>
      <div className="mx-auto max-w-[1180px] px-8 pt-14">
        <CoverImage title={post.title} url={post.coverImage} />
      </div>
      <div className="mx-auto max-w-[720px] px-8 pt-14 pb-24">
        <p className="mb-5 font-mono text-[11px] tracking-[0.12em] text-label uppercase">
          {getPostCategory(post.slug)} · <Date dateString={post.date} />
        </p>
        <h1 className="mb-7 text-[32px] leading-[1.1] font-extrabold tracking-[-0.04em] text-balance md:text-[46px] md:leading-[1.08]">
          {post.title}
        </h1>
        <Byline
          authorName={post.author}
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
          <Link
            href="/contact"
            className="border-b border-rule-soft pb-[2px] text-[15px] font-semibold"
          >
            Discuss a project
          </Link>
        </div>
      </div>
    </article>
  );
}
