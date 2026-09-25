import "server-only"

import { getGitHubToken, githubJson } from "@/lib/github-api"

export const STUDIO_REPO =
  process.env.YT_AUTO_REPO?.trim() || "alihamzaio/yt-auto-studio"

export const STUDIO_BRANCH = process.env.YT_AUTO_BRANCH?.trim() || "main"

export const STUDIO_CHANNEL = {
  name: "Behind The Price",
  handle: "BehindThePriceByAli",
  tagline: "The real reason everything costs what it does.",
  signoff: "That's the catch.",
} as const

export const STUDIO_PLATFORMS: { id: string; label: string; url: string; group: string }[] = [
  { id: "youtube", label: "YouTube", url: "https://www.youtube.com/@BehindThePriceByAli", group: "Publish" },
  { id: "youtube_studio", label: "YouTube Studio", url: "https://studio.youtube.com/channel/UCflLNkk3fdoe_5MkPhbD7Uw", group: "Publish" },
  { id: "tiktok", label: "TikTok", url: "https://www.tiktok.com/@costlymistakesbyali", group: "Publish" },
  { id: "instagram", label: "Instagram", url: "https://www.instagram.com/behindthepricebyali", group: "Publish" },
  { id: "threads", label: "Threads", url: "https://www.threads.com/@behindthepricebyali", group: "Publish" },
  { id: "facebook", label: "Facebook", url: "https://www.facebook.com/behindthepricebyali", group: "Publish" },
  { id: "business_suite", label: "Meta Business Suite", url: "https://business.facebook.com/latest/?asset_id=1307166245817929", group: "Tools" },
  { id: "blog", label: "Portfolio Blog", url: "https://alihamza-fawn.vercel.app/blog", group: "Tools" },
  { id: "actions", label: "GitHub Actions", url: `https://github.com/${STUDIO_REPO}/actions`, group: "Ops" },
  {
    id: "actions_short",
    label: "Actions: Daily Short",
    url: `https://github.com/${STUDIO_REPO}/actions/workflows/daily_short.yml`,
    group: "Ops",
  },
  {
    id: "actions_long",
    label: "Actions: Weekly Long",
    url: `https://github.com/${STUDIO_REPO}/actions/workflows/weekly_long.yml`,
    group: "Ops",
  },
]

export const STUDIO_WORKFLOWS = {
  daily_short: { file: "daily_short.yml", label: "Create + publish Short", kind: "short" },
  weekly_long: { file: "weekly_long.yml", label: "Create + publish Long", kind: "long" },
  session_keepalive: { file: "session_keepalive.yml", label: "Warm sessions", kind: "ops" },
} as const

export type StudioWorkflowKey = keyof typeof STUDIO_WORKFLOWS

export type StudioUploadError = { channel?: string; error?: string }
export type StudioHistoryRow = {
  at?: string
  kind?: string
  title?: string
  topic?: string
  overall?: string
  channels?: Record<string, string>
  errors?: StudioUploadError[]
  verify?: Record<string, string>
}

export type StudioRun = {
  id: number
  name: string
  status: string
  conclusion: string | null
  html_url: string
  created_at: string
  display_title: string
  path: string
}

async function readRepoJsonFile<T>(path: string): Promise<T | null> {
  const token = getGitHubToken()
  if (!token) return null
  const result = await githubJson<{ content?: string; encoding?: string }>(
    token,
    `/repos/${STUDIO_REPO}/contents/${path}?ref=${encodeURIComponent(STUDIO_BRANCH)}`
  )
  if (!result.ok || !result.data?.content) return null
  try {
    const raw = Buffer.from(result.data.content.replace(/\n/g, ""), "base64").toString("utf8")
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

export async function getStudioLastRun(): Promise<StudioHistoryRow | null> {
  const data = await readRepoJsonFile<StudioHistoryRow>("data/last-run.json")
  return data && typeof data === "object" ? data : null
}

export async function getStudioHistory(): Promise<StudioHistoryRow[]> {
  const data = await readRepoJsonFile<StudioHistoryRow[] | { history?: StudioHistoryRow[] }>(
    "data/upload-history.json"
  )
  if (Array.isArray(data)) return data
  if (data && Array.isArray(data.history)) return data.history
  return []
}

export async function listStudioWorkflowRuns(limit = 20): Promise<StudioRun[]> {
  const token = getGitHubToken()
  if (!token) return []
  const result = await githubJson<{
    workflow_runs?: Array<{
      id: number
      name?: string
      status?: string
      conclusion?: string | null
      html_url?: string
      created_at?: string
      display_title?: string
      path?: string
    }>
  }>(token, `/repos/${STUDIO_REPO}/actions/runs?per_page=${limit}`)
  if (!result.ok || !result.data?.workflow_runs) return []
  return result.data.workflow_runs.map((r) => ({
    id: r.id,
    name: r.name || "Workflow",
    status: r.status || "unknown",
    conclusion: r.conclusion ?? null,
    html_url: r.html_url || `https://github.com/${STUDIO_REPO}/actions`,
    created_at: r.created_at || "",
    display_title: r.display_title || r.name || "Run",
    path: r.path || "",
  }))
}

export async function dispatchStudioWorkflow(workflow: StudioWorkflowKey): Promise<{
  ok: boolean
  status: number
  message: string
  actions_url: string
}> {
  const meta = STUDIO_WORKFLOWS[workflow]
  const token = getGitHubToken()
  if (!token) {
    return {
      ok: false,
      status: 400,
      message: "GITHUB_TOKEN is not set on Vercel. Add a PAT with actions:write.",
      actions_url: `https://github.com/${STUDIO_REPO}/actions`,
    }
  }
  const result = await githubJson(
    token,
    `/repos/${STUDIO_REPO}/actions/workflows/${meta.file}/dispatches`,
    {
      method: "POST",
      body: JSON.stringify({ ref: STUDIO_BRANCH }),
    }
  )
  const actions_url = `https://github.com/${STUDIO_REPO}/actions/workflows/${meta.file}`
  if (result.status !== 201 && result.status !== 204) {
    return {
      ok: false,
      status: result.status,
      message: result.text.slice(0, 400) || `Dispatch failed (${result.status})`,
      actions_url,
    }
  }
  return {
    ok: true,
    status: result.status,
    message: `Dispatched ${meta.label}. Watch Actions for progress.`,
    actions_url,
  }
}

export type StudioArtifact = {
  id: number
  name: string
  size_bytes: number
  size_mb: number
  created_at: string
  expired: boolean
  workflow_run_id: number | null
  download_url: string
  actions_url: string
}

export async function listStudioArtifacts(limit = 30): Promise<StudioArtifact[]> {
  const token = getGitHubToken()
  if (!token) return []
  const result = await githubJson<{
    artifacts?: Array<{
      id: number
      name?: string
      size_in_bytes?: number
      created_at?: string
      expired?: boolean
      workflow_run?: { id?: number }
    }>
  }>(token, `/repos/${STUDIO_REPO}/actions/artifacts?per_page=${limit}`)
  if (!result.ok || !result.data?.artifacts) return []
  return result.data.artifacts.map((a) => {
    const size = a.size_in_bytes || 0
    return {
      id: a.id,
      name: a.name || "output",
      size_bytes: size,
      size_mb: Math.round((size / (1024 * 1024)) * 10) / 10,
      created_at: a.created_at || "",
      expired: Boolean(a.expired),
      workflow_run_id: a.workflow_run?.id ?? null,
      download_url: `/api/studio/videos/${a.id}/download`,
      actions_url: a.workflow_run?.id
        ? `https://github.com/${STUDIO_REPO}/actions/runs/${a.workflow_run.id}`
        : `https://github.com/${STUDIO_REPO}/actions`,
    }
  })
}

export async function downloadStudioArtifactZip(
  artifactId: number
): Promise<{ ok: true; buffer: ArrayBuffer; filename: string } | { ok: false; status: number; message: string }> {
  const token = getGitHubToken()
  if (!token) {
    return { ok: false, status: 400, message: "GITHUB_TOKEN missing" }
  }
  const url = `https://api.github.com/repos/${STUDIO_REPO}/actions/artifacts/${artifactId}/zip`
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    redirect: "follow",
    cache: "no-store",
  })
  if (!res.ok) {
    const text = await res.text()
    return { ok: false, status: res.status, message: text.slice(0, 400) || `Download failed (${res.status})` }
  }
  const buffer = await res.arrayBuffer()
  return { ok: true, buffer, filename: `studio-artifact-${artifactId}.zip` }
}

export function collectFailures(history: StudioHistoryRow[], limit = 25) {
  const failures: Array<{
    at?: string
    title?: string
    kind?: string
    channel?: string
    error?: string
  }> = []
  for (const row of history.slice(0, 40)) {
    for (const err of row.errors || []) {
      if (err?.error) {
        failures.push({
          at: row.at,
          title: row.title || row.topic,
          kind: row.kind,
          channel: err.channel,
          error: err.error,
        })
      }
      if (failures.length >= limit) return failures
    }
  }
  return failures
}

export async function getStudioDashboardPayload() {
  const [last, history, runs, artifacts] = await Promise.all([
    getStudioLastRun(),
    getStudioHistory(),
    listStudioWorkflowRuns(20),
    listStudioArtifacts(30),
  ])
  const failures = collectFailures(history)
  const okCount = history.filter((h) => h.overall === "ok").length
  const failCount = history.filter((h) => h.overall === "error" || (h.errors && h.errors.length > 0)).length
  const recentRunning = runs.filter((r) => r.status === "in_progress" || r.status === "queued").length
  const videoArtifacts = artifacts.filter((a) => !a.expired && a.size_bytes > 50_000)
  return {
    channel: STUDIO_CHANNEL,
    platforms: STUDIO_PLATFORMS,
    workflows: STUDIO_WORKFLOWS,
    repo: STUDIO_REPO,
    hasGithubToken: Boolean(getGitHubToken()),
    last,
    history: history.slice(0, 25),
    failures,
    runs,
    artifacts,
    stats: {
      publishes: history.length,
      ok: okCount,
      failed: failCount,
      running: recentRunning,
      platforms: STUDIO_PLATFORMS.filter((p) => p.group === "Publish").length,
      videos: videoArtifacts.length,
    },
  }
}
