import { copy } from "@/lib/copy"

export function HomeSeoProse() {
  return (
    <section id="details" aria-labelledby="details-heading" className="section-pad bg-[var(--bg-secondary)]">
      <div className="site-grid">
        <header className="section-header grid lg:grid-cols-12 gap-[var(--space-4)]" data-animate>
          <div className="lg:col-span-5">
            <p className="section-label">{copy.sections.approach.label}</p>
            <h2 id="details-heading" className="section-title">
              {copy.sections.approach.title}
            </h2>
          </div>
          <p className="lg:col-span-7 lg:pt-[var(--space-4)] type-body max-w-2xl">{copy.sections.approach.description}</p>
        </header>

        <div className="grid lg:grid-cols-2 gap-[var(--space-4)] mb-[var(--space-7)]">
          {copy.sections.approach.paragraphs.map((paragraph, i) => (
            <article key={paragraph.slice(0, 48)} data-animate className="bg-[var(--bg-primary)] p-[var(--space-5)] border border-[var(--border-subtle)]">
              <span className="type-label !text-[var(--accent-primary)] mb-[var(--space-3)] block">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className={i === 0 ? "type-lead" : "type-body-sm"}>{paragraph}</p>
            </article>
          ))}
        </div>

        <div className="grid lg:grid-cols-12 gap-[var(--space-5)] border-t border-[var(--border-subtle)] pt-[var(--space-7)] mb-[var(--space-7)]">
          <header className="lg:col-span-4" data-animate>
            <p className="section-label">{copy.sections.stackNarrative.label}</p>
            <h3 className="type-display-sm mt-[var(--space-2)]">{copy.sections.stackNarrative.title}</h3>
            <p className="type-body-sm mt-[var(--space-3)]">{copy.sections.stackNarrative.description}</p>
          </header>
          <div className="lg:col-span-8 space-y-[var(--space-4)]">
            {copy.sections.stackNarrative.paragraphs.map((paragraph, i) => (
              <p key={paragraph.slice(0, 48)} data-animate className={i === 0 ? "type-lead" : "type-body-sm"}>
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        <div className="border-t border-[var(--border-subtle)] pt-[var(--space-7)] mb-[var(--space-7)]">
          <header className="section-header" data-animate>
            <p className="section-label">{copy.sections.faq.label}</p>
            <h3 className="type-display-sm">{copy.sections.faq.title}</h3>
            <p className="type-body-sm max-w-2xl">{copy.sections.faq.description}</p>
          </header>
          <div className="divide-y divide-[var(--border-subtle)] border-t border-[var(--border-subtle)]">
            {copy.sections.faq.items.map((item, i) => (
              <details key={item.q} data-animate className="group py-[var(--space-4)]">
                <summary className="flex cursor-pointer list-none items-start gap-[var(--space-3)]">
                  <span className="type-label shrink-0 pt-1">{String(i + 1).padStart(2, "0")}</span>
                  <span className="type-heading !text-[var(--text-primary)] group-open:!text-[var(--accent-primary)] transition-colors">
                    {item.q}
                  </span>
                </summary>
                <p className="type-body-sm mt-[var(--space-3)] ml-[calc(2rem+var(--space-3))] max-w-2xl">{item.a}</p>
              </details>
            ))}
          </div>
        </div>

        <div className="border-t border-[var(--border-subtle)] pt-[var(--space-7)]">
          <h3 className="type-display-sm mb-[var(--space-4)]" data-animate>
            Hiring a Full Stack Developer in Lahore
          </h3>
          <div className="space-y-[var(--space-4)] max-w-3xl">
            {copy.seoExtra.map((paragraph, i) => (
              <p key={paragraph.slice(0, 48)} data-animate className={i === 0 ? "type-lead" : "type-body-sm"}>
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
