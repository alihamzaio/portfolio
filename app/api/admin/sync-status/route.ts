import { NextResponse } from "next/server"
import { githubSyncConfig } from "@/lib/github-sync-config"
import { isGitHubSyncEnabled, shouldSyncToGitHub } from "@/lib/github-sync"

export async function GET() {
  const kvConfigured =
    (!!process.env.KV_REST_API_URL && !!process.env.KV_REST_API_TOKEN) ||
    (!!process.env.UPSTASH_REDIS_REST_URL && !!process.env.UPSTASH_REDIS_REST_TOKEN)

  const githubConfigured = isGitHubSyncEnabled()
  const githubActive = shouldSyncToGitHub()

  let mode: "github" | "kv" | "local-files" | "needs-github-token" = "local-files"
  if (kvConfigured) mode = "kv"
  else if (githubActive) mode = "github"
  else if (process.env.VERCEL === "1") mode = "needs-github-token"

  return NextResponse.json({
    mode,
    githubConfigured,
    githubActive,
    kvConfigured,
    githubRepo: githubSyncConfig.repo,
    githubBranch: githubSyncConfig.baseBranch,
    message:
      mode === "github"
        ? "Admin saves open a GitHub pull request. Merge it to publish to live."
        : mode === "kv"
          ? "Admin saves go to KV."
          : mode === "needs-github-token"
            ? "Add GITHUB_TOKEN in Vercel so admin saves persist and deploy."
            : "Admin saves update local JSON files.",
  })
}
