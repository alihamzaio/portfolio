import "server-only"

import { getStoreJson, setStoreJson, type StoreWriteResult } from "@/lib/store"
import { readJsonFile } from "@/lib/admin"
import {
  EMPTY_PRODUCTS,
  normalizeProductsConfig,
  type ProductsConfig,
} from "@/lib/products"

const FILE = "content/products.json"

export async function getProductsConfig(): Promise<ProductsConfig> {
  const kv = await getStoreJson("products")
  if (kv && typeof kv === "object") {
    return normalizeProductsConfig(kv)
  }
  try {
    const file = await readJsonFile<unknown>(FILE)
    return normalizeProductsConfig(file)
  } catch {
    return { ...EMPTY_PRODUCTS, products: [] }
  }
}

export async function saveProductsConfig(raw: unknown): Promise<{
  config: ProductsConfig
  writeResult: StoreWriteResult
}> {
  const config = normalizeProductsConfig(raw)
  const writeResult = await setStoreJson("products", config)
  return { config, writeResult }
}
