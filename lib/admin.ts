import { promises as fs } from 'fs'
import path from 'path'

export async function readJsonFile<T>(relativePath: string): Promise<T> {
    const filePath = path.join(process.cwd(), relativePath)
    const data = await fs.readFile(filePath, 'utf8')
    return JSON.parse(data) as T
}

export async function writeJsonFile<T>(relativePath: string, data: T): Promise<void> {
    const filePath = path.join(process.cwd(), relativePath)
    const content = JSON.stringify(data, null, 2)
    await fs.writeFile(filePath, content, 'utf8')
}

export function requireAdminToken(headerValue: string | null): boolean {
    const token = process.env.ADMIN_TOKEN || ''
    if (!token) return false
    return headerValue === token
}


