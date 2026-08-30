const DEFAULT_REPO = "alihamzaio/portfolio"
const DEFAULT_BRANCH = "main"

export type GitHubSyncResult = {
  committed: boolean
  sha?: string
  error?: string
}

function getGitHubConfig() {
  const token = process.env.GITHUB_TOKEN?.trim()
  if (!token) return null

  return {
    token,
    repo: (process.env.GITHUB_REPO || DEFAULT_REPO).trim(),
    branch: (process.env.GITHUB_BRANCH || DEFAULT_BRANCH).trim(),
    authorName: (process.env.GITHUB_COMMIT_AUTHOR_NAME || "Ali Hamza").trim(),
    authorEmail: (process.env.GITHUB_COMMIT_AUTHOR_EMAIL || "alihamza.devstack@gmail.com").trim(),
  }
}

export function isGitHubSyncEnabled() {
  return Boolean(getGitHubConfig())
}

export function shouldSyncToGitHub() {
  if (!isGitHubSyncEnabled()) return false
  if (process.env.GITHUB_SYNC_ON_LOCAL === "true") return true
  return process.env.VERCEL === "1"
}

async function getFileSha(
  repo: string,
  branch: string,
  filePath: string,
  token: string
): Promise<string | undefined> {
  const url = `https://api.github.com/repos/${repo}/contents/${filePath}?ref=${encodeURIComponent(branch)}`
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    cache: "no-store",
  })

  if (res.status === 404) return undefined
  if (!res.ok) {
    const detail = await res.text().catch(() => "")
    throw new Error(`GitHub read failed (${res.status}): ${detail.slice(0, 200)}`)
  }

  const data = (await res.json()) as { sha?: string }
  return data.sha
}

export async function syncJsonFileToGitHub(
  relativePath: string,
  content: string,
  commitMessage: string
): Promise<GitHubSyncResult> {
  const config = getGitHubConfig()
  if (!config) {
    return { committed: false, error: "GITHUB_TOKEN is not configured" }
  }

  const filePath = relativePath.replace(/\\/g, "/")
  const encoded = Buffer.from(content, "utf8").toString("base64")

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const sha = await getFileSha(config.repo, config.branch, filePath, config.token)

      const res = await fetch(`https://api.github.com/repos/${config.repo}/contents/${filePath}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${config.token}`,
          Accept: "application/vnd.github+json",
          "Content-Type": "application/json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
        body: JSON.stringify({
          message: commitMessage,
          content: encoded,
          branch: config.branch,
          ...(sha ? { sha } : {}),
          author: { name: config.authorName, email: config.authorEmail },
          committer: { name: config.authorName, email: config.authorEmail },
        }),
        cache: "no-store",
      })

      if (res.status === 409 && attempt < 2) continue

      if (!res.ok) {
        const detail = await res.text().catch(() => "")
        return {
          committed: false,
          error: `GitHub write failed (${res.status}): ${detail.slice(0, 240)}`,
        }
      }

      const data = (await res.json()) as { commit?: { sha?: string } }
      return { committed: true, sha: data.commit?.sha }
    } catch (err) {
      if (attempt === 2) {
        return {
          committed: false,
          error: err instanceof Error ? err.message : "GitHub sync failed",
        }
      }
    }
  }

  return { committed: false, error: "GitHub sync failed after retries" }
}
