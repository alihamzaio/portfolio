"use client"

import { useCallback, useEffect, useState } from "react"
import { AlertTriangle, CheckCircle2, Download, Loader2, Play, RefreshCw } from "lucide-react"
import { AdminLogin } from "@/components/admin/admin-login"
import { StatCard } from "@/components/admin/admin-shell"
import { ExtLink, StudioPanel, StudioShell, type StudioTab } from "@/components/studio/studio-shell"
import {
  adminFetch,
  clearAdminSession,
  getAdminSession,
  setAdminSession,
} from "@/lib/auth-client"
import { cn } from "@/lib/utils"

type Platform = { id: string; label: string; url: string; group: string }
type HistoryRow = {
  at?: string
  kind?: string
  title?: string
  topic?: string
  overall?: string
  channels?: Record<string, string>
  errors?: { channel?: string; error?: string }[]
  verify?: Record<string, string>
}
type Run = {
  id: number
  name: string
  status: string
  conclusion: string | null
  html_url: string
  created_at: string
  display_title: string
}
type Workflows = Record<string, { file: string; label: string; kind: string }>

type Artifact = {
  id: number
  name: string
  size_mb: number
  created_at: string
  expired: boolean
  download_url: string
  actions_url: string
  workflow_run_id: number | null
}
type PendingItem = {
  id: string
  platform: string
  title: string
  detail: string
  value?: string
  due_on: string
  status: string
  action_url?: string
  state: "done" | "due" | "waiting"
  days_until: number
  remind_now: boolean
}
type StudioPayload = {
  channel: {
    name: string
    handle: string
    displayNameTarget?: string
    tagline: string
    signoff: string
  }
  platforms: Platform[]
  workflows: Workflows
  repo: string
  hasGithubToken: boolean
  last: HistoryRow | null
  history: HistoryRow[]
  failures: {
    at?: string
    title?: string
    kind?: string
    channel?: string
    error?: string
    fix?: string
    action_url?: string
    severity?: string
  }[]
  curio?: {
    generated_at?: string
    overall?: string
    topic?: string
    slug?: string
    qc_status?: string | null
    publish_status?: string | null
    youtube_url?: string | null
    issue_count?: number
    block_count?: number
    issues?: {
      code?: string
      severity?: string
      title?: string
      detail?: string
      fix?: string
      action_url?: string
    }[]
  } | null
  runs: Run[]
  artifacts?: Artifact[]
  publishedVideos?: {
    slug: string
    title: string
    format: "long" | "short"
    youtube_id: string
    youtube_url: string
    date?: string
    status: "uploaded"
    artifact: Artifact | null
  }[]
  shorts_enabled?: boolean
  shorts_note?: string
  pending?: {
    brand?: {
      display_name_target?: string
      display_name_alt?: string
      handle?: string
      name_note?: string
    }
    updated_at?: string
    items: PendingItem[]
    due_count: number
    waiting_count: number
    open_count: number
  }
  stats: {
    publishes: number
    ok: number
    failed: number
    running: number
    platforms: number
    videos?: number
    pending_due?: number
    pending_open?: number
    curio_blocks?: number
    curio_issues?: number
  }
}

function pendingPill(state: PendingItem["state"]) {
  return cn(
    "inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
    state === "due"
      ? "bg-amber-500/20 text-amber-200"
      : state === "waiting"
        ? "bg-sky-500/15 text-sky-300"
        : "bg-emerald-500/15 text-emerald-400"
  )
}

function statusPill(status?: string) {
  const s = (status || "unknown").toLowerCase()
  return cn(
    "inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
    s === "ok" || s === "success" || s === "completed"
      ? "bg-emerald-500/15 text-emerald-400"
      : s === "error" || s === "failure"
        ? "bg-red-500/15 text-red-400"
        : s === "partial" || s === "cancelled"
          ? "bg-amber-500/15 text-amber-300"
          : "bg-white/10 text-[var(--text-muted)]"
  )
}

export function StudioWorkspace() {
  const [authed, setAuthed] = useState(false)
  const [checking, setChecking] = useState(true)
  const [tab, setTab] = useState<StudioTab>("overview")
  const [data, setData] = useState<StudioPayload | null>(null)
  const [loading, setLoading] = useState(false)
  const [dispatching, setDispatching] = useState<string | null>(null)
  const [downloadingId, setDownloadingId] = useState<number | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const verifySession = useCallback(async () => {
    const cached = getAdminSession()
    try {
      const res = await fetch("/api/auth/session", {
        credentials: "include",
        cache: "no-store",
        headers: cached?.token ? { Authorization: `Bearer ${cached.token}` } : {},
      })
      if (!res.ok) {
        if (cached && Date.now() < cached.expiresAt) {
          setAuthed(true)
        } else {
          clearAdminSession()
          setAuthed(false)
        }
        return
      }
      const body = (await res.json()) as {
        valid?: boolean
        token?: string
        expiresAt?: number
        email?: string
      }
      if (body.valid && body.token && body.expiresAt && body.email) {
        setAdminSession({
          token: body.token,
          expiresAt: body.expiresAt,
          email: body.email,
        })
        setAuthed(true)
      } else {
        setAuthed(false)
      }
    } catch {
      setAuthed(Boolean(cached && Date.now() < cached.expiresAt))
    } finally {
      setChecking(false)
    }
  }, [])

  const loadStatus = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await adminFetch("/api/studio/status")
      if (res.status === 401) {
        clearAdminSession()
        setAuthed(false)
        return
      }
      const body = await res.json()
      if (!res.ok) throw new Error(body.error || "Failed to load studio")
      setData(body as StudioPayload)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load studio")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void verifySession()
  }, [verifySession])

  useEffect(() => {
    if (authed) void loadStatus()
  }, [authed, loadStatus])

  const onLogout = async () => {
    try {
      await adminFetch("/api/auth/session", { method: "DELETE" })
    } catch {
      /* ignore */
    }
    clearAdminSession()
    setAuthed(false)
    setData(null)
  }

  const dispatch = async (workflow: string) => {
    setDispatching(workflow)
    setNotice(null)
    setError(null)
    try {
      const res = await adminFetch("/api/studio/dispatch", {
        method: "POST",
        body: JSON.stringify({ workflow }),
      })
      const body = (await res.json()) as { ok?: boolean; message?: string; error?: string; actions_url?: string }
      if (!res.ok || !body.ok) throw new Error(body.message || body.error || "Dispatch failed")
      setNotice(body.message || "Dispatched")
      if (body.actions_url) setNotice(`${body.message}\n${body.actions_url}`)
      await loadStatus()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Dispatch failed")
    } finally {
      setDispatching(null)
    }
  }

  const downloadArtifact = async (artifact: Artifact) => {
    setDownloadingId(artifact.id)
    setNotice(null)
    setError(null)
    try {
      const res = await adminFetch(artifact.download_url)
      if (res.status === 401) {
        clearAdminSession()
        setAuthed(false)
        return
      }
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error((body as { error?: string }).error || `Download failed (${res.status})`)
      }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${artifact.name || "studio-output"}-${artifact.id}.zip`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
      setNotice(
        `Downloaded ${artifact.name}. Unzip and open output/video/*.mp4, then manual-upload to any platform that failed.`
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : "Download failed")
    } finally {
      setDownloadingId(null)
    }
  }

  if (checking) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[var(--bg-void)]">
        <Loader2 className="h-6 w-6 animate-spin text-[var(--accent-primary)]" />
      </div>
    )
  }

  if (!authed) {
    return (
      <AdminLogin
        onSuccess={() => {
          setAuthed(true)
          setChecking(false)
        }}
      />
    )
  }

  const stats = data?.stats || {
    publishes: 0,
    ok: 0,
    failed: 0,
    running: 0,
    platforms: 0,
    videos: 0,
  }
  const last = data?.last
  const channel = data?.channel

  return (
    <StudioShell
      tab={tab}
      onTab={setTab}
      onLogout={onLogout}
      stats={stats}
      brandName={channel?.name || "Curio Why Science"}
    >
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-display text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            {channel?.name || "Curio Why Science"} Studio
          </p>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            {channel?.tagline || "Auto make, QC pass/fail, upload ops"}
            {channel?.signoff ? ` · "${channel.signoff}"` : ""}
          </p>
        </div>
        <button
          type="button"
          onClick={() => void loadStatus()}
          disabled={loading}
          className="btn-secondary inline-flex items-center gap-2"
        >
          <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          Refresh
        </button>
      </div>

      {(notice || error) && (
        <div
          className={cn(
            "mb-6 rounded-xl border px-4 py-3 text-sm whitespace-pre-wrap",
            error
              ? "border-red-500/30 bg-red-500/10 text-red-300"
              : "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
          )}
        >
          {error || notice}
        </div>
      )}

      {!data?.hasGithubToken && (
        <div className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          Set <code className="font-mono">GITHUB_TOKEN</code> on Vercel (PAT with{" "}
          <code className="font-mono">actions:write</code> + repo read) so Studio can load history and dispatch
          workflows for <code className="font-mono">{data?.repo || "alihamzaio/yt-auto-studio"}</code>.
        </div>
      )}

      {tab === "overview" && (
        <div className="space-y-6">
          {(data?.pending?.due_count || 0) > 0 && (
            <button
              type="button"
              onClick={() => setTab("pending")}
              className="w-full rounded-xl border border-amber-500/35 bg-amber-500/10 px-4 py-3 text-left text-sm text-amber-100 transition hover:border-amber-400/50"
            >
              <strong>{data?.pending?.due_count} reminder(s) due now.</strong> Open Pending work to finish
              rename / brand tasks.
            </button>
          )}

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Publishes" value={stats.publishes} sub="Curio only" />
            <StatCard label="Successful" value={stats.ok} sub="Actions OK / uploads OK" />
            <StatCard label="Failed / errored" value={stats.failed} sub="Needs retry or fix" />
            <StatCard
              label="Curio issues"
              value={stats.curio_issues ?? data?.curio?.issue_count ?? 0}
              sub={`${stats.curio_blocks ?? data?.curio?.block_count ?? 0} blocking`}
            />
          </div>

          <StudioPanel title="Curio pipeline status (pass / fail)">
            {data?.curio ? (
              <div className="space-y-3 text-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={statusPill(data.curio.overall || "unknown")}>
                    {data.curio.overall || "unknown"}
                  </span>
                  <span className="text-[var(--text-muted)]">
                    QC {data.curio.qc_status || "-"} · Publish {data.curio.publish_status || "-"}
                  </span>
                </div>
                <p className="text-[var(--text-secondary)]">
                  Topic: <strong className="text-[var(--text-primary)]">{data.curio.topic || data.curio.slug || "-"}</strong>
                  {data.curio.youtube_url ? (
                    <>
                      {" "}
                      · <ExtLink href={data.curio.youtube_url}>Open video</ExtLink>
                    </>
                  ) : null}
                </p>
                {(data.curio.issues || []).length > 0 ? (
                  <ul className="space-y-2">
                    {(data.curio.issues || []).slice(0, 6).map((issue, i) => (
                      <li
                        key={`${issue.code}-${i}`}
                        className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2"
                      >
                        <p className="font-medium text-[var(--text-primary)]">
                          [{issue.severity || "info"}] {issue.title}
                        </p>
                        {issue.detail ? (
                          <p className="mt-1 text-[var(--text-muted)]">{issue.detail}</p>
                        ) : null}
                        {issue.fix ? (
                          <p className="mt-1 text-[var(--accent-primary)]">Do: {issue.fix}</p>
                        ) : null}
                        {issue.action_url ? (
                          <div className="mt-1">
                            <ExtLink href={issue.action_url}>Open fix link</ExtLink>
                          </div>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-emerald-300">No Curio issues in latest ops status.</p>
                )}
                <button type="button" onClick={() => setTab("failures")} className="text-xs text-[var(--accent-primary)]">
                  All failures
                </button>
              </div>
            ) : (
              <p className="text-sm text-[var(--text-muted)]">
                No <code className="font-mono">data/curio/ops_status.json</code> yet. After the next Curio Actions run,
                pass/fail details appear here.
              </p>
            )}
          </StudioPanel>

          <StudioPanel
            title="Active channel"
            action={
              <button type="button" onClick={() => setTab("pending")} className="text-xs text-[var(--accent-primary)]">
                All pending
              </button>
            }
          >
            <p className="text-lg font-semibold text-[var(--text-primary)]">
              <span className="font-mono text-[var(--accent-primary)]">
                {data?.pending?.brand?.display_name_target ||
                  channel?.displayNameTarget ||
                  "Curio Why Science"}
              </span>
              {" · "}
              <span className="font-mono text-[var(--text-secondary)]">
                @{data?.pending?.brand?.handle || channel?.handle || "CurioWhyScience"}
              </span>
            </p>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              {data?.pending?.brand?.name_note ||
                "Active channel for this Studio. Retired Click Case Files platforms are hidden."}
            </p>
          </StudioPanel>

          <StudioPanel
            title="Last publish"
            action={
              last?.verify?.youtube ? (
                <ExtLink href={last.verify.youtube}>Open YouTube</ExtLink>
              ) : undefined
            }
          >
            {last ? (
              <div className="space-y-3">
                <p className="text-lg font-semibold text-[var(--text-primary)]">
                  {last.title || last.topic || "Untitled run"}
                </p>
                <p className="text-sm text-[var(--text-secondary)]">
                  {last.kind || "?"} · {last.at || "?"} ·{" "}
                  <span className={statusPill(last.overall)}>{last.overall || "unknown"}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(last.channels || {}).map(([name, status]) => (
                    <span key={name} className={statusPill(status)}>
                      {name}: {status}
                    </span>
                  ))}
                </div>
                {last.errors && last.errors.length > 0 && (
                  <ul className="mt-2 space-y-1 text-sm text-red-300">
                    {last.errors.map((e, i) => (
                      <li key={`${e.channel}-${i}`}>
                        <strong>{e.channel}</strong>: {e.error}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : (
              <p className="text-sm text-[var(--text-muted)]">
                No Curio publish yet. After the next Curio Actions run, the latest YouTube result appears here
                (Click Case Files history stays archived).
              </p>
            )}
          </StudioPanel>

          <StudioPanel title="Recent Curio history">
            {data?.history?.length ? (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead>
                    <tr className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                      <th className="pb-3 font-semibold">When</th>
                      <th className="pb-3 font-semibold">Kind</th>
                      <th className="pb-3 font-semibold">Title</th>
                      <th className="pb-3 font-semibold">Overall</th>
                      <th className="pb-3 font-semibold">Channels</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.history.slice(0, 10).map((row, i) => (
                      <tr key={`${row.at}-${i}`} className="border-t border-white/[0.06]">
                        <td className="py-3 text-[var(--text-muted)]">{row.at || "-"}</td>
                        <td className="py-3">{row.kind || "-"}</td>
                        <td className="py-3">{row.title || row.topic || "-"}</td>
                        <td className="py-3">
                          <span className={statusPill(row.overall)}>{row.overall || "?"}</span>
                        </td>
                        <td className="py-3">
                          <div className="flex flex-wrap gap-1">
                            {Object.entries(row.channels || {}).map(([name, status]) => (
                              <span key={name} className={statusPill(status)}>
                                {name}
                              </span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-[var(--text-muted)]">No upload history yet.</p>
            )}
          </StudioPanel>
        </div>
      )}

      {tab === "pending" && (
        <div className="space-y-6">
          <StudioPanel title="Approved brand names">
            <dl className="grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">YouTube display</dt>
                <dd className="mt-1 font-mono text-[var(--text-primary)]">
                  {data?.pending?.brand?.display_name_target || "Curio Why Science"}
                </dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">Handle</dt>
                <dd className="mt-1 font-mono text-[var(--text-primary)]">
                  @{data?.pending?.brand?.handle || channel?.handle || "CurioWhyScience"}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">Note</dt>
                <dd className="mt-1 text-[var(--text-secondary)]">
                  {data?.pending?.brand?.name_note ||
                    "Quota only until 2026-10-08. Not a policy reject."}
                </dd>
              </div>
            </dl>
          </StudioPanel>

          <StudioPanel title="Timed reminders">
            <p className="mb-4 text-sm text-[var(--text-secondary)]">
              Due items light up when the unlock date arrives. Mark done in{" "}
              <code className="font-mono">data/pending-work.json</code> (repo) or{" "}
              <code className="font-mono">content/studio/pending-work.json</code> after you finish.
              List updated {data?.pending?.updated_at || "—"}.
            </p>
            {data?.pending?.items?.length ? (
              <ul className="space-y-3">
                {data.pending.items.map((item) => (
                  <li
                    key={item.id}
                    className={cn(
                      "rounded-xl border px-4 py-3",
                      item.state === "due"
                        ? "border-amber-500/35 bg-amber-500/10"
                        : item.state === "waiting"
                          ? "border-sky-500/20 bg-sky-500/5"
                          : "border-emerald-500/20 bg-emerald-500/5"
                    )}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={pendingPill(item.state)}>
                        {item.state === "due"
                          ? "due now"
                          : item.state === "waiting"
                            ? `in ${item.days_until}d`
                            : "done"}
                      </span>
                      <span className="text-xs text-[var(--text-muted)]">{item.platform}</span>
                      <span className="font-mono text-xs text-[var(--text-muted)]">due {item.due_on}</span>
                    </div>
                    <p className="mt-2 font-semibold text-[var(--text-primary)]">{item.title}</p>
                    {item.value && (
                      <p className="mt-1 font-mono text-sm text-[var(--accent-primary)]">{item.value}</p>
                    )}
                    <p className="mt-1 text-sm text-[var(--text-secondary)]">{item.detail}</p>
                    {item.action_url && (
                      <div className="mt-2">
                        <ExtLink href={item.action_url}>Open to do it</ExtLink>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-[var(--text-muted)]">No pending items loaded.</p>
            )}
          </StudioPanel>
        </div>
      )}

      {tab === "publish" && (
        <div className="space-y-6">
          <StudioPanel title="Dispatch GitHub Actions">
            <p className="mb-4 text-sm text-[var(--text-secondary)]">
              Creates and uploads on GitHub runners (free). Use these instead of a local PC. Repo:{" "}
              <ExtLink href={`https://github.com/${data?.repo || "alihamzaio/yt-auto-studio"}`}>
                {data?.repo || "alihamzaio/yt-auto-studio"}
              </ExtLink>
            </p>
            <div className="flex flex-wrap gap-3">
              {Object.entries(data?.workflows || {}).map(([key, meta]) => (
                <button
                  key={key}
                  type="button"
                  disabled={Boolean(dispatching) || !data?.hasGithubToken}
                  onClick={() => void dispatch(key)}
                  className={cn(
                    "inline-flex items-center gap-2",
                    key === "curio_long" || key === "curio_short" ? "btn-primary" : "btn-secondary"
                  )}
                >
                  {dispatching === key ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                  {meta.label}
                </button>
              ))}
            </div>
          </StudioPanel>

          <StudioPanel title="Quick links">
            <div className="flex flex-wrap gap-4 text-sm">
              <ExtLink href={`https://github.com/${data?.repo}/actions`}>All Actions</ExtLink>
              <ExtLink href={`https://github.com/${data?.repo}/actions/workflows/curio_topic_finder.yml`}>
                Curio long workflow
              </ExtLink>
              <ExtLink href="https://www.youtube.com/@CurioWhyScience">Curio YouTube</ExtLink>
              <ExtLink href="https://studio.youtube.com/channel/UCylbJf-Objxcejpae6z5R2g">
                YouTube Studio
              </ExtLink>
            </div>
          </StudioPanel>
        </div>
      )}

      {tab === "videos" && (
        <div className="space-y-6">
          <StudioPanel title="Uploaded on YouTube (Curio)">
            <p className="mb-4 text-sm text-[var(--text-secondary)]">
              Only videos that uploaded successfully to{" "}
              <strong className="text-[var(--text-primary)]">@CurioWhyScience</strong>. Open on YouTube, or
              download the Curio pipeline zip when an artifact is still available.
            </p>
            {data?.publishedVideos?.length ? (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-left text-sm">
                  <thead>
                    <tr className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                      <th className="pb-3 font-semibold">Title</th>
                      <th className="pb-3 font-semibold">Format</th>
                      <th className="pb-3 font-semibold">When</th>
                      <th className="pb-3 font-semibold">YouTube</th>
                      <th className="pb-3 font-semibold">Download</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.publishedVideos.map((v) => {
                      const art = v.artifact
                      const canDl = Boolean(art && !art.expired && art.size_mb >= 1)
                      return (
                        <tr key={v.youtube_id} className="border-t border-white/[0.06]">
                          <td className="py-3 font-medium">{v.title}</td>
                          <td className="py-3 text-[var(--text-muted)]">{v.format}</td>
                          <td className="py-3 text-[var(--text-muted)]">{v.date || "-"}</td>
                          <td className="py-3">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className={statusPill("ok")}>uploaded</span>
                              <ExtLink href={v.youtube_url}>Open video</ExtLink>
                            </div>
                          </td>
                          <td className="py-3">
                            {canDl && art ? (
                              <button
                                type="button"
                                disabled={downloadingId === art.id}
                                onClick={() => void downloadArtifact(art)}
                                className="btn-primary inline-flex items-center gap-2 !px-3 !py-1.5 text-xs"
                              >
                                {downloadingId === art.id ? (
                                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                ) : (
                                  <Download className="h-3.5 w-3.5" />
                                )}
                                Download zip ({art.size_mb} MB)
                              </button>
                            ) : (
                              <span className="text-xs text-[var(--text-muted)]">
                                Zip expired — use YouTube Studio download
                              </span>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-[var(--text-muted)]">
                No successful Curio YouTube uploads yet. After the next Curio long run finishes Step 12, videos
                appear here.
              </p>
            )}
          </StudioPanel>

          <StudioPanel title="Shorts">
            <p className="text-sm text-[var(--text-secondary)]">
              {data?.shorts_note ||
                "Curio Shorts: real B-roll + short narration. Dispatch from Create & publish."}
            </p>
            {data?.shorts_enabled ? (
              <p className="mt-3 text-xs text-[var(--text-muted)]">
                After upload, Shorts appear in this tab with format <strong>short</strong> and an Open YouTube
                link.
              </p>
            ) : null}
          </StudioPanel>

          <StudioPanel title="Open YouTube Studio">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {(data?.platforms || [])
                .filter((p) => p.group === "Publish")
                .map((p) => (
                  <a
                    key={p.id}
                    href={p.url}
                    target="_blank"
                    rel="noreferrer"
                    className="glass-card-interactive rounded-xl border border-white/[0.06] px-4 py-4 text-sm font-medium text-[var(--text-primary)]"
                  >
                    {p.label}
                  </a>
                ))}
            </div>
          </StudioPanel>
        </div>
      )}

      {tab === "platforms" && (
        <div className="space-y-6">
          {["Publish", "Tools", "Ops"].map((group) => {
            const rows = (data?.platforms || []).filter((p) => p.group === group)
            if (!rows.length) return null
            return (
              <StudioPanel key={group} title={group}>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {rows.map((p) => (
                    <a
                      key={p.id}
                      href={p.url}
                      target="_blank"
                      rel="noreferrer"
                      className="glass-card-interactive rounded-xl border border-white/[0.06] px-4 py-4 text-sm font-medium text-[var(--text-primary)] transition-colors hover:border-[var(--accent-primary)]/40"
                    >
                      {p.label}
                    </a>
                  ))}
                </div>
              </StudioPanel>
            )
          })}
        </div>
      )}

      {tab === "runs" && (
        <StudioPanel title="Recent GitHub Actions runs">
          {data?.runs?.length ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                    <th className="pb-3 font-semibold">Workflow</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold">When</th>
                    <th className="pb-3 font-semibold">Link</th>
                  </tr>
                </thead>
                <tbody>
                  {data.runs.map((r) => (
                    <tr key={r.id} className="border-t border-white/[0.06]">
                      <td className="py-3">{r.display_title || r.name}</td>
                      <td className="py-3">
                        <span className={statusPill(r.conclusion || r.status)}>
                          {r.status}
                          {r.conclusion ? ` / ${r.conclusion}` : ""}
                        </span>
                      </td>
                      <td className="py-3 text-[var(--text-muted)]">{r.created_at}</td>
                      <td className="py-3">
                        <ExtLink href={r.html_url}>open</ExtLink>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-[var(--text-muted)]">No runs loaded. Check GITHUB_TOKEN permissions.</p>
          )}
        </StudioPanel>
      )}

      {tab === "failures" && (
        <StudioPanel title="What failed + what to do">
          {data?.failures?.length ? (
            <ul className="space-y-4">
              {data.failures.map((f, i) => (
                <li
                  key={`${f.at}-${f.channel}-${i}`}
                  className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm"
                >
                  <div className="mb-1 flex flex-wrap items-center gap-2 text-[var(--text-muted)]">
                    <AlertTriangle className="h-3.5 w-3.5 text-red-400" />
                    {f.at || "?"} · {f.kind || "?"} · {f.title || "run"}
                    {f.severity ? (
                      <span className={statusPill(f.severity === "block" ? "failure" : "partial")}>
                        {f.severity}
                      </span>
                    ) : null}
                  </div>
                  <p className="text-[var(--text-primary)]">
                    <strong>{f.channel}</strong>: {f.error}
                  </p>
                  {f.fix ? (
                    <p className="mt-2 text-[var(--accent-primary)]">Do next: {f.fix}</p>
                  ) : null}
                  {f.action_url ? (
                    <div className="mt-2">
                      <ExtLink href={f.action_url}>Open fix link</ExtLink>
                    </div>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex items-center gap-2 text-sm text-emerald-300">
              <CheckCircle2 className="h-4 w-4" />
              No recorded failures. Good.
            </div>
          )}
        </StudioPanel>
      )}
    </StudioShell>
  )
}
