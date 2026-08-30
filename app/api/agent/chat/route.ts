import { NextRequest, NextResponse } from "next/server"
import {
  buildSystemPrompt,
  replyFromKnowledge,
  type ChatMessage,
} from "@/lib/agent-knowledge"
import { resolveGroqModel, resolveOpenAIModel } from "@/lib/llm-models"

export const dynamic = "force-dynamic"

type Body = {
  message?: string
  history?: ChatMessage[]
}

type LlmAttempt = {
  provider: "groq" | "openai"
  ok: boolean
  reply?: string
  status?: number
  error?: string
}

async function callChatApi(opts: {
  provider: "groq" | "openai"
  url: string
  apiKey: string
  model: string
  messages: Array<{ role: string; content: string }>
}): Promise<LlmAttempt> {
  try {
    const res = await fetch(opts.url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${opts.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: opts.model,
        messages: opts.messages,
        temperature: 0.7,
        max_tokens: 320,
      }),
      cache: "no-store",
    })

    const data = await res.json().catch(() => null)
    if (!res.ok) {
      const msg =
        typeof data?.error?.message === "string"
          ? data.error.message
          : `HTTP ${res.status}`
      return { provider: opts.provider, ok: false, status: res.status, error: msg }
    }

    const text = data?.choices?.[0]?.message?.content
    if (typeof text === "string" && text.trim()) {
      return { provider: opts.provider, ok: true, reply: text.trim() }
    }
    return {
      provider: opts.provider,
      ok: false,
      status: res.status,
      error: "Empty model response",
    }
  } catch (err) {
    return {
      provider: opts.provider,
      ok: false,
      error: err instanceof Error ? err.message : "Network error",
    }
  }
}

async function llmReply(
  message: string,
  history: ChatMessage[]
): Promise<{ reply: string | null; attempts: LlmAttempt[] }> {
  const groq = process.env.GROQ_API_KEY?.trim()
  const openai = process.env.OPENAI_API_KEY?.trim()
  const attempts: LlmAttempt[] = []

  if (!groq && !openai) return { reply: null, attempts }

  const messages = [
    { role: "system", content: buildSystemPrompt() },
    ...history.slice(-8).map((m) => ({ role: m.role, content: m.content })),
    { role: "user", content: message },
  ]

  if (groq) {
    const attempt = await callChatApi({
      provider: "groq",
      url: "https://api.groq.com/openai/v1/chat/completions",
      apiKey: groq,
      model: resolveGroqModel(),
      messages,
    })
    attempts.push(attempt)
    if (attempt.ok && attempt.reply) return { reply: attempt.reply, attempts }
  }

  if (openai) {
    const attempt = await callChatApi({
      provider: "openai",
      url: "https://api.openai.com/v1/chat/completions",
      apiKey: openai,
      model: resolveOpenAIModel(),
      messages,
    })
    attempts.push(attempt)
    if (attempt.ok && attempt.reply) return { reply: attempt.reply, attempts }
  }

  return { reply: null, attempts }
}

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as Body | null
  const message = (body?.message || "").trim().slice(0, 500)
  const history = Array.isArray(body?.history) ? body!.history!.slice(-10) : []

  if (!message) {
    return NextResponse.json({ error: "Message required" }, { status: 400 })
  }

  const { reply: llm, attempts } = await llmReply(message, history)
  const reply = llm || replyFromKnowledge(message, history)
  const mode = llm ? "llm" : "knowledge"
  const provider = attempts.find((a) => a.ok)?.provider || null
  const llmError =
    mode === "knowledge" && attempts.length > 0
      ? attempts.map((a) => `${a.provider}: ${a.error || a.status || "failed"}`).join(" | ")
      : null

  return NextResponse.json({
    reply,
    mode,
    provider,
    ...(process.env.NODE_ENV !== "production" && llmError ? { llmError } : {}),
  })
}
