# Contentful → local content migration (proposal, not implemented)

> This is a design doc for a possible future migration. Nothing in this file has been built —
> see [AGENTS.md](AGENTS.md), which is explicit that the current codebase still runs on Contentful.
> Do not read the "Verification checklist" at the bottom as a report of completed work.

## Why

Contentful (GraphQL client + codegen, rich-text renderer, preview/draft-mode routes, revalidate
webhook) is a lot of moving parts for a one-person marketing/blog site with 3 content types.
Local Markdown/JSON files checked into git would be simpler, need no API/auth layer, and are
directly readable/editable by LLM coding agents.

## Alternatives considered

### corebunch/instatic — rejected

Looked like a candidate on the name alone, but it's a different kind of project: a self-hosted
*visual CMS* (TypeScript/Bun server, React 19 admin, SQLite/Postgres), positioned as a
Webflow/Framer alternative — not a static-site generator you migrate content into.

- Requires a persistently running Bun server + database. That's the opposite of the goal above
  ("no API/auth layer") — it swaps Contentful's hosted API for a self-run server + DB.
- Pre-1.0 (v0.0.x); the project itself says it's not yet recommended for production.
- It replaces the whole app, not just the CMS: its own visual-component system, no MDX/React
  support. Adopting it means discarding the existing Next.js/Tailwind/TypeScript app, not
  migrating content into it.
- No documented path for migrating an existing Next.js codebase.

Not a fit. Sticking with the local-files approach below.

## Plan

- **Content**: `content/posts/*.md` (frontmatter + Markdown body), `content/authors/*.json`,
  `content/customers/*.json`, replacing Contentful entries.
  - Plain Markdown, not MDX. The only known need is structured text (headings, links, images) —
    no embedded React components in post bodies today. Plain Markdown means a bad edit from a
    non-technical editor can't break the site build the way stray JSX in MDX could. Revisit MDX
    only if/when a post genuinely needs an embedded component.
  - Authors stay a separate collection referenced by slug from posts (matches today's `Author`
    content type) rather than duplicating name/picture inline in every post's frontmatter.
- **Data access**: `lib/content.ts` (filesystem + `gray-matter`) replaces `lib/api.ts` (GraphQL).
- **Rendering**: `lib/markdown.tsx` renders Markdown via a plain Markdown-to-React pipeline
  (e.g. `remark`/`rehype`), replacing the Contentful rich-text renderer.
- **Removed**: `lib/contentful-client.ts`, generated GraphQL types, `codegen.yml`, the `prebuild`
  codegen step, Contentful/GraphQL deps, and the preview/draft/revalidate API routes
  (`app/api/draft`, `disable-draft`, `local-enable-draft`, `revalidate`). Pages become plain SSG —
  no ISR.
  - Draft/preview mode isn't just dropped — it's replaced by Vercel's per-branch/PR preview
    deployments, which give a reviewable preview URL for unpublished content without any custom
    draft-mode plumbing.
- **Images**: `next.config.js` no longer sets a custom loader; `lib/contentful-image.tsx` is
  gone. `app/cover-image.tsx`, `avatar.tsx`, `customer-logos.tsx` use plain `next/image` against
  local paths.
  - Contentful was also acting as a DAM (CDN, on-the-fly resizing/format transforms). Committing
    raw uploads to git has no equivalent — every edit adds a new blob to history forever, and
    there's no automatic compression. Adopt a policy of resizing/compressing images before commit
    (either a pre-commit script or a step in the CMS upload flow) so the repo doesn't grow
    unbounded.
- **Local editing**: Decap CMS at `/admin/index.html`. Two distinct modes, not one:
  - *Local dev*: `local_backend: true`, run `pnpm run cms` (starts `decap-server`) alongside
    `pnpm dev` — writes straight to disk, no git involved.
  - *Production editing*: needs a git-backed Decap backend (git-gateway + an OAuth app, or a
    GitHub-token backend) so edits become real commits/PRs. This is unimplemented in the local-only
    setup above and is its own setup task — see open decisions below.
- **Hosting**: Vercel — `git push` to publish, zero-config image optimization/CDN.

## One-time content migration (Contentful → files)

Not yet started. Needed before the Contentful code can be removed:

1. Script (e.g. `scripts/migrate-from-contentful.ts`) using the Contentful Management API to pull
   all `Post`/`Author`/`Customer` entries.
2. Transform each `Post`'s rich-text JSON to Markdown, resolving embedded assets/entries inline
   (Contentful rich text can embed images and linked entries — these need explicit handling, not
   a generic JSON-to-Markdown pass).
3. Download all referenced assets (post cover images, author pictures, customer logos) into
   `public/images/...` and rewrite references to local paths.
4. Write `content/posts/*.md`, `content/authors/*.json`, `content/customers/*.json`.
5. Diff rendered output (old Contentful-backed pages vs. new file-backed pages) before cutting
   over, so content isn't silently lost or mangled in translation.

## Open decisions (resolve before starting implementation)

1. **Decap admin bundle**: currently would load from a CDN (`unpkg.com/decap-cms`), meaning
   `/admin` requires internet access and depends on an external host staying up. Decide: vendor
   the bundle into the repo (self-host), or keep `public/admin/` out of git entirely so it never
   ships to production and lives only in local dev.
2. **Production editing backend**: is a git-gateway/OAuth setup worth it for a one-person site, or
   is "edit the Markdown file directly and commit" an acceptable workflow, skipping Decap in
   production entirely?
3. **Build cost/latency tradeoff**: every content change now requires a full rebuild + redeploy
   instead of Contentful's on-demand `revalidateTag`. Fine for a low-traffic single-author blog,
   but worth confirming that's an acceptable tradeoff before removing ISR.

## Verification checklist (once implemented — not yet run)

- [ ] `pnpm build` succeeds with no Contentful env vars set
- [ ] `/`, `/posts/<slug>`, `/sitemap.xml` serve correctly locally
- [ ] A PR/branch produces a Vercel preview deployment showing draft content, replacing
      `/api/draft`
- [ ] Decap admin (in whichever backend mode was chosen above) can create a post and upload an
      image end-to-end, and the resulting commit builds successfully
- [ ] All existing Contentful content has been migrated and spot-checked against the live site