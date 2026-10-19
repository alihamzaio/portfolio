export type BlogAgentRunStatus = "ok" | "error" | "skipped"

export type BlogAgentRun = {
  id: string
  at: string
  status: BlogAgentRunStatus
  reason?: string
  topic?: string
  title?: string
  slug?: string
  error?: string
  prUrl?: string
  postUrl?: string
  attempts: number
  retryOf?: string
  weekdayUtc?: number
  /** Where the topic seed came from */
  topicSource?: "reddit" | "google_trends" | "pillar" | "retry"
  trendTitle?: string
}

export type BlogAgentState = {
  enabled: boolean
  /** 0=Sun … 6=Sat (UTC). Default daily. */
  publishWeekdaysUtc: number[]
  maxRetries: number
  pillars: string[]
  /** Prefer Reddit + Google Trends seeds when available */
  useTrendTopics?: boolean
  runs: BlogAgentRun[]
}

export const DEFAULT_BLOG_AGENT_STATE: BlogAgentState = {
  enabled: true,
  publishWeekdaysUtc: [0, 1, 2, 3, 4, 5, 6],
  maxRetries: 3,
  pillars: [
    "Next.js App Router, Vercel deploys, and production debugging from real projects",
    "Freelance MVP scoping, estimates, and client kickoff habits that prevent rework",
    "Building portfolio case studies and digital products with honest constraints",
    "Full-stack patterns I use: auth, Postgres, queues, and admin dashboards",
    "Practical SEO and content quality for developer sites (not side-hustle spam)",
  ],
  useTrendTopics: true,
  runs: [],
}

/** Old money-farm pillars must never keep publishing. */
export function pillarsLookLikeHustleSpam(pillars: string[]): boolean {
  const blob = pillars.join(" ").toLowerCase()
  return (
    blob.includes("side hustle") ||
    blob.includes("side-hustle") ||
    blob.includes("make money") ||
    blob.includes("passive income") ||
    blob.includes("gumroad") ||
    blob.includes("creator economy") ||
    blob.includes("viral money")
  )
}
