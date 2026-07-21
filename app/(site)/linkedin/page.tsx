import Link from "next/link"
import { buildPageMetadata } from "@/lib/seo"
import { siteConfig } from "@/lib/site"
import { LinkedInContinueButton } from "@/components/pages/linkedin-continue-button"

export const metadata = buildPageMetadata({
  title: "LinkedIn",
  description: `Connect with ${siteConfig.name}, Full Stack Developer in Lahore, on LinkedIn for roles, contracts, and professional updates.`,
  path: "/linkedin",
})

export default function LinkedInPage() {
  return (
    <main className="section-shell py-16 sm:py-24 max-w-3xl">
      <h1 className="text-3xl font-bold text-white mb-4">Connect on LinkedIn</h1>
      <p className="text-neutral-400 leading-relaxed mb-4">
        {siteConfig.name} is a Full Stack Developer based in {siteConfig.location}. Use LinkedIn to review
        experience, recommendations, and availability for full-time or contract work across MERN, Next.js,
        AWS serverless, REST APIs, and blockchain projects.
      </p>
      <p className="text-neutral-400 leading-relaxed mb-8">
        This page is hosted on the portfolio so crawlers receive a normal 200 response. The profile itself
        lives on LinkedIn and opens when you continue below.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 items-start">
        <LinkedInContinueButton />
        <Link
          href="/contact"
          className="inline-flex items-center justify-center rounded-lg border border-white/15 text-white px-5 py-3 hover:border-cyan-400/40 transition-colors"
        >
          Contact on this site
        </Link>
      </div>
    </main>
  )
}
