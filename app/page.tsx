import Link from "next/link";
import { draftMode } from "next/headers";

import Date from "./date";
import CoverImage from "./cover-image";
import Avatar from "./avatar";
import MoreStories from "./more-stories";
import CustomerLogos from "./customer-logos";

import { getAllPosts, getAllCustomers } from "@/lib/api";
import { COMPANY_NAME } from "@/lib/constants";

import { Post } from "@/lib/generated/contentful-types";

function Intro() {
  return (
    <section className="flex-col md:flex-row flex items-center md:justify-between mt-16 mb-16 md:mb-12">
      <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-tight md:pr-8">
        {COMPANY_NAME}
      </h1>
      <h2 className="text-center md:text-left text-lg mt-5 md:pl-8">
        Premium software development and consulting services for modern
        businesses.
      </h2>
    </section>
  );
}

function HeroPost({
  title,
  coverImage,
  date,
  excerpt,
  author,
  slug,
}: Pick<
  Post,
  "title" | "coverImage" | "date" | "excerpt" | "author" | "slug"
>) {
  return (
    <section>
      <div className="mb-8 md:mb-16">
        <CoverImage title={title} slug={slug} url={coverImage?.url} />
      </div>
      <div className="md:grid md:grid-cols-2 md:gap-x-16 lg:gap-x-8 mb-20 md:mb-28">
        <div>
          <h3 className="mb-4 text-4xl lg:text-6xl leading-tight">
            <Link href={`/posts/${slug}`} className="hover:underline">
              {title}
            </Link>
          </h3>
          <div className="mb-4 md:mb-0 text-lg">
            <Date dateString={date} />
          </div>
        </div>
        <div>
          <p className="text-lg leading-relaxed mb-4">{excerpt}</p>
          <Avatar name={author?.name} picture={author?.picture} />
        </div>
      </div>
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
    <div className="container mx-auto px-5">
      <Intro />
      <CustomerLogos customers={allCustomers} />
      {heroPost && (
        <HeroPost
          title={heroPost.title}
          coverImage={heroPost.coverImage}
          date={heroPost.date}
          author={heroPost.author}
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
