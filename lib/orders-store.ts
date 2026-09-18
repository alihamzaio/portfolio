import "server-only"

import {
  EMPTY_ORDERS,
  normalizeOrdersConfig,
  type OrdersConfig,
  type ProductOrder,
} from "@/lib/orders"
import { hasKvStore } from "@/lib/store"

const ORDERS_KV_KEY = "portfolio:orders"
const memoryOrders: { current: OrdersConfig | null } = { current: null }

async function kvGetRaw(): Promise<unknown | null> {
  if (!hasKvStore()) return null
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL!
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN!
  const res = await fetch(`${url}/get/${encodeURIComponent(ORDERS_KV_KEY)}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  })
  if (!res.ok) return null
  const data = await res.json().catch(() => null)
  const raw = (data && (data.result ?? data.value)) as string | null
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

async function kvSetRaw(value: OrdersConfig): Promise<void> {
  if (!hasKvStore()) {
    memoryOrders.current = value
    return
  }
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL!
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN!
  await fetch(`${url}/set/${encodeURIComponent(ORDERS_KV_KEY)}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(value),
    cache: "no-store",
  })
  memoryOrders.current = value
}

export async function getOrdersConfig(): Promise<OrdersConfig> {
  if (memoryOrders.current) return memoryOrders.current
  const kv = await kvGetRaw()
  if (kv) {
    const config = normalizeOrdersConfig(kv)
    memoryOrders.current = config
    return config
  }
  if (!hasKvStore() && process.env.NODE_ENV === "development") {
    return { ...EMPTY_ORDERS, orders: [] }
  }
  return { ...EMPTY_ORDERS, orders: [] }
}

export async function saveOrdersConfig(config: OrdersConfig): Promise<OrdersConfig> {
  const normalized = normalizeOrdersConfig(config)
  await kvSetRaw(normalized)
  return normalized
}

export async function upsertOrder(order: ProductOrder): Promise<OrdersConfig> {
  const current = await getOrdersConfig()
  const rest = current.orders.filter((o) => o.id !== order.id)
  return saveOrdersConfig({ orders: [order, ...rest] })
}

export async function getOrderById(id: string): Promise<ProductOrder | null> {
  const config = await getOrdersConfig()
  return config.orders.find((o) => o.id === id) || null
}
