"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { Quote } from "lucide-react"
import { PremiumPanel, PremiumSection } from "@/components/premium"
import { SectionHeading } from "@/components/ui/section-heading"
import { testimonials } from "@/lib/testimonials"
import { copy } from "@/lib/copy"
import { easeCinematic } from "@/lib/motion"

export function HomeTestimonials() {
  const [index, setIndex] = useState(0)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % testimonials.length), 6000)
    return () => clearInterval(id)
  }, [])

  const current = testimonials[index]

  const motionProps = reduceMotion
    ? { initial: false, animate: { opacity: 1, y: 0 }, exit: { opacity: 1, y: 0 } }
    : {
        initial: { opacity: 0, y: 24 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -16 },
      }

  return (
    <PremiumSection id="testimonials" variant="elevated">
      <SectionHeading
        sectionId="testimonials"
        label={copy.sections.testimonials.label}
        title={copy.sections.testimonials.title}
        description={copy.sections.testimonials.description}
        align="center"
        className="mx-auto"
      />

      <div data-animate className="relative max-w-3xl mx-auto min-h-[240px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            {...motionProps}
            transition={{ duration: reduceMotion ? 0 : 0.55, ease: easeCinematic }}
          >
            <PremiumPanel centered className="!p-10 sm:!p-14 gradient-border">
              <Quote className="h-7 w-7 text-cyan-400/40 mx-auto mb-6" aria-hidden />
              <blockquote>
                <p className="text-lg sm:text-xl text-white/95 leading-relaxed mb-8 font-medium">
                  &ldquo;{current.quote}&rdquo;
                </p>
                <footer>
                  <p className="font-semibold text-white">{current.author}</p>
                  <p className="text-sm text-neutral-500 mt-1">
                    {current.role} · {current.company}
                  </p>
                </footer>
              </blockquote>
            </PremiumPanel>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-center gap-2 mt-10" role="tablist" aria-label="Testimonials">
        {testimonials.map((_, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={i === index}
            onClick={() => setIndex(i)}
            className={`h-1 rounded-full transition-[width,background-color] duration-400 ${
              i === index
                ? "w-10 bg-gradient-to-r from-blue-500 to-cyan-400"
                : "w-2 bg-white/15 hover:bg-white/25"
            }`}
            aria-label={`Testimonial ${i + 1}`}
          />
        ))}
      </div>
    </PremiumSection>
  )
}
