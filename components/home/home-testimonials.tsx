"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { Quote } from "lucide-react"
import { SectionHeading } from "@/components/ui/section-heading"
import { SectionWrapper } from "@/components/ui/section-wrapper"
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
    <SectionWrapper id="testimonials">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.06),transparent_65%)] pointer-events-none" />
      <SectionHeading
        sectionId="testimonials"
        label={copy.sections.testimonials.label}
        title={copy.sections.testimonials.title}
        description={copy.sections.testimonials.description}
        align="center"
        className="mx-auto relative"
      />

      <div data-animate className="relative max-w-3xl mx-auto min-h-[240px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            {...motionProps}
            transition={{ duration: reduceMotion ? 0 : 0.55, ease: easeCinematic }}
            className="glass-float rounded-3xl p-10 sm:p-14 text-center gradient-border relative"
          >
            <Quote className="h-7 w-7 text-[#3B82F6]/40 mx-auto mb-6" aria-hidden />
            <blockquote>
              <p className="text-lg sm:text-xl text-[#F8FAFC]/95 leading-relaxed mb-8 font-medium">
                &ldquo;{current.quote}&rdquo;
              </p>
              <footer>
                <p className="font-semibold text-[#F8FAFC]">{current.author}</p>
                <p className="text-sm text-[#64748B] mt-1">
                  {current.role} · {current.company}
                </p>
              </footer>
            </blockquote>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-center gap-2 mt-10 relative" role="tablist" aria-label="Testimonials">
        {testimonials.map((_, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={i === index}
            onClick={() => setIndex(i)}
            className={`h-1 rounded-full transition-[width,background-color] duration-400 ${
              i === index
                ? "w-10 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4]"
                : "w-2 bg-white/15 hover:bg-white/25"
            }`}
            aria-label={`Testimonial ${i + 1}`}
          />
        ))}
      </div>
    </SectionWrapper>
  )
}
