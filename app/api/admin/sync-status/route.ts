import { NextResponse } from "next/server"
import { githubSyncConfig } from "@/lib/github-sync-config"
import { isGitHubSyncEnabled } from "@/lib/github-api"
import { hasKvStore } from "@/lib/store"

export async function GET() {
  const kvConfigured = hasKvStore()
  const githubConfigured = isGitHubSyncEnabled()

  let mode: "kv-live" | "github-live" | "local-files" | "needs-storage" = "local-files"
  if (kvConfigured) mode = "kv-live"
  else if (githubConfigured && process.env.VERCEL === "1") mode = "github-live"
  else if (process.env.VERCEL === "1") mode = "needs-storage"

  return NextResponse.json({
    mode,
    githubConfigured,
    kvConfigured,
    githubRepo: githubSyncConfig.repo,
    githubBranch: githubSyncConfig.baseBranch,
    cronSync: "Every 6 hours — one PR for all pending admin changes",
    message:
      mode === "kv-live"
        ? "Admin saves go live instantly (Redis). GitHub PR opens on schedule when content changed."
        : mode === "github-live"
          ? "Admin saves update live content on GitHub. One scheduled PR merges changes to main."
          : mode === "needs-storage"
            ? "Add Upstash Redis in Vercel Storage, or set GITHUB_TOKEN with repo scope."
            : "Admin saves update local JSON files.",
  })
}
