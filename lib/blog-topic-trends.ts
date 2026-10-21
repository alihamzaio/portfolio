/**
 * Daily topic seeds from Reddit + Google Trends, filtered for developer / freelance
 * portfolio posts (not side-hustle spam).
 */
import "server-only"

export type TrendTopic = {
  title: string
  source: "reddit" | "google_trends"
  url?: string
  score: number
}

const REDDIT_SUBS = [
  "webdev",
  "nextjs",
  "reactjs",
  "typescript",
  "javascript",
  "freelance",
  "programming",
  "node",
  "webdev",
] as const

const RELEVANT =
  /\b(next\.?js|react|typescript|javascript|vercel|node\.?js|postgres|sql|auth|oauth|seo|freelance|client|mvp|saas|api|tailwind|css|docker|aws|portfolio|chrome extension|webdev|frontend|backend|full[- ]?stack|deploy|cdn|csp|drizzle|redis|queue)\b/i

const BANNED =
  /\b(side[- ]?hustle|make money|passive income|get rich|extra income|earn \$?\d+|crypto pump|onlyfans|nsfw|porn|gambling|betting|giveaway|prompt marketplace|selling prompts|print[- ]?on[- ]?demand|\$\d+\s*(a|per)\s*(day|week|month))\b/i

function scoreTitle(title: string, source: TrendTopic["source"], ups = 0): number {
  let score = source === "reddit" ? Math.min(40, Math.log10(ups + 10) * 12) : 20
  if (RELEVANT.test(title)) score += 35
  if (/\b(next\.?js|vercel|freelance|typescript)\b/i.test(title)) score += 15
  if (title.length > 90) score -= 10
  if (title.length < 18) score -= 15
  return score
}

function cleanTitle(raw: string): string {
  return raw
    .replace(/\s+/g, " ")
    .replace(/\[.*?\]/g, "")
    .replace(/\(.*?\)/g, "")
    .trim()
    .slice(0, 140)
}

function isUsable(title: string): boolean {
  if (!title || title.length < 12) return false
  if (BANNED.test(title)) return false
  if (!RELEVANT.test(title)) return false
  return true
}

async function fetchRedditTopics(): Promise<TrendTopic[]> {
  const out: TrendTopic[] = []
  const ua = "alihamza-portfolio-blog-agent/1.0 (topic discovery; contact via site)"
  for (const sub of REDDIT_SUBS) {
    try {
      const res = await fetch(`https://www.reddit.com/r/${sub}/hot.json?limit=20`, {
        headers: { "User-Agent": ua, Accept: "application/json" },
        next: { revalidate: 0 },
        cache: "no-store",
      })
      if (!res.ok) continue
      const data = (await res.json()) as {
        data?: { children?: Array<{ data?: { title?: string; ups?: number; permalink?: string; over_18?: boolean } }> }
      }
      for (const child of data.data?.children || []) {
        const d = child.data
        if (!d?.title || d.over_18) continue
        const title = cleanTitle(d.title)
        if (!isUsable(title)) continue
        out.push({
          title,
          source: "reddit",
          url: d.permalink ? `https://www.reddit.com${d.permalink}` : undefined,
          score: scoreTitle(title, "reddit", Number(d.ups) || 0),
        })
      }
    } catch {
      // ignore subreddit failures
    }
  }
  return out
}

async function fetchGoogleTrendTopics(): Promise<TrendTopic[]> {
  const out: TrendTopic[] = []
  // Public daily trends RSS (no API key). Filter hard for relevance.
  const urls = [
    "https://trends.google.com/trending/rss?geo=US",
    "https://trends.google.com/trending/rss?geo=GB",
  ]
  for (const url of urls) {
    try {
      const res = await fetch(url, {
        headers: { Accept: "application/rss+xml, application/xml, text/xml" },
        cache: "no-store",
      })
      if (!res.ok) continue
      const xml = await res.text()
      const titles = [...xml.matchAll(/<title><!\[CDATA\[(.*?)\]\]><\/title>|<title>(.*?)<\/title>/gi)]
        .map((m) => cleanTitle(m[1] || m[2] || ""))
        .filter(Boolean)
      // First title is often feed name
      for (const title of titles.slice(1, 40)) {
        if (!isUsable(title)) continue
        out.push({
          title,
          source: "google_trends",
          score: scoreTitle(title, "google_trends"),
        })
      }
    } catch {
      // ignore geo failures
    }
  }
  return out
}

function dedupe(topics: TrendTopic[]): TrendTopic[] {
  const seen = new Set<string>()
  const out: TrendTopic[] = []
  for (const t of topics.sort((a, b) => b.score - a.score)) {
    const key = t.title.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim()
    if (!key || seen.has(key)) continue
    seen.add(key)
    out.push(t)
  }
  return out
}

function overlapsExisting(title: string, existingTitles: string[]): boolean {
  const norm = title.toLowerCase().replace(/[^a-z0-9]+/g, " ")
  return existingTitles.some((t) => {
    const e = t.toLowerCase().replace(/[^a-z0-9]+/g, " ")
    return e.includes(norm.slice(0, 40)) || norm.includes(e.slice(0, 40))
  })
}

/**
 * Pick one live trend and turn it into a blog angle Ali can write from experience.
 */
export async function pickDailyTrendTopic(existingTitles: string[]): Promise<{
  topic: string
  seed: TrendTopic | null
  reason: string
}> {
  const [reddit, google] = await Promise.all([fetchRedditTopics(), fetchGoogleTrendTopics()])
  const ranked = dedupe([...reddit, ...google]).filter((t) => !overlapsExisting(t.title, existingTitles))

  if (!ranked.length) {
    return {
      topic: "",
      seed: null,
      reason: "No relevant Reddit/Google trend matched filters; falling back to pillars",
    }
  }

  const seed = ranked[0]
  const topic = `Write from my freelance / Next.js portfolio angle about this trending discussion: "${seed.title}". Explain what it means for real client work, what I would ship, and what usually breaks. Source hint: ${seed.source}${seed.url ? ` (${seed.url})` : ""}. Do not invent earnings.`

  return {
    topic,
    seed,
    reason: `Picked ${seed.source} trend (score ${Math.round(seed.score)}): ${seed.title}`,
  }
}
