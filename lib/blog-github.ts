import {
  deleteFileContent,
  getFileContent,
  getGitHubToken,
  listRepoDirectory,
  mergePullRequestWithRetry,
  putBase64FileContent,
  putFileContent,
} from "@/lib/github-api"
import {
  blogFilePath,
  estimateReadTime,
  slugifyTitle,
  type BlogPost,
  type BlogPostAdmin,
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

function isBlogPost(value: unknown): value is BlogPost {
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

async function readPostsFromGitHubDir(
  token: string,
  repo: string,
  branch: string,
  dirPath: string,
  folderStatus: BlogStatus
): Promise<BlogPostAdmin[]> {
  const entries = await listRepoDirectory(token, repo, branch, dirPath)
  const jsonFiles = entries.filter((e) => e.type === "file" && e.name.endsWith(".json"))
  const posts: BlogPostAdmin[] = []

  await Promise.all(
    jsonFiles.map(async (entry) => {
      const file = await getFileContent(token, repo, branch, entry.path)
      if (!file?.content) return
      try {
        const parsed = JSON.parse(file.content) as unknown
        if (!isBlogPost(parsed)) return
        const status: BlogStatus =
          parsed.status === "draft" || folderStatus === "draft" ? "draft" : "published"
        // Ignore status:draft files that somehow sit in the published folder path? keep as draft.
        posts.push({
          ...parsed,
          status,
          path: entry.path,
        })
      } catch {
        // skip bad JSON
      }
    })
  )

  return posts
}

/**
 * Admin list from GitHub main (drafts + published).
 * Prefer this over the deploy filesystem so drafts show right after save.
 */
export async function listBlogPostsFromGitHub(): Promise<BlogPostAdmin[] | null> {
  const token = getGitHubToken()
  if (!token) return null

  const { repo, baseBranch } = githubSyncConfig
  try {
    const [published, drafts] = await Promise.all([
      readPostsFromGitHubDir(token, repo, baseBranch, "content/blog", "published"),
      readPostsFromGitHubDir(token, repo, baseBranch, "content/blog/drafts", "draft"),
    ])

    const bySlug = new Map<string, BlogPostAdmin>()
    for (const p of published) {
      // Top-level content/blog/*.json may still be marked draft in JSON
      const status: BlogStatus = p.status === "draft" ? "draft" : "published"
      bySlug.set(p.slug, { ...p, status })
    }
    for (const p of drafts) {
      bySlug.set(p.slug, { ...p, status: "draft" })
    }
    return [...bySlug.values()].sort((a, b) => b.date.localeCompare(a.date))
  } catch {
    return null
  }
}
