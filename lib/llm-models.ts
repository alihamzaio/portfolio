/**
 * Default models for free-tier / developer keys.
 * Override: GROQ_MODEL, BLOG_GROQ_MODEL, OPENAI_MODEL
 *
 * Groq retired llama-3.3-70b-versatile and llama-3.1-8b-instant (2026-08-16)
 * and groq/compound-mini (2026-09-21). Keep this list current with
 * https://console.groq.com/docs/deprecations
 */
export const DEFAULT_GROQ_MODEL = "openai/gpt-oss-20b"
/** Stronger default for long-form Blog Agent drafts */
export const DEFAULT_BLOG_GROQ_MODEL = "openai/gpt-oss-120b"
export const DEFAULT_OPENAI_MODEL = "gpt-4o-mini"

const GROQ_MODEL_ALIASES: Record<string, string> = {
  "llama-3.3-70b-versatile": DEFAULT_BLOG_GROQ_MODEL,
  "llama-3.1-8b-instant": DEFAULT_GROQ_MODEL,
  "groq/compound": DEFAULT_BLOG_GROQ_MODEL,
  "groq/compound-mini": DEFAULT_GROQ_MODEL,
  "llama3-70b-8192": DEFAULT_BLOG_GROQ_MODEL,
  "llama3-8b-8192": DEFAULT_GROQ_MODEL,
}

function mapGroqModel(raw: string | undefined, fallback: string): string {
  const id = (raw || "").trim() || fallback
  return GROQ_MODEL_ALIASES[id] || id
}

export function resolveGroqModel() {
  return mapGroqModel(process.env.GROQ_MODEL, DEFAULT_GROQ_MODEL)
}

/** Blog Agent prefers BLOG_GROQ_MODEL, then GROQ_MODEL, then the strong default. */
export function resolveBlogGroqModel() {
  const preferred =
    process.env.BLOG_GROQ_MODEL?.trim() ||
    process.env.GROQ_MODEL?.trim() ||
    DEFAULT_BLOG_GROQ_MODEL
  return mapGroqModel(preferred, DEFAULT_BLOG_GROQ_MODEL)
}

export function resolveOpenAIModel() {
  return process.env.OPENAI_MODEL?.trim() || DEFAULT_OPENAI_MODEL
}
