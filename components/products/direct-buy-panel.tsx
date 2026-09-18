"use client"

import { useEffect, useState, type FormEvent } from "react"
import { Check, Copy, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import type { PaymentSettings } from "@/lib/payment-settings"

type PublicPayment = Omit<PaymentSettings, "notifyEmail">

type Props = {
  productSlug: string
  productName: string
  priceLabel: string
}

type Step = 1 | 2 | 3

const STEPS: { id: Step; label: string }[] = [
  { id: 1, label: "Choose method" },
  { id: 2, label: "Send payment" },
  { id: 3, label: "Confirm" },
]

export function DirectBuyPanel({ productSlug, productName, priceLabel }: Props) {
  const [payment, setPayment] = useState<PublicPayment | null>(null)
  const [loadError, setLoadError] = useState("")
  const [step, setStep] = useState<Step>(1)
  const [methodId, setMethodId] = useState("")
  const [buyerName, setBuyerName] = useState("")
  const [buyerEmail, setBuyerEmail] = useState("")
  const [buyerPhone, setBuyerPhone] = useState("")
  const [transactionRef, setTransactionRef] = useState("")
  const [proofNote, setProofNote] = useState("")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const [orderId, setOrderId] = useState("")
  const [copiedKey, setCopiedKey] = useState("")

  useEffect(() => {
    let cancelled = false
    fetch("/api/payment-settings")
      .then(async (res) => {
        const data = (await res.json()) as PublicPayment
        if (cancelled) return
        if (!data.enabled || !data.methods?.length) {
          setPayment(null)
          return
        }
        setPayment(data)
        setMethodId(data.methods[0].id)
      })
      .catch(() => {
        if (!cancelled) setLoadError("Could not load payment details. Refresh and try again.")
      })
    return () => {
      cancelled = true
    }
  }, [])

  const method = payment?.methods.find((m) => m.id === methodId) || payment?.methods[0]

  const copyText = async (key: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value)
      setCopiedKey(key)
      window.setTimeout(() => setCopiedKey(""), 1600)
    } catch {
      setError("Could not copy. Select the text and copy manually.")
    }
  }

  const submitOrder = async (e: FormEvent) => {
    e.preventDefault()
    if (!method) return
    setBusy(true)
    setError("")
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productSlug,
          buyerName,
          buyerEmail,
          buyerPhone,
          paymentMethodLabel: method.label,
          transactionRef,
          proofNote,
        }),
      })
      const data = await res.json().catch(() => null)
      if (!res.ok) {
        throw new Error(typeof data?.error === "string" ? data.error : "Could not submit. Try again.")
      }
      setOrderId(typeof data?.orderId === "string" ? data.orderId : "")
      setStep(3)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit. Try again.")
    } finally {
      setBusy(false)
    }
  }

  if (loadError) {
    return (
      <div className="mt-10 border-t border-[var(--border-subtle)] pt-10">
        <p className="text-sm text-red-400">{loadError}</p>
      </div>
    )
  }

  if (!payment || !method) {
    return null
  }

  if (orderId) {
    return (
      <div id="pay-direct" className="mt-10 border-t border-[var(--border-subtle)] pt-10 scroll-mt-28">
        <p className="meta-label mb-3">Order received</p>
        <h2 className="text-2xl font-semibold text-white tracking-tight">Thanks. I am reviewing your payment.</h2>
        <p className="mt-3 text-sm text-neutral-400 leading-relaxed max-w-xl">
          Your download for <span className="text-white">{productName}</span> ({priceLabel}) will go to{" "}
          <span className="text-white">{buyerEmail}</span> after I verify the transfer. Most orders clear within a
          few hours.
        </p>
        {orderId ? (
          <p className="mt-4 font-mono text-xs text-neutral-500">Reference: {orderId}</p>
        ) : null}
        <p className="mt-6 text-sm text-neutral-500">
          Keep your transaction ID handy. Reply to the confirmation email if you need help.
        </p>
      </div>
    )
  }

  return (
    <div id="pay-direct" className="mt-10 border-t border-[var(--border-subtle)] pt-10 scroll-mt-28">
      <div className="mb-8">
        <p className="meta-label mb-3">Buy directly</p>
        <h2 className="text-2xl font-semibold text-white tracking-tight">
          {payment.headline || "Pay Ali Hamza directly"}
        </h2>
        <p className="mt-2 text-sm text-neutral-400 max-w-xl leading-relaxed">
          Three short steps. No Gumroad account needed. You get the files by email after payment is confirmed.
        </p>
        <p className="mt-3 font-mono text-sm text-[var(--accent-primary)]">
          {productName} · {priceLabel}
        </p>
      </div>

      <ol className="mb-8 flex flex-wrap gap-2 sm:gap-3" aria-label="Checkout steps">
        {STEPS.map((s) => {
          const active = step === s.id
          const done = step > s.id
          return (
            <li key={s.id}>
              <button
                type="button"
                disabled={s.id > step}
                onClick={() => {
                  if (s.id < step) setStep(s.id)
                }}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                  active
                    ? "bg-[var(--accent-primary)]/15 text-[var(--accent-primary)] border border-[var(--accent-primary)]/30"
                    : done
                      ? "text-neutral-300 border border-white/10 hover:border-white/20"
                      : "text-neutral-600 border border-transparent cursor-default"
                )}
              >
                <span
                  className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-mono",
                    active || done ? "bg-[var(--accent-primary)] text-black" : "bg-white/10 text-neutral-500"
                  )}
                >
                  {done ? <Check className="h-3 w-3" /> : s.id}
                </span>
                {s.label}
              </button>
            </li>
          )
        })}
      </ol>

      {step === 1 ? (
        <div className="space-y-6">
          <p className="text-sm text-neutral-400">Pick how you want to send the payment.</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {payment.methods.map((m) => {
              const selected = m.id === method.id
              return (
                <button
                  key={m.id}
                  type="button"
                  aria-label={m.label}
                  aria-pressed={selected}
                  onClick={() => setMethodId(m.id)}
                  className={cn(
                    "text-left rounded-xl border px-4 py-4 transition-colors",
                    selected
                      ? "border-[var(--accent-primary)]/40 bg-[var(--accent-primary)]/8"
                      : "border-white/[0.08] bg-white/[0.02] hover:border-white/20"
                  )}
                >
                  <p className="text-sm font-medium text-white">{m.label}</p>
                  <p className="mt-1 text-xs text-neutral-500 line-clamp-2 whitespace-pre-line">{m.details}</p>
                </button>
              )
            })}
          </div>
          <button type="button" className="btn-primary btn-responsive inline-flex" onClick={() => setStep(2)}>
            Continue with {method.label}
          </button>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="space-y-6">
          <div>
            <p className="text-sm text-neutral-300 mb-1">
              Step 2: Send <span className="text-white font-mono">{priceLabel}</span> via {method.label}
            </p>
            <p className="text-sm text-neutral-500 leading-relaxed whitespace-pre-wrap max-w-xl">
              {payment.instructions}
            </p>
          </div>

          <div className="rounded-xl border border-white/[0.08] bg-black/25 px-4 py-4 sm:px-5">
            <div className="flex items-center justify-between gap-3 mb-3">
              <p className="text-sm font-medium text-white">{method.label}</p>
              <button
                type="button"
                onClick={() => void copyText("all", method.details)}
                className="inline-flex items-center gap-1.5 text-xs text-[var(--accent-primary)] hover:underline"
              >
                {copiedKey === "all" ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copiedKey === "all" ? "Copied" : "Copy all"}
              </button>
            </div>
            <CopyableLines details={method.details} copiedKey={copiedKey} onCopy={copyText} />
          </div>

          {payment.footerNote ? (
            <p className="text-xs text-neutral-600 max-w-xl">{payment.footerNote}</p>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <button type="button" className="btn-primary btn-responsive inline-flex" onClick={() => setStep(3)}>
              I have paid. Continue
            </button>
            <button
              type="button"
              className="btn-secondary btn-responsive inline-flex"
              onClick={() => setStep(1)}
            >
              Change method
            </button>
          </div>
        </div>
      ) : null}

      {step === 3 ? (
        <form onSubmit={submitOrder} className="space-y-5 max-w-xl">
          <div>
            <p className="text-sm text-neutral-300 mb-1">Step 3: Tell me who paid</p>
            <p className="text-sm text-neutral-500">
              Use the email where you want the download. Paste your bank / JazzCash transaction ID.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field
              label="Your name"
              required
              value={buyerName}
              onChange={setBuyerName}
              autoComplete="name"
            />
            <Field
              label="Email for download"
              required
              type="email"
              value={buyerEmail}
              onChange={setBuyerEmail}
              autoComplete="email"
            />
            <Field
              label="Phone (optional)"
              value={buyerPhone}
              onChange={setBuyerPhone}
              autoComplete="tel"
            />
            <div className="sm:col-span-2">
              <label className="block text-xs text-neutral-500 mb-1.5">Paid with</label>
              <p className="rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white">
                {method.label}
              </p>
            </div>
            <div className="sm:col-span-2">
              <Field
                label="Transaction ID / TID / reference"
                required
                value={transactionRef}
                onChange={setTransactionRef}
                mono
                placeholder="From your bank or JazzCash receipt"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs text-neutral-500 mb-1.5">Note (optional)</label>
              <textarea
                value={proofNote}
                onChange={(e) => setProofNote(e.target.value)}
                rows={2}
                placeholder="Amount sent, time, or a screenshot link"
                className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white placeholder:text-neutral-600"
              />
            </div>
          </div>

          {error ? <p className="text-sm text-red-400">{error}</p> : null}

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={busy}
              className="btn-primary btn-responsive inline-flex items-center gap-2 disabled:opacity-50"
            >
              {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
              Submit and wait for download email
            </button>
            <button
              type="button"
              className="btn-secondary btn-responsive inline-flex"
              onClick={() => setStep(2)}
              disabled={busy}
            >
              Back
            </button>
          </div>
        </form>
      ) : null}
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  required,
  type = "text",
  placeholder,
  autoComplete,
  mono,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  required?: boolean
  type?: string
  placeholder?: string
  autoComplete?: string
  mono?: boolean
}) {
  return (
    <label className="block text-xs text-neutral-500">
      <span className="mb-1.5 block">{label}</span>
      <input
        required={required}
        type={type}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white placeholder:text-neutral-600",
          mono && "font-mono"
        )}
      />
    </label>
  )
}

function CopyableLines({
  details,
  copiedKey,
  onCopy,
}: {
  details: string
  copiedKey: string
  onCopy: (key: string, value: string) => void
}) {
  const lines = details
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)

  return (
    <ul className="space-y-2">
      {lines.map((line, index) => {
        const parts = line.split(/:\s*/)
        const hasLabel = parts.length > 1
        const label = hasLabel ? parts[0] : null
        const value = hasLabel ? parts.slice(1).join(": ").trim() : line
        const key = `line-${index}`
        const copyable = Boolean(value && value.length >= 6)

        return (
          <li
            key={key}
            className="flex flex-wrap items-start justify-between gap-2 border-b border-white/[0.04] pb-2 last:border-0 last:pb-0"
          >
            <div className="min-w-0">
              {label ? <p className="text-[11px] uppercase tracking-wider text-neutral-600">{label}</p> : null}
              <p className="font-mono text-sm text-neutral-200 break-all">{value}</p>
            </div>
            {copyable ? (
              <button
                type="button"
                onClick={() => onCopy(key, value)}
                className="shrink-0 inline-flex items-center gap-1 text-[11px] text-neutral-400 hover:text-[var(--accent-primary)]"
              >
                {copiedKey === key ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                {copiedKey === key ? "Copied" : "Copy"}
              </button>
            ) : null}
          </li>
        )
      })}
    </ul>
  )
}
