import { githubSyncConfig } from "@/lib/github-sync-config"
import {
  createPullRequest,
  ensureBranchExists,
  getBranchSha,
  getFileContent,
  getGitHubToken,
  putFileContent,
} from "@/lib/github-api"

export const LIVE_CONTENT_BRANCH = "content/live"

export async function readLiveGitHubFile(relativePath: string): Promise<string | null> {
  const token = getGitHubToken()
  if (!token) return null
  const filePath = relativePath.replace(/\\/g, "/")
  try {
    const file = await getFileContent(token, githubSyncConfig.repo, LIVE_CONTENT_BRANCH, filePath)
    return file?.content ?? null
  } catch {
    return null
  }
}

export async function writeLiveGitHubFile(
  relativePath: string,
  content: string,
  message: string
): Promise<{ prUrl: string }> {
  const token = getGitHubToken()
  if (!token) throw new Error("GITHUB_TOKEN is not configured")

  const { repo, baseBranch } = githubSyncConfig
  const filePath = relativePath.replace(/\\/g, "/")
  const mainSha = await getBranchSha(token, repo, baseBranch)
  await ensureBranchExists(token, repo, LIVE_CONTENT_BRANCH, mainSha)
  await putFileContent(token, repo, LIVE_CONTENT_BRANCH, filePath, content, message)

  const prUrl = await createPullRequest(
    token,
    repo,
    LIVE_CONTENT_BRANCH,
    baseBranch,
    "Admin content updates",
    [
      "Live content from the admin panel.",
      "",
      "Later saves update this same pull request.",
      "Merge when ready to publish the GitHub repo and trigger a production deploy.",
    ].join("\n")
  )

  return { prUrl }
}
