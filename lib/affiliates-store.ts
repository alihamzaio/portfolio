import "server-only"

import { getStoreJson, setStoreJson, type StoreWriteResult } from "@/lib/store"
import { readJsonFile } from "@/lib/admin"
import {
  EMPTY_AFFILIATES,
  normalizeAffiliatesConfig,
  type AffiliatesConfig,
} from "@/lib/affiliates"

const FILE = "content/affiliates.json"

export async function getAffiliatesConfig(): Promise<AffiliatesConfig> {
  const kv = await getStoreJson("affiliates")
  if (kv && typeof kv === "object") {
    return normalizeAffiliatesConfig(kv)
  }
  try {
    const file = await readJsonFile<unknown>(FILE)
    return normalizeAffiliatesConfig(file)
  } catch {
    return { ...EMPTY_AFFILIATES, tools: [] }
  }
}

export async function saveAffiliatesConfig(raw: unknown): Promise<{
  config: AffiliatesConfig
  writeResult: StoreWriteResult
}> {
  const config = normalizeAffiliatesConfig(raw)
  const writeResult = await setStoreJson("affiliates", config)
  return { config, writeResult }
}
