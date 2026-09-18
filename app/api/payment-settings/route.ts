import { NextRequest, NextResponse } from "next/server"
import { requireAdminAuth } from "@/lib/admin"
import { getPaymentSettings, savePaymentSettings } from "@/lib/payment-settings-store"
import { publicPaymentSettings } from "@/lib/payment-settings"
import { jsonWithStoreSync } from "@/lib/store-response"

export const runtime = "nodejs"

/** Public: payment methods when enabled. Admin: full settings. */
export async function GET(req: NextRequest) {
  const settings = await getPaymentSettings()
  const isAdmin = await requireAdminAuth(req)
  if (isAdmin) {
    return NextResponse.json(settings)
  }
  if (!settings.enabled) {
    return NextResponse.json({ enabled: false, headline: "", instructions: "", methods: [], footerNote: "" })
  }
  return NextResponse.json(publicPaymentSettings(settings))
}

/** Admin: save bank / JazzCash / payout details. */
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
    const { settings, writeResult } = await savePaymentSettings(body)
    return jsonWithStoreSync(settings, writeResult)
  } catch (e) {
    const message = e instanceof Error ? e.message : "Save failed"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
