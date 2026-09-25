import { NextResponse, type NextRequest } from "next/server"
import { requireAdminAuth } from "@/lib/admin"
import { downloadStudioArtifactZip } from "@/lib/studio"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

type Params = { params: Promise<{ id: string }> }

export async function GET(req: NextRequest, { params }: Params) {
  if (!(await requireAdminAuth(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const artifactId = Number(id)
  if (!Number.isFinite(artifactId) || artifactId <= 0) {
    return NextResponse.json({ error: "Invalid artifact id" }, { status: 400 })
  }

  const result = await downloadStudioArtifactZip(artifactId)
  if (!result.ok) {
    return NextResponse.json({ error: result.message }, { status: result.status })
  }

  return new NextResponse(result.buffer, {
    status: 200,
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${result.filename}"`,
      "Cache-Control": "no-store",
    },
  })
}
