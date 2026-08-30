import { NextRequest, NextResponse } from 'next/server'
import { readJsonFile, requireAdminAuth } from '@/lib/admin'
import { getStoreJson, setStoreJson } from '@/lib/store'
import { jsonWithStoreSync } from '@/lib/store-response'

const JSON_PATH = 'lib/skill.json'

export async function GET(_: NextRequest, ctx: { params: Promise<{ name: string }> }) {
    const { name } = await ctx.params
    const kv = await getStoreJson('skills')
    const skills = Array.isArray(kv) ? kv : await readJsonFile<any[]>(JSON_PATH).catch(() => [])
    const item = skills.find((s) => s.name === decodeURIComponent(name))
    if (!item) return new NextResponse('Not found', { status: 404 })
    return NextResponse.json(item)
}

export async function PUT(req: NextRequest, ctx: { params: Promise<{ name: string }> }) {
    const auth = req.headers.get('authorization')?.replace('Bearer ', '') || null
    if (!(await requireAdminAuth(auth))) return new NextResponse('Unauthorized', { status: 401 })
    const body = await req.json()
    const { level, image, name } = body || {}
    const { name: paramName } = await ctx.params
    const kv = await getStoreJson('skills')
    const skills = Array.isArray(kv) ? kv : await readJsonFile<any[]>(JSON_PATH).catch(() => [])
    const idx = skills.findIndex((s) => s.name === decodeURIComponent(paramName))
    if (idx === -1) return new NextResponse('Not found', { status: 404 })
    const updated = { ...skills[idx], ...(typeof level === 'number' ? { level } : {}), ...(image !== undefined ? { image } : {}), ...(name ? { name } : {}) }
    skills[idx] = updated
    try {
        const writeResult = await setStoreJson('skills', skills)
        return jsonWithStoreSync(updated, writeResult)
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Save failed'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest, ctx: { params: Promise<{ name: string }> }) {
    const auth = req.headers.get('authorization')?.replace('Bearer ', '') || null
    if (!(await requireAdminAuth(auth))) return new NextResponse('Unauthorized', { status: 401 })
    const { name } = await ctx.params
    const kv = await getStoreJson('skills')
    const skills = Array.isArray(kv) ? kv : await readJsonFile<any[]>(JSON_PATH).catch(() => [])
    const decoded = decodeURIComponent(name)
    const next = skills.filter((s) => s.name !== decoded)
    if (next.length === skills.length) return new NextResponse('Not found', { status: 404 })
    try {
        const writeResult = await setStoreJson('skills', next)
        return jsonWithStoreSync({ ok: true }, writeResult)
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Save failed'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}


