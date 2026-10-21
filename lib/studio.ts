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
    id: "actions_curio_short",
    label: "Actions: Curio Short",
    url: `https://github.com/${STUDIO_REPO}/actions/workflows/curio_short.yml`,
    group: "Ops",
  },
]

export const STUDIO_WORKFLOWS = {
  curio_long: {
    file: "curio_topic_finder.yml",
    label: "Curio: make + QC + upload long",
    kind: "curio",
  },
  curio_short: {
    file: "curio_short.yml",
    label: "Curio: Short (real B-roll → YouTube)",
    kind: "short",
  },
  // Legacy Click Case Files workflows kept for API compatibility but hidden from Studio UI.
  session_keepalive: { file: "session_keepalive.yml", label: "Warm sessions", kind: "ops" },
} as const

/** @deprecated Retired Click Case cross-post workflows — do not surface in Curio Studio. */
export const LEGACY_STUDIO_WORKFLOWS = {
  daily_short: { file: "daily_short.yml", label: "Legacy: Daily Short", kind: "short" },
  weekly_long: { file: "weekly_long.yml", label: "Legacy: Weekly Long", kind: "long" },
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

export type CurioPublishedVideo = {
  slug: string
  title: string
  format: "long" | "short"
  youtube_id: string
  youtube_url: string
  date?: string
  status: "uploaded"
  artifact: StudioArtifact | null
}

function isCurioPipelineArtifact(name: string): boolean {
  const n = (name || "").toLowerCase()
  // Only Curio pipeline zips — never Click Case short-videos / long-videos
  return n.includes("curio-pipeline") || n.startsWith("curio-")
}

export async function listStudioArtifacts(limit = 40): Promise<StudioArtifact[]> {
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
  return result.data.artifacts
    .filter((a) => isCurioPipelineArtifact(a.name || ""))
    .map((a) => {
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

async function readRepoTextFile(path: string): Promise<string | null> {
  const token = getGitHubToken()
  if (!token) return null
  const result = await githubJson<{ content?: string; encoding?: string }>(
    token,
    `/repos/${STUDIO_REPO}/contents/${path}?ref=${encodeURIComponent(STUDIO_BRANCH)}`
  )
  if (!result.ok || !result.data?.content) return null
  try {
    return Buffer.from(result.data.content.replace(/\n/g, ""), "base64").toString("utf8")
  } catch {
    return null
  }
}

function parseYoutubeIdFromNotes(notes: string): string | null {
  const m = notes.match(/yt:([A-Za-z0-9_-]{6,})/i)
  return m?.[1] || null
}

function matchArtifactForDate(artifacts: StudioArtifact[], dateIso?: string): StudioArtifact | null {
  const usable = artifacts.filter((a) => !a.expired && a.size_bytes > 50_000)
  if (!usable.length) return null
  if (!dateIso) return usable[0]
  const day = dateIso.slice(0, 10)
  const sameDay = usable.find((a) => (a.created_at || "").startsWith(day))
  return sameDay || usable[0]
}

/** Successfully uploaded Curio YouTube videos (long + short when available). */
export async function getCurioPublishedVideos(
  artifacts: StudioArtifact[] = []
): Promise<CurioPublishedVideo[]> {
  const byId = new Map<string, CurioPublishedVideo>()

  // 1) Tracker rows with yt:… notes
  const csv = await readRepoTextFile("data/curio/tracker.csv")
  if (csv) {
    const lines = csv.split(/\r?\n/).slice(1)
    for (const line of lines) {
      if (!line.trim()) continue
      // naive CSV: date,slug,title,format,...,notes
      const parts: string[] = []
      let cur = ""
      let inQ = false
      for (const ch of line) {
        if (ch === '"') {
          inQ = !inQ
          continue
        }
        if (ch === "," && !inQ) {
          parts.push(cur)
          cur = ""
          continue
        }
        cur += ch
      }
      parts.push(cur)
      const [date, slug, title, format, , , , , , notes = ""] = parts
      const ytId = parseYoutubeIdFromNotes(notes || "")
      if (!ytId || !slug) continue
      byId.set(ytId, {
        slug,
        title: title || slug,
        format: format === "short" ? "short" : "long",
        youtube_id: ytId,
        youtube_url: `https://youtu.be/${ytId}`,
        date,
        status: "uploaded",
        artifact: matchArtifactForDate(artifacts, date),
      })
    }
  }

  // 2) Latest publish manifest (if uploaded)
  const latest = await readRepoJsonFile<{
    status?: string
    youtube_id?: string
    youtube_url?: string
    slug?: string
    topic?: string
    meta_title?: string
    generated_at?: string
  }>("data/curio/topics/publish_manifest_latest.json")
  if (latest?.status === "uploaded" && latest.youtube_id) {
    byId.set(latest.youtube_id, {
      slug: String(latest.slug || latest.topic || "topic"),
      title: String(latest.meta_title || latest.topic || latest.slug || "Curio video"),
      format: "long",
      youtube_id: latest.youtube_id,
      youtube_url: latest.youtube_url || `https://youtu.be/${latest.youtube_id}`,
      date: (latest.generated_at || "").slice(0, 10),
      status: "uploaded",
      artifact: matchArtifactForDate(artifacts, latest.generated_at),
    })
  }

  // Known topic manifests (gravity / brain) when present on main
  for (const slug of ["how-does-gravity-work-on-earth", "how-does-the-brain-learn"]) {
    const man = await readRepoJsonFile<{
      status?: string
      youtube_id?: string
      youtube_url?: string
      slug?: string
      topic?: string
      meta_title?: string
      generated_at?: string
    }>(`data/curio/topics/${slug}/publish_manifest.json`)
    if (man?.status === "uploaded" && man.youtube_id) {
      byId.set(man.youtube_id, {
        slug: String(man.slug || slug),
        title: String(man.meta_title || man.topic || slug),
        format: "long",
        youtube_id: man.youtube_id,
        youtube_url: man.youtube_url || `https://youtu.be/${man.youtube_id}`,
        date: (man.generated_at || "").slice(0, 10),
        status: "uploaded",
        artifact: matchArtifactForDate(artifacts, man.generated_at),
      })
    }
  }

  return [...byId.values()].sort((a, b) => (b.date || "").localeCompare(a.date || ""))
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

/** Retired Click Case Files multi-platform rows — never surface in Curio Studio. */
const LEGACY_CROSSPOST_CHANNELS = new Set([
  "tiktok",
  "threads",
  "threads_api",
  "facebook",
  "instagram",
  "snapchat",
  "pinterest",
  "bluesky",
])

function isLegacyClickCaseRow(row: StudioHistoryRow | null | undefined): boolean {
  if (!row || typeof row !== "object") return false
  if (row.kind === "curio") return false
  const blob = [
    row.title,
    row.topic,
    row.kind,
    JSON.stringify(row.verify || {}),
    JSON.stringify(row.channels || {}),
  ]
    .filter(Boolean)
    .join(" ")
  if (/click\s*case|clickcasefiles|@clickcasefiles|costlymistakesbyali/i.test(blob)) return true
  const channels = Object.keys(row.channels || {})
  if (channels.some((c) => LEGACY_CROSSPOST_CHANNELS.has(c))) return true
  // Old orchestrator used short/long kinds with CASE titles
  if ((row.kind === "short" || row.kind === "long") && /case\s*\d+/i.test(row.title || "")) return true
  return false
}

function curioOpsAsLastRun(ops: CurioOpsStatus | null): StudioHistoryRow | null {
  if (!ops || typeof ops !== "object") return null
  const ytStatus =
    ops.publish_status === "uploaded" || ops.youtube_url
      ? ops.overall === "ok" || ops.overall === "success"
        ? "ok"
        : ops.overall === "error" || (ops.block_count || 0) > 0
          ? "error"
          : ops.publish_status || "partial"
      : "skipped"
  const errors = (ops.issues || [])
    .filter((i) => i.severity === "block" || i.severity === "error")
    .map((i) => ({
      channel: i.code || "curio",
      error: i.detail ? `${i.title || "Issue"}: ${i.detail}` : i.title || "Issue",
    }))
  return {
    at: ops.generated_at,
    kind: "curio",
    topic: ops.topic || ops.slug,
    title: ops.topic || ops.slug || "Curio run",
    overall: ops.overall,
    channels: { youtube: ytStatus },
    errors,
    verify: {
      youtube: ops.youtube_url || ops.channel?.url || STUDIO_CHANNEL.youtubeUrl,
    },
  }
}

export async function getStudioDashboardPayload() {
  const [legacyLast, rawHistory, runs, artifacts, pendingRaw, curioOps] = await Promise.all([
    getStudioLastRun(),
    getStudioHistory(),
    listStudioWorkflowRuns(20),
    listStudioArtifacts(30),
    getStudioPendingWork(),
    getCurioOpsStatus(),
  ])
  const pending = enrichPendingWork(pendingRaw)
  // Curio Studio only — never show Click Case Files / multi-platform rows
  const history = rawHistory.filter((row) => !isLegacyClickCaseRow(row) && row.kind === "curio")
  const lastFromOps = curioOpsAsLastRun(curioOps)
  const lastFromFile =
    legacyLast && !isLegacyClickCaseRow(legacyLast) && legacyLast.kind === "curio" ? legacyLast : null
  const last = lastFromOps || lastFromFile || history[0] || null
  const curioFailures = collectCurioFailures(curioOps)
  const historyFailures = collectFailures(history)
  const failures = [...curioFailures, ...historyFailures].slice(0, 40)

  const curioRuns = runs.filter(
    (r) =>
      r.path.includes("curio_topic_finder") ||
      r.name.toLowerCase().includes("curio") ||
      r.display_title.toLowerCase().includes("curio")
  )
  const curioOkRuns = curioRuns.filter((r) => r.conclusion === "success").length
  const curioFailRuns = curioRuns.filter((r) => r.conclusion === "failure").length
  const historyOk = history.filter((h) => h.overall === "ok").length
  const historyFail = history.filter(
    (h) => h.overall === "error" || (h.errors && h.errors.length > 0)
  ).length
  const okCount = historyOk + curioOkRuns
  const failCount = historyFail + curioFailRuns + (curioOps?.block_count || 0)
  const recentRunning = curioRuns.filter(
    (r) => r.status === "in_progress" || r.status === "queued"
  ).length
  const publishedVideos = await getCurioPublishedVideos(artifacts)
  const curioPublished =
    curioOps?.publish_status === "uploaded" || Boolean(curioOps?.youtube_url) ? 1 : 0
  const publishes = Math.max(publishedVideos.length, history.length, curioOkRuns, curioPublished)

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
    runs: curioRuns,
    // Curio pipeline zips only (for download next to published rows)
    artifacts,
    publishedVideos,
    shorts_enabled: true,
    shorts_note:
      "Curio Shorts use real Pexels/NASA B-roll + short narration (no AI avatar, no generative video). Dispatch “Curio: Short” from Create & publish.",
    pending,
    stats: {
      publishes,
      ok: okCount,
      failed: failCount,
      running: recentRunning,
      platforms: STUDIO_PLATFORMS.filter((p) => p.group === "Publish").length,
      videos: publishedVideos.length,
      pending_due: pending.due_count,
      pending_open: pending.open_count,
      curio_blocks: curioOps?.block_count || 0,
      curio_issues: curioOps?.issue_count || 0,
    },
  }
}
