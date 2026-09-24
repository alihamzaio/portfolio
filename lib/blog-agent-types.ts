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
  publishWeekdaysUtc: [1, 3, 5],
  maxRetries: 3,
  pillars: [
    "Viral money and side-hustle trends people search this week",
    "AI tools, prompts, and workflows that save time or make money",
    "Online income: freelancing, digital products, Gumroad, newsletters",
    "Career and productivity hacks with strong search demand",
    "Creator economy: growth, SEO blogging, audience building",
    "Hot internet debates explained simply (searchable, shareable)",
    "Practical how-to guides for beginners with high click intent",
  ],
  runs: [],
}
