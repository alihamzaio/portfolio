import Link from "next/link"
import { notFound } from "next/navigation"
import { PremiumPage, PremiumReveal } from "@/components/premium"
import { AmberGlassCta } from "@/components/ui/amber-glass-cta"
import { HireCtaBlock } from "@/components/home/hire-cta-block"
import { productAllowsDirect, productAllowsGumroad, productIsOnSale, publicProducts } from "@/lib/products"
import { getProductsConfig } from "@/lib/products-store"
import { KickoffForgeDemo } from "@/components/products/kickoff-forge-demo"
import { DirectBuyPanel } from "@/components/products/direct-buy-panel"
import { buildPageMetadata } from "@/lib/seo"
import { PageBreadcrumbJsonLd } from "@/components/seo/page-breadcrumb-json-ld"

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const config = await getProductsConfig()
  return publicProducts(config.products).map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const config = await getProductsConfig()
  const product = publicProducts(config.products).find((p) => p.slug === slug)
  if (!product) return {}
  return buildPageMetadata({
    title: product.name,
    description: product.description,
    path: `/products/${product.slug}`,
  })
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params
  const config = await getProductsConfig()
  const product = publicProducts(config.products).find((p) => p.slug === slug)
  if (!product) notFound()
  const onSale = productIsOnSale(product)
  const showGumroad = productAllowsGumroad(product)
  const showDirect = productAllowsDirect(product)

  return (
    <>
      <PageBreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Products", path: "/products" },
          { name: product.name, path: `/products/${product.slug}` },
        ]}
      />
      <PremiumPage>
        <PremiumReveal>
          <article className="mx-auto max-w-3xl">
            <p className="meta-label mb-3">Digital product</p>
            <div className="flex flex-wrap items-baseline justify-between gap-3 mb-4">
              <h1 className="text-3xl md:text-[2.2rem] font-semibold text-white tracking-tight leading-tight">
                {product.name}
              </h1>
              <span className="font-mono text-lg text-[var(--accent-primary)]">{product.priceLabel}</span>
            </div>
            <p className="text-neutral-400 text-lg leading-relaxed max-w-2xl">{product.tagline}</p>
            <p className="mt-4 text-neutral-500 text-sm leading-relaxed max-w-2xl">{product.description}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              {showGumroad ? (
                <a
                  href={product.buyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary btn-responsive inline-flex"
                >
                  Buy on Gumroad
                </a>
              ) : null}
              {showDirect ? (
                <a href="#pay-direct" className="btn-secondary btn-responsive inline-flex">
                  Pay directly in 3 steps
                </a>
              ) : null}
              {!onSale ? (
                <AmberGlassCta href="/contact">Ask about early access</AmberGlassCta>
              ) : null}
              <Link href="/contact" className="btn-secondary btn-responsive inline-flex">
                Hire me instead
              </Link>
            </div>

            {!onSale && (
              <p className="mt-4 text-xs text-neutral-600">
                Checkout is not linked yet. Use contact if you want the zip early, or wait for a public buy
                link.
              </p>
            )}

            <div className="mt-12 grid gap-10 sm:grid-cols-2">
              <div>
                <h2 className="text-sm uppercase tracking-wider text-neutral-500 mb-3">Includes</h2>
                <ul className="space-y-2 text-sm text-neutral-300">
                  {product.includes.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="text-[var(--accent-primary)]" aria-hidden>
                        ✓
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="text-sm uppercase tracking-wider text-neutral-500 mb-3">Ideal for</h2>
                <ul className="space-y-2 text-sm text-neutral-300">
                  {product.idealFor.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="text-neutral-600" aria-hidden>
                        ·
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {product.slug === "kickoff-forge" && <KickoffForgeDemo />}

            {showDirect ? (
              <DirectBuyPanel
                productSlug={product.slug}
                productName={product.name}
                priceLabel={product.priceLabel}
              />
            ) : null}

            <div className="mt-14">
              <HireCtaBlock
                variant="compact"
                title="Need this customized for a client?"
                description="Buy the pack for a repeatable kickoff, or hire me to run discovery and ship the build."
              />
            </div>

            <p className="mt-8">
              <Link href="/products" className="text-sm text-neutral-400 hover:text-white transition-colors">
                ← All products
              </Link>
            </p>
          </article>
        </PremiumReveal>
      </PremiumPage>
    </>
  )
}
