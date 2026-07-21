import { PremiumSection } from "@/components/premium"
import { SectionHeading } from "@/components/ui/section-heading"
import { copy } from "@/lib/copy"

/** Static approach copy increases crawlable text and text-to-code ratio. */
export function HomeApproach() {
  return (
    <PremiumSection id="approach" variant="muted">
      <SectionHeading
        sectionId="approach"
        label={copy.sections.approach.label}
        title={copy.sections.approach.title}
        description={copy.sections.approach.description}
      />
      <div className="max-w-3xl space-y-4">
        {copy.sections.approach.paragraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 48)} className="text-neutral-400 leading-relaxed">
            {paragraph}
          </p>
        ))}
      </div>
    </PremiumSection>
  )
}
