# Launch checklist

Use before every production deploy.

## Env

- [ ] `NEXT_PUBLIC_SITE_URL` is the real public URL
- [ ] No secrets in `NEXT_PUBLIC_*`
- [ ] Preview and Production env scopes filled in Vercel

## Build

- [ ] `npm run build` passes locally
- [ ] Contact / CTA links work on mobile

## SEO

- [ ] Title and description set per main page
- [ ] `/sitemap.xml` resolves
- [ ] OG share preview looks correct

## After deploy

- [ ] Open Production (not only Preview)
- [ ] Submit one test contact path
- [ ] Check Vercel logs for 4xx/5xx
