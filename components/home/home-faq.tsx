import { PremiumSection } from "@/components/premium"
import { SectionHeading } from "@/components/ui/section-heading"
import { copy } from "@/lib/copy"

export function HomeFaq() {
  return (
    <PremiumSection id="faq" variant="elevated">
      <SectionHeading
        sectionId="faq"
        label={copy.sections.faq.label}
        title={copy.sections.faq.title}
        description={copy.sections.faq.description}
      />
      <div className="max-w-3xl space-y-6">
        {copy.sections.faq.items.map((item) => (
          <div key={item.q}>
            <h3 className="text-base font-semibold text-white mb-2">{item.q}</h3>
            <p className="text-neutral-400 leading-relaxed">{item.a}</p>
          </div>
        ))}
      </div>
    </PremiumSection>
  )
}
