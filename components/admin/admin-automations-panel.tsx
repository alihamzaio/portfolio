"use client"

import { useCallback, useEffect, useState } from "react"
import { ExternalLink, Loader2, Play, RefreshCw } from "lucide-react"
import { Panel } from "@/components/admin/admin-shell"
import { adminFetch, getAuthHeaders } from "@/lib/auth-client"
import { cn } from "@/lib/utils"

type ChannelStatus = string

type UploadRunRow = {
  at: string | null
  kind: string | null
  topic?: string
  title?: string
  youtube_id?: string
  overall?: string
  channels?: Record<string, ChannelStatus>
  errors?: Array<{ channel: string; error: string }>
}

type WorkflowRun = {
  id: number
  name: string
  status: string
  conclusion: string | null
  html_url: string
  created_at: string
  display_title?: string
}

type PlatformLink = { id: string; label: string; url: string }

type Props = {
  onNotice: (msg: string) => void
  onError: (msg: string) => void
}

export function AdminAutomationsPanel({ onNotice, onError }: Props) {
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState<string | null>(null)
  const [repo, setRepo] = useState("")
  const [lastRun, setLastRun] = useState<UploadRunRow | null>(null)
  const [history, setHistory] = useState<UploadRunRow[]>([])
  const [runs, setRuns] = useState<WorkflowRun[]>([])
  const [platforms, setPlatforms] = useState<PlatformLink[]>([])

  const load = useCallback(async () => {
    setLoading(true)
    onError("")
    try {
      const res = await adminFetch("/api/admin/automations", { headers: getAuthHeaders() })
      const data = await res.json().catch(() => null)
      if (!res.ok) throw new Error(typeof data?.error === "string" ? data.error : "Load failed")
      setRepo(String(data.repo || ""))
      setLastRun(data.lastRun || null)
      setHistory(Array.isArray(data.history) ? data.history : [])
      setRuns(Array.isArray(data.runs) ? data.runs : [])
      setPlatforms(Array.isArray(data.platforms) ? data.platforms : [])
    } catch (e) {
      onError(e instanceof Error ? e.message : "Load failed")
    } finally {
      setLoading(false)
    }
  }, [onError])

  useEffect(() => {
    void load()
  }, [load])

  const dispatch = async (workflow: string) => {
    setBusy(workflow)
    onError("")
    try {
      const res = await adminFetch("/api/admin/automations/dispatch", {
        method: "POST",
        headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({ workflow }),
      })
      const data = await res.json().catch(() => null)
      if (!res.ok) throw new Error(typeof data?.error === "string" ? data.error : "Dispatch failed")
      onNotice(typeof data?.message === "string" ? data.message : "Workflow started")
      window.setTimeout(() => void load(), 4000)
    } catch (e) {
      onError(e instanceof Error ? e.message : "Dispatch failed")
    } finally {
      setBusy(null)
    }
  }

  if (loading) {
    return (
      <Panel title="DevBuildDaily">
        <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading tracker…
        </div>
      </Panel>
    )
  }

  const channels = lastRun?.channels || {}

  return (
    <div className="space-y-6">
      <Panel
        title="DevBuildDaily tracker"
        action={
          <button
            type="button"
            onClick={() => void load()}
            className="inline-flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </button>
        }
      >
        <p className="text-sm text-[var(--text-muted)] mb-4 max-w-2xl">
          Track daily Short / weekly Long uploads across YouTube, Facebook, Instagram, TikTok, Threads, and
          blog. If a day fails, use the manual run buttons below. Repo:{" "}
          <a
            href={`https://github.com/${repo}`}
            target="_blank"
            rel="noreferrer"
            className="text-[var(--accent-primary)] hover:underline"
          >
            {repo || "yt-auto-studio"}
          </a>
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          <RunButton
            label="Run Daily Short now"
            busy={busy === "daily_short"}
            onClick={() => void dispatch("daily_short")}
          />
          <RunButton
            label="Run Weekly Long now"
            busy={busy === "weekly_long"}
            onClick={() => void dispatch("weekly_long")}
            secondary
          />
          <RunButton
            label="Run Session Keepalive"
            busy={busy === "session_keepalive"}
            onClick={() => void dispatch("session_keepalive")}
            secondary
          />
        </div>

        <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 mb-6">
          <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
            <div>
              <p className="text-sm font-medium text-[var(--text-primary)]">Last pipeline run</p>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                {lastRun?.at ? new Date(lastRun.at).toLocaleString() : "No status file yet (runs after next upload)"}
                {lastRun?.kind ? ` · ${lastRun.kind}` : ""}
              </p>
            </div>
            {lastRun?.overall ? <StatusPill status={lastRun.overall} /> : null}
          </div>
          {lastRun?.title ? (
            <p className="text-sm text-[var(--text-secondary)] mb-3">{lastRun.title}</p>
          ) : null}
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(channels).map(([name, status]) => (
              <div
                key={name}
                className="flex items-center justify-between gap-2 rounded-lg border border-white/[0.06] px-3 py-2 text-xs"
              >
                <span className="capitalize text-[var(--text-secondary)]">{name.replace(/_/g, " ")}</span>
                <StatusPill status={status} small />
              </div>
            ))}
          </div>
          {lastRun?.errors?.length ? (
            <ul className="mt-3 space-y-1 text-xs text-red-400">
              {lastRun.errors.map((e) => (
                <li key={`${e.channel}-${e.error.slice(0, 24)}`}>
                  {e.channel}: {e.error || "error"}
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <h3 className="text-sm font-medium text-[var(--text-primary)] mb-2">Recent days</h3>
        {history.length === 0 ? (
          <p className="text-sm text-[var(--text-muted)] mb-6">History fills after the next successful pipeline write.</p>
        ) : (
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-left text-xs">
              <thead className="text-[var(--text-muted)]">
                <tr className="border-b border-white/[0.06]">
                  <th className="py-2 pr-3 font-medium">When</th>
                  <th className="py-2 pr-3 font-medium">Kind</th>
                  <th className="py-2 pr-3 font-medium">Overall</th>
                  <th className="py-2 pr-3 font-medium">Title</th>
                </tr>
              </thead>
              <tbody>
                {history.slice(0, 14).map((row, i) => (
                  <tr key={`${row.at}-${i}`} className="border-b border-white/[0.04]">
                    <td className="py-2 pr-3 text-[var(--text-secondary)] whitespace-nowrap">
                      {row.at ? new Date(row.at).toLocaleString() : "-"}
                    </td>
                    <td className="py-2 pr-3 capitalize">{row.kind || "-"}</td>
                    <td className="py-2 pr-3">
                      <StatusPill status={row.overall || "unknown"} small />
                    </td>
                    <td className="py-2 pr-3 text-[var(--text-muted)] truncate max-w-[240px]">
                      {row.title || row.topic || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <h3 className="text-sm font-medium text-[var(--text-primary)] mb-2">GitHub Actions</h3>
        <ul className="space-y-2 mb-2">
          {runs.map((r) => (
            <li
              key={r.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-white/[0.06] px-3 py-2 text-xs"
            >
              <div className="min-w-0">
                <p className="text-[var(--text-primary)] truncate">{r.name}</p>
                <p className="text-[var(--text-muted)]">{new Date(r.created_at).toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-2">
                <StatusPill status={r.conclusion || r.status} small />
                <a
                  href={r.html_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[var(--text-muted)] hover:text-[var(--accent-primary)]"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel title="Platform bookmarks">
        <p className="text-sm text-[var(--text-muted)] mb-4">
          Open these in order and pin/bookmark in your browser (Ctrl+D). Names are numbered so they sort
          together.
        </p>
        <ul className="space-y-2">
          {platforms.map((p) => (
            <li key={p.id}>
              <a
                href={p.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between gap-3 rounded-lg border border-white/[0.06] px-3 py-2.5 text-sm hover:border-white/15"
              >
                <span className="text-[var(--text-primary)]">{p.label}</span>
                <ExternalLink className="h-3.5 w-3.5 text-[var(--text-muted)] shrink-0" />
              </a>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  )
}

function RunButton({
  label,
  onClick,
  busy,
  secondary,
}: {
  label: string
  onClick: () => void
  busy?: boolean
  secondary?: boolean
}) {
  return (
    <button
      type="button"
      disabled={busy}
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium disabled:opacity-50",
        secondary
          ? "border border-white/10 text-[var(--text-secondary)]"
          : "bg-[var(--accent-primary)] text-black"
      )}
    >
      {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />}
      {label}
    </button>
  )
}

function StatusPill({ status, small }: { status: string; small?: boolean }) {
  const s = (status || "unknown").toLowerCase()
  const styles =
    s === "ok" || s === "success"
      ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/25"
      : s === "error" || s === "failure"
        ? "bg-red-500/15 text-red-400 border-red-500/25"
        : s === "partial" || s === "in_progress" || s === "queued"
          ? "bg-amber-500/15 text-amber-300 border-amber-500/25"
          : "bg-white/5 text-neutral-400 border-white/10"
  return (
    <span
      className={cn(
        "inline-flex rounded-md border uppercase tracking-wider",
        small ? "text-[10px] px-1.5 py-0.5" : "text-[10px] px-2 py-1",
        styles
      )}
    >
      {s.replace(/_/g, " ")}
    </span>
  )
}
