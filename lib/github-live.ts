import { githubSyncConfig } from "@/lib/github-sync-config"
import { ensureBranchFromSha, getBranchSha, getFileContent, getGitHubToken, putFileContent } from "@/lib/github-api"

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

export async function writeLiveGitHubFile(relativePath: string, content: string, message: string): Promise<void> {
  const token = getGitHubToken()
  if (!token) throw new Error("GITHUB_TOKEN is not configured")

  const { repo, baseBranch } = githubSyncConfig
  const filePath = relativePath.replace(/\\/g, "/")
  const mainSha = await getBranchSha(token, repo, baseBranch)
  await ensureBranchFromSha(token, repo, LIVE_CONTENT_BRANCH, mainSha)
  await putFileContent(token, repo, LIVE_CONTENT_BRANCH, filePath, content, message)
}
