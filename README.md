# ⋈ Tuxedo Code

Professional software development company website built with Next.js and Keystatic CMS.

## Tech Stack

- **Framework:** Next.js with App Router
- **CMS:** Keystatic (git-native, file-based)
- **Styling:** Tailwind CSS
- **Deployment:** Vercel
- **Package Manager:** pnpm

## Development

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build
```

The website will be available at [http://localhost:3000](http://localhost:3000).

## Editing content

Content (blog posts and customer logos) lives as files in this repo under `content/` and `public/images/`, edited through Keystatic's admin UI — not through any hosted CMS dashboard.

1. Run `pnpm dev`.
2. Open [http://localhost:3000/keystatic](http://localhost:3000/keystatic) in your browser.
3. Add or edit a **Blog Post** or **Customer** entry through the UI (including uploading images) and save — this writes the change straight to files on disk (`content/posts/...`, `content/customers/...`, `public/images/...`).
4. Review the change like any other code change: `git status` / `git diff` to see what files were written, then `git add`, commit, and push.
5. Pushing to the deployed branch is what publishes the change — Vercel rebuilds the site from whatever's committed. There's no separate "publish" button and no webhook to wait on.

**The admin UI only exists locally** — `/keystatic` is not available on the deployed site at all (see [AGENTS.md](./AGENTS.md) for how that's enforced). To edit content you always run `pnpm dev` on your own machine first.

## Features

- 📝 Company blog and insights
- 🖼️ Professional content presentation
- 🔄 Content management via Keystatic (`/keystatic` in local dev)
- 📱 Responsive design
- ⚡ Optimized performance
