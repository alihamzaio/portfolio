import "server-only"

import { getStoreJson, setStoreJson, type StoreWriteResult } from "@/lib/store"
import { readJsonFile } from "@/lib/admin"
import {
  EMPTY_PAYMENT_SETTINGS,
  applyPaymentEnvSecrets,
  normalizePaymentSettings,
  paymentSettingsForStorage,
  type PaymentSettings,
} from "@/lib/payment-settings"

const FILE = "content/payment-settings.json"

export async function getPaymentSettings(): Promise<PaymentSettings> {
  let base: PaymentSettings = { ...EMPTY_PAYMENT_SETTINGS, methods: [] }
  const kv = await getStoreJson("paymentSettings")
  if (kv && typeof kv === "object") {
    base = normalizePaymentSettings(kv)
  } else {
    try {
      const file = await readJsonFile<unknown>(FILE)
      base = normalizePaymentSettings(file)
    } catch {
      base = { ...EMPTY_PAYMENT_SETTINGS, methods: [] }
    }
  }
  return applyPaymentEnvSecrets(base)
}

export async function savePaymentSettings(raw: unknown): Promise<{
  settings: PaymentSettings
  writeResult: StoreWriteResult
}> {
  const incoming = normalizePaymentSettings(raw)
  const toStore = paymentSettingsForStorage(incoming)
  const writeResult = await setStoreJson("paymentSettings", toStore)
  return { settings: applyPaymentEnvSecrets(toStore), writeResult }
}
