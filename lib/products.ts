/**
 * Digital products sold via Gumroad (or similar).
 * Set buyUrl to your live Gumroad product URL when ready.
 * Leave buyUrl empty to show "Coming soon" + contact fallback.
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
  /** Path inside repo for the deliverable (for you when zipping for Gumroad) */
  starterPath: string
}

export const DIGITAL_PRODUCTS: DigitalProduct[] = [
  {
    slug: "nextjs-ship-starter",
    name: "Next.js Ship Starter",
    tagline: "A clean App Router kit to ship a client site without starting from zero.",
    description:
      "TypeScript Next.js starter with SEO helpers, a contact section, env checklist, and Vercel-ready defaults. Built from the same patterns I use on freelance launches.",
    priceLabel: "$29",
    buyUrl: "",
    includes: [
      "Next.js App Router + TypeScript",
      "SEO metadata helper and sitemap stub",
      "Home + contact layout ready to brand",
      ".env.example and Vercel deploy notes",
      "Production launch checklist (markdown)",
    ],
    idealFor: [
      "Freelancers kicking off a client MVP",
      "Developers who want a sane Next.js baseline",
      "Anyone tired of deleting demo boilerplate",
    ],
    starterPath: "digital-products/nextjs-ship-starter",
  },
]

export function getProduct(slug: string): DigitalProduct | undefined {
  return DIGITAL_PRODUCTS.find((p) => p.slug === slug)
}

export function productIsOnSale(product: DigitalProduct): boolean {
  return Boolean(product.buyUrl?.trim())
}
