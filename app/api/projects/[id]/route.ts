import { NextRequest, NextResponse } from 'next/server'
import { readJsonFile, requireAdminAuth } from '@/lib/admin'
import { getStoreJson, setStoreJson } from '@/lib/store'

const JSON_PATH = 'lib/projects.json'

export async function GET(_: NextRequest, ctx: { params: Promise<{ id: string }> }) {
    const { id } = await ctx.params
    const kv = await getStoreJson('projects')
    const projects = Array.isArray(kv) ? kv : await readJsonFile<any[]>(JSON_PATH).catch(() => [])
    const pid = Number(id)
    const item = projects.find((p) => p.id === pid)
    if (!item) return new NextResponse('Not found', { status: 404 })
    return NextResponse.json(item)
}

export async function PUT(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
    const auth = req.headers.get('authorization')?.replace('Bearer ', '') || null
    if (!(await requireAdminAuth(auth))) return new NextResponse('Unauthorized', { status: 401 })
    const body = await req.json()
    const { id } = await ctx.params
    const kv = await getStoreJson('projects')
    const projects = Array.isArray(kv) ? kv : await readJsonFile<any[]>(JSON_PATH).catch(() => [])
    const pid = Number(id)
    const idx = projects.findIndex((p) => p.id === pid)
    if (idx === -1) return new NextResponse('Not found', { status: 404 })
    const updated = { ...projects[idx], ...body, id: pid }
    projects[idx] = updated
    await setStoreJson('projects', projects)
    return NextResponse.json(updated)
}

export async function DELETE(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
    const auth = req.headers.get('authorization')?.replace('Bearer ', '') || null
    if (!(await requireAdminAuth(auth))) return new NextResponse('Unauthorized', { status: 401 })
    const { id } = await ctx.params
    const kv = await getStoreJson('projects')
    const projects = Array.isArray(kv) ? kv : await readJsonFile<any[]>(JSON_PATH).catch(() => [])
    const pid = Number(id)
    const next = projects.filter((p) => p.id !== pid)
    if (next.length === projects.length) return new NextResponse('Not found', { status: 404 })
    await setStoreJson('projects', next)
    return NextResponse.json({ ok: true })
}


