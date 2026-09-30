import Image from "next/image"
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
  const hasCaseStudy = Boolean(product.problem || product.solution || product.howBuilt)
  const shots = product.screenshots.filter(Boolean)

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
            <p className="meta-label mb-3">
              {hasCaseStudy && !onSale ? "Case study" : "Digital product"}
            </p>
            <div className="flex flex-wrap items-baseline justify-between gap-3 mb-4">
              <h1 className="text-3xl md:text-[2.2rem] font-semibold text-white tracking-tight leading-tight">
                {product.name}
              </h1>
              <span className="font-mono text-lg text-[var(--accent-primary)]">{product.priceLabel}</span>
            </div>
            <p className="text-neutral-400 text-lg leading-relaxed max-w-2xl">{product.tagline}</p>
            <p className="mt-4 text-neutral-500 text-sm leading-relaxed max-w-2xl">{product.description}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              {product.demoUrl ? (
                <a
                  href={product.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary btn-responsive inline-flex"
                >
                  Open live demo
                </a>
              ) : null}
              {showGumroad ? (
                <a
                  href={product.buyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={
                    product.demoUrl
                      ? "btn-secondary btn-responsive inline-flex"
                      : "btn-primary btn-responsive inline-flex"
                  }
                >
                  Buy on Gumroad
                </a>
              ) : null}
              {showDirect ? (
                <a href="#pay-direct" className="btn-secondary btn-responsive inline-flex">
                  Pay directly in 3 steps
                </a>
              ) : null}
              {product.slug === "syncforge-calendar" ? (
                <AmberGlassCta href="#buy-private-install">Buy a private install</AmberGlassCta>
              ) : !onSale && !product.demoUrl ? (
                <AmberGlassCta href="/contact">
                  {hasCaseStudy ? "Ask about a similar build" : "Ask about early access"}
                </AmberGlassCta>
              ) : null}
              <Link href="/contact" className="btn-secondary btn-responsive inline-flex">
                Hire me instead
              </Link>
            </div>

            {!onSale && !product.demoUrl && !hasCaseStudy ? (
              <p className="mt-4 text-xs text-neutral-600">
                Checkout is not linked yet. Use contact if you want the zip early, or wait for a public buy
                link.
              </p>
            ) : null}

            {hasCaseStudy ? (
              <div className="mt-12 space-y-8">
                {product.problem ? (
                  <section>
                    <h2 className="text-sm uppercase tracking-wider text-neutral-500 mb-3">The problem</h2>
                    <p className="text-sm text-neutral-300 leading-relaxed">{product.problem}</p>
                  </section>
                ) : null}
                {product.solution ? (
                  <section>
                    <h2 className="text-sm uppercase tracking-wider text-neutral-500 mb-3">The solution</h2>
                    <p className="text-sm text-neutral-300 leading-relaxed">{product.solution}</p>
                  </section>
                ) : null}
                {product.howBuilt ? (
                  <section>
                    <h2 className="text-sm uppercase tracking-wider text-neutral-500 mb-3">How I built it</h2>
                    <p className="text-sm text-neutral-300 leading-relaxed">{product.howBuilt}</p>
                  </section>
                ) : null}
              </div>
            ) : null}

            {shots.length > 0 ? (
              <section className="mt-12">
                <h2 className="text-sm uppercase tracking-wider text-neutral-500 mb-3">Dashboard screenshots</h2>
                <p className="text-xs text-neutral-600 mb-4">
                  Sanitized mock UI for portfolio. Production stays private (real client calendars are not linked).
                </p>
                <div className="space-y-4">
                  {shots.map((src) => (
                    <div
                      key={src}
                      className="relative overflow-hidden rounded-xl border border-white/10 aspect-[16/9] bg-black/40"
                    >
                      <Image
                        src={src}
                        alt={`${product.name} dashboard screenshot`}
                        fill
                        className="object-cover object-top"
                        sizes="(max-width: 768px) 100vw, 768px"
                      />
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            <div className="mt-12 grid gap-10 sm:grid-cols-2">
              <div>
                <h2 className="text-sm uppercase tracking-wider text-neutral-500 mb-3">Features</h2>
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

            {showDirect ? (
              <DirectBuyPanel
                productSlug={product.slug}
                productName={product.name}
                priceLabel={product.priceLabel}
              />
            ) : null}

            {product.slug === "kickoff-forge" && <KickoffForgeDemo />}

            {product.slug === "syncforge-calendar" ? (
              <section
                id="buy-private-install"
                className="mt-14 rounded-2xl border border-white/[0.08] bg-white/[0.02] px-5 py-6 sm:px-8 sm:py-8"
              >
                <p className="meta-label mb-3">Private install</p>
                <h2 className="text-xl font-semibold text-white tracking-tight">
                  Buy a private SyncForge install
                </h2>
                <p className="mt-3 text-sm text-neutral-400 leading-relaxed max-w-2xl">
                  Not a public SaaS. I deploy SyncForge on your infra, connect your company calendars,
                  and leave you with admin plus a license record from first install. Production stays
                  yours. No shared Google links, no live client calendars on this portfolio.
                </p>
                <ul className="mt-5 space-y-2 text-sm text-neutral-300">
                  <li className="flex gap-2">
                    <span className="text-[var(--accent-primary)]" aria-hidden>
                      ✓
                    </span>
                    SyncForge private install: up to 5 calendar sources, install wizard, 14-day support
                    ($1.5k-$3.5k)
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[var(--accent-primary)]" aria-hidden>
                      ✓
                    </span>
                    Full setup: Google OAuth + ICS wiring, company labels, walkthrough ($4k-$8k)
                  </li>
                </ul>
                <div className="mt-6 flex flex-wrap gap-3">
                  <AmberGlassCta href="/contact?topic=syncforge-install">
                    Request a private install
                  </AmberGlassCta>
                  <Link href="/contact" className="btn-secondary btn-responsive inline-flex">
                    Book a 15-min walkthrough
                  </Link>
                </div>
              </section>
            ) : null}

            <div className="mt-14">
              <HireCtaBlock
                variant="compact"
                title={
                  product.slug === "syncforge-calendar"
                    ? "Need a custom multi-calendar hub beyond the package?"
                    : "Need this customized for a client?"
                }
                description={
                  product.slug === "syncforge-calendar"
                    ? "Hire me to extend SyncForge for your team: more sources, SSO, or a branded public schedule. Client production stays private."
                    : "Buy the pack for a repeatable kickoff, or hire me to run discovery and ship the build."
                }
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
