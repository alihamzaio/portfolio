"use client"

import { SmartLink } from "@/components/ui/smart-link"
import { copy } from "@/lib/copy"

export function HomeClientOffer() {
  return (
    <section id="offer" aria-labelledby="offer-heading" className="section-pad bg-[var(--bg-primary)]">
      <div className="site-grid">
        <header className="section-header grid lg:grid-cols-12 gap-[var(--space-4)]" data-animate>
          <div className="lg:col-span-5">
            <p className="section-label">{copy.sections.offer.label}</p>
            <h2 id="offer-heading" className="section-title" data-reveal-title>
              {copy.sections.offer.title}
            </h2>
          </div>
          <p className="lg:col-span-7 lg:pt-[var(--space-4)] type-lead max-w-2xl">{copy.sections.offer.description}</p>
        </header>

        <div className="border-t border-[var(--border-subtle)]">
          {copy.services.map((service, i) => (
            <article
              key={service.title}
              data-animate
              className="grid gap-[var(--space-3)] sm:grid-cols-[5rem_minmax(0,1fr)] lg:grid-cols-[6rem_minmax(0,1.1fr)_minmax(0,1fr)] items-start py-[var(--space-5)] border-b border-[var(--border-subtle)]"
            >
              <span className="editorial-step-num" aria-hidden>
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="type-display-sm sm:col-span-1 lg:col-span-1">{service.title}</h3>
              <p className="type-body-sm sm:col-span-2 lg:col-span-1 lg:col-start-3 lg:row-start-1">{service.desc}</p>
            </article>
          ))}
        </div>

        <p data-animate className="mt-[var(--space-5)] type-caption">
          Fixed-scope milestones or ongoing contract work.{" "}
          <SmartLink href="/#contact" className="text-[var(--accent-primary)] hover:underline underline-offset-4">
            Send your requirements
          </SmartLink>
          .
        </p>
      </div>
    </section>
  )
}
