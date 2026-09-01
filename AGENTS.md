# Tuxedo Code - AI Agent Instructions

## Project Overview

Next.js 16 company website with Contentful CMS integration. Uses App Router, TypeScript, and Tailwind CSS v4. Package manager is **pnpm** (pnpm-lock.yaml is the source of truth — don't use npm/yarn). Node/pnpm versions are pinned in `mise.toml` (node 22, pnpm 10).

> Note: `MIGRATION.md` in the repo root describes a hypothetical move off Contentful to local Markdown files. That work was never implemented — the code below is what's actually in the repo. Don't treat that file as current architecture.

## Key Architecture Patterns

### Content Management

- **API layer**: `lib/api.ts` — hand-written GraphQL query strings, executed via `executeQuery()`, typed against generated Contentful types
- **GraphQL client**: `lib/contentful-client.ts` — builds the `graphql-request` clients (regular + preview) and throws descriptive errors if `CONTENTFUL_SPACE_ID`/tokens are missing
- **Generated types**: `lib/generated/contentful-types.ts`, produced by `pnpm run codegen` (config in `codegen.yml`); imported directly by `lib/api.ts` and components (e.g. `app/page.tsx`, `app/more-stories.tsx`) as `Post`, `Customer`, `Asset` — there is no separate `typed-api.ts` wrapper
- **Images**: Use `ContentfulImage` component from `lib/contentful-image.tsx` for Contentful assets
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

- **Post**: `slug`, `title`, `coverImage`, `date`, `author`, `excerpt`, `content` (rich text JSON)
- **Customer**: `name`, `website`, `logo` (asset)
- **Author**: `name`, `picture` (asset)

### App Router Structure

```
app/
├── layout.tsx                # Global layout with footer
├── page.tsx                  # Homepage with hero post + customer logos
├── posts/[slug]/              # Dynamic blog post pages
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