import { NextRequest, NextResponse } from 'next/server'
import { readJsonFile, requireAdminAuth } from '@/lib/admin'
import { getStoreJson, setStoreJson } from '@/lib/store'
import { jsonWithStoreSync } from '@/lib/store-response'

const JSON_PATH = 'lib/skill.json'

export async function GET() {
    const kv = await getStoreJson('skills')
    const skills = Array.isArray(kv) ? kv : await readJsonFile<any[]>(JSON_PATH).catch(() => [])
    return NextResponse.json(skills)
}

export async function POST(req: NextRequest) {
    const auth = req.headers.get('authorization')?.replace('Bearer ', '') || null
    if (!(await requireAdminAuth(auth))) return new NextResponse('Unauthorized', { status: 401 })
    const body = await req.json()
    const { name, level, image } = body || {}
    if (!name || typeof level !== 'number') return new NextResponse('Invalid payload', { status: 400 })
    const current = await getStoreJson('skills')
    const skills = Array.isArray(current) ? current : await readJsonFile<any[]>(JSON_PATH).catch(() => [])
    if (skills.find((s) => s.name === name)) return new NextResponse('Conflict', { status: 409 })
    const newSkill = { name, level, ...(image ? { image } : {}) }
    skills.push(newSkill)
    try {
        const writeResult = await setStoreJson('skills', skills)
        return jsonWithStoreSync(newSkill, writeResult, { status: 201 })
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Save failed'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}


