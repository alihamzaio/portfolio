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
  let fileConfig: ProductsConfig = { ...EMPTY_PRODUCTS, products: [] }
  try {
    const file = await readJsonFile<unknown>(FILE)
    fileConfig = normalizeProductsConfig(file)
  } catch {
    // no local file
  }

  const kv = await getStoreJson("products")
  if (kv && typeof kv === "object") {
    const kvConfig = normalizeProductsConfig(kv)
    const kvBySlug = new Map(kvConfig.products.map((p) => [p.slug, p]))
    // File defines which products exist (so removals/renames ship on deploy).
    // KV overrides matching slugs for admin edits without resurrecting deleted products.
    return {
      products: fileConfig.products.map((p) => kvBySlug.get(p.slug) ?? p),
    }
  }

  return fileConfig
}

export async function saveProductsConfig(raw: unknown): Promise<{
  config: ProductsConfig
  writeResult: StoreWriteResult
}> {
  const config = normalizeProductsConfig(raw)
  const writeResult = await setStoreJson("products", config)
  return { config, writeResult }
}
