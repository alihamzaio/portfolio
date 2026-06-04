"use client"

import { motion } from "framer-motion"
import { SectionHeading } from "@/components/ui/section-heading"
import { PremiumCard } from "@/components/ui/premium-card"
import { TiltCard } from "@/components/ui/tilt-card"
import { services } from "@/lib/services"

export function HomeServices() {
  return (
    <section id="services" className="section-pad relative">
      <div className="section-shell">
        <SectionHeading
          label="Services"
          title="What I deliver"
          description="End-to-end product engineering — from strategy and design to deployment and scale."
          align="center"
          className="mx-auto"
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((service, i) => (
            <TiltCard key={service.title}>
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <PremiumCard className="h-full group">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#3B82F6]/20 to-[#8B5CF6]/20 flex items-center justify-center mb-5 group-hover:glow-blue transition-shadow">
                    <service.icon className="h-6 w-6 text-[#60A5FA]" />
                  </div>
                  <h3 className="font-display font-semibold text-white text-lg mb-2">{service.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{service.description}</p>
                </PremiumCard>
              </motion.div>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  )
}
