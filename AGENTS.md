# Tuxedo Code - AI Agent Instructions

## Project Overview

Next.js 16 company website with Contentful CMS integration. Uses App Router, TypeScript, and Tailwind CSS v4. Package manager is **pnpm** (pnpm-lock.yaml is the source of truth — don't use npm/yarn). Node/pnpm versions are pinned in `mise.toml` (node 22, pnpm 10).

Project uses `mise`

> Note: `MIGRATION.md` in the repo root describes a hypothetical move off Contentful to local Markdown files. That work was never implemented — the code below is what's actually in the repo. Don't treat that file as current architecture.

## Key Architecture Patterns

### Content Management

- **API layer**: `lib/api.ts` — hand-written GraphQL query strings, executed via `executeQuery()`, typed against generated Contentful types
- **GraphQL client**: `lib/contentful-client.ts` — builds the `graphql-request` clients (regular + preview) and throws descriptive errors if `CONTENTFUL_SPACE_ID`/tokens are missing
- **Generated types**: `lib/generated/contentful-types.ts`, produced by `pnpm run codegen` (config in `codegen.yml`); imported directly by `lib/api.ts` and components (e.g. `app/page.tsx`, `app/more-stories.tsx`) as `Post`, `Customer`, `Asset` — there is no separate `typed-api.ts` wrapper
- **Images**: Use plain `next/image` everywhere — there are no wrapper components and no custom loader. `next.config.js` sets `images.remotePatterns` (allowing `images.ctfassets.net`) and `images.formats: ["image/webp"]`, so Next's built-in `/_next/image` optimizer handles resizing, format conversion, and per-browser `Accept`-header negotiation (WebP for supporting browsers, automatic fallback to the original format otherwise) for both Contentful assets and local files under `public/images/`. No `loader` prop or `unoptimized` flag is needed anywhere.
- **Fixed-height/cropped images** (hero banners, card covers): use `fill` inside a `relative`-sized wrapper (see `app/cover-image.tsx`), not explicit `width`/`height` plus a CSS override — the latter triggers Next's aspect-ratio console warnings.
- **Rich Text**: Render with `@contentful/rich-text-react-renderer` in `lib/markdown.tsx`

### Environment Setup

```bash
# Required env vars in .env.local (see .env.local.example):
CONTENTFUL_SPACE_ID=
CONTENTFUL_ACCESS_TOKEN=
CONTENTFUL_PREVIEW_ACCESS_TOKEN=
CONTENTFUL_REVALIDATE_SECRET=
CONTENTFUL_ENVIRONMENT=master

# Only needed for `pnpm run setup` (content import), not committed to .env.local.example:
CONTENTFUL_MANAGEMENT_TOKEN=
```

`pnpm build` runs `graphql-codegen` as a `prebuild` step, so **build and codegen both require live Contentful credentials** — they will fail in an environment without `.env.local`/`.env` populated.

### Content Types

- **Post**: `slug`, `title`, `coverImage`, `date`, `author`, `excerpt`, `content` (rich text JSON). **No `category` field** — blog category tags shown in the UI come from a hand-maintained `slug → category` lookup in `lib/post-categories.ts`, updated manually per post. Reading time is likewise computed client-side from `content.json` (`lib/reading-time.ts`), not stored in Contentful.
- **Customer**: `name`, `website`, `logo` (asset)
- **Author**: `name`, `picture` (asset) — note the site no longer renders author photos anywhere (see Design System below); `picture` is unused in the current UI.

### App Router Structure

```
app/
├── layout.tsx                # Global layout: sticky Header + flex-1 main + Footer
├── header.tsx / footer.tsx    # Site chrome (Header is a client component for active-link state)
├── page.tsx                  # Homepage: hero + customer-logo trust band + featured/more posts
├── services/page.tsx          # Services page (static copy, not Contentful-driven)
├── blog/page.tsx               # Blog index (all posts, date + title + excerpt)
├── about/page.tsx              # About page (fully static, no Contentful fetch)
├── posts/[slug]/               # Dynamic blog post pages
├── api/draft/                 # Enable Contentful preview mode (redirects to slug)
├── api/local-enable-draft/    # Enable preview mode locally only; 403s in production
├── api/disable-draft/         # Exit preview mode
└── api/revalidate/            # ISR cache invalidation webhook (checks x-vercel-reval-key)
```

### Development Commands

- `pnpm dev` - Development server
- `pnpm run codegen` / `pnpm run codegen:watch` - Generate types from Contentful schema (requires env vars)
- `pnpm run setup` - One-time Contentful space content-model import via `contentful-import` (`lib/setup.js` + `lib/export.json`). This writes to whatever space `CONTENTFUL_SPACE_ID` points at — don't run it against a populated/production space without checking first.
- `pnpm build` - Production build (runs codegen first; needs credentials)

There is currently **no test suite and no lint script** configured — don't assume `pnpm test` or `pnpm lint` exist. Verify changes with `pnpm build` and manual checks in the browser.

### Caching Strategy

- **Production**: 1-hour ISR cache (`revalidate: 3600`)
- **Preview**: No caching (`revalidate: 0`)
- **Cache tags**: `["posts"]`, invalidated via `revalidateTag` in `app/api/revalidate/route.ts`

### Design System

- Color and font tokens (ink, body, accent, rule, etc.; Manrope + Space Mono) are defined once in `app/globals.css`'s `@theme` block, generating matching Tailwind utilities (`text-ink`, `bg-surface`, `border-rule`, `font-mono`, …). Reuse these instead of introducing new ad-hoc colors or fonts.
- Shared chrome primitives: `app/monogram.tsx` (the "TC" mark — used in Header, Footer, and post bylines), `app/byline.tsx` (post author line — a static monogram, not a per-author photo; `app/avatar.tsx` was removed for this reason).
- `app/layout.tsx` uses the flex sticky-footer pattern (`flex min-h-screen flex-col` on the wrapper, `flex-1` on `<main>`) so the footer pins to the viewport bottom on short pages instead of trailing with a gap. Preserve this if editing the layout.

### Common Patterns

- Always check `draftMode().isEnabled` for preview content
- Use `getAllPosts(isDraftMode)` vs `getAllPosts(false)`
- Components are in `app/` (co-located with pages)
- Import paths use `@/` alias for root directory
- Tailwind classes follow mobile-first responsive design

### Error Handling

- Missing Contentful env vars throw descriptive errors from `createGraphQLClient()` in `lib/contentful-client.ts`
- GraphQL query/schema mismatches surface as runtime errors from `executeQuery()` in `lib/api.ts`

## Secrets

`.env` / `.env.local` hold real Contentful credentials — never commit them or print their values. `CONTENTFUL_REVALIDATE_SECRET` must match the `x-vercel-reval-key` header sent by the Vercel webhook; treat it like a password.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
