/**
 * Default models for free-tier keys.
 * Override only if needed: GROQ_MODEL / OPENAI_MODEL
 */
export const DEFAULT_GROQ_MODEL = "groq/compound-mini"
export const DEFAULT_OPENAI_MODEL = "gpt-4o-mini"

export function resolveGroqModel() {
  return process.env.GROQ_MODEL?.trim() || DEFAULT_GROQ_MODEL
}

export function resolveOpenAIModel() {
  return process.env.OPENAI_MODEL?.trim() || DEFAULT_OPENAI_MODEL
}
