import { githubSyncConfig } from "@/lib/github-sync-config"
import {
  getFileContent,
  getGitHubToken,
  putFileContent,
} from "@/lib/github-api"

/** @deprecated Kept for older callers; live content now writes straight to main. */
export const LIVE_CONTENT_BRANCH = "content/live"

export async function readLiveGitHubFile(relativePath: string): Promise<string | null> {
  const token = getGitHubToken()
  if (!token) return null
  const filePath = relativePath.replace(/\\/g, "/")
  try {
    // Prefer main (source of truth). Fall back to legacy content/live if needed.
    const main = await getFileContent(token, githubSyncConfig.repo, githubSyncConfig.baseBranch, filePath)
    if (main?.content) return main.content
    const live = await getFileContent(token, githubSyncConfig.repo, LIVE_CONTENT_BRANCH, filePath)
    return live?.content ?? null
  } catch {
    return null
  }
}

/**
 * Persist admin/CMS JSON directly on main.
 * No pull request: avoids manual merge and stuck content/live PRs.
 */
export async function writeLiveGitHubFile(
  relativePath: string,
  content: string,
  message: string
): Promise<{ prUrl: string; merged: boolean; commitUrl?: string }> {
  const token = getGitHubToken()
  if (!token) throw new Error("GITHUB_TOKEN is not configured")

  const { repo, baseBranch } = githubSyncConfig
  const filePath = relativePath.replace(/\\/g, "/")
  const result = await putFileContent(token, repo, baseBranch, filePath, content, message)

  return {
    prUrl: result.commitUrl || `https://github.com/${repo}/commit/${result.sha || baseBranch}`,
    merged: true,
    commitUrl: result.commitUrl,
  }
}
