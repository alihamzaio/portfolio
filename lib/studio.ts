import "server-only"

import { readFile } from "fs/promises"
import path from "path"

import { getGitHubToken, githubJson } from "@/lib/github-api"

export const STUDIO_REPO =
  process.env.YT_AUTO_REPO?.trim() || "alihamzaio/yt-auto-studio"

export const STUDIO_BRANCH = process.env.YT_AUTO_BRANCH?.trim() || "main"

export const STUDIO_CHANNEL = {
  name: "Curio Why Science",
  handle: "CurioWhyScience",
  displayNameTarget: "Curio Why Science",
  tagline: "Everyday science questions, explained clearly.",
  signoff: "Stay curious.",
  channelId: "UCylbJf-Objxcejpae6z5R2g",
  youtubeUrl: "https://www.youtube.com/@CurioWhyScience",
  studioUrl: "https://studio.youtube.com/channel/UCylbJf-Objxcejpae6z5R2g",
} as const

export type PendingWorkItem = {
  id: string
  platform: string
  title: string
  detail: string
  value?: string
  due_on: string
  status: string
  action_url?: string
  reminder?: boolean
}

export type PendingWorkFile = {
  updated_at?: string
  timezone_note?: string
  brand?: {
    display_name_target?: string
    display_name_alt?: string
    handle?: string
    tagline?: string
    signoff?: string
    name_note?: string
  }
  items: PendingWorkItem[]
}

export type PendingWorkViewItem = PendingWorkItem & {
  state: "done" | "due" | "waiting"
  days_until: number
  remind_now: boolean
}

function todayIsoLocal(d = new Date()): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

function daysBetween(fromIso: string, toIso: string): number {
  const a = new Date(`${fromIso}T12:00:00`)
  const b = new Date(`${toIso}T12:00:00`)
  return Math.round((b.getTime() - a.getTime()) / 86_400_000)
}

export function enrichPendingWork(file: PendingWorkFile | null, today = todayIsoLocal()): {
  brand: PendingWorkFile["brand"]
  updated_at?: string
  items: PendingWorkViewItem[]
  due_count: number
  waiting_count: number
  open_count: number
} {
  const items = (file?.items || []).map((item) => {
    const done = item.status === "done"
    const days_until = daysBetween(today, item.due_on)
    const state: PendingWorkViewItem["state"] = done ? "done" : days_until <= 0 ? "due" : "waiting"
    return {
      ...item,
      state,
      days_until,
      remind_now: Boolean(item.reminder) && !done && days_until <= 0,
    }
  })
  items.sort((a, b) => {
    const rank = (s: string) => (s === "due" ? 0 : s === "waiting" ? 1 : 2)
    return rank(a.state) - rank(b.state) || a.due_on.localeCompare(b.due_on)
  })
  return {
    brand: file?.brand,
    updated_at: file?.updated_at,
    items,
    due_count: items.filter((i) => i.state === "due").length,
    waiting_count: items.filter((i) => i.state === "waiting").length,
    open_count: items.filter((i) => i.state !== "done").length,
  }
}

export const STUDIO_PLATFORMS: { id: string; label: string; url: string; group: string }[] = [
  { id: "youtube", label: "YouTube (Curio)", url: "https://www.youtube.com/@CurioWhyScience", group: "Publish" },
  {
    id: "youtube_studio",
    label: "YouTube Studio (Curio)",
    url: "https://studio.youtube.com/channel/UCylbJf-Objxcejpae6z5R2g",
    group: "Publish",
  },
  { id: "blog", label: "Portfolio Blog CMS", url: "https://alihamza-fawn.vercel.app/admin/blog", group: "Tools" },
  { id: "actions", label: "GitHub Actions", url: `https://github.com/${STUDIO_REPO}/actions`, group: "Ops" },
  {
    id: "actions_curio",
    label: "Actions: Curio long (1-13)",
    url: `https://github.com/${STUDIO_REPO}/actions/workflows/curio_topic_finder.yml`,
    group: "Ops",
  },
  {
    id: "actions_short",
    label: "Actions: Daily Short (legacy)",
    url: `https://github.com/${STUDIO_REPO}/actions/workflows/daily_short.yml`,
    group: "Ops",
  },
  {
    id: "actions_long",
    label: "Actions: Weekly Long (legacy)",
    url: `https://github.com/${STUDIO_REPO}/actions/workflows/weekly_long.yml`,
    group: "Ops",
  },
]

export const STUDIO_WORKFLOWS = {
  curio_long: {
    file: "curio_topic_finder.yml",
    label: "Curio: make + QC + upload long",
    kind: "curio",
  },
  daily_short: { file: "daily_short.yml", label: "Legacy: Daily Short", kind: "short" },
  weekly_long: { file: "weekly_long.yml", label: "Legacy: Weekly Long", kind: "long" },
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

export type StudioFailure = {
  at?: string
  title?: string
  kind?: string
  channel?: string
  error?: string
  fix?: string
  action_url?: string
  severity?: string
}

export type CurioOpsStatus = {
  generated_at?: string
  overall?: string
  topic?: string
  slug?: string
  qc_status?: string | null
  publish_status?: string | null
  youtube_url?: string | null
  approve_pass?: boolean | null
  issue_count?: number
  block_count?: number
  issues?: Array<{
    code?: string
    severity?: string
    title?: string
    detail?: string
    fix?: string
    action_url?: string
  }>
  channel?: {
    name?: string
    handle?: string
    id?: string
    url?: string
    studio?: string
  }
}

export function collectFailures(history: StudioHistoryRow[], limit = 25): StudioFailure[] {
  const failures: StudioFailure[] = []
  for (const row of history.slice(0, 40)) {
    for (const err of row.errors || []) {
      if (err?.error) {
        failures.push({
          at: row.at,
          title: row.title || row.topic,
          kind: row.kind,
          channel: err.channel,
          error: err.error,
          fix: "Open the Actions run, fix the platform error, then re-dispatch or manual-upload from Videos tab.",
          action_url: `https://github.com/${STUDIO_REPO}/actions`,
          severity: "block",
        })
      }
      if (failures.length >= limit) return failures
    }
  }
  return failures
}

function collectCurioFailures(ops: CurioOpsStatus | null): StudioFailure[] {
  if (!ops?.issues?.length) return []
  return ops.issues.map((i) => ({
    at: ops.generated_at,
    title: ops.topic || ops.slug || "Curio",
    kind: "curio",
    channel: i.code || "curio",
    error: i.detail ? `${i.title || "Issue"}: ${i.detail}` : i.title || "Issue",
    fix: i.fix,
    action_url: i.action_url,
    severity: i.severity,
  }))
}

export async function getCurioOpsStatus(): Promise<CurioOpsStatus | null> {
  const primary = await readRepoJsonFile<CurioOpsStatus>("data/curio/ops_status.json")
  if (primary && typeof primary === "object") return primary
  return readRepoJsonFile<CurioOpsStatus>("data/curio/topics/ops_status_latest.json")
}

async function readLocalPendingWork(): Promise<PendingWorkFile | null> {
  try {
    const filePath = path.join(process.cwd(), "content", "studio", "pending-work.json")
    const raw = await readFile(filePath, "utf8")
    return JSON.parse(raw) as PendingWorkFile
  } catch {
    return null
  }
}

export async function getStudioPendingWork(): Promise<PendingWorkFile | null> {
  const fromRepo = await readRepoJsonFile<PendingWorkFile>("data/pending-work.json")
  if (fromRepo && Array.isArray(fromRepo.items)) return fromRepo
  return readLocalPendingWork()
}

export async function getStudioDashboardPayload() {
  const [last, history, runs, artifacts, pendingRaw, curioOps] = await Promise.all([
    getStudioLastRun(),
    getStudioHistory(),
    listStudioWorkflowRuns(20),
    listStudioArtifacts(30),
    getStudioPendingWork(),
    getCurioOpsStatus(),
  ])
  const pending = enrichPendingWork(pendingRaw)
  const legacyFailures = collectFailures(history)
  const curioFailures = collectCurioFailures(curioOps)
  const failures = [...curioFailures, ...legacyFailures].slice(0, 40)

  const curioRuns = runs.filter(
    (r) =>
      r.path.includes("curio_topic_finder") ||
      r.name.toLowerCase().includes("curio") ||
      r.display_title.toLowerCase().includes("curio")
  )
  const okCount =
    history.filter((h) => h.overall === "ok").length +
    curioRuns.filter((r) => r.conclusion === "success").length
  const failCount =
    history.filter((h) => h.overall === "error" || (h.errors && h.errors.length > 0)).length +
    curioRuns.filter((r) => r.conclusion === "failure").length +
    (curioOps?.block_count || 0)
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
    curio: curioOps,
    runs,
    artifacts,
    pending,
    stats: {
      publishes: history.length + curioRuns.filter((r) => r.conclusion === "success").length,
      ok: okCount,
      failed: failCount,
      running: recentRunning,
      platforms: STUDIO_PLATFORMS.filter((p) => p.group === "Publish").length,
      videos: videoArtifacts.length,
      pending_due: pending.due_count,
      pending_open: pending.open_count,
      curio_blocks: curioOps?.block_count || 0,
      curio_issues: curioOps?.issue_count || 0,
    },
  }
}
