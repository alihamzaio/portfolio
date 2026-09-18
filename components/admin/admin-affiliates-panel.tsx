"use client"

import { useCallback, useEffect, useState } from "react"
import { Loader2, Plus, Trash2 } from "lucide-react"
import { Panel } from "@/components/admin/admin-shell"
import { adminFetch } from "@/lib/auth-client"
import { cn } from "@/lib/utils"
import type { AffiliateTool, AffiliatesConfig } from "@/lib/affiliates"
import { DEFAULT_AFFILIATE_DISCLOSURE } from "@/lib/affiliates"

type Props = {
  onNotice: (msg: string, prUrl?: string | null) => void
  onError: (msg: string) => void
  noteSyncResponse: (res: Response) => void
}

type Row = AffiliateTool & { tagsCsv: string }

function toRow(t: AffiliateTool): Row {
  return { ...t, tagsCsv: (t.tags || []).join(", ") }
}

function emptyRow(): Row {
  return {
    id: "",
    name: "",
    blurb: "",
    url: "",
    affiliate: true,
    enabled: true,
    tags: [],
    tagsCsv: "",
  }
}

export function AdminAffiliatesPanel({ onNotice, onError, noteSyncResponse }: Props) {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [disclosure, setDisclosure] = useState(DEFAULT_AFFILIATE_DISCLOSURE)
  const [rows, setRows] = useState<Row[]>([])

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await adminFetch("/api/affiliates")
      if (!res.ok) throw new Error("Failed to load affiliates")
      const data = (await res.json()) as AffiliatesConfig
      setDisclosure(data.disclosure || DEFAULT_AFFILIATE_DISCLOSURE)
      setRows((data.tools || []).map(toRow))
    } catch (e) {
      onError(e instanceof Error ? e.message : "Load failed")
    } finally {
      setLoading(false)
    }
  }, [onError])

  useEffect(() => {
    void load()
  }, [load])

  const patchRow = (index: number, patch: Partial<Row>) => {
    setRows((prev) => prev.map((r, i) => (i === index ? { ...r, ...patch } : r)))
  }

  const save = async () => {
    setSaving(true)
    onError("")
    try {
      const tools = rows.map((r) => ({
        id: r.id,
        name: r.name,
        blurb: r.blurb,
        url: r.url,
        affiliate: r.affiliate,
        enabled: r.enabled,
        tags: r.tagsCsv
          .split(",")
          .map((t) => t.trim().toLowerCase())
          .filter(Boolean),
      }))
      const res = await adminFetch("/api/affiliates", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ disclosure, tools }),
      })
      noteSyncResponse(res)
      if (!res.ok) {
        const data = await res.json().catch(() => null)
        throw new Error(typeof data?.error === "string" ? data.error : "Save failed")
      }
      const saved = (await res.json()) as AffiliatesConfig
      setDisclosure(saved.disclosure || disclosure)
      setRows((saved.tools || []).map(toRow))
      onNotice(
        saved.tools?.length
          ? `Saved ${saved.tools.length} affiliate link(s). Only enabled + affiliate links show on the blog.`
          : "Saved. No links yet — blog will hide the Tools section until you add one."
      )
    } catch (e) {
      onError(e instanceof Error ? e.message : "Save failed")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Panel title="Affiliates">
        <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading…
        </div>
      </Panel>
    )
  }

  return (
    <Panel
      title="Affiliates"
      action={
        <button
          type="button"
          onClick={() => void save()}
          disabled={saving}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-[var(--accent-primary)] text-white disabled:opacity-50"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Save links
        </button>
      }
    >
      <p className="text-sm text-[var(--text-secondary)] mb-6 max-w-2xl leading-relaxed">
        Add links only after a program gives you a tracked URL. The blog shows a tool only when{" "}
        <strong className="text-[var(--text-primary)]">Enabled</strong> and{" "}
        <strong className="text-[var(--text-primary)]">Affiliate</strong> are both on. Leave the list empty until then — nothing public will show.
      </p>

      <label className="block mb-8">
        <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] mb-1.5 block">
          Disclosure (shown when any affiliate link is public)
        </span>
        <textarea
          value={disclosure}
          onChange={(e) => setDisclosure(e.target.value)}
          rows={2}
          className="w-full rounded-xl bg-white/[0.03] border border-white/[0.08] px-3 py-2 text-sm text-[var(--text-primary)]"
        />
      </label>

      <div className="space-y-4">
        {rows.length === 0 && (
          <p className="text-sm text-[var(--text-muted)] border border-dashed border-white/[0.1] rounded-xl px-4 py-8 text-center">
            No affiliate links yet. Click Add link when you have a real tracked URL.
          </p>
        )}

        {rows.map((row, index) => (
          <div
            key={`${row.id || "new"}-${index}`}
            className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 space-y-3"
          >
            <div className="grid sm:grid-cols-2 gap-3">
              <label className="block">
                <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] mb-1 block">Name</span>
                <input
                  value={row.name}
                  onChange={(e) => patchRow(index, { name: e.target.value })}
                  placeholder="Hostinger"
                  className="w-full rounded-lg bg-white/[0.03] border border-white/[0.08] px-3 py-2 text-sm"
                />
              </label>
              <label className="block">
                <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] mb-1 block">Affiliate URL</span>
                <input
                  value={row.url}
                  onChange={(e) => patchRow(index, { url: e.target.value })}
                  placeholder="https://…your-tracked-link…"
                  className="w-full rounded-lg bg-white/[0.03] border border-white/[0.08] px-3 py-2 text-sm font-mono"
                />
              </label>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <label className="block">
                <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] mb-1 block">Short blurb</span>
                <input
                  value={row.blurb}
                  onChange={(e) => patchRow(index, { blurb: e.target.value })}
                  placeholder="Affordable web hosting"
                  className="w-full rounded-lg bg-white/[0.03] border border-white/[0.08] px-3 py-2 text-sm"
                />
              </label>
              <label className="block">
                <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] mb-1 block">Tags (comma)</span>
                <input
                  value={row.tagsCsv}
                  onChange={(e) => patchRow(index, { tagsCsv: e.target.value })}
                  placeholder="hosting, nextjs, ai"
                  className="w-full rounded-lg bg-white/[0.03] border border-white/[0.08] px-3 py-2 text-sm"
                />
              </label>
            </div>
            <div className="flex flex-wrap items-center gap-4 justify-between">
              <div className="flex flex-wrap gap-4 text-sm">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={row.enabled}
                    onChange={(e) => patchRow(index, { enabled: e.target.checked })}
                  />
                  Enabled
                </label>
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={row.affiliate}
                    onChange={(e) => patchRow(index, { affiliate: e.target.checked })}
                  />
                  Affiliate link
                </label>
              </div>
              <button
                type="button"
                onClick={() => setRows((prev) => prev.filter((_, i) => i !== index))}
                className="inline-flex items-center gap-1.5 text-sm text-red-400/90 hover:text-red-300"
              >
                <Trash2 className="h-3.5 w-3.5" /> Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setRows((prev) => [...prev, emptyRow()])}
        className={cn(
          "mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm border border-white/[0.1]",
          "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/[0.04]"
        )}
      >
        <Plus className="h-4 w-4" /> Add link
      </button>
    </Panel>
  )
}
