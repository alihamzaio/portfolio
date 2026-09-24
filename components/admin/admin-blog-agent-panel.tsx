"use client"

import { useCallback, useEffect, useState } from "react"
import { Panel } from "@/components/admin/admin-shell"
import { adminFetch, getAuthHeaders } from "@/lib/auth-client"
import { cn } from "@/lib/utils"
import type { BlogAgentRun, BlogAgentState } from "@/lib/blog-agent-types"

type Props = {
  onNotice: (message: string) => void
  onError: (message: string | null) => void
}

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

export function AdminBlogAgentPanel({ onNotice, onError }: Props) {
  const [state, setState] = useState<BlogAgentState | null>(null)
  const [groqConfigured, setGroqConfigured] = useState(false)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [pillarsText, setPillarsText] = useState("")

  const load = useCallback(async () => {
    setLoading(true)
    onError(null)
    try {
      const res = await adminFetch("/api/admin/blog-agent", { headers: getAuthHeaders() })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to load blog agent")
      setState(data.state as BlogAgentState)
      setGroqConfigured(Boolean(data.groqConfigured))
      setPillarsText(((data.state as BlogAgentState).pillars || []).join("\n"))
    } catch (e) {
      onError(e instanceof Error ? e.message : "Failed to load")
    } finally {
      setLoading(false)
    }
  }, [onError])

  useEffect(() => {
    void load()
  }, [load])

  const saveSettings = async () => {
    if (!state) return
    setBusy(true)
    onError(null)
    try {
      const pillars = pillarsText
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean)
      const res = await adminFetch("/api/admin/blog-agent", {
        method: "PATCH",
        headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({
          enabled: state.enabled,
          publishWeekdaysUtc: state.publishWeekdaysUtc,
          maxRetries: state.maxRetries,
          pillars,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Save failed")
      setState(data.state)
      onNotice("Blog agent settings saved")
    } catch (e) {
      onError(e instanceof Error ? e.message : "Save failed")
    } finally {
      setBusy(false)
    }
  }

  const runNow = async (opts?: { force?: boolean; retryId?: string }) => {
    setBusy(true)
    onError(null)
    try {
      const res = await adminFetch("/api/admin/blog-agent", {
        method: "POST",
        headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify(opts || { force: true }),
      })
      const data = await res.json()
      if (!res.ok && data.action !== "error") {
        throw new Error(data.error || data.run?.error || "Run failed")
      }
      if (data.state) setState(data.state)
      if (data.ok) {
        onNotice(
          data.action === "skipped"
            ? `Skipped: ${data.run?.reason || "n/a"}`
            : `OK (${data.action}): ${data.run?.title || data.run?.topic || data.run?.id}`
        )
      } else {
        onError(data.run?.error || "Run failed")
      }
      await load()
    } catch (e) {
      onError(e instanceof Error ? e.message : "Run failed")
    } finally {
      setBusy(false)
    }
  }

  const toggleDay = (day: number) => {
    if (!state) return
    const set = new Set(state.publishWeekdaysUtc)
    if (set.has(day)) set.delete(day)
    else set.add(day)
    setState({ ...state, publishWeekdaysUtc: [...set].sort() })
  }

  const statusClass = (s: BlogAgentRun["status"]) =>
    s === "ok"
      ? "text-emerald-400"
      : s === "error"
        ? "text-red-400"
        : "text-[var(--text-muted)]"

  return (
    <div className="space-y-6">
      <Panel title="Blog Agent">
        <p className="text-sm text-[var(--text-secondary)] mb-4">
          Auto-publishes viral, SEO-friendly trend posts 3x/week (Mon / Wed / Fri UTC by default) via Groq.
          Focus is search demand and shareability (side hustles, AI, creator growth), not tech-stack tutorials.
          Failed jobs stay in history and are retried automatically (up to max retries).
        </p>

        {loading || !state ? (
          <p className="text-sm text-[var(--text-muted)]">Loading…</p>
        ) : (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={state.enabled}
                  onChange={(e) => setState({ ...state, enabled: e.target.checked })}
                />
                Enabled
              </label>
              <span
                className={cn(
                  "text-xs px-2 py-1 rounded-md border",
                  groqConfigured
                    ? "border-emerald-500/30 text-emerald-400"
                    : "border-red-500/30 text-red-400"
                )}
              >
                {groqConfigured ? "GROQ_API_KEY ready" : "GROQ_API_KEY missing"}
              </span>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-[var(--text-muted)] mb-2">
                Publish days (UTC)
              </p>
              <div className="flex flex-wrap gap-2">
                {DAY_LABELS.map((label, day) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={cn(
                      "px-2.5 py-1.5 rounded-lg text-xs border",
                      state.publishWeekdaysUtc.includes(day)
                        ? "border-[var(--accent-primary)] text-[var(--accent-primary)] bg-[var(--accent-primary)]/10"
                        : "border-white/10 text-[var(--text-secondary)]"
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <label className="text-sm space-y-1">
                <span className="text-[var(--text-muted)] text-xs">Max retries per failed job</span>
                <input
                  type="number"
                  min={1}
                  max={5}
                  className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2"
                  value={state.maxRetries}
                  onChange={(e) =>
                    setState({ ...state, maxRetries: Number(e.target.value) || 3 })
                  }
                />
              </label>
            </div>

            <label className="text-sm space-y-1 block">
              <span className="text-[var(--text-muted)] text-xs">Topic pillars (one per line)</span>
              <textarea
                className="w-full min-h-[120px] rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm"
                value={pillarsText}
                onChange={(e) => setPillarsText(e.target.value)}
              />
            </label>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={busy}
                onClick={() => void saveSettings()}
                className="btn-primary !text-xs !py-2 !px-3"
              >
                Save settings
              </button>
              <button
                type="button"
                disabled={busy || !groqConfigured}
                onClick={() => void runNow({ force: true })}
                className="btn-secondary !text-xs !py-2 !px-3"
              >
                Run now (force)
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => void load()}
                className="btn-secondary !text-xs !py-2 !px-3"
              >
                Refresh history
              </button>
            </div>
          </div>
        )}
      </Panel>

      <Panel title="Run history">
        {!state?.runs?.length ? (
          <p className="text-sm text-[var(--text-muted)]">No runs yet. Cron or “Run now” will appear here.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[var(--text-muted)] text-xs uppercase tracking-wider">
                  <th className="py-2 pr-3">When</th>
                  <th className="py-2 pr-3">Status</th>
                  <th className="py-2 pr-3">Title / topic</th>
                  <th className="py-2 pr-3">Attempts</th>
                  <th className="py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {state.runs.slice(0, 40).map((run) => (
                  <tr key={run.id} className="border-t border-white/[0.06] align-top">
                    <td className="py-2.5 pr-3 text-xs text-[var(--text-muted)] whitespace-nowrap">
                      {run.at?.replace("T", " ").slice(0, 19)}
                    </td>
                    <td className={cn("py-2.5 pr-3 font-medium", statusClass(run.status))}>
                      {run.status}
                      {run.reason ? (
                        <div className="text-[11px] font-normal text-[var(--text-muted)] mt-0.5 max-w-[180px]">
                          {run.reason}
                        </div>
                      ) : null}
                      {run.error ? (
                        <div className="text-[11px] font-normal text-red-400/90 mt-0.5 max-w-[220px]">
                          {run.error}
                        </div>
                      ) : null}
                    </td>
                    <td className="py-2.5 pr-3">
                      <div>{run.title || run.topic || "—"}</div>
                      {run.slug ? (
                        <a
                          href={run.postUrl || `/blog/${run.slug}`}
                          className="text-xs text-[var(--accent-primary)]"
                          target="_blank"
                          rel="noreferrer"
                        >
                          /blog/{run.slug}
                        </a>
                      ) : null}
                      {run.prUrl ? (
                        <div>
                          <a
                            href={run.prUrl}
                            className="text-xs text-[var(--text-muted)] underline"
                            target="_blank"
                            rel="noreferrer"
                          >
                            PR
                          </a>
                        </div>
                      ) : null}
                    </td>
                    <td className="py-2.5 pr-3">{run.attempts}</td>
                    <td className="py-2.5">
                      {run.status === "error" ? (
                        <button
                          type="button"
                          disabled={busy}
                          className="text-xs underline text-[var(--accent-primary)]"
                          onClick={() => void runNow({ retryId: run.id })}
                        >
                          Retry
                        </button>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </div>
  )
}
