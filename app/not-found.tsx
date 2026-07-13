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
    <main className="min-h-[80vh] flex items-center justify-center section-shell">
      <div className="text-center max-w-md">
        <p className="meta-label mb-4">404</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#F8FAFC] mb-4 tracking-tight">
          Page not found
        </h1>
        <p className="text-[#C5D0DE] mb-8 leading-relaxed">
          The URL may be outdated or incorrect. Use the links below to return to the portfolio or contact page.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-stretch sm:items-center gap-3 w-full max-w-xs sm:max-w-none mx-auto">
          <Link href="/" className="btn-primary btn-responsive px-6 py-3">
            Go to homepage
          </Link>
          <Link href="/#contact" className="btn-secondary btn-responsive px-6 py-3">
            Contact
          </Link>
        </div>
      </div>
    </main>
  )
}
