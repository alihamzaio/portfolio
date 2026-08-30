import { siteConfig } from "@/lib/site"

/** Admin → GitHub sync defaults. Only GITHUB_TOKEN is required in Vercel env. */
export const githubSyncConfig = {
  repo: "alihamzaio/portfolio",
  branch: "main",
  authorName: siteConfig.name,
  authorEmail: "alihamza.devstack@gmail.com",
} as const
