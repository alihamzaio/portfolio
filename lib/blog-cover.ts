/** Brand default when no live URL or upload is set. */
export const DEFAULT_BLOG_COVER = "/blog/covers/default.svg"

export function resolveBlogCover(src?: string | null): string {
  const value = (src || "").trim()
  if (!value) return DEFAULT_BLOG_COVER
  return value
}

export function isDefaultBlogCover(src?: string | null): boolean {
  const value = (src || "").trim()
  return !value || value === DEFAULT_BLOG_COVER
}
