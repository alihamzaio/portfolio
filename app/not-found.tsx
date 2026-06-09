import Link from "next/link"
import { buildPageMetadata } from "@/lib/seo"

export const metadata = buildPageMetadata({
  title: "Page not found",
  description: "This page is not available. Return to the portfolio homepage or contact page.",
  path: "/404",
  noIndex: true,
})

export default function NotFound() {
  return (
    <main className="min-h-[80vh] flex items-center justify-center section-shell px-6">
      <div className="text-center max-w-md">
        <p className="text-[11px] font-mono tracking-[0.28em] uppercase text-[#06B6D4] mb-4">404</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#F8FAFC] mb-4 tracking-tight">
          Page not found
        </h1>
        <p className="text-[#94A3B8] mb-8 leading-relaxed">
          The URL may be outdated or incorrect. Use the links below to return to the portfolio or contact page.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn-primary px-6 py-3">
            Go to homepage
          </Link>
          <Link href="/#contact" className="btn-secondary px-6 py-3">
            Contact
          </Link>
        </div>
      </div>
    </main>
  )
}
