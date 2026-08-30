import { githubSyncConfig } from "@/lib/github-sync-config"

export type GitHubSyncResult = {
  committed: boolean
  sha?: string
  error?: string
}

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
  const token = getGitHubToken()
  if (!token) {
    return { committed: false, error: "GITHUB_TOKEN is not configured in Vercel" }
  }

  const { repo, branch, authorName, authorEmail } = githubSyncConfig
  const filePath = relativePath.replace(/\\/g, "/")
  const encoded = Buffer.from(content, "utf8").toString("base64")

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const sha = await getFileSha(repo, branch, filePath, token)

      const res = await fetch(`https://api.github.com/repos/${repo}/contents/${filePath}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github+json",
          "Content-Type": "application/json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
        body: JSON.stringify({
          message: commitMessage,
          content: encoded,
          branch,
          ...(sha ? { sha } : {}),
          author: { name: authorName, email: authorEmail },
          committer: { name: authorName, email: authorEmail },
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
