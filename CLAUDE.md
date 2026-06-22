# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture

This is a plain HTML/CSS/JS static site (no framework, no build step) for simonbernard.ca, a one-page magician site, hosted on GitHub Pages.

- `index.html`, `styles.css`, `script.js` — the site itself, served as-is.
- `worker/contact.js` — a Cloudflare Worker that receives the contact form POST and sends the email via the Resend API. GitHub Pages can't run server code, so the form's backend lives here instead, deployed separately to Cloudflare.
- `worker/wrangler.toml` — Worker deploy config.
- `script.js`'s `WORKER_URL` and `worker/contact.js`'s `ALLOWED_ORIGIN` must be kept in sync with the actual deployed Worker URL and GitHub Pages origin.
- `RESEND_API_KEY` is a Cloudflare Worker secret (set via `wrangler secret put`), not a build-time env var — `.env.local` only exists for local reference.

See README.md for deployment steps for both the static site and the Worker.

## Previous implementation

Earlier versions of this repo (commits `3a1eb3e`, `c43a143`, `be5f20f`) were a Next.js (App Router/TypeScript) app with the same content. It was scrapped in favor of a plain static site since the site has no need for a framework.
