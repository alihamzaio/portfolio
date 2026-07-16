import Link from "next/link"
import { buildPageMetadata } from "@/lib/seo"
import { siteConfig } from "@/lib/site"

export const metadata = buildPageMetadata({
  title: "Privacy Policy",
  description: `Privacy policy for ${siteConfig.name}'s portfolio website, covering analytics, contact data, and cookies.`,
  path: "/privacy",
})

export default function PrivacyPage() {
  return (
    <main className="section-shell py-16 sm:py-24 max-w-3xl">
      <h1 className="text-3xl font-bold text-white mb-6">Privacy Policy</h1>
      <div className="space-y-5 text-neutral-400 leading-relaxed">
        <p>
          This portfolio site is operated by {siteConfig.name}. It is used to present professional work, experience, and
          contact options for hiring managers and clients.
        </p>
        <p>
          When you use the contact form or email links, you may share your name, email address, and message content. That
          information is used only to respond to your inquiry.
        </p>
        <p>
          The site may use privacy-friendly analytics (Vercel Analytics and, when enabled, Google Analytics) to understand
          traffic patterns. Analytics data is aggregated and does not sell personal information to third parties.
        </p>
        <p>
          Server logs and security headers may record IP addresses and browser metadata for abuse prevention and uptime
          monitoring.
        </p>
        <p>
          For privacy questions, contact me through the{" "}
          <Link href="/contact" className="text-cyan-400 hover:text-sky-300 underline">
            contact page
          </Link>
          .
        </p>
        <p className="text-sm text-neutral-500">Last updated: July 2026</p>
      </div>
    </main>
  )
}
