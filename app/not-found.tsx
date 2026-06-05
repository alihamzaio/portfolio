import Link from "next/link"
import { buildPageMetadata } from "@/lib/seo"

export const metadata = buildPageMetadata({
  title: "Page not found",
  description: "This page doesn't exist. Head back to Ali Hamza's portfolio.",
  path: "/404",
  noIndex: true,
})

export default function NotFound() {
  return (
    <main className="min-h-[80vh] flex items-center justify-center section-shell px-6">
      <div className="text-center max-w-md">
        <p className="text-[11px] font-mono tracking-[0.28em] uppercase text-[#06B6D4] mb-4">404</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#F8FAFC] mb-4 tracking-tight">
          Wrong turn somewhere.
        </h1>
        <p className="text-[#94A3B8] mb-8 leading-relaxed">
          The page you wanted isn&apos;t here — maybe an old link, maybe a typo. Either way, the homepage still works.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn-primary px-6 py-3">
            Back home
          </Link>
          <Link href="/#contact" className="btn-secondary px-6 py-3">
            Say hi
          </Link>
        </div>
      </div>
    </main>
  )
}
