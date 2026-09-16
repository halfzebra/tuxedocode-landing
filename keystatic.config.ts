import { config, collection, fields } from "@keystatic/core";

import KeystaticBrandMark from "@/app/keystatic/brand-mark";

// The admin UI (and its write-capable API route) is a local-editing-only
// workflow: edit here, commit, push, let Vercel rebuild. Vercel's production
// filesystem is read-only anyway, so this also guards against a dead UI that
// would error on every save if it were ever reachable there.
//
// This is the *first* of two layers keeping the CMS off Vercel entirely:
// app/keystatic/layout.tsx and app/api/keystatic/[...params]/route.ts both
// check this flag and 404 when it's false, so the routes are unreachable in
// any non-dev environment. The second, stronger layer is
// scripts/strip-keystatic-for-vercel.js (wired as the `prebuild` script),
// which deletes those route directories outright before `next build` runs
// on Vercel (detected via the `VERCEL` env var Vercel sets automatically) —
// so on Vercel the CMS routes aren't just gated, they don't exist in the
// build at all. Both layers are deliberate: this flag alone would still let
// the admin UI's JS ship in the Vercel build output (just unreachable);
// the strip script is what guarantees it's never deployed there.
export const showAdminUI = process.env.NODE_ENV === "development";

export default config({
  storage: { kind: "local" },

  // Matches the site's own header wordmark (app/header.tsx) rather than the
  // legal COMPANY_NAME constant ("Tuxedo Code ApS"), which is too long for
  // the nav sidebar and is only used for display/footer/metadata contexts.
  ui: {
    brand: {
      name: "Tuxedo Code",
      mark: KeystaticBrandMark,
    },
  },

  collections: {
    posts: collection({
      label: "Blog Posts",
      slugField: "slug",
      path: "content/posts/*/",
      format: { contentField: "content" },
      schema: {
        slug: fields.slug({ name: { label: "Slug" } }),
        title: fields.text({ label: "Title" }),
        coverImage: fields.image({
          label: "Cover Image",
          directory: "public/images/posts",
          publicPath: "/images/posts/",
        }),
        date: fields.date({ label: "Date" }),
        // Contentful's Author content type only ever had its `name` queried
        // here (its `picture` field was unused - see app/byline.tsx), so
        // flattening author to plain text is a faithful translation of what
        // was actually used, not a new content-model decision.
        author: fields.text({ label: "Author" }),
        excerpt: fields.text({ label: "Excerpt", multiline: true }),
        // NOTE: fields.document() is deprecated upstream in favor of
        // fields.markdoc()/fields.mdx(), but it's the only rich-text field
        // that ships a ready-made renderer (DocumentRenderer). Revisit if
        // Keystatic ever drops this field outright.
        content: fields.document({
          label: "Content",
          formatting: {
            headingLevels: [2],
            inlineMarks: true,
            listTypes: true,
            blockTypes: { blockquote: true },
          },
          links: true,
          dividers: true,
          images: {
            directory: "public/images/posts",
            publicPath: "/images/posts/",
          },
        }),
      },
    }),

    customers: collection({
      label: "Customers",
      slugField: "slug",
      path: "content/customers/*",
      format: "yaml",
      schema: {
        slug: fields.slug({ name: { label: "Slug" } }),
        name: fields.text({ label: "Name" }),
        website: fields.url({ label: "Website" }),
        logo: fields.image({
          label: "Logo",
          directory: "public/images/customers",
          publicPath: "/images/customers/",
        }),
      },
    }),
  },
});
