"use client"

import { useCallback, useEffect, useState } from "react"
import { Loader2, Plus, Trash2 } from "lucide-react"
import { Panel } from "@/components/admin/admin-shell"
import { adminFetch } from "@/lib/auth-client"
import { cn } from "@/lib/utils"
import type { PaymentMethodDetail, PaymentSettings } from "@/lib/payment-settings"

type Props = {
  onNotice: (msg: string, prUrl?: string | null) => void
  onError: (msg: string) => void
  noteSyncResponse: (res: Response) => void
}

function emptyMethod(): PaymentMethodDetail {
  return { id: `m_${Date.now().toString(36)}`, label: "", details: "" }
}

export function AdminPaymentsPanel({ onNotice, onError, noteSyncResponse }: Props) {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState<PaymentSettings | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await adminFetch("/api/payment-settings")
      if (!res.ok) throw new Error("Failed to load payment settings")
      setSettings((await res.json()) as PaymentSettings)
    } catch (e) {
      onError(e instanceof Error ? e.message : "Load failed")
    } finally {
      setLoading(false)
    }
  }, [onError])

  useEffect(() => {
    void load()
  }, [load])

  const save = async () => {
    if (!settings) return
    setSaving(true)
    onError("")
    try {
      const res = await adminFetch("/api/payment-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      })
      noteSyncResponse(res)
      if (!res.ok) {
        const data = await res.json().catch(() => null)
        throw new Error(typeof data?.error === "string" ? data.error : "Save failed")
      }
      const saved = (await res.json()) as PaymentSettings
      setSettings(saved)
      onNotice(
        saved.enabled
          ? "Payment details saved. Direct checkout can use these methods."
          : "Saved. Direct checkout stays hidden until Enabled is on."
      )
    } catch (e) {
      onError(e instanceof Error ? e.message : "Save failed")
    } finally {
      setSaving(false)
    }
  }

  if (loading || !settings) {
    return (
      <Panel title="Payments">
        <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading…
        </div>
      </Panel>
    )
  }

  return (
    <Panel
      title="Payments"
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
          Save payments
        </button>
      }
    >
      <p className="text-sm text-[var(--text-muted)] mb-6 max-w-2xl">
        This is where you add bank / JazzCash / IBAN details for buyers who pay you directly (not Gumroad).
        Turn <strong className="text-[var(--text-primary)]">Enable</strong> on, fill each method, then
        Save. Orders with payment proof show under <strong className="text-[var(--text-primary)]">Orders</strong>.
      </p>

      <div className="mb-6 rounded-xl border border-[var(--accent-primary)]/25 bg-[var(--accent-primary)]/10 px-4 py-3 text-sm text-[var(--text-primary)]">
        Path: Admin sidebar → <strong>Payments</strong> (credit card icon). If you do not see that tab,
        hard-refresh after the latest deploy.
      </div>

      <label className="flex items-center gap-2 text-sm text-[var(--text-primary)] mb-6">
        <input
          type="checkbox"
          checked={settings.enabled}
          onChange={(e) => setSettings({ ...settings, enabled: e.target.checked })}
        />
        Enable direct payments on the site
      </label>

      <div className="space-y-4 max-w-2xl">
        <Field
          label="Headline"
          value={settings.headline}
          onChange={(v) => setSettings({ ...settings, headline: v })}
        />
        <label className="block text-xs text-[var(--text-muted)] space-y-1">
          Instructions
          <textarea
            value={settings.instructions}
            onChange={(e) => setSettings({ ...settings, instructions: e.target.value })}
            rows={3}
            className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-[var(--text-primary)]"
          />
        </label>
        <Field
          label="Footer note"
          value={settings.footerNote}
          onChange={(v) => setSettings({ ...settings, footerNote: v })}
        />
        <Field
          label="Notify email (order alerts)"
          value={settings.notifyEmail}
          onChange={(v) => setSettings({ ...settings, notifyEmail: v })}
          placeholder="Leave empty to use admin email"
        />
      </div>

      <h3 className="mt-8 mb-3 text-sm font-medium text-[var(--text-primary)]">Payment methods</h3>
      <div className="space-y-4">
        {settings.methods.map((method, index) => (
          <div
            key={method.id}
            className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 space-y-3"
          >
            <div className="flex justify-between gap-2">
              <Field
                label="Label"
                value={method.label}
                onChange={(v) => {
                  const methods = settings.methods.map((m, i) =>
                    i === index ? { ...m, label: v } : m
                  )
                  setSettings({ ...settings, methods })
                }}
                placeholder="Bank Alfalah / JazzCash"
              />
              <button
                type="button"
                aria-label="Remove method"
                onClick={() =>
                  setSettings({
                    ...settings,
                    methods: settings.methods.filter((_, i) => i !== index),
                  })
                }
                className="text-[var(--text-muted)] hover:text-red-400 mt-5"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <label className="block text-xs text-[var(--text-muted)] space-y-1">
              Details (account title, IBAN, number)
              <textarea
                value={method.details}
                onChange={(e) => {
                  const methods = settings.methods.map((m, i) =>
                    i === index ? { ...m, details: e.target.value } : m
                  )
                  setSettings({ ...settings, methods })
                }}
                rows={3}
                className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-[var(--text-primary)] font-mono"
              />
            </label>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setSettings({ ...settings, methods: [...settings.methods, emptyMethod()] })}
        className="mt-4 inline-flex items-center gap-2 text-sm text-[var(--accent-primary)] hover:underline"
      >
        <Plus className="h-4 w-4" /> Add payment method
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
    <label className="block text-xs text-[var(--text-muted)] space-y-1 flex-1">
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
