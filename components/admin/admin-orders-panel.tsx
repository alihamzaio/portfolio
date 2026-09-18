"use client"

import { useCallback, useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { Panel } from "@/components/admin/admin-shell"
import { adminFetch, getAuthHeaders } from "@/lib/auth-client"
import { cn } from "@/lib/utils"
import type { ProductOrder } from "@/lib/orders"

type Props = {
  onNotice: (msg: string) => void
  onError: (msg: string) => void
}

export function AdminOrdersPanel({ onNotice, onError }: Props) {
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState<ProductOrder[]>([])
  const [busyId, setBusyId] = useState<string | null>(null)
  const [storage, setStorage] = useState<string>("")

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await adminFetch("/api/orders", { headers: getAuthHeaders() })
      if (!res.ok) throw new Error("Failed to load orders")
      const data = (await res.json()) as { orders: ProductOrder[]; storage?: string }
      setOrders(data.orders || [])
      setStorage(data.storage || "")
    } catch (e) {
      onError(e instanceof Error ? e.message : "Load failed")
    } finally {
      setLoading(false)
    }
  }, [onError])

  useEffect(() => {
    void load()
  }, [load])

  const patch = async (id: string, body: Record<string, unknown>) => {
    setBusyId(id)
    onError("")
    try {
      const res = await adminFetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      const data = await res.json().catch(() => null)
      if (!res.ok) {
        throw new Error(typeof data?.error === "string" ? data.error : "Update failed")
      }
      if (data?.emailError) {
        onNotice(`Order updated, but email failed: ${data.emailError}`)
      } else if (body.status === "paid" && body.sendDownload) {
        onNotice("Marked paid and download emailed to the buyer.")
      } else {
        onNotice("Order updated.")
      }
      if (data?.order) {
        setOrders((prev) => prev.map((o) => (o.id === id ? (data.order as ProductOrder) : o)))
      } else {
        await load()
      }
    } catch (e) {
      onError(e instanceof Error ? e.message : "Update failed")
    } finally {
      setBusyId(null)
    }
  }

  if (loading) {
    return (
      <Panel title="Orders">
        <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading…
        </div>
      </Panel>
    )
  }

  return (
    <Panel
      title="Orders"
      action={
        <button
          type="button"
          onClick={() => void load()}
          className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]"
        >
          Refresh
        </button>
      }
    >
      <p className="text-sm text-[var(--text-muted)] mb-6 max-w-2xl">
        Direct purchases only (not Gumroad). Review payment proof, then mark paid to email the zip +
        product page link automatically (no Drive needed).
        {storage ? (
          <span className="block mt-2 text-xs text-neutral-500">Storage: {storage}</span>
        ) : null}
      </p>

      {orders.length === 0 ? (
        <p className="text-sm text-[var(--text-muted)] border border-dashed border-white/[0.1] rounded-xl px-4 py-8 text-center">
          No direct orders yet.
        </p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 space-y-3"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-medium text-[var(--text-primary)]">
                    {order.productName}{" "}
                    <span className="text-[var(--accent-primary)] font-mono">{order.priceLabel}</span>
                  </p>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">{order.id}</p>
                </div>
                <StatusBadge status={order.status} />
              </div>

              <dl className="grid gap-1 text-xs text-[var(--text-secondary)] sm:grid-cols-2">
                <div>
                  <dt className="text-[var(--text-muted)]">Buyer</dt>
                  <dd>
                    {order.buyerName} &lt;{order.buyerEmail}&gt;
                  </dd>
                </div>
                {order.buyerPhone ? (
                  <div>
                    <dt className="text-[var(--text-muted)]">Phone</dt>
                    <dd>{order.buyerPhone}</dd>
                  </div>
                ) : null}
                {order.paymentMethodLabel ? (
                  <div>
                    <dt className="text-[var(--text-muted)]">Method</dt>
                    <dd>{order.paymentMethodLabel}</dd>
                  </div>
                ) : null}
                <div className="sm:col-span-2">
                  <dt className="text-[var(--text-muted)]">Transaction / proof</dt>
                  <dd className="font-mono text-[var(--text-primary)]">{order.transactionRef}</dd>
                </div>
                {order.proofNote ? (
                  <div className="sm:col-span-2">
                    <dt className="text-[var(--text-muted)]">Buyer note</dt>
                    <dd>{order.proofNote}</dd>
                  </div>
                ) : null}
                {order.downloadSentAt ? (
                  <div className="sm:col-span-2">
                    <dt className="text-[var(--text-muted)]">Download emailed</dt>
                    <dd>{new Date(order.downloadSentAt).toLocaleString()}</dd>
                  </div>
                ) : null}
              </dl>

              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  type="button"
                  disabled={busyId === order.id || order.status === "paid"}
                  onClick={() => void patch(order.id, { status: "paid", sendDownload: true })}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-xs font-medium",
                    "bg-[var(--accent-primary)] text-black disabled:opacity-40"
                  )}
                >
                  {busyId === order.id ? "…" : "Mark paid + email download"}
                </button>
                <button
                  type="button"
                  disabled={busyId === order.id}
                  onClick={() => void patch(order.id, { status: "paid", sendDownload: false })}
                  className="rounded-lg px-3 py-1.5 text-xs border border-white/10 text-[var(--text-secondary)]"
                >
                  Mark paid only
                </button>
                <button
                  type="button"
                  disabled={busyId === order.id || order.status === "rejected"}
                  onClick={() => void patch(order.id, { status: "rejected" })}
                  className="rounded-lg px-3 py-1.5 text-xs text-red-400 border border-red-400/20"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Panel>
  )
}

function StatusBadge({ status }: { status: ProductOrder["status"] }) {
  const styles =
    status === "paid"
      ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/25"
      : status === "rejected"
        ? "bg-red-500/15 text-red-400 border-red-500/25"
        : "bg-amber-500/15 text-amber-300 border-amber-500/25"
  const label =
    status === "paid" ? "Paid" : status === "rejected" ? "Rejected" : "Proof submitted"
  return (
    <span className={cn("text-[10px] uppercase tracking-wider px-2 py-1 rounded-md border", styles)}>
      {label}
    </span>
  )
}
