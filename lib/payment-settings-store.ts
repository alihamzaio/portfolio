import "server-only"

import { getStoreJson, setStoreJson, type StoreWriteResult } from "@/lib/store"
import { readJsonFile } from "@/lib/admin"
import {
  EMPTY_PAYMENT_SETTINGS,
  normalizePaymentSettings,
  type PaymentSettings,
} from "@/lib/payment-settings"

const FILE = "content/payment-settings.json"

export async function getPaymentSettings(): Promise<PaymentSettings> {
  const kv = await getStoreJson("paymentSettings")
  if (kv && typeof kv === "object") {
    return normalizePaymentSettings(kv)
  }
  try {
    const file = await readJsonFile<unknown>(FILE)
    return normalizePaymentSettings(file)
  } catch {
    return { ...EMPTY_PAYMENT_SETTINGS, methods: [] }
  }
}

export async function savePaymentSettings(raw: unknown): Promise<{
  settings: PaymentSettings
  writeResult: StoreWriteResult
}> {
  const settings = normalizePaymentSettings(raw)
  const writeResult = await setStoreJson("paymentSettings", settings)
  return { settings, writeResult }
}
