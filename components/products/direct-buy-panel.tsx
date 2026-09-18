"use client"

import { useEffect, useState, type FormEvent } from "react"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import type { PaymentSettings } from "@/lib/payment-settings"

type PublicPayment = Omit<PaymentSettings, "notifyEmail">

type Props = {
  productSlug: string
  productName: string
  priceLabel: string
}

export function DirectBuyPanel({ productSlug, productName, priceLabel }: Props) {
  const [payment, setPayment] = useState<PublicPayment | null>(null)
  const [loadError, setLoadError] = useState("")
  const [buyerName, setBuyerName] = useState("")
  const [buyerEmail, setBuyerEmail] = useState("")
  const [buyerPhone, setBuyerPhone] = useState("")
  const [paymentMethodLabel, setPaymentMethodLabel] = useState("")
  const [transactionRef, setTransactionRef] = useState("")
  const [proofNote, setProofNote] = useState("")
  const [shareEmail, setShareEmail] = useState("")
  const [busy, setBusy] = useState<"order" | "share" | null>(null)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    let cancelled = false
    fetch("/api/payment-settings")
      .then(async (res) => {
        const data = (await res.json()) as PublicPayment
        if (cancelled) return
        if (!data.enabled) {
          setPayment(null)
          return
        }
        setPayment(data)
        if (data.methods[0]) setPaymentMethodLabel(data.methods[0].label)
      })
      .catch(() => {
        if (!cancelled) setLoadError("Could not load payment details.")
      })
    return () => {
      cancelled = true
    }
  }, [])

  if (loadError) {
    return <p className="text-sm text-red-400">{loadError}</p>
  }

  if (!payment) {
    return (
      <p className="text-xs text-neutral-600">
        Direct pay is not enabled yet. Use Gumroad, or check back after payment details are published in
        admin.
      </p>
    )
  }

  const submitOrder = async (e: FormEvent) => {
    e.preventDefault()
    setBusy("order")
    setError("")
    setMessage("")
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productSlug,
          buyerName,
          buyerEmail,
          buyerPhone,
          paymentMethodLabel,
          transactionRef,
          proofNote,
        }),
      })
      const data = await res.json().catch(() => null)
      if (!res.ok) {
        throw new Error(typeof data?.error === "string" ? data.error : "Submit failed")
      }
      setMessage(
        typeof data?.message === "string"
          ? data.message
          : "Submitted. You will get the download by email after verification."
      )
      setTransactionRef("")
      setProofNote("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submit failed")
    } finally {
      setBusy(null)
    }
  }

  const shareDetails = async (e: FormEvent) => {
    e.preventDefault()
    setBusy("share")
    setError("")
    setMessage("")
    try {
      const res = await fetch("/api/payment-settings/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: shareEmail || buyerEmail,
          name: buyerName,
          productSlug,
        }),
      })
      const data = await res.json().catch(() => null)
      if (!res.ok) {
        throw new Error(typeof data?.error === "string" ? data.error : "Could not send email")
      }
      setMessage(typeof data?.message === "string" ? data.message : "Payment details emailed.")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send email")
    } finally {
      setBusy(null)
    }
  }

  return (
    <div className="mt-10 rounded-2xl border border-white/[0.08] bg-white/[0.02] px-5 py-6 sm:px-7 sm:py-8 space-y-6">
      <div>
        <p className="meta-label mb-2">Pay directly</p>
        <h2 className="text-lg font-semibold text-white">{payment.headline}</h2>
        <p className="mt-2 text-sm text-neutral-400 leading-relaxed whitespace-pre-wrap">
          {payment.instructions}
        </p>
        <p className="mt-2 text-sm text-[var(--accent-primary)] font-mono">
          {productName} · {priceLabel}
        </p>
      </div>

      <div className="space-y-3">
        {payment.methods.map((m) => (
          <div key={m.id} className="rounded-xl border border-white/[0.06] bg-black/20 px-4 py-3">
            <p className="text-sm font-medium text-white">{m.label}</p>
            <pre className="mt-2 text-xs text-neutral-400 whitespace-pre-wrap font-mono">{m.details}</pre>
          </div>
        ))}
      </div>

      {payment.footerNote ? (
        <p className="text-xs text-neutral-600">{payment.footerNote}</p>
      ) : null}

      <form onSubmit={shareDetails} className="flex flex-col sm:flex-row gap-2">
        <input
          type="email"
          required
          placeholder="Email me these payment details"
          value={shareEmail}
          onChange={(e) => setShareEmail(e.target.value)}
          className="flex-1 rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white"
        />
        <button
          type="submit"
          disabled={busy === "share"}
          className="btn-secondary btn-responsive inline-flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {busy === "share" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
          Email details
        </button>
      </form>

      <form onSubmit={submitOrder} className="space-y-3 border-t border-white/[0.06] pt-6">
        <p className="text-sm text-neutral-300">After you pay, submit proof so I can send your download.</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            required
            placeholder="Your name"
            value={buyerName}
            onChange={(e) => setBuyerName(e.target.value)}
            className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white"
          />
          <input
            required
            type="email"
            placeholder="Email for download"
            value={buyerEmail}
            onChange={(e) => setBuyerEmail(e.target.value)}
            className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white"
          />
          <input
            placeholder="Phone (optional)"
            value={buyerPhone}
            onChange={(e) => setBuyerPhone(e.target.value)}
            className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white"
          />
          <select
            value={paymentMethodLabel}
            onChange={(e) => setPaymentMethodLabel(e.target.value)}
            className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white"
          >
            <option value="">Payment method</option>
            {payment.methods.map((m) => (
              <option key={m.id} value={m.label}>
                {m.label}
              </option>
            ))}
          </select>
        </div>
        <input
          required
          placeholder="Transaction ID / reference / JazzCash TID"
          value={transactionRef}
          onChange={(e) => setTransactionRef(e.target.value)}
          className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white font-mono"
        />
        <textarea
          placeholder="Optional note (screenshot link, amount, time)"
          value={proofNote}
          onChange={(e) => setProofNote(e.target.value)}
          rows={2}
          className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white"
        />
        <button
          type="submit"
          disabled={busy === "order"}
          className={cn(
            "btn-primary btn-responsive inline-flex items-center justify-center gap-2 disabled:opacity-50"
          )}
        >
          {busy === "order" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
          Submit payment proof
        </button>
      </form>

      {message ? <p className="text-sm text-emerald-400">{message}</p> : null}
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
    </div>
  )
}
