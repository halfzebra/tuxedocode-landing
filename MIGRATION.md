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
- **Local editing**: Decap CMS at `/admin/index.html`, `local_backend: true`, run `pnpm run cms`
  (starts `decap-server`) alongside `pnpm dev` — writes straight to disk, no git involved.
  - **Hard constraint: the CMS must never be part of the deployed website.** `public/admin/`
    (the Decap config + `index.html`) is `.gitignore`d, full stop — not merely kept off by a
    runtime check like the existing `local-enable-draft` 403-in-production pattern. A runtime
    check can be misconfigured or bypassed; a file that was never committed cannot ship, because
    Vercel builds from what's in git. If `/admin` needs to exist as a real file at all (rather
    than generated locally by a setup script), it lives outside `public/` under something
    `next build` never touches, and gets copied into `public/admin/` only by the local dev
    command — never by the build used for deployment.
  - Production content editing is therefore just: edit the Markdown/JSON file directly and commit
    (see open decisions — this also settles whether a git-gateway/OAuth backend is worth building:
    it isn't, since there's no production Decap instance to authenticate against).
- **Hosting**: Vercel — `git push` to publish, zero-config image optimization/CDN.

## One-time content migration (Contentful → files)

Actual content as of writing: 1 post, a handful of author/customer entries, ~9 images total. That's
small enough to move by hand — no export/transform script needed:

1. Open each entry in the Contentful web UI, copy the text into the corresponding
   `content/posts/*.md` / `content/authors/*.json` / `content/customers/*.json` file, re-typing
   any rich text as plain Markdown by eye.
2. Download the ~9 image assets from Contentful's UI and drop them into `public/images/...`.
3. Eyeball the rendered pages against the live Contentful-backed site before cutting over.

If content volume grows substantially before this migration happens, revisit — a script only
starts paying for itself well past this scale.

## Resolved decisions

1. ~~Decap admin bundle self-hosted vs CDN~~ — moot. `/admin` never deploys at all (see "Hard
   constraint" above), so it doesn't matter whether the bundle loads from `unpkg.com/decap-cms`
   or is vendored — that only affects local dev, where internet access is a non-issue.
2. ~~Production editing backend (git-gateway/OAuth)~~ — not needed. There's no production Decap
   instance to log into; production edits are direct commits to the Markdown/JSON files.

## Open decisions (resolve before starting implementation)

1. **Build cost/latency tradeoff**: every content change now requires a full rebuild + redeploy
   instead of Contentful's on-demand `revalidateTag`. Fine for a low-traffic single-author blog,
   but worth confirming that's an acceptable tradeoff before removing ISR.

## Verification checklist (once implemented — not yet run)

- [ ] `pnpm build` succeeds with no Contentful env vars set
- [ ] `/`, `/posts/<slug>`, `/sitemap.xml` serve correctly locally
- [ ] A PR/branch produces a Vercel preview deployment showing draft content, replacing
      `/api/draft`
- [ ] Decap admin works locally end-to-end (create a post, upload an image, commit) via `pnpm run cms`
- [ ] The deployed production site returns 404 for `/admin` and `/admin/index.html` — confirms the
      CMS genuinely never shipped, not just that no one linked to it
- [ ] The 1 post + author/customer entries + ~9 images have been copied over and match the live
      Contentful-backed site