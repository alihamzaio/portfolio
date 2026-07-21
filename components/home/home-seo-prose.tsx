import { ContentSection } from "@/components/ui/content-section"
import { copy } from "@/lib/copy"

/**
 * Single server-rendered article: more text, less client HTML overhead.
 * Replaces multiple client section wrappers for a better text-to-code ratio.
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

      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">{copy.sections.stackNarrative.title}</h2>
      <p className="text-neutral-400 mb-8 max-w-3xl leading-relaxed">{copy.sections.stackNarrative.description}</p>
      <div className="max-w-3xl space-y-4 text-neutral-400 leading-relaxed mb-12">
        {copy.sections.stackNarrative.paragraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 48)}>{paragraph}</p>
        ))}
      </div>

      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">{copy.sections.faq.title}</h2>
      <p className="text-neutral-400 mb-8 max-w-3xl leading-relaxed">{copy.sections.faq.description}</p>
      <div className="max-w-3xl space-y-6 mb-12">
        {copy.sections.faq.items.map((item) => (
          <div key={item.q}>
            <h3 className="text-base font-semibold text-white mb-2">{item.q}</h3>
            <p className="text-neutral-400 leading-relaxed">{item.a}</p>
          </div>
        ))}
      </div>

      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Hiring a Full Stack Developer in Lahore</h2>
      <div className="max-w-3xl space-y-4 text-neutral-400 leading-relaxed">
        {copy.seoExtra.map((paragraph) => (
          <p key={paragraph.slice(0, 48)}>{paragraph}</p>
        ))}
      </div>
    </ContentSection>
  )
}
