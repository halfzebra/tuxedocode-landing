# Tuxedo Code - AI Agent Instructions

## Project Overview

Next.js 15 company website with Contentful CMS integration. Uses App Router, TypeScript, and Tailwind CSS.

## Key Architecture Patterns

### Content Management

- **Primary API**: `lib/api.ts` - template string GraphQL queries with manual typing
- **Typed API (New)**: `lib/typed-api.ts` - auto-generated types from `lib/generated/graphql.ts`
- **Images**: Use `ContentfulImage` component from `lib/contentful-image.tsx` for Contentful assets
- **Rich Text**: Render with `@contentful/rich-text-react-renderer` in `lib/markdown.tsx`

### Environment Setup

```bash
# Required env vars in .env.local:
CONTENTFUL_SPACE_ID=myb6dg5g059k
CONTENTFUL_ACCESS_TOKEN=...
CONTENTFUL_PREVIEW_ACCESS_TOKEN=...
CONTENTFUL_REVALIDATE_SECRET=...
```

### Content Types

- **Post**: `slug`, `title`, `coverImage`, `date`, `author`, `excerpt`, `content` (rich text JSON)
- **Customer**: `name`, `website`, `logo` (asset)
- **Author**: `name`, `picture` (asset)

### App Router Structure

```
app/
├── layout.tsx          # Global layout with footer
├── page.tsx            # Homepage with hero post + customer logos
├── posts/[slug]/       # Dynamic blog post pages
├── api/draft/          # Contentful preview mode
├── api/disable-draft/  # Exit preview mode
└── api/revalidate/     # ISR cache invalidation
```

### Development Commands

- `pnpm dev` - Development server
- `pnpm run codegen` - Generate types from Contentful schema (requires env vars)
- `pnpm run setup` - Initial Contentful content import

### Caching Strategy

- **Production**: 1-hour ISR cache (`revalidate: 3600`)
- **Preview**: No caching (`revalidate: 0`)
- **Cache tags**: `["posts"]` for cache invalidation

### Common Patterns

- Always check `draftMode().isEnabled` for preview content
- Use `getAllPosts(isDraftMode)` vs `getAllPosts(false)`
- Components are in `app/` (co-located with pages)
- Import paths use `@/` alias for root directory
- Tailwind classes follow mobile-first responsive design

### Error Handling

- Contentful errors logged with detailed context in `fetchGraphQL()`
- Missing env vars throw descriptive errors
- GraphQL validation happens at runtime

### Type Safety Migration

- Legacy: Manual types in component interfaces
- Modern: Generated types from `lib/generated/graphql.ts` (run `pnpm run codegen`)
- Import generated types: `Post`, `Customer` from `lib/typed-api.ts`
