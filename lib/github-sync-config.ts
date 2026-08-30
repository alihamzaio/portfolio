import { siteConfig } from "@/lib/site"

/** Admin → GitHub PR defaults. Only GITHUB_TOKEN is required in Vercel env. */
export const githubSyncConfig = {
  repo: "alihamzaio/portfolio",
  baseBranch: "main",
  authorName: siteConfig.name,
  authorEmail: "alihamza.devstack@gmail.com",
} as const
