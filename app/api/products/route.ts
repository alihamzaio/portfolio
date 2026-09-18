import { NextRequest, NextResponse } from "next/server"
import { requireAdminAuth } from "@/lib/admin"
import { getProductsConfig, saveProductsConfig } from "@/lib/products-store"
import { publicProducts } from "@/lib/products"
import { jsonWithStoreSync } from "@/lib/store-response"

export const runtime = "nodejs"

/** Public: enabled products only. Admin: full config. */
export async function GET(req: NextRequest) {
  const config = await getProductsConfig()
  const isAdmin = await requireAdminAuth(req)
  if (isAdmin) {
    return NextResponse.json(config)
  }
  return NextResponse.json({ products: publicProducts(config.products) })
}

/** Admin: replace full products config. */
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
    const { config, writeResult } = await saveProductsConfig(body)
    return jsonWithStoreSync(config, writeResult)
  } catch (e) {
    const message = e instanceof Error ? e.message : "Save failed"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
