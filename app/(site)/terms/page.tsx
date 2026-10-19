import Link from "next/link"
import { buildPageMetadata } from "@/lib/seo"
import { siteConfig } from "@/lib/site"

export const metadata = buildPageMetadata({
  title: "Terms of Use",
  description: `Terms of use for ${siteConfig.name}'s portfolio, products, and content.`,
  path: "/terms",
})

export default function TermsPage() {
  return (
    <div className="section-shell py-16 sm:py-24 max-w-3xl">
      <h1 className="text-3xl font-bold text-white mb-6">Terms of Use</h1>
      <div className="space-y-5 text-neutral-400 leading-relaxed">
        <p>
          By using {siteConfig.url.replace(/^https?:\/\//, "")} (the &quot;Site&quot;), you agree to these terms. If you
          do not agree, do not use the Site.
        </p>

        <h2 className="text-xl font-semibold text-white pt-2">What this site is</h2>
        <p>
          The Site is a personal portfolio and product storefront operated by {siteConfig.name}. It shows selected
          projects, writing, and digital products for educational and commercial purposes.
        </p>

        <h2 className="text-xl font-semibold text-white pt-2">Content</h2>
        <p>
          Project case studies, blog posts, and product materials are original work unless otherwise credited. You may
          not copy, resell, or redistribute paid product files without a valid license purchase. Free checklists and
          public articles may be shared with attribution and a link back to the Site.
        </p>

        <h2 className="text-xl font-semibold text-white pt-2">Digital products</h2>
        <p>
          Purchases are fulfilled by the checkout provider listed on each product page (for example Gumroad or direct
          checkout). Refunds follow that provider&apos;s policy unless a product page states otherwise. Templates and
          packs are tools; results depend on how you use them. No earnings or hiring outcome is guaranteed.
        </p>

        <h2 className="text-xl font-semibold text-white pt-2">Acceptable use</h2>
        <p>
          Do not attempt to break the Site, scrape it aggressively, upload malware, abuse contact forms, or click
          advertising units fraudulently. We may block abusive traffic.
        </p>

        <h2 className="text-xl font-semibold text-white pt-2">Advertising</h2>
        <p>
          The Site may display third-party ads (including Google AdSense). Ads are provided by third parties. We are not
          responsible for advertiser offers. See the{" "}
          <Link href="/privacy" className="text-[var(--accent-primary)] underline underline-offset-4">
            Privacy Policy
          </Link>{" "}
          for cookie and ad-partner details.
        </p>

        <h2 className="text-xl font-semibold text-white pt-2">Disclaimer</h2>
        <p>
          The Site is provided &quot;as is.&quot; Portfolio screenshots may be sanitized. Advice in articles is
          educational, not legal, tax, or financial advice. To the fullest extent allowed by law, {siteConfig.name} is
          not liable for indirect or consequential damages arising from use of the Site or products.
        </p>

        <h2 className="text-xl font-semibold text-white pt-2">Contact</h2>
        <p>
          Questions:{" "}
          <Link href="/contact" className="text-[var(--accent-primary)] underline underline-offset-4">
            contact page
          </Link>{" "}
          or {siteConfig.email}.
        </p>
        <p className="text-sm text-neutral-500">Last updated: October 2026</p>
      </div>
    </div>
  )
}
