import { ContentSection } from "@/components/ui/content-section"
import { copy } from "@/lib/copy"

/**
 * One H2 for the article block; subsections use H3 to keep heading count sane.
 */
export function HomeSeoProse() {
  return (
    <ContentSection id="details" variant="muted">
      <h2 id="details-heading" className="text-2xl sm:text-3xl font-bold text-white mb-3">
        {copy.sections.approach.title}
      </h2>
      <p className="text-neutral-400 mb-8 max-w-3xl leading-relaxed">{copy.sections.approach.description}</p>

      <div className="max-w-3xl space-y-4 text-neutral-400 leading-relaxed mb-12">
        {copy.sections.approach.paragraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 48)}>{paragraph}</p>
        ))}
      </div>

      <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">{copy.sections.stackNarrative.title}</h3>
      <p className="text-neutral-400 mb-8 max-w-3xl leading-relaxed">{copy.sections.stackNarrative.description}</p>
      <div className="max-w-3xl space-y-4 text-neutral-400 leading-relaxed mb-12">
        {copy.sections.stackNarrative.paragraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 48)}>{paragraph}</p>
        ))}
      </div>

      <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">{copy.sections.faq.title}</h3>
      <p className="text-neutral-400 mb-8 max-w-3xl leading-relaxed">{copy.sections.faq.description}</p>
      <div className="max-w-3xl space-y-6 mb-12">
        {copy.sections.faq.items.map((item) => (
          <div key={item.q}>
            <p className="text-base font-semibold text-white mb-2">{item.q}</p>
            <p className="text-neutral-400 leading-relaxed">{item.a}</p>
          </div>
        ))}
      </div>

      <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">Hiring a Full Stack Developer in Lahore</h3>
      <div className="max-w-3xl space-y-4 text-neutral-400 leading-relaxed">
        {copy.seoExtra.map((paragraph) => (
          <p key={paragraph.slice(0, 48)}>{paragraph}</p>
        ))}
      </div>
    </ContentSection>
  )
}
