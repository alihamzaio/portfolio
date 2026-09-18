import { NextRequest, NextResponse } from "next/server"
import { requireAdminAuth } from "@/lib/admin"
import { getOrderById, upsertOrder } from "@/lib/orders-store"
import { getProductsConfig } from "@/lib/products-store"
import { sendOrderPaidDownload } from "@/lib/email"
import type { OrderStatus } from "@/lib/orders"
import { siteConfig } from "@/lib/site"

export const runtime = "nodejs"

type Params = { params: Promise<{ id: string }> }

function resolveDownloadUrl(productSlug: string, explicit?: string): string {
  const fromBodyOrProduct = String(explicit || "").trim()
  if (fromBodyOrProduct) return fromBodyOrProduct
  const base = siteConfig.url.replace(/\/$/, "")
  return `${base}/downloads/${productSlug}.zip`
}

/** Admin: update order status (paid / rejected) and optionally email download. */
export async function PATCH(req: NextRequest, { params }: Params) {
  if (!(await requireAdminAuth(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const existing = await getOrderById(id)
  if (!existing) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 })
  }

  let body: Record<string, unknown>
  try {
    body = (await req.json()) as Record<string, unknown>
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const statusRaw = String(body.status || "").trim()
  const status: OrderStatus | null =
    statusRaw === "paid" || statusRaw === "rejected" || statusRaw === "proof_submitted"
      ? statusRaw
      : null
  if (!status) {
    return NextResponse.json({ error: "status must be paid, rejected, or proof_submitted" }, { status: 400 })
  }

  const adminNote =
    body.adminNote !== undefined ? String(body.adminNote || "").trim().slice(0, 500) : existing.adminNote
  const sendDownload = body.sendDownload === true
  const now = new Date().toISOString()

  let downloadSentAt = existing.downloadSentAt
  let emailError: string | undefined

  if (status === "paid" && sendDownload) {
    const products = await getProductsConfig()
    const product = products.products.find((p) => p.slug === existing.productSlug)
    const downloadUrl = resolveDownloadUrl(
      existing.productSlug,
      String(body.downloadUrl || product?.downloadUrl || "")
    )
    const productUrl = `${siteConfig.url.replace(/\/$/, "")}/products/${existing.productSlug}`
    const gumroadUrl = product?.buyUrl?.trim() || ""

    const mailed = await sendOrderPaidDownload({
      to: existing.buyerEmail,
      buyerName: existing.buyerName,
      productName: existing.productName,
      downloadUrl,
      productUrl,
      gumroadUrl: gumroadUrl || undefined,
    })
    if (!mailed.ok) {
      emailError = mailed.error
    } else {
      downloadSentAt = now
    }
  }

  const updated = {
    ...existing,
    status,
    adminNote,
    updatedAt: now,
    downloadSentAt,
  }
  await upsertOrder(updated)

  return NextResponse.json({ order: updated, emailError: emailError || null })
}
