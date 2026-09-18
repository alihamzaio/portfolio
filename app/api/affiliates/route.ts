import { NextRequest, NextResponse } from "next/server"
import { requireAdminAuth } from "@/lib/admin"
import { getAffiliatesConfig, saveAffiliatesConfig } from "@/lib/affiliates-store"
import { publicAffiliateTools } from "@/lib/affiliates"
import { jsonWithStoreSync } from "@/lib/store-response"

export const runtime = "nodejs"

/** Public: only enabled affiliate links (empty until you add them in admin). */
export async function GET(req: NextRequest) {
  const config = await getAffiliatesConfig()
  const isAdmin = await requireAdminAuth(req)
  if (isAdmin) {
    return NextResponse.json(config)
  }
  return NextResponse.json({
    disclosure: config.disclosure,
    tools: publicAffiliateTools(config.tools),
  })
}

/** Admin: replace full affiliates config. */
export async function PUT(req: NextRequest) {
  if (!(await requireAdminAuth(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }
  try {
    const { config, writeResult } = await saveAffiliatesConfig(body)
    return jsonWithStoreSync(config, writeResult)
  } catch (e) {
    const message = e instanceof Error ? e.message : "Save failed"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
