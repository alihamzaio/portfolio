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
  enabled: false,
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
