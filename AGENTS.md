# Tuxedo Code - AI Agent Instructions

## Agent Instructions

- Ask before mutationg anything in the host os or outside of the project directory, always explain why you need this.

## Project Overview

Next.js 16 company website with Keystatic CMS integration (git-native, file-based — no database, no GraphQL). Uses App Router, TypeScript, and Tailwind CSS v4. Package manager is **pnpm** (pnpm-lock.yaml is the source of truth — don't use npm/yarn). Node/pnpm versions are pinned in `mise.toml` (node 22, pnpm 10).

Project uses `mise`

> The site previously ran on Contentful (hosted GraphQL CMS). It was migrated to Keystatic so content lives as files in this repo, is readable directly by humans/LLMs, and needs no external credentials to build. `MIGRATION.md`, which used to describe a hypothetical move to local Markdown files, has been removed now that this migration actually happened (via Keystatic, not bare Markdown).

## Key Architecture Patterns

### Content Management

- **Schema**: `keystatic.config.ts` (repo root) — defines the `posts` and `customers` collections in TypeScript via `collection()`/`fields.*` from `@keystatic/core`. This is the single source of truth for the content model; there is no separate codegen step — types are inferred directly from this file.
- **API layer**: `lib/api.ts` — wraps Keystatic's Reader API (`createReader` from `@keystatic/core/reader`) with `getAllPosts()`, `getPostBySlug(slug)`, `getAllCustomers()`. Exports the `Post`/`Customer` types via `Awaited<ReturnType<...>>` off those functions, imported directly by components (e.g. `app/page.tsx`, `app/more-stories.tsx`).
- **Content storage**: `content/posts/<slug>/index.mdoc` (frontmatter + Markdoc-flavored body) and `content/customers/<slug>.yaml` (flat frontmatter-only files, one per customer) — plain text files in the repo, committed to git like any other source file.
- **Images**: Use plain `next/image` everywhere — there are no wrapper components and no custom loader. All images are local files under `public/images/...` (post cover images under `public/images/posts/`, customer logos under `public/images/customers/`, uploaded there by the Keystatic admin UI). `next.config.js` sets `images.formats: ["image/webp"]` so Next's built-in `/_next/image` optimizer handles resizing and format conversion; no `remotePatterns` are needed since nothing is fetched from a remote host. No `loader` prop or `unoptimized` flag is needed anywhere.
- **Fixed-height/cropped images** (hero banners, card covers, customer logos): use `fill` inside a `relative`-sized wrapper (see `app/cover-image.tsx`, `app/customer-logos.tsx`), not explicit `width`/`height` plus a CSS override — the latter triggers Next's aspect-ratio console warnings. This is also the only real option for customer logos now, since `fields.image()` only returns a path string, not pixel dimensions.
- **Rich Text**: Render with `DocumentRenderer` from `@keystatic/core/renderer` in `lib/markdown.tsx`, driven by the `content` field's `fields.document()` schema (`keystatic.config.ts`). Custom `renderers.block` overrides reproduce the site's paragraph/heading/blockquote/image styling. Note `fields.document()` is deprecated upstream in favor of `fields.markdoc()`/`fields.mdx()`, but was kept here because it ships a ready-made renderer — revisit if Keystatic drops the field outright.
- **Admin UI**: `/keystatic` (mounted via `app/keystatic/` + `app/api/keystatic/[...params]/route.ts`) is a **local-editing-only** workflow — edit content through the UI while running `pnpm dev`, then commit the resulting file changes and push; a new commit triggers a fresh Vercel build.
- **The CMS is deliberately never deployed to Vercel, via two independent layers** (both must be preserved if this code is touched):
  1. **Runtime gate**: `app/keystatic/layout.tsx` and `app/api/keystatic/[...params]/route.ts` both check `showAdminUI` (exported from `keystatic.config.ts`, `true` only when `NODE_ENV === "development"`) and call Next's `notFound()`/return a plain 404 when it's false. This alone would still leave the admin UI's JS compiled into the Vercel build output (just unreachable), since `layout.tsx`'s static `import KeystaticApp from "./keystatic"` gets bundled regardless of the runtime branch.
  2. **Build-time exclusion**: `scripts/strip-keystatic-for-vercel.js`, wired as the `prebuild` npm script, deletes `app/keystatic/` and `app/api/keystatic/` outright before `next build` runs — but only when `process.env.VERCEL` is set (Vercel sets this automatically for every build it runs, production or preview, nothing to configure). This is a no-op for local `pnpm build`/`pnpm dev`. Because Vercel always builds from a fresh git checkout rather than mutating the real repo, this script deleting local files during a Vercel build is safe and has no effect on the actual repository. This is the layer that makes "never deployed" literally true, not just "unreachable once deployed."

### Environment Setup

```bash
# Contact form (app/api/contact), see .env.local.example:
SMTP_USERNAME=
SMTP_TOKEN=
SMTP_SERVER=
SMTP_PORT=
```

`pnpm build` and `pnpm dev` need **zero environment variables or credentials** to run — content is read straight off the filesystem via Keystatic's Reader API. The `SMTP_*` vars above are only needed for the contact form to actually send mail; their absence doesn't break the build.

### Contact form

- `app/contact/page.tsx` renders `app/contact-form.tsx` (a `"use client"` component, styled like `app/theme-toggle.tsx`: local `useState` state machine `idle → sending → sent`/`error`, plus a separate `emailInvalid` flag for onBlur email-format validation) which posts JSON to `app/api/contact/route.ts`.
- **Desktop layout has an explicit mockup**, unlike the other pages added this session — it's the `isContact` state inside `tuxedo-code-redesign-brief/project/Tuxedo Code Site.dc.html` (a different file from the `design_handoff_tuxedocode_redesign/README.md`'s "no contact page" text, which describes an earlier version of the brief; the top-level `Tuxedo Code Site.dc.html` is the newer, authoritative one and was initially missed — always open it directly rather than relying on the README summary). It specs a 2-column grid (`1fr / 1.15fr`): left column stacks the eyebrow/h1/lead paragraph _and_ the single-column facts grid; right column is just the bordered/surfaced form. The separate `Tuxedo Code Mobile.dc.html` specs the mobile order as intro → form → facts instead. Both are satisfied at once without duplicating markup by giving the intro block, `<ContactForm />`, and the facts grid explicit `md:col-start-*`/`md:row-start-*`/`md:row-span-2` placement in `app/contact/page.tsx`'s grid — so the DOM order (intro, form, facts) matches the mobile mockup while the desktop grid visually reassembles it into the left-column/right-column shape. Reuse this technique if another page ever needs a different visual order per breakpoint from a single component tree.
- The route validates the body (name/email/message required, company optional, simple length + email-format checks) then sends mail via `lib/mailer.ts` — a `nodemailer` SMTP transport built from `SMTP_SERVER`/`SMTP_PORT`/`SMTP_USERNAME`/`SMTP_TOKEN`, eagerly constructed and throwing descriptively on missing env vars (the same pattern the old `lib/contentful-client.ts` used before the Keystatic migration removed it). Submission goes straight through the mailbox's own SMTP server (Proton Mail's SMTP submission for `contact@tuxedocode.dk`), so there is deliberately **no third-party email API** (Resend was tried first and removed in favor of this once the existing Proton SMTP credentials were found in `.env`). Mail is sent from and to that same mailbox (`lib/mailer.ts`'s `CONTACT_MAILBOX`), with the visitor's submitted address set as reply-to, so replying in the mailbox goes straight to them. The plain-text `CONTACT_EMAIL` constant (`lib/constants.ts`) is unrelated to this and is only ever used for _display_ (footer/mobile-nav small print, the contact page's facts grid and its "Or email …" fallback line, the post-detail "Discuss a project" `mailto:` link) — it happens to be the same address as `SMTP_USERNAME` today, but the two are not wired together in code.
- The route is protected by [Vercel BotID](https://vercel.com/docs/botid): `next.config.js` is wrapped in `withBotId`, the root-level `instrumentation-client.ts` calls `initBotId({ protect: [{ path: "/api/contact", method: "POST" }] })`, and the route itself calls `checkBotId()` before doing anything else, returning 403 if `isBot`. BotID only meaningfully blocks bots once deployed to Vercel (local dev always reports `isBot: false`), and Vercel's "BotID Deep Analysis" firewall rule must be enabled manually in the project dashboard (Firewall → Rules) — it can't be set from code.
- **Every "Contact" / "Get In Touch" CTA across the site now links to `/contact`** instead of firing a `mailto:` directly: the header's solid "Contact" button, the mobile full-screen menu's bottom "Contact" button, the footer's "Get In Touch" button, the homepage hero's "Get In Touch" button, and the Services page closing block's "Get In Touch" button. The **one deliberate exception** is the post-detail page's "Discuss a project" link (`app/posts/[slug]/page.tsx`), which is still a plain `mailto:${CONTACT_EMAIL}` — it wasn't in scope when the others were switched.
- Known redundancy, not yet resolved: the header nav (`app/header.tsx`) and the mobile menu (`app/mobile-nav.tsx`) each now show **two** things labeled "Contact" pointing at the same `/contact` route side by side — a plain nav-list link (added so the route had a nav entry at all, matching `Tuxedo Code Mobile.dc.html`'s mockup) and the solid CTA button (re-pointed from `mailto:` per a later explicit request). Don't assume this duplication is intentional final design — it hasn't been reconciled yet.

### Content Types

- **Post** (`content/posts/<slug>/index.mdoc`): `slug`, `title`, `coverImage` (image path), `date`, `author` (plain text — Contentful's linked `Author` type only ever had `.name` queried here, so this is a faithful flattening, not a new modeling decision), `excerpt`, `content` (Keystatic `document` field). **No `category` field** — blog category tags shown in the UI come from a hand-maintained `slug → category` lookup in `lib/post-categories.ts`, updated manually per post. Reading time is computed from the document's resolved node tree (`lib/reading-time.ts`), not stored in the schema.
- **Customer** (`content/customers/<slug>.yaml`): `slug`, `name`, `website`, `logo` (image path). There's no more separate `Author` content type — author is just a text field on `Post` now (see above), and its old `picture` field (already unused in the UI — see Design System below) has no equivalent.

### Keystatic implementation gotchas (learned the hard way — verify against live behavior, not just types, before changing any of this)

- **The `{ slug, entry }` spread order in `lib/api.ts` matters and is not obvious from the types.** `reader.collections.X.all()`/`.read()` returns an `entry` object that *itself* contains a `slug` key (because the schema field is literally named `slug`), and at runtime that inner value is the raw stored "name" text (e.g. `"Hello World"`), not the URL-safe slug (`"hello-world"`) — despite what the Reader API's TypeScript types suggest. `lib/api.ts` must build results as `{ ...entry, slug }` (outer `slug` — the actual derived one — spread last, so it wins), never `{ slug, ...entry }`. Getting this backwards silently breaks every post link (e.g. `/posts/Hello World` instead of `/posts/hello-world`) with no type error, since both are typed as `string`.
- **`customers` deliberately has two separate fields — `slug` (`fields.slug`) and `name` (`fields.text`) — instead of one `fields.slug` for the name.** When a field is the collection's designated `slugField`, the Reader API returns the derived slug string for that key, not the human-readable value — so if `name` itself were a `fields.slug`, reading it back would give you the slug again, not the display name. This also means the Keystatic admin UI shows two inputs both labeled "Slug" (the `name` sub-field's label was set to "Slug" too) for `customers` — confusing in the UI, but intentional; don't "simplify" it back to one field without re-solving this.
- **`fields.document()`'s `formatting.blockTypes` must be explicitly enabled** (e.g. `blockTypes: { blockquote: true }`) for blockquotes to exist in the editor at all — without it, there's no blockquote toolbar button and no `> ` markdown shortcut (typing `> text` just inserts a literal `>` character). This is easy to miss since omitting it causes no TypeScript error and no runtime error — the editor just silently doesn't offer the feature `lib/markdown.tsx`'s renderer expects to receive.
- **The resolved `content` field (when read with `{ resolveLinkedFiles: true }`) is a Slate-style tree**, not Contentful's old `{ json, links }` shape: block nodes carry a `children` array, text leaves carry a `text` string. Both `lib/reading-time.ts`'s word-extraction and `lib/markdown.tsx`'s `DocumentRenderer` overrides depend on this shape.
- **Keystatic's own document editor enforces that a blockquote can't be the last node** — it silently re-inserts a trailing empty paragraph after one. Harmless (`DocumentRenderer` just renders an empty `<p>`), don't try to "fix" it.

### App Router Structure

```
app/
├── layout.tsx                # Global layout: sticky Header + flex-1 main + Footer
├── header.tsx / footer.tsx    # Site chrome (Header is a client component for active-link state)
├── page.tsx                  # Homepage: hero + customer-logo trust band + featured/more posts
├── services/page.tsx          # Services page (static copy, not CMS-driven)
├── blog/page.tsx               # Blog index (all posts, date + title + excerpt)
├── about/page.tsx              # About page (fully static, no content fetch)
├── contact/page.tsx            # Contact page: static copy + facts grid + <ContactForm />
├── contact-form.tsx            # "use client" form (name/company/email/message) posting to api/contact
├── posts/[slug]/               # Dynamic blog post pages
├── keystatic/                  # Local-only Keystatic admin UI (see Content Management above)
├── api/keystatic/[...params]/  # Keystatic's write-capable API route, same local-only gating
└── api/contact/                # Contact-form submission endpoint (BotID + SMTP, see below)
```

`instrumentation-client.ts` (repo root, next to `next.config.js`) and `lib/mailer.ts` are the two supporting files for the contact form that live outside `app/` — see below. `scripts/strip-keystatic-for-vercel.js` is the `prebuild` script that removes `app/keystatic/` and `app/api/keystatic/` on Vercel builds only (see Content Management above).

### Development Commands

- `pnpm dev` - Development server. Visit `/keystatic` while this is running to add/edit posts and customers through Keystatic's admin UI.
- `pnpm build` - Production build. Runs `scripts/strip-keystatic-for-vercel.js` as a `prebuild` step first (a no-op unless `VERCEL` is set). Needs no environment variables or credentials.

There is currently **no test suite and no lint script** configured — don't assume `pnpm test` or `pnpm lint` exist. Verify changes with `pnpm build` and manual checks in the browser.

### Design System

- Color and font tokens (ink, body, accent, rule, error, etc.; Manrope + Space Mono) are defined once in `app/globals.css`'s `@theme` block, generating matching Tailwind utilities (`text-ink`, `bg-surface`, `border-rule`, `text-error`, `font-mono`, …). Reuse these instead of introducing new ad-hoc colors or fonts. The `error` token (`text-error`, used by the contact form's inline validation/failure message) was added for this and sourced from the color already specified for it in `Tuxedo Code Mobile.dc.html`'s embedded stylesheet, not invented ad hoc.
- Shared chrome primitives: `app/monogram.tsx` (the "TC" mark — used in Header, Footer, and post bylines), `app/byline.tsx` (post author line — a static monogram, not a per-author photo; `app/avatar.tsx` was removed for this reason).
- `app/layout.tsx` uses the flex sticky-footer pattern (`flex min-h-screen flex-col` on the wrapper, `flex-1` on `<main>`) so the footer pins to the viewport bottom on short pages instead of trailing with a gap. Preserve this if editing the layout.

### Common Patterns

- Components are in `app/` (co-located with pages)
- Import paths use `@/` alias for root directory
- Tailwind classes follow mobile-first responsive design
- There is no draft/preview mode and no on-demand ISR revalidation anymore — with git-based content, local uncommitted edits already show immediately in `pnpm dev`, and every deploy is a full rebuild from whatever's committed, so there's no "unpublished vs. published" split left to model. If a staging/preview environment is ever needed, use a Vercel branch deploy rather than reintroducing draft-mode plumbing.

### Error Handling

- Missing/malformed content files surface as errors from Keystatic's Reader API (`lib/api.ts`) — there are no external credentials to be missing anymore.

## Secrets

`.env` / `.env.local` hold the `SMTP_*` credentials for the contact form's outgoing mailbox — never commit them or print their values (including in chat/tool output). Treat `SMTP_TOKEN` like a password.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
