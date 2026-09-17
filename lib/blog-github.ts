import {
  createPullRequestDetailed,
  deleteFileContent,
  ensureBranchFromSha,
  getBranchSha,
  getGitHubToken,
  mergePullRequest,
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
    source: input.source || "DevBuildDaily",
    coverImage: input.coverImage?.trim() || DEFAULT_BLOG_COVER,
    coverImageAlt: input.coverImageAlt || "Ali Hamza — Full Stack Developer",
    tags: input.tags,
    keywords: input.keywords,
    references: input.references,
    youtubeUrl: input.youtubeUrl,
    youtubeId: input.youtubeId,
    status,
    body,
  }
}

async function openBlogPr(opts: {
  branch: string
  title: string
  body: string
  autoMerge?: boolean
  mergeTitle?: string
}) {
  const token = getGitHubToken()
  if (!token) throw new Error("GITHUB_TOKEN is not configured on the portfolio")
  const { repo, baseBranch } = githubSyncConfig

  const pr = await createPullRequestDetailed(
    token,
    repo,
    opts.branch,
    baseBranch,
    opts.title,
    opts.body
  )

  let merge: { merged: boolean; sha?: string; message: string } | null = null
  if (opts.autoMerge) {
    merge = await mergePullRequest(token, repo, pr.number, opts.mergeTitle)
  }

  return { token, repo, pr, merge }
}

/**
 * Create or update a blog JSON via PR (+ optional merge).
 * Drafts land in content/blog/drafts/; published in content/blog/.
 * Publishing removes a matching draft file in the same PR when present.
 */
export async function createBlogPullRequest(input: BlogIngestInput) {
  const token = getGitHubToken()
  if (!token) throw new Error("GITHUB_TOKEN is not configured on the portfolio")

  const post = normalizePost(input)
  const { repo, baseBranch } = githubSyncConfig
  const status = post.status || "published"
  const branch = `blog/${status}-${post.slug}-${Date.now().toString(36)}`.slice(0, 100)
  const filePath = blogFilePath(post.slug, status)
  const content = `${JSON.stringify(post, null, 2)}\n`

  const mainSha = await getBranchSha(token, repo, baseBranch)
  await ensureBranchFromSha(token, repo, branch, mainSha)
  await putFileContent(
    token,
    repo,
    branch,
    filePath,
    content,
    status === "draft" ? `blog: draft ${post.slug}` : `blog: publish ${post.slug}`
  )

  // When publishing, drop draft copy if it exists
  if (status === "published") {
    const draftPath = blogFilePath(post.slug, "draft")
    await deleteFileContent(token, repo, branch, draftPath, `blog: remove draft ${post.slug}`).catch(
      () => false
    )
  }

  const { pr, merge } = await openBlogPr({
    branch,
    title: status === "draft" ? `Blog draft: ${post.title}` : `Blog: ${post.title}`,
    body: [
      status === "draft"
        ? `Draft blog post from **${post.source || "admin"}**.`
        : `Blog post from **${post.source || "DevBuildDaily"}**.`,
      "",
      `- Slug: \`${post.slug}\``,
      `- Status: ${status}`,
      `- Category: ${post.category}`,
      `- Path: \`${filePath}\``,
      post.youtubeUrl ? `- YouTube: ${post.youtubeUrl}` : "",
    ]
      .filter(Boolean)
      .join("\n"),
    autoMerge: input.autoMerge,
    mergeTitle: `blog: ${post.slug}`,
  })

  return {
    ok: true as const,
    slug: post.slug,
    path: filePath,
    status,
    branch,
    prUrl: pr.url,
    prNumber: pr.number,
    merge,
    postUrl: status === "published" ? `/blog/${post.slug}` : null,
  }
}

/** Delete draft and/or published blog JSON via PR (+ optional merge). */
export async function deleteBlogPullRequest(slug: string, autoMerge = true) {
  const token = getGitHubToken()
  if (!token) throw new Error("GITHUB_TOKEN is not configured on the portfolio")

  const safe = slug.replace(/[^a-z0-9-]/gi, "").toLowerCase()
  if (!safe) throw new Error("slug is invalid")

  const { repo, baseBranch } = githubSyncConfig
  const branch = `blog/delete-${safe}-${Date.now().toString(36)}`.slice(0, 100)
  const publishedPath = blogFilePath(safe, "published")
  const draftPath = blogFilePath(safe, "draft")

  const mainSha = await getBranchSha(token, repo, baseBranch)
  await ensureBranchFromSha(token, repo, branch, mainSha)

  const removedPublished = await deleteFileContent(
    token,
    repo,
    branch,
    publishedPath,
    `blog: delete ${safe}`
  )
  const removedDraft = await deleteFileContent(
    token,
    repo,
    branch,
    draftPath,
    `blog: delete draft ${safe}`
  )

  if (!removedPublished && !removedDraft) {
    throw new Error(`No blog file found for slug "${safe}"`)
  }

  const { pr, merge } = await openBlogPr({
    branch,
    title: `Blog delete: ${safe}`,
    body: [
      `Delete blog post \`${safe}\`.`,
      "",
      removedPublished ? `- Removed \`${publishedPath}\`` : "",
      removedDraft ? `- Removed \`${draftPath}\`` : "",
    ]
      .filter(Boolean)
      .join("\n"),
    autoMerge,
    mergeTitle: `blog: delete ${safe}`,
  })

  return {
    ok: true as const,
    slug: safe,
    removed: {
      published: removedPublished,
      draft: removedDraft,
    },
    branch,
    prUrl: pr.url,
    prNumber: pr.number,
    merge,
  }
}

export async function mergeBlogPullRequest(prNumber: number, commitTitle?: string) {
  const token = getGitHubToken()
  if (!token) throw new Error("GITHUB_TOKEN is not configured on the portfolio")
  const { repo } = githubSyncConfig
  const result = await mergePullRequest(token, repo, prNumber, commitTitle)
  return { ok: true as const, prNumber, ...result }
}

/**
 * Upload a cover image into public/blog/covers/ via PR (+ optional merge).
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
  const branch = `blog/cover-${Date.now().toString(36)}`.slice(0, 100)
  const filePath = `public/blog/covers/${safeName}`
  const publicPath = `/blog/covers/${safeName}`

  const mainSha = await getBranchSha(token, repo, baseBranch)
  await ensureBranchFromSha(token, repo, branch, mainSha)
  await putBase64FileContent(
    token,
    repo,
    branch,
    filePath,
    opts.contentBase64,
    `blog: cover ${safeName}`
  )

  const { pr, merge } = await openBlogPr({
    branch,
    title: `Blog cover: ${safeName}`,
    body: [`Upload cover image \`${filePath}\`.`, "", `- Public path: \`${publicPath}\``].join("\n"),
    autoMerge: opts.autoMerge !== false,
    mergeTitle: `blog: cover ${safeName}`,
  })

  return {
    ok: true as const,
    path: publicPath,
    filePath,
    branch,
    prUrl: pr.url,
    prNumber: pr.number,
    merge,
  }
}
