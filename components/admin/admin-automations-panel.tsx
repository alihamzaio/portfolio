"use client"

import { useCallback, useEffect, useState } from "react"
import { ChevronDown, ExternalLink, Loader2, Play, RefreshCw } from "lucide-react"
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
  note?: string
  verify?: Record<string, string>
  links?: Record<string, string>
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

const PRIMARY_CHANNELS = ["youtube", "blog", "tiktok", "threads", "facebook", "instagram"] as const

const CHANNEL_HELP: Record<string, string> = {
  youtube: "Public Short via YouTube API on GitHub Actions (laptop off)",
  blog: "Portfolio blog via GitHub PR on Actions",
  tiktok: "TikTok Studio headless on Actions (session secret). Must be Everyone.",
  threads:
    "Threads on Actions: Graph API if META_THREADS_TOKEN is set, else CI Playwright (not your laptop)",
  facebook: "Facebook Page reel via Meta Graph API on Actions",
  instagram: "Instagram Reel via Meta Graph API on Actions (needs public video URL host)",
  threads_api: "Optional. Skipped until you add META_THREADS_TOKEN once (setup_threads_api.py)",
}

function verifyUrlFor(channel: string, run: UploadRunRow | null): string {
  const fromRun = run?.verify?.[channel] || run?.links?.[channel]
  if (fromRun) return fromRun
  if (channel === "youtube" && run?.youtube_id) {
    return `https://www.youtube.com/watch?v=${run.youtube_id}`
  }
  const defaults: Record<string, string> = {
    youtube: "https://www.youtube.com/@DevBuildDaily",
    blog: "https://alihamza-fawn.vercel.app/blog",
    tiktok: "https://www.tiktok.com/@devbuild.daily",
    threads: "https://www.threads.com/@devbuild.daily",
    facebook: "https://www.facebook.com/devbuild.daily",
    instagram: "https://www.instagram.com/devbuild.daily",
    threads_api: "https://developers.facebook.com/docs/threads",
  }
  return defaults[channel] || "#"
}

export function AdminAutomationsPanel({ onNotice, onError }: Props) {
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState<string | null>(null)
  const [repo, setRepo] = useState("")
  const [lastRun, setLastRun] = useState<UploadRunRow | null>(null)
  const [history, setHistory] = useState<UploadRunRow[]>([])
  const [runs, setRuns] = useState<WorkflowRun[]>([])
  const [platforms, setPlatforms] = useState<PlatformLink[]>([])
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null)
  const [expandedAt, setExpandedAt] = useState<string | null>(null)

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

  const dispatch = async (workflow: string, extra?: { topic?: string }) => {
    setBusy(workflow + (extra?.topic || ""))
    onError("")
    try {
      const res = await adminFetch("/api/admin/automations/dispatch", {
        method: "POST",
        headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({ workflow, topic: extra?.topic || undefined }),
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
  const channelEntries = [
    ...PRIMARY_CHANNELS.map((name) => [name, channels[name] || "unknown"] as const),
    ...Object.entries(channels).filter(
      ([name]) =>
        name !== "threads_api" &&
        !PRIMARY_CHANNELS.includes(name as (typeof PRIMARY_CHANNELS)[number])
    ),
  ]
  const selectedError =
    selectedChannel && lastRun?.errors?.find((e) => e.channel === selectedChannel)?.error

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
          Daily Shorts run on <strong>GitHub Actions</strong> (laptop can be off). Local Cursor browser is only for
          checking links, not for uploading. Click a channel for details. Repo:{" "}
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
            label="Re-run last topic"
            busy={busy === "daily_short" + (lastRun?.topic || "")}
            onClick={() => void dispatch("daily_short", { topic: lastRun?.topic || undefined })}
            secondary
            disabled={!lastRun?.topic}
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
                {lastRun?.at ? new Date(lastRun.at).toLocaleString() : "No status file yet"}
                {lastRun?.kind ? ` · ${lastRun.kind}` : ""}
              </p>
            </div>
            {lastRun?.overall ? <StatusPill status={lastRun.overall} /> : null}
          </div>
          {lastRun?.title ? (
            <p className="text-sm text-[var(--text-secondary)] mb-3">{lastRun.title}</p>
          ) : null}

          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {channelEntries.map(([name, status]) => (
              <button
                key={name}
                type="button"
                onClick={() => setSelectedChannel((cur) => (cur === name ? null : name))}
                className={cn(
                  "flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-xs text-left transition-colors",
                  selectedChannel === name
                    ? "border-[var(--accent-primary)]/40 bg-[var(--accent-primary)]/5"
                    : "border-white/[0.06] hover:border-white/15"
                )}
              >
                <span className="capitalize text-[var(--text-secondary)]">{name.replace(/_/g, " ")}</span>
                <StatusPill status={status} small />
              </button>
            ))}
          </div>

          {selectedChannel ? (
            <div className="mt-4 rounded-lg border border-white/[0.08] bg-black/20 p-3 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-medium text-[var(--text-primary)] capitalize">
                  {selectedChannel.replace(/_/g, " ")} details
                </p>
                <StatusPill status={channels[selectedChannel] || "unknown"} small />
              </div>
              <p className="text-xs text-[var(--text-muted)]">
                {CHANNEL_HELP[selectedChannel] || "Channel status from the last pipeline write."}
              </p>
              {selectedError ? (
                <p className="text-xs text-red-400 whitespace-pre-wrap">{selectedError}</p>
              ) : (
                <p className="text-xs text-[var(--text-secondary)]">
                  {channels[selectedChannel] === "ok"
                    ? "No error recorded for this channel."
                    : channels[selectedChannel] === "skipped"
                      ? "Skipped on purpose (optional / not configured)."
                      : "No detail string stored."}
                </p>
              )}
              <div className="flex flex-wrap gap-2 pt-1">
                <a
                  href={verifyUrlFor(selectedChannel, lastRun)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-2.5 py-1.5 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                >
                  Open / verify <ExternalLink className="h-3 w-3" />
                </a>
                {selectedChannel === "threads" || channels[selectedChannel] === "error" ? (
                  <RunButton
                    label="Re-run Daily Short (fix)"
                    busy={!!busy?.startsWith("daily_short")}
                    onClick={() => void dispatch("daily_short")}
                    secondary
                  />
                ) : null}
              </div>
            </div>
          ) : (
            <p className="mt-3 text-xs text-[var(--text-muted)]">Click any channel pill for error text and verify link.</p>
          )}

          {lastRun?.note ? (
            <p className="mt-3 text-xs text-[var(--text-muted)]">{lastRun.note}</p>
          ) : null}
        </div>

        <h3 className="text-sm font-medium text-[var(--text-primary)] mb-2">Recent days</h3>
        {history.length === 0 ? (
          <p className="text-sm text-[var(--text-muted)] mb-6">History fills after pipeline writes.</p>
        ) : (
          <div className="mb-6 space-y-2">
            {history.slice(0, 14).map((row, i) => {
              const key = `${row.at}-${i}`
              const open = expandedAt === key
              return (
                <div key={key} className="rounded-lg border border-white/[0.06] overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setExpandedAt(open ? null : key)}
                    className="flex w-full items-center gap-3 px-3 py-2.5 text-left text-xs hover:bg-white/[0.02]"
                  >
                    <ChevronDown
                      className={cn(
                        "h-3.5 w-3.5 shrink-0 text-[var(--text-muted)] transition-transform",
                        open && "rotate-180"
                      )}
                    />
                    <span className="text-[var(--text-secondary)] whitespace-nowrap w-[140px] shrink-0">
                      {row.at ? new Date(row.at).toLocaleString() : "-"}
                    </span>
                    <span className="capitalize w-14 shrink-0">{row.kind || "-"}</span>
                    <StatusPill status={row.overall || "unknown"} small />
                    <span className="text-[var(--text-muted)] truncate flex-1">{row.title || row.topic || "-"}</span>
                  </button>
                  {open ? (
                    <div className="border-t border-white/[0.06] px-3 py-3 space-y-3 bg-black/10">
                      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                        {Object.entries(row.channels || {}).map(([name, status]) => (
                          <div
                            key={name}
                            className="flex items-center justify-between gap-2 rounded-md border border-white/[0.05] px-2.5 py-1.5 text-[11px]"
                          >
                            <span className="capitalize text-[var(--text-secondary)]">{name.replace(/_/g, " ")}</span>
                            <StatusPill status={status} small />
                          </div>
                        ))}
                      </div>
                      {row.errors?.length ? (
                        <ul className="space-y-1 text-xs text-red-400">
                          {row.errors.map((e) => (
                            <li key={`${e.channel}-${e.error.slice(0, 24)}`}>
                              {e.channel}: {e.error || "error"}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                      <div className="flex flex-wrap gap-2">
                        {row.youtube_id ? (
                          <a
                            href={`https://www.youtube.com/watch?v=${row.youtube_id}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-[var(--accent-primary)] hover:underline"
                          >
                            YouTube <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : null}
                        <a
                          href={verifyUrlFor("threads", row)}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                        >
                          Threads profile <ExternalLink className="h-3 w-3" />
                        </a>
                        <RunButton
                          label="Re-run this topic"
                          busy={busy === "daily_short" + (row.topic || "")}
                          onClick={() => void dispatch("daily_short", { topic: row.topic || undefined })}
                          secondary
                          disabled={!row.topic}
                        />
                      </div>
                    </div>
                  ) : null}
                </div>
              )
            })}
          </div>
        )}

        <h3 className="text-sm font-medium text-[var(--text-primary)] mb-2">GitHub Actions</h3>
        <ul className="space-y-2 mb-2">
          {runs.length === 0 ? (
            <li className="text-sm text-[var(--text-muted)]">No recent Actions (check GITHUB_TOKEN on the server).</li>
          ) : (
            runs.map((r) => (
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
            ))
          )}
        </ul>
      </Panel>

      <Panel title="Platform bookmarks">
        <p className="text-sm text-[var(--text-muted)] mb-4">
          Open these and pin in your browser (Ctrl+D). Names are numbered so they sort together.
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
  disabled,
}: {
  label: string
  onClick: () => void
  busy?: boolean
  secondary?: boolean
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      disabled={busy || disabled}
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
