/** Soft tool recommend / affiliate links for blog footers. Replace urls with affiliate links when ready. */

export type AffiliateTool = {
  id: string
  name: string
  blurb: string
  url: string
  /** True only when url is a tracked affiliate / partner link */
  affiliate: boolean
  enabled: boolean
  tags: string[]
}

export const AFFILIATE_DISCLOSURE =
  "Some links may earn a commission at no extra cost to you. I only list tools I use in real work."

export const AFFILIATE_TOOLS: AffiliateTool[] = [
  {
    id: "vercel",
    name: "Vercel",
    blurb: "Deploy Next.js apps",
    url: "https://vercel.com",
    affiliate: false,
    enabled: true,
    tags: ["nextjs", "deploy", "hosting", "frontend"],
  },
  {
    id: "hostinger",
    name: "Hostinger",
    blurb: "Affordable web hosting",
    url: "https://www.hostinger.com",
    affiliate: false,
    enabled: true,
    tags: ["hosting", "domain", "wordpress"],
  },
  {
    id: "cursor",
    name: "Cursor",
    blurb: "AI coding editor",
    url: "https://cursor.com",
    affiliate: false,
    enabled: true,
    tags: ["ai", "coding", "cursor", "freelancing"],
  },
  {
    id: "railway",
    name: "Railway",
    blurb: "Simple app hosting",
    url: "https://railway.app",
    affiliate: false,
    enabled: true,
    tags: ["hosting", "backend", "api", "node"],
  },
  {
    id: "notion",
    name: "Notion",
    blurb: "Docs and AI workspace",
    url: "https://www.notion.so",
    affiliate: false,
    enabled: true,
    tags: ["productivity", "ai", "notes", "freelancing"],
  },
]

export function toolsForTopic(topic: string, limit = 3): AffiliateTool[] {
  const enabled = AFFILIATE_TOOLS.filter((t) => t.enabled)
  const text = (topic || "").toLowerCase()
  const scored = enabled
    .map((t) => ({
      t,
      score: t.tags.reduce((n, tag) => n + (tag && text.includes(tag) ? 1 : 0), 0),
    }))
    .sort((a, b) => b.score - a.score || a.t.name.localeCompare(b.t.name))

  const picked: AffiliateTool[] = []
  const seen = new Set<string>()
  for (const { t, score } of scored) {
    if (score <= 0) break
    if (seen.has(t.id)) continue
    picked.push(t)
    seen.add(t.id)
    if (picked.length >= limit) return picked
  }
  for (const t of enabled) {
    if (seen.has(t.id)) continue
    picked.push(t)
    seen.add(t.id)
    if (picked.length >= limit) break
  }
  return picked
}

export function anyAffiliateActive(tools: AffiliateTool[] = AFFILIATE_TOOLS): boolean {
  return tools.some((t) => t.enabled && t.affiliate)
}
