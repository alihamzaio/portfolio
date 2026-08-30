import { githubSyncConfig } from "@/lib/github-sync-config"

const GH_API = "https://api.github.com"

export function getGitHubToken(): string | null {
  const token = process.env.GITHUB_TOKEN?.trim()
  return token || null
}

export function isGitHubSyncEnabled() {
  return Boolean(getGitHubToken())
}

export const GH_HEADERS = (token: string) => ({
  Authorization: `Bearer ${token}`,
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
})

export async function githubJson<T>(
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

export async function getBranchSha(token: string, repo: string, branch: string): Promise<string> {
  const result = await githubJson<{ object?: { sha?: string } }>(
    token,
    `/repos/${repo}/git/ref/heads/${encodeURIComponent(branch)}`
  )
  const sha = result.data?.object?.sha
  if (!result.ok || !sha) {
    throw new Error(`Could not read branch ${branch} (${result.status}): ${result.text.slice(0, 200)}`)
  }
  return sha
}

export async function ensureBranchExists(token: string, repo: string, branch: string, fromSha: string) {
  const existing = await githubJson(
    token,
    `/repos/${repo}/git/ref/heads/${encodeURIComponent(branch)}`
  )
  if (existing.ok) return

  const created = await githubJson(token, `/repos/${repo}/git/refs`, {
    method: "POST",
    body: JSON.stringify({ ref: `refs/heads/${branch}`, sha: fromSha }),
  })
  if (!created.ok && created.status !== 422) {
    throw new Error(`Could not create branch ${branch} (${created.status}): ${created.text.slice(0, 200)}`)
  }
}

export async function ensureBranchFromSha(token: string, repo: string, branch: string, fromSha: string) {
  const existing = await githubJson<{ object?: { sha?: string } }>(
    token,
    `/repos/${repo}/git/ref/heads/${encodeURIComponent(branch)}`
  )
  if (existing.ok) {
    await githubJson(token, `/repos/${repo}/git/refs/heads/${encodeURIComponent(branch)}`, {
      method: "PATCH",
      body: JSON.stringify({ sha: fromSha, force: true }),
    })
    return
  }

  const created = await githubJson(token, `/repos/${repo}/git/refs`, {
    method: "POST",
    body: JSON.stringify({ ref: `refs/heads/${branch}`, sha: fromSha }),
  })
  if (!created.ok && created.status !== 422) {
    throw new Error(`Could not create branch ${branch} (${created.status}): ${created.text.slice(0, 200)}`)
  }
}

export async function getFileContent(
  token: string,
  repo: string,
  branch: string,
  filePath: string
): Promise<{ content: string; sha?: string } | null> {
  const result = await githubJson<{ content?: string; sha?: string; encoding?: string }>(
    token,
    `/repos/${repo}/contents/${filePath}?ref=${encodeURIComponent(branch)}`
  )
  if (result.status === 404) return null
  if (!result.ok || !result.data?.content) {
    throw new Error(`GitHub read failed (${result.status}): ${result.text.slice(0, 200)}`)
  }
  const decoded = Buffer.from(result.data.content.replace(/\n/g, ""), "base64").toString("utf8")
  return { content: decoded, sha: result.data.sha }
}

export async function getFileSha(
  token: string,
  repo: string,
  branch: string,
  filePath: string
): Promise<string | undefined> {
  const file = await getFileContent(token, repo, branch, filePath)
  return file?.sha
}

export async function putFileContent(
  token: string,
  repo: string,
  branch: string,
  filePath: string,
  content: string,
  message: string
): Promise<void> {
  const { authorName, authorEmail } = githubSyncConfig
  const fileSha = await getFileSha(token, repo, branch, filePath)
  const encoded = Buffer.from(content, "utf8").toString("base64")
  const result = await githubJson(token, `/repos/${repo}/contents/${filePath}`, {
    method: "PUT",
    body: JSON.stringify({
      message,
      content: encoded,
      branch,
      ...(fileSha ? { sha: fileSha } : {}),
      author: { name: authorName, email: authorEmail },
      committer: { name: authorName, email: authorEmail },
    }),
  })
  if (!result.ok) {
    const hint =
      result.status === 403
        ? " Token needs Contents and Pull requests read/write (classic PAT: repo scope)."
        : ""
    throw new Error(`GitHub write failed (${result.status}): ${result.text.slice(0, 240)}.${hint}`)
  }
}

export async function findOpenPullRequest(
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

export async function createPullRequest(
  token: string,
  repo: string,
  headBranch: string,
  baseBranch: string,
  title: string,
  body: string
): Promise<string> {
  const existing = await findOpenPullRequest(token, repo, headBranch, baseBranch)
  if (existing) return existing

  const result = await githubJson<{ html_url?: string; message?: string }>(token, `/repos/${repo}/pulls`, {
    method: "POST",
    body: JSON.stringify({ title, head: headBranch, base: baseBranch, body }),
  })

  if (result.data?.html_url) return result.data.html_url

  const hint =
    result.status === 403
      ? " Fine-grained token needs Pull requests: Read and write."
      : ""
  throw new Error(`Could not open pull request (${result.status}): ${result.text.slice(0, 240)}.${hint}`)
}
