# simonbernard.ca

A static one-page site for Simon Bernard, magicien, hosted on GitHub Pages. Plain HTML/CSS/JS — no build step.

## Local development

Open `index.html` directly in a browser, or serve the directory with any static file server, e.g.:

```bash
npx serve .
```

## Contact form

The contact form posts to a Cloudflare Worker (`worker/contact.js`), which sends the message via the [Resend](https://resend.com) API. GitHub Pages can't run server-side code, so the email-sending logic lives in the Worker instead.

The form is also protected by [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/). Before submitting, the page calls a separate managed siteverify Worker (`SITEVERIFY_URL` in `script.js`) to validate the Turnstile token; the submit button stays disabled until Turnstile passes and the required fields are filled. That siteverify Worker isn't part of this repo — it's deployed independently.

### Deploying the worker

1. Install [wrangler](https://developers.cloudflare.com/workers/wrangler/) and log in:

   ```bash
   npm install -g wrangler
   wrangler login
   ```

2. Set the Resend API key as a secret (from `worker/`):

   ```bash
   cd worker
   wrangler secret put RESEND_API_KEY
   ```

3. Deploy:

   ```bash
   wrangler deploy
   ```

4. Update `WORKER_URL` in `script.js` to match the deployed Worker URL, and `ALLOWED_ORIGIN` in `worker/contact.js` to match the GitHub Pages origin.

Note: the `from` address in `worker/contact.js` (`contact@contact.simonbernard.ca`) must be on a domain verified in your Resend account, or sending will fail.

## Deploying to GitHub Pages

In the repo settings, under **Pages**, set the source to "Deploy from a branch" and select the `main` branch with the root (`/`) folder. The site is served at the custom domain in `CNAME` (`simonbernard.ca`), which must also be configured as a DNS record pointing at GitHub Pages.
