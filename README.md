# VisionHelm

An editable, editorial website for an independent creative and technology studio. Built with Next.js App Router, TypeScript, Tailwind CSS, GSAP, Manrope, and Instrument Serif.

## Run locally

Requires Node 20.9 or later (Node 24 recommended).

```sh
npm install
npm run dev
```

Open http://127.0.0.1:3000. The website editor is at http://127.0.0.1:3000/edit.

A local `.env.local` has been created with a randomly generated `EDITOR_PASSWORD`. Open that file to copy your password; it is ignored by Git. To configure a fresh checkout, copy `.env.example` to `.env.local` and set a password of at least 20 characters. Restart the server after changing environment values.

Your public contact address and inquiry recipient are set to **connect.visionhelm@gmail.com** through `CONTACT_TO_EMAIL` in `.env.local`. Change that one value and restart the development server to update the email across the website. It takes precedence over the editor’s public email field. Email links work without API keys. You do not need to fill in Netlify credentials or a storage setting to edit the site locally. Automatic form delivery is a separate, optional connection; an inbox address alone cannot authorize a service to send emails.

## Edit without touching code

1. Open `/edit` and enter your editor password.
2. Choose Homepage, Projects, Services, The studio, Brand & colors, or Legal details.
3. Change content using the labeled fields. Upload JPEG, PNG, or WebP images (8 MB maximum); the server optimizes images and strips metadata.
4. Use **Live preview** to see your homepage draft in desktop or mobile widths.
5. Choose **Save changes** to apply your draft to every relevant page.

Arrays support adding, removing, and reordering projects, services, FAQs, gallery images, and team members. Project and service slugs must be unique. Capability links must refer to existing service slugs. Changing a slug changes its URL; add a host-level redirect if an old address has been shared.

In **The studio**, the About composition has its own **Image**, **Image description**, **Belief heading**, and **Belief** fields. Its photograph can be changed independently of the homepage hero. The overlapping layout adjusts automatically on mobile.

**Export backup** downloads the full content and theme as JSON. **Import backup** loads that file as a draft; preview it before saving. Uploaded images are not embedded in JSON backups: retain `.editor-data/media` on file hosting, or the media Blob store on Netlify. Uploads are stored immediately, but an upload is not attached to the public page until its content draft is saved. Temporary drafts are in memory; export or save before leaving. The browser warns before closing an unsaved editor tab. Conflicting revisions return an error rather than silently replacing a newer saved revision; this is an optimistic check, not a distributed transactional lock.

The homepage live preview responds to copy, imagery, and theme edits. Header/footer changes and internal-page changes appear after saving. Preview navigation leads to the saved versions of internal pages.

When a browser supports WebMCP’s document registry, the authenticated editor also exposes `get_website_draft` and `stage_website_content`. These use the same draft state and validation as the interface; staging does not save or publish. Unsupported browsers use the normal editor. No native WebMCP-enabled browser was available for end-to-end validation.

## Content and assets

- `src/content/site.json`: central source for copy, theme, services, projects, team, contact links, and legal details.
- `src/lib/content-schema.ts`: validated content structure.
- `src/components/home-view.tsx`: homepage composition, also used in the live editor preview.
- `src/app/globals.css`: spacing, layouts, design tokens, and responsive styles.
- `public/logos/mark-provisional.svg`: **provisional vector interpretation**, not the original logo vector. The same replaceable path is used in `src/components/brand.tsx` and `src/app/icon.svg`.
- `public/images`: original AI-created architectural imagery and optimized JPEG copies. The images are illustrative, not photographs of clients’ projects. Original user reference images remain untouched at the repository root.

No invented testimonials, awards, performance metrics, team members, office addresses, or telephone numbers are included. Concept and internal projects are labeled. Only add verified outcomes to approved client projects. Do not add confidential project names or identifying details.

## Storage

### Local or a persistent Node server

Local development automatically saves to files; no storage setting is needed in `.env.local`. Saving atomically replaces `src/content/site.json`; the previous revision is retained at `.editor-data/site.previous.json`. Uploaded media lives at `.editor-data/media/` and is served through `/api/media/[id]`. Back up both the JSON and media directory. For a production Node server with a persistent writable filesystem, explicitly set `CONTENT_STORAGE=file`. This adapter is not durable on ephemeral/serverless hosts.

### Netlify

The repository includes `netlify.toml` for Netlify’s Next.js integration. Connect the repository to a Netlify site, use `npm run build`, and configure:

```text
NEXT_PUBLIC_SITE_URL=https://your-real-domain.example
EDITOR_PASSWORD=a-long-random-secret-at-least-20-characters
```

`netlify.toml` already selects hosted storage with `CONTENT_STORAGE=netlify`. Netlify normally supplies Blob storage credentials automatically. Leave `NETLIFY_SITE_ID` and `NETLIFY_AUTH_TOKEN` unset unless a deployed preview reports a missing Blob environment. Only for that advanced fallback, supply the actual site ID and a server-only token with access to it. Never prefix those secrets with `NEXT_PUBLIC_`.

The server uses site-scoped, strongly consistent Netlify Blobs for saved content and images. Preview deployments use separate `preview` stores so they do not overwrite production content. Multiple previews share that preview store. The initial bundled JSON is used until content is first saved. The Netlify adapter is implemented but has not been tested against a real account; verify saving and uploads in a deployed preview before public launch. Other hosting providers need an equivalent durable storage adapter or a persistent Node filesystem.

Do not expose `/edit` publicly without a strong configured password and HTTPS. Sessions use a signed, HTTP-only cookie with an eight-hour expiry. Password changes revoke existing sessions. State-changing endpoints enforce same-origin requests. Login/upload/contact limits are bounded and per process; use provider-level or distributed rate limiting when traffic warrants it.

## Contact delivery

The form uses React Hook Form and Zod on the client, with independent server validation, honeypot protection, and basic per-instance rate limiting. The endpoint does not log inquiry contents.

Configure a Resend account and verified sending domain:

```text
RESEND_API_KEY=your-server-only-api-key
CONTACT_FROM_EMAIL=VisionHelm <website@your-real-domain.example>
CONTACT_TO_EMAIL=connect.visionhelm@gmail.com
```

`CONTACT_TO_EMAIL` controls both the public email address and the private delivery recipient. While it is set, the editor displays the email as managed by the environment. If this variable is removed, the public address falls back to **Brand & colors** in the editor, but automatic delivery requires a configured recipient.

The recipient is already configured. `RESEND_API_KEY` must be issued by your Resend account, and `CONTACT_FROM_EMAIL` must use a sender Resend permits; a Gmail address can receive these inquiries but cannot be used as your own verified Resend sending domain. These two optional settings are documented here rather than included as confusing empty entries in the basic environment template.

Until delivery is connected, the page offers a direct email link and clearly states that online form submissions will be available soon. The send button is disabled and the API returns 503, never a fake success. With credentials, success is shown only when Resend returns an accepted message ID. Provider acceptance is not proof of inbox delivery; verify delivery and configure domain authentication before launch. No real delivery credentials were available during development.

## Routes

`/`, `/about`, `/services`, `/services/[slug]`, `/work`, `/work/[slug]`, `/process`, `/contact`, `/privacy`, `/terms`, `/edit`, and an authenticated `/edit/preview`. Unknown project/service URLs return a custom 404. Metadata, canonical links, robots, sitemap, and verified-only organization JSON-LD are included. The editor and draft preview are marked noindex and excluded from robots.

## Verify

```sh
npm run typecheck
npm run lint
npm run build
npx playwright install chromium
# Keep npm run dev running in a second terminal, then:
npm test
```

Browser checks cover public routes, 404s, metadata, images, 320px phones through desktop layouts, light/dark device preferences, landscape menus, rotation while a menu is open, touch forms, 200% zoom, editor previews, unconfigured email behavior, unauthorized editor access, authenticated persistence, stale revisions, image uploads, and rejection of SVG uploads. Editor tests restore original content after saving a temporary headline. Screenshots are written to ignored `test-results/`.

With the development server running, `node tests/responsive-audit.mjs` checks every public page at 17 widths from 320 to 1920px, plus short landscape screens and all editor sections with previews. It reports horizontal overflow, heading clipping, overlapping controls, and clipped website previews, saving its report and screenshots under `test-results/responsive/`. Set `PLAYWRIGHT_CHROMIUM_EXECUTABLE` to reuse an installed Chromium browser if needed. Repeated editor test runs can reach the login attempt limit; restart the local development server before another full run rather than relaxing authentication protections.

## Before public launch

- Confirm the canonical domain, public email, social links, business identity, jurisdiction, and legal effective date. Review draft privacy/terms for your business and hosting setup.
- Replace the provisional logo with approved vector assets.
- Confirm public project URLs, delivered scope, approved screenshots, and any outcomes before expanding real case studies. Keep confidential work anonymous.
- Masabgroup and Baseera’s World are included based on the owner’s supplied URLs and confirmation of creative direction, theme selection, and website work. Their thumbnails are screenshots of public homepages. Internal systems, credentials, private routes, and confidential project identities are excluded. The additional architectural imagery belongs only to clearly labeled studio concepts.
- Configure and test real email delivery and hosted content/media storage.
- Measure Lighthouse and Core Web Vitals on the deployed site. Scores and targets are not claimed as verified results.

The site is built locally; a public deployment requires a hosting account and the configuration above.

The production dependency audit reports no vulnerabilities. The full audit currently reports five related high-severity findings in development-only lint dependencies (`eslint-config-next` → `fast-glob` → `micromatch` → `braces`). No patched upstream `braces` release was available at the time of the check; these packages are not used by the running website.
