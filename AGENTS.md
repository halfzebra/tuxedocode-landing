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

# Contact form (app/api/contact), see .env.local.example:
SMTP_USERNAME=
SMTP_TOKEN=
SMTP_SERVER=
SMTP_PORT=
```

`pnpm build` runs `graphql-codegen` as a `prebuild` step, so **build and codegen both require live Contentful credentials** — they will fail in an environment without `.env.local`/`.env` populated.

### Contact form

- `app/contact/page.tsx` renders `app/contact-form.tsx` (a `"use client"` component, styled like `app/theme-toggle.tsx`: local `useState` state machine `idle → sending → sent`/`error`, plus a separate `emailInvalid` flag for onBlur email-format validation) which posts JSON to `app/api/contact/route.ts`.
- **Desktop layout has an explicit mockup**, unlike the other pages added this session — it's the `isContact` state inside `tuxedo-code-redesign-brief/project/Tuxedo Code Site.dc.html` (a different file from the `design_handoff_tuxedocode_redesign/README.md`'s "no contact page" text, which describes an earlier version of the brief; the top-level `Tuxedo Code Site.dc.html` is the newer, authoritative one and was initially missed — always open it directly rather than relying on the README summary). It specs a 2-column grid (`1fr / 1.15fr`): left column stacks the eyebrow/h1/lead paragraph *and* the single-column facts grid; right column is just the bordered/surfaced form. The separate `Tuxedo Code Mobile.dc.html` specs the mobile order as intro → form → facts instead. Both are satisfied at once without duplicating markup by giving the intro block, `<ContactForm />`, and the facts grid explicit `md:col-start-*`/`md:row-start-*`/`md:row-span-2` placement in `app/contact/page.tsx`'s grid — so the DOM order (intro, form, facts) matches the mobile mockup while the desktop grid visually reassembles it into the left-column/right-column shape. Reuse this technique if another page ever needs a different visual order per breakpoint from a single component tree.
- The route validates the body (name/email/message required, company optional, simple length + email-format checks) then sends mail via `lib/mailer.ts` — a `nodemailer` SMTP transport built from `SMTP_SERVER`/`SMTP_PORT`/`SMTP_USERNAME`/`SMTP_TOKEN`, mirroring `lib/contentful-client.ts`'s eager-construction/throw-on-missing-env pattern. Submission goes straight through the mailbox's own SMTP server (Proton Mail's SMTP submission for `contact@tuxedocode.dk`), so there is deliberately **no third-party email API** (Resend was tried first and removed in favor of this once the existing Proton SMTP credentials were found in `.env`). Mail is sent from and to that same mailbox (`lib/mailer.ts`'s `CONTACT_MAILBOX`), with the visitor's submitted address set as reply-to, so replying in the mailbox goes straight to them. The plain-text `CONTACT_EMAIL` constant (`lib/constants.ts`) is unrelated to this and is only ever used for *display* (footer/mobile-nav small print, the contact page's facts grid and its "Or email …" fallback line, the post-detail "Discuss a project" `mailto:` link) — it happens to be the same address as `SMTP_USERNAME` today, but the two are not wired together in code.
- The route is protected by [Vercel BotID](https://vercel.com/docs/botid): `next.config.js` is wrapped in `withBotId`, the root-level `instrumentation-client.ts` calls `initBotId({ protect: [{ path: "/api/contact", method: "POST" }] })`, and the route itself calls `checkBotId()` before doing anything else, returning 403 if `isBot`. BotID only meaningfully blocks bots once deployed to Vercel (local dev always reports `isBot: false`), and Vercel's "BotID Deep Analysis" firewall rule must be enabled manually in the project dashboard (Firewall → Rules) — it can't be set from code.
- **Every "Contact" / "Get In Touch" CTA across the site now links to `/contact`** instead of firing a `mailto:` directly: the header's solid "Contact" button, the mobile full-screen menu's bottom "Contact" button, the footer's "Get In Touch" button, the homepage hero's "Get In Touch" button, and the Services page closing block's "Get In Touch" button. The **one deliberate exception** is the post-detail page's "Discuss a project" link (`app/posts/[slug]/page.tsx`), which is still a plain `mailto:${CONTACT_EMAIL}` — it wasn't in scope when the others were switched.
- Known redundancy, not yet resolved: the header nav (`app/header.tsx`) and the mobile menu (`app/mobile-nav.tsx`) each now show **two** things labeled "Contact" pointing at the same `/contact` route side by side — a plain nav-list link (added so the route had a nav entry at all, matching `Tuxedo Code Mobile.dc.html`'s mockup) and the solid CTA button (re-pointed from `mailto:` per a later explicit request). Don't assume this duplication is intentional final design — it hasn't been reconciled yet.

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
├── contact/page.tsx            # Contact page: static copy + facts grid + <ContactForm />
├── contact-form.tsx            # "use client" form (name/company/email/message) posting to api/contact
├── posts/[slug]/               # Dynamic blog post pages
├── api/draft/                 # Enable Contentful preview mode (redirects to slug)
├── api/local-enable-draft/    # Enable preview mode locally only; 403s in production
├── api/disable-draft/         # Exit preview mode
├── api/revalidate/            # ISR cache invalidation webhook (checks x-vercel-reval-key)
└── api/contact/                # Contact-form submission endpoint (BotID + SMTP, see below)
```

`instrumentation-client.ts` (repo root, next to `next.config.js`) and `lib/mailer.ts` are the two supporting files for the contact form that live outside `app/` — see below.

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

- Color and font tokens (ink, body, accent, rule, error, etc.; Manrope + Space Mono) are defined once in `app/globals.css`'s `@theme` block, generating matching Tailwind utilities (`text-ink`, `bg-surface`, `border-rule`, `text-error`, `font-mono`, …). Reuse these instead of introducing new ad-hoc colors or fonts. The `error` token (`text-error`, used by the contact form's inline validation/failure message) was added for this and sourced from the color already specified for it in `Tuxedo Code Mobile.dc.html`'s embedded stylesheet, not invented ad hoc.
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

`.env` / `.env.local` hold real Contentful credentials **and** the `SMTP_*` credentials for the contact form's outgoing mailbox — never commit them or print their values (including in chat/tool output). `CONTENTFUL_REVALIDATE_SECRET` must match the `x-vercel-reval-key` header sent by the Vercel webhook; treat it, and `SMTP_TOKEN`, like a password.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
