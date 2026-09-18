/** Affiliate / recommend links — managed in Admin → Affiliates (content/affiliates.json). */

export type AffiliateTool = {
  id: string
  name: string
  blurb: string
  url: string
  /** True only when url is your tracked affiliate / partner link */
  affiliate: boolean
  enabled: boolean
  tags: string[]
}

export type AffiliatesConfig = {
  disclosure: string
  tools: AffiliateTool[]
}

export const DEFAULT_AFFILIATE_DISCLOSURE =
  "Some links may earn a commission at no extra cost to you. I only list tools I use in real work."

export const EMPTY_AFFILIATES: AffiliatesConfig = {
  disclosure: DEFAULT_AFFILIATE_DISCLOSURE,
  tools: [],
}

function slugId(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48)
}

export function normalizeAffiliateTool(
  raw: Partial<AffiliateTool> & { name?: string; url?: string },
  fallbackId?: string
): AffiliateTool | null {
  const name = String(raw.name || "").trim()
  const url = String(raw.url || "").trim()
  if (!name || !url) return null
  try {
    const u = new URL(url)
    if (u.protocol !== "http:" && u.protocol !== "https:") return null
  } catch {
    return null
  }
  const id = String(raw.id || fallbackId || slugId(name) || `tool-${Date.now()}`).trim()
  const tags = Array.isArray(raw.tags)
    ? raw.tags.map((t) => String(t).trim().toLowerCase()).filter(Boolean)
    : String((raw as { tagsCsv?: string }).tagsCsv || "")
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean)

  return {
    id,
    name,
    blurb: String(raw.blurb || "").trim(),
    url,
    affiliate: Boolean(raw.affiliate),
    enabled: raw.enabled !== false,
    tags,
  }
}

export function normalizeAffiliatesConfig(raw: unknown): AffiliatesConfig {
  const data = (raw && typeof raw === "object" ? raw : {}) as Partial<AffiliatesConfig>
  const tools: AffiliateTool[] = []
  const seen = new Set<string>()
  for (const item of Array.isArray(data.tools) ? data.tools : []) {
    const t = normalizeAffiliateTool(item as AffiliateTool)
    if (!t || seen.has(t.id)) continue
    seen.add(t.id)
    tools.push(t)
  }
  return {
    disclosure: String(data.disclosure || DEFAULT_AFFILIATE_DISCLOSURE).trim() || DEFAULT_AFFILIATE_DISCLOSURE,
    tools,
  }
}

/** Public site: only show links you marked as affiliate + enabled. */
export function publicAffiliateTools(tools: AffiliateTool[]): AffiliateTool[] {
  return tools.filter((t) => t.enabled && t.affiliate && t.url.startsWith("http"))
}

export function toolsForTopic(tools: AffiliateTool[], topic: string, limit = 3): AffiliateTool[] {
  const enabled = publicAffiliateTools(tools)
  if (!enabled.length) return []
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
