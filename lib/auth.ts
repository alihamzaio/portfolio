import { createHmac, randomInt, timingSafeEqual } from "crypto"
import { promises as fs } from "fs"
import path from "path"
import { getAdminEmailFromEnv } from "./env-server"

const OTP_TTL_MS = 10 * 60 * 1000 // 10 minutes
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000 // 7 days
const MAX_OTP_PER_HOUR = 5
const OTP_COOKIE = "admin_otp"
const AUTH_KV_KEY = "portfolio:auth-store"

interface OtpEntry {
  code: string
  expiresAt: number
  attempts: number
}

interface SessionEntry {
  email: string
  expiresAt: number
}

interface AuthStore {
  otps: Record<string, OtpEntry>
  otpSentLog: Record<string, number[]>
  sessions: Record<string, SessionEntry>
}

type GlobalAuth = typeof globalThis & { __portfolioAuthStore?: AuthStore }

function emptyStore(): AuthStore {
  return { otps: {}, otpSentLog: {}, sessions: {} }
}

function memoryStore(): AuthStore {
  const g = globalThis as GlobalAuth
  if (!g.__portfolioAuthStore) g.__portfolioAuthStore = emptyStore()
  return g.__portfolioAuthStore
}

function hasKv(): boolean {
  return (
    (!!process.env.KV_REST_API_URL && !!process.env.KV_REST_API_TOKEN) ||
    (!!process.env.UPSTASH_REDIS_REST_URL && !!process.env.UPSTASH_REDIS_REST_TOKEN)
  )
}

function kvUrl(): string {
  return process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || ""
}

function kvToken(): string {
  return process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || ""
}

function localStorePath(): string {
  if (process.env.VERCEL) return path.join("/tmp", "auth-store.json")
  return path.join(process.cwd(), "data", "auth-store.json")
}

function sessionSecret(): string {
  const secret = process.env.AUTH_SECRET?.trim()
  if (secret) return secret
  const resend = process.env.RESEND_API_KEY?.trim()
  if (resend) return resend
  return "dev-otp-secret"
}

function createSignedSessionToken(email: string, expiresAt: number): string {
  const payload = Buffer.from(JSON.stringify({ email, exp: expiresAt }), "utf8").toString("base64url")
  const signature = createHmac("sha256", sessionSecret()).update(payload).digest("base64url")
  return `${payload}.${signature}`
}

function verifySignedSessionToken(token: string): boolean {
  const dot = token.indexOf(".")
  if (dot <= 0) return false

  const payload = token.slice(0, dot)
  const signature = token.slice(dot + 1)
  if (!payload || !signature) return false

  const expected = createHmac("sha256", sessionSecret()).update(payload).digest("base64url")
  if (!safeEqual(signature, expected)) return false

  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      email?: string
      exp?: number
    }
    if (!data.email || typeof data.exp !== "number") return false
    if (Date.now() > data.exp) return false
    return isAllowedAdminEmail(data.email)
  } catch {
    return false
  }
}

function otpSecret(): string {
  return sessionSecret()
}

function signOtp(email: string, code: string, expiresAt: number): string {
  return createHmac("sha256", otpSecret()).update(`${email}:${code}:${expiresAt}`).digest("hex")
}

function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a)
  const right = Buffer.from(b)
  if (left.length !== right.length) return false
  return timingSafeEqual(left, right)
}

export const OTP_COOKIE_NAME = OTP_COOKIE

export function createOtpCookie(email: string, code: string, expiresAt: number): string {
  return `${expiresAt}.${signOtp(email, code, expiresAt)}`
}

export function verifyOtpCookie(email: string, code: string, cookie: string | undefined): boolean {
  if (!cookie) return false
  const [expiresRaw, hmac] = cookie.split(".")
  const expiresAt = Number(expiresRaw)
  if (!expiresAt || !hmac || Number.isNaN(expiresAt)) return false
  if (Date.now() > expiresAt) return false
  return safeEqual(hmac, signOtp(email.toLowerCase().trim(), code.trim(), expiresAt))
}

async function kvGetStore(): Promise<AuthStore | null> {
  try {
    const res = await fetch(`${kvUrl()}/get/${encodeURIComponent(AUTH_KV_KEY)}`, {
      headers: { Authorization: `Bearer ${kvToken()}` },
      cache: "no-store",
    })
    if (!res.ok) return null
    const data = (await res.json()) as { result?: string | null }
    if (!data.result) return null
    return JSON.parse(data.result) as AuthStore
  } catch {
    return null
  }
}

async function kvSetStore(store: AuthStore): Promise<void> {
  await fetch(`${kvUrl()}/set/${encodeURIComponent(AUTH_KV_KEY)}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${kvToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(store),
    cache: "no-store",
  })
}

async function ensureStore(): Promise<AuthStore> {
  const mem = memoryStore()
  if (hasKv()) {
    const remote = await kvGetStore()
    if (remote) {
      Object.assign(mem, remote)
      return mem
    }
  }
  try {
    const raw = await fs.readFile(localStorePath(), "utf8")
    const parsed = JSON.parse(raw) as AuthStore
    Object.assign(mem, parsed)
  } catch {
    // first run or read-only filesystem
  }
  return mem
}

async function saveStore(store: AuthStore) {
  Object.assign(memoryStore(), store)
  if (hasKv()) {
    try {
      await kvSetStore(store)
      return
    } catch {
      // fall through to disk
    }
  }
  try {
    const file = localStorePath()
    await fs.mkdir(path.dirname(file), { recursive: true })
    await fs.writeFile(file, JSON.stringify(store), "utf8")
  } catch {
    // On Vercel the app filesystem is read-only except /tmp; memory still holds this instance.
  }
}

export function getAdminEmail(): string {
  return getAdminEmailFromEnv()
}

export function isAllowedAdminEmail(email: string): boolean {
  return email.toLowerCase().trim() === getAdminEmail()
}

export async function createAndStoreOtp(
  email: string
): Promise<{ code: string; expiresAt: number } | { error: string }> {
  const normalized = email.toLowerCase().trim()
  const now = Date.now()
  let store: AuthStore
  try {
    store = await ensureStore()
  } catch {
    store = memoryStore()
  }

  const log = store.otpSentLog[normalized] || []
  const recent = log.filter((t) => now - t < 60 * 60 * 1000)
  if (recent.length >= MAX_OTP_PER_HOUR) {
    return { error: "Too many OTP requests. Try again in an hour." }
  }

  const code = String(randomInt(100000, 999999))
  const expiresAt = now + OTP_TTL_MS
  store.otps[normalized] = { code, expiresAt, attempts: 0 }
  store.otpSentLog[normalized] = [...recent, now]
  await saveStore(store)
  return { code, expiresAt }
}

export async function verifyOtp(email: string, code: string): Promise<boolean> {
  const normalized = email.toLowerCase().trim()
  const trimmed = code.trim()
  try {
    const store = await ensureStore()
    const entry = store.otps[normalized]
    if (!entry) return false
    if (Date.now() > entry.expiresAt) {
      delete store.otps[normalized]
      await saveStore(store)
      return false
    }
    entry.attempts += 1
    if (entry.attempts > 5) {
      delete store.otps[normalized]
      await saveStore(store)
      return false
    }
    const ok = entry.code === trimmed
    if (ok) delete store.otps[normalized]
    await saveStore(store)
    return ok
  } catch {
    return false
  }
}

export async function createSession(email: string): Promise<{ token: string; expiresAt: number }> {
  const normalized = email.toLowerCase().trim()
  const expiresAt = Date.now() + SESSION_TTL_MS
  const token = createSignedSessionToken(normalized, expiresAt)

  try {
    const store = await ensureStore()
    store.sessions[token] = { email: normalized, expiresAt }
    await saveStore(store)
  } catch {
    // Signed token works without shared storage (required on Vercel serverless).
  }

  return { token, expiresAt }
}

export async function verifySession(token: string | null): Promise<boolean> {
  if (!token) return false

  if (verifySignedSessionToken(token)) return true

  const store = await ensureStore()
  const session = store.sessions[token]
  if (!session) return false
  if (Date.now() > session.expiresAt) {
    delete store.sessions[token]
    await saveStore(store)
    return false
  }
  return true
}

export async function revokeSession(token: string): Promise<void> {
  const store = await ensureStore()
  delete store.sessions[token]
  await saveStore(store)
}
