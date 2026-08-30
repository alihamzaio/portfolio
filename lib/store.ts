import { promises as fs } from "fs"
import path from "path"
import { syncJsonFileToGitHub, shouldSyncToGitHub } from "./github-sync"

type JsonValue = unknown

export type StoreWriteResult = {
  persisted: "kv" | "file" | "github"
  github?: { committed: boolean; sha?: string; prUrl?: string; branch?: string; error?: string }
}

const hasVercelKV = !!process.env.KV_REST_API_URL && !!process.env.KV_REST_API_TOKEN
const hasUpstash = !!process.env.UPSTASH_REDIS_REST_URL && !!process.env.UPSTASH_REDIS_REST_TOKEN

const memoryCache = new Map<StoreKey, JsonValue>()

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
  const body = JSON.stringify(value)
  await fetch(`${url}/set/${encodeURIComponent(key)}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body,
    cache: "no-store",
  })
}

type StoreKey = "skills" | "projects" | "settings" | "experience"

const STORE_PATHS: Record<StoreKey, string> = {
  skills: "lib/skill.json",
  projects: "lib/projects.json",
  experience: "lib/experience.json",
  settings: "lib/settings.json",
}

const COMMIT_LABELS: Record<StoreKey, string> = {
  skills: "Update skills from admin panel.",
  projects: "Update projects from admin panel.",
  experience: "Update experience from admin panel.",
  settings: "Update site settings from admin panel.",
}

function filePathFor(key: StoreKey) {
  return path.join(process.cwd(), STORE_PATHS[key])
}

export async function getStoreJson(key: StoreKey): Promise<JsonValue | null> {
  if (memoryCache.has(key)) {
    return memoryCache.get(key) ?? null
  }

  if (hasVercelKV || hasUpstash) {
    return await kvGet(`portfolio:${key}`)
  }

  try {
    const raw = await fs.readFile(filePathFor(key), "utf8")
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export async function setStoreJson(key: StoreKey, value: JsonValue): Promise<StoreWriteResult> {
  memoryCache.set(key, value)
  const serialized = JSON.stringify(value, null, 2)

  if (hasVercelKV || hasUpstash) {
    await kvSet(`portfolio:${key}`, value)
    return { persisted: "kv" }
  }

  if (shouldSyncToGitHub()) {
    const github = await syncJsonFileToGitHub(STORE_PATHS[key], serialized, COMMIT_LABELS[key])
    if (!github.committed) {
      throw new Error(github.error || "Could not save to GitHub")
    }
    return { persisted: "github", github }
  }

  if (process.env.VERCEL === "1") {
    throw new Error(
      "Admin save needs GITHUB_TOKEN on Vercel. Add it in Project Settings → Environment Variables."
    )
  }

  await fs.writeFile(filePathFor(key), serialized, "utf8")
  return { persisted: "file" }
}

export function storeSyncMessage(result: StoreWriteResult): string | null {
  if (result.persisted === "github" && result.github?.committed) {
    return result.github.prUrl
      ? "Pull request opened. Review and merge it to publish on live."
      : "Saved on a review branch. Open GitHub and merge the pull request to publish."
  }
  if (result.persisted === "file") {
    return "Saved locally."
  }
  if (result.persisted === "kv") {
    return "Saved to database."
  }
  return null
}
