import Link from "next/link"
import { PremiumPage, PremiumReveal } from "@/components/premium"
import { SectionHeading } from "@/components/ui/section-heading"
import { AmberGlassCta } from "@/components/ui/amber-glass-cta"
import { HireCtaBlock } from "@/components/home/hire-cta-block"
import { PageBreadcrumbJsonLd } from "@/components/seo/page-breadcrumb-json-ld"
import { buildPageMetadata } from "@/lib/seo"

export const metadata = buildPageMetadata({
  title: "Free viral packaging checklist",
  description:
    "Free checklist from Ali Hamza / Click Case Files: title, thumbnail, first 3 seconds, and retention checks before you publish a Short.",
  path: "/free/viral-packaging-checklist",
})

const SECTIONS: { title: string; items: string[] }[] = [
  {
    title: "Before you film",
    items: [
      "One clear promise in the title (what the viewer gets in under 8 words)",
      "Thumbnail readable at phone size: face or object + 3 words max",
      "First spoken line matches on-screen text",
      "You can name the outlier metric without inventing numbers",
    ],
  },
  {
    title: "First 3 seconds",
    items: [
      "Open on the case stamp or the surprising result, never hello/welcome",
      "Cut dead air; jump cut into the claim",
      "Show the payoff frame early so scrollers stop",
      "Audio is loud and clear on mute-first devices (captions on)",
    ],
  },
  {
    title: "Retention middle",
    items: [
      "One mechanism only (packaging, format machine, or thumbnail change)",
      "Contrast: what people assume vs what actually moved the needle",
      "One concrete example, not a lecture",
      "No fake guarantees or overnight wealth claims",
    ],
  },
  {
    title: "Close and distribute",
    items: [
      "Sign off clean (Case closed. or your brand line)",
      "Same cut goes to YouTube Shorts + at least one other surface",
      "Description has channel + portfolio links, not product spam",
      "If this case is about ops/tools, link the free checklist again next upload",
    ],
  },
]

export default function ViralPackagingChecklistPage() {
  return (
    <>
      <PageBreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Free checklist", path: "/free/viral-packaging-checklist" },
        ]}
      />
      <PremiumPage>
        <SectionHeading
          headingLevel={1}
          label="Free resource"
          title="Viral packaging checklist"
          description="A one-page pass I use when Click Case Files opens a Short. Steal it, print it, or keep it next to your next upload."
          align="center"
          className="mx-auto"
        />

        <PremiumReveal>
          <div className="mx-auto max-w-2xl space-y-10">
            {SECTIONS.map((section) => (
              <section key={section.title}>
                <h2 className="text-sm uppercase tracking-wider text-neutral-500 mb-3">
                  {section.title}
                </h2>
                <ul className="space-y-2 text-sm text-neutral-300">
                  {section.items.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="text-[var(--accent-primary)]" aria-hidden>
                        ✓
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}

            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] px-5 py-6 sm:px-6 space-y-4">
              <h2 className="text-lg font-semibold text-white tracking-tight">
                Want the build side, not just the case file?
              </h2>
              <p className="text-sm text-neutral-400 leading-relaxed">
                I ship production Next.js, MERN, and AWS work. If you need a private multi-company
                calendar hub, see SyncForge. If you need a clean freelance kickoff pack, see Kickoff
                Forge.
              </p>
              <div className="flex flex-wrap gap-3">
                <AmberGlassCta href="/contact?topic=hire">Hire me</AmberGlassCta>
                <Link href="/products/syncforge-calendar" className="btn-secondary btn-responsive inline-flex">
                  SyncForge
                </Link>
                <Link href="/products/kickoff-forge" className="btn-secondary btn-responsive inline-flex">
                  Kickoff Forge
                </Link>
              </div>
            </div>

            <HireCtaBlock
              variant="compact"
              title="Got a product that needs shipping?"
              description="Use the contact form with a short brief. I reply within one business day."
            />
          </div>
        </PremiumReveal>
      </PremiumPage>
    </>
  )
}
