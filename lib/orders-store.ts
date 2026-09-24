import "server-only"

import {
  EMPTY_ORDERS,
  normalizeOrdersConfig,
  type OrdersConfig,
  type ProductOrder,
} from "@/lib/orders"
import { hasKvStore } from "@/lib/store"
import { LIVE_CONTENT_BRANCH } from "@/lib/github-live"
import {
  ensureBranchExists,
  getBranchSha,
  getFileContent,
  getGitHubToken,
  putFileContent,
} from "@/lib/github-api"
import { githubSyncConfig } from "@/lib/github-sync-config"

const ORDERS_KV_KEY = "portfolio:orders"
const ORDERS_FILE = "content/orders.json"
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
  if (!hasKvStore()) return
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL!
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN!
  await fetch(`${url}/set/${encodeURIComponent(ORDERS_KV_KEY)}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(value),
    cache: "no-store",
  })
}

async function githubGetOrders(): Promise<OrdersConfig | null> {
  const token = getGitHubToken()
  if (!token) return null
  try {
    const file = await getFileContent(token, githubSyncConfig.repo, LIVE_CONTENT_BRANCH, ORDERS_FILE)
    if (!file?.content) return null
    return normalizeOrdersConfig(JSON.parse(file.content))
  } catch {
    return null
  }
}

async function githubSetOrders(value: OrdersConfig): Promise<void> {
  const token = getGitHubToken()
  if (!token) {
    throw new Error("Orders need Upstash Redis or GITHUB_TOKEN so they can be saved.")
  }
  const { repo, baseBranch } = githubSyncConfig
  const mainSha = await getBranchSha(token, repo, baseBranch)
  await ensureBranchExists(token, repo, LIVE_CONTENT_BRANCH, mainSha)
  await putFileContent(
    token,
    repo,
    LIVE_CONTENT_BRANCH,
    ORDERS_FILE,
    JSON.stringify(value, null, 2),
    "Update direct product orders."
  )
}

export function ordersStorageMode(): "kv" | "github" | "memory" {
  if (hasKvStore()) return "kv"
  if (getGitHubToken()) return "github"
  return "memory"
}

export async function getOrdersConfig(): Promise<OrdersConfig> {
  if (memoryOrders.current) return memoryOrders.current

  if (hasKvStore()) {
    const kv = await kvGetRaw()
    if (kv) {
      const config = normalizeOrdersConfig(kv)
      memoryOrders.current = config
      return config
    }
  }

  const fromGithub = await githubGetOrders()
  if (fromGithub) {
    memoryOrders.current = fromGithub
    return fromGithub
  }

  return { ...EMPTY_ORDERS, orders: [] }
}

export async function saveOrdersConfig(config: OrdersConfig): Promise<OrdersConfig> {
  const normalized = normalizeOrdersConfig(config)
  memoryOrders.current = normalized

  if (hasKvStore()) {
    await kvSetRaw(normalized)
    return normalized
  }

  if (getGitHubToken()) {
    await githubSetOrders(normalized)
    return normalized
  }

  if (process.env.NODE_ENV === "development") {
    return normalized
  }

  throw new Error(
    "Orders could not be saved. Add Upstash Redis in Vercel Storage, or ensure GITHUB_TOKEN is set."
  )
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

export async function deleteOrder(id: string): Promise<OrdersConfig> {
  const current = await getOrdersConfig()
  const next = current.orders.filter((o) => o.id !== id)
  if (next.length === current.orders.length) {
    throw new Error("Order not found")
  }
  return saveOrdersConfig({ orders: next })
}
