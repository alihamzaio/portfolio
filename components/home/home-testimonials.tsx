"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Quote } from "lucide-react"
import { SectionHeading } from "@/components/ui/section-heading"
import { testimonials } from "@/lib/testimonials"

export function HomeTestimonials() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % testimonials.length), 5000)
    return () => clearInterval(id)
  }, [])

  const current = testimonials[index]

  return (
    <section id="testimonials" className="section-pad relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.08),transparent_70%)] pointer-events-none" />
      <div className="section-shell relative max-w-4xl mx-auto">
        <SectionHeading
          label="Testimonials"
          title="Trusted by teams"
          description="What clients say about working together."
          align="center"
          className="mx-auto"
        />

        <div className="relative min-h-[220px] sm:min-h-[200px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="glass-card rounded-3xl p-8 sm:p-12 text-center gradient-border"
            >
              <Quote className="h-8 w-8 text-[#3B82F6]/50 mx-auto mb-6" />
              <p className="text-lg sm:text-xl text-white/90 leading-relaxed mb-8">&ldquo;{current.quote}&rdquo;</p>
              <div>
                <p className="font-display font-semibold text-white">{current.author}</p>
                <p className="text-sm text-muted-foreground">
                  {current.role} · {current.company}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-8 bg-[#3B82F6]" : "w-1.5 bg-white/20"
              }`}
              aria-label={`Testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
