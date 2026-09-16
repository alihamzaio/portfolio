import {
  createPullRequestDetailed,
  ensureBranchFromSha,
  getBranchSha,
  getGitHubToken,
  mergePullRequest,
  putFileContent,
} from "@/lib/github-api"
import {
  blogFilePath,
  estimateReadTime,
  slugifyTitle,
  type BlogPost,
  type BlogReference,
} from "@/lib/blog"
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
    coverImage: input.coverImage,
    coverImageAlt: input.coverImageAlt,
    tags: input.tags,
    keywords: input.keywords,
    references: input.references,
    youtubeUrl: input.youtubeUrl,
    youtubeId: input.youtubeId,
    body,
  }
}

export async function createBlogPullRequest(input: BlogIngestInput) {
  const token = getGitHubToken()
  if (!token) throw new Error("GITHUB_TOKEN is not configured on the portfolio")

  const post = normalizePost(input)
  const { repo, baseBranch } = githubSyncConfig
  const branch = `blog/auto-${post.slug}`.slice(0, 100)
  const filePath = blogFilePath(post.slug)
  const content = `${JSON.stringify(post, null, 2)}\n`

  const mainSha = await getBranchSha(token, repo, baseBranch)
  await ensureBranchFromSha(token, repo, branch, mainSha)
  await putFileContent(token, repo, branch, filePath, content, `blog: add ${post.slug}`)

  const pr = await createPullRequestDetailed(
    token,
    repo,
    branch,
    baseBranch,
    `Blog: ${post.title}`,
    [
      `Auto blog post from **${post.source || "DevBuildDaily"}**.`,
      "",
      `- Slug: \`${post.slug}\``,
      `- Category: ${post.category}`,
      post.youtubeUrl ? `- YouTube: ${post.youtubeUrl}` : "",
    ]
      .filter(Boolean)
      .join("\n")
  )

  let merge: { merged: boolean; sha?: string; message: string } | null = null
  if (input.autoMerge) {
    merge = await mergePullRequest(token, repo, pr.number, `blog: ${post.slug}`)
  }

  return {
    ok: true as const,
    slug: post.slug,
    path: filePath,
    branch,
    prUrl: pr.url,
    prNumber: pr.number,
    merge,
    postUrl: `/blog/${post.slug}`,
  }
}

export async function mergeBlogPullRequest(prNumber: number, commitTitle?: string) {
  const token = getGitHubToken()
  if (!token) throw new Error("GITHUB_TOKEN is not configured on the portfolio")
  const { repo } = githubSyncConfig
  const result = await mergePullRequest(token, repo, prNumber, commitTitle)
  return { ok: true as const, prNumber, ...result }
}
