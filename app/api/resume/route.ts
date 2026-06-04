import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { requireAdminAuth } from '@/lib/admin'

const RESUME_DIR = path.join(process.cwd(), 'public', 'resume')
const ACTIVE_JSON = path.join(process.cwd(), 'public', 'resume', 'active.json')

async function ensureDir() {
    await fs.mkdir(RESUME_DIR, { recursive: true })
}

export async function GET() {
    await ensureDir()
    const files = await fs.readdir(RESUME_DIR)
    const pdfs = files.filter((f) => f.toLowerCase().endsWith('.pdf'))
    let active: string | null = null
    try {
        const raw = await fs.readFile(ACTIVE_JSON, 'utf8')
        const data = JSON.parse(raw)
        active = data?.active || null
    } catch { }
    return NextResponse.json({ files: pdfs, active })
}

export async function POST(req: NextRequest) {
    const auth = req.headers.get('authorization')?.replace('Bearer ', '') || null
    if (!(await requireAdminAuth(auth))) return new NextResponse('Unauthorized', { status: 401 })

    await ensureDir()
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    if (!file) return new NextResponse('Missing file', { status: 400 })
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const fileName = file.name.replace(/[^a-zA-Z0-9_.-]/g, '_')
    const dest = path.join(RESUME_DIR, fileName)
    await fs.writeFile(dest, buffer)
    return NextResponse.json({ ok: true, file: `/resume/${fileName}` })
}

export async function PUT(req: NextRequest) {
    const auth = req.headers.get('authorization')?.replace('Bearer ', '') || null
    if (!(await requireAdminAuth(auth))) return new NextResponse('Unauthorized', { status: 401 })
    const { active } = await req.json()
    if (typeof active !== 'string') return new NextResponse('Invalid payload', { status: 400 })
    await ensureDir()
    await fs.writeFile(ACTIVE_JSON, JSON.stringify({ active }, null, 2), 'utf8')
    return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest) {
    const auth = req.headers.get('authorization')?.replace('Bearer ', '') || null
    if (!(await requireAdminAuth(auth))) return new NextResponse('Unauthorized', { status: 401 })
    const { searchParams } = new URL(req.url)
    const name = searchParams.get('name')
    if (!name) return new NextResponse('Missing name', { status: 400 })
    const filePath = path.join(RESUME_DIR, name)
    await fs.unlink(filePath)
    try {
        const raw = await fs.readFile(ACTIVE_JSON, 'utf8')
        const data = JSON.parse(raw)
        if (data.active === name) {
            await fs.writeFile(ACTIVE_JSON, JSON.stringify({ active: null }, null, 2), 'utf8')
        }
    } catch { }
    return NextResponse.json({ ok: true })
}


