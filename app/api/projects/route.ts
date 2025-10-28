import { NextRequest, NextResponse } from 'next/server'
import { readJsonFile, writeJsonFile, requireAdminToken } from '@/lib/admin'
import { getStoreJson, setStoreJson } from '@/lib/store'

const JSON_PATH = 'lib/projects.json'

export async function GET() {
    const kv = await getStoreJson('projects')
    const projects = Array.isArray(kv) ? kv : await readJsonFile<any[]>(JSON_PATH).catch(() => [])
    return NextResponse.json(projects)
}

export async function POST(req: NextRequest) {
    const auth = req.headers.get('authorization')?.replace('Bearer ', '') || null
    if (!requireAdminToken(auth)) return new NextResponse('Unauthorized', { status: 401 })
    const body = await req.json()
    const { id, title, description, tags, image, details, link, github } = body || {}
    if (!title) return new NextResponse('Invalid payload', { status: 400 })
    const current = await getStoreJson('projects')
    const projects = Array.isArray(current) ? current : await readJsonFile<any[]>(JSON_PATH).catch(() => [])
    const newProject = {
        id: id ?? Date.now(),
        title,
        description: description || '',
        tags: Array.isArray(tags) ? tags : [],
        ...(image ? { image } : {}),
        ...(details ? { details } : {}),
        ...(link ? { link } : {}),
        ...(github ? { github } : {}),
    }
    projects.push(newProject)
    await setStoreJson('projects', projects)
    return NextResponse.json(newProject, { status: 201 })
}


