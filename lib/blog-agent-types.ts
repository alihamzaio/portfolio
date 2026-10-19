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
}

export type BlogAgentState = {
  enabled: boolean
  /** 0=Sun … 6=Sat (UTC). Default Mon/Wed/Fri = 1,3,5 */
  publishWeekdaysUtc: number[]
  maxRetries: number
  pillars: string[]
  runs: BlogAgentRun[]
}

export const DEFAULT_BLOG_AGENT_STATE: BlogAgentState = {
  enabled: true,
  publishWeekdaysUtc: [1, 3],
  maxRetries: 3,
  pillars: [
    "Next.js App Router, Vercel deploys, and production debugging from real projects",
    "Freelance MVP scoping, estimates, and client kickoff habits that prevent rework",
    "Building portfolio case studies and digital products with honest constraints",
    "Full-stack patterns I use: auth, Postgres, queues, and admin dashboards",
    "Practical SEO and content quality for developer sites (not side-hustle spam)",
  ],
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
