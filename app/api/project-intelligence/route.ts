import { NextRequest, NextResponse } from "next/server"
import {
  advanceBrief,
  askPortfolioQuestion,
  buildIntelligenceSystemPrompt,
  emptyBrief,
  formatBrief,
  recommendProjects,
  sanitizeText,
  startProjectBrief,
  validateBrief,
  type AgentMode,
  type ChatMessage,
  type ProjectBrief,
} from "@/lib/project-intelligence"
import { siteConfig } from "@/lib/site"
import { resolveGroqModel, resolveOpenAIModel } from "@/lib/llm-models"
import { normalizeAgentReply } from "@/lib/chat-format"

export const dynamic = "force-dynamic"

type Body = {
  action?: "ask" | "recommend" | "start_brief" | "brief_answer" | "submit_brief"
  message?: string
  history?: ChatMessage[]
  mode?: AgentMode
  brief?: ProjectBrief
  briefStep?: number
  honeypot?: string
}

const buckets = new Map<string, { count: number; reset: number }>()

function clientIp(req: NextRequest) {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  )
}

function rateLimit(ip: string, limit = 20, windowMs = 60_000) {
  const now = Date.now()
  const row = buckets.get(ip)
  if (!row || now > row.reset) {
    buckets.set(ip, { count: 1, reset: now + windowMs })
    return { ok: true }
  }
  if (row.count >= limit) return { ok: false }
  row.count += 1
  return { ok: true }
}

async function llmReply(message: string, history: ChatMessage[]): Promise<string | null> {
  const groq = process.env.GROQ_API_KEY?.trim()
  const openai = process.env.OPENAI_API_KEY?.trim()
  if (!groq && !openai) return null

  const messages = [
    { role: "system", content: buildIntelligenceSystemPrompt() },
    ...history.filter((m) => m.role !== "system").slice(-8).map((m) => ({ role: m.role, content: m.content })),
    { role: "user", content: message },
  ]

  try {
    if (groq) {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${groq}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: resolveGroqModel(),
          messages,
          temperature: 0.6,
          max_tokens: 360,
        }),
        cache: "no-store",
        signal: AbortSignal.timeout(12_000),
      })
      if (res.ok) {
        const data = await res.json()
        const text = data?.choices?.[0]?.message?.content
        if (typeof text === "string" && text.trim()) return normalizeAgentReply(text)
      }
    }

    if (openai) {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${openai}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: resolveOpenAIModel(),
          messages,
          temperature: 0.6,
          max_tokens: 360,
        }),
        cache: "no-store",
        signal: AbortSignal.timeout(12_000),
      })
      if (res.ok) {
        const data = await res.json()
        const text = data?.choices?.[0]?.message?.content
        if (typeof text === "string" && text.trim()) return normalizeAgentReply(text)
      }
    }
  } catch {
    return null
  }
  return null
}

export async function POST(req: NextRequest) {
  const ip = clientIp(req)
  if (!rateLimit(ip).ok) {
    return NextResponse.json(
      { state: "rate_limited", error: "Too many requests. Please wait a moment." },
      { status: 429 }
    )
  }

  const body = (await req.json().catch(() => null)) as Body | null
  if (!body) {
    return NextResponse.json({ state: "error", error: "Invalid request." }, { status: 400 })
  }

  if (body.honeypot && body.honeypot.trim()) {
    return NextResponse.json({ state: "success", reply: "Thanks." })
  }

  const action = body.action || "ask"
  const message = sanitizeText(body.message || "", 500)
  const history = Array.isArray(body.history) ? body.history.slice(-10) : []

  if (action === "start_brief") {
    const started = startProjectBrief()
    return NextResponse.json({
      state: "success",
      mode: "brief",
      reply: normalizeAgentReply(started.reply),
      brief: started.brief,
      briefStep: started.step,
      briefComplete: false,
    })
  }

  if (action === "recommend") {
    const picks = recommendProjects(message || "selected work", 3)
    const reply = normalizeAgentReply(
      `Relevant projects:\n${picks.map((p) => `• ${p.title} — ${p.description}`).join("\n")}`
    )
    return NextResponse.json({
      state: "success",
      mode: "explorer",
      reply,
      recommendations: picks,
    })
  }

  if (action === "brief_answer") {
    if (!message) {
      return NextResponse.json({ state: "error", error: "Answer required." }, { status: 400 })
    }
    const brief = body.brief || emptyBrief()
    const step = typeof body.briefStep === "number" ? body.briefStep : 0
    const advanced = advanceBrief(brief, step, message)
    return NextResponse.json({
      state: "success",
      mode: "brief",
      reply: normalizeAgentReply(advanced.reply),
      brief: advanced.brief,
      briefStep: advanced.step,
      briefComplete: advanced.complete,
      briefText: formatBrief(advanced.brief),
    })
  }

  if (action === "submit_brief") {
    const brief = body.brief || emptyBrief()
    const invalid = validateBrief(brief)
    if (invalid) {
      return NextResponse.json({ state: "error", error: invalid }, { status: 400 })
    }

    const subject = encodeURIComponent(`Project brief from portfolio — ${brief.productType || "inquiry"}`)
    const mailBody = encodeURIComponent(formatBrief(brief))
    const mailto = `mailto:${siteConfig.email}?subject=${subject}&body=${mailBody}`

    return NextResponse.json({
      state: "success",
      delivered: false,
      mailto,
      reply: `Brief is ready. Your email client will open so you can send it to ${siteConfig.email}. Nothing is emailed automatically from this site.`,
      brief,
      briefText: formatBrief(brief),
    })
  }

  if (!message) {
    return NextResponse.json({ state: "error", error: "Message required." }, { status: 400 })
  }

  if (/(product idea|prepare a brief|project brief|i have a product)/i.test(message)) {
    const started = startProjectBrief()
    return NextResponse.json({
      state: "success",
      mode: "brief",
      reply: started.reply,
      brief: started.brief,
      briefStep: started.step,
      briefComplete: false,
    })
  }

  const llm = await llmReply(message, history)
  const reply = normalizeAgentReply(llm || askPortfolioQuestion(message))

  return NextResponse.json({
    state: "success",
    mode: "explorer",
    reply,
    source: llm ? "llm" : "knowledge",
  })
}
