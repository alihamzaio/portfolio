/**
 * Your bank / JazzCash / payout details shown to buyers on direct checkout.
 * Sensitive method lines and notify email come from Vercel env (not git).
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
  /** True when methods/notify are supplied by server env */
  secretsFromEnv?: boolean
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

function normalizeMethods(raw: unknown): PaymentMethodDetail[] {
  const methodsRaw = Array.isArray(raw) ? raw : []
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
  return methods
}

/** Parse PAYMENT_METHODS_JSON or PAYMENT_METHOD_N_LABEL / _DETAILS from env. */
export function paymentMethodsFromEnv(): PaymentMethodDetail[] {
  const json = process.env.PAYMENT_METHODS_JSON?.trim()
  if (json) {
    try {
      return normalizeMethods(JSON.parse(json))
    } catch {
      // fall through to numbered vars
    }
  }

  const methods: PaymentMethodDetail[] = []
  for (let i = 1; i <= 8; i++) {
    const label = process.env[`PAYMENT_METHOD_${i}_LABEL`]?.trim()
    const details = process.env[`PAYMENT_METHOD_${i}_DETAILS`]?.trim()
    if (!label || !details) continue
    methods.push({
      id: process.env[`PAYMENT_METHOD_${i}_ID`]?.trim() || slugId(label, i - 1),
      label,
      details: details.replace(/\\n/g, "\n"),
    })
  }
  return methods
}

export function paymentNotifyEmailFromEnv(): string {
  return (
    process.env.PAYMENT_NOTIFY_EMAIL?.trim() ||
    process.env.ORDER_NOTIFY_EMAIL?.trim() ||
    ""
  )
}

export function paymentEnabledFromEnv(): boolean | null {
  const raw = process.env.PAYMENT_ENABLED?.trim().toLowerCase()
  if (raw === "true" || raw === "1" || raw === "yes") return true
  if (raw === "false" || raw === "0" || raw === "no") return false
  return null
}

export function normalizePaymentSettings(raw: unknown): PaymentSettings {
  const data = (raw && typeof raw === "object" ? raw : {}) as Partial<PaymentSettings>
  return {
    enabled: data.enabled === true,
    headline: String(data.headline || EMPTY_PAYMENT_SETTINGS.headline).trim() || EMPTY_PAYMENT_SETTINGS.headline,
    instructions:
      String(data.instructions || EMPTY_PAYMENT_SETTINGS.instructions).trim() ||
      EMPTY_PAYMENT_SETTINGS.instructions,
    methods: normalizeMethods(data.methods),
    footerNote: String(data.footerNote || "").trim(),
    notifyEmail: String(data.notifyEmail || "").trim(),
  }
}

/**
 * Overlay IBAN / JazzCash / notify email from Vercel env so they never need to live in git.
 */
export function applyPaymentEnvSecrets(settings: PaymentSettings): PaymentSettings {
  const envMethods = paymentMethodsFromEnv()
  const envNotify = paymentNotifyEmailFromEnv()
  const envEnabled = paymentEnabledFromEnv()
  const secretsFromEnv = envMethods.length > 0 || Boolean(envNotify)

  return {
    ...settings,
    enabled: envEnabled === null ? settings.enabled : envEnabled,
    headline: process.env.PAYMENT_HEADLINE?.trim() || settings.headline,
    instructions: process.env.PAYMENT_INSTRUCTIONS?.trim() || settings.instructions,
    footerNote: process.env.PAYMENT_FOOTER_NOTE?.trim() || settings.footerNote,
    methods: envMethods.length > 0 ? envMethods : settings.methods,
    notifyEmail: envNotify || settings.notifyEmail,
    secretsFromEnv,
  }
}

/** Fields safe to persist in git / KV UI config (no bank lines). */
export function paymentSettingsForStorage(settings: PaymentSettings): PaymentSettings {
  const envMethods = paymentMethodsFromEnv()
  const envNotify = paymentNotifyEmailFromEnv()
  return {
    enabled: settings.enabled,
    headline: settings.headline,
    instructions: settings.instructions,
    footerNote: settings.footerNote,
    methods: envMethods.length > 0 ? [] : settings.methods,
    notifyEmail: envNotify ? "" : settings.notifyEmail,
  }
}

/** Safe payload for the public product page (no private notify email). */
export function publicPaymentSettings(settings: PaymentSettings): Omit<PaymentSettings, "notifyEmail" | "secretsFromEnv"> & {
  notifyEmail?: never
  secretsFromEnv?: never
} {
  const { notifyEmail: _n, secretsFromEnv: _s, ...rest } = settings
  return rest
}
