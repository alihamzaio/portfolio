import { githubSyncConfig } from "@/lib/github-sync-config"
import {
  getFileContent,
  getGitHubToken,
  putFileContent,
} from "@/lib/github-api"
import { STORE_FILE_PATHS, type StoreKey, listStoreKeys } from "@/lib/store-config"
import { clearSyncDirty, getLiveContentForSync, getSyncDirtyKeys } from "@/lib/store"

export const SYNC_PR_BRANCH = "admin/content-sync"

export type BatchSyncResult = {
  ok: boolean
  changed: string[]
  prUrl?: string
  skipped?: string
  error?: string
}

function normalizeJson(text: string): string {
  return JSON.stringify(JSON.parse(text))
}

async function readMainFile(token: string, filePath: string): Promise<string | null> {
  const file = await getFileContent(token, githubSyncConfig.repo, githubSyncConfig.baseBranch, filePath)
  return file?.content ?? null
}

export async function runBatchGitHubSync(): Promise<BatchSyncResult> {
  const token = getGitHubToken()
  if (!token) {
    return { ok: false, changed: [], error: "GITHUB_TOKEN is not configured" }
  }

  const dirtyKeys = await getSyncDirtyKeys()
  const keysToCheck: StoreKey[] = dirtyKeys.length > 0 ? dirtyKeys : listStoreKeys()

  const { repo, baseBranch } = githubSyncConfig
  const changed: string[] = []
  const pending: { path: string; content: string }[] = []

  for (const key of keysToCheck) {
    const filePath = STORE_FILE_PATHS[key]
    const liveContent = await getLiveContentForSync(key)
    if (!liveContent) continue

    const mainContent = await readMainFile(token, filePath)
    try {
      const liveNorm = normalizeJson(liveContent)
      const mainNorm = mainContent ? normalizeJson(mainContent) : null
      if (liveNorm !== mainNorm) {
        changed.push(filePath)
        pending.push({ path: filePath, content: liveContent })
      }
    } catch {
      changed.push(filePath)
      pending.push({ path: filePath, content: liveContent })
    }
  }

  if (pending.length === 0) {
    await clearSyncDirty()
    return {
      ok: true,
      changed: [],
      skipped: "No differences between live content and main",
    }
  }

  try {
    let lastCommitUrl: string | undefined
    for (const file of pending) {
      const write = await putFileContent(
        token,
        repo,
        baseBranch,
        file.path,
        file.content,
        `Sync ${file.path} from admin panel.`
      )
      lastCommitUrl = write.commitUrl || lastCommitUrl
    }

    await clearSyncDirty()

    return {
      ok: true,
      changed,
      prUrl: lastCommitUrl || `https://github.com/${repo}/commits/${baseBranch}`,
    }
  } catch (err) {
    return {
      ok: false,
      changed,
      error: err instanceof Error ? err.message : "Batch GitHub sync failed",
    }
  }
}
