import "server-only"

import { promises as fs } from "fs"
import path from "path"
import { readLiveGitHubFile, writeLiveGitHubFile } from "./github-live"
import { isGitHubSyncEnabled } from "./github-api"
import {
  COMMIT_LABELS,
  STORE_FILE_PATHS,
  SYNC_DIRTY_KEY,
  type StoreKey,
  listStoreKeys,
} from "./store-config"

type JsonValue = unknown

export type StoreWriteResult = {
  persisted: "kv" | "live" | "file"
}

const hasVercelKV = !!process.env.KV_REST_API_URL && !!process.env.KV_REST_API_TOKEN
const hasUpstash = !!process.env.UPSTASH_REDIS_REST_URL && !!process.env.UPSTASH_REDIS_REST_TOKEN

export function hasKvStore(): boolean {
  return hasVercelKV || hasUpstash
}

const memoryCache = new Map<StoreKey, JsonValue>()
const dirtyMemory = new Set<StoreKey>()

async function kvGet(key: string): Promise<JsonValue | null> {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL!
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN!
  const res = await fetch(`${url}/get/${encodeURIComponent(key)}`, {
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

async function kvSet(key: string, value: JsonValue): Promise<void> {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL!
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN!
  await fetch(`${url}/set/${encodeURIComponent(key)}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(value),
    cache: "no-store",
  })
}

function filePathFor(key: StoreKey) {
  return path.join(process.cwd(), STORE_FILE_PATHS[key])
}

function isServerlessRuntime(): boolean {
  return (
    process.env.VERCEL === "1" ||
    process.cwd().includes("/var/task") ||
    !!process.env.AWS_LAMBDA_FUNCTION_NAME
  )
}

async function markDirty(key: StoreKey) {
  dirtyMemory.add(key)
  if (!hasKvStore()) return
  const existing = (await kvGet(SYNC_DIRTY_KEY)) as { keys?: StoreKey[] } | null
  const keys = new Set<StoreKey>([...(existing?.keys || []), key])
  await kvSet(SYNC_DIRTY_KEY, { keys: [...keys], at: Date.now() })
}

export async function getSyncDirtyKeys(): Promise<StoreKey[]> {
  if (hasKvStore()) {
    const existing = (await kvGet(SYNC_DIRTY_KEY)) as { keys?: StoreKey[] } | null
    if (existing?.keys?.length) return existing.keys
  }
  if (dirtyMemory.size > 0) return [...dirtyMemory]
  return listStoreKeys()
}

export async function clearSyncDirty() {
  dirtyMemory.clear()
  if (!hasKvStore()) return
  await kvSet(SYNC_DIRTY_KEY, { keys: [], at: Date.now() })
}

export async function getLiveContentForSync(key: StoreKey): Promise<string | null> {
  const cached = memoryCache.get(key)
  if (cached !== undefined) return JSON.stringify(cached, null, 2)

  if (hasKvStore()) {
    const kv = await kvGet(`portfolio:${key}`)
    if (kv !== null) return JSON.stringify(kv, null, 2)
  }

  if (isServerlessRuntime() && isGitHubSyncEnabled()) {
    return await readLiveGitHubFile(STORE_FILE_PATHS[key])
  }

  try {
    return await fs.readFile(filePathFor(key), "utf8")
  } catch {
    return null
  }
}

export async function getStoreJson(key: StoreKey): Promise<JsonValue | null> {
  if (memoryCache.has(key)) {
    return memoryCache.get(key) ?? null
  }

  if (hasKvStore()) {
    const kv = await kvGet(`portfolio:${key}`)
    if (kv !== null) {
      memoryCache.set(key, kv)
      return kv
    }
  }

  if (isServerlessRuntime() && isGitHubSyncEnabled()) {
    const live = await readLiveGitHubFile(STORE_FILE_PATHS[key])
    if (live) {
      try {
        const parsed = JSON.parse(live) as JsonValue
        memoryCache.set(key, parsed)
        return parsed
      } catch {
        // fall through
      }
    }
  }

  try {
    const raw = await fs.readFile(filePathFor(key), "utf8")
    const parsed = JSON.parse(raw) as JsonValue
    memoryCache.set(key, parsed)
    return parsed
  } catch {
    return null
  }
}

export async function setStoreJson(key: StoreKey, value: JsonValue): Promise<StoreWriteResult> {
  memoryCache.set(key, value)
  const serialized = JSON.stringify(value, null, 2)
  const onServerless = isServerlessRuntime()

  if (hasKvStore()) {
    await kvSet(`portfolio:${key}`, value)
    await markDirty(key)
    return { persisted: "kv" }
  }

  if (onServerless && isGitHubSyncEnabled()) {
    await writeLiveGitHubFile(STORE_FILE_PATHS[key], serialized, COMMIT_LABELS[key])
    await markDirty(key)
    return { persisted: "live" }
  }

  if (onServerless) {
    throw new Error(
      "Live admin save needs Upstash Redis (Vercel Storage) or GITHUB_TOKEN. Add KV in Vercel → Storage, or set GITHUB_TOKEN with repo scope."
    )
  }

  await fs.writeFile(filePathFor(key), serialized, "utf8")
  return { persisted: "file" }
}

export function storeSyncMessage(result: StoreWriteResult): string | null {
  if (result.persisted === "kv" || result.persisted === "live") {
    return "Saved live. GitHub sync runs daily; merge the PR when it appears to update the repo."
  }
  if (result.persisted === "file") {
    return "Saved locally."
  }
  return null
}

export { listStoreKeys, STORE_FILE_PATHS, type StoreKey }
