import { githubSyncConfig } from "@/lib/github-sync-config"

export type GitHubSyncResult = {
  committed: boolean
  sha?: string
  prUrl?: string
  branch?: string
  error?: string
}

const GH_API = "https://api.github.com"
const GH_HEADERS = (token: string) => ({
  Authorization: `Bearer ${token}`,
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
})

function getGitHubToken(): string | null {
  const token = process.env.GITHUB_TOKEN?.trim()
  return token || null
}

export function isGitHubSyncEnabled() {
  return Boolean(getGitHubToken())
}

export function shouldSyncToGitHub() {
  if (!isGitHubSyncEnabled()) return false
  if (process.env.GITHUB_SYNC_ON_LOCAL === "true") return true
  return (
    process.env.VERCEL === "1" ||
    process.cwd().includes("/var/task") ||
    !!process.env.AWS_LAMBDA_FUNCTION_NAME
  )
}

function isServerlessRuntime() {
  return (
    process.env.VERCEL === "1" ||
    process.cwd().includes("/var/task") ||
    !!process.env.AWS_LAMBDA_FUNCTION_NAME
  )
}

function adminBranchName(filePath: string) {
  const stamp = new Date().toISOString().replace(/[:.]/g, "").replace("T", "-").slice(0, 15)
  const slug = filePath.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase()
  return `admin/${slug}-${stamp}`
}

async function githubJson<T>(
  token: string,
  path: string,
  init?: RequestInit
): Promise<{ ok: boolean; status: number; data: T | null; text: string }> {
  const res = await fetch(`${GH_API}${path}`, {
    ...init,
    headers: {
      ...GH_HEADERS(token),
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...((init?.headers as Record<string, string>) || {}),
    },
    cache: "no-store",
  })
  const text = await res.text()
  let data: T | null = null
  try {
    data = text ? (JSON.parse(text) as T) : null
  } catch {
    data = null
  }
  return { ok: res.ok, status: res.status, data, text }
}

async function getFileSha(
  token: string,
  repo: string,
  branch: string,
  filePath: string
): Promise<string | undefined> {
  const result = await githubJson<{ sha?: string }>(
    token,
    `/repos/${repo}/contents/${filePath}?ref=${encodeURIComponent(branch)}`
  )
  if (result.status === 404) return undefined
  if (!result.ok) {
    throw new Error(`GitHub read failed (${result.status}): ${result.text.slice(0, 200)}`)
  }
  return result.data?.sha
}

async function findOpenPullRequest(
  token: string,
  repo: string,
  headBranch: string,
  baseBranch: string
): Promise<string | undefined> {
  const owner = repo.split("/")[0]
  const result = await githubJson<{ html_url?: string }[]>(
    token,
    `/repos/${repo}/pulls?state=open&head=${encodeURIComponent(`${owner}:${headBranch}`)}&base=${encodeURIComponent(baseBranch)}`
  )
  return result.data?.[0]?.html_url
}

async function createPullRequest(
  token: string,
  repo: string,
  headBranch: string,
  baseBranch: string,
  title: string,
  body: string
): Promise<string> {
  const existing = await findOpenPullRequest(token, repo, headBranch, baseBranch)
  if (existing) return existing

  const result = await githubJson<{ html_url?: string }>(token, `/repos/${repo}/pulls`, {
    method: "POST",
    body: JSON.stringify({
      title,
      head: headBranch,
      base: baseBranch,
      body,
    }),
  })

  if (result.data?.html_url) return result.data.html_url

  const compareUrl = `https://github.com/${repo}/compare/${baseBranch}...${headBranch}?expand=1`
  if (!result.ok) {
    throw new Error(
      `Commit is on branch ${headBranch}, but the pull request could not be opened (${result.status}). Open: ${compareUrl}. Give the GitHub token Pull requests: Read and write.`
    )
  }

  return compareUrl
}

export async function syncJsonFileToGitHub(
  relativePath: string,
  content: string,
  commitMessage: string
): Promise<GitHubSyncResult> {
  const token = getGitHubToken()
  if (!token) {
    return { committed: false, error: "GITHUB_TOKEN is not configured in Vercel" }
  }

  const { repo, baseBranch, authorName, authorEmail } = githubSyncConfig
  const filePath = relativePath.replace(/\\/g, "/")
  const branch = adminBranchName(filePath)
  const encoded = Buffer.from(content, "utf8").toString("base64")

  try {
    // Commit directly on the admin branch — GitHub creates it from default when missing.
    const fileSha = await getFileSha(token, repo, branch, filePath)
    const put = await githubJson<{ commit?: { sha?: string } }>(token, `/repos/${repo}/contents/${filePath}`, {
      method: "PUT",
      body: JSON.stringify({
        message: commitMessage,
        content: encoded,
        branch,
        ...(fileSha ? { sha: fileSha } : {}),
        author: { name: authorName, email: authorEmail },
        committer: { name: authorName, email: authorEmail },
      }),
    })

    if (!put.ok) {
      const hint =
        put.status === 403
          ? " Give the token Contents: Read and write + Pull requests: Read and write on alihamzaio/portfolio (classic PAT: repo scope)."
          : ""
      return {
        committed: false,
        branch,
        error: `GitHub write failed (${put.status}): ${put.text.slice(0, 240)}.${hint}`,
      }
    }

    const prUrl = await createPullRequest(
      token,
      repo,
      branch,
      baseBranch,
      commitMessage.replace(/\.$/, ""),
      [
        "Content update from the live admin panel.",
        "",
        `- File: \`${filePath}\``,
        `- Branch: \`${branch}\``,
        "",
        "Review and merge this pull request to publish the change on the live site.",
      ].join("\n")
    )

    return {
      committed: true,
      sha: put.data?.commit?.sha,
      branch,
      prUrl,
    }
  } catch (err) {
    return {
      committed: false,
      branch,
      error: err instanceof Error ? err.message : "GitHub sync failed",
    }
  }
}
