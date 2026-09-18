"use client"

import { useCallback, useEffect, useState } from "react"
import { Loader2, Plus, Trash2 } from "lucide-react"
import { Panel } from "@/components/admin/admin-shell"
import { adminFetch } from "@/lib/auth-client"
import { cn } from "@/lib/utils"
import type { DigitalProduct, ProductsConfig } from "@/lib/products"

type Props = {
  onNotice: (msg: string, prUrl?: string | null) => void
  onError: (msg: string) => void
  noteSyncResponse: (res: Response) => void
}

type Row = DigitalProduct & {
  includesCsv: string
  idealForCsv: string
}

function toRow(p: DigitalProduct): Row {
  return {
    ...p,
    includesCsv: (p.includes || []).join(", "),
    idealForCsv: (p.idealFor || []).join(", "),
  }
}

function emptyRow(): Row {
  return {
    slug: "",
    name: "",
    tagline: "",
    description: "",
    priceLabel: "$19",
    buyUrl: "",
    includes: [],
    idealFor: [],
    starterPath: "",
    enabled: true,
    includesCsv: "",
    idealForCsv: "",
  }
}

function csvList(csv: string): string[] {
  return csv
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
}

export function AdminProductsPanel({ onNotice, onError, noteSyncResponse }: Props) {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [rows, setRows] = useState<Row[]>([])

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await adminFetch("/api/products")
      if (!res.ok) throw new Error("Failed to load products")
      const data = (await res.json()) as ProductsConfig
      setRows((data.products || []).map(toRow))
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
      const products = rows.map((r) => ({
        slug: r.slug,
        name: r.name,
        tagline: r.tagline,
        description: r.description,
        priceLabel: r.priceLabel,
        buyUrl: r.buyUrl,
        starterPath: r.starterPath,
        enabled: r.enabled,
        includes: csvList(r.includesCsv),
        idealFor: csvList(r.idealForCsv),
      }))
      const res = await adminFetch("/api/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products }),
      })
      noteSyncResponse(res)
      if (!res.ok) {
        const data = await res.json().catch(() => null)
        throw new Error(typeof data?.error === "string" ? data.error : "Save failed")
      }
      const saved = (await res.json()) as ProductsConfig
      setRows((saved.products || []).map(toRow))
      onNotice(
        saved.products?.length
          ? `Saved ${saved.products.length} product(s). Enabled ones show on /products.`
          : "Saved. No products listed yet."
      )
    } catch (e) {
      onError(e instanceof Error ? e.message : "Save failed")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Panel title="Products">
        <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading…
        </div>
      </Panel>
    )
  }

  return (
    <Panel
      title="Products"
      action={
        <button
          type="button"
          onClick={() => void save()}
          disabled={saving}
          className={cn(
            "inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium",
            "bg-[var(--accent-primary)] text-black disabled:opacity-50"
          )}
        >
          {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
          Save products
        </button>
      }
    >
      <p className="text-sm text-[var(--text-muted)] mb-6 max-w-2xl">
        Add Gumroad (or other) checkout links here. Set <code className="text-xs">buyUrl</code> to unlock
        Buy on Gumroad. Leave it empty for Coming soon. Zip files still live under{" "}
        <code className="text-xs">digital-products/</code>.
      </p>

      <div className="space-y-6">
        {rows.map((row, index) => (
          <div
            key={`${row.slug || "new"}-${index}`}
            className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 space-y-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-medium text-[var(--text-primary)]">
                {row.name || "New product"}
              </p>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                  <input
                    type="checkbox"
                    checked={row.enabled}
                    onChange={(e) => patchRow(index, { enabled: e.target.checked })}
                  />
                  Enabled
                </label>
                <button
                  type="button"
                  aria-label="Remove product"
                  onClick={() => setRows((prev) => prev.filter((_, i) => i !== index))}
                  className="text-[var(--text-muted)] hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Field
                label="Name"
                value={row.name}
                onChange={(v) => patchRow(index, { name: v })}
              />
              <Field
                label="Slug"
                value={row.slug}
                onChange={(v) => patchRow(index, { slug: v })}
                placeholder="kickoff-forge"
              />
              <Field
                label="Price label"
                value={row.priceLabel}
                onChange={(v) => patchRow(index, { priceLabel: v })}
                placeholder="$19"
              />
              <Field
                label="Buy URL (Gumroad)"
                value={row.buyUrl}
                onChange={(v) => patchRow(index, { buyUrl: v })}
                placeholder="https://….gumroad.com/l/…"
              />
            </div>

            <Field
              label="Tagline"
              value={row.tagline}
              onChange={(v) => patchRow(index, { tagline: v })}
            />
            <label className="block text-xs text-[var(--text-muted)] space-y-1">
              Description
              <textarea
                value={row.description}
                onChange={(e) => patchRow(index, { description: e.target.value })}
                rows={3}
                className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-[var(--text-primary)]"
              />
            </label>
            <Field
              label="Includes (comma-separated)"
              value={row.includesCsv}
              onChange={(v) => patchRow(index, { includesCsv: v })}
            />
            <Field
              label="Ideal for (comma-separated)"
              value={row.idealForCsv}
              onChange={(v) => patchRow(index, { idealForCsv: v })}
            />
            <Field
              label="Starter path (repo folder)"
              value={row.starterPath}
              onChange={(v) => patchRow(index, { starterPath: v })}
              placeholder="digital-products/kickoff-forge"
            />
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setRows((prev) => [...prev, emptyRow()])}
        className="mt-4 inline-flex items-center gap-2 text-sm text-[var(--accent-primary)] hover:underline"
      >
        <Plus className="h-4 w-4" /> Add product
      </button>
    </Panel>
  )
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <label className="block text-xs text-[var(--text-muted)] space-y-1">
      {label}
      <input
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-[var(--text-primary)]"
      />
    </label>
  )
}
