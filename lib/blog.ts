import { promises as fs } from "fs"
import path from "path"

export type BlogReference = {
  title: string
  url: string
}

export type BlogPost = {
  slug: string
  title: string
  excerpt: string
  /** SEO meta description (150–160 chars ideal) */
  metaDescription?: string
  date: string
  readTime: string
  category: string
  featured?: boolean
  author?: string
  source?: string
  coverImage?: string
  coverImageAlt?: string
  tags?: string[]
  keywords?: string[]
  youtubeUrl?: string
  youtubeId?: string
  references?: BlogReference[]
  /** Markdown: ## headings, lists, [links](url), ![alt](url), > quotes, ```code``` */
  body: string
}

const BLOG_DIR = path.join(process.cwd(), "content", "blog")

function isPost(value: unknown): value is BlogPost {
  if (!value || typeof value !== "object") return false
  const p = value as Record<string, unknown>
  return (
    typeof p.slug === "string" &&
    typeof p.title === "string" &&
    typeof p.excerpt === "string" &&
    typeof p.date === "string" &&
    typeof p.body === "string"
  )
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  try {
    const names = await fs.readdir(BLOG_DIR)
    const posts: BlogPost[] = []
    for (const name of names) {
      if (!name.endsWith(".json")) continue
      const raw = await fs.readFile(path.join(BLOG_DIR, name), "utf8")
      const parsed = JSON.parse(raw) as unknown
      if (isPost(parsed)) posts.push(parsed)
    }
    return posts.sort((a, b) => b.date.localeCompare(a.date))
  } catch {
    return []
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const safe = slug.replace(/[^a-z0-9-]/gi, "").toLowerCase()
  if (!safe) return undefined
  try {
    const raw = await fs.readFile(path.join(BLOG_DIR, `${safe}.json`), "utf8")
    const parsed = JSON.parse(raw) as unknown
    return isPost(parsed) ? parsed : undefined
  } catch {
    return undefined
  }
}

export async function getBlogSlugs(): Promise<string[]> {
  const posts = await getAllBlogPosts()
  return posts.map((p) => p.slug)
}

export function blogFilePath(slug: string): string {
  const safe = slug.replace(/[^a-z0-9-]/gi, "").toLowerCase()
  return `content/blog/${safe}.json`
}

export function estimateReadTime(body: string): string {
  const words = body.trim().split(/\s+/).filter(Boolean).length
  const mins = Math.max(1, Math.round(words / 200))
  return `${mins} min read`
}

export function slugifyTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80)
}

export function postSeoDescription(post: BlogPost): string {
  return (post.metaDescription || post.excerpt).trim()
}

export function postKeywords(post: BlogPost): string[] {
  const base = post.keywords?.length ? post.keywords : post.tags || []
  return [...new Set([...base, post.category, "Ali Hamza", "Full Stack Developer"])]
}
