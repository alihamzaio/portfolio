import { promises as fs } from "fs"
import path from "path"
import type { NextRequest } from "next/server"
import { SESSION_COOKIE_NAME, verifySession } from "./auth"

export async function readJsonFile<T>(relativePath: string): Promise<T> {
  const filePath = path.join(process.cwd(), relativePath)
  const data = await fs.readFile(filePath, "utf8")
  return JSON.parse(data) as T
}

export async function writeJsonFile<T>(relativePath: string, data: T): Promise<void> {
  const filePath = path.join(process.cwd(), relativePath)
  const content = JSON.stringify(data, null, 2)
  await fs.writeFile(filePath, content, "utf8")
}

/** @deprecated Use requireAdminAuth — kept for backwards compatibility */
export function requireAdminToken(headerValue: string | null): boolean {
  const legacy = process.env.ADMIN_TOKEN || ""
  if (legacy && headerValue === legacy) return true
  return false
}

export function getAdminTokenFromRequest(req: NextRequest): string | null {
  const header = req.headers.get("authorization")
  if (header) {
    const token = header.replace(/^Bearer\s+/i, "").trim()
    if (token) return token
  }
  return req.cookies.get(SESSION_COOKIE_NAME)?.value?.trim() || null
}

async function isValidAdminToken(token: string | null): Promise<boolean> {
  if (!token) return false
  if (process.env.ADMIN_TOKEN && token === process.env.ADMIN_TOKEN) return true
  return verifySession(token)
}

export async function requireAdminAuth(
  headerOrReq: string | null | NextRequest
): Promise<boolean> {
  if (headerOrReq && typeof headerOrReq !== "string" && "cookies" in headerOrReq) {
    const header = headerOrReq.headers.get("authorization")?.replace(/^Bearer\s+/i, "").trim() || null
    const cookie = headerOrReq.cookies.get(SESSION_COOKIE_NAME)?.value?.trim() || null
    if (await isValidAdminToken(header)) return true
    if (cookie && cookie !== header && (await isValidAdminToken(cookie))) return true
    return false
  }

  return isValidAdminToken(headerOrReq)
}
