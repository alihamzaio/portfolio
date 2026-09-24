import {
  deleteFileContent,
  getGitHubToken,
  mergePullRequestWithRetry,
  putBase64FileContent,
  putFileContent,
} from "@/lib/github-api"
import {
  blogFilePath,
  estimateReadTime,
  slugifyTitle,
  type BlogPost,
  type BlogReference,
  type BlogStatus,
} from "@/lib/blog"
import { DEFAULT_BLOG_COVER } from "@/lib/blog-cover"
import { githubSyncConfig } from "@/lib/github-sync-config"

export type BlogIngestInput = {
  title: string
  excerpt?: string
  metaDescription?: string
  body: string
  category?: string
  slug?: string
  date?: string
  featured?: boolean
  author?: string
  source?: string
  coverImage?: string
  coverImageAlt?: string
  tags?: string[]
  keywords?: string[]
  references?: BlogReference[]
  youtubeUrl?: string
  youtubeId?: string
  readTime?: string
  /** draft | published — default published for automation */
  status?: BlogStatus
  autoMerge?: boolean
}

function normalizePost(input: BlogIngestInput): BlogPost {
  const title = input.title.trim()
  if (!title) throw new Error("title is required")
  const body = input.body.trim()
  if (!body) throw new Error("body is required")
  const slug = (input.slug || slugifyTitle(title)).replace(/[^a-z0-9-]/gi, "").toLowerCase()
  if (!slug) throw new Error("slug is invalid")

  const excerpt = (input.excerpt || body.replace(/\s+/g, " ").slice(0, 200)).trim()
  const status: BlogStatus = input.status === "draft" ? "draft" : "published"

  return {
    slug,
    title,
    excerpt,
    metaDescription: input.metaDescription?.trim() || excerpt.slice(0, 160),
    date: input.date || new Date().toISOString().slice(0, 10),
    readTime: input.readTime || estimateReadTime(body),
    category: input.category || "Full Stack",
    featured: Boolean(input.featured),
    author: input.author || "Ali Hamza",
    source: input.source || "Ali Hamza Blog Agent",
    coverImage: input.coverImage?.trim() || DEFAULT_BLOG_COVER,
    coverImageAlt: input.coverImageAlt || "Ali Hamza - Full Stack Developer",
    tags: input.tags,
    keywords: input.keywords,
    references: input.references,
    youtubeUrl: input.youtubeUrl,
    youtubeId: input.youtubeId,
    status,
    body,
  }
}

/**
 * Create or update a blog JSON on main (no waiting PR).
 * Drafts land in content/blog/drafts/; published in content/blog/.
 */
export async function createBlogPullRequest(input: BlogIngestInput) {
  const token = getGitHubToken()
  if (!token) throw new Error("GITHUB_TOKEN is not configured on the portfolio")

  const post = normalizePost(input)
  const { repo, baseBranch } = githubSyncConfig
  const status = post.status || "published"
  const filePath = blogFilePath(post.slug, status)
  const content = `${JSON.stringify(post, null, 2)}\n`
  const message = status === "draft" ? `blog: draft ${post.slug}` : `blog: publish ${post.slug}`

  const write = await putFileContent(token, repo, baseBranch, filePath, content, message)

  if (status === "published") {
    const draftPath = blogFilePath(post.slug, "draft")
    await deleteFileContent(token, repo, baseBranch, draftPath, `blog: remove draft ${post.slug}`).catch(
      () => false
    )
  }

  return {
    ok: true as const,
    slug: post.slug,
    path: filePath,
    status,
    branch: baseBranch,
    prUrl: write.commitUrl || `https://github.com/${repo}/tree/${baseBranch}/${filePath}`,
    prNumber: 0,
    merge: { merged: true, sha: write.sha, message: "committed to main" },
    postUrl: status === "published" ? `/blog/${post.slug}` : null,
  }
}

/** Delete draft and/or published blog JSON on main. */
export async function deleteBlogPullRequest(slug: string, _autoMerge = true) {
  const token = getGitHubToken()
  if (!token) throw new Error("GITHUB_TOKEN is not configured on the portfolio")

  const safe = slug.replace(/[^a-z0-9-]/gi, "").toLowerCase()
  if (!safe) throw new Error("slug is invalid")

  const { repo, baseBranch } = githubSyncConfig
  const publishedPath = blogFilePath(safe, "published")
  const draftPath = blogFilePath(safe, "draft")

  const removedPublished = await deleteFileContent(
    token,
    repo,
    baseBranch,
    publishedPath,
    `blog: delete ${safe}`
  )
  const removedDraft = await deleteFileContent(
    token,
    repo,
    baseBranch,
    draftPath,
    `blog: delete draft ${safe}`
  )

  if (!removedPublished && !removedDraft) {
    throw new Error(`No blog file found for slug "${safe}"`)
  }

  return {
    ok: true as const,
    slug: safe,
    removed: {
      published: removedPublished,
      draft: removedDraft,
    },
    branch: baseBranch,
    prUrl: `https://github.com/${repo}/commits/${baseBranch}`,
    prNumber: 0,
    merge: { merged: true, message: "deleted on main" },
  }
}

export async function mergeBlogPullRequest(prNumber: number, commitTitle?: string) {
  const token = getGitHubToken()
  if (!token) throw new Error("GITHUB_TOKEN is not configured on the portfolio")
  const { repo } = githubSyncConfig
  const result = await mergePullRequestWithRetry(token, repo, prNumber, commitTitle)
  return { ok: true as const, prNumber, ...result }
}

/**
 * Upload a cover image into public/blog/covers/ on main.
 * Returns the public path e.g. /blog/covers/my-slug.jpg
 */
export async function uploadBlogCoverViaPr(opts: {
  fileName: string
  contentBase64: string
  autoMerge?: boolean
}) {
  const token = getGitHubToken()
  if (!token) throw new Error("GITHUB_TOKEN is not configured on the portfolio")

  const safeName = opts.fileName
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
  if (!safeName || !/\.(jpe?g|png|webp|gif)$/i.test(safeName)) {
    throw new Error("Cover must be a .jpg, .png, .webp, or .gif file")
  }

  const { repo, baseBranch } = githubSyncConfig
  const filePath = `public/blog/covers/${safeName}`
  const publicPath = `/blog/covers/${safeName}`

  const write = await putBase64FileContent(
    token,
    repo,
    baseBranch,
    filePath,
    opts.contentBase64,
    `blog: cover ${safeName}`
  )

  return {
    ok: true as const,
    path: publicPath,
    filePath,
    branch: baseBranch,
    prUrl: write.commitUrl || `https://github.com/${repo}/blob/${baseBranch}/${filePath}`,
    prNumber: 0,
    merge: { merged: true, sha: write.sha, message: "committed to main" },
  }
}
