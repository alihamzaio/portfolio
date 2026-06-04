import { promises as fs } from "fs"
import path from "path"
import { verifySession } from "./auth"

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

export async function requireAdminAuth(headerValue: string | null): Promise<boolean> {
  if (!headerValue) return false
  if (process.env.ADMIN_TOKEN && headerValue === process.env.ADMIN_TOKEN) return true
  return verifySession(headerValue)
}
