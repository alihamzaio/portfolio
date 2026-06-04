import { promises as fs } from 'fs'
import path from 'path'

type JsonValue = any

const hasVercelKV = !!process.env.KV_REST_API_URL && !!process.env.KV_REST_API_TOKEN
const hasUpstash = !!process.env.UPSTASH_REDIS_REST_URL && !!process.env.UPSTASH_REDIS_REST_TOKEN

async function kvGet(key: string): Promise<JsonValue | null> {
    const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL!
    const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN!
    const res = await fetch(`${url}/get/${encodeURIComponent(key)}`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
    })
    if (!res.ok) return null
    const data = await res.json().catch(() => null)
    // Vercel KV returns { result: string|null }, Upstash returns similar
    const raw = (data && (data.result ?? data.value)) as string | null
    if (!raw) return null
    try { return JSON.parse(raw) } catch { return null }
}

async function kvSet(key: string, value: JsonValue): Promise<void> {
    const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL!
    const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN!
    const body = JSON.stringify(value)
    await fetch(`${url}/set/${encodeURIComponent(key)}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body,
        cache: 'no-store',
    })
}

type StoreKey = 'skills' | 'projects' | 'settings' | 'experience'

function filePathFor(key: StoreKey) {
    const rel =
        key === 'skills'
            ? 'lib/skill.json'
            : key === 'projects'
              ? 'lib/projects.json'
              : key === 'experience'
                ? 'lib/experience.json'
                : 'lib/settings.json'
    return path.join(process.cwd(), rel)
}

export async function getStoreJson(key: StoreKey): Promise<JsonValue | null> {
    if (hasVercelKV || hasUpstash) {
        return await kvGet(`portfolio:${key}`)
    }
    try {
        const raw = await fs.readFile(filePathFor(key), 'utf8')
        return JSON.parse(raw)
    } catch {
        return null
    }
}

export async function setStoreJson(key: StoreKey, value: JsonValue): Promise<void> {
    if (hasVercelKV || hasUpstash) {
        await kvSet(`portfolio:${key}`, value)
        return
    }
    await fs.writeFile(filePathFor(key), JSON.stringify(value, null, 2), 'utf8')
}


