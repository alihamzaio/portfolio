/**
 * Your bank / JazzCash / payout details shown to buyers on direct checkout.
 * Managed in Admin → Payments.
 */

export type PaymentMethodDetail = {
  id: string
  label: string
  details: string
}

export type PaymentSettings = {
  /** When false, direct checkout is hidden even if a product allows it */
  enabled: boolean
  headline: string
  instructions: string
  methods: PaymentMethodDetail[]
  /** Extra note under methods (currency, timing, etc.) */
  footerNote: string
  /** Where order alerts go; empty = admin OTP email */
  notifyEmail: string
}

export const EMPTY_PAYMENT_SETTINGS: PaymentSettings = {
  enabled: false,
  headline: "Pay me directly",
  instructions:
    "Transfer the product price using one of the methods below. Then submit your name, email, and transaction ID on the product page so I can confirm and send your download.",
  methods: [],
  footerNote: "Orders are confirmed manually. You get the download by email after payment is verified.",
  notifyEmail: "",
}

function slugId(label: string, index: number): string {
  const base = label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40)
  return base || `method-${index + 1}`
}

export function normalizePaymentSettings(raw: unknown): PaymentSettings {
  const data = (raw && typeof raw === "object" ? raw : {}) as Partial<PaymentSettings>
  const methodsRaw = Array.isArray(data.methods) ? data.methods : []
  const methods: PaymentMethodDetail[] = []
  const seen = new Set<string>()
  methodsRaw.forEach((item, index) => {
    const row = (item && typeof item === "object" ? item : {}) as Partial<PaymentMethodDetail>
    const label = String(row.label || "").trim()
    const details = String(row.details || "").trim()
    if (!label || !details) return
    let id = String(row.id || slugId(label, index)).trim().toLowerCase()
    if (!id || seen.has(id)) id = `${slugId(label, index)}-${index}`
    seen.add(id)
    methods.push({ id, label, details })
  })

  return {
    enabled: data.enabled === true,
    headline: String(data.headline || EMPTY_PAYMENT_SETTINGS.headline).trim() || EMPTY_PAYMENT_SETTINGS.headline,
    instructions:
      String(data.instructions || EMPTY_PAYMENT_SETTINGS.instructions).trim() ||
      EMPTY_PAYMENT_SETTINGS.instructions,
    methods,
    footerNote: String(data.footerNote || "").trim(),
    notifyEmail: String(data.notifyEmail || "").trim(),
  }
}

/** Safe payload for the public product page (no private notify email). */
export function publicPaymentSettings(settings: PaymentSettings): Omit<PaymentSettings, "notifyEmail"> & {
  notifyEmail?: never
} {
  const { notifyEmail: _n, ...rest } = settings
  return rest
}
