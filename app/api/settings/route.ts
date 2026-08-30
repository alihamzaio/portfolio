import { NextRequest, NextResponse } from "next/server"
import { requireAdminAuth } from "@/lib/admin"
import { getStoreJson, setStoreJson } from "@/lib/store"
import { jsonWithStoreSync } from "@/lib/store-response"
import { getSiteSettings } from "@/lib/content"
import { mergeSettings, type SiteSettings } from "@/lib/settings"

export async function GET() {
  const settings = await getSiteSettings()
  return NextResponse.json(settings)
}

export async function PUT(req: NextRequest) {
  const auth = req.headers.get("authorization")?.replace("Bearer ", "") || null
  if (!(await requireAdminAuth(auth))) return new NextResponse("Unauthorized", { status: 401 })

  const body = await req.json()
  const base = await getSiteSettings()

  const updated: SiteSettings = mergeSettings({
    ...base,
    ...body,
    social: body.social ? { ...base.social, ...body.social } : base.social,
  })

  if (body.email && !body.social?.email) {
    updated.social.email = body.email.includes("@")
      ? `mailto:${body.email.replace(/^mailto:/, "")}`
      : base.social.email
  }

  try {
    const writeResult = await setStoreJson("settings", updated)
    return jsonWithStoreSync(updated, writeResult)
  } catch (err) {
    const message = err instanceof Error ? err.message : "Save failed"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
