"use client"

import { useCallback, useEffect, useState } from "react"
import { AlertTriangle, CheckCircle2, Loader2, Play, RefreshCw } from "lucide-react"
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

type StudioPayload = {
  channel: { name: string; handle: string; tagline: string; signoff: string }
  platforms: Platform[]
  workflows: Workflows
  repo: string
  hasGithubToken: boolean
  last: HistoryRow | null
  history: HistoryRow[]
  failures: { at?: string; title?: string; kind?: string; channel?: string; error?: string }[]
  runs: Run[]
  stats: { publishes: number; ok: number; failed: number; running: number; platforms: number }
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

  const stats = data?.stats || { publishes: 0, ok: 0, failed: 0, running: 0, platforms: 0 }
  const last = data?.last
  const channel = data?.channel

  return (
    <StudioShell tab={tab} onTab={setTab} onLogout={onLogout} stats={stats}>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-display text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            {channel?.name || "Behind The Price"} Studio
          </p>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            {channel?.tagline || "Channel create + publish ops"}
            {channel?.signoff ? ` · “${channel.signoff}”` : ""}
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
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Publishes" value={stats.publishes} sub="From upload history in repo" />
            <StatCard label="Successful" value={stats.ok} sub="overall = ok" />
            <StatCard label="Failed / errored" value={stats.failed} sub="Needs retry or fix" />
            <StatCard label="Actions running" value={stats.running} sub="Queued or in progress" />
          </div>

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
                No <code className="font-mono">data/last-run.json</code> in the yt-auto-studio repo yet. Dispatch a
                Short to create one.
              </p>
            )}
          </StudioPanel>

          <StudioPanel title="Recent history">
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
                    key === "daily_short" ? "btn-primary" : "btn-secondary"
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
              <ExtLink href={`https://github.com/${data?.repo}/actions/workflows/daily_short.yml`}>
                Daily Short workflow
              </ExtLink>
              <ExtLink href={`https://github.com/${data?.repo}/actions/workflows/weekly_long.yml`}>
                Weekly Long workflow
              </ExtLink>
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
        <StudioPanel title="Why it failed">
          {data?.failures?.length ? (
            <ul className="space-y-4">
              {data.failures.map((f, i) => (
                <li
                  key={`${f.at}-${f.channel}-${i}`}
                  className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm"
                >
                  <div className="mb-1 flex items-center gap-2 text-[var(--text-muted)]">
                    <AlertTriangle className="h-3.5 w-3.5 text-red-400" />
                    {f.at || "?"} · {f.kind || "?"} · {f.title || "run"}
                  </div>
                  <p className="text-[var(--text-primary)]">
                    <strong>{f.channel}</strong>: {f.error}
                  </p>
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
