import { NextRequest, NextResponse } from 'next/server'
import { readJsonFile, requireAdminAuth } from '@/lib/admin'
import { getStoreJson, setStoreJson } from '@/lib/store'
import { jsonWithStoreSync } from '@/lib/store-response'

const JSON_PATH = 'lib/projects.json'

export async function GET() {
    const kv = await getStoreJson('projects')
    const projects = Array.isArray(kv) ? kv : await readJsonFile<any[]>(JSON_PATH).catch(() => [])
    return NextResponse.json(projects)
}

export async function POST(req: NextRequest) {
    if (!(await requireAdminAuth(req))) return new NextResponse('Unauthorized', { status: 401 })
    const body = await req.json()
    const { id, title, description, tags, image, details, link, github, featured } = body || {}
    if (!title) return new NextResponse('Invalid payload', { status: 400 })
    try {
        const current = await getStoreJson('projects')
        const projects = Array.isArray(current) ? current : await readJsonFile<any[]>(JSON_PATH).catch(() => [])
        const newProject = {
            id: id ?? Date.now(),
            title,
            description: description || '',
            tags: Array.isArray(tags) ? tags : [],
            featured: !!featured,
            ...(image ? { image } : {}),
            ...(details ? { details } : {}),
            ...(link ? { link } : {}),
            ...(github ? { github } : {}),
        }
        projects.push(newProject)
        const writeResult = await setStoreJson('projects', projects)
        return jsonWithStoreSync(newProject, writeResult, { status: 201 })
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Save failed'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}


