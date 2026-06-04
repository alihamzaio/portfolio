import { randomBytes, randomInt } from "crypto"
import { promises as fs } from "fs"
import path from "path"

const DATA_DIR = path.join(process.cwd(), "data")
const STORE_FILE = path.join(DATA_DIR, "auth-store.json")

const OTP_TTL_MS = 10 * 60 * 1000 // 10 minutes
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000 // 7 days
const MAX_OTP_PER_HOUR = 5

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

async function ensureStore(): Promise<AuthStore> {
  await fs.mkdir(DATA_DIR, { recursive: true })
  try {
    const raw = await fs.readFile(STORE_FILE, "utf8")
    return JSON.parse(raw) as AuthStore
  } catch {
    return { otps: {}, otpSentLog: {}, sessions: {} }
  }
}

async function saveStore(store: AuthStore) {
  await fs.mkdir(DATA_DIR, { recursive: true })
  await fs.writeFile(STORE_FILE, JSON.stringify(store, null, 2), "utf8")
}

export function getAdminEmail(): string {
  return (process.env.ADMIN_EMAIL || "hamzasarwer9@gmail.com").toLowerCase().trim()
}

export function isAllowedAdminEmail(email: string): boolean {
  return email.toLowerCase().trim() === getAdminEmail()
}

export async function createAndStoreOtp(email: string): Promise<{ code: string; expiresAt: number } | { error: string }> {
  const normalized = email.toLowerCase().trim()
  const store = await ensureStore()
  const now = Date.now()
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
  const ok = entry.code === code.trim()
  if (ok) delete store.otps[normalized]
  await saveStore(store)
  return ok
}

export async function createSession(email: string): Promise<{ token: string; expiresAt: number }> {
  const normalized = email.toLowerCase().trim()
  const token = randomBytes(32).toString("hex")
  const expiresAt = Date.now() + SESSION_TTL_MS
  const store = await ensureStore()
  store.sessions[token] = { email: normalized, expiresAt }
  await saveStore(store)
  return { token, expiresAt }
}

export async function verifySession(token: string | null): Promise<boolean> {
  if (!token) return false
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
