import { NextRequest, NextResponse } from "next/server"
import { OTP_ADMIN_EMAIL } from "@/lib/official-email"
import { getPaymentSettings } from "@/lib/payment-settings-store"
import { getProductsConfig } from "@/lib/products-store"
import { productAllowsDirect, publicProducts } from "@/lib/products"
import { sendPaymentDetailsEmail } from "@/lib/email"
import { siteConfig } from "@/lib/site"

export const runtime = "nodejs"

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

/**
 * Public: email payment details to a buyer (share bank / JazzCash info).
 * Body: email, productSlug?, name?
 */
export async function POST(req: NextRequest) {
  let body: Record<string, unknown>
  try {
    body = (await req.json()) as Record<string, unknown>
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const settings = await getPaymentSettings()
  if (!settings.enabled || settings.methods.length === 0) {
    return NextResponse.json({ error: "Direct payment details are not published yet." }, { status: 403 })
  }

  const email = String(body.email || "")
    .trim()
    .toLowerCase()
  const name = String(body.name || "").trim().slice(0, 120)
  const productSlug = String(body.productSlug || "").trim()

  if (!email || !isEmail(email)) {
    return NextResponse.json({ error: "Enter a valid email." }, { status: 400 })
  }

  let productName = "a digital product"
  let priceLabel = ""
  let productUrl = `${siteConfig.url}/products`

  if (productSlug) {
    const products = await getProductsConfig()
    const product = publicProducts(products.products).find((p) => p.slug === productSlug)
    if (!product || !productAllowsDirect(product)) {
      return NextResponse.json({ error: "Product not available for direct purchase." }, { status: 404 })
    }
    productName = product.name
    priceLabel = product.priceLabel
    productUrl = `${siteConfig.url}/products/${product.slug}`
  }

  const methodsText = settings.methods.map((m) => `${m.label}\n${m.details}`).join("\n\n")
  const mailed = await sendPaymentDetailsEmail({
    to: email,
    buyerName: name,
    productName,
    priceLabel,
    paymentHeadline: settings.headline,
    paymentInstructions: settings.instructions,
    methodsText,
    footerNote: settings.footerNote,
    productUrl,
  })

  if (!mailed.ok) {
    return NextResponse.json({ error: mailed.error || "Could not send email" }, { status: 502 })
  }

  // Quiet admin ping so you know details were shared (best-effort)
  void sendPaymentDetailsEmail({
    to: settings.notifyEmail.trim() || OTP_ADMIN_EMAIL,
    buyerName: "Admin copy",
    productName: `Shared with ${email}: ${productName}`,
    priceLabel,
    paymentHeadline: settings.headline,
    paymentInstructions: `You shared payment details with ${email}.`,
    methodsText: "(copy of public methods was sent to the buyer)",
    footerNote: settings.footerNote,
    productUrl,
  }).catch(() => {})

  return NextResponse.json({ ok: true, message: "Payment details sent to your email." })
}
