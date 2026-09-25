import { NextResponse, type NextRequest } from "next/server"
import { requireAdminAuth } from "@/lib/admin"
import { getStudioDashboardPayload } from "@/lib/studio"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  if (!(await requireAdminAuth(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const data = await getStudioDashboardPayload()
    return NextResponse.json(data)
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load studio status"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
