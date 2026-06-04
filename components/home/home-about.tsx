"use client"

import { motion } from "framer-motion"
import { Cloud, Code2, Database, Layers, Zap } from "lucide-react"
import { SectionHeading } from "@/components/ui/section-heading"
import { PremiumCard } from "@/components/ui/premium-card"
import { usePublicProfile } from "@/components/providers/site-content-provider"
import { engineeringMetrics } from "@/lib/site"
import { copy } from "@/lib/copy"
import { fadeUp, staggerContainer } from "@/lib/motion"

const pillars = [
  { icon: Layers, title: "End-to-end delivery", desc: "From API design to deployment — one owner, fewer handoffs." },
  { icon: Code2, title: "Backend & APIs", desc: "REST, queues, and integrations your mobile and web clients consume reliably." },
  { icon: Cloud, title: "AWS & DevOps", desc: "Serverless, containers, CI/CD — environments clients can audit." },
  { icon: Database, title: "Data layer", desc: "PostgreSQL, MongoDB, Redis — schemas and queries tuned for real traffic." },
  { icon: Zap, title: "Web3 when you need it", desc: "Indexers, wallets, contracts — production experience on Verana & UniLabs." },
]

export function HomeAbout() {
  const profile = usePublicProfile()

  return (
    <section id="about" className="section-pad border-t border-white/[0.06]">
      <div className="section-shell">
        <SectionHeading
          label={copy.sections.about.label}
          title={copy.sections.about.title}
          description={copy.sections.about.description}
        />

        <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-start mb-20">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <PremiumCard hover={false} spotlight>
              <p className="text-[#94A3B8] leading-relaxed mb-5 text-base">
                I&apos;m <span className="text-[#F8FAFC] font-semibold">{profile.name}</span>, a{" "}
                {profile.title.toLowerCase()} in {profile.location}. {profile.description}
              </p>
              <p className="text-xs font-mono text-[#06B6D4] border-l-2 border-[#3B82F6]/50 pl-4">
                {profile.education}
              </p>
            </PremiumCard>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-3"
          >
            {engineeringMetrics.map((m) => (
              <motion.div key={m.label} variants={fadeUp}>
                <PremiumCard className="text-center py-7 !p-5" spotlight>
                  <p className="text-2xl font-bold text-[#F8FAFC] tabular-nums">{m.value}</p>
                  <p className="text-[11px] text-[#64748B] mt-2 leading-tight">{m.label}</p>
                </PremiumCard>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {pillars.map((p) => (
            <motion.div key={p.title} variants={fadeUp}>
              <PremiumCard className="h-full" spotlight>
                <p.icon className="h-5 w-5 text-[#3B82F6] mb-5" strokeWidth={1.75} />
                <h3 className="text-base font-bold text-[#F8FAFC] mb-2">{p.title}</h3>
                <p className="text-sm text-[#94A3B8] leading-relaxed">{p.desc}</p>
              </PremiumCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
