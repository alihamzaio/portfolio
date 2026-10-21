import "server-only"

import { getStoreJson, setStoreJson } from "@/lib/store"
import { createBlogPullRequest } from "@/lib/blog-github"
import { getAllBlogPostsAdmin, slugifyTitle } from "@/lib/blog"
import { blogGroqModelQueue, isGroqModelUnavailableError } from "@/lib/llm-models"
import {
  DEFAULT_BLOG_AGENT_STATE,
  pillarsLookLikeHustleSpam,
  type BlogAgentRun,
  type BlogAgentState,
} from "@/lib/blog-agent-types"
import { pickAgentBlogCover } from "@/lib/blog-cover"
import { pickDailyTrendTopic } from "@/lib/blog-topic-trends"

export type { BlogAgentRun, BlogAgentRunStatus, BlogAgentState } from "@/lib/blog-agent-types"

const DEFAULT_STATE = DEFAULT_BLOG_AGENT_STATE

function normalizeState(raw: unknown): BlogAgentState {
  if (!raw || typeof raw !== "object") return { ...DEFAULT_STATE, runs: [] }
  const o = raw as Partial<BlogAgentState>
  const pillarsRaw =
    Array.isArray(o.pillars) && o.pillars.length
      ? o.pillars.map(String).filter(Boolean)
      : [...DEFAULT_STATE.pillars]
  const pillars = pillarsLookLikeHustleSpam(pillarsRaw)
    ? [...DEFAULT_STATE.pillars]
    : pillarsRaw
  return {
    enabled: o.enabled !== false,
    publishWeekdaysUtc:
      Array.isArray(o.publishWeekdaysUtc) && o.publishWeekdaysUtc.length
        ? o.publishWeekdaysUtc.map((n) => Number(n)).filter((n) => n >= 0 && n <= 6)
        : [...DEFAULT_STATE.publishWeekdaysUtc],
    maxRetries: Math.min(5, Math.max(1, Number(o.maxRetries) || 3)),
    pillars,
    useTrendTopics: o.useTrendTopics !== false,
    runs: Array.isArray(o.runs) ? (o.runs as BlogAgentRun[]) : [],
  }
}

export async function getBlogAgentState(): Promise<BlogAgentState> {
  const raw = await getStoreJson("blogAgent")
  return normalizeState(raw)
}

export async function saveBlogAgentState(state: BlogAgentState) {
  const next = normalizeState(state)
  next.runs = next.runs.slice(0, 60)
  return setStoreJson("blogAgent", next)
}

function utcDateKey(d = new Date()) {
  return d.toISOString().slice(0, 10)
}

function weekdayUtc(d = new Date()) {
  return d.getUTCDay()
}

function newId() {
  return `run_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}

type GeneratedPost = {
  title: string
  excerpt: string
  metaDescription: string
  category: string
  tags: string[]
  keywords: string[]
  body: string
  topic: string
}

async function groqJson(system: string, user: string): Promise<string> {
  const groq = process.env.GROQ_API_KEY?.trim()
  if (!groq) throw new Error("GROQ_API_KEY is not configured")

  const models = blogGroqModelQueue()
  let lastError = "No Groq model available"

  for (const model of models) {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${groq}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature: 0.6,
        max_tokens: 8000,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      }),
      cache: "no-store",
    })

    const data = await res.json().catch(() => null)
    if (!res.ok) {
      const msg =
        typeof data?.error?.message === "string" ? data.error.message : `Groq HTTP ${res.status}`
      lastError = msg
      // json_object unsupported on some IDs: retry same model without it once via next loop pass
      if (isGroqModelUnavailableError(msg)) continue
      if (/response_format|json_object|structured/i.test(msg)) {
        const plain = await groqJsonPlain(groq, model, system, user)
        if (plain) return plain
        continue
      }
      throw new Error(msg)
    }
    const msg = data?.choices?.[0]?.message
    const content = typeof msg?.content === "string" ? msg.content.trim() : ""
    // Prefer content; some reasoning models put prose in `reasoning` which is not JSON.
    const text = content || ""
    if (!text || !text.includes("{")) {
      const plain = await groqJsonPlain(groq, model, system, user)
      if (plain && plain.includes("{")) return plain
      lastError = "Empty or non-JSON Groq response"
      continue
    }
    return text
  }

  throw new Error(lastError)
}

async function groqJsonPlain(
  groq: string,
  model: string,
  system: string,
  user: string
): Promise<string | null> {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${groq}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.6,
      max_tokens: 8000,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
    cache: "no-store",
  })
  const data = await res.json().catch(() => null)
  if (!res.ok) return null
  const text = data?.choices?.[0]?.message?.content
  return typeof text === "string" && text.trim() ? text.trim() : null
}

function stripModelNoise(text: string): string {
  return text
    .replace(/<think>[\s\S]*?<\/think>/gi, "")
    .replace(/<\/?thinking>/gi, "")
    .replace(/^\s*Here(?:'s| is)(?: the)? JSON[:\s]*/i, "")
    .trim()
}

export async function clearBlogAgentFailedRuns(): Promise<BlogAgentState> {
  const state = await getBlogAgentState()
  state.runs = state.runs.filter((r) => r.status !== "error")
  await saveBlogAgentState(state)
  return state
}

export async function clearBlogAgentAllRuns(): Promise<BlogAgentState> {
  const state = await getBlogAgentState()
  state.runs = []
  await saveBlogAgentState(state)
  return state
}

function extractJsonObject(text: string): Record<string, unknown> {
  const cleaned = stripModelNoise(text)
  const fenced = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/i)
  let raw = (fenced?.[1] || cleaned).trim()

  // Prefer outermost object braces
  const start = raw.indexOf("{")
  const end = raw.lastIndexOf("}")
  if (start < 0 || end <= start) throw new Error("Model did not return JSON")
  raw = raw.slice(start, end + 1)

  try {
    return JSON.parse(raw) as Record<string, unknown>
  } catch {
    // Common model glitches: trailing commas, smart quotes
    const repaired = raw
      .replace(/[“”]/g, '"')
      .replace(/[‘’]/g, "'")
      .replace(/,\s*([}\]])/g, "$1")
    try {
      return JSON.parse(repaired) as Record<string, unknown>
    } catch {
      throw new Error("Model did not return JSON")
    }
  }
}

const BANNED_HUSTLE =
  /\b(side[- ]?hustle|make money( online)?|extra income|passive income|get rich|earn \$?\d+|\$\d+\s*(a|per)\s*(day|week|month)|sell(ing)? (ai )?prompts?|print[- ]?on[- ]?demand|gumroad|chatgpt prompts? for sale|tiktok (micro[- ]?)?video|newsletter workflow saved me|boost(ed)? my freelance (income|earnings))\b/i

const BANNED_SLOP =
  /\b(roadmap|leverage|unlock|delve|game-?changer|comprehensive|cutting-edge|landscape|data-driven|key platforms|in this guide|introduction)\b/i

function wordCount(text: string): number {
  return text
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[#>*_\-|[\]()`]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length
}

function assertQualityPost(title: string, body: string, category: string) {
  const blob = `${title}\n${body}\n${category}`
  if (BANNED_HUSTLE.test(blob)) {
    throw new Error("Rejected: looks like side-hustle / make-money spam")
  }
  if (BANNED_SLOP.test(title)) {
    throw new Error("Rejected: title uses banned brochure words")
  }
  const words = wordCount(body)
  if (words < 900) {
    throw new Error(`Rejected: body too thin (${words} words; need 900+)`)
  }
  if (words > 1800) {
    throw new Error(`Rejected: body too long (${words} words; keep under 1800)`)
  }
  if (!/\bI\b/.test(body) && !/\bmy\b/i.test(body)) {
    throw new Error("Rejected: missing first-person experience voice")
  }
  if (!/^##\s+/m.test(body)) {
    throw new Error("Rejected: body needs H2 sections")
  }
}

async function generatePost(opts: {
  pillars: string[]
  existingTitles: string[]
  forcedTopic?: string
}): Promise<GeneratedPost> {
  const used = opts.existingTitles.slice(0, 40).join("\n- ")
  const pillars = opts.pillars.join("; ")

  const system = `You write blog posts as Ali Hamza for alihamza-fawn.vercel.app.
Return ONE JSON object only. No markdown fences. No commentary outside JSON.
Keys: topic, title, excerpt, metaDescription, category, tags (string[]), keywords (string[]), body (markdown string).

Who you are: a working full-stack freelancer (Next.js, clients, digital products like Scopefirst/Jobrow/Weeklane). You write from real build and client work, not a content farm.

ALLOWED topics only:
- Case studies / postmortems (what broke, constraints, what you shipped)
- Next.js, Vercel, auth, Postgres, queues, admin dashboards, CSP, SEO for real sites
- Freelance practice: scoping, estimates, kickoff, change requests, client communication
- Portfolio / product craft: how you structure pages, screenshots, trust pages

FORBIDDEN topics (never write these):
- Side hustles, "make money online", passive income, selling prompts, POD, fake TikTok income
- Generic AI tool roundups with no personal project attached
- Clickbait earnings claims ($X/week) you did not measure

Hard voice rules:
- First person ("I") with concrete details (stack, failure, fix, tradeoff).
- Short paragraphs (2-4 sentences). Open with a real problem, never "Introduction".
- Ban: roadmap, leverage, unlock, delve, game-changer, comprehensive, cutting-edge, landscape, "data-driven", "key platforms".
- Ban em dashes. Use "-" or commas or a new sentence.
- Ban markdown pipe tables. Use bold labels + short bullets.
- No fake surveys or invented statistics.
- Light CTA only when natural: /projects, /contact, Scopefirst, Jobrow, Weeklane.
- Body 900-1400 words. H2/H3. One short FAQ. End with a clear bottom line.
- Category must be one of: Engineering, Freelance, Case Study, Products (not Trends/Money).`

  const user = opts.forcedTopic
    ? `Write a REAL experience / case-study style post about: ${opts.forcedTopic}

Ground it in concrete freelance or portfolio work. No hustle spam.

Avoid these existing titles:
- ${used || "(none)"}`
    : `Pick ONE fresh topic from these pillars only:
${pillars}

Title should sound like a practitioner search query (how / why / what broke), not a textbook or money clickbait.

Avoid these existing titles:
- ${used || "(none)"}`

  let draft: Record<string, unknown>
  try {
    draft = extractJsonObject(await groqJson(system, user))
  } catch {
    draft = extractJsonObject(
      await groqJson(
        `${system}\nCRITICAL: Valid JSON only. Escape newlines in strings as \\n.`,
        user
      )
    )
  }

  let post = draft
  try {
    const humanizedText = await groqJson(
      `You are an editor for a developer portfolio blog.
Rewrite this JSON into a sharper first-person case study / how-I-work post.
Keep useful facts. Cut brochure tone. Add one concrete failure or tradeoff.
If the draft smells like side-hustle or make-money spam, rewrite onto a real engineering/freelance practice angle instead.
Replace pipe tables with bullets. Replace em dashes with "-" or new sentences.
Remove fake statistics. Keep JSON keys: topic, title, excerpt, metaDescription, category, tags, keywords, body.
Return ONLY JSON.`,
      JSON.stringify({
        title: draft.title,
        excerpt: draft.excerpt,
        metaDescription: draft.metaDescription,
        category: draft.category,
        tags: draft.tags,
        keywords: draft.keywords,
        body: draft.body,
        topic: draft.topic,
      })
    )
    post = extractJsonObject(humanizedText)
  } catch {
    post = draft
  }

  const scrub = (s: string) =>
    s
      .replace(/\u2014/g, " - ")
      .replace(/\u2013/g, "-")
      .replace(/\u2011/g, "-")
      .replace(/\u00a0/g, " ")

  const title = scrub(String(post.title || draft.title || "").trim())
  const body = scrub(String(post.body || draft.body || "").trim())
  if (!title || !body) throw new Error("Generated post missing title/body")

  let category = scrub(String(post.category || draft.category || "Engineering").trim())
  if (/trend|money|hustle|income/i.test(category)) category = "Engineering"

  assertQualityPost(title, body, category)

  const excerpt = scrub(
    String(post.excerpt || body.replace(/\s+/g, " ").slice(0, 180)).trim()
  )
  return {
    topic: scrub(String(post.topic || opts.forcedTopic || title).trim()),
    title,
    excerpt,
    metaDescription: scrub(String(post.metaDescription || excerpt).trim().slice(0, 160)),
    category,
    tags: Array.isArray(post.tags) ? post.tags.map((t) => scrub(String(t))).slice(0, 8) : [],
    keywords: Array.isArray(post.keywords)
      ? post.keywords.map((k) => scrub(String(k))).slice(0, 12)
      : [],
    body,
  }
}

export type BlogAgentRunResult = {
  ok: boolean
  action: "published" | "retried" | "skipped" | "error"
  run: BlogAgentRun
  state: BlogAgentState
}

/**
 * Cron/admin entry: retry failed runs first, else publish on Mon/Wed/Fri UTC.
 */
export async function runBlogAgent(opts?: {
  force?: boolean
  retryId?: string
}): Promise<BlogAgentRunResult> {
  const state = await getBlogAgentState()
  const now = new Date()
  const today = utcDateKey(now)
  const dow = weekdayUtc(now)

  if (!state.enabled && !opts?.force && !opts?.retryId) {
    const run: BlogAgentRun = {
      id: newId(),
      at: now.toISOString(),
      status: "skipped",
      reason: "Agent disabled",
      attempts: 0,
      weekdayUtc: dow,
    }
    state.runs.unshift(run)
    await saveBlogAgentState(state)
    return { ok: true, action: "skipped", run, state }
  }

  const failed =
    (opts?.retryId
      ? state.runs.find((r) => r.id === opts.retryId && r.status === "error")
      : state.runs.find(
          (r) => r.status === "error" && (r.attempts || 1) < state.maxRetries
        )) || null

  const alreadyOkToday = state.runs.some(
    (r) => r.status === "ok" && typeof r.at === "string" && r.at.startsWith(today)
  )

  const isPublishDay = state.publishWeekdaysUtc.includes(dow)

  if (!failed && !opts?.force && !isPublishDay) {
    const run: BlogAgentRun = {
      id: newId(),
      at: now.toISOString(),
      status: "skipped",
      reason: `Not a publish day (UTC weekday ${dow}). Schedule: ${state.publishWeekdaysUtc.join(",")}`,
      attempts: 0,
      weekdayUtc: dow,
    }
    state.runs.unshift(run)
    await saveBlogAgentState(state)
    return { ok: true, action: "skipped", run, state }
  }

  if (!failed && !opts?.force && alreadyOkToday) {
    const run: BlogAgentRun = {
      id: newId(),
      at: now.toISOString(),
      status: "skipped",
      reason: "Already published successfully today",
      attempts: 0,
      weekdayUtc: dow,
    }
    state.runs.unshift(run)
    await saveBlogAgentState(state)
    return { ok: true, action: "skipped", run, state }
  }

  const existing = await getAllBlogPostsAdmin()
  const existingTitles = existing.map((p) => p.title)
  const attemptBase = failed ? (failed.attempts || 1) + 1 : 1

  const run: BlogAgentRun = {
    id: newId(),
    at: now.toISOString(),
    status: "error",
    attempts: attemptBase,
    retryOf: failed?.id,
    weekdayUtc: dow,
    topic: failed?.topic,
  }

  try {
    let forcedTopic = failed?.topic || failed?.title || undefined
    let topicSource: BlogAgentRun["topicSource"] = failed ? "retry" : "pillar"
    let trendTitle: string | undefined

    if (!forcedTopic && state.useTrendTopics !== false) {
      const picked = await pickDailyTrendTopic(existingTitles)
      if (picked.seed && picked.topic) {
        forcedTopic = picked.topic
        topicSource = picked.seed.source
        trendTitle = picked.seed.title
        run.reason = picked.reason
      }
    }

    const generated = await generatePost({
      pillars: state.pillars,
      existingTitles,
      forcedTopic,
    })

    run.topic = generated.topic
    run.title = generated.title
    run.topicSource = topicSource
    run.trendTitle = trendTitle
    const slug = slugifyTitle(generated.title)

    const cover = pickAgentBlogCover(slug)

    const published = await createBlogPullRequest({
      title: generated.title,
      excerpt: generated.excerpt,
      metaDescription: generated.metaDescription,
      body: generated.body,
      category: generated.category,
      slug,
      tags: generated.tags,
      keywords: generated.keywords,
      coverImage: cover.url,
      coverImageAlt: cover.alt,
      source: "Blog Agent",
      status: "published",
      autoMerge: true,
      featured: false,
    })

    run.status = "ok"
    run.slug = published.slug
    run.prUrl = published.prUrl
    run.postUrl = published.postUrl || `/blog/${published.slug}`
    run.reason = failed ? "Retry succeeded" : "Published on schedule"

    if (failed) {
      failed.reason = `Superseded by retry ${run.id}`
    }

    state.runs.unshift(run)
    await saveBlogAgentState(state)
    return {
      ok: true,
      action: failed ? "retried" : "published",
      run,
      state,
    }
  } catch (err) {
    run.status = "error"
    run.error = err instanceof Error ? err.message : String(err)
    run.reason = failed ? "Retry failed" : "Publish failed"
    state.runs.unshift(run)
    await saveBlogAgentState(state)
    return { ok: false, action: "error", run, state }
  }
}
