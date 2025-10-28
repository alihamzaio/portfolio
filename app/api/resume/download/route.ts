import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const RESUME_DIR = path.join(process.cwd(), 'public', 'resume')
const ACTIVE_JSON = path.join(RESUME_DIR, 'active.json')

export async function GET(_req: NextRequest) {
    try {
        const raw = await fs.readFile(ACTIVE_JSON, 'utf8')
        const { active } = JSON.parse(raw || '{}') as { active?: string }
        if (!active) return new NextResponse('No active resume', { status: 404 })
        const filePath = path.join(RESUME_DIR, active)
        const file = await fs.readFile(filePath)
        return new NextResponse(file, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="${active}"`,
                'Cache-Control': 'public, max-age=3600, immutable',
            },
        })
    } catch (e) {
        return new NextResponse('Resume not found', { status: 404 })
    }
}


