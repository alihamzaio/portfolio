/**
 * Digital products sold via Gumroad (or similar).
 * Set buyUrl to your live Gumroad product URL when ready.
 * Leave buyUrl empty to show Coming soon + contact fallback.
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
}

/** Featured / public products only. Older kits can stay in digital-products/ without listing. */
export const DIGITAL_PRODUCTS: DigitalProduct[] = [
  {
    slug: "kickoff-forge",
    name: "Kickoff Forge",
    tagline: "Turn a vague client chat into a clear build plan before you write code.",
    description:
      "A six-template freelance kickoff pack: discovery call notes, scope one-pager, estimate bands, tech decisions, week-one plan, and handoff checklist. Fill the blanks, send to the client, then ship.",
    priceLabel: "$19",
    buyUrl: "",
    includes: [
      "Discovery call worksheet",
      "Scope one-pager for written sign-off",
      "Estimate sheet with lean / standard / protected bands",
      "Tech decision sheet",
      "Week-one delivery plan + demo agenda",
      "Launch handoff checklist",
    ],
    idealFor: [
      "Freelancers who lose time to unclear scopes",
      "Developers starting client MVPs",
      "Anyone who wants a repeatable kickoff ritual",
    ],
    starterPath: "digital-products/kickoff-forge",
  },
]

export function getProduct(slug: string): DigitalProduct | undefined {
  return DIGITAL_PRODUCTS.find((p) => p.slug === slug)
}

export function getProductSlugs(): string[] {
  return DIGITAL_PRODUCTS.map((p) => p.slug)
}

export function productIsOnSale(product: DigitalProduct): boolean {
  return Boolean(product.buyUrl?.trim())
}

/** Primary product used in CTAs and Shorts links */
export const PRIMARY_PRODUCT = DIGITAL_PRODUCTS[0]
