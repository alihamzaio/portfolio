/**
 * Direct (non-Gumroad) product orders: buyer info + payment proof.
 * Stored in KV only (not synced to GitHub).
 */

export type OrderStatus = "proof_submitted" | "paid" | "rejected"

export type ProductOrder = {
  id: string
  productSlug: string
  productName: string
  priceLabel: string
  buyerName: string
  buyerEmail: string
  buyerPhone: string
  paymentMethodLabel: string
  transactionRef: string
  proofNote: string
  status: OrderStatus
  createdAt: string
  updatedAt: string
  downloadSentAt: string | null
  adminNote: string
}

export type OrdersConfig = {
  orders: ProductOrder[]
}

export const EMPTY_ORDERS: OrdersConfig = { orders: [] }

export function createOrderId(): string {
  return `ord_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}

export function normalizeOrder(raw: unknown): ProductOrder | null {
  if (!raw || typeof raw !== "object") return null
  const o = raw as Partial<ProductOrder>
  const id = String(o.id || "").trim()
  const productSlug = String(o.productSlug || "").trim()
  const buyerEmail = String(o.buyerEmail || "")
    .trim()
    .toLowerCase()
  const buyerName = String(o.buyerName || "").trim()
  const transactionRef = String(o.transactionRef || "").trim()
  if (!id || !productSlug || !buyerEmail || !buyerName || !transactionRef) return null

  const statusRaw = String(o.status || "proof_submitted")
  const status: OrderStatus =
    statusRaw === "paid" || statusRaw === "rejected" ? statusRaw : "proof_submitted"

  return {
    id,
    productSlug,
    productName: String(o.productName || productSlug).trim(),
    priceLabel: String(o.priceLabel || "").trim(),
    buyerName,
    buyerEmail,
    buyerPhone: String(o.buyerPhone || "").trim(),
    paymentMethodLabel: String(o.paymentMethodLabel || "").trim(),
    transactionRef,
    proofNote: String(o.proofNote || "").trim(),
    status,
    createdAt: String(o.createdAt || new Date().toISOString()),
    updatedAt: String(o.updatedAt || new Date().toISOString()),
    downloadSentAt: o.downloadSentAt ? String(o.downloadSentAt) : null,
    adminNote: String(o.adminNote || "").trim(),
  }
}

export function normalizeOrdersConfig(raw: unknown): OrdersConfig {
  const data = (raw && typeof raw === "object" ? raw : {}) as Partial<OrdersConfig>
  const orders: ProductOrder[] = []
  const seen = new Set<string>()
  for (const item of Array.isArray(data.orders) ? data.orders : []) {
    const order = normalizeOrder(item)
    if (!order || seen.has(order.id)) continue
    seen.add(order.id)
    orders.push(order)
  }
  orders.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
  return { orders }
}
