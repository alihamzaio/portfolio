# Next.js + Vercel Production Launch Checklist

By Ali Hamza — Full Stack Developer (Lahore / remote)

Use this before every client or portfolio deploy. Print it, or keep it next to your Vercel dashboard.

Free resource from https://alihamza-fawn.vercel.app/resources  
Need help shipping? https://alihamza-fawn.vercel.app/contact

---

## 1. URL and environment

- [ ] `NEXT_PUBLIC_SITE_URL` is set to the real public URL (not localhost)
- [ ] Production, Preview, and Development env scopes are filled where needed
- [ ] No secrets in `NEXT_PUBLIC_*` variables
- [ ] Preview builds can run without Production-only secrets (or those features are gated)
- [ ] Local `.env.example` documents every required key (no values)

## 2. Build and runtime

- [ ] `npm run build` (or `pnpm` / `yarn`) passes locally
- [ ] Typecheck / lint passes (or known exceptions are documented)
- [ ] No `console.error` spam on the happy path in production
- [ ] Node version in Vercel matches what you develop on
- [ ] Middleware / proxy routes do not block static assets or health checks

## 3. Images and media

- [ ] Remote image hosts are listed in `next.config` `images.remotePatterns`
- [ ] Hero / OG images load on a cold cache (open in an incognito window)
- [ ] Broken image fallbacks exist for user-uploaded or CMS covers
- [ ] Large assets are compressed (WebP/AVIF or CDN query params)

## 4. SEO and sharing

- [ ] Unique `<title>` and meta description per important page
- [ ] Canonical URLs use `NEXT_PUBLIC_SITE_URL`
- [ ] `sitemap.xml` and `robots.txt` resolve
- [ ] Open Graph / Twitter image previews look correct
- [ ] Blog / case study pages include basic structured data if you use it

## 5. Auth, APIs, and forms

- [ ] Contact / lead forms submit successfully from Production
- [ ] Rate limits or spam protection are on public POST routes
- [ ] Admin / OTP / secret routes are not reachable without auth
- [ ] API error responses do not leak stack traces or secrets
- [ ] Third-party keys (email, GitHub, analytics) work in Production

## 6. Performance and UX smoke test

- [ ] Home and main CTA pages load under a few seconds on mid mobile
- [ ] Primary CTAs (Hire / Contact / Resume) work on mobile
- [ ] 404 page exists and links back to home or contact
- [ ] Reduced-motion / no-JS paths still show core content where possible

## 7. Post-deploy (first 15 minutes)

- [ ] Hit Production URL, not only Preview
- [ ] Submit one real contact message to yourself
- [ ] Check Vercel function logs for 4xx/5xx spikes
- [ ] Share one OG link in Slack/iMessage and confirm the card
- [ ] Bookmark the rollback / previous deployment in Vercel

---

## Want this done with you?

I ship production Next.js, MERN, and AWS work for startups and product teams.

→ Hire me: https://alihamza-fawn.vercel.app/contact  
→ Projects: https://alihamza-fawn.vercel.app/projects  
→ DevBuildDaily (shorts): https://www.youtube.com/@DevBuildDaily
