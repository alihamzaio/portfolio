import { copy } from "@/lib/copy"
import { getShowcaseProjects } from "@/lib/projects"
import { skillCategories } from "@/lib/skills-data"
import { siteConfig } from "@/lib/site"

export type ChatRole = "user" | "assistant" | "system"
export type ChatMessage = { role: ChatRole; content: string }

export type AgentMode = "explorer" | "brief"
export type AgentUiState = "idle" | "loading" | "streaming" | "success" | "error" | "rate_limited"

export type ProjectBrief = {
  productIdea: string
  productType: string
  audience: string
  importantFeatures: string
  preferredTechnology: string
  timeline: string
  contactMethod: string
  contactValue: string
}

export const intelligenceSteps = [
  { label: "Explore", detail: "Browse work and stack already on this site." },
  { label: "Understand", detail: "Match your product type to relevant systems." },
  { label: "Define", detail: "Shape a clear project brief, one question at a time." },
  { label: "Connect", detail: "Review the brief, then send it to Ali." },
] as const

export const intelligencePrompts = [
  "Show me projects like my idea.",
  "What can Ali build?",
  "Explain the full-stack architecture.",
  "I need help planning a product.",
  "Start a project brief.",
] as const

const REPLY_TIME = "I typically reply within one business day."

const showcaseProjects = getShowcaseProjects(12)
const featuredProjects = showcaseProjects.filter((p) => p.featured).slice(0, 6)
const selectedProjects = (featuredProjects.length ? featuredProjects : showcaseProjects.slice(0, 6)).map((p) => ({
  id: String(p.id),
  title: p.title,
  shortTitle: p.title.split(/[-–:]/)[0]?.trim() || p.title,
  description: p.description,
  details: p.details,
  tags: p.tags,
  link: p.link,
  github: p.github,
}))

const stackLayers = skillCategories.map((cat) => ({
  id: cat.id,
  label: cat.title,
  tech: cat.skills.map((s) => s.name),
}))

export const emptyBrief = (): ProjectBrief => ({
  productIdea: "",
  productType: "",
  audience: "",
  importantFeatures: "",
  preferredTechnology: "",
  timeline: "",
  contactMethod: "",
  contactValue: "",
})

export const BRIEF_QUESTIONS: Array<{ key: keyof ProjectBrief; prompt: string }> = [
  { key: "productIdea", prompt: "What are you trying to build?" },
  {
    key: "productType",
    prompt:
      "What type of product is it — website, dashboard, e-commerce, API, backend system, or something else?",
  },
  { key: "audience", prompt: "Who will use it?" },
  { key: "importantFeatures", prompt: "Which features matter most right now?" },
  { key: "preferredTechnology", prompt: "Do you have a preferred technology stack?" },
  { key: "timeline", prompt: "What is your approximate timeline?" },
  { key: "contactMethod", prompt: "What is the best contact method — email, WhatsApp, or phone?" },
  { key: "contactValue", prompt: "What contact details should Ali use?" },
]

export const portfolioKnowledge = {
  name: siteConfig.name,
  title: siteConfig.title,
  location: siteConfig.location,
  email: siteConfig.email,
  phone: siteConfig.phone,
  available: siteConfig.available,
  replyTime: REPLY_TIME,
  positioning: copy.hero.h1,
  subhead: copy.hero.lead,
  about: copy.sections.about.bio,
  aboutTitle: copy.sections.about.title,
  aboutDescription: copy.sections.about.description,
  specialties: siteConfig.specialties,
  services: copy.services.map((s) => ({ title: s.title, description: s.desc })),
  layers: stackLayers,
  contactTypes: copy.services.map((s) => s.title),
  selected: selectedProjects,
  archive: showcaseProjects
    .filter((p) => !selectedProjects.some((s) => s.id === String(p.id)))
    .slice(0, 6)
    .map((p) => ({
      id: String(p.id),
      title: p.title,
      shortTitle: p.title.split(/[-–:]/)[0]?.trim() || p.title,
      description: p.description,
      tags: p.tags,
      link: p.link,
      github: p.github,
    })),
}

function normalize(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim()
}

export function recommendProjects(query: string, limit = 3) {
  const q = normalize(query)
  const pool = [...portfolioKnowledge.selected, ...portfolioKnowledge.archive]
  const scored = pool
    .map((p) => {
      const hay = normalize(`${p.title} ${p.description} ${p.tags.join(" ")}`)
      let score = 0
      for (const token of q.split(" ")) {
        if (token.length < 3) continue
        if (hay.includes(token)) score += 2
      }
      if (/e-?commerce|store|shop|order/.test(q) && /e-commerce|store|shop|order/.test(hay)) score += 4
      if (/blockchain|web3|nft|defi|indexer|crawler/.test(q) && /blockchain|web3|nft|defi|index|crawler/.test(hay))
        score += 4
      if (/health|medical|care|patient/.test(q) && /health|medical|care|patient|therapy/.test(hay)) score += 4
      if (/dashboard|ops|energy|gas|campaign|kpi/.test(q) && /dashboard|ops|energy|gas|campaign|kpi|monitor/.test(hay))
        score += 4
      if (/api|backend|node|postgres|mongo/.test(q) && /api|node|postgres|mongo|express/.test(hay)) score += 3
      return { project: p, score }
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)

  const picks = (scored.length ? scored : portfolioKnowledge.selected.map((p) => ({ project: p, score: 1 }))).slice(
    0,
    limit
  )

  return picks.map(({ project }) => project)
}

export function askPortfolioQuestion(message: string): string {
  const q = normalize(message)

  if (/(hi|hello|hey|salam)\b/.test(q)) {
    return `Hello — I'm Project Intelligence for ${portfolioKnowledge.name}'s portfolio. I can explore the work, explain the stack, or help you prepare a project brief. What would you like to do?`
  }

  if (/(who (are|is) (you|ali)|about ali|tell me about)\b/.test(q)) {
    return `${portfolioKnowledge.name} is a ${portfolioKnowledge.title} based in ${portfolioKnowledge.location}. ${portfolioKnowledge.aboutDescription} I am an assistant on this portfolio — not Ali.`
  }

  if (/(process|full.?stack process|how (do|does) (you|he) (work|build|deliver))\b/.test(q)) {
    return `From the portfolio: interfaces with React and Next.js, application systems with Node.js and Express, data with MongoDB and PostgreSQL, and delivery with Docker and CI/CD. ${portfolioKnowledge.about[0]}`
  }

  if (/(stack|technolog|skills|tools|what can you build|capabilities)\b/.test(q)) {
    const tech = stackLayers.flatMap((l) => l.tech).join(", ")
    return `Listed capabilities include ${tech}. Day-to-day positioning: ${portfolioKnowledge.subhead}`
  }

  if (/(contact|email|whatsapp|phone|reach|hire|available)\b/.test(q)) {
    return `${portfolioKnowledge.name} is ${portfolioKnowledge.available ? "available" : "currently limited"} for full-time and contract work. Contact: ${portfolioKnowledge.email}, ${portfolioKnowledge.phone}. ${portfolioKnowledge.replyTime}`
  }

  if (/(project|work|relevant|show me|recommend|portfolio|adam|verana|magic|handen|solanity|dotgod)\b/.test(q)) {
    const picks = recommendProjects(message, 3)
    return `Relevant work from this portfolio:\n${picks
      .map((p) => `• ${p.title} — ${p.description}`)
      .join("\n")}\nWould you like to turn this into a project brief?`
  }

  return `I can only use facts from this portfolio. Ask about selected work, the stack, the delivery process, or say “I have a product idea” to start a brief.`
}

export function startProjectBrief(): { reply: string; brief: ProjectBrief; step: number } {
  return {
    reply: `We'll prepare a concise project brief for Ali — one question at a time. ${BRIEF_QUESTIONS[0]!.prompt}`,
    brief: emptyBrief(),
    step: 0,
  }
}

export function formatBrief(brief: ProjectBrief): string {
  return [
    "Project brief draft",
    `Idea: ${brief.productIdea || "—"}`,
    `Type: ${brief.productType || "—"}`,
    `Audience: ${brief.audience || "—"}`,
    `Features: ${brief.importantFeatures || "—"}`,
    `Preferred tech: ${brief.preferredTechnology || "—"}`,
    `Timeline: ${brief.timeline || "—"}`,
    `Contact: ${brief.contactMethod || "—"} ${brief.contactValue || ""}`.trim(),
  ].join("\n")
}

export function advanceBrief(
  brief: ProjectBrief,
  step: number,
  answer: string
): { brief: ProjectBrief; step: number; reply: string; complete: boolean } {
  const current = BRIEF_QUESTIONS[step]
  if (!current) {
    return {
      brief,
      step,
      reply: `Brief is ready to review.\n\n${formatBrief(brief)}\n\nUse “Review Project Brief”, edit if needed, then “Send to Ali”.`,
      complete: true,
    }
  }

  const nextBrief = { ...brief, [current.key]: answer.trim() }
  const nextStep = step + 1
  if (nextStep >= BRIEF_QUESTIONS.length) {
    return {
      brief: nextBrief,
      step: nextStep,
      reply: `Thanks — here is the draft brief.\n\n${formatBrief(nextBrief)}\n\nReview it, edit if needed, then send to Ali. I cannot promise pricing or delivery dates.`,
      complete: true,
    }
  }

  return {
    brief: nextBrief,
    step: nextStep,
    reply: `Noted. ${BRIEF_QUESTIONS[nextStep]!.prompt}`,
    complete: false,
  }
}

export function buildIntelligenceSystemPrompt(): string {
  const selected = portfolioKnowledge.selected
    .map((p) => `${p.title}: ${p.description} Tags: ${p.tags.join(", ")}`)
    .join("\n")
  return `You are Project Intelligence for ${portfolioKnowledge.name}'s software engineering portfolio.
You are not Ali. Never invent clients, metrics, prices, timelines, or technologies not listed.
Modes: Portfolio Explorer and Project Brief Builder.
In brief mode ask one question at a time.
When recommending projects, cite titles and explain relevance only from known descriptions.
Facts:
Positioning: ${portfolioKnowledge.positioning}
About: ${portfolioKnowledge.about.join(" ")}
Stack layers: ${stackLayers.map((l) => `${l.label}: ${l.tech.join(", ")}`).join(" | ")}
Selected projects:
${selected}
Contact: ${portfolioKnowledge.email}, ${portfolioKnowledge.phone}
Writing style: clean human-readable prose. Use short paragraphs. For lists use a simple bullet character (•) at the start of each line. Do not use markdown headings (#), bold markers (**), italics markers, code fences, or HTML. Keep answers concise and professional. End with “Would you like to turn this into a project brief?” when appropriate.`
}

export function sanitizeText(input: string, max = 800): string {
  return input.replace(/[\u0000-\u001F\u007F]/g, "").trim().slice(0, max)
}

export function validateBrief(brief: ProjectBrief): string | null {
  if (!brief.productIdea.trim()) return "Product idea is required."
  if (!brief.contactValue.trim()) return "Contact details are required."
  if (brief.contactMethod.toLowerCase().includes("email") && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(brief.contactValue)) {
    return "Enter a valid email address."
  }
  return null
}
