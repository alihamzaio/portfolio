import { NextRequest, NextResponse } from "next/server"
import { requireAdminAuth } from "@/lib/admin"
import { OTP_ADMIN_EMAIL } from "@/lib/official-email"
import { createOrderId } from "@/lib/orders"
import { getOrdersConfig, upsertOrder } from "@/lib/orders-store"
import { getPaymentSettings } from "@/lib/payment-settings-store"
import { getProductsConfig } from "@/lib/products-store"
import { productAllowsDirect, publicProducts } from "@/lib/products"
import { sendOrderProofToAdmin, sendOrderReceivedToBuyer } from "@/lib/email"
import { siteConfig } from "@/lib/site"

export const runtime = "nodejs"

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

/** Admin: list orders (newest first). */
export async function GET(req: NextRequest) {
  if (!(await requireAdminAuth(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const config = await getOrdersConfig()
  return NextResponse.json(config)
}

/**
 * Public: submit direct-purchase proof.
 * Body: productSlug, buyerName, buyerEmail, buyerPhone?, paymentMethodLabel?, transactionRef, proofNote?
 */
export async function POST(req: NextRequest) {
  let body: Record<string, unknown>
  try {
    body = (await req.json()) as Record<string, unknown>
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const settings = await getPaymentSettings()
  if (!settings.enabled) {
    return NextResponse.json({ error: "Direct payments are not enabled yet." }, { status: 403 })
  }

  const productSlug = String(body.productSlug || "").trim()
  const buyerName = String(body.buyerName || "").trim()
  const buyerEmail = String(body.buyerEmail || "")
    .trim()
    .toLowerCase()
  const buyerPhone = String(body.buyerPhone || "").trim()
  const paymentMethodLabel = String(body.paymentMethodLabel || "").trim()
  const transactionRef = String(body.transactionRef || "").trim()
  const proofNote = String(body.proofNote || "").trim().slice(0, 1000)

  if (!productSlug || !buyerName || !buyerEmail || !transactionRef) {
    return NextResponse.json(
      { error: "Name, email, product, and transaction ID are required." },
      { status: 400 }
    )
  }
  if (!isEmail(buyerEmail)) {
    return NextResponse.json({ error: "Enter a valid email." }, { status: 400 })
  }
  if (buyerName.length > 120 || transactionRef.length > 200) {
    return NextResponse.json({ error: "Input too long." }, { status: 400 })
  }

  const products = await getProductsConfig()
  const product = publicProducts(products.products).find((p) => p.slug === productSlug)
  if (!product || !productAllowsDirect(product)) {
    return NextResponse.json({ error: "This product is not available for direct purchase." }, { status: 404 })
  }

  const now = new Date().toISOString()
  const order = {
    id: createOrderId(),
    productSlug: product.slug,
    productName: product.name,
    priceLabel: product.priceLabel,
    buyerName,
    buyerEmail,
    buyerPhone: buyerPhone.slice(0, 40),
    paymentMethodLabel: paymentMethodLabel.slice(0, 120),
    transactionRef,
    proofNote,
    status: "proof_submitted" as const,
    createdAt: now,
    updatedAt: now,
    downloadSentAt: null,
    adminNote: "",
  }

  await upsertOrder(order)

  const methodsText = settings.methods
    .map((m) => `${m.label}\n${m.details}`)
    .join("\n\n")
  const notifyTo = settings.notifyEmail.trim() || OTP_ADMIN_EMAIL
  const adminUrl = `${siteConfig.url}/admin`

  await Promise.allSettled([
    sendOrderProofToAdmin({
      to: notifyTo,
      orderId: order.id,
      productName: order.productName,
      priceLabel: order.priceLabel,
      buyerName: order.buyerName,
      buyerEmail: order.buyerEmail,
      buyerPhone: order.buyerPhone,
      paymentMethodLabel: order.paymentMethodLabel,
      transactionRef: order.transactionRef,
      proofNote: order.proofNote,
      adminUrl,
    }),
    sendOrderReceivedToBuyer({
      to: order.buyerEmail,
      buyerName: order.buyerName,
      productName: order.productName,
      priceLabel: order.priceLabel,
      paymentHeadline: settings.headline,
      paymentInstructions: settings.instructions,
      methodsText,
      footerNote: settings.footerNote,
    }),
  ])

  return NextResponse.json({
    ok: true,
    orderId: order.id,
    message: "Payment proof submitted. You will get the download by email after verification.",
  })
}
