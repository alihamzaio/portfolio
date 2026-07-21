import { PremiumSection } from "@/components/premium"
import { SectionHeading } from "@/components/ui/section-heading"
import { copy } from "@/lib/copy"

export function HomeStackNarrative() {
  return (
    <PremiumSection id="stack-detail" variant="muted">
      <SectionHeading
        sectionId="stack-detail"
        label={copy.sections.stackNarrative.label}
        title={copy.sections.stackNarrative.title}
        description={copy.sections.stackNarrative.description}
      />
      <div className="max-w-3xl space-y-4">
        {copy.sections.stackNarrative.paragraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 40)} className="text-neutral-400 leading-relaxed">
            {paragraph}
          </p>
        ))}
      </div>
    </PremiumSection>
  )
}
