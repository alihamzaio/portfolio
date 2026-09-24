import { githubSyncConfig } from "@/lib/github-sync-config"
import {
  createAndAutoMergePullRequest,
  ensureBranchFromSha,
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
): Promise<{ prUrl: string; merged: boolean }> {
  const token = getGitHubToken()
  if (!token) throw new Error("GITHUB_TOKEN is not configured")

  const { repo, baseBranch } = githubSyncConfig
  const filePath = relativePath.replace(/\\/g, "/")
  const mainSha = await getBranchSha(token, repo, baseBranch)
  // Always rebase content/live onto latest main before writing so admin PRs do not pile up conflicts.
  await ensureBranchFromSha(token, repo, LIVE_CONTENT_BRANCH, mainSha)
  await putFileContent(token, repo, LIVE_CONTENT_BRANCH, filePath, content, message)

  const result = await createAndAutoMergePullRequest(
    token,
    repo,
    LIVE_CONTENT_BRANCH,
    baseBranch,
    "Admin content updates",
    [
      "Live content from the admin panel.",
      "",
      "This PR is opened and squash-merged automatically so production stays in sync.",
      `- File: \`${filePath}\``,
    ].join("\n"),
    message.slice(0, 72)
  )

  return { prUrl: result.prUrl, merged: result.merged }
}
