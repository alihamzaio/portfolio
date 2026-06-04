# Ali Hamza — Portfolio

A premium full-stack portfolio for **Ali Hamza**, Full Stack Software Engineer. Built with **Next.js**, **TypeScript**, **Tailwind CSS**, **Framer Motion**, **React Three Fiber**, and shadcn/ui-style components.

Includes a public marketing site and a **CMS-style admin dashboard** — edit profile, hero, experience, projects, skills, and CV without redeploying code.

**Live profile links**

- GitHub: [github.com/alihamzaio](https://github.com/alihamzaio)
- LinkedIn: [linkedin.com/in/alihamza-fullstack-developer](https://www.linkedin.com/in/alihamza-fullstack-developer)
- Email: hamzasarwer9@gmail.com

---

## Table of contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Quick start](#quick-start)
- [Environment variables](#environment-variables)
- [How the application works](#how-the-application-works)
- [Project structure](#project-structure)
- [Admin panel](#admin-panel)
- [Edit profile & contact (hero, links)](#edit-profile--contact-hero-links)
- [Manage experience (companies)](#manage-experience-companies)
- [Upload & manage your CV (resume)](#upload--manage-your-cv-resume)
- [Add & manage projects](#add--manage-projects)
- [Manage skills](#manage-skills)
- [API reference](#api-reference)
- [Customize static content](#customize-static-content)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

---

## Features

| Area | Description |
|------|-------------|
| **Public site** | Hero (3D), about + metrics, skills, projects with filters, experience timeline, contact |
| **Dynamic content** | Hero, contact, experience, and profile load from API after admin saves |
| **Projects** | Gallery at `/projects` and detail pages at `/projects/[slug]` |
| **Resume** | Active PDF: `Ali_Hamza_Full_Stack_Developer.pdf` via `/api/resume/download` |
| **Admin** | Email OTP login (Resend) — 7-day session in `localStorage` |
| **Admin CMS** | Profile, experience, projects, skills, resume — all editable |
| **REST API** | Settings, experience, projects, skills, resume, auth |
| **Storage** | Local JSON + `data/` auth store; optional Vercel KV / Upstash in production |

---

## Tech stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4, Inter font
- **Animation:** Framer Motion
- **3D:** React Three Fiber + Three.js (hero scene)
- **UI:** shadcn/ui-style components
- **Email:** Resend (admin OTP)
- **Analytics:** Vercel Analytics

---

## Prerequisites

- **Node.js** 18.17+ (20+ recommended)
- **npm**, **pnpm**, or **yarn**
- [Resend](https://resend.com) account (free tier) for admin OTP emails

---

## Quick start

### 1. Clone and install

```bash
git clone <your-repo-url>
cd portfolio
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
ADMIN_EMAIL=hamzasarwer9@gmail.com
RESEND_API_KEY=re_your_key_from_resend.com
RESEND_FROM_EMAIL=onboarding@resend.dev
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> **Admin login:** `/admin` → enter `hamzasarwer9@gmail.com` → **Send OTP** → enter 6-digit code. Session lasts **7 days**. Without `RESEND_API_KEY` in dev, OTP appears in the terminal as `[DEV OTP]`.

### 3. Run development server

```bash
npm run dev
```

| URL | Purpose |
|-----|---------|
| [http://localhost:3000](http://localhost:3000) | Public portfolio |
| [http://localhost:3000/admin](http://localhost:3000/admin) | Admin dashboard |

### 4. Production build

```bash
npm run build
npm run start
```

### 5. Lint

```bash
npm run lint
```

---

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `ADMIN_EMAIL` | **Yes** | Only this email can request OTP (`hamzasarwer9@gmail.com`) |
| `RESEND_API_KEY` | **Yes** (production) | Resend API key for OTP emails |
| `RESEND_FROM_EMAIL` | Recommended | Sender (`onboarding@resend.dev` for testing) |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Canonical URL for SEO / Open Graph |
| `ADMIN_TOKEN` | Optional | Legacy Bearer token for curl/scripts only |
| `KV_REST_API_URL` / `KV_REST_API_TOKEN` | Optional | Vercel KV for persistent JSON in production |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | Optional | Upstash alternative |

**Default GitHub username:** `alihamzaio` (set in `lib/site.ts` and `lib/settings.json`)

---

## How the application works

### High-level flow

```text
Visitor → Next.js pages → GET /api/settings + /api/experience (+ /api/projects)
                    ↘ fallback: lib/site.ts, lib/*.json

Admin   → /admin (OTP) → Bearer session token → PUT/POST/DELETE APIs
                    ↘ saves to lib/*.json (or KV) + public/resume/
                    ↘ public site refreshes and shows new content
```

### What is editable from admin vs code

| Content | Admin tab | Storage | Also in code (fallback) |
|---------|-----------|---------|-------------------------|
| Name, tagline, headline, bio, email, phone, location, links | **Profile & Hero** | `lib/settings.json` | `lib/site.ts` |
| Work history (companies) | **Experience** | `lib/experience.json` | `lib/experience.ts` |
| Project gallery + featured filter | **Projects** | `lib/projects.json` | — |
| Skill badges (API list) | **Skills** | `lib/skill.json` | — |
| Active CV PDF | **Resume** | `public/resume/` + `active.json` | — |
| Homepage skill categories (grid) | — | — | `lib/skills-data.ts` |
| Featured case study copy (4 cards) | — | — | `lib/featured-projects.ts` |
| Engineering metrics (about) | — | — | `lib/site.ts` |

After **Save & publish** in admin, refresh the homepage to see profile and experience updates.

**Download Resume** uses `GET /api/resume/download` → active file in `public/resume/active.json` (default: `Ali_Hamza_Full_Stack_Developer.pdf`).

---

## Project structure

```text
portfolio/
├── app/
│   ├── (site)/                 # Public pages
│   ├── admin/                  # Admin dashboard
│   └── api/
│       ├── auth/               # OTP send, verify, session
│       ├── settings/           # Profile & contact (GET public, PUT admin)
│       ├── experience/         # Work history CRUD
│       ├── projects/
│       ├── skills/
│       └── resume/
├── components/
│   ├── admin/                  # Admin shell, login
│   ├── home/                   # Homepage sections
│   ├── layout/                 # Header, footer, dock
│   ├── providers/              # Site content + app providers
│   └── effects/                # 3D hero, cursor, loading
├── lib/
│   ├── site.ts                 # Defaults, nav, metrics
│   ├── settings.json           # Editable profile (admin)
│   ├── experience.json         # Editable jobs (admin)
│   ├── projects.json
│   ├── skill.json
│   ├── featured-projects.ts
│   ├── skills-data.ts
│   ├── content.ts              # Server read helpers
│   └── store.ts                # KV or filesystem
├── public/resume/              # PDFs + active.json
├── data/                       # OTP & sessions (gitignored)
├── .env.example
└── README.md
```

---

## Admin panel

### Access (email OTP)

1. `npm run dev`
2. Open [/admin](http://localhost:3000/admin)
3. Email: `hamzasarwer9@gmail.com` (must match `ADMIN_EMAIL`)
4. **Send OTP** → check inbox or terminal (`[DEV OTP]`)
5. **Verify & sign in** — session stored 7 days in `localStorage` (`admin_session`)

### Resend setup (free)

1. [resend.com](https://resend.com) → API key → `RESEND_API_KEY`
2. Testing: `RESEND_FROM_EMAIL=onboarding@resend.dev`

### Admin tabs

| Tab | What you can edit |
|-----|-------------------|
| **Overview** | Quick stats + shortcuts |
| **Profile & Hero** | Name, title, tagline, headline, about text, email, phone, location, education, GitHub username/URL, LinkedIn, availability |
| **Experience** | Add/edit/remove companies — role, dates, location, description, achievements, tech stack |
| **Projects** | Title, description, tags, image URL, demo/GitHub links, **featured** toggle |
| **Skills** | Name, level (0–100), icon URL |
| **Resume** | Upload PDF, set active, delete |

---

## Edit profile & contact (hero, links)

1. `/admin` → **Profile & Hero**
2. Edit fields:

| Field | Shows on site |
|-------|----------------|
| Full name | Header, hero, footer |
| Job title | Hero |
| Hero tagline | Line under name in hero |
| Hero headline | Main hero paragraph |
| About summary | About section |
| Email, phone, location | Contact + footer |
| GitHub username | Contact (`alihamzaio`) — auto-updates GitHub URL |
| GitHub / LinkedIn URLs | Hero buttons, contact, footer |
| Available for work | Badge on hero & contact |

3. Click **Save & publish**
4. Refresh homepage

**Default GitHub:** `https://github.com/alihamzaio`

---

## Manage experience (companies)

1. `/admin` → **Experience**
2. **Add company** or edit existing (Birxment, Exec9, Explore Logics)
3. Fields: role, company, period, location, description, achievements (one per line), technologies (comma-separated)
4. **Save experience** per card
5. **Remove** to delete

Changes appear in the **Experience** section on the homepage immediately after refresh.

### Experience API

```bash
# List (public)
curl http://localhost:3000/api/experience

# Create (admin session token)
curl -X POST http://localhost:3000/api/experience \
  -H "Authorization: Bearer YOUR_SESSION_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"role\":\"Engineer\",\"company\":\"Acme\",\"period\":\"2024 — Present\",\"location\":\"Remote\",\"description\":\"...\",\"achievements\":[\"...\"],\"technologies\":[\"Node.js\"]}"
```

```bash
# Update
curl -X PUT http://localhost:3000/api/experience/birxment \
  -H "Authorization: Bearer YOUR_SESSION_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"role\":\"Senior Engineer\"}"

# Delete
curl -X DELETE http://localhost:3000/api/experience/birxment \
  -H "Authorization: Bearer YOUR_SESSION_TOKEN"
```

---

## Upload & manage your CV (resume)

### Admin UI (recommended)

1. `/admin` → **Resume**
2. Upload `.pdf` (e.g. `Ali_Hamza_Full_Stack_Developer.pdf`)
3. **Set active**
4. Test: [http://localhost:3000/api/resume/download](http://localhost:3000/api/resume/download)

### Manual

1. Place PDF in `public/resume/`
2. Set `public/resume/active.json`:

```json
{
  "active": "Ali_Hamza_Full_Stack_Developer.pdf"
}
```

### API

Use `Authorization: Bearer <session_token>` from OTP login (or optional `ADMIN_TOKEN`).

```bash
curl -X POST http://localhost:3000/api/resume \
  -H "Authorization: Bearer YOUR_SESSION_TOKEN" \
  -F "file=@./Ali_Hamza_Full_Stack_Developer.pdf"
```

```bash
curl -X PUT http://localhost:3000/api/resume \
  -H "Authorization: Bearer YOUR_SESSION_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"active\": \"Ali_Hamza_Full_Stack_Developer.pdf\"}"
```

---

## Add & manage projects

### Homepage vs gallery

1. **Work section (homepage)** — Loads from `/api/projects` with **Featured** filter; mark projects as featured in admin.
2. **Featured case studies** — Default copy in `lib/featured-projects.ts` (Verana, HealOps, UniLabs, Senzi) when no featured API projects.
3. **Full gallery** — `/projects` from `lib/projects.json`.

### Admin UI

1. `/admin` → **Projects** → **Add**
2. Fill: title, description, tags, image URL, demo URL, GitHub URL
3. Toggle **Featured** for homepage
4. **Save project**

| Field | Description |
|-------|-------------|
| Title | Required |
| Description | Card summary |
| Tags | Comma-separated |
| Image URL | Cloudinary, etc. |
| Live / GitHub | Demo and repo links |
| Featured | Shows in homepage **Featured** filter |

---

## Manage skills

1. `/admin` → **Skills** → **Add**
2. Name, level (0–100), optional icon URL
3. **Save**

Homepage skill **categories** grid is still defined in `lib/skills-data.ts` (edit in code if needed).

---

## API reference

Base URL: `http://localhost:3000`

### Authentication

Protected routes:

```http
Authorization: Bearer <session_token>
```

Get `session_token` from `POST /api/auth/verify-otp`, or use optional `ADMIN_TOKEN` for scripts.

### Auth — OTP

| Method | Auth | Description |
|--------|------|-------------|
| `POST /api/auth/send-otp` | No | `{ "email": "hamzasarwer9@gmail.com" }` |
| `POST /api/auth/verify-otp` | No | `{ "email", "code" }` → `{ token, expiresAt }` |
| `GET /api/auth/session` | Bearer | Validate session |
| `DELETE /api/auth/session` | Bearer | Logout |

### Settings — `/api/settings`

| Method | Auth | Description |
|--------|------|-------------|
| `GET` | No | Public profile (name, headline, social, etc.) |
| `PUT` | Yes | Update all profile fields |

**PUT body (all optional):** `name`, `title`, `tagline`, `headline`, `description`, `email`, `phone`, `location`, `education`, `available`, `githubUsername`, `social: { github, linkedin, email }`

### Experience — `/api/experience`

| Method | Auth | Description |
|--------|------|-------------|
| `GET` | No | List all jobs |
| `POST` | Yes | Add job |

### Experience by ID — `/api/experience/[id]`

| Method | Auth | Description |
|--------|------|-------------|
| `GET` | No | Single job |
| `PUT` | Yes | Update job |
| `DELETE` | Yes | Delete job |

### Resume — `/api/resume`

| Method | Auth | Description |
|--------|------|-------------|
| `GET` | No | List PDFs + active |
| `POST` | Yes | Upload PDF |
| `PUT` | Yes | Set active `{ "active": "file.pdf" }` |
| `DELETE` | Yes | `?name=file.pdf` |

### Resume download — `/api/resume/download`

| Method | Auth | Description |
|--------|------|-------------|
| `GET` | No | Download active PDF |

### Projects — `/api/projects` and `/api/projects/[id]`

| Endpoint | GET | POST | PUT | DELETE |
|----------|-----|------|-----|--------|
| `/api/projects` | List | Create | — | — |
| `/api/projects/[id]` | One | — | Update | Delete |

POST supports `featured: true` for homepage.

### Skills — `/api/skills` and `/api/skills/[name]`

Standard CRUD (same as before).

### HTTP status codes

| Code | Meaning |
|------|---------|
| `200` | OK |
| `201` | Created |
| `400` | Bad request |
| `401` | Unauthorized |
| `403` | Wrong admin email (OTP) |
| `404` | Not found |
| `429` | Too many OTP requests |

---

## Customize static content

Edit in code when not managed in admin:

| File | Purpose |
|------|---------|
| `lib/site.ts` | Default profile, nav, engineering metrics |
| `lib/skills-data.ts` | Homepage skill category grid |
| `lib/featured-projects.ts` | Featured case study cards (fallback) |
| `lib/seo.ts` | Per-page metadata, keywords, canonical URLs |
| `lib/seo-structured.ts` | JSON-LD (Person, WebSite, projects, breadcrumbs) |
| `app/layout.tsx` | Root SEO + global structured data |
| `app/opengraph-image.tsx` | Auto-generated 1200×630 social preview |

**GitHub username default:** `alihamzaio` in `lib/site.ts` and `lib/settings.json`.

Add image hosts in `next.config.mjs` → `images.remotePatterns`.

---

## SEO & Google indexing

Technical SEO is built in:

| Feature | Location |
|---------|----------|
| Meta title, description, keywords | `lib/seo.ts` + each `app/(site)/**/page.tsx` |
| Canonical URLs & Open Graph | `buildPageMetadata()` |
| Dynamic OG image (1200×630) | `app/opengraph-image.tsx` |
| JSON-LD structured data | `lib/seo-structured.ts`, `components/structured-data.tsx` |
| `sitemap.xml` | `app/sitemap.ts` |
| `robots.txt` | `app/robots.ts` (blocks `/admin`, `/api/`) |
| Web manifest | `app/manifest.ts` |

**After deploy:**

1. Set `NEXT_PUBLIC_SITE_URL` to your live domain (required for canonicals and sitemap).
2. [Google Search Console](https://search.google.com/search-console) → add property → verify with `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` in Vercel env.
3. Submit sitemap: `https://your-domain.com/sitemap.xml`
4. Optional: [Bing Webmaster Tools](https://www.bing.com/webmasters) with `NEXT_PUBLIC_BING_SITE_VERIFICATION`.

Ranking also depends on backlinks, content freshness, and competition — keep LinkedIn/GitHub bios linking to the portfolio URL.

---

## Deployment

### Vercel (recommended)

1. Push to GitHub ([github.com/alihamzaio](https://github.com/alihamzaio))
2. Import on [Vercel](https://vercel.com)
3. Environment variables:
   - `ADMIN_EMAIL`
   - `RESEND_API_KEY`
   - `RESEND_FROM_EMAIL`
   - `NEXT_PUBLIC_SITE_URL`
   - Optional: Vercel KV for `projects`, `skills`, `settings`, `experience`
4. Deploy

### Production storage

| Data | Recommendation |
|------|----------------|
| Settings, experience, projects, skills | **Vercel KV** or Upstash |
| Resume PDFs | Commit `public/resume/` + `active.json` to git |
| OTP sessions | `data/` folder (ephemeral on serverless — users re-login via OTP) |

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Admin OTP not received | Set `RESEND_API_KEY`; dev: check terminal `[DEV OTP]` |
| `403` on OTP | Email must match `ADMIN_EMAIL` |
| `401` on save | Re-login at `/admin` |
| Profile changes not visible | Click **Save & publish**, hard-refresh homepage |
| Download Resume 404 | Upload PDF + set active in Admin → Resume |
| GitHub links wrong | Admin → Profile → set username `alihamzaio` + save |
| Projects not persisting on Vercel | Enable KV/Upstash env vars |
| Images broken | Add CDN host to `next.config.mjs` |

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Production server |
| `npm run lint` | ESLint |

---

## License

Private portfolio — © Ali Hamza. All rights reserved.

---

**Author:** Ali Hamza · Full Stack Software Engineer  
**Contact:** [hamzasarwer9@gmail.com](mailto:hamzasarwer9@gmail.com) · [GitHub — alihamzaio](https://github.com/alihamzaio) · [LinkedIn](https://www.linkedin.com/in/alihamza-fullstack-developer)
