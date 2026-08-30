"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { testimonials } from "@/lib/testimonials"
import { copy } from "@/lib/copy"
import { easeCinematic } from "@/lib/motion"

export function HomeTestimonials() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (reduceMotion || paused) return
    const id = setInterval(() => setIndex((i) => (i + 1) % testimonials.length), 7000)
    return () => clearInterval(id)
  }, [reduceMotion, paused])

  const current = testimonials[index]

  const motionProps = reduceMotion
    ? { initial: false, animate: { opacity: 1, y: 0 }, exit: { opacity: 1, y: 0 } }
    : {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
      }

  return (
    <section id="testimonials" aria-labelledby="testimonials-heading" className="section-pad bg-[var(--bg-secondary)]">
      <div className="site-grid">
        <div className="grid lg:grid-cols-12 gap-[var(--space-6)] items-start">
          <header className="lg:col-span-4" data-animate>
            <p className="section-label">{copy.sections.testimonials.label}</p>
            <h2 id="testimonials-heading" className="section-title mt-[var(--space-2)]" data-reveal-title>
              {copy.sections.testimonials.title}
            </h2>
            <p className="type-body-sm mt-[var(--space-3)]">{copy.sections.testimonials.description}</p>
          </header>

          <div
            className="lg:col-span-8 relative min-h-[200px]"
            data-animate
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <AnimatePresence mode="wait">
              <motion.div key={index} {...motionProps} transition={{ duration: reduceMotion ? 0 : 0.45, ease: easeCinematic }}>
                <blockquote>
                  <p className="type-display-sm !text-2xl sm:!text-3xl !leading-[1.3] mb-[var(--space-5)]">
                    &ldquo;{current.quote}&rdquo;
                  </p>
                  <footer>
                    <p className="type-heading !text-[var(--text-primary)] !font-semibold">{current.author}</p>
                    <p className="type-caption mt-[var(--space-1)]">
                      {current.role} · {current.company}
                    </p>
                  </footer>
                </blockquote>
              </motion.div>
            </AnimatePresence>

            <div className="flex gap-[var(--space-2)] mt-[var(--space-4)]" role="tablist" aria-label="Testimonials">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  onClick={() => setIndex(i)}
                  className="inline-flex items-center justify-center min-h-11 min-w-11 p-2"
                  aria-label={`Testimonial ${i + 1}`}
                >
                  <span
                    className={`block h-px rounded-full transition-all duration-300 ${
                      i === index ? "w-8 bg-[var(--accent-primary)]" : "w-3 bg-[var(--border-subtle)] hover:bg-[var(--text-muted)]"
                    }`}
                    aria-hidden
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
