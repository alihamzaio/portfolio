# Next.js Ship Starter

A minimal **Next.js App Router** kit for shipping a client or freelance site without fighting Create Next App defaults.

## Quick start

```bash
npm install
cp env.example .env.local
npm run dev
```

Open http://localhost:3000

## What you get

- TypeScript + App Router
- `lib/site.ts` + `lib/seo.ts` for titles, descriptions, canonical URLs
- Home page with hero + CTA
- Contact section (mailto fallback; wire your own API later)
- `app/sitemap.ts` stub
- `LAUNCH.md` production checklist

## Deploy to Vercel

1. Push to GitHub (or import the folder)
2. Set `NEXT_PUBLIC_SITE_URL` to your production URL
3. Deploy

## Brand it

Edit `lib/site.ts`, then replace copy on `app/page.tsx`.

## License

Personal / commercial use for buyers of this starter. Do not resell the template as-is.
