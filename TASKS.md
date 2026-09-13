# Tasks

This document describes future plans and tasks for this website.

## Marketing

### Business strategy

- Figure out how to outline the business strategy
- Identify areas, which could be interesting for the businesses
- Figure out how to communicate who are my target auditory
- Createa an outline of business-propositions

### Copywrite

- Improve copy with consistent language ("we" vs "us")
- Figure out how to communicate the business strategy
- Blog posts

## Technical

### "Book a call"

Funciton to book a call with me using calendar

### Drop Contentful

- Done: Contentful client/codegen/import script and the draft/revalidate API routes are deleted, `@keystatic/core` + `app/keystatic/` are in, `lib/api.ts` is fully wired to Keystatic's Reader API, and `AGENTS.md` documents the current (Keystatic) architecture.
- Remaining: `content/customers/` has no YAML entries yet even though the 9 customer logo assets are already migrated under `public/images/customers/` — the homepage customer-logo band silently renders nothing until these are backfilled (see `clients/mapping.json` for the source name/website/logo data).

### WCAG

- Accessibility

### SEO & discoverability

- No `app/sitemap.ts` or `app/robots.ts` exist yet — add them so pages/posts are crawlable.
- Root layout only sets a single site-wide `title`/`description` (`app/layout.tsx`) — no `metadataBase`, no per-page metadata (about/services/blog/contact/post pages all inherit the same title), and no Open Graph/Twitter card images.
- No structured data (JSON-LD `Organization`/`LocalBusiness`) — worth adding given the CVR/company-registration info is already in the footer.
- Decide on canonical domain once live and set `metadataBase` accordingly.

### Legal & compliance

- No privacy policy page yet, despite the contact form collecting and emailing name/email/message — needed for GDPR since the company (Tuxedo Code ApS, Denmark) is subject to it.
- No cookie policy/consent banner — needed if analytics or any non-essential cookies are added (currently none are, so this can wait until analytics is decided).
- Footer already shows company name, CVR, and email (`app/footer.tsx`) — confirm this satisfies Danish web-disclosure requirements, or add a registered address if required.
- No terms of service — decide if needed for a services/consulting business.

### Analytics & monitoring

- No analytics tool wired in (checked `package.json` — nothing like Vercel Analytics/Plausible/PostHog installed) — decide on one and add it.
- No error tracking (e.g. Sentry) for the contact form or general runtime errors.
- No uptime/monitoring on the deployed site.

### Reliability

- No custom `not-found.tsx` or `error.tsx` in `app/` — currently falls back to Next.js defaults.
- No CI workflow (only `.github/copilot-instructions.md`, no actual GitHub Actions) — at minimum run `pnpm build` on PRs.
- Confirm SPF/DKIM/DMARC are set up for `tuxedocode.dk` so contact-form mail sent via the Proton SMTP relay (`lib/mailer.ts`) reliably avoids spam filters.
