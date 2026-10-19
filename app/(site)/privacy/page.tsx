import Link from "next/link"
import { buildPageMetadata } from "@/lib/seo"
import { siteConfig } from "@/lib/site"

export const metadata = buildPageMetadata({
  title: "Privacy Policy",
  description: `Privacy policy for ${siteConfig.name}'s site: contact data, analytics, cookies, and advertising partners.`,
  path: "/privacy",
})

export default function PrivacyPage() {
  return (
    <div className="section-shell py-16 sm:py-24 max-w-3xl">
      <h1 className="text-3xl font-bold text-white mb-6">Privacy Policy</h1>
      <div className="space-y-5 text-neutral-400 leading-relaxed">
        <p>
          This website ({siteConfig.url.replace(/^https?:\/\//, "")}) is operated by {siteConfig.name} (
          {siteConfig.email}). It presents professional work, digital products, articles, and contact options for
          clients and hiring managers.
        </p>

        <h2 className="text-xl font-semibold text-white pt-2">Information you share</h2>
        <p>
          When you use the contact form, checkout, or email links, you may share your name, email address, message
          content, and payment-related details handled by third-party processors (for example Gumroad or your bank).
          Contact messages are used only to reply to your inquiry. Purchase data is processed by the checkout provider
          under their own privacy policy.
        </p>

        <h2 className="text-xl font-semibold text-white pt-2">Analytics</h2>
        <p>
          The site may use privacy-friendly analytics (Vercel Analytics and, when enabled, Google Analytics) to
          understand traffic patterns. Analytics data is aggregated. It is not sold as a personal-data product.
        </p>

        <h2 className="text-xl font-semibold text-white pt-2">Advertising (Google AdSense)</h2>
        <p>
          This site may show ads served by Google AdSense (and related Google advertising partners) once the site is
          approved. Google and its partners may use cookies or similar technologies to serve ads based on your prior
          visits to this site or other sites across the Internet. Third-party vendors, including Google, use cookies to
          serve ads based on a user&apos;s prior visits.
        </p>
        <p>
          You can opt out of personalized advertising by visiting{" "}
          <a
            href="https://www.google.com/settings/ads"
            className="text-[var(--accent-primary)] underline underline-offset-4"
            target="_blank"
            rel="noreferrer"
          >
            Google Ads Settings
          </a>
          . You can also learn more about how Google uses data when you use partner sites at{" "}
          <a
            href="https://policies.google.com/technologies/partner-sites"
            className="text-[var(--accent-primary)] underline underline-offset-4"
            target="_blank"
            rel="noreferrer"
          >
            policies.google.com/technologies/partner-sites
          </a>
          .
        </p>
        <p>
          AdSense may set cookies such as the DoubleClick cookie. Ads may appear on blog and other public pages. They
          are labeled as ads. We do not encourage anyone to click ads, and we do not click our own ads.
        </p>

        <h2 className="text-xl font-semibold text-white pt-2">Cookies</h2>
        <p>
          Cookies and similar storage may be used for analytics, security, session preferences, and advertising. You can
          control cookies in your browser settings. Blocking some cookies may affect site features.
        </p>

        <h2 className="text-xl font-semibold text-white pt-2">Logs and security</h2>
        <p>
          Server logs and security headers may record IP addresses and browser metadata for abuse prevention and uptime
          monitoring.
        </p>

        <h2 className="text-xl font-semibold text-white pt-2">Contact</h2>
        <p>
          For privacy questions, use the{" "}
          <Link
            href="/contact"
            className="text-[var(--accent-primary)] hover:text-[var(--accent-primary)] underline underline-offset-4"
          >
            contact page
          </Link>{" "}
          or email {siteConfig.email}.
        </p>
        <p className="text-sm text-neutral-500">Last updated: October 2026</p>
      </div>
    </div>
  )
}
