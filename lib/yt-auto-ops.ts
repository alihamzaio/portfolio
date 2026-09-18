import "server-only"

import { getGitHubToken, GH_HEADERS, githubJson } from "@/lib/github-api"

const YT_REPO = process.env.YT_AUTO_REPO?.trim() || "alihamzaio/yt-auto-studio"

export type ChannelStatus = "ok" | "error" | "skipped" | "unknown"

export type UploadRunRow = {
  at: string | null
  kind: string | null
  topic?: string
  title?: string
  youtube_id?: string
  overall?: string
  channels?: Record<string, ChannelStatus | string>
  errors?: Array<{ channel: string; error: string }>
  note?: string
}

export type WorkflowRunSummary = {
  id: number
  name: string
  status: string
  conclusion: string | null
  html_url: string
  created_at: string
  display_title?: string
  path?: string
}

export const PLATFORM_LINKS = [
  { id: "youtube", label: "01 - YouTube DevBuildDaily", url: "https://www.youtube.com/@DevBuildDaily" },
  { id: "youtube-studio", label: "02 - YouTube Studio", url: "https://studio.youtube.com/" },
  { id: "tiktok", label: "03 - TikTok devbuild.daily", url: "https://www.tiktok.com/@devbuild.daily" },
  { id: "instagram", label: "04 - Instagram devbuild.daily", url: "https://www.instagram.com/devbuild.daily" },
  { id: "facebook", label: "05 - Facebook DevBuildDaily", url: "https://www.facebook.com/devbuild.daily" },
  { id: "threads", label: "06 - Threads @devbuild.daily", url: "https://www.threads.net/@devbuild.daily" },
  { id: "blog", label: "07 - Portfolio Blog", url: "https://alihamza-fawn.vercel.app/blog" },
  {
    id: "admin-tracker",
    label: "08 - Admin DevBuildDaily tracker",
    url: "https://alihamza-fawn.vercel.app/admin",
  },
  {
    id: "actions-short",
    label: "09 - Actions Daily Short",
    url: "https://github.com/alihamzaio/yt-auto-studio/actions/workflows/daily_short.yml",
  },
  {
    id: "actions-long",
    label: "10 - Actions Weekly Long",
    url: "https://github.com/alihamzaio/yt-auto-studio/actions/workflows/weekly_long.yml",
  },
  {
    id: "actions-keep",
    label: "11 - Actions Session Keepalive",
    url: "https://github.com/alihamzaio/yt-auto-studio/actions/workflows/session_keepalive.yml",
  },
] as const

async function readRepoJson<T>(path: string): Promise<T | null> {
  const token = getGitHubToken()
  if (!token) return null
  const result = await githubJson<{ content?: string; encoding?: string }>(
    token,
    `/repos/${YT_REPO}/contents/${path}?ref=main`
  )
  if (!result.ok || !result.data?.content) return null
  try {
    const raw = Buffer.from(result.data.content, "base64").toString("utf8")
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

export async function getLastUploadRun(): Promise<UploadRunRow | null> {
  return readRepoJson<UploadRunRow>("data/last-run.json")
}

export async function getUploadHistory(): Promise<UploadRunRow[]> {
  const data = await readRepoJson<UploadRunRow[]>("data/upload-history.json")
  return Array.isArray(data) ? data : []
}

export async function listRecentWorkflowRuns(limit = 12): Promise<WorkflowRunSummary[]> {
  const token = getGitHubToken()
  if (!token) return []
  const result = await githubJson<{
    workflow_runs?: Array<{
      id: number
      name: string
      status: string
      conclusion: string | null
      html_url: string
      created_at: string
      display_title?: string
      path?: string
    }>
  }>(token, `/repos/${YT_REPO}/actions/runs?per_page=${limit}`)
  if (!result.ok || !result.data?.workflow_runs) return []
  return result.data.workflow_runs.map((r) => ({
    id: r.id,
    name: r.name,
    status: r.status,
    conclusion: r.conclusion,
    html_url: r.html_url,
    created_at: r.created_at,
    display_title: r.display_title,
    path: r.path,
  }))
}

export type DispatchWorkflow = "daily_short" | "weekly_long" | "session_keepalive"

const WORKFLOW_FILES: Record<DispatchWorkflow, string> = {
  daily_short: "daily_short.yml",
  weekly_long: "weekly_long.yml",
  session_keepalive: "session_keepalive.yml",
}

export async function dispatchYtWorkflow(
  workflow: DispatchWorkflow,
  inputs?: Record<string, string>
): Promise<{ ok: boolean; error?: string }> {
  const token = getGitHubToken()
  if (!token) return { ok: false, error: "GITHUB_TOKEN missing on server" }
  const file = WORKFLOW_FILES[workflow]
  const result = await githubJson(
    token,
    `/repos/${YT_REPO}/actions/workflows/${file}/dispatches`,
    {
      method: "POST",
      body: JSON.stringify({
        ref: "main",
        inputs: inputs || {},
      }),
    }
  )
  if (!result.ok && result.status !== 204) {
    return {
      ok: false,
      error: `GitHub dispatch failed (${result.status}): ${result.text.slice(0, 240)}`,
    }
  }
  return { ok: true }
}

export function ytAutoRepo() {
  return YT_REPO
}
