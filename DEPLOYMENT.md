# Deployment

The same commit deploys to both **Vercel** (unchanged, zero config) and **Coolify / Docker** (via `Dockerfile`).

## How the project is built

- Next.js 14.2 (App Router), React 18, TypeScript, Tailwind CSS. Package manager: **npm** (`package-lock.json`).
- All pages (`/`, `/services`, `/portfolio`, `/prices`, `/technologies`) are statically prerendered at build time.
  The only server route is `GET /api/health`.
- `next.config.mjs` uses `output: 'standalone'`. `npm run build` runs `next build`, then the `postbuild` script
  copies `public/` and `.next/static/` into `.next/standalone/`. `npm run start` runs `node .next/standalone/server.js`.
- `sharp` is a dependency so `next/image` optimization works in standalone mode (Vercel uses its own optimizer).
- Fonts (`next/font/google`, Montserrat) are downloaded **at build time**, so the build machine needs internet access.
  Nothing is fetched from Google at runtime.

## Docker

```bash
docker build -t kvantstroy .
docker run --rm -p 3000:3000 kvantstroy
# http://localhost:3000
# http://localhost:3000/api/health  ->  {"status":"ok"}
```

- Base image: `node:24-alpine`, multi-stage (deps → builder → runner), runs as non-root user `nextjs`.
- Container listens on `0.0.0.0:$PORT`, `PORT` defaults to **3000**.
- Start command: `node server.js`.
- The image has a built-in `HEALTHCHECK` against `/api/health`.

## Environment variables

The application code reads **no custom environment variables**. Nothing is required at build time or runtime.
See `.env.example`.

| Variable                  | When    | Required | Default   |
| ------------------------- | ------- | -------- | --------- |
| `PORT`                    | runtime | no       | `3000`    |
| `HOSTNAME`                | runtime | no       | `0.0.0.0` |
| `NEXT_TELEMETRY_DISABLED` | both    | no       | `1`       |

There are no `NEXT_PUBLIC_*` variables and no secrets.

## Persistent storage

None. The app writes nothing to disk except Next's image-optimizer cache in `.next/cache`, which is disposable.
No volume is needed.

## External services

- Images on `/`, `/services`, `/portfolio`, `/technologies` are loaded **by the browser** directly from
  `images.unsplash.com` (plain `<img>`, not proxied through the server).
- No database, auth, CRM, email or analytics. The lead form (`components/LeadModal.tsx`) currently only logs to the
  browser console.

## Coolify settings

| Setting                | Value                                     |
| ---------------------- | ----------------------------------------- |
| Source                 | GitHub repository `stassb129/kvantstroy`  |
| Branch                 | your production branch                    |
| Build Pack             | Dockerfile                                |
| Dockerfile location    | `/Dockerfile`                             |
| Base directory         | `/`                                       |
| Ports Exposes          | `3000`                                    |
| Port mappings          | leave empty (Coolify proxy routes traffic) |
| Domains                | your domain, e.g. `https://example.ru`    |
| Health check path      | `/api/health` (port `3000`)               |
| Environment variables  | none required                             |
| Persistent storage     | none                                      |

Coolify's proxy handles domains and TLS. No nginx/Caddy/compose is needed for this app.

## Vercel-specific features

None found: no `vercel.json`, no `@vercel/*` packages, no `VERCEL_*` variables, no Edge runtime, no `*.vercel.app` URLs.
`output: 'standalone'` is ignored by Vercel.

## Manual steps

1. Point the domain's DNS `A` record to the VPS.
2. Create the Coolify application with the settings above and deploy.
3. If you later add `metadataBase`/canonical URLs, a sitemap, or a backend for the lead form, add the corresponding
   variables (e.g. `NEXT_PUBLIC_SITE_URL`, which is needed at **build** time) both in Vercel and in Coolify.
