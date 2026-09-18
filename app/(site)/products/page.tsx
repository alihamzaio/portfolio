import Link from "next/link"
import { PremiumPage, PremiumReveal } from "@/components/premium"
import { SectionHeading } from "@/components/ui/section-heading"
import { PremiumCard } from "@/components/ui/premium-card"
import { productIsOnSale, publicProducts } from "@/lib/products"
import { getProductsConfig } from "@/lib/products-store"
import { buildPageMetadata } from "@/lib/seo"

export const metadata = buildPageMetadata({
  title: "Products",
  description:
    "Digital products by Ali Hamza: Kickoff Forge freelance client kickoff templates to lock scope before code.",
  path: "/products",
})

export default async function ProductsPage() {
  const config = await getProductsConfig()
  const products = publicProducts(config.products)

  return (
    <PremiumPage>
      <SectionHeading
        headingLevel={1}
        label="Products"
        title="Freelance kits that sell your process"
        description="Kickoff Forge helps you lock scope before code. Hire me when you want the full build done with you."
        align="center"
        className="mx-auto"
      />

      <div className="mx-auto max-w-3xl space-y-6">
        {products.map((product) => {
          const onSale = productIsOnSale(product)
          return (
            <PremiumReveal key={product.slug}>
              <PremiumCard className="p-6 sm:p-8">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h2 className="text-xl font-semibold text-white tracking-tight">{product.name}</h2>
                  <span className="font-mono text-sm text-[var(--accent-primary)]">{product.priceLabel}</span>
                </div>
                <p className="mt-3 text-sm text-neutral-400 leading-relaxed">{product.tagline}</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href={`/products/${product.slug}`} className="btn-primary btn-responsive inline-flex">
                    View details
                  </Link>
                  {onSale ? (
                    <a
                      href={product.buyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary btn-responsive inline-flex"
                    >
                      Buy on Gumroad
                    </a>
                  ) : (
                    <span className="inline-flex items-center text-sm text-neutral-500">
                      Gumroad checkout coming soon
                    </span>
                  )}
                </div>
              </PremiumCard>
            </PremiumReveal>
          )
        })}
      </div>
    </PremiumPage>
  )
}
