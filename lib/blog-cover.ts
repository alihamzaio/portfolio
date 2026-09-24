/** Brand default when no live URL or upload is set. */
export const DEFAULT_BLOG_COVER = "/blog/covers/default.svg"

/** Curated Pexels covers for auto-published Blog Agent posts (no API key). */
const AGENT_COVER_POOL: { url: string; alt: string }[] = [
  {
    url: "https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "Laptop showing code in a modern developer workspace",
  },
  {
    url: "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "Team collaborating around a laptop in a bright office",
  },
  {
    url: "https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "Person writing notes beside a laptop",
  },
  {
    url: "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "Developer working at a desk with multiple screens",
  },
  {
    url: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "Professionals reviewing documents at a meeting table",
  },
  {
    url: "https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "Person planning work with notebook and coffee",
  },
]

export function resolveBlogCover(src?: string | null): string {
  const value = (src || "").trim()
  if (!value) return DEFAULT_BLOG_COVER
  return value
}

export function isDefaultBlogCover(src?: string | null): boolean {
  const value = (src || "").trim()
  return !value || value === DEFAULT_BLOG_COVER
}

/** Pick a stable professional cover from the pool for a given slug. */
export function pickAgentBlogCover(slug: string): { url: string; alt: string } {
  let hash = 0
  for (let i = 0; i < slug.length; i++) {
    hash = (hash * 31 + slug.charCodeAt(i)) >>> 0
  }
  return AGENT_COVER_POOL[hash % AGENT_COVER_POOL.length]
}
