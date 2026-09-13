// Runs as a `prebuild` step. Vercel sets VERCEL=1 for every build it runs
// (production and preview alike) — nothing to configure, it's automatic.
//
// The runtime gate in keystatic.config.ts (`showAdminUI`) already makes
// /keystatic and /api/keystatic/* 404 outside local dev, but that only stops
// the routes from being *reachable* — the route files are still compiled
// into the build. This script removes them from the filesystem before
// `next build` runs, so on Vercel they're never compiled or deployed at all.
// Vercel checks out a fresh copy of the repo per build, so deleting these
// locally-committed files here never touches the actual repo.
//
// Local `pnpm build` / `pnpm dev` are unaffected: VERCEL is unset outside
// Vercel's own build environment, so this is a no-op there.

const fs = require("fs");
const path = require("path");

if (!process.env.VERCEL) {
  process.exit(0);
}

const targets = [
  path.join(__dirname, "..", "app", "keystatic"),
  path.join(__dirname, "..", "app", "api", "keystatic"),
];

for (const target of targets) {
  if (fs.existsSync(target)) {
    fs.rmSync(target, { recursive: true, force: true });
    console.log(`[strip-keystatic-for-vercel] removed ${path.relative(process.cwd(), target)}`);
  }
}
