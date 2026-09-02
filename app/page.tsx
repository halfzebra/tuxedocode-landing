import Link from "next/link";
import { draftMode } from "next/headers";

import Date from "./date";
import LocalImage from "@/lib/local-image";
import ContentfulImage from "@/lib/contentful-image";
import MoreStories from "./more-stories";
import CustomerLogos from "./customer-logos";

import { getAllPosts, getAllCustomers } from "@/lib/api";
import { CONTACT_EMAIL } from "@/lib/constants";
import { getPostCategory } from "@/lib/post-categories";

import { Post } from "@/lib/generated/contentful-types";

function Hero() {
  return (
    <section className="mx-auto max-w-[1180px] px-8">
      <div className="grid grid-cols-1 items-center gap-14 py-16 md:grid-cols-[0.92fr_1.08fr] md:gap-14 md:py-[88px] md:pb-[72px]">
        <div>
          <p className="mb-6 font-mono text-[11px] tracking-[0.16em] text-label uppercase">
            Nordhavn, Copenhagen
          </p>
          <h1 className="mb-6 text-[44px] leading-[1.05] font-extrabold tracking-[-0.04em] text-balance md:text-[66px] md:leading-[1.02] md:tracking-[-0.045em]">
            Tuxedo Code ApS
          </h1>
          <p className="mb-9 max-w-[30ch] text-xl leading-[1.55] text-body-muted text-pretty">
            Premium software development and consulting services for modern
            businesses.
          </p>
          <div className="flex items-center gap-5">
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="bg-ink px-[26px] py-[14px] text-[15px] font-semibold text-white hover:bg-accent"
            >
              Get In Touch
            </a>
            <Link
              href="/services"
              className="border-b border-[#c9ccd1] pb-[2px] text-[15px] font-semibold"
            >
              Our Services
            </Link>
          </div>
        </div>
        <div>
          <div className="relative h-[300px] w-full md:h-[460px]">
            <LocalImage
              src="/images/hero-harbour.jpg"
              alt="Copenhagen harbour mouth, fort and offshore wind turbines"
              fill
              priority
              sizes="(min-width: 1180px) 611px, 100vw"
              className="object-cover object-[50%_62%]"
            />
          </div>
          <p className="mt-[10px] font-mono text-[10px] tracking-[0.1em] text-label-light">
            NORDHAVN, COPENHAGEN — OWN PHOTOGRAPH
          </p>
        </div>
      </div>
    </section>
  );
}

function FeaturedPost({
  title,
  coverImage,
  date,
  excerpt,
  slug,
}: Pick<Post, "title" | "coverImage" | "date" | "excerpt" | "slug">) {
  return (
    <section className="mx-auto max-w-[1180px] px-8 pt-20">
      <div className="mb-7 flex items-baseline justify-between gap-6">
        <h2 className="text-[28px] font-extrabold tracking-[-0.03em]">
          Latest writing
        </h2>
        <Link
          href="/blog"
          className="font-mono text-[11px] tracking-[0.1em] text-label uppercase"
        >
          All posts →
        </Link>
      </div>
      <Link
        href={`/posts/${slug}`}
        className="grid grid-cols-1 items-center gap-8 border-t border-ink pt-7 md:grid-cols-[1.15fr_1fr] md:gap-11"
      >
        {coverImage?.url && (
          <div className="relative h-[220px] w-full md:h-[340px]">
            <ContentfulImage
              alt={title ? `Cover image for ${title}` : "Cover image"}
              fill
              sizes="(min-width: 1180px) 641px, 100vw"
              className="object-cover object-[50%_78%]"
              src={coverImage.url}
            />
          </div>
        )}
        <div>
          <p className="mb-4 font-mono text-[11px] tracking-[0.1em] text-label uppercase">
            <Date dateString={date} /> · {getPostCategory(slug)}
          </p>
          <h3 className="mb-4 text-[28px] leading-[1.15] font-extrabold tracking-[-0.035em] text-balance md:text-[36px] md:leading-[1.1]">
            {title}
          </h3>
          <p className="mb-5 text-[17px] leading-[1.6] text-body-muted text-pretty">
            {excerpt}
          </p>
          <span className="border-b border-[#c9ccd1] pb-[2px] text-[15px] font-semibold">
            Read the post
          </span>
        </div>
      </Link>
    </section>
  );
}

export default async function Page() {
  const { isEnabled } = await draftMode();
  const allPosts = await getAllPosts(isEnabled);
  const allCustomers = await getAllCustomers(isEnabled);
  const heroPost = allPosts[0];
  const morePosts = allPosts.slice(1);

  return (
    <div>
      <Hero />
      <CustomerLogos customers={allCustomers} />
      {heroPost && (
        <FeaturedPost
          title={heroPost.title}
          coverImage={heroPost.coverImage}
          date={heroPost.date}
          slug={heroPost.slug}
          excerpt={heroPost.excerpt}
        />
      )}
      {morePosts && morePosts.length > 0 && (
        <MoreStories morePosts={morePosts} />
      )}
    </div>
  );
}

// Enable ISR: Regenerate this page at most once every hour (3600 seconds)
export const revalidate = 3600;
