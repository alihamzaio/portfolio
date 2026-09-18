/**
 * Digital products sold via Gumroad (or similar).
 * Managed in Admin → Products (content/products.json).
 */

export type DigitalProduct = {
  slug: string
  name: string
  tagline: string
  description: string
  priceLabel: string
  /** Gumroad (or other) checkout URL. Empty = not for sale yet. */
  buyUrl: string
  includes: string[]
  idealFor: string[]
  /** Path inside repo for the deliverable (zip this for Gumroad) */
  starterPath: string
  /** When false, hidden from public /products list */
  enabled: boolean
}

export type ProductsConfig = {
  products: DigitalProduct[]
}

export const EMPTY_PRODUCTS: ProductsConfig = {
  products: [],
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 64)
}

function asStringList(raw: unknown): string[] {
  if (!Array.isArray(raw)) return []
  return raw.map((x) => String(x).trim()).filter(Boolean)
}

export function normalizeProduct(
  raw: Partial<DigitalProduct> & { name?: string },
  fallbackSlug?: string
): DigitalProduct | null {
  const name = String(raw.name || "").trim()
  if (!name) return null
  const slug = String(raw.slug || fallbackSlug || slugify(name) || `product-${Date.now()}`)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-|-$/g, "")
  if (!slug) return null

  const buyUrl = String(raw.buyUrl || "").trim()
  if (buyUrl) {
    try {
      const u = new URL(buyUrl)
      if (u.protocol !== "http:" && u.protocol !== "https:") return null
    } catch {
      return null
    }
  }

  return {
    slug,
    name,
    tagline: String(raw.tagline || "").trim(),
    description: String(raw.description || "").trim(),
    priceLabel: String(raw.priceLabel || "").trim() || "$0",
    buyUrl,
    includes: asStringList(raw.includes),
    idealFor: asStringList(raw.idealFor),
    starterPath: String(raw.starterPath || "").trim(),
    enabled: raw.enabled !== false,
  }
}

export function normalizeProductsConfig(raw: unknown): ProductsConfig {
  const data = (raw && typeof raw === "object" ? raw : {}) as Partial<ProductsConfig>
  const products: DigitalProduct[] = []
  const seen = new Set<string>()
  for (const item of Array.isArray(data.products) ? data.products : []) {
    const p = normalizeProduct(item as DigitalProduct)
    if (!p || seen.has(p.slug)) continue
    seen.add(p.slug)
    products.push(p)
  }
  return { products }
}

export function publicProducts(products: DigitalProduct[]): DigitalProduct[] {
  return products.filter((p) => p.enabled)
}

export function productIsOnSale(product: DigitalProduct): boolean {
  return Boolean(product.buyUrl?.trim())
}

/** Sync helpers used by pages that still import from this module. Prefer products-store on server. */
export function getProductFromList(
  products: DigitalProduct[],
  slug: string
): DigitalProduct | undefined {
  return products.find((p) => p.slug === slug)
}

export function getProductSlugsFromList(products: DigitalProduct[]): string[] {
  return products.map((p) => p.slug)
}
