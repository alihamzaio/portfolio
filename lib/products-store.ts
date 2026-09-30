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
    // KV wins for existing slugs (admin edits). File adds any new slugs not yet in KV
    // so a deploy can ship products without requiring an admin re-save first.
    const bySlug = new Map(kvConfig.products.map((p) => [p.slug, p]))
    for (const p of fileConfig.products) {
      if (!bySlug.has(p.slug)) bySlug.set(p.slug, p)
    }
    return { products: [...bySlug.values()] }
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
