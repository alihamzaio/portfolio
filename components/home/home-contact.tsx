"use client"

import type { FormEvent } from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Github, Linkedin, Mail, MapPin, Phone, Send } from "lucide-react"
import { usePublicProfile } from "@/components/providers/site-content-provider"
import { SectionHeading } from "@/components/ui/section-heading"
import { SectionWrapper } from "@/components/ui/section-wrapper"
import { PremiumCard } from "@/components/ui/premium-card"
import { MagneticButton } from "@/components/ui/magnetic-button"
import { fadeUp } from "@/lib/motion"
import { copy } from "@/lib/copy"

const contactRows = [
  { key: "email", icon: Mail, label: "Email", getValue: (p: ReturnType<typeof usePublicProfile>) => p.email, href: (p: ReturnType<typeof usePublicProfile>) => `mailto:${p.email}` },
  { key: "phone", icon: Phone, label: "Phone", getValue: (p: ReturnType<typeof usePublicProfile>) => p.phone },
  { key: "location", icon: MapPin, label: "Location", getValue: (p: ReturnType<typeof usePublicProfile>) => p.location },
  { key: "linkedin", icon: Linkedin, label: "LinkedIn", getValue: () => "LinkedIn", href: (p: ReturnType<typeof usePublicProfile>) => p.social.linkedin, external: true },
  { key: "github", icon: Github, label: "GitHub", getValue: (p: ReturnType<typeof usePublicProfile>) => `GitHub · ${p.githubUsername}`, href: (p: ReturnType<typeof usePublicProfile>) => p.social.github, external: true },
] as const

export function HomeContact() {
  const profile = usePublicProfile()
  const [form, setForm] = useState({ name: "", email: "", message: "" })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const subject = encodeURIComponent(`Inquiry from ${form.name}`)
    const body = encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`)
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`
  }

  return (
    <SectionWrapper id="contact">
        <SectionHeading
          label={copy.sections.contact.label}
          title={copy.sections.contact.title}
          description={copy.sections.contact.description}
          align="center"
          className="mx-auto"
        />

        <div className="grid lg:grid-cols-5 gap-5 max-w-4xl mx-auto lg:items-stretch">
          {/* Left — contact details */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="lg:col-span-2 flex flex-col gap-3 h-full"
          >
            <PremiumCard className="!p-4 shrink-0" hover={false}>
              <div className="flex items-center gap-2.5">
                <span
                  className={`h-2 w-2 rounded-full shrink-0 ${profile.available ? "bg-[#22C55E] shadow-[0_0_8px_rgba(34,197,94,0.5)]" : "bg-[#64748B]"}`}
                />
                <span className="text-sm text-[#F8FAFC]">
                  {profile.available ? "Available for opportunities" : "Not available"}
                </span>
              </div>
            </PremiumCard>

            {contactRows.map((row) => {
              const Icon = row.icon
              const value = row.getValue(profile)
              const href = "href" in row && row.href ? row.href(profile) : undefined
              const content = (
                <>
                  <Icon className="h-4 w-4 text-[#3B82F6] shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="text-xs text-[#64748B]">{row.label}</p>
                    <p className="text-sm text-[#F8FAFC] truncate group-hover:text-[#3B82F6] transition-colors">
                      {value}
                    </p>
                  </div>
                </>
              )

              return (
                <PremiumCard key={row.key} className="!p-4 shrink-0" hover={false}>
                  {href ? (
                    <a
                      href={href}
                      target={"external" in row && row.external ? "_blank" : undefined}
                      rel={"external" in row && row.external ? "noopener noreferrer" : undefined}
                      className="flex gap-3 group"
                      data-cursor
                    >
                      {content}
                    </a>
                  ) : (
                    <div className="flex gap-3">{content}</div>
                  )}
                </PremiumCard>
              )
            })}
          </motion.div>

          {/* Right — form fills column height, button pinned to bottom */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="lg:col-span-3 flex flex-col h-full min-h-0"
          >
            <PremiumCard hover={false} className="flex-1 flex flex-col !p-5 h-full min-h-[320px] lg:min-h-0">
              <form onSubmit={handleSubmit} className="flex flex-col flex-1 gap-4 h-full">
                <div className="grid sm:grid-cols-2 gap-4 shrink-0">
                  <div>
                    <label htmlFor="name" className="text-xs text-[#64748B] mb-1.5 block">
                      Name
                    </label>
                    <input
                      id="name"
                      required
                      className="input-premium"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="text-xs text-[#64748B] mb-1.5 block">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      className="input-premium"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="you@company.com"
                    />
                  </div>
                </div>

                <div className="flex flex-col flex-1 min-h-[120px]">
                  <label htmlFor="message" className="text-xs text-[#64748B] mb-1.5 block shrink-0">
                    Message
                  </label>
                  <textarea
                    id="message"
                    required
                    className="input-premium resize-none flex-1 min-h-[120px] w-full"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="What are you building? Timeline, stack, budget…"
                  />
                </div>

                <div className="shrink-0 pt-0">
                  <MagneticButton type="submit">
                    Send message <Send className="h-4 w-4" />
                  </MagneticButton>
                </div>
              </form>
            </PremiumCard>
          </motion.div>
        </div>
    </SectionWrapper>
  )
}
