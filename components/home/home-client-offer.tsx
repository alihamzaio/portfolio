"use client"

import { motion } from "framer-motion"
import { Code2, Cloud, Blocks, Gauge } from "lucide-react"
import { SectionHeading } from "@/components/ui/section-heading"
import { SectionWrapper } from "@/components/ui/section-wrapper"
import { PremiumCard } from "@/components/ui/premium-card"
import { Reveal } from "@/components/ui/reveal"
import { SmartLink } from "@/components/ui/smart-link"
import { copy } from "@/lib/copy"
import { fadeUp, staggerContainer } from "@/lib/motion"

const icons = [Code2, Cloud, Blocks, Gauge]

export function HomeClientOffer() {
  return (
    <SectionWrapper id="offer">
        <SectionHeading
          label={copy.sections.offer.label}
          title={copy.sections.offer.title}
          description={copy.sections.offer.description}
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {copy.services.map((service, i) => {
            const Icon = icons[i] ?? Code2
            return (
              <motion.div key={service.title} variants={fadeUp}>
                <PremiumCard className="h-full" spotlight>
                  <Icon className="h-5 w-5 text-[#3B82F6] mb-5" strokeWidth={1.75} />
                  <h3 className="text-base font-bold text-[#F8FAFC] mb-2">{service.title}</h3>
                  <p className="text-sm text-[#94A3B8] leading-relaxed">{service.desc}</p>
                </PremiumCard>
              </motion.div>
            )
          })}
        </motion.div>

        <Reveal className="mt-12 text-center">
          <p className="text-sm text-[#64748B] max-w-lg mx-auto">
            Fixed-scope milestones or monthly retainer — whatever fits your roadmap.{" "}
            <SmartLink href="/#contact" className="text-[#3B82F6] hover:underline">
              Tell me what you need
            </SmartLink>
            .
          </p>
        </Reveal>
    </SectionWrapper>
  )
}
