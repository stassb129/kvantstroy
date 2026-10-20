# Deployment

The same commit deploys to both **Vercel** (unchanged, zero config) and **Coolify / Docker** (via `Dockerfile`).

## How the project is built

- Next.js 14.2 (App Router), React 18, TypeScript, Tailwind CSS. Package manager: **npm** (`package-lock.json`).
- All pages (`/`, `/services`, `/portfolio`, `/prices`, `/technologies`) are statically prerendered at build time.
  Server routes: `GET /api/health`, `POST /api/lead` (email via SMTP).
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

See `.env.example`. Nothing is required at **build** time. Lead email needs SMTP at **runtime**.

| Variable                  | When    | Required | Default / notes                                      |
| ------------------------- | ------- | -------- | ---------------------------------------------------- |
| `PORT`                    | runtime | no       | `3000`                                               |
| `HOSTNAME`                | runtime | no       | `0.0.0.0`                                            |
| `NEXT_TELEMETRY_DISABLED` | both    | no       | `1`                                                  |
| `LEAD_TO_EMAIL`           | runtime | no       | Dev → `stassb129@gmail.com`; prod → `site.email`     |
| `SMTP_HOST`               | runtime | for leads | e.g. `smtp.gmail.com`                               |
| `SMTP_PORT`               | runtime | no       | `465`                                                |
| `SMTP_SECURE`             | runtime | no       | `true` when port is 465                              |
| `SMTP_USER`               | runtime | for leads | SMTP login                                          |
| `SMTP_PASS`               | runtime | for leads | SMTP password / Gmail App Password (**secret**)     |
| `SMTP_FROM`               | runtime | no       | defaults to `SMTP_USER`                              |

There are no `NEXT_PUBLIC_*` variables.

## Persistent storage

None. The app writes nothing to disk except Next's image-optimizer cache in `.next/cache`, which is disposable.
No volume is needed.

## External services

- Stock/service images are served from `public/images/stock/` and portfolio from `public/portfolio/`.
- Lead form: `POST /api/lead` sends email over SMTP (`nodemailer`). Configure SMTP in Coolify / Vercel env.
- No database, auth, CRM or analytics.

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
| Environment variables  | SMTP_* (+ optional LEAD_TO_EMAIL)         |
| Persistent storage     | none                                      |

Coolify's proxy handles domains and TLS. No nginx/Caddy/compose is needed for this app.

## Vercel-specific features

None found: no `vercel.json`, no `@vercel/*` packages, no `VERCEL_*` variables, no Edge runtime, no `*.vercel.app` URLs.
`output: 'standalone'` is ignored by Vercel.

## Manual steps

1. Point the domain's DNS `A` record to the VPS.
2. Create the Coolify application with the settings above and deploy.
3. Set SMTP env vars (and optionally `LEAD_TO_EMAIL=kvant.stroi.msk@gmail.com`) in Coolify / Vercel.
   For Gmail: enable 2FA → create an [App Password](https://myaccount.google.com/apppasswords) → use it as `SMTP_PASS`.
4. Locally: copy `.env.example` → `.env.local`, set `SMTP_USER` / `SMTP_PASS`. Without SMTP the form returns 503.
