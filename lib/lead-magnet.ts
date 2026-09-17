/** Free lead magnets — downloadable checklists that feed hire leads. */

export type LeadMagnet = {
  slug: string
  title: string
  description: string
  /** Public file path for direct download */
  downloadPath: string
  fileName: string
  bullets: string[]
}

export const LEAD_MAGNETS: LeadMagnet[] = [
  {
    slug: "nextjs-vercel-launch-checklist",
    title: "Next.js + Vercel Production Launch Checklist",
    description:
      "The pre-deploy checks I run before a client site goes live — env vars, SEO, images, auth, and post-launch smoke tests.",
    downloadPath: "/resources/nextjs-vercel-launch-checklist.md",
    fileName: "nextjs-vercel-launch-checklist.md",
    bullets: [
      "Production URL + env scopes",
      "Images, SEO, and sitemap",
      "Auth, APIs, and error states",
      "Post-deploy smoke test list",
    ],
  },
]

export const PRIMARY_LEAD_MAGNET = LEAD_MAGNETS[0]

export function getLeadMagnet(slug: string): LeadMagnet | undefined {
  return LEAD_MAGNETS.find((m) => m.slug === slug)
}
