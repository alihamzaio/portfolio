import Link from "next/link"
import { Download } from "lucide-react"
import { PremiumPage, PremiumReveal } from "@/components/premium"
import { SectionHeading } from "@/components/ui/section-heading"
import { PremiumCard } from "@/components/ui/premium-card"
import { HireCtaBlock } from "@/components/home/hire-cta-block"
import { LEAD_MAGNETS } from "@/lib/lead-magnet"
import { buildPageMetadata } from "@/lib/seo"

export const metadata = buildPageMetadata({
  title: "Free resources",
  description:
    "Free checklists from Ali Hamza for shipping Next.js and Vercel production sites — then hire help when you need it.",
  path: "/resources",
})

export default function ResourcesPage() {
  return (
    <PremiumPage>
      <SectionHeading
        headingLevel={1}
        label="Resources"
        title="Free tools for shipping production work"
        description="Practical checklists you can download and use today. No email wall — if you want help implementing them, hire me."
        align="center"
        className="mx-auto"
      />

      <div className="mx-auto max-w-3xl space-y-6">
        {LEAD_MAGNETS.map((magnet) => (
          <PremiumReveal key={magnet.slug}>
            <PremiumCard className="p-6 sm:p-8">
              <h2 className="text-xl font-semibold text-white tracking-tight">{magnet.title}</h2>
              <p className="mt-3 text-sm text-neutral-400 leading-relaxed">{magnet.description}</p>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {magnet.bullets.map((b) => (
                  <li key={b} className="text-sm text-neutral-500 flex gap-2">
                    <span className="text-[var(--accent-primary)]" aria-hidden>
                      ✓
                    </span>
                    {b}
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={`/resources/${magnet.slug}`}
                  className="btn-primary btn-responsive inline-flex items-center"
                >
                  Open checklist
                </Link>
                <a
                  href={magnet.downloadPath}
                  download={magnet.fileName}
                  className="btn-secondary btn-responsive inline-flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download .md
                </a>
              </div>
            </PremiumCard>
          </PremiumReveal>
        ))}

        <PremiumReveal>
          <HireCtaBlock
            title="Ready to ship with a dedicated engineer?"
            description="Use the checklist solo, or bring me in for Next.js, MERN, and AWS delivery — remote from Lahore, worldwide clients."
          />
        </PremiumReveal>

        <p className="text-center text-sm text-neutral-500 pb-4">
          Prefer a direct note?{" "}
          <Link href="/contact" className="text-white underline underline-offset-2 hover:text-amber-200">
            Contact Ali
          </Link>
        </p>
      </div>
    </PremiumPage>
  )
}
