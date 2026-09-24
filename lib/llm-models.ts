/**
 * Default models for free-tier / developer keys.
 * Override: GROQ_MODEL, BLOG_GROQ_MODEL, OPENAI_MODEL
 *
 * Retired (do not send): llama-3.3-70b-versatile, llama-3.1-8b-instant (2026-08-16),
 * groq/compound / groq/compound-mini (2026-09-21).
 * https://console.groq.com/docs/deprecations
 */
export const DEFAULT_GROQ_MODEL = "openai/gpt-oss-20b"
export const DEFAULT_BLOG_GROQ_MODEL = "openai/gpt-oss-120b"
export const DEFAULT_OPENAI_MODEL = "gpt-4o-mini"

/** Prefer quality first, then speed, then other solid chat models. */
const BLOG_GROQ_CANDIDATES = [
  "openai/gpt-oss-120b",
  "openai/gpt-oss-20b",
  "qwen/qwen3.8-27b",
] as const

const RETIRED_GROQ_MODELS = new Set([
  "llama-3.3-70b-versatile",
  "llama-3.1-8b-instant",
  "groq/compound",
  "groq/compound-mini",
  "llama3-70b-8192",
  "llama3-8b-8192",
  "qwen/qwen3.6-27b",
  "qwen/qwen3-32b",
])

const GROQ_MODEL_ALIASES: Record<string, string> = {
  "llama-3.3-70b-versatile": DEFAULT_BLOG_GROQ_MODEL,
  "llama-3.1-8b-instant": DEFAULT_GROQ_MODEL,
  "groq/compound": DEFAULT_BLOG_GROQ_MODEL,
  "groq/compound-mini": DEFAULT_GROQ_MODEL,
  "llama3-70b-8192": DEFAULT_BLOG_GROQ_MODEL,
  "llama3-8b-8192": DEFAULT_GROQ_MODEL,
  "qwen/qwen3.6-27b": "qwen/qwen3.8-27b",
}

function mapGroqModel(raw: string | undefined, fallback: string): string {
  const id = (raw || "").trim() || fallback
  const mapped = GROQ_MODEL_ALIASES[id] || id
  if (RETIRED_GROQ_MODELS.has(mapped)) return fallback
  return mapped
}

export function resolveGroqModel() {
  return mapGroqModel(process.env.GROQ_MODEL, DEFAULT_GROQ_MODEL)
}

export function resolveBlogGroqModel() {
  const preferred =
    process.env.BLOG_GROQ_MODEL?.trim() ||
    process.env.GROQ_MODEL?.trim() ||
    DEFAULT_BLOG_GROQ_MODEL
  return mapGroqModel(preferred, DEFAULT_BLOG_GROQ_MODEL)
}

/**
 * Ordered models for Blog Agent. Env preference first, then known-good IDs.
 * Retired / remapped IDs never leave this list as live targets.
 */
export function blogGroqModelQueue(): string[] {
  const preferred = resolveBlogGroqModel()
  const queue = [
    preferred,
    DEFAULT_BLOG_GROQ_MODEL,
    DEFAULT_GROQ_MODEL,
    "qwen/qwen3.8-27b",
    ...BLOG_GROQ_CANDIDATES,
  ]
  const seen = new Set<string>()
  const out: string[] = []
  for (const raw of queue) {
    const id = mapGroqModel(raw, DEFAULT_BLOG_GROQ_MODEL)
    if (RETIRED_GROQ_MODELS.has(id) || seen.has(id)) continue
    seen.add(id)
    out.push(id)
  }
  return out.length ? out : [DEFAULT_BLOG_GROQ_MODEL]
}

export function isGroqModelUnavailableError(message: string): boolean {
  const m = message.toLowerCase()
  return (
    m.includes("does not exist") ||
    m.includes("do not have access") ||
    m.includes("model_not_found") ||
    m.includes("invalid_model") ||
    m.includes("decommissioned") ||
    m.includes("deprecated") ||
    (m.includes("model") && m.includes("not available"))
  )
}

export function resolveOpenAIModel() {
  return process.env.OPENAI_MODEL?.trim() || DEFAULT_OPENAI_MODEL
}
