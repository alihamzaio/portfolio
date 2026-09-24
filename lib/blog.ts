import { promises as fs } from "fs"
import path from "path"

export type BlogReference = {
  title: string
  url: string
}

export type BlogStatus = "draft" | "published"

export type BlogPost = {
  slug: string
  title: string
  excerpt: string
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
  /** draft = not on public /blog; published = live */
  status?: BlogStatus
  body: string
}

/** Admin list row includes where the file lives */
export type BlogPostAdmin = BlogPost & {
  status: BlogStatus
  path: string
}

const BLOG_DIR = path.join(process.cwd(), "content", "blog")
const DRAFTS_DIR = path.join(BLOG_DIR, "drafts")

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

async function readPostsFromDir(
  dir: string,
  status: BlogStatus
): Promise<BlogPostAdmin[]> {
  try {
    const names = await fs.readdir(dir)
    const posts: BlogPostAdmin[] = []
    for (const name of names) {
      if (!name.endsWith(".json")) continue
      const filePath = path.join(dir, name)
      const raw = await fs.readFile(filePath, "utf8")
      const parsed = JSON.parse(raw) as unknown
      if (!isPost(parsed)) continue
      posts.push({
        ...parsed,
        status: parsed.status || status,
        path:
          status === "draft"
            ? `content/blog/drafts/${parsed.slug}.json`
            : `content/blog/${parsed.slug}.json`,
      })
    }
    return posts
  } catch {
    return []
  }
}

/** Public site: published posts only (top-level content/blog/*.json). */
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const posts = await readPostsFromDir(BLOG_DIR, "published")
  return posts
    .filter((p) => p.status !== "draft")
    .sort((a, b) => b.date.localeCompare(a.date))
}

/** Admin: drafts + published from the local deploy filesystem. */
export async function getAllBlogPostsAdmin(): Promise<BlogPostAdmin[]> {
  const [published, drafts] = await Promise.all([
    readPostsFromDir(BLOG_DIR, "published"),
    readPostsFromDir(DRAFTS_DIR, "draft"),
  ])
  const bySlug = new Map<string, BlogPostAdmin>()
  for (const p of published) {
    const status: BlogStatus = p.status === "draft" ? "draft" : "published"
    bySlug.set(p.slug, { ...p, status })
  }
  for (const p of drafts) {
    bySlug.set(p.slug, { ...p, status: "draft" })
  }
  return [...bySlug.values()].sort((a, b) => b.date.localeCompare(a.date))
}

export async function getPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const safe = slug.replace(/[^a-z0-9-]/gi, "").toLowerCase()
  if (!safe) return undefined
  try {
    const raw = await fs.readFile(path.join(BLOG_DIR, `${safe}.json`), "utf8")
    const parsed = JSON.parse(raw) as unknown
    if (!isPost(parsed) || parsed.status === "draft") return undefined
    return parsed
  } catch {
    return undefined
  }
}

export async function getBlogSlugs(): Promise<string[]> {
  const posts = await getAllBlogPosts()
  return posts.map((p) => p.slug)
}

export function blogFilePath(slug: string, status: BlogStatus = "published"): string {
  const safe = slug.replace(/[^a-z0-9-]/gi, "").toLowerCase()
  if (status === "draft") return `content/blog/drafts/${safe}.json`
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
