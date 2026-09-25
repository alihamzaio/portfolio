import { NextResponse, type NextRequest } from "next/server"
import { requireAdminAuth } from "@/lib/admin"
import { STUDIO_WORKFLOWS, dispatchStudioWorkflow, type StudioWorkflowKey } from "@/lib/studio"

export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
  if (!(await requireAdminAuth(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let body: { workflow?: string } = {}
  try {
    body = (await req.json()) as { workflow?: string }
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const workflow = (body.workflow || "").trim() as StudioWorkflowKey
  if (!(workflow in STUDIO_WORKFLOWS)) {
    return NextResponse.json(
      { error: `Unknown workflow. Use: ${Object.keys(STUDIO_WORKFLOWS).join(", ")}` },
      { status: 400 }
    )
  }

  const result = await dispatchStudioWorkflow(workflow)
  return NextResponse.json(result, { status: result.ok ? 200 : result.status || 500 })
}
