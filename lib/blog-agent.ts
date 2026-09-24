import "server-only"

import { getStoreJson, setStoreJson } from "@/lib/store"
import { createBlogPullRequest } from "@/lib/blog-github"
import { getAllBlogPostsAdmin, slugifyTitle } from "@/lib/blog"
import { blogGroqModelQueue, isGroqModelUnavailableError } from "@/lib/llm-models"
import {
  DEFAULT_BLOG_AGENT_STATE,
  type BlogAgentRun,
  type BlogAgentState,
} from "@/lib/blog-agent-types"
import { pickAgentBlogCover } from "@/lib/blog-cover"

export type { BlogAgentRun, BlogAgentRunStatus, BlogAgentState } from "@/lib/blog-agent-types"

const DEFAULT_STATE = DEFAULT_BLOG_AGENT_STATE

function normalizeState(raw: unknown): BlogAgentState {
  if (!raw || typeof raw !== "object") return { ...DEFAULT_STATE, runs: [] }
  const o = raw as Partial<BlogAgentState>
  return {
    enabled: o.enabled !== false,
    publishWeekdaysUtc:
      Array.isArray(o.publishWeekdaysUtc) && o.publishWeekdaysUtc.length
        ? o.publishWeekdaysUtc.map((n) => Number(n)).filter((n) => n >= 0 && n <= 6)
        : [...DEFAULT_STATE.publishWeekdaysUtc],
    maxRetries: Math.min(5, Math.max(1, Number(o.maxRetries) || 3)),
    pillars:
      Array.isArray(o.pillars) && o.pillars.length
        ? o.pillars.map(String).filter(Boolean)
        : [...DEFAULT_STATE.pillars],
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
    const text =
      typeof msg?.content === "string"
        ? msg.content
        : typeof msg?.reasoning === "string"
          ? msg.reasoning
          : ""
    if (!text.trim()) {
      lastError = "Empty Groq response"
      continue
    }
    return text.trim()
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

async function generatePost(opts: {
  pillars: string[]
  existingTitles: string[]
  forcedTopic?: string
}): Promise<GeneratedPost> {
  const used = opts.existingTitles.slice(0, 40).join("\n- ")
  const pillars = opts.pillars.join("; ")

  const system = `You are a JSON API that writes viral SEO blog posts for Ali Hamza (alihamza-fawn.vercel.app).
Return ONE JSON object only. No markdown fences. No commentary.
Required keys: topic (string), title (string), excerpt (string), metaDescription (string), category (string), tags (string array), keywords (string array), body (markdown string).
Goal: ranking + shares + earning trust (digital products, freelancing, Kickoff Forge).
NOT a tech-stack tutorial blog unless the viral angle truly needs it.

Voice (critical):
- Sound like a real person who ships work, not a content farm.
- Prefer first-person or direct "you" voice. Short paragraphs. Specific examples.
- Ban: "In today's digital landscape", "roadmap", "leverage", "unlock", "delve", "game-changer", "comprehensive guide", em dashes.
- Ban markdown pipe tables (| col |). Use short bullet lists or bold labels instead.
- Avoid fake precision (exact conversion rates you cannot prove). Be honest when numbers are estimates.
- Light CTA only when natural (freelance systems / Kickoff Forge). Never hard-sell.

Body: 900-1400 words, H2/H3, scannable lists, one short FAQ. Write for Google + humans.`

  const user = opts.forcedTopic
    ? `Write a full SEO post about this topic (retry after a failed job): ${opts.forcedTopic}

Avoid duplicating these existing titles:
- ${used || "(none)"}`
    : `Pick ONE fresh, high-search topic from these earning/viral pillars:
${pillars}

Prefer angles that can go viral or rank: money online, AI leverage, creator growth, productivity, side hustles, tools people compare, "how to" + "best" + "vs" intent.
Use a title people would actually search or share this week.

Avoid duplicating these existing titles:
- ${used || "(none)"}`

  let draft: Record<string, unknown>
  try {
    draft = extractJsonObject(await groqJson(system, user))
  } catch {
    draft = extractJsonObject(
      await groqJson(
        `${system}\nCRITICAL: Output must be parseable by JSON.parse. Escape newlines in strings as \\n.`,
        user
      )
    )
  }

  let post = draft
  try {
    const humanizedText = await groqJson(
      `Rewrite this blog JSON to sound more human and less AI.
Keep facts. Tighten sentences. Remove clichés. No em dashes.
Return ONLY the same JSON keys: topic, title, excerpt, metaDescription, category, tags, keywords, body.`,
      JSON.stringify(draft)
    )
    post = extractJsonObject(humanizedText)
  } catch {
    // Keep draft if the polish pass fails
    post = draft
  }

  const title = String(post.title || draft.title || "").trim()
  const body = String(post.body || draft.body || "").trim()
  if (!title || !body) throw new Error("Generated post missing title/body")

  const excerpt = String(post.excerpt || body.replace(/\s+/g, " ").slice(0, 180)).trim()
  return {
    topic: String(post.topic || opts.forcedTopic || title).trim(),
    title,
    excerpt,
    metaDescription: String(post.metaDescription || excerpt).trim().slice(0, 160),
    category: String(post.category || "Trends").trim(),
    tags: Array.isArray(post.tags) ? post.tags.map(String).slice(0, 8) : [],
    keywords: Array.isArray(post.keywords) ? post.keywords.map(String).slice(0, 12) : [],
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
    const generated = await generatePost({
      pillars: state.pillars,
      existingTitles,
      forcedTopic: failed?.topic || failed?.title,
    })

    run.topic = generated.topic
    run.title = generated.title
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
